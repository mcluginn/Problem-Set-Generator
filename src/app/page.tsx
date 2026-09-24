'use client';

import React, { useState, useEffect } from 'react';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { PracticeScreen } from '@/components/practice/PracticeScreen';
import { PracticeSetup } from '@/components/practice/PracticeSetup';
import { QuizSetup } from '@/components/quiz/QuizSetup';
import { QuizScreen } from '@/components/quiz/QuizScreen';
import { MistakesReview } from '@/components/mistakes/MistakesReview';
import { TeacherReview } from '@/components/teacher/TeacherReview';
import { UnifiedPracticeStore } from '@/engine/adaptive/store';
import { PracticeMode } from '@/engine/adaptive/types';
import { QuizConfig } from '@/engine/quiz/types';
import { QuizEngine } from '@/engine/quiz/quizEngine';
import { RoleGuard, UserRole } from '@/engine/auth/roleGuard';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import {
  GraduationCap,
  LayoutDashboard,
  Play,
  AlertTriangle,
  Flame,
  Code,
  ShieldCheck,
  Lock,
  ShieldAlert,
  X,
  Check
} from 'lucide-react';

type ViewMode = 'dashboard' | 'practice' | 'setup' | 'quiz-setup' | 'quiz' | 'mistakes' | 'teacher';

export default function Home() {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [activeCourseId, setActiveCourseId] = useState<string>('COURSE-GEN0102');
  const [activeTopicId, setActiveTopicId] = useState<string | undefined>(undefined);
  const [activeSkillId, setActiveSkillId] = useState<string | undefined>(undefined);
  const [activeMode, setActiveMode] = useState<PracticeMode>('RECOMMENDED');
  const [activeSessionLength, setActiveSessionLength] = useState<number>(5);
  const [activeQuizConfig, setActiveQuizConfig] = useState<QuizConfig | undefined>(undefined);
  const [streak, setStreak] = useState<number>(3);
  const [userRole, setUserRole] = useState<UserRole>('STUDENT');
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);

  // Active quiz resume detection: on initial mount / full browser reload
  useEffect(() => {
    // Persisted roles are browser-only; keep the initial navigation identical to SSR.
    setUserRole(RoleGuard.getCurrentRole());
    UnifiedPracticeStore.initialize();
    setStreak(UnifiedPracticeStore.getProfile().currentStreak);
    setActiveCourseId(UnifiedPracticeStore.getActiveCourseId());

    try {
      const activeQuiz = QuizEngine.loadActiveSession();
      if (activeQuiz && activeQuiz.status === 'IN_PROGRESS') {
        setActiveQuizConfig(undefined);
        setView('quiz');
      }
    } catch (err) {
      console.error('Failed to restore active quiz session:', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = RoleGuard.onRoleChange((newRole) => {
      setUserRole(newRole);
      if (newRole === 'STUDENT' && view === 'teacher') {
        setView('dashboard');
      }
    });
    return unsubscribe;
  }, [view]);

  const handleStartPractice = (
    courseId: string,
    topicId?: string,
    skillId?: string,
    mode: PracticeMode = 'RECOMMENDED',
    sessionLength = 5
  ) => {
    setActiveCourseId(courseId);
    setActiveTopicId(topicId);
    setActiveSkillId(skillId);
    setActiveMode(mode);
    setActiveSessionLength(sessionLength);
    UnifiedPracticeStore.setActiveCourseId(courseId);
    setView('practice');
  };

  const handlePracticeMistake = (concept: string, misconceptionCode: string) => {
    const matchedSkill = curriculumRegistry.getAllSkills().find(skill =>
      skill.canonicalName === concept || skill.id === concept
    ) || curriculumRegistry.getSkillById('SKILL-GEN0102-005');
    setActiveSkillId(matchedSkill?.id);
    setActiveTopicId(matchedSkill?.parentTopicId);
    setActiveMode('REMEDIATION');
    setView('practice');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#061b3a]/95 backdrop-blur-xl border-b border-[#2c4f75]/35 px-2 sm:px-8 py-2 sm:py-2.5 shadow-[0_8px_30px_rgba(2,12,29,0.35)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div
            onClick={() => setView('dashboard')}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            aria-label="Engineering Practice Engine Home"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setView('dashboard'); }}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#eef0f2] border-2 border-[#f7b943]/90 p-0.5 flex items-center justify-center shadow-[0_0_0_3px_rgba(247,185,67,0.12)] group-hover:scale-105 transition-transform duration-150 shrink-0 overflow-hidden">
              <img src="/mechanical-engineering-society.png" alt="Mechanical Engineering Society" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base tracking-tight text-white flex items-center gap-1 sm:gap-1.5 truncate">
                <span className="hidden min-[420px]:inline">Engineering Practice</span>
                <span className="min-[420px]:hidden">Eng</span>
                <span className="text-brass-500 font-extrabold">Engine</span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono text-[#8ea8c0] hidden sm:block tracking-wide">
                Mechanical Engineering Learning Platform &bull; Adaptive v2.0
              </div>
            </div>
          </div>

          {/* Navigation Links (Student Primary Navigation) */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 min-w-0 overflow-x-auto py-0.5" aria-label="Main Learner Navigation">
            <button
              type="button"
              onClick={() => setView('dashboard')}
              aria-current={view === 'dashboard' ? 'page' : undefined}
              aria-label="Dashboard"
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center space-x-1.5 min-h-[40px] focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none ${
                view === 'dashboard'
                  ? 'bg-[#102d52] text-white border border-[#f7b943]/45 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#0a2344] border border-transparent'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${view === 'dashboard' ? 'text-brass-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setView('setup')}
              aria-current={view === 'practice' || view === 'setup' ? 'page' : undefined}
              aria-label="Practice"
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center space-x-1.5 min-h-[40px] focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none ${
                view === 'practice' || view === 'setup'
                  ? 'bg-[#102d52] text-white border border-[#f7b943]/45 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#0a2344] border border-transparent'
              }`}
            >
              <Play className={`w-4 h-4 shrink-0 ${view === 'practice' || view === 'setup' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Practice</span>
            </button>

            <button
              type="button"
              onClick={() => setView('quiz-setup')}
              aria-current={view === 'quiz' || view === 'quiz-setup' ? 'page' : undefined}
              aria-label="Quiz Mode"
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center space-x-1.5 min-h-[40px] focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none ${
                view === 'quiz' || view === 'quiz-setup'
                  ? 'bg-[#102d52] text-white border border-[#f7b943]/45 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#0a2344] border border-transparent'
              }`}
            >
              <GraduationCap className={`w-4 h-4 shrink-0 ${view === 'quiz' || view === 'quiz-setup' ? 'text-brass-400' : 'text-slate-400'}`} />
              <span>Quiz<span className="hidden sm:inline"> Mode</span></span>
            </button>

            <button
              type="button"
              onClick={() => setView('mistakes')}
              aria-current={view === 'mistakes' ? 'page' : undefined}
              aria-label="My Mistakes"
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center space-x-1.5 min-h-[40px] focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none ${
                view === 'mistakes'
                  ? 'bg-[#102d52] text-white border border-[#f7b943]/45 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#0a2344] border border-transparent'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 shrink-0 ${view === 'mistakes' ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Mistakes</span>
            </button>

            <div className="h-4 w-[1px] bg-[#2c4f75]/40 mx-0.5 sm:mx-1 hidden sm:block" />

            <div
              className="flex items-center space-x-1.5 text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1.5 rounded-lg min-h-[40px]"
              aria-label={`Current streak: ${streak} days`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold">{streak}</span>
            </div>

            {/* Role Gate / Admin Switcher: Visible only to authorized roles */}
            {userRole !== 'STUDENT' && (
              <button
                type="button"
                onClick={() => setView(view === 'teacher' ? 'dashboard' : 'teacher')}
                title="Toggle Instructor & Admin Calibration"
                aria-label="Toggle Instructor & Admin Calibration"
                aria-current={view === 'teacher' ? 'page' : undefined}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 min-h-[40px] focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:outline-none ${
                  view === 'teacher'
                    ? 'bg-[#1d3b5e] text-brass-300 border border-brass-500/60 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-brass-300 hover:bg-[#0a2344] border border-[#2c4f75]/40'
                }`}
              >
                <Code className="w-3.5 h-3.5 text-brass-400 shrink-0" />
                <span className="hidden lg:inline">{view === 'teacher' ? 'Learner View' : 'Admin Tools'}</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Internal Tooling Mode Indicator Banner */}
      {view === 'teacher' && RoleGuard.isAuthorizedForAdmin() && (
        <div className="bg-[#0a2344] border-b border-[#2c4f75]/70 px-4 sm:px-8 py-2 text-xs font-mono flex items-center justify-between text-slate-200">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-brass-400 shrink-0" />
            <span>
              <strong className="text-white">Instructor &amp; Calibration Console:</strong> Pedagogical Auditing, Review Overlay &amp; Deterministic AST Diagnostics
            </span>
          </div>
          <button
            type="button"
            onClick={() => setView('dashboard')}
            className="text-brass-400 hover:text-brass-300 underline text-xs font-semibold ml-4 shrink-0"
          >
            Return to Learner View &rarr;
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {view === 'dashboard' && (
          <StudentDashboard
            onStartPractice={handleStartPractice}
            onOpenMistakes={() => setView('mistakes')}
            onStartQuiz={() => setView('quiz-setup')}
          />
        )}

        {view === 'setup' && (
          <PracticeSetup
            onStart={handleStartPractice}
            onCancel={() => setView('dashboard')}
            defaultCourseId={activeCourseId}
            defaultTopicId={activeTopicId}
            defaultSkillId={activeSkillId}
          />
        )}

        {view === 'quiz-setup' && (
          <QuizSetup
            initialCourseId={activeCourseId}
            onStartQuiz={(config) => {
              setActiveQuizConfig(config);
              setView('quiz');
            }}
            onResumeQuiz={() => {
              setActiveQuizConfig(undefined);
              setView('quiz');
            }}
            onNavigateHome={() => setView('dashboard')}
          />
        )}

        {view === 'quiz' && (
          <QuizScreen
            config={activeQuizConfig}
            onNavigateHome={() => setView('dashboard')}
            onRetakeQuiz={() => setView('quiz-setup')}
          />
        )}

        {view === 'practice' && (
          <PracticeScreen
            initialCourseId={activeCourseId}
            initialTopicId={activeTopicId}
            initialSkillId={activeSkillId}
            initialMode={activeMode}
            initialSessionLength={activeSessionLength}
            isInstructorMode={RoleGuard.isAuthorizedForAdmin()}
            onNavigateHome={() => setView('dashboard')}
          />
        )}

        {view === 'mistakes' && (
          <MistakesReview
            onPracticeMistake={handlePracticeMistake}
            onBack={() => setView('dashboard')}
          />
        )}

        {view === 'teacher' && (
          !RoleGuard.isAuthorizedForAdmin() ? (
            <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
              <div className="w-14 h-14 rounded-xl bg-rose-950/80 border border-rose-800/80 flex items-center justify-center text-rose-400 mx-auto shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Access Restricted</h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Teacher Calibration and AST pipeline diagnostics are restricted to authorized instructors and administrators.
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  Current Session Role: <strong className="text-slate-200">{userRole}</strong> &bull; Requires: INSTRUCTOR or ADMIN
                </p>
              </div>

              <div className="p-4 bg-[#081c36] border border-[#1d3b5e] rounded-xl text-left text-xs font-mono text-slate-300 space-y-1.5 max-w-md mx-auto">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Architecture Security Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Direct navigation access fails closed. In a production multi-tenant deployment, administrative routes require server-verified cryptographic authorization tokens.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setView('dashboard')}
                  className="px-5 py-2.5 rounded-lg bg-[#102d52] hover:bg-[#163b6b] text-white text-xs font-bold transition flex items-center space-x-2 border border-[#2c4f75]"
                >
                  <span>Return to Student Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(true)}
                  className="px-5 py-2.5 rounded-lg bg-[#0a2344] hover:bg-[#102d52] border border-brass-500/50 text-brass-300 text-xs font-mono font-bold transition flex items-center space-x-1.5"
                >
                  <span>Manage Sandbox Role</span>
                </button>
              </div>
            </div>
          ) : (
            <TeacherReview />
          )
        )}
      </main>

      {/* Academic Engine Verification Footer */}
      <footer className="border-t border-[#1d3b5e]/60 bg-[#040e1e] px-4 sm:px-8 py-3.5 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-semibold">Deterministic grading &bull; Optional AI tutoring</span>
            <span className="text-slate-500 hidden md:inline">&bull; 100% Deterministic Core</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setShowRoleModal(true)}
              className="px-2.5 py-1 rounded-md bg-[#0a2344] hover:bg-[#102d52] border border-[#2c4f75]/60 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-[11px]"
              aria-label="Manage Role and Permissions"
            >
              <span className="text-slate-400">Role:</span>
              <span className={`font-bold ${userRole === 'STUDENT' ? 'text-steel-200' : 'text-brass-400'}`}>
                {userRole}
              </span>
            </button>
            {userRole !== 'STUDENT' ? (
              <button
                type="button"
                onClick={() => setView(view === 'teacher' ? 'dashboard' : 'teacher')}
                className="text-brass-400 hover:text-brass-300 underline transition"
              >
                {view === 'teacher' ? 'Learner View' : 'Teacher Calibration'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowRoleModal(true)}
                className="text-slate-400 hover:text-slate-200 underline transition"
              >
                Instructor Portal
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Sandbox Role Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a2344] border border-[#2c4f75] rounded-xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2c4f75]/60 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-brass-400" />
                <h3 className="text-base font-bold text-white">Sandbox Role &amp; Authorization</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Select an active session role to test learner vs instructor experiences. Unauthorized learner sessions fail closed on administrative tools.
            </p>

            <div className="space-y-2">
              {(['STUDENT', 'INSTRUCTOR', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    RoleGuard.setRole(r);
                    setShowRoleModal(false);
                  }}
                  className={`w-full p-3 rounded-lg border text-left flex items-center justify-between text-xs font-mono transition ${
                    userRole === r
                      ? 'bg-[#102d52] border-brass-500/80 text-white font-bold'
                      : 'bg-[#061b3a]/70 border-[#2c4f75]/40 text-slate-300 hover:bg-[#102d52]/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold flex items-center gap-2">
                      <span>{r}</span>
                      {userRole === r && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-brass-500/20 text-brass-300 rounded border border-brass-500/40">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {r === 'STUDENT'
                        ? 'Standard learner view (admin controls hidden & restricted)'
                        : r === 'INSTRUCTOR'
                        ? 'Pedagogical calibration & student analytics enabled'
                        : 'Full system AST pipeline inspection and content editing'}
                    </div>
                  </div>
                  {userRole === r && <Check className="w-4 h-4 text-brass-400 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="p-3 bg-[#06162f] border border-[#2c4f75]/50 rounded-lg text-[11px] font-mono text-slate-400 space-y-1">
              <strong>Notice:</strong> This client-side guard is designed for local evaluation. Production environments enforce access via server-side session authentication tokens.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
