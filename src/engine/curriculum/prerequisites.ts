import { PrerequisiteRelation } from './types';
import { AUTHORITATIVE_SKILLS } from './skills';

export const AUTHORITATIVE_PREREQUISITES: PrerequisiteRelation[] = [
  // --- Mathematics for Engineers (GEN 0101) internal prerequisites ---
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0101-002',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Real number arithmetic is required before factoring integers.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-002',
    targetSkillId: 'SKILL-GEN0101-003',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Prime factorization and GCD are required to compute common denominators for fractions.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-003',
    targetSkillId: 'SKILL-GEN0101-004',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Fractional operations are required for ratio, proportion, and variation constant equations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0101-005',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Arithmetic order of operations is needed for algebraic polynomial simplification.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0101-006',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Basic arithmetic powers precede the formal laws of exponents and fractional exponents.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0101-007',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Formula transposition and equation solving are required to solve applied word problems.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0101-008',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Factoring polynomials is a direct prerequisite for solving quadratic equations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-006',
    targetSkillId: 'SKILL-GEN0101-008',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Exponent laws are needed for radical simplifications in the quadratic formula.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0101-009',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Variable isolation is needed for substitution in systems of equations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-008',
    targetSkillId: 'SKILL-GEN0101-009',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Quadratic equation solving is required to find intersection roots in non-linear systems.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0101-010',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Algebraic operations are needed for function evaluation and composition.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-006',
    targetSkillId: 'SKILL-GEN0101-011',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Exponent laws are the direct foundation for logarithmic transformations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-010',
    targetSkillId: 'SKILL-GEN0101-011',
    strength: 'RECOMMENDED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Function composition and inverse functions support understanding logarithms as inverses of exponentials.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0101-012',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Coordinate arithmetic for distances, midpoints, and slopes.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-012',
    targetSkillId: 'SKILL-GEN0101-017',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Coordinate slope and point calculations are needed before writing line equations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0101-017',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Formula transposition is required to convert straight line equation forms.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-008',
    targetSkillId: 'SKILL-GEN0101-013',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Pythagorean theorem requires quadratic square root solving.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-013',
    targetSkillId: 'SKILL-GEN0101-014',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Right triangle trigonometry is required before solving bearing and elevation problems.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-013',
    targetSkillId: 'SKILL-GEN0101-015',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Basic trigonometric functions are required before the Law of Sines and Law of Cosines.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-013',
    targetSkillId: 'SKILL-GEN0101-016',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Trigonometric ratios are required to compute apothem lengths for regular polygons and circular sectors.'
  },

  // --- Calculus 1 (GEN 0102) prerequisites ---
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0102-001',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Factoring is required to evaluate 0/0 indeterminate limit expressions.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-010',
    targetSkillId: 'SKILL-GEN0102-001',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Function behavior and domain restrictions are needed to analyze limits and continuity.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-006',
    targetSkillId: 'SKILL-GEN0102-002',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Exponent laws are strictly required to rewrite radicals into fractional power forms for the Power Rule.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-002',
    targetSkillId: 'SKILL-GEN0102-003',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Basic differentiation of individual factors is required before applying the Product Rule.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-002',
    targetSkillId: 'SKILL-GEN0102-004',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Basic differentiation of numerator and denominator is required before the Quotient Rule.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-002',
    targetSkillId: 'SKILL-GEN0102-005',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Basic derivative rules are required before differentiating composite functions.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-010',
    targetSkillId: 'SKILL-GEN0102-005',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Understanding function composition f(g(x)) is required to identify inner and outer functions.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-005',
    targetSkillId: 'SKILL-GEN0102-006',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Chain Rule is required to differentiate composite inverse trigonometric functions.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-005',
    targetSkillId: 'SKILL-GEN0102-007',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Chain Rule is required to differentiate composite hyperbolic functions.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-005',
    targetSkillId: 'SKILL-GEN0102-008',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Chain Rule is required to differentiate exponential and logarithmic composite expressions.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-011',
    targetSkillId: 'SKILL-GEN0102-008',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Logarithmic properties (product, power, quotient) are required for logarithmic differentiation.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-003',
    targetSkillId: 'SKILL-GEN0102-009',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Product Rule is required for differentiating xy product terms implicitly.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-005',
    targetSkillId: 'SKILL-GEN0102-009',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Chain Rule is required to differentiate powers of y (e.g. d/dx[y^3] = 3y^2 dy/dx).'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-002',
    targetSkillId: 'SKILL-GEN0102-010',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Single-variable differentiation rules are applied while holding other variables constant.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-005',
    targetSkillId: 'SKILL-GEN0102-010',
    strength: 'RECOMMENDED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Multivariable Chain Rule applies when independent variables are functions of other parameters.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-002',
    targetSkillId: 'SKILL-GEN0102-011',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'First derivative computation is the foundation for successive higher-order derivatives.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-005',
    targetSkillId: 'SKILL-GEN0102-011',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Chain Rule is repeatedly applied during successive higher-order differentiation.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-002',
    targetSkillId: 'SKILL-GEN0102-012',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Evaluating derivative f\'(x0) is required to determine the tangent slope.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-017',
    targetSkillId: 'SKILL-GEN0102-012',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Point-slope line formula and perpendicular slopes (-1/m) are needed for tangent/normal equations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-011',
    targetSkillId: 'SKILL-GEN0102-013',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'First and second derivatives are required for critical point and concavity tests.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-008',
    targetSkillId: 'SKILL-GEN0102-013',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Solving polynomial equations f\'(x) = 0 is required to locate critical numbers.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-013',
    targetSkillId: 'SKILL-GEN0102-014',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Extrema classification principles are applied directly to word-problem optimization.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0102-014',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Constraint equation variable substitution is required to form a single-variable objective.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-009',
    targetSkillId: 'SKILL-GEN0102-015',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Implicit differentiation with respect to time d/dt is the core mechanism of related rates.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-013',
    targetSkillId: 'SKILL-GEN0102-015',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Pythagorean theorem and geometric similarity relations are required to set up related rate models.'
  },

  // --- Differential Equations (GEN 0107) prerequisites ---
  {
    sourceSkillId: 'SKILL-GEN0102-011',
    targetSkillId: 'SKILL-GEN0107-001',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Understanding derivative orders (y\', y\'\', y^(n)) is needed to classify ODE order.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-009',
    targetSkillId: 'SKILL-GEN0107-002',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Implicit differentiation of curve relations is needed before eliminating arbitrary constants.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-009',
    targetSkillId: 'SKILL-GEN0107-002',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Simultaneous elimination of algebraic parameters.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0107-003',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Algebraic factoring is required to separate x and y factors.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-002',
    targetSkillId: 'SKILL-GEN0107-003',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Basic integration (anti-derivative of power functions) is required to solve separated equations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0107-003',
    targetSkillId: 'SKILL-GEN0107-004',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Separation of variables is the concluding step after applying the substitution y = vx.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0107-004',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Algebraic factoring and fraction simplification in terms of v.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-010',
    targetSkillId: 'SKILL-GEN0107-005',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Partial derivatives dM/dy and dN/dx are required to verify ODE exactness.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-008',
    targetSkillId: 'SKILL-GEN0107-006',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Exponential and logarithmic integrals are required to evaluate integrating factor mu = exp(int P dx).'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0107-006',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Equation rearrangement into standard linear form dy/dx + P(x)y = Q(x).'
  },
  {
    sourceSkillId: 'SKILL-GEN0107-006',
    targetSkillId: 'SKILL-GEN0107-007',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Linear ODE solution method is applied after Bernoulli substitution.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-005',
    targetSkillId: 'SKILL-GEN0107-007',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Chain Rule is applied when differentiating the transformation v = y^(1-n).'
  },
  {
    sourceSkillId: 'SKILL-GEN0107-003',
    targetSkillId: 'SKILL-GEN0107-008',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Separable ODE solving is the core engine for growth, decay, and cooling models.'
  },
  {
    sourceSkillId: 'SKILL-GEN0107-006',
    targetSkillId: 'SKILL-GEN0107-008',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Linear first-order ODE solving is required for variable-volume tank mixture balances.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-007',
    targetSkillId: 'SKILL-GEN0107-008',
    strength: 'RECOMMENDED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Translating verbal mixture scenarios into mathematical rate balances.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-011',
    targetSkillId: 'SKILL-GEN0107-009',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Higher-order derivatives and initial values are required to transform ODEs into s-domain.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0107-009',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Algebraic isolation of transform Y(s).'
  },
  {
    sourceSkillId: 'SKILL-GEN0107-009',
    targetSkillId: 'SKILL-GEN0107-010',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Single-variable Laplace transform methods are extended to coupled systems.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-009',
    targetSkillId: 'SKILL-GEN0107-010',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Solving simultaneous 2x2 linear algebraic equations in s-domain.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0107-011',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Partial fraction decomposition is the primary algebraic step before taking inverse Laplace transforms.'
  },
  {
    sourceSkillId: 'SKILL-GEN0107-009',
    targetSkillId: 'SKILL-GEN0107-011',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Understanding forward Laplace table pairs is necessary for inverse mapping.'
  },

  // --- Physics 2 (GEN 0110) prerequisites ---
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0110-001',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Real number arithmetic and unit handling for fluid statics equations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0110-002',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Arithmetic calculations for heat transfer rate formulas.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0110-003',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Arithmetic energy summation in calorimetry.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0110-003',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Linear equation solving for equilibrium temperature T_final.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0110-004',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Calculations for thermal expansion coefficients and temperature differences.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-011',
    targetSkillId: 'SKILL-GEN0110-005',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Base-10 logarithms are required for decibel sound level calculations beta = 10 log10(I/I0).'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0110-006',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Calculations for wave speed v = f*lambda and frequency.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-013',
    targetSkillId: 'SKILL-GEN0110-007',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Trigonometric vector resolution is required to sum 2D electric forces.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0110-007',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Inverse-square calculations in Coulomb\'s Law.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-009',
    targetSkillId: 'SKILL-GEN0110-008',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Solving linear systems of equations is required for Kirchhoff\'s loop and junction laws.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-013',
    targetSkillId: 'SKILL-GEN0110-009',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Trigonometric sine functions and inverse sines are required for Snell\'s Law and critical angles.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0110-010',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Arithmetic calculations for relativistic Lorentz factors.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-006',
    targetSkillId: 'SKILL-GEN0110-010',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Square roots and fractional powers in relativistic gamma factor.'
  },

  // --- Thermodynamics (GEN 0161) prerequisites ---
  {
    sourceSkillId: 'SKILL-GEN0161-001',
    targetSkillId: 'SKILL-GEN0161-002',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'System boundary definition and property identification are required before writing First Law energy balances.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-GEN0161-002',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Arithmetic energy summation Q - W = delta_U.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-001',
    targetSkillId: 'SKILL-GEN0161-003',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'State properties (P, v, T) are required before applying the ideal gas equation of state.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-GEN0161-003',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Transposition of formula PV = mRT to solve for target variables.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-002',
    targetSkillId: 'SKILL-GEN0161-004',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'First Law closed-system formulation is required to calculate heat and work for specific ideal gas processes.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-003',
    targetSkillId: 'SKILL-GEN0161-004',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Ideal gas state equations are used to relate endpoints in isobaric, isothermal, and isentropic paths.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-001',
    targetSkillId: 'SKILL-GEN0161-005',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Property understanding is required to locate states in pure substance phase tables.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-002',
    targetSkillId: 'SKILL-GEN0161-006',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'First Law thermal efficiency formulation precedes Second Law entropy and Carnot limits.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-004',
    targetSkillId: 'SKILL-GEN0161-006',
    strength: 'RECOMMENDED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Reversible processes understanding supports entropy change calculations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-005',
    targetSkillId: 'SKILL-GEN0161-007',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Steam table enthalpy lookups across pump, boiler, turbine, and condenser are required for Rankine cycle analysis.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-006',
    targetSkillId: 'SKILL-GEN0161-007',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Thermal efficiency definitions and isentropic expansion limits are used in Rankine cycle calculations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0161-007',
    targetSkillId: 'SKILL-GEN0161-008',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Standard Ideal Rankine cycle analysis is the baseline before adding reheat and regenerative feedwater heaters.'
  },

  // --- IE Special Topics 1 (BSIE 3219) prerequisites ---
  {
    sourceSkillId: 'SKILL-GEN0101-009',
    targetSkillId: 'SKILL-BSIE3219-001',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Linear systems of equations provide the context for matrix formulation and Cramer\'s rule.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-008',
    targetSkillId: 'SKILL-BSIE3219-002',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Quadratic roots and imaginary unit i = sqrt(-1) lead to complex numbers.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-013',
    targetSkillId: 'SKILL-BSIE3219-002',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Trigonometry is required for polar form (r cis theta) and vector dot/cross products.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-BSIE3219-003',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Factorial arithmetic and sequence summations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-012',
    targetSkillId: 'SKILL-BSIE3219-004',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Cartesian straight lines and distance formulas lead to conic section locus equations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-008',
    targetSkillId: 'SKILL-BSIE3219-004',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Completing the square in second-degree equations is required to put conics into standard form.'
  },
  {
    sourceSkillId: 'SKILL-GEN0102-002',
    targetSkillId: 'SKILL-BSIE3219-005',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Anti-derivatives and integration of power functions are required for plane areas and volumes of revolution.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-008',
    targetSkillId: 'SKILL-BSIE3219-005',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Solving quadratic intersection equations is required to find integral limits [a, b].'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-BSIE3219-006',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Arithmetic calculations for interest compounding.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-011',
    targetSkillId: 'SKILL-BSIE3219-006',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Exponential growth models apply directly to compound interest F = P(1 + i)^n.'
  },
  {
    sourceSkillId: 'SKILL-BSIE3219-006',
    targetSkillId: 'SKILL-BSIE3219-007',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Compound interest and present worth factors form the basis of annuity formulas.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-005',
    targetSkillId: 'SKILL-BSIE3219-007',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Linear equation solving for breakeven production quantity.'
  },
  {
    sourceSkillId: 'SKILL-BSIE3219-006',
    targetSkillId: 'SKILL-BSIE3219-008',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Time value of money concepts support sinking fund and depreciation analysis.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-001',
    targetSkillId: 'SKILL-BSIE3219-008',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: 'Fractional arithmetic for Sum-of-the-Years-Digits depreciation multipliers.'
  },
  {
    sourceSkillId: 'SKILL-BSIE3219-007',
    targetSkillId: 'SKILL-BSIE3219-009',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Annuity and capital recovery factors are applied directly in project economic evaluations.'
  },
  {
    sourceSkillId: 'SKILL-GEN0101-013',
    targetSkillId: 'SKILL-BSIE3219-010',
    strength: 'REQUIRED',
    evidence: 'EXPLICIT',
    notes: 'Trigonometry is required to resolve static force vectors and projectile velocity components.'
  },
  {
    sourceSkillId: 'SKILL-BSIE3219-002',
    targetSkillId: 'SKILL-BSIE3219-010',
    strength: 'REQUIRED',
    evidence: 'STRONGLY_INFERRED',
    notes: '2D vector addition and dot products for force equilibrium.'
  }
];

export class PrerequisiteGraph {
  private adjacencyList: Map<string, string[]> = new Map();
  private reverseAdjacencyList: Map<string, string[]> = new Map();
  private relationsMap: Map<string, PrerequisiteRelation> = new Map();

  constructor(relations: PrerequisiteRelation[] = AUTHORITATIVE_PREREQUISITES) {
    for (const rel of relations) {
      const key = `${rel.sourceSkillId}->${rel.targetSkillId}`;
      this.relationsMap.set(key, rel);

      // Downstream adjacency: source -> target
      if (!this.adjacencyList.has(rel.sourceSkillId)) {
        this.adjacencyList.set(rel.sourceSkillId, []);
      }
      this.adjacencyList.get(rel.sourceSkillId)!.push(rel.targetSkillId);

      // Upstream adjacency: target -> source
      if (!this.reverseAdjacencyList.has(rel.targetSkillId)) {
        this.reverseAdjacencyList.set(rel.targetSkillId, []);
      }
      this.reverseAdjacencyList.get(rel.targetSkillId)!.push(rel.sourceSkillId);
    }
  }

  /**
   * Get all immediate upstream prerequisites for a skill
   */
  public getImmediatePrerequisites(skillId: string): string[] {
    return this.reverseAdjacencyList.get(skillId) || [];
  }

  /**
   * Get all immediate downstream dependents for a skill
   */
  public getImmediateDependents(skillId: string): string[] {
    return this.adjacencyList.get(skillId) || [];
  }

  /**
   * Get full transitive closure of upstream prerequisites (in topological order)
   */
  public getTransitivePrerequisites(skillId: string): string[] {
    const visited = new Set<string>();
    const result: string[] = [];

    const traverse = (currId: string) => {
      const direct = this.getImmediatePrerequisites(currId);
      for (const parentId of direct) {
        if (!visited.has(parentId)) {
          visited.add(parentId);
          traverse(parentId);
          result.push(parentId);
        }
      }
    };

    traverse(skillId);
    return result;
  }

  /**
   * Check if there are any cycles in the prerequisite graph
   */
  public detectCycles(): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const path: string[] = [];

    const allSkills = new Set<string>([
      ...Array.from(this.adjacencyList.keys()),
      ...Array.from(this.reverseAdjacencyList.keys())
    ]);

    const dfs = (node: string) => {
      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = this.adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        } else if (recStack.has(neighbor)) {
          const cycleStart = path.indexOf(neighbor);
          cycles.push([...path.slice(cycleStart), neighbor]);
        }
      }

      path.pop();
      recStack.delete(node);
    };

    for (const skill of allSkills) {
      if (!visited.has(skill)) {
        dfs(skill);
      }
    }

    return cycles;
  }
}
