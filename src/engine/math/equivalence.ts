/**
 * 4-Level Algebraic Equivalence Engine
 * Strictly distinguishes symbolic equality, zero-difference algebraic reduction,
 * cross-multiplication, and domain-safe randomized numerical checks.
 */

import {
  MathNode,
  constant,
  ONE,
  nodeEquals,
  subtract,
  multiply,
  divide,
  getVariables,
} from './ast';
import { Simplifier, simplify, expand } from './simplifier';
import { NumericalEvaluator } from './evaluator';

export type EquivalenceStatus =
  | 'EQUIVALENT'
  | 'NOT_EQUIVALENT'
  | 'UNABLE_TO_VERIFY'
  | 'DOMAIN_MISMATCH'
  | 'INVALID_INPUT';

export type EquivalenceMethod =
  | 'symbolic_canonicalization'
  | 'symbolic_zero_difference'
  | 'domain_symbolic_cross_multiplication'
  | 'numerical_sampling_confidence'
  | 'none';

export interface EquivalenceResult {
  status: EquivalenceStatus;
  equivalent: boolean; // boolean convenience flag (true if status === 'EQUIVALENT')
  confidence: number; // 0.0 to 1.0
  level: 1 | 2 | 3 | 4 | 0;
  methodUsed: EquivalenceMethod;
  symbolicMatch: boolean;
  domainStatus: 'compatible' | 'domain_error' | 'singularity_detected' | 'unverified';
  domainDifferenceDetected?: boolean;
  samplesTested?: number;
  maxSampleError?: number;
  reason: string;
}

export const EQUIVALENCE_CONFIG = {
  MIN_NUMERIC_SAMPLES: 8,
  DEFAULT_NUMERIC_SAMPLES: 20,
  DEFAULT_ATOL: 1e-9,
  DEFAULT_RTOL: 1e-7,
};

export interface EquivalenceOptions {
  atol?: number;
  rtol?: number;
  sampleCount?: number;
  targetVariable?: string;
  strictDomainCheck?: boolean;
}

export class EquivalenceEngine {
  public static check(
    studentNode: MathNode,
    expectedNode: MathNode,
    options: EquivalenceOptions = {}
  ): EquivalenceResult {
    if (!studentNode || !expectedNode) {
      return {
        status: 'INVALID_INPUT',
        equivalent: false,
        confidence: 0.0,
        level: 0,
        methodUsed: 'none',
        symbolicMatch: false,
        domainStatus: 'unverified',
        reason: 'One or both input nodes are undefined or invalid.',
      };
    }

    const atol = options.atol ?? EQUIVALENCE_CONFIG.DEFAULT_ATOL;
    const rtol = options.rtol ?? EQUIVALENCE_CONFIG.DEFAULT_RTOL;
    const sampleCount = options.sampleCount ?? EQUIVALENCE_CONFIG.DEFAULT_NUMERIC_SAMPLES;
    const targetVar = options.targetVariable ?? 'x';

    // -------------------------------------------------------------------------
    // Level 1: AST Normalization & Canonicalization Match
    // -------------------------------------------------------------------------
    const sCanonical = Simplifier.simplify(studentNode);
    const eCanonical = Simplifier.simplify(expectedNode);

    if (nodeEquals(sCanonical, eCanonical)) {
      return {
        status: 'EQUIVALENT',
        equivalent: true,
        confidence: 1.0,
        level: 1,
        methodUsed: 'symbolic_canonicalization',
        symbolicMatch: true,
        domainStatus: 'compatible',
        reason: 'Expressions match identically under symbolic canonical normalization.',
      };
    }

    // -------------------------------------------------------------------------
    // Level 2: Exact Symbolic Zero-Difference Simplification: D(x) = S(x) - E(x)
    // -------------------------------------------------------------------------
    try {
      const diffAst = subtract(studentNode, expectedNode);
      const expandedDiff = expand(diffAst);
      const simplifiedDiff = simplify(expandedDiff);

      if (simplifiedDiff.type === 'constant' && simplifiedDiff.value.isZero()) {
        return {
          status: 'EQUIVALENT',
          equivalent: true,
          confidence: 1.0,
          level: 2,
          methodUsed: 'symbolic_zero_difference',
          symbolicMatch: true,
          domainStatus: 'compatible',
          reason: 'Exact symbolic expansion and algebraic reduction of S(x) - E(x) simplifies identically to 0.',
        };
      }
    } catch {
      // Continue to Level 3
    }

    // -------------------------------------------------------------------------
    // Level 3: Domain-Aware Symbolic Cross-Multiplication for Fractions
    // -------------------------------------------------------------------------
    if (studentNode.type === 'divide' || expectedNode.type === 'divide') {
      const sNum = studentNode.type === 'divide' ? studentNode.numerator : studentNode;
      const sDen = studentNode.type === 'divide' ? studentNode.denominator : constant(1);
      const eNum = expectedNode.type === 'divide' ? expectedNode.numerator : expectedNode;
      const eDen = expectedNode.type === 'divide' ? expectedNode.denominator : constant(1);

      const crossDiff = subtract(
        multiply(sNum as MathNode, eDen as MathNode),
        multiply(eNum as MathNode, sDen as MathNode)
      );

      const simplifiedCross = simplify(expand(crossDiff));
      if (simplifiedCross.type === 'constant' && simplifiedCross.value.isZero()) {
        // Audit domain singularity compatibility (e.g. (x^2-1)/(x-1) vs x+1)
        const domainDiff = EquivalenceEngine.detectDomainDifference(studentNode, expectedNode, targetVar);
        if (domainDiff && options.strictDomainCheck) {
          return {
            status: 'DOMAIN_MISMATCH',
            equivalent: false,
            confidence: 0.9,
            level: 3,
            methodUsed: 'domain_symbolic_cross_multiplication',
            symbolicMatch: true,
            domainStatus: 'domain_error',
            domainDifferenceDetected: true,
            reason: 'Expressions are algebraically identical on their common domain, but have different singularity domains (e.g. removable discontinuity).',
          };
        }

        return {
          status: 'EQUIVALENT',
          equivalent: true,
          confidence: 1.0,
          level: 3,
          methodUsed: 'domain_symbolic_cross_multiplication',
          symbolicMatch: true,
          domainStatus: 'compatible',
          domainDifferenceDetected: domainDiff,
          reason: 'Fractions match identically under symbolic cross-multiplication (N1*D2 - N2*D1 = 0).',
        };
      }
    }

    // -------------------------------------------------------------------------
    // Level 4: Domain-Safe Randomized Numerical Equivalence Check
    // (Probabilistic secondary confidence check - NOT a formal algebraic proof)
    // -------------------------------------------------------------------------
    const vars = new Set<string>([...getVariables(studentNode), ...getVariables(expectedNode)]);
    if (vars.size === 0) vars.add(targetVar);

    const intervalCandidateSets = [
      // Safe small positive open domain (inside sqrt(1-x^2), positive for ln(x))
      [
        { min: 0.15, max: 0.35 },
        { min: 0.40, max: 0.60 },
        { min: 0.65, max: 0.85 },
      ],
      // Standard medium range
      [
        { min: 1.2, max: 1.8 },
        { min: 2.2, max: 2.8 },
        { min: 3.2, max: 3.8 },
      ],
      // Positive integer-safe range
      [
        { min: 4.1, max: 4.9 },
        { min: 5.1, max: 5.9 },
      ],
    ];

    for (const safeIntervals of intervalCandidateSets) {
      let maxObservedError = 0;
      let successfulSamples = 0;

      for (let i = 0; i < sampleCount; i++) {
        const interval = safeIntervals[i % safeIntervals.length];
        const testPoint: Record<string, number> = {};

        for (const v of vars) {
          const rand = interval.min + Math.random() * (interval.max - interval.min);
          testPoint[v] = rand;
        }

        const sEval = NumericalEvaluator.evaluate(studentNode, testPoint);
        const eEval = NumericalEvaluator.evaluate(expectedNode, testPoint);

        if (!sEval.domainStatus.isValid || !eEval.domainStatus.isValid) {
          continue;
        }

        const error = Math.abs(sEval.value - eEval.value);
        const maxMagnitude = Math.max(Math.abs(sEval.value), Math.abs(eEval.value));
        const allowedTolerance = atol + rtol * maxMagnitude;

        if (error > allowedTolerance) {
          return {
            status: 'NOT_EQUIVALENT',
            equivalent: false,
            confidence: 0.0,
            level: 0,
            methodUsed: 'none',
            symbolicMatch: false,
            domainStatus: 'compatible',
            samplesTested: successfulSamples + 1,
            maxSampleError: error,
            reason: `Numerical divergence observed at point ${JSON.stringify(testPoint)}. Absolute/relative error (${error.toExponential(
              4
            )}) exceeded tolerance (${allowedTolerance.toExponential(4)}).`,
          };
        }

        maxObservedError = Math.max(maxObservedError, error);
        successfulSamples++;
      }

      if (successfulSamples >= EQUIVALENCE_CONFIG.MIN_NUMERIC_SAMPLES) {
        return {
          status: 'EQUIVALENT',
          equivalent: true,
          confidence: 0.9999,
          level: 4,
          methodUsed: 'numerical_sampling_confidence',
          symbolicMatch: false,
          domainStatus: 'compatible',
          samplesTested: successfulSamples,
          maxSampleError: maxObservedError,
          reason: `Domain-safe randomized numerical equivalence verified across ${successfulSamples} domain sample points (max error: ${maxObservedError.toExponential(
            3
          )}).`,
        };
      }
    }

    return {
      status: 'UNABLE_TO_VERIFY',
      equivalent: false,
      confidence: 0.0,
      level: 0,
      methodUsed: 'none',
      symbolicMatch: false,
      domainStatus: 'unverified',
      reason: 'Could not verify equivalence symbolically or with sufficient safe numerical domain samples.',
    };
  }

  /**
   * Detects whether one expression is a rational function with a removable denominator singularity.
   */
  private static detectDomainDifference(a: MathNode, b: MathNode, wrt: string): boolean {
    const aHasDenom = a.type === 'divide' && getVariables(a.denominator).has(wrt);
    const bHasDenom = b.type === 'divide' && getVariables(b.denominator).has(wrt);
    return aHasDenom !== bHasDenom;
  }
}

export function checkEquivalence(
  studentNode: MathNode,
  expectedNode: MathNode,
  options?: EquivalenceOptions
): EquivalenceResult {
  return EquivalenceEngine.check(studentNode, expectedNode, options);
}
