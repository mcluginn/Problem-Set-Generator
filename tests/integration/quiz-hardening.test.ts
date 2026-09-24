import { describe, it, expect, beforeEach } from 'vitest';
import { QuizEngine } from '../../src/engine/quiz/quizEngine';
import { DistractorGenerator } from '../../src/engine/quiz/distractorGenerator';
import { ContentGenerator } from '../../src/engine/content/generator';
import { problemBank } from '../../src/engine/content/problemBank';
import { QuizSession } from '../../src/engine/quiz/types';

describe('Quiz Hardening & Integrity Regressions', () => {
  const courseId = 'COURSE-GEN0102'; // Calculus 1
  const topicId = 'CURR-GEN0102-U1-T04'; // Differentiation Methods

  beforeEach(() => {
    QuizEngine.clearActiveSession();
  });

  describe('1. Active Quiz Resume & Persistence', () => {
    it('restores active quiz with saved question index, answers, flags, timer, and progress', () => {
      const session = QuizEngine.createQuiz({
        courseId,
        topicId,
        questionCount: 5,
        format: 'MIXED',
        difficulty: 'EASY'
      });

      // Simulate student progress:
      // Navigate to Q3 (0-indexed: index 2)
      session.currentIndex = 2;
      session.elapsedSeconds = 145;

      // Answer Q0 (MCQ)
      if (session.questions[0].options) {
        session.questions[0].selectedOptionId = session.questions[0].options[0].id;
      }
      // Answer Q1 (Written)
      session.questions[1].userAnswer = '6x + 5';
      // Flag Q1
      session.questions[1].isFlagged = true;

      // Save to localStorage
      QuizEngine.saveActiveSession(session);

      // Reload active session
      const resumed = QuizEngine.loadActiveSession();
      expect(resumed).not.toBeNull();
      expect(resumed?.quizId).toBe(session.quizId);
      expect(resumed?.currentIndex).toBe(2);
      expect(resumed?.elapsedSeconds).toBe(145);
      expect(resumed?.status).toBe('IN_PROGRESS');

      // Verify answers & flags restored
      expect(resumed?.questions[0].selectedOptionId).toBe(session.questions[0].options![0].id);
      expect(resumed?.questions[1].userAnswer).toBe('6x + 5');
      expect(resumed?.questions[1].isFlagged).toBe(true);
      expect(resumed?.questions[2].selectedOptionId).toBeUndefined();
      expect(resumed?.questions[2].userAnswer).toBe('');

      // Clear session
      QuizEngine.clearActiveSession();
      expect(QuizEngine.loadActiveSession()).toBeNull();
    });

    it('does not overwrite unfinished quiz when loading or inspecting session', () => {
      const session = QuizEngine.createQuiz({
        courseId,
        topicId,
        questionCount: 5,
        format: 'MULTIPLE_CHOICE',
        difficulty: 'ADAPTIVE'
      });
      session.elapsedSeconds = 60;
      QuizEngine.saveActiveSession(session);

      // Loading should be non-destructive
      const peek1 = QuizEngine.loadActiveSession();
      const peek2 = QuizEngine.loadActiveSession();
      expect(peek1?.quizId).toBe(session.quizId);
      expect(peek2?.quizId).toBe(session.quizId);
      expect(peek2?.elapsedSeconds).toBe(60);
    });
  });

  describe('2. Assessment Distractor Uniqueness & Canonical Answer Protection', () => {
    it('guarantees exactly 4 options, exactly 1 correct, 3 unique distractors, and zero canonical matches across skills', () => {
      const testSkills = [
        'SKILL-GEN0102-002', // Power Rule
        'SKILL-GEN0102-003', // Product Rule
        'SKILL-GEN0102-004', // Quotient Rule
        'SKILL-GEN0102-005', // Chain Rule
      ];

      for (const skillId of testSkills) {
        const probRes = ContentGenerator.generateForSkill({
          courseId: courseId as any,
          skillId,
          difficulty: 2
        });

        expect(probRes.success).toBe(true);
        const problem = probRes.problem!;

        const options = DistractorGenerator.generateOptions(problem, `SEED-TEST-${skillId}`);

        // Exactly 4 options
        expect(options.length).toBe(4);

        // Exactly 1 correct option
        const correctOptions = options.filter(o => o.isCorrect);
        expect(correctOptions.length).toBe(1);

        // Exactly 3 distractors
        const distractors = options.filter(o => !o.isCorrect);
        expect(distractors.length).toBe(3);

        // Canonical answer normalization
        const cleanCanonical = problem.solution.canonicalAnswerLatex.replace(/[\s${}\\]/g, '').toLowerCase();

        // Check each distractor does NOT match canonical answer
        for (const distractor of distractors) {
          const cleanDistractor = distractor.textLatex.replace(/[\s${}\\]/g, '').toLowerCase();
          expect(cleanDistractor).not.toBe(cleanCanonical);
          if (problem.solution.canonicalAnswerRaw) {
            const cleanRaw = problem.solution.canonicalAnswerRaw.replace(/[\s${}\\]/g, '').toLowerCase();
            expect(cleanDistractor).not.toBe(cleanRaw);
          }
        }

        // Check all 4 options are distinct from each other
        const normalizedTexts = options.map(o => o.textLatex.replace(/[\s${}\\]/g, '').toLowerCase());
        const uniqueTexts = new Set(normalizedTexts);
        expect(uniqueTexts.size).toBe(4);
      }
    });

    it('enforces deterministic seeded Fisher-Yates shuffling', () => {
      const probRes = ContentGenerator.generateForSkill({
        courseId: courseId as any,
        skillId: 'SKILL-GEN0102-002',
        difficulty: 2
      });
      const problem = probRes.problem!;

      // Same seed produces identical option order and IDs
      const optionsRun1 = DistractorGenerator.generateOptions(problem, 'FIXED-REPRODUCIBLE-SEED');
      const optionsRun2 = DistractorGenerator.generateOptions(problem, 'FIXED-REPRODUCIBLE-SEED');

      expect(optionsRun1.map(o => o.textLatex)).toEqual(optionsRun2.map(o => o.textLatex));
      expect(optionsRun1.map(o => o.isCorrect)).toEqual(optionsRun2.map(o => o.isCorrect));
    });
  });

  describe('3. Mixed Format Question Distribution', () => {
    it('enforces exact 3-MCQ / 2-Written split for 5-question mixed quiz', () => {
      const session = QuizEngine.createQuiz({
        courseId,
        topicId,
        questionCount: 5,
        format: 'MIXED',
        difficulty: 'ADAPTIVE'
      });

      expect(session.questions.length).toBe(5);
      const mcqCount = session.questions.filter(q => q.format === 'MULTIPLE_CHOICE').length;
      const writtenCount = session.questions.filter(q => q.format === 'WRITTEN').length;

      expect(mcqCount).toBe(3);
      expect(writtenCount).toBe(2);

      expect(session.questions[0].format).toBe('MULTIPLE_CHOICE');
      expect(session.questions[1].format).toBe('WRITTEN');
      expect(session.questions[2].format).toBe('MULTIPLE_CHOICE');
      expect(session.questions[3].format).toBe('WRITTEN');
      expect(session.questions[4].format).toBe('MULTIPLE_CHOICE');
    });

    it('enforces exact 50/50 split for 10-question mixed quiz', () => {
      const session = QuizEngine.createQuiz({
        courseId,
        topicId,
        questionCount: 10,
        format: 'MIXED',
        difficulty: 'ADAPTIVE'
      });

      expect(session.questions.length).toBe(10);
      const mcqCount = session.questions.filter(q => q.format === 'MULTIPLE_CHOICE').length;
      const writtenCount = session.questions.filter(q => q.format === 'WRITTEN').length;

      expect(mcqCount).toBe(5);
      expect(writtenCount).toBe(5);
    });

    it('enforces exact 50/50 split for 20-question mixed quiz', () => {
      const session = QuizEngine.createQuiz({
        courseId,
        topicId,
        questionCount: 20,
        format: 'MIXED',
        difficulty: 'ADAPTIVE'
      });

      expect(session.questions.length).toBe(20);
      const mcqCount = session.questions.filter(q => q.format === 'MULTIPLE_CHOICE').length;
      const writtenCount = session.questions.filter(q => q.format === 'WRITTEN').length;

      expect(mcqCount).toBe(10);
      expect(writtenCount).toBe(10);
    });
  });

  describe('4. Controlled Generation Failure on Unavailable Skill', () => {
    it('throws controlled Assessment Generation Failure when requested skill cannot be fulfilled', () => {
      expect(() => {
        QuizEngine.createQuiz({
          courseId: 'COURSE-GEN0102',
          topicId: 'CURR-GEN0102-NONEXISTENT',
          questionCount: 5,
          format: 'MULTIPLE_CHOICE',
          difficulty: 'HARD'
        });
      }).toThrow(/Assessment Generation Failure/);
    });
  });

  describe('5. MCQ and Written Separate Score Reporting', () => {
    it('calculates separate mcqScore and writtenScore metrics on quiz grading', () => {
      const session = QuizEngine.createQuiz({
        courseId,
        topicId,
        questionCount: 5,
        format: 'MIXED',
        difficulty: 'EASY'
      });

      // 5 questions:
      // Q0: MCQ
      // Q1: Written
      // Q2: MCQ
      // Q3: Written
      // Q4: MCQ

      // Answer Q0 correctly (MCQ correct 1/3)
      const correct0 = session.questions[0].options!.find(o => o.isCorrect)!;
      session.questions[0].selectedOptionId = correct0.id;

      // Answer Q1 correctly (Written correct 1/2)
      session.questions[1].userAnswer = session.questions[1].problem.solution.canonicalAnswerLatex;

      // Answer Q2 correctly (MCQ correct 2/3)
      const correct2 = session.questions[2].options!.find(o => o.isCorrect)!;
      session.questions[2].selectedOptionId = correct2.id;

      // Answer Q3 incorrectly (Written wrong 1/2)
      session.questions[3].userAnswer = 'wrong_algebraic_expression_xyz';

      // Answer Q4 incorrectly (MCQ wrong 2/3)
      const wrong4 = session.questions[4].options!.find(o => !o.isCorrect)!;
      session.questions[4].selectedOptionId = wrong4.id;

      const result = QuizEngine.gradeQuiz(session);

      // Overall: 3 out of 5 correct (60%)
      expect(result.totalQuestions).toBe(5);
      expect(result.correctCount).toBe(3);
      expect(result.scorePercentage).toBe(60);

      // MCQ Score: 2 of 3 correct (~67%)
      expect(result.mcqScore).toBeDefined();
      expect(result.mcqScore?.total).toBe(3);
      expect(result.mcqScore?.correct).toBe(2);
      expect(result.mcqScore?.percentage).toBe(67);

      // Written Score: 1 of 2 correct (50%)
      expect(result.writtenScore).toBeDefined();
      expect(result.writtenScore?.total).toBe(2);
      expect(result.writtenScore?.correct).toBe(1);
      expect(result.writtenScore?.percentage).toBe(50);
    });
  });

  describe('6. Mathematical Preview for User Inputs', () => {
    it('detects simple and complex algebraic user inputs as mathematical notation', async () => {
      const { isPureMathExpression } = await import('../../src/components/math/MathRenderer');

      // Simple algebraic expressions without delimiters
      expect(isPureMathExpression('6x+5')).toBe(true);
      expect(isPureMathExpression('12x^2+3')).toBe(true);
      expect(isPureMathExpression('6')).toBe(true);
      expect(isPureMathExpression('3*x - 2')).toBe(true);
      expect(isPureMathExpression('x^3 - 4x + 1')).toBe(true);
      expect(isPureMathExpression('2*cos(x)')).toBe(true);
      expect(isPureMathExpression('1/(x+1)')).toBe(true);

      // Multi-word plain text prose should NOT be treated as pure math
      expect(isPureMathExpression('Please explain the product rule step by step')).toBe(false);
      expect(isPureMathExpression('The derivative with respect to x is')).toBe(false);
    });
  });

  describe('7. Header Practice Label & Responsive Class Regressions', () => {
    it('ensures valid responsive breakpoints and visible labels at desktop widths with zero xs: classes', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const pagePath = path.resolve(__dirname, '../../src/app/page.tsx');
      const pageContent = fs.readFileSync(pagePath, 'utf-8');

      // Must not contain invalid xs: Tailwind class prefixes
      expect(pageContent).not.toMatch(/xs:/);

      // Must use valid sm: breakpoint for Practice, Dashboard, Mistakes, and Divider
      expect(pageContent).toContain('hidden sm:inline">Practice</span>');
      expect(pageContent).toContain('hidden sm:inline">Dashboard</span>');
      expect(pageContent).toContain('hidden sm:inline">Mistakes</span>');
      expect(pageContent).toContain('Quiz<span className="hidden sm:inline"> Mode</span>');
      expect(pageContent).toContain('hidden sm:block" />');
    });
  });

  describe('8. Active Quiz Overwrite Prevention', () => {
    it('preserves active quiz session when inspecting, loading, or manipulating unrelated config', () => {
      const originalSession = QuizEngine.createQuiz({
        courseId: 'COURSE-GEN0102',
        topicId: 'CURR-GEN0102-U1-T04',
        questionCount: 5,
        format: 'MIXED',
        difficulty: 'EASY'
      });

      // Simulate student in the middle of a quiz
      originalSession.currentIndex = 3;
      originalSession.elapsedSeconds = 240;
      originalSession.questions[0].selectedOptionId = 'A';
      originalSession.questions[1].userAnswer = '4x^3';
      originalSession.questions[2].isFlagged = true;
      QuizEngine.saveActiveSession(originalSession);

      // Verify active session exists
      const saved = QuizEngine.loadActiveSession();
      expect(saved?.quizId).toBe(originalSession.quizId);
      expect(saved?.currentIndex).toBe(3);
      expect(saved?.elapsedSeconds).toBe(240);

      // Simulating user opening QuizSetup, switching courses, toggling counts, etc.
      // These actions must NEVER wipe the active session
      const unrelatedRead1 = QuizEngine.loadActiveSession();
      expect(unrelatedRead1?.quizId).toBe(originalSession.quizId);

      const history = QuizEngine.getQuizHistory();
      expect(Array.isArray(history)).toBe(true);

      const unrelatedRead2 = QuizEngine.loadActiveSession();
      expect(unrelatedRead2?.quizId).toBe(originalSession.quizId);
      expect(unrelatedRead2?.questions[1].userAnswer).toBe('4x^3');
      expect(unrelatedRead2?.questions[2].isFlagged).toBe(true);

      // Only explicit clearActiveSession removes it
      QuizEngine.clearActiveSession();
      expect(QuizEngine.loadActiveSession()).toBeNull();
    });
  });

  describe('9. 20-Question Generation & Chunked Progress Across Multiple Courses', () => {
    it('generates 5, 10, and 20 questions with live progress callback for Calculus 1', async () => {
      for (const count of [5, 10, 20] as const) {
        const progressEvents: number[] = [];
        const session = await QuizEngine.createQuizAsync(
          {
            courseId: 'COURSE-GEN0102',
            questionCount: count,
            format: 'MIXED',
            difficulty: 'ADAPTIVE'
          },
          'student-perf-test',
          (current, total) => {
            progressEvents.push(current);
            expect(total).toBe(count);
          }
        );

        expect(session.questions.length).toBe(count);
        expect(progressEvents.length).toBe(count);
        expect(progressEvents[progressEvents.length - 1]).toBe(count);

        // Verify all question IDs are unique
        const qIds = new Set(session.questions.map(q => q.problem.dna.problemId));
        expect(qIds.size).toBe(count);

        // Verify all MCQ questions have strictly 4 unique options and zero canonical collisions
        for (const q of session.questions) {
          if (q.format === 'MULTIPLE_CHOICE') {
            expect(q.options?.length).toBe(4);
            const correctCount = q.options?.filter(o => o.isCorrect).length;
            expect(correctCount).toBe(1);

            const texts = q.options!.map(o => o.textLatex.replace(/[\s${}\\]/g, '').toLowerCase());
            expect(new Set(texts).size).toBe(4);
          }
        }
      }
    });

    it('generates 5, 10, and 20 questions with live progress callback for Physics 2 (dynamic generation course)', async () => {
      for (const count of [5, 10, 20] as const) {
        const progressEvents: number[] = [];
        const session = await QuizEngine.createQuizAsync(
          {
            courseId: 'COURSE-GEN0101', // Physics 2: Electricity & Magnetism
            questionCount: count,
            format: 'MIXED',
            difficulty: 'ADAPTIVE'
          },
          'student-physics-test',
          (current, total) => {
            progressEvents.push(current);
            expect(total).toBe(count);
          }
        );

        expect(session.questions.length).toBe(count);
        expect(progressEvents.length).toBe(count);
        expect(progressEvents[progressEvents.length - 1]).toBe(count);

        // Verify MCQ options integrity
        for (const q of session.questions) {
          if (q.format === 'MULTIPLE_CHOICE') {
            expect(q.options?.length).toBe(4);
            const correctCount = q.options?.filter(o => o.isCorrect).length;
            expect(correctCount).toBe(1);
          }
        }
      }
    });
  });
});
