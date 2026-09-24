/**
 * Misconception & Buggy Perturbation Diagnosis Engine
 * Generates synthetic buggy ASTs to classify specific student errors with high pedagogical precision.
 */

import {
  MathNode,
  constant,
  multiply,
  divide,
  power,
  negate,
  func,
  TWO,
  ZERO,
  ONE,
} from './ast';
import { Rational, R1 } from './rational';
import { checkEquivalence, EquivalenceResult } from './equivalence';
import { Differentiator } from './differentiator';
import { simplify } from './simplifier';

export type MisconceptionCode =
  | 'MISSING_INNER_DERIVATIVE'
  | 'POWER_RULE_NO_REDUCE'
  | 'POWER_RULE_FORGOT_COEFF'
  | 'PRODUCT_RULE_MULTIPLY_DERIVS'
  | 'PRODUCT_RULE_OMITTED_TERM'
  | 'QUOTIENT_RULE_SIGN_FLIP'
  | 'QUOTIENT_RULE_NO_SQUARE'
  | 'QUOTIENT_RULE_REVERSED_NUMERATOR'
  | 'TRIG_DERIVATIVE_SIGN_ERROR'
  | 'IMPLICIT_FORGOT_DYDX'
  | 'ALGEBRAIC_DISTRIBUTION_ERROR';

export interface MisconceptionDiagnosis {
  detected: boolean;
  code?: MisconceptionCode;
  name?: string;
  confidence: number;
  diagnosis?: string;
  guidanceTip?: string;
  remediationConcept?: string;
}

export class MisconceptionEngine {
  /**
   * Evaluates student answer against known synthetic buggy AST transformations.
   */
  public static diagnose(
    studentNode: MathNode,
    problemExpression: MathNode,
    concept: string,
    targetVar: string = 'x'
  ): MisconceptionDiagnosis {
    // 0. Safety Check: If student answer is algebraically correct, it is not a misconception!
    const trueDerivative = Differentiator.differentiate(problemExpression, targetVar).simplifiedDerivative;
    if (checkEquivalence(studentNode, trueDerivative, { targetVariable: targetVar }).equivalent) {
      return {
        detected: false,
        confidence: 0.0,
      };
    }

    // 1. Chain Rule: Missing Inner Derivative Check
    if (concept === 'Chain Rule' || problemExpression.type === 'power' || problemExpression.type === 'function') {
      const buggyNode = MisconceptionEngine.createMissingInnerDerivative(problemExpression, targetVar);
      if (buggyNode) {
        const eq = checkEquivalence(studentNode, buggyNode, { targetVariable: targetVar });
        if (eq.equivalent) {
          return {
            detected: true,
            code: 'MISSING_INNER_DERIVATIVE',
            name: 'Omitted Derivative of Inner Function',
            confidence: 0.95,
            diagnosis: 'You differentiated the outer function correctly, but forgot to multiply by the derivative of the inside function $u\'$.',
            guidanceTip: 'Chain Rule requires: $\\frac{dy}{dx} = \\frac{df}{du} \\cdot \\frac{du}{dx}$. Re-inspect what is inside the parentheses and multiply your result by its derivative.',
            remediationConcept: 'Chain Rule',
          };
        }
      }
    }

    // 2. Power Rule Misconceptions
    if (problemExpression.type === 'power') {
      // Buggy 1: n * x^n (Forgot to reduce exponent by 1)
      if (
        problemExpression.exponent.type === 'constant' &&
        !problemExpression.exponent.symbolic &&
        problemExpression.base.type === 'variable'
      ) {
        const n = problemExpression.exponent.value;
        const buggyNoReduce = multiply(constant(n), problemExpression);
        if (checkEquivalence(studentNode, buggyNoReduce).equivalent) {
          return {
            detected: true,
            code: 'POWER_RULE_NO_REDUCE',
            name: 'Power Exponent Not Reduced',
            confidence: 0.96,
            diagnosis: 'You multiplied by the exponent, but forgot to subtract 1 from the power.',
            guidanceTip: 'Remember the Power Rule: $\\frac{d}{dx}[x^n] = n x^{n-1}$. The new exponent must be $n - 1$.',
            remediationConcept: 'Power Rule',
          };
        }

        // Buggy 2: x^(n-1) (Forgot to multiply by n)
        const buggyForgotCoeff = power(problemExpression.base, constant(n.sub(R1)));
        if (checkEquivalence(studentNode, buggyForgotCoeff).equivalent) {
          return {
            detected: true,
            code: 'POWER_RULE_FORGOT_COEFF',
            name: 'Forgot Exponent Multiplier',
            confidence: 0.95,
            diagnosis: 'You reduced the exponent by 1, but forgot to multiply by the original exponent $n$.',
            guidanceTip: 'Remember: $\\frac{d}{dx}[x^n] = n x^{n-1}$.',
            remediationConcept: 'Power Rule',
          };
        }
      }
    }

    // 3. Product Rule Misconceptions: u * v -> u' * v'
    if (problemExpression.type === 'multiply' && problemExpression.factors.length === 2) {
      const u = problemExpression.factors[0];
      const v = problemExpression.factors[1];
      const du = Differentiator.differentiate(u, targetVar).derivative;
      const dv = Differentiator.differentiate(v, targetVar).derivative;

      // Buggy: u' * v'
      const buggyMultiplyDerivs = multiply(du, dv);
      if (checkEquivalence(studentNode, buggyMultiplyDerivs).equivalent) {
        return {
          detected: true,
          code: 'PRODUCT_RULE_MULTIPLY_DERIVS',
          name: 'Multiplied Individual Derivatives',
          confidence: 0.98,
          diagnosis: 'You calculated $u\' \\cdot v\'$. In calculus, the derivative of a product is NOT the product of derivatives!',
          guidanceTip: 'Use the Leibniz Product Rule: $\\frac{d}{dx}[u \\cdot v] = u\'v + uv\'$.',
          remediationConcept: 'Product Rule',
        };
      }

      // Buggy: only u'v or only uv'
      if (
        checkEquivalence(studentNode, multiply(du, v)).equivalent ||
        checkEquivalence(studentNode, multiply(u, dv)).equivalent
      ) {
        return {
          detected: true,
          code: 'PRODUCT_RULE_OMITTED_TERM',
          name: 'Omitted Half of Product Rule',
          confidence: 0.94,
          diagnosis: 'You only differentiated one of the factors and forgot the second term of the product rule sum.',
          guidanceTip: 'Both factors must take turns being differentiated: $u\'v + uv\'$.',
          remediationConcept: 'Product Rule',
        };
      }
    }

    // 4. Quotient Rule Misconceptions: u/v
    if (problemExpression.type === 'divide') {
      const u = problemExpression.numerator;
      const v = problemExpression.denominator;
      const du = Differentiator.differentiate(u, targetVar).derivative;
      const dv = Differentiator.differentiate(v, targetVar).derivative;

      // Buggy 1: Sign flip: (u'v + uv') / v^2
      const buggySignFlip = divide(
        { type: 'add', terms: [multiply(du, v), multiply(u, dv)] },
        power(v, TWO)
      );
      if (checkEquivalence(studentNode, buggySignFlip).equivalent) {
        return {
          detected: true,
          code: 'QUOTIENT_RULE_SIGN_FLIP',
          name: 'Quotient Rule Sign Error (Used Plus Instead of Minus)',
          confidence: 0.97,
          diagnosis: 'You added the numerator terms instead of subtracting them.',
          guidanceTip: 'Quotient Rule formula uses subtraction: $\\frac{u\'v - uv\'}{v^2}$.',
          remediationConcept: 'Quotient Rule',
        };
      }

      // Buggy 2: Forgot denominator square: (u'v - uv') / v
      const buggyNoSquare = divide(
        { type: 'add', terms: [multiply(du, v), negate(multiply(u, dv))] },
        v
      );
      if (checkEquivalence(studentNode, buggyNoSquare).equivalent) {
        return {
          detected: true,
          code: 'QUOTIENT_RULE_NO_SQUARE',
          name: 'Forgot to Square Denominator',
          confidence: 0.96,
          diagnosis: 'You computed the numerator correctly, but forgot to square the denominator $v^2$.',
          guidanceTip: 'The denominator of a quotient derivative is always squared: $v^2$.',
          remediationConcept: 'Quotient Rule',
        };
      }

      // Buggy 3: Reversed numerator: (uv' - u'v) / v^2
      const buggyReversed = divide(
        { type: 'add', terms: [multiply(u, dv), negate(multiply(du, v))] },
        power(v, TWO)
      );
      if (checkEquivalence(studentNode, buggyReversed).equivalent) {
        return {
          detected: true,
          code: 'QUOTIENT_RULE_REVERSED_NUMERATOR',
          name: 'Reversed Terms in Quotient Numerator',
          confidence: 0.96,
          diagnosis: 'You reversed the order of subtraction: computed $uv\' - u\'v$ instead of $u\'v - uv\'$.',
          guidanceTip: 'Remember: start with the derivative of the TOP function: "Low d-High minus High d-Low".',
          remediationConcept: 'Quotient Rule',
        };
      }
    }

    // 5. Trigonometric Sign Error
    if (problemExpression.type === 'function') {
      if (problemExpression.fn === 'cos') {
        const buggyCos = func('sin', problemExpression.args[0]);
        if (checkEquivalence(studentNode, buggyCos).equivalent) {
          return {
            detected: true,
            code: 'TRIG_DERIVATIVE_SIGN_ERROR',
            name: 'Trig Derivative Sign Error',
            confidence: 0.95,
            diagnosis: 'You forgot the negative sign: the derivative of $\\cos(x)$ is $-\\sin(x)$, not $+\\sin(x)$.',
            guidanceTip: 'Trig derivatives of "co-" functions (cos, cot, csc) always produce a negative sign!',
            remediationConcept: 'Trigonometric Derivatives',
          };
        }
      }
    }

    return {
      detected: false,
      confidence: 0.0,
    };
  }

  private static createMissingInnerDerivative(node: MathNode, wrt: string): MathNode | null {
    if (node.type === 'power' && node.exponent.type === 'constant' && !node.exponent.symbolic) {
      if (node.base.type === 'variable') return null;
      const n = node.exponent.value;
      // Outer derivative only: n * (base)^(n-1)
      return multiply(constant(n), power(node.base, constant(n.sub(R1))));
    }
    if (node.type === 'function') {
      const u = node.args[0];
      if (u.type === 'variable') return null;
      switch (node.fn) {
        case 'sin':
          return func('cos', u);
        case 'cos':
          return negate(func('sin', u));
        case 'tan':
          return power(func('sec', u), TWO);
        case 'ln':
          return divide(ONE, u);
        case 'exp':
          return func('exp', u);
      }
    }
    return null;
  }
}
