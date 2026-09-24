/**
 * Picture Cache & Deduplication Test Suite (Section 84)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { HandwritingRecognitionService } from '@/services/picture/recognitionService';

describe('Picture Cache & Deduplication Engine', () => {
  beforeEach(() => {
    HandwritingRecognitionService.resetTelemetry();
  });

  it('avoids redundant processing on duplicate image submissions via hash caching', async () => {
    const fakeDataUrl = 'data:image/jpeg;base64,distinct_image_payload_abc123';

    // First attempt: processes and caches
    const res1 = await HandwritingRecognitionService.processImage(fakeDataUrl, {
      studentId: 'student_1',
    });
    expect(res1.cached).toBe(false);

    // Second attempt: hits cache
    const res2 = await HandwritingRecognitionService.processImage(fakeDataUrl, {
      studentId: 'student_1',
    });
    expect(res2.cached).toBe(true);
    expect(res2.result.expression).toBe(res1.result.expression);

    // Verify telemetry recorded avoided request
    const telemetry = HandwritingRecognitionService.getTelemetry();
    expect(telemetry.totalAttempts).toBe(2);
    expect(telemetry.cloudRequestsAvoided).toBeGreaterThanOrEqual(1);
  });

  it('resets cache and telemetry cleanly when requested', async () => {
    const fakeDataUrl = 'data:image/jpeg;base64,sample_for_reset';
    await HandwritingRecognitionService.processImage(fakeDataUrl);

    HandwritingRecognitionService.resetTelemetry();
    const telemetry = HandwritingRecognitionService.getTelemetry();

    expect(telemetry.totalAttempts).toBe(0);
    expect(telemetry.localSuccesses).toBe(0);
  });
});
