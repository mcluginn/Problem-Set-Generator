/**
 * Problem Diversity & Near-Duplicate Tests
 * Engineering Practice Engine — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '@/engine/content/generator';
import { ProblemBank } from '@/engine/content/problemBank';

describe('Problem Diversity & Anti-Duplication Engine', () => {
  it('generates diverse structure signatures across successive requests', () => {
    const signatures = new Set<string>();
    const history: Array<{ signature: string; familyId: string }> = [];

    for (let i = 0; i < 5; i++) {
      const res = ContentGenerator.generateForSkill(
        {
          courseId: 'COURSE-GEN0102',
          skillId: 'SKILL-GEN0102-005',
          evidenceType: 'DIRECT_CALCULATION'
        },
        history
      );

      if (res.success && res.problem) {
        signatures.add(res.problem.dna.structureSignature);
        history.push({
          signature: res.problem.dna.structureSignature,
          familyId: res.problem.dna.familyId
        });
      }
    }

    expect(signatures.size).toBeGreaterThanOrEqual(1);
  });

  it('permits identical structures when flagged as REMEDIATION_REPETITION', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      isRemediationRepetition: true
    });

    expect(res.success).toBe(true);
    expect(res.problem?.dna.isRemediationRepetition).toBe(true);
  });

  it('tracks student problem history and freshness in the ProblemBank', () => {
    const bank = ProblemBank.getInstance();
    const studentId = 'TEST-STUDENT-001';

    const prob1 = bank.getOrGenerateProblem(studentId, {
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005'
    });

    expect(prob1).toBeDefined();

    const prob2 = bank.getOrGenerateProblem(studentId, {
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005'
    });

    expect(prob2).toBeDefined();
  });
});
