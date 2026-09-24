/**
 * AI Service Provider Abstraction & Contracts
 * Establishes typed context definitions for tutoring, hints, explanations, and misconception diagnosis.
 */

import { SolutionStep } from '../../engine/math/steps';

export interface AIContext {
  subject: string;
  topic: string;
  concept: string;
  problemPrompt?: string;
  expressionLatex: string;
  verifiedAnswerLatex: string;
  whyMethodRequired?: string;
  solutionSteps?: SolutionStep[];
  studentAnswerRaw?: string;
  mistakeClassification?: string;
  mistakeDiagnosis?: string;
  mistakeConfidence?: number;
  currentHintLevel?: number;
  currentStepNumber?: number;
  hints?: Array<{ level: number; text: string; mathematicalFocus?: string }>;
  engineeringInterpretation?: string;
  physicalUnits?: string;
  commonMistake?: string;
}

export type TutorIntent =
  | 'why_method'
  | 'inner_function'
  | 'inner_derivative'
  | 'quotient_denominator_squared'
  | 'explain_step'
  | 'explain_mistake'
  | 'give_hint'
  | 'simplify_explanation'
  | 'similar_example'
  | 'concept_explanation'
  | 'formula_query'
  | 'term_origin'
  | 'how_to_start'
  | 'general';

export interface TutorContext {
  problemId?: string;
  problemPrompt?: string;
  subject: string;
  topic: string;
  concept: string;
  skill?: string;
  expressionLatex: string;
  verifiedAnswerLatex: string;
  whyMethodRequired?: string;
  solutionSteps?: SolutionStep[];
  studentAnswerRaw?: string;
  mistakeClassification?: string;
  mistakeDiagnosis?: string;
  mistakeConfidence?: number;
  currentStepNumber?: number;
  currentHintLevel?: number;
  studentQuestion: string;
  intent?: TutorIntent;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; text: string }>;
  hints?: Array<{ level: number; text: string; mathematicalFocus?: string }>;
  engineeringInterpretation?: string;
  physicalUnits?: string;
  commonMistake?: string;
}

export interface IAIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateExplanation(context: AIContext): Promise<string>;
  generateContextualHint(context: AIContext, level: number): Promise<string>;
  diagnoseMistake(
    context: AIContext,
    studentAnswer: string
  ): Promise<{ diagnosis: string; guidanceTip: string }>;
  answerTutorQuestion(
    context: TutorContext | AIContext,
    userQuestion: string,
    history?: Array<{ role: 'user' | 'assistant'; text: string }>
  ): Promise<string>;
}
