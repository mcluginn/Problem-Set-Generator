/**
 * Integration Test: 780 Master Problem Bank Runtime Reachability & Adaptive Selection
 * Engineering Practice Engine — Sections 18-22
 */

import { describe, expect, it, beforeEach } from 'vitest';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';
import { MasteryEngine } from '../../src/engine/adaptive/mastery';
import { problemBank } from '../../src/engine/content/problemBank';
import { ContentGenerator } from '../../src/engine/content/generator';

describe('780 Master Bank Runtime Reachability & Selection', () => {
  beforeEach(() => {
    MasteryEngine.resetStudentData();
  });

  it('1. Verifies 780 master bank problems are registered in ProblemBank with MASTER_BANK_780 source', () => {
    const all780 = problemBank.getMasterProblems().filter(
      p => p.source === 'MASTER_BANK_780' || p.dna.source === 'MASTER_BANK_780'
    );
    expect(all780.length).toBe(780);

    for (const p of all780) {
      expect(p.source).toBe('MASTER_BANK_780');
      expect(p.dna.source).toBe('MASTER_BANK_780');
      expect(p.dna.masterProblemId).toBeDefined();
      expect(p.dna.skillClusterId).toBeDefined();
      expect(p.dna.problemFamilyId).toBeDefined();
      expect(p.isParameterVariation).toBe(false);
    }
  });

  it('2. End-to-end selection of specific master problem GEN0102-U1-LIM-L1-001', () => {
    const studentId = 'test-student-lim-001';
    const decision = AdaptiveSelector.selectNextBestProblem(
      studentId,
      {
        courseId: 'COURSE-GEN0102',
        skillId: 'GEN0102-U1-LIM',
        forceDifficulty: 1,
        mode: 'SKILL_PRACTICE'
      }
    );

    expect(decision.selectedProblem).toBeDefined();
    const prob = decision.selectedProblem!;
    expect(prob.source).toBe('MASTER_BANK_780');
    expect(prob.dna.source).toBe('MASTER_BANK_780');
    expect(prob.dna.masterProblemId).toBe('GEN0102-U1-LIM-L1-001');
    expect(prob.dna.skillClusterId).toBe('GEN0102-U1-LIM');
    expect(prob.dna.problemFamilyId).toBe('FAM-GEN0102-U1-LIM-L1');
    expect(prob.dna.difficultyVector.overall).toBe(1);
    expect(prob.statement.promptText).toContain('lim');
    expect(prob.solution.canonicalAnswerLatex).toBe('4');
  });

  it('3. Verifies 780 master bank problems participate in candidate pool for all 5 syllabi courses', () => {
    const courses = [
      { courseId: 'COURSE-GEN0102', skillId: 'GEN0102-U1-LIM' },
      { courseId: 'COURSE-GEN0101', skillId: 'GEN0101-U1-ARITH' },
      { courseId: 'COURSE-GEN0161', skillId: 'GEN0161-U1-UNT' },
      { courseId: 'COURSE-GEN0110', skillId: 'GEN0110-U1-HYD' },
      { courseId: 'COURSE-BSIE3219', skillId: 'BSIE3219-U1-INT' }
    ];

    for (const c of courses) {
      const decision = AdaptiveSelector.selectNextBestProblem(
        `student-${c.courseId}`,
        {
          courseId: c.courseId,
          skillId: c.skillId,
          mode: 'SKILL_PRACTICE'
        }
      );

      expect(decision.selectedProblem).toBeDefined();
      const p = decision.selectedProblem!;
      expect(p.source).toBe('MASTER_BANK_780');
      expect(p.dna.courseId).toBe(c.courseId);
      expect(p.dna.skillClusterId).toBe(c.skillId);
      expect(p.dna.masterProblemId).toBeDefined();
    }
  });

  it('4. Distinguishes master questions from parameter variants while retaining lineage', () => {
    const master = problemBank.getProblemById('GEN0102-U1-LIM-L1-001');
    expect(master).toBeDefined();

    const variant = ContentGenerator.generateVariationFromMaster(master!);
    expect(variant.isParameterVariation).toBe(true);
    expect(variant.dna.isParameterVariation).toBe(true);
    expect(variant.source).toBe('MASTER_BANK_780');
    expect(variant.dna.source).toBe('MASTER_BANK_780');
    expect(variant.dna.masterProblemId).toBe('GEN0102-U1-LIM-L1-001');
    expect(variant.dna.problemFamilyId).toBe(master!.dna.problemFamilyId);
    expect(variant.dna.skillClusterId).toBe(master!.dna.skillClusterId);
    expect(variant.dna.problemId).toContain('GEN0102-U1-LIM-L1-001-PV-');
  });

  it('5. Adaptive behavior sequence: structural diversity followed by parameter variation', () => {
    const studentId = 'adaptive-seq-student';
    const history: Array<{ skillId: string; familyId?: string; problemId: string }> = [];

    // Practice 1: Cluster LIM L1
    const p1 = AdaptiveSelector.selectNextBestProblem(
      studentId,
      { courseId: 'COURSE-GEN0102', skillId: 'GEN0102-U1-LIM', forceDifficulty: 1, mode: 'SKILL_PRACTICE' },
      history
    );
    expect(p1.selectedProblem).toBeDefined();
    expect(p1.selectedProblem!.dna.problemFamilyId).toBe('FAM-GEN0102-U1-LIM-L1');
    expect(p1.selectedProblem!.isParameterVariation).toBe(false);

    // Record attempt for p1
    MasteryEngine.updateFromAttempt({
      id: 'att-1',
      sessionId: 's-1',
      studentId,
      problemId: p1.selectedProblem!.dna.problemId,
      courseId: 'COURSE-GEN0102',
      skillId: 'GEN0102-U1-LIM',
      familyId: p1.selectedProblem!.dna.problemFamilyId,
      problemFamilyId: p1.selectedProblem!.dna.problemFamilyId,
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      source: 'TYPED',
      studentAnswer: '4',
      createdAt: new Date().toISOString()
    });
    history.push({
      skillId: 'GEN0102-U1-LIM',
      familyId: p1.selectedProblem!.dna.problemFamilyId,
      problemId: p1.selectedProblem!.dna.problemId
    });

    // Practice 2: Adaptive progression prefers different structural family (e.g. L2)
    const p2 = AdaptiveSelector.selectNextBestProblem(
      studentId,
      { courseId: 'COURSE-GEN0102', skillId: 'GEN0102-U1-LIM', mode: 'SKILL_PRACTICE' },
      history
    );
    expect(p2.selectedProblem).toBeDefined();
    expect(p2.selectedProblem!.dna.problemFamilyId).not.toBe(p1.selectedProblem!.dna.problemFamilyId);

    // Record attempt for p2
    MasteryEngine.updateFromAttempt({
      id: 'att-2',
      sessionId: 's-1',
      studentId,
      problemId: p2.selectedProblem!.dna.problemId,
      courseId: 'COURSE-GEN0102',
      skillId: 'GEN0102-U1-LIM',
      familyId: p2.selectedProblem!.dna.problemFamilyId,
      problemFamilyId: p2.selectedProblem!.dna.problemFamilyId,
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      source: 'TYPED',
      studentAnswer: p2.selectedProblem!.solution.canonicalAnswerRaw,
      createdAt: new Date().toISOString()
    });
    history.push({
      skillId: 'GEN0102-U1-LIM',
      familyId: p2.selectedProblem!.dna.problemFamilyId,
      problemId: p2.selectedProblem!.dna.problemId
    });

    // Practice 3: Selects fresh structural family C (e.g. procedural generator family)
    const p3 = AdaptiveSelector.selectNextBestProblem(
      studentId,
      { courseId: 'COURSE-GEN0102', skillId: 'GEN0102-U1-LIM', mode: 'SKILL_PRACTICE' },
      history
    );
    expect(p3.selectedProblem).toBeDefined();
    expect(p3.selectedProblem!.dna.problemFamilyId).not.toBe(p1.selectedProblem!.dna.problemFamilyId);
    expect(p3.selectedProblem!.dna.problemFamilyId).not.toBe(p2.selectedProblem!.dna.problemFamilyId);

    // Record attempt for p3
    MasteryEngine.updateFromAttempt({
      id: 'att-3',
      sessionId: 's-1',
      studentId,
      problemId: p3.selectedProblem!.dna.problemId,
      courseId: 'COURSE-GEN0102',
      skillId: 'GEN0102-U1-LIM',
      familyId: p3.selectedProblem!.dna.problemFamilyId,
      problemFamilyId: p3.selectedProblem!.dna.problemFamilyId,
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      source: 'TYPED',
      studentAnswer: p3.selectedProblem!.solution.canonicalAnswerRaw,
      createdAt: new Date().toISOString()
    });
    history.push({
      skillId: 'GEN0102-U1-LIM',
      familyId: p3.selectedProblem!.dna.problemFamilyId,
      problemId: p3.selectedProblem!.dna.problemId
    });

    // Practice 4: Exactly matches Section 20: parameter variant of A (L1) on repeated exposure
    const p4 = AdaptiveSelector.selectNextBestProblem(
      studentId,
      {
        courseId: 'COURSE-GEN0102',
        skillId: 'GEN0102-U1-LIM',
        forceDifficulty: 1,
        mode: 'SKILL_PRACTICE'
      },
      history
    );
    expect(p4.selectedProblem).toBeDefined();
    expect(p4.selectedProblem!.dna.problemFamilyId).toBe('FAM-GEN0102-U1-LIM-L1');
    expect(p4.selectedProblem!.isParameterVariation).toBe(true);
    expect(p4.selectedProblem!.source).toBe('MASTER_BANK_780');
    expect(p4.selectedProblem!.dna.masterProblemId).toBe('GEN0102-U1-LIM-L1-001');
  });

  it('6. Verifies runtime mastery damping on repeated parameter variations', () => {
    const studentId = 'student-damping-test';
    const skillId = 'SKILL-GEN0102-001';
    const familyKey = 'FAM-GEN0102-U1-LIM-L1';

    // Baseline mastery
    expect(MasteryEngine.getSkillMastery(studentId, skillId).masteryPercentage).toBe(0);

    // Exposure 1: 1.00 contribution (+10)
    const r1 = MasteryEngine.updateFromAttempt({
      id: 'att-damp-1',
      sessionId: 's-damp',
      studentId,
      problemId: 'GEN0102-U1-LIM-L1-001',
      courseId: 'COURSE-GEN0102',
      skillId,
      problemFamilyId: familyKey,
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      source: 'TYPED',
      studentAnswer: '4',
      createdAt: new Date().toISOString()
    });
    expect(r1.masteryPercentage).toBe(10);
    expect(r1.correctAttempts).toBe(1);
    expect(r1.totalAttempts).toBe(1);

    // Exposure 2: 0.60 contribution (+6.0 -> 16.0)
    const r2 = MasteryEngine.updateFromAttempt({
      id: 'att-damp-2',
      sessionId: 's-damp',
      studentId,
      problemId: 'GEN0102-U1-LIM-L1-001-PV-2',
      courseId: 'COURSE-GEN0102',
      skillId,
      problemFamilyId: familyKey,
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      source: 'TYPED',
      studentAnswer: '8',
      createdAt: new Date().toISOString()
    });
    expect(r2.masteryPercentage).toBe(16);
    expect(r2.correctAttempts).toBe(2);

    // Exposure 3: 0.30 contribution (+3.0 -> 19.0)
    const r3 = MasteryEngine.updateFromAttempt({
      id: 'att-damp-3',
      sessionId: 's-damp',
      studentId,
      problemId: 'GEN0102-U1-LIM-L1-001-PV-3',
      courseId: 'COURSE-GEN0102',
      skillId,
      problemFamilyId: familyKey,
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      source: 'TYPED',
      studentAnswer: '12',
      createdAt: new Date().toISOString()
    });
    expect(r3.masteryPercentage).toBe(19);
    expect(r3.correctAttempts).toBe(3);

    // Exposure 4+: 0.10 contribution (+1.0 -> 20.0)
    const r4 = MasteryEngine.updateFromAttempt({
      id: 'att-damp-4',
      sessionId: 's-damp',
      studentId,
      problemId: 'GEN0102-U1-LIM-L1-001-PV-4',
      courseId: 'COURSE-GEN0102',
      skillId,
      problemFamilyId: familyKey,
      isCorrect: true,
      hintLevelUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 30,
      attemptNumber: 1,
      evidenceType: 'DIRECT_CALCULATION',
      representationType: 'SYMBOLIC',
      source: 'TYPED',
      studentAnswer: '16',
      createdAt: new Date().toISOString()
    });
    expect(r4.masteryPercentage).toBe(20);
    expect(r4.correctAttempts).toBe(4);
    expect(r4.correctAttempts / r4.totalAttempts).toBe(1.0); // 100% accuracy retained
  });

  it('7. Existing procedural generator content remains accessible and active alongside 780 master bank', () => {
    const studentId = 'gen-diversity-student';
    const decision = AdaptiveSelector.selectNextBestProblem(
      studentId,
      {
        courseId: 'COURSE-GEN0101',
        skillId: 'SKILL-GEN0101-011',
        mode: 'SKILL_PRACTICE'
      }
    );

    expect(decision.selectedProblem).toBeDefined();
    expect(decision.selectedProblem!.source).toBe('EXISTING_GENERATOR');
    expect(decision.selectedProblem!.dna.source).toBe('EXISTING_GENERATOR');
  });
});
