'use client';

import React, { useState } from 'react';
import { ProblemGenerator } from '@/engine/generation/generator';
import { GeneratedProblem, RepresentationType } from '@/engine/generation/types';
import { INITIAL_CURRICULUM } from '@/services/database/types';
import { parseMath } from '@/engine/math/parser';
import { checkEquivalence, EquivalenceResult } from '@/engine/math/equivalence';
import { MisconceptionEngine, MisconceptionDiagnosis } from '@/engine/math/misconceptions';
import { MathRenderer } from '../math/MathRenderer';
import { RichContentRenderer } from '../math/RichContentRenderer';
import { MathGallery } from '../math/MathGallery';
import { HandwritingRecognitionService } from '@/services/picture/recognitionService';
import { PicturePolicyConfig, PictureTelemetry } from '@/services/picture/types';
import { CurriculumBrowser } from '../curriculum/CurriculumBrowser';
import { TeacherCalibrationDashboard } from './TeacherCalibrationDashboard';
import { ContentCoverageReview } from './ContentCoverageReview';
import {
  Code,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BookOpen,
  Eye,
  Camera,
  Activity,
  Sliders,
  CloudOff,
  Lock,
  GraduationCap,
} from 'lucide-react';

export function TeacherReview() {
  const [selectedTab, setSelectedTab] = useState<'inspector' | 'gallery' | 'picture' | 'curriculum' | 'calibration' | 'coverage'>('coverage');
  const [selectedConcept, setSelectedConcept] = useState<string>('Chain Rule');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(3);
  const [currentProblem, setCurrentProblem] = useState<GeneratedProblem | null>(() =>
    ProblemGenerator.generateProblem({ concept: 'Chain Rule', difficulty: 3 })
  );
  const [testInput, setTestInput] = useState<string>('5(3x^2 - 2x + 4)^4');
  const [testEquivalence, setTestEquivalence] = useState<EquivalenceResult | null>(null);
  const [testMisconception, setTestMisconception] = useState<MisconceptionDiagnosis | null>(null);

  // Picture Mode Policy State
  const [picturePolicy, setPicturePolicy] = useState<PicturePolicyConfig>(() =>
    HandwritingRecognitionService.getPolicy()
  );
  const [pictureTelemetry, setPictureTelemetry] = useState<PictureTelemetry>(() =>
    HandwritingRecognitionService.getTelemetry()
  );

  // Picture Sandbox State
  const [sandboxExpr, setSandboxExpr] = useState<string>('10(3x-1)(3x^2-2x+4)^4');
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  const handleGenerate = () => {
    const prob = ProblemGenerator.generateProblem({
      concept: selectedConcept,
      difficulty: selectedDifficulty as any,
    });
    setCurrentProblem(prob);
    setTestEquivalence(null);
    setTestMisconception(null);
  };

  const handleRunDiagnostics = () => {
    if (!currentProblem) return;
    try {
      const studentAst = parseMath(testInput);
      const expectedAst = parseMath(currentProblem.solution.canonicalAnswerRaw);

      const eq = checkEquivalence(studentAst, expectedAst, {
        targetVariable: currentProblem.statement.independentVariable || 'x',
      });
      setTestEquivalence(eq);

      const diag = MisconceptionEngine.diagnose(
        studentAst,
        currentProblem.rawExpression,
        currentProblem.dna.concept,
        currentProblem.statement.independentVariable || 'x'
      );
      setTestMisconception(diag);
    } catch (err: any) {
      setTestEquivalence({
        equivalent: false,
        status: 'INVALID_INPUT',
        confidence: 0,
        level: 0,
        symbolicMatch: false,
        domainStatus: 'unverified',
        reason: `Parse Error: ${err.message}`,
        methodUsed: 'none',
      });
      setTestMisconception({
        detected: false,
        confidence: 0,
        guidanceTip: `Could not parse student input: ${err.message}`,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c4f75]/30 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-brass-500/15 text-brass-400 border border-brass-500/35">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Teacher & Developer Inspection Mode</h1>
              <p className="text-sm text-slate-400 font-mono">
                Full-stack mathematical AST inspection, deterministic pipeline telemetry, and equivalence testing.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs and Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap bg-[#0a2344]/80 border border-[#2c4f75]/40 p-1 rounded-lg gap-1">
            <button
              type="button"
              onClick={() => setSelectedTab('coverage')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'coverage'
                  ? 'bg-brass-500 text-[#061b3a] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Coverage &amp; Review</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('calibration')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'calibration'
                  ? 'bg-brass-500 text-[#061b3a] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Content Calibration</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('inspector')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition ${
                selectedTab === 'inspector'
                  ? 'bg-brass-500 text-[#061b3a] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
              }`}
            >
              Pipeline Inspector
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('gallery')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'gallery'
                  ? 'bg-brass-500 text-[#061b3a] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Math Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTab('picture');
                setPictureTelemetry(HandwritingRecognitionService.getTelemetry());
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'picture'
                  ? 'bg-brass-500 text-[#061b3a] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Picture Mode & Telemetry</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('curriculum')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                selectedTab === 'curriculum'
                  ? 'bg-brass-500 text-[#061b3a] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Curriculum Foundation</span>
            </button>
          </div>

          {selectedTab === 'inspector' && (
            <>
              <select
                value={selectedConcept}
                onChange={(e) => setSelectedConcept(e.target.value)}
                className="bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-brass-500 font-medium font-mono"
              >
                {INITIAL_CURRICULUM.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                className="bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-brass-500 font-medium font-mono"
              >
                <option value={1}>Level 1 (Easy)</option>
                <option value={2}>Level 2 (Foundational)</option>
                <option value={3}>Level 3 (Standard)</option>
                <option value={4}>Level 4 (Hard)</option>
                <option value={5}>Level 5 (Mastery)</option>
              </select>

              <button
                type="button"
                onClick={handleGenerate}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-brass-500 hover:bg-brass-400 text-[#061b3a] rounded-lg text-xs font-bold font-mono transition shadow-md shadow-brass-500/20"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate</span>
              </button>
            </>
          )}
        </div>
      </div>

      {selectedTab === 'gallery' && <MathGallery />}

      {selectedTab === 'inspector' && currentProblem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Problem Statement, DNA & Metadata */}
          <div className="space-y-6">
            {/* Rendered Problem Card */}
            <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono text-brass-400">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" /> Statement Preview
                </span>
                <span className="bg-[#102d52] border border-brass-500/40 text-brass-300 px-2 py-0.5 rounded-md font-bold">
                  Diff Level {currentProblem.dna.difficulty.overall}
                </span>
              </div>

              <div>
                <div className="text-sm text-slate-300 mb-2">
                  <RichContentRenderer content={currentProblem.statement.promptText} inline />
                </div>
                <div className="p-4 bg-[#06162f] border border-[#2c4f75]/30 rounded-lg text-center overflow-x-auto max-w-full">
                  <MathRenderer latex={currentProblem.statement.expressionLatex} displayMode={true} />
                </div>
              </div>

              <div className="pt-2 border-t border-[#2c4f75]/30">
                <div className="text-xs font-mono text-slate-400 mb-1">Canonical Target Answer:</div>
                <div className="p-3 bg-[#06162f] border border-emerald-800/40 rounded-lg text-center text-emerald-400 font-mono text-sm overflow-x-auto max-w-full">
                  <MathRenderer latex={currentProblem.solution.canonicalAnswerLatex} displayMode={true} />
                </div>
              </div>
            </div>

            {/* Problem DNA Inspector */}
            <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-5 space-y-3 font-mono text-xs shadow-md">
              <div className="flex items-center space-x-2 text-brass-400 font-bold text-sm border-b border-[#2c4f75]/30 pb-2">
                <Layers className="w-4 h-4" />
                <span>Problem DNA &amp; Signature</span>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">DNA ID:</span>
                  <span className="text-slate-200">{currentProblem.dna.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Concept:</span>
                  <span className="text-brass-300 font-semibold">{currentProblem.dna.concept}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Family ID:</span>
                  <span className="text-slate-200">{currentProblem.dna.familyId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Representation:</span>
                  <span className="text-emerald-400">{currentProblem.dna.representationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Context:</span>
                  <span className="text-slate-300">{currentProblem.dna.contextType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Structure Signature:</span>
                  <span className="text-amber-400 truncate max-w-[180px]">{currentProblem.dna.structureSignature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Targeted Errors:</span>
                  <span className="text-rose-400">{currentProblem.dna.targetedMisconceptions.join(', ') || 'None'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2c4f75]/30">
                <div className="text-slate-400 mb-1">Difficulty Vector:</div>
                <div className="grid grid-cols-2 gap-1 text-[11px] bg-[#06162f] p-2 rounded-lg border border-[#2c4f75]/30">
                  <div>Conceptual: {currentProblem.dna.difficulty.conceptual}/5</div>
                  <div>Computational: {currentProblem.dna.difficulty.computational}/5</div>
                  <div>Procedural: {currentProblem.dna.difficulty.procedural}/5</div>
                  <div>Reasoning: {currentProblem.dna.difficulty.reasoning}/5</div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Pedagogical Steps & Progressive Hints */}
          <div className="space-y-6">
            {/* Pedagogical Step-by-Step Solution */}
            <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-5 space-y-4 shadow-md">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm border-b border-[#2c4f75]/30 pb-2 font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>Deterministic Solution Steps ({currentProblem.solution.steps.length})</span>
              </div>

              <div className="space-y-3">
                {currentProblem.solution.steps.map((step, idx) => (
                  <div key={idx} className="bg-[#06162f] border border-[#2c4f75]/30 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-mono">
                      <span className="font-bold text-brass-400">Step {step.stepNumber}: {step.title}</span>
                      <span className="bg-[#102d52] border border-[#2c4f75]/40 px-2 py-0.5 rounded text-[10px] text-slate-200">{step.ruleName}</span>
                    </div>
                    <div className="p-2 bg-[#0a2344]/40 rounded-md text-center font-mono text-slate-200 border border-[#2c4f75]/20">
                      <MathRenderer latex={step.expressionLatex} displayMode={false} />
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{step.explanation}</p>
                  </div>
                ))}
              </div>

              {currentProblem.solution.whyMethodRequired && (
                <div className="p-3.5 bg-[#06162f]/80 border border-brass-500/30 rounded-lg text-xs space-y-1.5">
                  <div className="font-bold text-brass-400 font-mono">Pedagogical Why Rationale:</div>
                  <div className="text-slate-300 text-xs leading-relaxed">
                    <RichContentRenderer content={currentProblem.solution.whyMethodRequired} />
                  </div>
                </div>
              )}
            </div>

            {/* 5-Tier Hints */}
            <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-5 space-y-3 shadow-md">
              <div className="flex items-center space-x-2 text-brass-400 font-bold text-sm border-b border-[#2c4f75]/30 pb-2 font-mono">
                <Sparkles className="w-4 h-4" />
                <span>5-Level Progressive Hints</span>
              </div>

              <div className="space-y-2">
                {currentProblem.hints.map((h) => (
                  <div key={h.level} className="bg-[#06162f] border border-[#2c4f75]/30 p-2.5 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-brass-400 font-bold">Hint {h.level} ({h.category})</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{h.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Equivalence & Misconception Diagnostic Playground */}
          <div className="space-y-6">
            <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-5 space-y-4 shadow-md">
              <div className="flex items-center space-x-2 text-brass-400 font-bold text-sm border-b border-[#2c4f75]/30 pb-2 font-mono">
                <Cpu className="w-4 h-4" />
                <span>Live Equivalence &amp; Diagnostics</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-mono text-slate-400">
                  Simulate Student Input String:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="e.g. 5(3x^2 - 2x + 4)^4 or 2x cos(x)"
                    className="flex-1 bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 text-xs font-mono rounded-lg px-3 py-2 focus:ring-2 focus:ring-brass-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRunDiagnostics}
                    className="px-3.5 py-2 bg-brass-500 hover:bg-brass-400 text-[#061b3a] rounded-lg text-xs font-bold transition flex items-center gap-1 font-mono shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Test</span>
                  </button>
                </div>
              </div>

              {testEquivalence && (
                <div className="space-y-3 pt-3 border-t border-slate-800 font-mono text-xs">
                  <div className="text-slate-400 font-bold">Equivalence Result:</div>
                  <div
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      testEquivalence.equivalent
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                    }`}
                  >
                    <span className="font-bold flex items-center gap-1.5">
                      {testEquivalence.equivalent ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {testEquivalence.status}
                    </span>
                    <span className="text-[11px] text-slate-400">Method: {testEquivalence.methodUsed}</span>
                  </div>
                  {testEquivalence.reason && (
                    <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {testEquivalence.reason}
                    </p>
                  )}
                </div>
              )}

              {testMisconception && (
                <div className="space-y-3 pt-3 border-t border-slate-800 font-mono text-xs">
                  <div className="text-slate-400 font-bold">Misconception Engine Result:</div>
                  {testMisconception.detected ? (
                    <div className="bg-amber-950/40 border border-amber-800/40 text-amber-300 p-3 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" />
                          {testMisconception.code}
                        </span>
                        <span className="text-[10px] bg-amber-900/60 px-2 py-0.5 rounded">
                          {(testMisconception.confidence * 100).toFixed(0)}% Conf
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-amber-200">{testMisconception.name}</div>
                      <p className="text-[11px] text-slate-300">{testMisconception.diagnosis}</p>
                      <p className="text-[11px] text-amber-400 font-medium italic pt-1 border-t border-amber-800/40">
                        Guidance Tip: {testMisconception.guidanceTip}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-400 text-[11px]">
                      No known perturbation misconception matched (Unrelated or Correct error).
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Architecture Verification Telemetry */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Authoritative Architecture Status</span>
              </div>

              <div className="space-y-1.5 text-slate-300 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mathematical Core:</span>
                  <span className="text-emerald-400 font-semibold">100% Deterministic (Active)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">AI Role:</span>
                  <span className="text-slate-300">Pedagogical Assist / Explanatory</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Equivalence Strategy:</span>
                  <span className="text-slate-300">Algebraic + Sampling</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Curriculum Scope:</span>
                  <span className="text-brass-400 font-bold">14 Verified Concepts</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Release Classification:</span>
                  <span className="text-emerald-400 font-bold">PRODUCTION READY (v1.0.0)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'picture' && (
        <div className="space-y-8">
          {/* Institutional Policy & Privacy Controls */}
          <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-3">
              <div className="flex items-center space-x-2 text-brass-400 font-bold text-sm font-mono">
                <Sliders className="w-4 h-4" />
                <span>Picture Mode Configuration &amp; Privacy Safeguards</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Target Scale: 200+ Students</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {/* Toggle 1: Allow Picture Mode */}
              <div className="p-4 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 font-semibold">Allow Picture Mode</span>
                  <input
                    type="checkbox"
                    checked={picturePolicy.allowPictureMode}
                    onChange={(e) => {
                      const updated = { ...picturePolicy, allowPictureMode: e.target.checked };
                      setPicturePolicy(updated);
                      HandwritingRecognitionService.setPolicy(updated);
                    }}
                    className="w-4 h-4 rounded text-brass-500 focus:ring-brass-500 bg-[#0a2344] border-slate-700"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Enable or disable camera &amp; photo checks for practice.</p>
              </div>

              {/* Toggle 2: Local-Only Privacy Mode */}
              <div className="p-4 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Local-Only Privacy
                  </span>
                  <input
                    type="checkbox"
                    checked={picturePolicy.localOnlyPrivacyMode}
                    onChange={(e) => {
                      const updated = { ...picturePolicy, localOnlyPrivacyMode: e.target.checked };
                      setPicturePolicy(updated);
                      HandwritingRecognitionService.setPolicy(updated);
                    }}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-[#0a2344] border-slate-700"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Guarantees zero images or queries leave the device.</p>
              </div>

              {/* Toggle 3: Cloud Recognition Enabled */}
              <div className="p-4 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1">
                    <CloudOff className="w-3.5 h-3.5" /> Cloud Vision Fallback
                  </span>
                  <input
                    type="checkbox"
                    checked={picturePolicy.cloudRecognitionEnabled}
                    disabled={picturePolicy.localOnlyPrivacyMode}
                    onChange={(e) => {
                      const updated = { ...picturePolicy, cloudRecognitionEnabled: e.target.checked };
                      setPicturePolicy(updated);
                      HandwritingRecognitionService.setPolicy(updated);
                    }}
                    className="w-4 h-4 rounded text-brass-500 focus:ring-brass-500 bg-[#0a2344] border-slate-700 disabled:opacity-30"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Permit optional cloud vision when local confidence is low.</p>
              </div>

              {/* Daily Limit */}
              <div className="p-4 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 font-semibold">Daily Cloud Quota</span>
                  <span className="text-xs font-mono text-brass-400 font-bold">
                    {picturePolicy.dailyCloudLimitPerStudent} / student
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={picturePolicy.dailyCloudLimitPerStudent}
                  onChange={(e) => {
                    const updated = { ...picturePolicy, dailyCloudLimitPerStudent: Number(e.target.value) };
                    setPicturePolicy(updated);
                    HandwritingRecognitionService.setPolicy(updated);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brass-500"
                />
                <p className="text-[11px] text-slate-500">Budget safeguard per student per day.</p>
              </div>
            </div>
          </div>

          {/* 200-Student Scale Telemetry Dashboard */}
          <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm font-mono">
                <Activity className="w-4 h-4" />
                <span>Live Picture Mode Telemetry (Local vs Cloud Efficiency)</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  HandwritingRecognitionService.resetTelemetry();
                  setPictureTelemetry(HandwritingRecognitionService.getTelemetry());
                }}
                className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline"
              >
                Reset Telemetry
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 space-y-1">
                <div className="text-xs font-mono text-slate-400">Total Picture Checks</div>
                <div className="text-2xl font-bold font-mono text-white">{pictureTelemetry.totalAttempts}</div>
              </div>

              <div className="p-4 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 space-y-1">
                <div className="text-xs font-mono text-emerald-400">Local Engine Successes</div>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  {pictureTelemetry.localSuccesses}
                  <span className="text-xs text-slate-400 ml-1.5">
                    ({pictureTelemetry.totalAttempts > 0 ? ((pictureTelemetry.localSuccesses / pictureTelemetry.totalAttempts) * 100).toFixed(0) : 100}%)
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 space-y-1">
                <div className="text-xs font-mono text-brass-400">Manual Corrections</div>
                <div className="text-2xl font-bold font-mono text-brass-300">
                  {pictureTelemetry.manualCorrections}
                </div>
              </div>

              <div className="p-4 bg-emerald-950/40 rounded-lg border border-emerald-800/50 space-y-1">
                <div className="text-xs font-mono text-emerald-400 font-bold">Cloud Requests Saved</div>
                <div className="text-2xl font-bold font-mono text-emerald-200">
                  {pictureTelemetry.cloudRequestsAvoided}
                  <span className="text-xs text-emerald-400 ml-1.5 font-normal">avoided</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Picture Mode Sandbox */}
          <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-6 space-y-4 font-mono text-xs shadow-md">
            <div className="flex items-center space-x-2 text-brass-400 font-bold text-sm border-b border-[#2c4f75]/30 pb-2">
              <Camera className="w-4 h-4" />
              <span>Picture Mode Recognition &amp; Equivalence Sandbox</span>
            </div>

            <div className="space-y-3">
              <label className="block text-slate-400">Test Simulation String or OCR Input:</label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSandboxExpr('10(3x-1)(3x^2-2x+4)^4')}
                  className="px-2.5 py-1 bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 rounded-md text-[11px] text-slate-200"
                >
                  Correct Chain Answer
                </button>
                <button
                  type="button"
                  onClick={() => setSandboxExpr('5(3x^2-2x+4)^4')}
                  className="px-2.5 py-1 bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 rounded-md text-[11px] text-slate-200"
                >
                  Missing Inner Derivative
                </button>
                <button
                  type="button"
                  onClick={() => setSandboxExpr('2x cos(x) - x^2 sin(x)')}
                  className="px-2.5 py-1 bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 rounded-md text-[11px] text-slate-200"
                >
                  Product Rule
                </button>
                <button
                  type="button"
                  onClick={() => setSandboxExpr('1. u = 3x^2-2x+4\n2. du/dx = 6x-2\n3. dy/du = 5u^4\n4. dy/dx = 5u^4')}
                  className="px-2.5 py-1 bg-[#102d52] hover:bg-[#1d3b5e] border border-brass-500/40 rounded-md text-[11px] text-brass-300"
                >
                  Full Multi-Step Trace (Mode B)
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={sandboxExpr}
                  onChange={(e) => setSandboxExpr(e.target.value)}
                  className="flex-1 bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 text-xs font-mono rounded-lg px-3 py-2 focus:ring-2 focus:ring-brass-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const fakeDataUrl = `data:image/jpeg;base64,sample_expr=${encodeURIComponent(sandboxExpr)}`;
                    const res = await HandwritingRecognitionService.processImage(fakeDataUrl, {
                      mode: sandboxExpr.includes('\n') ? 'full_solution' : 'final_answer',
                    });
                    setSandboxResult(res);
                    setPictureTelemetry(HandwritingRecognitionService.getTelemetry());
                  }}
                  className="px-4 py-2 bg-brass-500 hover:bg-brass-400 text-[#061b3a] rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Simulate Recognition</span>
                </button>
              </div>

              {sandboxResult && (
                <div className="p-4 bg-[#06162f] border border-[#2c4f75]/30 rounded-lg space-y-3 pt-3">
                  <div className="flex justify-between text-slate-400">
                    <span>Provider: <strong className="text-brass-300">{sandboxResult.result.provider}</strong></span>
                    <span>Confidence: <strong className="text-emerald-400">{(sandboxResult.result.confidence * 100).toFixed(0)}%</strong></span>
                    <span>Cached: <strong className="text-slate-300">{sandboxResult.cached ? 'Yes' : 'No'}</strong></span>
                  </div>

                  <div className="p-3 bg-[#0a2344]/50 border border-[#2c4f75]/25 rounded-md text-center">
                    <MathRenderer latex={sandboxResult.result.expression} displayMode={true} />
                  </div>

                  {sandboxResult.result.warnings && (
                    <div className="text-amber-400 text-[11px]">
                      Warnings: {sandboxResult.result.warnings.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'curriculum' && <CurriculumBrowser />}
      {selectedTab === 'calibration' && <TeacherCalibrationDashboard />}
      {selectedTab === 'coverage' && <ContentCoverageReview />}
    </div>
  );
}
