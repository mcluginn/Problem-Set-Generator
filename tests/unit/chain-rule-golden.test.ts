/**
 * Chain Rule Golden Benchmark Test Suite (10+ Hand-Verified Benchmark Problems)
 * Engineering Practice Engine — Phase 3 Vertical Slice Verification
 */

import { describe, it, expect } from 'vitest';
import { Differentiator } from '@/engine/math/differentiator';
import { simplify } from '@/engine/math/simplifier';
import { EquivalenceEngine } from '@/engine/math/equivalence';
import { parseMath } from '@/engine/math/parser';
import { nodeToString } from '@/engine/math/ast';
import { PROBLEM_TEMPLATES_REGISTRY } from '@/engine/content/problemTemplates';

interface GoldenChainProblem {
  id: string;
  name: string;
  expressionStr: string;
  expectedDerivativeStr: string;
  familyId: string;
  category: 'POLYNOMIAL_POWER' | 'TRIGONOMETRIC_INNER' | 'RADICAL' | 'KINEMATICS' | 'ERROR_ANALYSIS';
}

const GOLDEN_CHAIN_BENCHMARKS: GoldenChainProblem[] = [
  {
    id: 'GOLDEN-CHAIN-001',
    name: 'Standard Quadratic Outer Power 4',
    expressionStr: '(3*x^2 + 1)^4',
    expectedDerivativeStr: '24*x*(3*x^2 + 1)^3',
    familyId: 'FAM-GEN0102-CHAIN-POLY',
    category: 'POLYNOMIAL_POWER'
  },
  {
    id: 'GOLDEN-CHAIN-002',
    name: 'Full Quadratic with Linear Term and Outer Power 3',
    expressionStr: '(5*x^2 - 2*x + 4)^3',
    expectedDerivativeStr: '3*(10*x - 2)*(5*x^2 - 2*x + 4)^2',
    familyId: 'FAM-GEN0102-CHAIN-POLY',
    category: 'POLYNOMIAL_POWER'
  },
  {
    id: 'GOLDEN-CHAIN-003',
    name: 'Cubic Inner Polynomial with Outer Power 5',
    expressionStr: '(2*x^3 + 7)^5',
    expectedDerivativeStr: '30*x^2*(2*x^3 + 7)^4',
    familyId: 'FAM-GEN0102-CHAIN-POLY',
    category: 'POLYNOMIAL_POWER'
  },
  {
    id: 'GOLDEN-CHAIN-004',
    name: 'Quadratic Inner Argument inside Sine Function',
    expressionStr: 'sin(3*x^2 + 1)',
    expectedDerivativeStr: '6*x*cos(3*x^2 + 1)',
    familyId: 'FAM-GEN0102-CHAIN-TRIG',
    category: 'TRIGONOMETRIC_INNER'
  },
  {
    id: 'GOLDEN-CHAIN-005',
    name: 'Cubic Inner Argument inside Cosine Function',
    expressionStr: 'cos(4*x^3)',
    expectedDerivativeStr: '-12*x^2*sin(4*x^3)',
    familyId: 'FAM-GEN0102-CHAIN-TRIG',
    category: 'TRIGONOMETRIC_INNER'
  },
  {
    id: 'GOLDEN-CHAIN-006',
    name: 'Linear Inner Function with Higher Outer Power',
    expressionStr: '(4*x - 3)^7',
    expectedDerivativeStr: '28*(4*x - 3)^6',
    familyId: 'FAM-GEN0102-CHAIN-POLY',
    category: 'POLYNOMIAL_POWER'
  },
  {
    id: 'GOLDEN-CHAIN-007',
    name: 'Negative Coefficient Inner Quadratic',
    expressionStr: '(-2*x^2 + 5)^4',
    expectedDerivativeStr: '-16*x*(-2*x^2 + 5)^3',
    familyId: 'FAM-GEN0102-CHAIN-POLY',
    category: 'POLYNOMIAL_POWER'
  },
  {
    id: 'GOLDEN-CHAIN-008',
    name: 'Quadratic Inner Argument inside Tangent Function',
    expressionStr: 'tan(2*x^2 + 5)',
    expectedDerivativeStr: '4*x*(sec(2*x^2 + 5))^2',
    familyId: 'FAM-GEN0102-CHAIN-TRIG',
    category: 'TRIGONOMETRIC_INNER'
  },
  {
    id: 'GOLDEN-CHAIN-009',
    name: 'Kinematic Actuator Position Model Evaluation',
    expressionStr: '(2*t^2 + 1)^3',
    expectedDerivativeStr: '12*t*(2*t^2 + 1)^2',
    familyId: 'FAM-GEN0102-CHAIN-APP',
    category: 'KINEMATICS'
  },
  {
    id: 'GOLDEN-CHAIN-010',
    name: 'Error Analysis Missing Inner Factor Diagnostic',
    expressionStr: '(3*x^2 + 4)^5',
    expectedDerivativeStr: '30*x*(3*x^2 + 4)^4',
    familyId: 'FAM-GEN0102-CHAIN-ERROR',
    category: 'ERROR_ANALYSIS'
  }
];

describe('Chain Rule 10+ Golden Benchmark Suite (SKILL-GEN0102-005)', () => {
  it('hand-verifies exact symbolic equivalence for all 10 Golden Benchmarks', () => {
    for (const golden of GOLDEN_CHAIN_BENCHMARKS) {
      const varName = golden.category === 'KINEMATICS' ? 't' : 'x';
      const parsedInput = parseMath(golden.expressionStr);
      const parsedExpected = parseMath(golden.expectedDerivativeStr);

      const computedRes = Differentiator.differentiate(parsedInput, varName);
      const simplifiedComputed = computedRes.simplifiedDerivative;

      const isMatch = EquivalenceEngine.check(simplifiedComputed, parsedExpected, { targetVariable: varName }).equivalent;
      expect(isMatch).toBe(true);
    }
  });

  it('verifies that the concrete Chain Rule template executes parameter overrides matching Golden Problem 1', () => {
    const stdTemplate = PROBLEM_TEMPLATES_REGISTRY['TMPL-CHAIN-POLY-STD'];
    const result = stdTemplate.generateCandidate(2, { a: 3, b: 0, c: 1, p: 4 });

    expect(result.rawExpression).toBeDefined();
    expect(result.statement.expressionLatex).toContain('x^{2}');
    expect(result.statement.expressionLatex).toContain('^{4}');
    expect(result.reasoningTrace[1].intermediateExpressionLatex).toContain('6x');
  });
});
