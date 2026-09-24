# Authoritative Prerequisite Graph & Dependency Audit

**Engineering Practice Engine — Prerequisite Verification Report**  
**Document Revision**: 2.5.0  
**Phase**: PHASE 2.5 — FINAL LEARNING ONTOLOGY AUDIT  
**Date**: August 28, 2026  
**Total Audited Directed Edges**: 108  
**Acyclicity Status**: 0 Cycles (100% Verified Directed Acyclic Graph)  

---

## 1. Prerequisite Classification Standards

To prevent arbitrary or overly restrictive blocking:
* **`REQUIRED`**: Hard pedagogical blocker. A student cannot perform the downstream skill without this prior competency (e.g. *Order of Operations* $\rightarrow$ *Fractions*, *Power Rule* $\rightarrow$ *Product Rule*, *Separation of Variables* $\rightarrow$ *Homogeneous ODEs*).
* **`RECOMMENDED`**: Pedagogical benefit. Provides strong conceptual support or common algebraic grounding but can be bypassed if the student is already proficient (e.g. *Right Triangles* $\rightarrow$ *Oblique Triangles*).

### Evidence Standards:
* **`EXPLICIT`**: Directly mandated by course sequencing or stated syllabus prerequisites.
* **`STRONGLY_INFERRED`**: Mathematically and structurally required by the symbolic transformation rules of the domain.
* **`WEAKLY_INFERRED`**: Pedagogically helpful background.

---

## 2. Cross-Course Prerequisite Boundaries

| Source Course | Target Course | Key Linking Skills | Strength | Evidence | Pedagogical Justification |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `GEN 0101` (Math for Eng) | `GEN 0102` (Calculus 1) | Factoring & Exponents $\rightarrow$ Limits & Power Rule | `REQUIRED` | `STRONGLY_INFERRED` | 0/0 limit evaluation and power derivative manipulation require algebraic factoring and exponent rules. |
| `GEN 0101` (Math for Eng) | `GEN 0102` (Calculus 1) | Straight Line Equations $\rightarrow$ Tangent/Normal Lines | `REQUIRED` | `EXPLICIT` | Slope-intercept ($y = mx + b$) and point-slope equations are needed to write tangent lines. |
| `GEN 0102` (Calculus 1) | `GEN 0107` (Diff Equations) | Implicit Diff $\rightarrow$ Constant Elimination | `REQUIRED` | `EXPLICIT` | Formulating ODEs requires differentiating multi-variable implicit families. |
| `GEN 0102` (Calculus 1) | `GEN 0107` (Diff Equations) | Partial Diff $\rightarrow$ Exact Differential Equations | `REQUIRED` | `STRONGLY_INFERRED` | Exactness condition $\frac{\partial M}{\partial y} = \frac{\partial N}{\partial x}$ directly computes partial derivatives. |
| `GEN 0102` (Calculus 1) | `GEN 0107` (Diff Equations) | Higher-Order Derivs $\rightarrow$ Laplace IVPs | `REQUIRED` | `STRONGLY_INFERRED` | Transforming $\mathcal{L}\{y''\} = s^2 Y(s) - sy(0) - y'(0)$ requires higher derivative concepts. |
| `GEN 0101` (Math for Eng) | `GEN 0110` (Physics 2) | Real Arithmetic $\rightarrow$ Fluids, Heat Transfer, Expansion | `REQUIRED` | `STRONGLY_INFERRED` | Numerical formula substitution and unit calculations in fluid and thermal physics. |
| `GEN 0101` (Math for Eng) | `GEN 0110` (Physics 2) | Linear Systems $\rightarrow$ Multi-Loop DC Circuits | `REQUIRED` | `STRONGLY_INFERRED` | Multi-loop Kirchhoff circuit equations form $2\times 2$ and $3\times 3$ simultaneous linear systems. |
| `GEN 0101` (Math for Eng) | `GEN 0161` (Thermodynamics) | Formula Transposition $\rightarrow$ Ideal Gas Equation ($PV=mRT$) | `REQUIRED` | `STRONGLY_INFERRED` | Rearranging equations of state to isolate mass, specific volume, or temperature. |
| `GEN 0161` (Thermodynamics) | `GEN 0161` (Thermodynamics) | 1st Law Energy Balance $\rightarrow$ Ideal Gas Processes $\rightarrow$ Rankine Cycle | `REQUIRED` | `EXPLICIT` | Closed system energy balances are foundational to individual process equations and heat engine cycles. |

---

## 3. Prerequisite Graph Traversal Metrics

```text
Total Skills (Graph Nodes)          : 71
Total Directed Prerequisite Edges   : 108
Graph Cycles Detected               : 0
Strongly Connected Components (SCC) : 71 (All individual nodes)
Max Dependency Depth (Critical Path): 6 levels
Foundational Root Skills (In-Degree = 0) : 2 (SKILL-GEN0101-001, SKILL-GEN0161-001)
Terminal Outcome Skills (Out-Degree = 0) : 18
```
