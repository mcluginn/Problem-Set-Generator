/**
 * Local Preprocessor & Quality Gate Test Suite (Section 81)
 */

import { describe, it, expect } from 'vitest';
import { ImagePreprocessor } from '@/services/picture/preprocessor';

describe('Local Image Preprocessor & Quality Gate', () => {
  it('validates accepted MIME types (JPEG, PNG, WebP)', () => {
    const validJpeg = { type: 'image/jpeg', size: 1024 * 500 } as File;
    const validPng = { type: 'image/png', size: 1024 * 500 } as File;
    const validWebp = { type: 'image/webp', size: 1024 * 500 } as File;
    const invalidGif = { type: 'image/gif', size: 1024 * 500 } as File;

    expect(ImagePreprocessor.validateImageFile(validJpeg).valid).toBe(true);
    expect(ImagePreprocessor.validateImageFile(validPng).valid).toBe(true);
    expect(ImagePreprocessor.validateImageFile(validWebp).valid).toBe(true);
    expect(ImagePreprocessor.validateImageFile(invalidGif).valid).toBe(false);
  });

  it('rejects image files exceeding 8MB size limit', () => {
    const oversizedFile = { type: 'image/jpeg', size: 9 * 1024 * 1024 } as File;
    const result = ImagePreprocessor.validateImageFile(oversizedFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('8MB');
  });

  it('computes deterministic SHA-256 image fingerprint hash for zero-cost caching', async () => {
    const dataUrl1 = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const dataUrl2 = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const dataUrl3 = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAADElEQVR42mNk+M8AAAEAAf8X5z0AAAAASUVORK5CYII=';

    const hash1 = await ImagePreprocessor.computeImageFingerprint(dataUrl1);
    const hash2 = await ImagePreprocessor.computeImageFingerprint(dataUrl2);
    const hash3 = await ImagePreprocessor.computeImageFingerprint(dataUrl3);

    expect(hash1).toBe(hash2);
    expect(hash1.startsWith('img_')).toBe(true);
    expect(hash1).not.toBe(hash3);
  });

  it('assesses image quality and returns acceptable report for valid data URL', async () => {
    const dataUrl = 'data:image/jpeg;base64,sample_contrast_test';
    const { quality, processedDataUrl } = await ImagePreprocessor.assessAndPreprocess(dataUrl);

    expect(quality).toBeDefined();
    expect(typeof quality.blurScore).toBe('number');
    expect(typeof quality.brightnessScore).toBe('number');
    expect(processedDataUrl).toBeDefined();
  });
});
