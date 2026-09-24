/**
 * Limit Answer Validator & Equivalence Unit Tests
 * Verifies that limit evaluation problems accept correct numerical and symbolic answers
 */

import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '../../src/engine/content/generator';
import { problemBank } from '../../src/engine/content/problemBank';
import { EquivalenceEngine } from '../../src/engine/math/equivalence';
import { MathParser } from '../../src/engine/math/parser';

describe('Unit: Limit Answer Validator (SKILL-GEN0102-001)', () => {
  it('generates a limit problem with correct evaluated canonical answer (not 0)', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-001',
      familyId: 'FAM-GEN0102-LIMITS-ALG',
      templateId: 'TMPL-LIMIT-POLY-CANCEL'
    });

    expect(res.success).toBe(true);
    expect(res.problem).toBeDefined();

    const problem = res.problem!;
    // For a=3: (x^2 - 9)/(x - 3) as x -> 3 is 6
    expect(problem.solution.canonicalAnswerLatex).toBe('6');
    expect(problem.solution.canonicalAnswerRaw).toBe('6');
    expect(problem.solution.solutionSteps.length).toBeGreaterThan(0);
  });

  it('validates student answer 6 as mathematically equivalent to canonical limit answer', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-001',
      familyId: 'FAM-GEN0102-LIMITS-ALG',
      templateId: 'TMPL-LIMIT-POLY-CANCEL'
    });

    const problem = res.problem!;
    const studentAns = '6';

    const cleanStudent = studentAns.trim();
    const cleanCanonical = problem.solution.canonicalAnswerLatex.trim();

    // Check direct match
    expect(cleanStudent).toBe(cleanCanonical);

    // Check numerical evaluation
    const studentNum = parseFloat(cleanStudent);
    const canonicalNum = parseFloat(cleanCanonical);
    expect(Math.abs(studentNum - canonicalNum)).toBeLessThan(0.01);

    // Check AST equivalence engine
    const studentAst = MathParser.parse(studentAns);
    const canonicalAst = MathParser.parse(problem.solution.canonicalAnswerRaw);
    const eqResult = EquivalenceEngine.check(studentAst, canonicalAst);
    expect(eqResult.equivalent).toBe(true);
  });
});
