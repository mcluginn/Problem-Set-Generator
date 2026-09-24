import { describe, it, expect } from 'vitest';
import { ContentRegistry } from '../../src/engine/content/registry';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ProblemBank } from '../../src/engine/content/problemBank';
import { DomainValidatorRegistry } from '../../src/engine/content/domainValidators';

describe('Differential Equations (GEN 0107) Domain Content & Golden Tests', () => {
  const contentRegistry = ContentRegistry.getInstance();
  const bank = ProblemBank.getInstance();

  it('generates and validates representative ODE candidates across registered families', () => {
    const families = contentRegistry.getFamiliesByCourse('COURSE-GEN0107');
    expect(families.length).toBeGreaterThanOrEqual(3);

    for (const family of families) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0107',
        skillId: family.primarySkillId,
        familyId: family.id,
        evidenceType: family.primaryEvidenceType
      });
      console.log('GEN0107 FAMILY TEST:', family.id, res.success, res.rejectionReason, res.rejectionDetails);
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

  it('rejects invalid ODE syntax lacking differential operators or primes', () => {
    const fakeODE: any = {
      rawExpression: { type: 'CONSTANT', value: 1 },
      statement: {
        promptText: 'Solve the algebraic equation:',
        expressionLatex: '3x + 4 = 10',
        targetVariable: 'x'
      },
      solution: { canonicalAnswerLatex: '2' },
      hints: [],
      dna: { domainValidatorType: 'ODE', evidenceType: 'DIRECT_CALCULATION', templateId: 'TMPL-CUSTOM' }
    };

    const res = DomainValidatorRegistry.validateODE(fakeODE);
    expect(res.valid).toBe(false);
    expect(res.status).toBe('FAIL');
    expect(res.errors.some(e => e.code === 'ODE_SYNTAX_ERROR')).toBe(true);
  });

  it('verifies seeded GEN 0107 problems in the bank are marked AWAITING_TEACHER_REVIEW', () => {
    const problems = bank.getProblemsByCourse('COURSE-GEN0107');
    expect(problems.length).toBeGreaterThanOrEqual(5);

    for (const prob of problems) {
      expect(prob.lifecycleStatus).toBe('AWAITING_TEACHER_REVIEW');
    }
  });
});
