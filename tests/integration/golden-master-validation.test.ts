import { describe, it, expect } from 'vitest';
import { problemBank } from '@/engine/content/problemBank';
import { ContentValidator } from '@/engine/content/validator';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { AUTHORITATIVE_COURSES } from '@/engine/curriculum/courses';
import { GoldenMasterProblem } from '@/engine/content/types';
import goldenMasterNonDiffEq from '@/engine/content/golden_master_non_diffeq_510.json';
import goldenMasterAll540 from '@/engine/content/golden_master_all_540.json';

describe('Golden Master Problem Bank & Curriculum Migration (540 / 510)', () => {
  const nonDiffEqProblems = goldenMasterNonDiffEq as unknown as GoldenMasterProblem[];
  const allProblems = goldenMasterAll540 as unknown as GoldenMasterProblem[];

  it('verifies the authoritative 540 and 510 Golden Master problem counts', () => {
    expect(allProblems.length).toBe(540);
    expect(nonDiffEqProblems.length).toBe(510);

    const diffeqOmitted = allProblems.filter(p => p.courseId === 'COURSE-GEN0107');
    expect(diffeqOmitted.length).toBe(30);
  });

  it('runs the 17-point structural validator pipeline (Checks A through Q) with ZERO errors', () => {
    const validCourseIds = [...AUTHORITATIVE_COURSES.map(c => c.id), 'COURSE-CTR0301'];
    const result = ContentValidator.validateBankStructure(nonDiffEqProblems, validCourseIds);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.totalProblems).toBe(510);
    expect(result.totalClusters).toBe(170);
    expect(result.totalCourses).toBe(6);
    expect(result.l1Count).toBe(170);
    expect(result.l2Count).toBe(170);
    expect(result.l3Count).toBe(170);

    // Verify each individual check (A through Q)
    const expectedChecks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
    for (const code of expectedChecks) {
      expect(result.checks[code], `Check ${code} must exist`).toBeDefined();
      expect(result.checks[code].passed, `Check ${code} (${result.checks[code].name}) must pass`).toBe(true);
      expect(result.checks[code].failures, `Check ${code} must have 0 failures`).toEqual([]);
    }
  });

  it('verifies exact cluster and course distribution across the 6 non-DiffEq courses', () => {
    const courseDistribution: Record<string, { problems: number; clusters: Set<string> }> = {};
    for (const prob of nonDiffEqProblems) {
      if (!courseDistribution[prob.courseId]) {
        courseDistribution[prob.courseId] = { problems: 0, clusters: new Set() };
      }
      courseDistribution[prob.courseId].problems++;
      courseDistribution[prob.courseId].clusters.add(prob.clusterId);
    }

    expect(courseDistribution['COURSE-GEN0102'].problems).toBe(60);
    expect(courseDistribution['COURSE-GEN0102'].clusters.size).toBe(20);

    expect(courseDistribution['COURSE-GEN0101'].problems).toBe(69);
    expect(courseDistribution['COURSE-GEN0101'].clusters.size).toBe(23);

    expect(courseDistribution['COURSE-GEN0110'].problems).toBe(69);
    expect(courseDistribution['COURSE-GEN0110'].clusters.size).toBe(23);

    expect(courseDistribution['COURSE-GEN0161'].problems).toBe(132);
    expect(courseDistribution['COURSE-GEN0161'].clusters.size).toBe(44);

    expect(courseDistribution['COURSE-CTR0301'].problems).toBe(9);
    expect(courseDistribution['COURSE-CTR0301'].clusters.size).toBe(3);

    expect(courseDistribution['COURSE-BSIE3219'].problems).toBe(171);
    expect(courseDistribution['COURSE-BSIE3219'].clusters.size).toBe(57);
  });

  it('verifies ProblemBank loads canonical Golden Master problems alongside preserved DiffEq problems', () => {
    const allBankProblems = problemBank.getAllProblems();
    expect(allBankProblems.length).toBeGreaterThanOrEqual(780);

    const gen0102Probs = problemBank.getProblemsForCourse('COURSE-GEN0102');
    expect(gen0102Probs.length).toBe(159);

    const ctrProbs = problemBank.getProblemsForCourse('COURSE-CTR0301');
    expect(ctrProbs.length).toBe(9);

    // Verify Differential Equations (COURSE-GEN0107) problems are preserved
    const odeProbs = problemBank.getProblemsForCourse('COURSE-GEN0107');
    expect(odeProbs.length).toBeGreaterThanOrEqual(23);

    // Verify exact cluster lookup
    const limProblems = problemBank.getProblemsForSkill('GEN0102-U1-LIM');
    expect(limProblems.length).toBe(3);
    const difficulties = limProblems.map(p => Math.round(p.dna.difficultyVector.overall)).sort();
    expect(difficulties).toEqual([1, 2, 3]);

    // Verify that every problem has hints, derivations, and canonical answer
    for (const p of limProblems) {
      expect(p.statement.promptText.length).toBeGreaterThan(10);
      expect(p.solution.canonicalAnswerRaw.length).toBeGreaterThan(0);
      expect(p.solution.reasoningTrace.length).toBeGreaterThan(0);
      expect(p.hints.length).toBe(3);
      expect(p.hints[0].category).toBe('RECOGNITION');
      expect(p.hints[1].category).toBe('SETUP');
      expect(p.hints[2].category).toBe('GUIDED_CALCULATION');
    }
  });

  it('verifies curriculumRegistry registers all 260 non-DiffEq clusters and preserves DiffEq skills', () => {
    const gen0102Skills = curriculumRegistry.getClustersByCourse('COURSE-GEN0102');
    expect(gen0102Skills.length).toBe(53);

    const gen0101Skills = curriculumRegistry.getClustersByCourse('COURSE-GEN0101');
    expect(gen0101Skills.length).toBe(66);

    const bsSkills = curriculumRegistry.getClustersByCourse('COURSE-BSIE3219');
    expect(bsSkills.length).toBe(41);

    const gen0161Skills = curriculumRegistry.getClustersByCourse('COURSE-GEN0161');
    expect(gen0161Skills.length).toBe(39);

    const gen0110Skills = curriculumRegistry.getClustersByCourse('COURSE-GEN0110');
    expect(gen0110Skills.length).toBe(61);

    // Differential Equations skills are preserved exactly (11 skills)
    const odeSkills = curriculumRegistry.getSkillsByCourse('COURSE-GEN0107');
    expect(odeSkills.length).toBe(11);

    // Verify Golden Master cluster ID resolution
    const goldenDiff = curriculumRegistry.getSkillById('GEN0102-U1-DIFF');
    expect(goldenDiff).toBeDefined();
    expect(goldenDiff?.id).toBe('GEN0102-U1-DIFF');

    // Verify legacy skill ID resolution
    const legacyChainRule = curriculumRegistry.getSkillById('SKILL-GEN0102-005');
    expect(legacyChainRule).toBeDefined();
    expect(legacyChainRule?.id).toBe('SKILL-GEN0102-005');
  });

  it('verifies accepted equivalents checking functionality', () => {
    // Check radical conjugate problem [GEN0102-U1-LIM-L2-002]
    const p = nonDiffEqProblems.find(x => x.id === 'GEN0102-U1-LIM-L2-002');
    expect(p).toBeDefined();
    expect(p?.canonicalAnswer).toBe('1/6');
    expect(p?.acceptedEquivalents).toContain('0.1667');
    expect(p?.acceptedEquivalents).toContain('0.167');
  });
});
