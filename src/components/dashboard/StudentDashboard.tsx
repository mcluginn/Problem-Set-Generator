'use client';

import React, { useState, useEffect } from 'react';
import { UnifiedPracticeStore } from '@/engine/adaptive/store';
import { AdaptiveDecision, CourseMasteryRecord } from '@/engine/adaptive/types';
import { DEFAULT_PROFILE, UnifiedStudentProfile } from '@/engine/adaptive/store';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import {
  Sparkles,
  Play,
  GraduationCap,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CourseHeader } from './CourseHeader';
import { CourseMetrics } from './CourseMetrics';
import { UnitSection } from './UnitSection';
import { formatCurriculumTitle } from './CurriculumTitleFormatter';

interface StudentDashboardProps {
  onStartPractice: (
    courseId: string,
    topicId?: string,
    skillId?: string,
    mode?: import('@/engine/adaptive/types').PracticeMode
  ) => void;
  onOpenMistakes: () => void;
  onStartQuiz?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartPractice,
  onOpenMistakes,
  onStartQuiz
}) => {
  // Keep the first render deterministic for SSR. Persisted learner state is
  // loaded in the effect below after hydration, preventing streak/mastery
  // values from diverging between server HTML and the browser.
  const [activeCourseId, setActiveCourseId] = useState<string>('COURSE-GEN0102');
  const [profile, setProfile] = useState<UnifiedStudentProfile>(() => ({ ...DEFAULT_PROFILE }));
  const [courseMastery, setCourseMastery] = useState<CourseMasteryRecord>(() => ({
    courseId: 'COURSE-GEN0102',
    courseName: 'Calculus 1',
    overallMasteryPercentage: 0,
    skillsPracticedCount: 0,
    skillsMasteredCount: 0,
    totalAttempts: 0,
    totalCorrectAttempts: 0,
    skillMasteries: {}
  }));
  const [recommendation, setRecommendation] = useState<AdaptiveDecision | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [collapsedUnitIds, setCollapsedUnitIds] = useState<Set<string>>(new Set());
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  const getInitialCollapsedUnits = (courseId: string, rec: AdaptiveDecision | null): Set<string> => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`practice_engine_collapsed_units_${courseId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return new Set(parsed);
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    const units = curriculumRegistry.getUnitsByCourse(courseId);
    if (units.length <= 1) return new Set();

    let activeUnitId = units[0]?.id;
    if (rec?.targetSkillId) {
      const allTopics = curriculumRegistry.getTopicsByCourse(courseId);
      for (const t of allTopics) {
        const skills = curriculumRegistry.getSkillsByTopic(t.id);
        if (skills.some((s) => s.id === rec.targetSkillId)) {
          activeUnitId = t.unitId;
          break;
        }
      }
    }

    const collapsed = new Set<string>();
    for (const u of units) {
      if (u.id !== activeUnitId) {
        collapsed.add(u.id);
      }
    }
    return collapsed;
  };

  const toggleUnitCollapse = (unitId: string) => {
    setCollapsedUnitIds((prev) => {
      const next = new Set(prev);
      if (next.has(unitId)) {
        next.delete(unitId);
      } else {
        next.add(unitId);
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          `practice_engine_collapsed_units_${activeCourseId}`,
          JSON.stringify(Array.from(next))
        );
      }
      return next;
    });
  };

  const toggleSkillExpand = (skillId: string) => {
    setExpandedSkillId((prev) => (prev === skillId ? null : skillId));
  };

  const courses = curriculumRegistry.getAllCourses();
  const currentCourse = curriculumRegistry.getCourseById(activeCourseId);
  const courseSkills = curriculumRegistry.getSkillsByCourse(activeCourseId);
  const courseUnits = curriculumRegistry.getUnitsByCourse(activeCourseId);

  useEffect(() => {
    UnifiedPracticeStore.initialize();
    const currentCId = UnifiedPracticeStore.getActiveCourseId();
    setActiveCourseId(currentCId);
    setProfile(UnifiedPracticeStore.getProfile());
    setCourseMastery(UnifiedPracticeStore.getCourseMastery(currentCId));
    const rec = UnifiedPracticeStore.getRecommendation(currentCId);
    setRecommendation(rec);
    setCollapsedUnitIds(getInitialCollapsedUnits(currentCId, rec));
  }, []);

  const handleCourseChange = (newCourseId: string) => {
    UnifiedPracticeStore.setActiveCourseId(newCourseId);
    setActiveCourseId(newCourseId);
    setCourseMastery(UnifiedPracticeStore.getCourseMastery(newCourseId));
    const rec = UnifiedPracticeStore.getRecommendation(newCourseId);
    setRecommendation(rec);
    setCollapsedUnitIds(getInitialCollapsedUnits(newCourseId, rec));
  };

  const getMasteryTier = (pct: number): { label: string; color: string; badge: string } => {
    if (pct >= 75) {
      return {
        label: 'Strong',
        color: 'text-emerald-400',
        badge: 'bg-emerald-950 text-emerald-300 border border-emerald-800'
      };
    }
    if (pct >= 45) {
      return {
        label: 'Developing',
        color: 'text-amber-400',
        badge: 'bg-amber-950 text-amber-300 border border-amber-800'
      };
    }
    return {
      label: 'Started',
      color: 'text-slate-400',
      badge: 'bg-slate-900 text-slate-400 border border-slate-800'
    };
  };

  const recommendedSkill = recommendation?.targetSkillId
    ? curriculumRegistry.getSkillById(recommendation.targetSkillId)
    : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* 1. Compact Course Header with Selector & Overview Toggle */}
      <CourseHeader
        course={currentCourse}
        courses={courses}
        activeCourseId={activeCourseId}
        onCourseChange={handleCourseChange}
      />

      {/* 2. Standardized Course Metrics Grid */}
      <CourseMetrics
        streakDays={profile.currentStreak}
        overallMasteryPercentage={courseMastery.overallMasteryPercentage}
        skillsMasteredCount={courseMastery.skillsMasteredCount}
        totalSkillsCount={courseSkills.length}
        totalTimeSpentSeconds={profile.totalTimeSpentSeconds}
        masteryTier={getMasteryTier(courseMastery.overallMasteryPercentage)}
      />

      {/* 3. Onboarding Guide Card (Clean & Collapsible) */}
      <div className="bg-[#0a2344]/40 border border-[#2c4f75]/30 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="w-full px-5 py-3.5 min-h-[44px] flex items-center justify-between text-left hover:bg-[#102d52]/50 transition"
          aria-expanded={showGuide}
        >
          <div className="flex items-center space-x-2.5">
            <Info className="w-4 h-4 text-brass-400" />
            <span className="text-xs sm:text-sm font-bold text-slate-200">
              New here? How the Engineering Practice Engine works
            </span>
          </div>
          {showGuide ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showGuide && (
          <div className="px-5 pb-5 pt-2 border-t border-[#2c4f75]/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="space-y-1.5 p-3.5 bg-[#06162f]/80 rounded-lg border border-[#2c4f75]/25">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#102d52] border border-brass-500/40 text-brass-400 flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                <span>Adaptive Practice</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Click <strong>Start Practice</strong> on any topic or skill to train your personalized growth area targeted by the engine.
              </p>
            </div>

            <div className="space-y-1.5 p-3.5 bg-[#06162f]/80 rounded-lg border border-[#2c4f75]/25">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#102d52] border border-brass-500/40 text-brass-400 flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <span>Formula or Multiple Choice</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Solve problems using formula notation with live preview, or switch to Multiple Choice (MCQ) for rapid practice.
              </p>
            </div>

            <div className="space-y-1.5 p-3.5 bg-[#06162f]/80 rounded-lg border border-[#2c4f75]/25">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-[#102d52] border border-brass-500/40 text-brass-400 flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <span>Hints & Socratic Tutor</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                If you get stuck, unlock 5 progressive hint tiers or ask the Socratic tutor for step-by-step guidance.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Explainable Next Best Problem Recommendation Card */}
      {recommendation && (
        <div className="bg-gradient-to-r from-[#102d52]/60 via-[#0a2344]/70 to-[#061b3a]/90 border border-brass-500/40 rounded-xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(247,185,67,0.08)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brass-400" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brass-400">
                  Recommended For You
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white break-words">
                {recommendedSkill
                  ? formatCurriculumTitle(recommendedSkill.canonicalName)
                  : recommendation.targetSkillId}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => onStartPractice(activeCourseId, undefined, recommendation.targetSkillId, 'RECOMMENDED')}
                className="px-5 py-2.5 min-h-[44px] rounded-lg bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-[0_2px_10px_rgba(247,185,67,0.25)] transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Practice</span>
              </button>
              {onStartQuiz && (
                <button
                  onClick={onStartQuiz}
                  className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#102d52] hover:bg-[#1d3b5e] border border-[#2c4f75]/50 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition"
                >
                  <GraduationCap className="w-4 h-4 text-brass-400" />
                  <span>Quiz Mode</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-lg p-3.5 space-y-2">
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              {recommendation.explanation}
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-[#8ea8c0] pt-1">
              {recommendation.supportingFactors.map((factor, idx) => (
                <span key={idx} className="bg-[#0a2344] border border-[#2c4f75]/30 px-2.5 py-1 rounded-md">
                  &bull; {factor}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Curriculum Units & Skills Breakdown */}
      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-3">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-brass-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Curriculum Learning Skills
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8ea8c0]">
            {courseUnits.length} {courseUnits.length === 1 ? 'Period' : 'Periods'} &bull; {courseSkills.length} Total Skills
          </span>
        </div>

        {/* Stack of Homogeneous Units */}
        <div className="space-y-4">
          {courseUnits.map((unit) => {
            const unitTopics = curriculumRegistry.getTopicsByUnit(unit.id);
            const isCollapsed = collapsedUnitIds.has(unit.id);

            return (
              <UnitSection
                key={unit.id}
                unit={unit}
                topics={unitTopics}
                courseId={activeCourseId}
                courseMastery={courseMastery}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => toggleUnitCollapse(unit.id)}
                expandedSkillId={expandedSkillId}
                onToggleSkillExpand={toggleSkillExpand}
                onStartPractice={onStartPractice}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
