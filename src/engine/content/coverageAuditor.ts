/**
 * Pure, Read-Only Curriculum Content Coverage Auditor
 * Engineering Practice Engine — Phase 4 Six-Course Architecture
 *
 * Implements strict separation of concerns:
 * - ProblemFamily status ('ACTIVE' | 'DRAFT' | 'REPRESENTATIVE_DRAFT')
 * - ProblemLifecycleStatus ('DRAFT' | 'VALIDATING' | ... | 'APPROVED' | 'REJECTED')
 * - Derived UI-only CoverageReviewStatus
 *
 * Computes separate metrics:
 * - Structural Coverage: skills with at least one valid family and template
 * - Review Coverage: skills with at least one approved problem
 * - Draft Backlog: items in draft / representative status awaiting formal review
 * - Generation Error Count
 *
 * Pure and read-only by default: does NOT generate or store problems during audits.
 */

import { CurriculumRegistry } from '../curriculum/registry';
import { ContentRegistry } from './registry';
import { PROBLEM_FAMILIES_REGISTRY } from './problemFamilies';
import { PROBLEM_TEMPLATES_REGISTRY } from './problemTemplates';
import {
  AssessmentEvidenceTypeId,
  QuestionFormat,
  ProblemGenerationResult,
  ValidatedProblem
} from './types';
import type { EvidenceType as CurriculumEvidenceType } from '../curriculum/types';
import type { TeacherReviewRecord } from './calibration';
import { ContentGenerator } from './generator';

export type CoverageReviewStatus =
  | 'APPROVED'
  | 'REPRESENTATIVE_DRAFT'
  | 'NEEDS_REVIEW'
  | 'NO_COVERAGE'
  | 'GENERATION_ERROR';

export interface CoverageAuditorSnapshot {
  reviewsMap?: Record<string, TeacherReviewRecord>;
  generationErrors?: Record<string, string>;
  canonicalApprovedSkillIds?: Set<string>;
}

export interface SkillCoverageRecord {
  skillId: string;
  canonicalName: string;
  parentCourseId: string;
  parentTopicId: string;
  parentSubtopicIds: string[];
  evidenceTypes: (AssessmentEvidenceTypeId | CurriculumEvidenceType)[];
  supportedFormats: QuestionFormat[];
  difficultyRange: [number, number];
  hasFamily: boolean;
  hasTemplate: boolean;
  familyId?: string;
  templateId?: string;
  familyName?: string;
  familyStatus?: 'ACTIVE' | 'DRAFT' | 'REPRESENTATIVE_DRAFT';
  hasStructuralCoverage: boolean;
  status: CoverageReviewStatus;
  statusLabel: string;
  activeReview?: TeacherReviewRecord;
  generationError?: string;
  canonicalApprovedCount: number;
}

export interface TopicCoverageMetrics {
  topicId: string;
  topicName: string;
  topicCode?: string;
  parentCourseId: string;
  parentUnitId?: string;
  totalSkills: number;
  structuralCoverageCount: number;
  structuralCoveragePercent: number;
  reviewCoverageCount: number;
  reviewCoveragePercent: number;
  draftBacklogCount: number;
  skills: SkillCoverageRecord[];
}

export interface UnitCoverageMetrics {
  unitId: string;
  unitTitle: string;
  unitNumber: number;
  courseId: string;
  totalSkills: number;
  structuralCoverageCount: number;
  structuralCoveragePercent: number;
  reviewCoverageCount: number;
  reviewCoveragePercent: number;
  draftBacklogCount: number;
  topics: TopicCoverageMetrics[];
}

export interface CourseCoverageMetrics {
  courseId: string;
  courseCode: string;
  courseName: string;
  totalUnits: number;
  totalTopics: number;
  totalSkills: number;
  structuralCoverageCount: number;
  structuralCoveragePercent: number;
  reviewCoverageCount: number;
  reviewCoveragePercent: number;
  draftBacklogCount: number;
  generationErrorCount: number;
  units: UnitCoverageMetrics[];
  topics: TopicCoverageMetrics[];
}

export interface CurriculumCoverageSummary {
  totalCourses: number;
  totalUnits: number;
  totalTopics: number;
  totalSkills: number;
  structuralCoverageCount: number;
  structuralCoveragePercent: number;
  reviewCoverageCount: number;
  reviewCoveragePercent: number;
  draftBacklogCount: number;
  generationErrorCount: number;
  courses: CourseCoverageMetrics[];
}

export class CoverageAuditor {
  /**
   * Pure, read-only calculation of content coverage across all courses, units, topics, and skills.
   * Does NOT generate or mutate any content during evaluation.
   */
  public static calculateCoverage(
    snapshotOrReviews?: CoverageAuditorSnapshot | Record<string, TeacherReviewRecord>,
    generationErrors?: Record<string, string>
  ): CurriculumCoverageSummary {
    const curr = CurriculumRegistry.getInstance();
    const content = ContentRegistry.getInstance();

    const allCourses = curr.getAllCourses();
    const allTopics = curr.getAllTopics();
    const allSkills = curr.getAllSkills();

    let reviewsMap: Record<string, TeacherReviewRecord> = {};
    let errorsMap: Record<string, string> = {};
    let approvedSkillIds = new Set<string>();

    if (
      snapshotOrReviews &&
      ('reviewsMap' in snapshotOrReviews || 'canonicalApprovedSkillIds' in snapshotOrReviews || 'generationErrors' in snapshotOrReviews)
    ) {
      const snap = snapshotOrReviews as CoverageAuditorSnapshot;
      reviewsMap = snap.reviewsMap || {};
      errorsMap = snap.generationErrors || {};
      approvedSkillIds = snap.canonicalApprovedSkillIds || new Set<string>();
    } else if (snapshotOrReviews && typeof snapshotOrReviews === 'object') {
      reviewsMap = snapshotOrReviews as Record<string, TeacherReviewRecord>;
      errorsMap = generationErrors || {};
    }

    let globalStructuralCount = 0;
    let globalReviewCount = 0;
    let globalDraftBacklog = 0;
    let globalErrorCount = 0;
    let globalUnitsCount = 0;

    const courseSummaries: CourseCoverageMetrics[] = allCourses.map(course => {
      const units = curr.getUnitsByCourse(course.id);
      const courseTopics = curr.getTopicsByCourse(course.id);
      globalUnitsCount += units.length;

      let courseStructuralCount = 0;
      let courseReviewCount = 0;
      let courseDraftBacklog = 0;
      let courseErrorCount = 0;

      // Group topics and skills
      const topicSummaries: TopicCoverageMetrics[] = courseTopics.map(topic => {
        const topicSkills = curr.getSkillsByTopic(topic.id);

        let topicStructuralCount = 0;
        let topicReviewCount = 0;
        let topicDraftBacklog = 0;

        const skillRecords: SkillCoverageRecord[] = topicSkills.map(skill => {
          const families = content.getFamiliesBySkill(skill.id);
          const primaryFamily = families[0];
          const hasFamily = families.length > 0;

          // Check for valid template
          let hasTemplate = false;
          let activeTemplateId: string | undefined = undefined;
          if (hasFamily) {
            for (const fam of families) {
              const tmplId = fam.templateIds?.find(t => Boolean(PROBLEM_TEMPLATES_REGISTRY[t]));
              if (tmplId) {
                hasTemplate = true;
                activeTemplateId = tmplId;
                break;
              }
            }
          }

          const hasStructuralCoverage = hasFamily && hasTemplate;
          if (hasStructuralCoverage) {
            topicStructuralCount++;
          }

          const canonicalApprovedCount = approvedSkillIds.has(skill.id) ? 1 : 0;

          // Deterministic review aggregation: pick latest review by reviewedAt
          const matchingReviews = Object.values(reviewsMap)
            .filter(rev => rev.skillId === skill.id || rev.reviewTargetKey.includes(`::${skill.id}::`))
            .sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
          const activeReview = matchingReviews[0];

          // Check generation errors map
          const skillError = errorsMap[skill.id];

          const isFallbackItem =
            primaryFamily?.status === 'REPRESENTATIVE_DRAFT' ||
            skill.sourceType === 'SYSTEM_PROPOSED' ||
            skill.status === 'DRAFT';

          // Derive UI CoverageReviewStatus (separate status layer!)
          let status: CoverageReviewStatus = 'NO_COVERAGE';
          let statusLabel = 'No Coverage';

          if (skillError) {
            status = 'GENERATION_ERROR';
            statusLabel = 'Generation Error';
            courseErrorCount++;
            globalErrorCount++;
          } else if (activeReview) {
            // Explicit teacher review overlay takes precedence!
            if (activeReview.decision === 'APPROVE') {
              status = 'APPROVED';
              statusLabel = 'Approved';
              topicReviewCount++;
            } else if (activeReview.decision === 'REJECT') {
              status = 'NEEDS_REVIEW';
              statusLabel = 'Rejected / Needs Revision';
              topicDraftBacklog++;
            } else {
              status = 'NEEDS_REVIEW';
              statusLabel = 'Flagged for Edit';
              topicDraftBacklog++;
            }
          } else if (isFallbackItem) {
            // Representative / system-proposed fallback items must NEVER appear APPROVED
            // merely because ProblemBank auto-seeded them as approved. Only an explicit review
            // overlay marks a draft fallback item approved!
            status = 'REPRESENTATIVE_DRAFT';
            statusLabel = 'Representative / Draft';
            topicDraftBacklog++;
          } else if (canonicalApprovedCount > 0) {
            status = 'APPROVED';
            statusLabel = 'Approved';
            topicReviewCount++;
          } else if (hasStructuralCoverage) {
            status = 'NEEDS_REVIEW';
            statusLabel = 'Awaiting Teacher Review';
            topicDraftBacklog++;
          } else {
            status = 'NO_COVERAGE';
            statusLabel = 'No Coverage';
          }

          // Question formats derived strictly from family.supportedFormats
          const supportedFormats = primaryFamily?.supportedFormats || ['NUMERIC_INPUT'];
          const difficultyRange = primaryFamily?.difficultyRange || [1, 4];

          return {
            skillId: skill.id,
            canonicalName: skill.canonicalName,
            parentCourseId: skill.parentCourseId,
            parentTopicId: skill.parentTopicId,
            parentSubtopicIds: skill.parentSubtopicIds || [],
            evidenceTypes: (skill.evidenceTypes as AssessmentEvidenceTypeId[]) || ['DIRECT_CALCULATION'],
            supportedFormats,
            difficultyRange,
            hasFamily,
            hasTemplate,
            familyId: primaryFamily?.id,
            templateId: activeTemplateId || primaryFamily?.templateIds?.[0],
            familyName: primaryFamily?.name,
            familyStatus: primaryFamily?.status,
            hasStructuralCoverage,
            status,
            statusLabel,
            activeReview,
            generationError: skillError,
            canonicalApprovedCount
          };
        });

        const totalSkillsInTopic = skillRecords.length;
        const topicStructuralPct = totalSkillsInTopic > 0
          ? Math.round((topicStructuralCount / totalSkillsInTopic) * 100)
          : 0;
        const topicReviewPct = totalSkillsInTopic > 0
          ? Math.round((topicReviewCount / totalSkillsInTopic) * 100)
          : 0;

        courseStructuralCount += topicStructuralCount;
        courseReviewCount += topicReviewCount;
        courseDraftBacklog += topicDraftBacklog;

        return {
          topicId: topic.id,
          topicName: topic.normalizedName || topic.officialName,
          topicCode: topic.id,
          parentCourseId: topic.courseId,
          parentUnitId: topic.unitId,
          totalSkills: totalSkillsInTopic,
          structuralCoverageCount: topicStructuralCount,
          structuralCoveragePercent: topicStructuralPct,
          reviewCoverageCount: topicReviewCount,
          reviewCoveragePercent: topicReviewPct,
          draftBacklogCount: topicDraftBacklog,
          skills: skillRecords
        };
      });

      // Build unit summaries
      const unitSummaries: UnitCoverageMetrics[] = units.map(unit => {
        const unitTopics = topicSummaries.filter(t => t.parentUnitId === unit.id);
        const unitSkills = unitTopics.flatMap(t => t.skills);
        const totalUnitSkills = unitSkills.length;
        const unitStructuralCount = unitSkills.filter(s => s.hasStructuralCoverage).length;
        const unitReviewCount = unitSkills.filter(s => s.status === 'APPROVED').length;
        const unitDraftCount = unitSkills.filter(s => s.status === 'REPRESENTATIVE_DRAFT' || s.status === 'NEEDS_REVIEW').length;

        return {
          unitId: unit.id,
          unitTitle: unit.normalizedName || unit.officialName,
          unitNumber: unit.sequence,
          courseId: unit.courseId,
          totalSkills: totalUnitSkills,
          structuralCoverageCount: unitStructuralCount,
          structuralCoveragePercent: totalUnitSkills > 0 ? Math.round((unitStructuralCount / totalUnitSkills) * 100) : 0,
          reviewCoverageCount: unitReviewCount,
          reviewCoveragePercent: totalUnitSkills > 0 ? Math.round((unitReviewCount / totalUnitSkills) * 100) : 0,
          draftBacklogCount: unitDraftCount,
          topics: unitTopics
        };
      });

      const totalCourseSkills = topicSummaries.reduce((acc, t) => acc + t.totalSkills, 0);
      const courseStructuralPct = totalCourseSkills > 0
        ? Math.round((courseStructuralCount / totalCourseSkills) * 100)
        : 0;
      const courseReviewPct = totalCourseSkills > 0
        ? Math.round((courseReviewCount / totalCourseSkills) * 100)
        : 0;

      globalStructuralCount += courseStructuralCount;
      globalReviewCount += courseReviewCount;
      globalDraftBacklog += courseDraftBacklog;

      return {
        courseId: course.id,
        courseCode: course.code,
        courseName: course.title || course.officialTitle,
        totalUnits: units.length,
        totalTopics: courseTopics.length,
        totalSkills: totalCourseSkills,
        structuralCoverageCount: courseStructuralCount,
        structuralCoveragePercent: courseStructuralPct,
        reviewCoverageCount: courseReviewCount,
        reviewCoveragePercent: courseReviewPct,
        draftBacklogCount: courseDraftBacklog,
        generationErrorCount: courseErrorCount,
        units: unitSummaries,
        topics: topicSummaries
      };
    });

    const totalSkills = allSkills.length;
    const globalStructuralPct = totalSkills > 0 ? Math.round((globalStructuralCount / totalSkills) * 100) : 0;
    const globalReviewPct = totalSkills > 0 ? Math.round((globalReviewCount / totalSkills) * 100) : 0;

    return {
      totalCourses: allCourses.length,
      totalUnits: globalUnitsCount,
      totalTopics: allTopics.length,
      totalSkills,
      structuralCoverageCount: globalStructuralCount,
      structuralCoveragePercent: globalStructuralPct,
      reviewCoverageCount: globalReviewCount,
      reviewCoveragePercent: globalReviewPct,
      draftBacklogCount: globalDraftBacklog,
      generationErrorCount: globalErrorCount,
      courses: courseSummaries
    };
  }

  /**
   * Explicit Candidate Problem Generation for a Skill.
   * Invoked ONLY upon explicit user interaction (e.g. clicking "Generate Sample Candidate").
   */
  public static generateCandidateForSkill(
    skillId: string,
    difficulty = 2
  ): ProblemGenerationResult {
    const skill = CurriculumRegistry.getInstance().getSkillById(skillId);
    if (!skill) {
      return {
        success: false,
        rejectionReason: 'SKILL_MISMATCH',
        rejectionDetails: `Skill ID "${skillId}" not found in authoritative Curriculum Registry.`,
        attemptsCount: 0,
        generationLatencyMs: 0
      };
    }

    return ContentGenerator.generateForSkill({
      courseId: skill.parentCourseId,
      topicId: skill.parentTopicId,
      skillId: skill.id,
      difficulty
    });
  }
}
