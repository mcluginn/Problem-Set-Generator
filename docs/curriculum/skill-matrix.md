# Authoritative Learning Skill Matrix

**Engineering Practice Engine — Course by Course Skill Inventory**  
**Document Revision**: 1.0.0  
**Date**: August 28, 2026  
**Total Documented Skills**: 71  

---

## 1. Course 1: GEN 0101 — Mathematics for Engineers (17 Skills)

| Skill ID | Parent Topic | Canonical Skill Name | Skill Type | Source Type | Role | Key Prerequisites |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `SKILL-GEN0101-001` | `U1-T01` | Apply standard order of operations to evaluate real number expressions | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | None (Foundational) |
| `SKILL-GEN0101-002` | `U1-T01` | Find prime factorizations and greatest common divisors | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-GEN0101-003` | `U1-T02` | Perform arithmetic and algebraic operations on rational fractions | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-002` |
| `SKILL-GEN0101-004` | `U1-T03` | Solve direct, inverse, and joint variation engineering models | `MODELING` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-003` |
| `SKILL-GEN0101-005` | `U1-T04` | Factor algebraic polynomials and transpose physical formulas | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-GEN0101-006` | `U1-T05` | Apply index and exponent laws to simplify algebraic expressions | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-GEN0101-007` | `U1-T06` | Formulate and solve algebraic applied word problems (Rate, Mixture, Work, Age) | `APPLICATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-005` |
| `SKILL-GEN0101-008` | `U2-T07` | Solve quadratic and polynomial equations using factoring and quadratic formula | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-005`, `006` |
| `SKILL-GEN0101-009` | `U2-T08` | Solve 2x2 and 3x3 linear and non-linear systems of equations | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-005`, `008` |
| `SKILL-GEN0101-010` | `U2-T09` | Analyze function domain, range, composition, and inverse functions | `INTERPRETATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-005` |
| `SKILL-GEN0101-011` | `U2-T10` | Solve exponential and logarithmic algebraic equations | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-006`, `010` |
| `SKILL-GEN0101-012` | `U3-T11` | Calculate coordinate distance, midpoint, and slope in the Cartesian plane | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-GEN0101-017` | `U3-T12` | Formulate equations of straight lines and determine parallel and perpendicular relationships | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-012`, `005` |
| `SKILL-GEN0101-013` | `U3-T13` | Solve right-angled triangles using trigonometric ratios and Pythagorean theorem | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-008` |
| `SKILL-GEN0101-014` | `U3-T14` | Solve engineering trigonometric problems involving bearings and elevation angles | `APPLICATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-013` |
| `SKILL-GEN0101-015` | `U3-T15` | Solve oblique triangles using the Law of Sines and Law of Cosines | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-013` |
| `SKILL-GEN0101-016` | `U3-T16` | Calculate areas and volumes of composite geometric figures and solids | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-013` |

---

## 2. Course 2: GEN 0102 — Calculus 1 (15 Skills)

| Skill ID | Parent Topic | Canonical Skill Name | Skill Type | Source Type | Role | Key Prerequisites |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `SKILL-GEN0102-001` | `U1-T03` | Evaluate function limits using algebraic factoring, rationalization, and standard forms | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-005`, `010` |
| `SKILL-GEN0102-002` | `U1-T04` | Apply the Power Rule to differentiate polynomial, radical, and rational power functions | `PROCEDURAL` | `SYLLABUS_DERIVED` | `PRIMARY` | `SKILL-GEN0101-006` |
| `SKILL-GEN0102-003` | `U1-T04` | Apply the Product Rule to differentiate products of algebraic and transcendental functions | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-002` |
| `SKILL-GEN0102-004` | `U1-T04` | Apply the Quotient Rule to differentiate rational and fractional functions | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-002` |
| `SKILL-GEN0102-005` | `U1-T04` | Apply the Chain Rule to differentiate composite functions | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-002`, `GEN0101-010` |
| `SKILL-GEN0102-006` | `U2-T05` | Differentiate inverse trigonometric functions | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-005` |
| `SKILL-GEN0102-007` | `U2-T06` | Differentiate hyperbolic and inverse hyperbolic functions | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-005` |
| `SKILL-GEN0102-008` | `U2-T07` | Differentiate logarithmic and exponential functions and apply logarithmic differentiation | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-005`, `GEN0101-011` |
| `SKILL-GEN0102-009` | `U2-T08` | Perform implicit differentiation on bivariate equations F(x, y) = 0 | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-003`, `005` |
| `SKILL-GEN0102-010` | `U2-T09` | Compute first-order partial derivatives for multivariable functions | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-002`, `005` |
| `SKILL-GEN0102-011` | `U2-T10` | Compute higher-order derivatives and evaluate physical acceleration | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-002`, `005` |
| `SKILL-GEN0102-012` | `U3-T11` | Determine slopes and equations of tangent and normal lines to curves | `APPLICATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-002`, `GEN0101-017` |
| `SKILL-GEN0102-013` | `U3-T12` | Perform polynomial curve analysis (Critical points, intervals of increase/decrease, concavity) | `REASONING` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-011`, `GEN0101-008` |
| `SKILL-GEN0102-014` | `U3-T13` | Formulate and solve engineering optimization problems (Maxima and Minima) | `MODELING` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-013`, `GEN0101-005` |
| `SKILL-GEN0102-015` | `U3-T13` | Formulate and solve geometric and physical related rates problems | `MODELING` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-009`, `GEN0101-013` |

---

## 3. Course 3: GEN 0107 — Differential Equations (11 Skills)

| Skill ID | Parent Topic | Canonical Skill Name | Skill Type | Source Type | Role | Key Prerequisites |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `SKILL-GEN0107-001` | `U1-T01` | Classify differential equations by type, order, degree, and linearity | `RECOGNITION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-011` |
| `SKILL-GEN0107-002` | `U1-T02` | Formulate differential equations by eliminating arbitrary constants | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-009`, `GEN0101-009` |
| `SKILL-GEN0107-003` | `U1-T03` | Solve first-order ODEs using separation of variables | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-005`, `GEN0102-002` |
| `SKILL-GEN0107-004` | `U2-T04` | Solve homogeneous first-order differential equations using substitution y = vx | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0107-003`, `GEN0101-005` |
| `SKILL-GEN0107-005` | `U2-T05` | Solve exact first-order differential equations and determine integrating factors | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-010` |
| `SKILL-GEN0107-006` | `U2-T06` | Solve first-order linear differential equations using integrating factors | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-008`, `GEN0101-005` |
| `SKILL-GEN0107-007` | `U2-T07` | Solve Bernoulli differential equations using linearizing substitution | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0107-006`, `GEN0102-005` |
| `SKILL-GEN0107-008` | `U2-T08` | Model engineering physical systems using first-order differential equations | `MODELING` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0107-003`, `006`, `GEN0101-007` |
| `SKILL-GEN0107-009` | `U3-T09` | Solve linear initial value problems using the Laplace transform | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-011`, `GEN0101-005` |
| `SKILL-GEN0107-010` | `U3-T10` | Solve simultaneous coupled linear differential systems using Laplace transforms | `PROCEDURAL` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0107-009`, `GEN0101-009` |
| `SKILL-GEN0107-011` | `U3-T11` | Compute inverse Laplace transforms using partial fraction decomposition and shifts | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-005`, `GEN0107-009` |

---

## 4. Course 4: GEN 0110 — Physics 2 for Engineers (10 Skills)

| Skill ID | Parent Topic | Canonical Skill Name | Skill Type | Source Type | Role | Key Prerequisites |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `SKILL-GEN0110-001` | `U1-T01` | Calculate hydrostatic pressure, buoyant force, and fluid discharge rate | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-GEN0110-002` | `U1-T02` | Calculate thermal heat conduction, convection, and radiation energy transfer rates | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-GEN0110-003` | `U1-T03` | Perform calorimetry energy balance calculations for phase changes and equilibrium | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001`, `005` |
| `SKILL-GEN0110-004` | `U1-T04` | Calculate linear, area, and volumetric thermal expansion and thermal stress | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-GEN0110-005` | `U2-T05` | Calculate acoustic intensity, decibel sound levels, and Doppler frequency shifts | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-011` |
| `SKILL-GEN0110-006` | `U2-T06` | Analyze wave speed, wavelength, frequency, and standing wave harmonics on strings | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-GEN0110-007` | `U2-T07` | Apply Coulomb's Law and Gauss's Law to compute electric fields and potentials | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-013`, `001` |
| `SKILL-GEN0110-008` | `U3-T08` | Analyze DC circuits using Ohm's Law, Kirchhoff's Laws, and equivalent resistance | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-009` |
| `SKILL-GEN0110-009` | `U3-T09` | Apply Snell's Law and thin lens/mirror equation to calculate image positions | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-013` |
| `SKILL-GEN0110-010` | `U3-T10` | Calculate relativistic time dilation, length contraction, and mass-energy equivalence | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001`, `006` |

---

## 5. Course 5: GEN 0161 — Thermodynamics (8 Skills)

| Skill ID | Parent Topic | Canonical Skill Name | Skill Type | Source Type | Role | Key Prerequisites |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `SKILL-GEN0161-001` | `U1-T02` | Identify thermodynamic system boundaries, states, properties, and equilibrium | `RECOGNITION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | None (Foundational) |
| `SKILL-GEN0161-002` | `U1-T03` | Apply the First Law of Thermodynamics to closed-system non-flow energy balances | `APPLICATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0161-001`, `GEN0101-001` |
| `SKILL-GEN0161-003` | `U2-T04` | Apply the ideal gas equation of state and specific heat relations | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0161-001`, `GEN0101-005` |
| `SKILL-GEN0161-004` | `U2-T05` | Calculate boundary work, heat transfer, and property changes for ideal gas processes | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0161-002`, `003` |
| `SKILL-GEN0161-005` | `U2-T06` | Evaluate thermodynamic properties of pure substances using steam tables and phase diagrams | `INTERPRETATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0161-001` |
| `SKILL-GEN0161-006` | `U3-T07` | Calculate thermal efficiency, coefficient of performance, and entropy changes | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0161-002`, `004` |
| `SKILL-GEN0161-007` | `U3-T08` | Analyze the Ideal Rankine vapor power cycle and compute thermal efficiency | `APPLICATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0161-005`, `006` |
| `SKILL-GEN0161-008` | `U3-T08` | Analyze reheat and regenerative modifications to vapor power cycles | `MODELING` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0161-007` |

---

## 6. Course 6: BSIE 3219 — IE Special Topics 1 (10 Skills)

| Skill ID | Parent Topic | Canonical Skill Name | Skill Type | Source Type | Role | Key Prerequisites |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `SKILL-BSIE3219-001` | `U1-T01` | Perform matrix operations, determinants, and matrix inverses for engineering systems | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-009` |
| `SKILL-BSIE3219-002` | `U1-T02` | Perform operations on complex numbers and vector algebra | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-008`, `013` |
| `SKILL-BSIE3219-003` | `U1-T03` | Solve combinatorics, permutations, combinations, and progression series problems | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001` |
| `SKILL-BSIE3219-004` | `U2-T05` | Analyze conic sections equations (Circles, Parabolas, Ellipses, Hyperbolas) | `INTERPRETATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-012`, `008` |
| `SKILL-BSIE3219-005` | `U3-T07` | Apply definite integration to compute plane areas and volumes of revolution | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0102-002`, `GEN0101-008` |
| `SKILL-BSIE3219-006` | `U3-T07` | Calculate simple interest, compound interest, nominal and effective interest rates | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-001`, `011` |
| `SKILL-BSIE3219-007` | `U3-T08` | Evaluate ordinary annuities, uniform gradient cash flows, and breakeven production points | `APPLICATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-BSIE3219-006`, `GEN0101-005` |
| `SKILL-BSIE3219-008` | `U3-T08` | Calculate asset depreciation schedules using SL, SF, DB, and SYD methods | `CALCULATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-BSIE3219-006`, `GEN0101-001` |
| `SKILL-BSIE3219-009` | `U3-T09` | Perform project economic evaluations using Capital Recovery and Benefit-to-Cost ratios | `APPLICATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-BSIE3219-007` |
| `SKILL-BSIE3219-010` | `U3-T09` | Analyze statics equilibrium, friction, and kinematics motion (Rectilinear, Projectile) | `APPLICATION` | `SYLLABUS_EXPLICIT` | `PRIMARY` | `SKILL-GEN0101-013`, `BSIE3219-002` |
