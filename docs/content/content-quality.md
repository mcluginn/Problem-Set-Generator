# Content Quality Framework & Assessment Integrity Standards

**Engineering Practice Engine — Quality Assurance Architecture**  
**Document Revision**: 3.0.0  
**Phase**: PHASE 3 — ASSESSMENT EVIDENCE → PROBLEM FAMILIES → VERIFIED GENERATION  
**Date**: August 28, 2026  
**Status**: ACTIVE & AUTHORITATIVE  

---

## 1. Quality Scoring Dimensions

Every candidate problem produced by the generation engine is scored across five objective quality dimensions before entering the Problem Bank:

```text
1. Mathematical Validity (1.0) : 100% verified symbolic derivation & equivalence
2. Skill Alignment       (1.0) : Problem genuinely exercises the declared primary skill
3. Evidence Alignment    (1.0) : Format and cognitive demand match declared evidence type
4. Hint Integrity        (1.0) : 5 progressive hint tiers with zero premature answer leakage
5. Overall Quality Score (1.0) : Composite product of all sub-metrics
```

---

## 2. Distractor Quality Standards

For multiple-choice and error-analysis problems:
* **Misconception-Grounded**: Distractors must reflect real, empirically documented student cognitive traps (e.g. `MISSING_INNER_DERIVATIVE`, `POWER_RULE_NO_REDUCE`, `QUOTIENT_RULE_SIGN_FLIP`).
* **Zero Trivial Distractors**: Arbitrary nonsense answers (`999999`, `banana`, `"None of the above"`) are strictly prohibited.
* **Plausibility & Explanation**: Every distractor carries a pedagogical explanation explaining why a student might make that error.

---

## 3. Physical & Engineering Plausibility Standards

For physics and engineering contexts:
1. **Sensible Magnitudes**: Negative absolute temperatures, negative mass, or unrealistic velocities are rejected by parameter schema constraints.
2. **Unit Homogeneity**: Derivatives in kinematic or engineering contexts carry validated physical units (e.g. $\text{m/s}$, $\text{m/s}^2$).
3. **Explicit Assumptions**: All physical word problems provide clear boundary context without contradictory prose.
