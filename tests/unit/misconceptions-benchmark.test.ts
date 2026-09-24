/**
 * 50+ Misconception Classification Benchmark Test Suite
 * Authoritative diagnostic evaluation testing synthetic AST perturbation classifications,
 * edge cases, ambiguous answers, and misdiagnosis safety.
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { MisconceptionEngine, MisconceptionCode } from '@/engine/math/misconceptions';

interface MisconceptionTestCase {
  id: string;
  concept: string;
  problemExpr: string;
  studentAnswer: string;
  expectedDetected: boolean;
  expectedCode?: MisconceptionCode;
  minConfidence?: number;
}

const MISCONCEPTION_BENCHMARK_CASES: MisconceptionTestCase[] = [
  // ---------------------------------------------------------------------------
  // 1. MISSING_INNER_DERIVATIVE (Chain Rule) - 10 Cases
  // ---------------------------------------------------------------------------
  { id: 'CHAIN_ERR_01', concept: 'Chain Rule', problemExpr: '(3*x^2 - 2*x + 4)^5', studentAnswer: '5*(3*x^2 - 2*x + 4)^4', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_02', concept: 'Chain Rule', problemExpr: '(4*x + 1)^3', studentAnswer: '3*(4*x + 1)^2', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_03', concept: 'Chain Rule', problemExpr: 'sin(3*x^2 + 1)', studentAnswer: 'cos(3*x^2 + 1)', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_04', concept: 'Chain Rule', problemExpr: 'cos(5*x)', studentAnswer: '-sin(5*x)', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_05', concept: 'Chain Rule', problemExpr: 'exp(4*x - 1)', studentAnswer: 'exp(4*x - 1)', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_06', concept: 'Chain Rule', problemExpr: 'ln(5*x^2 + 2)', studentAnswer: '1 / (5*x^2 + 2)', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_07', concept: 'Chain Rule', problemExpr: '(2*x^3 - 5*x)^4', studentAnswer: '4*(2*x^3 - 5*x)^3', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_08', concept: 'Chain Rule', problemExpr: 'tan(2*x^3)', studentAnswer: 'sec(2*x^3)^2', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_09', concept: 'Chain Rule', problemExpr: 'sin(x)^3', studentAnswer: '3*sin(x)^2', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },
  { id: 'CHAIN_ERR_10', concept: 'Chain Rule', problemExpr: '(1 - 2*x^2)^4', studentAnswer: '4*(1 - 2*x^2)^3', expectedDetected: true, expectedCode: 'MISSING_INNER_DERIVATIVE', minConfidence: 0.9 },

  // ---------------------------------------------------------------------------
  // 2. POWER_RULE_NO_REDUCE (Power Rule) - 8 Cases
  // ---------------------------------------------------------------------------
  { id: 'POW_ERR_01', concept: 'Power Rule', problemExpr: 'x^5', studentAnswer: '5*x^5', expectedDetected: true, expectedCode: 'POWER_RULE_NO_REDUCE', minConfidence: 0.9 },
  { id: 'POW_ERR_02', concept: 'Power Rule', problemExpr: 'x^8', studentAnswer: '8*x^8', expectedDetected: true, expectedCode: 'POWER_RULE_NO_REDUCE', minConfidence: 0.9 },
  { id: 'POW_ERR_03', concept: 'Power Rule', problemExpr: 'x^3', studentAnswer: '3*x^3', expectedDetected: true, expectedCode: 'POWER_RULE_NO_REDUCE', minConfidence: 0.9 },
  { id: 'POW_ERR_04', concept: 'Power Rule', problemExpr: 'x^10', studentAnswer: '10*x^10', expectedDetected: true, expectedCode: 'POWER_RULE_NO_REDUCE', minConfidence: 0.9 },
  { id: 'POW_ERR_05', concept: 'Power Rule', problemExpr: 'x^2', studentAnswer: '2*x^2', expectedDetected: true, expectedCode: 'POWER_RULE_NO_REDUCE', minConfidence: 0.9 },
  { id: 'POW_ERR_06', concept: 'Power Rule', problemExpr: 'x^6', studentAnswer: '6*x^6', expectedDetected: true, expectedCode: 'POWER_RULE_NO_REDUCE', minConfidence: 0.9 },
  { id: 'POW_ERR_07', concept: 'Power Rule', problemExpr: 'x^4', studentAnswer: '4*x^4', expectedDetected: true, expectedCode: 'POWER_RULE_NO_REDUCE', minConfidence: 0.9 },
  { id: 'POW_ERR_08', concept: 'Power Rule', problemExpr: 'x^7', studentAnswer: '7*x^7', expectedDetected: true, expectedCode: 'POWER_RULE_NO_REDUCE', minConfidence: 0.9 },

  // ---------------------------------------------------------------------------
  // 3. POWER_RULE_FORGOT_COEFF (Power Rule) - 6 Cases
  // ---------------------------------------------------------------------------
  { id: 'POW_COEFF_01', concept: 'Power Rule', problemExpr: 'x^6', studentAnswer: 'x^5', expectedDetected: true, expectedCode: 'POWER_RULE_FORGOT_COEFF' },
  { id: 'POW_COEFF_02', concept: 'Power Rule', problemExpr: 'x^4', studentAnswer: 'x^3', expectedDetected: true, expectedCode: 'POWER_RULE_FORGOT_COEFF' },
  { id: 'POW_COEFF_03', concept: 'Power Rule', problemExpr: 'x^7', studentAnswer: 'x^6', expectedDetected: true, expectedCode: 'POWER_RULE_FORGOT_COEFF' },
  { id: 'POW_COEFF_04', concept: 'Power Rule', problemExpr: 'x^5', studentAnswer: 'x^4', expectedDetected: true, expectedCode: 'POWER_RULE_FORGOT_COEFF' },
  { id: 'POW_COEFF_05', concept: 'Power Rule', problemExpr: 'x^9', studentAnswer: 'x^8', expectedDetected: true, expectedCode: 'POWER_RULE_FORGOT_COEFF' },
  { id: 'POW_COEFF_06', concept: 'Power Rule', problemExpr: 'x^3', studentAnswer: 'x^2', expectedDetected: true, expectedCode: 'POWER_RULE_FORGOT_COEFF' },

  // ---------------------------------------------------------------------------
  // 4. PRODUCT_RULE_MULTIPLY_DERIVS (Product Rule) - 8 Cases
  // ---------------------------------------------------------------------------
  { id: 'PROD_MUL_01', concept: 'Product Rule', problemExpr: 'x^2 * sin(x)', studentAnswer: '2*x * cos(x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' },
  { id: 'PROD_MUL_02', concept: 'Product Rule', problemExpr: 'x^3 * cos(x)', studentAnswer: '3*x^2 * (-sin(x))', expectedDetected: true, expectedCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' },
  { id: 'PROD_MUL_03', concept: 'Product Rule', problemExpr: 'x^4 * sin(x)', studentAnswer: '4*x^3 * cos(x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' },
  { id: 'PROD_MUL_04', concept: 'Product Rule', problemExpr: 'sin(x) * cos(x)', studentAnswer: 'cos(x) * (-sin(x))', expectedDetected: true, expectedCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' },
  { id: 'PROD_MUL_05', concept: 'Product Rule', problemExpr: 'x^2 * tan(x)', studentAnswer: '2*x * sec(x)^2', expectedDetected: true, expectedCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' },
  { id: 'PROD_MUL_06', concept: 'Product Rule', problemExpr: 'x^5 * cos(x)', studentAnswer: '5*x^4 * (-sin(x))', expectedDetected: true, expectedCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' },
  { id: 'PROD_MUL_07', concept: 'Product Rule', problemExpr: '(2*x + 1) * (x^2 + 3)', studentAnswer: '2 * (2*x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' },
  { id: 'PROD_MUL_08', concept: 'Product Rule', problemExpr: 'x^3 * sin(x)', studentAnswer: '3*x^2 * cos(x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_MULTIPLY_DERIVS' },

  // ---------------------------------------------------------------------------
  // 5. PRODUCT_RULE_OMITTED_TERM (Product Rule) - 5 Cases
  // ---------------------------------------------------------------------------
  { id: 'PROD_OMIT_01', concept: 'Product Rule', problemExpr: 'x^3 * sin(x)', studentAnswer: '3*x^2 * sin(x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_OMITTED_TERM' },
  { id: 'PROD_OMIT_02', concept: 'Product Rule', problemExpr: 'x^2 * cos(x)', studentAnswer: '2*x * cos(x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_OMITTED_TERM' },
  { id: 'PROD_OMIT_03', concept: 'Product Rule', problemExpr: 'x^4 * sin(x)', studentAnswer: '4*x^3 * sin(x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_OMITTED_TERM' },
  { id: 'PROD_OMIT_04', concept: 'Product Rule', problemExpr: 'x^2 * sin(x)', studentAnswer: 'x^2 * cos(x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_OMITTED_TERM' },
  { id: 'PROD_OMIT_05', concept: 'Product Rule', problemExpr: 'x^3 * cos(x)', studentAnswer: '-x^3 * sin(x)', expectedDetected: true, expectedCode: 'PRODUCT_RULE_OMITTED_TERM' },

  // ---------------------------------------------------------------------------
  // 6. QUOTIENT_RULE_SIGN_FLIP (Quotient Rule) - 4 Cases
  // ---------------------------------------------------------------------------
  { id: 'QUOT_SIGN_01', concept: 'Quotient Rule', problemExpr: '(2*x + 1) / (x^2 + 3)', studentAnswer: '(6*x^2 + 2*x + 6) / (x^2 + 3)^2', expectedDetected: true, expectedCode: 'QUOTIENT_RULE_SIGN_FLIP' },
  { id: 'QUOT_SIGN_02', concept: 'Quotient Rule', problemExpr: 'sin(x) / x', studentAnswer: '(x*cos(x) + sin(x)) / x^2', expectedDetected: true, expectedCode: 'QUOTIENT_RULE_SIGN_FLIP' },
  { id: 'QUOT_SIGN_03', concept: 'Quotient Rule', problemExpr: 'cos(x) / x', studentAnswer: '(-x*sin(x) + cos(x)) / x^2', expectedDetected: true, expectedCode: 'QUOTIENT_RULE_SIGN_FLIP' },
  { id: 'QUOT_SIGN_04', concept: 'Quotient Rule', problemExpr: 'x^2 / (x + 1)', studentAnswer: '(3*x^2 + 2*x) / (x + 1)^2', expectedDetected: true, expectedCode: 'QUOTIENT_RULE_SIGN_FLIP' },

  // ---------------------------------------------------------------------------
  // 7. QUOTIENT_RULE_NO_SQUARE (Quotient Rule) - 4 Cases
  // ---------------------------------------------------------------------------
  { id: 'QUOT_NOSQ_01', concept: 'Quotient Rule', problemExpr: '(2*x + 1) / (x^2 + 3)', studentAnswer: '(-2*x^2 - 2*x + 6) / (x^2 + 3)', expectedDetected: true, expectedCode: 'QUOTIENT_RULE_NO_SQUARE' },
  { id: 'QUOT_NOSQ_02', concept: 'Quotient Rule', problemExpr: 'sin(x) / x', studentAnswer: '(x*cos(x) - sin(x)) / x', expectedDetected: true, expectedCode: 'QUOTIENT_RULE_NO_SQUARE' },
  { id: 'QUOT_NOSQ_03', concept: 'Quotient Rule', problemExpr: 'x^2 / (x - 1)', studentAnswer: '(x^2 - 2*x) / (x - 1)', expectedDetected: true, expectedCode: 'QUOTIENT_RULE_NO_SQUARE' },
  { id: 'QUOT_NOSQ_04', concept: 'Quotient Rule', problemExpr: '(3*x - 2) / (5*x + 4)', studentAnswer: '22 / (5*x + 4)', expectedDetected: true, expectedCode: 'QUOTIENT_RULE_NO_SQUARE' },

  // ---------------------------------------------------------------------------
  // 8. TRIG_DERIVATIVE_SIGN_ERROR (Trigonometry) - 4 Cases
  // ---------------------------------------------------------------------------
  { id: 'TRIG_SIGN_01', concept: 'Trigonometric Derivatives', problemExpr: 'cos(x)', studentAnswer: 'sin(x)', expectedDetected: true, expectedCode: 'TRIG_DERIVATIVE_SIGN_ERROR' },
  { id: 'TRIG_SIGN_02', concept: 'Trigonometric Derivatives', problemExpr: 'cos(3*x)', studentAnswer: 'sin(3*x)', expectedDetected: true, expectedCode: 'TRIG_DERIVATIVE_SIGN_ERROR' },
  { id: 'TRIG_SIGN_03', concept: 'Trigonometric Derivatives', problemExpr: 'cos(2*x + 1)', studentAnswer: 'sin(2*x + 1)', expectedDetected: true, expectedCode: 'TRIG_DERIVATIVE_SIGN_ERROR' },
  { id: 'TRIG_SIGN_04', concept: 'Trigonometric Derivatives', problemExpr: 'cos(x^2)', studentAnswer: 'sin(x^2)', expectedDetected: true, expectedCode: 'TRIG_DERIVATIVE_SIGN_ERROR' },

  // ---------------------------------------------------------------------------
  // 9. UNRELATED / AMBIGUOUS / CORRECT SAFETY (Section 29) - 8 Cases
  // ---------------------------------------------------------------------------
  { id: 'SAFE_UNRELATED_01', concept: 'Chain Rule', problemExpr: '(3*x^2 - 2*x + 4)^5', studentAnswer: '999*x + 42', expectedDetected: false },
  { id: 'SAFE_UNRELATED_02', concept: 'Power Rule', problemExpr: 'x^5', studentAnswer: '42', expectedDetected: false },
  { id: 'SAFE_UNRELATED_03', concept: 'Product Rule', problemExpr: 'x^2 * sin(x)', studentAnswer: 'x^7 - 3*x', expectedDetected: false },
  { id: 'SAFE_UNRELATED_04', concept: 'Quotient Rule', problemExpr: '(2*x + 1) / (x^2 + 3)', studentAnswer: '100 / x', expectedDetected: false },
  { id: 'SAFE_CORRECT_01', concept: 'Chain Rule', problemExpr: '(3*x^2 - 2*x + 4)^5', studentAnswer: '5*(3*x^2 - 2*x + 4)^4 * (6*x - 2)', expectedDetected: false },
  { id: 'SAFE_CORRECT_02', concept: 'Power Rule', problemExpr: 'x^5', studentAnswer: '5*x^4', expectedDetected: false },
  { id: 'SAFE_CORRECT_03', concept: 'Product Rule', problemExpr: 'x^2 * sin(x)', studentAnswer: '2*x*sin(x) + x^2*cos(x)', expectedDetected: false },
  { id: 'SAFE_CORRECT_04', concept: 'Trigonometric Derivatives', problemExpr: 'cos(x)', studentAnswer: '-sin(x)', expectedDetected: false },
];

describe('50+ Misconception Classification Benchmark Suite', () => {
  it(`contains ${MISCONCEPTION_BENCHMARK_CASES.length} curated misconception test cases across all categories`, () => {
    expect(MISCONCEPTION_BENCHMARK_CASES.length).toBeGreaterThanOrEqual(50);
  });

  MISCONCEPTION_BENCHMARK_CASES.forEach((tc) => {
    it(`[${tc.id}] ${tc.concept} (${tc.expectedCode || 'SAFE_UNCLASSIFIED'}): diagnosing "${tc.studentAnswer}" on ${tc.problemExpr}`, () => {
      const problemAst = parseMath(tc.problemExpr);
      const studentAst = parseMath(tc.studentAnswer);

      const diag = MisconceptionEngine.diagnose(studentAst, problemAst, tc.concept);

      expect(diag.detected).toBe(tc.expectedDetected);

      if (tc.expectedDetected) {
        expect(diag.code).toBe(tc.expectedCode);
        if (tc.minConfidence) {
          expect(diag.confidence).toBeGreaterThanOrEqual(tc.minConfidence);
        }
        expect(diag.name?.length).toBeGreaterThan(3);
        expect(diag.diagnosis?.length).toBeGreaterThan(5);
        expect(diag.guidanceTip?.length).toBeGreaterThan(5);
      } else {
        expect(diag.confidence).toBeLessThan(0.5);
      }
    });
  });
});
