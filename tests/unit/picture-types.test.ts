/**
 * Picture Mode Domain Types & Defaults Test Suite (Section 80)
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PICTURE_POLICY,
  PictureAttempt,
  RecognitionResult,
  ImageQualityReport,
} from '@/services/picture/types';

describe('Picture Mode Domain Types & Contracts', () => {
  it('defines default institutional picture policy with local preference', () => {
    expect(DEFAULT_PICTURE_POLICY.allowPictureMode).toBe(true);
    expect(DEFAULT_PICTURE_POLICY.cloudRecognitionEnabled).toBe(true);
    expect(DEFAULT_PICTURE_POLICY.dailyCloudLimitPerStudent).toBe(10);
    expect(DEFAULT_PICTURE_POLICY.localOnlyPrivacyMode).toBe(false);
    expect(DEFAULT_PICTURE_POLICY.experimentalFullSolution).toBe(true);
  });

  it('validates shape of RecognitionResult without requiring raw image storage', () => {
    const result: RecognitionResult = {
      rawText: '10(3x-1)(3x^2-2x+4)^4',
      expression: '10(3x-1)(3x^2-2x+4)^4',
      confidence: 0.95,
      provider: 'local',
      processingTimeMs: 14,
      imageHash: 'img_abc123_hash',
    };

    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1.0);
    expect(result.provider).toBe('local');
    expect((result as any).originalImageData).toBeUndefined(); // image not stored
  });

  it('validates shape of ImageQualityReport', () => {
    const report: ImageQualityReport = {
      isAcceptable: true,
      blurScore: 82,
      brightnessScore: 68,
      contrastScore: 74,
      resolution: { width: 1280, height: 720 },
      issues: [],
    };

    expect(report.isAcceptable).toBe(true);
    expect(report.blurScore).toBe(82);
    expect(report.issues.length).toBe(0);
  });

  it('validates shape of PictureAttempt telemetry record', () => {
    const attempt: PictureAttempt = {
      id: 'att_123',
      studentId: 'student_456',
      problemId: 'prob_789',
      concept: 'Chain Rule',
      mode: 'final_answer',
      imageHash: 'hash_999',
      recognitionProvider: 'local',
      recognitionConfidence: 0.92,
      recognizedExpression: '10(3x-1)(3x^2-2x+4)^4',
      manuallyCorrected: false,
      finalExpression: '10(3x-1)(3x^2-2x+4)^4',
      isCorrect: true,
      processingTimeMs: 18,
      createdAt: new Date().toISOString(),
    };

    expect(attempt.manuallyCorrected).toBe(false);
    expect(attempt.isCorrect).toBe(true);
  });
});
