/**
 * Authoritative Mathematical Rendering Test Fixtures
 * Representative expressions across all 5 syllabi courses from the 780 Master Problem Bank.
 */

export interface MathFixture {
  name: string;
  category: string;
  rawExpression: string;
  expectedLatexSnippet: string;
  courseId?: string;
  problemId?: string;
}

export const MATH_RENDERING_FIXTURES: MathFixture[] = [
  // 1. Fractions & Nested Fractions
  {
    name: 'Simple Fraction 1/6',
    category: 'fractions',
    rawExpression: '1/6',
    expectedLatexSnippet: '\\frac{1}{6}',
  },
  {
    name: 'Algebraic Binomial Fraction',
    category: 'fractions',
    rawExpression: '(x^2 - 2x - 3) / (x - 3)',
    expectedLatexSnippet: '\\frac{x^{2} - 2x - 3}{x - 3}',
    courseId: 'COURSE-GEN0102',
    problemId: 'GEN0102-U1-LIM-L1-001',
  },
  {
    name: 'Nested Fractions (Combinations)',
    category: 'fractions',
    rawExpression: '12! / [ 4! * (12 - 4)! ]',
    expectedLatexSnippet: '\\frac{12!',
    courseId: 'COURSE-BSIE3219',
    problemId: 'BSIE3219-U1-CMB-L1-001',
  },
  {
    name: 'Indeterminate Form Fraction',
    category: 'fractions',
    rawExpression: '(3^2 - 2(3) - 3) / (3 - 3) = (9 - 6 - 3) / 0 = 0/0',
    expectedLatexSnippet: '\\frac{3^{2} - 2(3) - 3}{3 - 3}',
    courseId: 'COURSE-GEN0102',
  },

  // 2. Powers and Exponents
  {
    name: 'Polynomial Exponents',
    category: 'powers',
    rawExpression: '4x^5 - 7x^3 + 9x - 14',
    expectedLatexSnippet: '4x^{5}',
    courseId: 'COURSE-GEN0102',
  },
  {
    name: 'Negative Exponent',
    category: 'powers',
    rawExpression: '10^-3',
    expectedLatexSnippet: '10^{-3}',
  },
  {
    name: 'Exponential Function',
    category: 'powers',
    rawExpression: 'e^(3x)',
    expectedLatexSnippet: 'e^{3x}',
    courseId: 'COURSE-GEN0102',
  },
  {
    name: 'Polytropic Exponent Expression',
    category: 'powers',
    rawExpression: 'PV^1.3 = C',
    expectedLatexSnippet: 'PV^{1.3}',
    courseId: 'COURSE-GEN0161',
    problemId: 'GEN0161-U1-POLY-L2-002',
  },
  {
    name: 'Nested Fraction Power',
    category: 'powers',
    rawExpression: '(P2 / P1)^((n - 1)/n)',
    expectedLatexSnippet: '^{\\frac{n - 1}{n}}',
    courseId: 'COURSE-GEN0161',
  },

  // 3. Subscripts
  {
    name: 'Thermodynamics State Subscripts',
    category: 'subscripts',
    rawExpression: 'T_1 = 300 K and T_2 = 450 K',
    expectedLatexSnippet: 'T_{1}',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Calorimeter Material Subscripts',
    category: 'subscripts',
    rawExpression: 'm_w * c_w * (T_eq - T_w) = m_al * c_al * (T_al - T_eq)',
    expectedLatexSnippet: 'm_{w}',
    courseId: 'COURSE-GEN0110',
    problemId: 'GEN0110-U1-CAL-L1-001',
  },

  // 4. Roots
  {
    name: 'Square Root Binomial',
    category: 'roots',
    rawExpression: 'sqrt(x + 7)',
    expectedLatexSnippet: '\\sqrt{x + 7}',
    courseId: 'COURSE-GEN0102',
    problemId: 'GEN0102-U1-LIM-L2-002',
  },
  {
    name: 'Radical Canonical Answer with Multiplication',
    category: 'roots',
    rawExpression: 'a = 7*sqrt(10)/10',
    expectedLatexSnippet: '\\frac{7 \\cdot \\sqrt{10}}{10}',
    courseId: 'COURSE-GEN0102',
  },

  // 5. Limits
  {
    name: 'Standard Calculus Limit',
    category: 'limits',
    rawExpression: 'lim (x -> 3) (x^2 - 2x - 3) / (x - 3)',
    expectedLatexSnippet: '\\lim_{x \\to 3}',
    courseId: 'COURSE-GEN0102',
    problemId: 'GEN0102-U1-LIM-L1-001',
  },
  {
    name: 'One-Sided Limit Approaching Zero',
    category: 'limits',
    rawExpression: 'lim (x -> 0+) (sin x)^(tan x)',
    expectedLatexSnippet: '\\lim_{x \\to 0^+}',
    courseId: 'COURSE-GEN0102',
    problemId: 'GEN0102-U1-LHO-L3-003',
  },
  {
    name: 'Limit Approaching Infinity',
    category: 'limits',
    rawExpression: 'lim (x -> inf) (6x^3 - 5x + 7) / (2x^3 + 9x^2 - 4)',
    expectedLatexSnippet: '\\lim_{x \\to \\infty}',
    courseId: 'COURSE-GEN0102',
    problemId: 'GEN0102-U1-INF-L1-001',
  },

  // 6. Derivatives
  {
    name: 'First Derivative dy/dx',
    category: 'derivatives',
    rawExpression: 'dy/dx = 1 / sqrt(x^2 - 4)',
    expectedLatexSnippet: '\\frac{dy}{dx}',
    courseId: 'COURSE-GEN0102',
    problemId: 'GEN0102-U2-HYP-L3-003',
  },
  {
    name: 'Second Derivative',
    category: 'derivatives',
    rawExpression: 'd^2y/dx^2 + 4y = 0',
    expectedLatexSnippet: '\\frac{d^{2} y}{d x^{2}}',
  },
  {
    name: 'Partial Derivative',
    category: 'derivatives',
    rawExpression: 'del f/del x',
    expectedLatexSnippet: '\\frac{\\partial f}{\\partial x}',
  },

  // 7. Integrals & Summations
  {
    name: 'Work Integral',
    category: 'integrals',
    rawExpression: 'W_b = \\int P \\, dV',
    expectedLatexSnippet: '\\int',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Summation Notation',
    category: 'summations',
    rawExpression: '\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}',
    expectedLatexSnippet: '\\sum_{i=1}^{n}',
  },

  // 8. Engineering Units Protection
  {
    name: 'Pressure in kPa',
    category: 'units',
    rawExpression: 'P = 250 kPa',
    expectedLatexSnippet: '\\text{ kPa }',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Mass in kg',
    category: 'units',
    rawExpression: 'm = 0.8 kg',
    expectedLatexSnippet: '\\text{ kg }',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Velocity in m/s',
    category: 'units',
    rawExpression: 'v = 5 m/s',
    expectedLatexSnippet: '\\text{ m/s }',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Power in kW',
    category: 'units',
    rawExpression: 'P = 10 kW',
    expectedLatexSnippet: '\\text{ kW }',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Heat Flux in W/m^2',
    category: 'units',
    rawExpression: 'q = 100 W/m²',
    expectedLatexSnippet: '\\text{ W/m }^2',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Specific Heat in kJ/kg-K',
    category: 'units',
    rawExpression: 'cp = 10 kJ/kg-K',
    expectedLatexSnippet: '\\text{ kJ/kg-K }',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Mass Flow Rate in kg/s',
    category: 'units',
    rawExpression: 'm_dot = 25.0 kg/s',
    expectedLatexSnippet: '\\text{ kg/s }',
    courseId: 'COURSE-GEN0161',
  },

  // 9. Greek Letters & Rate Dots
  {
    name: 'Engineering Rate Dots',
    category: 'engineering',
    rawExpression: 'Q̇ = m_dot * cp * Delta T',
    expectedLatexSnippet: '\\dot{Q}',
    courseId: 'COURSE-GEN0161',
  },
  {
    name: 'Greek Symbols in Physics',
    category: 'engineering',
    rawExpression: 'omega_m = 6.00 deg/min, theta = 30.0 deg',
    expectedLatexSnippet: 'omega',
    courseId: 'COURSE-GEN0101',
  },

  // 10. Multi-line Derivation Steps
  {
    name: 'Calculus Limit Step 1',
    category: 'derivations',
    rawExpression: 'Evaluate direct substitution at x = 3: (3^2 - 2(3) - 3) / (3 - 3) = (9 - 6 - 3) / 0 = 0/0 (Indeterminate Form).',
    expectedLatexSnippet: '\\frac{3^{2} - 2(3) - 3}{3 - 3}',
    courseId: 'COURSE-GEN0102',
    problemId: 'GEN0102-U1-LIM-L1-001',
  },
  {
    name: 'Calculus Limit Step 2 Factorization',
    category: 'derivations',
    rawExpression: 'Factor the numerator polynomial: x^2 - 2x - 3 = (x - 3)(x + 1).',
    expectedLatexSnippet: 'x^{2} - 2x - 3',
    courseId: 'COURSE-GEN0102',
    problemId: 'GEN0102-U1-LIM-L1-001',
  },
];
