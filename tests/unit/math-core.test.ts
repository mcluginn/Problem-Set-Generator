import { describe, it, expect } from 'vitest';
import { Rational } from '@/engine/math/rational';
import { parseMath } from '@/engine/math/parser';
import { simplify, expand } from '@/engine/math/simplifier';
import { diff } from '@/engine/math/differentiator';
import { checkEquivalence } from '@/engine/math/equivalence';
import { MisconceptionEngine } from '@/engine/math/misconceptions';
import { StepGenerator } from '@/engine/math/steps';
import { nodeToLatex, nodeToString } from '@/engine/math/ast';

describe('1. Exact Rational Arithmetic', () => {
  it('handles exact rational addition and reduction', () => {
    const r1 = new Rational(3, 4);
    const r2 = new Rational(1, 4);
    const sum = r1.add(r2);
    expect(sum.num).toBe(1n);
    expect(sum.den).toBe(1n);
    expect(sum.isOne()).toBe(true);
  });

  it('handles negative fractions and division by fraction', () => {
    const r1 = new Rational(6, 5);
    const r2 = new Rational(-3, 10);
    const div = r1.div(r2);
    expect(div.num).toBe(-4n);
    expect(div.den).toBe(1n);
    expect(div.toString()).toBe('-4');
  });
});

describe('2. Mathematical Parser', () => {
  it('parses implicit multiplication correctly: 3x and 2(x+1)', () => {
    const ast1 = parseMath('3x');
    expect(ast1.type).toBe('multiply');

    const ast2 = parseMath('2(x+1)');
    expect(ast2.type).toBe('multiply');

    const ast3 = parseMath('(x+1)(x-1)');
    expect(ast3.type).toBe('multiply');
  });

  it('parses powers and nested parentheses: (3x^2 - 2x + 4)^5', () => {
    const ast = parseMath('(3x^2 - 2x + 4)^5');
    expect(ast.type).toBe('power');
  });

  it('parses LaTeX fractions and trig functions', () => {
    const ast1 = parseMath('\\frac{2x+1}{x^2+3}');
    expect(ast1.type).toBe('divide');

    const ast2 = parseMath('\\sin(3x)');
    expect(ast2.type).toBe('function');
  });

  it('strips leading equation prefix: y = ... and dy/dx = ...', () => {
    const ast1 = parseMath('y = 4x^3');
    expect(nodeToString(ast1)).toBe('4 * x^3');

    const ast2 = parseMath('\\frac{dy}{dx} = 12x^2');
    expect(nodeToString(ast2)).toBe('12 * x^2');
  });
});

describe('3. Symbolic Differentiation Rules', () => {
  it('differentiates Power Rule: d/dx[3x^4 - 5x^2 + 7x - 9]', () => {
    const expr = parseMath('3x^4 - 5x^2 + 7x - 9');
    const res = diff(expr);
    const expected = parseMath('12x^3 - 10x + 7');
    const eq = checkEquivalence(res.simplifiedDerivative, expected);
    expect(eq.equivalent).toBe(true);
  });

  it('differentiates Product Rule: d/dx[x^3 * sin(x)]', () => {
    const expr = parseMath('x^3 * sin(x)');
    const res = diff(expr);
    const expected = parseMath('3x^2*sin(x) + x^3*cos(x)');
    const eq = checkEquivalence(res.simplifiedDerivative, expected);
    expect(eq.equivalent).toBe(true);
  });

  it('differentiates Quotient Rule: d/dx[(2x+1)/(x^2+3)]', () => {
    const expr = parseMath('(2x + 1)/(x^2 + 3)');
    const res = diff(expr);
    const expected = parseMath('(2*(x^2 + 3) - (2x + 1)*(2x)) / (x^2 + 3)^2');
    const eq = checkEquivalence(res.simplifiedDerivative, expected);
    expect(eq.equivalent).toBe(true);
  });

  it('differentiates Chain Rule: y = (3x^2 - 2x + 4)^5', () => {
    const expr = parseMath('(3x^2 - 2x + 4)^5');
    const res = diff(expr);
    const expectedForm1 = parseMath('5*(3x^2 - 2x + 4)^4 * (6x - 2)');
    const expectedForm2 = parseMath('10*(3x - 1)*(3x^2 - 2x + 4)^4');
    const expectedForm3 = parseMath('(30x - 10)*(3x^2 - 2x + 4)^4');

    expect(checkEquivalence(res.simplifiedDerivative, expectedForm1).equivalent).toBe(true);
    expect(checkEquivalence(expectedForm1, expectedForm2).equivalent).toBe(true);
    expect(checkEquivalence(expectedForm1, expectedForm3).equivalent).toBe(true);
  });

  it('differentiates Trigonometric Chain Rule: sin(3x^2 + 1)', () => {
    const expr = parseMath('sin(3x^2 + 1)');
    const res = diff(expr);
    const expected = parseMath('6x * cos(3x^2 + 1)');
    expect(checkEquivalence(res.simplifiedDerivative, expected).equivalent).toBe(true);
  });

  it('differentiates Exponential Chain Rule: e^(2x^3 - 5x)', () => {
    const expr = parseMath('exp(2x^3 - 5x)');
    const res = diff(expr);
    const expected = parseMath('(6x^2 - 5) * exp(2x^3 - 5x)');
    expect(checkEquivalence(res.simplifiedDerivative, expected).equivalent).toBe(true);
  });

  it('differentiates Logarithmic Chain Rule: ln(4x^2 + 7)', () => {
    const expr = parseMath('ln(4x^2 + 7)');
    const res = diff(expr);
    const expected = parseMath('(8x) / (4x^2 + 7)');
    expect(checkEquivalence(res.simplifiedDerivative, expected).equivalent).toBe(true);
  });
});

describe('4. 4-Level Algebraic Equivalence Hierarchy', () => {
  it('Level 1: Recognizes commutative canonical terms 2x + 6 vs 6 + 2x', () => {
    const e1 = parseMath('2x + 6');
    const e2 = parseMath('6 + 2x');
    const eq = checkEquivalence(e1, e2);
    expect(eq.equivalent).toBe(true);
    expect(eq.level).toBe(1);
    expect(eq.methodUsed).toBe('symbolic_canonicalization');
  });

  it('Level 2: Recognizes factored vs expanded polynomial forms', () => {
    const e1 = parseMath('(x + 2)*(x - 3)');
    const e2 = parseMath('x^2 - x - 6');
    const eq = checkEquivalence(e1, e2);
    expect(eq.equivalent).toBe(true);
    expect(eq.level).toBe(2);
    expect(eq.methodUsed).toBe('symbolic_zero_difference');
  });

  it('Level 3: Recognizes equivalent rational expressions with cross-multiplication', () => {
    const e1 = parseMath('(2x + 4) / (x^2 - 1)');
    const e2 = parseMath('(2*(x + 2)) / (x^2 - 1)');
    const eq = checkEquivalence(e1, e2);
    expect(eq.equivalent).toBe(true);
    expect(eq.symbolicMatch).toBe(true);
  });

  it('Level 4: High confidence equivalence on complex Chain Rule factoring', () => {
    // 5*(3x^2 - 2x + 4)^4 * (6x - 2) vs 10*(3x - 1)*(3x^2 - 2x + 4)^4
    const s1 = parseMath('5*(3x^2 - 2x + 4)^4 * (6x - 2)');
    const s2 = parseMath('10*(3x - 1)*(3x^2 - 2x + 4)^4');
    const eq = checkEquivalence(s1, s2);
    expect(eq.equivalent).toBe(true);
    expect(eq.confidence).toBeGreaterThanOrEqual(0.99);
  });

  it('Rejects non-equivalent expressions', () => {
    const e1 = parseMath('3x^2 + 2x');
    const e2 = parseMath('3x^2 + 5x');
    const eq = checkEquivalence(e1, e2);
    expect(eq.equivalent).toBe(false);
  });
});

describe('5. Misconception Engine (Buggy Perturbations)', () => {
  it('diagnoses MISSING_INNER_DERIVATIVE on Chain Rule: 5(3x^2 - 2x + 4)^4', () => {
    const problemExpr = parseMath('(3x^2 - 2x + 4)^5');
    const studentBuggyAnswer = parseMath('5*(3x^2 - 2x + 4)^4');
    const diagnosis = MisconceptionEngine.diagnose(studentBuggyAnswer, problemExpr, 'Chain Rule');

    expect(diagnosis.detected).toBe(true);
    expect(diagnosis.code).toBe('MISSING_INNER_DERIVATIVE');
    expect(diagnosis.confidence).toBeGreaterThan(0.9);
    expect(diagnosis.diagnosis).toContain('forgot to multiply by the derivative of the inside');
  });

  it('diagnoses PRODUCT_RULE_MULTIPLY_DERIVS: x^3 * sin(x) -> 3x^2 * cos(x)', () => {
    const problemExpr = parseMath('x^3 * sin(x)');
    const studentBuggyAnswer = parseMath('3x^2 * cos(x)');
    const diagnosis = MisconceptionEngine.diagnose(studentBuggyAnswer, problemExpr, 'Product Rule');

    expect(diagnosis.detected).toBe(true);
    expect(diagnosis.code).toBe('PRODUCT_RULE_MULTIPLY_DERIVS');
  });

  it('diagnoses QUOTIENT_RULE_SIGN_FLIP: plus instead of minus in numerator', () => {
    const problemExpr = parseMath('(2x + 1)/(x^2 + 3)');
    const studentBuggyAnswer = parseMath('(2*(x^2 + 3) + (2x + 1)*(2x)) / (x^2 + 3)^2');
    const diagnosis = MisconceptionEngine.diagnose(studentBuggyAnswer, problemExpr, 'Quotient Rule');

    expect(diagnosis.detected).toBe(true);
    expect(diagnosis.code).toBe('QUOTIENT_RULE_SIGN_FLIP');
  });
});

describe('6. Deterministic Step Generation', () => {
  it('generates multi-step solution and "Why Chain Rule?" rationale', () => {
    const expr = parseMath('(3x^2 - 2x + 4)^5');
    const sol = StepGenerator.generateSolution(expr, 'Chain Rule');

    expect(sol.steps.length).toBeGreaterThanOrEqual(3);
    expect(sol.whyMethodRequired).toContain('Why Chain Rule?');
    expect(sol.canonicalAnswerLatex).toBeDefined();
  });
});
