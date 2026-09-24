import { describe, it, expect } from 'vitest';
import { resolveTopicPracticeScope } from '@/components/dashboard/curriculumScopeResolver';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { UnifiedPracticeStore } from '@/engine/adaptive/store';

describe('curriculumScopeResolver', () => {
  it('resolves direct topic and skill for 1-skill topic', () => {
    const topic = curriculumRegistry.getTopicById('CURR-GEN0102-U1-T03')!;
    const res = resolveTopicPracticeScope('COURSE-GEN0102', topic);
    expect(res.effectiveTopicId).toBe('CURR-GEN0102-U1-T03');
    // T03 has 1 skill: 001
    expect(res.targetSkillId).toBe('SKILL-GEN0102-001');
  });

  it('resolves topic practice with undefined targetSkillId for multi-skill topic', () => {
    const topic = curriculumRegistry.getTopicById('CURR-GEN0102-U1-T04')!;
    const res = resolveTopicPracticeScope('COURSE-GEN0102', topic);
    expect(res.effectiveTopicId).toBe('CURR-GEN0102-U1-T04');
    // T04 has 2 skills: 002 and 003
    expect(res.targetSkillId).toBeUndefined();
  });

  it('resolves safe fallback for 0-skill topic CURR-GEN0102-U1-T01 without error', () => {
    UnifiedPracticeStore.initialize();
    const topic = curriculumRegistry.getTopicById('CURR-GEN0102-U1-T01')!;
    const res = resolveTopicPracticeScope('COURSE-GEN0102', topic);
    expect(res.effectiveTopicId).toBeDefined();
    expect(res.targetSkillId).toBeDefined();

    const session = UnifiedPracticeStore.startSession('COURSE-GEN0102', {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: res.effectiveTopicId,
      targetSkillId: res.targetSkillId
    });
    expect(session.currentProblem).toBeDefined();
    expect(session.currentProblemId).not.toBe('NO_ELIGIBLE_PROBLEM');
  });

  it('resolves safe fallback for 0-skill topic CURR-GEN0102-U1-T02 without error', () => {
    UnifiedPracticeStore.initialize();
    const topic = curriculumRegistry.getTopicById('CURR-GEN0102-U1-T02')!;
    const res = resolveTopicPracticeScope('COURSE-GEN0102', topic);
    expect(res.effectiveTopicId).toBeDefined();
    expect(res.targetSkillId).toBeDefined();

    const session = UnifiedPracticeStore.startSession('COURSE-GEN0102', {
      mode: 'TOPIC_PRACTICE',
      targetTopicId: res.effectiveTopicId,
      targetSkillId: res.targetSkillId
    });
    expect(session.currentProblem).toBeDefined();
    expect(session.currentProblemId).not.toBe('NO_ELIGIBLE_PROBLEM');
  });
});
