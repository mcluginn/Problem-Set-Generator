/**
 * Diversity Engine & Superficial Clone Detection Test Suite
 * Tests AST structural signatures, anti-cloning penalties, and pedagogical remediation exceptions.
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { SignatureEngine } from '@/engine/generation/signatures';

describe('Diversity Engine & Anti-Cloning Tests', () => {
  describe('1. Superficial Clone Recognition (Section 21)', () => {
    it('identifies (2x + 1)^4 and (5x - 3)^4 as identical normalized structures despite different coefficients', () => {
      const ast1 = parseMath('(2*x + 1)^4');
      const ast2 = parseMath('(5*x - 3)^4');

      const sig1 = SignatureEngine.extractSignature(ast1, 'Chain Rule', 'Symbolic');
      const sig2 = SignatureEngine.extractSignature(ast2, 'Chain Rule', 'Symbolic');

      // Normalized structure must be identical (both are POW(linear_poly, 4))
      expect(sig1).toBe(sig2);
    });

    it('distinguishes structurally different polynomials: (2x+1)^4 vs (3x^2 - 2x + 4)^4', () => {
      const linearChain = parseMath('(2*x + 1)^4');
      const quadraticChain = parseMath('(3*x^2 - 2*x + 4)^4');

      const sig1 = SignatureEngine.extractSignature(linearChain, 'Chain Rule', 'Symbolic');
      const sig2 = SignatureEngine.extractSignature(quadraticChain, 'Chain Rule', 'Symbolic');

      expect(sig1).not.toBe(sig2);
    });
  });

  describe('2. Anti-Cloning Penalty & Novelty Scoring', () => {
    it('penalizes identical structure signature occurring consecutively in history', () => {
      const ast = parseMath('(2*x + 1)^4');
      const sig = SignatureEngine.extractSignature(ast, 'Chain Rule', 'Symbolic');

      const history = [
        { signature: sig, familyId: 'CHAIN_POWER_POLYNOMIAL', representationType: 'Symbolic' },
      ];

      const novelty = SignatureEngine.computeNoveltyScore(sig, 'CHAIN_POWER_POLYNOMIAL', history);

      // Score drops due to immediate repetition
      expect(novelty.score).toBeLessThan(0.35);
      expect(novelty.isNovel).toBe(false);
      expect(novelty.reason).toContain('Rejected as superficial clone');
    });

    it('accepts novel problems with different structural signatures and families', () => {
      const trigAst = parseMath('x^2 * sin(x)');
      const trigSig = SignatureEngine.extractSignature(trigAst, 'Product Rule', 'Symbolic');

      const history = [
        {
          signature: 'CHAIN_RULE|SYMBOLIC|POW(ADD[CONST:num,MUL[CONST:num,VAR:x]],n=4)',
          familyId: 'CHAIN_POWER_POLYNOMIAL',
          representationType: 'Symbolic',
        },
      ];

      const novelty = SignatureEngine.computeNoveltyScore(trigSig, 'PRODUCT_POLY_TRIG', history);

      expect(novelty.score).toBeGreaterThanOrEqual(0.7);
      expect(novelty.isNovel).toBe(true);
    });
  });

  describe('3. Remediation Exception (Section 22)', () => {
    it('allows pedagogical repetition when student is remediating a specific misconception', () => {
      const ast = parseMath('(2*x + 1)^4');
      const sig = SignatureEngine.extractSignature(ast, 'Chain Rule', 'Symbolic');

      const history = [
        { signature: sig, familyId: 'CHAIN_POWER_POLYNOMIAL', representationType: 'Symbolic' },
      ];

      // With active misconception remediation, score is boosted to allow targeted practice
      const novelty = SignatureEngine.computeNoveltyScore(
        sig,
        'CHAIN_POWER_POLYNOMIAL',
        history,
        'MISSING_INNER_DERIVATIVE'
      );

      expect(novelty.score).toBeGreaterThanOrEqual(0.35);
      expect(novelty.isNovel).toBe(true);
    });
  });
});
