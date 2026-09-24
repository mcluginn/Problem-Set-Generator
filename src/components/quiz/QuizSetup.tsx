'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Clock,
  CheckSquare,
  BarChart3,
  Sliders,
  Play,
  RotateCcw,
  ArrowLeft,
  Trophy,
  History,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { QuizConfig, QuizDifficultySetting, QuizQuestionFormat, QuizResult } from '@/engine/quiz/types';
import { QuizEngine } from '@/engine/quiz/quizEngine';

interface QuizSetupProps {
  initialCourseId?: string;
  onResumeQuiz?: () => void;
  onStartQuiz: (config: QuizConfig) => void;
  onNavigateHome: () => void;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({
  initialCourseId = 'COURSE-GEN0102',
  onResumeQuiz,
  onStartQuiz,
  onNavigateHome
}) => {
  const courses = curriculumRegistry.getAllCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId);

  const topics = curriculumRegistry.getTopicsByCourse(selectedCourseId);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20>(5);
  const [format, setFormat] = useState<QuizQuestionFormat>('MIXED');
  const [difficulty, setDifficulty] = useState<QuizDifficultySetting>('ADAPTIVE');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(0); // 0 = Untimed

  const [activeSession, setActiveSession] = useState(() => {
    const s = QuizEngine.loadActiveSession();
    return s && s.status === 'IN_PROGRESS' ? s : null;
  });

  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState<boolean>(false);
  const [history] = useState<QuizResult[]>(() => QuizEngine.getQuizHistory());

  const handleCourseChange = (newCourseId: string) => {
    setSelectedCourseId(newCourseId);
    setSelectedTopicId('');
  };

  const getPendingConfig = (): QuizConfig => ({
    courseId: selectedCourseId,
    topicId: selectedTopicId || undefined,
    questionCount,
    format,
    difficulty,
    timeLimitMinutes: timeLimitMinutes > 0 ? timeLimitMinutes : undefined
  });

  const handleStart = () => {
    // If an active session exists, prompt for explicit confirmation before discarding
    if (activeSession) {
      setShowOverwriteConfirm(true);
      return;
    }
    onStartQuiz(getPendingConfig());
  };

  const handleConfirmDiscardAndStart = () => {
    QuizEngine.clearActiveSession();
    setActiveSession(null);
    setShowOverwriteConfirm(false);
    onStartQuiz(getPendingConfig());
  };

  const handleResumeActive = () => {
    setShowOverwriteConfirm(false);
    if (onResumeQuiz) {
      onResumeQuiz();
    } else if (activeSession) {
      onStartQuiz(activeSession.config);
    }
  };

  const selectedCourse = curriculumRegistry.getCourseById(selectedCourseId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a2344]/80 border border-[#2c4f75]/35 rounded-xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-[#102d52] border border-brass-500/40 flex items-center justify-center text-brass-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-brass-400 uppercase tracking-widest font-bold">
              Examination & Assessment Engine
            </span>
            <h1 className="text-2xl font-bold text-white">Quiz Mode Setup</h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Structured assessment with frozen questions, multiple choice or written inputs, and detailed diagnostic review.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          aria-label="Back to Dashboard"
          className="px-4 py-2 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-200 text-xs font-bold rounded-lg border border-[#2c4f75]/40 transition flex items-center space-x-1.5 self-start sm:self-center min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-brass-400" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Active Unfinished Quiz Alert & Resume Action */}
      {activeSession && (
        <div className="bg-gradient-to-r from-[#102d52]/90 to-[#0a2344]/95 border border-brass-500/60 rounded-xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg bg-brass-500/20 border border-brass-500/40 flex items-center justify-center text-brass-400 shrink-0">
              <Play className="w-6 h-6 fill-brass-400 text-brass-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-brass-500/20 text-brass-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                  In Progress
                </span>
                <span className="text-xs font-mono text-slate-300">
                  {activeSession.config.courseId.replace('COURSE-', '')} &bull; {activeSession.questions.length} Questions
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">
                You have an unfinished assessment in progress
              </h2>
              <p className="text-xs text-slate-300">
                {activeSession.questions.filter(q => q.userAnswer || q.selectedOptionId).length} of {activeSession.questions.length} questions answered
                {activeSession.elapsedSeconds > 0 && ` • ${Math.floor(activeSession.elapsedSeconds / 60)}m elapsed`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (onResumeQuiz) {
                  onResumeQuiz();
                } else {
                  onStartQuiz(activeSession.config);
                }
              }}
              className="flex-1 sm:flex-initial px-5 py-3 bg-brass-500 hover:bg-brass-400 text-[#061b3a] text-xs font-bold font-mono rounded-lg transition flex items-center justify-center space-x-2 shadow-lg shadow-brass-500/25 min-h-[44px]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Active Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => {
                QuizEngine.clearActiveSession();
                setActiveSession(null);
              }}
              title="Discard this session and start fresh"
              className="px-3 py-3 bg-[#06162f] hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-mono rounded-lg border border-[#2c4f75]/30 transition min-h-[44px]"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Setup Options */}
        <div className="lg:col-span-2 bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center space-x-2 border-b border-[#2c4f75]/30 pb-3">
            <Sliders className="w-4 h-4 text-brass-400" />
            <span>Configure Your Assessment</span>
          </h2>

          {/* Course Selection */}
          <div className="space-y-2">
            <label id="course-selection-label" className="text-xs font-mono uppercase text-[#8ea8c0] font-bold block">
              1. Select Course
            </label>
            <div
              role="group"
              aria-labelledby="course-selection-label"
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {courses.map(c => {
                const isSelected = c.id === selectedCourseId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleCourseChange(c.id)}
                    className={`p-3 rounded-lg border text-left transition flex flex-col min-h-[44px] focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none ${
                      isSelected
                        ? 'bg-[#102d52] border-brass-500 text-white shadow-md'
                        : 'bg-[#06162f] border-[#2c4f75]/25 text-slate-400 hover:text-slate-200 hover:border-[#2c4f75]/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase text-brass-400 font-bold">{c.code}</span>
                    <span className="text-xs font-bold mt-0.5 leading-tight">{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Topic Scope Selection */}
          <div className="space-y-2">
            <label id="topic-scope-label" className="text-xs font-mono uppercase text-[#8ea8c0] font-bold block">
              2. Topic Scope
            </label>
            <select
              value={selectedTopicId}
              aria-labelledby="topic-scope-label"
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 rounded-lg px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-brass-500 min-h-[44px] focus-visible:ring-2 focus-visible:ring-brass-500"
            >
              <option value="">All Topics in {selectedCourse?.code || 'Course'} (Comprehensive)</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>
                  Topic {t.sequence}: {t.officialName}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div className="space-y-2">
            <label id="question-count-label" className="text-xs font-mono uppercase text-[#8ea8c0] font-bold block">
              3. Number of Questions
            </label>
            <div
              role="group"
              aria-labelledby="question-count-label"
              className="grid grid-cols-3 gap-3"
            >
              {([5, 10, 20] as const).map(num => {
                const isSelected = questionCount === num;
                return (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setQuestionCount(num)}
                    className={`py-3 rounded-lg border text-center font-mono text-sm font-bold min-h-[44px] transition focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none ${
                      isSelected
                        ? 'bg-brass-500 border-brass-500 text-[#061b3a]'
                        : 'bg-[#06162f] border-[#2c4f75]/25 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num} Questions
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Mode */}
          <div className="space-y-2">
            <label id="question-format-label" className="text-xs font-mono uppercase text-[#8ea8c0] font-bold block">
              4. Question Format
            </label>
            <div
              role="group"
              aria-labelledby="question-format-label"
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {[
                { id: 'MULTIPLE_CHOICE', label: 'Multiple Choice', desc: '4 options (A-D)' },
                { id: 'WRITTEN', label: 'Written / Math', desc: 'AST verified input' },
                {
                  id: 'MIXED',
                  label: questionCount === 5 ? 'Mixed (3 MCQ / 2 Written)' : 'Mixed (50% MCQ / 50% Written)',
                  desc: questionCount === 5 ? 'Balanced 3 Multiple Choice & 2 Written questions' : 'Balanced 50/50 MCQ and Written split'
                }
              ].map(f => {
                const isSelected = format === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setFormat(f.id as QuizQuestionFormat)}
                    className={`p-3.5 rounded-lg border text-left min-h-[44px] transition focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none ${
                      isSelected
                        ? 'bg-[#102d52] border-brass-500 text-white shadow-md ring-1 ring-brass-500'
                        : 'bg-[#06162f] border-[#2c4f75]/25 text-slate-400 hover:text-white hover:border-[#2c4f75]/50'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{f.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">{f.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty & Time Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#8ea8c0] font-bold block">
                5. Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as QuizDifficultySetting)}
                className="w-full bg-[#06162f] border border-[#2c4f75]/40 rounded-lg px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-brass-500 min-h-[44px]"
              >
                <option value="ADAPTIVE">Adaptive Ramp (Level 1 → 4)</option>
                <option value="EASY">Foundational (Level 1)</option>
                <option value="MEDIUM">Standard Engineering (Level 2)</option>
                <option value="HARD">Advanced Mastery (Level 3-4)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#8ea8c0] font-bold block">
                6. Time Limit
              </label>
              <select
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full bg-[#06162f] border border-[#2c4f75]/40 rounded-lg px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-brass-500 min-h-[44px]"
              >
                <option value={0}>Untimed (No timer pressure)</option>
                <option value={5}>5 Minutes</option>
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
              </select>
            </div>
          </div>

          {/* Launch CTA Button */}
          <div className="pt-4 border-t border-[#2c4f75]/30">
            <button
              type="button"
              onClick={handleStart}
              className="w-full py-4 bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-sm rounded-lg transition shadow-lg shadow-brass-500/25 flex items-center justify-center space-x-2 min-h-[48px] focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Begin Assessment ({questionCount} Questions)</span>
            </button>
            {activeSession && (
              <p className="text-[11px] font-mono text-amber-400/90 text-center mt-2 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Active assessment in progress. Starting a new assessment requires confirmation to discard.</span>
              </p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quiz Rules & Recent Quiz History */}
        <div className="space-y-6">
          {/* Rules Card */}
          <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-[#2c4f75]/30 pb-3">
              <CheckSquare className="w-4 h-4 text-brass-400" />
              <span>Examination Rules</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <li className="flex items-start space-x-2">
                <span className="text-brass-400 font-bold">•</span>
                <span><strong>Frozen Set:</strong> All questions are locked upfront with distinct algebraic structures.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-brass-400 font-bold">•</span>
                <span><strong>No Hints:</strong> Examination mode disables formative hints during the assessment.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-brass-400 font-bold">•</span>
                <span><strong>Flag & Review:</strong> You can skip forward, backward, and flag tricky questions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-brass-400 font-bold">•</span>
                <span><strong>Diagnostic Report:</strong> Immediate breakdown of misconceptions and step derivations upon submission.</span>
              </li>
            </ul>
          </div>

          {/* Past History Card */}
          <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-white font-bold text-sm border-b border-[#2c4f75]/30 pb-3">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Recent Quiz Records</span>
            </div>

            {history.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                No past quiz records yet. Take your first quiz to track your progress!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {history.slice(0, 5).map((h, idx) => (
                  <div
                    key={h.quizId || idx}
                    className="bg-[#06162f] border border-[#2c4f75]/25 rounded-lg p-3 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-200">
                        {h.config.courseId.replace('COURSE-', '')} &bull; {h.totalQuestions} Qs
                      </div>
                      <div className="text-[10px] text-[#8ea8c0] font-mono mt-0.5">
                        {new Date(h.completedAt).toLocaleDateString()} &bull; {Math.round(h.elapsedSeconds / 60)}m {h.elapsedSeconds % 60}s
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold font-mono ${h.scorePercentage >= 80 ? 'text-emerald-400' : h.scorePercentage >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {h.scorePercentage}%
                      </div>
                      <div className="text-[10px] text-[#8ea8c0] font-mono">
                        {h.correctCount} / {h.totalQuestions}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overwrite Confirmation Modal Dialog */}
      {showOverwriteConfirm && activeSession && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="discard-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#0a2344] border border-[#2c4f75]/50 rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="w-10 h-10 rounded-lg bg-amber-950/70 border border-amber-800/80 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 id="discard-modal-title" className="text-base font-bold text-white">
                  Discard Active Assessment?
                </h3>
                <span className="text-[11px] font-mono text-[#8ea8c0] uppercase tracking-wider font-semibold">
                  In-Progress Session Detected
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-[#06162f] p-4 rounded-lg border border-[#2c4f75]/30">
              <p>
                You currently have an unfinished assessment in progress for{' '}
                <strong className="text-white">{activeSession.config.courseId.replace('COURSE-', '')}</strong> with{' '}
                <strong className="text-brass-300">
                  {activeSession.questions.filter(q => q.userAnswer || q.selectedOptionId).length} of {activeSession.questions.length} questions answered
                </strong>.
              </p>
              <p className="text-rose-300 font-medium">
                Starting a new assessment will permanently discard your current progress, answers, review flags, and timer.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {/* Primary Action: Resume Active Quiz */}
              <button
                type="button"
                onClick={handleResumeActive}
                className="w-full py-3 px-4 bg-brass-500 hover:bg-brass-400 text-[#061b3a] text-xs font-bold font-mono rounded-lg transition flex items-center justify-center space-x-2 shadow-lg shadow-brass-500/25 min-h-[44px] focus-visible:ring-2 focus-visible:ring-brass-400"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Active Quiz (Recommended)</span>
              </button>

              {/* Destructive Action: Discard and Start New */}
              <button
                type="button"
                onClick={handleConfirmDiscardAndStart}
                className="w-full py-3 px-4 bg-rose-950/50 hover:bg-rose-900/70 border border-rose-800 text-rose-200 hover:text-white text-xs font-bold font-mono rounded-lg transition flex items-center justify-center space-x-2 min-h-[44px] focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <span>Discard & Start New Assessment</span>
              </button>

              {/* Cancel Action: Keep In-Progress */}
              <button
                type="button"
                onClick={() => setShowOverwriteConfirm(false)}
                className="w-full py-2.5 px-4 bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/40 text-slate-300 hover:text-slate-100 text-xs font-medium rounded-lg transition min-h-[44px] focus-visible:ring-2 focus-visible:ring-slate-500"
              >
                Cancel (Keep Current Quiz)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
