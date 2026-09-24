'use client';

import React, { useState, useEffect } from 'react';
import { UnifiedPracticeStore } from '@/engine/adaptive/store';
import { PracticeMode } from '@/engine/adaptive/types';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { Sparkles, Sliders, Play, X, BookOpen, Layers, ArrowLeft } from 'lucide-react';

interface PracticeSetupProps {
  onStart: (
    courseId: string,
    topicId?: string,
    skillId?: string,
    mode?: PracticeMode,
    sessionLength?: number
  ) => void;
  onCancel: () => void;
  defaultCourseId?: string;
  defaultTopicId?: string;
  defaultSkillId?: string;
}

export const PracticeSetup: React.FC<PracticeSetupProps> = ({
  onStart,
  onCancel,
  defaultCourseId,
  defaultTopicId,
  defaultSkillId
}) => {
  const [courseId, setCourseId] = useState<string>(
    defaultCourseId || UnifiedPracticeStore.getActiveCourseId()
  );
  const [selectedTopicId, setSelectedTopicId] = useState<string>(defaultTopicId || 'ALL');
  const [selectedSkillId, setSelectedSkillId] = useState<string>(defaultSkillId || 'ALL');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(
    defaultTopicId ? 'TOPIC_PRACTICE' : defaultSkillId ? 'SKILL_PRACTICE' : 'RECOMMENDED'
  );
  const [sessionLength, setSessionLength] = useState<number>(5);

  const courses = curriculumRegistry.getAllCourses();
  const topics = curriculumRegistry.getTopicsByCourse(courseId);
  const skills = selectedTopicId === 'ALL'
    ? curriculumRegistry.getSkillsByCourse(courseId)
    : curriculumRegistry.getSkillsByTopic(selectedTopicId);

  useEffect(() => {
    if (defaultSkillId) {
      setSelectedSkillId(defaultSkillId);
      const skill = curriculumRegistry.getSkillById(defaultSkillId);
      if (skill) setSelectedTopicId(skill.parentTopicId);
      setPracticeMode('SKILL_PRACTICE');
    } else if (defaultTopicId) {
      setSelectedTopicId(defaultTopicId);
      setPracticeMode('TOPIC_PRACTICE');
    }
  }, [defaultSkillId, defaultTopicId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(
      courseId,
      selectedTopicId === 'ALL' ? undefined : selectedTopicId,
      selectedSkillId === 'ALL' ? undefined : selectedSkillId,
      practiceMode,
      sessionLength
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-[#0a2344]/90 border border-[#2c4f75]/35 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-4">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-brass-400" />
            <h2 className="text-xl font-bold text-white">Configure Practice Session</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Back to Dashboard"
            className="px-3 py-1.5 rounded-lg bg-[#06162f] hover:bg-[#102d52] border border-[#2c4f75]/40 text-slate-300 hover:text-white text-xs font-mono font-bold transition flex items-center space-x-1.5 min-h-[36px]"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-brass-400" />
            <span>Back</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Scope Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#8ea8c0] uppercase font-bold">
              Engineering Course
            </label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setSelectedTopicId('ALL');
                setSelectedSkillId('ALL');
              }}
              className="w-full px-4 py-3 bg-[#06162f] border border-[#2c4f75]/40 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brass-500 font-medium"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Practice Mode Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#8ea8c0] uppercase font-bold">
              Practice Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'RECOMMENDED', label: '✨ Recommended', desc: 'Adaptive optimization' },
                { id: 'TOPIC_PRACTICE', label: '📚 Topic Focus', desc: 'Strict topic constraint' },
                { id: 'SKILL_PRACTICE', label: '🎯 Skill Focus', desc: 'Targeted single skill' },
                { id: 'REMEDIATION', label: '🔧 Remediation', desc: 'Address misconceptions' },
                { id: 'REVIEW', label: '🔄 Spaced Review', desc: 'Refresh prior topics' },
                { id: 'CHALLENGE', label: '⚡ Challenge', desc: 'Advanced applications' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPracticeMode(m.id as PracticeMode)}
                  className={`p-3 rounded-lg border text-left transition ${
                    practiceMode === m.id
                      ? 'bg-[#102d52] border-brass-500 text-white shadow-md'
                      : 'bg-[#06162f]/60 border-[#2c4f75]/25 text-slate-400 hover:text-slate-200 hover:bg-[#102d52]/40'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-[#8ea8c0] font-mono mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#8ea8c0] uppercase font-bold">
              Syllabus Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                setSelectedSkillId('ALL');
              }}
              className="w-full px-4 py-3 bg-[#06162f] border border-[#2c4f75]/40 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brass-500 font-medium"
            >
              <option value="ALL">All Course Topics</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.officialName} ({t.hours}h)
                </option>
              ))}
            </select>
          </div>

          {/* Specific Skill Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#8ea8c0] uppercase font-bold">
              Target Learning Skill
            </label>
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full px-4 py-3 bg-[#06162f] border border-[#2c4f75]/40 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brass-500 font-medium"
            >
              <option value="ALL">All Skills in Selected Scope ({skills.length} Skills)</option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.canonicalName}
                </option>
              ))}
            </select>
          </div>

          {/* Session Length */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-[#8ea8c0] uppercase font-bold">
              Session Length (Problems)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setSessionLength(len)}
                  className={`py-2.5 rounded-lg border text-xs font-mono font-bold transition ${
                    sessionLength === len
                      ? 'bg-brass-500 border-brass-500 text-[#061b3a]'
                      : 'bg-[#06162f]/60 border-[#2c4f75]/25 text-slate-400 hover:bg-[#102d52]/50 hover:text-white'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-brass-500 hover:bg-brass-400 text-[#061b3a] font-bold rounded-lg transition shadow-xl shadow-brass-500/20 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Practice Session</span>
          </button>
        </form>
      </div>
    </div>
  );
};
