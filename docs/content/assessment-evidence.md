# Assessment Evidence Taxonomy & Skill Mapping Architecture

**Engineering Practice Engine — Content Architecture Framework**  
**Document Revision**: 3.0.0  
**Phase**: PHASE 3 — ASSESSMENT EVIDENCE → PROBLEM FAMILIES → VERIFIED GENERATION  
**Date**: August 28, 2026  
**Status**: ACTIVE & AUTHORITATIVE  

---

## 1. Pedagogical North Star: Evidence Precedes Problem Families

Problem generation in the Engineering Practice Engine never begins from generic prompts (*"Generate a calculus question"*). It begins from an **audited learning skill** and asks:

> **"What observable student behavior constitutes valid evidence of mastery or weakness in this specific skill?"**

Assessment evidence defines the cognitive performance required to prove understanding, distinct from delivery format or numerical values.

---

## 2. Core Assessment Evidence Taxonomy

| Evidence Type ID | Name | Core Observable Student Behavior | Suitable Skill Types | Supported Formats |
| :--- | :--- | :--- | :--- | :--- |
| **`DIRECT_CALCULATION`** | Direct Symbolic / Numerical Calculation | Computes a verified derivative or numerical value directly using calculus transformation rules. | `CALCULATION`, `PROCEDURAL` | `SYMBOLIC_INPUT`, `NUMERIC_INPUT`, `FREE_RESPONSE` |
| **`METHOD_RECOGNITION`** | Method & Rule Recognition | Identifies the governing theorem or decomposition rule before executing calculation. | `RECOGNITION`, `METHOD_RECOGNITION`, `PROCEDURAL` | `MULTIPLE_CHOICE`, `MATCHING`, `FREE_RESPONSE` |
| **`MULTI_STEP_SOLUTION`** | Multi-Stage Solution Derivation | Carries out multi-stage derivations where sub-goals must be formulated and chained. | `PROCEDURAL`, `APPLICATION`, `MODELING` | `MULTI_STEP`, `FREE_RESPONSE`, `IMAGE_WORK` |
| **`ERROR_ANALYSIS`** | Misconception Diagnosis & Error Analysis | Inspects flawed mathematical derivations, locates the exact incorrect step, and diagnoses the misconception. | `ERROR_ANALYSIS`, `REASONING` | `ERROR_ANALYSIS`, `MULTIPLE_CHOICE`, `FREE_RESPONSE` |
| **`APPLICATION`** | Physical & Engineering Application | Translates applied geometric or kinematic parameters into derivative evaluations. | `APPLICATION`, `MODELING` | `FREE_RESPONSE`, `NUMERIC_INPUT`, `SYMBOLIC_INPUT` |
| **`INTERPRETATION`** | Table & Graphical Interpretation | Extracts coordinates, slopes, or property values from diagrams/tables to evaluate rates. | `INTERPRETATION`, `REASONING` | `MULTIPLE_CHOICE`, `MATCHING`, `NUMERIC_INPUT` |
| **`EXPLANATION`** | Qualitative Mathematical Explanation | Articulates conceptual justifications or conditions in clear technical prose. | `COMMUNICATION`, `REASONING` | `FREE_RESPONSE`, `MULTIPLE_CHOICE` |
| **`GRAPH_READING`** | Graphical Derivative Analysis | Matches curves $f(x)$ with derivative graphs $f'(x)$ based on critical points and slope signs. | `INTERPRETATION`, `RECOGNITION` | `MATCHING`, `MULTIPLE_CHOICE` |
| **`UNIT_ANALYSIS`** | Dimensional & Unit Consistency | Evaluates physical derivative units and verifies dimensional homogeneity. | `APPLICATION`, `CALCULATION` | `NUMERIC_INPUT`, `MULTIPLE_CHOICE` |
| **`MODELING`** | Applied Mathematical Modeling | Constructs objective functions and constraint equations from descriptive scenarios. | `MODELING`, `APPLICATION` | `MULTI_STEP`, `FREE_RESPONSE`, `NUMERIC_INPUT` |
| **`CLASSIFICATION`** | Structural Classification | Categorizes mathematical objects (critical points, concavity, ODE linearity). | `REASONING`, `RECOGNITION` | `MULTIPLE_CHOICE`, `MATCHING` |
| **`COMPARISON`** | Differential Comparison & Sensitivity | Compares rates of change across competing models or ranks error sensitivity. | `REASONING`, `APPLICATION` | `MULTIPLE_CHOICE`, `FREE_RESPONSE` |

---

## 3. Calculus 1 (`GEN 0102`) Skill-to-Evidence Mapping Matrix

| Skill ID | Canonical Skill Name | Primary Evidence | Secondary Evidence Types | Target Formats |
| :--- | :--- | :---: | :--- | :--- |
| `SKILL-GEN0102-001` | Evaluate algebraic limits (0/0 indeterminate) | `DIRECT_CALCULATION` | `METHOD_RECOGNITION`, `ERROR_ANALYSIS`, `MULTI_STEP_SOLUTION` | `NUMERIC_INPUT`, `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-002` | Apply Power Rule to differentiate polynomials | `DIRECT_CALCULATION` | `ERROR_ANALYSIS`, `METHOD_RECOGNITION` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-003` | Apply Product Rule to products of functions | `DIRECT_CALCULATION` | `METHOD_RECOGNITION`, `ERROR_ANALYSIS`, `MULTI_STEP_SOLUTION` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-004` | Apply Quotient Rule to rational expressions | `DIRECT_CALCULATION` | `METHOD_RECOGNITION`, `ERROR_ANALYSIS`, `MULTI_STEP_SOLUTION` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-005` | Apply Chain Rule to composite functions | `DIRECT_CALCULATION` | `METHOD_RECOGNITION`, `ERROR_ANALYSIS`, `APPLICATION`, `MULTI_STEP` | `SYMBOLIC_INPUT`, `ERROR_ANALYSIS`, `NUMERIC_INPUT` |
| `SKILL-GEN0102-006` | Differentiate inverse trigonometric functions | `DIRECT_CALCULATION` | `METHOD_RECOGNITION`, `MULTI_STEP_SOLUTION` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-007` | Differentiate hyperbolic functions | `DIRECT_CALCULATION` | `METHOD_RECOGNITION`, `ERROR_ANALYSIS` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-008` | Differentiate exponential & logarithmic functions | `DIRECT_CALCULATION` | `METHOD_RECOGNITION`, `MULTI_STEP_SOLUTION`, `ERROR_ANALYSIS` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-009` | Perform implicit differentiation on bivariate curves | `DIRECT_CALCULATION` | `MULTI_STEP_SOLUTION`, `ERROR_ANALYSIS`, `APPLICATION` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-010` | Compute first-order partial derivatives | `DIRECT_CALCULATION` | `METHOD_RECOGNITION`, `MULTI_STEP_SOLUTION` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-011` | Calculate higher-order successive derivatives | `DIRECT_CALCULATION` | `APPLICATION`, `MULTI_STEP_SOLUTION`, `UNIT_ANALYSIS` | `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-012` | Find tangent and normal lines to curves | `APPLICATION` | `DIRECT_CALCULATION`, `MULTI_STEP_SOLUTION`, `GRAPH_READING` | `FREE_RESPONSE`, `SYMBOLIC_INPUT` |
| `SKILL-GEN0102-013` | Classify critical points and curve concavity | `CLASSIFICATION` | `INTERPRETATION`, `GRAPH_READING`, `MULTI_STEP_SOLUTION` | `MULTIPLE_CHOICE`, `FREE_RESPONSE` |
| `SKILL-GEN0102-014` | Solve applied optimization (maxima/minima) | `MODELING` | `APPLICATION`, `MULTI_STEP_SOLUTION`, `UNIT_ANALYSIS` | `FREE_RESPONSE`, `NUMERIC_INPUT` |
| `SKILL-GEN0102-015` | Model and solve applied related rates of change | `MODELING` | `APPLICATION`, `MULTI_STEP_SOLUTION`, `UNIT_ANALYSIS` | `FREE_RESPONSE`, `NUMERIC_INPUT` |
