/**
 * Content Architecture Registry Across All Six Courses
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import {
  ProblemFamily,
  ProblemTemplate,
  CourseContentReadiness,
  CourseScopeId,
  AssessmentEvidenceDefinition,
  ValidatedProblem
} from './types';
import { ASSESSMENT_EVIDENCE_REGISTRY, SIX_COURSE_SKILL_EVIDENCE_MAP } from './assessmentEvidence';
import { PROBLEM_FAMILIES_REGISTRY } from './problemFamilies';
import { PROBLEM_TEMPLATES_REGISTRY } from './problemTemplates';
import { ProblemBank } from './problemBank';
import { CurriculumRegistry } from '../curriculum/registry';

export class ContentRegistry {
  private static instance: ContentRegistry | null = null;

  private constructor() {}

  public static getInstance(): ContentRegistry {
    if (!ContentRegistry.instance) {
      ContentRegistry.instance = new ContentRegistry();
    }
    return ContentRegistry.instance;
  }

  /**
   * Retrieves all registered problem families across all courses.
   */
  public getAllFamilies(): ProblemFamily[] {
    return Object.values(PROBLEM_FAMILIES_REGISTRY);
  }

  /**
   * Retrieves all registered problem templates across all courses.
   */
  public getAllTemplates(): ProblemTemplate[] {
    return Object.values(PROBLEM_TEMPLATES_REGISTRY);
  }

  /**
   * Retrieves all registered problem families for a course.
   */
  public getFamiliesByCourse(courseId: string): ProblemFamily[] {
    return Object.values(PROBLEM_FAMILIES_REGISTRY).filter(f => f.courseId === courseId);
  }

  /**
   * Retrieves all problem families registered for a specific skill.
   */
  public getFamiliesBySkill(skillId: string): ProblemFamily[] {
    return Object.values(PROBLEM_FAMILIES_REGISTRY).filter(f => f.primarySkillId === skillId);
  }

  /**
   * Retrieves all templates registered for a problem family.
   */
  public getTemplatesByFamily(familyId: string): ProblemTemplate[] {
    return Object.values(PROBLEM_TEMPLATES_REGISTRY).filter(t => t.familyId === familyId);
  }

  /**
   * Retrieves assessment evidence mapping for a skill.
   */
  public getEvidenceBySkill(skillId: string): {
    primaryEvidence: AssessmentEvidenceDefinition;
    secondaryEvidence: AssessmentEvidenceDefinition[];
  } | null {
    const mapping = SIX_COURSE_SKILL_EVIDENCE_MAP[skillId];
    if (!mapping) return null;

    return {
      primaryEvidence: ASSESSMENT_EVIDENCE_REGISTRY[mapping.primaryEvidence],
      secondaryEvidence: mapping.secondaryEvidence.map(id => ASSESSMENT_EVIDENCE_REGISTRY[id]).filter(Boolean)
    };
  }

  /**
   * Retrieves problems from ProblemBank by course.
   */
  public getProblemsByCourse(courseId: string): ValidatedProblem[] {
    return ProblemBank.getInstance().getProblemsByCourse(courseId);
  }

  /**
   * Retrieves problems from ProblemBank by skill.
   */
  public getProblemsBySkill(skillId: string): ValidatedProblem[] {
    return ProblemBank.getInstance().getProblemsBySkill(skillId);
  }

  /**
   * Generates a Course Content Readiness Summary across all six authoritative courses.
   */
  public getCourseReadinessSummary(): CourseContentReadiness[] {
    const curr = CurriculumRegistry.getInstance();
    const bank = ProblemBank.getInstance();

    const courseMeta: Array<{ id: string; code: string; name: string }> = [
      { id: 'COURSE-GEN0101', code: 'GEN 0101', name: 'Mathematics for Engineers' },
      { id: 'COURSE-GEN0102', code: 'GEN 0102', name: 'Calculus 1' },
      { id: 'COURSE-GEN0107', code: 'GEN 0107', name: 'Differential Equations' },
      { id: 'COURSE-GEN0110', code: 'GEN 0110', name: 'Physics 2 for Engineers' },
      { id: 'COURSE-GEN0161', code: 'GEN 0161', name: 'Thermodynamics' },
      { id: 'COURSE-BSIE3219', code: 'BSIE 3219', name: 'IE Special Topics 1' }
    ];

    return courseMeta.map(c => {
      const course = curr.getCourseById(c.id);
      const topics = curr.getAllTopics().filter(t => t.courseId === c.id);
      const skills = curr.getAllSkills().filter(s => s.parentCourseId === c.id);
      const families = this.getFamiliesByCourse(c.id);
      const templateCount = families.reduce((acc, f) => acc + f.templateIds.length, 0);
      const bankProblems = bank.getProblemsByCourse(c.id);
      const approvedCount = bankProblems.filter(p => p.lifecycleStatus === 'APPROVED').length;

      let status: CourseContentReadiness['status'] = 'ARCHITECTURE_READY';
      let statusLabel = 'Architecture Ready (Expansion Pending)';

      if (c.id === 'COURSE-GEN0102') {
        status = 'PILOT';
        statusLabel = 'Active Pilot & Calibrated';
      } else if (families.length >= 5 && bankProblems.length >= 10) {
        status = 'REPRESENTATIVE_READY';
        statusLabel = 'Representative Content Ready (Awaiting Teacher Review)';
      } else if (families.length > 0 && templateCount > 0) {
        status = 'CALIBRATING';
        statusLabel = 'Calibrating Representative Blueprints';
      }

      return {
        courseId: c.id,
        courseCode: c.code,
        courseName: c.name,
        totalTopics: topics.length,
        totalSubtopics: topics.reduce((acc, t) => acc + (t.subtopics ? t.subtopics.length : 0), 0),
        totalSkills: skills.length,
        mappedEvidenceCount: skills.filter(s => SIX_COURSE_SKILL_EVIDENCE_MAP[s.id]).length,
        registeredFamiliesCount: families.length,
        registeredTemplatesCount: templateCount,
        calibratedProblemsCount: approvedCount,
        status,
        statusLabel
      };
    });
  }
}
