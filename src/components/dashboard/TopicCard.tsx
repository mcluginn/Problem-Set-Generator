'use client';

import React from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import { CurriculumTopic, LearningSkill } from '@/engine/curriculum/types';
import { CourseMasteryRecord, PracticeMode } from '@/engine/adaptive/types';
import { formatCurriculumTitle } from './CurriculumTitleFormatter';
import { resolveTopicPracticeScope } from './curriculumScopeResolver';
import { SkillItem } from './SkillItem';

interface TopicCardProps {
  topic: CurriculumTopic;
  skills: LearningSkill[];
  courseId: string;
  courseMastery: CourseMasteryRecord;
  expandedSkillId: string | null;
  onToggleSkillExpand: (skillId: string) => void;
  onStartPractice: (courseId: string, topicId?: string, skillId?: string, mode?: PracticeMode) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  skills,
  courseId,
  courseMastery,
  expandedSkillId,
  onToggleSkillExpand,
  onStartPractice
}) => {
  const getTier = (pct: number) => {
    if (pct >= 75) {
      return {
        label: 'Strong',
        badge: 'bg-emerald-950 text-emerald-300 border border-emerald-800'
      };
    }
    if (pct >= 45) {
      return {
        label: 'Developing',
        badge: 'bg-amber-950 text-amber-300 border border-amber-800'
      };
    }
    return {
      label: 'Started',
      badge: 'bg-slate-900 text-slate-400 border border-slate-800'
    };
  };

  const topicSequenceStr = String(topic.sequence).padStart(2, '0');
  const formattedTitle = formatCurriculumTitle(topic.officialName);

  const subtopicsSummary =
    topic.subtopics && topic.subtopics.length > 0
      ? topic.subtopics
          .map((st) => st.normalizedName || formatCurriculumTitle(st.officialName))
          .join(' · ')
      : null;

  // STRUCTURE 1: Topic with 0 skills
  // Direct topic Practice action with safe scope resolution
  if (skills.length === 0) {
    const handlePractice0Skill = () => {
      const scope = resolveTopicPracticeScope(courseId, topic);
      onStartPractice(courseId, scope.effectiveTopicId, scope.targetSkillId, 'TOPIC_PRACTICE');
    };

    return (
      <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-xl p-4 sm:p-5 transition hover:border-[#2c4f75]/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <span className="shrink-0 text-xs font-mono font-bold text-brass-400 bg-[#102d52] border border-[#2c4f75]/50 px-2 py-1 rounded-md mt-0.5">
              {topicSequenceStr}
            </span>
            <div className="space-y-1 min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-white tracking-tight break-words">
                {formattedTitle}
              </h4>
              {subtopicsSummary && (
                <p className="text-xs text-slate-400 line-clamp-1">
                  {subtopicsSummary}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2c4f75]/20">
            <div className="text-right font-mono text-xs text-[#8ea8c0] pr-1">
              <span className="text-white font-bold">0%</span> mastery
              <span className="text-slate-500 mx-1.5">&bull;</span>
              <span>0 tries</span>
            </div>

            <button
              type="button"
              onClick={handlePractice0Skill}
              aria-label={`Practice Topic: ${formattedTitle}`}
              className="px-4 py-2 min-h-[44px] rounded-lg bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition shadow-sm shrink-0"
            >
              <span>Practice</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STRUCTURE 2: Topic with 1 skill
  // Single unified card with ONE right-aligned Practice action (no duplicate practice buttons)
  if (skills.length === 1) {
    const singleSkill = skills[0];
    const masteryRec = courseMastery.skillMasteries[singleSkill.id];
    const masteryPct = masteryRec?.masteryPercentage ?? 0;
    const attempts = masteryRec?.totalAttempts ?? 0;
    const correctAttempts = masteryRec?.correctAttempts ?? 0;
    const accuracy = attempts > 0 ? Math.round((correctAttempts / attempts) * 100) : 0;
    const isExpanded = expandedSkillId === singleSkill.id;
    const tier = getTier(masteryPct);

    return (
      <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-xl p-4 sm:p-5 transition hover:border-[#2c4f75]/50 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Left: Sequence + Title + Subtopics + Progress */}
          <div className="space-y-2 flex-1 min-w-0 pr-2">
            <div className="flex items-start space-x-3 min-w-0">
              <span className="shrink-0 text-xs font-mono font-bold text-brass-400 bg-[#102d52] border border-[#2c4f75]/50 px-2 py-1 rounded-md mt-0.5">
                {topicSequenceStr}
              </span>
              <div className="space-y-0.5 min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-white tracking-tight break-words">
                  {formattedTitle}
                </h4>
                {subtopicsSummary ? (
                  <p className="text-xs text-slate-400 line-clamp-1">{subtopicsSummary}</p>
                ) : (
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {formatCurriculumTitle(singleSkill.canonicalName)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 pl-8">
              <div className="w-28 sm:w-36 bg-[#0a2344] h-1.5 rounded-full overflow-hidden border border-[#2c4f75]/30 shrink-0">
                <div
                  className={`h-full rounded-full ${
                    masteryPct >= 75
                      ? 'bg-emerald-500'
                      : masteryPct >= 45
                      ? 'bg-amber-500'
                      : 'bg-slate-600'
                  }`}
                  style={{ width: `${masteryPct}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-[#8ea8c0]">
                {masteryPct}% mastery &bull; {attempts} {attempts === 1 ? 'try' : 'tries'}
              </span>
            </div>
          </div>

          {/* Right: Tier Badge, Details Toggle, and ONE Practice Action */}
          <div className="flex items-center justify-between lg:justify-end space-x-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#2c4f75]/20">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${tier.badge}`}>
              {tier.label}
            </span>

            <button
              type="button"
              onClick={() => onToggleSkillExpand(singleSkill.id)}
              aria-expanded={isExpanded}
              aria-label={
                isExpanded
                  ? `Collapse details for ${formattedTitle}`
                  : `Expand details for ${formattedTitle}`
              }
              className="px-2.5 py-1.5 min-h-[44px] text-xs font-mono text-slate-300 hover:text-white flex items-center space-x-1 rounded-md hover:bg-[#102d52]/50 transition"
            >
              <span>Details</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onStartPractice(courseId, topic.id, singleSkill.id, 'SKILL_PRACTICE')}
              aria-label={`Practice: ${formattedTitle}`}
              className="px-4 py-2 min-h-[44px] rounded-lg bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition shadow-sm shrink-0"
            >
              <span>Practice</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Collapsible Details Drawer */}
        {isExpanded && (
          <div className="mt-3 px-3.5 py-3 border-t border-[#2c4f75]/25 bg-[#0a2344]/30 rounded-lg text-xs space-y-2">
            <p className="text-slate-300 leading-relaxed">{singleSkill.description}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#2c4f75]/20 text-[11px] font-mono text-[#8ea8c0]">
              <div>
                {singleSkill.prerequisiteSkillIds && singleSkill.prerequisiteSkillIds.length > 0 ? (
                  <span>
                    <strong className="text-slate-200">Prerequisites:</strong>{' '}
                    {singleSkill.prerequisiteSkillIds.join(', ')}
                  </span>
                ) : (
                  <span className="text-slate-400">Foundational skill (no prerequisites)</span>
                )}
              </div>
              <div>
                Accuracy: <strong className="text-slate-200">{accuracy}%</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // STRUCTURE 3: Topic with many skills (> 1 skills)
  // Topic-level header with sequence, title, aggregate topic progress, and "Practice Topic" button;
  // followed by child skills list with individual Practice and Details actions.
  const totalAttempts = skills.reduce(
    (sum, s) => sum + (courseMastery.skillMasteries[s.id]?.totalAttempts ?? 0),
    0
  );
  const avgMastery =
    skills.length > 0
      ? Math.round(
          skills.reduce(
            (sum, s) => sum + (courseMastery.skillMasteries[s.id]?.masteryPercentage ?? 0),
            0
          ) / skills.length
        )
      : 0;

  return (
    <div className="bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-xl p-4 sm:p-5 space-y-3.5 transition hover:border-[#2c4f75]/50">
      {/* Top Header Row: Sequence, Title, Progress, and Practice Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <span className="shrink-0 text-xs font-mono font-bold text-brass-400 bg-[#102d52] border border-[#2c4f75]/50 px-2 py-1 rounded-md mt-0.5">
            {topicSequenceStr}
          </span>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-white tracking-tight break-words">
              {formattedTitle}
            </h4>
            {subtopicsSummary && (
              <p className="text-xs text-slate-400 line-clamp-1">
                {subtopicsSummary}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end space-x-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#2c4f75]/20">
          <div className="text-right font-mono text-xs text-[#8ea8c0] pr-1">
            <span className="text-white font-bold">{avgMastery}%</span> topic mastery
            <span className="text-slate-500 mx-1.5">&bull;</span>
            <span>
              {totalAttempts} {totalAttempts === 1 ? 'try' : 'tries'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onStartPractice(courseId, topic.id, undefined, 'TOPIC_PRACTICE')}
            aria-label={`Practice Topic: ${formattedTitle}`}
            className="px-4 py-2 min-h-[44px] rounded-lg bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition shadow-sm shrink-0"
          >
            <span>Practice Topic</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Child Skills List */}
      <div className="space-y-2 pt-2 border-t border-[#2c4f75]/25">
        {skills.map((skill) => {
          const masteryRec = courseMastery.skillMasteries[skill.id];
          const masteryPct = masteryRec?.masteryPercentage ?? 0;
          const attempts = masteryRec?.totalAttempts ?? 0;
          const correctAttempts = masteryRec?.correctAttempts ?? 0;
          const isExpanded = expandedSkillId === skill.id;

          return (
            <SkillItem
              key={skill.id}
              skill={skill}
              masteryPercentage={masteryPct}
              attempts={attempts}
              correctAttempts={correctAttempts}
              isExpanded={isExpanded}
              onToggleExpand={() => onToggleSkillExpand(skill.id)}
              onPractice={() =>
                onStartPractice(courseId, topic.id, skill.id, 'SKILL_PRACTICE')
              }
            />
          );
        })}
      </div>
    </div>
  );
};
