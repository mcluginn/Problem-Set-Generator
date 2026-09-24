/**
 * Authoritative Concept-Method Consistency Matrix & Registry
 * Engineering Practice Engine — Pedagogical & Mathematical Concept Integrity Layer
 */

import {
  DifferentialEquationOrder,
  DifferentialEquationLinearity,
  DifferentialEquationHomogeneity,
  DifferentialEquationCoefficientType,
  DifferentialEquationMethod,
  ConceptMethodMetadata
} from './types';

export interface ConceptDefinition extends ConceptMethodMetadata {
  conceptId: string;
  name: string;
  courseId: string;
  topicId: string;
  subtopicId?: string;
  skillId?: string;
  learningObjective: string;
  order?: DifferentialEquationOrder;
  linearity: DifferentialEquationLinearity;
  homogeneity: DifferentialEquationHomogeneity;
  coefficientType: DifferentialEquationCoefficientType;
  primaryMethod: DifferentialEquationMethod;
  validAlternativeMethods: DifferentialEquationMethod[];
  disallowedMethods: DifferentialEquationMethod[];
  requiredKeywords: string[];
  disallowedKeywords: string[];
  expectedStructureDescription: string;
  maxStructuralSimilarity?: number;
}

export const AUTHORITATIVE_CONCEPT_REGISTRY: Record<string, ConceptDefinition> = {
  // =========================================================================
  // COURSE-GEN0107: Differential Equations Concepts
  // =========================================================================

  'de_classification': {
    conceptId: 'de_classification',
    name: 'Classification of Differential Equations',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U1-T01',
    subtopicId: 'SUB-GEN0107-U1-T01-S2',
    skillId: 'SKILL-GEN0107-001',
    learningObjective: 'Classify differential equations by type, order, degree, and linearity',
    order: 1,
    linearity: 'MAY_BE_NONLINEAR',
    homogeneity: 'NOT_APPLICABLE',
    coefficientType: 'NOT_APPLICABLE',
    primaryMethod: 'CLASSIFICATION_TAXONOMY',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION'],
    requiredKeywords: ['order', 'degree', 'linear'],
    disallowedKeywords: [],
    expectedStructureDescription: 'Identification of differential equation taxonomic properties.'
  },

  'de_elimination_arbitrary_constants': {
    conceptId: 'de_elimination_arbitrary_constants',
    name: 'Elimination of Arbitrary Constants',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U1-T02',
    subtopicId: 'SUB-GEN0107-U1-T02-S1',
    skillId: 'SKILL-GEN0107-002',
    learningObjective: 'Formulate differential equations by eliminating arbitrary constants',
    order: 1,
    linearity: 'LINEAR',
    homogeneity: 'NOT_APPLICABLE',
    coefficientType: 'NOT_APPLICABLE',
    primaryMethod: 'ELIMINATION_OF_ARBITRARY_CONSTANTS',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION', 'INTEGRATING_FACTOR'],
    requiredKeywords: ['constant', 'eliminate', 'parameter'],
    disallowedKeywords: [],
    expectedStructureDescription: 'Differentiation and algebraic elimination of parameter constants.'
  },

  'de_separable': {
    conceptId: 'de_separable',
    name: 'First-Order Separable Differential Equations',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U1-T03',
    subtopicId: 'SUB-GEN0107-U1-T03-S1',
    skillId: 'SKILL-GEN0107-003',
    learningObjective: 'Solve first-order ODEs using separation of variables',
    order: 1,
    linearity: 'MAY_BE_NONLINEAR',
    homogeneity: 'NOT_APPLICABLE',
    coefficientType: 'VARIABLE',
    primaryMethod: 'SEPARATION_OF_VARIABLES',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION', 'INTEGRATING_FACTOR'],
    requiredKeywords: ['separate', 'variables', 'integrate'],
    disallowedKeywords: ["y''", "y'''", "r^2", "auxiliary equation", "characteristic equation"],
    expectedStructureDescription: 'Separation of variables g(y) dy = f(x) dx.'
  },

  // --- TOPIC 4: Concept A (First-Order Homogeneous Substitution y = vx) ---
  'de_first_order_homogeneous_y_vx': {
    conceptId: 'de_first_order_homogeneous_y_vx',
    name: 'First-Order Homogeneous Differential Equations (y = vx)',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U2-T04',
    subtopicId: 'SUB-GEN0107-U2-T04-S1',
    skillId: 'SKILL-GEN0107-004',
    learningObjective: 'Solve homogeneous first-order differential equations using substitution y = vx',
    order: 1,
    linearity: 'MAY_BE_NONLINEAR',
    homogeneity: 'HOMOGENEOUS',
    coefficientType: 'NOT_APPLICABLE',
    primaryMethod: 'SUBSTITUTION_Y_EQUALS_VX',
    validAlternativeMethods: [],
    disallowedMethods: [
      'CHARACTERISTIC_EQUATION',
      'INTEGRATING_FACTOR',
      'LAPLACE_TRANSFORM',
      'INVERSE_LAPLACE_PARTIAL_FRACTION',
      'SYSTEM_OF_ODES_LAPLACE'
    ],
    requiredKeywords: ['homogeneous', 'substitution', 'v'],
    disallowedKeywords: [
      "y''",
      "y'''",
      "\\frac{d^2y}{dx^2}",
      "d^2y/dx^2",
      "r^2",
      "auxiliary equation",
      "characteristic equation",
      "characteristic root",
      "r_1",
      "r_2",
      "C_1 e^{",
      "C_{1}e^{",
      "e^{rx}"
    ],
    expectedStructureDescription: 'First-order ODE dy/dx = F(y/x) solved by substitution y = vx => dy/dx = v + x dv/dx.',
    maxStructuralSimilarity: 0.70
  },

  // --- TOPIC 4: Concept B (Second-Order Linear Homogeneous Constant Coefficients) ---
  'de_second_order_linear_homogeneous_constant_coeff': {
    conceptId: 'de_second_order_linear_homogeneous_constant_coeff',
    name: 'Second-Order Linear Homogeneous ODEs with Constant Coefficients',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U2-T04',
    subtopicId: 'SUB-GEN0107-U2-T04-S2',
    skillId: 'SKILL-GEN0107-004',
    learningObjective: 'Solve second-order linear homogeneous differential equations with constant coefficients using characteristic equations',
    order: 2,
    linearity: 'LINEAR',
    homogeneity: 'HOMOGENEOUS',
    coefficientType: 'CONSTANT',
    primaryMethod: 'CHARACTERISTIC_EQUATION',
    validAlternativeMethods: [],
    disallowedMethods: [
      'SUBSTITUTION_Y_EQUALS_VX',
      'SEPARATION_OF_VARIABLES',
      'BERNOULLI_LINEARIZING_SUBSTITUTION',
      'EXACT_POTENTIAL_FUNCTION'
    ],
    requiredKeywords: ['characteristic', 'roots'],
    disallowedKeywords: [
      'y = vx',
      'v = y/x',
      'v + x \\frac{dv}{dx}',
      'v+x\\frac{dv}{dx}',
      'integrating factor',
      '\\mu(x)',
      'exact equation'
    ],
    expectedStructureDescription: "Second-order linear ODE ay'' + by' + cy = 0 solved via auxiliary equation ar^2 + br + c = 0."
  },

  // --- TOPIC 4: Concept C (Second-Order Linear Homogeneous Variable Coefficients) ---
  'de_second_order_linear_homogeneous_variable_coeff': {
    conceptId: 'de_second_order_linear_homogeneous_variable_coeff',
    name: 'Second-Order Linear Homogeneous ODEs with Variable Coefficients',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U2-T04',
    subtopicId: 'SUB-GEN0107-U2-T04-S2',
    learningObjective: 'Solve second-order linear differential equations with variable coefficients',
    order: 2,
    linearity: 'LINEAR',
    homogeneity: 'HOMOGENEOUS',
    coefficientType: 'VARIABLE',
    primaryMethod: 'POWER_SERIES',
    validAlternativeMethods: ['UNDETERMINED_COEFFICIENTS'],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'SEPARATION_OF_VARIABLES'],
    requiredKeywords: ['variable coefficients'],
    disallowedKeywords: ['y = vx'],
    expectedStructureDescription: "Second-order linear ODE a(x)y'' + b(x)y' + c(x)y = 0 with non-constant coefficients."
  },

  'de_exact_potential_function': {
    conceptId: 'de_exact_potential_function',
    name: 'Exact First-Order Differential Equations',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U2-T05',
    subtopicId: 'SUB-GEN0107-U2-T05-S1',
    skillId: 'SKILL-GEN0107-005',
    learningObjective: 'Solve exact first-order differential equations and determine integrating factors',
    order: 1,
    linearity: 'MAY_BE_NONLINEAR',
    homogeneity: 'NOT_APPLICABLE',
    coefficientType: 'VARIABLE',
    primaryMethod: 'EXACT_POTENTIAL_FUNCTION',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION'],
    requiredKeywords: ['exact', 'potential', 'partial'],
    disallowedKeywords: ["y''", "r^2", "y = vx"],
    expectedStructureDescription: 'Differential form M(x,y) dx + N(x,y) dy = 0 with dM/dy = dN/dx.'
  },

  'de_first_order_linear_integrating_factor': {
    conceptId: 'de_first_order_linear_integrating_factor',
    name: 'First-Order Linear Differential Equations (Integrating Factor)',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U2-T06',
    subtopicId: 'SUB-GEN0107-U2-T06-S1',
    skillId: 'SKILL-GEN0107-006',
    learningObjective: 'Solve first-order linear differential equations using integrating factors',
    order: 1,
    linearity: 'LINEAR',
    homogeneity: 'NON_HOMOGENEOUS',
    coefficientType: 'VARIABLE',
    primaryMethod: 'INTEGRATING_FACTOR',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION'],
    requiredKeywords: ['integrating factor', 'P(x)', 'linear'],
    disallowedKeywords: ["y''", "r^2", "y = vx"],
    expectedStructureDescription: 'Standard linear form dy/dx + P(x)y = Q(x) solved via mu(x) = exp(int P dx).'
  },

  'de_bernoulli_substitution': {
    conceptId: 'de_bernoulli_substitution',
    name: 'Bernoulli Differential Equations (v = y^(1-n))',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U2-T07',
    subtopicId: 'SUB-GEN0107-U2-T07-S1',
    skillId: 'SKILL-GEN0107-007',
    learningObjective: 'Solve Bernoulli differential equations using linearizing substitution',
    order: 1,
    linearity: 'NON_LINEAR',
    homogeneity: 'NON_HOMOGENEOUS',
    coefficientType: 'VARIABLE',
    primaryMethod: 'BERNOULLI_LINEARIZING_SUBSTITUTION',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION'],
    requiredKeywords: ['Bernoulli', 'substitution', 'v = y^'],
    disallowedKeywords: ["y''", "r^2"],
    expectedStructureDescription: 'Non-linear form dy/dx + P(x)y = Q(x)y^n linearized via v = y^(1-n).'
  },

  'de_first_order_applications': {
    conceptId: 'de_first_order_applications',
    name: 'Applications of First-Order Differential Equations',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U2-T08',
    subtopicId: 'SUB-GEN0107-U2-T08-S1',
    skillId: 'SKILL-GEN0107-008',
    learningObjective: 'Model engineering physical systems using first-order differential equations (Growth, Cooling, Mixtures)',
    order: 1,
    linearity: 'LINEAR',
    homogeneity: 'NON_HOMOGENEOUS',
    coefficientType: 'CONSTANT',
    primaryMethod: 'SEPARATION_OF_VARIABLES',
    validAlternativeMethods: ['INTEGRATING_FACTOR', 'SEPARATION_OF_VARIABLES'],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION'],
    requiredKeywords: ['rate', 'differential', 'equation'],
    disallowedKeywords: ["y''", "r^2"],
    expectedStructureDescription: 'First-order physical system model (Newton Cooling, Mixing Tank, Exponential Decay, Orthogonal Trajectories).',
    maxStructuralSimilarity: 0.70
  },

  'de_laplace_ivp': {
    conceptId: 'de_laplace_ivp',
    name: 'Linear Initial Value Problems with Laplace Transforms',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U3-T09',
    subtopicId: 'SUB-GEN0107-U3-T09-S1',
    skillId: 'SKILL-GEN0107-009',
    learningObjective: 'Solve linear initial value problems using the Laplace transform',
    order: undefined,
    linearity: 'LINEAR',
    homogeneity: 'NON_HOMOGENEOUS',
    coefficientType: 'CONSTANT',
    primaryMethod: 'LAPLACE_TRANSFORM',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX'],
    requiredKeywords: ['Laplace', 's-domain', 'initial value'],
    disallowedKeywords: ['y = vx'],
    expectedStructureDescription: 'Transformation of derivative IVP into s-domain algebraic equation.'
  },

  'de_simultaneous_systems_laplace': {
    conceptId: 'de_simultaneous_systems_laplace',
    name: 'Simultaneous Differential Equations using Laplace',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U3-T10',
    subtopicId: 'SUB-GEN0107-U3-T10-S1',
    skillId: 'SKILL-GEN0107-010',
    learningObjective: 'Solve simultaneous coupled linear differential systems using Laplace transforms',
    order: undefined,
    linearity: 'LINEAR',
    homogeneity: 'NON_HOMOGENEOUS',
    coefficientType: 'CONSTANT',
    primaryMethod: 'SYSTEM_OF_ODES_LAPLACE',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION'],
    requiredKeywords: ['system', 'coupled', 'simultaneous'],
    disallowedKeywords: ['y = vx'],
    expectedStructureDescription: 'Coupled linear differential system transformed to algebraic matrix in s-domain.'
  },

  'de_inverse_laplace_partial_fractions': {
    conceptId: 'de_inverse_laplace_partial_fractions',
    name: 'Inverse Laplace Transform via Partial Fractions',
    courseId: 'COURSE-GEN0107',
    topicId: 'CURR-GEN0107-U3-T11',
    subtopicId: 'SUB-GEN0107-U3-T11-S1',
    skillId: 'SKILL-GEN0107-011',
    learningObjective: 'Compute inverse Laplace transforms using partial fraction decomposition and shifting theorems',
    order: undefined,
    linearity: 'LINEAR',
    homogeneity: 'NOT_APPLICABLE',
    coefficientType: 'NOT_APPLICABLE',
    primaryMethod: 'INVERSE_LAPLACE_PARTIAL_FRACTION',
    validAlternativeMethods: [],
    disallowedMethods: ['SUBSTITUTION_Y_EQUALS_VX', 'CHARACTERISTIC_EQUATION'],
    requiredKeywords: ['inverse Laplace', 'partial fractions'],
    disallowedKeywords: ['y = vx'],
    expectedStructureDescription: 'Partial fraction decomposition in s-domain to invert L^-1{F(s)}.'
  }
};

export class ConceptRegistry {
  private static instance: ConceptRegistry | null = null;
  private registry: Map<string, ConceptDefinition> = new Map();
  private skillToConceptMap: Map<string, ConceptDefinition> = new Map();
  private subtopicToConceptMap: Map<string, ConceptDefinition> = new Map();

  private constructor() {
    for (const [id, def] of Object.entries(AUTHORITATIVE_CONCEPT_REGISTRY)) {
      this.registry.set(id, def);
      if (def.skillId && !this.skillToConceptMap.has(def.skillId)) {
        this.skillToConceptMap.set(def.skillId, def);
      }
      if (def.subtopicId) {
        this.subtopicToConceptMap.set(def.subtopicId, def);
      }
    }
  }

  public static getInstance(): ConceptRegistry {
    if (!ConceptRegistry.instance) {
      ConceptRegistry.instance = new ConceptRegistry();
    }
    return ConceptRegistry.instance;
  }

  public getConceptById(conceptId: string): ConceptDefinition | undefined {
    return this.registry.get(conceptId);
  }

  public getConceptForSkill(skillId: string): ConceptDefinition | undefined {
    return this.skillToConceptMap.get(skillId);
  }

  public getConceptForSubtopic(subtopicId: string): ConceptDefinition | undefined {
    return this.subtopicToConceptMap.get(subtopicId);
  }

  public getConceptsByTopic(topicId: string): ConceptDefinition[] {
    return Array.from(this.registry.values()).filter(c => c.topicId === topicId);
  }

  public getAllConcepts(): ConceptDefinition[] {
    return Array.from(this.registry.values());
  }

  public isMethodValidForConcept(conceptId: string, method: DifferentialEquationMethod | string): boolean {
    const concept = this.registry.get(conceptId);
    if (!concept) return true;

    if (concept.disallowedMethods.includes(method as any)) {
      return false;
    }

    if (concept.primaryMethod === method) {
      return true;
    }

    return concept.validAlternativeMethods.includes(method as any);
  }
}

export const conceptRegistry = ConceptRegistry.getInstance();
