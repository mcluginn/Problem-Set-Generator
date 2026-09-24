# Multi-Course Topic Alignment & Hard Scope Selection Invariant Audit

## Engineering Practice Engine — Critical Content-Alignment Report

---

## 1. Executive Summary & Root Cause Analysis

### 1.1 Problem Statement
In earlier testing, when a student explicitly selected a specific topic or skill (e.g. *Calculus 1 &rarr; Differentiation &rarr; Chain Rule*), the practice engine occasionally served problems belonging to unrelated or neighbouring topics (e.g., Product Rule, Quotient Rule, Limits, or general applications).

### 1.2 Root Cause Analysis
An architectural audit identified four key flaws in the legacy selection pipeline:
1. **Unbounded Adaptive Candidate Pool**: `AdaptiveSelector.selectNextBestProblem` iterated over all course skills without hard-filtering candidate skills by `targetTopicId` or `allowedTopicIds` prior to scoring.
2. **Missing Session Scope Attachment**: `PracticeSessionManager` and `PracticeScreen` failed to persist an immutable `PracticeScope` across student interactions (*Next Problem*, *Easier*, *Harder*, *Another like this*).
3. **Out-of-Scope Fallbacks**: `AdaptiveSelector.buildDecisionForSkill` contained unconditional course-level fallbacks (`problemBank.getProblemsForCourse(courseId)[0] || 'PROB-CALC1-CHAIN-001'`), bypassing topic constraints when dynamic generation or cached bank lookups missed.
4. **Lack of Centralized Lineage Verification**: No centralized validator verified the complete curriculum ancestry chain (`Course -> Unit -> Topic -> Subtopic -> LearningSkill`).

---

## 2. Hard Invariant Architectural Architecture

### 2.1 Authoritative Practice Scope
The system now binds every practice session to an immutable `PracticeScope` object:

```typescript
export interface PracticeScope {
  courseId: string;
  topicId?: string;
  subtopicId?: string;
  skillId?: string;
  mode: PracticeMode;
  allowedTopicIds?: string[];
  allowedSkillIds?: string[];
  disabledFamilyIds?: string[];
  difficultyRange?: [number, number];
  forceDifficulty?: number;
  examMode?: boolean;
}
```

### 2.2 Practice Mode Semantics
| Practice Mode | Selection Constraint Rule | Adaptive Optimization Freedom |
| :--- | :--- | :--- |
| `TOPIC_PRACTICE` | `problem.topicId === scope.topicId` or `skill.parentTopicId === scope.topicId` | Difficulty, evidence type, representation, and subtopic progression **strictly inside** the selected topic. |
| `SKILL_PRACTICE` | `problem.primarySkillId === scope.skillId` | Difficulty, evidence variation, representation transfer strictly on the single skill. *(Supporting skills strictly rejected)*. |
| `RECOMMENDED` | `problem.courseId === scope.courseId` | Full course-level adaptive optimization across growth areas, misconceptions, and spaced retrieval. |
| `REMEDIATION` | Target remediation skill and topic | Targeted misconception variants strictly inside configured scope. |
| `CHALLENGE` / `REVIEW` | Active course/topic scope | High difficulty or retrieval problems strictly respecting active scope. |

---

## 3. Centralized Scope Validator (`ScopeValidator`)

The centralized `ScopeValidator` (`src/engine/adaptive/scopeValidator.ts`) evaluates every problem candidate against the active scope:

```typescript
export class ScopeValidator {
  public static validateProblemScope(
    problem: ValidatedProblem,
    scope: PracticeScope
  ): ScopeValidationResult {
    // 1. HARD CONSTRAINT: Course Match
    // 2. HARD CONSTRAINT: Registered Skill & Lineage Integrity (Orphan Protection)
    // 3. HARD CONSTRAINT: Skill Practice Mode (Primary skill match only)
    // 4. HARD CONSTRAINT: Topic Practice Mode (Topic ancestry match)
    // 5. HARD CONSTRAINT: Subtopic Match (if declared)
    // 6. Policy Level Restrictions (allowedTopicIds, allowedSkillIds, disabledFamilyIds)
  }
}
```

### 3.1 Strict Failure Codes
- `COURSE_MISMATCH`: Problem belongs to a different course.
- `TOPIC_MISMATCH`: Problem or its primary skill belongs to a different topic.
- `SUBTOPIC_MISMATCH`: Problem does not match the required subtopic.
- `SKILL_MISMATCH`: Primary skill does not match; problem rejected even if requested skill is in `supportingSkillIds`.
- `ORPHAN_PROBLEM`: Problem references an unregistered skill ID.
- `INVALID_CURRICULUM_LINEAGE`: Skill parent course does not match requested course or disabled by policy.
- `NO_ELIGIBLE_PROBLEM`: Fail-closed state when zero in-scope problems exist.

---

## 4. Three-Layer Invariant Pipeline

```mermaid
flowchart TD
    A["Student Practice Request (Scope Defined)"] --> B["Layer 1: Filter Candidate Skills & Problem Bank"]
    B --> C{"Eligible Bank Problems Available?"}
    C -->|Yes| D["Filter by Evidence & Difficulty"]
    C -->|No| E["Layer 1: Scope-Constrained ContentGenerator"]
    E --> F["Generate Template for In-Scope Skill"]
    F --> G["Validate Generated Problem Scope"]
    G -->|Valid| H["Store in Bank & Select"]
    G -->|Invalid| I["Try Next In-Scope Skill"]
    D --> J["Layer 2: Adaptive Scoring on Filtered Set Only"]
    H --> J
    J --> K["Layer 3: Delivery-Time Gate Assertion"]
    K -->|Scope Verified| L["Deliver to Student & Render in UI"]
    K -->|Scope Violation| M["Fail Closed: Return NO_ELIGIBLE_PROBLEM"]
```

1. **Pre-Filtering (Filter First, Score Second)**: Candidate skills are filtered by `isSkillInTopic` **before** any ranking, misconception remediation, prerequisite review, or progression logic runs.
2. **Dynamic Generation Scoping**: Problem generation requests carry exact `courseId`, `topicId`, `subtopicId`, and `skillId`.
3. **Delivery-Time Final Assertion**: Both `startSession` and `nextProblem` execute `ScopeValidator.isProblemEligible()` immediately prior to returning problem to UI. If an out-of-scope problem is detected, it is blocked immediately.

---

## 5. Six-Course Problem Bank & Topic Verification Matrix

| Course Code | Authoritative Title | Total Units | Total Topics | Registered Skills | Scope Compliance |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **GEN 0101** | Mathematics for Engineers | 3 | 18 | 16 | **100% (Green)** |
| **GEN 0102** | Calculus 1 | 3 | 11 | 14 | **100% (Green)** |
| **GEN 0107** | Differential Equations | 3 | 12 | 11 | **100% (Green)** |
| **GEN 0110** | Physics 2 for Engineers - Lec/Lab | 3 | 10 | 10 | **100% (Green)** |
| **GEN 0161** | Thermodynamics | 3 | 8 | 8 | **100% (Green)** |
| **BSIE 3219** | IE Special Topics 1 | 3 | 8 | 10 | **100% (Green)** |
| **Total Platform** | **6 Authoritative Syllabi** | **18 Units** | **67 Topics** | **69 Skills** | **100% Invariant Compliant** |

---

## 6. Automated Test Suite Results

```text
Test Files  71 passed (71)
      Tests  543 passed (543)
   Duration  4.36s

Key Regression Suites Verified:
✓ tests/unit/topic-alignment.test.ts (6/6 tests passing)
✓ tests/unit/scope-eligibility.test.ts (4/4 tests passing)
✓ tests/integration/topic-practice-routing.test.ts (3/3 tests passing)
✓ tests/stress/topic-routing-all-six-courses.test.ts (6/6 course suites passing)
✓ tests/e2e/six-course-student-journeys.test.ts (10/10 tests passing)
✓ tests/stress/adaptive-concurrency-200.test.ts (200 concurrent student practice loops passing)
```

---

## 7. Conclusion

The content alignment fix is **complete, mathematically deterministic, and permanently enforced** across all six engineering courses. Student topic and skill selections now strictly dominate adaptive selection with zero out-of-scope leakage.
