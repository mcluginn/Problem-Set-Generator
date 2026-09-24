/**
 * Centralized Practice Scope & Curriculum Eligibility Validator
 * Engineering Practice Engine — Critical Content-Alignment Invariant
 *
 * Enforces the permanent architectural invariant:
 * Student-selected scope MUST dominate adaptive selection.
 * HARD CONSTRAINTS -> ELIGIBLE PROBLEM SET -> ADAPTIVE SCORING -> BEST ELIGIBLE PROBLEM
 */

import { ValidatedProblem } from '../content/types';
import { curriculumRegistry } from '../curriculum/registry';
import { PracticeScope, ScopeValidationError, ScopeValidationResult } from './types';

export class ScopeValidator {
  /**
   * Validates whether a problem strictly satisfies the active PracticeScope.
   * Returns a structured validation result detailing any mismatch errors.
   */
  public static validateProblemScope(
    problem: ValidatedProblem,
    scope: PracticeScope
  ): ScopeValidationResult {
    const errors: ScopeValidationError[] = [];

    if (!problem || !problem.dna) {
      return {
        valid: false,
        errors: [
          {
            code: 'ORPHAN_PROBLEM',
            message: 'Problem definition or ProblemDNA is missing.'
          }
        ]
      };
    }

    const dna = problem.dna;

    // 1. HARD CONSTRAINT: Course Match
    if (dna.courseId !== scope.courseId) {
      errors.push({
        code: 'COURSE_MISMATCH',
        message: `Problem courseId (${dna.courseId}) does not match requested course (${scope.courseId}).`,
        expected: scope.courseId,
        actual: dna.courseId
      });
    }

    // 2. HARD CONSTRAINT: Curriculum Lineage & Orphan Problem Protection
    const registeredSkill = curriculumRegistry.getSkillById(dna.primarySkillId);
    if (!registeredSkill) {
      errors.push({
        code: 'ORPHAN_PROBLEM',
        message: `Primary skill "${dna.primarySkillId}" is not registered in the authoritative curriculum.`,
        expected: 'Valid registered LearningSkill',
        actual: dna.primarySkillId
      });
    } else {
      // Verify skill belongs to the course
      if (registeredSkill.parentCourseId !== scope.courseId) {
        errors.push({
          code: 'INVALID_CURRICULUM_LINEAGE',
          message: `Skill "${dna.primarySkillId}" belongs to course "${registeredSkill.parentCourseId}", not "${scope.courseId}".`,
          expected: scope.courseId,
          actual: registeredSkill.parentCourseId
        });
      }
    }

    // 3. HARD CONSTRAINT: Skill Practice Mode or Explicit skillId Constraint
    if (scope.skillId || scope.mode === 'SKILL_PRACTICE') {
      const requiredSkillId = scope.skillId;
      if (requiredSkillId) {
        const isDirectSkillMatch = dna.primarySkillId === requiredSkillId || dna.skillClusterId === requiredSkillId;
        const mappedClusters = curriculumRegistry.getClustersForSkill(requiredSkillId);
        const isClusterMatch = mappedClusters.includes(dna.primarySkillId) || (dna.skillClusterId ? mappedClusters.includes(dna.skillClusterId) : false);
        const parentSkill = curriculumRegistry.getSkillForCluster(dna.primarySkillId);
        const isParentSkillMatch = parentSkill === requiredSkillId;

        if (!isDirectSkillMatch && !isClusterMatch && !isParentSkillMatch) {
          errors.push({
            code: 'SKILL_MISMATCH',
            message: `Primary skill "${dna.primarySkillId}" does not match requested skill "${requiredSkillId}". Supporting skills do not qualify.`,
            expected: requiredSkillId,
            actual: dna.primarySkillId
          });
        }
      }
    }

    // 4. HARD CONSTRAINT: Topic Practice Mode or Explicit topicId Constraint
    if (scope.topicId || scope.mode === 'TOPIC_PRACTICE') {
      const requiredTopicId = scope.topicId;
      if (requiredTopicId) {
        // A problem is topic-eligible if:
        // (a) problem.dna.topicId matches requiredTopicId, OR
        // (b) problem's registered primarySkill is in requiredTopicId or a descendant of requiredTopicId, OR
        // (c) problem's cluster belongs to requiredTopicId
        const isDirectTopicMatch = dna.topicId === requiredTopicId;
        const isCurriculumSkillInTopic = registeredSkill
          ? curriculumRegistry.isSkillInTopic(dna.primarySkillId, requiredTopicId)
          : false;
        const isTopicSkillsMatch = curriculumRegistry
          .getSkillsByTopic(requiredTopicId)
          .some(s => s.id === dna.primarySkillId);
        const mappedTopicClusters = curriculumRegistry.getClustersForTopic(requiredTopicId);
        const isTopicClusterMatch = mappedTopicClusters.includes(dna.primarySkillId) ||
          (dna.skillClusterId ? mappedTopicClusters.includes(dna.skillClusterId) : false) ||
          (dna.topicId ? mappedTopicClusters.includes(dna.topicId) : false);

        if (!isDirectTopicMatch && !isCurriculumSkillInTopic && !isTopicSkillsMatch && !isTopicClusterMatch) {
          errors.push({
            code: 'TOPIC_MISMATCH',
            message: `Problem topic (${dna.topicId || 'undefined'}) / skill topic (${registeredSkill?.parentTopicId || 'undefined'}) does not match requested topic "${requiredTopicId}".`,
            expected: requiredTopicId,
            actual: dna.topicId || registeredSkill?.parentTopicId
          });
        }
      }
    }

    // 5. HARD CONSTRAINT: Subtopic Constraint (if explicitly specified)
    if (scope.subtopicId) {
      const requiredSubtopicId = scope.subtopicId;
      const isDirectSubtopicMatch = dna.subtopicId === requiredSubtopicId;
      const isCurriculumSkillInSubtopic = registeredSkill
        ? curriculumRegistry.isSkillInSubtopic(dna.primarySkillId, requiredSubtopicId)
        : false;

      if (!isDirectSubtopicMatch && !isCurriculumSkillInSubtopic) {
        errors.push({
          code: 'SUBTOPIC_MISMATCH',
          message: `Problem subtopic (${dna.subtopicId || 'undefined'}) does not match requested subtopic "${requiredSubtopicId}".`,
          expected: requiredSubtopicId,
          actual: dna.subtopicId
        });
      }
    }

    // 6. Policy Level Restrictions (Allowed Topics / Skills / Disabled Families)
    if (scope.allowedTopicIds && scope.allowedTopicIds.length > 0) {
      const problemTopic = dna.topicId || registeredSkill?.parentTopicId;
      const mappedTopic = curriculumRegistry.getTopicForCluster(dna.primarySkillId);
      const isAllowedTopic = (problemTopic && scope.allowedTopicIds.includes(problemTopic)) ||
        (mappedTopic && scope.allowedTopicIds.includes(mappedTopic)) ||
        scope.allowedTopicIds.some(tId => curriculumRegistry.getClustersForTopic(tId).includes(dna.primarySkillId));

      if (!isAllowedTopic) {
        errors.push({
          code: 'TOPIC_MISMATCH',
          message: `Topic "${problemTopic}" is not in the policy allowedTopicIds list.`,
          expected: scope.allowedTopicIds.join(', '),
          actual: problemTopic
        });
      }
    }

    if (scope.allowedSkillIds && scope.allowedSkillIds.length > 0) {
      const parentSkill = curriculumRegistry.getSkillForCluster(dna.primarySkillId);
      const isAllowedSkill = scope.allowedSkillIds.includes(dna.primarySkillId) ||
        (parentSkill && scope.allowedSkillIds.includes(parentSkill)) ||
        scope.allowedSkillIds.some(sId => curriculumRegistry.getClustersForSkill(sId).includes(dna.primarySkillId));

      if (!isAllowedSkill) {
        errors.push({
          code: 'SKILL_MISMATCH',
          message: `Skill "${dna.primarySkillId}" is not in the policy allowedSkillIds list.`,
          expected: scope.allowedSkillIds.join(', '),
          actual: dna.primarySkillId
        });
      }
    }

    if (scope.disabledFamilyIds && scope.disabledFamilyIds.includes(dna.familyId)) {
      errors.push({
        code: 'INVALID_CURRICULUM_LINEAGE',
        message: `Problem family "${dna.familyId}" is disabled by policy.`,
        expected: `Not in [${scope.disabledFamilyIds.join(', ')}]`,
        actual: dna.familyId
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Fast boolean predicate: checks if a problem is eligible for the given scope.
   */
  public static isProblemEligible(problem: ValidatedProblem, scope: PracticeScope): boolean {
    return ScopeValidator.validateProblemScope(problem, scope).valid;
  }

  /**
   * Filters a candidate pool of problems, retaining ONLY those that pass hard scope validation.
   */
  public static filterEligibleProblems(
    problems: ValidatedProblem[],
    scope: PracticeScope
  ): ValidatedProblem[] {
    return problems.filter(p => ScopeValidator.isProblemEligible(p, scope));
  }
}

export const validateProblemScope = ScopeValidator.validateProblemScope;
export const isProblemEligible = ScopeValidator.isProblemEligible;
export const filterEligibleProblems = ScopeValidator.filterEligibleProblems;
