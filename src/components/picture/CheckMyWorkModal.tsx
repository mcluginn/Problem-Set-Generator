'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  Edit3,
  Cloud,
  Check,
  RefreshCw,
  Eye,
  Sliders,
} from 'lucide-react';
import { PictureMode, RecognitionResult, ImageQualityReport } from '@/services/picture/types';
import { ImagePreprocessor } from '@/services/picture/preprocessor';
import { HandwritingRecognitionService } from '@/services/picture/recognitionService';
import { MathRenderer } from '../math/MathRenderer';
import { MathInput } from '../math/MathInput';
import { SolutionStep } from '@/engine/math/steps';
import { SolutionAnalysisService, FullSolutionReport } from '@/services/picture/solutionAnalysisService';
import { MathNode } from '@/engine/math/ast';

interface CheckMyWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswer: (recognizedExpression: string, isFromPhoto: boolean) => void;
  expectedSteps?: SolutionStep[];
  rawProblemExpression?: MathNode;
  concept?: string;
  targetVariable?: string;
}

type Stage = 'capture' | 'preview' | 'processing' | 'confirm' | 'solution_review';

export const CheckMyWorkModal: React.FC<CheckMyWorkModalProps> = ({
  isOpen,
  onClose,
  onSubmitAnswer,
  expectedSteps,
  rawProblemExpression,
  concept = 'Chain Rule',
  targetVariable = 'x',
}) => {
  const [mode, setMode] = useState<PictureMode>('final_answer');
  const [stage, setStage] = useState<Stage>('capture');
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [qualityReport, setQualityReport] = useState<ImageQualityReport | null>(null);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedExpression, setEditedExpression] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fullSolutionReport, setFullSolutionReport] = useState<FullSolutionReport | null>(null);
  const [isCloudLoading, setIsCloudLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera when in capture stage
  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } else {
        setCameraError('Camera access not supported on this browser/device.');
      }
    } catch {
      setCameraError('Camera permission denied or camera not found. You can upload an image instead.');
      setCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    if (isOpen && stage === 'capture') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, stage, startCamera, stopCamera]);

  if (!isOpen) return null;

  // Capture frame from video stream
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      stopCamera();
      handleSelectImage(dataUrl);
    }
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = ImagePreprocessor.validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      stopCamera();
      handleSelectImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Analyze quality and move to preview stage
  const handleSelectImage = async (dataUrl: string) => {
    setImageDataUrl(dataUrl);
    setStage('preview');
    try {
      const { quality } = await ImagePreprocessor.assessAndPreprocess(dataUrl);
      setQualityReport(quality);
    } catch {
      // fallback
    }
  };

  // Run recognition (Tier 1 Local)
  const handleRunRecognition = async (forceCloud = false) => {
    if (!imageDataUrl) return;
    setStage('processing');
    if (forceCloud) setIsCloudLoading(true);

    try {
      const { result } = await HandwritingRecognitionService.processImage(imageDataUrl, {
        mode,
        studentId: 'prof_student_demo',
        forceCloud,
      });

      setRecognitionResult(result);
      setEditedExpression(result.expression);

      if (mode === 'full_solution' && expectedSteps && rawProblemExpression && result.steps) {
        const solReport = SolutionAnalysisService.analyzeFullSolution(
          result.steps,
          expectedSteps,
          rawProblemExpression,
          concept,
          targetVariable
        );
        setFullSolutionReport(solReport);
        setStage('solution_review');
      } else {
        setStage('confirm');
      }
    } catch (err) {
      console.error('Recognition error:', err);
      // Fallback to manual edit mode if error
      setEditedExpression('');
      setIsEditing(true);
      setStage('confirm');
    } finally {
      setIsCloudLoading(false);
    }
  };

  // Student confirms answer
  const handleConfirmAnswer = () => {
    const finalExpr = isEditing ? editedExpression : recognitionResult?.expression || editedExpression;
    if (!finalExpr.trim()) return;

    HandwritingRecognitionService.recordManualEdit(finalExpr, mode);
    onSubmitAnswer(finalExpr, true);
    handleClose();
  };

  const handleClose = () => {
    stopCamera();
    setStage('capture');
    setImageDataUrl(null);
    setQualityReport(null);
    setRecognitionResult(null);
    setIsEditing(false);
    setFullSolutionReport(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0a2344] border border-[#2c4f75]/40 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-5 border-b border-[#2c4f75]/35">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-brass-500/15 border border-brass-500/35 flex items-center justify-center text-brass-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Check My Photo Work</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102d52] text-brass-300 border border-brass-500/40">
                  Local-First
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Photograph your handwritten solution for verified mathematical feedback.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#102d52]/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#2c4f75]/35 bg-[#06162f] p-1.5 gap-1.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setMode('final_answer');
              if (stage === 'solution_review') setStage('confirm');
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition text-center ${
              mode === 'final_answer'
                ? 'bg-brass-500 text-[#061b3a] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
            }`}
          >
            Mode A: Final Answer
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('full_solution');
              if (stage === 'confirm' && recognitionResult?.steps) setStage('solution_review');
            }}
            className={`flex-1 py-2 rounded-lg font-bold transition text-center flex items-center justify-center gap-1.5 ${
              mode === 'full_solution'
                ? 'bg-brass-500 text-[#061b3a] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
            }`}
          >
            <span>Mode B: Full Solution</span>
            <span className="text-[9px] bg-[#102d52] text-brass-300 px-1.5 py-0.2 rounded border border-brass-500/40">
              Experimental
            </span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* ========================================================================= */}
          {/* STAGE 1: CAPTURE PHOTO OR UPLOAD                                          */}
          {/* ========================================================================= */}
          {stage === 'capture' && (
            <div className="space-y-4">
              {/* Camera Viewport */}
              <div className="relative aspect-[4/3] bg-[#06162f] rounded-xl border-2 border-dashed border-[#2c4f75]/40 overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {/* Viewfinder Target Overlay */}
                    <div className="absolute inset-6 border-2 border-brass-400/60 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                      <div className="flex justify-between text-[11px] font-mono text-brass-300 bg-[#06162f]/90 border border-brass-500/30 px-2 py-0.5 rounded backdrop-blur">
                        <span>Align math work inside frame</span>
                        <span>Keep flat & well lit</span>
                      </div>
                      <div className="text-center text-[11px] font-mono text-slate-300 bg-[#06162f]/90 border border-[#2c4f75]/40 px-2 py-0.5 rounded backdrop-blur mx-auto">
                        {mode === 'final_answer' ? 'Capture Final Expression' : 'Capture Step-by-Step Lines'}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#102d52] border border-[#2c4f75]/40 flex items-center justify-center text-slate-300 mx-auto">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-300">
                        {cameraError || 'Camera stream is loading or permission required.'}
                      </p>
                      <p className="text-xs text-slate-400">You can use your device camera or upload an image.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-200 font-bold text-xs sm:text-sm rounded-lg border border-[#2c4f75]/40 transition flex items-center space-x-2 min-h-[44px]"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </button>
                </div>

                {cameraActive && (
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="px-6 py-2.5 bg-brass-500 hover:bg-brass-400 active:bg-brass-600 text-[#061b3a] font-bold text-sm rounded-lg transition shadow-md shadow-brass-500/20 flex items-center space-x-2 min-h-[44px]"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Take Photo</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: PHOTO PREVIEW & QUALITY GATE                                      */}
          {/* ========================================================================= */}
          {stage === 'preview' && imageDataUrl && (
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-[#06162f] rounded-xl border border-[#2c4f75]/40 overflow-hidden flex items-center justify-center">
                <img src={imageDataUrl} alt="Captured Work" className="w-full h-full object-contain" />
              </div>

              {/* Quality Assessment Gate */}
              {qualityReport && (
                <div
                  className={`p-4 rounded-xl border flex items-start space-x-3 text-xs ${
                    qualityReport.isAcceptable
                      ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-800/40 text-amber-300'
                  }`}
                >
                  {qualityReport.isAcceptable ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                  )}
                  <div className="space-y-1">
                    <div className="font-bold flex items-center gap-2">
                      <span>{qualityReport.isAcceptable ? 'Image Quality: Clear & Sharp' : 'Quality Warning'}</span>
                      <span className="font-mono text-[10px] bg-[#06162f] px-2 py-0.5 rounded border border-[#2c4f75]/30">
                        Sharpness: {qualityReport.blurScore}%
                      </span>
                    </div>
                    {qualityReport.recommendation && <p>{qualityReport.recommendation}</p>}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setImageDataUrl(null);
                    setStage('capture');
                  }}
                  className="px-4 py-2 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-200 text-xs font-bold rounded-lg border border-[#2c4f75]/40 transition flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRunRecognition(false)}
                  className="px-6 py-2.5 bg-brass-500 hover:bg-brass-400 active:bg-brass-600 text-[#061b3a] font-bold text-xs sm:text-sm rounded-lg transition flex items-center space-x-2 shadow-md shadow-brass-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Recognize Mathematics</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: PROCESSING SPINNER                                                */}
          {/* ========================================================================= */}
          {stage === 'processing' && (
            <div className="py-12 text-center space-y-4">
              <RefreshCw className="w-8 h-8 text-brass-400 animate-spin mx-auto" />
              <div className="space-y-1 font-mono">
                <p className="text-sm text-slate-200 font-bold">
                  {isCloudLoading ? 'Consulting Cloud Recognition Provider...' : 'Reading your handwritten math...'}
                </p>
                <p className="text-xs text-slate-400">
                  {isCloudLoading ? 'Analyzing complex structures' : 'Local deterministic recognition in progress'}
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 4: CONFIRMATION & EDITING (MODE A)                                  */}
          {/* ========================================================================= */}
          {stage === 'confirm' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200">
                    {recognitionResult && recognitionResult.confidence >= 0.7
                      ? 'We read your answer as:'
                      : 'We may have misread your work. Please verify or edit below:'}
                  </h3>
                  {recognitionResult && (
                    <span
                      className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        recognitionResult.confidence >= 0.7
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                          : 'bg-amber-950/60 border-amber-800 text-amber-300'
                      }`}
                    >
                      {recognitionResult.confidence >= 0.7 ? '✓ Clear Handwriting' : '⚠ Please Review Carefully'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Confirm that the recognized equation matches what you wrote on paper.
                </p>
              </div>

              {/* Rendered Math Preview Box */}
              {!isEditing ? (
                <div className="p-6 bg-[#06162f] rounded-xl border border-[#2c4f75]/40 text-center shadow-inner space-y-2">
                  <div className="text-2xl text-white font-serif tracking-normal">
                    <MathRenderer latex={editedExpression || recognitionResult?.expression || ''} displayMode />
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Source: {recognitionResult?.provider === 'cloud' ? 'Cloud Vision' : 'Local Handwriting Engine'}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 p-4 bg-[#06162f] rounded-xl border border-brass-500/50">
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                    Correct / Edit Mathematical Expression:
                  </label>
                  <MathInput
                    value={editedExpression}
                    onChange={setEditedExpression}
                    placeholder="e.g. 10(3x-1)(3x^2-2x+4)^4"
                  />
                  <p className="text-[11px] text-slate-400 italic">
                    ✏️ Editing is 100% local. Deterministic grading &bull; Optional AI tutoring.
                  </p>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2c4f75]/35">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setImageDataUrl(null);
                      setStage('capture');
                    }}
                    className="px-3 py-2 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-300 text-xs font-bold rounded-lg border border-[#2c4f75]/40 transition flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-3 py-2 text-xs font-bold rounded-lg border transition flex items-center space-x-1 ${
                      isEditing
                        ? 'bg-[#102d52] text-brass-300 border-brass-500/60'
                        : 'bg-[#102d52] hover:bg-[#1d3b5e] text-slate-300 border-[#2c4f75]/40'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Preview Math' : 'Edit Answer'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg border border-[#2c4f75]/40 transition"
                  >
                    <span>Enter Manually</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  disabled={!editedExpression.trim()}
                  className="px-6 py-2.5 bg-brass-500 hover:bg-brass-400 active:bg-brass-600 disabled:opacity-40 text-[#061b3a] font-bold text-xs sm:text-sm rounded-lg transition shadow-md shadow-brass-500/20 flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm & Verify</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 5: FULL SOLUTION STEP-BY-STEP REVIEW (MODE B)                       */}
          {/* ========================================================================= */}
          {stage === 'solution_review' && fullSolutionReport && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-xl border bg-[#06162f] border-[#2c4f75]/35 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-brass-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> Step-by-Step Reasoning Trace Analysis
                  </h3>
                  <span className="text-[10px] font-mono uppercase bg-[#102d52] text-brass-300 px-2 py-0.5 rounded border border-brass-500/40">
                    Experimental
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{fullSolutionReport.feedbackMessage}</p>
              </div>

              {/* Step Sequence Table */}
              <div className="space-y-3">
                {fullSolutionReport.stepEvaluations.map((step) => (
                  <div
                    key={step.stepNumber}
                    className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                      step.isEquivalent
                        ? 'bg-[#06162f] border-emerald-800/40'
                        : 'bg-red-950/30 border-red-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-300">
                        Step {step.stepNumber}: {step.title}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                          step.isEquivalent ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {step.isEquivalent ? '✓ Verified' : '⚠ Divergence'}
                      </span>
                    </div>

                    <div className="p-2 bg-[#0a2344] rounded-md text-center font-serif text-sm text-slate-100">
                      <MathRenderer latex={step.studentNormalized || step.studentRaw} displayMode={false} />
                    </div>

                    {step.divergenceReason && (
                      <p className="text-[11px] text-red-300/90 pt-1 font-mono">{step.divergenceReason}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#2c4f75]/35">
                <button
                  type="button"
                  onClick={() => setStage('confirm')}
                  className="px-4 py-2 bg-[#102d52] text-slate-300 text-xs font-bold rounded-lg border border-[#2c4f75]/40 hover:bg-[#1d3b5e] transition flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Switch to Final Answer</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  className="px-6 py-2.5 bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-xs sm:text-sm rounded-lg transition shadow-md shadow-brass-500/20"
                >
                  <span>Submit Work for Grading</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
