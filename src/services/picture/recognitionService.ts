/**
 * Handwriting Recognition Service & Tier Coordinator
 * Manages the 3-tier recognition workflow, caching, quality gating,
 * cloud quotas, telemetry, and error resilience.
 */

import {
  PictureMode,
  PicturePolicyConfig,
  PictureTelemetry,
  RecognitionResult,
  DEFAULT_PICTURE_POLICY,
} from './types';
import { ImagePreprocessor } from './preprocessor';
import { LocalRecognitionProvider } from './providers/localProvider';
import { ManualRecognitionProvider } from './providers/manualProvider';
import { GeminiVisionProvider } from './providers/geminiVisionProvider';

export class HandwritingRecognitionService {
  private static localProvider = new LocalRecognitionProvider();
  private static manualProvider = new ManualRecognitionProvider();
  private static cloudProvider = new GeminiVisionProvider();

  // In-memory cache for recognized image fingerprints
  private static cache = new Map<string, RecognitionResult>();

  // Per-student daily cloud usage tracker
  private static studentCloudUsage = new Map<string, { date: string; count: number }>();

  // Active Policy Configuration
  private static policy: PicturePolicyConfig = { ...DEFAULT_PICTURE_POLICY };

  // Aggregate Telemetry
  private static telemetry: PictureTelemetry = {
    totalAttempts: 0,
    localSuccesses: 0,
    localFailures: 0,
    manualCorrections: 0,
    cloudFallbacks: 0,
    cloudRequestsAvoided: 0,
    qualityRejections: 0,
    tutorRequestsFromPhoto: 0,
  };

  /**
   * Updates institutional / teacher policy configuration.
   */
  public static setPolicy(newPolicy: Partial<PicturePolicyConfig>): void {
    this.policy = { ...this.policy, ...newPolicy };
  }

  public static getPolicy(): PicturePolicyConfig {
    return { ...this.policy };
  }

  public static getTelemetry(): PictureTelemetry {
    return { ...this.telemetry };
  }

  public static resetTelemetry(): void {
    this.telemetry = {
      totalAttempts: 0,
      localSuccesses: 0,
      localFailures: 0,
      manualCorrections: 0,
      cloudFallbacks: 0,
      cloudRequestsAvoided: 0,
      qualityRejections: 0,
      tutorRequestsFromPhoto: 0,
    };
    this.cache.clear();
    this.studentCloudUsage.clear();
  }

  public static recordTutorRequestFromPhoto(): void {
    this.telemetry.tutorRequestsFromPhoto++;
  }

  /**
   * Main Recognition Pipeline:
   * Step 1: Quality Gate
   * Step 2: Cache Lookup (Fingerprint Hash)
   * Step 3: Local Tier 1 Recognition
   * Step 4: Optional Cloud Tier 3 if requested/low confidence
   */
  public static async processImage(
    imageDataUrl: string,
    options: {
      mode?: PictureMode;
      studentId?: string;
      forceCloud?: boolean;
    } = {}
  ): Promise<{
    result: RecognitionResult;
    qualityPassed: boolean;
    cached: boolean;
  }> {
    this.telemetry.totalAttempts++;
    const mode = options.mode || 'final_answer';
    const studentId = options.studentId || 'default_student';

    // 1. Image Fingerprint Hash Calculation
    const hash = await ImagePreprocessor.computeImageFingerprint(imageDataUrl);

    // 2. Cache Hit Check
    if (this.cache.has(hash) && !options.forceCloud) {
      this.telemetry.cloudRequestsAvoided++;
      const cached = this.cache.get(hash)!;
      return {
        result: { ...cached, imageHash: hash },
        qualityPassed: true,
        cached: true,
      };
    }

    // 3. Local Quality Gate
    let qualityReport = {
      isAcceptable: true,
      blurScore: 85,
      brightnessScore: 70,
      contrastScore: 75,
      resolution: { width: 800, height: 600 },
      issues: [] as string[],
    };

    let processedUrl = imageDataUrl;
    try {
      const prep = await ImagePreprocessor.assessAndPreprocess(imageDataUrl);
      qualityReport = prep.quality;
      processedUrl = prep.processedDataUrl;
    } catch {
      // Continue if canvas not available
    }

    if (!qualityReport.isAcceptable) {
      this.telemetry.qualityRejections++;
      this.telemetry.localFailures++;
      const rejectedResult: RecognitionResult = {
        rawText: '',
        expression: '',
        confidence: 0.1,
        provider: 'local',
        warnings: qualityReport.issues,
        processingTimeMs: 0,
        imageHash: hash,
      };
      return {
        result: rejectedResult,
        qualityPassed: false,
        cached: false,
      };
    }

    // 4. Determine whether to use Local or Cloud Provider
    const canUseCloud =
      !this.policy.localOnlyPrivacyMode &&
      this.policy.cloudRecognitionEnabled &&
      this.checkStudentCloudQuota(studentId);

    if (options.forceCloud && canUseCloud) {
      this.telemetry.cloudFallbacks++;
      this.incrementStudentCloudUsage(studentId);
      const cloudResult = await this.cloudProvider.recognizeExpression(processedUrl, mode);
      cloudResult.imageHash = hash;
      this.cache.set(hash, cloudResult);
      return { result: cloudResult, qualityPassed: true, cached: false };
    }

    // 5. Run Tier 1 Local Recognition Engine
    const localResult = await this.localProvider.recognizeExpression(processedUrl, mode);
    localResult.imageHash = hash;

    if (localResult.confidence >= 0.7) {
      this.telemetry.localSuccesses++;
      this.telemetry.cloudRequestsAvoided++;
      this.cache.set(hash, localResult);
      return { result: localResult, qualityPassed: true, cached: false };
    }

    // 6. If local confidence is low and cloud is available, attempt cloud fallback
    if (canUseCloud && (await this.cloudProvider.isAvailable())) {
      this.telemetry.cloudFallbacks++;
      this.incrementStudentCloudUsage(studentId);
      const cloudResult = await this.cloudProvider.recognizeExpression(processedUrl, mode);
      cloudResult.imageHash = hash;
      this.cache.set(hash, cloudResult);
      return { result: cloudResult, qualityPassed: true, cached: false };
    }

    // Return local result for Tier 2 manual confirmation
    this.telemetry.localSuccesses++;
    this.cache.set(hash, localResult);
    return { result: localResult, qualityPassed: true, cached: false };
  }

  /**
   * Tier 2 Student Manual Edit & Confirmation
   */
  public static async recordManualEdit(
    editedText: string,
    mode: PictureMode = 'final_answer'
  ): Promise<RecognitionResult> {
    this.telemetry.manualCorrections++;
    return this.manualProvider.recognizeExpression(editedText, mode);
  }

  /**
   * Checks daily cloud quota per student.
   */
  private static checkStudentCloudQuota(studentId: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    const usage = this.studentCloudUsage.get(studentId);
    if (!usage || usage.date !== today) {
      return true;
    }
    return usage.count < this.policy.dailyCloudLimitPerStudent;
  }

  private static incrementStudentCloudUsage(studentId: string): void {
    const today = new Date().toISOString().split('T')[0];
    const usage = this.studentCloudUsage.get(studentId);
    if (!usage || usage.date !== today) {
      this.studentCloudUsage.set(studentId, { date: today, count: 1 });
    } else {
      usage.count++;
    }
  }
}
