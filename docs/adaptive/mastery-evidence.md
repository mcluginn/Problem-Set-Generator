# Multi-Dimensional Mastery & Evidence Model
## Phase 6 Learning Engine

### 1. Mastery Calculation Rules

The Mastery Engine (`src/engine/adaptive/mastery.ts`) evaluates real student attempts rather than treating binary correctness as the sole metric.

| Attempt Outcome | Conditions | Mastery Delta | Confidence Impact | Misconception State |
| :--- | :--- | :---: | :---: | :--- |
| **Unaided Correct** | 1st try, 0 hints used, no solution viewed | **$+10\%$** | $+0.12$ | Resolves active misconception on skill |
| **Low-Hint Assisted** | 1st try, Level 1–2 hints used | **$+5\%$** | $+0.08$ | Resolves active misconception on skill |
| **High-Hint Assisted** | Level 3–5 hints used or solution opened | **$+2\%$** | $+0.04$ | Resolves active misconception on skill |
| **Retry Correction** | Correct on retry attempt ($>1$) | **$+4\%$** | $+0.06$ | Resolves active misconception on skill |
| **Incorrect with Misconception** | Incorrect answer matching error pattern | **$-4\%$** | $+0.05$ | Registers active unresolved misconception |
| **Solution Opened** | Solution viewed prior to completion | **$-6\%$** | $+0.02$ | Resets current day streak to 0 |

---

### 2. Dimensional Mastery Tracking

For each of the 71 authoritative skills across all six courses, the engine tracks:
- **Primary Skill Mastery** ($0\%$ to $100\%$)
- **Evidence-Specific Mastery**:
  - `DIRECT_CALCULATION`
  - `APPLICATION`
  - `ERROR_ANALYSIS`
  - `MODELING`
  - `CLASSIFICATION`
  - `TABLE_INTERPRETATION`
- **Representation-Specific Mastery**:
  - `SYMBOLIC`
  - `PHYSICAL`
  - `GRAPHICAL`
  - `TABULAR`
  - `VERBAL`
  - `SCHEMATIC_DIAGRAM`
- **Confidence Metric**:
  $$C = \min\left(1.0, \frac{\text{totalAttempts}}{8}\right)$$
- **Active Misconceptions**:
  - Code, Name, Occurred Count, Last Occurred Timestamp, Resolved Status.
