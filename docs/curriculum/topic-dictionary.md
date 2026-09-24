# Canonical Topic Dictionary

**Engineering Practice Engine — Cross-Syllabus Reconciliation**  
**Document Revision**: 1.0.0  
**Date**: August 28, 2026  
**Status**: CANONICAL ALIGNMENT DICTIONARY  

---

## 1. Overview

The Canonical Topic Dictionary maps and reconciles shared mathematical, physical, and engineering concepts across the six syllabi without prematurely erasing course-specific pedagogical context or over-merging foundational vs. review courses.

### Relationship Classification Taxonomy
- **`EXACT_MATCH`**: Identical conceptual scope and mathematical depth.
- **`NORMALIZED_MATCH`**: Substantially identical concepts with minor naming/lexical variations.
- **`RELATED`**: Concepts share mathematical principles but differ in scope, emphasis, or prerequisite depth (e.g., first-exposure calculus vs. licensure review).
- **`PREREQUISITE`**: Concept in Course A serves as a foundational prerequisite for Course B.
- **`COURSE_SPECIFIC`**: Unique to a single syllabus domain (e.g., Laplace transforms in DE, Rankine cycles in Thermo).
- **`DO_NOT_MERGE`**: Explicitly separated to prevent confounding distinct instructional objectives (e.g., Physics Heat Transfer vs. Mechanical Engineering Thermodynamics).

---

## 2. Topic Dictionary Entries

### TOP-DICT-001: Limits and Continuity
- **Canonical Concept**: Limits of Functions, Algebraic Evaluation & Continuity
- **Mapped Course Placements**:
  - `GEN 0102` (Calculus 1): Unit I, Topics 2 & 3 (`CURR-GEN0102-U1-T02`, `CURR-GEN0102-U1-T03`) — *Foundational derivation & algebraic limit techniques*.
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 6 (`CURR-BSIE3219-U2-T06`) — *Subtopic: Limits of a Function (Licensure review)*.
- **Cross-Course Relationship**: `RELATED`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT` (Linked to shared conceptual tag `limits_foundations`).
- **Notes**: Calculus 1 teaches limits from foundational principles across 6 contact hours; BSIE 3219 reviews limits within a 5-hour comprehensive calculus block.

### TOP-DICT-002: Differentiation Rules & Techniques
- **Canonical Concept**: Differentiation of Algebraic, Trigonometric, and Transcendental Functions
- **Mapped Course Placements**:
  - `GEN 0102` (Calculus 1): Unit I, Topic 4; Unit II, Topics 5, 6, 7 (`CURR-GEN0102-U1-T04`, `CURR-GEN0102-U2-T05`, `CURR-GEN0102-U2-T06`, `CURR-GEN0102-U2-T07`).
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 6 (`CURR-BSIE3219-U2-T06`) — *Subtopic: Differentiation Formulas*.
- **Cross-Course Relationship**: `NORMALIZED_MATCH` / `RELATED`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: Core algebraic derivative rules (Power, Product, Quotient, Chain) are identical; GEN 0102 dedicates individual topics to inverse trigonometric and hyperbolic derivatives.

### TOP-DICT-003: Implicit Differentiation
- **Canonical Concept**: Implicit Differentiation of Multivariable Relations $F(x,y)=0$
- **Mapped Course Placements**:
  - `GEN 0102` (Calculus 1): Unit II, Topic 8 (`CURR-GEN0102-U2-T08`).
  - `GEN 0107` (Differential Equations): Unit I, Topic 2 (`CURR-GEN0107-U1-T02`) — *Prerequisite tool for eliminating arbitrary constants*.
- **Cross-Course Relationship**: `PREREQUISITE`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: In Calculus 1, implicit differentiation is taught for finding tangent slopes $dy/dx$; in Differential Equations, it is an essential algebraic skill to generate ODEs from parameter families.

### TOP-DICT-004: Partial Differentiation
- **Canonical Concept**: First-Order Partial Derivatives for Functions of Several Variables
- **Mapped Course Placements**:
  - `GEN 0102` (Calculus 1): Unit II, Topic 9 (`CURR-GEN0102-U2-T09`).
  - `GEN 0107` (Differential Equations): Unit II, Topic 5 (`CURR-GEN0107-U2-T05`) — *Exact differential equations exactness test $\partial M/\partial y = \partial N/\partial x$*.
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 6 (`CURR-BSIE3219-U2-T06`) — *Subtopic: Partial Differentiation*.
- **Cross-Course Relationship**: `NORMALIZED_MATCH`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: Shared mathematical operation across multivariable calculus, DE exactness verification, and licensure review.

### TOP-DICT-005: Maxima, Minima, and Optimization
- **Canonical Concept**: Critical Points, Extrema, and Optimization Modeling
- **Mapped Course Placements**:
  - `GEN 0102` (Calculus 1): Unit III, Topic 13 (`CURR-GEN0102-U3-T13`).
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 6 (`CURR-BSIE3219-U2-T06`) — *Subtopic: Maxima/Minima*.
- **Cross-Course Relationship**: `EXACT_MATCH`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: Optimization word problems (maximizing volume, minimizing material, economic efficiency) share identical underlying differential calculus techniques.

### TOP-DICT-006: Related Rates / Time Rates
- **Canonical Concept**: Related Rates of Change in Geometric and Physical Systems
- **Mapped Course Placements**:
  - `GEN 0102` (Calculus 1): Unit III, Topic 13 (`CURR-GEN0102-U3-T13`).
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 6 (`CURR-BSIE3219-U2-T06`) — *Subtopic: Time Rates*.
- **Cross-Course Relationship**: `EXACT_MATCH`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: Identical physical modeling concept ("Related Rates" in GEN 0102 = "Time Rates" in BSIE 3219).

### TOP-DICT-007: Exponential and Logarithmic Functions & Growth/Decay
- **Canonical Concept**: Logarithms, Exponential Equations, and Growth/Decay Models
- **Mapped Course Placements**:
  - `GEN 0101` (Math for Engineers): Unit II, Topic 10 (`CURR-GEN0101-U2-T10`) — *Algebraic exponential and logarithmic equations*.
  - `GEN 0102` (Calculus 1): Unit II, Topic 7 (`CURR-GEN0102-U2-T07`) — *Differentiation of log/exp functions in growth/decay models*.
  - `GEN 0107` (Differential Equations): Unit II, Topic 8 (`CURR-GEN0107-U2-T08`) — *First-order differential equation modeling of growth and decay*.
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 4 (`CURR-BSIE3219-U2-T04`) — *Trigonometry and Logarithms*.
- **Cross-Course Relationship**: `RELATED` (Algebraic $\rightarrow$ Differential $\rightarrow$ ODE progression).
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: Demonstrates the natural pedagogical progression across the curriculum from pure algebraic manipulation to calculus and dynamical modeling.

### TOP-DICT-008: Applied Word Problems (Algebraic)
- **Canonical Concept**: Age, Work, Rate/Distance, Mixture, Clock Problems
- **Mapped Course Placements**:
  - `GEN 0101` (Math for Engineers): Unit I, Topic 6 (`CURR-GEN0101-U1-T06`).
  - `BSIE 3219` (IE Special Topics 1): Unit I, Topic 2 (`CURR-BSIE3219-U1-T02`) — *Word Problems involving Numbers, Rates, Work, Age, Mixtures, Clocks, Geometry, and Investments*.
- **Cross-Course Relationship**: `EXACT_MATCH`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: Exact subtopic overlap between GEN 0101 foundational engineering math and BSIE 3219 review.

### TOP-DICT-009: Coordinate Geometry and Straight Lines
- **Canonical Concept**: Cartesian Plane, Distance, Midpoint, Slope, Line Equations
- **Mapped Course Placements**:
  - `GEN 0101` (Math for Engineers): Unit III, Topics 11 & 12 (`CURR-GEN0101-U3-T11`, `CURR-GEN0101-U3-T12`).
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topics 4 & 5 (`CURR-BSIE3219-U2-T04`, `CURR-BSIE3219-U2-T05`).
- **Cross-Course Relationship**: `EXACT_MATCH`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: Identical coordinate geometry foundations (slope-intercept, point-slope, distance formula, parallel/perpendicular lines).

### TOP-DICT-010: Conic Sections
- **Canonical Concept**: Circles, Parabolas, Ellipses, Hyperbolas, Axis Transformation
- **Mapped Course Placements**:
  - `GEN 0101` (Math for Engineers): Course Description explicitly includes Conic Sections.
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 5 (`CURR-BSIE3219-U2-T05`) — *Straight Lines, Circles, Parabolas, Ellipses, Hyperbolas, Inclined Axes*.
- **Cross-Course Relationship**: `EXACT_MATCH`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`

### TOP-DICT-011: Trigonometry, Right Triangles, and Oblique Triangles
- **Canonical Concept**: Trigonometric Ratios, Right Triangle Solutions, Sine and Cosine Laws
- **Mapped Course Placements**:
  - `GEN 0101` (Math for Engineers): Unit III, Topics 13, 14, 15 (`CURR-GEN0101-U3-T13`, `CURR-GEN0101-U3-T14`, `CURR-GEN0101-U3-T15`).
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 4 (`CURR-BSIE3219-U2-T04`).
- **Cross-Course Relationship**: `EXACT_MATCH`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`

### TOP-DICT-012: Plane Areas and Mensuration of Solids
- **Canonical Concept**: Geometric Areas of Polygons/Circles and Volumes of Solid Shapes
- **Mapped Course Placements**:
  - `GEN 0101` (Math for Engineers): Unit III, Topic 16 (`CURR-GEN0101-U3-T16`).
  - `BSIE 3219` (IE Special Topics 1): Unit II, Topic 4 (`CURR-BSIE3219-U2-T04`).
- **Cross-Course Relationship**: `EXACT_MATCH`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`

### TOP-DICT-013: Heat Transfer & Thermal Expansion (Physics vs. Thermodynamics)
- **Canonical Concept**: Heat Conduction/Convection/Radiation, Calorimetry, Thermal Expansion
- **Mapped Course Placements**:
  - `GEN 0110` (Physics 2): Unit I, Topics 2, 3, 4 (`CURR-GEN0110-U1-T02`, `CURR-GEN0110-U1-T03`, `CURR-GEN0110-U1-T04`) — *Empirical physics, linear/volumetric expansion, calorimetry*.
  - `GEN 0161` (Thermodynamics): Unit I, Topics 2 & 3; Unit II, Topic 6 (`CURR-GEN0161-U1-T02`, `CURR-GEN0161-U1-T03`, `CURR-GEN0161-U2-T06`) — *Macroscopic state postulates, open/closed control volume energy balances, phase change steam tables*.
- **Cross-Course Relationship**: `DO_NOT_MERGE`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
- **Notes**: While physics and thermodynamics both deal with heat and thermal energy, the formal engineering frameworks, equations, and property tables differ significantly in pedagogical purpose.

### TOP-DICT-014: Integral Calculus & Solid Volumes
- **Canonical Concept**: Indefinite/Definite Integrals, Plane Areas, and Volumes of Revolution
- **Mapped Course Placements**:
  - `BSIE 3219` (IE Special Topics 1): Unit III, Topic 7 (`CURR-BSIE3219-U3-T07`).
  - *Prerequisite context for GEN 0107 and GEN 0161*.
- **Cross-Course Relationship**: `COURSE_SPECIFIC` / `PREREQUISITE`
- **Merge Status**: `KEEP_DISTINCT_PLACEMENT`
