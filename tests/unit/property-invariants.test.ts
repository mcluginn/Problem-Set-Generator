/**
 * Mathematical Property-Based Invariants Test Suite
 * Validates fundamental mathematical laws, idempotency, symmetry, linearity, and algebraic consistency.
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { simplify } from '@/engine/math/simplifier';
import { diff } from '@/engine/math/differentiator';
import { checkEquivalence } from '@/engine/math/equivalence';
import { nodeEquals, add, multiply, constant } from '@/engine/math/ast';

const TEST_EXPRESSIONS = [
  '3*x^2 - 2*x + 4',
  '(3*x^2 - 2*x + 4)^5',
  'sin(3*x^2 + 1)',
  'x^3 * e^(2*x)',
  '(2*x + 1) / (x^2 + 3)',
  'ln(5*x^2 + 2)',
  'tan(x) + sec(x)',
  '4*x^(-2/3) + 7*x^(1/2)',
  'cos(5*x) * e^(-x^2)',
  '(x^3 - 4*x) / (x^2 + 1)',
];

describe('Mathematical Property-Based Invariants', () => {
  describe('1. Simplification Idempotency: simplify(simplify(E)) === simplify(E)', () => {
    TEST_EXPRESSIONS.forEach((exprStr) => {
      it(`idempotently simplifies "${exprStr}"`, () => {
        const ast = parseMath(exprStr);
        const once = simplify(ast);
        const twice = simplify(once);
        expect(nodeEquals(once, twice)).toBe(true);
      });
    });
  });

  describe('2. Equivalence Reflexivity & Symmetry', () => {
    TEST_EXPRESSIONS.forEach((exprStr) => {
      it(`reflexively verifies equivalence of "${exprStr}" to itself`, () => {
        const ast = parseMath(exprStr);
        const res = checkEquivalence(ast, ast, { targetVariable: 'x' });
        expect(res.equivalent).toBe(true);
        expect(res.status).toBe('EQUIVALENT');
      });
    });

    it('symmetric equivalence holds for distinct representations', () => {
      const a = parseMath('5*(3*x^2 - 2*x + 4)^4 * (6*x - 2)');
      const b = parseMath('10*(3*x - 1)*(3*x^2 - 2*x + 4)^4');

      const ab = checkEquivalence(a, b, { targetVariable: 'x' });
      const ba = checkEquivalence(b, a, { targetVariable: 'x' });

      expect(ab.equivalent).toBe(true);
      expect(ba.equivalent).toBe(true);
      expect(ab.status).toBe(ba.status);
    });
  });

  describe('3. Linearity of Differentiation: d/dx[f + g] == d/dx[f] + d/dx[g]', () => {
    const pairs = [
      ['x^3', 'sin(x)'],
      ['e^(2*x)', '4*x^2'],
      ['ln(x)', 'cos(x)'],
      ['x^4', 'x^(-2)'],
    ];

    pairs.forEach(([fStr, gStr]) => {
      it(`linearity holds for f(x) = ${fStr} and g(x) = ${gStr}`, () => {
        const f = parseMath(fStr);
        const g = parseMath(gStr);
        const sumAst = add(f, g);

        const diffSum = diff(sumAst, 'x').simplifiedDerivative;
        const df = diff(f, 'x').simplifiedDerivative;
        const dg = diff(g, 'x').simplifiedDerivative;
        const sumOfDiffs = add(df, dg);

        const eq = checkEquivalence(diffSum, sumOfDiffs, { targetVariable: 'x' });
        expect(eq.equivalent).toBe(true);
      });
    });
  });

  describe('4. Constant Scaling Linearity: d/dx[c * f(x)] == c * d/dx[f(x)]', () => {
    const funcs = ['sin(x)', 'x^4', 'e^(3*x)', 'ln(x^2 + 1)'];
    const constants = [3, -7, 12];

    funcs.forEach((fnStr) => {
      constants.forEach((c) => {
        it(`constant scaling holds for c=${c} and f(x)=${fnStr}`, () => {
          const f = parseMath(fnStr);
          const scaledAst = multiply(constant(c), f);

          const diffScaled = diff(scaledAst, 'x').simplifiedDerivative;
          const df = diff(f, 'x').simplifiedDerivative;
          const scaledDiff = multiply(constant(c), df);

          const eq = checkEquivalence(diffScaled, scaledDiff, { targetVariable: 'x' });
          expect(eq.equivalent).toBe(true);
        });
      });
    });
  });

  describe('5. Constant Annihilation: d/dx[c] === 0', () => {
    const constants = ['42', '-100', 'pi', 'e', 'sqrt(7)', 'e^3'];
    constants.forEach((cStr) => {
      it(`derivative of constant "${cStr}" is identically 0`, () => {
        const ast = parseMath(cStr);
        const d = diff(ast, 'x').simplifiedDerivative;
        expect(d.type === 'constant' && d.value.isZero()).toBe(true);
      });
    });
  });
});
