/**
 * Immutable Learning Telemetry & Event Store
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { LearningEvent, LearningEventType } from './types';

export class LearningEventStore {
  private static events: LearningEvent[] = [];
  private static sequenceCounter = 0;
  private static idempotencySet = new Set<string>();
  private static listeners: Array<(event: LearningEvent) => void> = [];

  /**
   * Appends an immutable learning telemetry event.
   * Enforces idempotency to prevent duplicate submissions or retried network requests.
   */
  public static logEvent(
    studentId: string,
    courseId: string,
    type: LearningEventType,
    metadata: Record<string, unknown> = {},
    options?: {
      skillId?: string;
      problemId?: string;
      sessionId?: string;
      idempotencyKey?: string;
      timestamp?: string;
    }
  ): LearningEvent | null {
    if (options?.idempotencyKey) {
      const key = `${studentId}:${options.idempotencyKey}`;
      if (LearningEventStore.idempotencySet.has(key)) {
        // Return existing event or null to prevent double-counting
        const existing = LearningEventStore.events.find(
          e => e.studentId === studentId && e.idempotencyKey === options.idempotencyKey
        );
        return existing || null;
      }
      LearningEventStore.idempotencySet.add(key);
    }

    LearningEventStore.sequenceCounter++;
    const event: LearningEvent = {
      id: `EVT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      studentId,
      courseId,
      skillId: options?.skillId,
      problemId: options?.problemId,
      sessionId: options?.sessionId,
      type,
      timestamp: options?.timestamp || new Date().toISOString(),
      sequenceNumber: LearningEventStore.sequenceCounter,
      idempotencyKey: options?.idempotencyKey,
      metadata: { ...metadata }
    };

    LearningEventStore.events.push(event);

    // Notify listeners
    for (const listener of LearningEventStore.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.warn('Error in LearningEvent listener:', err);
      }
    }

    return event;
  }

  /**
   * Retrieves all immutable events for a given student in sequence.
   */
  public static getEventsForStudent(studentId: string): LearningEvent[] {
    return LearningEventStore.events.filter(e => e.studentId === studentId);
  }

  /**
   * Retrieves all events for a given practice session.
   */
  public static getEventsForSession(sessionId: string): LearningEvent[] {
    return LearningEventStore.events.filter(e => e.sessionId === sessionId);
  }

  /**
   * Retrieves all events for a specific problem.
   */
  public static getEventsForProblem(problemId: string): LearningEvent[] {
    return LearningEventStore.events.filter(e => e.problemId === problemId);
  }

  /**
   * Subscribes to new incoming learning events.
   */
  public static subscribe(listener: (event: LearningEvent) => void): () => void {
    LearningEventStore.listeners.push(listener);
    return () => {
      LearningEventStore.listeners = LearningEventStore.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Clears in-memory events for test isolation.
   */
  public static clear(): void {
    LearningEventStore.events = [];
    LearningEventStore.sequenceCounter = 0;
    LearningEventStore.idempotencySet.clear();
    LearningEventStore.listeners = [];
  }

  /**
   * Bulk loads historical events.
   */
  public static loadHistoricalEvents(historicalEvents: LearningEvent[]): void {
    LearningEventStore.events = [...historicalEvents];
    LearningEventStore.sequenceCounter = historicalEvents.reduce(
      (max, e) => Math.max(max, e.sequenceNumber || 0),
      0
    );
    LearningEventStore.idempotencySet.clear();
    for (const e of historicalEvents) {
      if (e.idempotencyKey) {
        LearningEventStore.idempotencySet.add(`${e.studentId}:${e.idempotencyKey}`);
      }
    }
  }
}
