/**
 * Multi-Course Adaptive Selector & Next Best Problem Engine
 * Engineering Practice Engine — Phase 7 Hard Topic Selection Invariant
 *
 * Implements the permanent architectural invariant:
 * Student-selected scope MUST dominate adaptive selection.
 * HARD CONSTRAINTS -> ELIGIBLE PROBLEM SET -> ADAPTIVE SCORING -> BEST ELIGIBLE PROBLEM
 */

import { AssessmentEvidenceTypeId, SIX_COURSE_SKILL_EVIDENCE_MAP } from '../content/assessmentEvidence';
import { ContentGenerator } from '../content/generator';
import { problemBank } from '../content/problemBank';
import { PROBLEM_FAMILIES_REGISTRY } from '../content/problemFamilies';
import { ContentRepresentationType, ValidatedProblem } from '../content/types';
import { curriculumRegistry } from '../curriculum/registry';
import { LEGACY_SKILL_TO_CLUSTER_MAP } from '../curriculum/goldenMasterRegistry';
import { MasteryEngine } from './mastery';
import { ScopeValidator } from './scopeValidator';
import {
  AdaptiveConstraintPolicy,
  AdaptiveDecision,
  AdaptiveDecisionReason,
  PracticeScope,
} from './types';

export class AdaptiveSelector {
  /**
   * Evaluates the student's mastery profile, active misconceptions, recent session history,
   * and hard constraints to select the optimal Next Best Problem across all six courses.
   *
   * Enforces HARD scope constraints BEFORE any adaptive ranking or scoring occurs.
   */
  public static selectNextBestProblem(
    studentId: string,
    courseIdOrScope: string | PracticeScope,
    recentHistory: Array<{ skillId: string; familyId?: string; problemId: string }> = [],
    policy?: AdaptiveConstraintPolicy
  ): AdaptiveDecision {
    // 1. Normalize PracticeScope
    const scope: PracticeScope = typeof courseIdOrScope === 'string'
      ? {
          courseId: courseIdOrScope,
          topicId: policy?.forceTopicId || policy?.allowedTopicIds?.[0],
          skillId: policy?.forceSkillId,
          allowedTopicIds: policy?.allowedTopicIds,
          allowedSkillIds: policy?.allowedSkillIds,
          disabledFamilyIds: policy?.disabledFamilyIds,
          difficultyRange: policy?.difficultyRange,
          forceDifficulty: policy?.forceDifficulty,
          forceArchetypeId: policy?.forceArchetypeId,
          forceTaskType: policy?.forceTaskType,
          excludeProblemIds: policy?.excludeProblemIds,
          excludeSignatures: policy?.excludeSignatures,
          excludeArchetypeIds: policy?.excludeArchetypeIds,
          examMode: policy?.examMode,
          mode: policy?.forceSkillId ? 'SKILL_PRACTICE' : policy?.forceTopicId ? 'TOPIC_PRACTICE' : 'RECOMMENDED'
        }
      : courseIdOrScope;

    const courseId = scope.courseId;
    const studentMasteries = MasteryEngine.getAllMasteries(studentId);

    // 2. HARD CONSTRAINT: Resolve Eligible Candidate Skills Set
    let candidateSkills = curriculumRegistry.getSkillsByCourse(courseId);

    // Filter by Topic Constraint
    if (scope.topicId) {
      const topicSkills = curriculumRegistry.getSkillsByTopic(scope.topicId);
      if (topicSkills.length > 0) {
        candidateSkills = topicSkills;
      } else {
        candidateSkills = candidateSkills.filter(s =>
          curriculumRegistry.isSkillInTopic(s.id, scope.topicId!)
        );
      }
    } else if (scope.allowedTopicIds && scope.allowedTopicIds.length > 0) {
      const allowedSkills = scope.allowedTopicIds.flatMap(tId => curriculumRegistry.getSkillsByTopic(tId));
      if (allowedSkills.length > 0) {
        candidateSkills = allowedSkills;
      } else {
        candidateSkills = candidateSkills.filter(s =>
          scope.allowedTopicIds!.includes(s.parentTopicId)
        );
      }
    }

    // Filter by Skill Constraint (Supporting skills do NOT qualify)
    if (scope.skillId) {
      const forcedSkill = curriculumRegistry.getSkillById(scope.skillId);
      if (forcedSkill && (!forcedSkill.parentCourseId || forcedSkill.parentCourseId === courseId)) {
        candidateSkills = [forcedSkill];
      } else {
        const mappedCluster = LEGACY_SKILL_TO_CLUSTER_MAP[scope.skillId] || scope.skillId;
        candidateSkills = candidateSkills.filter(s => s.id === scope.skillId || s.id === mappedCluster);
      }
    } else if (scope.allowedSkillIds && scope.allowedSkillIds.length > 0) {
      const allowed = new Set(scope.allowedSkillIds.flatMap(id => [id, LEGACY_SKILL_TO_CLUSTER_MAP[id] || id]));
      candidateSkills = candidateSkills.filter(s => allowed.has(s.id));
    }

    // Fail-closed if no curriculum skills match the requested scope
    if (candidateSkills.length === 0) {
      return {
        selectedProblem: undefined,
        selectedProblemId: 'NO_ELIGIBLE_PROBLEM',
        courseId,
        targetSkillId: scope.skillId || 'UNKNOWN',
        targetTopicId: scope.topicId,
        targetEvidenceType: 'DIRECT_CALCULATION',
        targetDifficulty: scope.forceDifficulty || 2,
        targetRepresentation: 'SYMBOLIC',
        reason: 'USER_REQUEST',
        explanation: `No curriculum skills match requested scope (${scope.topicId || scope.skillId || courseId}).`,
        teacherExplanation: 'Scope filtering resulted in empty candidate set.',
        supportingFactors: ['Zero matching curriculum skills found in active scope.'],
        confidence: 0,
        fallbackReason: 'NO_ELIGIBLE_PROBLEM'
      };
    }

    // 3. HARD CONSTRAINT: Explicit User Request or Teacher Override
    if (scope.skillId) {
      const forcedSkill = curriculumRegistry.getSkillById(scope.skillId);
      const mappedCluster = LEGACY_SKILL_TO_CLUSTER_MAP[scope.skillId] || scope.skillId;
      if (forcedSkill && candidateSkills.some(s => s.id === forcedSkill.id || s.id === mappedCluster || s.id === scope.skillId)) {
        const decision = AdaptiveSelector.buildDecisionForSkill(
          studentId,
          scope.skillId,
          scope,
          'USER_REQUEST',
          `Practicing selected skill: ${forcedSkill.canonicalName}.`,
          ['Explicit user skill selection requested.'],
          policy,
          recentHistory
        );
        if (decision.selectedProblem) return decision;
      }
    }

    // 4. PRIORITY 1: Targeted Misconception Remediation (Strictly within eligible candidate skills)
    for (const skill of candidateSkills) {
      const record = studentMasteries[skill.id];
      const activeMisc = record?.activeMisconceptions.find(m => !m.resolved && m.occurredCount >= 1);
      if (activeMisc) {
        const decision = AdaptiveSelector.buildDecisionForSkill(
          studentId,
          skill.id,
          scope,
          'REMEDIATION',
          `Targeted practice on ${skill.canonicalName} to address recent difficulty with ${activeMisc.name} (${activeMisc.code}).`,
          [
            `Active misconception recorded: ${activeMisc.name} (${activeMisc.code}).`,
            `Occurred ${activeMisc.occurredCount} time(s).`
          ],
          policy,
          recentHistory,
          activeMisc.code
        );
        if (decision.selectedProblem) return decision;
      }
    }

    // 5. PRIORITY 2: Prerequisite Remediation (Strictly within active scope and course)
    for (const skill of candidateSkills) {
      const mastery = studentMasteries[skill.id]?.masteryPercentage ?? 0;
      const attempts = studentMasteries[skill.id]?.totalAttempts ?? 0;

      if (attempts >= 2 && mastery < 50 && skill.prerequisiteSkillIds.length > 0) {
        for (const prereqId of skill.prerequisiteSkillIds) {
          const prereqSkill = candidateSkills.find(s => s.id === prereqId);
          if (prereqSkill && prereqSkill.parentCourseId === courseId) {
            const prereqMastery = studentMasteries[prereqId]?.masteryPercentage ?? 0;
            if (prereqMastery < 50) {
              const decision = AdaptiveSelector.buildDecisionForSkill(
                studentId,
                prereqSkill.id,
                scope,
                'PREREQUISITE',
                `Prerequisite review recommended: ${prereqSkill.canonicalName} foundational to ${skill.canonicalName}.`,
                [
                  `Current mastery in target skill (${skill.canonicalName}) is ${mastery}%.`,
                  `Foundational prerequisite mastery (${prereqSkill.canonicalName}) is ${prereqMastery}%.`
                ],
                policy,
                recentHistory
              );
              if (decision.selectedProblem) return decision;
            }
          }
        }
      }
    }

    // 6. PRIORITY 3: Representation & Application Transfer (Mastery >= 70%)
    for (const skill of candidateSkills) {
      const record = studentMasteries[skill.id];
      if (record && record.masteryPercentage >= 70 && record.masteryPercentage < 90) {
        const hasPhysical = (record.representationMastery['PHYSICAL'] ?? 0) > 60;
        const hasGraph = (record.representationMastery['GRAPHICAL'] ?? 0) > 60;

        if (!hasPhysical || !hasGraph) {
          const targetRep: ContentRepresentationType = !hasPhysical ? 'PHYSICAL' : 'GRAPHICAL';
          const decision = AdaptiveSelector.buildDecisionForSkill(
            studentId,
            skill.id,
            scope,
            'TRANSFER',
            `Application Transfer: You have strong proficiency in ${skill.canonicalName}. Advancing to real-world and graphical engineering contexts.`,
            [
              `Symbolic mastery achieved (${record.masteryPercentage}%).`,
              `Targeting contextual transfer (${targetRep} representation).`
            ],
            policy,
            recentHistory,
            undefined,
            targetRep
          );
          if (decision.selectedProblem) return decision;
        }
      }
    }

    // 7. PRIORITY 4: Growth Area / Lowest Mastery with Prerequisites Met (< 75%)
    const unmasteredSkills = candidateSkills
      .map(s => {
        const rec = studentMasteries[s.id];
        return {
          skill: s,
          mastery: rec?.masteryPercentage ?? 0,
          attempts: rec?.totalAttempts ?? 0
        };
      })
      .filter(item => item.mastery < 75)
      .sort((a, b) => a.mastery - b.mastery);

    for (const item of unmasteredSkills) {
      const recentlyPracticed = recentHistory.slice(-2).some(h => h.skillId === item.skill.id);
      if (recentlyPracticed && unmasteredSkills.length > 1) {
        continue;
      }

      const decision = AdaptiveSelector.buildDecisionForSkill(
        studentId,
        item.skill.id,
        scope,
        'PROGRESSION',
        `Recommended Practice: Focus on ${item.skill.canonicalName} to build core topic competence.`,
        [
          `Current mastery is ${item.mastery}%.`,
          `Targeting foundational skill progression.`
        ],
        policy,
        recentHistory
      );

      if (decision.selectedProblem) {
        return decision;
      }
    }

    // 8. PRIORITY 5: Spaced Retrieval for High Mastery Skills
    for (const skill of candidateSkills) {
      const record = studentMasteries[skill.id];
      if (record && record.masteryPercentage >= 75) {
        const recentlyPracticed = recentHistory.some(h => h.skillId === skill.id);
        if (!recentlyPracticed) {
          const decision = AdaptiveSelector.buildDecisionForSkill(
            studentId,
            skill.id,
            scope,
            'RETRIEVAL',
            `Spaced Retrieval: Refreshing ${skill.canonicalName} to retain long-term mastery.`,
            [
              `High prior mastery (${record.masteryPercentage}%).`,
              `Periodic retrieval reinforces memory retention.`
            ],
            policy,
            recentHistory
          );
          if (decision.selectedProblem) {
            return decision;
          }
        }
      }
    }

    // 9. IN-SCOPE FALLBACK: Try each authoritative skill strictly inside eligible set
    for (const fallbackSkill of candidateSkills) {
      const decision = AdaptiveSelector.buildDecisionForSkill(
        studentId,
        fallbackSkill.id,
        scope,
        'DIVERSITY',
        `Practicing core topic: ${fallbackSkill.canonicalName}.`,
        ['Standard curriculum sequencing within selected scope.'],
        policy,
        recentHistory
      );
      if (decision.selectedProblem) {
        return decision;
      }
    }

    // Fail closed: return no eligible problem within scope
    const fallbackSkill = candidateSkills[0];
    return {
      selectedProblem: undefined,
      selectedProblemId: 'NO_ELIGIBLE_PROBLEM',
      courseId,
      targetSkillId: fallbackSkill.id,
      targetTopicId: scope.topicId || fallbackSkill.parentTopicId,
      targetEvidenceType: 'DIRECT_CALCULATION',
      targetDifficulty: scope.forceDifficulty || 2,
      targetRepresentation: 'SYMBOLIC',
      reason: 'DIVERSITY',
      explanation: `No problems currently available for ${fallbackSkill.canonicalName} in active scope.`,
      teacherExplanation: 'All candidate skills evaluated with zero generated or cached problems.',
      supportingFactors: ['Zero eligible problems found in active scope.'],
      confidence: 0,
      fallbackReason: 'NO_ELIGIBLE_PROBLEM'
    };
  }

  /**
   * Builds an AdaptiveDecision, resolves evidence type and difficulty, and retrieves or generates
   * a validated problem strictly verified to satisfy the PracticeScope.
   */
  private static buildDecisionForSkill(
    studentId: string,
    skillId: string,
    scope: PracticeScope,
    reason: AdaptiveDecisionReason,
    explanation: string,
    supportingFactors: string[],
    policy?: AdaptiveConstraintPolicy,
    recentHistory: Array<{ skillId: string; familyId?: string; problemId: string }> = [],
    misconceptionTarget?: string,
    forcedRepresentation?: ContentRepresentationType
  ): AdaptiveDecision {
    const courseId = scope.courseId;
    const record = MasteryEngine.getSkillMastery(studentId, skillId);
    const mastery = record.masteryPercentage;

    // Determine target difficulty (1-4)
    let targetDifficulty = 2;
    const effectiveForceDifficulty = policy?.forceDifficulty !== undefined ? policy.forceDifficulty : scope.forceDifficulty;
    if (effectiveForceDifficulty !== undefined) {
      targetDifficulty = Math.max(1, Math.min(4, Math.round(effectiveForceDifficulty)));
    } else if (scope.difficultyRange || policy?.difficultyRange) {
      targetDifficulty = (scope.difficultyRange || policy?.difficultyRange)![0];
    } else if (mastery < 40) {
      targetDifficulty = 1;
    } else if (mastery < 70) {
      targetDifficulty = 2;
    } else if (mastery < 85) {
      targetDifficulty = 3;
    } else {
      targetDifficulty = 4;
    }

    // Determine target evidence type
    const evidenceMapping = SIX_COURSE_SKILL_EVIDENCE_MAP[skillId];
    const targetEvidence: AssessmentEvidenceTypeId =
      policy?.forceEvidenceType ||
      (evidenceMapping ? evidenceMapping.primaryEvidence : 'DIRECT_CALCULATION');

    // Determine target representation
    const targetRepresentation: ContentRepresentationType =
      forcedRepresentation ||
      policy?.forceRepresentation ||
      (mastery >= 70 ? 'PHYSICAL' : 'SYMBOLIC');

    // 1. Filter Problem Bank candidates strictly by hard scope eligibility, excluded problem IDs, and signatures
    const recentProblemIds = new Set<string>(recentHistory.map(h => h.problemId));
    if (scope.excludeProblemIds) {
      for (const id of scope.excludeProblemIds) recentProblemIds.add(id);
    }
    if (policy?.excludeProblemIds) {
      for (const id of policy.excludeProblemIds) recentProblemIds.add(id);
    }

    const excludedSignatures = new Set<string>();
    if (scope.excludeSignatures) {
      for (const sig of scope.excludeSignatures) if (sig) excludedSignatures.add(sig);
    }
    if (policy?.excludeSignatures) {
      for (const sig of policy.excludeSignatures) if (sig) excludedSignatures.add(sig);
    }

    const recentArchetypes = new Set<string>();
    if (scope.excludeArchetypeIds) {
      for (const arch of scope.excludeArchetypeIds) if (arch) recentArchetypes.add(arch);
    }
    if (policy?.excludeArchetypeIds) {
      for (const arch of policy.excludeArchetypeIds) if (arch) recentArchetypes.add(arch);
    }
    for (const h of recentHistory) {
      const p = problemBank.getProblemById(h.problemId);
      if (p?.dna?.archetypeId) {
        recentArchetypes.add(p.dna.archetypeId);
      }
    }

    const recentFamilies = new Set<string>();
    for (const h of recentHistory) {
      if (h.familyId) recentFamilies.add(h.familyId);
      const p = problemBank.getProblemById(h.problemId);
      const f = p?.dna?.problemFamilyId || p?.dna?.familyId || p?.dna?.skillClusterId;
      if (f) recentFamilies.add(f);
    }

    const targetTaskType = policy?.forceTaskType || scope.forceTaskType;

    const mappedClusters = curriculumRegistry.getClustersForSkill(skillId);
    const parentSkill = curriculumRegistry.getSkillForCluster(skillId);

    const isSkillCluster = !!curriculumRegistry.getSkillForCluster(skillId) || skillId.includes('-U');

    const eligibleBankProblems = problemBank.getEligibleProblems(scope).filter(
      p => {
        let matchesSkill = false;
        if (isSkillCluster) {
          matchesSkill = p.dna.skillClusterId === skillId || p.dna.primarySkillId === skillId;
        } else {
          matchesSkill = p.dna.primarySkillId === skillId ||
                         (p.dna.skillClusterId ? mappedClusters.includes(p.dna.skillClusterId) : false);
        }
        return matchesSkill && (!targetTaskType || p.dna.taskType === targetTaskType);
      }
    );

    const masterBankCandidates = eligibleBankProblems.filter(p => p.source === 'MASTER_BANK_780' || p.dna.source === 'MASTER_BANK_780').length;
    const generatorCandidates = Object.values(PROBLEM_FAMILIES_REGISTRY).filter(f =>
      f.courseId === courseId && (
        f.primarySkillId === skillId ||
        mappedClusters.includes(f.primarySkillId) ||
        (parentSkill && f.primarySkillId === parentSkill)
      )
    ).length;
    const legacyCandidates = eligibleBankProblems.filter(p => p.source === 'LEGACY_GOLDEN' || p.dna.source === 'LEGACY_GOLDEN').length;

    if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_TELEMETRY === 'true') {
      console.debug(`[AdaptiveSelector] Candidate pool for skill ${skillId}:`, {
        masterBankCandidates,
        generatorCandidates,
        legacyCandidates,
        totalEligibleBank: eligibleBankProblems.length
      });
    }

    // Prioritize unseen structural families and least-exposed families over repeated parameter variations
    const sortedBankProblems = [...eligibleBankProblems].sort((a, b) => {
      const famA = a.dna.problemFamilyId || a.dna.familyId || a.dna.skillClusterId || '';
      const famB = b.dna.problemFamilyId || b.dna.familyId || b.dna.skillClusterId || '';
      const seenA = recentFamilies.has(famA) ? 1 : 0;
      const seenB = recentFamilies.has(famB) ? 1 : 0;
      if (seenA !== seenB) return seenA - seenB;

      const expA = MasteryEngine.getFamilyExposureCount(studentId, famA);
      const expB = MasteryEngine.getFamilyExposureCount(studentId, famB);
      if (expA !== expB) return expA - expB;

      const isParamA = (a.isParameterVariation || a.dna.isParameterVariation) ? 1 : 0;
      const isParamB = (b.isParameterVariation || b.dna.isParameterVariation) ? 1 : 0;
      return isParamA - isParamB;
    });

    // Prioritize bank problems with distinct archetype & structural family for genuine variety
    let candidateProblem: ValidatedProblem | undefined = sortedBankProblems.find(
      p => !recentProblemIds.has(p.dna.problemId) &&
           !excludedSignatures.has(p.dna.structureSignature) &&
           (!p.dna.archetypeId || !recentArchetypes.has(p.dna.archetypeId)) &&
           (!targetTaskType || p.dna.taskType === targetTaskType) &&
           (effectiveForceDifficulty === undefined || Math.round(p.dna.difficultyVector.overall) === targetDifficulty) &&
           (p.dna.evidenceType === targetEvidence || !policy?.forceEvidenceType) &&
           (!misconceptionTarget || p.dna.misconceptionTarget === misconceptionTarget)
    );

    if (!candidateProblem && effectiveForceDifficulty !== undefined) {
      candidateProblem = sortedBankProblems.find(
        p => !recentProblemIds.has(p.dna.problemId) &&
             !excludedSignatures.has(p.dna.structureSignature) &&
             (!p.dna.archetypeId || !recentArchetypes.has(p.dna.archetypeId)) &&
             (!targetTaskType || p.dna.taskType === targetTaskType) &&
             Math.round(p.dna.difficultyVector.overall) === targetDifficulty
      );
    }

    // If all bank problems for target difficulty were already seen, allow selecting a master problem for parameter variation
    let willVaryMaster = false;
    if (!candidateProblem && sortedBankProblems.length > 0) {
      const bankMasterToVary = sortedBankProblems.find(
        p => (!targetTaskType || p.dna.taskType === targetTaskType) &&
             (effectiveForceDifficulty === undefined || Math.round(p.dna.difficultyVector.overall) === targetDifficulty) &&
             (p.dna.evidenceType === targetEvidence || !policy?.forceEvidenceType) &&
             (!misconceptionTarget || p.dna.misconceptionTarget === misconceptionTarget)
      );
      if (bankMasterToVary && (bankMasterToVary.source === 'MASTER_BANK_780' || bankMasterToVary.dna.source === 'MASTER_BANK_780')) {
        candidateProblem = bankMasterToVary;
        willVaryMaster = true;
      }
    }

    const matchingGenFamilies = Object.values(PROBLEM_FAMILIES_REGISTRY).filter(f =>
      f.courseId === courseId && (
        f.primarySkillId === skillId ||
        mappedClusters.includes(f.primarySkillId) ||
        (parentSkill && f.primarySkillId === parentSkill)
      )
    );

    const sortedGenFamilies = [...matchingGenFamilies].sort((a, b) => {
      const seenA = recentFamilies.has(a.id) ? 1 : 0;
      const seenB = recentFamilies.has(b.id) ? 1 : 0;
      if (seenA !== seenB) return seenA - seenB;
      return MasteryEngine.getFamilyExposureCount(studentId, a.id) - MasteryEngine.getFamilyExposureCount(studentId, b.id);
    });

    const leastExposedGenFamily = sortedGenFamilies[0];
    const genExposure = leastExposedGenFamily ? MasteryEngine.getFamilyExposureCount(studentId, leastExposedGenFamily.id) : Infinity;

    const bankExposure = candidateProblem
      ? MasteryEngine.getFamilyExposureCount(studentId, candidateProblem.dna.problemFamilyId || candidateProblem.dna.skillClusterId || '')
      : Infinity;

    // Prefer procedural generator if generator family is strictly less exposed, or for periodic diversity on exposed skills
    const preferGenerator = matchingGenFamilies.length > 0 && !willVaryMaster && (
      !candidateProblem ||
      (leastExposedGenFamily && !recentFamilies.has(leastExposedGenFamily.id) && (
        genExposure < bankExposure ||
        (bankExposure > 0 && record.totalAttempts % 3 === 2)
      ))
    );

    const generationHistory = Array.from(recentProblemIds)
      .map(id => problemBank.getProblemById(id))
      .filter(Boolean)
      .map(p => ({ signature: p!.dna.structureSignature, familyId: p!.dna.familyId, problem: p }));

    // 2. If generator preferred or no bank problem, generate dynamically constrained to target skill & scope
    if (preferGenerator || !candidateProblem) {
      const genResult = ContentGenerator.generateForSkill({
        courseId: courseId as any,
        skillId,
        familyId: leastExposedGenFamily?.id,
        evidenceType: targetEvidence,
        representation: targetRepresentation,
        difficulty: targetDifficulty,
        excludeProblemIds: Array.from(recentProblemIds),
        excludeSignatures: Array.from(excludedSignatures),
        excludeArchetypeIds: Array.from(recentArchetypes),
        archetypeId: policy?.forceArchetypeId || scope.forceArchetypeId,
        taskType: targetTaskType
      }, generationHistory);

      if (genResult.success && genResult.problem) {
        // Enforce delivery-time scope check on newly generated problem and verify not excluded
        if (
          ScopeValidator.isProblemEligible(genResult.problem, scope) &&
          !recentProblemIds.has(genResult.problem.dna.problemId) &&
          !excludedSignatures.has(genResult.problem.dna.structureSignature)
        ) {
          candidateProblem = genResult.problem;
          problemBank.storeProblem(genResult.problem);
        }
      }
    }

    // 3. Fallback within ELIGIBLE non-excluded bank problems for this skill only (Never return excluded problem or wrong difficulty)
    if (!candidateProblem) {
      candidateProblem = eligibleBankProblems.find(
        p => !recentProblemIds.has(p.dna.problemId) &&
             !excludedSignatures.has(p.dna.structureSignature) &&
             (!targetTaskType || p.dna.taskType === targetTaskType) &&
             (effectiveForceDifficulty === undefined || Math.round(p.dna.difficultyVector.overall) === targetDifficulty)
      );
    }

    // If still no candidate, retry generating with relaxed representation
    if (!candidateProblem) {
      const retryGen = ContentGenerator.generateForSkill({
        courseId: courseId as any,
        skillId,
        evidenceType: targetEvidence,
        difficulty: targetDifficulty,
        excludeProblemIds: Array.from(recentProblemIds),
        excludeSignatures: Array.from(excludedSignatures),
        excludeArchetypeIds: Array.from(recentArchetypes),
        archetypeId: policy?.forceArchetypeId || scope.forceArchetypeId,
        taskType: targetTaskType
      }, generationHistory);
      if (retryGen.success && retryGen.problem) {
        if (
          ScopeValidator.isProblemEligible(retryGen.problem, scope) &&
          !recentProblemIds.has(retryGen.problem.dna.problemId) &&
          !excludedSignatures.has(retryGen.problem.dna.structureSignature)
        ) {
          candidateProblem = retryGen.problem;
          problemBank.storeProblem(retryGen.problem);
        }
      }
    }

    // 4. Graceful Fallback: If no candidate with a distinct signature was found (e.g. single-template skill),
    // accept a newly generated candidate or bank problem with a unique problem ID so the student is never blocked.
    if (!candidateProblem) {
      const uniqueGen = ContentGenerator.generateForSkill({
        courseId: courseId as any,
        skillId,
        evidenceType: targetEvidence,
        difficulty: targetDifficulty,
        excludeProblemIds: Array.from(recentProblemIds),
        taskType: targetTaskType
      });
      if (
        uniqueGen.success &&
        uniqueGen.problem &&
        ScopeValidator.isProblemEligible(uniqueGen.problem, scope) &&
        !recentProblemIds.has(uniqueGen.problem.dna.problemId)
      ) {
        candidateProblem = uniqueGen.problem;
        problemBank.storeProblem(uniqueGen.problem);
      }
    }

    if (!candidateProblem) {
      candidateProblem = eligibleBankProblems.find(
        p => !recentProblemIds.has(p.dna.problemId) &&
             (effectiveForceDifficulty === undefined || Math.round(p.dna.difficultyVector.overall) === targetDifficulty)
      );
    }

    if (candidateProblem) {
      // If selected from MASTER_BANK_780 and previously exposed, produce a calibrated parameter variation
      if (candidateProblem.source === 'MASTER_BANK_780' || candidateProblem.dna.source === 'MASTER_BANK_780') {
        const famId = candidateProblem.dna.problemFamilyId || candidateProblem.dna.skillClusterId || '';
        const seenCount = MasteryEngine.getFamilyExposureCount(studentId, famId);
        if (seenCount > 0 || recentFamilies.has(famId)) {
          candidateProblem = ContentGenerator.generateVariationFromMaster(candidateProblem);
        }
      }

      // Ensure provenance fields are populated on problem root and DNA
      candidateProblem.source = candidateProblem.source || candidateProblem.dna.source || 'MASTER_BANK_780';
      candidateProblem.dna.source = candidateProblem.source;
      if (candidateProblem.dna.masterProblemId) {
        candidateProblem.masterProblemId = candidateProblem.dna.masterProblemId;
      }
      if (candidateProblem.dna.problemFamilyId) {
        candidateProblem.problemFamilyId = candidateProblem.dna.problemFamilyId;
      }
      if (candidateProblem.dna.skillClusterId) {
        candidateProblem.skillClusterId = candidateProblem.dna.skillClusterId;
      }
      candidateProblem.isParameterVariation = candidateProblem.isParameterVariation ?? candidateProblem.dna.isParameterVariation ?? false;
      candidateProblem.dna.isParameterVariation = candidateProblem.isParameterVariation;

      // Log development telemetry
      if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_TELEMETRY === 'true') {
        console.debug('[AdaptiveSelector] Selected question telemetry:', {
          source: candidateProblem.source,
          masterProblemId: candidateProblem.masterProblemId,
          problemFamilyId: candidateProblem.problemFamilyId,
          skillClusterId: candidateProblem.skillClusterId,
          difficulty: candidateProblem.dna.difficultyVector.overall,
          isParameterVariation: candidateProblem.isParameterVariation
        });
      }
    }

    // Fail closed: If no candidate problem can be found or generated for this skill, return null
    // NEVER fall back to an out-of-scope problem or arbitrary course problem!
    const selectedProblemId = candidateProblem ? candidateProblem.dna.problemId : 'NO_ELIGIBLE_PROBLEM';

    return {
      selectedProblem: candidateProblem,
      selectedProblemId,
      courseId,
      targetSkillId: skillId,
      targetTopicId: scope.topicId || candidateProblem?.dna.topicId,
      targetEvidenceType: targetEvidence,
      targetDifficulty,
      targetRepresentation,
      reason,
      explanation,
      teacherExplanation: `Adaptive Selection (${reason}): ${supportingFactors.join(' ')}`,
      supportingFactors,
      confidence: Math.min(1.0, 0.5 + (record.totalAttempts / 10)),
      fallbackReason: candidateProblem ? undefined : 'NO_ELIGIBLE_PROBLEM'
    };
  }
}
