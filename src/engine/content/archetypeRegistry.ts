/**
 * Problem Archetype Registry & Pedagogical Reference Integration
 * Engineering Practice Engine — Phase 8 Castro Textbook Grounding
 *
 * Grounded in "Elementary Differential Equations by Engr. Castro".
 * Note: Textbook is used as a pedagogical structural reference, not a runtime question bank.
 * All problem candidates are deterministically synthesized to prevent copyright duplication
 * while preserving textbook rigor and structural variety.
 */

import {
  ProblemArchetypeCategory,
  ProblemArchetypeId,
  PedagogicalTaskType,
  PedagogicalSourceMetadata
} from './types';

export interface ProblemArchetypeDefinition {
  id: ProblemArchetypeId;
  name: string;
  category: ProblemArchetypeCategory;
  taskType: PedagogicalTaskType;
  conceptId: string;
  skillId: string;
  description: string;
  mathematicalRationale: string;
  sourceMetadata: PedagogicalSourceMetadata;
  applicableDifficulties: number[];
  associatedTemplateIds: string[];
}

export const ARCHETYPE_REGISTRY: Record<string, ProblemArchetypeDefinition> = {
  'ARCH-HOMO-DIRECT-RATIO': {
    id: 'ARCH-HOMO-DIRECT-RATIO',
    name: 'Standard Direct Ratio Homogeneous Form dy/dx = F(y/x)',
    category: 'DIRECT_RATIO_STANDARD',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Solve first-order homogeneous ODEs explicitly structured as dy/dx = F(y/x) using substitution y = vx.',
    mathematicalRationale: 'Establishes direct substitution y = vx, dy/dx = v + x dv/dx to reduce to separable differential form.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 2 (Homogeneous Equations, Spreads 13-16)',
      structuralPrinciple: 'Rational expressions reducible to pure ratio form F(y/x).',
      archetypeCategory: 'DIRECT_RATIO_STANDARD',
      archetypeId: 'ARCH-HOMO-DIRECT-RATIO',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [1, 2],
    associatedTemplateIds: ['TMPL-GEN0107-HOMOGENEOUS-VX']
  },

  'ARCH-HOMO-DIFF-FORM': {
    id: 'ARCH-HOMO-DIFF-FORM',
    name: 'Differential Form Rearrangement M(x, y) dx + N(x, y) dy = 0',
    category: 'DIFFERENTIAL_FORM_REARRANGEMENT',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Solve homogeneous differential equations presented in differential form M dx + N dy = 0 via substitution.',
    mathematicalRationale: 'Requires student to recognize homogeneity of M and N with equal degree, substitute y = vx and dy = v dx + x dv, and collect terms in dx and dv to solve for the general solution.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 2 (Spreads 14-18)',
      structuralPrinciple: 'Differential form (M dx + N dy = 0) requiring algebraic rearrangement and factor isolation.',
      archetypeCategory: 'DIFFERENTIAL_FORM_REARRANGEMENT',
      archetypeId: 'ARCH-HOMO-DIFF-FORM',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [2, 3],
    associatedTemplateIds: ['TMPL-GEN0107-HOMO-DIFF-FORM']
  },

  'ARCH-HOMO-DUAL-SUB': {
    id: 'ARCH-HOMO-DUAL-SUB',
    name: 'Dual Monomial Substitution (x = vy vs y = vx)',
    category: 'MONOMIAL_DUAL_SUBSTITUTION',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Solve homogeneous equations where the dx coefficient is a simpler monomial, making x = vy structurally superior to y = vx.',
    mathematicalRationale: 'Teaches Castro principle: if N is simpler than M, substitute y = vx; if M is simpler than N, substitute x = vy (dx = v dy + y dv) to find the general solution efficiently.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 2 (Spreads 13-15)',
      structuralPrinciple: 'Monomial coefficient selection criterion for optimal substitution orientation.',
      archetypeCategory: 'MONOMIAL_DUAL_SUBSTITUTION',
      archetypeId: 'ARCH-HOMO-DUAL-SUB',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [2, 3],
    associatedTemplateIds: ['TMPL-GEN0107-HOMO-DUAL-SUB']
  },

  'ARCH-HOMO-PARTIAL-FRAC': {
    id: 'ARCH-HOMO-PARTIAL-FRAC',
    name: 'Homogeneous ODE with Quadratic/Partial Fraction Separation',
    category: 'PARTIAL_FRACTION_DECOMPOSITION',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Solve first-order homogeneous ODEs whose separation in v requires partial fraction decomposition.',
    mathematicalRationale: 'Evaluates multi-step algebraic competence: substitution y = vx leads to dv/((v - a)(v - b)) = dx/x.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 2 (Spreads 17-21)',
      structuralPrinciple: 'Quadratic trinomials in v leading to rational partial fraction decomposition.',
      archetypeCategory: 'PARTIAL_FRACTION_DECOMPOSITION',
      archetypeId: 'ARCH-HOMO-PARTIAL-FRAC',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [3, 4],
    associatedTemplateIds: ['TMPL-GEN0107-HOMO-PARTIAL-FRAC']
  },

  'ARCH-HOMO-INVERSE-TRIG': {
    id: 'ARCH-HOMO-INVERSE-TRIG',
    name: 'Homogeneous ODE with Irreducible Quadratic Denominator / Inverse Trig Integration',
    category: 'INVERSE_TRIGONOMETRIC_FORM',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Solve first-order homogeneous ODEs whose separation in v yields an irreducible quadratic denominator (1 + v^2) integrating to arctan(y/x).',
    mathematicalRationale: 'Directly reinforces Castro Spread 14 Problem 1: (x - 2y)dx + (2x + y)dy = 0 leads to integral (2 + v)/(1 + v^2) dv = 2 arctan(v) + (1/2)ln(1 + v^2).',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 2 (Spread 14, Problem 1)',
      structuralPrinciple: 'Irreducible quadratic denominator in v yielding arctan(v) and logarithmic terms.',
      archetypeCategory: 'INVERSE_TRIGONOMETRIC_FORM',
      archetypeId: 'ARCH-HOMO-INVERSE-TRIG',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [3, 4],
    associatedTemplateIds: ['TMPL-GEN0107-HOMO-INVERSE-TRIG']
  },

  'ARCH-HOMO-TRANSCENDENTAL': {
    id: 'ARCH-HOMO-TRANSCENDENTAL',
    name: 'Homogeneous ODE with Transcendental Trigonometric / Radical Separation',
    category: 'TRANSCENDENTAL_FORM',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Solve first-order homogeneous ODEs involving trigonometric functions of (y/x) or radical expressions sqrt(x^2 +- y^2).',
    mathematicalRationale: 'Directly reflects Castro Spread 17 Problem 14: [x csc(y/x) - y]dx + x dy = 0 leads to integral sin(v) dv = -cos(v).',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 2 (Spread 17, Problem 14 & Spread 16, Problem 10)',
      structuralPrinciple: 'Trigonometric and radical homogeneous forms requiring transcendental variable separation.',
      archetypeCategory: 'TRANSCENDENTAL_FORM',
      archetypeId: 'ARCH-HOMO-TRANSCENDENTAL',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [4, 5],
    associatedTemplateIds: ['TMPL-GEN0107-HOMO-TRANSCENDENTAL']
  },

  'ARCH-HOMO-IVP': {
    id: 'ARCH-HOMO-IVP',
    name: 'Homogeneous Initial Value Problem (Particular Solution)',
    category: 'INITIAL_VALUE_PROBLEM',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Solve homogeneous initial value problems to determine the unique particular solution matching y(x0) = y0.',
    mathematicalRationale: 'Tests complete workflow: substitution, integration, back-substitution, and determination of constant C from boundary data.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 2 (Spreads 22-25)',
      structuralPrinciple: 'Initial boundary condition constraints determining particular constants.',
      archetypeCategory: 'INITIAL_VALUE_PROBLEM',
      archetypeId: 'ARCH-HOMO-IVP',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [2, 3],
    associatedTemplateIds: ['TMPL-GEN0107-HOMO-IVP']
  },

  'ARCH-HOMO-DEGREE-TEST': {
    id: 'ARCH-HOMO-DEGREE-TEST',
    name: 'Euler Homogeneity & Degree Verification Test',
    category: 'EULER_HOMOGENEITY_DEGREE',
    taskType: 'ANALYZE_HOMOGENEITY_DEGREE',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Verify whether a given function or differential equation is homogeneous, and determine its degree of homogeneity n.',
    mathematicalRationale: 'Directly reinforces Castro foundational concept: testing f(tx, ty) = t^n f(x, y) prior to applying substitution.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 2 (Spreads 13-14)',
      structuralPrinciple: 'Euler scaling property f(tx, ty) = t^n f(x, y) verification.',
      archetypeCategory: 'EULER_HOMOGENEITY_DEGREE',
      archetypeId: 'ARCH-HOMO-DEGREE-TEST',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [1, 2],
    associatedTemplateIds: ['TMPL-GEN0107-HOMO-DEGREE-TEST']
  },

  'ARCH-HOMO-VERIFY': {
    id: 'ARCH-HOMO-VERIFY',
    name: 'Homogeneous ODE Solution Verification',
    category: 'SOLUTION_VERIFICATION',
    taskType: 'VERIFY_SOLUTION',
    conceptId: 'de_first_order_homogeneous_y_vx',
    skillId: 'SKILL-GEN0107-004',
    description: 'Verify whether a proposed relation satisfies a given homogeneous differential equation.',
    mathematicalRationale: 'Cultivates backward verification competence and differential substitution.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 1 & 2 (Spreads 5-6, 15)',
      structuralPrinciple: 'Implicit differentiation and substitution verification of general solutions.',
      archetypeCategory: 'SOLUTION_VERIFICATION',
      archetypeId: 'ARCH-HOMO-VERIFY',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [1, 2],
    associatedTemplateIds: ['TMPL-GEN0107-HOMO-VERIFY']
  },

  // =========================================================================
  // CASTRO CHAPTER 3: ELEMENTARY DIFFERENTIAL APPLICATIONS (SKILL-GEN0107-008)
  // =========================================================================

  'ARCH-APP-MIXING-CONSTANT-VOL': {
    id: 'ARCH-APP-MIXING-CONSTANT-VOL',
    name: 'Mixing Tank Constant Volume Solute Formulation',
    category: 'APPLICATION_MIXING_CONSTANT_VOLUME',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Model transient solute mass in well-stirred tanks with equal inflow and outflow rates: dm/dt = R_in * C_in - (R_out / V0) * m.',
    mathematicalRationale: 'Directly reflects Castro Spread 48 Problem 24: dm/dt = C_i V_i - C_o V_o solved via separable or linear integrating factor e^(kt).',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 48, Problem 24)',
      structuralPrinciple: 'Dynamic conservation balance dm/dt = Rate_in - Rate_out with constant volume.',
      archetypeCategory: 'APPLICATION_MIXING_CONSTANT_VOLUME',
      archetypeId: 'ARCH-APP-MIXING-CONSTANT-VOL',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [2, 3],
    associatedTemplateIds: ['TMPL-GEN0107-APP-MIX-CONST-SOLVE', 'TMPL-GEN0107-MIXING-TANK']
  },

  'ARCH-APP-MIXING-THRESHOLD-TIME': {
    id: 'ARCH-APP-MIXING-THRESHOLD-TIME',
    name: 'Mixing Tank Time to Reach Concentration Threshold',
    category: 'APPLICATION_MIXING_THRESHOLD_TIME',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Solve for the elapsed time t* required for a mixing solution to achieve a specified concentration or fraction of capacity.',
    mathematicalRationale: 'Directly reinforces Castro Spread 48 Problem 24(b) & Problem 25(b): solving t* from exponential decay/saturation relation.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 48, Problems 24b & 25b)',
      structuralPrinciple: 'Algebraic inversion of exponential response curve to extract target threshold time.',
      archetypeCategory: 'APPLICATION_MIXING_THRESHOLD_TIME',
      archetypeId: 'ARCH-APP-MIXING-THRESHOLD-TIME',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [3, 4],
    associatedTemplateIds: ['TMPL-GEN0107-APP-MIX-CONST-THRESHOLD']
  },

  'ARCH-APP-MIXING-VARIABLE-VOL': {
    id: 'ARCH-APP-MIXING-VARIABLE-VOL',
    name: 'Variable Volume Tank Mixing Model',
    category: 'APPLICATION_MIXING_VARIABLE_VOLUME',
    taskType: 'MODEL_AND_SOLVE',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Model solute accumulation in a tank where inflow rate != outflow rate, yielding variable volume V(t) = V0 + (R_in - R_out)t.',
    mathematicalRationale: 'Evaluates first-order linear ODE with variable coefficients dm/dt + [R_out/(V0 + delta_R t)]m = R_in C_in solved via polynomial integrating factor.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Elementary Differential Applications)',
      structuralPrinciple: 'Non-constant denominator integrating factor mu(t) = (V0 + delta_R t)^n.',
      archetypeCategory: 'APPLICATION_MIXING_VARIABLE_VOLUME',
      archetypeId: 'ARCH-APP-MIXING-VARIABLE-VOL',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [4, 5],
    associatedTemplateIds: ['TMPL-GEN0107-APP-MIX-VAR-ACCUM']
  },

  'ARCH-APP-MIXING-PURE-FLUSH': {
    id: 'ARCH-APP-MIXING-PURE-FLUSH',
    name: 'Pure Solvent Washout and Dilution Kinetics',
    category: 'APPLICATION_MIXING_DILUTION_WASHOUT',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Model exponential dilution washout of initial solute when pure solvent (C_in = 0) flushes the system: dm/dt = -(R/V)m.',
    mathematicalRationale: 'Directly reflects separable exponential decay kinetics m(t) = m0 e^(-(R/V)t).',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 48)',
      structuralPrinciple: 'Zero-inflow mass balance leading to pure separable exponential decay.',
      archetypeCategory: 'APPLICATION_MIXING_DILUTION_WASHOUT',
      archetypeId: 'ARCH-APP-MIXING-PURE-FLUSH',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [1, 2],
    associatedTemplateIds: ['TMPL-GEN0107-APP-MIX-DILUTION-FLUSH']
  },

  'ARCH-APP-COOLING-CONSTANT-AMBIENT': {
    id: 'ARCH-APP-COOLING-CONSTANT-AMBIENT',
    name: 'Newton Law of Cooling in Constant Ambient Medium',
    category: 'APPLICATION_COOLING_CONSTANT_AMBIENT',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Determine the temperature T(t) of an object cooling in a medium maintained at constant temperature T_m: dT/dt = -k(T - T_m).',
    mathematicalRationale: 'Directly reinforces Castro Spread 44 Problem 1 & 4: dT/(T - T_m) = -k dt yielding T(t) = T_m + (T_0 - T_m)e^(-kt).',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spreads 44-45, Problems 1 & 4)',
      structuralPrinciple: 'Newtonian thermal dissipation balance with constant boundary temperature.',
      archetypeCategory: 'APPLICATION_COOLING_CONSTANT_AMBIENT',
      archetypeId: 'ARCH-APP-COOLING-CONSTANT-AMBIENT',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [1, 2],
    associatedTemplateIds: ['TMPL-GEN0107-APP-COOL-DIRECT']
  },

  'ARCH-APP-COOLING-TIME-TARGET': {
    id: 'ARCH-APP-COOLING-TIME-TARGET',
    name: 'Newton Cooling Time to Reach Target Temperature',
    category: 'APPLICATION_COOLING_TIME_TARGET',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Determine the elapsed time required for an object to cool or heat to a target threshold temperature T*.',
    mathematicalRationale: 'Directly reflects Castro Spread 44 Problem 4: solving for t* via t* = -(1/k) ln[(T* - T_m)/(T_0 - T_m)].',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 44, Problem 4)',
      structuralPrinciple: 'Inversion of thermal exponential decay to determine required cooling duration.',
      archetypeCategory: 'APPLICATION_COOLING_TIME_TARGET',
      archetypeId: 'ARCH-APP-COOLING-TIME-TARGET',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [3, 4],
    associatedTemplateIds: ['TMPL-GEN0107-APP-COOL-TIME-TARGET']
  },

  'ARCH-APP-COOLING-TWO-POINT': {
    id: 'ARCH-APP-COOLING-TWO-POINT',
    name: 'Newton Cooling with Two-Point Rate Parameter Determination',
    category: 'APPLICATION_COOLING_TWO_POINT_RATE',
    taskType: 'MODEL_AND_SOLVE',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Given initial temperature and an intermediate reading T(t_1) = T_1, extract cooling constant k and predict temperature at a later time.',
    mathematicalRationale: 'Directly reinforces Castro Spread 44 Problem 1 & Spread 45 Problem 5: two-stage parameter extraction prior to prediction.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spreads 44-45, Problem 1 & 5)',
      structuralPrinciple: 'Two-point boundary identification of thermal dissipation constant k.',
      archetypeCategory: 'APPLICATION_COOLING_TWO_POINT_RATE',
      archetypeId: 'ARCH-APP-COOLING-TWO-POINT',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [3, 4],
    associatedTemplateIds: ['TMPL-GEN0107-APP-COOL-TWO-POINT']
  },

  'ARCH-APP-DECAY-HALF-LIFE': {
    id: 'ARCH-APP-DECAY-HALF-LIFE',
    name: 'Radioactive Decay and Half-Life Determination',
    category: 'APPLICATION_GROWTH_DECAY_HALF_LIFE',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Model radioactive decomposition dm/dt = -km to determine half-life t_half or the time required to decay to a given percentage.',
    mathematicalRationale: 'Directly reflects Castro Spread 47 Problem 13: Radium decomposition dm/dt = -km with half-life derivation.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 47, Problem 13)',
      structuralPrinciple: 'First-order kinetic decomposition with logarithmic half-life extraction.',
      archetypeCategory: 'APPLICATION_GROWTH_DECAY_HALF_LIFE',
      archetypeId: 'ARCH-APP-DECAY-HALF-LIFE',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [2, 3],
    associatedTemplateIds: ['TMPL-GEN0107-APP-DECAY-HALF-LIFE']
  },

  'ARCH-APP-HEATING-CONSTANT-AMBIENT': {
    id: 'ARCH-APP-HEATING-CONSTANT-AMBIENT',
    name: 'Newton Law of Warming in Heated Ambient Medium',
    category: 'APPLICATION_HEATING_CONSTANT_AMBIENT',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Determine the transient temperature T(t) of a cold body warming in a high-temperature medium: dT/dt = k(T_m - T).',
    mathematicalRationale: 'Directly reinforces Castro Spread 45 Problem 6: body warming where ambient temperature T_m > initial temperature T_0.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 45, Problem 6)',
      structuralPrinciple: 'Newtonian thermal absorption balance dT/dt = k(T_m - T) with higher ambient boundary.',
      archetypeCategory: 'APPLICATION_HEATING_CONSTANT_AMBIENT',
      archetypeId: 'ARCH-APP-HEATING-CONSTANT-AMBIENT',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [1, 2],
    associatedTemplateIds: ['TMPL-GEN0107-APP-HEAT-DIRECT']
  },

  'ARCH-APP-HEATING-TIME-TARGET': {
    id: 'ARCH-APP-HEATING-TIME-TARGET',
    name: 'Newton Warming Time to Reach Threshold Temperature',
    category: 'APPLICATION_HEATING_TIME_TARGET',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Calculate elapsed warming duration required for an initially cold object to achieve a specified target temperature.',
    mathematicalRationale: 'Directly reflects Castro Spread 45 Problem 6: solving elapsed duration t* for warming curve.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 45, Problem 6)',
      structuralPrinciple: 'Logarithmic inversion of thermal warming curve to extract threshold time.',
      archetypeCategory: 'APPLICATION_HEATING_TIME_TARGET',
      archetypeId: 'ARCH-APP-HEATING-TIME-TARGET',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [3, 4],
    associatedTemplateIds: ['TMPL-GEN0107-APP-HEAT-TIME-TARGET']
  },

  'ARCH-APP-MIXING-WASHOUT-TIME': {
    id: 'ARCH-APP-MIXING-WASHOUT-TIME',
    name: 'Dilution Pure Flush Elapsed Time to Residue Threshold',
    category: 'APPLICATION_MIXING_WASHOUT_TIME',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Solve for the elapsed duration required for pure solvent flush to eliminate a given percentage of initial solute contaminant.',
    mathematicalRationale: 'Directly reflects Castro Spread 48 Problem 25(b): time to wash out 90% or 95% of initial pollutant.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 48, Problem 25b)',
      structuralPrinciple: 'Exponential decay inversion for specified residual fraction threshold.',
      archetypeCategory: 'APPLICATION_MIXING_WASHOUT_TIME',
      archetypeId: 'ARCH-APP-MIXING-WASHOUT-TIME',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [3, 4],
    associatedTemplateIds: ['TMPL-GEN0107-APP-MIX-WASHOUT-TIME']
  },

  'ARCH-APP-POPULATION-GROWTH-IVP': {
    id: 'ARCH-APP-POPULATION-GROWTH-IVP',
    name: 'Malthusian Bacterial Population Growth Kinetics',
    category: 'APPLICATION_GROWTH_MALTHUSIAN',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Model exponential population growth dP/dt = kP and extract particular trajectory from growth rate observation.',
    mathematicalRationale: 'Directly reflects Castro Spread 47: Malthusian population growth kinetics P(t) = P_0 e^(kt).',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 47)',
      structuralPrinciple: 'First-order positive exponential kinetics with growth rate parameter determination.',
      archetypeCategory: 'APPLICATION_GROWTH_MALTHUSIAN',
      archetypeId: 'ARCH-APP-POPULATION-GROWTH-IVP',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [2, 3],
    associatedTemplateIds: ['TMPL-GEN0107-APP-POP-GROWTH-IVP']
  },

  'ARCH-APP-POPULATION-DOUBLING': {
    id: 'ARCH-APP-POPULATION-DOUBLING',
    name: 'Bacterial Culture Population Doubling Time',
    category: 'APPLICATION_GROWTH_DOUBLING_TIME',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Extract rate constant k from observed hourly percentage increase and calculate doubling time t_double = ln(2)/k.',
    mathematicalRationale: 'Directly reflects Castro Spread 47 Problem 15: calculating doubling duration from fractional growth.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 47, Problem 15)',
      structuralPrinciple: 'Logarithmic doubling time extraction t_double = ln(2)/k from initial percentage growth rate.',
      archetypeCategory: 'APPLICATION_GROWTH_DOUBLING_TIME',
      archetypeId: 'ARCH-APP-POPULATION-DOUBLING',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [2, 3],
    associatedTemplateIds: ['TMPL-GEN0107-APP-POP-DOUBLING']
  },

  'ARCH-APP-ORTHOGONAL-ALGEBRAIC': {
    id: 'ARCH-APP-ORTHOGONAL-ALGEBRAIC',
    name: 'Orthogonal Trajectories to Algebraic Curve Families',
    category: 'APPLICATION_ORTHOGONAL_TRAJECTORIES',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    conceptId: 'de_first_order_applications',
    skillId: 'SKILL-GEN0107-008',
    description: 'Find the orthogonal trajectories of a one-parameter family of curves by eliminating the constant C and replacing dy/dx with -dx/dy.',
    mathematicalRationale: 'Directly reinforces Castro Spread 49 Problems 1-3: finding orthogonal trajectories to lines, concentric circles, and hyperbolas.',
    sourceMetadata: {
      sourceTitle: 'Elementary Differential Equations by Engr. Castro',
      author: 'Engr. Castro',
      chapterOrSpread: 'Chapter 3 (Spread 49, Problems 1-3)',
      structuralPrinciple: 'Geometric orthogonality condition dy/dx|_ortho = -1 / (dy/dx|_orig).',
      archetypeCategory: 'APPLICATION_ORTHOGONAL_TRAJECTORIES',
      archetypeId: 'ARCH-APP-ORTHOGONAL-ALGEBRAIC',
      copyrightNote: 'Pedagogical structural reference only; problem instances deterministically synthesized.'
    },
    applicableDifficulties: [2, 3, 4],
    associatedTemplateIds: ['TMPL-GEN0107-APP-ORTHO-TRAJECTORIES']
  }
};

export class ArchetypeRegistry {
  public static getArchetype(id: string): ProblemArchetypeDefinition | undefined {
    return ARCHETYPE_REGISTRY[id];
  }

  public static getArchetypesForConcept(conceptId: string): ProblemArchetypeDefinition[] {
    return Object.values(ARCHETYPE_REGISTRY).filter(a => a.conceptId === conceptId);
  }

  public static getArchetypesForSkill(skillId: string): ProblemArchetypeDefinition[] {
    return Object.values(ARCHETYPE_REGISTRY).filter(a => a.skillId === skillId);
  }
}
