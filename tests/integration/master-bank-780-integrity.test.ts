import { describe, it, expect } from 'vitest';
import { problemBank } from '@/engine/content/problemBank';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import masterBank780 from '@/engine/content/master_bank_780.json';
import { MasterBank780Problem } from '@/engine/content/types';

describe('780 Calibrated Structural Problem Bank Integrity & Validation', () => {
  const problems = masterBank780 as unknown as MasterBank780Problem[];

  it('verifies exact total count of 780 problems across 260 distinct clusters', () => {
    expect(problems.length).toBe(780);

    const clusters = new Set(problems.map(p => p.clusterId));
    expect(clusters.size).toBe(260);
  });

  it('verifies every single cluster has exactly [Level 1, Level 2, Level 3] difficulty progression', () => {
    const clusterDifficulties = new Map<string, number[]>();
    for (const p of problems) {
      if (!clusterDifficulties.has(p.clusterId)) {
        clusterDifficulties.set(p.clusterId, []);
      }
      clusterDifficulties.get(p.clusterId)!.push(p.difficulty);
    }

    expect(clusterDifficulties.size).toBe(260);
    for (const [cid, diffs] of clusterDifficulties.entries()) {
      expect(diffs.sort(), `Cluster ${cid} must have [1, 2, 3]`).toEqual([1, 2, 3]);
    }
  });

  it('verifies all 780 problem IDs and structural family IDs are strictly unique and valid', () => {
    const ids = new Set<string>();
    const familyIds = new Set<string>();

    for (const p of problems) {
      expect(p.id).toBeDefined();
      expect(p.id.length).toBeGreaterThan(5);
      expect(ids.has(p.id), `Duplicate ID: ${p.id}`).toBe(false);
      ids.add(p.id);

      expect(p.problemFamilyId).toBeDefined();
      expect(familyIds.has(p.id), `Family ID for ${p.id} must be unique per problem`).toBe(false);
      familyIds.add(p.id);

      // Verify structural progression text
      expect(p.structuralProgression.length, `Problem ${p.id} missing structural progression`).toBeGreaterThan(10);
    }

    expect(ids.size).toBe(780);
  });

  it('verifies analytical solutions: all problems have canonical answers, hints, and >= 2 derivation steps', () => {
    for (const p of problems) {
      expect(p.canonicalAnswer.trim().length, `Problem ${p.id} must have canonical answer`).toBeGreaterThan(0);
      expect(p.statement.trim().length, `Problem ${p.id} must have statement`).toBeGreaterThan(10);
      expect(p.derivationSteps.length, `Problem ${p.id} must have >= 2 derivation steps`).toBeGreaterThanOrEqual(2);

      // Verify hints
      expect(p.recognitionHint.length, `Problem ${p.id} must have recognition hint`).toBeGreaterThan(5);
      expect(p.setupHint.length, `Problem ${p.id} must have setup hint`).toBeGreaterThan(5);
      expect(p.commonMistake.length, `Problem ${p.id} must have common mistake warning`).toBeGreaterThan(5);
    }
  });

  it('verifies exact course breakdown matching the authoritative 5 syllabi', () => {
    const courseCounts: Record<string, { problems: number; clusters: Set<string> }> = {
      'COURSE-GEN0102': { problems: 0, clusters: new Set() },
      'COURSE-GEN0101': { problems: 0, clusters: new Set() },
      'COURSE-GEN0161': { problems: 0, clusters: new Set() },
      'COURSE-GEN0110': { problems: 0, clusters: new Set() },
      'COURSE-BSIE3219': { problems: 0, clusters: new Set() }
    };

    for (const p of problems) {
      expect(courseCounts[p.courseId], `Unknown courseId: ${p.courseId}`).toBeDefined();
      courseCounts[p.courseId].problems++;
      courseCounts[p.courseId].clusters.add(p.clusterId);
    }

    // GEN 0102 (Calculus 1): 53 clusters, 159 problems
    expect(courseCounts['COURSE-GEN0102'].problems).toBe(159);
    expect(courseCounts['COURSE-GEN0102'].clusters.size).toBe(53);

    // GEN 0101 (Mathematics for Engineers): 66 clusters, 198 problems
    expect(courseCounts['COURSE-GEN0101'].problems).toBe(198);
    expect(courseCounts['COURSE-GEN0101'].clusters.size).toBe(66);

    // GEN 0110 (Physics 2 for Engineers): 61 clusters, 183 problems
    expect(courseCounts['COURSE-GEN0110'].problems).toBe(183);
    expect(courseCounts['COURSE-GEN0110'].clusters.size).toBe(61);

    // GEN 0161 (Thermodynamics): 39 clusters, 117 problems
    expect(courseCounts['COURSE-GEN0161'].problems).toBe(117);
    expect(courseCounts['COURSE-GEN0161'].clusters.size).toBe(39);

    // BSIE 3219 (IE Special Topics 1): 41 clusters, 123 problems
    expect(courseCounts['COURSE-BSIE3219'].problems).toBe(123);
    expect(courseCounts['COURSE-BSIE3219'].clusters.size).toBe(41);
  });

  it('verifies ProblemBank loads all 780 master problems and supports structural lookups', () => {
    const allBank = problemBank.getAllProblems();
    expect(allBank.length).toBeGreaterThanOrEqual(780);

    const masterProblems = problemBank.getMasterProblems();
    expect(masterProblems.length).toBeGreaterThanOrEqual(780);

    // Test lookup by masterProblemId
    const sample = problems[0];
    const retrieved = problemBank.getProblemsByMasterProblemId(sample.id);
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].dna.problemId).toBe(sample.id);
    expect(retrieved[0].dna.isParameterVariation).toBe(false);

    // Test lookup by clusterId
    const clusterProblems = problemBank.getProblemsByClusterId(sample.clusterId);
    expect(clusterProblems.length).toBe(3);
    const diffs = clusterProblems.map(p => Math.round(p.dna.difficultyVector.overall)).sort();
    expect(diffs).toEqual([1, 2, 3]);

    // Test curriculum registry has the cluster registered
    const skill = curriculumRegistry.getSkillById(sample.clusterId);
    expect(skill).toBeDefined();
    expect(skill?.parentCourseId).toBe(sample.courseId);
  });
});
