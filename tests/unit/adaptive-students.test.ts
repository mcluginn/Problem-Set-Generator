/**
 * Synthetic Student Profiles (Students A-F) Adaptive Recommendation Test Suite
 * Verifies that Students A-F receive tailored, pedagogically sound, and explainable recommendations.
 */

import { describe, it, expect } from 'vitest';
import { AdaptiveEngine } from '@/services/adaptive/adaptive';
import { ConceptMasteryRecord, MistakeRecord, INITIAL_CURRICULUM } from '@/services/database/types';

function createMockMastery(
  percentages: Record<string, number>,
  defaultPct: number = 80,
  sampleCount: number = 10
): Record<string, ConceptMasteryRecord> {
  const mastery: Record<string, ConceptMasteryRecord> = {};
  for (const concept of INITIAL_CURRICULUM) {
    const pct = percentages[concept.name] !== undefined ? percentages[concept.name] : defaultPct;
    mastery[concept.name] = {
      conceptId: concept.id,
      conceptName: concept.name,
      masteryPercentage: pct,
      masteryConfidence: Math.min(1.0, sampleCount / 10),
      totalAttempts: sampleCount,
      correctAttempts: Math.round((pct / 100) * sampleCount),
      recentTrend: pct > 75 ? 'improving' : pct > 40 ? 'stable' : 'declining',
    };
  }
  return mastery;
}

describe('Synthetic Student Profiles Adaptive Recommendations', () => {
  // Student A: High Mastery in Foundations, Weak Chain Rule
  it('Student A: recommends Chain Rule at Medium/Hard difficulty when foundational rules are mastered', () => {
    const studentAMastery = createMockMastery({
      'Constant Rule': 100,
      'Constant Multiple Rule': 95,
      'Sum Rule': 90,
      'Difference Rule': 90,
      'Power Rule': 92,
      'Product Rule': 88,
      'Quotient Rule': 85,
      'Chain Rule': 55, // Primary growth area (< 75%)
      'Trigonometric Derivatives': 80,
      'Exponential Derivatives': 80,
      'Logarithmic Derivatives': 80,
      'Implicit Differentiation': 80,
      'Higher-Order Derivatives': 75,
      'Basic Applications of Derivatives': 75,
    });

    const rec = AdaptiveEngine.selectNextBestProblem(studentAMastery, []);

    expect(rec.concept).toBe('Chain Rule');
    expect(rec.difficulty).toBe('Medium');
    expect(rec.reason).toContain('Growth Area');
  });

  // Student B: High Calculation Accuracy, Weak Application Transfer
  it('Student B: recommends Basic Applications of Derivatives when all symbolic rules are solid (>80%)', () => {
    const studentBMastery = createMockMastery({
      'Constant Rule': 100,
      'Constant Multiple Rule': 95,
      'Sum Rule': 95,
      'Difference Rule': 95,
      'Power Rule': 95,
      'Product Rule': 90,
      'Quotient Rule': 90,
      'Chain Rule': 88,
      'Trigonometric Derivatives': 88,
      'Exponential Derivatives': 85,
      'Logarithmic Derivatives': 85,
      'Implicit Differentiation': 80,
      'Higher-Order Derivatives': 85,
      'Basic Applications of Derivatives': 50, // Lowest mastery with met prereqs
    });

    const rec = AdaptiveEngine.selectNextBestProblem(studentBMastery, []);

    expect(rec.concept).toBe('Basic Applications of Derivatives');
    expect(rec.reason).toContain('Growth Area');
  });

  // Student C: Repeated Chain Rule Misconception (MISSING_INNER_DERIVATIVE)
  it('Student C: prioritizes targeted remediation when active unresolved mistake exists', () => {
    const studentCMastery = createMockMastery({
      'Constant Rule': 100,
      'Constant Multiple Rule': 90,
      'Sum Rule': 90,
      'Difference Rule': 90,
      'Power Rule': 85,
      'Product Rule': 80,
      'Quotient Rule': 75,
      'Chain Rule': 60,
    });

    const unresolvedMistakes: MistakeRecord[] = [
      {
        id: 'mst_c1',
        studentId: 'usr_c',
        concept: 'Chain Rule',
        misconceptionCode: 'MISSING_INNER_DERIVATIVE',
        misconceptionName: 'Omitted Derivative of Inner Function',
        problemStatement: 'Find dy/dx for y = (3x^2 - 2x + 4)^5',
        problemLatex: 'y = (3x^2 - 2x + 4)^5',
        studentAnswer: '5(3x^2 - 2x + 4)^4',
        correctAnswerLatex: '5(3x^2 - 2x + 4)^4(6x - 2)',
        explanation: 'Forgot inner derivative',
        occurredCount: 3,
        resolved: false,
        lastOccurredAt: new Date().toISOString(),
      },
    ];

    const rec = AdaptiveEngine.selectNextBestProblem(studentCMastery, unresolvedMistakes);

    expect(rec.concept).toBe('Chain Rule');
    expect(rec.remediationMisconception).toBe('MISSING_INNER_DERIVATIVE');
    expect(rec.reason).toContain('Targeted Remediation');
  });

  // Student D: Direct Topic Practice Selection
  it('Student D: respects direct topic selection while adapting difficulty and representation', () => {
    const studentDMastery = createMockMastery({
      'Power Rule': 95,
      'Product Rule': 40,
    });

    const rec = AdaptiveEngine.selectNextBestProblem(studentDMastery, [], 'Product Rule');

    expect(rec.concept).toBe('Product Rule');
    expect(rec.difficulty).toBe('Easy'); // Low mastery (<45%) yields Easy
    expect(rec.representationType).toBe('Symbolic');
    expect(rec.confidence).toBeDefined();
  });

  // Student E: Low Accuracy Across Prerequisites
  it('Student E: blocks advanced rules and recommends prerequisite Power/Constant rules first', () => {
    const studentEMastery = createMockMastery({
      'Constant Rule': 50,
      'Constant Multiple Rule': 35,
      'Sum Rule': 30,
      'Difference Rule': 30,
      'Power Rule': 25, // Unmastered prerequisite
      'Product Rule': 10,
      'Chain Rule': 5,
    }, 20);

    const rec = AdaptiveEngine.selectNextBestProblem(studentEMastery, []);

    // Prerequisite for Product/Chain is not met; should recommend foundational Constant / Power rule
    expect(['Constant Rule', 'Constant Multiple Rule', 'Sum Rule', 'Power Rule']).toContain(rec.concept);
    expect(rec.difficulty).toBe('Easy');
  });

  // Student F: Strong Symbolic Concepts, Application Transfer Needed (Section 35)
  it('Student F: routes high symbolic proficiency to Kinematics / Application transfer', () => {
    const studentFMastery = createMockMastery({
      'Constant Rule': 95,
      'Constant Multiple Rule': 90,
      'Sum Rule': 90,
      'Difference Rule': 90,
      'Power Rule': 95,
      'Product Rule': 90,
      'Quotient Rule': 90,
      'Chain Rule': 85,
      'Trigonometric Derivatives': 85,
      'Exponential Derivatives': 85,
      'Logarithmic Derivatives': 85,
      'Implicit Differentiation': 80,
      'Higher-Order Derivatives': 85,
      'Basic Applications of Derivatives': 85,
    }, 85, 12);

    const rec = AdaptiveEngine.selectNextBestProblem(studentFMastery, []);

    expect(rec.representationType).toBe('Kinematics');
    expect(rec.reason).toContain('Application Transfer');
    expect(rec.confidence).toBe(1.0);
  });
});
