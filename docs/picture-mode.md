# Picture Mode ("Check My Work") — Architecture & User Guide

## 1. Executive Summary

**Picture Mode** (student-facing label: **"Check My Work"**) allows students to photograph their handwritten mathematical derivations and receive instant, deterministic, and learning-oriented pedagogical feedback.

To support scaling across **200+ active students** without incurring unsustainable cloud API costs or latency bottlenecks, Picture Mode is architected on a strict **Local-First, AI-Minimized** foundation.

```
       [ Student Handwritten Work ]
                    │
            ┌───────▼────────┐
            │  Camera Stream │
            │  / File Upload │
            └───────┬────────┘
                    │
            ┌───────▼────────┐
            │  Quality Gate  │ ──(Blur/Dark/Glare)──> [ Friendly Retake Guide ]
            └───────┬────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌────────────────┐      ┌────────────────┐
│ Tier 1: Local  │      │ Tier 3: Cloud  │ (Optional Fallback Only)
│ Recognition    │      │ Gemini Vision  │
└───────┬────────┘      └───────┬────────┘
        │                       │
        └───────────┬───────────┘
                    │
            ┌───────▼────────┐
            │ Math Normalizer│
            │   & Parser     │
            └───────┬────────┘
                    │
            ┌───────▼────────┐
            │  Student View  │ ──(Student Edits in MathInput)──> [ Tier 2: Manual (0 API Calls) ]
            │ "We read your  │
            │  answer as:"   │
            └───────┬────────┘
                    │ (Confirmed Expression)
            ┌───────▼────────┐
            │ Deterministic  │
            │ Math AST Core  │
            └───────┬────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌────────────────┐      ┌────────────────┐
│ 4-Level Exact  │      │ Misconception  │
│ Equivalence    │      │  Diagnosis     │
└────────────────┘      └────────────────┘
```

---

## 2. Three Recognition Tiers

| Tier | Name | When Used | Cloud Cost | Privacy |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Local Recognition Engine** (Preferred) | On-device parsing, syntax validation, pattern heuristics | **$0.00 (0 API calls)** | 100% On-Device |
| **Tier 2** | **Student Confirmation / Manual Edit** | Student confirms or corrects recognized LaTeX in `<MathInput>` | **$0.00 (0 API calls)** | 100% On-Device |
| **Tier 3** | **Cloud Vision Fallback** (Optional) | Used only on ambiguous low confidence, user request, or failure | Rate-limited (max 10/day/student) | Transitory payload only |

---

## 3. Operational Modes

### Mode A: Check Final Answer (MVP Priority 1)
- The student captures a single final expression on paper (e.g. $10(3x - 1)(3x^2 - 2x + 4)^4$).
- The system checks image quality (sharpness, lighting).
- Local OCR / normalizer converts strokes into an ASCII string.
- Student confirms or edits the rendered KaTeX preview.
- Deterministic 4-level equivalence check (`checkEquivalence`) grades the answer.
- If incorrect, `MisconceptionEngine` identifies the exact conceptual error (e.g. `MISSING_INNER_DERIVATIVE`).

### Mode B: Check Full Solution (Priority 2 — Experimental)
- The student captures multiple handwritten lines corresponding to intermediate derivation steps.
- `SolutionAnalysisService` aligns recognized lines against the problem's canonical `SolutionStep[]`.
- Localizes the **first divergent step** in reasoning ($Step_1 \checkmark, Step_2 \checkmark, Step_3 \times$).
- Diagnoses the misconception at that exact step.

---

## 4. Separation of Concerns & Authority Boundaries

1. **Vision / Recognition Layer**: *"What characters did the student write?"* (Output: Text string with `recognitionConfidence`).
2. **Mathematical Layer**: *"What does this expression represent?"* (Output: `MathNode` AST).
3. **Verification Layer**: *"Is this expression algebraically equivalent to the derivative?"* (Output: Deterministic `checkEquivalence` boolean).
4. **Pedagogical Layer**: *"What bug did the student introduce and why?"* (Output: `MisconceptionDiagnosis` from perturbation library).
5. **AI Tutor Layer**: *"How should this be socratically explained to the student?"* (Output: Context-aware guidance text; **never grades**).
