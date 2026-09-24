import { describe, it, expect, beforeEach } from 'vitest';
import { MasteryEngine } from '@/engine/adaptive/mastery';
import { AdaptiveSelector } from '@/engine/adaptive/selector';
import { PracticeAttempt } from '@/engine/adaptive/types';
import { problemBank } from '@/engine/content/problemBank';

describe('Structural Diversity & Mastery Damping Invariants', () => {
  const studentId = 'test-student-structural-damping';

  beforeEach(() => {
    MasteryEngine.resetStudentData(studentId);
  });

  it('demonstrates deterministic diminishing returns for repeated parameter variants of the same structural family', () => {
    const skillId = 'GEN0102-U1-DIFF';
    const familyId = 'FAM-GEN0102-U1-DIFF-L1';

    // Baseline: exposure count is 0
    expect(MasteryEngine.getFamilyExposureCount(studentId, familyId)).toBe(0);
    expect(MasteryEngine.getDampingMultiplier(1)).toBe(1.0);
    expect(MasteryEngine.getDampingMultiplier(2)).toBe(0.6);
    expect(MasteryEngine.getDampingMultiplier(3)).toBe(0.3);
    expect(MasteryEngine.getDampingMultiplier(4)).toBe(0.1);

    // Attempt 1: First exposure to family -> 1.00 multiplier (100% delta)
    const attempt1: PracticeAttempt = {
      id: 'att-1',
      sessionId: 'sess-1',
      studentId,
      problemId: 'GEN0102-U1-DIFF-L1-001',
      courseId: 'COURSE-GEN0102',
      skillId,
      familyId,
      problemFamilyId: familyId,
      isParameterVariation: true,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      studentAnswer: '4x',
      source: 'TYPED',
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };

    const record1 = MasteryEngine.updateFromAttempt(attempt1);
    expect(record1.correctAttempts).toBe(1);
    expect(record1.totalAttempts).toBe(1);
    expect(record1.masteryPercentage).toBe(10); // 10 * 1.0 = 10%
    expect(MasteryEngine.getFamilyExposureCount(studentId, familyId)).toBe(1);

    // Attempt 2: Second exposure to same family -> 0.60 multiplier (60% delta)
    const attempt2: PracticeAttempt = {
      ...attempt1,
      id: 'att-2',
      problemId: 'GEN0102-U1-DIFF-L1-001-PARAM-VAR-2',
      isParameterVariation: true,
      createdAt: new Date().toISOString()
    };

    const record2 = MasteryEngine.updateFromAttempt(attempt2);
    expect(record2.correctAttempts).toBe(2);
    expect(record2.totalAttempts).toBe(2);
    // Previous 10% + (10 * 0.6 = 6%) = 16%
    expect(record2.masteryPercentage).toBe(16);
    expect(MasteryEngine.getFamilyExposureCount(studentId, familyId)).toBe(2);

    // Attempt 3: Third exposure to same family -> 0.30 multiplier (30% delta)
    const attempt3: PracticeAttempt = {
      ...attempt1,
      id: 'att-3',
      problemId: 'GEN0102-U1-DIFF-L1-001-PARAM-VAR-3',
      isParameterVariation: true,
      createdAt: new Date().toISOString()
    };

    const record3 = MasteryEngine.updateFromAttempt(attempt3);
    expect(record3.correctAttempts).toBe(3);
    expect(record3.totalAttempts).toBe(3);
    // Previous 16% + (10 * 0.3 = 3%) = 19%
    expect(record3.masteryPercentage).toBe(19);
    expect(MasteryEngine.getFamilyExposureCount(studentId, familyId)).toBe(3);

    // Attempt 4: Fourth exposure to same family -> 0.10 multiplier (10% delta)
    const attempt4: PracticeAttempt = {
      ...attempt1,
      id: 'att-4',
      problemId: 'GEN0102-U1-DIFF-L1-001-PARAM-VAR-4',
      isParameterVariation: true,
      createdAt: new Date().toISOString()
    };

    const record4 = MasteryEngine.updateFromAttempt(attempt4);
    expect(record4.correctAttempts).toBe(4);
    expect(record4.totalAttempts).toBe(4);
    // Previous 19% + (10 * 0.1 = 1%) = 20%
    expect(record4.masteryPercentage).toBe(20);
    expect(MasteryEngine.getFamilyExposureCount(studentId, familyId)).toBe(4);

    // Crucial check: All 4 attempts were marked 100% correct!
    // Correctness is NOT damped, only structural mastery gain is damped.
    expect(record4.correctAttempts).toBe(4);
    expect(record4.unaidedCorrectAttempts).toBe(4);
  });

  it('verifies adaptive selector prioritizes unseen structural families over repeated parameter variants', () => {
    const courseId = 'COURSE-GEN0102';
    const skillId = 'GEN0102-U1-LIM';

    // Student has already seen and solved Level 1 problem (FAM-GEN0102-U1-LIM-L1)
    const recentHistory = [
      {
        skillId,
        familyId: 'FAM-GEN0102-U1-LIM-L1',
        problemId: 'GEN0102-U1-LIM-L1-001'
      }
    ];

    // Mark exposure for FAM-GEN0102-U1-LIM-L1
    MasteryEngine.recordFamilyExposure(studentId, 'FAM-GEN0102-U1-LIM-L1');

    // Request next problem for skill
    const decision = AdaptiveSelector.selectNextBestProblem(
      studentId,
      {
        courseId,
        skillId,
        mode: 'SKILL_PRACTICE'
      },
      recentHistory
    );

    expect(decision.selectedProblem).toBeDefined();
    const selected = decision.selectedProblem!;

    // Must NOT be the already-seen L1 problem
    expect(selected.dna.problemId).not.toBe('GEN0102-U1-LIM-L1-001');

    // Must belong to an unseen structural family within the skill (L2 or L3)
    const selectedFamily = selected.dna.problemFamilyId || selected.dna.familyId;
    expect(selectedFamily).not.toBe('FAM-GEN0102-U1-LIM-L1');
  });

  it('proves solving distinct structural problems yields full mastery gain without damping', () => {
    // Distinct structural problem 1: Limits (L1)
    const attempt1: PracticeAttempt = {
      id: 'diff-1',
      sessionId: 'sess-1',
      studentId,
      problemId: 'GEN0102-U1-LIM-L1-001',
      courseId: 'COURSE-GEN0102',
      skillId: 'GEN0102-U1-LIM',
      familyId: 'FAM-GEN0102-U1-LIM-L1',
      problemFamilyId: 'FAM-GEN0102-U1-LIM-L1',
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      studentAnswer: '4',
      source: 'TYPED',
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };
    const rec1 = MasteryEngine.updateFromAttempt(attempt1);
    expect(rec1.masteryPercentage).toBe(10); // First exposure: 10%

    // Distinct structural problem 2: Radical conjugate (L2, different family)
    const attempt2: PracticeAttempt = {
      id: 'diff-2',
      sessionId: 'sess-1',
      studentId,
      problemId: 'GEN0102-U1-LIM-L2-002',
      courseId: 'COURSE-GEN0102',
      skillId: 'GEN0102-U1-LIM',
      familyId: 'FAM-GEN0102-U1-LIM-L2',
      problemFamilyId: 'FAM-GEN0102-U1-LIM-L2',
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      studentAnswer: '1/6',
      source: 'TYPED',
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 45,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };
    const rec2 = MasteryEngine.updateFromAttempt(attempt2);
    // Because L2 is a NEW structural family, exposure count is 1 -> 1.00 multiplier!
    // 10% + 10% = 20%
    expect(rec2.masteryPercentage).toBe(20);

    // Distinct structural problem 3: Piecewise parameter continuity (L3, different family)
    const attempt3: PracticeAttempt = {
      id: 'diff-3',
      sessionId: 'sess-1',
      studentId,
      problemId: 'GEN0102-U1-LIM-L3-003',
      courseId: 'COURSE-GEN0102',
      skillId: 'GEN0102-U1-LIM',
      familyId: 'FAM-GEN0102-U1-LIM-L3',
      problemFamilyId: 'FAM-GEN0102-U1-LIM-L3',
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      studentAnswer: 'k = 3',
      source: 'TYPED',
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 60,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };
    const rec3 = MasteryEngine.updateFromAttempt(attempt3);
    // Because L3 is another NEW structural family, exposure count is 1 -> 1.00 multiplier!
    // 20% + 10% = 30%
    expect(rec3.masteryPercentage).toBe(30);

    // Comparing:
    // 3 attempts on SAME structure = 19% mastery (diminished by damping)
    // 3 attempts on DISTINCT structures = 30% mastery (rewarded for structural breadth)
  });
});
