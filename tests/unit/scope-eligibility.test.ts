/**
 * Scope Eligibility & Curriculum Lineage Unit Tests
 * Engineering Practice Engine — Phase 7 Scope Validation
 */

import { describe, it, expect } from 'vitest';
import { validateProblemScope } from '../../src/engine/adaptive/scopeValidator';
import { ValidatedProblem } from '../../src/engine/content/types';
import { PracticeScope } from '../../src/engine/adaptive/types';

describe('Unit: Scope Eligibility & Curriculum Lineage Verification', () => {
  const dummyProblem: ValidatedProblem = {
    dna: {
      problemId: 'PROB-TEST-001',
      courseId: 'COURSE-GEN0102',
      topicId: 'CURR-GEN0102-U1-T04',
      subtopicId: 'SUB-GEN0102-U1-T04-S4',
      primarySkillId: 'SKILL-GEN0102-005',
      supportingSkillIds: [],
      evidenceType: 'DIRECT_CALCULATION',
      familyId: 'FAM-GEN0102-CHAIN-POLY',
      templateId: 'TMPL-GEN0102-CHAIN-01',
      representationType: 'SYMBOLIC',
      contextType: 'PURE_MATHEMATICS',
      guidedness: 'STANDARD',
      difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 2, reasoning: 2, representation: 2, context: 2, multiStep: 2 },
      structureSignature: 'SIG-TEST',
      domainValidatorType: 'MATH',
      curriculumVersion: '1.0.0',
      skillOntologyVersion: '2.5.0',
      generatorVersion: '1.0.0',
      templateVersion: '1.0.0',
      validatorVersion: '1.0.0'
    },
    statement: {
      promptText: 'Differentiate y = (x^2 + 1)^2',
      expressionLatex: 'y = (x^2 + 1)^2'
    },
    rawExpression: {} as any,
    solution: {
      canonicalAnswerLatex: '4x(x^2 + 1)',
      canonicalAnswerRaw: '4*x*(x^2 + 1)',
      reasoningTrace: []
    },
    hints: [],
    qualityScore: { mathematicalValidity: 1, skillAlignment: 1, evidenceAlignment: 1, hintIntegrity: 1, overallQuality: 1 },
    lifecycleStatus: 'VALID',
    createdAt: new Date().toISOString()
  };

  it('rejects an orphan problem with non-registered primarySkillId', () => {
    const orphanProblem: ValidatedProblem = {
      ...dummyProblem,
      dna: {
        ...dummyProblem.dna,
        primarySkillId: 'SKILL-UNKNOWN-NONEXISTENT'
      }
    };

    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      mode: 'RECOMMENDED'
    };

    const res = validateProblemScope(orphanProblem, scope);
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.code === 'ORPHAN_PROBLEM')).toBe(true);
  });

  it('enforces allowedTopicIds policy constraint', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      mode: 'RECOMMENDED',
      allowedTopicIds: ['CURR-GEN0102-U1-T01', 'CURR-GEN0102-U1-T02'] // Excludes CURR-GEN0102-U1-T04
    };

    const res = validateProblemScope(dummyProblem, scope);
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.code === 'TOPIC_MISMATCH')).toBe(true);
  });

  it('enforces allowedSkillIds policy constraint', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      mode: 'RECOMMENDED',
      allowedSkillIds: ['SKILL-GEN0102-001', 'SKILL-GEN0102-002'] // Excludes SKILL-GEN0102-005
    };

    const res = validateProblemScope(dummyProblem, scope);
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.code === 'SKILL_MISMATCH')).toBe(true);
  });

  it('enforces disabledFamilyIds policy constraint', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      mode: 'RECOMMENDED',
      disabledFamilyIds: ['FAM-GEN0102-CHAIN-POLY']
    };

    const res = validateProblemScope(dummyProblem, scope);
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.code === 'INVALID_CURRICULUM_LINEAGE')).toBe(true);
  });
});
