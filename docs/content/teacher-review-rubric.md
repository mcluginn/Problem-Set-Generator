# Teacher Pedagogical Quality Rubric & Review Policy

**Engineering Practice Engine — Content Calibration Rubric**  
**Document Revision**: 3.5.0  
**Phase**: PHASE 3.5 — TEACHER CALIBRATION & CONTROLLED CONTENT EXPANSION  
**Date**: August 28, 2026  
**Status**: ACTIVE & AUTHORITATIVE  

---

## 1. Central Calibration Policy

A mathematically valid problem is **NOT** automatically a high-quality educational problem. 

The Engineering Practice Engine strictly separates:
* **Mathematical Validity** (Derivation, equivalence, domain safety, step consistency)
* **Pedagogical Quality** (Clarity, cognitive demand, progression, explanation usefulness)
* **Curriculum Alignment** (Syllabus topic, subtopic, learning skill provenance)
* **Assessment Evidence Quality** (Matching cognitive demand with appropriate question format)

---

## 2. Six-Dimensional Pedagogical Quality Rating Scale (1 to 5)

Every candidate problem reviewed by teachers or faculty auditors is evaluated across six discrete dimensions on a 5-point ordinal scale:

```text
1 = Poor | 2 = Needs Improvement | 3 = Acceptable | 4 = Good | 5 = Excellent
```

### Dimension 1: Mathematical Correctness
* **Score 5 (Excellent)**: Solution is mathematically exact, canonical answer is simplified cleanly, and reasoning steps have zero algebraic errors or ambiguities.
* **Score 3 (Acceptable)**: Mathematically correct, but simplification is un-factored or contains slightly clumsy fractional forms.
* **Score 1 (Poor)**: Mathematical error, domain violation (e.g. division by zero, unhandled branch cuts), or incorrect answer.

### Dimension 2: Skill Alignment
* **Score 5 (Excellent)**: The target skill (e.g., `SKILL-GEN0102-005` Chain Rule) is the indispensable, primary mathematical method required. If metadata is hidden, any calculus educator would immediately identify the skill.
* **Score 3 (Acceptable)**: The target skill is exercised, but an alternative simpler shortcut (e.g., expanding a low power with polynomial multiplication) is possible.
* **Score 1 (Poor)**: Skill mismatch. The problem can be solved completely without the target skill or requires un-taught advanced prerequisites.

### Dimension 3: Clarity & Unambiguous Wording
* **Score 5 (Excellent)**: The prompt text is crisp, grammatically flawless, specifies the target and independent variables clearly, and avoids misleading jargon.
* **Score 3 (Acceptable)**: Understandable, but contains slightly verbose or repetitive phrasing.
* **Score 1 (Poor)**: Ambiguous question, missing variable declarations, confusing syntax, or instructions that accidentally leak the answer.

### Dimension 4: Difficulty Suitability & Calibration
* **Score 5 (Excellent)**: Algorithmic difficulty vector matches genuine student cognitive demand across conceptual, procedural, and computational layers.
* **Score 3 (Acceptable)**: Minor difficulty divergence (e.g., labeled Level 2 but requires Level 3 computational effort).
* **Score 1 (Poor)**: Grossly mis-calibrated difficulty (trivial one-step calculation labeled Level 5, or multi-stage Olympiad puzzle labeled Level 1).

### Dimension 5: Educational Value & Pedagogical Usefulness
* **Score 5 (Excellent)**: Deeply reinforces core conceptual understanding, reveals key structural patterns (e.g., nested functions), and provides actionable step-by-step reasoning and hints.
* **Score 3 (Acceptable)**: Standard mechanical exercise suitable for basic drill practice.
* **Score 1 (Poor)**: Meaningless, tedious arithmetic without conceptual insight or learning value.

### Dimension 6: Diversity & Distinctiveness
* **Score 5 (Excellent)**: Genuinely unique functional structure, novel parameter combinations, distinct representation (symbolic vs verbal vs physical), and non-repetitive context.
* **Score 3 (Acceptable)**: Moderate variation from other problems in the same family.
* **Score 1 (Poor)**: Superficial clone of an adjacent problem with only trivial coefficient substitution ($3x^2+1$ vs $4x^2+1$).

---

## 3. Structured Teacher Decisions & Rejection Reasons

### Review Decisions:
1. **`APPROVE` (`TEACHER_APPROVED`)**: Problem meets all quality standards and enters the authoritative practice bank.
2. **`EDIT`**: Teacher modifies prompt text, context story, or difficulty metadata, which immediately triggers automated mathematical and pedagogical revalidation before approval.
3. **`REJECT`**: Problem is rejected from the delivery bank with structured rejection codes and teacher feedback.
4. **`FLAG`**: Problem is flagged for curriculum committee review (e.g., difficulty mis-calibration).
5. **`REGENERATE`**: Request a new distinct candidate from the family template.

### Structured Rejection Reason Taxonomy:
* `MATHEMATICALLY_WRONG`: Mathematical inaccuracy, incorrect derivative, or equivalence failure.
* `SKILL_MISMATCH`: Problem does not genuinely test the declared curriculum skill.
* `TOO_EASY` / `TOO_HARD`: Algorithmic difficulty does not match actual cognitive demand.
* `REPETITIVE`: Superficial duplicate of recent questions without pedagogical purpose.
* `AMBIGUOUS`: Question statement leaves the student unsure of what to calculate or in what form to submit.
* `POOR_WORDING`: Grammatical errors, awkward phrasing, or clunky text.
* `UNREALISTIC_CONTEXT`: Artificial engineering scenario with absurd or physically impossible magnitudes.
* `BAD_DISTRACTOR`: Multiple choice distractor is nonsensical or mathematically correct under an alternative valid interpretation.
* `WEAK_PEDAGOGY`: Problem is tedious mechanical busywork with low educational value.
* `UNNECESSARY_COMPLEXITY`: Obscure algebraic baggage that distracts from the target calculus concept.
