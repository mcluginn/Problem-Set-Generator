'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GearAssembly } from '../mechanical/GearAssembly';
import { MechanicalLoader } from '../mechanical/MechanicalLoader';
import { UnifiedPracticeStore } from '@/engine/adaptive/store';
import { PracticeSession, PracticeAttempt, SessionSummary, AdaptiveConstraintPolicy } from '@/engine/adaptive/types';
import { ValidatedProblem, DomainValidationResult } from '@/engine/content/types';
import { DomainValidatorRegistry } from '@/engine/content/domainValidators';
import { MisconceptionEngine, MisconceptionDiagnosis } from '@/engine/math/misconceptions';
import { MathParser } from '@/engine/math/parser';
import { EquivalenceEngine } from '@/engine/math/equivalence';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { MathRenderer } from '../math/MathRenderer';
import { MathContent } from '../math/MathContent';
import { MathInput } from '../math/MathInput';
import { DomainFeedbackCard } from './DomainFeedbackCard';
import { DistractorGenerator } from '@/engine/quiz/distractorGenerator';
import { DeterministicFallbackProvider, TutorContext } from '@/services/ai';
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Flame,
  Clock,
  RotateCcw,
  Bot,
  AlertTriangle,
  Send,
  Sparkles,
  ListChecks,
  Keyboard,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Sliders,
  TrendingDown,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface PracticeScreenProps {
  initialCourseId?: string;
  initialTopicId?: string;
  initialSkillId?: string;
  initialMode?: import('@/engine/adaptive/types').PracticeMode;
  initialSessionLength?: number;
  isInstructorMode?: boolean;
  onNavigateHome?: () => void;
}

interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  initialCourseId = 'COURSE-GEN0102',
  initialTopicId,
  initialSkillId,
  initialMode = 'RECOMMENDED',
  initialSessionLength = 5,
  isInstructorMode = false,
  onNavigateHome
}) => {
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [problem, setProblem] = useState<ValidatedProblem | null>(null);
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [diagnosis, setDiagnosis] = useState<MisconceptionDiagnosis | null>(null);
  const [domainResult, setDomainResult] = useState<DomainValidationResult | undefined>(undefined);
  // Audit disclosure (defaults to true for Instructor/Admin mode, false for Student mode)
  const [showAuditDisclosure, setShowAuditDisclosure] = useState<boolean>(Boolean(isInstructorMode));

  useEffect(() => {
    setShowAuditDisclosure(Boolean(isInstructorMode));
  }, [isInstructorMode]);

  // Progressive hints
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [showSolutionDrawer, setShowSolutionDrawer] = useState<boolean>(false);

  // Socratic Tutor
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([]);
  const [tutorQuestion, setTutorQuestion] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Multiple Choice (MCQ) Mode Toggle
  const [isMcqMode, setIsMcqMode] = useState<boolean>(false);

  // Dynamic MCQ Options (hook must be at top-level before early returns)
  const isInherentlyMcq = Boolean(problem?.statement?.options && problem.statement.options.length > 0);
  const isMcqActive = isInherentlyMcq || isMcqMode;

  const mcqOptions = useMemo(() => {
    if (!problem) return [];
    if (problem.statement?.options && problem.statement.options.length > 0) {
      return problem.statement.options.map((opt, idx) => ({
        id: opt.id || String.fromCharCode(65 + idx),
        label: opt.id || String.fromCharCode(65 + idx),
        latex: opt.distractorLatex,
        raw: opt.distractorRaw || opt.distractorLatex,
      }));
    }
    try {
      const generated = DistractorGenerator.generateOptions(problem);
      return generated.map((opt) => ({
        id: opt.label,
        label: opt.label,
        latex: opt.textLatex,
        raw: opt.textRaw,
      }));
    } catch (err) {
      console.warn('Could not generate dynamic distractors:', err);
      const canonical = problem.solution?.canonicalAnswerLatex || '0';
      if (canonical.includes('=')) {
        const m = Array.from(canonical.matchAll(/-?\d+(?:\.\d+)?/g));
        if (m.length > 0) {
          const makeCand = (factor: number) => {
            const lastM = m[m.length - 1];
            const v = parseFloat(lastM[0]);
            const nv = (v * factor).toFixed(lastM[0].includes('.') ? 2 : 0);
            return canonical.substring(0, lastM.index!) + nv + canonical.substring(lastM.index! + lastM[0].length);
          };
          return [
            { id: 'A', label: 'A', latex: canonical, raw: canonical },
            { id: 'B', label: 'B', latex: makeCand(0.85), raw: makeCand(0.85) },
            { id: 'C', label: 'C', latex: makeCand(1.15), raw: makeCand(1.15) },
            { id: 'D', label: 'D', latex: makeCand(0.50), raw: makeCand(0.50) },
          ];
        }
      }
      return [
        { id: 'A', label: 'A', latex: canonical, raw: canonical },
        { id: 'B', label: 'B', latex: `${canonical} + 1`, raw: `${canonical} + 1` },
        { id: 'C', label: 'C', latex: `-${canonical}`, raw: `-${canonical}` },
        { id: 'D', label: 'D', latex: `2(${canonical})`, raw: `2(${canonical})` },
      ];
    }
  }, [problem]);

  // Timing
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Session Summary (When Complete)
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [announcement, setAnnouncement] = useState<string>('');

  // Initialize Practice Session with strict scope
  useEffect(() => {
    const newSession = UnifiedPracticeStore.startSession(initialCourseId, {
      mode: initialMode,
      targetTopicId: initialTopicId,
      targetSkillId: initialSkillId,
      sessionLength: initialSessionLength
    });
    setSession(newSession);
    setProblem(newSession.currentProblem || null);
    setStartTime(Date.now());
    setElapsedSeconds(0);

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initialCourseId, initialTopicId, initialSkillId, initialMode, initialSessionLength]);

  // Handle Form Submission (Typed or Photo)
  const handleSubmitAnswer = (answerToSubmit?: string, isFromPhoto = false) => {
    const finalAnswer = (answerToSubmit !== undefined ? answerToSubmit : studentAnswer).trim();
    if (!finalAnswer || !session || !problem || isSubmitting) return;

    setIsSubmitting(true);
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

    // 1. Evaluate Correctness
    let correct = false;
    let mistakeCode: string | undefined;
    let mistakeName: string | undefined;

    const canonicalAns = problem.solution.canonicalAnswerLatex.trim();
    const canonicalRaw = problem.solution.canonicalAnswerRaw?.trim() || canonicalAns;

    // Direct String / Regex Match or Numeric Evaluation
    // Also strip possible variable prefixes: e.g. "L = 6" -> "6", "y = 6" -> "6", "ans = 6" -> "6"
    const stripVarPrefix = (s: string) => s.replace(/^(?:[a-zA-Z_]|ans)\s*=\s*/, '');
    const cleanStudent = stripVarPrefix(finalAnswer).replace(/\s/g, '').replace(/,/g, '');
    const cleanCanonical = stripVarPrefix(canonicalAns).replace(/\s/g, '').replace(/,/g, '');
    const cleanRaw = stripVarPrefix(canonicalRaw).replace(/\s/g, '').replace(/,/g, '');

    const studentNum = parseFloat(cleanStudent.replace(/[^\d.-]/g, ''));
    const canonicalNum = parseFloat(cleanCanonical.replace(/[^\d.-]/g, ''));

    let studentNode: any = null;
    try {
      studentNode = MathParser.parse(finalAnswer);
    } catch {
      // Non-algebraic string or syntax exception
    }

    if (
      cleanStudent === cleanCanonical ||
      cleanStudent === cleanRaw ||
      (!isNaN(studentNum) && !isNaN(canonicalNum) && Math.abs(studentNum - canonicalNum) < 0.01)
    ) {
      correct = true;
    } else if (problem.acceptedEquivalents && Array.isArray(problem.acceptedEquivalents)) {
      // Check against authoritative accepted equivalent representations from Golden Master
      for (const eq of problem.acceptedEquivalents) {
        const cleanEq = stripVarPrefix(eq).replace(/\s/g, '').replace(/,/g, '');
        const eqNum = parseFloat(cleanEq.replace(/[^\d.-]/g, ''));
        if (
          cleanStudent === cleanEq ||
          (!isNaN(studentNum) && !isNaN(eqNum) && Math.abs(studentNum - eqNum) < 0.01)
        ) {
          correct = true;
          break;
        }
      }
    }

    if (!correct && studentNode) {
      // 1b. AST Equivalence Check via EquivalenceEngine
      try {
        const canonicalAst = MathParser.parse(cleanRaw || cleanCanonical);
        const eqResult = EquivalenceEngine.check(studentNode, canonicalAst, {
          targetVariable: problem.statement.independentVariable || 'x'
        });
        if (eqResult.equivalent) {
          correct = true;
        }
      } catch {
        // Equivalence check exception
      }
    }

    if (!correct && studentNode) {
      // Diagnose Misconception if applicable for calculus expressions
      try {
        const exprNode = problem.rawExpression;
        const diag = MisconceptionEngine.diagnose(
          studentNode,
          exprNode,
          skill?.canonicalName || 'Calculus',
          problem.statement.independentVariable || 'x'
        );
        if (diag && diag.detected && diag.code) {
          setDiagnosis(diag);
          mistakeCode = diag.code;
          mistakeName = diag.name;
        }
      } catch {
        // Fallback for non-algebraic string inputs
      }
    }

    setIsCorrect(correct);

    // 2. Run Domain Invariant Validation
    const domainVal = DomainValidatorRegistry.validate(problem);
    setDomainResult(domainVal);

    // 3. Submit Attempt through Unified Practice Store with Idempotency Guard
    const res = UnifiedPracticeStore.submitAttempt(session.id, {
      studentAnswer: finalAnswer,
      source: isFromPhoto ? 'PICTURE' : 'TYPED',
      isCorrect: correct,
      timeSpentSeconds: elapsedSeconds,
      hintLevelUsed: unlockedHintLevel,
      solutionViewed: showSolutionDrawer,
      mistakeCode,
      mistakeName,
      idempotencyKey: `ATT-${session.id}-${problem.dna.problemId}-${newAttemptCount}`
    });

    setSession({ ...res.session });

    if (res.isSessionComplete) {
      const summary = UnifiedPracticeStore.completeSession(session.id);
      setSessionSummary(summary);
    }

    setIsSubmitting(false);
  };

  // Next Problem Continuation with Student Preference Policy
  const handleNextProblem = (policy?: AdaptiveConstraintPolicy, customAnnouncement?: string) => {
    if (!session || isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      try {
        const prevExpr = problem?.statement?.expressionLatex || problem?.statement?.promptText || '';
        const prevSig = problem?.dna?.structureSignature || '';
        const prevId = problem?.dna?.problemId || '';

        const res = UnifiedPracticeStore.nextProblem(session.id, policy);
        const newExpr = res.problem?.statement?.expressionLatex || res.problem?.statement?.promptText || '';
        const newSig = res.problem?.dna?.structureSignature || '';
        const newId = res.problem?.dna?.problemId || '';

        setSession({ ...session, currentProblemId: res.decision.selectedProblemId, currentProblem: res.problem });
        setProblem(res.problem || null);
        setStudentAnswer('');
        setAttemptCount(0);
        setIsCorrect(null);
        setDiagnosis(null);
        setDomainResult(undefined);
        setShowAuditDisclosure(Boolean(isInstructorMode));
        setUnlockedHintLevel(0);
        setShowSolutionDrawer(false);
        setTutorMessages([]);
        setElapsedSeconds(0);
        setStartTime(Date.now());

        if (customAnnouncement) {
          if (res.problem && (newExpr !== prevExpr || newSig !== prevSig || newId !== prevId)) {
            setAnnouncement(customAnnouncement);
          } else {
            setAnnouncement('No additional unique problems available for this configuration.');
          }
        } else if (res.problem) {
          setAnnouncement('Loaded next problem');
        }
      } catch (err) {
        console.error('Error transitioning to next problem:', err);
      } finally {
        setIsTransitioning(false);
      }
    }, 50);
  };

  // Context-Aware Socratic Tutor Question Handler
  const handleSendTutorMessage = async () => {
    if (!tutorQuestion.trim() || !problem || aiLoading) return;
    const cleanQ = tutorQuestion.trim();
    const userMsg: TutorMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: cleanQ,
      timestamp: Date.now()
    };

    const newHistory = [...tutorMessages, userMsg];
    setTutorMessages(newHistory);
    setTutorQuestion('');
    setAiLoading(true);

    try {
      const tutorContext: TutorContext = {
        problemPrompt: problem.statement.promptText,
        expressionLatex: problem.statement.expressionLatex || problem.rawExpression?.toString() || '',
        verifiedAnswerLatex: problem.solution.canonicalAnswerLatex,
        concept: skill?.canonicalName || problem.dna.primarySkillId,
        topic: session?.targetTopicId || 'General Engineering',
        subject: course?.title || 'Engineering',
        whyMethodRequired: problem.solution.whyMethodRequired,
        engineeringInterpretation: problem.solution.engineeringInterpretation,
        physicalUnits: problem.statement.physicalUnits,
        commonMistake: problem.commonMistake,
        solutionSteps:
          problem.solution.solutionSteps && problem.solution.solutionSteps.length > 0
            ? problem.solution.solutionSteps
            : problem.solution.reasoningTrace?.map((st, idx) => ({
                stepNumber: idx + 1,
                title: st.actionDescription,
                ruleName: st.actionDescription,
                expressionLatex: st.intermediateExpressionLatex || '',
                explanation: st.actionDescription,
              })) || [],
        hints: problem.hints?.map((h) => ({
          level: h.level,
          text: h.text,
          mathematicalFocus: (h as { mathematicalFocus?: string; hintLatex?: string }).mathematicalFocus || (h as { hintLatex?: string }).hintLatex,
        })),
        studentAnswerRaw: studentAnswer,
        mistakeClassification: diagnosis?.name,
        mistakeDiagnosis: diagnosis?.diagnosis || diagnosis?.guidanceTip,
        studentQuestion: cleanQ,
        conversationHistory: newHistory.map((h) => ({ role: h.role, text: h.text })),
      };

      let answer: string | undefined;

      // Try server-side /api/tutor first (allows Gemini live AI if configured)
      try {
        const res = await fetch('/api/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: tutorContext,
            question: cleanQ,
            history: newHistory.map((h) => ({ role: h.role, text: h.text })),
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.response) {
            answer = data.response;
          }
        }
      } catch {
        // Fallback to client-side deterministic engine if network/server is unavailable
      }

      // If server didn't respond or no API key, use client-side DeterministicFallbackProvider
      if (!answer) {
        const fallback = new DeterministicFallbackProvider();
        answer = await fallback.answerTutorQuestion(
          tutorContext,
          cleanQ,
          newHistory.map((h) => ({ role: h.role, text: h.text }))
        );
      }

      const assistantMsg: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        text: answer,
        timestamp: Date.now(),
      };
      setTutorMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: TutorMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        text: `Review the primary formula for **${skill?.canonicalName || 'this skill'}** and compare each term in your derivation.`,
        timestamp: Date.now(),
      };
      setTutorMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setAiLoading(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  if (!session) {
    return <div className="max-w-xl mx-auto px-4 py-16"><MechanicalLoader label="Loading next problem..." scale="medium" /></div>;
  }

  if (!problem) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="p-8 bg-[#0a2344] border border-[#2c4f75]/40 rounded-xl space-y-4 shadow-xl">
          <GearAssembly state="error" className="mx-auto" />
          <h2 className="text-lg font-bold text-white">No Suitable Problem in Selected Scope</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            We couldn&apos;t find an eligible problem for this specific topic configuration yet. You can try adjusting your practice options or return to the dashboard.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-200 text-xs font-bold rounded-lg border border-[#2c4f75]/40 transition"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => handleNextProblem()}
              className="px-4 py-2 bg-brass-500 hover:bg-brass-400 text-[#061b3a] text-xs font-bold rounded-lg transition"
            >
              Retry Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Session Summary Screen
  if (sessionSummary) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-gradient-to-b from-[#0a2344]/90 to-[#061b3a]/95 border border-[#2c4f75]/35 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-brass-400 font-bold">
                  Practice Session Completed
                </span>
                <h1 className="text-2xl font-bold text-white">Session Performance Summary</h1>
              </div>
            </div>
            <span className="text-xs font-mono text-[#8ea8c0] bg-[#102d52] border border-[#2c4f75]/40 px-3 py-1.5 rounded-lg">
              {sessionSummary.mode}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#06162f]/70 border border-[#2c4f75]/30 rounded-lg p-4">
              <div className="text-2xl font-mono font-bold text-white">
                {sessionSummary.totalProblemsSolved} / {sessionSummary.totalProblemsAttempted}
              </div>
              <div className="text-[10px] font-mono text-[#8ea8c0] uppercase mt-1">Solved First Try</div>
            </div>

            <div className="bg-[#06162f]/70 border border-[#2c4f75]/30 rounded-lg p-4">
              <div className="text-2xl font-mono font-bold text-emerald-400">
                {sessionSummary.totalHintsUsed}
              </div>
              <div className="text-[10px] font-mono text-[#8ea8c0] uppercase mt-1">Hints Used</div>
            </div>

            <div className="bg-[#06162f]/70 border border-[#2c4f75]/30 rounded-lg p-4">
              <div className="text-2xl font-mono font-bold text-brass-400">
                {Math.round(sessionSummary.totalTimeSpentSeconds / 60)}m {sessionSummary.totalTimeSpentSeconds % 60}s
              </div>
              <div className="text-[10px] font-mono text-[#8ea8c0] uppercase mt-1">Total Time</div>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase text-slate-300">Skills Practiced</h3>
            <div className="space-y-2">
              {sessionSummary.skillsPracticed.map((sId) => {
                const skillItem = curriculumRegistry.getSkillById(sId);
                const isStrong = sessionSummary.strongSkills.includes(sId);
                const needsReview = sessionSummary.skillsNeedingReview.includes(sId);
                return (
                  <div
                    key={sId}
                    className="flex items-center justify-between p-3 bg-[#06162f]/70 border border-[#2c4f75]/25 rounded-lg text-xs"
                  >
                    <span className="text-slate-200 font-medium">{skillItem?.canonicalName || sId}</span>
                    <span
                      className={`font-mono font-bold px-2.5 py-1 rounded-md ${
                        isStrong
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : needsReview
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-[#102d52] text-slate-300 border border-[#2c4f75]/40'
                      }`}
                    >
                      {isStrong ? 'Strong' : needsReview ? 'Needs Review' : 'Practiced'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Next Action */}
          {sessionSummary.recommendedNextSkillId && (
            <div className="bg-[#06162f]/90 border border-[#2c4f75]/35 rounded-lg p-4 space-y-1.5">
              <span className="text-[11px] font-mono text-brass-400 uppercase font-bold">
                Adaptive Next Recommendation
              </span>
              <p className="text-sm text-slate-200 font-medium">
                {sessionSummary.recommendedNextReason}
              </p>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2c4f75]/30">
            <button
              onClick={onNavigateHome}
              className="px-5 py-2.5 rounded-lg border border-[#2c4f75]/40 hover:bg-[#102d52] text-slate-300 font-medium text-sm transition"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => {
                setSessionSummary(null);
                const nextSess = UnifiedPracticeStore.startSession(session.courseId, {
                  mode: 'RECOMMENDED',
                  targetSkillId: sessionSummary.recommendedNextSkillId
                });
                setSession(nextSess);
                setProblem(nextSess.currentProblem || null);
              }}
              className="px-6 py-2.5 rounded-lg bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-sm flex items-center space-x-2 shadow-lg shadow-brass-500/20 transition"
            >
              <span>Continue Recommended Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const skill = curriculumRegistry.getSkillById(problem.dna.primarySkillId);
  const course = curriculumRegistry.getCourseById(session.courseId);
  const topic = session.targetTopicId
    ? curriculumRegistry.getTopicById(session.targetTopicId)
    : (skill ? curriculumRegistry.getTopicForSkill(skill.id) : undefined);

  const currentDifficulty = Math.round(problem.dna.difficultyVector?.overall ?? 2);
  const minDifficulty = 1;
  const maxDifficulty = 4;
  const isAtMinDifficulty = currentDifficulty <= minDifficulty;
  const isAtMaxDifficulty = currentDifficulty >= maxDifficulty;
  const targetEasierDifficulty = Math.max(minDifficulty, currentDifficulty - 1);
  const targetHarderDifficulty = Math.min(maxDifficulty, currentDifficulty + 1);

  const handleEasier = () => {
    if (isAtMinDifficulty || isTransitioning) {
      if (isAtMinDifficulty) {
        setAnnouncement('Already at the easiest level (Level 1).');
      }
      return;
    }
    handleNextProblem(
      {
        courseId: session.courseId,
        forceDifficulty: targetEasierDifficulty,
        forceTopicId: session.targetTopicId,
        forceSkillId: problem.dna.primarySkillId,
        forceTaskType: problem.dna.taskType
      },
      `Loaded an easier problem at Level ${targetEasierDifficulty}.`
    );
  };

  const handleHarder = () => {
    if (isAtMaxDifficulty || isTransitioning) {
      if (isAtMaxDifficulty) {
        setAnnouncement(`Already at the hardest level (Level ${maxDifficulty}).`);
      }
      return;
    }
    handleNextProblem(
      {
        courseId: session.courseId,
        forceDifficulty: targetHarderDifficulty,
        forceTopicId: session.targetTopicId,
        forceSkillId: problem.dna.primarySkillId,
        forceTaskType: problem.dna.taskType
      },
      `Loaded a harder problem at Level ${targetHarderDifficulty}.`
    );
  };

  const handleAnotherLikeThis = () => {
    if (isTransitioning) return;
    handleNextProblem(
      {
        courseId: session.courseId,
        forceSkillId: problem.dna.primarySkillId,
        forceTopicId: session.targetTopicId,
        forceDifficulty: currentDifficulty,
        forceTaskType: problem.dna.taskType,
        excludeProblemIds: problem ? [problem.dna.problemId] : [],
        excludeSignatures: problem ? [problem.dna.structureSignature] : [],
        excludeArchetypeIds: problem?.dna?.archetypeId ? [problem.dna.archetypeId] : []
      },
      `Loaded another problem for the same skill.`
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 overflow-x-hidden">
      {/* Live Accessibility Announcement for Screen Readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a2344]/80 border border-[#2c4f75]/35 rounded-xl px-5 py-3.5 shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => (onNavigateHome ? onNavigateHome() : window.history.back())}
            aria-label="Back to Dashboard"
            className="px-3 py-2 min-h-[44px] flex items-center space-x-1.5 rounded-lg bg-[#06162f]/90 hover:bg-[#102d52] border border-[#2c4f75]/50 hover:border-brass-500/50 text-slate-200 hover:text-white text-xs font-mono font-bold transition shadow-sm shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-brass-400" />
            <span>Back</span>
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-brass-400 uppercase font-bold">
                {course?.code || 'GEN 0102'} &bull; {session.mode.replace('_', ' ')}
              </span>
              {topic && (
                <span className="text-[10px] font-mono bg-[#102d52] text-[#dfe7ee] border border-[#2c4f75]/50 px-2 py-0.5 rounded-md font-bold">
                  Topic: {topic.officialName}
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-white mt-0.5">{problem.dna.learningObjective || skill?.canonicalName || problem.dna.primarySkillId}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#8ea8c0]">
          <div className="flex items-center space-x-1.5 bg-[#06162f] px-3 py-1.5 rounded-lg border border-[#2c4f75]/30">
            <span>Problem</span>
            <strong className="text-white">
              {session.problemsCompleted + 1} / {session.sessionLength}
            </strong>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#06162f] px-3 py-1.5 rounded-lg border border-[#2c4f75]/30">
            <Clock className="w-3.5 h-3.5 text-brass-400" />
            <span className="text-white">
              {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Problem & Submission Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgba(2,12,29,0.5)]">
            {/* Statement Prompt */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#8ea8c0] font-bold">
                <span>{problem.dna.evidenceType} Practice &bull; Level {Math.round(problem.dna.difficultyVector.overall)}</span>
                {problem.dna.taskType && (
                  <span className="px-2 py-0.5 rounded bg-[#102d52] border border-[#2c4f75]/40 text-emerald-300">
                    {problem.dna.taskType.replace(/_/g, ' ')}
                  </span>
                )}
                {problem.dna.archetypeId && (
                  <span className="px-2 py-0.5 rounded bg-[#06162f] border border-[#2c4f75]/40 text-brass-300">
                    {problem.dna.archetypeId.replace('ARCH-HOMO-', '')}
                  </span>
                )}
              </div>
              <div className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                <MathContent content={problem.statement.promptText} />
              </div>
            </div>

            {/* Expression / Formula Display */}
            {problem.statement.expressionLatex &&
              !problem.statement.promptText.includes(problem.statement.expressionLatex) && (
                <div className="bg-[#06162f]/90 border border-[#2c4f75]/35 rounded-lg p-5 text-center overflow-x-auto">
                  <MathContent content={problem.statement.expressionLatex} displayMode={true} />
                </div>
              )}

            {/* Error Analysis Work (if applicable) */}
            {problem.statement.givenWorkLatex && (
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-lg p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                  Student Given Work to Evaluate:
                </span>
                <MathContent content={problem.statement.givenWorkLatex} displayMode={true} />
              </div>
            )}

            {/* Multiple Choice (MCQ) or Math Input */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor={!isMcqActive ? 'student-math-input' : undefined}
                    className="block text-xs font-mono text-[#8ea8c0] uppercase font-bold"
                  >
                    {isMcqActive ? 'Select Correct Option:' : 'Your Canonical Answer:'}
                  </label>
                  {problem.statement.physicalUnits && !isMcqActive && (
                    <span className="text-[11px] font-mono text-brass-400 font-bold">
                      Units: {problem.statement.physicalUnits}
                    </span>
                  )}
                </div>

                {!isInherentlyMcq && (
                  <button
                    type="button"
                    onClick={() => setIsMcqMode((prev) => !prev)}
                    disabled={isCorrect === true}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[#2c4f75]/50 bg-[#06162f] hover:bg-[#102d52] hover:border-brass-500/60 text-brass-400 hover:text-brass-300 text-xs font-mono font-bold transition shadow-sm min-h-[36px]"
                    title={isMcqMode ? 'Switch to typing formula' : 'Switch to multiple choice (MCQ)'}
                  >
                    {isMcqMode ? (
                      <>
                        <Keyboard className="w-3.5 h-3.5" />
                        <span>Switch to Type Formula</span>
                      </>
                    ) : (
                      <>
                        <ListChecks className="w-3.5 h-3.5" />
                        <span>Make it Multiple Choice (MCQ)</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {isMcqActive ? (
                <div className="grid grid-cols-1 gap-2.5">
                  {mcqOptions.map((opt) => {
                    const isSelected = studentAnswer === opt.latex;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isCorrect === true}
                        onClick={() => {
                          setStudentAnswer(opt.latex);
                          if (isCorrect !== null) {
                            setIsCorrect(null);
                            setDiagnosis(null);
                          }
                        }}
                        className={`w-full p-4 rounded-lg border text-left transition flex items-center space-x-3.5 min-h-[52px] ${
                          isSelected
                            ? 'bg-[#102d52] border-brass-500 text-white shadow-md shadow-brass-500/15 ring-1 ring-brass-500/50'
                            : 'bg-[#06162f]/80 border-[#2c4f75]/30 text-slate-300 hover:bg-[#102d52]/40 hover:border-[#2c4f75]/60 hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-md font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-brass-500 text-[#061b3a]'
                              : 'bg-[#102d52] text-slate-300 border border-[#2c4f75]/40'
                          }`}
                        >
                          {opt.label}
                        </div>
                        <div className="flex-1 overflow-x-auto font-medium text-sm">
                          <MathContent content={opt.latex} />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-brass-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <MathInput
                  id="student-math-input"
                  value={studentAnswer}
                  onChange={(val) => {
                    setStudentAnswer(val);
                    if (isCorrect !== null) {
                      setIsCorrect(null);
                      setDiagnosis(null);
                    }
                  }}
                  onSubmit={() => {
                    if (isCorrect === true) {
                      handleNextProblem();
                    } else {
                      handleSubmitAnswer();
                    }
                  }}
                  placeholder="e.g. 6 or 24x(4x^2 + 1)^2"
                  disabled={isCorrect === true}
                  ariaLabel="Mathematical answer input"
                  ariaInvalid={isCorrect === false}
                  ariaDescribedBy="answer-feedback-message"
                />
              )}
            </div>

            {/* Submission Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#2c4f75]/30">
              {!isInherentlyMcq ? (
                <button
                  type="button"
                  onClick={() => setIsMcqMode((prev) => !prev)}
                  disabled={isCorrect === true}
                  className="px-4 py-2.5 min-h-[44px] rounded-lg border border-[#2c4f75]/40 hover:bg-[#102d52]/60 text-slate-300 hover:text-white text-xs font-bold font-mono flex items-center space-x-2 transition"
                >
                  {isMcqMode ? (
                    <>
                      <Keyboard className="w-4 h-4 text-brass-400" />
                      <span>Switch to Type Formula</span>
                    </>
                  ) : (
                    <>
                      <ListChecks className="w-4 h-4 text-brass-400" />
                      <span>Make it Multiple Choice (MCQ)</span>
                    </>
                  )}
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center space-x-3">
                {isCorrect === true ? (
                  <button
                    onClick={() => handleNextProblem()}
                    disabled={isTransitioning}
                    className="px-6 py-2.5 min-h-[44px] rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition"
                  >
                    <span>Next Problem</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleNextProblem()}
                      disabled={isTransitioning}
                      className="px-4 py-2.5 min-h-[44px] rounded-lg border border-[#2c4f75]/40 hover:bg-[#102d52]/60 text-slate-300 hover:text-white text-xs font-mono font-medium flex items-center space-x-1.5 transition"
                      title={isCorrect === false ? 'Skip to next problem' : 'Skip this problem without submitting'}
                    >
                      <span>{isCorrect === false ? 'Next Problem' : 'Skip to Next'}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleSubmitAnswer()}
                      disabled={!studentAnswer.trim() || isSubmitting}
                      className="px-6 py-2.5 min-h-[44px] rounded-lg bg-brass-500 hover:bg-brass-400 disabled:opacity-50 text-[#061b3a] font-bold text-sm flex items-center space-x-2 shadow-[0_2px_12px_rgba(247,185,67,0.25)] transition"
                    >
                      {isSubmitting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span>
                        {isSubmitting
                          ? 'Verifying...'
                          : isCorrect === false
                          ? 'Try Again'
                          : 'Submit Verification'}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Student Adaptive Control Toolbar */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2c4f75]/30 text-xs font-mono">
              <span className="text-[#8ea8c0] text-[11px]">Adjust Practice:</span>
              <button
                type="button"
                onClick={handleEasier}
                disabled={isAtMinDifficulty || isTransitioning}
                title={isAtMinDifficulty ? 'Already at minimum difficulty (Level 1)' : `Decrease difficulty to Level ${targetEasierDifficulty}`}
                aria-label={isAtMinDifficulty ? 'Easier problem (Already at minimum difficulty Level 1)' : `Decrease difficulty to Level ${targetEasierDifficulty}`}
                aria-disabled={isAtMinDifficulty || isTransitioning}
                className="px-3 py-2 min-h-[44px] rounded-lg bg-[#06162f] hover:bg-[#102d52] border border-[#2c4f75]/30 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:bg-[#06162f] disabled:hover:text-slate-400 disabled:cursor-not-allowed transition flex items-center space-x-1"
              >
                <TrendingDown className="w-3 h-3 text-blue-400" />
                <span>Easier</span>
                <span className="text-[10px] text-[#8ea8c0] font-sans">
                  {isAtMinDifficulty ? '(Min)' : `(L${targetEasierDifficulty})`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleHarder}
                disabled={isAtMaxDifficulty || isTransitioning}
                title={isAtMaxDifficulty ? 'Already at maximum difficulty (Level 4)' : `Increase difficulty to Level ${targetHarderDifficulty}`}
                aria-label={isAtMaxDifficulty ? 'Harder problem (Already at maximum difficulty Level 4)' : `Increase difficulty to Level ${targetHarderDifficulty}`}
                aria-disabled={isAtMaxDifficulty || isTransitioning}
                className="px-3 py-2 min-h-[44px] rounded-lg bg-[#06162f] hover:bg-[#102d52] border border-[#2c4f75]/30 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:bg-[#06162f] disabled:hover:text-slate-400 disabled:cursor-not-allowed transition flex items-center space-x-1"
              >
                <TrendingUp className="w-3 h-3 text-amber-400" />
                <span>Harder</span>
                <span className="text-[10px] text-[#8ea8c0] font-sans">
                  {isAtMaxDifficulty ? '(Max)' : `(L${targetHarderDifficulty})`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleAnotherLikeThis}
                disabled={isTransitioning}
                title="Generate another problem targeting the same skill"
                aria-label="Generate another problem targeting the same skill"
                aria-disabled={isTransitioning}
                className="px-3 py-2 min-h-[44px] rounded-lg bg-[#06162f] hover:bg-[#102d52] border border-[#2c4f75]/30 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:bg-[#06162f] disabled:hover:text-slate-400 disabled:cursor-not-allowed transition flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                <span>Another Like This</span>
              </button>

            </div>
            <MechanicalLoader
              state={isTransitioning ? 'generation' : isSubmitting ? 'processing' : 'success'}
              label={isTransitioning ? 'Loading next problem...' : isSubmitting ? 'Checking answer...' : ''}
              className="font-mono"
            />

            {/* Evaluation Result Feedback */}
            {isCorrect !== null && (
              <div
                id="answer-feedback-message"
                role="status"
                aria-live="polite"
                className={`p-4 rounded-lg border space-y-3 ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                }`}
              >
                {/* Discrete Technical Status Indicators */}
                <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/10 text-xs font-mono">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#06162f] border border-[#2c4f75]/40 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                    Input parsed successfully
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold ${
                      isCorrect
                        ? 'bg-emerald-900/60 border border-emerald-700 text-emerald-300'
                        : 'bg-rose-900/60 border border-rose-700 text-rose-300'
                    }`}
                  >
                    {isCorrect ? 'Equivalence check: Passed' : 'Equivalence check: Failed'}
                  </span>
                </div>

                <div className="flex items-start space-x-2 font-bold">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div>Answer Correct &bull; Mathematically Verified!</div>
                        <p className="text-xs font-normal text-emerald-300/90 mt-0.5">
                          Your response satisfies all mathematical equivalence criteria and canonical forms.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div>Answer Incorrect &bull; Equivalence check failed</div>
                        <p className="text-xs font-normal text-rose-300/90 mt-0.5">
                          Not quite equivalent. Try reviewing hints below, or advance to the next problem.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNextProblem()}
                        disabled={isTransitioning}
                        className="px-3 py-1.5 rounded-md bg-rose-900/60 hover:bg-rose-900 border border-rose-700/80 text-white font-mono text-xs flex items-center space-x-1.5 transition shrink-0 ml-2"
                      >
                        <span>Next Problem</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>

                {diagnosis && !isCorrect && (
                  <div className="text-xs text-rose-300 font-medium pl-7 bg-rose-950/50 p-2.5 rounded-lg border border-rose-900/50">
                    <strong>Conceptual Note:</strong> {diagnosis.name} — {diagnosis.diagnosis || diagnosis.guidanceTip}
                  </div>
                )}
              </div>
            )}

            {/* Collapsed Disclosure: How we checked your answer */}
            {domainResult && (
              <div className="border border-[#2c4f75]/30 rounded-lg overflow-hidden bg-[#06162f]/60">
                <button
                  type="button"
                  onClick={() => setShowAuditDisclosure((prev) => !prev)}
                  aria-expanded={showAuditDisclosure}
                  aria-controls="how-we-checked-disclosure"
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-[#102d52]/50 transition min-h-[44px]"
                >
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-brass-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">
                      How we checked your answer
                    </span>
                    {isInstructorMode && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#102d52] text-slate-200 border border-[#2c4f75]/50 font-bold">
                        Instructor View
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#8ea8c0]">
                    <span className="hidden sm:inline text-[11px]">
                      {showAuditDisclosure ? 'Hide verification details' : 'View AST & domain audit'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        showAuditDisclosure ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {showAuditDisclosure && (
                  <div id="how-we-checked-disclosure" className="p-3.5 sm:p-4 border-t border-[#2c4f75]/30 space-y-3 bg-[#06162f]/90">
                    <div className="text-[11px] font-mono text-slate-300 leading-relaxed">
                      Every submission undergoes rigorous deterministic verification: parsing into an Abstract Syntax Tree (AST), algebraic equivalence testing, and domain invariant audits.
                    </div>
                    <DomainFeedbackCard
                      result={domainResult}
                      courseId={session.courseId}
                      isCorrect={isCorrect}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Progressive Hints & Socratic AI Tutor */}
        <div className="space-y-6">
          {/* 5-Tier Progressive Hints Drawer */}
          <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-5 sm:p-6 space-y-4 shadow-[0_8px_30px_rgba(2,12,29,0.5)]">
            <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-3">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Progressive Hints</h3>
              </div>
              <span className="text-[10px] font-mono text-[#8ea8c0]">
                {unlockedHintLevel} / {problem.hints.length || 0}
              </span>
            </div>

            <div className="space-y-2.5">
              {problem.hints.map((hint, idx) => {
                const isUnlocked = idx < unlockedHintLevel;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs transition ${
                      isUnlocked
                        ? 'bg-[#06162f]/90 border-[#2c4f75]/35 text-slate-200'
                        : 'bg-[#06162f]/30 border-[#2c4f75]/15 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold uppercase text-[10px] text-amber-400/80">
                        Level {hint.level} &bull; {hint.category}
                      </span>
                    </div>
                    {isUnlocked ? (
                      <div className="text-slate-300 leading-relaxed">
                        <MathContent content={hint.text} />
                      </div>
                    ) : (
                      <span className="text-slate-500 font-mono italic">Locked hint</span>
                    )}
                  </div>
                );
              })}
            </div>

            {unlockedHintLevel < (problem.hints.length || 0) && (
              <button
                type="button"
                onClick={() => setUnlockedHintLevel((prev) => prev + 1)}
                className="w-full py-2.5 min-h-[44px] rounded-lg border border-brass-500/50 hover:bg-brass-500/10 text-brass-400 text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-brass-400" />
                <span>Unlock Level {unlockedHintLevel + 1} Hint</span>
              </button>
            )}

            {/* View Full Solution Button */}
            {!showSolutionDrawer && (
              <button
                type="button"
                onClick={() => setShowSolutionDrawer(true)}
                className="w-full py-2.5 min-h-[44px] rounded-lg text-slate-400 hover:text-slate-200 text-xs font-mono transition flex items-center justify-center border border-transparent hover:border-[#2c4f75]/30"
              >
                View Step-by-Step Solution Trace
              </button>
            )}

            {/* Solution Trace Drawer */}
            {showSolutionDrawer && (
              <div className="p-4 bg-[#06162f]/90 border border-[#2c4f75]/35 rounded-lg space-y-3 pt-3">
                <span className="text-[11px] font-mono uppercase font-bold text-emerald-400">
                  Authoritative Solution Steps:
                </span>
                <div className="space-y-2 text-xs text-slate-300">
                  {problem.solution.reasoningTrace.map((st, idx) => (
                    <div key={idx} className="p-2.5 bg-[#0a2344]/80 rounded-lg border border-[#2c4f75]/25 space-y-1">
                      <div className="font-bold text-white">
                        <span className="text-brass-400 font-mono mr-1.5">Step {st.stepIndex}:</span>
                        <MathContent content={st.actionDescription} />
                      </div>
                      {st.intermediateExpressionLatex && (
                        <div className="py-1">
                          <MathContent content={st.intermediateExpressionLatex} displayMode={true} />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="pt-2 font-bold text-emerald-400 border-t border-[#2c4f75]/30">
                    Canonical Answer: <MathContent content={problem.solution.canonicalAnswerLatex} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Socratic Tutor Drawer */}
          <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-5 sm:p-6 space-y-4 shadow-[0_8px_30px_rgba(2,12,29,0.5)]">
            <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-brass-400" />
                <h3 className="text-sm font-bold text-white">Socratic AI Assistant</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md">
                Context-Aware
              </span>
            </div>

            {/* Deterministic grading vs optional AI tutoring notice */}
            <div className="px-3 py-2 bg-[#06162f]/70 border border-[#2c4f75]/30 rounded-lg text-[11px] font-mono text-[#8ea8c0] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brass-400 shrink-0" />
              <span>Deterministic grading &bull; Optional AI tutoring</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {tutorMessages.length === 0 ? (
                <div className="space-y-2 text-xs text-slate-400">
                  <p className="italic leading-relaxed">
                    Need guidance? Ask for conceptual hints without revealing the full solution. Your answer evaluation is 100% deterministic and never graded by AI.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      'Why is this method required?',
                      'What is the inner function?',
                      'Explain this step simply'
                    ].map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setTutorQuestion(q);
                        }}
                        className="px-2 py-1 rounded-md bg-[#06162f] hover:bg-[#102d52] border border-[#2c4f75]/30 text-[11px] text-slate-300 transition"
                      >
                        &ldquo;{q}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                tutorMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#102d52] text-slate-200 border border-[#2c4f75]/50 ml-4'
                        : 'bg-[#06162f] text-slate-300 border border-[#2c4f75]/30 mr-4'
                    }`}
                  >
                    <MathContent content={msg.text} />
                  </div>
                ))
              )}
              {aiLoading && (
                <div className="text-xs font-mono text-brass-400 animate-pulse flex items-center space-x-2 p-2 bg-[#06162f] rounded-lg border border-[#2c4f75]/30">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Formulating Socratic guidance...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="flex items-center space-x-2 pt-2 border-t border-[#2c4f75]/30">
              <input
                type="text"
                value={tutorQuestion}
                onChange={(e) => setTutorQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendTutorMessage()}
                placeholder="Ask Socratic tutor..."
                className="flex-1 px-3.5 py-2.5 min-h-[44px] bg-[#06162f] border border-[#2c4f75]/40 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brass-500"
              />
              <button
                type="button"
                onClick={handleSendTutorMessage}
                disabled={!tutorQuestion.trim() || aiLoading}
                aria-label="Send question to Socratic tutor"
                className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center bg-brass-500 hover:bg-brass-400 text-[#061b3a] rounded-lg disabled:opacity-40 transition font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
