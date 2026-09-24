/**
 * Six-Course End-to-End Problem Generation & Validation Integration Test
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '@/engine/content/generator';
import { ContentValidator } from '@/engine/content/validator';
import { ProblemBank } from '@/engine/content/problemBank';

describe('Six-Course End-to-End Generation & Validation Pipeline (Phase 4)', () => {
  const bank = ProblemBank.getInstance();

  const testCourses = [
    { courseId: 'COURSE-GEN0101', skillId: 'SKILL-GEN0101-001', name: 'Mathematics for Engineers' },
    { courseId: 'COURSE-GEN0102', skillId: 'SKILL-GEN0102-005', name: 'Calculus 1' },
    { courseId: 'COURSE-GEN0107', skillId: 'SKILL-GEN0107-001', name: 'Differential Equations' },
    { courseId: 'COURSE-GEN0110', skillId: 'SKILL-GEN0110-001', name: 'Physics 2 for Engineers' },
    { courseId: 'COURSE-GEN0161', skillId: 'SKILL-GEN0161-002', name: 'Thermodynamics' },
    { courseId: 'COURSE-BSIE3219', skillId: 'SKILL-BSIE3219-006', name: 'IE Special Topics 1' }
  ];

  it('generates, validates, and stores verified problem candidates across all six courses', () => {
    for (const c of testCourses) {
      const result = ContentGenerator.generateForSkill({
        courseId: c.courseId,
        skillId: c.skillId,
        difficulty: 2
      });

      expect(result.success, `Failed to generate candidate for ${c.name} (${c.skillId}): ${result.rejectionDetails}`).toBe(true);
      expect(result.problem).toBeDefined();

      const val = ContentValidator.validateProblemCandidate(result.problem!);
      expect(val.isValid, `Validation failed for ${c.name}: ${val.rejectionMessage}`).toBe(true);

      bank.storeProblem(result.problem!);
      const retrieved = bank.getProblemById(result.problem!.dna.problemId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.dna.courseId).toBe(c.courseId);
    }
  });
});
