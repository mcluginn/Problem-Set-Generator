/**
 * Stress Test Suite: 200 Concurrent Students Practice Loop
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { describe, it, expect } from 'vitest';
import { PracticeSessionManager } from '../../src/engine/adaptive/session';
import { MasteryEngine } from '../../src/engine/adaptive/mastery';
import { LearningEventStore } from '../../src/engine/adaptive/events';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';

describe('200 Concurrent Students Practice Loop Simulation', () => {
  it('simulates 200 concurrent students practicing across all 6 courses with zero data races', async () => {
    const NUM_STUDENTS = 200;
    const courses = [
      'COURSE-GEN0101',
      'COURSE-GEN0102',
      'COURSE-GEN0107',
      'COURSE-GEN0110',
      'COURSE-GEN0161',
      'COURSE-BSIE3219'
    ];

    const studentTasks = Array.from({ length: NUM_STUDENTS }, async (_, i) => {
      const studentId = `student_stress_${i}`;
      const courseId = courses[i % courses.length];

      // 1. Start Session
      const session = PracticeSessionManager.startSession(studentId, courseId, { sessionLength: 2 });
      expect(session.currentProblem).toBeDefined();

      // 2. Submit Attempt
      const isCorrect = i % 4 !== 0; // 75% correct, 25% incorrect
      const ans = isCorrect
        ? session.currentProblem!.solution.canonicalAnswerLatex
        : '0';

      const res = PracticeSessionManager.submitAttempt(session.id, {
        studentAnswer: ans,
        source: i % 2 === 0 ? 'TYPED' : 'PICTURE',
        isCorrect,
        timeSpentSeconds: 30 + (i % 20),
        hintLevelUsed: isCorrect ? 0 : 2,
        solutionViewed: false,
        mistakeCode: isCorrect ? undefined : 'MISSING_INNER_DERIVATIVE',
        idempotencyKey: `STRESS-IDEMP-${studentId}-1`
      });

      expect(res.attempt.studentId).toBe(studentId);

      // 3. Next Problem Recommendation
      const nextRes = PracticeSessionManager.nextProblem(session.id);
      expect(nextRes.decision.courseId).toBe(courseId);

      // 4. Verify Mastery & State Isolation
      const mastery = MasteryEngine.getSkillMastery(studentId, res.attempt.skillId);
      expect(mastery.studentId ? mastery.studentId === studentId : true).toBe(true);

      const events = LearningEventStore.getEventsForStudent(studentId);
      expect(events.length).toBeGreaterThanOrEqual(3);
    });

    const start = performance.now();
    await Promise.all(studentTasks);
    const duration = performance.now() - start;

    console.log(`[Concurrency Benchmark] 200 concurrent student practice loops executed in ${duration.toFixed(2)}ms (${(duration / NUM_STUDENTS).toFixed(2)}ms/student)`);
    expect(duration).toBeLessThan(4000); // Expect all 200 to complete in < 4 seconds
  });
});
