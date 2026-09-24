import { describe, it, expect } from 'vitest';
import { ProblemGenerator } from '@/engine/generation/generator';
import { ProblemValidator } from '@/engine/generation/validator';
import { SignatureEngine } from '@/engine/generation/signatures';

describe('Problem Generator & Families', () => {
  it('generates a valid Chain Rule problem with complete DNA and steps', () => {
    const problem = ProblemGenerator.generateProblem({
      concept: 'Chain Rule',
      difficulty: 'Medium',
    });

    expect(problem.dna.concept).toBe('Chain Rule');
    expect(problem.statement.expressionLatex).toBeDefined();
    expect(problem.solution.canonicalAnswerLatex).toBeDefined();
    expect(problem.solution.steps.length).toBeGreaterThanOrEqual(3);
    expect(problem.hints.length).toBe(5);

    const report = ProblemValidator.validate(problem);
    expect(report.isValid).toBe(true);
    expect(report.qualityScore).toBe(1.0);
  });

  it('generates diverse families and assigns distinct structure signatures', () => {
    const p1 = ProblemGenerator.generateProblem({ concept: 'Chain Rule' });
    const p2 = ProblemGenerator.generateProblem({ concept: 'Product Rule' });
    const p3 = ProblemGenerator.generateProblem({ concept: 'Quotient Rule' });

    expect(p1.dna.structureSignature).not.toBe(p2.dna.structureSignature);
    expect(p2.dna.structureSignature).not.toBe(p3.dna.structureSignature);
  });

  it('calculates anti-cloning diversity novelty scores correctly', () => {
    const history = [
      { signature: 'CHAIN|OUTER:POW:n=5|INNER:POLY:deg=2', familyId: 'CHAIN_POWER_POLYNOMIAL', representationType: 'Symbolic' },
    ];

    // Same signature -> penalized
    const resSame = SignatureEngine.computeNoveltyScore(
      'CHAIN|OUTER:POW:n=5|INNER:POLY:deg=2',
      'CHAIN_POWER_POLYNOMIAL',
      history
    );
    expect(resSame.isNovel).toBe(false);
    expect(resSame.score).toBeLessThan(0.35);

    // Different signature -> accepted as novel
    const resNovel = SignatureEngine.computeNoveltyScore(
      'CHAIN|OUTER:TRIG:SIN|INNER:POLY:deg=2',
      'CHAIN_TRIG_INNER',
      history
    );
    expect(resNovel.isNovel).toBe(true);
    expect(resNovel.score).toBeGreaterThanOrEqual(0.7);
  });
});
