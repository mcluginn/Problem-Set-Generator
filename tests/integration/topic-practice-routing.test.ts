/**
 * Topic Practice Routing & Multi-Problem Sequence Integration Tests
 * Engineering Practice Engine — Phase 7 Scope Invariant Integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UnifiedPracticeStore } from '../../src/engine/adaptive/store';
import { PracticeSessionManager } from '../../src/engine/adaptive/session';
import { validateProblemScope } from '../../src/engine/adaptive/scopeValidator';
import { curriculumRegistry } from '../../src/engine/curriculum/registry';

describe('Integration: Topic Practice Routing & Sequence Invariant', () => {
  beforeEach(() => {
    UnifiedPracticeStore.clear();
    PracticeSessionManager.clear();
  });

  /* ========================================================================= */
  /* 1. Multi-Problem Sequence within Topic Practice                           */
  /* ========================================================================= */
  it('guarantees all problems across a multi-problem session belong to the requested topic', () => {
    const courseId = 'COURSE-GEN0102';
    const topicId = 'CURR-GEN0102-U1-T04'; // Differentiation Rules topic

    const session = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicId,
      sessionLength: 5
    });

    expect(session.scope.topicId).toBe(topicId);
    expect(session.currentProblem).toBeDefined();

    for (let i = 0; i < 5; i++) {
      const currentProb = session.currentProblem!;
      const validation = validateProblemScope(currentProb, session.scope);
      expect(validation.valid).toBe(true);

      // Verify skill belongs to topic in curriculum
      const skill = curriculumRegistry.getSkillById(currentProb.dna.primarySkillId);
      expect(skill).toBeDefined();
      expect(skill!.parentTopicId).toBe(topicId);

      // Submit attempt
      UnifiedPracticeStore.submitAttempt(session.id, {
        studentAnswer: currentProb.solution.canonicalAnswerLatex,
        source: 'TYPED',
        isCorrect: true,
        timeSpentSeconds: 30,
        hintLevelUsed: 0,
        solutionViewed: false
      });

      if (i < 4) {
        const next = UnifiedPracticeStore.nextProblem(session.id);
        expect(next.problem).toBeDefined();
        expect(next.decision.targetTopicId).toBe(topicId);
      }
    }
  });

  /* ========================================================================= */
  /* 2. Student Controls (Easier, Harder, Another Like This) Remain in Scope    */
  /* ========================================================================= */
  it('preserves topic constraint when student requests Easier, Harder, or Another Like This', () => {
    const courseId = 'COURSE-GEN0102';
    const topicId = 'CURR-GEN0102-U1-T04';

    const session = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicId,
      sessionLength: 5
    });

    // 1. Click Easier
    const easierNext = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceDifficulty: 1
    });
    expect(easierNext.problem).toBeDefined();
    expect(validateProblemScope(easierNext.problem!, session.scope).valid).toBe(true);

    // 2. Click Harder
    const harderNext = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceDifficulty: 3
    });
    expect(harderNext.problem).toBeDefined();
    expect(validateProblemScope(harderNext.problem!, session.scope).valid).toBe(true);

    // 3. Click Another Like This
    const anotherNext = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceSkillId: harderNext.problem!.dna.primarySkillId
    });
    expect(anotherNext.problem).toBeDefined();
    expect(validateProblemScope(anotherNext.problem!, session.scope).valid).toBe(true);
  });

  /* ========================================================================= */
  /* 3. Topic Switching Resets State Cleanly                                   */
  /* ========================================================================= */
  it('resets problem scope immediately when switching from Topic A to Topic B', () => {
    const courseId = 'COURSE-GEN0102';
    const topicA = 'CURR-GEN0102-U1-T04'; // Differentiation Rules
    const topicB = 'CURR-GEN0102-U1-T03'; // Limits & Continuity

    // Start Session in Topic A
    const sessA = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicA
    });
    expect(sessA.currentProblem?.dna.topicId).toBe(topicA);

    // Switch to Topic B
    const sessB = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicB
    });

    expect(sessB.scope.topicId).toBe(topicB);
    expect(sessB.currentProblem?.dna.topicId).toBe(topicB);
    expect(validateProblemScope(sessB.currentProblem!, sessB.scope).valid).toBe(true);
  });
});
