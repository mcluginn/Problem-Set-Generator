/**
 * Content Generator Engine Tests
 * Engineering Practice Engine — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '@/engine/content/generator';
import { ProblemGenerationRequest } from '@/engine/content/types';

describe('Skill-Driven Content Generator Orchestrator', () => {
  it('generates fully verified candidate problems for Chain Rule (SKILL-GEN0102-005)', () => {
    const req: ProblemGenerationRequest = {
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      evidenceType: 'DIRECT_CALCULATION',
      difficulty: 2
    };

    const result = ContentGenerator.generateForSkill(req);

    expect(result.success).toBe(true);
    expect(result.problem).toBeDefined();
    if (result.problem) {
      expect(result.problem.dna.primarySkillId).toBe('SKILL-GEN0102-005');
      expect(result.problem.dna.courseId).toBe('COURSE-GEN0102');
      expect(result.problem.dna.evidenceType).toBe('DIRECT_CALCULATION');
      expect(result.problem.dna.generatorVersion).toBeDefined();
      expect(result.problem.solution.canonicalAnswerLatex.length).toBeGreaterThan(3);
      expect(result.problem.solution.reasoningTrace.length).toBeGreaterThanOrEqual(3);
      expect(result.problem.hints.length).toBe(5);
      expect(result.problem.qualityScore.overallQuality).toBe(1.0);
    }
  });

  it('generates application kinematics problem when requested', () => {
    const req: ProblemGenerationRequest = {
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      evidenceType: 'APPLICATION',
      difficulty: 3
    };

    const result = ContentGenerator.generateForSkill(req);

    expect(result.success).toBe(true);
    expect(result.problem).toBeDefined();
    if (result.problem) {
      expect(result.problem.dna.evidenceType).toBe('APPLICATION');
      expect(result.problem.statement.contextStory).toContain('actuator');
    }
  });

  it('rejects generation requests with non-existent skill IDs gracefully', () => {
    const req: ProblemGenerationRequest = {
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-INVALID-999'
    };

    const result = ContentGenerator.generateForSkill(req);
    expect(result.success).toBe(false);
    expect(result.rejectionReason).toBe('SKILL_MISMATCH');
  });
});
