# Existing Differential Calculus vs. Authoritative Syllabus Coverage

**Engineering Practice Engine — Curriculum Reconciliation**  
**Document Revision**: 1.0.0  
**Date**: August 28, 2026  
**Status**: RECONCILED  

---

## 1. Executive Summary

This document performs a line-by-line reconciliation between the existing v1.0.0 Differential Calculus implementation (14 concepts) and the official `GEN 0102: Calculus 1` course syllabus.

---

## 2. Detailed Alignment Matrix

| Existing Concept in App | Existing Family ID | Official Syllabus Topic | Unit / Period | Status | Notes |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Constant Rule** | `CONSTANT_DIRECT` | `Topic 4: Analysis of Calculus Methods` | Unit I (Prelim) | **ALIGNED** | Atomic pedagogical subdivision of general differentiation rules. |
| **Constant Multiple Rule** | `CONSTANT_MULTIPLE` | `Topic 4: Analysis of Calculus Methods` | Unit I (Prelim) | **ALIGNED** | Atomic pedagogical subdivision. |
| **Sum Rule** | `SUM_POLY` | `Topic 4: Analysis of Calculus Methods` | Unit I (Prelim) | **ALIGNED** | Atomic pedagogical subdivision. |
| **Difference Rule** | `DIFFERENCE_POLY` | `Topic 4: Analysis of Calculus Methods` | Unit I (Prelim) | **ALIGNED** | Atomic pedagogical subdivision. |
| **Power Rule** | `POWER_POLYNOMIAL`, `POWER_FRACTIONAL_NEGATIVE` | `Topic 4: Analysis of Calculus Methods` | Unit I (Prelim) | **ALIGNED** | Core algebraic differentiation rule. |
| **Product Rule** | `PRODUCT_POLY_TRIG`, `PRODUCT_POLY_EXP` | `Topic 4: Analysis of Calculus Methods` | Unit I (Prelim) | **ALIGNED** | Explicitly required by LLO 3 in source. |
| **Quotient Rule** | `QUOTIENT_POLY_POLY`, `QUOTIENT_TRIG_POLY` | `Topic 4: Analysis of Calculus Methods` | Unit I (Prelim) | **ALIGNED** | Explicitly required by LLO 3 in source. |
| **Chain Rule** | `CHAIN_POWER_POLYNOMIAL`, `CHAIN_TRIG_INNER`, `CHAIN_KINEMATICS` | `Topic 4: Analysis of Calculus Methods` | Unit I (Prelim) | **ALIGNED** | Explicitly required by LLO 3 in source. |
| **Trigonometric Derivatives** | `TRIG_STANDARD` | `Topic 4: Analysis of Calculus Methods` & Course Desc | Unit I (Prelim) | **ALIGNED** | Explicitly required by Course Description. |
| **Exponential Derivatives** | `EXP_STANDARD` | `Topic 7: Derivatives of Logarithmic and Exponential Functions` | Unit II (Midterm) | **ALIGNED** | Explicitly required by Topic 7 & LLO 6. |
| **Logarithmic Derivatives** | `LOG_STANDARD` | `Topic 7: Derivatives of Logarithmic and Exponential Functions` | Unit II (Midterm) | **ALIGNED** | Explicitly required by Topic 7 & LLO 6. |
| **Implicit Differentiation** | `IMPLICIT_CONIC`, `IMPLICIT_PRODUCT` | `Topic 8: Implicit Differentiation` | Unit II (Midterm) | **ALIGNED** | Explicitly required by Topic 8 & LLO 8. |
| **Higher-Order Derivatives** | `HIGHER_ORDER_POLY` | `Topic 10: Higher order derivatives` | Unit II (Midterm) | **ALIGNED** | Explicitly required by Topic 10 & LLO 10. |
| **Basic Applications of Derivatives** | `APP_TANGENT_SLOPE`, `APP_KINEMATICS` | `Topic 11: The slope` & `Topic 13: Applications of the Derivative` | Unit III (Final) | **ALIGNED** | Partial coverage of Tangent Slope and Rate of Change. |

---

## 3. Syllabus Coverage Analysis

### 3.1 Already Implemented in Current App (14/14 Concepts Maintained)
All 14 current concept generators are directly supported by `GEN 0102: Calculus 1`. None are extraneous or invalid.

### 3.2 Syllabus Topics Not Yet Implemented (Future Roadmap Items)
The following topics from `GEN 0102` are in the official syllabus but have not yet been built into problem generators:
1. **`CURR-GEN0102-U1-T01`**: Introduction to Calculus (Orientation)
2. **`CURR-GEN0102-U1-T02`**: Limits & Continuity Concepts (Definition of limit & derivative)
3. **`CURR-GEN0102-U1-T03`**: Evaluating Limits (Algebraic limit evaluation)
4. **`CURR-GEN0102-U2-T05`**: Derivatives of Inverse Trigonometric Functions (arcsin, arccos, arctan, etc.)
5. **`CURR-GEN0102-U2-T06`**: Derivatives of Hyperbolic Functions (sinh, cosh, tanh, etc.)
6. **`CURR-GEN0102-U2-T09`**: Partial Differentiation ($\partial f/\partial x, \partial f/\partial y$)
7. **`CURR-GEN0102-U3-T12`**: Polynomial Curves (Curve sketching, critical points, concavity)
8. **`CURR-GEN0102-U3-T13`**: Advanced Optimization & Related Rates (Full physical modeling problems)

---

## 4. Policy for Existing Content
**Directive**: Existing content will **NOT** be deleted. The 14 concepts remain fully functional and are mapped to their respective units in the master curriculum registry.
