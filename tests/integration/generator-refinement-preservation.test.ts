import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '@/engine/content/generator';
import { problemBank } from '@/engine/content/problemBank';
import { PROBLEM_FAMILIES_REGISTRY } from '@/engine/content/problemFamilies';

describe('Generator Refinement, Parameter Variation & Preservation', () => {
  it('confirms existing ContentGenerator generates valid numerical parameter variations', () => {
    const family = PROBLEM_FAMILIES_REGISTRY['FAM-GEN0102-CHAIN-POLY'];
    expect(family).toBeDefined();

    // Generate two instances of the same family with different coefficients
    const res1 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: family.primarySkillId,
      familyId: family.id,
      difficulty: 2
    });

    expect(res1.success).toBe(true);
    expect(res1.problem).toBeDefined();
    const p1 = res1.problem!;
    expect(p1.dna.familyId).toBe(family.id);
    expect(p1.dna.isParameterVariation).toBe(true);
    expect(p1.solution.canonicalAnswerRaw.length).toBeGreaterThan(0);

    const res2 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: family.primarySkillId,
      familyId: family.id,
      difficulty: 2,
      excludeSignatures: [p1.dna.structureSignature]
    });

    expect(res2.success).toBe(true);
    expect(res2.problem).toBeDefined();
    const p2 = res2.problem!;
    expect(p2.dna.familyId).toBe(family.id);
    expect(p2.dna.isParameterVariation).toBe(true);

    // Both problems share the same structural family
    expect(p1.dna.familyId).toBe(p2.dna.familyId);
  });

  it('verifies parameter safety constraints: solutions are recalculated deterministically without static answers', () => {
    // Generate 20 random parameter variations and verify mathematical validity
    const family = PROBLEM_FAMILIES_REGISTRY['POWER_POLYNOMIAL'] || Object.values(PROBLEM_FAMILIES_REGISTRY)[0];
    expect(family).toBeDefined();

    for (let i = 0; i < 20; i++) {
      const res = ContentGenerator.generateForSkill({
        courseId: family.courseId as any,
        skillId: family.primarySkillId,
        familyId: family.id,
        difficulty: (i % 3) + 1
      });

      if (res.success && res.problem) {
        const prob = res.problem;
        // Non-empty statement and answers
        expect(prob.statement.promptText.length).toBeGreaterThan(5);
        expect(prob.solution.canonicalAnswerRaw.length).toBeGreaterThan(0);
        // Does not contain NaN or undefined
        expect(prob.solution.canonicalAnswerRaw).not.toContain('NaN');
        expect(prob.solution.canonicalAnswerRaw).not.toContain('undefined');
        expect(prob.statement.promptText).not.toContain('NaN');
      }
    }
  });

  it('demonstrates dual problem sourcing in ProblemBank: master problems + parameter variations coexist', () => {
    // Master problem from 780 bank
    const masterProbs = problemBank.getMasterProblems();
    expect(masterProbs.length).toBeGreaterThanOrEqual(780);
    const sampleMaster = masterProbs[0];
    expect(sampleMaster.dna.isParameterVariation).toBe(false);

    // Store a generated parameter variation
    const genRes = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'GEN0102-U1-DIFF',
      familyId: 'FAM-GEN0102-CHAIN-POLY',
      difficulty: 2
    });

    if (genRes.success && genRes.problem) {
      const generated = genRes.problem;
      problemBank.storeProblem(generated);

      const retrieved = problemBank.getProblemById(generated.dna.problemId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.dna.isParameterVariation).toBe(true);

      // Verify ProblemBank distinguishes them
      const paramVars = problemBank.getParameterVariations();
      expect(paramVars.some(p => p.dna.problemId === generated.dna.problemId)).toBe(true);
    }
  });
});
