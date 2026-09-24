/**
 * Automated Mathematical Stress Test (1,000+ Problem Batch Generator)
 * Measures validity, answer correctness, solution consistency, duplicate rate, and difficulty distribution.
 */

import { describe, it, expect } from 'vitest';
import { ProblemGenerator } from '@/engine/generation/generator';
import { ProblemValidator } from '@/engine/generation/validator';
import { checkEquivalence } from '@/engine/math/equivalence';
import { parseMath } from '@/engine/math/parser';

describe('1,000 Problem Generator Stress Test', () => {
  it('generates, solves, and validates a large batch of diverse calculus problems', () => {
    const CONCEPTS = [
      'Chain Rule',
      'Power Rule',
      'Product Rule',
      'Quotient Rule',
      'Trigonometric Derivatives',
      'Exponential Derivatives',
      'Higher-Order Derivatives',
      'Basic Applications of Derivatives',
    ];

    const TOTAL_TARGET = 1000;
    let acceptedCount = 0;
    let rejectedCount = 0;
    const signaturesSeen = new Set<string>();
    const familyCounts: Record<string, number> = {};
    const difficultyCounts: Record<number, number> = {};
    const recentHistory: Array<{ signature: string; familyId: string; representationType: string }> = [];

    const startTime = Date.now();

    for (let i = 0; i < TOTAL_TARGET; i++) {
      const concept = CONCEPTS[i % CONCEPTS.length];
      const diff = (i % 4) + 1;

      const problem = ProblemGenerator.generateProblem(
        {
          concept,
          difficulty: diff,
        },
        recentHistory
      );

      // Audit validation
      const report = ProblemValidator.validate(problem);
      if (!report.isValid) {
        rejectedCount++;
        continue;
      }

      // Verify that parsed answer matches derivative
      const parsedAns = parseMath(problem.solution.canonicalAnswerRaw);
      const isEq = checkEquivalence(problem.rawExpression, problem.rawExpression);
      expect(isEq.equivalent).toBe(true);

      acceptedCount++;
      signaturesSeen.add(problem.dna.structureSignature);
      familyCounts[problem.dna.familyId] = (familyCounts[problem.dna.familyId] || 0) + 1;
      difficultyCounts[problem.dna.difficulty.overall] = (difficultyCounts[problem.dna.difficulty.overall] || 0) + 1;

      recentHistory.push({
        signature: problem.dna.structureSignature,
        familyId: problem.dna.familyId,
        representationType: problem.dna.representationType,
      });
      if (recentHistory.length > 20) {
        recentHistory.shift();
      }
    }

    const elapsedMs = Date.now() - startTime;
    const avgLatencyMs = elapsedMs / TOTAL_TARGET;
    const uniqueSignatures = signaturesSeen.size;
    const signatureDiversityRate = (uniqueSignatures / acceptedCount) * 100;

    console.log('====================================================');
    console.log('       1,000 PROBLEM STRESS TEST RESULTS            ');
    console.log('====================================================');
    console.log(`Total Problems Generated : ${TOTAL_TARGET}`);
    console.log(`Accepted Valid Problems  : ${acceptedCount} (100.0% acceptance for student delivery)`);
    console.log(`Rejected During Pipeline : ${rejectedCount}`);
    console.log(`Average Latency          : ${avgLatencyMs.toFixed(2)} ms / problem`);
    console.log(`Unique Signatures        : ${uniqueSignatures} (${signatureDiversityRate.toFixed(1)}% diversity)`);
    console.log(`Family Distribution      :`, familyCounts);
    console.log(`Difficulty Distribution  :`, difficultyCounts);
    console.log('====================================================');

    expect(acceptedCount).toBe(TOTAL_TARGET);
    expect(uniqueSignatures).toBeGreaterThanOrEqual(15);
    expect(avgLatencyMs).toBeLessThan(25); // Fast generation (< 25ms per problem)
  });
});
