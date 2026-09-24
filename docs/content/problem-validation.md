# Content & Mathematical Validator Specification

**Engineering Practice Engine — Validation Safety Net**  
**Document Revision**: 3.0.0  
**Phase**: PHASE 3 — ASSESSMENT EVIDENCE → PROBLEM FAMILIES → VERIFIED GENERATION  
**Date**: August 28, 2026  
**Status**: ACTIVE & AUTHORITATIVE  

---

## 1. Multi-Stage Validation Safety Net

The `ContentValidator` provides an independent, multi-stage safety net to ensure zero invalid or pedagogically unsound problems enter student practice:

```text
Problem Candidate
       ↓
[ Stage 1: Syntax & AST Well-Formedness ]
       ↓
[ Stage 2: Domain & Singularity Safety ]
       ↓
[ Stage 3: Independent Mathematical Derivative Verification ]
       ↓
[ Stage 4: Declared Skill Alignment Check ]
       ↓
[ Stage 5: Declared Evidence Alignment Check ]
       ↓
[ Stage 6: Hint Leakage & Answer Concealment Check ]
       ↓
[ Stage 7: Distractor Plausibility & Misconception Check ]
       ↓
Approved ValidatedProblem Object
```

---

## 2. Validation Rejection Codes & Enforcement Rules

| Rejection Code | Trigger Condition | Enforcement Mechanism |
| :--- | :--- | :--- |
| **`INVALID_SYNTAX`** | Missing AST node, unparseable LaTeX, or malformed mathematical expressions. | Candidate rejected immediately prior to solving. |
| **`INVALID_DOMAIN`** | Explicit division by zero, negative radicand in real evaluation, or singularity. | Expression rejected; parameter bounds adjusted. |
| **`INVALID_ANSWER`** | Canonical answer is not algebraically equivalent to independent mathematical derivative. | Differentiator re-derives and verifies via 4-level EquivalenceEngine. |
| **`SKILL_MISMATCH`** | Primary skill does not match curriculum registry or required transformation. | Candidate rejected. |
| **`EVIDENCE_MISMATCH`** | Declared evidence is `ERROR_ANALYSIS` but candidate lacks flawed derivation, or `METHOD_RECOGNITION` without options. | Candidate rejected. |
| **`SOLUTION_MISMATCH`** | Level 1 or Level 2 hint contains raw final answer LaTeX string. | Hint integrity check prevents premature answer leakage. |
| **`DISTRACTOR_INVALID`** | Multiple choice option distractor is empty or implausible. | Distractor generator rejected. |
