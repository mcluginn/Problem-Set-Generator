import { CanonicalSkillDictionaryEntry } from './types';

export const CANONICAL_SKILL_DICTIONARY: CanonicalSkillDictionaryEntry[] = [
  {
    id: 'SKILL-DICT-001',
    canonicalSkillName: 'Differentiate polynomial, radical, and rational power functions using the Power Rule',
    relationship: 'EXACT_MATCH',
    mappedSkillIds: ['SKILL-GEN0102-002', 'SKILL-GEN0107-003', 'SKILL-BSIE3219-005'],
    notes: 'Foundational power differentiation rule applied in Calculus 1, Differential Equations, and IE Licensure Review.'
  },
  {
    id: 'SKILL-DICT-002',
    canonicalSkillName: 'Differentiate composite functions using the Chain Rule',
    relationship: 'EXACT_MATCH',
    mappedSkillIds: ['SKILL-GEN0102-005', 'SKILL-GEN0107-007'],
    notes: 'Core composite derivative rule in Calculus 1 and Bernoulli ODE transformation in Differential Equations.'
  },
  {
    id: 'SKILL-DICT-003',
    canonicalSkillName: 'Differentiate implicit bivariate relations',
    relationship: 'PREREQUISITE',
    mappedSkillIds: ['SKILL-GEN0102-009', 'SKILL-GEN0107-002'],
    notes: 'Implicit differentiation in Calculus 1 provides the mathematical technique for arbitrary constant elimination in Differential Equations.'
  },
  {
    id: 'SKILL-DICT-004',
    canonicalSkillName: 'Evaluate first-order partial derivatives',
    relationship: 'NORMALIZED_MATCH',
    mappedSkillIds: ['SKILL-GEN0102-010', 'SKILL-GEN0107-005'],
    notes: 'Multivariable rate calculation in Calculus 1 and exactness testing (dM/dy = dN/dx) in Differential Equations.'
  },
  {
    id: 'SKILL-DICT-005',
    canonicalSkillName: 'Solve single-variable quadratic equations',
    relationship: 'EXACT_MATCH',
    mappedSkillIds: ['SKILL-GEN0101-008', 'SKILL-BSIE3219-002', 'SKILL-BSIE3219-004'],
    notes: 'Standard quadratic solving, complex root extraction, and conic section completing-the-square.'
  },
  {
    id: 'SKILL-DICT-006',
    canonicalSkillName: 'Solve linear systems of equations',
    relationship: 'EXACT_MATCH',
    mappedSkillIds: ['SKILL-GEN0101-009', 'SKILL-GEN0110-008', 'SKILL-BSIE3219-001'],
    notes: 'Algebraic substitution/elimination in Math for Engineers, Kirchhoff circuit laws in Physics, and matrix determinants in IE.'
  },
  {
    id: 'SKILL-DICT-007',
    canonicalSkillName: 'Solve right-triangle and oblique-triangle trigonometry',
    relationship: 'EXACT_MATCH',
    mappedSkillIds: ['SKILL-GEN0101-013', 'SKILL-GEN0101-015', 'SKILL-GEN0110-007', 'SKILL-BSIE3219-010'],
    notes: 'Fundamental triangle trigonometry used in geometry, physics 2D force vectors, and engineering mechanics statics.'
  },
  {
    id: 'SKILL-DICT-008',
    canonicalSkillName: 'Solve exponential and logarithmic algebraic equations',
    relationship: 'RELATED',
    mappedSkillIds: ['SKILL-GEN0101-011', 'SKILL-GEN0102-008', 'SKILL-GEN0107-006', 'SKILL-BSIE3219-006'],
    notes: 'Algebraic log equations in GEN 0101, logarithmic differentiation in GEN 0102, integrating factors in GEN 0107, and compound interest in BSIE 3219.'
  },
  {
    id: 'SKILL-DICT-009',
    canonicalSkillName: 'Formulate applied algebraic word problems (Mixture, Rate, Work)',
    relationship: 'EXACT_MATCH',
    mappedSkillIds: ['SKILL-GEN0101-007', 'SKILL-GEN0107-008'],
    notes: 'Translating verbal rate scenarios into equations: algebraic balances in GEN 0101 vs differential rate balances in GEN 0107.'
  },
  {
    id: 'SKILL-DICT-010',
    canonicalSkillName: 'Formulate equations of straight lines and perpendicular relationships',
    relationship: 'EXACT_MATCH',
    mappedSkillIds: ['SKILL-GEN0101-012', 'SKILL-GEN0102-012'],
    notes: 'Cartesian straight lines in algebra/geometry and tangent/normal line equations in calculus.'
  },
  {
    id: 'SKILL-DICT-011',
    canonicalSkillName: 'Thermal energy transfer and heat balances',
    relationship: 'DO_NOT_MERGE',
    mappedSkillIds: ['SKILL-GEN0110-002', 'SKILL-GEN0110-003', 'SKILL-GEN0161-002'],
    notes: 'Physics conduction/convection/radiation rate mechanisms are kept distinct from macroscopic control-mass First Law thermodynamics.'
  },
  {
    id: 'SKILL-DICT-012',
    canonicalSkillName: 'Definite integration and plane area calculations',
    relationship: 'COURSE_SPECIFIC',
    mappedSkillIds: ['SKILL-BSIE3219-005'],
    notes: 'Integral Calculus module specific to IE licensure review course (BSIE 3219).'
  },
  {
    id: 'SKILL-DICT-013',
    canonicalSkillName: 'Perform economic evaluation and compound interest cash flow analysis',
    relationship: 'COURSE_SPECIFIC',
    mappedSkillIds: ['SKILL-BSIE3219-006', 'SKILL-BSIE3219-007', 'SKILL-BSIE3219-008', 'SKILL-BSIE3219-009'],
    notes: 'Industrial Engineering Economy module specific to BSIE 3219.'
  },
  {
    id: 'SKILL-DICT-014',
    canonicalSkillName: 'Solve initial value problems using Laplace transform methods',
    relationship: 'COURSE_SPECIFIC',
    mappedSkillIds: ['SKILL-GEN0107-009', 'SKILL-GEN0107-010', 'SKILL-GEN0107-011'],
    notes: 'Higher-order linear initial value differential equations specific to GEN 0107.'
  }
];
