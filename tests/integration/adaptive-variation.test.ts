import { describe, it, expect, beforeEach } from 'vitest';
import { PracticeSessionManager } from '../../src/engine/adaptive/session';
import { problemBank } from '../../src/engine/content/problemBank';
import { ContentGenerator } from '../../src/engine/content/generator';
import { curriculumRegistry } from '../../src/engine/curriculum/registry';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';

describe('Adaptive Variation & Expression Uniqueness', () => {
  const studentId = 'test-variation-student';
  const courseId = 'COURSE-GEN0102';
  const skillId = 'SKILL-GEN0102-002'; // Power Rule Polynomials

  beforeEach(() => {
    PracticeSessionManager.clear();
  });

  it('generates distinct algebraic expressions and signatures across difficulties 1, 2, and 3', () => {
    const diff1 = ContentGenerator.generateForSkill({
      courseId: courseId as any,
      skillId,
      difficulty: 1
    });

    const diff2 = ContentGenerator.generateForSkill({
      courseId: courseId as any,
      skillId,
      difficulty: 2,
      excludeSignatures: [diff1.problem!.dna.structureSignature]
    });

    const diff3 = ContentGenerator.generateForSkill({
      courseId: courseId as any,
      skillId,
      difficulty: 3,
      excludeSignatures: [diff1.problem!.dna.structureSignature, diff2.problem!.dna.structureSignature]
    });

    expect(diff1.success).toBe(true);
    expect(diff2.success).toBe(true);
    expect(diff3.success).toBe(true);

    const sig1 = diff1.problem!.dna.structureSignature;
    const sig2 = diff2.problem!.dna.structureSignature;
    const sig3 = diff3.problem!.dna.structureSignature;

    expect(sig1).not.toBe(sig2);
    expect(sig2).not.toBe(sig3);
    expect(sig1).not.toBe(sig3);

    const expr1 = diff1.problem!.statement.expressionLatex;
    const expr2 = diff2.problem!.statement.expressionLatex;
    const expr3 = diff3.problem!.statement.expressionLatex;

    expect(expr1).not.toBe(expr2);
    expect(expr2).not.toBe(expr3);
  });

  it('Another Like This keeps current skill and difficulty but returns a DIFFERENT problem expression', () => {
    const session = PracticeSessionManager.startSession(studentId, courseId, 'SKILL_PRACTICE', {
      forceSkillId: skillId,
      forceDifficulty: 2
    });

    expect(session.currentProblem).toBeDefined();
    const firstProblem = session.currentProblem!;
    const firstSig = firstProblem.dna.structureSignature;
    const firstExpr = firstProblem.statement.expressionLatex;
    const firstDiff = Math.round(firstProblem.dna.difficultyVector.overall);

    // Request another problem like this (same skill, same difficulty)
    const nextResult = PracticeSessionManager.nextProblem(session.id, {
      courseId,
      forceSkillId: skillId,
      forceDifficulty: firstDiff
    });

    expect(nextResult.problem).toBeDefined();
    const secondProblem = nextResult.problem!;

    // Must be same skill
    expect(secondProblem.dna.primarySkillId).toBe(skillId);
    // Must be same difficulty
    expect(Math.round(secondProblem.dna.difficultyVector.overall)).toBe(firstDiff);
    // Must have different problemId
    expect(secondProblem.dna.problemId).not.toBe(firstProblem.dna.problemId);
    // Must have different structureSignature / expression
    expect(secondProblem.dna.structureSignature).not.toBe(firstSig);
    expect(secondProblem.statement.expressionLatex).not.toBe(firstExpr);
  });

  it('Harder transitions from Level 1 to Level 2 with scaled algebraic expression', () => {
    const session = PracticeSessionManager.startSession(studentId, courseId, 'SKILL_PRACTICE', {
      forceSkillId: skillId,
      forceDifficulty: 1
    });

    const initialProb = session.currentProblem!;
    expect(Math.round(initialProb.dna.difficultyVector.overall)).toBe(1);

    const harderResult = PracticeSessionManager.nextProblem(session.id, {
      courseId,
      forceSkillId: skillId,
      forceDifficulty: 2
    });

    expect(harderResult.problem).toBeDefined();
    const harderProb = harderResult.problem!;
    expect(Math.round(harderProb.dna.difficultyVector.overall)).toBe(2);
    expect(harderProb.dna.structureSignature).not.toBe(initialProb.dna.structureSignature);
    expect(harderProb.statement.expressionLatex).not.toBe(initialProb.statement.expressionLatex);
  });

  it('Easier transitions from Level 2 to Level 1 with simplified algebraic expression', () => {
    const session = PracticeSessionManager.startSession(studentId, courseId, 'SKILL_PRACTICE', {
      forceSkillId: skillId,
      forceDifficulty: 2
    });

    const initialProb = session.currentProblem!;
    expect(Math.round(initialProb.dna.difficultyVector.overall)).toBe(2);

    const easierResult = PracticeSessionManager.nextProblem(session.id, {
      courseId,
      forceSkillId: skillId,
      forceDifficulty: 1
    });

    expect(easierResult.problem).toBeDefined();
    const easierProb = easierResult.problem!;
    expect(Math.round(easierProb.dna.difficultyVector.overall)).toBe(1);
    expect(easierProb.dna.structureSignature).not.toBe(initialProb.dna.structureSignature);
    expect(easierProb.statement.expressionLatex).not.toBe(initialProb.statement.expressionLatex);
  });
});
