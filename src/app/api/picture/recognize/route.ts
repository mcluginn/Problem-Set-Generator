/**
 * Server API Route for Cloud Handwriting Recognition (Tier 3)
 * Endpoint: POST /api/picture/recognize
 * Enforces rate limiting, data minimization, privacy policy, and payload bounds.
 */

import { NextRequest, NextResponse } from 'next/server';
import { HandwritingRecognitionService } from '@/services/picture/recognitionService';
import { PictureMode } from '@/services/picture/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const policy = HandwritingRecognitionService.getPolicy();

    // 1. Enforce Local-Only Privacy Mode
    if (policy.localOnlyPrivacyMode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloud recognition is disabled under the current institutional local-only privacy policy.',
          code: 'LOCAL_ONLY_MODE',
        },
        { status: 403 }
      );
    }

    if (!policy.cloudRecognitionEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cloud recognition is currently disabled by administrative settings.',
          code: 'CLOUD_DISABLED',
        },
        { status: 403 }
      );
    }

    // 2. Parse & Validate Payload Size
    const body = await req.json();
    const { imageDataUrl, mode = 'final_answer', studentId = 'default_student' } = body;

    if (!imageDataUrl || typeof imageDataUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing imageDataUrl parameter.', code: 'INVALID_PAYLOAD' },
        { status: 400 }
      );
    }

    // Max 4MB base64 payload size guard
    if (imageDataUrl.length > 4 * 1024 * 1024 * 1.37) {
      return NextResponse.json(
        { success: false, error: 'Image payload exceeds 4MB size limit.', code: 'PAYLOAD_TOO_LARGE' },
        { status: 413 }
      );
    }

    // 3. Process via HandwritingRecognitionService
    const { result, qualityPassed, cached } = await HandwritingRecognitionService.processImage(imageDataUrl, {
      mode: mode as PictureMode,
      studentId: String(studentId).substring(0, 64), // sanitize student ID
      forceCloud: true,
    });

    return NextResponse.json({
      success: true,
      result,
      qualityPassed,
      cached,
    });
  } catch (err: unknown) {
    console.error('Recognition API Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal recognition processing error.',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
