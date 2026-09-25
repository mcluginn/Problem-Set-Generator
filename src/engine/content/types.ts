/**
 * Content Engine & Problem Family Domain Types
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import { MathNode } from '../math/ast';
import { SolutionStep } from '../math/steps';
import { SkillType, EvidenceType as CurriculumEvidenceType } from '../curriculum/types';

export type CourseScopeId =
  | 'COURSE-GEN0101'
  | 'COURSE-GEN0102'
  | 'COURSE-GEN0107'
  | 'COURSE-GEN0110'
  | 'COURSE-GEN0161'
  | 'COURSE-BSIE3219'
  | 'COURSE-CTR0301'
  | 'ALL_COURSES';

export type CourseReadinessStatus =
  | 'ARCHITECTURE_READY'
  | 'PILOT'
  | 'CALIBRATING'
  | 'REPRESENTATIVE_READY'
  | 'TEACHER_REVIEWED'
  | 'SCALE_READY'
  | 'PARTIALLY_IMPLEMENTED'
  | 'CONTENT_REVIEW'
  | 'READY_FOR_SCALE';

export type DomainValidatorType =
  | 'MATH'
  | 'ODE'
  | 'PHYSICS'
  | 'THERMODYNAMICS'
  | 'MATH_FOR_ENGINEERS'
  | 'IE_SPECIAL_TOPICS';

export type DomainValidationStatus = 'PASS' | 'FAIL' | 'UNABLE_TO_VERIFY';

export interface ValidationCheck {
  name: string;
  passed: boolean;
  description: string;
  details?: string;
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
}

export interface DomainValidationResult {
  valid: boolean;
  status: DomainValidationStatus;
  domainValidatorType: DomainValidatorType;
  rejectionReason?: RejectionReason;
  rejectionMessage?: string;
  checks: ValidationCheck[];
  errors: ValidationError[];
  warnings: ValidationWarning[];
  domainChecks?: Record<string, boolean>; // backward compatibility
  isValid?: boolean; // backward compatibility
}

export interface PhysicalQuantity {
  value: number;
  unit: string;
  dimension?: 'PRESSURE' | 'CURRENT' | 'VOLTAGE' | 'RESISTANCE' | 'FORCE' | 'ENERGY' | 'TEMPERATURE' | 'LENGTH' | 'TIME' | 'MASS' | 'DIMENSIONLESS';
}

export type AssessmentEvidenceTypeId =
  | 'DIRECT_CALCULATION'
  | 'METHOD_RECOGNITION'
  | 'MULTI_STEP_SOLUTION'
  | 'ERROR_ANALYSIS'
  | 'APPLICATION'
  | 'INTERPRETATION'
  | 'EXPLANATION'
  | 'GRAPH_READING'
  | 'TABLE_INTERPRETATION'
  | 'UNIT_ANALYSIS'
  | 'MODELING'
  | 'MODEL_FORMULATION'
  | 'CLASSIFICATION'
  | 'COMPARISON'
  | 'DESIGN_SELECTION';

export type QuestionFormat =
  | 'FREE_RESPONSE'
  | 'SYMBOLIC_INPUT'
  | 'MULTIPLE_CHOICE'
  | 'NUMERIC_INPUT'
  | 'MATCHING'
  | 'TRUE_FALSE'
  | 'ERROR_ANALYSIS'
  | 'IMAGE_WORK'
  | 'MULTI_STEP'
  | 'TABLE_INPUT'
  | 'GRAPH_MATCHING';

export type ContentRepresentationType =
  | 'SYMBOLIC'
  | 'NUMERIC'
  | 'GRAPHICAL'
  | 'TABULAR'
  | 'VERBAL'
  | 'PHYSICAL'
  | 'ENGINEERING_CONTEXT'
  | 'SCHEMATIC_DIAGRAM';

export type ContentContextType =
  | 'PURE_MATHEMATICS'
  | 'PHYSICS'
  | 'ENGINEERING'
  | 'THERMODYNAMICS'
  | 'CIRCUITS'
  | 'KINEMATICS'
  | 'MECHANICS'
  | 'FLUID_STATICS'
  | 'HEAT_TRANSFER'
  | 'ENGINEERING_ECONOMY'
  | 'INDUSTRIAL_ENGINEERING'
  | 'GENERAL_ENGINEERING'
  | 'WORD_PROBLEM'
  | 'ABSTRACT'
  | 'LICENSURE_STYLE';

export type DifferentialEquationOrder = 1 | 2 | 'HIGHER';
export type DifferentialEquationLinearity = 'LINEAR' | 'NON_LINEAR' | 'MAY_BE_NONLINEAR';
export type DifferentialEquationHomogeneity = 'HOMOGENEOUS' | 'NON_HOMOGENEOUS' | 'NOT_APPLICABLE';
export type DifferentialEquationCoefficientType = 'CONSTANT' | 'VARIABLE' | 'NOT_APPLICABLE';

export type DifferentialEquationMethod =
  | 'SUBSTITUTION_Y_EQUALS_VX'
  | 'CHARACTERISTIC_EQUATION'
  | 'SEPARATION_OF_VARIABLES'
  | 'INTEGRATING_FACTOR'
  | 'EXACT_POTENTIAL_FUNCTION'
  | 'BERNOULLI_LINEARIZING_SUBSTITUTION'
  | 'LAPLACE_TRANSFORM'
  | 'INVERSE_LAPLACE_PARTIAL_FRACTION'
  | 'ELIMINATION_OF_ARBITRARY_CONSTANTS'
  | 'SYSTEM_OF_ODES_LAPLACE'
  | 'CLASSIFICATION_TAXONOMY'
  | 'POWER_SERIES'
  | 'UNDETERMINED_COEFFICIENTS'
  | 'VARIATION_OF_PARAMETERS';

export type PedagogicalTaskType =
  | 'SOLVE_GENERAL_SOLUTION'
  | 'SOLVE_INITIAL_VALUE_PROBLEM'
  | 'REARRANGE_AND_SOLVE'
  | 'SELECT_OPTIMAL_SUBSTITUTION'
  | 'VERIFY_SOLUTION'
  | 'ANALYZE_HOMOGENEITY_DEGREE'
  | 'IDENTIFY_ERROR'
  | 'CALCULATE_THRESHOLD_TIME'
  | 'MODEL_AND_SOLVE'
  | 'FORMULATE_ODE';

export type ProblemArchetypeCategory =
  | 'DIRECT_RATIO_STANDARD'
  | 'DIFFERENTIAL_FORM_REARRANGEMENT'
  | 'MONOMIAL_DUAL_SUBSTITUTION'
  | 'PARTIAL_FRACTION_DECOMPOSITION'
  | 'INVERSE_TRIGONOMETRIC_FORM'
  | 'TRANSCENDENTAL_FORM'
  | 'INITIAL_VALUE_PROBLEM'
  | 'EULER_HOMOGENEITY_DEGREE'
  | 'SOLUTION_VERIFICATION'
  | 'ERROR_ANALYSIS_SUBSTITUTION'
  | 'STANDARD_COMPUTATION'
  | 'APPLICATION_MIXING_CONSTANT_VOLUME'
  | 'APPLICATION_MIXING_VARIABLE_VOLUME'
  | 'APPLICATION_MIXING_THRESHOLD_TIME'
  | 'APPLICATION_MIXING_DILUTION_WASHOUT'
  | 'APPLICATION_MIXING_WASHOUT_TIME'
  | 'APPLICATION_COOLING_CONSTANT_AMBIENT'
  | 'APPLICATION_COOLING_TWO_POINT_RATE'
  | 'APPLICATION_COOLING_TIME_TARGET'
  | 'APPLICATION_HEATING_CONSTANT_AMBIENT'
  | 'APPLICATION_HEATING_TIME_TARGET'
  | 'APPLICATION_GROWTH_DECAY_HALF_LIFE'
  | 'APPLICATION_GROWTH_MALTHUSIAN'
  | 'APPLICATION_GROWTH_DOUBLING_TIME'
  | 'APPLICATION_ORTHOGONAL_TRAJECTORIES';

export type ProblemArchetypeId =
  | 'ARCH-HOMO-DIRECT-RATIO'
  | 'ARCH-HOMO-DIFF-FORM'
  | 'ARCH-HOMO-DUAL-SUB'
  | 'ARCH-HOMO-PARTIAL-FRAC'
  | 'ARCH-HOMO-INVERSE-TRIG'
  | 'ARCH-HOMO-TRANSCENDENTAL'
  | 'ARCH-HOMO-IVP'
  | 'ARCH-HOMO-DEGREE-TEST'
  | 'ARCH-HOMO-VERIFY'
  | 'ARCH-APP-MIXING-CONSTANT-VOL'
  | 'ARCH-APP-MIXING-THRESHOLD-TIME'
  | 'ARCH-APP-MIXING-VARIABLE-VOL'
  | 'ARCH-APP-MIXING-PURE-FLUSH'
  | 'ARCH-APP-MIXING-WASHOUT-TIME'
  | 'ARCH-APP-COOLING-CONSTANT-AMBIENT'
  | 'ARCH-APP-COOLING-TIME-TARGET'
  | 'ARCH-APP-COOLING-TWO-POINT'
  | 'ARCH-APP-HEATING-CONSTANT-AMBIENT'
  | 'ARCH-APP-HEATING-TIME-TARGET'
  | 'ARCH-APP-DECAY-HALF-LIFE'
  | 'ARCH-APP-POPULATION-GROWTH-IVP'
  | 'ARCH-APP-POPULATION-DOUBLING'
  | 'ARCH-APP-ORTHOGONAL-ALGEBRAIC'
  | string;

export interface PedagogicalSourceMetadata {
  sourceTitle: string;
  author?: string;
  chapterOrSpread?: string;
  structuralPrinciple: string;
  archetypeCategory: ProblemArchetypeCategory;
  archetypeId: ProblemArchetypeId;
  copyrightNote?: string;
}

export interface ASTStructuralFingerprint {
  operatorShape: string;
  treeDepth: number;
  nodeCount: number;
  operatorHistogram: Record<string, number>;
  taskType: PedagogicalTaskType;
  archetypeId?: ProblemArchetypeId;
  representation: ContentRepresentationType;
  normalizedHash: string;
  // Application Problem Dimensions for Fine-Grained Diversity
  applicationDomain?: 'MIXING_TANK' | 'COOLING_HEATING' | 'GROWTH_DECAY' | 'ORTHOGONAL_TRAJECTORIES';
  physicalConfiguration?: string;
  governingModel?: string;
  unknownTarget?: string;
}

export interface ConceptMethodMetadata {
  conceptId: string;
  order?: DifferentialEquationOrder;
  linearity?: DifferentialEquationLinearity;
  homogeneity?: DifferentialEquationHomogeneity;
  coefficientType?: DifferentialEquationCoefficientType;
  expectedMethod?: DifferentialEquationMethod | string;
  subtopicId?: string;
  validAlternativeMethods?: string[];
  disallowedMethods?: string[];
  disallowedKeywords?: string[];
}

export type GuidednessLevel =
  | 'HIGHLY_GUIDED'
  | 'GUIDED'
  | 'STANDARD'
  | 'LOW_GUIDANCE'
  | 'EXAM_STYLE';

export type ProblemLifecycleStatus =
  | 'DRAFT'
  | 'VALIDATING'
  | 'VALID'
  | 'AWAITING_TEACHER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ARCHIVED';

export type RejectionReason =
  | 'INVALID_DOMAIN'
  | 'INVALID_SYNTAX'
  | 'INVALID_ANSWER'
  | 'SKILL_MISMATCH'
  | 'CONCEPT_MISMATCH'
  | 'METHOD_MISMATCH'
  | 'EVIDENCE_MISMATCH'
  | 'DIFFICULTY_MISMATCH'
  | 'DUPLICATE'
  | 'NEAR_DUPLICATE'
  | 'SOLUTION_MISMATCH'
  | 'DISTRACTOR_INVALID'
  | 'PHYSICAL_IMPLAUSIBILITY'
  | 'THERMODYNAMIC_INCONSISTENCY'
  | 'UNIT_DIMENSION_MISMATCH';

export interface DifficultyVector {
  overall: number;       // 1 (Beginner) to 5 (Mastery)
  conceptual: number;    // 1 to 5
  procedural: number;    // 1 to 5
  computational: number; // 1 to 5
  reasoning: number;     // 1 to 5
  representation: number;// 1 to 5
  context: number;       // 1 to 5
  multiStep: number;     // 1 to 5
}

export interface AssessmentEvidenceDefinition {
  id: AssessmentEvidenceTypeId;
  name: string;
  description: string;
  observableStudentBehavior: string;
  suitableSkillTypes: SkillType[];
  supportedQuestionFormats: QuestionFormat[];
  samplePromptFraming: string;
  applicableCourses: CourseScopeId[];
}

export interface StructuredReasoningTraceStep {
  stepIndex: number;
  phase: 'RECOGNITION' | 'DECOMPOSITION' | 'FORMULA_SELECTION' | 'EXECUTION' | 'SIMPLIFICATION' | 'INTERPRETATION' | 'VERIFICATION';
  actionDescription: string;
  intermediateExpressionLatex?: string;
  pedagogicalRationale: string;
}

export interface StructuredHint {
  level: 1 | 2 | 3 | 4 | 5;
  category: 'RECOGNITION' | 'DIRECTION' | 'FORMULA' | 'SETUP' | 'GUIDED_CALCULATION';
  text: string;
  hintLatex?: string;
  revealsFinalAnswer: boolean;
}

export interface ProblemDistractor {
  id: string;
  distractorLatex: string;
  distractorRaw: string;
  targetedMisconceptionCode?: string;
  pedagogicalExplanation: string;
  isPlausible: boolean;
}

export interface ProblemDNA {
  problemId: string;
  courseId: string;
  topicId: string;
  subtopicId: string;
  primarySkillId: string;
  supportingSkillIds: string[];
  evidenceType: AssessmentEvidenceTypeId;
  familyId: string;
  templateId: string;
  representationType: ContentRepresentationType;
  contextType: ContentContextType;
  guidedness: GuidednessLevel;
  difficultyVector: DifficultyVector;
  structureSignature: string;
  misconceptionTarget?: string;
  isRemediationRepetition?: boolean;
  isCompositeCrossCourse?: boolean;
  domainValidatorType: DomainValidatorType;
  // Task Type & Archetype Layer (Castro Reference Integration)
  taskType?: PedagogicalTaskType;
  archetypeId?: ProblemArchetypeId;
  sourceMetadata?: PedagogicalSourceMetadata;
  structuralFingerprint?: ASTStructuralFingerprint;
  // Concept & Method Alignment Metadata
  conceptId?: string;
  order?: DifferentialEquationOrder;
  linearity?: DifferentialEquationLinearity;
  homogeneity?: DifferentialEquationHomogeneity;
  coefficientType?: DifferentialEquationCoefficientType;
  expectedMethod?: DifferentialEquationMethod | string;
  learningObjective?: string;
  // Structural Problem Identity Layer (780 Master Bank & Parameter Variation)
  source?: 'MASTER_BANK_780' | 'EXISTING_GENERATOR' | 'LEGACY_GOLDEN' | 'OTHER';
  masterProblemId?: string;
  skillClusterId?: string;
  unitId?: string;
  problemFamilyId?: string;
  isParameterVariation?: boolean;
  curriculumVersion: string;
  skillOntologyVersion: string;
  generatorVersion: string;
  templateVersion: string;
  validatorVersion: string;
}

export interface ValidatedProblem {
  dna: ProblemDNA;
  source?: 'MASTER_BANK_780' | 'EXISTING_GENERATOR' | 'LEGACY_GOLDEN' | 'OTHER';
  masterProblemId?: string;
  skillClusterId?: string;
  problemFamilyId?: string;
  isParameterVariation?: boolean;
  statement: {
    promptText: string;
    expressionLatex: string;
    targetVariable: string;
    independentVariable: string;
    contextStory?: string;
    givenWorkLatex?: string;       // Specifically for ERROR_ANALYSIS evidence
    options?: ProblemDistractor[]; // For MULTIPLE_CHOICE or MCQ_RECOGNITION
    physicalUnits?: string;        // For Physics/Thermo/Engineering problems
  };
  rawExpression: MathNode;
  solution: {
    canonicalAnswerLatex: string;
    canonicalAnswerRaw: string;
    reasoningTrace: StructuredReasoningTraceStep[];
    solutionSteps: SolutionStep[];
    whyMethodRequired: string;
    engineeringInterpretation?: string;
  };
  hints: StructuredHint[];
  acceptedEquivalents?: string[];
  structuralProgression?: string;
  commonMistake?: string;
  topicTitle?: string;
  qualityScore: {
    mathematicalValidity: number;  // 0 to 1
    skillAlignment: number;        // 0 to 1
    evidenceAlignment: number;     // 0 to 1
    hintIntegrity: number;         // 0 to 1
    overallQuality: number;        // 0 to 1
  };
  lifecycleStatus: ProblemLifecycleStatus;
  distractors?: ProblemDistractor[];
  createdAt: string;
}

export interface MasterBank780Problem {
  id: string;
  masterProblemId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  unitId: string;
  unitCode: string;
  clusterId: string;
  skillClusterId: string;
  problemFamilyId: string;
  skillId: string;
  difficulty: 1 | 2 | 3;
  difficultyLabel: string;
  structuralProgression: string;
  topic: string;
  statement: string;
  statementNormalized?: string;
  expressionLatex?: string;
  derivationSteps: string[];
  derivationStepsNormalized?: string[];
  canonicalAnswer: string;
  canonicalAnswerLatex?: string;
  acceptedEquivalents: string[];
  recognitionHint: string;
  recognitionHintNormalized?: string;
  setupHint: string;
  setupHintNormalized?: string;
  commonMistake: string;
  commonMistakeNormalized?: string;
}

export interface GoldenMasterProblem {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  unitId: string;
  unitCode: string;
  clusterId: string;
  skillId: string;
  difficulty: 1 | 2 | 3;
  difficultyLabel: string;
  structuralProgression: string;
  topic: string;
  statement: string;
  derivationSteps: string[];
  canonicalAnswer: string;
  acceptedEquivalents: string[];
  recognitionHint: string;
  setupHint: string;
  commonMistake: string;
}

export interface ProblemFamily {
  id: string;
  courseId: string;
  primarySkillId: string;
  supportingSkillIds: string[];
  name: string;
  description: string;
  purpose: string; // Educational justification: why this family exists
  primaryEvidenceType: AssessmentEvidenceTypeId;
  secondaryEvidenceTypes: AssessmentEvidenceTypeId[];
  supportedFormats: QuestionFormat[];
  representationTypes: ContentRepresentationType[];
  allowedContexts: ContentContextType[];
  difficultyRange: [number, number];
  misconceptionTargets: string[];
  prerequisiteRequirements: string[];
  templateIds: string[];
  domainValidatorType: DomainValidatorType;
  taskType?: PedagogicalTaskType;
  archetypeId?: ProblemArchetypeId;
  sourceMetadata?: PedagogicalSourceMetadata;
  conceptId?: string;
  conceptMetadata?: ConceptMethodMetadata;
  status: 'ACTIVE' | 'DRAFT' | 'REPRESENTATIVE_DRAFT';
}

export interface ParameterSchemaField {
  name: string;
  type: 'INTEGER' | 'FLOAT' | 'RATIONAL' | 'POLYNOMIAL_DEGREE' | 'CHOICE' | 'BOOLEAN' | 'PHYSICAL_PROPERTY';
  min?: number;
  max?: number;
  choices?: string[] | number[];
  disallowedValues?: number[];
  defaultValue?: any;
  units?: string;
  description: string;
}

export interface ProblemTemplate {
  id: string;
  familyId: string;
  courseId: string;
  primarySkillId: string;
  name: string;
  description: string;
  taskType?: PedagogicalTaskType;
  archetypeId?: ProblemArchetypeId;
  sourceMetadata?: PedagogicalSourceMetadata;
  conceptId?: string;
  conceptMetadata?: ConceptMethodMetadata;
  parameterSchema: ParameterSchemaField[];
  generateCandidate(difficulty: number, params?: Record<string, any>): {
    statement: ValidatedProblem['statement'];
    rawExpression: MathNode;
    reasoningTrace: StructuredReasoningTraceStep[];
    hints: StructuredHint[];
    distractors?: ProblemDistractor[];
    difficultyVector: DifficultyVector;
    structureSignature: string;
    supportingSkillIds?: string[];
    misconceptionTarget?: string;
    conceptMetadata?: ConceptMethodMetadata;
    taskType?: PedagogicalTaskType;
    archetypeId?: ProblemArchetypeId;
    sourceMetadata?: PedagogicalSourceMetadata;
    structuralFingerprint?: ASTStructuralFingerprint;
  };
}

export interface ProblemGenerationRequest {
  courseId: string;
  topicId?: string;
  subtopicId?: string;
  skillId: string;
  conceptId?: string;
  expectedMethod?: DifferentialEquationMethod | string;
  evidenceType?: AssessmentEvidenceTypeId;
  familyId?: string;
  templateId?: string;
  difficulty?: number | DifficultyVector;
  guidedness?: GuidednessLevel;
  representation?: ContentRepresentationType;
  context?: ContentContextType;
  misconceptionTarget?: string;
  isRemediationRepetition?: boolean;
  excludeProblemIds?: string[];
  excludeSignatures?: string[];
  taskType?: PedagogicalTaskType;
  archetypeId?: ProblemArchetypeId;
  excludeArchetypeIds?: string[];
  maxStructuralSimilarity?: number;
  previousProblems?: ValidatedProblem[];
  masterProblemId?: string;
  skillClusterId?: string;
  problemFamilyId?: string;
  params?: Record<string, any>;
}

export interface ProblemGenerationResult {
  success: boolean;
  problem?: ValidatedProblem;
  rejectionReason?: RejectionReason;
  rejectionDetails?: string;
  attemptsCount: number;
  generationLatencyMs: number;
}

export interface CourseContentReadiness {
  courseId: string;
  courseCode: string;
  courseName: string;
  totalTopics: number;
  totalSubtopics: number;
  totalSkills: number;
  mappedEvidenceCount: number;
  registeredFamiliesCount: number;
  registeredTemplatesCount: number;
  calibratedProblemsCount: number;
  status: CourseReadinessStatus;
  statusLabel: string;
}
