# Immutable Telemetry & Learning Event Model
## Phase 6 Event Sourcing & Idempotency Pipeline

### 1. Normalized Event Schema

The `LearningEventStore` (`src/engine/adaptive/events.ts`) captures immutable chronological learning events:

```ts
type LearningEventType =
  | 'SESSION_STARTED'
  | 'PROBLEM_PRESENTED'
  | 'ATTEMPT_SUBMITTED'
  | 'HINT_REQUESTED'
  | 'SOLUTION_VIEWED'
  | 'PICTURE_RECOGNIZED'
  | 'RECOGNITION_CORRECTED'
  | 'TUTOR_INTERACTION'
  | 'PROBLEM_COMPLETED'
  | 'PROBLEM_ABANDONED'
  | 'SESSION_COMPLETED';

interface LearningEvent {
  id: string;
  studentId: string;
  courseId: string;
  skillId?: string;
  problemId?: string;
  sessionId?: string;
  type: LearningEventType;
  timestamp: string;
  sequenceNumber: number;
  idempotencyKey?: string;
  metadata: Record<string, unknown>;
}
```

---

### 2. Idempotency & Data Race Protection

- Every submission can supply an `idempotencyKey` (e.g. `ATT-{sessionId}-{problemId}-{attemptNumber}`).
- Rapid double-clicks, network retries, and concurrent browser requests matching an existing key return the cached event outcome without incrementing sequence numbers or double-counting mastery deltas.
