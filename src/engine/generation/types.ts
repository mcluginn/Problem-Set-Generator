/**
 * Problem Engine Types & DNA Schemas
 */

import { MathNode } from '../math/ast';
import { SolutionStep } from '../math/steps';

export type RepresentationType =
  | 'Symbolic'
  | 'WordProblem'
  | 'Kinematics'
  | 'ErrorAnalysis'
  | 'Conceptual'
  | 'TangentLine';

export type ContextType =
  | 'PureMath'
  | 'Physics'
  | 'MechanicalEngineering'
  | 'ElectricalEngineering';

export interface DifficultyMetrics {
  overall: number;       // 1 (Beginner) to 5 (Master)
  conceptual: number;    // 1 to 5
  computational: number; // 1 to 5
  procedural: number;    // 1 to 5
  reasoning: number;     // 1 to 5
}

export interface StandardHint {
  level: 1 | 2 | 3 | 4 | 5;
  category: 'Recognition' | 'Direction' | 'Formula' | 'Setup' | 'GuidedCalculation';
  text: string;
  hintLatex?: string;
}

export interface ProblemDNA {
  id: string;
  subject: string;
  topic: string;
  concept: string;
  subConcept?: string;
  familyId: string;
  templateId: string;
  representationType: RepresentationType;
  contextType: ContextType;
  guidednessLevel: 1 | 2 | 3 | 4;
  difficulty: DifficultyMetrics;
  structureSignature: string;
  requiredSkills: string[];
  targetedMisconceptions: string[];
  generationVersion: string;
  validatorVersion: string;
}

export interface GeneratedProblem {
  dna: ProblemDNA;
  statement: {
    promptText: string;
    expressionLatex: string;
    targetVariable: string;
    independentVariable: string;
    contextDescription?: string;
    givenWorkLatex?: string; // For ErrorAnalysis problems
  };
  rawExpression: MathNode;
  solution: {
    canonicalAnswerLatex: string;
    canonicalAnswerRaw: string;
    steps: SolutionStep[];
    whyMethodRequired: string;
  };
  hints: StandardHint[];
  lifecycleStatus: 'GENERATED' | 'VALIDATING' | 'VALID' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  createdAt: string;
}

export interface ProblemSpecification {
  concept: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Adaptive' | number;
  representationType?: RepresentationType;
  contextType?: ContextType;
  guidednessLevel?: 1 | 2 | 3 | 4;
  recentSignatures?: string[];
  remediationMisconception?: string;
}

export interface ProblemFamily {
  id: string;
  concept: string;
  name: string;
  description: string;
  representationType: RepresentationType;
  contextType: ContextType;
  difficultyRange: [number, number];
  requiredSkills: string[];
  targetedMisconceptions: string[];
  generate(difficultyLevel: number): {
    statement: GeneratedProblem['statement'];
    rawExpression: MathNode;
    structureSignature: string;
    difficulty: DifficultyMetrics;
    hints: StandardHint[];
  };
}
