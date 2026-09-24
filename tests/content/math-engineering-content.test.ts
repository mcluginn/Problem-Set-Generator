import { describe, it, expect } from 'vitest';
import { ContentRegistry } from '../../src/engine/content/registry';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ProblemBank } from '../../src/engine/content/problemBank';
import { DomainValidatorRegistry } from '../../src/engine/content/domainValidators';

describe('Mathematics for Engineers (GEN 0101) Domain Content & Golden Tests', () => {
  const contentRegistry = ContentRegistry.getInstance();
  const bank = ProblemBank.getInstance();

  it('verifies all registered GEN 0101 families generate valid mathematical candidates', () => {
    const families = contentRegistry.getFamiliesByCourse('COURSE-GEN0101');
    expect(families.length).toBeGreaterThanOrEqual(4);

    for (const family of families) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0101',
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

  it('tests domain validator rejection for impossible triangle inequality parameters', () => {
    const fakeProblem: any = {
      rawExpression: { type: 'CONSTANT', value: 1 },
      statement: {
        promptText: 'A triangle has sides a = 2, b = 3, c = 10. Solve for angles:',
        expressionLatex: 'a + b < c',
        targetVariable: 'x'
      },
      solution: { canonicalAnswerLatex: '1' },
      hints: [],
      dna: { domainValidatorType: 'MATH_FOR_ENGINEERS' }
    };

    const res = DomainValidatorRegistry.validateMathForEngineers(fakeProblem);
    expect(res.valid).toBe(false);
    expect(res.status).toBe('FAIL');
    expect(res.errors.some(e => e.code === 'TRIANGLE_INEQUALITY_VIOLATION')).toBe(true);
  });

  it('verifies representative GEN 0101 problems in the bank are marked AWAITING_TEACHER_REVIEW', () => {
    const problems = bank.getProblemsByCourse('COURSE-GEN0101');
    expect(problems.length).toBeGreaterThanOrEqual(5);

    for (const prob of problems) {
      expect(prob.lifecycleStatus).toBe('AWAITING_TEACHER_REVIEW');
    }
  });
});
