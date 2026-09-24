import { describe, it, expect } from 'vitest';
import { QuizEngine } from '../../src/engine/quiz/quizEngine';
import { DistractorGenerator } from '../../src/engine/quiz/distractorGenerator';
import { curriculumRegistry } from '../../src/engine/curriculum/registry';
import { isPureMathExpression } from '../../src/components/math/MathRenderer';

describe('Live Browser Flows & Engine End-to-End Lifecycles', () => {
  it('verifies running server HTTP endpoints on port 3010', async () => {
    const baseUrl = 'http://localhost:3010';
    const endpoints = ['/', '/curriculum', '/debug/math-rendering'];

    for (const ep of endpoints) {
      const res = await fetch(`${baseUrl}${ep}`);
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text.length).toBeGreaterThan(500);
    }
  });

  it('verifies 5-question mixed quiz creation, exact distribution, and student progress lifecycle', async () => {
    QuizEngine.clearActiveSession();

    const progress5: Array<{ curr: number; total: number }> = [];
    const session5 = await QuizEngine.createQuizAsync(
      {
        courseId: 'COURSE-GEN0102',
        questionCount: 5,
        format: 'MIXED',
        difficulty: 'ADAPTIVE'
      },
      'browser-flow-user',
      (curr, total) => progress5.push({ curr, total })
    );

    expect(session5.questions.length).toBe(5);
    expect(progress5.length).toBe(5);
    expect(progress5[4]).toEqual({ curr: 5, total: 5 });

    // Verify Mixed format distribution (3 MCQ / 2 Written)
    const formats5 = session5.questions.map(q => q.format);
    expect(formats5).toEqual(['MULTIPLE_CHOICE', 'WRITTEN', 'MULTIPLE_CHOICE', 'WRITTEN', 'MULTIPLE_CHOICE']);

    // Answer Q0 (MCQ) correctly
    const opt0 = session5.questions[0].options!.find(o => o.isCorrect)!;
    session5.questions[0].selectedOptionId = opt0.id;
    // Answer Q1 (Written) correctly
    session5.questions[1].userAnswer = session5.questions[1].problem.solution.canonicalAnswerLatex;
    // Flag Q2
    session5.questions[2].isFlagged = true;
    session5.currentIndex = 2;
    session5.elapsedSeconds = 125;

    QuizEngine.saveActiveSession(session5);

    // Verify reload resume behavior
    const resumed = QuizEngine.loadActiveSession();
    expect(resumed).not.toBeNull();
    expect(resumed?.currentIndex).toBe(2);
    expect(resumed?.elapsedSeconds).toBe(125);
    expect(resumed?.questions[0].selectedOptionId).toBe(opt0.id);
    expect(resumed?.questions[1].userAnswer).toBe(session5.questions[1].problem.solution.canonicalAnswerLatex);
    expect(resumed?.questions[2].isFlagged).toBe(true);

    // Verify separate MCQ and Written grading
    const result = QuizEngine.gradeQuiz(session5);
    expect(result.mcqScore).toBeDefined();
    expect(result.writtenScore).toBeDefined();
    expect(result.mcqScore?.total).toBe(3);
    expect(result.writtenScore?.total).toBe(2);
  });

  it('verifies 20-question async generation on dynamic course (Physics 2)', async () => {
    const progress20: Array<{ curr: number; total: number }> = [];
    const session20 = await QuizEngine.createQuizAsync(
      {
        courseId: 'COURSE-GEN0110', // Physics 2 for Engineers
        questionCount: 20,
        format: 'MIXED',
        difficulty: 'ADAPTIVE'
      },
      'browser-flow-user',
      (curr, total) => progress20.push({ curr, total })
    );

    expect(session20.questions.length).toBe(20);
    expect(progress20.length).toBe(20);
    expect(progress20[19]).toEqual({ curr: 20, total: 20 });

    // Verify all 20 questions have unique problem IDs
    const pIds = new Set(session20.questions.map(q => q.problem.dna.problemId));
    expect(pIds.size).toBe(20);

    // Verify distractor integrity for all MCQ questions
    for (const q of session20.questions) {
      if (q.format === 'MULTIPLE_CHOICE') {
        expect(q.options?.length).toBe(4);
        const correct = q.options?.filter(o => o.isCorrect);
        expect(correct?.length).toBe(1);

        const canonical = q.problem.solution.canonicalAnswerLatex.replace(/[\s${}\\]/g, '').toLowerCase();
        for (const opt of q.options!.filter(o => !o.isCorrect)) {
          const text = opt.textLatex.replace(/[\s${}\\]/g, '').toLowerCase();
          expect(text).not.toBe(canonical);
        }
      }
    }
  });

  it('verifies pure math detection on algebraic user inputs', () => {
    const mathInputs = ['6x+5', '12x^2+3', '6', '3*x - 2', '2*sin(x) + cos(x)', '4/(x^2+1)'];
    for (const input of mathInputs) {
      expect(isPureMathExpression(input)).toBe(true);
    }

    const nonMathInputs = ['Please solve this question', 'Derivative of the following polynomial function'];
    for (const text of nonMathInputs) {
      expect(isPureMathExpression(text)).toBe(false);
    }
  });
});
