'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GearAssembly } from '../mechanical/GearAssembly';
import {
  Clock,
  Flag,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  BookOpen,
  Award,
  BarChart3,
  HelpCircle,
  Check,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { QuizConfig, QuizQuestion, QuizResult, QuizSession } from '@/engine/quiz/types';
import { QuizEngine } from '@/engine/quiz/quizEngine';
import { MathRenderer } from '../math/MathRenderer';
import { MathContent } from '../math/MathContent';
import { curriculumRegistry } from '@/engine/curriculum/registry';

interface QuizScreenProps {
  initialSession?: QuizSession;
  config?: QuizConfig;
  onNavigateHome: () => void;
  onRetakeQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  initialSession,
  config,
  onNavigateHome,
  onRetakeQuiz
}) => {
  const [session, setSession] = useState<QuizSession | null>(() => {
    if (initialSession) return initialSession;
    if (!config) {
      return QuizEngine.loadActiveSession();
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(Boolean(config && !initialSession));
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (initialSession) return initialSession.currentIndex || 0;
    if (!config) {
      const active = QuizEngine.loadActiveSession();
      return active?.currentIndex || 0;
    }
    return 0;
  });

  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<number, boolean>>({});
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number } | null>(null);

  // Asynchronous Quiz Generation to prevent blocking the UI with yielding and progress reporting
  useEffect(() => {
    if (initialSession) {
      setSession(initialSession);
      setCurrentIndex(initialSession.currentIndex || 0);
      setIsLoading(false);
      return;
    }

    if (config && !session) {
      setIsLoading(true);
      setGenerationError(null);
      setGenerationProgress({ current: 0, total: config.questionCount });

      let isCancelled = false;

      (async () => {
        try {
          const newSession = await QuizEngine.createQuizAsync(
            config,
            'student-pilot',
            (current, total) => {
              if (!isCancelled) {
                setGenerationProgress({ current, total });
              }
            }
          );
          if (!isCancelled) {
            setSession(newSession);
            setCurrentIndex(newSession.currentIndex || 0);
            setIsLoading(false);
          }
        } catch (err: any) {
          if (!isCancelled) {
            console.error('Error creating quiz session:', err);
            setGenerationError(
              err?.message ||
              'Failed to assemble assessment questions. Please adjust your scope or try again.'
            );
            setIsLoading(false);
          }
        }
      })();

      return () => {
        isCancelled = true;
      };
    }
  }, [config]);

  // Timer state
  useEffect(() => {
    if (!session || result || session.status === 'COMPLETED') return;

    const timer = setInterval(() => {
      setSession(prev => {
        if (!prev) return null;
        const newElapsed = prev.elapsedSeconds + 1;
        const updated = { ...prev, elapsedSeconds: newElapsed };
        QuizEngine.saveActiveSession(updated);

        // Check if timed quiz limit reached
        if (prev.config.timeLimitMinutes && newElapsed >= prev.config.timeLimitMinutes * 60) {
          clearInterval(timer);
          handleSubmitQuiz(updated);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.status, result]);

  // Loading State
  if (isLoading) {
    const currentQ = generationProgress?.current || 0;
    const totalQ = generationProgress?.total || config?.questionCount || 5;
    const progressPercent = totalQ > 0 ? Math.min(100, Math.round((currentQ / totalQ) * 100)) : 10;

    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div
          role="status"
          aria-live="polite"
          className="p-8 sm:p-12 bg-[#0a2344]/90 border border-[#2c4f75]/35 rounded-xl space-y-5 shadow-2xl"
        >
          <GearAssembly state="generation" className="mx-auto" />
          <div>
            <span className="text-[10px] font-mono text-brass-400 uppercase tracking-widest font-bold block mb-1">
              Engine Initializing
            </span>
            <h2 className="text-xl font-bold text-white">Building assessment…</h2>
            <div className="sr-only">
              Building assessment: question {currentQ} of {totalQ} assembled, {progressPercent} percent complete.
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Assembling problem {currentQ > 0 ? `${currentQ} of ${totalQ}` : `${totalQ} questions`} with pedagogical distractors, step derivations, and diagnostic misconception targets.
            </p>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Assessment generation progress"
            className="w-full bg-[#06162f] rounded-full h-2.5 overflow-hidden border border-[#2c4f75]/30"
          >
            <div
              className="bg-gradient-to-r from-brass-500 to-emerald-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-[#8ea8c0]">
            <span>{currentQ}/{totalQ} Questions Assembled</span>
            <span>{progressPercent}%</span>
          </div>
        </div>
      </div>
    );
  }

  // Generation Error or Missing Session
  if (generationError || !session) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div
          role="alert"
          aria-live="assertive"
          className="p-8 bg-[#0a2344]/90 border border-[#2c4f75]/35 rounded-xl space-y-4 shadow-xl"
        >
          <GearAssembly state="error" className="mx-auto" />
          <h2 className="text-lg font-bold text-white">
            {generationError ? 'Assessment Generation Failed' : 'No Active Quiz Found'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {generationError || 'Could not initialize an assessment for the requested scope. Please return to setup and try again.'}
          </p>
          <button
            type="button"
            onClick={onRetakeQuiz}
            className="px-5 py-3 bg-brass-500 hover:bg-brass-400 text-[#061b3a] text-xs font-bold font-mono rounded-lg transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none"
          >
            Return to Quiz Setup
          </button>
        </div>
      </div>
    );
  }

  const currentQ = session.questions[currentIndex];
  const totalQ = session.questions.length;

  const answeredCount = session.questions.filter(
    q => (q.format === 'MULTIPLE_CHOICE' && q.selectedOptionId) || (q.format === 'WRITTEN' && q.userAnswer?.trim())
  ).length;

  const flaggedCount = session.questions.filter(q => q.isFlagged).length;

  // Question Answer update handlers
  const handleSelectOption = (optionId: string) => {
    const updatedQuestions = [...session.questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      selectedOptionId: optionId
    };
    const updated = { ...session, questions: updatedQuestions };
    setSession(updated);
    QuizEngine.saveActiveSession(updated);
  };

  const handleWrittenInput = (val: string) => {
    const updatedQuestions = [...session.questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      userAnswer: val
    };
    const updated = { ...session, questions: updatedQuestions };
    setSession(updated);
    QuizEngine.saveActiveSession(updated);
  };

  const handleToggleFlag = () => {
    const updatedQuestions = [...session.questions];
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      isFlagged: !updatedQuestions[currentIndex].isFlagged
    };
    const updated = { ...session, questions: updatedQuestions };
    setSession(updated);
    QuizEngine.saveActiveSession(updated);
  };

  const handleNavigate = (idx: number) => {
    setCurrentIndex(idx);
    if (session) {
      const updated = { ...session, currentIndex: idx };
      setSession(updated);
      QuizEngine.saveActiveSession(updated);
    }
  };

  const handleSubmitQuiz = (sessToGrade: QuizSession = session) => {
    setShowSubmitModal(false);
    const gradedResult = QuizEngine.gradeQuiz(sessToGrade);
    setResult(gradedResult);
  };

  // Remaining time calculation for timed quizzes
  const timeLimitSeconds = session.config.timeLimitMinutes ? session.config.timeLimitMinutes * 60 : 0;
  const remainingSeconds = Math.max(0, timeLimitSeconds - session.elapsedSeconds);
  const isTimeRunningOut = timeLimitSeconds > 0 && remainingSeconds < 120; // under 2 mins

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleSolution = (qIdx: number) => {
    setExpandedSolutions(prev => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  // --------------------------------------------------------------------------------
  // RESULTS & REVIEW VIEW
  // --------------------------------------------------------------------------------
  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Results Header Card */}
        <div className="bg-gradient-to-b from-[#0a2344]/90 to-[#061b3a]/95 border border-[#2c4f75]/40 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c4f75]/30 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-brass-500/15 border border-brass-500/35 flex items-center justify-center text-brass-400">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-brass-400 tracking-widest font-bold">
                  Assessment Report
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Quiz Completed</h1>
                <div className="text-xs text-slate-400 mt-0.5 font-mono">
                  {result.config.courseId.replace('COURSE-', '')} &bull; {result.config.format} Format &bull; Difficulty: {result.config.difficulty}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onRetakeQuiz}
                className="px-4 py-2.5 bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-xs rounded-lg transition shadow-md shadow-brass-500/20 flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Quiz</span>
              </button>
              <button
                onClick={onNavigateHome}
                className="px-4 py-2.5 bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 text-slate-200 font-bold text-xs rounded-lg transition flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4 text-brass-400" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-lg p-4">
              <div className="text-3xl font-mono font-bold text-white">
                {result.scorePercentage}%
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mt-1">
                Final Score ({result.correctCount} / {result.totalQuestions} Correct)
              </div>
            </div>

            <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-lg p-4">
              <div className="text-3xl font-mono font-bold text-brass-400">
                {result.mcqScore !== undefined ? `${result.mcqScore.percentage}%` : 'N/A'}
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mt-1">
                {result.mcqScore !== undefined ? `MCQ (${result.mcqScore.correct} / ${result.mcqScore.total})` : 'No MCQ Questions'}
              </div>
            </div>

            <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-lg p-4">
              <div className="text-3xl font-mono font-bold text-emerald-400">
                {result.writtenScore !== undefined ? `${result.writtenScore.percentage}%` : 'N/A'}
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mt-1">
                {result.writtenScore !== undefined ? `Written (${result.writtenScore.correct} / ${result.writtenScore.total})` : 'No Written Questions'}
              </div>
            </div>

            <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-lg p-4">
              <div className="text-3xl font-mono font-bold text-amber-400">
                {formatTimer(result.elapsedSeconds)}
              </div>
              <div className="text-[11px] font-mono text-slate-400 uppercase mt-1">Total Time Spent</div>
            </div>
          </div>

          {/* Topic Performance Breakdown */}
          {result.topicBreakdown.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-brass-400" />
                <span>Topic Mastery Breakdown</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.topicBreakdown.map(tb => (
                  <div key={tb.topicId} className="bg-[#06162f]/70 border border-[#2c4f75]/25 rounded-lg p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{tb.topicName}</span>
                      <span className="font-mono text-slate-400">{tb.correct} / {tb.total} ({tb.percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#06162f] h-2 rounded-full overflow-hidden border border-[#2c4f75]/30">
                      <div
                        className={`h-full transition-all duration-500 ${
                          tb.percentage >= 80 ? 'bg-emerald-500' : tb.percentage >= 60 ? 'bg-brass-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${tb.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Misconceptions Callout Banner (if any) */}
        {result.misconceptionsEncountered.length > 0 && (
          <div className="bg-amber-950/25 border border-amber-500/35 rounded-xl p-6 space-y-3">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Diagnostic Learning Opportunities Identified ({result.misconceptionsEncountered.length})</span>
            </div>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Our diagnostic engine pinpointed specific mathematical misconceptions in your responses. Review the detailed question explanations below to correct these patterns.
            </p>
          </div>
        )}

        {/* Per-Question Detailed Review Cards */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-brass-400" />
            <span>Question-by-Question Diagnostic Review</span>
          </h2>

          <div className="space-y-4">
            {result.questions.map((q, idx) => {
              const skill = curriculumRegistry.getSkillById(q.problem.dna.primarySkillId);
              const isCorrect = q.isCorrect;
              const isExpanded = Boolean(expandedSolutions[idx]);

              return (
                <div
                  key={idx}
                  className={`bg-[#0a2344]/60 border rounded-xl p-6 space-y-4 shadow-lg transition ${
                    isCorrect ? 'border-emerald-700/60' : 'border-rose-700/60'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-3">
                    <div className="flex items-center space-x-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                      <span className="text-sm font-bold text-white">
                        Question {idx + 1} &bull; {skill?.canonicalName || q.problem.dna.primarySkillId}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${
                        isCorrect
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  </div>

                  {/* Problem Statement */}
                  <div className="space-y-2">
                    <div className="text-sm text-slate-200 leading-relaxed font-medium">
                      <MathContent content={q.problem.statement.promptText} />
                    </div>
                    {q.problem.statement.expressionLatex &&
                      !q.problem.statement.promptText.includes(q.problem.statement.expressionLatex) && (
                      <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-lg p-3 text-center overflow-x-auto">
                        <MathContent content={q.problem.statement.expressionLatex} displayMode={true} />
                      </div>
                    )}
                  </div>

                  {/* Answer Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Student Choice */}
                    <div className={`p-3.5 rounded-lg border ${isCorrect ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-rose-950/20 border-rose-800/50'}`}>
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-1">
                        Your Submission:
                      </div>
                      {q.format === 'MULTIPLE_CHOICE' ? (
                        <div>
                          {q.selectedOptionId ? (
                            (() => {
                              const opt = q.options?.find(o => o.id === q.selectedOptionId);
                              return (
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                                    <span className="w-5 h-5 rounded-full bg-[#102d52] border border-[#2c4f75]/50 inline-flex items-center justify-center text-[11px] font-mono">
                                      {q.selectedOptionId}
                                    </span>
                                    <span>Selected Option</span>
                                  </div>
                                  <div className="bg-[#06162f] p-2 rounded-md text-xs border border-[#2c4f75]/30">
                                    <MathContent content={opt?.textLatex || ''} />
                                  </div>
                                </div>
                              );
                            })()
                          ) : (
                            <span className="text-xs text-slate-500 italic">No option selected (Skipped)</span>
                          )}
                        </div>
                      ) : (
                        <div className="font-mono text-xs text-white bg-[#06162f] p-2 rounded-md border border-[#2c4f75]/30">
                          {q.userAnswer ? <MathContent content={q.userAnswer} /> : <span className="text-slate-500 italic">No answer entered</span>}
                        </div>
                      )}
                    </div>

                    {/* Canonical Answer */}
                    <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-lg p-3.5">
                      <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold mb-1">
                        Verified Canonical Answer:
                      </div>
                      <div className="text-xs text-emerald-300 font-mono bg-[#06162f] p-2 rounded-md border border-[#2c4f75]/30">
                        <MathContent content={q.problem.solution.canonicalAnswerLatex} />
                      </div>
                    </div>
                  </div>

                  {/* Misconception Diagnostic Callout */}
                  {q.diagnosedMisconception && (
                    <div className="bg-amber-950/30 border border-amber-600/40 rounded-lg p-4 space-y-1.5">
                      <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span>Diagnostic Note: {q.diagnosedMisconception.code}</span>
                      </div>
                      <p className="text-xs text-amber-200/90 leading-relaxed">
                        {q.diagnosedMisconception.explanation}
                      </p>
                    </div>
                  )}

                  {/* Expandable Step-by-Step Derivation */}
                  <div className="border-t border-[#2c4f75]/30 pt-3">
                    <button
                      type="button"
                      onClick={() => toggleSolution(idx)}
                      className="text-xs font-mono text-brass-400 hover:text-brass-300 transition flex items-center space-x-1.5"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      <span>{isExpanded ? 'Hide Step-by-Step Derivation' : 'View Step-by-Step Derivation'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-lg p-4 space-y-3">
                        <div className="text-xs font-mono font-bold text-slate-300">
                          Complete Mathematical Derivation:
                        </div>
                        {q.problem.solution.solutionSteps && q.problem.solution.solutionSteps.length > 0 ? (
                          <div className="space-y-2">
                            {q.problem.solution.solutionSteps.map((s, sIdx) => (
                              <div key={sIdx} className="bg-[#0a2344]/40 border border-[#2c4f75]/25 rounded-lg p-3 text-xs space-y-1">
                                <div className="font-bold text-white">
                                  Step {s.stepNumber || sIdx + 1}: {s.title}
                                </div>
                                <div className="text-slate-300">
                                  <MathContent content={s.explanation} />
                                </div>
                                {s.expressionLatex && (
                                  <div className="bg-[#06162f] p-2 rounded-md text-center mt-1 border border-[#2c4f75]/25">
                                    <MathContent content={s.expressionLatex} displayMode={true} />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 leading-relaxed">
                            {q.problem.solution.whyMethodRequired || 'Direct formula execution yields the canonical answer.'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------------
  // ACTIVE QUIZ VIEW
  // --------------------------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a2344]/75 border border-[#2c4f75]/35 rounded-xl p-4 sm:px-6 shadow-md">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onNavigateHome}
            aria-label="Back to Dashboard"
            className="px-3 py-2 min-h-[44px] flex items-center space-x-1.5 rounded-lg bg-[#06162f]/90 hover:bg-[#102d52] border border-[#2c4f75]/50 hover:border-brass-500/50 text-slate-200 hover:text-white text-xs font-mono font-bold transition shadow-sm shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-brass-400" />
            <span>Back</span>
          </button>
          <div className="w-10 h-10 rounded-lg bg-brass-500/15 border border-brass-500/40 flex items-center justify-center text-brass-400 font-bold font-mono text-sm">
            {currentIndex + 1}
          </div>
          <div>
            <div className="text-xs font-mono text-brass-400 font-bold uppercase tracking-wider">
              {session.config.courseId.replace('COURSE-', '')} &bull; {session.config.format}
            </div>
            <div className="text-sm font-bold text-white">
              Question {currentIndex + 1} of {totalQ}
            </div>
          </div>
        </div>

        {/* Timer & Metrics */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          <GearAssembly state="success" scale="small" />
          <div
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border min-h-[40px] ${
              isTimeRunningOut
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                : 'bg-[#06162f] border-[#2c4f75]/40 text-slate-300'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-brass-400 shrink-0" />
            <span className="font-bold">
              {session.config.timeLimitMinutes
                ? `${formatTimer(remainingSeconds)} left`
                : formatTimer(session.elapsedSeconds)}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#06162f] px-3 py-2 rounded-lg border border-[#2c4f75]/40 text-slate-400 min-h-[40px]">
            <span>Answered:</span>
            <strong className="text-white">{answeredCount}/{totalQ}</strong>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            aria-label="Finish and review quiz"
            className="px-4 py-2 bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold rounded-lg transition shadow-md shadow-brass-500/20 flex items-center space-x-1.5 min-h-[40px] focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:outline-none"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Finish</span>
          </button>
        </div>
      </div>

      {/* Question Palette Strip */}
      <div
        role="group"
        aria-label="Question Navigation Palette"
        className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-3 flex items-center space-x-2 overflow-x-auto"
      >
        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold shrink-0 pr-2">
          Palette:
        </span>
        {session.questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered = Boolean(
            (q.format === 'MULTIPLE_CHOICE' && q.selectedOptionId) ||
            (q.format === 'WRITTEN' && q.userAnswer?.trim())
          );
          const isFlagged = q.isFlagged;

          return (
            <button
              key={idx}
              type="button"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`Question ${idx + 1}${isFlagged ? ', flagged' : ''}${isAnswered ? ', answered' : ', unanswered'}`}
              onClick={() => handleNavigate(idx)}
              className={`relative min-w-[40px] h-[40px] rounded-lg font-mono text-xs font-bold transition flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:outline-none ${
                isCurrent
                  ? 'bg-brass-500 text-[#061b3a] ring-2 ring-brass-400'
                  : isAnswered
                  ? 'bg-[#102d52] border border-brass-500/50 text-slate-100'
                  : 'bg-[#06162f] border border-[#2c4f75]/30 text-slate-400 hover:text-white hover:border-[#2c4f75]/60'
              }`}
            >
              <span>{idx + 1}</span>
              {isFlagged && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-3">
          <span className="text-[11px] font-mono uppercase text-brass-400/90 font-bold">
            {currentQ.problem.dna.evidenceType} &bull; Difficulty Level {Math.round(currentQ.problem.dna.difficultyVector.overall)}
          </span>

          <button
            type="button"
            aria-pressed={currentQ.isFlagged}
            onClick={handleToggleFlag}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border text-xs font-mono font-bold transition min-h-[40px] focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:outline-none ${
              currentQ.isFlagged
                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                : 'bg-[#06162f] border border-[#2c4f75]/35 text-slate-400 hover:text-white'
            }`}
          >
            <Flag className={`w-3.5 h-3.5 ${currentQ.isFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>{currentQ.isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
          </button>
        </div>

        {/* Prompt Statement */}
        <div className="space-y-3">
          <div className="text-lg font-bold text-white leading-relaxed">
            <MathContent content={currentQ.problem.statement.promptText} />
          </div>

          {currentQ.problem.statement.expressionLatex &&
            !currentQ.problem.statement.promptText.includes(currentQ.problem.statement.expressionLatex) && (
            <div className="bg-[#06162f]/80 border border-[#2c4f75]/35 rounded-lg p-5 text-center overflow-x-auto">
              <MathContent content={currentQ.problem.statement.expressionLatex} displayMode={true} />
            </div>
          )}
        </div>

        {/* Input Format Rendering: MCQ or Written */}
        <div className="pt-2">
          {currentQ.format === 'MULTIPLE_CHOICE' ? (
            <div className="space-y-3">
              <span id="mcq-options-label" className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">
                Select One Best Option:
              </span>
              <div
                role="group"
                aria-labelledby="mcq-options-label"
                className="grid grid-cols-1 gap-3"
              >
                {currentQ.options?.map(opt => {
                  const isSelected = currentQ.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-4 rounded-lg border text-left transition flex items-center space-x-4 min-h-[52px] focus-visible:ring-2 focus-visible:ring-brass-400 focus-visible:outline-none ${
                        isSelected
                          ? 'bg-[#102d52] border-brass-500/80 text-white shadow-md shadow-brass-500/10'
                          : 'bg-[#06162f]/80 border border-[#2c4f75]/30 text-slate-300 hover:border-[#2c4f75]/60 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-md font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-brass-500 text-[#061b3a]'
                            : 'bg-[#102d52] text-slate-300 border border-[#2c4f75]/40'
                        }`}
                      >
                        {opt.id}
                      </div>
                      <div className="flex-1 overflow-x-auto font-medium text-sm">
                        <MathContent content={opt.textLatex} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase text-slate-400 font-bold block">
                Enter Mathematical Derivative / Solution:
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={currentQ.userAnswer || ''}
                  onChange={(e) => handleWrittenInput(e.target.value)}
                  placeholder="e.g. 12x^2 + 3 or 6"
                  className="w-full bg-[#06162f] border border-[#2c4f75]/40 focus:border-brass-500 rounded-lg px-4 py-3 text-white font-mono text-base focus:outline-none min-h-[48px]"
                />
                {currentQ.userAnswer && (
                  <div className="bg-[#06162f]/60 border border-[#2c4f75]/30 rounded-lg p-3 flex items-center space-x-2 text-xs">
                    <span className="text-slate-400 font-mono">Rendered Preview:</span>
                    <div className="text-white">
                      <MathContent content={currentQ.userAnswer} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Previous & Next Navigation Controls */}
        <div className="flex items-center justify-between border-t border-[#2c4f75]/30 pt-4">
          <button
            type="button"
            onClick={() => handleNavigate(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-lg border border-[#2c4f75]/40 bg-[#06162f] text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center space-x-1.5 min-h-[40px] text-xs font-bold font-mono"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentIndex === totalQ - 1 ? (
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="px-6 py-2.5 rounded-lg bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold transition flex items-center space-x-2 min-h-[40px] text-xs shadow-md shadow-brass-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Review & Submit Quiz</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavigate(Math.min(totalQ - 1, currentIndex + 1))}
              className="px-5 py-2.5 rounded-lg bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 text-white font-bold transition flex items-center space-x-1.5 min-h-[40px] text-xs font-mono"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a2344] border border-[#2c4f75]/45 rounded-xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-brass-500/15 border border-brass-500/40 flex items-center justify-center text-brass-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Submit Assessment?</h3>
                <p className="text-xs text-slate-400">Review your completion status before finalizing.</p>
              </div>
            </div>

            <div className="bg-[#06162f] border border-[#2c4f75]/30 rounded-lg p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Questions:</span>
                <span className="text-white font-bold">{totalQ}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Answered:</span>
                <span className="text-emerald-400 font-bold">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unanswered / Skipped:</span>
                <span className={totalQ - answeredCount > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                  {totalQ - answeredCount}
                </span>
              </div>
              {flaggedCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-amber-400">Flagged for Review:</span>
                  <span className="text-amber-400 font-bold">{flaggedCount}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 text-slate-300 rounded-lg text-xs font-bold transition min-h-[40px]"
              >
                Keep Reviewing
              </button>
              <button
                type="button"
                onClick={() => handleSubmitQuiz()}
                className="px-5 py-2.5 bg-brass-500 hover:bg-brass-400 text-[#061b3a] rounded-lg text-xs font-bold transition min-h-[40px] shadow-md shadow-brass-500/20"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
