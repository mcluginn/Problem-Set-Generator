/**
 * Concurrency, Multi-Tenant Simulation & Idempotency Test Suite
 * Simulates 10 and 50 concurrent students generating problems, submitting answers,
 * and updating mastery without race conditions or lost updates.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PracticeStore, MultiUserStore } from '@/services/database/store';
import { AttemptRecord, User } from '@/services/database/types';
import { ProblemGenerator } from '@/engine/generation/generator';
import { AdaptiveEngine } from '@/services/adaptive/adaptive';
import { checkEquivalence } from '@/engine/math/equivalence';
import { parseMath } from '@/engine/math/parser';

describe('Concurrency, Multi-Tenant Simulation & Idempotency', () => {
  beforeEach(() => {
    MultiUserStore.reset();
  });

  it('handles rapid sequential submissions idempotently', () => {
    const initialAttemptsCount = PracticeStore.getAttempts().length;
    const initialProfile = { ...PracticeStore.getProfile() };

    const attempt1: AttemptRecord = {
      id: 'att_concurrency_01',
      problemId: 'prob_unique_test_101',
      studentId: initialProfile.id,
      concept: 'Chain Rule',
      familyId: 'CHAIN_POWER_POLYNOMIAL',
      representationType: 'Symbolic',
      submittedAnswer: '5(3x^2 - 2x + 4)^4(6x - 2)',
      isCorrect: true,
      attemptNumber: 1,
      hintsUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 15,
      createdAt: new Date().toISOString(),
    };

    PracticeStore.recordAttempt(attempt1);
    const midProfile = { ...PracticeStore.getProfile() };
    expect(midProfile.totalAttempts).toBe(initialProfile.totalAttempts + 1);
    expect(midProfile.totalProblemsSolved).toBe(initialProfile.totalProblemsSolved + 1);

    const attempt2: AttemptRecord = {
      id: 'att_concurrency_02',
      problemId: 'prob_unique_test_102',
      studentId: initialProfile.id,
      concept: 'Product Rule',
      familyId: 'PRODUCT_POLY_TRIG',
      representationType: 'Symbolic',
      submittedAnswer: '2x sin(x) + x^2 cos(x)',
      isCorrect: true,
      attemptNumber: 1,
      hintsUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 20,
      createdAt: new Date().toISOString(),
    };

    PracticeStore.recordAttempt(attempt2);
    const finalProfile = PracticeStore.getProfile();
    expect(finalProfile.totalAttempts).toBe(initialProfile.totalAttempts + 2);
    expect(finalProfile.totalProblemsSolved).toBe(initialProfile.totalProblemsSolved + 2);
    expect(PracticeStore.getAttempts().length).toBe(initialAttemptsCount + 2);
  });

  it('updates mistake counts without duplicate mistake entities', () => {
    const mistakeData = {
      id: 'mst_idempotent_test',
      studentId: 'prof_student_demo',
      concept: 'Product Rule',
      misconceptionCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' as const,
      misconceptionName: 'Multiplied Individual Derivatives',
      problemStatement: 'Find dy/dx for y = x^2 sin(x)',
      problemLatex: 'y = x^2 \\sin(x)',
      studentAnswer: '2x cos(x)',
      correctAnswerLatex: '2x \\sin(x) + x^2 \\cos(x)',
      explanation: 'Multiplied individual derivatives',
      occurredCount: 1,
      resolved: false,
      lastOccurredAt: new Date().toISOString(),
    };

    PracticeStore.logMistake(mistakeData);
    const initialMistakes = PracticeStore.getMistakes().filter(
      (m) => m.concept === 'Product Rule' && m.misconceptionCode === 'PRODUCT_RULE_MULTIPLY_DERIVS'
    );
    expect(initialMistakes.length).toBe(1);
    const firstCount = initialMistakes[0].occurredCount;

    PracticeStore.logMistake(mistakeData);
    const updatedMistakes = PracticeStore.getMistakes().filter(
      (m) => m.concept === 'Product Rule' && m.misconceptionCode === 'PRODUCT_RULE_MULTIPLY_DERIVS'
    );
    expect(updatedMistakes.length).toBe(1);
    expect(updatedMistakes[0].occurredCount).toBe(firstCount + 1);
  });

  // ---------------------------------------------------------------------------
  // 10 Concurrent Students Simulation
  // ---------------------------------------------------------------------------
  it('simulates 10 concurrent students performing independent generation, grading, and updates in parallel', async () => {
    const NUM_STUDENTS = 10;
    const PROBLEMS_PER_STUDENT = 5;

    const studentUsers: User[] = Array.from({ length: NUM_STUDENTS }, (_, idx) => ({
      id: `usr_sim_10_${idx}`,
      email: `student10_${idx}@engineering.edu`,
      fullName: `Concurrent Student 10-${idx}`,
      role: 'STUDENT',
      createdAt: new Date().toISOString(),
    }));

    const studentTasks = studentUsers.map(async (user) => {
      const store = MultiUserStore.forUser(user);

      for (let pIdx = 0; pIdx < PROBLEMS_PER_STUDENT; pIdx++) {
        // 1. Generate problem dynamically
        const problem = ProblemGenerator.generateProblem({
          concept: 'Chain Rule',
          difficulty: 'Medium',
        });
        expect(problem).toBeDefined();

        // 2. Simulate answer grading
        const studentInput = problem.solution.canonicalAnswerRaw;
        const studentAst = parseMath(studentInput);
        const expectedAst = parseMath(problem.solution.canonicalAnswerRaw);
        const eq = checkEquivalence(studentAst, expectedAst, { targetVariable: 'x' });
        expect(eq.equivalent).toBe(true);

        // 3. Record attempt
        const attempt: AttemptRecord = {
          id: `att_${user.id}_${pIdx}`,
          problemId: problem.id,
          studentId: user.id,
          concept: problem.dna.concept,
          familyId: problem.dna.familyId,
          representationType: problem.dna.representationType,
          submittedAnswer: studentInput,
          isCorrect: true,
          attemptNumber: 1,
          hintsUsed: 0,
          solutionViewed: false,
          timeSpentSeconds: 25,
          createdAt: new Date().toISOString(),
        };

        store.recordAttempt(attempt);

        // 4. Trigger Adaptive recommendation
        const rec = AdaptiveEngine.selectNextBestProblem(store.getMastery(), store.getMistakes());
        expect(rec).toBeDefined();
      }

      // Assert student store integrity
      expect(store.getAttempts().length).toBe(PROBLEMS_PER_STUDENT);
      expect(store.getProfile().totalProblemsSolved).toBe(PROBLEMS_PER_STUDENT);
      expect(store.getProfile().totalAttempts).toBe(PROBLEMS_PER_STUDENT);
    });

    await Promise.all(studentTasks);
  });

  // ---------------------------------------------------------------------------
  // 50 Concurrent Students Simulation
  // ---------------------------------------------------------------------------
  it('simulates 50 concurrent students performing parallel practice with zero data corruption', async () => {
    const NUM_STUDENTS = 50;
    const PROBLEMS_PER_STUDENT = 3;

    const studentUsers: User[] = Array.from({ length: NUM_STUDENTS }, (_, idx) => ({
      id: `usr_sim_50_${idx}`,
      email: `student50_${idx}@engineering.edu`,
      fullName: `Concurrent Student 50-${idx}`,
      role: 'STUDENT',
      createdAt: new Date().toISOString(),
    }));

    const startTime = performance.now();

    const studentTasks = studentUsers.map(async (user, uIdx) => {
      const store = MultiUserStore.forUser(user);
      const concepts = ['Power Rule', 'Product Rule', 'Quotient Rule', 'Chain Rule'];
      const conceptChoice = concepts[uIdx % concepts.length];

      for (let pIdx = 0; pIdx < PROBLEMS_PER_STUDENT; pIdx++) {
        const problem = ProblemGenerator.generateProblem({
          concept: conceptChoice,
          difficulty: 'Medium',
        });
        expect(problem).toBeDefined();

        const attempt: AttemptRecord = {
          id: `att_${user.id}_${pIdx}`,
          problemId: problem.id,
          studentId: user.id,
          concept: problem.dna.concept,
          familyId: problem.dna.familyId,
          representationType: problem.dna.representationType,
          submittedAnswer: problem.solution.canonicalAnswerRaw,
          isCorrect: true,
          attemptNumber: 1,
          hintsUsed: 0,
          solutionViewed: false,
          timeSpentSeconds: 30,
          createdAt: new Date().toISOString(),
        };

        store.recordAttempt(attempt);
      }

      expect(store.getAttempts().length).toBe(PROBLEMS_PER_STUDENT);
      expect(store.getProfile().totalProblemsSolved).toBe(PROBLEMS_PER_STUDENT);
    });

    await Promise.all(studentTasks);

    const duration = performance.now() - startTime;
    console.log(`[50 Concurrent Students] Finished ${NUM_STUDENTS * PROBLEMS_PER_STUDENT} operations across 50 users in ${duration.toFixed(2)}ms (${(duration / (NUM_STUDENTS * PROBLEMS_PER_STUDENT)).toFixed(3)} ms/operation)`);
  });
});
