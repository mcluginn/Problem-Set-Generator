# Student Practice & Adaptive Learning Loop
## Phase 6 Architecture & Pedagogical Flow

### 1. Executive Summary

The Engineering Practice Engine implements a unified, closed-loop adaptive pedagogical workflow across all six authoritative institutional engineering courses:

```text
Course / Syllabus Context
        ↓
Topic Selection OR Recommended Practice
        ↓
Target Learning Skill & Evidence Type Resolution
        ↓
Adaptive Problem Retrieval / On-Demand Generation
        ↓
Student Work Submission (Typed / Picture OCR / Manual Correction)
        ↓
Domain & Mathematical Invariant Evaluation Pipeline
        ↓
Misconception Diagnosis Engine (Targeted Error Analysis)
        ↓
5-Tier Progressive Hints / Context-Aware Socratic Tutor
        ↓
Student Retry & Resolution
        ↓
Immutable Telemetry Logging (LearningEventStore)
        ↓
Multi-Dimensional Skill Mastery Update (MasteryEngine)
        ↓
Explainable Next Best Problem Decision (AdaptiveSelector)
```

---

### 2. Core Operational Pillars

1. **Common Learning Architecture**:
   - Practice sessions, attempts, learning events, hints, Socratic tutor context, and adaptive selection logic are strictly shared across all six courses.
   - All student submissions (whether typed or handwritten photo) enter the same deterministic evaluation pipeline.

2. **Domain-Specific Evaluation**:
   - Correctness checking is specialized per course via `DomainValidatorRegistry`:
     - **Physics 2**: Explicit physical units, non-negative DC resistance ($R > 0$), sub-light speed limits ($v \le c$), optical refractive indices ($n \ge 1.0$).
     - **Thermodynamics**: Third Law absolute zero temperature ($T > 0\text{ K}$), First Law energy balance ($Q - W = \Delta U$), Carnot theoretical efficiency ceiling ($\eta \le 1 - T_L/T_H$).
     - **Differential Equations**: Differential operator and prime notation parsing ($y', dy/dx, \mathcal{L}$), constant of integration ($C$), IVP initial conditions.
     - **Math for Engineers**: Triangle inequalities ($a + b > c$), trigonometric range bounds ($|\sin \theta| \le 1.0$), real root quadratic discriminants ($\Delta \ge 0$).
     - **IE Special Topics**: Positive investment horizons ($n \ge 1$), positive interest rates ($i > 0\%$), salvage value upper bounds ($S \le C$), Benefit-Cost feasibility ratios ($B/C \ge 1.0$).
     - **Calculus 1**: AST equivalence, singularity checks, derivative verification.

3. **Multi-Dimensional Mastery**:
   - Distinguishes unaided success ($+10\%$), low-hint assistance ($+5\%$), high-hint assistance ($+2\%$), and retry corrections ($+4\%$).
   - Tracks mastery independently across evidence types (`DIRECT_CALCULATION`, `APPLICATION`, `ERROR_ANALYSIS`, `MODELING`) and representation modes (`SYMBOLIC`, `PHYSICAL`, `GRAPHICAL`).

4. **Explainable Adaptivity**:
   - The adaptive engine outputs deterministic, plain-English reasons (`USER_REQUEST`, `REMEDIATION`, `PREREQUISITE`, `TRANSFER`, `PROGRESSION`, `RETRIEVAL`) and supporting factors.
