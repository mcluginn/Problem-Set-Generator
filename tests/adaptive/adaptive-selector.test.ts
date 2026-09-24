/**
 * Automated Test Suite: Adaptive Selector & Explainable Next Best Problem
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';
import { MasteryEngine } from '../../src/engine/adaptive/mastery';
import { PracticeAttempt } from '../../src/engine/adaptive/types';

describe('AdaptiveSelector Multi-Course Next Best Problem Selection', () => {
  const studentId = 'student_adaptive_01';

  beforeEach(() => {
    MasteryEngine.clear();
  });

  it('respects hard user constraint when specific skill is selected', () => {
    const targetSkill = 'SKILL-GEN0102-005';
    const decision = AdaptiveSelector.selectNextBestProblem(
      studentId,
      'COURSE-GEN0102',
      [],
      { courseId: 'COURSE-GEN0102', forceSkillId: targetSkill }
    );

    expect(decision.targetSkillId).toBe(targetSkill);
    expect(decision.reason).toBe('USER_REQUEST');
    expect(decision.explanation).toContain('Practicing selected skill');
    expect(decision.selectedProblem).toBeDefined();
  });

  it('triggers targeted remediation when an active misconception is present', () => {
    // Record a failed attempt with a misconception
    const failedAttempt: PracticeAttempt = {
      id: 'ATT-MISC-1',
      sessionId: 'SESS-1',
      studentId,
      problemId: 'PROB-1',
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      studentAnswer: '4(3x^2+1)^3',
      source: 'TYPED',
      isCorrect: false,
      mistakeCode: 'MISSING_INNER_DERIVATIVE',
      mistakeName: 'Omitted inner derivative factor',
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 45,
      attemptNumber: 1,
      createdAt: new Date().toISOString()
    };
    MasteryEngine.updateFromAttempt(failedAttempt);

    const decision = AdaptiveSelector.selectNextBestProblem(
      studentId,
      'COURSE-GEN0102',
      [{ skillId: 'SKILL-GEN0102-005', problemId: 'PROB-1' }]
    );

    expect(decision.reason).toBe('REMEDIATION');
    expect(decision.explanation).toContain('MISSING_INNER_DERIVATIVE');
    expect(decision.supportingFactors.some(f => f.includes('Active misconception'))).toBe(true);
  });

  it('recommends application transfer once symbolic proficiency is high (>= 70%)', () => {
    const targetSkill = 'SKILL-GEN0102-005';

    // Hydrate high symbolic mastery
    MasteryEngine.setSkillMastery(studentId, {
      skillId: targetSkill,
      courseId: 'COURSE-GEN0102',
      masteryScore: 0.78,
      masteryPercentage: 78,
      confidence: 0.8,
      totalAttempts: 6,
      correctAttempts: 5,
      unaidedCorrectAttempts: 4,
      assistedCorrectAttempts: 1,
      evidenceMastery: { DIRECT_CALCULATION: 85 },
      representationMastery: { SYMBOLIC: 85, PHYSICAL: 20 },
      activeMisconceptions: [],
      recentTrend: 'IMPROVING'
    });

    const decision = AdaptiveSelector.selectNextBestProblem(
      studentId,
      'COURSE-GEN0102',
      []
    );

    expect(decision.reason).toBe('TRANSFER');
    expect(decision.targetRepresentation).toBe('PHYSICAL');
    expect(decision.explanation).toContain('Application Transfer');
  });

  it('operates across all six authoritative courses with zero cross-course leakage', () => {
    const sixCourses = [
      'COURSE-GEN0101',
      'COURSE-GEN0102',
      'COURSE-GEN0107',
      'COURSE-GEN0110',
      'COURSE-GEN0161',
      'COURSE-BSIE3219'
    ];

    for (const cId of sixCourses) {
      const decision = AdaptiveSelector.selectNextBestProblem(
        studentId,
        cId,
        []
      );

      expect(decision.courseId).toBe(cId);
      expect(decision.selectedProblem).toBeDefined();
      expect(decision.selectedProblem?.dna.courseId).toBe(cId);
      expect(decision.explanation.length).toBeGreaterThan(5);
    }
  });
});
