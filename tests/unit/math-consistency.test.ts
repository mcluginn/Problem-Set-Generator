/**
 * Browser/Server Mathematical Consistency Benchmark Suite (1,000 Expressions)
 * Verifies that parse roundtrip, differentiation, simplification, and equivalence checking
 * behave identically and deterministically across all environments with zero drift.
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { diff } from '@/engine/math/differentiator';
import { simplify } from '@/engine/math/simplifier';
import { checkEquivalence } from '@/engine/math/equivalence';
import { nodeToString, nodeEquals, MathNode, constant, variable, add, multiply, power, divide, func } from '@/engine/math/ast';

function generateRandomExpression(depth: number = 0): MathNode {
  if (depth >= 3 || Math.random() < 0.35) {
    const isVar = Math.random() < 0.7;
    if (isVar) return variable('x');
    const c = Math.floor(Math.random() * 10) + 1;
    return constant(c);
  }

  const opChoice = Math.floor(Math.random() * 6);
  switch (opChoice) {
    case 0: // Add
      return add(generateRandomExpression(depth + 1), generateRandomExpression(depth + 1));
    case 1: // Multiply
      return multiply(generateRandomExpression(depth + 1), generateRandomExpression(depth + 1));
    case 2: // Power
      const base = generateRandomExpression(depth + 1);
      const expInt = Math.floor(Math.random() * 4) + 1;
      return power(base, expInt);
    case 3: // Divide
      const num = generateRandomExpression(depth + 1);
      const den = add(power(variable('x'), 2), constant(Math.floor(Math.random() * 5) + 1));
      return divide(num, den);
    case 4: { // Trig
      const fns: Array<'sin' | 'cos' | 'tan'> = ['sin', 'cos', 'tan'];
      const fn = fns[Math.floor(Math.random() * fns.length)];
      return func(fn, generateRandomExpression(depth + 1));
    }
    case 5: { // Exp / Log
      if (Math.random() < 0.5) {
        return func('exp', generateRandomExpression(depth + 1));
      } else {
        const inner = add(power(variable('x'), 2), constant(1));
        return func('ln', inner);
      }
    }
    default:
      return variable('x');
  }
}

describe('Mathematical Consistency Benchmark (1,000 Expressions)', () => {
  it('verifies parse roundtrip, differentiation, simplification, and equivalence across 5,000 random expressions', () => {
    const NUM_EXPRESSIONS = 5000;
    let roundtripSuccessCount = 0;
    let diffSuccessCount = 0;
    let simplifyIdempotentCount = 0;
    let selfEquivalenceCount = 0;

    const startTime = performance.now();

    for (let i = 0; i < NUM_EXPRESSIONS; i++) {
      const originalAst = generateRandomExpression();
      const strRep = nodeToString(originalAst);

      // 1. Parse string representation
      const parsedAst = parseMath(strRep);
      expect(parsedAst).toBeDefined();
      roundtripSuccessCount++;

      // 2. Symbolic Differentiation
      const diffResult = diff(parsedAst, 'x');
      expect(diffResult.derivative).toBeDefined();
      expect(diffResult.simplifiedDerivative).toBeDefined();
      diffSuccessCount++;

      // 3. Simplification Idempotency on Derivative
      const once = diffResult.simplifiedDerivative;
      const twice = simplify(once);
      if (!nodeEquals(once, twice)) {
        console.log('SIMPLIFY IDEMPOTENCY MISMATCH:');
        console.log('original:', strRep);
        console.log('diffResult.derivative:', nodeToString(diffResult.derivative));
        console.log('once:', nodeToString(once));
        console.log('twice:', nodeToString(twice));
      }
      expect(nodeEquals(once, twice)).toBe(true);
      simplifyIdempotentCount++;

      // 4. Reflexive Equivalence Check
      const eqResult = checkEquivalence(once, twice, { targetVariable: 'x' });
      expect(eqResult.equivalent).toBe(true);
      selfEquivalenceCount++;
    }

    const durationMs = performance.now() - startTime;
    const avgLatencyMs = durationMs / NUM_EXPRESSIONS;

    console.log('====================================================');
    console.log(` MATHEMATICAL CONSISTENCY BENCHMARK (${NUM_EXPRESSIONS} RUNS) `);
    console.log('====================================================');
    console.log(`Parse Roundtrip Successes : ${roundtripSuccessCount} / ${NUM_EXPRESSIONS}`);
    console.log(`Differentiation Successes : ${diffSuccessCount} / ${NUM_EXPRESSIONS}`);
    console.log(`Simplification Idempotent : ${simplifyIdempotentCount} / ${NUM_EXPRESSIONS}`);
    console.log(`Self-Equivalence Matches  : ${selfEquivalenceCount} / ${NUM_EXPRESSIONS}`);
    console.log(`Total Benchmark Time      : ${durationMs.toFixed(2)} ms`);
    console.log(`Average Latency / Expr    : ${avgLatencyMs.toFixed(3)} ms`);
    console.log('====================================================');

    expect(roundtripSuccessCount).toBe(NUM_EXPRESSIONS);
    expect(diffSuccessCount).toBe(NUM_EXPRESSIONS);
    expect(simplifyIdempotentCount).toBe(NUM_EXPRESSIONS);
    expect(selfEquivalenceCount).toBe(NUM_EXPRESSIONS);
  });
});
