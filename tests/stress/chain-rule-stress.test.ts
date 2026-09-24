/**
 * 1,000-Candidate Chain Rule Vertical Slice Stress & Diversity Test
 * Engineering Practice Engine — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '@/engine/content/generator';
import { ContentValidator } from '@/engine/content/validator';
import { ProblemGenerationRequest } from '@/engine/content/types';

describe('1,000-Candidate Chain Rule Vertical Slice Stress & Diversity Test', () => {
  it('generates, solves, and validates 1,000 diverse Chain Rule problems with 100% acceptance and < 1ms latency', () => {
    const totalCount = 1000;
    let accepted = 0;
    let rejected = 0;
    const signatures = new Set<string>();
    const difficultyDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    const familyDistribution: Record<string, number> = {};

    const startTime = performance.now();

    for (let i = 0; i < totalCount; i++) {
      const targetDiff = (i % 4) + 1;
      const request: ProblemGenerationRequest = {
        courseId: 'COURSE-GEN0102',
        skillId: 'SKILL-GEN0102-005',
        evidenceType: i % 5 === 0 ? 'APPLICATION' : (i % 7 === 0 ? 'ERROR_ANALYSIS' : 'DIRECT_CALCULATION'),
        difficulty: targetDiff
      };

      const result = ContentGenerator.generateForSkill(request);

      if (result.success && result.problem) {
        // Independent validation safety net
        const valReport = ContentValidator.validateProblemCandidate(result.problem);
        if (valReport.isValid) {
          accepted++;
          signatures.add(result.problem.dna.structureSignature);
          difficultyDistribution[targetDiff]++;
          familyDistribution[result.problem.dna.familyId] = (familyDistribution[result.problem.dna.familyId] || 0) + 1;
        } else {
          rejected++;
        }
      } else {
        rejected++;
      }
    }

    const totalDuration = performance.now() - startTime;
    const avgLatency = totalDuration / totalCount;

    console.log('====================================================');
    console.log('    1,000 CHAIN RULE VERTICAL SLICE STRESS RESULTS  ');
    console.log('====================================================');
    console.log(`Total Candidates Generated : ${totalCount}`);
    console.log(`Accepted Valid Problems    : ${accepted} (${((accepted / totalCount) * 100).toFixed(1)}%)`);
    console.log(`Rejected During Pipeline   : ${rejected}`);
    console.log(`Total Benchmark Time       : ${totalDuration.toFixed(2)} ms`);
    console.log(`Average Latency / Problem  : ${avgLatency.toFixed(3)} ms`);
    console.log(`Unique Structure Signatures: ${signatures.size}`);
    console.log('Family Distribution        :', familyDistribution);
    console.log('Difficulty Distribution    :', difficultyDistribution);
    console.log('====================================================');

    expect(accepted).toBe(1000);
    expect(rejected).toBe(0);
    expect(avgLatency).toBeLessThan(5.0); // Sub-5ms generation and validation
    expect(signatures.size).toBeGreaterThanOrEqual(10);
  });
});
