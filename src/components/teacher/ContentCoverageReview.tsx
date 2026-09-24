'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  CoverageAuditor,
  SkillCoverageRecord,
  TopicCoverageMetrics,
  CourseCoverageMetrics,
  CurriculumCoverageSummary,
  CoverageReviewStatus
} from '@/engine/content/coverageAuditor';
import {
  TeacherCalibrationEngine,
  TeacherReviewRecord,
  TeacherDecision,
  TeacherRejectionReason,
  LOCAL_REVIEW_STORE_SCHEMA_VERSION,
  LOCAL_REVIEW_STORE_DISCLAIMER,
  buildReviewTargetKey,
  ProblemCandidateSnapshot
} from '@/engine/content/calibration';
import { ProblemBank } from '@/engine/content/problemBank';
import { MathRenderer } from '../math/MathRenderer';
import { RichContentRenderer } from '../math/RichContentRenderer';
import { CurriculumRegistry } from '@/engine/curriculum/registry';
import { ValidatedProblem, QuestionFormat, AssessmentEvidenceTypeId } from '@/engine/content/types';
import { formatUnitPeriodName } from '../dashboard/CurriculumTitleFormatter';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Check,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Eye,
  Sliders,
  X,
  AlertCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  GraduationCap,
  FileCheck
} from 'lucide-react';

export function ContentCoverageReview() {
  const [isMounted, setIsMounted] = useState(false);
  const [reviews, setReviews] = useState<Record<string, TeacherReviewRecord>>({});
  const [generationErrors, setGenerationErrors] = useState<Record<string, string>>({});
  const [canonicalApprovedSkillIds, setCanonicalApprovedSkillIds] = useState<Set<string>>(new Set());

  // Filter state
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ALL');
  const [selectedUnitId, setSelectedUnitId] = useState<string>('ALL');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedEvidenceType, setSelectedEvidenceType] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expandable UI state
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({
    'COURSE-GEN0102': true
  });
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  // Detail Drawer & Review state
  const [selectedSkill, setSelectedSkill] = useState<SkillCoverageRecord | null>(null);
  const [generatedCandidate, setGeneratedCandidate] = useState<ValidatedProblem | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [drawerDifficulty, setDrawerDifficulty] = useState<number>(2);

  // Review Form state
  const [reviewerName, setReviewerName] = useState<string>('Faculty Reviewer');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [difficultyOverride, setDifficultyOverride] = useState<number | undefined>(undefined);
  const [selectedRejectionReasons, setSelectedRejectionReasons] = useState<TeacherRejectionReason[]>([]);
  const [applyToSessionProblemBank, setApplyToSessionProblemBank] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // 6-dimension ratings state (1 to 5)
  const [ratings, setRatings] = useState<{
    mathematicalCorrectness: 1 | 2 | 3 | 4 | 5;
    skillAlignment: 1 | 2 | 3 | 4 | 5;
    clarity: 1 | 2 | 3 | 4 | 5;
    difficultySuitability: 1 | 2 | 3 | 4 | 5;
    educationalUsefulness: 1 | 2 | 3 | 4 | 5;
    diversityDistinctiveness: 1 | 2 | 3 | 4 | 5;
  }>({
    mathematicalCorrectness: 5,
    skillAlignment: 5,
    clarity: 5,
    difficultySuitability: 5,
    educationalUsefulness: 5,
    diversityDistinctiveness: 5
  });

  // Import / Export / Reset Modals
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [importValidationResult, setImportValidationResult] = useState<{
    tested: boolean;
    valid: boolean;
    count: number;
    errors: string[];
  } | null>(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // Hydration-safe initial synchronization
  useEffect(() => {
    setIsMounted(true);
    const engine = TeacherCalibrationEngine.getInstance();
    setReviews(engine.getAllReviewsMap());
    const bank = ProblemBank.getInstance();
    const approvedIds = new Set(
      bank.getAllProblems()
        .filter(p => p.lifecycleStatus === 'APPROVED')
        .map(p => p.dna.primarySkillId)
    );
    setCanonicalApprovedSkillIds(approvedIds);
  }, []);

  // Compute coverage metrics (pure & read-only via snapshot)
  const coverageSummary: CurriculumCoverageSummary = useMemo(() => {
    return CoverageAuditor.calculateCoverage({
      reviewsMap: isMounted ? reviews : {},
      generationErrors,
      canonicalApprovedSkillIds
    });
  }, [isMounted, reviews, generationErrors, canonicalApprovedSkillIds]);

  const currRegistry = CurriculumRegistry.getInstance();
  const allCourses = useMemo(() => currRegistry.getAllCourses(), []);

  // Filter available units and topics based on current course selection
  const availableUnits = useMemo(() => {
    if (selectedCourseId === 'ALL') return [];
    return currRegistry.getUnitsByCourse(selectedCourseId);
  }, [selectedCourseId]);

  const availableTopics = useMemo(() => {
    if (selectedCourseId === 'ALL') return currRegistry.getAllTopics();
    const courseTopics = currRegistry.getTopicsByCourse(selectedCourseId);
    if (selectedUnitId === 'ALL') return courseTopics;
    return courseTopics.filter(t => t.unitId === selectedUnitId);
  }, [selectedCourseId, selectedUnitId]);

  // Toggle helpers
  const toggleCourseExpand = (courseId: string) => {
    setExpandedCourses(prev => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Inspect skill details (with candidateSnapshot restoration if already reviewed)
  const handleInspectSkill = (skill: SkillCoverageRecord) => {
    setSelectedSkill(skill);
    setActionSuccessMessage(null);
    setDrawerDifficulty(skill.difficultyRange[0] || 2);

    if (skill.activeReview?.candidateSnapshot) {
      const snap = skill.activeReview.candidateSnapshot;
      setGeneratedCandidate({
        statement: snap.statement,
        rawExpression: null as any,
        solution: snap.solution,
        hints: snap.hints,
        qualityScore: {
          mathematicalValidity: 1,
          skillAlignment: 1,
          evidenceAlignment: 1,
          hintIntegrity: 1,
          overallQuality: 1
        },
        lifecycleStatus: skill.activeReview.decision === 'APPROVE' ? 'APPROVED' : 'VALID',
        createdAt: skill.activeReview.reviewedAt,
        dna: snap.dna
      });
      setReviewNotes(skill.activeReview.teacherNotes || '');
      setReviewerName(skill.activeReview.reviewer || 'Faculty Reviewer');
      setDifficultyOverride(skill.activeReview.suggestedDifficultyOverride);
      setSelectedRejectionReasons(skill.activeReview.rejectionReasons || []);
      if (skill.activeReview.ratings) {
        setRatings(skill.activeReview.ratings);
      }
    } else {
      setGeneratedCandidate(null);
      setReviewNotes('');
      setSelectedRejectionReasons([]);
      setApplyToSessionProblemBank(false);
      setRatings({
        mathematicalCorrectness: 5,
        skillAlignment: 5,
        clarity: 5,
        difficultySuitability: 5,
        educationalUsefulness: 5,
        diversityDistinctiveness: 5
      });
    }
  };

  const toggleRejectionReason = (reason: TeacherRejectionReason) => {
    setSelectedRejectionReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const canSubmitReview = Boolean(
    generatedCandidate &&
    generatedCandidate.dna.structureSignature &&
    generatedCandidate.dna.structureSignature !== 'REPRESENTATIVE_ITEM'
  );

  // Explicit Candidate Generation (ONLY on user click)
  const handleGenerateCandidate = (skillId: string, diff?: number) => {
    setIsGenerating(true);
    setActionSuccessMessage(null);

    const difficulty = diff ?? drawerDifficulty;
    const res = CoverageAuditor.generateCandidateForSkill(skillId, difficulty);

    setIsGenerating(false);

    if (res.success && res.problem) {
      setGeneratedCandidate(res.problem);
      setGenerationErrors(prev => {
        const next = { ...prev };
        delete next[skillId];
        return next;
      });
    } else {
      setGeneratedCandidate(null);
      const errMsg = res.rejectionDetails || res.rejectionReason || 'Generation validation failed.';
      setGenerationErrors(prev => ({ ...prev, [skillId]: errMsg }));
    }
  };

  // Submit Review Decision
  const handleSubmitReviewDecision = (decision: TeacherDecision) => {
    if (!selectedSkill || !generatedCandidate) return;

    if (generatedCandidate.dna.structureSignature === 'REPRESENTATIVE_ITEM') {
      alert('Cannot approve a placeholder target with structureSignature REPRESENTATIVE_ITEM. Generate a real candidate blueprint first.');
      return;
    }

    if (decision === 'REJECT' && selectedRejectionReasons.length === 0) {
      alert('Please select at least one rejection reason before rejecting this problem.');
      return;
    }

    const engine = TeacherCalibrationEngine.getInstance();
    const structureSignature = generatedCandidate.dna.structureSignature;
    const targetKey = buildReviewTargetKey({
      courseId: selectedSkill.parentCourseId,
      primarySkillId: selectedSkill.skillId,
      familyId: selectedSkill.familyId || 'NO_FAMILY',
      templateId: selectedSkill.templateId || 'NO_TEMPLATE',
      structureSignature
    });

    const candidateSnapshot: ProblemCandidateSnapshot = {
      statement: generatedCandidate.statement,
      solution: generatedCandidate.solution,
      hints: generatedCandidate.hints,
      difficultyVector: generatedCandidate.dna.difficultyVector,
      structureSignature: generatedCandidate.dna.structureSignature,
      dna: generatedCandidate.dna
    };

    const record = engine.submitReview(
      {
        reviewTargetKey: targetKey,
        problemId: generatedCandidate.dna.problemId,
        courseId: selectedSkill.parentCourseId,
        skillId: selectedSkill.skillId,
        familyId: selectedSkill.familyId,
        templateId: selectedSkill.templateId,
        candidateSnapshot,
        reviewer: reviewerName.trim() || 'Faculty Reviewer',
        ratings,
        decision,
        rejectionReasons: decision === 'REJECT' || decision === 'FLAG' ? selectedRejectionReasons : undefined,
        teacherNotes: reviewNotes.trim() || undefined,
        suggestedDifficultyOverride: difficultyOverride
      },
      { applyToSessionProblemBank: canSubmitReview && applyToSessionProblemBank }
    );

    // Update local state overlay
    setReviews(engine.getAllReviewsMap());
    if (applyToSessionProblemBank && decision === 'APPROVE') {
      setCanonicalApprovedSkillIds(prev => new Set([...prev, selectedSkill.skillId]));
    }
    setActionSuccessMessage(`Decision "${decision}" saved successfully to Local Review Store!`);
  };

  // Export JSON
  const handleExportJSON = () => {
    const engine = TeacherCalibrationEngine.getInstance();
    const jsonStr = engine.exportReviewsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practice_engine_reviews_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pre-validate JSON before importing
  const handleValidateImport = () => {
    setImportValidationResult(null);
    if (!importJsonText.trim()) {
      setImportValidationResult({
        tested: true,
        valid: false,
        count: 0,
        errors: ['Import text cannot be empty.']
      });
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.schemaVersion !== LOCAL_REVIEW_STORE_SCHEMA_VERSION) {
        setImportValidationResult({
          tested: true,
          valid: false,
          count: 0,
          errors: [`Schema version mismatch: expected "${LOCAL_REVIEW_STORE_SCHEMA_VERSION}", received "${parsed.schemaVersion}".`]
        });
        return;
      }
      if (!Array.isArray(parsed.records)) {
        setImportValidationResult({
          tested: true,
          valid: false,
          count: 0,
          errors: ['Root "records" field must be an array.']
        });
        return;
      }

      setImportValidationResult({
        tested: true,
        valid: true,
        count: parsed.records.length,
        errors: []
      });
    } catch (err: any) {
      setImportValidationResult({
        tested: true,
        valid: false,
        count: 0,
        errors: [`JSON syntax error: ${err.message}`]
      });
    }
  };

  // Confirm Import
  const handleConfirmImport = () => {
    const engine = TeacherCalibrationEngine.getInstance();
    const res = engine.importReviewsJSON(importJsonText);
    if (res.success) {
      setReviews(engine.getAllReviewsMap());
      setShowImportModal(false);
      setImportJsonText('');
      setImportValidationResult(null);
    } else {
      setImportValidationResult({
        tested: true,
        valid: false,
        count: 0,
        errors: res.errors
      });
    }
  };

  // Confirm Reset Local Store
  const handleConfirmReset = () => {
    const engine = TeacherCalibrationEngine.getInstance();
    engine.clearAllReviews();
    setReviews({});
    setShowResetConfirmModal(false);
  };

  // Render Status Badge
  const renderStatusBadge = (status: CoverageReviewStatus, label: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>APPROVED</span>
          </span>
        );
      case 'REPRESENTATIVE_DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#102d52] text-brass-300 border border-brass-500/40">
            <Sparkles className="w-3 h-3 text-brass-400" />
            <span>REPRESENTATIVE / DRAFT</span>
          </span>
        );
      case 'NEEDS_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>NEEDS REVIEW</span>
          </span>
        );
      case 'GENERATION_ERROR':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
            <XCircle className="w-3 h-3 text-rose-400" />
            <span>GENERATION ERROR</span>
          </span>
        );
      case 'NO_COVERAGE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#06162f] text-slate-400 border border-[#2c4f75]/40">
            <AlertCircle className="w-3 h-3 text-slate-500" />
            <span>NO COVERAGE</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Top Banner & Local Store Notice */}
      <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brass-400" />
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Content Coverage &amp; Review Console
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-[#102d52] border border-brass-500/40 text-brass-300 rounded font-mono font-medium">
              {LOCAL_REVIEW_STORE_DISCLAIMER}
            </span>
            <span className="text-slate-400 font-mono">
              &bull; Schema Version: <strong className="text-slate-200">v{LOCAL_REVIEW_STORE_SCHEMA_VERSION}</strong>
            </span>
            <span className="text-slate-400 font-mono">
              &bull; Active Local Reviews: <strong className="text-slate-200">{Object.keys(reviews).length}</strong>
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            title="Export all local reviews as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            title="Import review decisions from JSON"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirmModal(true)}
            className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-mono font-semibold rounded-xl border border-rose-800/40 transition flex items-center gap-1.5"
            title="Reset Local Store"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset Store</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric KPIs (Dynamic & Separated) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Structural Coverage */}
        <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Structural Coverage</span>
            <ShieldCheck className="w-4 h-4 text-brass-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {coverageSummary.structuralCoveragePercent}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {coverageSummary.structuralCoverageCount} / {coverageSummary.totalSkills} skills with family &amp; template
          </div>
        </div>

        {/* Review Coverage */}
        <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Review Coverage</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {coverageSummary.reviewCoveragePercent}%
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {coverageSummary.reviewCoverageCount} / {coverageSummary.totalSkills} approved skills
          </div>
        </div>

        {/* Draft Backlog */}
        <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Draft Backlog</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {coverageSummary.draftBacklogCount}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Representative / draft items awaiting review
          </div>
        </div>

        {/* Generation Error Count */}
        <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-4 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Generation Errors</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">
            {coverageSummary.generationErrorCount}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Active generation failures recorded
          </div>
        </div>
      </div>

      {/* Course Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coverageSummary.courses.map(course => (
          <div
            key={course.courseId}
            onClick={() => setSelectedCourseId(selectedCourseId === course.courseId ? 'ALL' : course.courseId)}
            className={`p-4 rounded-xl border transition cursor-pointer space-y-3 ${
              selectedCourseId === course.courseId
                ? 'bg-[#102d52] border-brass-500/80 shadow-lg shadow-brass-500/10'
                : 'bg-[#0a2344]/60 border-[#2c4f75]/35 hover:border-[#2c4f75]/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-brass-400 bg-[#06162f] border border-[#2c4f75]/40 px-2 py-0.5 rounded">
                  {course.courseCode}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">{course.courseName}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {course.totalTopics} Topics &bull; {course.totalSkills} Skills
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Structural: {course.structuralCoveragePercent}%</span>
                <span>Reviewed: {course.reviewCoveragePercent}%</span>
              </div>
              <div className="w-full h-2 bg-[#06162f] border border-[#2c4f75]/30 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${course.reviewCoveragePercent}%` }}
                  className="bg-emerald-500 h-full"
                  title={`Reviewed: ${course.reviewCoveragePercent}%`}
                />
                <div
                  style={{ width: `${Math.max(0, course.structuralCoveragePercent - course.reviewCoveragePercent)}%` }}
                  className="bg-brass-500/80 h-full"
                  title={`Representative / Draft: ${course.structuralCoveragePercent - course.reviewCoveragePercent}%`}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                App: {course.reviewCoverageCount}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#102d52] text-brass-300 border border-brass-500/40">
                Draft: {course.draftBacklogCount}
              </span>
              {course.generationErrorCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/40">
                  Err: {course.generationErrorCount}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Attribute Filter Toolbar */}
      <div className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-[#2c4f75]/30 pb-2">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-brass-400">
            <Filter className="w-3.5 h-3.5" /> Multi-Attribute Filters
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedCourseId('ALL');
              setSelectedUnitId('ALL');
              setSelectedTopicId('ALL');
              setSelectedStatus('ALL');
              setSelectedEvidenceType('ALL');
              setSelectedDifficulty('ALL');
              setSelectedFormat('ALL');
              setSearchQuery('');
            }}
            className="text-slate-400 hover:text-white transition underline"
          >
            Reset All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs font-mono">
          {/* Course Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase">Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedUnitId('ALL');
                setSelectedTopicId('ALL');
              }}
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brass-500 focus:outline-none"
            >
              <option value="ALL">All Courses ({coverageSummary.totalCourses})</option>
              {allCourses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>

          {/* Unit Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase">Unit</label>
            <select
              value={selectedUnitId}
              onChange={(e) => {
                setSelectedUnitId(e.target.value);
                setSelectedTopicId('ALL');
              }}
              disabled={selectedCourseId === 'ALL'}
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brass-500 focus:outline-none disabled:opacity-50"
            >
              <option value="ALL">All Units</option>
              {availableUnits.map(u => (
                <option key={u.id} value={u.id}>
                  {formatUnitPeriodName(u)}: {u.normalizedName || u.officialName}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase">Topic</label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brass-500 focus:outline-none"
            >
              <option value="ALL">All Topics</option>
              {availableTopics.map(t => (
                <option key={t.id} value={t.id}>
                  {t.normalizedName || t.officialName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brass-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REPRESENTATIVE_DRAFT">REPRESENTATIVE / DRAFT</option>
              <option value="NEEDS_REVIEW">NEEDS REVIEW</option>
              <option value="NO_COVERAGE">NO COVERAGE</option>
              <option value="GENERATION_ERROR">GENERATION ERROR</option>
            </select>
          </div>

          {/* Evidence Type */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase">Evidence</label>
            <select
              value={selectedEvidenceType}
              onChange={(e) => setSelectedEvidenceType(e.target.value)}
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brass-500 focus:outline-none"
            >
              <option value="ALL">All Evidence</option>
              <option value="MCQ_RECOGNITION">MCQ Recognition</option>
              <option value="DIRECT_CALCULATION">Direct Calculation</option>
              <option value="SYMBOLIC_DERIVATION">Symbolic Derivation</option>
              <option value="WORD_PROBLEM">Word Problem</option>
              <option value="ERROR_ANALYSIS">Error Analysis</option>
              <option value="EXPLANATION">Explanation</option>
              <option value="INTERPRETATION">Interpretation</option>
              <option value="MULTI_STEP_SOLUTION">Multi-Step Solution</option>
              <option value="GRAPHICAL_ANALYSIS">Graphical Analysis</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brass-500 focus:outline-none"
            >
              <option value="ALL">All Levels</option>
              <option value="1">Level 1 (Foundational)</option>
              <option value="2">Level 2 (Standard)</option>
              <option value="3">Level 3 (Intermediate)</option>
              <option value="4">Level 4 (Advanced)</option>
              <option value="5">Level 5 (Mastery)</option>
            </select>
          </div>

          {/* Format Filter */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase">Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brass-500 focus:outline-none"
            >
              <option value="ALL">All Formats</option>
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="NUMERIC_INPUT">Numeric Input</option>
              <option value="FREE_RESPONSE">Free Response</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name, ID, or keyword..."
            className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 text-xs rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-brass-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Hierarchical Drill-Down Explorer */}
      <div className="space-y-4">
        {coverageSummary.courses
          .filter(c => selectedCourseId === 'ALL' || c.courseId === selectedCourseId)
          .map(course => {
            const isCourseExpanded = expandedCourses[course.courseId] ?? false;

            return (
              <div key={course.courseId} className="bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl overflow-hidden shadow-md">
                {/* Course Header Row */}
                <div
                  onClick={() => toggleCourseExpand(course.courseId)}
                  className="p-4 bg-[#06162f]/60 hover:bg-[#06162f] cursor-pointer flex items-center justify-between border-b border-[#2c4f75]/30 transition"
                >
                  <div className="flex items-center gap-3">
                    {isCourseExpanded ? (
                      <ChevronDown className="w-4 h-4 text-brass-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <span className="text-xs font-mono font-bold text-brass-400 bg-[#102d52] border border-brass-500/40 px-2 py-0.5 rounded mr-2">
                        {course.courseCode}
                      </span>
                      <span className="font-bold text-white text-sm">{course.courseName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span>{course.structuralCoveragePercent}% Structural</span>
                    <span>&bull;</span>
                    <span className="text-emerald-400">{course.reviewCoveragePercent}% Reviewed</span>
                    <span>&bull;</span>
                    <span>{course.totalTopics} Topics</span>
                  </div>
                </div>

                {/* Course Topics Accordion */}
                {isCourseExpanded && (
                  <div className="p-4 space-y-3">
                    {course.topics
                      .filter(t => {
                        if (selectedUnitId !== 'ALL' && t.parentUnitId !== selectedUnitId) return false;
                        if (selectedTopicId !== 'ALL' && t.topicId !== selectedTopicId) return false;
                        return true;
                      })
                      .map(topic => {
                        const isTopicExpanded = expandedTopics[topic.topicId] ?? true;

                        // Filter skills within topic
                        const filteredSkills = topic.skills.filter(skill => {
                          if (selectedStatus !== 'ALL' && skill.status !== selectedStatus) return false;
                          if (selectedEvidenceType !== 'ALL' && !skill.evidenceTypes.includes(selectedEvidenceType as any)) return false;
                          if (selectedDifficulty !== 'ALL') {
                            const diffNum = Number(selectedDifficulty);
                            if (diffNum < skill.difficultyRange[0] || diffNum > skill.difficultyRange[1]) return false;
                          }
                          if (selectedFormat !== 'ALL' && !skill.supportedFormats.includes(selectedFormat as any)) return false;
                          if (searchQuery.trim()) {
                            const q = searchQuery.toLowerCase();
                            const matchName = skill.canonicalName.toLowerCase().includes(q);
                            const matchId = skill.skillId.toLowerCase().includes(q);
                            if (!matchName && !matchId) return false;
                          }
                          return true;
                        });

                        if (filteredSkills.length === 0 && (selectedStatus !== 'ALL' || searchQuery.trim())) {
                          return null;
                        }

                        return (
                          <div key={topic.topicId} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40">
                            {/* Topic Header */}
                            <div
                              onClick={() => toggleTopicExpand(topic.topicId)}
                              className="px-3 py-2.5 bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer flex items-center justify-between border-b border-slate-800/60"
                            >
                              <div className="flex items-center gap-2">
                                {isTopicExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                )}
                                <span className="font-semibold text-xs text-slate-200">
                                  {topic.topicName}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  ({topic.topicId})
                                </span>
                              </div>

                              <div className="text-[11px] font-mono text-slate-400">
                                <span>{filteredSkills.length} of {topic.totalSkills} skills</span>
                              </div>
                            </div>

                            {/* Skills Table */}
                            {isTopicExpanded && (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs font-mono">
                                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase border-b border-slate-800/80">
                                    <tr>
                                      <th className="px-3 py-2">Skill / ID</th>
                                      <th className="px-3 py-2">Status</th>
                                      <th className="px-3 py-2">Evidence</th>
                                      <th className="px-3 py-2">Formats</th>
                                      <th className="px-3 py-2">Diff</th>
                                      <th className="px-3 py-2">Family &amp; Template</th>
                                      <th className="px-3 py-2 text-right">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                                    {filteredSkills.map(skill => (
                                      <tr key={skill.skillId} className="hover:bg-slate-900/40 transition">
                                        <td className="px-3 py-2.5">
                                          <div className="font-bold text-slate-200">{skill.canonicalName}</div>
                                          <div className="text-[10px] text-slate-500">{skill.skillId}</div>
                                        </td>
                                        <td className="px-3 py-2.5">
                                          {renderStatusBadge(skill.status, skill.statusLabel)}
                                        </td>
                                        <td className="px-3 py-2.5 text-[11px] text-slate-400">
                                          {skill.evidenceTypes.slice(0, 2).join(', ')}
                                        </td>
                                        <td className="px-3 py-2.5 text-[11px] text-slate-400">
                                          {skill.supportedFormats.join(', ')}
                                        </td>
                                        <td className="px-3 py-2.5 text-[11px] text-slate-400">
                                          {skill.difficultyRange[0]}-{skill.difficultyRange[1]}
                                        </td>
                                        <td className="px-3 py-2.5">
                                          <div className="text-[11px] text-brass-400 truncate max-w-[140px]" title={skill.familyId || 'None'}>
                                            {skill.familyId || '—'}
                                          </div>
                                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]" title={skill.templateId || 'None'}>
                                            {skill.templateId || '—'}
                                          </div>
                                        </td>
                                        <td className="px-3 py-2.5 text-right">
                                          <button
                                            type="button"
                                            onClick={() => handleInspectSkill(skill)}
                                            className="px-2.5 py-1 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-200 border border-[#2c4f75]/40 rounded-lg text-[11px] font-semibold transition inline-flex items-center gap-1"
                                          >
                                            <Eye className="w-3 h-3 text-brass-400" />
                                            <span>Inspect / Review</span>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
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

      {/* Problem Detail & Review Drawer Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-[#0a2344] border border-[#2c4f75]/45 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 bg-[#06162f] border-b border-[#2c4f75]/30 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brass-400" />
                  <h2 className="text-sm font-bold text-white tracking-tight">
                    Content Lineage &amp; Review Inspector
                  </h2>
                </div>
                {/* Unambiguous Lineage Chips */}
                <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
                  <span className="bg-[#102d52] text-slate-300 px-1.5 py-0.5 rounded border border-[#2c4f75]/40">
                    Course: {selectedSkill.parentCourseId}
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="bg-[#102d52] text-slate-300 px-1.5 py-0.5 rounded border border-[#2c4f75]/40">
                    Topic: {selectedSkill.parentTopicId}
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="bg-[#102d52] text-slate-300 px-1.5 py-0.5 rounded border border-[#2c4f75]/40">
                    Skill: {selectedSkill.skillId}
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="bg-[#102d52] text-brass-300 px-1.5 py-0.5 rounded border border-brass-500/40">
                    Family: {selectedSkill.familyId || 'NO_FAMILY'}
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  <span className="bg-[#102d52] text-brass-300 px-1.5 py-0.5 rounded border border-brass-500/40">
                    Template: {selectedSkill.templateId || 'NO_TEMPLATE'}
                  </span>
                  <span className="text-slate-600">&rarr;</span>
                  {renderStatusBadge(selectedSkill.status, selectedSkill.statusLabel)}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Actionable Empty State Notice if NO_COVERAGE */}
              {selectedSkill.status === 'NO_COVERAGE' && !generatedCandidate && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Actionable Empty State — Missing Hand-Authored Coverage</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    This skill currently lacks a hand-authored problem family. The system uses coverage-safe fallback content.
                    You can generate a representative candidate blueprint now to review and test mathematical and pedagogical alignment.
                  </p>
                </div>
              )}

              {/* Explicit Candidate Generation Section */}
              <div className="p-4 bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 font-mono">
                      Candidate Problem Blueprint
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Sample problem candidate generation is executed on demand.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={drawerDifficulty}
                      onChange={(e) => setDrawerDifficulty(Number(e.target.value))}
                      className="bg-[#0a2344] border border-[#2c4f75]/40 text-slate-200 text-xs rounded-lg px-2 py-1 font-mono"
                    >
                      <option value={1}>Diff 1 (Foundational)</option>
                      <option value={2}>Diff 2 (Standard)</option>
                      <option value={3}>Diff 3 (Intermediate)</option>
                      <option value={4}>Diff 4 (Advanced)</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleGenerateCandidate(selectedSkill.skillId, drawerDifficulty)}
                      disabled={isGenerating}
                      className="px-3 py-1.5 bg-brass-500 hover:bg-brass-400 text-[#061b3a] rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md shadow-brass-500/20 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>{generatedCandidate ? 'Regenerate Candidate' : 'Generate Sample Candidate'}</span>
                    </button>
                  </div>
                </div>

                {/* Render Candidate Problem Statement & Math */}
                {generatedCandidate ? (
                  <div className="space-y-4 pt-2 border-t border-[#2c4f75]/30">
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-brass-400 uppercase font-bold">
                        Problem Statement &bull; Difficulty Level {generatedCandidate.dna.difficultyVector.overall}
                      </div>
                      <div className="text-slate-200 text-sm">
                        <RichContentRenderer content={generatedCandidate.statement.promptText} />
                      </div>
                      <div className="p-3 bg-[#0a2344]/50 border border-[#2c4f75]/30 rounded-lg text-center overflow-x-auto">
                        <MathRenderer latex={generatedCandidate.statement.expressionLatex} displayMode={true} />
                      </div>
                    </div>

                    {/* Canonical Target Answer */}
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-emerald-400 uppercase font-bold">
                        Canonical Target Answer
                      </div>
                      <div className="p-3 bg-[#0a2344]/50 border border-emerald-900/40 rounded-lg text-emerald-300 font-mono text-center overflow-x-auto">
                        <MathRenderer latex={generatedCandidate.solution.canonicalAnswerLatex} displayMode={true} />
                      </div>
                    </div>

                    {/* Reasoning Trace Steps */}
                    {generatedCandidate.solution.reasoningTrace?.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                          Pedagogical Reasoning Trace
                        </div>
                        <div className="space-y-2">
                          {generatedCandidate.solution.reasoningTrace.map(step => (
                            <div key={step.stepIndex} className="p-2.5 rounded-lg bg-[#0a2344]/40 border border-[#2c4f75]/25 space-y-1">
                              <div className="font-semibold text-slate-200 text-[11px]">
                                Step {step.stepIndex} ({step.phase}): {step.actionDescription}
                              </div>
                              {step.intermediateExpressionLatex && (
                                <div className="text-brass-300 font-mono text-[11px]">
                                  <MathRenderer latex={step.intermediateExpressionLatex} />
                                </div>
                              )}
                              <div className="text-[10px] text-slate-400">
                                {step.pedagogicalRationale}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hints Preview */}
                    {generatedCandidate.hints?.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                          Scaffolded Hints ({generatedCandidate.hints.length} levels)
                        </div>
                        <div className="space-y-1 text-[11px]">
                          {generatedCandidate.hints.map(h => (
                            <div key={h.level} className="p-2 bg-[#0a2344]/40 rounded border border-[#2c4f75]/25 flex items-start gap-2">
                              <span className="font-bold text-brass-400 shrink-0 font-mono">L{h.level}:</span>
                              <span className="text-slate-300">{h.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 font-mono text-xs">
                    Click &quot;Generate Sample Candidate&quot; above to inspect generated expressions and solutions.
                  </div>
                )}
              </div>

              {/* Review Decision Form */}
              <div className="p-4 bg-[#06162f]/80 border border-[#2c4f75]/30 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-2">
                  <h3 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-brass-400" />
                    Teacher Review Decision (Local Store Overlay)
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Active Overlay: <strong className="text-brass-300">{selectedSkill.activeReview?.decision || 'None'}</strong>
                  </span>
                </div>

                {actionSuccessMessage && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{actionSuccessMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Reviewer Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Difficulty Suitability Override</label>
                    <select
                      value={difficultyOverride ?? ''}
                      onChange={(e) => setDifficultyOverride(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono"
                    >
                      <option value="">No Override (Keep Template Level)</option>
                      <option value="1">Level 1 (Foundational)</option>
                      <option value="2">Level 2 (Standard)</option>
                      <option value="3">Level 3 (Intermediate)</option>
                      <option value="4">Level 4 (Advanced)</option>
                      <option value="5">Level 5 (Mastery)</option>
                    </select>
                  </div>
                </div>

                {/* Quality Ratings (6 Dimensions, 1-5 Scale) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Pedagogical Quality Ratings (1-5 Scale)
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      1=Deficient &bull; 3=Acceptable &bull; 5=Exemplary
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {[
                      { key: 'mathematicalCorrectness', label: 'Math Correctness' },
                      { key: 'skillAlignment', label: 'Skill Alignment' },
                      { key: 'clarity', label: 'Prompt Clarity' },
                      { key: 'difficultySuitability', label: 'Difficulty Fit' },
                      { key: 'educationalUsefulness', label: 'Edu Usefulness' },
                      { key: 'diversityDistinctiveness', label: 'Distinctiveness' }
                    ].map(({ key, label }) => (
                      <div key={key} className="bg-[#0a2344]/40 border border-[#2c4f75]/30 rounded-lg p-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                          <span>{label}</span>
                          <span className="font-bold text-brass-400 font-mono">{(ratings as any)[key]} / 5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setRatings(prev => ({ ...prev, [key]: score as 1 | 2 | 3 | 4 | 5 }))}
                              className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition ${
                                (ratings as any)[key] === score
                                  ? 'bg-brass-500 text-[#061b3a] font-bold shadow-sm'
                                  : 'bg-[#06162f] text-slate-400 hover:bg-[#102d52] hover:text-white'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rejection / Flagging Reasons Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Rejection &amp; Flag Reasons (Required if Rejecting)
                    </label>
                    {selectedRejectionReasons.length > 0 && (
                      <span className="text-[10px] font-mono text-rose-400">
                        {selectedRejectionReasons.length} selected
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'MATHEMATICALLY_WRONG', label: 'Mathematically Wrong' },
                      { id: 'SKILL_MISMATCH', label: 'Skill Mismatch' },
                      { id: 'TOO_EASY', label: 'Too Easy' },
                      { id: 'TOO_HARD', label: 'Too Hard' },
                      { id: 'REPETITIVE', label: 'Repetitive' },
                      { id: 'AMBIGUOUS', label: 'Ambiguous' },
                      { id: 'POOR_WORDING', label: 'Poor Wording' },
                      { id: 'UNREALISTIC_CONTEXT', label: 'Unrealistic Context' },
                      { id: 'BAD_DISTRACTOR', label: 'Bad Distractor' },
                      { id: 'WEAK_PEDAGOGY', label: 'Weak Pedagogy' },
                      { id: 'UNNECESSARY_COMPLEXITY', label: 'Unnecessary Complexity' }
                    ].map(({ id, label }) => {
                      const isSelected = selectedRejectionReasons.includes(id as TeacherRejectionReason);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleRejectionReason(id as TeacherRejectionReason)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-medium border transition ${
                            isSelected
                              ? 'bg-rose-950 border-rose-600 text-rose-200'
                              : 'bg-[#0a2344]/50 border-[#2c4f75]/30 text-slate-400 hover:border-[#2c4f75]/60 hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ ' : ''}{label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Feedback &amp; Editorial Notes</label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Enter teacher notes, suggestions, or rationale for this decision..."
                    className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 text-xs rounded-lg p-3 font-mono focus:ring-2 focus:ring-brass-500 focus:outline-none"
                  />
                </div>

                {/* Explicit local-session action checkbox */}
                <div className="p-3 bg-[#0a2344]/50 border border-[#2c4f75]/30 rounded-lg flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="applyToSessionCheck"
                    disabled={!canSubmitReview}
                    checked={applyToSessionProblemBank && canSubmitReview}
                    onChange={(e) => setApplyToSessionProblemBank(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-brass-500 focus:ring-brass-500 bg-[#06162f] disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <label
                    htmlFor="applyToSessionCheck"
                    className={`text-xs leading-relaxed ${canSubmitReview ? 'text-slate-300 cursor-pointer' : 'text-slate-500 cursor-not-allowed'}`}
                  >
                    <strong className={canSubmitReview ? 'text-brass-300' : 'text-slate-400'}>
                      Apply to Current Session ProblemBank
                    </strong> (Local Session Action)
                    <div className="text-[10px] text-slate-500">
                      {!canSubmitReview
                        ? 'Disabled until a real candidate problem is generated or selected.'
                        : 'When unchecked, decisions remain strictly in the local browser review store overlay without altering runtime student problem lifecycles.'}
                    </div>
                  </label>
                </div>

                {/* Decision Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#2c4f75]/30">
                  <button
                    type="button"
                    disabled={!canSubmitReview}
                    onClick={() => handleSubmitReviewDecision('APPROVE')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Problem</span>
                  </button>

                  <button
                    type="button"
                    disabled={!canSubmitReview}
                    onClick={() => handleSubmitReviewDecision('FLAG')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-600/20"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Flag for Editing</span>
                  </button>

                  <button
                    type="button"
                    disabled={!canSubmitReview}
                    onClick={() => handleSubmitReviewDecision('REJECT')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/20"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Problem</span>
                  </button>

                  {!canSubmitReview && (
                    <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Generate candidate problem above before reviewing
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a2344] border border-[#2c4f75]/45 rounded-xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2c4f75]/30 pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Upload className="w-4 h-4 text-brass-400" />
                <span>Import Review Store JSON</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportJsonText('');
                  setImportValidationResult(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Paste the exported JSON data below. The schema must strictly match version{' '}
              <strong className="text-brass-300 font-mono">v{LOCAL_REVIEW_STORE_SCHEMA_VERSION}</strong>.
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => {
                setImportJsonText(e.target.value);
                setImportValidationResult(null);
              }}
              placeholder='Paste {"schemaVersion": "1.0.0", "records": [...]} here...'
              className="w-full bg-[#06162f] border border-[#2c4f75]/40 text-slate-200 text-xs font-mono rounded-lg p-3 focus:ring-2 focus:ring-brass-500 focus:outline-none"
            />

            {/* Validation Feedback */}
            {importValidationResult?.tested && (
              <div
                className={`p-3 rounded-lg border text-xs font-mono space-y-1 ${
                  importValidationResult.valid
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {importValidationResult.valid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>
                    {importValidationResult.valid
                      ? `Validation Passed: ${importValidationResult.count} records verified.`
                      : 'Validation Failed (Fail-Closed: 0 records modified)'}
                  </span>
                </div>
                {importValidationResult.errors.length > 0 && (
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 pt-1">
                    {importValidationResult.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2c4f75]/30">
              <button
                type="button"
                onClick={handleValidateImport}
                className="px-3 py-1.5 bg-[#102d52] hover:bg-[#1d3b5e] text-slate-200 text-xs font-mono font-semibold rounded-lg border border-[#2c4f75]/40"
              >
                Validate JSON
              </button>

              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={!importValidationResult?.valid}
                className="px-4 py-1.5 bg-brass-500 hover:bg-brass-400 disabled:opacity-50 text-[#061b3a] text-xs font-mono font-bold rounded-lg transition shadow-sm"
              >
                Confirm &amp; Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Local Store Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Reset Local Review Store</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete all <strong className="text-white">{Object.keys(reviews).length}</strong> locally stored review records from browser storage? This action is permanent and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold rounded-xl transition shadow-md shadow-rose-600/20"
              >
                Yes, Reset Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
