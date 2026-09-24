import { describe, it, expect } from 'vitest';
import { ContentRegistry } from '../../src/engine/content/registry';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ProblemBank } from '../../src/engine/content/problemBank';
import { DomainValidatorRegistry } from '../../src/engine/content/domainValidators';

describe('Thermodynamics (GEN 0161) Domain Content & Physical Laws Tests', () => {
  const contentRegistry = ContentRegistry.getInstance();
  const bank = ProblemBank.getInstance();

  it('generates and validates thermodynamic candidates respecting physical conservation laws', () => {
    const families = contentRegistry.getFamiliesByCourse('COURSE-GEN0161');
    expect(families.length).toBeGreaterThanOrEqual(3);

    for (const family of families) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0161',
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

  it('rejects unphysical Carnot efficiency exceeding 100% or violating temperature bounds', () => {
    const impossibleEngine: any = {
      rawExpression: { type: 'CONSTANT', value: 120 },
      statement: {
        promptText: 'A heat engine operates between T_H = 500 K and T_L = 300 K claiming efficiency:',
        expressionLatex: '\\eta = 120\\%',
        targetVariable: '\\eta',
        physicalUnits: '%'
      },
      solution: { canonicalAnswerLatex: '120%' },
      hints: [],
      dna: { domainValidatorType: 'THERMODYNAMICS' }
    };

    const res = DomainValidatorRegistry.validateThermodynamics(impossibleEngine);
    expect(res.valid).toBe(false);
    expect(res.status).toBe('FAIL');
    expect(res.errors.some(e => e.code === 'EFFICIENCY_EXCEEDS_100_PERCENT' || e.code === 'CARNOT_LIMIT_EXCEEDED')).toBe(true);
  });

  it('rejects negative absolute temperatures in Kelvin', () => {
    const negativeTempProblem: any = {
      rawExpression: { type: 'CONSTANT', value: 1 },
      statement: {
        promptText: 'An ideal gas is held at temperature T = -50 K in a cylinder:',
        expressionLatex: 'T = -50\\text{ K}',
        targetVariable: 'P'
      },
      solution: { canonicalAnswerLatex: '10 kPa' },
      hints: [],
      dna: { domainValidatorType: 'THERMODYNAMICS' }
    };

    const res = DomainValidatorRegistry.validateThermodynamics(negativeTempProblem);
    expect(res.valid).toBe(false);
    expect(res.status).toBe('FAIL');
    expect(res.errors.some(e => e.code === 'THIRD_LAW_TEMPERATURE_VIOLATION')).toBe(true);
  });

  it('verifies seeded GEN 0161 problems in the bank are marked AWAITING_TEACHER_REVIEW', () => {
    const problems = bank.getProblemsByCourse('COURSE-GEN0161');
    expect(problems.length).toBeGreaterThanOrEqual(5);

    for (const prob of problems) {
      expect(prob.lifecycleStatus).toBe('AWAITING_TEACHER_REVIEW');
    }
  });
});
