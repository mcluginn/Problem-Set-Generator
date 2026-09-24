/**
 * 10-Question Practice Session Simulator Unit Test Suite
 * Engineering Practice Engine — Phase 3.5
 */

import { describe, it, expect } from 'vitest';
import { TeacherCalibrationEngine } from '@/engine/content/calibration';

describe('10-Question Practice Session Simulator (Phase 3.5)', () => {
  const engine = TeacherCalibrationEngine.getInstance();

  it('simulates a 10-question standard practice session with balanced family diversity and difficulty trajectory', () => {
    const report = engine.simulate10QuestionSession('SKILL-GEN0102-005');

    expect(report.totalProblems).toBe(10);
    expect(report.problems.length).toBe(10);
    expect(report.difficultyTrajectory.length).toBe(10);

    // Verify multi-family distribution
    const familyCount = Object.keys(report.familyDistribution).length;
    expect(familyCount).toBeGreaterThanOrEqual(3);

    // Verify evidence variety (Direct Calculation, Error Analysis, Method Recognition, Application)
    const evidenceCount = Object.keys(report.evidenceDistribution).length;
    expect(evidenceCount).toBeGreaterThanOrEqual(3);

    // Repetition risk should be low
    expect(report.repetitionRiskScore).toBeLessThanOrEqual(0.5);
    expect(report.transferCount).toBeGreaterThanOrEqual(1);
  });

  it('simulates an adaptive 10-question session targeting student misconceptions and mastery growth', () => {
    const report = engine.simulateAdaptiveSession('SKILL-GEN0102-005', {
      initialMastery: 0.25,
      hasPersistentMisconception: 'MISSING_INNER_DERIVATIVE'
    });

    expect(report.totalProblems).toBe(10);
    // Student with persistent misconception should receive targeted Error Analysis remediation
    expect(report.remediationCount).toBeGreaterThanOrEqual(2);

    // Difficulty should adapt upwards as simulated mastery increases
    const startDiff = report.difficultyTrajectory[0];
    const endDiff = report.difficultyTrajectory[report.difficultyTrajectory.length - 1];
    expect(endDiff).toBeGreaterThanOrEqual(startDiff);
  });
});
