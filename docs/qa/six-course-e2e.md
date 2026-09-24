# Six-Course End-to-End Test Suite Documentation

## Test Matrix (`tests/e2e/six-course-student-journeys.test.ts`)

The automated End-to-End test suite validates real student flows across all six authoritative engineering courses:

```text
6 Courses
18 Curriculum Units
67 Syllabus Topics
181 Documented Subtopics
71 Learning Skills
```

---

## Verified Student Journeys

### 1. GEN 0101 — Mathematics for Engineers Journey
- **Flow**: Course selection $\rightarrow$ Problem generation $\rightarrow$ Domain invariant check (`MATH_FOR_ENGINEERS`) $\rightarrow$ Solution evaluation $\rightarrow$ Telemetry logging $\rightarrow$ Mastery update $\rightarrow$ Adaptive continuation.
- **Result**: ✅ Verified.

### 2. GEN 0102 — Calculus 1 Journey (Fail $\rightarrow$ Misconception $\rightarrow$ Hint $\rightarrow$ Retry)
- **Flow**: Chain Rule problem $\rightarrow$ First attempt fails (`4(3x^2+1)^3`) $\rightarrow$ Misconception detected (`MISSING_INNER_DERIVATIVE`) $\rightarrow$ Level 1 hint unlocked $\rightarrow$ Socratic advice requested $\rightarrow$ Second attempt correct (`24x(3x^2+1)^3`) $\rightarrow$ Misconception resolved $\rightarrow$ Retry mastery delta awarded (+4%).
- **Result**: ✅ Verified.

### 3. GEN 0107 — Differential Equations Journey
- **Flow**: Separable ODE problem $\rightarrow$ Solution verification $\rightarrow$ ODE domain validator checks $\rightarrow$ General integration constant $C$ check.
- **Result**: ✅ Verified.

### 4. GEN 0110 — Physics 2 for Engineers Journey
- **Flow**: Fluid mechanics & circuit problems $\rightarrow$ SI physical units validation ($\text{Pa}$, $\text{kPa}$, $\text{V}$, $\Omega$) $\rightarrow$ Physics domain checks.
- **Result**: ✅ Verified.

### 5. GEN 0161 — Thermodynamics Journey
- **Flow**: First Law closed system ($Q - W = \Delta U$) $\rightarrow$ Energy conservation check $\rightarrow$ Kelvin temperature limit check ($T > 0\text{ K}$) $\rightarrow$ Carnot efficiency upper bound check.
- **Result**: ✅ Verified.

### 6. BSIE 3219 — IE Special Topics 1 Journey
- **Flow**: Compound interest evaluation $\rightarrow$ Single payment compound amount $(F/P, i, n)$ $\rightarrow$ Financial feasibility evaluation.
- **Result**: ✅ Verified.

### 7. Cross-Course Session State Isolation
- **Flow**: Switch active student course from Calculus $\rightarrow$ Physics $\rightarrow$ Thermodynamics; verify total attempts, skill masteries, and adaptive recommendations remain strictly bounded to the active course.
- **Result**: ✅ Verified.

### 8. Picture vs Typed Answer Parity
- **Flow**: Confirm equivalent mathematical grading and misconception diagnosis whether the submission is entered via standard input or recognized via handwritten photo work.
- **Result**: ✅ Verified.

### 9. Socratic Tutor Multi-Turn Comprehension
- **Flow**: Ask *"What is the inner function?"* followed by *"Where did 6x come from?"*; verify conversational continuity and term derivation tracing.
- **Result**: ✅ Verified.

### 10. Exam Mode Policy Lockdown
- **Flow**: Activate `examMode: true` constraint policy; verify hints, Socratic tutor, and picture mode are disabled.
- **Result**: ✅ Verified.
