/**
 * Automated Test Suite: Multi-Dimensional Mastery Engine
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MasteryEngine } from '../../src/engine/adaptive/mastery';
import { PracticeAttempt } from '../../src/engine/adaptive/types';

describe('MasteryEngine Multi-Dimensional Evidence Calculation', () => {
  beforeEach(() => {
    MasteryEngine.clear();
  });

  it('weights unaided first-try correct attempts significantly higher than assisted attempts', () => {
    const studentId = 'student_mastery_01';
    const skillId = 'SKILL-GEN0102-005';

    // 1. Unaided Correct Attempt (first try, 0 hints) -> +10%
    const attempt1: PracticeAttempt = {
      id: 'ATT-1',
      sessionId: 'SESS-1',
      studentId,
      problemId: 'PROB-1',
      courseId: 'COURSE-GEN0102',
      skillId,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      studentAnswer: '6x(3x^2+1)^2',
      source: 'TYPED',
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 35,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };

    const rec1 = MasteryEngine.updateFromAttempt(attempt1);
    expect(rec1.masteryPercentage).toBe(10);
    expect(rec1.unaidedCorrectAttempts).toBe(1);
    expect(rec1.assistedCorrectAttempts).toBe(0);

    // 2. High-Hint Assisted Correct Attempt (Level 4 hint used) -> +2%
    const attempt2: PracticeAttempt = {
      id: 'ATT-2',
      sessionId: 'SESS-1',
      studentId,
      problemId: 'PROB-2',
      courseId: 'COURSE-GEN0102',
      skillId,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      studentAnswer: '24x(4x^2+1)^2',
      source: 'TYPED',
      isCorrect: true,
      hintLevelUsed: 4,
      solutionViewed: false,
      timeSpentSeconds: 90,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };

    const rec2 = MasteryEngine.updateFromAttempt(attempt2);
    expect(rec2.masteryPercentage).toBe(12); // 10 + 2
    expect(rec2.assistedCorrectAttempts).toBe(1);
  });

  it('records active misconceptions and deducts mastery on incorrect attempts', () => {
    const studentId = 'student_mastery_02';
    const skillId = 'SKILL-GEN0102-005';

    const failAttempt: PracticeAttempt = {
      id: 'ATT-FAIL-1',
      sessionId: 'SESS-2',
      studentId,
      problemId: 'PROB-3',
      courseId: 'COURSE-GEN0102',
      skillId,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      studentAnswer: '4(3x^2+1)^3',
      source: 'TYPED',
      isCorrect: false,
      mistakeCode: 'MISSING_INNER_DERIVATIVE',
      mistakeName: 'Omitted inner derivative factor',
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 40,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };

    const rec = MasteryEngine.updateFromAttempt(failAttempt);
    expect(rec.activeMisconceptions.length).toBe(1);
    expect(rec.activeMisconceptions[0].code).toBe('MISSING_INNER_DERIVATIVE');
    expect(rec.activeMisconceptions[0].resolved).toBe(false);

    // Subsequent correct attempt resolves the active misconception
    const successAttempt: PracticeAttempt = {
      ...failAttempt,
      id: 'ATT-SUCCESS-1',
      isCorrect: true,
      studentAnswer: '24x(3x^2+1)^3',
      mistakeCode: undefined
    };

    const resolvedRec = MasteryEngine.updateFromAttempt(successAttempt);
    expect(resolvedRec.activeMisconceptions[0].resolved).toBe(true);
  });

  it('tracks dimensional mastery across evidence types and representation formats', () => {
    const studentId = 'student_mastery_03';
    const skillId = 'SKILL-GEN0110-001';

    const appAttempt: PracticeAttempt = {
      id: 'ATT-APP-1',
      sessionId: 'SESS-3',
      studentId,
      problemId: 'PROB-PHYS-1',
      courseId: 'COURSE-GEN0110',
      skillId,
      evidenceType: 'APPLICATION',
      representationType: 'PHYSICAL',
      studentAnswer: '196.2 kPa',
      source: 'TYPED',
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 50,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };

    const rec = MasteryEngine.updateFromAttempt(appAttempt);
    expect(rec.evidenceMastery['APPLICATION']).toBeGreaterThanOrEqual(10);
    expect(rec.representationMastery['PHYSICAL']).toBeGreaterThanOrEqual(10);
  });
});
