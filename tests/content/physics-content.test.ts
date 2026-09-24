import { describe, it, expect } from 'vitest';
import { ContentRegistry } from '../../src/engine/content/registry';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ProblemBank } from '../../src/engine/content/problemBank';
import { DomainValidatorRegistry } from '../../src/engine/content/domainValidators';

describe('Physics 2 for Engineers (GEN 0110) Domain Content & Physical Invariants Tests', () => {
  const contentRegistry = ContentRegistry.getInstance();
  const bank = ProblemBank.getInstance();

  it('generates and validates physics candidates with explicit physical units and positive constants', () => {
    const families = contentRegistry.getFamiliesByCourse('COURSE-GEN0110');
    expect(families.length).toBeGreaterThanOrEqual(3);

    for (const family of families) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0110',
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
      }
    }
  });

  it('fails validation for unphysical negative resistance in DC circuits', () => {
    const unphysicalProblem: any = {
      rawExpression: { type: 'CONSTANT', value: 1 },
      statement: {
        promptText: 'Calculate the circuit current with R = -5 ohms and V = 10 V:',
        expressionLatex: 'I = V / R',
        targetVariable: 'I',
        physicalUnits: 'A'
      },
      solution: { canonicalAnswerLatex: '-2 A' },
      hints: [],
      dna: { domainValidatorType: 'PHYSICS_UNITS' }
    };

    const res = DomainValidatorRegistry.validatePhysics(unphysicalProblem);
    expect(res.valid).toBe(false);
    expect(res.status).toBe('FAIL');
    expect(res.errors.some(e => e.code === 'NON_PHYSICAL_RESISTANCE')).toBe(true);
  });

  it('fails validation for unphysical refractive index less than 1.0', () => {
    const unphysicalProblem: any = {
      rawExpression: { type: 'CONSTANT', value: 1 },
      statement: {
        promptText: 'A light ray passes into a medium with refractive index n = 0.5:',
        expressionLatex: 'n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)',
        targetVariable: 'n'
      },
      solution: { canonicalAnswerLatex: '0.5' },
      hints: [],
      dna: { domainValidatorType: 'PHYSICS_UNITS' }
    };

    const res = DomainValidatorRegistry.validatePhysics(unphysicalProblem);
    expect(res.valid).toBe(false);
    expect(res.status).toBe('FAIL');
    expect(res.errors.some(e => e.code === 'INVALID_REFRACTIVE_INDEX')).toBe(true);
  });

  it('verifies seeded GEN 0110 problems in the bank are marked AWAITING_TEACHER_REVIEW', () => {
    const problems = bank.getProblemsByCourse('COURSE-GEN0110');
    expect(problems.length).toBeGreaterThanOrEqual(5);

    for (const prob of problems) {
      expect(prob.lifecycleStatus).toBe('AWAITING_TEACHER_REVIEW');
    }
  });
});
