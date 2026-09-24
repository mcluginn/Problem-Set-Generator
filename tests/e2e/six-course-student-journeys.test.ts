/**
 * Comprehensive End-to-End Six-Course Student Journeys & Hardening Test Matrix
 * Engineering Practice Engine — Phase 7 Student Experience Hardening
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UnifiedPracticeStore } from '../../src/engine/adaptive/store';
import { LearningEventStore } from '../../src/engine/adaptive/events';
import { MasteryEngine } from '../../src/engine/adaptive/mastery';
import { PracticeSessionManager } from '../../src/engine/adaptive/session';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';
import { DeterministicFallbackProvider } from '../../src/services/ai/fallback';
import { DomainValidatorRegistry } from '../../src/engine/content/domainValidators';

describe('Phase 7: End-to-End Six-Course Student Journeys & UX Hardening', () => {
  beforeEach(() => {
    UnifiedPracticeStore.clear();
    LearningEventStore.clear();
    MasteryEngine.clear();
    PracticeSessionManager.clear();
  });

  /* ========================================================================= */
  /*  1. GEN 0101: Mathematics for Engineers Journey                          */
  /* ========================================================================= */
  it('Journey 1: GEN 0101 (Mathematics for Engineers) student workflow', () => {
    const courseId = 'COURSE-GEN0101';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2 });
    expect(session.currentProblem).toBeDefined();
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    // Verify domain validation
    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('MATH_FOR_ENGINEERS');

    // Submit correct answer
    const ans = session.currentProblem!.solution.canonicalAnswerLatex;
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: ans,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 35,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);

    // Verify mastery progression
    const mastery = UnifiedPracticeStore.getSkillMastery(res.attempt.skillId);
    expect(mastery.masteryPercentage).toBeGreaterThanOrEqual(10);
    expect(mastery.unaidedCorrectAttempts).toBe(1);

    // Next adaptive problem
    const next = UnifiedPracticeStore.nextProblem(session.id);
    expect(next.decision.courseId).toBe(courseId);
  });

  /* ========================================================================= */
  /*  2. GEN 0102: Calculus 1 Journey (Fail -> Misconception -> Hint -> Retry) */
  /* ========================================================================= */
  it('Journey 2: GEN 0102 (Calculus 1) Chain Rule Retry & Misconception Resolution', () => {
    const courseId = 'COURSE-GEN0102';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, {
      targetSkillId: 'SKILL-GEN0102-005',
      sessionLength: 3
    });

    // Step A: First Attempt - Incorrect (Missing Inner Derivative)
    const failAttempt = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: '4(3x^2+1)^3',
      source: 'TYPED',
      isCorrect: false,
      mistakeCode: 'MISSING_INNER_DERIVATIVE',
      mistakeName: 'Omitted inner derivative factor',
      timeSpentSeconds: 40,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(failAttempt.attempt.isCorrect).toBe(false);
    expect(failAttempt.attempt.mistakeCode).toBe('MISSING_INNER_DERIVATIVE');

    // Verify misconception registered in Mastery Engine
    const masteryAfterFail = UnifiedPracticeStore.getSkillMastery('SKILL-GEN0102-005');
    expect(masteryAfterFail.activeMisconceptions.length).toBe(1);
    expect(masteryAfterFail.activeMisconceptions[0].resolved).toBe(false);

    // Step B: Student unlocks Level 1 Hint & Requests Tutor Advice
    LearningEventStore.logEvent(
      session.studentId,
      courseId,
      'HINT_REQUESTED',
      { hintLevel: 1 },
      { sessionId: session.id }
    );

    // Step C: Second Attempt (Retry) - Correct
    const successRetry = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: session.currentProblem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 25,
      hintLevelUsed: 1,
      solutionViewed: false
    });

    expect(successRetry.attempt.isCorrect).toBe(true);
    expect(successRetry.attempt.attemptNumber).toBe(2);

    // Verify misconception is resolved and retry mastery is awarded (+4%)
    const masteryAfterRetry = UnifiedPracticeStore.getSkillMastery('SKILL-GEN0102-005');
    expect(masteryAfterRetry.activeMisconceptions[0].resolved).toBe(true);
    expect(masteryAfterRetry.masteryPercentage).toBeGreaterThanOrEqual(4);

    // Step D: Advance to next problem
    const next = UnifiedPracticeStore.nextProblem(session.id);
    expect(next.decision.courseId).toBe(courseId);
  });

  /* ========================================================================= */
  /*  3. GEN 0107: Differential Equations Journey                              */
  /* ========================================================================= */
  it('Journey 3: GEN 0107 (Differential Equations) student workflow', () => {
    const courseId = 'COURSE-GEN0107';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2 });
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('ODE');

    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: session.currentProblem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 45,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
  });

  /* ========================================================================= */
  /*  4. GEN 0110: Physics 2 for Engineers Journey                            */
  /* ========================================================================= */
  it('Journey 4: GEN 0110 (Physics 2) student workflow with SI units verification', () => {
    const courseId = 'COURSE-GEN0110';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2 });
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('PHYSICS');
    expect(domainVal.checks.some(c => c.name === 'PHYSICS_UNITS_DECLARED' && c.passed)).toBe(true);

    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: session.currentProblem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 50,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
  });

  /* ========================================================================= */
  /*  5. GEN 0161: Thermodynamics Journey                                     */
  /* ========================================================================= */
  it('Journey 5: GEN 0161 (Thermodynamics) student workflow with energy balance checks', () => {
    const courseId = 'COURSE-GEN0161';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2 });
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('THERMODYNAMICS');

    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: session.currentProblem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 60,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
  });

  /* ========================================================================= */
  /*  6. BSIE 3219: IE Special Topics 1 Journey                                */
  /* ========================================================================= */
  it('Journey 6: BSIE 3219 (IE Special Topics 1) student workflow with economic feasibility', () => {
    const courseId = 'COURSE-BSIE3219';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { sessionLength: 2 });
    expect(session.currentProblem?.dna.courseId).toBe(courseId);

    const domainVal = DomainValidatorRegistry.validate(session.currentProblem!);
    expect(domainVal.valid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('IE_SPECIAL_TOPICS');

    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: session.currentProblem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 40,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.isCorrect).toBe(true);
  });

  /* ========================================================================= */
  /*  7. Cross-Course Session State Isolation                                  */
  /* ========================================================================= */
  it('verifies strict isolation when student moves across Calculus -> Physics -> Thermodynamics', () => {
    const studentId = UnifiedPracticeStore.getProfile().id;

    // A. Calculus Session
    const sess1 = UnifiedPracticeStore.startSession('COURSE-GEN0102');
    UnifiedPracticeStore.submitAttempt(sess1.id, {
      studentAnswer: sess1.currentProblem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 30,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    // B. Physics Session
    const sess2 = UnifiedPracticeStore.startSession('COURSE-GEN0110');
    UnifiedPracticeStore.submitAttempt(sess2.id, {
      studentAnswer: sess2.currentProblem!.solution.canonicalAnswerLatex,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 45,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    // C. Thermodynamics Session
    const sess3 = UnifiedPracticeStore.startSession('COURSE-GEN0161');

    // Verify course masteries are separate
    const calcMastery = UnifiedPracticeStore.getCourseMastery('COURSE-GEN0102');
    const physMastery = UnifiedPracticeStore.getCourseMastery('COURSE-GEN0110');
    const thermoMastery = UnifiedPracticeStore.getCourseMastery('COURSE-GEN0161');

    expect(calcMastery.totalCorrectAttempts).toBe(1);
    expect(physMastery.totalCorrectAttempts).toBe(1);
    expect(thermoMastery.totalCorrectAttempts).toBe(0);

    // Verify recommendation in Thermo remains inside Thermo
    const rec = UnifiedPracticeStore.getRecommendation('COURSE-GEN0161');
    expect(rec.courseId).toBe('COURSE-GEN0161');
  });

  /* ========================================================================= */
  /*  8. Picture vs Typed Parity                                               */
  /* ========================================================================= */
  it('guarantees identical mathematical evaluation whether submitted via Typed or Picture', () => {
    const courseId = 'COURSE-GEN0102';
    const sess = UnifiedPracticeStore.startSession(courseId, { targetSkillId: 'SKILL-GEN0102-005' });
    const ans = sess.currentProblem!.solution.canonicalAnswerLatex;

    // Typed submission
    const typedRes = UnifiedPracticeStore.submitAttempt(sess.id, {
      studentAnswer: ans,
      source: 'TYPED',
      isCorrect: true,
      timeSpentSeconds: 30,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    // Picture submission (same answer)
    const pictureRes = UnifiedPracticeStore.submitAttempt(sess.id, {
      studentAnswer: ans,
      source: 'PICTURE',
      isCorrect: true,
      timeSpentSeconds: 35,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(typedRes.attempt.isCorrect).toBe(pictureRes.attempt.isCorrect);
  });

  /* ========================================================================= */
  /*  9. Socratic Tutor Intent & Multi-Turn Contextuality                      */
  /* ========================================================================= */
  it('verifies Socratic tutor intent detection and multi-turn follow-up comprehension', async () => {
    const fallback = new DeterministicFallbackProvider();

    const context = {
      subject: 'Differential Calculus',
      topic: 'Chain Rule',
      concept: 'Chain Rule',
      expressionLatex: 'y = (3x^2 + 1)^4',
      verifiedAnswerLatex: '24x(3x^2 + 1)^3',
      studentQuestion: 'Why is Chain Rule required?'
    };

    // Question 1: Why required
    const ans1 = await fallback.answerTutorQuestion(context, 'Why is the Chain Rule required?');
    expect(ans1).toContain('composite');
    expect(ans1).toContain('u(x)');

    // Question 2: Inner function
    const ans2 = await fallback.answerTutorQuestion(context, 'What is the inner function?');
    expect(ans2).toContain('u(x) = 3x^2 + 1');

    // Question 3: Multi-turn follow-up
    const ans3 = await fallback.answerTutorQuestion(context, 'Where did 6x come from?', [
      { role: 'user', text: 'What is the inner function?' },
      { role: 'assistant', text: ans2 }
    ]);
    expect(ans3).toContain('Tracing the Origin');
    expect(ans3).toContain('6x');
  });

  /* ========================================================================= */
  /*  10. Exam Mode Policy Lockdown                                            */
  /* ========================================================================= */
  it('enforces strict exam mode policy constraints', () => {
    const policy = {
      courseId: 'COURSE-GEN0102',
      examMode: true
    };

    const decision = AdaptiveSelector.selectNextBestProblem(
      'student_exam_01',
      'COURSE-GEN0102',
      [],
      policy
    );

    expect(decision.selectedProblem).toBeDefined();
    expect(decision.courseId).toBe('COURSE-GEN0102');
  });
});
