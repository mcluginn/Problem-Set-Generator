import { describe, it, expect } from 'vitest';
import { ContentRegistry } from '../../src/engine/content/registry';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ProblemBank } from '../../src/engine/content/problemBank';
import { CurriculumRegistry } from '../../src/engine/curriculum/registry';

describe('Calculus 1 (GEN 0102) Domain Golden Tests & Content Coverage', () => {
  const contentRegistry = ContentRegistry.getInstance();
  const curr = CurriculumRegistry.getInstance();
  const bank = ProblemBank.getInstance();

  it('covers all 15 Calculus 1 skills with active problem families', () => {
    const calculusSkills = curr.getAllSkills().filter(s => s.parentCourseId === 'COURSE-GEN0102');
    expect(calculusSkills.length).toBe(15);

    for (const skill of calculusSkills) {
      const families = contentRegistry.getFamiliesBySkill(skill.id);
      expect(families.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('generates and validates representative problems across all Calculus 1 families', () => {
    const calculusFamilies = contentRegistry.getFamiliesByCourse('COURSE-GEN0102');
    expect(calculusFamilies.length).toBeGreaterThanOrEqual(10);

    for (const family of calculusFamilies) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0102',
        skillId: family.primarySkillId,
        familyId: family.id,
        evidenceType: family.primaryEvidenceType
      });

      expect(res.success).toBe(true);
      expect(res.problem).toBeDefined();

      if (res.problem) {
        const valReport = ContentValidator.validateProblemCandidate(res.problem);
        expect(valReport.isValid).toBe(true);
        expect(valReport.domainValidation).toBeDefined();
        expect(valReport.domainValidation?.valid).toBe(true);
        expect(valReport.domainValidation?.status).toBe('PASS');
      }
    }
  });

  it('verifies pilot calibrated problems in the bank are marked APPROVED', () => {
    const bankProblems = bank.getProblemsByCourse('COURSE-GEN0102');
    expect(bankProblems.length).toBeGreaterThanOrEqual(10);

    for (const problem of bankProblems) {
      expect(problem.lifecycleStatus).toBe('APPROVED');
      expect(problem.dna.courseId).toBe('COURSE-GEN0102');
    }
  });
});
