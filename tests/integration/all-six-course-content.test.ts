import { describe, it, expect } from 'vitest';
import { ContentRegistry } from '../../src/engine/content/registry';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ProblemBank } from '../../src/engine/content/problemBank';
import { CurriculumRegistry } from '../../src/engine/curriculum/registry';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';

describe('All Six Courses Full Integration & Multi-Domain Content Pipeline', () => {
  const contentRegistry = ContentRegistry.getInstance();
  const curr = CurriculumRegistry.getInstance();
  const bank = ProblemBank.getInstance();

  const courseIds = [
    'COURSE-GEN0101',
    'COURSE-GEN0102',
    'COURSE-GEN0107',
    'COURSE-GEN0110',
    'COURSE-GEN0161',
    'COURSE-BSIE3219'
  ];

  it('verifies all six courses have active topics, skills, and problem families', () => {
    for (const courseId of courseIds) {
      const course = curr.getCourseById(courseId);
      expect(course).toBeDefined();

      const topics = curr.getTopicsByCourse(courseId);
      expect(topics.length).toBeGreaterThanOrEqual(1);

      const skills = curr.getSkillsByCourse(courseId);
      expect(skills.length).toBeGreaterThanOrEqual(5);

      const families = contentRegistry.getFamiliesByCourse(courseId);
      expect(families.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('executes end-to-end generation and validation across all registered families in all 6 courses', () => {
    const allFamilies = contentRegistry.getAllFamilies();
    expect(allFamilies.length).toBeGreaterThanOrEqual(30);

    for (const family of allFamilies) {
      const res = ContentGenerator.generateForSkill({
        courseId: family.courseId as any,
        skillId: family.primarySkillId,
        familyId: family.id,
        evidenceType: family.primaryEvidenceType
      });

      expect(res.success).toBe(true);
      expect(res.problem).toBeDefined();

      if (res.problem) {
        const valReport = ContentValidator.validateProblemCandidate(res.problem);
        expect(valReport.isValid).toBe(true);
        expect(valReport.domainValidation?.valid).toBe(true);
        expect(valReport.domainValidation?.status).toBe('PASS');
        expect(res.problem.solution.reasoningTrace.length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('checks the six-course readiness summary metrics', () => {
    const readiness = contentRegistry.getCourseReadinessSummary();
    expect(readiness.length).toBe(6);

    const calculus = readiness.find(r => r.courseId === 'COURSE-GEN0102');
    expect(calculus?.status).toBe('PILOT');

    const others = readiness.filter(r => r.courseId !== 'COURSE-GEN0102');
    for (const item of others) {
      expect(['REPRESENTATIVE_READY', 'CALIBRATING']).toContain(item.status);
    }
  });

  it('keeps every authoritative skill and topic selectable without NO_ELIGIBLE_PROBLEM', () => {
    for (const courseId of courseIds) {
      for (const skill of curr.getSkillsByCourse(courseId)) {
        expect(contentRegistry.getFamiliesBySkill(skill.id).length).toBeGreaterThan(0);
        const generated = ContentGenerator.generateForSkill({
          courseId: courseId as any,
          skillId: skill.id,
          difficulty: 1,
          evidenceType: skill.evidenceTypes[0] as any
        });
        expect(generated.success, `${courseId}/${skill.id} should generate`).toBe(true);
        expect(generated.problem?.dna.topicId).toBe(skill.parentTopicId);
        expect(generated.problem?.dna.courseId).toBe(courseId);
      }

      for (const topic of curr.getTopicsByCourse(courseId)) {
        const skillsInTopic = curr.getSkillsByTopic(topic.id);
        if (skillsInTopic.length === 0) continue;

        const decision = AdaptiveSelector.selectNextBestProblem(
          `coverage-${courseId}-${topic.id}`,
          { courseId, topicId: topic.id, mode: 'TOPIC_PRACTICE', excludeProblemIds: [], excludeSignatures: [] }
        );
        expect(decision.selectedProblemId, `${courseId}/${topic.id} should have an eligible problem`).not.toBe('NO_ELIGIBLE_PROBLEM');
        expect(decision.selectedProblem?.dna.courseId).toBe(courseId);
        expect(decision.selectedProblem?.dna.topicId).toBe(topic.id);
      }
    }
  });
});
