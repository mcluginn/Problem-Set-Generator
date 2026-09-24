'use client';

import React, { useState } from 'react';
import { CurriculumRegistry } from '@/engine/curriculum/registry';
import {
  CurriculumCourse,
  CurriculumUnit,
  CurriculumTopic,
  TopicDictionaryEntry,
  LearningSkill,
  CanonicalSkillDictionaryEntry
} from '@/engine/curriculum/types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Layers,
  Search,
  ShieldCheck,
  Tag,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  GitBranch,
  Target,
  AlertCircle,
  HelpCircle,
  Compass,
  Award,
  BookMarked
} from 'lucide-react';
import { formatUnitPeriodName } from '../dashboard/CurriculumTitleFormatter';

export function CurriculumBrowser() {
  const registry = CurriculumRegistry.getInstance();
  const manifest = registry.getAllManifestEntries();
  const courses = registry.getAllCourses();
  const stats = registry.getStatistics();
  const skillStats = registry.getSkillStatistics();
  const validationIssues = registry.validateIntegrity();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[1]?.id || courses[0]?.id);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'skills' | 'prerequisites' | 'dictionary' | 'manifest'>('courses');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'UNIT-GEN0102-U1': true,
    'UNIT-GEN0102-U2': true,
    'UNIT-GEN0102-U3': true,
  });

  const selectedCourse = registry.getCourseById(selectedCourseId) || courses[0];
  const unitsForCourse = registry.getUnitsByCourse(selectedCourse.id);
  const selectedTopic = selectedTopicId ? registry.getTopicById(selectedTopicId) : null;
  const selectedSkill = selectedSkillId ? registry.getSkillById(selectedSkillId) : null;
  const allSkills = registry.getAllSkills();
  const topicDictionaryEntries = registry.getAllDictionaryEntries();
  const skillDictionaryEntries = registry.getAllSkillDictionaryEntries();

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const filteredSkills = searchQuery
    ? allSkills.filter(s =>
        s.canonicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skillType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.dominantCompetency.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSkills;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2c4f75]/35 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brass-500/15 text-brass-400 border border-brass-500/35">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Authoritative Curriculum & Learning Ontology
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Official course coverage & audited learning ontology extracted from 6 verified institutional syllabi.
              </p>
            </div>
          </div>
        </div>

        {/* Top-Level Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#06162f] border border-[#2c4f75]/35 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'courses'
                ? 'bg-brass-500 text-[#061b3a] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
            }`}
          >
            Course Coverage ({courses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-brass-500 text-[#061b3a] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Learning Skills ({allSkills.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('prerequisites')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeTab === 'prerequisites'
                ? 'bg-brass-500 text-[#061b3a] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Prerequisites ({skillStats.totalPrerequisiteEdges})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dictionary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'dictionary'
                ? 'bg-brass-500 text-[#061b3a] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
            }`}
          >
            Skill Dictionary ({skillDictionaryEntries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manifest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTab === 'manifest'
                ? 'bg-brass-500 text-[#061b3a] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-[#102d52]/50'
            }`}
          >
            Manifest ({manifest.length})
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-[#0a2344]/60 rounded-xl border border-[#2c4f75]/35 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Official Courses</div>
          <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-brass-400" />
            {stats.totalCourses}
          </div>
        </div>

        <div className="p-3.5 bg-[#0a2344]/60 rounded-xl border border-[#2c4f75]/35 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Curriculum Units</div>
          <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            {stats.totalUnits}
          </div>
        </div>

        <div className="p-3.5 bg-[#0a2344]/60 rounded-xl border border-[#2c4f75]/35 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Syllabus Topics</div>
          <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-brass-400" />
            {stats.totalTopics}
          </div>
        </div>

        <div className="p-3.5 bg-[#0a2344]/60 rounded-xl border border-brass-500/35 bg-brass-500/10 space-y-1">
          <div className="text-[11px] font-mono text-brass-400 font-semibold">Audited Skills</div>
          <div className="text-xl font-bold font-mono text-brass-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brass-400" />
            {skillStats.totalSkills}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {skillStats.explicitSkillsCount} Expl • {skillStats.derivedSkillsCount} Deriv
          </div>
        </div>

        <div className="p-3.5 bg-[#0a2344]/60 rounded-xl border border-[#2c4f75]/35 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">Prereq DAG Edges</div>
          <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            {skillStats.totalPrerequisiteEdges}
          </div>
        </div>

        <div className="p-3.5 bg-[#0a2344]/60 rounded-xl border border-emerald-800/40 bg-emerald-950/20 space-y-1">
          <div className="text-[11px] font-mono text-emerald-400 font-semibold">Integrity Validation</div>
          <div className="text-sm font-bold font-mono text-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {validationIssues.length === 0 ? '100% Verified' : `${validationIssues.length} issues`}
          </div>
        </div>
      </div>

      {/* VIEW 1: COURSE HIERARCHY & EMBEDDED SKILLS */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Course Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Select Official Course
            </div>

            <div className="space-y-2.5">
              {courses.map(c => {
                const isSelected = c.id === selectedCourse.id;
                const cUnits = registry.getUnitsByCourse(c.id);
                const cTopics = registry.getTopicsByCourse(c.id);
                const cSkills = registry.getSkillsByCourse(c.id);
                const totalHours = cTopics.reduce((s, t) => s + t.hours, 0);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCourseId(c.id);
                      setSelectedTopicId(null);
                      setSelectedSkillId(null);
                      const unitKeys: Record<string, boolean> = {};
                      cUnits.forEach(u => (unitKeys[u.id] = true));
                      setExpandedUnits(unitKeys);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all space-y-2 ${
                      isSelected
                        ? 'bg-[#102d52] border-brass-500/80 shadow-md shadow-brass-500/10'
                        : 'bg-[#06162f]/80 border-[#2c4f75]/30 hover:bg-[#102d52]/40 hover:border-[#2c4f75]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-brass-400 px-2 py-0.5 rounded bg-[#06162f] border border-brass-500/40">
                        {c.code}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {totalHours}h
                      </span>
                    </div>

                    <div className="font-semibold text-sm text-slate-200">{c.title}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{cUnits.length} Units • {cTopics.length} Topics</span>
                      <span className="text-brass-400 font-semibold">{cSkills.length} Skills</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hierarchy Details & Skills Explorer (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Selected Course Header Banner */}
            <div className="p-5 bg-[#0a2344]/70 border border-[#2c4f75]/35 rounded-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2c4f75]/30 pb-3">
                <div>
                  <div className="text-xs font-mono text-brass-400 font-semibold uppercase tracking-wider">
                    {selectedCourse.code} • {selectedCourse.credits} Units ({selectedCourse.creditType})
                  </div>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    {selectedCourse.officialTitle}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">{selectedCourse.term}</div>
                  <div className="text-xs font-mono text-slate-400">AY {selectedCourse.academicYear}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedCourse.description}
              </p>

              <div className="pt-2 border-t border-[#2c4f75]/30 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                <div>
                  <span className="text-slate-400">Prerequisites: </span>
                  <span className="text-slate-200">
                    {selectedCourse.prerequisites.length > 0
                      ? selectedCourse.prerequisites.join(', ')
                      : 'None stated in source'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Syllabus File: </span>
                  <span className="text-brass-300 font-mono">{selectedCourse.sourceSyllabusId}</span>
                </div>
              </div>
            </div>

            {/* Hierarchical Unit & Topic Accordion */}
            <div className="space-y-4">
              {unitsForCourse.map(unit => {
                const unitTopics = registry.getTopicsByUnit(unit.id);
                const isExpanded = expandedUnits[unit.id] ?? true;

                return (
                  <div
                    key={unit.id}
                    className="border border-[#2c4f75]/35 rounded-xl bg-[#06162f]/80 overflow-hidden"
                  >
                    {/* Unit Header */}
                    <button
                      type="button"
                      onClick={() => toggleUnit(unit.id)}
                      className="w-full p-4 flex items-center justify-between text-left bg-[#0a2344]/70 hover:bg-[#102d52]/60 transition"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-1 rounded bg-[#102d52] text-slate-300">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#102d52] text-brass-300 border border-brass-500/40 font-bold tracking-wider">
                              {formatUnitPeriodName(unit)}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-white mt-0.5">
                            {unit.normalizedName}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                        <span>{unitTopics.length} Topics</span>
                        <span className="px-2 py-0.5 rounded bg-[#102d52] text-slate-200 border border-[#2c4f75]/40">{unit.totalHours}h</span>
                      </div>
                    </button>

                    {/* Unit Topics & Embedded Skills */}
                    {isExpanded && (
                      <div className="p-4 space-y-4 bg-[#06162f]/50 border-t border-[#2c4f75]/30">
                        {unitTopics.map(topic => {
                          const topicSkills = registry.getSkillsByTopic(topic.id);

                          return (
                            <div
                              key={topic.id}
                              className="p-4 rounded-xl border border-[#2c4f75]/30 bg-[#06162f]/90 space-y-3"
                            >
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 font-mono text-[11px]">
                                    <span className="text-brass-400 font-bold">{topic.id}</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-400">{topic.hours} contact hours</span>
                                    <span className="text-slate-300 font-semibold">• {topicSkills.length} Learning Skills</span>
                                  </div>
                                  <div className="font-semibold text-slate-200 text-sm">
                                    {topic.normalizedName}
                                  </div>
                                  <div className="text-[11px] font-mono text-slate-400 italic">
                                    Source: &quot;{topic.officialName}&quot;
                                  </div>
                                </div>
                              </div>

                              {/* Skills mapped under topic */}
                              {topicSkills.length > 0 && (
                                <div className="pt-2 border-t border-[#2c4f75]/30 space-y-2">
                                  <div className="text-[11px] font-mono text-brass-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Learning Skills & Competency Targets:</span>
                                  </div>

                                  <div className="space-y-2">
                                    {topicSkills.map(skill => {
                                      const isSkillSelected = skill.id === selectedSkillId;
                                      const prereqs = registry.getImmediatePrerequisites(skill.id);

                                      return (
                                        <div
                                          key={skill.id}
                                          className={`p-3.5 rounded-xl border transition space-y-2 ${
                                            isSkillSelected
                                              ? 'bg-[#102d52]/90 border-brass-500/80 shadow-md'
                                              : 'bg-[#0a2344]/50 border-[#2c4f75]/35 hover:border-[#2c4f75]/70'
                                          }`}
                                        >
                                          <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div className="space-y-0.5 flex-1">
                                              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                                                <span className="text-brass-400 font-bold">{skill.id}</span>
                                                <span className="px-1.5 py-0.5 rounded bg-[#102d52] text-slate-300 uppercase border border-[#2c4f75]/40">
                                                  {skill.skillType}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase font-bold">
                                                  {skill.dominantCompetency}
                                                </span>
                                                <span
                                                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                                                    skill.sourceType === 'SYLLABUS_EXPLICIT'
                                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                                  }`}
                                                >
                                                  {skill.sourceType}
                                                </span>
                                                {skill.associatedOutcomeIds && skill.associatedOutcomeIds.length > 0 && (
                                                  <span className="px-1.5 py-0.5 rounded bg-[#102d52] text-brass-300 border border-brass-500/40 text-[10px]">
                                                    {skill.associatedOutcomeIds.join(', ')}
                                                  </span>
                                                )}
                                              </div>
                                              <div className="font-semibold text-xs text-white pt-1">
                                                {skill.canonicalName}
                                              </div>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() => setSelectedSkillId(isSkillSelected ? null : skill.id)}
                                              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#102d52] hover:bg-[#1d3b5e] text-brass-300 border border-brass-500/40 transition"
                                            >
                                              {isSkillSelected ? 'Close Details' : 'View Details'}
                                            </button>
                                          </div>

                                          <p className="text-[11px] text-slate-300 leading-relaxed">
                                            {skill.description}
                                          </p>

                                          {/* Extended Skill Inspection Drawer */}
                                          {isSkillSelected && (
                                            <div className="pt-3 border-t border-[#2c4f75]/35 space-y-3 font-mono text-xs">
                                              {/* Mastery Evidence Criteria */}
                                              <div className="space-y-1.5 bg-[#06162f]/90 p-3 rounded-lg border border-[#2c4f75]/30">
                                                <div className="text-[10px] uppercase text-emerald-400 font-bold flex items-center gap-1">
                                                  <Target className="w-3.5 h-3.5" />
                                                  <span>Observable Mastery Criteria:</span>
                                                </div>
                                                <ul className="space-y-1 text-[11px] text-slate-300">
                                                  {skill.masteryEvidence.map((ev, idx) => (
                                                    <li key={idx} className="flex items-start gap-1.5">
                                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                                      <span>{ev}</span>
                                                    </li>
                                                  ))}
                                                </ul>
                                              </div>

                                              {/* Assessment Modalities & Difficulty */}
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                                <div className="p-2.5 bg-[#06162f]/90 rounded-lg border border-[#2c4f75]/30 space-y-1">
                                                  <span className="text-slate-400 uppercase text-[10px]">Evidence Modalities:</span>
                                                  <div className="flex flex-wrap gap-1">
                                                    {skill.evidenceTypes.map(ev => (
                                                      <span key={ev} className="px-1.5 py-0.5 rounded bg-[#102d52] text-slate-300 text-[10px] border border-[#2c4f75]/40">
                                                        {ev}
                                                      </span>
                                                    ))}
                                                  </div>
                                                </div>

                                                <div className="p-2.5 bg-[#06162f]/90 rounded-lg border border-[#2c4f75]/30 space-y-1">
                                                  <span className="text-slate-400 uppercase text-[10px]">Difficulty Factors:</span>
                                                  <div className="text-slate-300 text-[10px]">
                                                    {skill.difficultyFactors.join(', ')}
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Immediate Prerequisites */}
                                              <div className="p-2.5 bg-[#06162f]/90 rounded-lg border border-[#2c4f75]/30 space-y-1">
                                                <span className="text-slate-400 uppercase text-[10px]">Required Upstream Prerequisites:</span>
                                                {prereqs.length > 0 ? (
                                                  <div className="flex flex-wrap gap-1.5">
                                                    {prereqs.map(pId => (
                                                      <span key={pId} className="px-2 py-0.5 rounded bg-[#102d52] text-brass-300 border border-brass-500/40 text-[10px]">
                                                        {pId}
                                                      </span>
                                                    ))}
                                                  </div>
                                                ) : (
                                                  <span className="text-slate-500 text-[10px] block">No course-internal prerequisites (Foundational Entry Skill)</span>
                                                )}
                                              </div>

                                              {/* Source Excerpt & Provenance Text */}
                                              <div className="p-2.5 bg-[#06162f]/90 rounded-lg border border-[#2c4f75]/30 space-y-1">
                                                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
                                                  <span>Source: {skill.sourceReferences[0]?.filename}</span>
                                                  <span>{skill.sourceReferences[0]?.tableReference}</span>
                                                </div>
                                                <div className="text-[11px] text-slate-300 italic">
                                                  &quot;{skill.sourceReferences[0]?.rawTextExtract}&quot;
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL LEARNING SKILLS CATALOGUE */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#0a2344]/70 border border-[#2c4f75]/35 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brass-400" />
                  <span>Authoritative Learning Skills Catalogue ({allSkills.length})</span>
                </h2>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Complete competency ontology defining what students know, recognize, compute, model, and apply.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search skills, verbs, types..."
                  className="bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 text-xs font-mono rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-brass-500 focus:outline-none w-64"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSkills.map(skill => {
              const prereqs = registry.getImmediatePrerequisites(skill.id);
              const course = registry.getCourseById(skill.parentCourseId);

              return (
                <div
                  key={skill.id}
                  className="p-5 bg-[#0a2344]/50 border border-[#2c4f75]/35 rounded-xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-brass-400 px-2 py-0.5 rounded bg-[#06162f] border border-brass-500/40">
                        {skill.id}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102d52] text-slate-300 border border-[#2c4f75]/40">
                          {skill.skillType}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                          {skill.dominantCompetency}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {course?.code}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-white">{skill.canonicalName}</h3>

                    <p className="text-xs text-slate-300 leading-relaxed">{skill.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#2c4f75]/35 space-y-2 font-mono text-[11px]">
                    <div className="space-y-1">
                      <span className="text-slate-400 uppercase text-[10px]">Mastery Criteria:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        • {skill.masteryEvidence[0]}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="text-[10px] text-slate-400">
                        Prereqs: {prereqs.length > 0 ? prereqs.join(', ') : 'None (Entry)'}
                      </div>
                      <div
                        className={`text-[10px] font-semibold ${
                          skill.sourceType === 'SYLLABUS_EXPLICIT' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {skill.sourceType}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: PREREQUISITE GRAPH INSPECTOR */}
      {activeTab === 'prerequisites' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#0a2344]/70 border border-[#2c4f75]/35 rounded-xl space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              <span>Prerequisite Dependency Graph ({skillStats.totalPrerequisiteEdges} Directed Edges)</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Explicit directed relationships linking foundational competencies to downstream calculus, physics, ODE, and thermodynamic skills. Zero circular dependencies verified.
            </p>
          </div>

          <div className="space-y-3">
            {registry.getAllPrerequisiteRelations().map((rel, idx) => {
              const srcSkill = registry.getSkillById(rel.sourceSkillId);
              const tgtSkill = registry.getSkillById(rel.targetSkillId);

              return (
                <div
                  key={idx}
                  className="p-4 bg-[#0a2344]/50 border border-[#2c4f75]/35 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 rounded-lg bg-[#06162f] border border-brass-500/40 text-brass-400 font-bold shrink-0">
                      {rel.sourceSkillId}
                    </div>
                    <div className="text-slate-300 font-sans text-xs flex-1 truncate">
                      {srcSkill?.canonicalName}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-cyan-400 justify-center">
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
                      {rel.strength}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 rounded-lg bg-[#06162f] border border-brass-500/40 text-brass-400 font-bold shrink-0">
                      {rel.targetSkillId}
                    </div>
                    <div className="text-slate-300 font-sans text-xs flex-1 truncate">
                      {tgtSkill?.canonicalName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: CANONICAL SKILL DICTIONARY */}
      {activeTab === 'dictionary' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#0a2344]/70 border border-[#2c4f75]/35 rounded-xl space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-brass-400" />
              <span>Cross-Course Canonical Skill Dictionary</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Reconciles identical and related competencies across all 6 courses while strictly preserving individual course instructional contexts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillDictionaryEntries.map(entry => (
              <div
                key={entry.id}
                className="p-5 bg-[#0a2344]/50 border border-[#2c4f75]/35 rounded-xl space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brass-400 px-2 py-0.5 rounded bg-[#06162f] border border-brass-500/40">
                      {entry.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        entry.relationship === 'EXACT_MATCH'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : entry.relationship === 'DO_NOT_MERGE'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-[#102d52] text-brass-300 border border-brass-500/40'
                      }`}
                    >
                      {entry.relationship}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{entry.canonicalSkillName}</h3>

                  <p className="text-xs text-slate-400 leading-relaxed">{entry.notes}</p>
                </div>

                <div className="pt-3 border-t border-[#2c4f75]/35 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Mapped Skill IDs:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.mappedSkillIds.map(sid => (
                      <span
                        key={sid}
                        className="px-2 py-0.5 rounded bg-[#06162f] text-[11px] font-mono text-slate-300 border border-[#2c4f75]/30"
                      >
                        {sid}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 5: SYLLABUS MANIFEST */}
      {activeTab === 'manifest' && (
        <div className="space-y-6">
          <div className="p-5 bg-[#0a2344]/70 border border-[#2c4f75]/35 rounded-xl space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brass-400" />
              <span>Official Syllabus Ingestion Manifest</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Audit log of all 6 uploaded syllabus documents cataloguing extracted metadata, revisions, and confidence metrics.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#2c4f75]/35 bg-[#0a2344]/50">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-[#2c4f75]/35 text-slate-300 bg-[#0a2344]/80">
                  <th className="p-3">Syllabus ID</th>
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Course Title</th>
                  <th className="p-3">File Source</th>
                  <th className="p-3">Academic Term</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c4f75]/25">
                {manifest.map(m => (
                  <tr key={m.syllabusId} className="hover:bg-[#102d52]/40 transition">
                    <td className="p-3 font-bold text-brass-400">{m.syllabusId}</td>
                    <td className="p-3 font-semibold text-slate-200">{m.courseCode}</td>
                    <td className="p-3 text-slate-300">{m.courseTitle}</td>
                    <td className="p-3 text-slate-400">{m.filename}</td>
                    <td className="p-3 text-slate-400">{m.term}, {m.academicYear}</td>
                    <td className="p-3 text-emerald-400 font-bold">{m.extractionStatus}</td>
                    <td className="p-3 text-emerald-400 font-semibold">{m.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
