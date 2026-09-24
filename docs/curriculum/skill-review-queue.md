# Prioritized Skill & Provenance Review Queue

**Engineering Practice Engine — Curriculum & Ontology Human Decision Alignment**  
**Document Revision**: 2.5.0  
**Phase**: PHASE 2.5 — FINAL LEARNING ONTOLOGY AUDIT  
**Date**: August 28, 2026  

---

## 1. High-Priority Review Items (Departmental / Cross-Course Alignment)

| Item ID | Course / Scope | Target Skill / Mapping | Core Pedagogical Question | Current Audited Decision | Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`SKILL-REV-001`** | `GEN 0102` (Calculus 1) | `SKILL-GEN0102-002` (Power Rule) | Syllabus groups Product, Quotient, and Chain rules under "Analysis of Calculus Methods" but leaves the foundational Power Rule implicit. | Classify as `SYLLABUS_DERIVED` and maintain as a primary prerequisite for Product, Quotient, and Chain rules. | `HIGH` | **APPROVED** |
| **`SKILL-REV-002`** | `GEN 0110` vs `GEN 0161` | `SKILL-GEN0110-002` vs `SKILL-GEN0161-002` | Physics 2 covers empirical heat transfer rates ($H = kA\Delta T/L$), whereas Thermodynamics covers control-mass First Law state balances. Should they share a single concept? | Classify in canonical dictionary as `DO_NOT_MERGE`. Keep physics rate equations distinct from thermodynamic state postulates. | `HIGH` | **APPROVED** |
| **`SKILL-REV-003`** | `GEN 0102` vs `GEN 0107` | `SKILL-GEN0102-009` $\rightarrow$ `SKILL-GEN0107-002` | Does formulating ODEs by eliminating arbitrary constants depend on Calculus implicit differentiation? | Yes. Classify as `PREREQUISITE` (`REQUIRED`). Differentiating multi-parameter curve families requires implicit differentiation techniques. | `HIGH` | **APPROVED** |
| **`SKILL-REV-004`** | `GEN 0102` vs `GEN 0107` | `SKILL-GEN0102-010` $\rightarrow$ `SKILL-GEN0107-005` | Does exact differential equation solving depend on partial derivatives? | Yes. Classify as `REQUIRED` prerequisite linking multivariable partial differentiation to exactness condition testing ($\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$). | `HIGH` | **APPROVED** |

---

## 2. Medium-Priority Review Items (Course-Specific Scoping)

| Item ID | Course / Scope | Target Skill / Mapping | Core Pedagogical Question | Current Audited Decision | Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`SKILL-REV-005`** | `GEN 0101` vs `BSIE 3219` | `SKILL-GEN0101-007` vs `SKILL-BSIE3219-001` | Word problems (Age, Work, Mixture, Rate) appear in both foundational math and IE licensure review. | Map as `EXACT_MATCH` in canonical dictionary (`SKILL-DICT-009`) while maintaining distinct course parent IDs for syllabus traceability. | `MEDIUM` | **APPROVED** |
| **`SKILL-REV-006`** | `GEN 0107` (ODE) | `SKILL-GEN0107-009` to `011` | Laplace transforms in Unit 3 cover IVPs, simultaneous systems, and inverse transforms. | Structured into 3 sequential skills: Forward IVP transform $\rightarrow$ Coupled $2\times 2$ systems $\rightarrow$ Inverse transform decomposition. | `MEDIUM` | **APPROVED** |
| **`SKILL-REV-007`** | `BSIE 3219` (IE Topics) | `SKILL-BSIE3219-005` (Definite Integrals) | Contains Integral Calculus plane areas and volumes of revolution without a standalone Integral Calculus syllabus provided. | Retain as `COURSE_SPECIFIC` licensure review module under `BSIE 3219` without fabricating an unprovided syllabus. | `MEDIUM` | **APPROVED** |
| **`SKILL-REV-008`** | `BSIE 3219` (IE Topics) | `SKILL-BSIE3219-006` to `009` | Industrial Engineering Economy module includes compound interest, annuities, breakeven, depreciation, and B/C evaluation. | Structure as a clean 4-tier prerequisite sequence: Compound Interest $\rightarrow$ Annuities/Breakeven $\rightarrow$ Depreciation $\rightarrow$ Capital Recovery & B/C. | `MEDIUM` | **APPROVED** |
| **`SKILL-REV-009`** | `GEN 0161` (Thermo) | `SKILL-GEN0161-005` (Steam Tables) | Evaluating pure substances requires table interpolation and vapor quality $x = \frac{y - y_f}{y_{fg}}$. | Define as `INTERPRETATION` skill supporting table lookups, phase determination, and linear interpolation. | `MEDIUM` | **APPROVED** |

---

## 3. Low-Priority Review Items (Refinements & Context Notes)

| Item ID | Course / Scope | Target Skill / Mapping | Core Pedagogical Question | Current Audited Decision | Priority | Status |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **`SKILL-REV-010`** | `GEN 0110` (Physics 2) | `SKILL-GEN0110-008` (DC/AC Circuits) | Syllabus mentions "Electricity (DC and AC circuits)". AC complex impedance relies on complex numbers. | Focus Physics 2 skill on DC resistor networks and Kirchhoff's loop laws, linking complex phasor methods to `BSIE 3219`. | `LOW` | **APPROVED** |
