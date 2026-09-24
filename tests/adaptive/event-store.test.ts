/**
 * Automated Test Suite: Immutable Learning Event Store & Idempotency
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LearningEventStore } from '../../src/engine/adaptive/events';

describe('LearningEventStore & Idempotency Pipeline', () => {
  beforeEach(() => {
    LearningEventStore.clear();
  });

  it('appends immutable events with strict ascending sequence numbers', () => {
    const e1 = LearningEventStore.logEvent('student_01', 'COURSE-GEN0102', 'SESSION_STARTED', { mode: 'RECOMMENDED' });
    const e2 = LearningEventStore.logEvent('student_01', 'COURSE-GEN0102', 'PROBLEM_PRESENTED', { problemId: 'PROB-1' });
    const e3 = LearningEventStore.logEvent('student_01', 'COURSE-GEN0102', 'ATTEMPT_SUBMITTED', { isCorrect: true });

    expect(e1).not.toBeNull();
    expect(e2).not.toBeNull();
    expect(e3).not.toBeNull();

    expect(e1?.sequenceNumber).toBe(1);
    expect(e2?.sequenceNumber).toBe(2);
    expect(e3?.sequenceNumber).toBe(3);

    const studentEvents = LearningEventStore.getEventsForStudent('student_01');
    expect(studentEvents.length).toBe(3);
  });

  it('guarantees idempotency and prevents duplicate events for identical idempotency keys', () => {
    const key = 'IDEMP-ATTEMPT-001';

    const e1 = LearningEventStore.logEvent(
      'student_01',
      'COURSE-GEN0102',
      'ATTEMPT_SUBMITTED',
      { isCorrect: true },
      { idempotencyKey: key }
    );

    // Duplicate network submission / rapid double click
    const e2 = LearningEventStore.logEvent(
      'student_01',
      'COURSE-GEN0102',
      'ATTEMPT_SUBMITTED',
      { isCorrect: true },
      { idempotencyKey: key }
    );

    expect(e1).not.toBeNull();
    expect(e2?.id).toBe(e1?.id); // returns existing event without re-logging

    const studentEvents = LearningEventStore.getEventsForStudent('student_01');
    expect(studentEvents.length).toBe(1);
  });

  it('supports event listeners and subscribers for reactive telemetry', () => {
    const receivedEvents: string[] = [];
    const unsubscribe = LearningEventStore.subscribe((event) => {
      receivedEvents.push(event.type);
    });

    LearningEventStore.logEvent('student_02', 'COURSE-GEN0110', 'SESSION_STARTED');
    LearningEventStore.logEvent('student_02', 'COURSE-GEN0110', 'HINT_REQUESTED', { hintLevel: 1 });

    expect(receivedEvents).toEqual(['SESSION_STARTED', 'HINT_REQUESTED']);

    unsubscribe();
    LearningEventStore.logEvent('student_02', 'COURSE-GEN0110', 'SOLUTION_VIEWED');

    // Should not receive third event after unsubscribing
    expect(receivedEvents.length).toBe(2);
  });
});
