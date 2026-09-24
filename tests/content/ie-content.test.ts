import { describe, it, expect } from 'vitest';
import { ContentRegistry } from '../../src/engine/content/registry';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ProblemBank } from '../../src/engine/content/problemBank';
import { DomainValidatorRegistry } from '../../src/engine/content/domainValidators';

describe('IE Special Topics 1 (BSIE 3219) Domain Content & Economic Invariants Tests', () => {
  const contentRegistry = ContentRegistry.getInstance();
  const bank = ProblemBank.getInstance();

  it('generates and validates industrial engineering economy and optimization candidates', () => {
    const families = contentRegistry.getFamiliesByCourse('COURSE-BSIE3219');
    expect(families.length).toBeGreaterThanOrEqual(3);

    for (const family of families) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-BSIE3219',
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

  it('rejects unphysical economic models where salvage value exceeds initial cost', () => {
    const invalidEconProblem: any = {
      rawExpression: { type: 'CONSTANT', value: 1 },
      statement: {
        promptText: 'An asset costs $20,000 and has a salvage value of $35,000 after 5 years:',
        expressionLatex: 'D = (C - S)/N',
        targetVariable: 'D'
      },
      solution: { canonicalAnswerLatex: '-3000' },
      hints: [],
      dna: { domainValidatorType: 'IE_SPECIAL_TOPICS' }
    };

    const res = DomainValidatorRegistry.validateIESpecialTopics(invalidEconProblem);
    expect(res.valid).toBe(false);
    expect(res.status).toBe('FAIL');
    expect(res.errors.some(e => e.code === 'SALVAGE_VALUE_EXCEEDS_COST')).toBe(true);
  });

  it('verifies seeded BSIE 3219 problems in the bank are marked AWAITING_TEACHER_REVIEW', () => {
    const problems = bank.getProblemsByCourse('COURSE-BSIE3219');
    expect(problems.length).toBeGreaterThanOrEqual(5);

    for (const prob of problems) {
      expect(prob.lifecycleStatus).toBe('AWAITING_TEACHER_REVIEW');
    }
  });
});
