/**
 * Problem Editor & Automatic Revalidation Unit Tests
 * Engineering Practice Engine — Phase 3.5
 */

import { describe, it, expect } from 'vitest';
import { TeacherCalibrationEngine } from '@/engine/content/calibration';
import { ProblemBank } from '@/engine/content/problemBank';

describe('Problem Editor & Automatic Revalidation (Phase 3.5)', () => {
  const engine = TeacherCalibrationEngine.getInstance();
  const bank = ProblemBank.getInstance();

  it('successfully saves valid teacher wording edits and passes revalidation', () => {
    const problems = engine.getCalibrationProblems();
    const target = problems.find(p => p.dna.familyId === 'FAM-GEN0102-CHAIN-APP')!;

    const result = engine.editAndRevalidateProblem(
      target.dna.problemId,
      {
        promptText: 'A high-precision linear actuator moves with position s(t). Compute its velocity v(t) = s\'(t):',
        contextStory: 'Robotics kinematics positioning system.'
      },
      'Senior Physics Faculty'
    );

    expect(result.success).toBe(true);
    expect(result.validationReport.isValid).toBe(true);
    expect(result.problem?.statement.promptText).toContain('high-precision linear actuator');

    const updated = bank.getProblemById(target.dna.problemId);
    expect(updated?.statement.promptText).toContain('high-precision linear actuator');
    expect(updated?.lifecycleStatus).toBe('APPROVED');
  });

  it('rejects invalid teacher edits that violate validation rules (e.g. empty prompt)', () => {
    const problems = engine.getCalibrationProblems();
    const target = problems[0];

    const result = engine.editAndRevalidateProblem(
      target.dna.problemId,
      {
        promptText: '' // Empty prompt
      },
      'Reviewer'
    );

    expect(result.success).toBe(false);
    expect(result.validationReport.isValid).toBe(false);
    expect(result.validationReport.rejectionReason).toBe('INVALID_SYNTAX');
  });
});
