/**
 * 200 Concurrent Students Picture Mode Load Simulation Test Suite (Section 88)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { HandwritingRecognitionService } from '@/services/picture/recognitionService';

describe('Picture Mode 200 Concurrent Student Load Simulation', () => {
  beforeEach(() => {
    HandwritingRecognitionService.resetTelemetry();
    HandwritingRecognitionService.setPolicy({
      allowPictureMode: true,
      localOnlyPrivacyMode: false,
      cloudRecognitionEnabled: true,
      dailyCloudLimitPerStudent: 10,
    });
  });

  it('handles 200 concurrent student photo submissions with zero unhandled exceptions and high local-first efficiency', async () => {
    const NUM_STUDENTS = 200;
    const expressions = [
      '10(3x - 1)(3x^2 - 2x + 4)^4',
      '5(3x^2 - 2x + 4)^4',
      '2x cos(x) - x^2 sin(x)',
      '\\frac{2(x^2 + 3) - (2x + 1)(2x)}{(x^2 + 3)^2}',
      '3x^2 + 2x + 1',
    ];

    const studentTasks = Array.from({ length: NUM_STUDENTS }, async (_, i) => {
      const studentId = `student_${(i % 50) + 1}`; // 50 unique students doing 4 attempts each
      const expr = expressions[i % expressions.length];
      const dataUrl = `data:image/jpeg;base64,expr=${encodeURIComponent(expr)}_stud=${studentId}`;

      const res = await HandwritingRecognitionService.processImage(dataUrl, {
        mode: 'final_answer',
        studentId,
      });

      return {
        studentId,
        success: res.qualityPassed,
        confidence: res.result.confidence,
        provider: res.result.provider,
      };
    });

    const startTime = performance.now();
    const results = await Promise.all(studentTasks);
    const durationMs = performance.now() - startTime;

    expect(results.length).toBe(NUM_STUDENTS);
    expect(results.every((r) => r.success)).toBe(true);

    const telemetry = HandwritingRecognitionService.getTelemetry();
    expect(telemetry.totalAttempts).toBe(NUM_STUDENTS);
    expect(telemetry.localSuccesses).toBeGreaterThan(0);
    expect(telemetry.cloudRequestsAvoided).toBeGreaterThan(0);

    // Ensure processing took reasonable time (non-blocking)
    expect(durationMs).toBeLessThan(10000); // under 10 seconds for 200 submissions
  });
});
