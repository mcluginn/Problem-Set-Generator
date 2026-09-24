import { describe, it, expect, beforeEach } from 'vitest';
import { QuizEngine } from '../../src/engine/quiz/quizEngine';
import { DistractorGenerator } from '../../src/engine/quiz/distractorGenerator';
import { MasteryEngine } from '../../src/engine/adaptive/mastery';
import { problemBank } from '../../src/engine/content/problemBank';
import { ContentGenerator } from '../../src/engine/content/generator';

describe('Quiz Mode Assessment & Isolation', () => {
  const courseId = 'COURSE-GEN0102';
  const topicId = 'CURR-GEN0102-U1-T04'; // Differentiation Methods

  beforeEach(() => {
    QuizEngine.clearActiveSession();
  });

  it('pre-generates and freezes N questions with distinct problem IDs and signatures', () => {
    const session = QuizEngine.createQuiz({
      courseId,
      topicId,
      questionCount: 5,
      format: 'MULTIPLE_CHOICE',
      difficulty: 'ADAPTIVE'
    });

    expect(session.questions.length).toBe(5);

    const ids = new Set(session.questions.map(q => q.problem.dna.problemId));
    expect(ids.size).toBe(5);

    const signatures = new Set(session.questions.map(q => q.problem.dna.structureSignature));
    expect(signatures.size).toBe(5);

    for (const q of session.questions) {
      expect(q.format).toBe('MULTIPLE_CHOICE');
      expect(q.options).toBeDefined();
      expect(q.options!.length).toBe(4);

      // Exactly one correct option
      const correctOpts = q.options!.filter(o => o.isCorrect);
      expect(correctOpts.length).toBe(1);

      // Labels must be A, B, C, D
      const labels = q.options!.map(o => o.label);
      expect(labels).toEqual(['A', 'B', 'C', 'D']);
    }
  });

  it('DistractorGenerator produces plausible distractors with targeted misconception codes', () => {
    const probRes = ContentGenerator.generateForSkill({
      courseId: courseId as any,
      skillId: 'SKILL-GEN0102-002', // Power Rule
      difficulty: 2
    });

    expect(probRes.success).toBe(true);
    const options = DistractorGenerator.generateOptions(probRes.problem!);

    expect(options.length).toBe(4);
    const correct = options.find(o => o.isCorrect);
    expect(correct).toBeDefined();
    expect(correct!.textLatex).toBe(probRes.problem!.solution.canonicalAnswerLatex);

    const distractors = options.filter(o => !o.isCorrect);
    expect(distractors.length).toBe(3);
    for (const d of distractors) {
      expect(d.textLatex).toBeTruthy();
      expect(d.targetedMisconceptionCode).toBeDefined();
      expect(d.pedagogicalExplanation).toBeDefined();
    }
  });

  it('generates rich algebraic distractors without scalar numbers for multi-term expressions', () => {
    const mockProblem: any = {
      dna: {
        problemId: 'PROB-MOCK-PARTIAL-001',
        primarySkillId: 'SKILL-GEN0102-005'
      },
      solution: {
        canonicalAnswerLatex: '2ye^{2xy} + 6x',
        canonicalAnswerRaw: '2ye^{2xy} + 6x'
      }
    };

    const options = DistractorGenerator.generateOptions(mockProblem);
    expect(options).toHaveLength(4);

    const correct = options.find(o => o.isCorrect);
    expect(correct).toBeDefined();
    expect(correct!.textLatex).toBe('2ye^{2xy} + 6x');

    const distractors = options.filter(o => !o.isCorrect);
    expect(distractors).toHaveLength(3);

    // Regression check: None of the distractors should be scalar numbers like 4, 5, -2
    for (const d of distractors) {
      expect(/^-?\d+$/.test(d.textLatex.trim())).toBe(false);
      // All distractors must be algebraic expressions
      expect(d.textLatex).toMatch(/[xy]/);
      expect(d.targetedMisconceptionCode).toBeTruthy();
    }
  });

  it('deterministically grades multiple choice responses and surfaces misconception diagnostics', () => {
    const session = QuizEngine.createQuiz({
      courseId,
      topicId,
      questionCount: 5,
      format: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM'
    });

    // Answer Q0 correctly
    const correctOpt0 = session.questions[0].options!.find(o => o.isCorrect)!;
    session.questions[0].selectedOptionId = correctOpt0.id;

    // Answer Q1 with an incorrect distractor
    const wrongOpt1 = session.questions[1].options!.find(o => !o.isCorrect)!;
    session.questions[1].selectedOptionId = wrongOpt1.id;

    // Grade the quiz
    const result = QuizEngine.gradeQuiz(session);

    expect(result.totalQuestions).toBe(5);
    expect(result.questions[0].isCorrect).toBe(true);
    expect(result.questions[1].isCorrect).toBe(false);

    // Misconception must be recorded for the wrong answer
    if (wrongOpt1.targetedMisconceptionCode) {
      expect(result.questions[1].diagnosedMisconception).toBeDefined();
      expect(result.questions[1].diagnosedMisconception!.code).toBe(wrongOpt1.targetedMisconceptionCode);
      expect(result.misconceptionsEncountered.length).toBeGreaterThanOrEqual(1);
    }

    expect(result.topicBreakdown.length).toBeGreaterThanOrEqual(1);
  });

  it('Mixed format quiz alternates between MULTIPLE_CHOICE and WRITTEN questions', () => {
    const session = QuizEngine.createQuiz({
      courseId,
      topicId,
      questionCount: 5,
      format: 'MIXED',
      difficulty: 'EASY'
    });

    expect(session.questions[0].format).toBe('MULTIPLE_CHOICE');
    expect(session.questions[1].format).toBe('WRITTEN');
    expect(session.questions[2].format).toBe('MULTIPLE_CHOICE');
    expect(session.questions[3].format).toBe('WRITTEN');
    expect(session.questions[4].format).toBe('MULTIPLE_CHOICE');
  });

  it('preserves pedagogical isolation: Quiz completion does not alter MasteryEngine records', () => {
    const student = 'quiz-isolation-student';
    const skill = 'SKILL-GEN0102-002';
    const initialMastery = MasteryEngine.getSkillMastery(student, skill);
    const initialAttempts = initialMastery.totalAttempts;

    const session = QuizEngine.createQuiz({
      courseId,
      topicId,
      questionCount: 5,
      format: 'MULTIPLE_CHOICE',
      difficulty: 'MEDIUM'
    }, student);

    // Answer all correct
    for (const q of session.questions) {
      const correctOpt = q.options?.find(o => o.isCorrect);
      if (correctOpt) {
        q.selectedOptionId = correctOpt.id;
      }
    }

    const result = QuizEngine.gradeQuiz(session);
    expect(result.scorePercentage).toBe(100);

    // MasteryEngine should NOT have recorded attempts from quiz mode
    const afterMastery = MasteryEngine.getSkillMastery(student, skill);
    expect(afterMastery.totalAttempts).toBe(initialAttempts);
  });
});
