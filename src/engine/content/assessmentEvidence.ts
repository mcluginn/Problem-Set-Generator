/**
 * Assessment Evidence Definitions & Mappings Across All Six Courses
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import { AssessmentEvidenceDefinition, AssessmentEvidenceTypeId } from './types';
export type { AssessmentEvidenceTypeId };

export const ASSESSMENT_EVIDENCE_REGISTRY: Record<AssessmentEvidenceTypeId, AssessmentEvidenceDefinition> = {
  DIRECT_CALCULATION: {
    id: 'DIRECT_CALCULATION',
    name: 'Direct Symbolic / Numerical Calculation',
    description: 'Student computes a mathematically verified derivative, limit, algebraic root, integral, or numerical value directly from a mathematical expression.',
    observableStudentBehavior: 'Produces a mathematically equivalent closed-form symbolic expression or exact number using standard transformation rules.',
    suitableSkillTypes: ['CALCULATION', 'PROCEDURAL'],
    supportedQuestionFormats: ['SYMBOLIC_INPUT', 'NUMERIC_INPUT', 'FREE_RESPONSE'],
    samplePromptFraming: 'Evaluate or compute the exact value of the expression.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0107', 'COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  METHOD_RECOGNITION: {
    id: 'METHOD_RECOGNITION',
    name: 'Method & Rule Recognition',
    description: 'Student identifies which governing theorem, substitution, ODE solution method, or decomposition rule must be applied before executing computation.',
    observableStudentBehavior: 'Correctly discriminates the governing algebraic/functional structure (e.g. separable ODE vs integrating factor, Chain Rule vs Product Rule) without being explicitly told the method.',
    suitableSkillTypes: ['RECOGNITION', 'METHOD_RECOGNITION', 'PROCEDURAL'],
    supportedQuestionFormats: ['MULTIPLE_CHOICE', 'MATCHING', 'FREE_RESPONSE'],
    samplePromptFraming: 'Identify which primary method or theorem is required to solve the problem.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0107', 'COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  MULTI_STEP_SOLUTION: {
    id: 'MULTI_STEP_SOLUTION',
    name: 'Multi-Stage Solution Derivation',
    description: 'Student carries out a multi-stage derivation where intermediate sub-goals must be formulated and chained together.',
    observableStudentBehavior: 'Executes sequential stages (e.g., integrating factor derivation -> integration by parts -> constant substitution) maintaining algebraic consistency throughout.',
    suitableSkillTypes: ['PROCEDURAL', 'APPLICATION', 'MODELING'],
    supportedQuestionFormats: ['MULTI_STEP', 'FREE_RESPONSE', 'IMAGE_WORK'],
    samplePromptFraming: 'Solve the problem step-by-step, showing intermediate stages.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0107', 'COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  ERROR_ANALYSIS: {
    id: 'ERROR_ANALYSIS',
    name: 'Misconception Diagnosis & Error Analysis',
    description: 'Student inspects a flawed mathematical or physical derivation, locates the exact step containing the error, and explains the misconception.',
    observableStudentBehavior: 'Identifies the precise incorrect transformation line (e.g. missing inner derivative, sign error in Kirchhoff loop, invalid thermo state assumption) and articulates the correction.',
    suitableSkillTypes: ['ERROR_ANALYSIS', 'REASONING'],
    supportedQuestionFormats: ['ERROR_ANALYSIS', 'MULTIPLE_CHOICE', 'FREE_RESPONSE'],
    samplePromptFraming: 'Inspect the student work below and identify the exact step containing the mathematical error.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0107', 'COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  APPLICATION: {
    id: 'APPLICATION',
    name: 'Physical & Engineering Application',
    description: 'Student applies mathematical models to solve applied geometric, kinematic, electrical, thermal, or economic problems.',
    observableStudentBehavior: 'Translates applied engineering parameters into governing equations, evaluates rates or quantities, and states answer with physical units.',
    suitableSkillTypes: ['APPLICATION', 'MODELING'],
    supportedQuestionFormats: ['FREE_RESPONSE', 'NUMERIC_INPUT', 'SYMBOLIC_INPUT'],
    samplePromptFraming: 'Calculate the physical or economic quantity for the described engineering system.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0107', 'COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  INTERPRETATION: {
    id: 'INTERPRETATION',
    name: 'Diagram & State Interpretation',
    description: 'Student extracts values from property diagrams, schematic circuits, or graphs to evaluate engineering parameters.',
    observableStudentBehavior: 'Reads coordinates, state properties, or slopes from diagrams and determines physical phase or behavior.',
    suitableSkillTypes: ['INTERPRETATION', 'REASONING'],
    supportedQuestionFormats: ['MULTIPLE_CHOICE', 'MATCHING', 'NUMERIC_INPUT'],
    samplePromptFraming: 'Interpret the provided diagram and determine the state or rate.',
    applicableCourses: ['COURSE-GEN0102', 'COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  EXPLANATION: {
    id: 'EXPLANATION',
    name: 'Qualitative Conceptual Explanation',
    description: 'Student explains fundamental physical laws, thermodynamic postulates, or calculus theorems in concise technical terms.',
    observableStudentBehavior: 'Selects or writes accurate qualitative explanations connecting physical laws with observed phenomena.',
    suitableSkillTypes: ['COMMUNICATION', 'REASONING'],
    supportedQuestionFormats: ['FREE_RESPONSE', 'MULTIPLE_CHOICE'],
    samplePromptFraming: 'Explain why the process violates the Second Law of Thermodynamics.',
    applicableCourses: ['COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  GRAPH_READING: {
    id: 'GRAPH_READING',
    name: 'Graphical Function & Rate Analysis',
    description: 'Student analyzes functional curves, matching derivatives, integral areas, or vector field directions.',
    observableStudentBehavior: 'Matches curves with derivative graphs or vector trajectories based on critical points and slope signs.',
    suitableSkillTypes: ['INTERPRETATION', 'RECOGNITION'],
    supportedQuestionFormats: ['MATCHING', 'MULTIPLE_CHOICE', 'GRAPH_MATCHING'],
    samplePromptFraming: 'Match the function curve with its corresponding first derivative graph.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0107', 'COURSE-GEN0110']
  },
  TABLE_INTERPRETATION: {
    id: 'TABLE_INTERPRETATION',
    name: 'Thermodynamic & Engineering Table Lookup / Interpolation',
    description: 'Student looks up saturated liquid/vapor or superheated vapor properties from steam/refrigerant tables and performs linear interpolation.',
    observableStudentBehavior: 'Identifies correct pressure/temperature table, determines phase state, and computes exact interpolated specific volume, enthalpy, or entropy.',
    suitableSkillTypes: ['PROCEDURAL', 'INTERPRETATION'],
    supportedQuestionFormats: ['NUMERIC_INPUT', 'TABLE_INPUT', 'MULTIPLE_CHOICE'],
    samplePromptFraming: 'Using the saturated water property table, determine the specific enthalpy at P = 0.5 MPa and T = 200°C.',
    applicableCourses: ['COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  UNIT_ANALYSIS: {
    id: 'UNIT_ANALYSIS',
    name: 'Dimensional & Unit Consistency',
    description: 'Student verifies dimensional homogeneity and converts engineering units across SI and English systems.',
    observableStudentBehavior: 'Performs consistent unit conversions (e.g. kJ to kWh, psi to kPa) and checks physical dimension balance.',
    suitableSkillTypes: ['CALCULATION', 'APPLICATION'],
    supportedQuestionFormats: ['NUMERIC_INPUT', 'MULTIPLE_CHOICE'],
    samplePromptFraming: 'Convert the energy rate to kW and verify dimensional consistency.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  MODELING: {
    id: 'MODELING',
    name: 'Applied Mathematical & Engineering Modeling',
    description: 'Student formulates mathematical governing equations (differential equations, optimization constraints, economic cash flows) from verbal descriptions.',
    observableStudentBehavior: 'Translates physical constraints into algebraic or differential equations with correct boundary conditions.',
    suitableSkillTypes: ['MODELING', 'APPLICATION'],
    supportedQuestionFormats: ['FREE_RESPONSE', 'MULTI_STEP', 'NUMERIC_INPUT'],
    samplePromptFraming: 'Formulate the differential equation modeling the rate of salt dissolution in the mixing tank.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0107', 'COURSE-GEN0110', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  MODEL_FORMULATION: {
    id: 'MODEL_FORMULATION',
    name: 'Objective & Constraint Formulation',
    description: 'Student constructs optimization objective functions and constraint equations from descriptive engineering specifications.',
    observableStudentBehavior: 'Identifies decision variables, writes linear/non-linear objective function, and sets up equality/inequality constraints.',
    suitableSkillTypes: ['MODELING', 'REASONING'],
    supportedQuestionFormats: ['SYMBOLIC_INPUT', 'MULTIPLE_CHOICE', 'FREE_RESPONSE'],
    samplePromptFraming: 'Set up the objective function and constraints for the product-mix optimization model.',
    applicableCourses: ['COURSE-GEN0102', 'COURSE-BSIE3219']
  },
  CLASSIFICATION: {
    id: 'CLASSIFICATION',
    name: 'Mathematical & Physical Classification',
    description: 'Student classifies ODEs by order, linearity, and type, or classifies thermodynamic cycles and cash flow series.',
    observableStudentBehavior: 'Categorizes equations or systems into formal mathematical taxonomies (e.g., 2nd-order non-homogeneous linear ODE).',
    suitableSkillTypes: ['RECOGNITION', 'REASONING'],
    supportedQuestionFormats: ['MULTIPLE_CHOICE', 'MATCHING'],
    samplePromptFraming: 'Classify the differential equation by order, degree, and linearity.',
    applicableCourses: ['COURSE-GEN0101', 'COURSE-GEN0102', 'COURSE-GEN0107', 'COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  COMPARISON: {
    id: 'COMPARISON',
    name: 'Differential Comparison & Sensitivity',
    description: 'Student compares economic alternatives (NPV, IRR, B/C ratio) or thermodynamic cycle efficiencies.',
    observableStudentBehavior: 'Calculates performance metrics for competing alternatives and selects the optimal engineering decision.',
    suitableSkillTypes: ['REASONING', 'APPLICATION'],
    supportedQuestionFormats: ['MULTIPLE_CHOICE', 'NUMERIC_INPUT'],
    samplePromptFraming: 'Compare Alternative A and Alternative B using Present Worth Analysis and determine the preferred project.',
    applicableCourses: ['COURSE-GEN0161', 'COURSE-BSIE3219']
  },
  DESIGN_SELECTION: {
    id: 'DESIGN_SELECTION',
    name: 'Engineering Design & Licensure Synthesis',
    description: 'Student solves comprehensive multi-concept engineering problems characteristic of professional licensure examinations.',
    observableStudentBehavior: 'Synthesizes principles from engineering economy, thermodynamics, and physics to select optimal engineering components.',
    suitableSkillTypes: ['APPLICATION', 'REASONING'],
    supportedQuestionFormats: ['MULTIPLE_CHOICE', 'FREE_RESPONSE'],
    samplePromptFraming: 'Based on the thermal load and cost parameters, select the most cost-effective heat exchanger specification.',
    applicableCourses: ['COURSE-BSIE3219']
  }
};

/**
 * Authoritative Mapping of all 15 Calculus 1 Skills (Pilot Slice)
 */
export const CALCULUS_SKILL_EVIDENCE_MAP: Record<string, {
  courseId: string;
  primaryEvidence: AssessmentEvidenceTypeId;
  secondaryEvidence: AssessmentEvidenceTypeId[];
}> = {
  'SKILL-GEN0102-001': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS', 'MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0102-002': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['ERROR_ANALYSIS', 'METHOD_RECOGNITION'] },
  'SKILL-GEN0102-003': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS', 'MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0102-004': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS', 'MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0102-005': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS', 'MULTI_STEP_SOLUTION', 'APPLICATION'] },
  'SKILL-GEN0102-006': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0102-007': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0102-008': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'MULTI_STEP_SOLUTION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0102-009': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['MULTI_STEP_SOLUTION', 'ERROR_ANALYSIS', 'APPLICATION'] },
  'SKILL-GEN0102-010': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0102-011': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION', 'MULTI_STEP_SOLUTION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0102-012': { courseId: 'COURSE-GEN0102', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION', 'GRAPH_READING'] },
  'SKILL-GEN0102-013': { courseId: 'COURSE-GEN0102', primaryEvidence: 'CLASSIFICATION', secondaryEvidence: ['INTERPRETATION', 'GRAPH_READING', 'MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0102-014': { courseId: 'COURSE-GEN0102', primaryEvidence: 'MODELING', secondaryEvidence: ['APPLICATION', 'MULTI_STEP_SOLUTION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0102-015': { courseId: 'COURSE-GEN0102', primaryEvidence: 'MODELING', secondaryEvidence: ['APPLICATION', 'MULTI_STEP_SOLUTION', 'UNIT_ANALYSIS'] }
};

/**
 * Authoritative Mapping of all 71 Learning Skills across all 6 Courses to Suitable Assessment Evidence
 */
export const SIX_COURSE_SKILL_EVIDENCE_MAP: Record<string, {
  courseId: string;
  primaryEvidence: AssessmentEvidenceTypeId;
  secondaryEvidence: AssessmentEvidenceTypeId[];
}> = {
  // =========================================================================
  // COURSE: GEN 0101 (Mathematics for Engineers — 17 Skills)
  // =========================================================================
  'SKILL-GEN0101-001': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION'] },
  'SKILL-GEN0101-002': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['CLASSIFICATION'] },
  'SKILL-GEN0101-003': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['ERROR_ANALYSIS'] },
  'SKILL-GEN0101-004': { courseId: 'COURSE-GEN0101', primaryEvidence: 'MODELING', secondaryEvidence: ['APPLICATION', 'DIRECT_CALCULATION'] },
  'SKILL-GEN0101-005': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['ERROR_ANALYSIS'] },
  'SKILL-GEN0101-006': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION'] },
  'SKILL-GEN0101-007': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['ERROR_ANALYSIS'] },
  'SKILL-GEN0101-008': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['CLASSIFICATION'] },
  'SKILL-GEN0101-009': { courseId: 'COURSE-GEN0101', primaryEvidence: 'MODELING', secondaryEvidence: ['APPLICATION'] },
  'SKILL-GEN0101-010': { courseId: 'COURSE-GEN0101', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION'] },
  'SKILL-GEN0101-011': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['GRAPH_READING'] },
  'SKILL-GEN0101-012': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['CLASSIFICATION'] },
  'SKILL-GEN0101-013': { courseId: 'COURSE-GEN0101', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION'] },
  'SKILL-GEN0101-014': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION'] },
  'SKILL-GEN0101-015': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION'] },
  'SKILL-GEN0101-016': { courseId: 'COURSE-GEN0101', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION'] },
  'SKILL-GEN0101-017': { courseId: 'COURSE-GEN0101', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['GRAPH_READING'] },

  // =========================================================================
  // COURSE: GEN 0102 (Calculus 1 — 15 Skills)
  // =========================================================================
  'SKILL-GEN0102-001': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0102-002': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['ERROR_ANALYSIS', 'METHOD_RECOGNITION'] },
  'SKILL-GEN0102-003': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0102-004': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0102-005': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS', 'APPLICATION'] },
  'SKILL-GEN0102-006': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION'] },
  'SKILL-GEN0102-007': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0102-008': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0102-009': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0102-010': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION'] },
  'SKILL-GEN0102-011': { courseId: 'COURSE-GEN0102', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0102-012': { courseId: 'COURSE-GEN0102', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION', 'GRAPH_READING'] },
  'SKILL-GEN0102-013': { courseId: 'COURSE-GEN0102', primaryEvidence: 'CLASSIFICATION', secondaryEvidence: ['GRAPH_READING', 'INTERPRETATION'] },
  'SKILL-GEN0102-014': { courseId: 'COURSE-GEN0102', primaryEvidence: 'MODELING', secondaryEvidence: ['APPLICATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0102-015': { courseId: 'COURSE-GEN0102', primaryEvidence: 'MODELING', secondaryEvidence: ['APPLICATION', 'UNIT_ANALYSIS'] },

  // =========================================================================
  // COURSE: GEN 0107 (Differential Equations — 11 Skills)
  // =========================================================================
  'SKILL-GEN0107-001': { courseId: 'COURSE-GEN0107', primaryEvidence: 'CLASSIFICATION', secondaryEvidence: ['METHOD_RECOGNITION'] },
  'SKILL-GEN0107-002': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0107-003': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION'] },
  'SKILL-GEN0107-004': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION', 'MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0107-005': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION'] },
  'SKILL-GEN0107-006': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['CLASSIFICATION'] },
  'SKILL-GEN0107-007': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0107-008': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['METHOD_RECOGNITION'] },
  'SKILL-GEN0107-009': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['TABLE_INTERPRETATION'] },
  'SKILL-GEN0107-010': { courseId: 'COURSE-GEN0107', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['MULTI_STEP_SOLUTION'] },
  'SKILL-GEN0107-011': { courseId: 'COURSE-GEN0107', primaryEvidence: 'MODELING', secondaryEvidence: ['APPLICATION', 'DIRECT_CALCULATION'] },

  // =========================================================================
  // COURSE: GEN 0110 (Physics 2 for Engineers — 10 Skills)
  // =========================================================================
  'SKILL-GEN0110-001': { courseId: 'COURSE-GEN0110', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0110-002': { courseId: 'COURSE-GEN0110', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0110-003': { courseId: 'COURSE-GEN0110', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0110-004': { courseId: 'COURSE-GEN0110', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0110-005': { courseId: 'COURSE-GEN0110', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION', 'INTERPRETATION'] },
  'SKILL-GEN0110-006': { courseId: 'COURSE-GEN0110', primaryEvidence: 'APPLICATION', secondaryEvidence: ['MULTI_STEP_SOLUTION', 'ERROR_ANALYSIS'] },
  'SKILL-GEN0110-007': { courseId: 'COURSE-GEN0110', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0110-008': { courseId: 'COURSE-GEN0110', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION'] },
  'SKILL-GEN0110-009': { courseId: 'COURSE-GEN0110', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION', 'GRAPH_READING'] },
  'SKILL-GEN0110-010': { courseId: 'COURSE-GEN0110', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION', 'INTERPRETATION'] },

  // =========================================================================
  // COURSE: GEN 0161 (Thermodynamics — 8 Skills)
  // =========================================================================
  'SKILL-GEN0161-001': { courseId: 'COURSE-GEN0161', primaryEvidence: 'CLASSIFICATION', secondaryEvidence: ['EXPLANATION'] },
  'SKILL-GEN0161-002': { courseId: 'COURSE-GEN0161', primaryEvidence: 'TABLE_INTERPRETATION', secondaryEvidence: ['INTERPRETATION', 'DIRECT_CALCULATION'] },
  'SKILL-GEN0161-003': { courseId: 'COURSE-GEN0161', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0161-004': { courseId: 'COURSE-GEN0161', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0161-005': { courseId: 'COURSE-GEN0161', primaryEvidence: 'APPLICATION', secondaryEvidence: ['MULTI_STEP_SOLUTION', 'UNIT_ANALYSIS'] },
  'SKILL-GEN0161-006': { courseId: 'COURSE-GEN0161', primaryEvidence: 'COMPARISON', secondaryEvidence: ['EXPLANATION', 'DIRECT_CALCULATION'] },
  'SKILL-GEN0161-007': { courseId: 'COURSE-GEN0161', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['TABLE_INTERPRETATION', 'APPLICATION'] },
  'SKILL-GEN0161-008': { courseId: 'COURSE-GEN0161', primaryEvidence: 'APPLICATION', secondaryEvidence: ['COMPARISON', 'MULTI_STEP_SOLUTION'] },

  // =========================================================================
  // COURSE: BSIE 3219 (IE Special Topics 1 — 10 Skills)
  // =========================================================================
  'SKILL-BSIE3219-001': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION'] },
  'SKILL-BSIE3219-002': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION'] },
  'SKILL-BSIE3219-003': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'COMPARISON', secondaryEvidence: ['APPLICATION', 'DIRECT_CALCULATION'] },
  'SKILL-BSIE3219-004': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION'] },
  'SKILL-BSIE3219-005': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'COMPARISON', secondaryEvidence: ['APPLICATION', 'DESIGN_SELECTION'] },
  'SKILL-BSIE3219-006': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'DIRECT_CALCULATION', secondaryEvidence: ['APPLICATION', 'MODEL_FORMULATION'] },
  'SKILL-BSIE3219-007': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION'] },
  'SKILL-BSIE3219-008': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'APPLICATION', secondaryEvidence: ['DIRECT_CALCULATION'] },
  'SKILL-BSIE3219-009': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'DESIGN_SELECTION', secondaryEvidence: ['APPLICATION', 'COMPARISON'] },
  'SKILL-BSIE3219-010': { courseId: 'COURSE-BSIE3219', primaryEvidence: 'DESIGN_SELECTION', secondaryEvidence: ['APPLICATION', 'MULTI_STEP_SOLUTION'] }
};
