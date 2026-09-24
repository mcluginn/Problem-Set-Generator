/**
 * End-to-End Vertical Slice Integration Test
 * Syllabus -> Course -> Topic -> Subtopic -> Skill -> Assessment Evidence -> Problem Family -> Problem Template -> Candidate -> Validation -> Problem Bank -> Teacher Review
 */

import { describe, it, expect } from 'vitest';
import { CurriculumRegistry } from '@/engine/curriculum/registry';
import { ASSESSMENT_EVIDENCE_REGISTRY, CALCULUS_SKILL_EVIDENCE_MAP } from '@/engine/content/assessmentEvidence';
import { PROBLEM_FAMILIES_REGISTRY } from '@/engine/content/problemFamilies';
import { PROBLEM_TEMPLATES_REGISTRY } from '@/engine/content/problemTemplates';
import { ContentGenerator } from '@/engine/content/generator';
import { ContentValidator } from '@/engine/content/validator';
import { ProblemBank } from '@/engine/content/problemBank';

describe('Vertical Slice: Full Syllabus-to-Problem Traceability Integration', () => {
  const currRegistry = CurriculumRegistry.getInstance();
  const bank = ProblemBank.getInstance();

  it('traces Chain Rule from institutional syllabus down to teacher review and student delivery', () => {
    // 1. Syllabus & Course
    const course = currRegistry.getCourseById('COURSE-GEN0102');
    expect(course).toBeDefined();
    expect(course?.code).toBe('GEN 0102');

    // 2. Unit & Topic
    const topic = currRegistry.getTopicById('CURR-GEN0102-U1-T04');
    expect(topic).toBeDefined();

    // 3. Learning Skill
    const skill = currRegistry.getSkillById('SKILL-GEN0102-005');
    expect(skill).toBeDefined();
    expect(skill?.canonicalName).toBe('Apply the Chain Rule to differentiate composite functions');
    expect(skill?.sourceType).toBe('SYLLABUS_EXPLICIT');

    // 4. Assessment Evidence
    const evidenceMapping = CALCULUS_SKILL_EVIDENCE_MAP[skill!.id];
    expect(evidenceMapping).toBeDefined();
    const primaryEvidence = ASSESSMENT_EVIDENCE_REGISTRY[evidenceMapping.primaryEvidence];
    expect(primaryEvidence.id).toBe('DIRECT_CALCULATION');

    // 5. Problem Family
    const family = PROBLEM_FAMILIES_REGISTRY['FAM-GEN0102-CHAIN-POLY'];
    expect(family).toBeDefined();
    expect(family.primarySkillId).toBe(skill!.id);

    // 6. Problem Template
    const template = PROBLEM_TEMPLATES_REGISTRY['TMPL-CHAIN-POLY-STD'];
    expect(template).toBeDefined();
    expect(template.familyId).toBe(family.id);

    // 7. Deterministic Generation & Solving
    const genResult = ContentGenerator.generateForSkill({
      courseId: course!.id,
      skillId: skill!.id,
      evidenceType: 'DIRECT_CALCULATION',
      difficulty: 3
    });

    expect(genResult.success).toBe(true);
    const problem = genResult.problem!;
    expect(problem).toBeDefined();

    // 8. Content & Mathematical Validation
    const valReport = ContentValidator.validateProblemCandidate(problem);
    expect(valReport.isValid).toBe(true);

    // 9. Problem Bank Storage & Retrieval
    bank.storeProblem(problem);
    const retrieved = bank.getProblemById(problem.dna.problemId);
    expect(retrieved).toBeDefined();
    expect(retrieved?.dna.primarySkillId).toBe(skill!.id);

    // 10. Teacher Review Lifecycle Update
    const updated = bank.updateLifecycleStatus(problem.dna.problemId, 'APPROVED');
    expect(updated).toBe(true);
    expect(bank.getProblemById(problem.dna.problemId)?.lifecycleStatus).toBe('APPROVED');
  });
});
