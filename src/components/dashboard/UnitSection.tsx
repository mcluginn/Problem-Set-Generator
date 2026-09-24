'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CurriculumUnit, CurriculumTopic } from '@/engine/curriculum/types';
import { CourseMasteryRecord, PracticeMode } from '@/engine/adaptive/types';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { formatCurriculumTitle, formatUnitPeriodName } from './CurriculumTitleFormatter';
import { TopicCard } from './TopicCard';

interface UnitSectionProps {
  unit: CurriculumUnit;
  topics: CurriculumTopic[];
  courseId: string;
  courseMastery: CourseMasteryRecord;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  expandedSkillId: string | null;
  onToggleSkillExpand: (skillId: string) => void;
  onStartPractice: (courseId: string, topicId?: string, skillId?: string, mode?: PracticeMode) => void;
}

export const UnitSection: React.FC<UnitSectionProps> = ({
  unit,
  topics,
  courseId,
  courseMastery,
  isCollapsed,
  onToggleCollapse,
  expandedSkillId,
  onToggleSkillExpand,
  onStartPractice
}) => {
  const unitSkills = topics.flatMap((t) => curriculumRegistry.getSkillsByTopic(t.id));
  const unitAvgMastery =
    unitSkills.length > 0
      ? Math.round(
          unitSkills.reduce(
            (sum, s) => sum + (courseMastery.skillMasteries[s.id]?.masteryPercentage ?? 0),
            0
          ) / unitSkills.length
        )
      : 0;

  const periodLabel = formatUnitPeriodName(unit);
  const formattedUnitName = formatCurriculumTitle(unit.officialName);

  return (
    <div className="bg-[#0a2344]/40 border border-[#2c4f75]/30 rounded-xl p-5 sm:p-6 space-y-4">
      {/* Collapsible Unit Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggleCollapse}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleCollapse();
          }
        }}
        className="min-h-[44px] flex items-center justify-between cursor-pointer group border-b border-[#2c4f75]/30 pb-3 select-none"
        aria-expanded={!isCollapsed}
        aria-label={`Toggle ${periodLabel}: ${formattedUnitName}`}
      >
        <div className="space-y-1 pr-4">
          <span className="text-[11px] font-mono text-brass-400 uppercase font-bold tracking-wider">
            {periodLabel}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-brass-300 transition break-words">
            {formattedUnitName}
          </h3>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono shrink-0">
          <span className="text-slate-400 hidden sm:inline">
            {topics.length} {topics.length === 1 ? 'Topic' : 'Topics'} &bull; {unitSkills.length}{' '}
            {unitSkills.length === 1 ? 'Skill' : 'Skills'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-[#102d52] text-slate-200 border border-[#2c4f75]/40 font-bold">
            {unitAvgMastery}% Mastery
          </span>
          <div className="p-1 rounded-md bg-[#102d52]/80 text-slate-400 group-hover:text-white transition">
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Unit Content: Homogeneous Stack of Topic Cards */}
      {!isCollapsed && (
        <div className="space-y-3 pt-1">
          {topics.map((topic) => {
            const topicSkills = curriculumRegistry.getSkillsByTopic(topic.id);
            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                skills={topicSkills}
                courseId={courseId}
                courseMastery={courseMastery}
                expandedSkillId={expandedSkillId}
                onToggleSkillExpand={onToggleSkillExpand}
                onStartPractice={onStartPractice}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
