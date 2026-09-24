/**
 * Mathematical Parser Edge-Case & Operator Precedence Audit Test Suite
 * Verifies conventional mathematical operator precedence, implicit multiplication,
 * and unambiguous AST structures for edge-case notations.
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { nodeToString, nodeEquals, constant, variable, power, negate, multiply, add, subtract, divide, func } from '@/engine/math/ast';
import { NumericalEvaluator } from '@/engine/math/evaluator';

describe('Mathematical Parser & Operator Precedence Audit', () => {
  describe('1. Unary Minus vs Power Precedence (-x^2 vs (-x)^2 vs -(x^2))', () => {
    it('parses -x^2 as negate(power(x, 2))', () => {
      const ast = parseMath('-x^2');
      expect(ast.type).toBe('negate');
      if (ast.type === 'negate') {
        expect(ast.arg.type).toBe('power');
        if (ast.arg.type === 'power') {
          expect(ast.arg.base.type).toBe('variable');
          expect((ast.arg.base as any).name).toBe('x');
        }
      }
    });

    it('parses (-x)^2 as power(negate(x), 2)', () => {
      const ast = parseMath('(-x)^2');
      expect(ast.type).toBe('power');
      if (ast.type === 'power') {
        expect(ast.base.type).toBe('negate');
      }
    });

    it('parses -(x^2) as negate(power(x, 2))', () => {
      const ast = parseMath('-(x^2)');
      expect(ast.type).toBe('negate');
      if (ast.type === 'negate') {
        expect(ast.arg.type).toBe('power');
      }
    });

    it('distinguishes -2^2 (-4) from (-2)^2 (+4)', () => {
      const astNeg2Sq = parseMath('-2^2');
      const astParenNeg2Sq = parseMath('(-2)^2');

      const eval1 = NumericalEvaluator.evaluate(astNeg2Sq, {});
      const eval2 = NumericalEvaluator.evaluate(astParenNeg2Sq, {});

      expect(eval1.value).toBe(-4);
      expect(eval2.value).toBe(4);
    });
  });

  describe('2. Multiplier vs Power Precedence (2x^2 vs (2x)^2)', () => {
    it('parses 2x^2 as 2 * (x^2), evaluating at x=3 to 18', () => {
      const ast = parseMath('2x^2');
      expect(ast.type).toBe('multiply');

      const ev = NumericalEvaluator.evaluate(ast, { x: 3 });
      expect(ev.value).toBe(18);
    });

    it('parses (2x)^2 as (2x)^2, evaluating at x=3 to 36', () => {
      const ast = parseMath('(2x)^2');
      expect(ast.type).toBe('power');

      const ev = NumericalEvaluator.evaluate(ast, { x: 3 });
      expect(ev.value).toBe(36);
    });
  });

  describe('3. Function Arguments vs Function Powers (sin(x)^2 vs sin(x^2))', () => {
    it('parses sin(x)^2 as power(sin(x), 2)', () => {
      const ast = parseMath('sin(x)^2');
      expect(ast.type).toBe('power');
      if (ast.type === 'power') {
        expect(ast.base.type).toBe('function');
        expect((ast.base as any).fn).toBe('sin');
      }
    });

    it('parses sin(x^2) as func(sin, power(x, 2))', () => {
      const ast = parseMath('sin(x^2)');
      expect(ast.type).toBe('function');
      if (ast.type === 'function') {
        expect(ast.fn).toBe('sin');
        expect(ast.args[0].type).toBe('power');
      }
    });
  });

  describe('4. Implicit Multiplication Formats', () => {
    it('parses 3x as 3 * x', () => {
      const ast = parseMath('3x');
      expect(ast.type).toBe('multiply');
    });

    it('parses -3x as (-3) * x or -(3 * x)', () => {
      const ast = parseMath('-3x');
      const ev = NumericalEvaluator.evaluate(ast, { x: 4 });
      expect(ev.value).toBe(-12);
    });

    it('parses 3(x+1) as 3 * (x + 1)', () => {
      const ast = parseMath('3(x+1)');
      expect(ast.type).toBe('multiply');
      const ev = NumericalEvaluator.evaluate(ast, { x: 2 });
      expect(ev.value).toBe(9);
    });

    it('parses (x+1)(x-1) as (x + 1) * (x - 1)', () => {
      const ast = parseMath('(x+1)(x-1)');
      expect(ast.type).toBe('multiply');
      const ev = NumericalEvaluator.evaluate(ast, { x: 5 });
      expect(ev.value).toBe(24);
    });
  });

  describe('5. Negative and Fractional Exponents', () => {
    it('parses x^-2 as x^(-2)', () => {
      const ast = parseMath('x^-2');
      expect(ast.type).toBe('power');
      const ev = NumericalEvaluator.evaluate(ast, { x: 2 });
      expect(ev.value).toBe(0.25);
    });

    it('parses x^(1/2) as square root of x', () => {
      const ast = parseMath('x^(1/2)');
      expect(ast.type).toBe('power');
      const ev = NumericalEvaluator.evaluate(ast, { x: 9 });
      expect(ev.value).toBe(3);
    });

    it('parses x^(3/2) as x^(1.5)', () => {
      const ast = parseMath('x^(3/2)');
      expect(ast.type).toBe('power');
      const ev = NumericalEvaluator.evaluate(ast, { x: 4 });
      expect(ev.value).toBe(8);
    });
  });

  describe('6. Built-in Function Invocations & LaTeX Macros', () => {
    it('parses sqrt(x), ln(x), exp(x), tan(x)', () => {
      expect(parseMath('sqrt(x)').type).toBe('function');
      expect(parseMath('ln(x)').type).toBe('function');
      expect(parseMath('exp(x)').type).toBe('function');
      expect(parseMath('tan(x)').type).toBe('function');
    });

    it('parses composite trigonometric functions: sin(3x + 1)', () => {
      const ast = parseMath('sin(3x + 1)');
      expect(ast.type).toBe('function');
      if (ast.type === 'function') {
        expect(ast.fn).toBe('sin');
        expect(ast.args[0].type).toBe('add');
      }
    });

    it('parses LaTeX \\frac{3x^2 - 1}{x + 2}', () => {
      const ast = parseMath('\\frac{3x^2 - 1}{x + 2}');
      expect(ast.type).toBe('divide');
      const ev = NumericalEvaluator.evaluate(ast, { x: 2 });
      // (3*4 - 1) / (2 + 2) = 11 / 4 = 2.75
      expect(ev.value).toBe(2.75);
    });

    it('parses (a+b)/(c+d) grouping with division', () => {
      const ast = parseMath('(2*x + 4) / (x + 3)');
      expect(ast.type).toBe('divide');
      const ev = NumericalEvaluator.evaluate(ast, { x: 1 });
      // (2 + 4) / (1 + 3) = 6 / 4 = 1.5
      expect(ev.value).toBe(1.5);
    });
  });
});
