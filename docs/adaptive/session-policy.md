# Practice Session Policies & Lifecycle Management
## Phase 6 Practice Modes, Progression & Balancing

### 1. Practice Modes

The `PracticeSessionManager` (`src/engine/adaptive/session.ts`) supports six distinct practice modes over the authoritative content bank:

| Mode | Purpose | Adaptive Behavior |
| :--- | :--- | :--- |
| `RECOMMENDED` | Overall course mastery optimization | Evaluates entire course graph to select highest-yield growth area |
| `SKILL_PRACTICE` | Focused mastery on a single skill | Adapts difficulty and representation within requested skill boundary |
| `TOPIC_PRACTICE` | Comprehensive unit/topic coverage | Mixes skills across the selected curriculum unit |
| `REMEDIATION` | Misconception elimination | Prioritizes skills with active unresolved error codes |
| `REVIEW` | Spaced retrieval reinforcement | Re-samples high-mastery skills not practiced recently |
| `CHALLENGE` | Advanced synthesis & modeling | Targets difficulty level 3–4 with application contexts |

---

### 2. Session Lifecycle

```text
startSession(studentId, courseId, options)
    ↓
getCurrentProblem(sessionId)
    ↓
submitAttempt(sessionId, attemptPayload)
    ↓ (Updates Problem Counter & Mastery)
nextProblem(sessionId)
    ↓
completeSession(sessionId) -> SessionSummary
```

---

### 3. Session Performance Summary

Upon reaching the configured session length (5, 10, 15, or 20 problems), the engine compiles:
- `totalProblemsAttempted` vs `totalProblemsSolved`
- `totalTimeSpentSeconds`
- `skillsPracticed`
- `strongSkills` (mastery $\ge 75\%$)
- `skillsNeedingReview` (mastery $< 55\%$ or active misconceptions)
- `totalHintsUsed`
- `recommendedNextSkillId` and plain-English next action
