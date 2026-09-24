/**
 * Manual Student Correction Provider (Tier 2)
 * Handles student confirmations and edits via MathInput with 100% confidence and zero network requests.
 */

import { IHandwritingRecognitionProvider } from './types';
import { PictureMode, RecognitionResult } from '../types';
import { MathConversionService } from '../mathConversionService';

export class ManualRecognitionProvider implements IHandwritingRecognitionProvider {
  public readonly name = 'Student Manual Edit & Confirmation';
  public readonly type = 'manual' as const;

  public async isAvailable(): Promise<boolean> {
    return true;
  }

  public async recognizeExpression(
    studentInputString: string,
    mode: PictureMode = 'final_answer'
  ): Promise<RecognitionResult> {
    const startTime = performance.now();
    const isMultiLine = mode === 'full_solution' || studentInputString.includes('\n');
    const conversion = MathConversionService.convertToAST(studentInputString);

    const steps = isMultiLine
      ? studentInputString
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((line, idx) => {
            const conv = MathConversionService.convertToAST(line.replace(/^\d+[\.\)]\s*/, ''));
            return {
              stepIndex: idx + 1,
              rawText: line,
              expression: conv.normalizedExpression || line,
              confidence: 1.0,
              ast: conv.ast,
              isConfirmed: true,
              status: conv.success ? ('correct' as const) : ('uncertain' as const),
            };
          })
      : undefined;

    return {
      rawText: studentInputString,
      expression: conversion.normalizedExpression || studentInputString,
      confidence: 1.0, // Full student verification
      provider: 'manual',
      isMultiLine,
      steps,
      warnings: conversion.warnings.length > 0 ? conversion.warnings : undefined,
      processingTimeMs: Math.round(performance.now() - startTime),
    };
  }
}
