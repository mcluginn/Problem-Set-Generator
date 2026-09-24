/**
 * Teacher Calibration Engine Unit Test Suite
 * Engineering Practice Engine — Phase 3.5
 */

import { describe, it, expect } from 'vitest';
import { TeacherCalibrationEngine } from '@/engine/content/calibration';
import { ProblemBank } from '@/engine/content/problemBank';

describe('Teacher Calibration Engine (Phase 3.5)', () => {
  const engine = TeacherCalibrationEngine.getInstance();
  const bank = ProblemBank.getInstance();

  it('generates a calibrated set of 50 Chain Rule problems (10 per family across 5 families)', () => {
    const problems = engine.getCalibrationProblems();
    expect(problems.length).toBe(50);

    const familyCounts: Record<string, number> = {};
    for (const prob of problems) {
      familyCounts[prob.dna.familyId] = (familyCounts[prob.dna.familyId] || 0) + 1;
    }

    expect(familyCounts['FAM-GEN0102-CHAIN-POLY']).toBe(10);
    expect(familyCounts['FAM-GEN0102-CHAIN-TRIG']).toBe(10);
    expect(familyCounts['FAM-GEN0102-CHAIN-ERROR']).toBe(10);
    expect(familyCounts['FAM-GEN0102-CHAIN-RECOG']).toBe(10);
    expect(familyCounts['FAM-GEN0102-CHAIN-APP']).toBe(10);
  });

  it('records teacher reviews with 6-dimension ratings and updates lifecycle status', () => {
    const problems = engine.getCalibrationProblems();
    const targetProblem = problems[0];

    const review = engine.submitReview({
      problemId: targetProblem.dna.problemId,
      reviewer: 'Curriculum Chair Dr. Anderson',
      ratings: {
        mathematicalCorrectness: 5,
        skillAlignment: 5,
        clarity: 4,
        difficultySuitability: 4,
        educationalUsefulness: 5,
        diversityDistinctiveness: 4
      },
      decision: 'APPROVE',
      teacherNotes: 'Excellent standard quadratic chain rule problem with clear prompt.'
    });

    expect(review.id).toBeDefined();
    expect(review.decision).toBe('APPROVE');

    const fetchedReview = engine.getReviewForProblem(targetProblem.dna.problemId);
    expect(fetchedReview).toBeDefined();
    expect(fetchedReview?.ratings.mathematicalCorrectness).toBe(5);

    const storedProblem = bank.getProblemById(targetProblem.dna.problemId);
    expect(storedProblem?.lifecycleStatus).toBe('APPROVED');
  });

  it('records structured rejection reasons and flags when problems are rejected', () => {
    const problems = engine.getCalibrationProblems();
    const rejectTarget = problems[1];

    const review = engine.submitReview({
      problemId: rejectTarget.dna.problemId,
      reviewer: 'Teacher Reviewer',
      ratings: {
        mathematicalCorrectness: 4,
        skillAlignment: 3,
        clarity: 2,
        difficultySuitability: 2,
        educationalUsefulness: 2,
        diversityDistinctiveness: 2
      },
      decision: 'REJECT',
      rejectionReasons: ['POOR_WORDING', 'REPETITIVE'],
      teacherNotes: 'Wording is too ambiguous for first-year students.'
    });

    expect(review.decision).toBe('REJECT');
    expect(review.rejectionReasons).toContain('POOR_WORDING');

    const stored = bank.getProblemById(rejectTarget.dna.problemId);
    expect(stored?.lifecycleStatus).toBe('REJECTED');
  });

  it('performs side-by-side problem comparison and detects structural similarity', () => {
    const problems = engine.getCalibrationProblems();
    const probPoly1 = problems.find(p => p.dna.familyId === 'FAM-GEN0102-CHAIN-POLY')!;
    const probPoly2 = problems.filter(p => p.dna.familyId === 'FAM-GEN0102-CHAIN-POLY')[1]!;
    const probTrig = problems.find(p => p.dna.familyId === 'FAM-GEN0102-CHAIN-TRIG')!;

    const compPoly = engine.compareProblems(probPoly1, probPoly2);
    expect(compPoly.isSameFamily).toBe(true);
    expect(compPoly.pedagogicalOverlapScore).toBeGreaterThanOrEqual(0.7);

    const compDiverse = engine.compareProblems(probPoly1, probTrig);
    expect(compDiverse.isSameFamily).toBe(false);
    expect(compDiverse.astSimilarityScore).toBeLessThan(0.5);
  });
});
