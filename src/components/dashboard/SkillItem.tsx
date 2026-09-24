'use client';

import React from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import { LearningSkill } from '@/engine/curriculum/types';
import { formatCurriculumTitle } from './CurriculumTitleFormatter';

interface SkillItemProps {
  skill: LearningSkill;
  masteryPercentage: number;
  attempts: number;
  correctAttempts: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onPractice: () => void;
}

export const SkillItem: React.FC<SkillItemProps> = ({
  skill,
  masteryPercentage,
  attempts,
  correctAttempts,
  isExpanded,
  onToggleExpand,
  onPractice
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

  const tier = getTier(masteryPercentage);
  const accuracy = attempts > 0 ? Math.round((correctAttempts / attempts) * 100) : 0;
  const formattedTitle = formatCurriculumTitle(skill.canonicalName);

  return (
    <div className="rounded-lg bg-[#0a2344]/30 border border-[#2c4f75]/20 hover:border-[#2c4f75]/50 transition overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
        {/* Left: Interactive trigger to toggle details */}
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `Collapse details for ${formattedTitle}` : `Expand details for ${formattedTitle}`}
          className="p-3 sm:p-3.5 min-h-[44px] flex-1 text-left space-y-1.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-brass-400/60 rounded-lg"
        >
          <div className="text-xs sm:text-sm text-slate-200 group-hover:text-white font-medium break-words">
            {formattedTitle}
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="w-24 sm:w-32 bg-[#06162f] h-1.5 rounded-full overflow-hidden border border-[#2c4f75]/30 shrink-0">
              <div
                className={`h-full rounded-full ${
                  masteryPercentage >= 75
                    ? 'bg-emerald-500'
                    : masteryPercentage >= 45
                    ? 'bg-amber-500'
                    : 'bg-slate-600'
                }`}
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-[#8ea8c0]">
              {masteryPercentage}% &bull; {attempts} {attempts === 1 ? 'try' : 'tries'}
            </span>
          </div>
        </button>

        {/* Right: Tier Badge, Dedicated Practice Action, and Chevron */}
        <div className="flex items-center justify-between sm:justify-end space-x-2.5 shrink-0 px-3 pb-3 sm:pb-0 sm:pr-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#2c4f75]/20">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${tier.badge}`}>
            {tier.label}
          </span>

          <button
            type="button"
            onClick={onPractice}
            aria-label={`Practice: ${formattedTitle}`}
            className="px-3 py-1.5 min-h-[44px] rounded-lg bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold text-xs flex items-center space-x-1.5 transition shadow-sm shrink-0"
          >
            <span>Practice</span>
            <Play className="w-3 h-3 fill-current" />
          </button>

          <button
            type="button"
            onClick={onToggleExpand}
            aria-label={isExpanded ? `Collapse details for ${formattedTitle}` : `Expand details for ${formattedTitle}`}
            aria-expanded={isExpanded}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-slate-200 transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details View */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-2.5 border-t border-[#2c4f75]/25 bg-[#06162f]/60 text-xs space-y-2.5">
          <p className="text-slate-300 leading-relaxed">
            {skill.description}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#2c4f75]/20 text-[11px] font-mono text-[#8ea8c0]">
            <div>
              {skill.prerequisiteSkillIds && skill.prerequisiteSkillIds.length > 0 ? (
                <span>
                  <strong className="text-slate-200">Prerequisites:</strong>{' '}
                  {skill.prerequisiteSkillIds.join(', ')}
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
};
