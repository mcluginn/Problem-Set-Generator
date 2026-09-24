/**
 * Automated Test Suite: Practice Session Lifecycle & Multi-Problem Continuation
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PracticeSessionManager } from '../../src/engine/adaptive/session';
import { MasteryEngine } from '../../src/engine/adaptive/mastery';
import { LearningEventStore } from '../../src/engine/adaptive/events';

describe('PracticeSessionManager Complete Lifecycle', () => {
  const studentId = 'student_session_01';

  beforeEach(() => {
    PracticeSessionManager.clear();
    MasteryEngine.clear();
    LearningEventStore.clear();
  });

  it('initializes an active session with first problem and tracks progression', () => {
    const session = PracticeSessionManager.startSession(
      studentId,
      'COURSE-GEN0102',
      { sessionLength: 3, mode: 'RECOMMENDED' }
    );

    expect(session.status).toBe('ACTIVE');
    expect(session.currentProblem).toBeDefined();
    expect(session.problemsCompleted).toBe(0);
    expect(session.sessionLength).toBe(3);

    // Submit correct attempt on Problem 1
    const res1 = PracticeSessionManager.submitAttempt(session.id, {
      studentAnswer: session.currentProblem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 40,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res1.session.problemsCompleted).toBe(1);
    expect(res1.isSessionComplete).toBe(false);

    // Advance to Problem 2
    const prob1Id = session.currentProblemId;
    const res2 = PracticeSessionManager.nextProblem(session.id);
    expect(res2.problem).toBeDefined();
    expect(session.currentProblemId).toBe(res2.decision.selectedProblemId);

    // Submit attempt on Problem 2
    PracticeSessionManager.submitAttempt(session.id, {
      studentAnswer: res2.problem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 30,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    // Advance to Problem 3
    const res3 = PracticeSessionManager.nextProblem(session.id);
    expect(res3.problem).toBeDefined();

    // Submit attempt on Problem 3 (Completes 3/3 session)
    const res3Final = PracticeSessionManager.submitAttempt(session.id, {
      studentAnswer: res3.problem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 25,
      hintLevelUsed: 1,
      solutionViewed: false
    });

    expect(res3Final.isSessionComplete).toBe(true);
    expect(res3Final.session.status).toBe('COMPLETED');
    expect(res3Final.session.summary).toBeDefined();
    expect(res3Final.session.summary?.totalProblemsSolved).toBe(3);
    expect(res3Final.session.summary?.totalHintsUsed).toBe(1);
  });
});
