/**
 * Automated Test Suite: Six-Course Student Practice & Adaptive Learning Loop End-to-End Vertical Slices
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UnifiedPracticeStore } from '../../src/engine/adaptive/store';
import { DomainValidatorRegistry } from '../../src/engine/content/domainValidators';
import { LearningEventStore } from '../../src/engine/adaptive/events';

describe('Six-Course Student Practice & Adaptive Learning Loop End-to-End Tests', () => {
  beforeEach(() => {
    UnifiedPracticeStore.clear();
    LearningEventStore.clear();
  });

  it('executes complete practice & adaptive cycle for GEN 0101 (Mathematics for Engineers)', () => {
    const courseId = 'COURSE-GEN0101';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    // 1. Start Session
    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2, mode: 'RECOMMENDED' });
    expect(session.currentProblem).toBeDefined();
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    // 2. Validate Problem Domain Invariants
    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.status).toBe('PASS');

    // 3. Submit Correct Typed Attempt
    const ans = session.currentProblem!.solution.canonicalAnswerLatex;
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: ans,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 45,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);

    // 4. Verify Mastery & Telemetry
    const skillMastery = UnifiedPracticeStore.getSkillMastery(res.attempt.skillId);
    expect(skillMastery.masteryPercentage).toBeGreaterThanOrEqual(10);
    expect(skillMastery.unaidedCorrectAttempts).toBe(1);

    // 5. Adaptive Next Problem
    const nextRes = UnifiedPracticeStore.nextProblem(session.id);
    expect(nextRes.problem).toBeDefined();
    expect(nextRes.decision.courseId).toBe(courseId);
  });

  it('executes complete practice & adaptive cycle for GEN 0102 (Calculus 1)', () => {
    const courseId = 'COURSE-GEN0102';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2, targetSkillId: 'SKILL-GEN0102-005' });
    expect(session.currentProblem?.dna.primarySkillId).toBe('SKILL-GEN0102-005');

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);

    const ans = session.currentProblem!.solution.canonicalAnswerLatex;
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: ans,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 30,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
    const mastery = UnifiedPracticeStore.getSkillMastery('SKILL-GEN0102-005');
    expect(mastery.masteryPercentage).toBeGreaterThanOrEqual(10);
  });

  it('executes complete practice & adaptive cycle for GEN 0107 (Differential Equations)', () => {
    const courseId = 'COURSE-GEN0107';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2, mode: 'RECOMMENDED' });
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('ODE');

    const ans = session.currentProblem!.solution.canonicalAnswerLatex;
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: ans,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 40,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
    const courseMastery = UnifiedPracticeStore.getCourseMastery(courseId);
    expect(courseMastery.totalCorrectAttempts).toBe(1);
  });

  it('executes complete practice & adaptive cycle for GEN 0110 (Physics 2 for Engineers)', () => {
    const courseId = 'COURSE-GEN0110';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2, mode: 'RECOMMENDED' });
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('PHYSICS');

    // Verify SI units check passed
    expect(domainVal.checks.some(c => c.name === 'PHYSICS_UNITS_DECLARED' && c.passed)).toBe(true);

    const ans = session.currentProblem!.solution.canonicalAnswerLatex;
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: ans,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 50,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
    const mastery = UnifiedPracticeStore.getSkillMastery(res.attempt.skillId);
    expect(mastery.masteryPercentage).toBeGreaterThanOrEqual(10);
  });

  it('executes complete practice & adaptive cycle for GEN 0161 (Thermodynamics)', () => {
    const courseId = 'COURSE-GEN0161';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2, mode: 'RECOMMENDED' });
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('THERMODYNAMICS');

    const ans = session.currentProblem!.solution.canonicalAnswerLatex;
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: ans,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 55,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
    const events = LearningEventStore.getEventsForStudent(UnifiedPracticeStore.getProfile().id);
    expect(events.some(e => e.type === 'ATTEMPT_SUBMITTED' && e.courseId === courseId)).toBe(true);
  });

  it('executes complete practice & adaptive cycle for BSIE 3219 (IE Special Topics 1)', () => {
    const courseId = 'COURSE-BSIE3219';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2, mode: 'RECOMMENDED' });
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('IE_SPECIAL_TOPICS');

    const ans = session.currentProblem!.solution.canonicalAnswerLatex;
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: ans,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 60,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
    const rec = UnifiedPracticeStore.getRecommendation(courseId);
    expect(rec.courseId).toBe(courseId);
  });
});
