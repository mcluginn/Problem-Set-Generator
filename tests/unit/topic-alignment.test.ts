/**
 * Topic Alignment & Scope Constraint Unit Tests
 * Engineering Practice Engine — Phase 7 Critical Content-Alignment Invariant
 */

import { describe, it, expect } from 'vitest';
import { validateProblemScope, isProblemEligible } from '../../src/engine/adaptive/scopeValidator';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';
import { ValidatedProblem } from '../../src/engine/content/types';
import { PracticeScope } from '../../src/engine/adaptive/types';

describe('Unit: Topic Alignment & Hard Scope Constraint Invariant', () => {
  const chainRuleSkill = 'SKILL-GEN0102-005';
  const diffRulesTopic = 'CURR-GEN0102-U1-T04';
  const productRuleSkill = 'SKILL-GEN0102-003';
  const limitsTopic = 'CURR-GEN0102-U1-T03';
  const limitsSkill = 'SKILL-GEN0102-001';

  const mockChainProblem: ValidatedProblem = {
    dna: {
      problemId: 'PROB-CALC1-CHAIN-001',
      courseId: 'COURSE-GEN0102',
      topicId: diffRulesTopic,
      subtopicId: 'SUB-GEN0102-U1-T04-S4',
      primarySkillId: chainRuleSkill,
      supportingSkillIds: ['SKILL-GEN0101-001'],
      evidenceType: 'DIRECT_CALCULATION',
      familyId: 'FAM-GEN0102-CHAIN-POLY',
      templateId: 'TMPL-GEN0102-CHAIN-01',
      representationType: 'SYMBOLIC',
      contextType: 'PURE_MATHEMATICS',
      guidedness: 'STANDARD',
      difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 2, reasoning: 2, representation: 2, context: 2, multiStep: 2 },
      structureSignature: 'SIG-CHAIN-POLY-2',
      domainValidatorType: 'MATH',
      curriculumVersion: '1.0.0',
      skillOntologyVersion: '2.5.0',
      generatorVersion: '1.0.0',
      templateVersion: '1.0.0',
      validatorVersion: '1.0.0'
    },
    statement: {
      promptText: 'Find the derivative of y = (4x^2 + 1)^3',
      expressionLatex: 'y = (4x^2 + 1)^3',
      independentVariable: 'x'
    },
    rawExpression: { type: 'POWER', base: { type: 'VARIABLE', name: 'x' }, exponent: { type: 'NUMBER', value: 3 } } as any,
    solution: {
      canonicalAnswerLatex: '24x(4x^2 + 1)^2',
      canonicalAnswerRaw: '24*x*(4*x^2 + 1)^2',
      reasoningTrace: []
    },
    hints: [],
    qualityScore: { mathematicalValidity: 1, skillAlignment: 1, evidenceAlignment: 1, hintIntegrity: 1, overallQuality: 1 },
    lifecycleStatus: 'VALID',
    createdAt: new Date().toISOString()
  };

  const mockLimitsProblem: ValidatedProblem = {
    ...mockChainProblem,
    dna: {
      ...mockChainProblem.dna,
      problemId: 'PROB-CALC1-LIMIT-001',
      topicId: limitsTopic,
      primarySkillId: limitsSkill,
      supportingSkillIds: [chainRuleSkill], // Supporting skill has Chain Rule, but primary is Limits!
      familyId: 'FAM-GEN0102-LIMIT-RATIONAL'
    }
  };

  /* ========================================================================= */
  /* 1. Direct Topic Alignment                                                 */
  /* ========================================================================= */
  it('passes when problem topic strictly matches requested topic', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      topicId: diffRulesTopic,
      mode: 'TOPIC_PRACTICE'
    };

    const res = validateProblemScope(mockChainProblem, scope);
    expect(res.valid).toBe(true);
    expect(res.errors.length).toBe(0);
    expect(isProblemEligible(mockChainProblem, scope)).toBe(true);
  });

  /* ========================================================================= */
  /* 2. Wrong Topic Rejection                                                  */
  /* ========================================================================= */
  it('rejects a problem belonging to a different topic with TOPIC_MISMATCH', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      topicId: diffRulesTopic,
      mode: 'TOPIC_PRACTICE'
    };

    const res = validateProblemScope(mockLimitsProblem, scope);
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.code === 'TOPIC_MISMATCH')).toBe(true);
    expect(isProblemEligible(mockLimitsProblem, scope)).toBe(false);
  });

  /* ========================================================================= */
  /* 3. Supporting Skill Does NOT Cheat Scope                                  */
  /* ========================================================================= */
  it('rejects problem where requested skill is only a supporting skill, not primary', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      skillId: chainRuleSkill,
      mode: 'SKILL_PRACTICE'
    };

    // mockLimitsProblem has chainRuleSkill in supportingSkillIds, but primary is limitsSkill
    const res = validateProblemScope(mockLimitsProblem, scope);
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.code === 'SKILL_MISMATCH')).toBe(true);
  });

  /* ========================================================================= */
  /* 4. Cross-Course Rejection                                                 */
  /* ========================================================================= */
  it('rejects a problem when courseId does not match', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0161', // Thermodynamics
      topicId: diffRulesTopic,
      mode: 'TOPIC_PRACTICE'
    };

    const res = validateProblemScope(mockChainProblem, scope);
    expect(res.valid).toBe(false);
    expect(res.errors.some(e => e.code === 'COURSE_MISMATCH')).toBe(true);
  });

  /* ========================================================================= */
  /* 5. Pre-Ranking Hard Filter Guarantee                                      */
  /* ========================================================================= */
  it('proves hard constraints filter before adaptive scoring (out-of-scope candidate is never selected)', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      topicId: diffRulesTopic,
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_test_01', scope);
    expect(decision.selectedProblem).toBeDefined();

    // Verify delivered problem strictly belongs to the requested topic
    const validation = validateProblemScope(decision.selectedProblem!, scope);
    expect(validation.valid).toBe(true);
    expect(decision.selectedProblem!.dna.courseId).toBe('COURSE-GEN0102');
  });

  /* ========================================================================= */
  /* 6. Fail-Closed on Non-Existent Topic                                      */
  /* ========================================================================= */
  it('fails closed when topic has no matching skills, returning NO_ELIGIBLE_PROBLEM', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      topicId: 'CURR-GEN0102-NONEXISTENT-999',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_test_02', scope);
    expect(decision.selectedProblem).toBeUndefined();
    expect(decision.selectedProblemId).toBe('NO_ELIGIBLE_PROBLEM');
    expect(decision.fallbackReason).toBe('NO_ELIGIBLE_PROBLEM');
  });
});
