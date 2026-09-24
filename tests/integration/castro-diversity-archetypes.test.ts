import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ConceptAlignmentValidator } from '../../src/engine/content/conceptValidator';
import { conceptRegistry } from '../../src/engine/content/conceptRegistry';
import { ARCHETYPE_REGISTRY } from '../../src/engine/content/archetypeRegistry';
import { calculateStructuralSimilarity } from '../../src/engine/math/structuralFingerprint';
import { PracticeSessionManager } from '../../src/engine/adaptive/session';
import { CurriculumRegistry } from '../../src/engine/curriculum/registry';

describe('Castro Pedagogical Archetypes & Diversity Engine Integration', () => {
  const targetSkillId = 'SKILL-GEN0107-004';
  const targetConceptId = 'de_first_order_homogeneous_y_vx';

  it('verifies Castro archetypes are properly cataloged in ARCHETYPE_REGISTRY', () => {
    const archetypes = Object.values(ARCHETYPE_REGISTRY);
    expect(archetypes.length).toBeGreaterThanOrEqual(7);

    const expectedIds = [
      'ARCH-HOMO-DIRECT-RATIO',
      'ARCH-HOMO-DIFF-FORM',
      'ARCH-HOMO-DUAL-SUB',
      'ARCH-HOMO-PARTIAL-FRAC',
      'ARCH-HOMO-INVERSE-TRIG',
      'ARCH-HOMO-TRANSCENDENTAL',
      'ARCH-HOMO-IVP',
      'ARCH-HOMO-DEGREE-TEST',
      'ARCH-HOMO-VERIFY'
    ];

    for (const id of expectedIds) {
      const arch = ARCHETYPE_REGISTRY[id];
      expect(arch).toBeDefined();
      expect(arch.sourceMetadata.sourceTitle).toContain('Castro');
      expect(arch.taskType).toBeDefined();
      expect(arch.description).toContain('homogeneous');
    }
  });

  it('strictly enforces the Syllabus Supremacy Invariant across all Castro archetypes', () => {
    // Concept in registry must have expectedMethod SUBSTITUTION_Y_EQUALS_VX and maxStructuralSimilarity 0.70
    const concept = conceptRegistry.getConceptById(targetConceptId);
    expect(concept).toBeDefined();
    expect(concept!.primaryMethod).toBe('SUBSTITUTION_Y_EQUALS_VX');
    expect(concept!.order).toBe(1);
    expect(concept!.maxStructuralSimilarity).toBe(0.70);

    const families = [
      'FAM-GEN0107-HOMOGENEOUS-VX',
      'FAM-GEN0107-HOMO-DIFF-FORM',
      'FAM-GEN0107-HOMO-DUAL-SUB',
      'FAM-GEN0107-HOMO-PARTIAL-FRAC',
      'FAM-GEN0107-HOMO-INVERSE-TRIG',
      'FAM-GEN0107-HOMO-TRANSCENDENTAL',
      'FAM-GEN0107-HOMO-IVP',
      'FAM-GEN0107-HOMO-DEGREE-TEST',
      'FAM-GEN0107-HOMO-VERIFY'
    ];

    for (const famId of families) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0107',
        skillId: targetSkillId,
        familyId: famId
      });

      expect(res.success).toBe(true);
      expect(res.problem).toBeDefined();

      const prob = res.problem!;

      // 1. Syllabus Supremacy: Must be 1st-order and concept must be de_first_order_homogeneous_y_vx
      expect(prob.dna.courseId).toBe('COURSE-GEN0107');
      expect(prob.dna.primarySkillId).toBe(targetSkillId);
      expect(prob.dna.conceptId).toBe(targetConceptId);
      expect(prob.dna.order).toBe(1);
      expect(prob.dna.expectedMethod).toBe('SUBSTITUTION_Y_EQUALS_VX');

      // 2. Must NOT be a 2nd order characteristic equation problem
      expect(prob.statement.expressionLatex).not.toContain("y''");
      expect(prob.statement.expressionLatex).not.toContain('d^2y/dx^2');

      // 3. Task Type Layer validation
      expect(prob.dna.taskType).toBeDefined();
      expect([
        'SOLVE_GENERAL_SOLUTION',
        'REARRANGE_AND_SOLVE',
        'SELECT_OPTIMAL_SUBSTITUTION',
        'SOLVE_INITIAL_VALUE_PROBLEM',
        'ANALYZE_HOMOGENEITY_DEGREE',
        'VERIFY_SOLUTION'
      ]).toContain(prob.dna.taskType);

      // 4. Source Metadata validation
      expect(prob.dna.sourceMetadata).toBeDefined();
      expect(prob.dna.sourceMetadata?.sourceTitle).toContain('Castro');

      // 5. AST Structural Fingerprint validation
      expect(prob.dna.structuralFingerprint).toBeDefined();
      expect(prob.dna.structuralFingerprint?.nodeCount).toBeGreaterThanOrEqual(1);
      expect(prob.dna.structuralFingerprint?.treeDepth).toBeGreaterThanOrEqual(1);

      // 6. Full multi-stage validation passing
      const valReport = ContentValidator.validateProblemCandidate(prob);
      expect(valReport.isValid).toBe(true);
      expect(valReport.checks.conceptAligned).toBe(true);
      expect(valReport.checks.skillAligned).toBe(true);
      expect(valReport.checks.domainValid).toBe(true);

      const conceptReport = ConceptAlignmentValidator.validate(prob);
      expect(conceptReport.isValid).toBe(true);
    }
  });

  it('guarantees within-task diversity with AST structural similarity <= 0.70 while strictly preserving taskType (SOLVE_GENERAL_SOLUTION)', () => {
    const generatedProblems: any[] = [];
    const recentHistory: Array<{ signature: string; familyId: string }> = [];

    for (let step = 0; step < 5; step++) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0107',
        skillId: targetSkillId,
        taskType: 'SOLVE_GENERAL_SOLUTION',
        excludeProblemIds: generatedProblems.map(p => p.dna.problemId),
        excludeSignatures: generatedProblems.map(p => p.dna.structureSignature),
        excludeArchetypeIds: generatedProblems.slice(-2).map(p => p.dna.archetypeId).filter(Boolean),
        maxStructuralSimilarity: 0.70,
        previousProblems: generatedProblems
      }, recentHistory);

      expect(res.success).toBe(true);
      expect(res.problem).toBeDefined();

      const newProb = res.problem!;
      generatedProblems.push(newProb);
      recentHistory.push({
        signature: newProb.dna.structureSignature,
        familyId: newProb.dna.familyId,
        problem: newProb
      });
    }

    expect(generatedProblems.length).toBe(5);

    // 1. Task Preservation Invariant: ALL 5 problems MUST preserve SOLVE_GENERAL_SOLUTION
    for (const prob of generatedProblems) {
      expect(prob.dna.primarySkillId).toBe(targetSkillId);
      expect(prob.dna.conceptId).toBe(targetConceptId);
      expect(prob.dna.expectedMethod).toBe('SUBSTITUTION_Y_EQUALS_VX');
      expect(prob.dna.taskType).toBe('SOLVE_GENERAL_SOLUTION');
    }

    // 2. Structural Diversity Invariant: At least 3 distinct archetypes sampled within the same task
    const sampledArchetypes = new Set(generatedProblems.map(p => p.dna.archetypeId));
    expect(sampledArchetypes.size).toBeGreaterThanOrEqual(3);

    // 3. AST Structural Similarity Invariant: <= 0.70 between adjacent problems
    for (let i = 0; i < generatedProblems.length - 1; i++) {
      const pA = generatedProblems[i];
      const pB = generatedProblems[i + 1];

      const sim = calculateStructuralSimilarity(pA.dna.structuralFingerprint, pB.dna.structuralFingerprint);
      console.log(`Within-task similarity between step ${i + 1} (${pA.dna.archetypeId}) and step ${i + 2} (${pB.dna.archetypeId}):`, sim.toFixed(3));
      expect(sim).toBeLessThanOrEqual(0.70);
    }
  });

  it('implements Castro-informed mathematical complexity progression on Easier / Harder', () => {
    // Castro Progression across 5 difficulty levels for SOLVE_GENERAL_SOLUTION:
    // Level 1: Direct Ratio dy/dx = F(y/x) (Direct integration)
    // Level 2: Differential Form M dx + N dy = 0 (Grouping & standard logarithmic)
    // Level 3: Partial Fraction Separation in v
    // Level 4: Irreducible Quadratic Denominator (Inverse Trig arctan)
    // Level 5: Transcendental / Radical Separation (Trig or Radical)
    const levels = [1, 2, 3, 4, 5];
    const problemsByLevel: Record<number, any> = {};

    for (const lvl of levels) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0107',
        skillId: targetSkillId,
        difficulty: lvl,
        taskType: 'SOLVE_GENERAL_SOLUTION'
      });

      expect(res.success).toBe(true);
      expect(res.problem).toBeDefined();
      problemsByLevel[lvl] = res.problem!;

      // Syllabus supremacy check
      expect(res.problem!.dna.primarySkillId).toBe(targetSkillId);
      expect(res.problem!.dna.conceptId).toBe(targetConceptId);
      expect(res.problem!.dna.expectedMethod).toBe('SUBSTITUTION_Y_EQUALS_VX');
    }

    // Mathematical complexity progression validation:
    const lvl1 = problemsByLevel[1];
    const lvl3 = problemsByLevel[3];
    const lvl4 = problemsByLevel[4];

    expect(lvl1.dna.structuralFingerprint.operatorHistogram).toBeDefined();
    expect(lvl3.dna.structuralFingerprint.operatorHistogram).toBeDefined();
    expect(lvl4.dna.structuralFingerprint.operatorHistogram).toBeDefined();

    // Verify distinct structures across levels
    const sim1to3 = calculateStructuralSimilarity(lvl1.dna.structuralFingerprint, lvl3.dna.structuralFingerprint);
    const sim1to4 = calculateStructuralSimilarity(lvl1.dna.structuralFingerprint, lvl4.dna.structuralFingerprint);
    expect(sim1to3).toBeLessThanOrEqual(0.70);
    expect(sim1to4).toBeLessThanOrEqual(0.70);
  });

  it('supports "Another Like This" session flow rotating archetypes without method drift', () => {
    const curr = CurriculumRegistry.getInstance();
    const topic = curr.getTopicById('CURR-GEN0107-U2-T04');
    expect(topic).toBeDefined();

    const session = PracticeSessionManager.startSession('STUDENT-CASTRO-TEST', 'COURSE-GEN0107', {
      targetTopicId: 'CURR-GEN0107-U2-T04',
      targetSkillId: targetSkillId,
      sessionLength: 5
    });

    expect(session).toBeDefined();
    expect(session.currentProblem).toBeDefined();

    const sessionArchetypes: string[] = [];
    const sessionFingerprints: any[] = [];

    // Problem 1
    sessionArchetypes.push(session.currentProblem!.dna.archetypeId!);
    sessionFingerprints.push(session.currentProblem!.dna.structuralFingerprint!);

    // Next 4 problems
    for (let i = 0; i < 4; i++) {
      // Simulate student answering
      PracticeSessionManager.submitAttempt(session.id, {
        studentAnswer: 'y = x(ln|x| + C)',
        source: 'KEYBOARD',
        isCorrect: true,
        timeSpentSeconds: 30,
        hintLevelUsed: 0,
        solutionViewed: false
      });

      // Next problem with archetype exclusion
      const nextRes = PracticeSessionManager.nextProblem(session.id);
      expect(nextRes).toBeDefined();
      expect(nextRes.problem).toBeDefined();

      const prob = nextRes.problem!;

      // Syllabus supremacy check
      expect(prob.dna.primarySkillId).toBe(targetSkillId);
      expect(prob.dna.expectedMethod).toBe('SUBSTITUTION_Y_EQUALS_VX');
      expect(prob.dna.order).toBe(1);

      sessionArchetypes.push(prob.dna.archetypeId!);
      sessionFingerprints.push(prob.dna.structuralFingerprint!);
    }

    // Verify rotation of archetypes occurred in adaptive session
    const uniqueArchetypes = new Set(sessionArchetypes);
    expect(uniqueArchetypes.size).toBeGreaterThanOrEqual(3);

    // Verify adjacent similarity within threshold
    for (let i = 0; i < sessionFingerprints.length - 1; i++) {
      const sim = calculateStructuralSimilarity(sessionFingerprints[i], sessionFingerprints[i + 1]);
      expect(sim).toBeLessThanOrEqual(0.70);
    }
  });
});
