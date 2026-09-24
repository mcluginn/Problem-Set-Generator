# Cross-Course Canonical Skill Dictionary

**Engineering Practice Engine — Multi-Course Competency Reconciliations**  
**Document Revision**: 1.0.0  
**Date**: August 28, 2026  

---

## 1. Classification Types

To prevent premature or over-aggressive merging across different course domains:
* **`EXACT_MATCH`**: Identical mathematical capability tested across different courses.
* **`NORMALIZED_MATCH`**: Functionally equivalent competence described with slight differences in wording or scope.
* **`RELATED`**: Concepts sharing a common theoretical root but applied at different levels of mathematical maturity.
* **`PREREQUISITE`**: A competence in an earlier course serving as the direct mathematical tool in a downstream course.
* **`COURSE_SPECIFIC`**: Unique to a specific discipline or course module (e.g. Engineering Economy in BSIE 3219).
* **`DO_NOT_MERGE`**: Conceptually distinct frameworks that share keywords (e.g. Physics Heat Transfer vs. Control-Volume Thermodynamics).

---

## 2. Canonical Skill Mapping Table

| Dictionary ID | Canonical Concept | Relationship | Mapped Skill IDs | Instructional Rationale |
| :--- | :--- | :---: | :--- | :--- |
| **`SKILL-DICT-001`** | Differentiate polynomial, radical, and rational power functions using the Power Rule | `EXACT_MATCH` | `SKILL-GEN0102-002`, `SKILL-GEN0107-003`, `SKILL-BSIE3219-005` | Foundational power differentiation rule applied in Calculus 1, Differential Equations, and IE Licensure Review. |
| **`SKILL-DICT-002`** | Differentiate composite functions using the Chain Rule | `EXACT_MATCH` | `SKILL-GEN0102-005`, `SKILL-GEN0107-007` | Core composite derivative rule in Calculus 1 and Bernoulli ODE transformation in Differential Equations. |
| **`SKILL-DICT-003`** | Differentiate implicit bivariate relations | `PREREQUISITE` | `SKILL-GEN0102-009`, `SKILL-GEN0107-002` | Implicit differentiation in Calculus 1 provides the mathematical technique for arbitrary constant elimination in Differential Equations. |
| **`SKILL-DICT-004`** | Evaluate first-order partial derivatives | `NORMALIZED_MATCH` | `SKILL-GEN0102-010`, `SKILL-GEN0107-005` | Multivariable rate calculation in Calculus 1 and exactness testing ($\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$) in Differential Equations. |
| **`SKILL-DICT-005`** | Solve single-variable quadratic equations | `EXACT_MATCH` | `SKILL-GEN0101-008`, `SKILL-BSIE3219-002`, `SKILL-BSIE3219-004` | Standard quadratic solving, complex root extraction, and conic section completing-the-square. |
| **`SKILL-DICT-006`** | Solve linear systems of equations | `EXACT_MATCH` | `SKILL-GEN0101-009`, `SKILL-GEN0110-008`, `SKILL-BSIE3219-001` | Algebraic substitution/elimination in Math for Engineers, Kirchhoff circuit laws in Physics, and matrix determinants in IE. |
| **`SKILL-DICT-007`** | Solve right-triangle and oblique-triangle trigonometry | `EXACT_MATCH` | `SKILL-GEN0101-013`, `SKILL-GEN0101-015`, `SKILL-GEN0110-007`, `SKILL-BSIE3219-010` | Fundamental triangle trigonometry used in geometry, physics 2D force vectors, and engineering mechanics statics. |
| **`SKILL-DICT-008`** | Solve exponential and logarithmic algebraic equations | `RELATED` | `SKILL-GEN0101-011`, `SKILL-GEN0102-008`, `SKILL-GEN0107-006`, `SKILL-BSIE3219-006` | Algebraic log equations in GEN 0101, logarithmic differentiation in GEN 0102, integrating factors in GEN 0107, and compound interest in BSIE 3219. |
| **`SKILL-DICT-009`** | Formulate applied algebraic word problems (Mixture, Rate, Work) | `EXACT_MATCH` | `SKILL-GEN0101-007`, `SKILL-GEN0107-008` | Translating verbal rate scenarios into equations: algebraic balances in GEN 0101 vs differential rate balances in GEN 0107. |
| **`SKILL-DICT-010`** | Formulate equations of straight lines and perpendicular relationships | `EXACT_MATCH` | `SKILL-GEN0101-017`, `SKILL-GEN0102-012` | Cartesian straight lines in algebra/geometry and tangent/normal line equations in calculus. |
| **`SKILL-DICT-011`** | Thermal energy transfer and heat balances | `DO_NOT_MERGE` | `SKILL-GEN0110-002`, `SKILL-GEN0110-003`, `SKILL-GEN0161-002` | Physics conduction/convection/radiation rate mechanisms are kept distinct from macroscopic control-mass First Law thermodynamics. |
| **`SKILL-DICT-012`** | Definite integration and plane area calculations | `COURSE_SPECIFIC` | `SKILL-BSIE3219-005` | Integral Calculus module specific to IE licensure review course (BSIE 3219). |
| **`SKILL-DICT-013`** | Perform economic evaluation and compound interest cash flow analysis | `COURSE_SPECIFIC` | `SKILL-BSIE3219-006`, `SKILL-BSIE3219-007`, `SKILL-BSIE3219-008`, `SKILL-BSIE3219-009` | Industrial Engineering Economy module specific to BSIE 3219. |
| **`SKILL-DICT-014`** | Solve initial value problems using Laplace transform methods | `COURSE_SPECIFIC` | `SKILL-GEN0107-009`, `SKILL-GEN0107-010`, `SKILL-GEN0107-011` | Higher-order linear initial value differential equations specific to GEN 0107. |
