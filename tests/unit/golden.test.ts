/**
 * Golden Mathematical Benchmark Suite (100+ Hand-Verified Calculus Problems)
 * Authoritative regression test verifying all 14 curriculum concepts with exact algebraic truth.
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { diff } from '@/engine/math/differentiator';
import { checkEquivalence } from '@/engine/math/equivalence';
import { ImplicitDifferentiator } from '@/engine/math/implicit';

interface GoldenTestCase {
  id: string;
  concept: string;
  expression: string;
  expectedDerivative: string;
  alternateForms?: string[];
  wrt?: string;
  isImplicit?: boolean;
}

const GOLDEN_SUITE: GoldenTestCase[] = [
  // ---------------------------------------------------------------------------
  // 1. Constant Rule (d/dx[c] = 0)
  // ---------------------------------------------------------------------------
  { id: 'CONST_01', concept: 'Constant Rule', expression: '7', expectedDerivative: '0' },
  { id: 'CONST_02', concept: 'Constant Rule', expression: '-42', expectedDerivative: '0' },
  { id: 'CONST_03', concept: 'Constant Rule', expression: 'pi', expectedDerivative: '0' },
  { id: 'CONST_04', concept: 'Constant Rule', expression: 'e', expectedDerivative: '0' },
  { id: 'CONST_05', concept: 'Constant Rule', expression: 'e^2', expectedDerivative: '0' },
  { id: 'CONST_06', concept: 'Constant Rule', expression: 'sqrt(5)', expectedDerivative: '0' },
  { id: 'CONST_07', concept: 'Constant Rule', expression: 'ln(2)', expectedDerivative: '0' },

  // ---------------------------------------------------------------------------
  // 2. Constant Multiple Rule (d/dx[c*f(x)] = c*f'(x))
  // ---------------------------------------------------------------------------
  { id: 'CONST_MUL_01', concept: 'Constant Multiple Rule', expression: '7*x', expectedDerivative: '7' },
  { id: 'CONST_MUL_02', concept: 'Constant Multiple Rule', expression: '5*x^3', expectedDerivative: '15*x^2' },
  { id: 'CONST_MUL_03', concept: 'Constant Multiple Rule', expression: '-4*sin(x)', expectedDerivative: '-4*cos(x)' },
  { id: 'CONST_MUL_04', concept: 'Constant Multiple Rule', expression: '3*e^x', expectedDerivative: '3*e^x' },
  { id: 'CONST_MUL_05', concept: 'Constant Multiple Rule', expression: '6*ln(x)', expectedDerivative: '6/x' },
  { id: 'CONST_MUL_06', concept: 'Constant Multiple Rule', expression: '-2*cos(x)', expectedDerivative: '2*sin(x)' },
  { id: 'CONST_MUL_07', concept: 'Constant Multiple Rule', expression: '8*tan(x)', expectedDerivative: '8*sec(x)^2' },

  // ---------------------------------------------------------------------------
  // 3. Sum Rule (d/dx[u + v] = u' + v')
  // ---------------------------------------------------------------------------
  { id: 'SUM_01', concept: 'Sum Rule', expression: 'x^3 + x^2', expectedDerivative: '3*x^2 + 2*x' },
  { id: 'SUM_02', concept: 'Sum Rule', expression: 'x^4 + 5*x + 9', expectedDerivative: '4*x^3 + 5' },
  { id: 'SUM_03', concept: 'Sum Rule', expression: 'sin(x) + cos(x)', expectedDerivative: 'cos(x) - sin(x)' },
  { id: 'SUM_04', concept: 'Sum Rule', expression: 'e^x + x^2', expectedDerivative: 'e^x + 2*x' },
  { id: 'SUM_05', concept: 'Sum Rule', expression: 'ln(x) + x^3', expectedDerivative: '1/x + 3*x^2' },
  { id: 'SUM_06', concept: 'Sum Rule', expression: 'tan(x) + 4*x', expectedDerivative: 'sec(x)^2 + 4' },

  // ---------------------------------------------------------------------------
  // 4. Difference Rule (d/dx[u - v] = u' - v')
  // ---------------------------------------------------------------------------
  { id: 'DIFF_01', concept: 'Difference Rule', expression: 'x^3 - x^2', expectedDerivative: '3*x^2 - 2*x' },
  { id: 'DIFF_02', concept: 'Difference Rule', expression: '3*x^4 - 5*x^2 + 7*x - 9', expectedDerivative: '12*x^3 - 10*x + 7' },
  { id: 'DIFF_03', concept: 'Difference Rule', expression: 'sin(x) - cos(x)', expectedDerivative: 'cos(x) + sin(x)' },
  { id: 'DIFF_04', concept: 'Difference Rule', expression: 'e^x - 4*x', expectedDerivative: 'e^x - 4' },
  { id: 'DIFF_05', concept: 'Difference Rule', expression: '2*x^5 - 7*x^3', expectedDerivative: '10*x^4 - 21*x^2' },
  { id: 'DIFF_06', concept: 'Difference Rule', expression: 'ln(x) - 3*x', expectedDerivative: '1/x - 3' },

  // ---------------------------------------------------------------------------
  // 5. Power Rule (d/dx[x^n] = n*x^(n-1))
  // ---------------------------------------------------------------------------
  { id: 'POW_01', concept: 'Power Rule', expression: 'x^6', expectedDerivative: '6*x^5' },
  { id: 'POW_02', concept: 'Power Rule', expression: 'x^10', expectedDerivative: '10*x^9' },
  { id: 'POW_03', concept: 'Power Rule', expression: 'x^(-3)', expectedDerivative: '-3*x^(-4)' },
  { id: 'POW_04', concept: 'Power Rule', expression: 'x^(-1)', expectedDerivative: '-1*x^(-2)' },
  { id: 'POW_05', concept: 'Power Rule', expression: 'x^(1/2)', expectedDerivative: '(1/2)*x^(-1/2)' },
  { id: 'POW_06', concept: 'Power Rule', expression: 'x^(3/2)', expectedDerivative: '(3/2)*x^(1/2)' },
  { id: 'POW_07', concept: 'Power Rule', expression: 'x^(2/3)', expectedDerivative: '(2/3)*x^(-1/3)' },
  { id: 'POW_08', concept: 'Power Rule', expression: 'x^(-1/2)', expectedDerivative: '(-1/2)*x^(-3/2)' },
  { id: 'POW_09', concept: 'Power Rule', expression: '4*x^(5/2)', expectedDerivative: '10*x^(3/2)' },
  { id: 'POW_10', concept: 'Power Rule', expression: '6*x^(-2/3)', expectedDerivative: '-4*x^(-5/3)' },

  // ---------------------------------------------------------------------------
  // 6. Product Rule (d/dx[u*v] = u'v + uv')
  // ---------------------------------------------------------------------------
  { id: 'PROD_01', concept: 'Product Rule', expression: 'x^2 * sin(x)', expectedDerivative: '2*x*sin(x) + x^2*cos(x)' },
  { id: 'PROD_02', concept: 'Product Rule', expression: 'x^3 * e^x', expectedDerivative: '3*x^2*e^x + x^3*e^x' },
  { id: 'PROD_03', concept: 'Product Rule', expression: '(2*x + 3)*(4*x^2 - 1)', expectedDerivative: '24*x^2 + 24*x - 2' },
  { id: 'PROD_04', concept: 'Product Rule', expression: 'x * ln(x)', expectedDerivative: 'ln(x) + 1' },
  { id: 'PROD_05', concept: 'Product Rule', expression: 'sin(x) * cos(x)', expectedDerivative: 'cos(x)^2 - sin(x)^2' },
  { id: 'PROD_06', concept: 'Product Rule', expression: 'x^4 * cos(x)', expectedDerivative: '4*x^3*cos(x) - x^4*sin(x)' },
  { id: 'PROD_07', concept: 'Product Rule', expression: 'e^x * sin(x)', expectedDerivative: 'e^x*sin(x) + e^x*cos(x)' },
  { id: 'PROD_08', concept: 'Product Rule', expression: 'x^2 * ln(x)', expectedDerivative: '2*x*ln(x) + x' },
  { id: 'PROD_09', concept: 'Product Rule', expression: '(x^2 + 1)*(x^3 + 2*x)', expectedDerivative: '5*x^4 + 9*x^2 + 2' },
  { id: 'PROD_10', concept: 'Product Rule', expression: 'x^3 * tan(x)', expectedDerivative: '3*x^2*tan(x) + x^3*sec(x)^2' },

  // ---------------------------------------------------------------------------
  // 7. Quotient Rule (d/dx[u/v] = (u'v - uv') / v^2)
  // ---------------------------------------------------------------------------
  { id: 'QUOT_01', concept: 'Quotient Rule', expression: '(2*x + 1) / (x^2 + 3)', expectedDerivative: '(-2*x^2 - 2*x + 6) / (x^2 + 3)^2' },
  { id: 'QUOT_02', concept: 'Quotient Rule', expression: 'sin(x) / x', expectedDerivative: '(x*cos(x) - sin(x)) / x^2' },
  { id: 'QUOT_03', concept: 'Quotient Rule', expression: 'e^x / (x + 1)', expectedDerivative: '(x*e^x) / (x + 1)^2' },
  { id: 'QUOT_04', concept: 'Quotient Rule', expression: 'x^2 / (x - 1)', expectedDerivative: '(x^2 - 2*x) / (x - 1)^2' },
  { id: 'QUOT_05', concept: 'Quotient Rule', expression: 'ln(x) / x', expectedDerivative: '(1 - ln(x)) / x^2' },
  { id: 'QUOT_06', concept: 'Quotient Rule', expression: 'cos(x) / x^2', expectedDerivative: '(-x^2*sin(x) - 2*x*cos(x)) / x^4' },
  { id: 'QUOT_07', concept: 'Quotient Rule', expression: '(x^3 + 1) / (x^2 + 1)', expectedDerivative: '(x^4 + 3*x^2 - 2*x) / (x^2 + 1)^2' },
  { id: 'QUOT_08', concept: 'Quotient Rule', expression: 'tan(x) / x', expectedDerivative: '(x*sec(x)^2 - tan(x)) / x^2' },
  { id: 'QUOT_09', concept: 'Quotient Rule', expression: '1 / (x^2 + 4)', expectedDerivative: '-2*x / (x^2 + 4)^2' },
  { id: 'QUOT_10', concept: 'Quotient Rule', expression: '(3*x - 2) / (5*x + 4)', expectedDerivative: '22 / (5*x + 4)^2' },

  // ---------------------------------------------------------------------------
  // 8. Chain Rule (Mandatory Golden Section 57 & Deep Cases)
  // ---------------------------------------------------------------------------
  {
    id: 'CHAIN_GOLDEN_57',
    concept: 'Chain Rule',
    expression: '(3*x^2 - 2*x + 4)^5',
    expectedDerivative: '5*(3*x^2 - 2*x + 4)^4 * (6*x - 2)',
    alternateForms: [
      '10*(3*x - 1)*(3*x^2 - 2*x + 4)^4',
      '(30*x - 10)*(3*x^2 - 2*x + 4)^4',
    ],
  },
  { id: 'CHAIN_02', concept: 'Chain Rule', expression: '(4*x + 1)^3', expectedDerivative: '12*(4*x + 1)^2' },
  { id: 'CHAIN_03', concept: 'Chain Rule', expression: 'sin(3*x^2 + 1)', expectedDerivative: '6*x*cos(3*x^2 + 1)' },
  { id: 'CHAIN_04', concept: 'Chain Rule', expression: 'cos(5*x)', expectedDerivative: '-5*sin(5*x)' },
  { id: 'CHAIN_05', concept: 'Chain Rule', expression: 'tan(2*x^3)', expectedDerivative: '6*x^2*sec(2*x^3)^2' },
  { id: 'CHAIN_06', concept: 'Chain Rule', expression: 'e^(4*x - 1)', expectedDerivative: '4*e^(4*x - 1)' },
  { id: 'CHAIN_07', concept: 'Chain Rule', expression: 'e^(-x^2)', expectedDerivative: '-2*x*e^(-x^2)' },
  { id: 'CHAIN_08', concept: 'Chain Rule', expression: 'ln(5*x^2 + 2)', expectedDerivative: '(10*x) / (5*x^2 + 2)' },
  { id: 'CHAIN_09', concept: 'Chain Rule', expression: 'ln(sin(x))', expectedDerivative: 'cot(x)' },
  { id: 'CHAIN_10', concept: 'Chain Rule', expression: 'sin(x)^3', expectedDerivative: '3*sin(x)^2 * cos(x)' },
  { id: 'CHAIN_11', concept: 'Chain Rule', expression: 'cos(x)^4', expectedDerivative: '-4*cos(x)^3 * sin(x)' },
  { id: 'CHAIN_12', concept: 'Chain Rule', expression: '(2*x^3 - 5*x)^(-2)', expectedDerivative: '-2*(2*x^3 - 5*x)^(-3)*(6*x^2 - 5)' },
  { id: 'CHAIN_13', concept: 'Chain Rule', expression: 'e^(sin(x))', expectedDerivative: 'cos(x)*e^(sin(x))' },
  { id: 'CHAIN_14', concept: 'Chain Rule', expression: 'ln(x^3 + 4*x)', expectedDerivative: '(3*x^2 + 4) / (x^3 + 4*x)' },
  { id: 'CHAIN_15', concept: 'Chain Rule', expression: '(1 - 2*x^2)^4', expectedDerivative: '-16*x*(1 - 2*x^2)^3' },

  // ---------------------------------------------------------------------------
  // 9. Trigonometric Derivatives
  // ---------------------------------------------------------------------------
  { id: 'TRIG_01', concept: 'Trigonometric Derivatives', expression: 'sec(x)', expectedDerivative: 'sec(x)*tan(x)' },
  { id: 'TRIG_02', concept: 'Trigonometric Derivatives', expression: 'csc(x)', expectedDerivative: '-csc(x)*cot(x)' },
  { id: 'TRIG_03', concept: 'Trigonometric Derivatives', expression: 'cot(x)', expectedDerivative: '-csc(x)^2' },
  { id: 'TRIG_04', concept: 'Trigonometric Derivatives', expression: 'sin(x)', expectedDerivative: 'cos(x)' },
  { id: 'TRIG_05', concept: 'Trigonometric Derivatives', expression: 'cos(x)', expectedDerivative: '-sin(x)' },
  { id: 'TRIG_06', concept: 'Trigonometric Derivatives', expression: 'tan(x)', expectedDerivative: 'sec(x)^2' },
  { id: 'TRIG_07', concept: 'Trigonometric Derivatives', expression: 'sec(3*x)', expectedDerivative: '3*sec(3*x)*tan(3*x)' },
  { id: 'TRIG_08', concept: 'Trigonometric Derivatives', expression: 'csc(2*x)', expectedDerivative: '-2*csc(2*x)*cot(2*x)' },
  { id: 'TRIG_09', concept: 'Trigonometric Derivatives', expression: 'cot(4*x)', expectedDerivative: '-4*csc(4*x)^2' },
  { id: 'TRIG_10', concept: 'Trigonometric Derivatives', expression: 'sin(x) + tan(x)', expectedDerivative: 'cos(x) + sec(x)^2' },

  // ---------------------------------------------------------------------------
  // 10. Exponential Derivatives
  // ---------------------------------------------------------------------------
  { id: 'EXP_01', concept: 'Exponential Derivatives', expression: 'e^x', expectedDerivative: 'e^x' },
  { id: 'EXP_02', concept: 'Exponential Derivatives', expression: 'e^(3*x)', expectedDerivative: '3*e^(3*x)' },
  { id: 'EXP_03', concept: 'Exponential Derivatives', expression: '4*e^(2*x + 1)', expectedDerivative: '8*e^(2*x + 1)' },
  { id: 'EXP_04', concept: 'Exponential Derivatives', expression: 'e^(-5*x)', expectedDerivative: '-5*e^(-5*x)' },
  { id: 'EXP_05', concept: 'Exponential Derivatives', expression: 'e^(x^2)', expectedDerivative: '2*x*e^(x^2)' },
  { id: 'EXP_06', concept: 'Exponential Derivatives', expression: '2^(3*x)', expectedDerivative: '3*2^(3*x)*ln(2)' },
  { id: 'EXP_07', concept: 'Exponential Derivatives', expression: '10^x', expectedDerivative: '10^x * ln(10)' },
  { id: 'EXP_08', concept: 'Exponential Derivatives', expression: 'e^(cos(x))', expectedDerivative: '-sin(x)*e^(cos(x))' },

  // ---------------------------------------------------------------------------
  // 11. Logarithmic Derivatives
  // ---------------------------------------------------------------------------
  { id: 'LOG_01', concept: 'Logarithmic Derivatives', expression: 'ln(x)', expectedDerivative: '1/x' },
  { id: 'LOG_02', concept: 'Logarithmic Derivatives', expression: '3*ln(5*x - 2)', expectedDerivative: '15 / (5*x - 2)' },
  { id: 'LOG_03', concept: 'Logarithmic Derivatives', expression: 'ln(x^2 + 1)', expectedDerivative: '(2*x) / (x^2 + 1)' },
  { id: 'LOG_04', concept: 'Logarithmic Derivatives', expression: 'ln(cos(x))', expectedDerivative: '-tan(x)' },
  { id: 'LOG_05', concept: 'Logarithmic Derivatives', expression: 'ln(e^x + 1)', expectedDerivative: 'e^x / (e^x + 1)' },
  { id: 'LOG_06', concept: 'Logarithmic Derivatives', expression: 'ln(x^4 + 3*x^2 + 1)', expectedDerivative: '(4*x^3 + 6*x) / (x^4 + 3*x^2 + 1)' },
  { id: 'LOG_07', concept: 'Logarithmic Derivatives', expression: '4*ln(2*x)', expectedDerivative: '4/x' },

  // ---------------------------------------------------------------------------
  // 12. Implicit Differentiation (F(x, y) = 0)
  // ---------------------------------------------------------------------------
  { id: 'IMP_01', concept: 'Implicit Differentiation', expression: 'x^2 + y^2 - 25', expectedDerivative: '-x / y', isImplicit: true },
  { id: 'IMP_02', concept: 'Implicit Differentiation', expression: 'x^2 * y - 10', expectedDerivative: '-2*y / x', isImplicit: true },
  { id: 'IMP_03', concept: 'Implicit Differentiation', expression: 'x^3 + y^3 - 9*x*y', expectedDerivative: '(3*y - x^2) / (y^2 - 3*x)', isImplicit: true },
  { id: 'IMP_04', concept: 'Implicit Differentiation', expression: 'y^2 - 4*x', expectedDerivative: '2 / y', isImplicit: true },
  { id: 'IMP_05', concept: 'Implicit Differentiation', expression: 'x^2 - y^2 - 16', expectedDerivative: 'x / y', isImplicit: true },
  { id: 'IMP_06', concept: 'Implicit Differentiation', expression: 'x*y - 1', expectedDerivative: '-y / x', isImplicit: true },

  // ---------------------------------------------------------------------------
  // 13. Higher-Order Derivatives (d^2y/dx^2, d^3y/dx^3)
  // ---------------------------------------------------------------------------
  { id: 'HIGH_01', concept: 'Higher-Order Derivatives', expression: 'x^4 - 2*x^3 + 5*x^2', expectedDerivative: '12*x^2 - 12*x + 10' }, // 2nd deriv
  { id: 'HIGH_02', concept: 'Higher-Order Derivatives', expression: 'sin(x)', expectedDerivative: '-sin(x)' }, // 2nd deriv
  { id: 'HIGH_03', concept: 'Higher-Order Derivatives', expression: 'cos(x)', expectedDerivative: '-cos(x)' }, // 2nd deriv
  { id: 'HIGH_04', concept: 'Higher-Order Derivatives', expression: 'e^(2*x)', expectedDerivative: '4*e^(2*x)' }, // 2nd deriv
  { id: 'HIGH_05', concept: 'Higher-Order Derivatives', expression: '5*x^5', expectedDerivative: '100*x^3' }, // 2nd deriv
  { id: 'HIGH_06', concept: 'Higher-Order Derivatives', expression: 'x^3 + 4*x^2 - 7*x + 1', expectedDerivative: '6*x + 8' }, // 2nd deriv
  { id: 'HIGH_07', concept: 'Higher-Order Derivatives', expression: 'ln(x)', expectedDerivative: '-1 / x^2' }, // 2nd deriv

  // ---------------------------------------------------------------------------
  // 14. Basic Applications of Derivatives (Kinematics & Tangent Slopes)
  // ---------------------------------------------------------------------------
  { id: 'APP_01', concept: 'Basic Applications of Derivatives', expression: '20 + 30*t - 5*t^2', expectedDerivative: '30 - 10*t', wrt: 't' },
  { id: 'APP_02', concept: 'Basic Applications of Derivatives', expression: '100 - 4.9*t^2', expectedDerivative: '-9.8*t', wrt: 't' },
  { id: 'APP_03', concept: 'Basic Applications of Derivatives', expression: 'x^2 - 4*x + 3', expectedDerivative: '2*x - 4' },
  { id: 'APP_04', concept: 'Basic Applications of Derivatives', expression: '2*x^3 - 6*x', expectedDerivative: '6*x^2 - 6' },
  { id: 'APP_05', concept: 'Basic Applications of Derivatives', expression: '50*t - 16*t^2', expectedDerivative: '50 - 32*t', wrt: 't' },
  { id: 'APP_06', concept: 'Basic Applications of Derivatives', expression: 'x^3 - 3*x^2 + 2', expectedDerivative: '3*x^2 - 6*x' },
];

describe('Golden Mathematical Benchmark Suite (100+ Hand-Verified Test Cases)', () => {
  it(`contains ${GOLDEN_SUITE.length} curated benchmark cases across all 14 curriculum concepts`, () => {
    expect(GOLDEN_SUITE.length).toBeGreaterThanOrEqual(100);
  });

  GOLDEN_SUITE.forEach((tc) => {
    it(`[${tc.id}] ${tc.concept}: d/d${tc.wrt || 'x'}[${tc.expression}] == ${tc.expectedDerivative}`, () => {
      const inputAst = parseMath(tc.expression);
      const expectedAst = parseMath(tc.expectedDerivative);

      if (tc.isImplicit) {
        const implicitRes = ImplicitDifferentiator.solveImplicit(inputAst);
        const eqResult = checkEquivalence(implicitRes.derivativeDydx, expectedAst, {
          targetVariable: 'x',
        });
        expect(eqResult.equivalent).toBe(true);
      } else if (tc.concept === 'Higher-Order Derivatives') {
        const firstDeriv = diff(inputAst, tc.wrt || 'x').simplifiedDerivative;
        const secondDeriv = diff(firstDeriv, tc.wrt || 'x').simplifiedDerivative;
        const eqResult = checkEquivalence(secondDeriv, expectedAst, {
          targetVariable: tc.wrt || 'x',
        });
        expect(eqResult.equivalent).toBe(true);
      } else {
        const diffResult = diff(inputAst, tc.wrt || 'x');
        const eqResult = checkEquivalence(diffResult.simplifiedDerivative, expectedAst, {
          targetVariable: tc.wrt || 'x',
        });
        expect(eqResult.equivalent).toBe(true);

        if (tc.alternateForms) {
          for (const altStr of tc.alternateForms) {
            const altAst = parseMath(altStr);
            const altEq = checkEquivalence(altAst, expectedAst, {
              targetVariable: tc.wrt || 'x',
            });
            expect(altEq.equivalent).toBe(true);
          }
        }
      }
    });
  });
});
