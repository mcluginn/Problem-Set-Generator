/**
 * Domain-Safe Evaluation & Domain-Preserving Equivalence Test Suite
 * Tests singularities, branch cuts, trigonometric poles, and the formal distinction
 * between algebraic equivalence and domain-preserving equivalence.
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { checkEquivalence, EquivalenceEngine } from '@/engine/math/equivalence';
import { NumericalEvaluator } from '@/engine/math/evaluator';

describe('Domain Audit & Domain-Preserving Equivalence', () => {
  describe('1. Singularity and Domain Boundary Detection', () => {
    it('detects division by zero singularity in 1/x', () => {
      const ast = parseMath('1/x');
      const evalZero = NumericalEvaluator.evaluate(ast, { x: 0 });
      expect(evalZero.domainStatus.isValid).toBe(false);
      expect(evalZero.domainStatus.singularityDetected).toBe(true);

      const evalValid = NumericalEvaluator.evaluate(ast, { x: 2 });
      expect(evalValid.domainStatus.isValid).toBe(true);
      expect(evalValid.value).toBe(0.5);
    });

    it('detects non-positive domain error for ln(x)', () => {
      const ast = parseMath('ln(x)');
      const evalNeg = NumericalEvaluator.evaluate(ast, { x: -2 });
      expect(evalNeg.domainStatus.isValid).toBe(false);

      const evalZero = NumericalEvaluator.evaluate(ast, { x: 0 });
      expect(evalZero.domainStatus.isValid).toBe(false);

      const evalPos = NumericalEvaluator.evaluate(ast, { x: Math.E });
      expect(evalPos.domainStatus.isValid).toBe(true);
      expect(evalPos.value).toBeCloseTo(1.0, 5);
    });

    it('detects negative domain error for sqrt(x) and x^(1/2)', () => {
      const astSqrt = parseMath('sqrt(x)');
      const astFracPow = parseMath('x^(1/2)');

      const evalSqrtNeg = NumericalEvaluator.evaluate(astSqrt, { x: -4 });
      expect(evalSqrtNeg.domainStatus.isValid).toBe(false);

      const evalFracPowNeg = NumericalEvaluator.evaluate(astFracPow, { x: -4 });
      expect(evalFracPowNeg.domainStatus.isValid).toBe(false);

      const evalSqrtPos = NumericalEvaluator.evaluate(astSqrt, { x: 16 });
      expect(evalSqrtPos.domainStatus.isValid).toBe(true);
      expect(evalSqrtPos.value).toBe(4);
    });

    it('detects negative power zero singularity: x^(-3)', () => {
      const ast = parseMath('x^(-3)');
      const evalZero = NumericalEvaluator.evaluate(ast, { x: 0 });
      expect(evalZero.domainStatus.isValid).toBe(false);

      const evalPos = NumericalEvaluator.evaluate(ast, { x: 2 });
      expect(evalPos.domainStatus.isValid).toBe(true);
      expect(evalPos.value).toBe(0.125);
    });

    it('detects trigonometric poles: tan(x), cot(x), sec(x), csc(x)', () => {
      const astTan = parseMath('tan(x)');
      const astCot = parseMath('cot(x)');
      const astSec = parseMath('sec(x)');
      const astCsc = parseMath('csc(x)');

      // tan(pi/2) pole
      const evalTanPole = NumericalEvaluator.evaluate(astTan, { x: Math.PI / 2 });
      expect(evalTanPole.domainStatus.isValid).toBe(false);

      // sec(pi/2) pole
      const evalSecPole = NumericalEvaluator.evaluate(astSec, { x: Math.PI / 2 });
      expect(evalSecPole.domainStatus.isValid).toBe(false);

      // cot(0) pole
      const evalCotPole = NumericalEvaluator.evaluate(astCot, { x: 0 });
      expect(evalCotPole.domainStatus.isValid).toBe(false);

      // csc(0) pole
      const evalCscPole = NumericalEvaluator.evaluate(astCsc, { x: 0 });
      expect(evalCscPole.domainStatus.isValid).toBe(false);
    });
  });

  describe('2. Algebraic vs Domain-Preserving Equivalence (Section 10)', () => {
    it('detects DOMAIN_MISMATCH for (x^2 - 1)/(x - 1) vs (x + 1) under strictDomainCheck: true', () => {
      const student = parseMath('(x^2 - 1) / (x - 1)');
      const expected = parseMath('x + 1');

      const strictResult = checkEquivalence(student, expected, {
        targetVariable: 'x',
        strictDomainCheck: true,
      });

      expect(strictResult.status).toBe('DOMAIN_MISMATCH');
      expect(strictResult.equivalent).toBe(false);
      expect(strictResult.domainDifferenceDetected).toBe(true);
      expect(strictResult.reason).toContain('removable discontinuity');
    });

    it('accepts algebraic equivalence for (x^2 - 1)/(x - 1) vs (x + 1) under standard calculus grading', () => {
      const student = parseMath('(x^2 - 1) / (x - 1)');
      const expected = parseMath('x + 1');

      const standardResult = checkEquivalence(student, expected, {
        targetVariable: 'x',
        strictDomainCheck: false,
      });

      expect(standardResult.status).toBe('EQUIVALENT');
      expect(standardResult.equivalent).toBe(true);
      expect(standardResult.domainDifferenceDetected).toBe(true);
    });

    it('handles (x^3 - x) / x vs (x^2 - 1) with domain audit', () => {
      const student = parseMath('(x^3 - x) / x');
      const expected = parseMath('x^2 - 1');

      const res = checkEquivalence(student, expected, {
        targetVariable: 'x',
        strictDomainCheck: true,
      });

      expect(res.status).toBe('DOMAIN_MISMATCH');
      expect(res.domainDifferenceDetected).toBe(true);
    });
  });

  describe('3. Structured Equivalence Status Codes', () => {
    it('returns EQUIVALENT for valid alternative algebraic expressions', () => {
      const a = parseMath('2*x*sin(x) + x^2*cos(x)');
      const b = parseMath('x^2*cos(x) + 2*x*sin(x)');
      const res = checkEquivalence(a, b, { targetVariable: 'x' });

      expect(res.status).toBe('EQUIVALENT');
      expect(res.equivalent).toBe(true);
    });

    it('returns NOT_EQUIVALENT for mathematically different expressions', () => {
      const a = parseMath('2*x*sin(x) + x^2*cos(x)');
      const b = parseMath('2*x*cos(x)');
      const res = checkEquivalence(a, b, { targetVariable: 'x' });

      expect(res.status).toBe('NOT_EQUIVALENT');
      expect(res.equivalent).toBe(false);
    });

    it('returns INVALID_INPUT when node is malformed or null', () => {
      const res = EquivalenceEngine.check(null as any, null as any);
      expect(res.status).toBe('INVALID_INPUT');
      expect(res.equivalent).toBe(false);
    });
  });
});
