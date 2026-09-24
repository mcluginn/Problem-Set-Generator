/**
 * Picture Security, Quotas & Privacy Safeguards Test Suite (Section 85)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { HandwritingRecognitionService } from '@/services/picture/recognitionService';

describe('Picture Security & Privacy Safeguards', () => {
  beforeEach(() => {
    HandwritingRecognitionService.resetTelemetry();
    HandwritingRecognitionService.setPolicy({
      localOnlyPrivacyMode: false,
      cloudRecognitionEnabled: true,
      dailyCloudLimitPerStudent: 3,
    });
  });

  it('strictly blocks cloud requests when localOnlyPrivacyMode is enabled', async () => {
    HandwritingRecognitionService.setPolicy({ localOnlyPrivacyMode: true });

    const fakeDataUrl = 'data:image/jpeg;base64,privacy_test_data';
    const response = await HandwritingRecognitionService.processImage(fakeDataUrl, {
      forceCloud: true,
      studentId: 'student_priv',
    });

    // Should not use cloud provider
    expect(response.result.provider).toBe('local');
    const telemetry = HandwritingRecognitionService.getTelemetry();
    expect(telemetry.cloudFallbacks).toBe(0);
  });

  it('enforces student daily cloud quota limit', async () => {
    HandwritingRecognitionService.setPolicy({
      localOnlyPrivacyMode: false,
      cloudRecognitionEnabled: true,
      dailyCloudLimitPerStudent: 2,
    });

    const sId = 'student_quota_test';

    // 1st cloud request
    await HandwritingRecognitionService.processImage('data:image/jpeg;base64,img1', {
      forceCloud: true,
      studentId: sId,
    });

    // 2nd cloud request
    await HandwritingRecognitionService.processImage('data:image/jpeg;base64,img2', {
      forceCloud: true,
      studentId: sId,
    });

    // 3rd cloud request - quota exceeded, should revert to local
    const res3 = await HandwritingRecognitionService.processImage('data:image/jpeg;base64,img3', {
      forceCloud: true,
      studentId: sId,
    });

    expect(res3.result.provider).toBe('local');
    const telemetry = HandwritingRecognitionService.getTelemetry();
    expect(telemetry.cloudFallbacks).toBe(2); // Only 2 allowed
  });
});
