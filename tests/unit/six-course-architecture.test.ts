/**
 * Six-Course Content Architecture Unit Test Suite
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import { describe, it, expect } from 'vitest';
import { CurriculumRegistry } from '@/engine/curriculum/registry';
import { SIX_COURSE_SKILL_EVIDENCE_MAP, ASSESSMENT_EVIDENCE_REGISTRY } from '@/engine/content/assessmentEvidence';
import { PROBLEM_FAMILIES_REGISTRY } from '@/engine/content/problemFamilies';
import { PROBLEM_TEMPLATES_REGISTRY } from '@/engine/content/problemTemplates';

describe('Six-Course Content Architecture Coverage (Phase 4)', () => {
  const currRegistry = CurriculumRegistry.getInstance();

  it('verifies all six authoritative courses exist in the curriculum foundation', () => {
    const courses = currRegistry.getAllCourses();
    expect(courses.length).toBe(6);

    const courseCodes = courses.map(c => c.code);
    expect(courseCodes).toContain('GEN 0101');
    expect(courseCodes).toContain('GEN 0102');
    expect(courseCodes).toContain('GEN 0107');
    expect(courseCodes).toContain('GEN 0110/ 0110L');
    expect(courseCodes).toContain('GEN 0161');
    expect(courseCodes).toContain('BSIE 3219');
  });

  it('verifies 100% of all 71 learning skills have valid assessment evidence mappings', () => {
    const skills = currRegistry.getAllSkills();
    expect(skills.length).toBe(71);

    const skillsByCourse: Record<string, string[]> = {};
    for (const skill of skills) {
      skillsByCourse[skill.parentCourseId] = skillsByCourse[skill.parentCourseId] || [];
      skillsByCourse[skill.parentCourseId].push(skill.id);
    }
    console.log('Skills by Course:', JSON.stringify(skillsByCourse, null, 2));

    const missing: string[] = [];
    for (const skill of skills) {
      const mapping = SIX_COURSE_SKILL_EVIDENCE_MAP[skill.id];
      if (!mapping) {
        missing.push(skill.id);
      }
    }
    expect(missing).toEqual([]);
  });

  it('verifies problem families are registered across all six courses with pedagogical provenance', () => {
    const families = Object.values(PROBLEM_FAMILIES_REGISTRY);
    expect(families.length).toBeGreaterThanOrEqual(18);

    const courseFamilies: Record<string, number> = {};
    for (const fam of families) {
      courseFamilies[fam.courseId] = (courseFamilies[fam.courseId] || 0) + 1;
      expect(fam.id).toBeDefined();
      expect(fam.primarySkillId).toBeDefined();
      expect(fam.domainValidatorType).toBeDefined();
      expect(fam.purpose.length).toBeGreaterThan(10);
      expect(fam.templateIds.length).toBeGreaterThan(0);
    }

    expect(courseFamilies['COURSE-GEN0101']).toBeGreaterThanOrEqual(3);
    expect(courseFamilies['COURSE-GEN0102']).toBeGreaterThanOrEqual(5);
    expect(courseFamilies['COURSE-GEN0107']).toBeGreaterThanOrEqual(3);
    expect(courseFamilies['COURSE-GEN0110']).toBeGreaterThanOrEqual(2);
    expect(courseFamilies['COURSE-GEN0161']).toBeGreaterThanOrEqual(2);
    expect(courseFamilies['COURSE-BSIE3219']).toBeGreaterThanOrEqual(2);
  });

  it('verifies all registered template IDs map to executable ProblemTemplate objects', () => {
    const families = Object.values(PROBLEM_FAMILIES_REGISTRY);

    for (const fam of families) {
      for (const tmplId of fam.templateIds) {
        const tmpl = PROBLEM_TEMPLATES_REGISTRY[tmplId];
        expect(tmpl, `Template ${tmplId} registered in family ${fam.id} not found`).toBeDefined();
        expect(tmpl.familyId).toBe(fam.id);
        expect(tmpl.courseId).toBe(fam.courseId);
        expect(tmpl.primarySkillId).toBe(fam.primarySkillId);
      }
    }
  });
});
