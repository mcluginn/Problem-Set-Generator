import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ConceptAlignmentValidator } from '../../src/engine/content/conceptValidator';
import { conceptRegistry } from '../../src/engine/content/conceptRegistry';
import { ARCHETYPE_REGISTRY } from '../../src/engine/content/archetypeRegistry';
import {
  calculateStructuralSimilarity,
  isParameterOnlyVariation,
  isStoryOnlyVariation
} from '../../src/engine/math/structuralFingerprint';
import { PracticeSessionManager } from '../../src/engine/adaptive/session';
import { CurriculumRegistry } from '../../src/engine/curriculum/registry';
import { ValidatedProblem } from '../../src/engine/content/types';

describe('Castro Application Archetypes & Pedagogical Diversity Integration', () => {
  const targetSkillId = 'SKILL-GEN0107-008';
  const targetConceptId = 'de_first_order_applications';

  it('verifies Castro Chapter 3 Application Archetypes are properly cataloged in ARCHETYPE_REGISTRY', () => {
    const expectedAppArchetypeIds = [
      'ARCH-APP-MIXING-CONSTANT-VOL',
      'ARCH-APP-MIXING-THRESHOLD-TIME',
      'ARCH-APP-MIXING-VARIABLE-VOL',
      'ARCH-APP-MIXING-PURE-FLUSH',
      'ARCH-APP-MIXING-WASHOUT-TIME',
      'ARCH-APP-COOLING-CONSTANT-AMBIENT',
      'ARCH-APP-COOLING-TIME-TARGET',
      'ARCH-APP-COOLING-TWO-POINT',
      'ARCH-APP-HEATING-CONSTANT-AMBIENT',
      'ARCH-APP-HEATING-TIME-TARGET',
      'ARCH-APP-DECAY-HALF-LIFE',
      'ARCH-APP-POPULATION-GROWTH-IVP',
      'ARCH-APP-POPULATION-DOUBLING',
      'ARCH-APP-ORTHOGONAL-ALGEBRAIC'
    ];

    for (const archId of expectedAppArchetypeIds) {
      const arch = ARCHETYPE_REGISTRY[archId];
      expect(arch, `Archetype ${archId} should exist in ARCHETYPE_REGISTRY`).toBeDefined();
      expect(arch.skillId).toBe(targetSkillId);
      expect(arch.conceptId).toBe(targetConceptId);
      expect(arch.sourceMetadata.sourceTitle).toContain('Castro');
      expect(arch.sourceMetadata.chapterOrSpread).toContain('Chapter 3');
      expect(arch.taskType).toBeDefined();
      expect(arch.associatedTemplateIds.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('strictly enforces the Syllabus Supremacy Invariant across all Castro application archetypes', () => {
    const concept = conceptRegistry.getConceptById(targetConceptId);
    expect(concept).toBeDefined();
    expect(concept!.order).toBe(1);
    expect(concept!.maxStructuralSimilarity).toBe(0.70);

    const families = [
      'FAM-GEN0107-MIXING-TANK',
      'FAM-GEN0107-APP-MIXING-CONSTANT',
      'FAM-GEN0107-APP-MIXING-VARIABLE',
      'FAM-GEN0107-APP-MIXING-DILUTION',
      'FAM-GEN0107-APP-COOLING-NEWTON',
      'FAM-GEN0107-APP-GROWTH-DECAY',
      'FAM-GEN0107-APP-ORTHOGONAL'
    ];

    for (const famId of families) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0107',
        skillId: targetSkillId,
        familyId: famId
      });

      expect(res.success, `Generation failed for family ${famId}`).toBe(true);
      expect(res.problem).toBeDefined();

      const prob = res.problem!;

      // 1. Syllabus Supremacy: Must belong to COURSE-GEN0107 and targetSkillId
      expect(prob.dna.courseId).toBe('COURSE-GEN0107');
      expect(prob.dna.primarySkillId).toBe(targetSkillId);
      expect(prob.dna.conceptId).toBe(targetConceptId);
      expect(prob.dna.order).toBe(1);

      // 2. Must NOT contain second-order characteristic equation terms
      expect(prob.statement.expressionLatex).not.toContain("y''");
      expect(prob.statement.expressionLatex).not.toContain('d^2y/dx^2');

      // 3. Task Type Layer validation
      expect(prob.dna.taskType).toBeDefined();
      expect([
        'SOLVE_INITIAL_VALUE_PROBLEM',
        'CALCULATE_THRESHOLD_TIME',
        'MODEL_AND_SOLVE',
        'SOLVE_GENERAL_SOLUTION'
      ]).toContain(prob.dna.taskType);

      // 4. Source Metadata validation
      expect(prob.dna.sourceMetadata).toBeDefined();
      expect(prob.dna.sourceMetadata?.sourceTitle).toContain('Castro');

      // 5. AST Structural Fingerprint validation
      expect(prob.dna.structuralFingerprint).toBeDefined();
      expect(prob.dna.structuralFingerprint?.applicationDomain).toBeDefined();
      expect(prob.dna.structuralFingerprint?.physicalConfiguration).toBeDefined();
      expect(prob.dna.structuralFingerprint?.governingModel).toBeDefined();
      expect(prob.dna.structuralFingerprint?.unknownTarget).toBeDefined();

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

  it('detects and strictly rejects Parameter-Only and Story-Only variations', () => {
    // Generate Problem A (Constant volume mixing tank, volume 80)
    const genA = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: targetSkillId,
      familyId: 'FAM-GEN0107-APP-MIXING-CONSTANT',
      templateId: 'TMPL-GEN0107-APP-MIX-CONST-SOLVE'
    });
    expect(genA.success).toBe(true);
    const probA = genA.problem!;

    // Generate Problem B with identical model but different volume
    const genB = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: targetSkillId,
      familyId: 'FAM-GEN0107-APP-MIXING-CONSTANT',
      templateId: 'TMPL-GEN0107-APP-MIX-CONST-SOLVE'
    });
    expect(genB.success).toBe(true);
    const probB = genB.problem!;

    // Generate Problem C (Dilution pure flush - different configuration and governing model)
    const genC = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: targetSkillId,
      familyId: 'FAM-GEN0107-APP-MIXING-DILUTION',
      templateId: 'TMPL-GEN0107-APP-MIX-DILUTION-FLUSH'
    });
    expect(genC.success).toBe(true);
    const probC = genC.problem!;

    // Generate Problem D (Newton cooling - different domain entirely)
    const genD = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: targetSkillId,
      familyId: 'FAM-GEN0107-APP-COOLING-NEWTON',
      templateId: 'TMPL-GEN0107-APP-COOL-DIRECT'
    });
    expect(genD.success).toBe(true);
    const probD = genD.problem!;

    // 1. isParameterOnlyVariation test
    expect(isParameterOnlyVariation(probA, probB)).toBe(true);
    expect(isParameterOnlyVariation(probA, probC)).toBe(false);
    expect(isParameterOnlyVariation(probA, probD)).toBe(false);

    // 2. isStoryOnlyVariation test
    // Create a superficial story clone of probA (renaming "tank" to "reservoir" and "salt" to "solute")
    const clonedProbA: ValidatedProblem = {
      ...probA,
      statement: {
        ...probA.statement,
        promptText: probA.statement.promptText.replace('tank', 'reservoir').replace('salt', 'contaminant')
      }
    };
    expect(isStoryOnlyVariation(probA, clonedProbA)).toBe(true);
    expect(isStoryOnlyVariation(probA, probC)).toBe(false);

    // 3. Similarity check: Parameter-only variations must have similarity >= 0.85
    const simAB = calculateStructuralSimilarity(probA.dna.structuralFingerprint!, probB.dna.structuralFingerprint!);
    expect(simAB).toBeGreaterThanOrEqual(0.85);

    // 4. Different configuration within same domain must have similarity <= 0.70
    const simAC = calculateStructuralSimilarity(probA.dna.structuralFingerprint!, probC.dna.structuralFingerprint!);
    expect(simAC).toBeLessThanOrEqual(0.70);

    // 5. Different application domain must have similarity <= 0.50
    const simAD = calculateStructuralSimilarity(probA.dna.structuralFingerprint!, probD.dna.structuralFingerprint!);
    expect(simAD).toBeLessThanOrEqual(0.50);
  });

  it('guarantees within-task diversity with AST structural similarity <= 0.70 while strictly preserving CALCULATE_THRESHOLD_TIME', () => {
    const generatedProblems: ValidatedProblem[] = [];
    const recentHistory: Array<{ signature: string; familyId: string; problem: ValidatedProblem }> = [];

    for (let step = 0; step < 5; step++) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0107',
        skillId: targetSkillId,
        taskType: 'CALCULATE_THRESHOLD_TIME',
        excludeProblemIds: generatedProblems.map(p => p.dna.problemId),
        excludeSignatures: generatedProblems.map(p => p.dna.structureSignature),
        excludeArchetypeIds: generatedProblems.slice(-1).map(p => p.dna.archetypeId).filter(Boolean),
        maxStructuralSimilarity: 0.70,
        previousProblems: generatedProblems
      }, recentHistory);

      expect(res.success, `Generation at step ${step + 1} failed: ${res.rejectionDetails}`).toBe(true);
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

    // 1. Task Preservation Invariant: ALL 5 problems MUST preserve CALCULATE_THRESHOLD_TIME
    for (const prob of generatedProblems) {
      expect(prob.dna.primarySkillId).toBe(targetSkillId);
      expect(prob.dna.conceptId).toBe(targetConceptId);
      expect(prob.dna.taskType).toBe('CALCULATE_THRESHOLD_TIME');
    }

    // 2. Structural Diversity Invariant: At least 3 distinct archetypes sampled within the same task
    const sampledArchetypes = new Set(generatedProblems.map(p => p.dna.archetypeId));
    expect(sampledArchetypes.size).toBeGreaterThanOrEqual(3);

    // 3. Zero parameter-only duplicates
    for (let i = 0; i < generatedProblems.length; i++) {
      for (let j = i + 1; j < generatedProblems.length; j++) {
        expect(
          isParameterOnlyVariation(generatedProblems[i], generatedProblems[j]),
          `Problems at step ${i + 1} and ${j + 1} must not be parameter-only duplicates`
        ).toBe(false);
      }
    }

    // 4. AST Structural Similarity Invariant: <= 0.70 between adjacent problems
    for (let i = 0; i < generatedProblems.length - 1; i++) {
      const pA = generatedProblems[i];
      const pB = generatedProblems[i + 1];

      const sim = calculateStructuralSimilarity(pA.dna.structuralFingerprint!, pB.dna.structuralFingerprint!);
      expect(sim).toBeLessThanOrEqual(0.70);
    }
  });

  it('guarantees within-task diversity with AST structural similarity <= 0.70 while strictly preserving SOLVE_INITIAL_VALUE_PROBLEM', () => {
    const generatedProblems: ValidatedProblem[] = [];
    const recentHistory: Array<{ signature: string; familyId: string; problem: ValidatedProblem }> = [];

    for (let step = 0; step < 5; step++) {
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0107',
        skillId: targetSkillId,
        taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
        excludeProblemIds: generatedProblems.map(p => p.dna.problemId),
        excludeSignatures: generatedProblems.map(p => p.dna.structureSignature),
        excludeArchetypeIds: generatedProblems.slice(-1).map(p => p.dna.archetypeId).filter(Boolean),
        maxStructuralSimilarity: 0.70,
        previousProblems: generatedProblems
      }, recentHistory);

      expect(res.success, `Generation at step ${step + 1} failed: ${res.rejectionDetails}`).toBe(true);
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

    // Task Preservation Invariant
    for (const prob of generatedProblems) {
      expect(prob.dna.primarySkillId).toBe(targetSkillId);
      expect(prob.dna.taskType).toBe('SOLVE_INITIAL_VALUE_PROBLEM');
    }

    // Diverse archetypes sampled
    const sampledArchetypes = new Set(generatedProblems.map(p => p.dna.archetypeId));
    expect(sampledArchetypes.size).toBeGreaterThanOrEqual(3);

    // Zero parameter-only duplicates
    for (let i = 0; i < generatedProblems.length; i++) {
      for (let j = i + 1; j < generatedProblems.length; j++) {
        expect(isParameterOnlyVariation(generatedProblems[i], generatedProblems[j])).toBe(false);
      }
    }
  });

  it('implements Castro-informed mathematical complexity progression on Easier / Harder', () => {
    // Level 1: Separable pure flush / exponential decay (pure washout)
    const resL1 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: targetSkillId,
      difficulty: 1
    });
    expect(resL1.success).toBe(true);
    const probL1 = resL1.problem!;
    expect(probL1.dna.difficultyVector.overall).toBeLessThanOrEqual(2);

    // Level 2: Constant volume mixing tank
    const resL2 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: targetSkillId,
      difficulty: 2
    });
    expect(resL2.success).toBe(true);
    const probL2 = resL2.problem!;

    // Level 3: Threshold time / two-point parameter extraction
    const resL3 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: targetSkillId,
      difficulty: 3
    });
    expect(resL3.success).toBe(true);
    const probL3 = resL3.problem!;

    // Level 4: Variable volume accumulation
    const resL4 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: targetSkillId,
      difficulty: 4
    });
    expect(resL4.success).toBe(true);
    const probL4 = resL4.problem!;

    // Structural diversity between levels
    const sim1to4 = calculateStructuralSimilarity(probL1.dna.structuralFingerprint!, probL4.dna.structuralFingerprint!);
    expect(sim1to4).toBeLessThanOrEqual(0.70);
  });

  it('supports "Another Like This" session flow rotating application models without method drift', () => {
    const curr = CurriculumRegistry.getInstance();
    const topic = curr.getTopicById('CURR-GEN0107-U2-T08');
    expect(topic).toBeDefined();

    const session = PracticeSessionManager.startSession('STUDENT-APP-TEST', 'COURSE-GEN0107', {
      targetTopicId: 'CURR-GEN0107-U2-T08',
      targetSkillId: targetSkillId,
      sessionLength: 5
    });

    expect(session).toBeDefined();
    expect(session.currentProblem).toBeDefined();

    const sessionArchetypes: string[] = [];
    const sessionFingerprints: any[] = [];
    const sessionProblems: ValidatedProblem[] = [];

    // Problem 1
    sessionArchetypes.push(session.currentProblem!.dna.archetypeId!);
    sessionFingerprints.push(session.currentProblem!.dna.structuralFingerprint!);
    sessionProblems.push(session.currentProblem!);

    // Next 4 problems
    for (let i = 0; i < 4; i++) {
      PracticeSessionManager.submitAttempt(session.id, {
        studentAnswer: 'm(t) = 160(1 - e^{-t/40})',
        source: 'KEYBOARD',
        isCorrect: true,
        timeSpentSeconds: 30,
        hintLevelUsed: 0,
        solutionViewed: false
      });

      const nextRes = PracticeSessionManager.nextProblem(session.id);
      expect(nextRes).toBeDefined();
      expect(nextRes.problem).toBeDefined();

      const prob = nextRes.problem!;
      expect(prob.dna.primarySkillId).toBe(targetSkillId);
      expect(prob.dna.order).toBe(1);

      sessionArchetypes.push(prob.dna.archetypeId!);
      sessionFingerprints.push(prob.dna.structuralFingerprint!);
      sessionProblems.push(prob);
    }

    // Verify rotation of archetypes occurred in adaptive session
    const uniqueArchetypes = new Set(sessionArchetypes);
    expect(uniqueArchetypes.size).toBeGreaterThanOrEqual(3);

    // Verify no parameter-only duplicates in session
    for (let i = 0; i < sessionProblems.length; i++) {
      for (let j = i + 1; j < sessionProblems.length; j++) {
        expect(isParameterOnlyVariation(sessionProblems[i], sessionProblems[j])).toBe(false);
      }
    }
  });

  it('100-Problem Stress Test: generates 100 application problems with 100% validity and high diversity', () => {
    let validCount = 0;
    const signatures = new Set<string>();
    const archetypes: Record<string, number> = {};
    let rollingHistory: ValidatedProblem[] = [];

    for (let i = 0; i < 100; i++) {
      const difficulty = (i % 4) + 1;
      const res = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0107',
        skillId: targetSkillId,
        difficulty,
        excludeArchetypeIds: rollingHistory.slice(-1).map(p => p.dna.archetypeId).filter(Boolean),
        excludeProblemIds: rollingHistory.slice(-2).map(p => p.dna.problemId),
        previousProblems: rollingHistory.slice(-2)
      });

      if (res.success && res.problem) {
        validCount++;
        signatures.add(res.problem.dna.structureSignature);
        const arch = res.problem.dna.archetypeId || 'UNKNOWN';
        archetypes[arch] = (archetypes[arch] || 0) + 1;

        if (rollingHistory.length > 0) {
          const prev = rollingHistory[rollingHistory.length - 1];
          // Assert adjacent problem is not a parameter-only duplicate
          expect(isParameterOnlyVariation(prev, res.problem)).toBe(false);
        }

        rollingHistory.push(res.problem);
        if (rollingHistory.length > 4) rollingHistory.shift();
      }
    }

    expect(validCount).toBe(100);
    // At least 4 distinct archetypes should be well-distributed across 100 generations
    expect(Object.keys(archetypes).length).toBeGreaterThanOrEqual(4);
  });
});
