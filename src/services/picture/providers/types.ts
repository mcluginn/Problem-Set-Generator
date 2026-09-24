/**
 * Handwriting Recognition Provider Contract
 */

import { PictureMode, RecognitionProviderType, RecognitionResult } from '../types';

export interface IHandwritingRecognitionProvider {
  readonly name: string;
  readonly type: RecognitionProviderType;
  isAvailable(): Promise<boolean>;
  recognizeExpression(imageDataUrl: string, mode?: PictureMode): Promise<RecognitionResult>;
}
