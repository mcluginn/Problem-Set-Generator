'use client';

import React, { useState, useMemo } from 'react';
import {
  TeacherCalibrationEngine,
  TeacherReviewRecord,
  TeacherDecision,
  TeacherRejectionReason,
  QualityRatingVector,
  ProblemComparisonResult,
  SessionSimulationReport
} from '@/engine/content/calibration';
import { ValidatedProblem } from '@/engine/content/types';
import { MathRenderer } from '../math/MathRenderer';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Sliders,
  Eye,
  RefreshCw,
  GitCompare,
  PlayCircle,
  Edit3,
  Bookmark,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
  Target,
  FileText,
  Activity,
  Check
} from 'lucide-react';

import { ContentRegistry } from '@/engine/content/registry';
import { CourseContentReadiness } from '@/engine/content/types';

export function TeacherCalibrationDashboard() {
  const engine = TeacherCalibrationEngine.getInstance();
  const contentRegistry = ContentRegistry.getInstance();
  const [calibrationProblems, setCalibrationProblems] = useState<ValidatedProblem[]>(() => engine.getCalibrationProblems());
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ALL');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>('ALL');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(calibrationProblems[0]?.dna.problemId || '');
  const [reviews, setReviews] = useState<Record<string, TeacherReviewRecord>>({});

  const readinessSummary = useMemo(() => contentRegistry.getCourseReadinessSummary(), []);

  // Review Form State
  const [ratings, setRatings] = useState<QualityRatingVector>({
    mathematicalCorrectness: 5,
    skillAlignment: 5,
    clarity: 5,
    difficultySuitability: 4,
    educationalUsefulness: 5,
    diversityDistinctiveness: 4
  });
  const [rejectionReasons, setRejectionReasons] = useState<TeacherRejectionReason[]>([]);
  const [teacherNotes, setTeacherNotes] = useState<string>('');

  // Problem Editor State
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedPrompt, setEditedPrompt] = useState<string>('');
  const [editedContext, setEditedContext] = useState<string>('');
  const [editStatusMessage, setEditStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Comparison State
  const [compareProblemAId, setCompareProblemAId] = useState<string>(calibrationProblems[0]?.dna.problemId || '');
  const [compareProblemBId, setCompareProblemBId] = useState<string>(calibrationProblems[1]?.dna.problemId || '');
  const [comparisonResult, setComparisonResult] = useState<ProblemComparisonResult | null>(null);

  // Session Simulator State
  const [simMode, setSimMode] = useState<'standard' | 'adaptive'>('standard');
  const [initialMastery, setInitialMastery] = useState<number>(0.3);
  const [hasMisconception, setHasMisconception] = useState<boolean>(true);
  const [simulationReport, setSimulationReport] = useState<SessionSimulationReport | null>(null);

  const filteredProblems = useMemo(() => {
    return calibrationProblems.filter(p => {
      const matchCourse = selectedCourseId === 'ALL' || p.dna.courseId === selectedCourseId;
      const matchFamily = selectedFamilyId === 'ALL' || p.dna.familyId === selectedFamilyId;
      return matchCourse && matchFamily;
    });
  }, [calibrationProblems, selectedCourseId, selectedFamilyId]);

  const selectedProblem = useMemo(() => {
    return filteredProblems.find(p => p.dna.problemId === selectedProblemId) || filteredProblems[0] || calibrationProblems[0];
  }, [filteredProblems, selectedProblemId, calibrationProblems]);

  const currentReview = selectedProblem ? reviews[selectedProblem.dna.problemId] : undefined;

  const handleDecision = (decision: TeacherDecision) => {
    if (!selectedProblem) return;

    const record = engine.submitReview({
      problemId: selectedProblem.dna.problemId,
      reviewer: 'Teacher / Curriculum Auditor',
      ratings,
      decision,
      rejectionReasons: decision === 'REJECT' || decision === 'FLAG' ? rejectionReasons : undefined,
      teacherNotes: teacherNotes || undefined
    });

    setReviews(prev => ({ ...prev, [selectedProblem.dna.problemId]: record }));
  };

  const handleSaveEdits = () => {
    if (!selectedProblem) return;

    const result = engine.editAndRevalidateProblem(
      selectedProblem.dna.problemId,
      {
        promptText: editedPrompt,
        contextStory: editedContext || undefined
      },
      'Teacher / Curriculum Auditor'
    );

    if (result.success && result.problem) {
      setCalibrationProblems(engine.getCalibrationProblems());
      setIsEditing(false);
      setEditStatusMessage({ type: 'success', message: 'Edits passed mathematical & pedagogical revalidation!' });
    } else {
      setEditStatusMessage({ type: 'error', message: result.error || 'Revalidation failed' });
    }
  };

  const handleRunComparison = () => {
    const probA = calibrationProblems.find(p => p.dna.problemId === compareProblemAId);
    const probB = calibrationProblems.find(p => p.dna.problemId === compareProblemBId);
    if (probA && probB) {
      const res = engine.compareProblems(probA, probB);
      setComparisonResult(res);
    }
  };

  const handleRunSimulation = () => {
    if (simMode === 'standard') {
      const rep = engine.simulate10QuestionSession('SKILL-GEN0102-005');
      setSimulationReport(rep);
    } else {
      const rep = engine.simulateAdaptiveSession('SKILL-GEN0102-005', {
        initialMastery,
        hasPersistentMisconception: hasMisconception ? 'MISSING_INNER_DERIVATIVE' : undefined
      });
      setSimulationReport(rep);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2c4f75]/30 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brass-500/15 text-brass-400 border border-brass-500/35">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Teacher Calibration &amp; Six-Course Content Dashboard
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                Phase 5 — Six-Course Domain Content Development with Representative Samples &amp; Structured Domain Validation.
              </p>
            </div>
          </div>
        </div>

        {/* Global Calibration Metrics Badge */}
        <div className="flex items-center gap-3 bg-[#0a2344]/80 border border-[#2c4f75]/40 p-2 rounded-xl text-xs font-mono">
          <div className="px-3 py-1 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 text-slate-300">
            <span className="text-slate-400">Active Course: </span>
            <span className="text-brass-300 font-bold">{selectedCourseId === 'ALL' ? 'All 6 Courses' : selectedCourseId}</span>
          </div>
          <div className="px-3 py-1 bg-[#06162f] rounded-lg border border-[#2c4f75]/30 text-slate-300">
            <span className="text-slate-400">Total Skills: </span>
            <span className="text-emerald-400 font-bold">71 Mapped</span>
          </div>
        </div>
      </div>

      {/* Six-Course Readiness Status Grid */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold text-brass-400 uppercase tracking-wider">
          Six-Course Content Readiness &amp; Scale Pipeline
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
          {readinessSummary.map(c => {
            const isSelected = selectedCourseId === c.courseId;
            return (
              <button
                key={c.courseId}
                type="button"
                onClick={() => setSelectedCourseId(isSelected ? 'ALL' : c.courseId)}
                className={`p-3.5 rounded-lg border text-left transition space-y-1.5 ${
                  isSelected
                    ? 'bg-[#102d52] border-brass-500/80 ring-1 ring-brass-500/50 shadow-md'
                    : 'bg-[#0a2344]/60 border-[#2c4f75]/35 hover:border-[#2c4f75]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{c.courseCode}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    c.status === 'PILOT'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : c.status === 'REPRESENTATIVE_READY'
                      ? 'bg-[#102d52] text-brass-300 border border-brass-500/40'
                      : c.status === 'CALIBRATING'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-[#06162f] text-slate-300 border border-[#2c4f75]/40'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 truncate">{c.courseName}</div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-[#2c4f75]/30">
                  <span>{c.totalSkills} Skills ({c.mappedEvidenceCount} Ev.)</span>
                  <span className="text-brass-300">{c.registeredFamiliesCount} Families</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left List (4 cols) & Right Review Area (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Calibration Batch Browser */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Calibration Batch ({filteredProblems.length})
            </span>
            <select
              value={selectedFamilyId}
              onChange={e => setSelectedFamilyId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-[11px] font-mono rounded-lg px-2 py-1 text-slate-300"
            >
              <option value="ALL">All Families (50)</option>
              <option value="FAM-GEN0102-CHAIN-POLY">CHAIN-POLY (10)</option>
              <option value="FAM-GEN0102-CHAIN-TRIG">CHAIN-TRIG (10)</option>
              <option value="FAM-GEN0102-CHAIN-ERROR">CHAIN-ERROR (10)</option>
              <option value="FAM-GEN0102-CHAIN-RECOG">CHAIN-RECOG (10)</option>
              <option value="FAM-GEN0102-CHAIN-APP">CHAIN-APP (10)</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
            {filteredProblems.map((prob, idx) => {
              const isSelected = prob.dna.problemId === selectedProblem?.dna.problemId;
              const probReview = reviews[prob.dna.problemId];

              return (
                <button
                  key={prob.dna.problemId}
                  type="button"
                  onClick={() => {
                    setSelectedProblemId(prob.dna.problemId);
                    setIsEditing(false);
                    setEditedPrompt(prob.statement.promptText);
                    setEditedContext(prob.statement.contextStory || '');
                    setEditStatusMessage(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-lg border transition space-y-1.5 ${
                    isSelected
                      ? 'bg-[#102d52] border-brass-500/80 shadow-md'
                      : 'bg-[#06162f]/80 border-[#2c4f75]/30 hover:bg-[#102d52]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-brass-400 font-bold">
                      #{idx + 1} • {prob.dna.familyId.replace('FAM-GEN0102-', '')}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0a2344] text-slate-300 border border-[#2c4f75]/30">
                        L{prob.dna.difficultyVector.overall}
                      </span>
                      {probReview && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            probReview.decision === 'APPROVE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : probReview.decision === 'REJECT'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {probReview.decision}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-200 line-clamp-1">
                    {prob.statement.promptText}
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    {prob.dna.structureSignature}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Problem Inspector, Rating Form, and Editor */}
        <div className="lg:col-span-8 space-y-6">
          {selectedProblem && (
            <div className="p-6 bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl space-y-6 shadow-md">
              {/* Problem DNA Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2c4f75]/30 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="text-brass-400 font-bold">{selectedProblem.dna.problemId}</span>
                    <span className="px-2 py-0.5 rounded bg-[#06162f] text-slate-300 border border-[#2c4f75]/30">
                      {selectedProblem.dna.familyId}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#102d52] text-brass-300 border border-brass-500/40">
                      {selectedProblem.dna.evidenceType}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#06162f] text-slate-300 border border-[#2c4f75]/30">
                      Level {selectedProblem.dna.difficultyVector.overall}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Target Skill: <span className="text-white font-semibold">{selectedProblem.dna.primarySkillId}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setEditedPrompt(selectedProblem.statement.promptText);
                    setEditedContext(selectedProblem.statement.contextStory || '');
                    setEditStatusMessage(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 text-slate-200 flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-brass-400" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Problem'}</span>
                </button>
              </div>

              {/* Problem Display / Live Editor */}
              {isEditing ? (
                <div className="p-4 bg-[#06162f] border border-brass-500/40 rounded-xl space-y-4 shadow-inner">
                  <div className="text-xs font-mono text-brass-400 font-bold uppercase">
                    Teacher Problem Editor (Auto-Revalidates on Save)
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400">Prompt Wording:</label>
                    <textarea
                      value={editedPrompt}
                      onChange={e => setEditedPrompt(e.target.value)}
                      rows={2}
                      className="w-full bg-[#0a2344] border border-[#2c4f75]/40 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:ring-2 focus:ring-brass-500 focus:outline-none"
                    />
                  </div>

                  {selectedProblem.statement.contextStory !== undefined && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-slate-400">Engineering Context Story:</label>
                      <input
                        type="text"
                        value={editedContext}
                        onChange={e => setEditedContext(e.target.value)}
                        className="w-full bg-[#0a2344] border border-[#2c4f75]/40 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:ring-2 focus:ring-brass-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {editStatusMessage && (
                    <div
                      className={`p-2.5 rounded-lg text-xs font-mono ${
                        editStatusMessage.type === 'success'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {editStatusMessage.message}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveEdits}
                    className="px-4 py-2 rounded-lg text-xs font-mono bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save &amp; Revalidate</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-sm font-semibold text-white">
                      {selectedProblem.statement.promptText}
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-lg flex items-center justify-center">
                      <MathRenderer
                        latex={selectedProblem.statement.expressionLatex}
                        displayMode={true}
                      />
                    </div>

                    {selectedProblem.statement.givenWorkLatex && (
                      <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg space-y-1">
                        <div className="text-[10px] font-mono text-rose-400 uppercase font-bold">
                          Flawed Student Work for Diagnosis:
                        </div>
                        <div className="flex justify-center">
                          <MathRenderer
                            latex={selectedProblem.statement.givenWorkLatex}
                            displayMode={true}
                          />
                        </div>
                      </div>
                    )}

                    {selectedProblem.statement.options && (
                      <div className="space-y-1.5 pt-2">
                        <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                          Options & Distractors:
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedProblem.statement.options.map(opt => (
                            <div
                              key={opt.id}
                              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                            >
                              <span>{opt.distractorLatex}</span>
                              {opt.targetedMisconceptionCode && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                                  {opt.targetedMisconceptionCode}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Verified Solution & Step Trace */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Mathematical Answer:</span>
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-center font-mono text-sm overflow-x-auto max-w-full">
                      <MathRenderer
                        latex={selectedProblem.solution.canonicalAnswerLatex}
                        displayMode={false}
                      />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">
                        Reasoning Steps ({selectedProblem.solution.reasoningTrace.length}):
                      </div>
                      <div className="space-y-1 text-xs text-slate-300 font-mono">
                        {selectedProblem.solution.reasoningTrace.map(step => (
                          <div key={step.stepIndex} className="p-2 rounded bg-slate-900 border border-slate-800">
                            <span className="text-brass-400 font-bold">Step {step.stepIndex} ({step.phase}): </span>
                            <span>{step.actionDescription}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6-Dimension Rating Form */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="text-xs font-mono font-bold text-brass-400 uppercase">
                  Teacher Pedagogical Quality Rubric (1 = Poor, 5 = Excellent)
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Math Correctness:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratings.mathematicalCorrectness}
                      onChange={e => setRatings({ ...ratings, mathematicalCorrectness: Number(e.target.value) as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Skill Alignment:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratings.skillAlignment}
                      onChange={e => setRatings({ ...ratings, skillAlignment: Number(e.target.value) as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Clarity:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratings.clarity}
                      onChange={e => setRatings({ ...ratings, clarity: Number(e.target.value) as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Difficulty Suitability:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratings.difficultySuitability}
                      onChange={e => setRatings({ ...ratings, difficultySuitability: Number(e.target.value) as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Educational Value:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratings.educationalUsefulness}
                      onChange={e => setRatings({ ...ratings, educationalUsefulness: Number(e.target.value) as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Diversity Distinctiveness:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={ratings.diversityDistinctiveness}
                      onChange={e => setRatings({ ...ratings, diversityDistinctiveness: Number(e.target.value) as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Teacher Review Note / Rationale:</label>
                  <input
                    type="text"
                    value={teacherNotes}
                    onChange={e => setTeacherNotes(e.target.value)}
                    placeholder="Enter pedagogical comments or reasons for calibration..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-slate-200"
                  />
                </div>

                {/* Decision Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDecision('APPROVE')}
                    className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Problem</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('FLAG')}
                    className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Flag Calibration</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('REJECT')}
                    className="px-4 py-2 rounded-lg text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject Candidate</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: SIDE-BY-SIDE PROBLEM COMPARISON */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Side-by-Side Problem Comparison Tool</h2>
          </div>
          <button
            type="button"
            onClick={handleRunComparison}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition"
          >
            Run Comparison
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Select Problem A:</label>
            <select
              value={compareProblemAId}
              onChange={e => setCompareProblemAId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              {calibrationProblems.map((p, idx) => (
                <option key={p.dna.problemId} value={p.dna.problemId}>
                  #{idx + 1} • {p.dna.familyId} (L{p.dna.difficultyVector.overall})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Select Problem B:</label>
            <select
              value={compareProblemBId}
              onChange={e => setCompareProblemBId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
            >
              {calibrationProblems.map((p, idx) => (
                <option key={p.dna.problemId} value={p.dna.problemId}>
                  #{idx + 1} • {p.dna.familyId} (L{p.dna.difficultyVector.overall})
                </option>
              ))}
            </select>
          </div>
        </div>

        {comparisonResult && (
          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-800/60 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold uppercase">Comparison Telemetry:</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {comparisonResult.diversityRecommendation}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500">Same Family: </span>
                <span className="text-white font-bold">{comparisonResult.isSameFamily ? 'YES' : 'NO'}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500">Same Evidence: </span>
                <span className="text-white font-bold">{comparisonResult.isSameEvidenceType ? 'YES' : 'NO'}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500">AST Similarity: </span>
                <span className="text-white font-bold">{(comparisonResult.astSimilarityScore * 100).toFixed(0)}%</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-500">Pedagogical Overlap: </span>
                <span className="text-white font-bold">{(comparisonResult.pedagogicalOverlapScore * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: SESSION DIVERSITY SIMULATOR */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">10-Question Practice Session Simulator</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={simMode}
              onChange={e => setSimMode(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 text-xs font-mono rounded-lg px-2 py-1 text-slate-300"
            >
              <option value="standard">Standard Practice Mode</option>
              <option value="adaptive">Adaptive Profile Mode</option>
            </select>
            <button
              type="button"
              onClick={handleRunSimulation}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Simulate Session</span>
            </button>
          </div>
        </div>

        {simulationReport && (
          <div className="p-4 bg-slate-950 rounded-xl border border-emerald-800/60 space-y-4 text-xs font-mono">
            <div className="text-emerald-300 font-bold">
              {simulationReport.evaluationSummary}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase">Difficulty Path:</span>
                <div className="text-white font-bold">
                  {simulationReport.difficultyTrajectory.map(d => `L${d}`).join(' → ')}
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase">Repetition Risk:</span>
                <div className="text-emerald-400 font-bold">
                  {(simulationReport.repetitionRiskScore * 100).toFixed(0)}% (Low)
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase">Remediation Targets:</span>
                <div className="text-brass-300 font-bold">
                  {simulationReport.remediationCount} Targeted Error Analyses
                </div>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase">Engineering Transfer:</span>
                <div className="text-cyan-300 font-bold">
                  {simulationReport.transferCount} Applied Kinematics
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
