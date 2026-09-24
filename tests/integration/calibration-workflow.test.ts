/**
 * End-to-End Teacher Calibration Workflow Integration Test
 * Engineering Practice Engine — Phase 3.5
 */

import { describe, it, expect } from 'vitest';
import { TeacherCalibrationEngine } from '@/engine/content/calibration';
import { ProblemBank } from '@/engine/content/problemBank';
import { CurriculumRegistry } from '@/engine/curriculum/registry';

describe('Teacher Calibration Workflow Integration (Phase 3.5)', () => {
  const engine = TeacherCalibrationEngine.getInstance();
  const bank = ProblemBank.getInstance();
  const currRegistry = CurriculumRegistry.getInstance();

  it('executes full calibration cycle: generation -> comparison -> edit -> revalidation -> review -> session simulation', () => {
    // 1. Ingest calibration batch
    const batch = engine.getCalibrationProblems();
    expect(batch.length).toBe(50);

    // 2. Inspect skill alignment
    const sampleProb = batch[0];
    const skill = currRegistry.getSkillById(sampleProb.dna.primarySkillId);
    expect(skill).toBeDefined();
    expect(skill?.id).toBe('SKILL-GEN0102-005');

    // 3. Side-by-side comparison
    const comp = engine.compareProblems(batch[0], batch[10]);
    expect(comp).toBeDefined();
    expect(comp.astSimilarityScore).toBeLessThanOrEqual(1.0);

    // 4. Problem edit & automatic revalidation
    const editRes = engine.editAndRevalidateProblem(
      sampleProb.dna.problemId,
      {
        promptText: 'Evaluate the first derivative dy/dx using the composite function Chain Rule:'
      },
      'Reviewing Faculty'
    );
    expect(editRes.success).toBe(true);

    // 5. Submit teacher rating and approval
    const review = engine.submitReview({
      problemId: sampleProb.dna.problemId,
      reviewer: 'Reviewing Faculty',
      ratings: {
        mathematicalCorrectness: 5,
        skillAlignment: 5,
        clarity: 5,
        difficultySuitability: 5,
        educationalUsefulness: 5,
        diversityDistinctiveness: 4
      },
      decision: 'APPROVE',
      teacherNotes: 'Problem passed teacher review with high pedagogical clarity.'
    });
    expect(review.decision).toBe('APPROVE');
    expect(bank.getProblemById(sampleProb.dna.problemId)?.lifecycleStatus).toBe('APPROVED');

    // 6. Practice session simulation
    const simReport = engine.simulate10QuestionSession(skill!.id);
    expect(simReport.totalProblems).toBe(10);
    expect(simReport.pedagogicalBalanceScore).toBeGreaterThan(0.5);
  });
});
