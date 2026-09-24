/**
 * Problem Candidate Validation Tests
 * Engineering Practice Engine — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { ContentValidator } from '@/engine/content/validator';
import { ContentGenerator } from '@/engine/content/generator';
import { ValidatedProblem } from '@/engine/content/types';

describe('Content & Mathematical Validator Engine', () => {
  it('validates standard generated candidate successfully', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      evidenceType: 'DIRECT_CALCULATION'
    });

    expect(res.success).toBe(true);
    if (res.problem) {
      const val = ContentValidator.validateProblemCandidate(res.problem);
      expect(val.isValid).toBe(true);
      expect(val.checks.syntaxValid).toBe(true);
      expect(val.checks.domainValid).toBe(true);
      expect(val.checks.solutionConsistent).toBe(true);
      expect(val.checks.skillAligned).toBe(true);
      expect(val.checks.evidenceAligned).toBe(true);
      expect(val.checks.hintIntegrityPassed).toBe(true);
    }
  });

  it('rejects candidate with missing expression or syntax errors', () => {
    const invalidProb: any = {
      dna: {
        primarySkillId: 'SKILL-GEN0102-005',
        evidenceType: 'DIRECT_CALCULATION'
      },
      statement: {},
      rawExpression: null,
      solution: { canonicalAnswerLatex: '' },
      hints: []
    };

    const val = ContentValidator.validateProblemCandidate(invalidProb);
    expect(val.isValid).toBe(false);
    expect(val.rejectionReason).toBe('INVALID_SYNTAX');
  });

  it('rejects candidate with missing error analysis work', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      evidenceType: 'DIRECT_CALCULATION'
    });

    if (res.problem) {
      const cloned: ValidatedProblem = {
        ...res.problem,
        dna: {
          ...res.problem.dna,
          evidenceType: 'ERROR_ANALYSIS'
        },
        statement: {
          ...res.problem.statement,
          givenWorkLatex: undefined
        }
      };

      const val = ContentValidator.validateProblemCandidate(cloned);
      expect(val.isValid).toBe(false);
      expect(val.rejectionReason).toBe('EVIDENCE_MISMATCH');
    }
  });
});
