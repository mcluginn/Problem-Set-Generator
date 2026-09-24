'use client';

import React from 'react';
import { Flame, CheckCircle, TrendingUp, Clock } from 'lucide-react';

interface CourseMetricsProps {
  streakDays: number;
  overallMasteryPercentage: number;
  skillsMasteredCount: number;
  totalSkillsCount: number;
  totalTimeSpentSeconds: number;
  masteryTier: { label: string; color: string; badge: string };
}

export const CourseMetrics: React.FC<CourseMetricsProps> = ({
  streakDays,
  overallMasteryPercentage,
  skillsMasteredCount,
  totalSkillsCount,
  totalTimeSpentSeconds,
  masteryTier
}) => {
  const timeMinutes = Math.round(totalTimeSpentSeconds / 60);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Current Streak */}
      <div className="bg-[#0a2344]/50 border border-[#2c4f75]/30 rounded-xl p-4 flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between text-[#8ea8c0]">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
            Current Streak
          </span>
          <Flame className="w-4 h-4 text-amber-400 shrink-0" />
        </div>
        <div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {streakDays} <span className="text-sm font-sans font-normal text-slate-300">days</span>
          </div>
          <div className="text-[11px] font-mono text-[#8ea8c0] pt-0.5">
            Active daily practice
          </div>
        </div>
      </div>

      {/* 2. Overall Mastery */}
      <div className="bg-[#0a2344]/50 border border-[#2c4f75]/30 rounded-xl p-4 flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between text-[#8ea8c0]">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
            Overall Mastery
          </span>
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-mono font-bold text-white tracking-tight">
              {overallMasteryPercentage}%
            </span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${masteryTier.badge}`}>
              {masteryTier.label}
            </span>
          </div>
          <div className="w-full bg-[#06162f] h-1.5 rounded-full overflow-hidden border border-[#2c4f75]/30 mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overallMasteryPercentage >= 75
                  ? 'bg-emerald-500'
                  : overallMasteryPercentage >= 45
                  ? 'bg-amber-500'
                  : 'bg-slate-600'
              }`}
              style={{ width: `${overallMasteryPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Skills Mastered */}
      <div className="bg-[#0a2344]/50 border border-[#2c4f75]/30 rounded-xl p-4 flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between text-[#8ea8c0]">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
            Skills Mastered
          </span>
          <TrendingUp className="w-4 h-4 text-blue-400 shrink-0" />
        </div>
        <div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {skillsMasteredCount}{' '}
            <span className="text-base font-normal text-[#8ea8c0]">/ {totalSkillsCount}</span>
          </div>
          <div className="text-[11px] font-mono text-[#8ea8c0] pt-0.5">
            Syllabus skills strong
          </div>
        </div>
      </div>

      {/* 4. Time Practiced */}
      <div className="bg-[#0a2344]/50 border border-[#2c4f75]/30 rounded-xl p-4 flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between text-[#8ea8c0]">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
            Time Practiced
          </span>
          <Clock className="w-4 h-4 text-brass-400 shrink-0" />
        </div>
        <div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {timeMinutes} <span className="text-sm font-sans font-normal text-slate-300">min</span>
          </div>
          <div className="text-[11px] font-mono text-[#8ea8c0] pt-0.5">
            Total active learning
          </div>
        </div>
      </div>
    </div>
  );
};
