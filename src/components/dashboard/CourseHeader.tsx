'use client';

import React, { useState } from 'react';
import { GraduationCap, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { GearAssembly } from '../mechanical/GearAssembly';
import { CurriculumCourse } from '@/engine/curriculum/types';

const COURSE_SUBTITLES: Record<string, string> = {
  'COURSE-GEN0101': 'Foundational Mathematics & Trigonometry',
  'COURSE-GEN0102': 'Differential Calculus',
  'COURSE-GEN0107': 'Elementary Differential Equations',
  'COURSE-GEN0110': 'Linear Algebra & Matrix Theory',
  'COURSE-GEN0161': 'University Physics for Engineers',
  'COURSE-BSIE3219': 'Engineering Thermodynamics'
};

interface CourseHeaderProps {
  course: CurriculumCourse | undefined;
  courses: CurriculumCourse[];
  activeCourseId: string;
  onCourseChange: (courseId: string) => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  courses,
  activeCourseId,
  onCourseChange
}) => {
  const [showOverview, setShowOverview] = useState<boolean>(false);

  const courseSubtitle =
    (course?.id && COURSE_SUBTITLES[course.id]) ||
    (course?.officialTitle && course.officialTitle.toLowerCase() !== course.title.toLowerCase()
      ? course.officialTitle
      : 'Engineering Coursework');

  return (
    <div className="bg-gradient-to-b from-[#0a2344]/90 to-[#061b3a]/95 border border-[#2c4f75]/35 rounded-xl p-5 sm:p-7 shadow-[0_8px_30px_rgba(2,12,29,0.5)] space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Compact Course Identification */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-brass-400 shrink-0" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8ea8c0] font-bold">
              Adaptive Engineering Practice
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight break-words">
              {course?.title || 'Calculus 1'}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 font-mono">
              <span className="text-brass-400 font-bold">{course?.code || 'GEN 0102'}</span>
              <span className="text-[#6687a8]">&bull;</span>
              <span>{courseSubtitle}</span>
              {course?.description && (
                <>
                  <span className="text-[#6687a8]">&bull;</span>
                  <button
                    type="button"
                    onClick={() => setShowOverview(!showOverview)}
                    className="text-xs font-mono text-brass-400 hover:text-brass-300 underline underline-offset-2 flex items-center gap-1 transition"
                    aria-expanded={showOverview}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>{showOverview ? 'Hide Overview' : 'Course Overview'}</span>
                    {showOverview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Mechanical Visual & Course Selector */}
        <div className="flex items-center gap-4 shrink-0">
          <GearAssembly scale="large" state="idle" className="dashboard-mechanism hidden sm:block" />
          <div className="bg-[#06162f]/80 border border-[#2c4f75]/35 rounded-lg p-3 space-y-1.5 w-full sm:w-auto">
            <label htmlFor="course-selector" className="block text-[10px] font-mono text-[#8ea8c0] uppercase font-bold tracking-wider">
              Active Course
            </label>
            <select
              id="course-selector"
              value={activeCourseId}
              onChange={(e) => onCourseChange(e.target.value)}
              className="px-3.5 py-2 min-h-[44px] bg-[#0a2344] border border-[#2c4f75]/50 rounded-lg text-white text-sm font-medium focus:ring-2 focus:ring-brass-500 focus:outline-none w-full sm:w-64 cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Collapsible Course Overview */}
      {showOverview && course?.description && (
        <div className="pt-4 border-t border-[#2c4f75]/30 text-xs sm:text-sm text-slate-300 bg-[#06162f]/60 p-4 rounded-lg border border-[#2c4f75]/20 leading-relaxed space-y-2">
          <div className="text-[11px] font-mono text-brass-400 uppercase font-bold tracking-wider">
            Syllabus Description & Scope
          </div>
          <p>{course.description}</p>
          {course.prerequisites && course.prerequisites.length > 0 && (
            <div className="text-xs font-mono text-[#8ea8c0] pt-1">
              <strong className="text-slate-200">Prerequisites:</strong> {course.prerequisites.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
