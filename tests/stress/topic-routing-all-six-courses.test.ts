/**
 * Six-Course Topic Routing & Scope Invariant Stress Test Matrix
 * Engineering Practice Engine — Phase 7 Content Alignment
 */

import { describe, it, expect } from 'vitest';
import { curriculumRegistry } from '../../src/engine/curriculum/registry';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';
import { validateProblemScope } from '../../src/engine/adaptive/scopeValidator';
import { PROBLEM_FAMILIES_REGISTRY } from '../../src/engine/content/problemFamilies';
import { PracticeScope } from '../../src/engine/adaptive/types';

describe('Stress: Topic Routing & Scope Invariant across All Six Courses', () => {
  const courses = curriculumRegistry.getAllCourses();

  for (const course of courses) {
    it(`guarantees 100% topic scope compliance across 20 iterations for ${course.code} (${course.id})`, () => {
      const courseTopicsWithContent = curriculumRegistry
        .getTopicsByCourse(course.id)
        .filter(t => {
          const skills = curriculumRegistry.getSkillsByTopic(t.id);
          return skills.some(s =>
            Object.values(PROBLEM_FAMILIES_REGISTRY).some(f => f.primarySkillId === s.id)
          );
        });

      expect(courseTopicsWithContent.length).toBeGreaterThan(0);

      // Select first teaching topic with defined content families
      const targetTopic = courseTopicsWithContent[0];
      const scope: PracticeScope = {
        courseId: course.id,
        topicId: targetTopic.id,
        mode: 'TOPIC_PRACTICE'
      };

      for (let iter = 0; iter < 20; iter++) {
        const decision = AdaptiveSelector.selectNextBestProblem(
          `student_stress_${course.code}_${iter}`,
          scope
        );

        expect(decision.selectedProblem).toBeDefined();
        const problem = decision.selectedProblem!;

        // 1. Hard validation check
        const validation = validateProblemScope(problem, scope);
        expect(validation.valid).toBe(true);

        // 2. Direct metadata check
        expect(problem.dna.courseId).toBe(course.id);

        // 3. Curriculum ancestry check
        const skill = curriculumRegistry.getSkillById(problem.dna.primarySkillId);
        expect(skill).toBeDefined();
        expect(skill!.parentCourseId).toBe(course.id);
        expect(skill!.parentTopicId).toBe(targetTopic.id);
      }
    });
  }
});
