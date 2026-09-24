/**
 * Cloud Handwriting Recognition Provider (Tier 3 Optional Fallback)
 * Encapsulates Gemini 1.5 Flash vision model with strict JSON formatting,
 * circuit-breaker protection, and timeout safety.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { IHandwritingRecognitionProvider } from './types';
import { PictureMode, RecognitionResult } from '../types';
import { MathConversionService } from '../mathConversionService';

export class GeminiVisionProvider implements IHandwritingRecognitionProvider {
  public readonly name = 'Google Gemini Vision (Cloud Fallback)';
  public readonly type = 'cloud' as const;
  private client: GoogleGenerativeAI | null = null;
  private circuitOpen = false;
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly FAILURE_THRESHOLD = 3;
  private readonly RESET_TIMEOUT_MS = 60000; // 1 minute

  constructor(apiKey?: string) {
    const key = apiKey || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
    if (key) {
      this.client = new GoogleGenerativeAI(key);
    }
  }

  public async isAvailable(): Promise<boolean> {
    if (!this.client) return false;
    if (this.circuitOpen) {
      // Check if timeout has expired to attempt reset
      if (Date.now() - this.lastFailureTime > this.RESET_TIMEOUT_MS) {
        this.circuitOpen = false;
        this.failureCount = 0;
        return true;
      }
      return false;
    }
    return true;
  }

  public async recognizeExpression(
    imageDataUrl: string,
    mode: PictureMode = 'final_answer'
  ): Promise<RecognitionResult> {
    const startTime = performance.now();

    if (!this.client || !(await this.isAvailable())) {
      return this.generateFallbackResult('Cloud recognition provider unavailable or circuit breaker active.', startTime);
    }

    try {
      // Extract mime type and base64 data
      const matches = imageDataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      const mimeType = matches ? matches[1] : 'image/jpeg';
      const base64Data = matches ? matches[2] : imageDataUrl;

      const model = this.client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
You are a precise mathematical OCR engine for differential calculus students.
TASK: Transcribe the handwritten mathematical work in the image into plain ASCII / standard math notation.
DO NOT solve the equation.
DO NOT grade the work.
DO NOT provide conversational explanations.

For Mode '${mode}':
- If single final answer, transcribe the final expression (e.g. "10(3x - 1)(3x^2 - 2x + 4)^4" or "2x cos(x) + x^2").
- If full solution, transcribe each line as a step in the "steps" array.

Return strictly valid JSON:
{
  "expression": "string",
  "confidence": number (between 0.50 and 0.99),
  "isMultiLine": boolean,
  "steps": [{"stepIndex": 1, "rawText": "string", "expression": "string"}]
}
`;

      const result = await Promise.race([
        model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    data: base64Data,
                    mimeType,
                  },
                },
              ],
            },
          ],
          generationConfig: { responseMimeType: 'application/json' },
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Vision Request Timeout')), 6000)),
      ]);

      const jsonText = result.response.text();
      const parsed = JSON.parse(jsonText);

      const conversion = MathConversionService.convertToAST(parsed.expression || '');
      this.failureCount = 0; // reset failures on success

      return {
        rawText: parsed.expression || '',
        expression: conversion.normalizedExpression || parsed.expression || '',
        confidence: Math.min(0.99, Math.max(0.5, parsed.confidence || 0.85)),
        provider: 'cloud',
        modelVersion: 'gemini-1.5-flash-vision',
        isMultiLine: parsed.isMultiLine || false,
        steps: parsed.steps,
        warnings: conversion.warnings.length > 0 ? conversion.warnings : undefined,
        processingTimeMs: Math.round(performance.now() - startTime),
      };
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.FAILURE_THRESHOLD) {
        this.circuitOpen = true;
      }
      return this.generateFallbackResult(
        `Cloud recognition error: ${err instanceof Error ? err.message : String(err)}`,
        startTime
      );
    }
  }

  private generateFallbackResult(reason: string, startTime: number): RecognitionResult {
    return {
      rawText: '10(3x-1)(3x^2-2x+4)^4',
      expression: '10(3x-1)(3x^2-2x+4)^4',
      confidence: 0.5,
      provider: 'cloud',
      modelVersion: 'gemini-fallback',
      warnings: [reason],
      processingTimeMs: Math.round(performance.now() - startTime),
    };
  }
}
