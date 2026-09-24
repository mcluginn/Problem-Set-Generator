# Problem Family Architecture & Pedagogical Registry

**Engineering Practice Engine — Problem Family Design Framework**  
**Document Revision**: 3.0.0  
**Phase**: PHASE 3 — ASSESSMENT EVIDENCE → PROBLEM FAMILIES → VERIFIED GENERATION  
**Date**: August 28, 2026  
**Status**: ACTIVE & AUTHORITATIVE  

---

## 1. Problem Family Principles

A **Problem Family** defines a reusable pedagogical structure designed to assess a specific target skill across distinct cognitive dimensions.

Every Problem Family must have an explicit educational **purpose** answering:
> **"Why does this family exist, and what cognitive demand does it place on the student?"**

Families vary dimensions such as:
1. **Procedural Execution**: Direct symbolic differentiation under varying degrees of algebraic complexity.
2. **Method Recognition**: Identifying which calculus theorem applies before calculating.
3. **Metacognitive Error Diagnosis**: Locating and explaining flawed transformations in worked student examples.
4. **Physical & Engineering Transfer**: Applying derivatives to kinematic rates, geometry, and optimization.

---

## 2. Chain Rule Vertical Slice (`SKILL-GEN0102-005`) Problem Families

| Family ID | Family Name | Primary Evidence | Representation | Misconception Target | Educational Purpose & Justification |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **`FAM-GEN0102-CHAIN-POLY`** | Composite Polynomial Power Chain Rule | `DIRECT_CALCULATION` | `SYMBOLIC` | `MISSING_INNER_DERIVATIVE` | Assesses whether a student can identify nested polynomial composition and apply $\frac{d}{dx}[u^p] = p u^{p-1} \cdot u'$ without omitting $u'$. |
| **`FAM-GEN0102-CHAIN-TRIG`** | Composite Trigonometric Function Chain Rule | `DIRECT_CALCULATION` | `SYMBOLIC` | `TRIG_SIGN_CONFUSION` | Assesses chaining circular trigonometric outer derivatives with non-linear polynomial arguments ($\sin(ax^2 + c)$). |
| **`FAM-GEN0102-CHAIN-ERROR`** | Chain Rule Misconception Diagnosis | `ERROR_ANALYSIS` | `SYMBOLIC`, `VERBAL` | `MISSING_INNER_DERIVATIVE` | Assesses metacognition by asking students to detect and explain flawed student work containing missing inner derivatives. |
| **`FAM-GEN0102-CHAIN-RECOG`** | Differentiation Rule Discrimination | `METHOD_RECOGNITION` | `SYMBOLIC` | `PRODUCT_VS_CHAIN_CONFUSION` | Assesses whether a student recognizes composite structure vs product vs quotient before beginning calculations. |
| **`FAM-GEN0102-CHAIN-APP`** | Applied Kinematics Rate via Chain Rule | `APPLICATION` | `PHYSICAL`, `VERBAL` | `APP_EVALUATION_BEFORE_DIFF` | Assesses transfer from pure symbolic Chain Rule execution into kinematic physical rate calculation with numerical evaluation. |

---

## 3. Calculus 1 Master Problem Family Catalog

| Family ID | Target Skill ID | Primary Evidence | Context Type | Difficulty Range | Mapped Templates |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `FAM-GEN0102-LIMITS-ALG` | `SKILL-GEN0102-001` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 1 – 3 | `TMPL-LIMIT-POLY-CANCEL` |
| `FAM-GEN0102-POWER-STD` | `SKILL-GEN0102-002` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 1 – 3 | `TMPL-POWER-POLY-STD` |
| `FAM-GEN0102-PRODUCT-STD` | `SKILL-GEN0102-003` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 2 – 4 | `TMPL-PRODUCT-POLY-TRIG` |
| `FAM-GEN0102-QUOTIENT-STD` | `SKILL-GEN0102-004` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 2 – 4 | `TMPL-QUOTIENT-POLY-POLY` |
| `FAM-GEN0102-CHAIN-POLY` | `SKILL-GEN0102-005` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 1 – 4 | `TMPL-CHAIN-POLY-STD`, `TMPL-CHAIN-POLY-RADICAL` |
| `FAM-GEN0102-CHAIN-TRIG` | `SKILL-GEN0102-005` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 2 – 4 | `TMPL-CHAIN-TRIG-POLY` |
| `FAM-GEN0102-CHAIN-ERROR` | `SKILL-GEN0102-005` | `ERROR_ANALYSIS` | `PURE_MATHEMATICS` | 2 – 3 | `TMPL-CHAIN-ERROR-DIAG` |
| `FAM-GEN0102-CHAIN-RECOG` | `SKILL-GEN0102-005` | `METHOD_RECOGNITION` | `PURE_MATHEMATICS` | 1 – 2 | `TMPL-CHAIN-METHOD-RECOG` |
| `FAM-GEN0102-CHAIN-APP` | `SKILL-GEN0102-005` | `APPLICATION` | `PHYSICS`, `ENGINEERING` | 2 – 4 | `TMPL-CHAIN-KINEMATICS-APP` |
| `FAM-GEN0102-INVTRIG-STD` | `SKILL-GEN0102-006` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 2 – 3 | `TMPL-INVTRIG-STD` |
| `FAM-GEN0102-HYPERBOLIC-STD` | `SKILL-GEN0102-007` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 2 – 3 | `TMPL-HYPERBOLIC-STD` |
| `FAM-GEN0102-EXPLOG-STD` | `SKILL-GEN0102-008` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 2 – 4 | `TMPL-EXPLOG-STD` |
| `FAM-GEN0102-IMPLICIT-STD` | `SKILL-GEN0102-009` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 2 – 4 | `TMPL-IMPLICIT-CONIC`, `TMPL-IMPLICIT-PRODUCT` |
| `FAM-GEN0102-PARTIAL-STD` | `SKILL-GEN0102-010` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 2 – 3 | `TMPL-PARTIAL-POLY-2VAR` |
| `FAM-GEN0102-HIGHER-STD` | `SKILL-GEN0102-011` | `DIRECT_CALCULATION` | `PURE_MATHEMATICS` | 1 – 3 | `TMPL-HIGHER-ORDER-POLY` |
| `FAM-GEN0102-TANGENT-APP` | `SKILL-GEN0102-012` | `APPLICATION` | `PURE_MATHEMATICS` | 2 – 4 | `TMPL-TANGENT-LINE-STD` |
| `FAM-GEN0102-CURVES-ANALYSIS`| `SKILL-GEN0102-013`| `CLASSIFICATION` | `PURE_MATHEMATICS` | 2 – 4 | `TMPL-CURVE-CRITICAL-CLASSIFY` |
| `FAM-GEN0102-OPTIMIZE-APP` | `SKILL-GEN0102-014` | `MODELING` | `ENGINEERING`, `WORD_PROBLEM` | 3 – 5 | `TMPL-OPTIMIZE-AREA-FENCING` |
| `FAM-GEN0102-RELATED-RATES`| `SKILL-GEN0102-015` | `MODELING` | `PHYSICS`, `ENGINEERING` | 3 – 5 | `TMPL-RELATED-RATES-LADDER` |
