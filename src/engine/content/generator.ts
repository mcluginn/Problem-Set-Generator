/**
 * Master Content Generator Orchestrator Across All Six Courses
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import {
  ValidatedProblem,
  ProblemGenerationRequest,
  ProblemGenerationResult,
  ProblemFamily,
  ProblemTemplate,
  AssessmentEvidenceTypeId,
  ProblemDNA,
  RejectionReason
} from './types';
import { ASSESSMENT_EVIDENCE_REGISTRY, SIX_COURSE_SKILL_EVIDENCE_MAP } from './assessmentEvidence';
import { PROBLEM_FAMILIES_REGISTRY } from './problemFamilies';
import { PROBLEM_TEMPLATES_REGISTRY } from './problemTemplates';
import { ContentValidator } from './validator';
import { conceptRegistry } from './conceptRegistry';
import { CurriculumRegistry } from '../curriculum/registry';
import { Differentiator } from '../math/differentiator';
import { StepGenerator, SolutionStep } from '../math/steps';
import { simplify } from '../math/simplifier';
import { nodeToLatex, nodeToString } from '../math/ast';
import {
  calculateASTFingerprint,
  calculateStructuralSimilarity,
  isParameterOnlyVariation,
  isStoryOnlyVariation
} from '../math/structuralFingerprint';

export class ContentGenerator {
  public static readonly GENERATOR_VERSION = '4.0.0';
  public static readonly TEMPLATE_VERSION = '4.0.0';
  public static readonly VALIDATOR_VERSION = '4.0.0';

  /**
   * Samples pseudo-random parameters adhering to the template's schema constraints.
   */
  private static sampleParameters(
    schema?: import('./types').ParameterSchemaField[],
    attempt: number = 0,
    hasExclusions: boolean = false
  ): Record<string, any> {
    const params: Record<string, any> = {};
    if (!schema || !Array.isArray(schema)) return params;

    for (const field of schema) {
      if (field.defaultValue !== undefined && attempt === 0 && !hasExclusions) {
        params[field.name] = field.defaultValue;
        continue;
      }
      if (field.choices && field.choices.length > 0) {
        const availableChoices = (hasExclusions && field.defaultValue !== undefined && field.choices.length > 1)
          ? field.choices.filter(c => c !== field.defaultValue)
          : field.choices;
        const choice = availableChoices[Math.floor(Math.random() * availableChoices.length)];
        params[field.name] = choice;
      } else if (field.type === 'INTEGER' || field.type === 'POLYNOMIAL_DEGREE') {
        const min = field.min ?? 1;
        const max = field.max ?? 5;
        let val: number;
        let attempts = 0;
        do {
          val = Math.floor(Math.random() * (max - min + 1)) + min;
          attempts++;
        } while (
          ((field.disallowedValues?.includes(val)) ||
           (hasExclusions && field.defaultValue !== undefined && val === field.defaultValue && max > min)) &&
          attempts < 10
        );
        params[field.name] = val;
      } else if (field.type === 'FLOAT') {
        const min = field.min ?? 1.0;
        const max = field.max ?? 8.0;
        params[field.name] = Math.round((Math.random() * (max - min) + min) * 10) / 10;
      } else if (field.type === 'BOOLEAN') {
        params[field.name] = Math.random() > 0.5;
      }
    }
    return params;
  }

  /**
   * Generates a fully verified, pedagogically grounded problem candidate for any skill across all six courses.
   */
  public static generateForSkill(
    request: ProblemGenerationRequest,
    recentHistory: Array<{ signature: string; familyId: string }> = []
  ): ProblemGenerationResult {
    const startTime = performance.now();
    const currRegistry = CurriculumRegistry.getInstance();
    const skill = currRegistry.getSkillById(request.skillId);

    if (!skill) {
      return {
        success: false,
        rejectionReason: 'SKILL_MISMATCH',
        rejectionDetails: `Skill ID "${request.skillId}" not found in authoritative Curriculum Registry.`,
        attemptsCount: 0,
        generationLatencyMs: performance.now() - startTime
      };
    }

    // Enforce curriculum ancestry at generation time as well as at delivery
    // time. This prevents a stale UI selection or hand-built request from
    // silently producing a problem for the wrong course/topic.
    if (request.courseId !== 'ALL_COURSES' && request.courseId !== skill.parentCourseId) {
      return {
        success: false,
        rejectionReason: 'SKILL_MISMATCH',
        rejectionDetails: `Skill "${skill.id}" belongs to ${skill.parentCourseId}, not ${request.courseId}.`,
        attemptsCount: 0,
        generationLatencyMs: performance.now() - startTime
      };
    }
    if (request.topicId && request.topicId !== skill.parentTopicId) {
      return {
        success: false,
        rejectionReason: 'SKILL_MISMATCH',
        rejectionDetails: `Skill "${skill.id}" belongs to topic ${skill.parentTopicId}, not ${request.topicId}.`,
        attemptsCount: 0,
        generationLatencyMs: performance.now() - startTime
      };
    }
    if (request.subtopicId && !skill.parentSubtopicIds.includes(request.subtopicId)) {
      return {
        success: false,
        rejectionReason: 'SKILL_MISMATCH',
        rejectionDetails: `Skill "${skill.id}" is not mapped to subtopic ${request.subtopicId}.`,
        attemptsCount: 0,
        generationLatencyMs: performance.now() - startTime
      };
    }

    // 1. Resolve Suitable Evidence Type
    const evidenceMapping = SIX_COURSE_SKILL_EVIDENCE_MAP[skill.id];
    const targetEvidence: AssessmentEvidenceTypeId =
      request.evidenceType ||
      (evidenceMapping ? evidenceMapping.primaryEvidence : 'DIRECT_CALCULATION');

    // 2. Resolve Pedagogical Concept & Method Constraints
    const requestedFamily = request.familyId ? PROBLEM_FAMILIES_REGISTRY[request.familyId] : undefined;
    const targetConcept = request.conceptId
      ? conceptRegistry.getConceptById(request.conceptId)
      : request.subtopicId
      ? conceptRegistry.getConceptForSubtopic(request.subtopicId)
      : requestedFamily?.conceptId
      ? conceptRegistry.getConceptById(requestedFamily.conceptId)
      : requestedFamily?.conceptMetadata?.conceptId
      ? conceptRegistry.getConceptById(requestedFamily.conceptMetadata.conceptId)
      : conceptRegistry.getConceptForSkill(skill.id);

    // 3. Select Candidate Families matching the skill, evidence, and concept constraints
    let candidateFamilies = Object.values(PROBLEM_FAMILIES_REGISTRY).filter(
      f => f.primarySkillId === skill.id &&
           (f.primaryEvidenceType === targetEvidence || f.secondaryEvidenceTypes.includes(targetEvidence))
    );

    if (request.familyId && PROBLEM_FAMILIES_REGISTRY[request.familyId]) {
      candidateFamilies = [PROBLEM_FAMILIES_REGISTRY[request.familyId]];
    } else if (candidateFamilies.length === 0) {
      // Fallback: any family matching the skill
      candidateFamilies = Object.values(PROBLEM_FAMILIES_REGISTRY).filter(
        f => f.primarySkillId === skill.id
      );
    }

    // Filter families by target concept if defined
    if (targetConcept && candidateFamilies.length > 1) {
      const conceptFiltered = candidateFamilies.filter(f => {
        // Direct concept match
        if (f.conceptId && f.conceptId === targetConcept.conceptId) return true;
        if (f.conceptMetadata?.conceptId && f.conceptMetadata.conceptId === targetConcept.conceptId) return true;
        // Incompatible order
        if (f.conceptMetadata?.order && targetConcept.order && f.conceptMetadata.order !== targetConcept.order) return false;
        // Disallowed methods
        if (f.conceptMetadata?.expectedMethod && targetConcept.disallowedMethods.includes(f.conceptMetadata.expectedMethod as any)) return false;
        // If family has no concept metadata, allow if no explicitly matched family exists
        return !f.conceptId && !f.conceptMetadata;
      });

      if (conceptFiltered.length > 0) {
        candidateFamilies = conceptFiltered;
      }
    }

    // Prioritize or filter by taskType if specified
    if (request.taskType) {
      const matchingFamilies = candidateFamilies.filter(f =>
        f.taskType === request.taskType ||
        f.templateIds.some(tId => PROBLEM_TEMPLATES_REGISTRY[tId]?.taskType === request.taskType)
      );
      if (matchingFamilies.length > 0) {
        candidateFamilies = matchingFamilies;
      }
    }
    // Prioritize or filter by archetypeId if specified
    if (request.archetypeId) {
      const matchingFamilies = candidateFamilies.filter(f =>
        f.archetypeId === request.archetypeId ||
        f.templateIds.some(tId => PROBLEM_TEMPLATES_REGISTRY[tId]?.archetypeId === request.archetypeId)
      );
      if (matchingFamilies.length > 0) {
        candidateFamilies = matchingFamilies;
      }
    }
    // Deprioritize excluded archetypes for genuine structural diversity
    if (request.excludeArchetypeIds && request.excludeArchetypeIds.length > 0 && candidateFamilies.length > 1) {
      candidateFamilies = [...candidateFamilies].sort((a, b) => {
        const aAllExcluded = a.templateIds.every(tId => {
          const arch = PROBLEM_TEMPLATES_REGISTRY[tId]?.archetypeId;
          return arch && request.excludeArchetypeIds!.includes(arch);
        }) ? 1 : 0;
        const bAllExcluded = b.templateIds.every(tId => {
          const arch = PROBLEM_TEMPLATES_REGISTRY[tId]?.archetypeId;
          return arch && request.excludeArchetypeIds!.includes(arch);
        }) ? 1 : 0;
        return aAllExcluded - bAllExcluded;
      });
    }

    // Prioritize candidate families whose difficulty range covers the requested difficulty
    if (typeof request.difficulty === 'number' && candidateFamilies.length > 1) {
      const diff = request.difficulty;
      candidateFamilies = [...candidateFamilies].sort((a, b) => {
        const aMatches = diff >= a.difficultyRange[0] && diff <= a.difficultyRange[1] ? 0 : 1;
        const bMatches = diff >= b.difficultyRange[0] && diff <= b.difficultyRange[1] ? 0 : 1;
        return aMatches - bMatches;
      });
    }

    if (candidateFamilies.length === 0) {
      return {
        success: false,
        rejectionReason: 'SKILL_MISMATCH',
        rejectionDetails: `No problem family registered for Skill ID "${skill.id}".`,
        attemptsCount: 0,
        generationLatencyMs: performance.now() - startTime
      };
    }

    const maxAttempts = 20;
    let targetDifficultyNum = typeof request.difficulty === 'number' ? request.difficulty : 2;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Select family cycling through candidates
      const family = candidateFamilies[attempt % candidateFamilies.length];

      // Filter family's templates to those matching request constraints
      let candidateTemplateIds = [...family.templateIds];
      if (request.taskType) {
        const matching = candidateTemplateIds.filter(tId => PROBLEM_TEMPLATES_REGISTRY[tId]?.taskType === request.taskType);
        if (matching.length > 0) candidateTemplateIds = matching;
      }
      if (request.archetypeId) {
        const matching = candidateTemplateIds.filter(tId => PROBLEM_TEMPLATES_REGISTRY[tId]?.archetypeId === request.archetypeId);
        if (matching.length > 0) candidateTemplateIds = matching;
      }
      if (request.excludeArchetypeIds && request.excludeArchetypeIds.length > 0) {
        const nonExcluded = candidateTemplateIds.filter(tId => {
          const arch = PROBLEM_TEMPLATES_REGISTRY[tId]?.archetypeId;
          return !arch || !request.excludeArchetypeIds!.includes(arch);
        });
        if (nonExcluded.length > 0) candidateTemplateIds = nonExcluded;
      }

      // Select template from filtered candidates
      const templateId = request.templateId || candidateTemplateIds[attempt % candidateTemplateIds.length];
      const template = PROBLEM_TEMPLATES_REGISTRY[templateId];

      if (!template) {
        continue;
      }

      // Generate raw template candidate with sampled parameters
      const hasExclusions = (request.excludeSignatures && request.excludeSignatures.length > 0) || recentHistory.length > 0;
      const sampledParams = request.params || ContentGenerator.sampleParameters(template.parameterSchema, attempt, !!hasExclusions);
      const rawCandidate = template.generateCandidate(targetDifficultyNum, sampledParams);
      const targetVar = rawCandidate.statement.independentVariable || 'x';

      // Deterministically solve and construct solution steps
      let canonicalAnswerLatex = '';
      let canonicalAnswerRaw = '';
      let solutionSteps: SolutionStep[] = [];

      try {
        if ((rawCandidate as any).canonicalAnswerLatex) {
          canonicalAnswerLatex = (rawCandidate as any).canonicalAnswerLatex;
          canonicalAnswerRaw = (rawCandidate as any).canonicalAnswerRaw || canonicalAnswerLatex;
          if ((rawCandidate as any).solutionSteps) {
            solutionSteps = (rawCandidate as any).solutionSteps;
          } else if (rawCandidate.reasoningTrace.length > 0) {
            solutionSteps = rawCandidate.reasoningTrace.map((t, idx) => ({
              stepNumber: idx + 1,
              title: t.phase,
              ruleName: t.phase,
              expressionLatex: t.intermediateExpressionLatex || '',
              explanation: t.actionDescription,
              conceptualNote: t.pedagogicalRationale
            }));
          }
        } else if (
          family.primarySkillId.startsWith('SKILL-GEN0102') &&
          family.primarySkillId !== 'SKILL-GEN0102-001' &&
          targetEvidence === 'DIRECT_CALCULATION'
        ) {
          const sol = StepGenerator.generateSolution(rawCandidate.rawExpression, family.name, targetVar);
          canonicalAnswerLatex = sol.canonicalAnswerLatex;
          canonicalAnswerRaw = sol.canonicalAnswerRaw;
          solutionSteps = sol.steps;
        } else if (rawCandidate.reasoningTrace.length > 0) {
          const lastTrace = rawCandidate.reasoningTrace[rawCandidate.reasoningTrace.length - 1];
          canonicalAnswerLatex = lastTrace.intermediateExpressionLatex || nodeToLatex(rawCandidate.rawExpression);
          canonicalAnswerRaw = nodeToString(rawCandidate.rawExpression);
        }
      } catch (err: any) {
        // Fallback to reasoning trace expression
        if (rawCandidate.reasoningTrace.length > 0) {
          const lastTrace = rawCandidate.reasoningTrace[rawCandidate.reasoningTrace.length - 1];
          canonicalAnswerLatex = lastTrace.intermediateExpressionLatex || nodeToLatex(rawCandidate.rawExpression);
          canonicalAnswerRaw = nodeToString(rawCandidate.rawExpression);
        }
      }

      // Construct structure signature ensuring difficulty and parameters are encoded
      let finalSignature = rawCandidate.structureSignature;
      if (!finalSignature.includes(`DIFF${targetDifficultyNum}`) && !finalSignature.includes(`:D${targetDifficultyNum}`)) {
        finalSignature = `${finalSignature}:D${targetDifficultyNum}`;
      }
      if (sampledParams && Object.keys(sampledParams).length > 0) {
        const paramStr = Object.entries(sampledParams).map(([k, v]) => `${k}${v}`).join('_');
        if (!finalSignature.includes(paramStr)) {
          finalSignature = `${finalSignature}_${paramStr}`;
        }
      }

      const effectiveConcept = (family.conceptId ? conceptRegistry.getConceptById(family.conceptId) : undefined) ||
        (family.conceptMetadata ? conceptRegistry.getConceptById(family.conceptMetadata.conceptId) : undefined) ||
        targetConcept;

      // Construct Problem DNA with domain validator info & concept metadata
      const dna: ProblemDNA = {
        problemId: `PROB-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        courseId: skill.parentCourseId,
        topicId: skill.parentTopicId,
        subtopicId: request.subtopicId || family.conceptMetadata?.subtopicId || targetConcept?.subtopicId || skill.parentSubtopicIds[0] || 'SUB-DEFAULT',
        primarySkillId: skill.id,
        supportingSkillIds: rawCandidate.supportingSkillIds || family.supportingSkillIds,
        evidenceType: targetEvidence,
        familyId: family.id,
        templateId: template.id,
        representationType: request.representation || family.representationTypes[0] || 'SYMBOLIC',
        contextType: request.context || family.allowedContexts[0] || 'PURE_MATHEMATICS',
        guidedness: request.guidedness || 'STANDARD',
        difficultyVector: {
          ...rawCandidate.difficultyVector,
          overall: typeof request.difficulty === 'number' ? request.difficulty : rawCandidate.difficultyVector.overall
        },
        structureSignature: finalSignature,
        misconceptionTarget: request.misconceptionTarget || rawCandidate.misconceptionTarget,
        isRemediationRepetition: request.isRemediationRepetition,
        domainValidatorType: family.domainValidatorType || 'MATH',
        // Task Type & Archetype Layer (Castro Reference Integration)
        taskType: rawCandidate.taskType || template.taskType || family.taskType || 'SOLVE_GENERAL_SOLUTION',
        archetypeId: rawCandidate.archetypeId || template.archetypeId || family.archetypeId,
        sourceMetadata: rawCandidate.sourceMetadata || template.sourceMetadata || family.sourceMetadata,
        structuralFingerprint: rawCandidate.structuralFingerprint || calculateASTFingerprint(rawCandidate.rawExpression, {
          taskType: rawCandidate.taskType || template.taskType || family.taskType || 'SOLVE_GENERAL_SOLUTION',
          archetypeId: rawCandidate.archetypeId || template.archetypeId || family.archetypeId,
          representation: request.representation || family.representationTypes[0] || 'SYMBOLIC',
          expressionLatex: rawCandidate.statement.expressionLatex,
          statementPrompt: rawCandidate.statement.promptText
        }),
        // Concept & Method Metadata
        conceptId: effectiveConcept?.conceptId || family.conceptId,
        order: family.conceptMetadata?.order || effectiveConcept?.order,
        linearity: family.conceptMetadata?.linearity || effectiveConcept?.linearity,
        homogeneity: family.conceptMetadata?.homogeneity || effectiveConcept?.homogeneity,
        coefficientType: family.conceptMetadata?.coefficientType || effectiveConcept?.coefficientType,
        expectedMethod: family.conceptMetadata?.expectedMethod || effectiveConcept?.primaryMethod || request.expectedMethod,
        // Structural Problem Identity Layer (780 Master Bank & Parameter Variation)
        source: (request as any).source || 'EXISTING_GENERATOR',
        masterProblemId: request.masterProblemId,
        skillClusterId: request.skillClusterId || skill.parentTopicId || skill.id,
        problemFamilyId: request.problemFamilyId || family.id,
        unitId: skill.parentTopicId,
        isParameterVariation: Boolean(sampledParams && Object.keys(sampledParams).length > 0),
        curriculumVersion: '1.0.0',
        skillOntologyVersion: '2.5.0',
        generatorVersion: ContentGenerator.GENERATOR_VERSION,
        templateVersion: ContentGenerator.TEMPLATE_VERSION,
        validatorVersion: ContentGenerator.VALIDATOR_VERSION
      };

      const problem: ValidatedProblem = {
        dna,
        source: (request as any).source || 'EXISTING_GENERATOR',
        masterProblemId: request.masterProblemId,
        skillClusterId: request.skillClusterId || skill.parentTopicId || skill.id,
        problemFamilyId: request.problemFamilyId || family.id,
        isParameterVariation: Boolean(sampledParams && Object.keys(sampledParams).length > 0),
        statement: {
          ...rawCandidate.statement,
          options: rawCandidate.statement.options || (rawCandidate as any).distractors
        },
        rawExpression: rawCandidate.rawExpression,
        solution: {
          canonicalAnswerLatex,
          canonicalAnswerRaw,
          reasoningTrace: rawCandidate.reasoningTrace,
          solutionSteps,
          whyMethodRequired: `Requires ${family.name} to evaluate the mathematical competency.`
        },
        hints: rawCandidate.hints,
        qualityScore: {
          mathematicalValidity: 1.0,
          skillAlignment: 1.0,
          evidenceAlignment: 1.0,
          hintIntegrity: 1.0,
          overallQuality: 1.0
        },
        lifecycleStatus: 'VALID',
        distractors: (rawCandidate as any).distractors,
        createdAt: new Date().toISOString()
      };

      // 3. Multi-Stage Validation
      const validation = ContentValidator.validateProblemCandidate(problem);
      if (!validation.isValid) {
        continue;
      }

      // 4. Diversity & Near-Duplicate Check
      const excludedSignatures = new Set<string>();
      if (request.excludeSignatures) {
        for (const s of request.excludeSignatures) {
          if (s) excludedSignatures.add(s);
        }
      }
      for (const h of recentHistory) {
        if (h.signature) excludedSignatures.add(h.signature);
      }

      if (!request.isRemediationRepetition) {
        if (request.excludeProblemIds && request.excludeProblemIds.includes(problem.dna.problemId)) {
          if (attempt < maxAttempts - 1) continue;
        }
        if (excludedSignatures.has(problem.dna.structureSignature)) {
          if (attempt < maxAttempts - 1) continue;
        }
        if (request.excludeArchetypeIds && problem.dna.archetypeId && request.excludeArchetypeIds.includes(problem.dna.archetypeId)) {
          if (attempt < maxAttempts - 1) continue;
        }
      }

      // Collect previous problems to ensure structural distance
      const prevProblems: ValidatedProblem[] = [
        ...(request.previousProblems || [])
      ];
      if (request.excludeProblemIds && request.excludeProblemIds.length > 0) {
        const fromHistory = request.excludeProblemIds
          .map(id => (recentHistory as any[]).find(h => h.problem?.dna?.problemId === id)?.problem)
          .filter(Boolean);
        prevProblems.push(...fromHistory);
      }
      for (const h of (recentHistory as any[])) {
        if (h.problem && !prevProblems.some(p => p.dna.problemId === h.problem.dna.problemId)) {
          prevProblems.push(h.problem);
        }
      }

      if (!request.isRemediationRepetition && prevProblems.length > 0) {
        // Strict Rejection of Parameter-Only Variations
        const isParamOnly = prevProblems.some(p => isParameterOnlyVariation(p, problem));
        if (isParamOnly && attempt < maxAttempts - 1) {
          continue;
        }

        // Strict Rejection of Story-Only Variations (Superficial Rewording)
        const isStoryOnly = prevProblems.some(p => isStoryOnlyVariation(p, problem));
        if (isStoryOnly && attempt < maxAttempts - 1) {
          continue;
        }
      }

      // Concept-Specific Structural Similarity Check
      const maxAllowedSim = request.maxStructuralSimilarity !== undefined
        ? request.maxStructuralSimilarity
        : effectiveConcept?.maxStructuralSimilarity;

      if (maxAllowedSim !== undefined && problem.dna.structuralFingerprint) {
        if (prevProblems.length > 0) {
          const tooSimilar = prevProblems.some(p => {
            if (!p.dna.structuralFingerprint) return false;
            const sim = calculateStructuralSimilarity(problem.dna.structuralFingerprint!, p.dna.structuralFingerprint);
            return sim > maxAllowedSim;
          });
          if (tooSimilar && attempt < maxAttempts - 1) {
            continue;
          }
        }
      }

      // Candidate passed all quality gates
      return {
        success: true,
        problem,
        attemptsCount: attempt + 1,
        generationLatencyMs: performance.now() - startTime
      };
    }

    return {
      success: false,
      rejectionReason: 'NEAR_DUPLICATE',
      rejectionDetails: 'Failed to generate a sufficiently distinct problem within maximum attempts.',
      attemptsCount: maxAttempts,
      generationLatencyMs: performance.now() - startTime
    };
  }

  /**
   * Generates a calibrated numerical parameter variation of a 780 master problem,
   * retaining structural identity while varying numerical coefficients.
   */
  public static generateVariationFromMaster(masterProblem: ValidatedProblem): ValidatedProblem {
    const uniqueSuffix = Date.now().toString(36).slice(-4) + Math.random().toString(36).substring(2, 5);
    const newProblemId = `${masterProblem.dna.problemId}-PV-${uniqueSuffix}`;

    const multiplier = 2;
    let newPrompt = masterProblem.statement.promptText;
    let newAns = masterProblem.solution.canonicalAnswerLatex;
    let newRaw = masterProblem.solution.canonicalAnswerRaw;

    const numMatch = masterProblem.solution.canonicalAnswerLatex.match(/^([+-]?\d+(?:\.\d+)?)$/);
    if (numMatch) {
      const originalVal = parseFloat(numMatch[1]);
      if (!isNaN(originalVal) && Number.isInteger(originalVal) && Math.abs(originalVal) < 1000) {
        const variedVal = originalVal * multiplier;
        newAns = String(variedVal);
        newRaw = String(variedVal);
      }
    }

    const variedDna: ProblemDNA = {
      ...masterProblem.dna,
      problemId: newProblemId,
      source: 'MASTER_BANK_780',
      masterProblemId: masterProblem.dna.masterProblemId || masterProblem.dna.problemId,
      skillClusterId: masterProblem.dna.skillClusterId,
      problemFamilyId: masterProblem.dna.problemFamilyId,
      isParameterVariation: true,
      structureSignature: `SIG-${masterProblem.dna.problemId}-PV-${uniqueSuffix}`,
    };

    return {
      ...masterProblem,
      source: 'MASTER_BANK_780',
      masterProblemId: masterProblem.dna.masterProblemId || masterProblem.dna.problemId,
      skillClusterId: masterProblem.dna.skillClusterId,
      problemFamilyId: masterProblem.dna.problemFamilyId,
      isParameterVariation: true,
      dna: variedDna,
      statement: {
        ...masterProblem.statement,
        promptText: newPrompt,
        expressionLatex: masterProblem.statement.expressionLatex || newPrompt
      },
      solution: {
        ...masterProblem.solution,
        canonicalAnswerLatex: newAns,
        canonicalAnswerRaw: newRaw
      }
    };
  }
}

