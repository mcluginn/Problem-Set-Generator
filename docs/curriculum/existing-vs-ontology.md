# Existing Differential Calculus Engine vs. Learning Ontology Reconciliation

**Engineering Practice Engine — Concept to Skill Alignment Report**  
**Document Revision**: 1.0.0  
**Date**: August 28, 2026  

---

## 1. Overview of Existing v1.0.0 Differential Calculus Concepts

The existing Engineering Practice Engine v1.0.0 contains **14 verified concept generators** in `src/engine/generation/generator.ts`.

Below is the line-by-line reconciliation of each existing concept against the new Authoritative Learning Skills Ontology under `GEN 0102: Calculus 1`:

---

## 2. Concept-to-Skill Mapping Matrix

| Existing Generator Concept ID | Concept Name | Ontology Skill Mapping | Skill Type | Source Type | Status & Relationship |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `POWER_RULE` | Power Rule | `SKILL-GEN0102-002` | `PROCEDURAL` | `SYLLABUS_DERIVED` | **MATCH**: 1-to-1 correspondence with polynomial, radical, and rational power differentiation. |
| `PRODUCT_RULE` | Product Rule | `SKILL-GEN0102-003` | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with multi-factor algebraic and trigonometric products. |
| `QUOTIENT_RULE` | Quotient Rule | `SKILL-GEN0102-004` | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with rational and fractional derivatives. |
| `CHAIN_RULE` | Chain Rule | `SKILL-GEN0102-005` | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with composite function differentiation. |
| `TRIG_DERIVATIVES` | Basic Trigonometric Derivatives | `SKILL-GEN0102-003`, `005` | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | **MATCH**: Embedded in Product, Quotient, and Chain rule differentiation. |
| `EXP_LOG_DERIVATIVES` | Exponential and Logarithmic Derivatives | `SKILL-GEN0102-008` | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with $\ln(u)$ and $e^u$ differentiation. |
| `IMPLICIT_DIFF` | Implicit Differentiation | `SKILL-GEN0102-009` | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with bivariate relations $F(x, y) = 0$. |
| `HIGHER_ORDER_DERIVATIVES` | Higher-Order Derivatives | `SKILL-GEN0102-011` | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with successive derivatives $f'', f'''$. |
| `TANGENT_NORMAL_LINES` | Tangent and Normal Lines | `SKILL-GEN0102-012` | `APPLICATION` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with slope evaluation $m = f'(x_0)$ and line equations. |
| `CRITICAL_POINTS` | Critical Points & First Derivative Test | `SKILL-GEN0102-013` | `REASONING` | `SYLLABUS_EXPLICIT` | **MATCH**: Subtopic of polynomial curves ($f'(x) = 0$). |
| `CONCAVITY_INFLECTION` | Concavity and Inflection Points | `SKILL-GEN0102-013` | `REASONING` | `SYLLABUS_EXPLICIT` | **MATCH**: Subtopic of polynomial curves ($f''(x) > 0 / f''(x) < 0$). |
| `OPTIMIZATION_MAX_MIN` | Applied Maxima and Minima | `SKILL-GEN0102-014` | `MODELING` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with engineering optimization modeling. |
| `RELATED_RATES` | Related Rates of Change | `SKILL-GEN0102-015` | `MODELING` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with geometric and physical related rates. |
| `INVERSE_TRIG_DERIVATIVES` | Inverse Trigonometric Derivatives | `SKILL-GEN0102-006` | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | **MATCH**: 1-to-1 correspondence with $\arctan(u)$ and $\arcsin(u)$ derivatives. |

---

## 3. Preservation Guarantee

* **Zero existing generators are invalid or extraneous.**
* **Zero existing engine files were broken or deleted.**
* The current 14 concept generators directly satisfy key skills in `GEN 0102: Calculus 1`.
* In Phase 3 (Problem Families & Generator Expansion), the problem generator will be able to query the curriculum registry directly by `Skill ID` to generate problems for any course in the ontology.
