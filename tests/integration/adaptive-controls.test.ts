/**
 * Automated Test Suite: Adaptive Controls (Easier, Harder, Another Like This)
 * Engineering Practice Engine — Adaptive Learning UX Hardening
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UnifiedPracticeStore } from '../../src/engine/adaptive/store';
import { PracticeSessionManager } from '../../src/engine/adaptive/session';
import { curriculumRegistry } from '../../src/engine/curriculum/registry';
import { ContentRegistry } from '../../src/engine/content/registry';
import { validateProblemScope } from '../../src/engine/adaptive/scopeValidator';

describe('Adaptive Controls: Easier, Harder, and Another Like This', () => {
  beforeEach(() => {
    UnifiedPracticeStore.clear();
    PracticeSessionManager.clear();
  });

  /* ========================================================================= */
  /* 1. Another Like This: Returns a Different Problem Before Any Submission  */
  /* ========================================================================= */
  it('returns a different problemId when "Another Like This" is requested before any answer submission', () => {
    const courseId = 'COURSE-GEN0102';
    const topicId = 'CURR-GEN0102-U1-T04'; // Differentiation Rules

    const session = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicId,
      sessionLength: 5
    });

    const firstProblem = session.currentProblem;
    expect(firstProblem).toBeDefined();
    const firstProblemId = session.currentProblemId;
    expect(firstProblemId).not.toBe('NO_ELIGIBLE_PROBLEM');

    // Without submitting any answer, student clicks "Another Like This"
    const next = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceTopicId: topicId,
      forceSkillId: firstProblem!.dna.primarySkillId,
      forceDifficulty: Math.round(firstProblem!.dna.difficultyVector.overall)
    });

    expect(next.problem).toBeDefined();
    expect(next.problem!.dna.problemId).not.toBe(firstProblemId);
    expect(next.decision.selectedProblemId).not.toBe(firstProblemId);
    expect(next.problem!.dna.primarySkillId).toBe(firstProblem!.dna.primarySkillId);
    expect(next.problem!.dna.topicId).toBe(topicId);
  });

  /* ========================================================================= */
  /* 2. Harder Control: Increases Difficulty Relative to Current Problem       */
  /* ========================================================================= */
  it('increases difficulty by 1 when Harder is selected and preserves scope', () => {
    const courseId = 'COURSE-GEN0102';
    const topicId = 'CURR-GEN0102-U1-T04';

    // Start session at difficulty 2
    const session = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicId,
      policy: {
        forceDifficulty: 2
      }
    });

    const firstProb = session.currentProblem!;
    expect(firstProb).toBeDefined();
    const initialDiff = Math.round(firstProb.dna.difficultyVector.overall);
    expect(initialDiff).toBe(2);

    const targetHarderDiff = Math.min(4, initialDiff + 1); // 3

    // Request Harder problem
    const harderRes = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceTopicId: topicId,
      forceSkillId: firstProb.dna.primarySkillId,
      forceDifficulty: targetHarderDiff
    });

    expect(harderRes.problem).toBeDefined();
    expect(Math.round(harderRes.problem!.dna.difficultyVector.overall)).toBe(3);
    expect(harderRes.problem!.dna.problemId).not.toBe(firstProb.dna.problemId);
    expect(harderRes.decision.targetTopicId).toBe(topicId);
    expect(harderRes.problem!.dna.topicId).toBe(topicId);
  });

  /* ========================================================================= */
  /* 3. Easier Control: Decreases Difficulty Relative to Current Problem       */
  /* ========================================================================= */
  it('decreases difficulty by 1 when Easier is selected and preserves scope', () => {
    const courseId = 'COURSE-GEN0102';
    const topicId = 'CURR-GEN0102-U1-T04';

    // Start session with difficulty 3
    const session = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicId,
      policy: {
        forceDifficulty: 3
      }
    });

    const firstProb = session.currentProblem!;
    expect(firstProb).toBeDefined();
    const initialDiff = Math.round(firstProb.dna.difficultyVector.overall);
    expect(initialDiff).toBe(3);

    const targetEasierDiff = Math.max(1, initialDiff - 1); // 2

    // Request Easier problem
    const easierRes = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceTopicId: topicId,
      forceSkillId: firstProb.dna.primarySkillId,
      forceDifficulty: targetEasierDiff
    });

    expect(easierRes.problem).toBeDefined();
    expect(Math.round(easierRes.problem!.dna.difficultyVector.overall)).toBe(2);
    expect(easierRes.problem!.dna.problemId).not.toBe(firstProb.dna.problemId);
    expect(easierRes.decision.targetTopicId).toBe(topicId);
    expect(easierRes.problem!.dna.topicId).toBe(topicId);
  });

  /* ========================================================================= */
  /* 4. Boundary Clamping: Level 1 and Level 4 Limits                         */
  /* ========================================================================= */
  it('clamps difficulty to Level 1 minimum and Level 4 maximum', () => {
    const courseId = 'COURSE-GEN0102';
    const topicId = 'CURR-GEN0102-U1-T04';

    const session = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicId,
      policy: {
        forceDifficulty: 1
      }
    });

    const firstProb = session.currentProblem!;
    const diff1 = Math.round(firstProb.dna.difficultyVector.overall);
    expect(diff1).toBe(1);

    // Requesting easier at Level 1 should remain clamped to Level 1
    const clampedEasier = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceTopicId: topicId,
      forceSkillId: firstProb.dna.primarySkillId,
      forceDifficulty: Math.max(1, diff1 - 1)
    });

    expect(clampedEasier.problem).toBeDefined();
    expect(Math.round(clampedEasier.problem!.dna.difficultyVector.overall)).toBe(1);
    expect(clampedEasier.problem!.dna.problemId).not.toBe(firstProb.dna.problemId);

    // Requesting harder up to Level 4
    const maxHarder = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceTopicId: topicId,
      forceSkillId: firstProb.dna.primarySkillId,
      forceDifficulty: 4
    });

    expect(maxHarder.problem).toBeDefined();
    expect(Math.round(maxHarder.problem!.dna.difficultyVector.overall)).toBe(4);
    expect(maxHarder.problem!.dna.problemId).not.toBe(clampedEasier.problem!.dna.problemId);
  });

  /* ========================================================================= */
  /* 5. Sequence Invariant: Repeated "Another Like This" Never Duplicates     */
  /* ========================================================================= */
  it('guarantees unique problem IDs across consecutive "Another Like This" requests', () => {
    const courseId = 'COURSE-GEN0102';
    const topicId = 'CURR-GEN0102-U1-T04';

    const session = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicId
    });

    const seenProblemIds = new Set<string>();
    seenProblemIds.add(session.currentProblemId);

    for (let step = 0; step < 3; step++) {
      const res = UnifiedPracticeStore.nextProblem(session.id, {
        courseId,
        forceTopicId: topicId,
        forceSkillId: session.currentProblem!.dna.primarySkillId
      });

      expect(res.problem).toBeDefined();
      expect(seenProblemIds.has(res.problem!.dna.problemId)).toBe(false);
      seenProblemIds.add(res.problem!.dna.problemId);
      expect(res.problem!.dna.topicId).toBe(topicId);
    }
  });

  /* ========================================================================= */
  /* 6. Multi-Course Invariant: Controls Strictly Preserve Course and Topic   */
  /* ========================================================================= */
  it('preserves course and topic scope across all courses when using adaptive controls', () => {
    const courseIds = [
      'COURSE-GEN0101',
      'COURSE-GEN0102',
      'COURSE-GEN0107',
      'COURSE-GEN0110',
      'COURSE-GEN0161',
      'COURSE-BSIE3219'
    ];

    for (const courseId of courseIds) {
      const families = ContentRegistry.getInstance().getFamiliesByCourse(courseId);
      expect(families.length).toBeGreaterThanOrEqual(1);
      const skill = curriculumRegistry.getSkillById(families[0].primarySkillId);
      expect(skill).toBeDefined();
      const targetTopicId = skill!.parentTopicId;

      const session = UnifiedPracticeStore.startSession(courseId, {
        mode: 'TOPIC_PRACTICE',
        targetTopicId
      });

      expect(session.currentProblem).toBeDefined();
      expect(session.currentProblem!.dna.courseId).toBe(courseId);
      expect(session.currentProblem!.dna.topicId).toBe(targetTopicId);

      // 1. Request Harder
      const harder = UnifiedPracticeStore.nextProblem(session.id, {
        courseId,
        forceTopicId: targetTopicId,
        forceSkillId: session.currentProblem!.dna.primarySkillId,
        forceDifficulty: 3
      });
      expect(harder.problem).toBeDefined();
      expect(harder.problem!.dna.courseId).toBe(courseId);
      expect(harder.problem!.dna.topicId).toBe(targetTopicId);

      // 2. Request Another Like This
      const another = UnifiedPracticeStore.nextProblem(session.id, {
        courseId,
        forceTopicId: targetTopicId,
        forceSkillId: harder.problem!.dna.primarySkillId
      });
      expect(another.problem).toBeDefined();
      expect(another.problem!.dna.problemId).not.toBe(harder.problem!.dna.problemId);
      expect(another.problem!.dna.courseId).toBe(courseId);
      expect(another.problem!.dna.topicId).toBe(targetTopicId);
    }
  });

  /* ========================================================================= */
  /* 7. Dynamic Generation on Bank Miss: Generates at Exact Target Difficulty */
  /* ========================================================================= */
  it('dynamically generates problem when bank has no matching candidate at requested difficulty', () => {
    const courseId = 'COURSE-GEN0102';
    const topicId = 'CURR-GEN0102-U1-T04';
    const skillId = 'SKILL-GEN0102-005';

    const session = UnifiedPracticeStore.startSession(courseId, {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: topicId,
      targetSkillId: skillId,
      policy: {
        forceDifficulty: 1
      }
    });

    const initialProb = session.currentProblem!;
    expect(initialProb).toBeDefined();
    expect(initialProb.dna.primarySkillId).toBe(skillId);

    // Request difficulty 4 which may not exist pre-cached in bank
    const res = UnifiedPracticeStore.nextProblem(session.id, {
      courseId,
      forceTopicId: topicId,
      forceSkillId: skillId,
      forceDifficulty: 4
    });

    expect(res.problem).toBeDefined();
    expect(res.problem!.dna.primarySkillId).toBe(skillId);
    expect(res.problem!.dna.topicId).toBe(topicId);
    expect(Math.round(res.problem!.dna.difficultyVector.overall)).toBe(4);
    expect(res.problem!.dna.problemId).not.toBe(initialProb.dna.problemId);
  });
});
