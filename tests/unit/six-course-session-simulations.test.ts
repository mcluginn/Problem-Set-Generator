import { describe, it, expect } from 'vitest';
import { ProblemBank } from '../../src/engine/content/problemBank';
import { ContentRegistry } from '../../src/engine/content/registry';

describe('Multi-Course Session and Problem Exposure Simulation Tests', () => {
  const bank = ProblemBank.getInstance();
  const contentRegistry = ContentRegistry.getInstance();

  it('maintains student problem exposure and prevents immediate duplication across courses', () => {
    const studentA = 'STUDENT-SIM-001';
    const studentB = 'STUDENT-SIM-002';

    // Student A requests Calculus 1 problems
    const p1 = bank.getOrGenerateProblem(studentA, {
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      evidenceType: 'DIRECT_CALCULATION'
    });

    expect(p1).toBeDefined();
    if (p1) {
      expect(p1.dna.courseId).toBe('COURSE-GEN0102');
    }

    // Student B requests Physics 2 problems
    const p2 = bank.getOrGenerateProblem(studentB, {
      courseId: 'COURSE-GEN0110',
      skillId: 'SKILL-GEN0110-001',
      evidenceType: 'DIRECT_CALCULATION'
    });

    expect(p2).toBeDefined();
    if (p2) {
      expect(p2.dna.courseId).toBe('COURSE-GEN0110');
      expect(p2.dna.problemId).not.toBe(p1?.dna.problemId);
    }
  });

  it('verifies bank contains representative problems for each course', () => {
    const courses = [
      'COURSE-GEN0101',
      'COURSE-GEN0102',
      'COURSE-GEN0107',
      'COURSE-GEN0110',
      'COURSE-GEN0161',
      'COURSE-BSIE3219'
    ];

    for (const cid of courses) {
      const problems = bank.getProblemsByCourse(cid);
      expect(problems.length).toBeGreaterThanOrEqual(3);
    }
  });
});
