/**
 * Automated Test Suite: Picture Mode Handwriting Integration with Adaptive Learning Loop
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { UnifiedPracticeStore } from '../../src/engine/adaptive/store';
import { LearningEventStore } from '../../src/engine/adaptive/events';
import { HandwritingRecognitionService } from '../../src/services/picture/recognitionService';

describe('Picture Mode Handwriting Convergence into Common Learning Loop', () => {
  beforeEach(() => {
    UnifiedPracticeStore.clear();
    LearningEventStore.clear();
  });

  it('converges recognized handwriting input into the common practice attempt & mastery pipeline', () => {
    const courseId = 'COURSE-GEN0102';
    UnifiedPracticeStore.setActiveCourseId(courseId);

    const session = UnifiedPracticeStore.startSession(courseId, { targetSkillId: 'SKILL-GEN0102-005' });
    expect(session.currentProblem).toBeDefined();

    // Simulate handwriting recognition service output
    const recognizedHandwriting = session.currentProblem!.solution.canonicalAnswerLatex;

    // Log photo recognition telemetry event
    LearningEventStore.logEvent(
      UnifiedPracticeStore.getProfile().id,
      courseId,
      'PICTURE_RECOGNIZED',
      { recognizedExpression: recognizedHandwriting, confidence: 0.95 },
      { sessionId: session.id, problemId: session.currentProblemId }
    );

    // Submit attempt with source: 'PICTURE'
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: recognizedHandwriting,
      source: 'PICTURE',
      isCorrect: true,
      timeSpentSeconds: 40,
      hintLevelUsed: 0,
      solutionViewed: false
    });

    expect(res.attempt.source).toBe('PICTURE');
    expect(res.attempt.isCorrect).toBe(true);

    // Verify mastery was properly updated through the unified pipeline
    const skillMastery = UnifiedPracticeStore.getSkillMastery('SKILL-GEN0102-005');
    expect(skillMastery.masteryPercentage).toBeGreaterThanOrEqual(10);
    expect(skillMastery.unaidedCorrectAttempts).toBe(1);

    // Verify telemetry event exists in event store
    const studentEvents = LearningEventStore.getEventsForStudent(UnifiedPracticeStore.getProfile().id);
    expect(studentEvents.some(e => e.type === 'PICTURE_RECOGNIZED')).toBe(true);
    expect(studentEvents.some(e => e.type === 'ATTEMPT_SUBMITTED' && e.metadata.source === 'PICTURE')).toBe(true);
  });
});
