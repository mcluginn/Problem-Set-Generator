# Adaptive Learning & Student Progression QA Report

## Overview
Phase 7 refined the Adaptive Learning Loop UX to ensure all recommendations are explainable in plain English, with intuitive mastery tiers and direct student controls.

---

## 1. Mastery Tiers vs Raw Numbers

| Mastery Tier | Threshold | Badge Color | Meaning |
| :--- | :--- | :--- | :--- |
| **Getting Started** | $0\% - 44\%$ | Slate | Building initial familiarity with core rules and formulas. |
| **Developing** | $45\% - 74\%$ | Amber | Working through multi-step applications and composite rules. |
| **Strong** | $\ge 75\%$ | Emerald | Demonstrating independent, multi-step problem solving. |

---

## 2. Explainable Recommendation Reasons

Students always understand why a specific problem is suggested:
- *"Recommended because you recently struggled with recognizing the Chain Rule."*
- *"Recommended because you solved the last problem independently (+10%), increasing the challenge slightly."*
- *"Recommended because this foundational prerequisite reinforces your upcoming topics."*

---

## 3. Student Adaptive Control Toolbar

Students are not trapped in a fixed track:
- **Easier**: Selects foundational difficulty ($D=1$).
- **Harder**: Selects challenge difficulty ($D=3$).
- **Another Like This**: Repeats practice on the current skill with a new problem instance.
- **Review**: Revisits earlier prerequisites.
