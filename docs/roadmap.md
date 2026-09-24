# Engineering Roadmap & Milestones
## Engineering Practice Engine

### Development Roadmap Overview

```mermaid
gantt
    title Development Roadmap & Milestone Phases
    dateFormat  YYYY-MM-DD
    section Phase 0: System Foundations
    PRD & System Specifications       :done,    des1, 2026-08-27, 1d
    section Phase 1: Mathematical Core
    AST & Differentiation Rules       :active,  math1, 2026-08-28, 2d
    Equivalence & Simplification      :         math2, after math1, 2d
    Deterministic Step Generator      :         math3, after math2, 1d
    section Phase 2: Problem Engine
    Derivatives Problem Families      :         gen1,  after math3, 2d
    Structure Signatures & Diversity  :         gen2,  after gen1, 1d
    1,000 Problem Stress Test Suite   :         gen3,  after gen2, 1d
    section Phase 3: Student Practice MVP
    Next.js UI & KaTeX Math Pad       :         ui1,   after gen3, 2d
    Vertical Slice End-to-End Test    :         ui2,   after ui1, 1d
    All 14 Derivatives Concepts       :         ui3,   after ui2, 2d
    section Phase 4: Adaptive Mastery
    Misconception Buggy Rules Engine  :         mast1, after ui3, 1d
    Next Best Problem Selector        :         mast2, after mast1, 1d
    Mistake Review & Remediation      :         mast3, after mast2, 1d
    section Phase 5: AI Gateway
    Gemini Provider & Fallback Layer  :         ai1,   after mast3, 1d
    Socratic Tutor & Context Hints    :         ai2,   after ai1, 1d
    section Phase 6: Teacher Platform
    Classrooms & Assignments          :         tchr1, after ai2, 2d
    Problem Bank Approval Workflow    :         tchr2, after tchr1, 1d
    section Phase 7: Engineering Expansion
    Integral Calculus & Statics       :         exp1,  after tchr2, 5d
    Dynamics, Fluids, Thermodynamics  :         exp2,  after exp1, 5d
```

---

### Milestone 1: Mathematical Core & Vertical Slice (Current Goal)
- **Scope**:
  - Full AST parser & tokenizer for standard calculus syntax ($x^n$, $\sin$, $\cos$, $\tan$, $e^x$, $\ln$, polynomials, fractions).
  - Symbolic differentiation engine implementing Power, Product, Quotient, Chain, Trig, Exp, Log, and Implicit rules.
  - Dual-verification equivalence checker with zero-difference simplification and Schwartz-Zippel multi-point testing.
  - Step-by-step solution and progressive hint generator.
  - Problem family generator for Chain Rule (`CHAIN_POWER_POLYNOMIAL`, `CHAIN_TRIG_INNER`).
  - Interactive Next.js + React web interface with KaTeX rendering, answer checking, progressive hints, step-by-step breakdown, and adaptive retry.
  - Full unit test and golden benchmark test suites.

### Milestone 2: Complete Derivatives Suite (14 Concepts)
- Implementation of all 14 calculus concepts with 3+ problem families each.
- Multi-dimensional difficulty calibrator and diversity signature filter.
- Automated 1,000 problem fuzzing and validation test suite.

### Milestone 3: Mastery & Misconception Engine
- Bayesian/Weighted student mastery calculation.
- Perturbation generator for automatic bug identification.
- "Review My Mistakes" dedicated workspace with targeted remediation practice.

### Milestone 4: AI Tutoring Layer & Teacher Platform
- Gemini-powered Socratic tutoring with strict output validation and solution-leakage guards.
- Teacher assignments, classroom tracking, and problem approval workflows.

### Milestone 5: Future Engineering Subjects
- Modular expansion into Integral Calculus, Differential Equations, Statics, Dynamics, Thermodynamics, and Fluid Mechanics.
