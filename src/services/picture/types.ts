/**
 * Picture Mode / Check My Work Type Definitions
 * Establishes typed contracts for local-first image processing, multi-tier handwriting recognition,
 * confidence scoring, manual corrections, solution step traces, and telemetry tracking.
 */

import { MathNode } from '../../engine/math/ast';

export type PictureMode = 'final_answer' | 'full_solution';

export type RecognitionProviderType = 'local' | 'cloud' | 'manual';

export interface ImageQualityReport {
  isAcceptable: boolean;
  blurScore: number; // 0 (very blurry) to 100 (crisp edge variance)
  brightnessScore: number; // 0 (pitch dark) to 100 (over-exposed)
  contrastScore: number; // 0 (flat/washed) to 100 (high contrast)
  resolution: {
    width: number;
    height: number;
  };
  issues: string[];
  recommendation?: string;
}

export interface RecognizedStep {
  stepIndex: number;
  rawText: string;
  expression: string;
  confidence: number;
  ast?: MathNode;
  isConfirmed?: boolean;
  divergenceDetected?: boolean;
  status?: 'correct' | 'divergent' | 'uncertain' | 'pending';
}

export interface RecognitionResult {
  rawText: string;
  expression: string;
  confidence: number; // 0.0 to 1.0 (How confident we are in reading what was written)
  provider: RecognitionProviderType;
  modelVersion?: string;
  isMultiLine?: boolean;
  steps?: RecognizedStep[];
  warnings?: string[];
  processingTimeMs: number;
  imageHash?: string;
}

export interface PictureAttempt {
  id: string;
  studentId: string;
  problemId: string;
  concept: string;
  mode: PictureMode;
  imageHash: string;
  recognitionProvider: RecognitionProviderType;
  recognitionConfidence: number;
  recognizedExpression: string;
  manuallyCorrected: boolean;
  finalExpression: string;
  isCorrect: boolean;
  methodUsed?: string;
  mistakeCode?: string;
  processingTimeMs: number;
  createdAt: string;
}

export interface PictureTelemetry {
  totalAttempts: number;
  localSuccesses: number;
  localFailures: number;
  manualCorrections: number;
  cloudFallbacks: number;
  cloudRequestsAvoided: number;
  qualityRejections: number;
  tutorRequestsFromPhoto: number;
}

export interface PicturePolicyConfig {
  allowPictureMode: boolean;
  cloudRecognitionEnabled: boolean;
  dailyCloudLimitPerStudent: number;
  localOnlyPrivacyMode: boolean;
  experimentalFullSolution: boolean;
}

export const DEFAULT_PICTURE_POLICY: PicturePolicyConfig = {
  allowPictureMode: true,
  cloudRecognitionEnabled: true,
  dailyCloudLimitPerStudent: 10,
  localOnlyPrivacyMode: false,
  experimentalFullSolution: true,
};
