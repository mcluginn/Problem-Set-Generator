/**
 * Problem Bank Repository & Caching Engine
 * Engineering Practice Engine — Phase 5 Six-Course Domain Content Development
 */

import { ValidatedProblem, ProblemGenerationRequest, ProblemLifecycleStatus, GoldenMasterProblem, MasterBank780Problem } from './types';
import { ContentGenerator } from './generator';
import { PROBLEM_FAMILIES_REGISTRY } from './problemFamilies';
import { curriculumRegistry } from '../curriculum/registry';
import { LEGACY_SKILL_TO_CLUSTER_MAP } from '../curriculum/goldenMasterRegistry';
import { CLUSTER_TO_SYLLABUS_SKILL_MAP, CLUSTER_TO_SYLLABUS_TOPIC_MAP } from '../curriculum/masterBankMappings';
import masterBank780 from './master_bank_780.json';
import goldenMasterNonDiffEq from './golden_master_non_diffeq_510.json';
import { MathNormalizer } from '../../lib/math/mathNormalizer';

export interface StudentProblemHistory {
  studentId: string;
  problemId: string;
  skillId: string;
  familyId: string;
  signature: string;
  seenAt: string;
  wasCorrect: boolean;
}

export class ProblemBank {
  private static instance: ProblemBank | null = null;
  private problems: Map<string, ValidatedProblem> = new Map();
  private studentHistory: Map<string, StudentProblemHistory[]> = new Map();

  private constructor() {
    this.seedInitialGoldenBank();
  }

  public static getInstance(): ProblemBank {
    if (!ProblemBank.instance) {
      ProblemBank.instance = new ProblemBank();
    }
    return ProblemBank.instance;
  }

  /**
   * Adds a validated problem to the bank repository.
   */
  public storeProblem(problem: ValidatedProblem): void {
    this.problems.set(problem.dna.problemId, problem);
  }

  /**
   * Retrieves a problem by its unique problem ID.
   */
  public getProblemById(problemId: string): ValidatedProblem | undefined {
    return this.problems.get(problemId);
  }

  /**
   * Retrieves all problems currently in the repository.
   */
  public getAllProblems(): ValidatedProblem[] {
    return Array.from(this.problems.values());
  }

  public getProblemsByCourse(courseId: string): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => p.dna.courseId === courseId);
  }

  public getProblemsForTopic(topicId: string): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => {
      if (p.dna.topicId === topicId || p.dna.primarySkillId === topicId) return true;
      const skill = curriculumRegistry.getSkillById(p.dna.primarySkillId);
      return skill ? skill.parentTopicId === topicId : false;
    });
  }

  public getProblemsForSubtopic(subtopicId: string): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => {
      if (p.dna.subtopicId === subtopicId) return true;
      const skill = curriculumRegistry.getSkillById(p.dna.primarySkillId);
      return skill ? skill.parentSubtopicIds.includes(subtopicId) : false;
    });
  }

  public getProblemsForSkill(skillId: string): ValidatedProblem[] {
    const direct = Array.from(this.problems.values()).filter(
      p => p.dna.primarySkillId === skillId || p.dna.skillClusterId === skillId
    );
    if (direct.length > 0) return direct;
    const alias = LEGACY_SKILL_TO_CLUSTER_MAP[skillId];
    if (alias) {
      return Array.from(this.problems.values()).filter(
        p => p.dna.primarySkillId === alias || p.dna.skillClusterId === alias
      );
    }
    return [];
  }

  public getProblemsBySkill(skillId: string): ValidatedProblem[] {
    return this.getProblemsForSkill(skillId);
  }

  public getProblemsByFamily(familyId: string): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => p.dna.familyId === familyId);
  }

  /**
   * Retrieves all problems eligible for the specified PracticeScope using hard constraint filtering.
   */
  public getEligibleProblems(scope: import('../adaptive/types').PracticeScope): ValidatedProblem[] {
    const targetSkillClusters = scope.skillId ? curriculumRegistry.getClustersForSkill(scope.skillId) : [];
    const targetParentSkill = scope.skillId ? curriculumRegistry.getSkillForCluster(scope.skillId) : undefined;
    const targetTopicClusters = scope.topicId ? curriculumRegistry.getClustersForTopic(scope.topicId) : [];

    return Array.from(this.problems.values()).filter(p => {
      if (p.dna.courseId !== scope.courseId) return false;

      // Match Skill Constraint
      if (scope.skillId) {
        if (scope.skillId.startsWith('SKILL-') && p.dna.primarySkillId && p.dna.primarySkillId.startsWith('SKILL-') && p.dna.primarySkillId !== scope.skillId) {
          return false;
        }
        const directSkill = p.dna.primarySkillId === scope.skillId || p.dna.skillClusterId === scope.skillId;
        const inClusters = targetSkillClusters.includes(p.dna.skillClusterId || p.dna.primarySkillId);
        if (!directSkill && !inClusters) return false;
      }

      // Match Topic Constraint
      if (scope.topicId) {
        if (p.dna.topicId && p.dna.topicId !== scope.topicId) {
          return false;
        }
        const directTopic = p.dna.topicId === scope.topicId;
        const inTopicClusters = targetTopicClusters.includes(p.dna.skillClusterId || p.dna.primarySkillId);
        const s = curriculumRegistry.getSkillById(p.dna.primarySkillId);
        const parentMatches = s && s.parentTopicId === scope.topicId;
        if (!directTopic && !inTopicClusters && !parentMatches) return false;
      }

      if (scope.subtopicId) {
        if (p.dna.subtopicId !== scope.subtopicId) {
          const s = curriculumRegistry.getSkillById(p.dna.primarySkillId);
          if (!s || !s.parentSubtopicIds.includes(scope.subtopicId)) return false;
        }
      }

      if (scope.allowedTopicIds && scope.allowedTopicIds.length > 0) {
        const s = curriculumRegistry.getSkillById(p.dna.primarySkillId);
        const top = p.dna.topicId || s?.parentTopicId;
        const mappedTop = curriculumRegistry.getTopicForCluster(p.dna.primarySkillId);
        const isAllowedTop = (top && scope.allowedTopicIds.includes(top)) ||
          (mappedTop && scope.allowedTopicIds.includes(mappedTop)) ||
          scope.allowedTopicIds.some(tId => curriculumRegistry.getClustersForTopic(tId).includes(p.dna.primarySkillId));
        if (!isAllowedTop) return false;
      }

      if (scope.allowedSkillIds && scope.allowedSkillIds.length > 0) {
        const parentSk = curriculumRegistry.getSkillForCluster(p.dna.primarySkillId);
        const isAllowedSk = scope.allowedSkillIds.includes(p.dna.primarySkillId) ||
          (parentSk && scope.allowedSkillIds.includes(parentSk)) ||
          scope.allowedSkillIds.some(sId => curriculumRegistry.getClustersForSkill(sId).includes(p.dna.primarySkillId));
        if (!isAllowedSk) return false;
      }

      if (scope.disabledFamilyIds && scope.disabledFamilyIds.includes(p.dna.familyId)) return false;
      if (scope.excludeProblemIds && scope.excludeProblemIds.includes(p.dna.problemId)) return false;
      if (scope.excludeSignatures && scope.excludeSignatures.includes(p.dna.structureSignature)) return false;
      return true;
    });
  }

  /**
   * Searches the repository matching filters.
   */
  public findProblems(filters: {
    courseId?: string;
    skillId?: string;
    evidenceType?: string;
    familyId?: string;
    lifecycleStatus?: ProblemLifecycleStatus;
    difficulty?: number;
  }): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => {
      if (filters.courseId && p.dna.courseId !== filters.courseId) return false;
      if (filters.skillId && p.dna.primarySkillId !== filters.skillId) return false;
      if (filters.evidenceType && p.dna.evidenceType !== filters.evidenceType) return false;
      if (filters.familyId && p.dna.familyId !== filters.familyId) return false;
      if (filters.lifecycleStatus && p.lifecycleStatus !== filters.lifecycleStatus) return false;
      if (filters.difficulty && Math.round(p.dna.difficultyVector.overall) !== filters.difficulty) return false;
      return true;
    });
  }

  /**
   * Intelligent fetch: Selects from validated bank first; if none or stale, generates on demand.
   */
  public getOrGenerateProblem(
    studentId: string,
    request: ProblemGenerationRequest
  ): ValidatedProblem | null {
    const studentRecords = this.studentHistory.get(studentId) || [];
    const seenProblemIds = new Set(studentRecords.map(r => r.problemId));
    const recentSignatures = studentRecords.slice(-5).map(r => ({ signature: r.signature, familyId: r.familyId }));

    // 1. Try finding an unseen, approved/valid problem from the bank
    const availableBank = this.findProblems({
      courseId: request.courseId,
      skillId: request.skillId,
      evidenceType: request.evidenceType,
      familyId: request.familyId
    }).filter(p => !seenProblemIds.has(p.dna.problemId));

    if (availableBank.length > 0) {
      const selected = availableBank[Math.floor(Math.random() * availableBank.length)];
      this.recordProblemExposure(studentId, selected, false);
      return selected;
    }

    // 2. Generate on-demand if no pre-validated bank item matches
    const genResult = ContentGenerator.generateForSkill(request, recentSignatures);
    if (genResult.success && genResult.problem) {
      this.storeProblem(genResult.problem);
      this.recordProblemExposure(studentId, genResult.problem, false);
      return genResult.problem;
    }

    return null;
  }

  /**
   * Records student interaction for freshness and anti-duplication tracking.
   */
  public recordProblemExposure(
    studentId: string,
    problem: ValidatedProblem,
    wasCorrect: boolean
  ): void {
    const records = this.studentHistory.get(studentId) || [];
    records.push({
      studentId,
      problemId: problem.dna.problemId,
      skillId: problem.dna.primarySkillId,
      familyId: problem.dna.familyId,
      signature: problem.dna.structureSignature,
      seenAt: new Date().toISOString(),
      wasCorrect
    });
    this.studentHistory.set(studentId, records);
  }

  /**
   * Teacher / Developer Lifecycle Approval.
   */
  public updateLifecycleStatus(problemId: string, newStatus: ProblemLifecycleStatus): boolean {
    const prob = this.problems.get(problemId);
    if (prob) {
      prob.lifecycleStatus = newStatus;
      return true;
    }
    return false;
  }

  public getProblemsByMasterProblemId(masterProblemId: string): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => p.dna.masterProblemId === masterProblemId || p.masterProblemId === masterProblemId);
  }

  public getProblemsByClusterId(clusterId: string): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => p.dna.skillClusterId === clusterId || p.skillClusterId === clusterId || p.dna.primarySkillId === clusterId);
  }

  public getProblemsByFamilyId(familyId: string): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => p.dna.familyId === familyId || p.dna.problemFamilyId === familyId);
  }

  public getMasterProblems(): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => !p.dna.isParameterVariation && !p.isParameterVariation);
  }

  public getParameterVariations(): ValidatedProblem[] {
    return Array.from(this.problems.values()).filter(p => p.dna.isParameterVariation === true || p.isParameterVariation === true);
  }

  private isExpressionLatexValid(expr?: string): boolean {
    if (!expr || typeof expr !== 'string' || !expr.trim()) return false;
    const trimmed = expr.trim();
    if (trimmed.includes('.\\frac') || trimmed.endsWith('\\text{') || trimmed.includes('\\(') || trimmed.startsWith('}')) {
      return false;
    }
    let b = 0, p = 0;
    for (let i = 0; i < trimmed.length; i++) {
      const c = trimmed[i];
      if (c === '{' && (i === 0 || trimmed[i - 1] !== '\\')) b++;
      else if (c === '}' && (i === 0 || trimmed[i - 1] !== '\\')) {
        b--;
        if (b < 0) return false;
      } else if (c === '(') p++;
      else if (c === ')') {
        p--;
        if (p < 0) return false;
      }
    }
    return b === 0 && p === 0;
  }

  private convert780ToValidatedProblem(item: MasterBank780Problem): ValidatedProblem {
    const syllabusTopic = CLUSTER_TO_SYLLABUS_TOPIC_MAP[item.clusterId] || item.clusterId;
    const syllabusSkill = CLUSTER_TO_SYLLABUS_SKILL_MAP[item.clusterId] || item.clusterId;

    return {
      source: 'MASTER_BANK_780',
      masterProblemId: item.masterProblemId,
      skillClusterId: item.skillClusterId,
      problemFamilyId: item.problemFamilyId,
      isParameterVariation: false,
      dna: {
        problemId: item.id,
        source: 'MASTER_BANK_780',
        masterProblemId: item.masterProblemId,
        skillClusterId: item.skillClusterId,
        problemFamilyId: item.problemFamilyId,
        unitId: item.unitId,
        isParameterVariation: false,
        courseId: item.courseId,
        topicId: syllabusTopic,
        subtopicId: syllabusTopic,
        primarySkillId: syllabusSkill,
        supportingSkillIds: [],
        evidenceType: 'DIRECT_CALCULATION',
        familyId: item.problemFamilyId,
        templateId: `TEMPL-${item.id}`,
        representationType: 'SYMBOLIC',
        contextType: 'PURE_MATHEMATICS',
        guidedness: 'STANDARD',
        difficultyVector: {
          overall: item.difficulty,
          conceptual: item.difficulty,
          procedural: item.difficulty,
          computational: item.difficulty,
          reasoning: item.difficulty,
          representation: item.difficulty,
          context: item.difficulty,
          multiStep: item.difficulty
        },
        structureSignature: `SIG-${item.id}`,
        domainValidatorType:
          item.courseId === 'COURSE-GEN0161' ? 'THERMODYNAMICS' :
          item.courseId === 'COURSE-GEN0110' ? 'PHYSICS' :
          item.courseId === 'COURSE-BSIE3219' ? 'IE_SPECIAL_TOPICS' :
          item.courseId === 'COURSE-GEN0101' ? 'MATH_FOR_ENGINEERS' : 'MATH',
        curriculumVersion: '2.0.0',
        skillOntologyVersion: '2.0.0',
        generatorVersion: '2.0.0',
        templateVersion: '2.0.0',
        validatorVersion: '5.0.0'
      },
      statement: {
        promptText: item.statement,
        expressionLatex: this.isExpressionLatexValid(item.expressionLatex)
          ? MathNormalizer.normalizePureMath(item.expressionLatex!)
          : item.statement,
        targetVariable: 'x',
        independentVariable: 'x'
      },
      rawExpression: { type: 'VARIABLE', name: 'x' } as any,
      solution: {
        canonicalAnswerLatex: MathNormalizer.normalizePureMath(
          (item.canonicalAnswerLatex && !item.canonicalAnswerLatex.includes('.\\frac') && !item.canonicalAnswerLatex.includes('\\frac{m}{s}'))
            ? item.canonicalAnswerLatex
            : item.canonicalAnswer
        ),
        canonicalAnswerRaw: item.canonicalAnswer,
        reasoningTrace: item.derivationSteps.map((step, idx) => ({
          stepIndex: idx + 1,
          phase: idx === 0 ? 'RECOGNITION' : idx === item.derivationSteps.length - 1 ? 'VERIFICATION' : 'EXECUTION',
          actionDescription: MathNormalizer.normalizeStepText(step),
          pedagogicalRationale: step
        })),
        solutionSteps: item.derivationSteps.map((step, idx) => ({
          stepNumber: idx + 1,
          title: `Step ${idx + 1}`,
          ruleName: 'Analytical Derivation',
          expressionLatex: step,
          explanation: MathNormalizer.normalizeStepText(step)
        })),
        whyMethodRequired: item.structuralProgression,
        engineeringInterpretation: item.structuralProgression
      },
      hints: [
        {
          level: 1,
          category: 'RECOGNITION',
          text: item.recognitionHint,
          revealsFinalAnswer: false
        },
        {
          level: 2,
          category: 'SETUP',
          text: item.setupHint,
          revealsFinalAnswer: false
        },
        {
          level: 3,
          category: 'GUIDED_CALCULATION',
          text: `Common Mistake Alert: ${item.commonMistake}`,
          revealsFinalAnswer: false
        }
      ],
      acceptedEquivalents: item.acceptedEquivalents,
      structuralProgression: item.structuralProgression,
      commonMistake: item.commonMistake,
      topicTitle: item.topic,
      qualityScore: {
        mathematicalValidity: 1,
        skillAlignment: 1,
        evidenceAlignment: 1,
        hintIntegrity: 1,
        overallQuality: 1
      },
      lifecycleStatus: item.courseId === 'COURSE-GEN0102' ? 'APPROVED' : 'AWAITING_TEACHER_REVIEW',
      createdAt: '2026-09-06T00:00:00.000Z'
    };
  }

  private convertGoldenMasterToValidatedProblem(gm: GoldenMasterProblem): ValidatedProblem {
    return {
      masterProblemId: gm.id,
      skillClusterId: gm.clusterId,
      isParameterVariation: false,
      dna: {
        problemId: gm.id,
        masterProblemId: gm.id,
        skillClusterId: gm.clusterId,
        problemFamilyId: `FAM-${gm.clusterId}`,
        unitId: gm.unitId,
        isParameterVariation: false,
        courseId: gm.courseId,
        topicId: gm.clusterId,
        subtopicId: gm.clusterId,
        primarySkillId: gm.clusterId,
        supportingSkillIds: [],
        evidenceType: 'DIRECT_CALCULATION',
        familyId: `FAM-${gm.clusterId}`,
        templateId: `TEMPL-${gm.id}`,
        representationType: 'SYMBOLIC',
        contextType: 'PURE_MATHEMATICS',
        guidedness: 'STANDARD',
        difficultyVector: {
          overall: gm.difficulty,
          conceptual: gm.difficulty,
          procedural: gm.difficulty,
          computational: gm.difficulty,
          reasoning: gm.difficulty,
          representation: gm.difficulty,
          context: gm.difficulty,
          multiStep: gm.difficulty
        },
        structureSignature: `SIG-${gm.id}`,
        domainValidatorType:
          gm.courseId === 'COURSE-GEN0161' ? 'THERMODYNAMICS' :
          gm.courseId === 'COURSE-GEN0110' ? 'PHYSICS' :
          gm.courseId === 'COURSE-BSIE3219' ? 'IE_SPECIAL_TOPICS' :
          gm.courseId === 'COURSE-GEN0101' ? 'MATH_FOR_ENGINEERS' : 'MATH',
        curriculumVersion: '2.0.0',
        skillOntologyVersion: '2.0.0',
        generatorVersion: '2.0.0',
        templateVersion: '2.0.0',
        validatorVersion: '5.0.0'
      },
      statement: {
        promptText: gm.statement,
        expressionLatex: gm.statement,
        targetVariable: 'x',
        independentVariable: 'x'
      },
      rawExpression: { type: 'VARIABLE', name: 'x' } as any,
      solution: {
        canonicalAnswerLatex: gm.canonicalAnswer,
        canonicalAnswerRaw: gm.canonicalAnswer,
        reasoningTrace: gm.derivationSteps.map((step, idx) => ({
          stepIndex: idx + 1,
          phase: idx === 0 ? 'RECOGNITION' : idx === gm.derivationSteps.length - 1 ? 'VERIFICATION' : 'EXECUTION',
          actionDescription: MathNormalizer.normalizeStepText(step),
          pedagogicalRationale: step
        })),
        solutionSteps: gm.derivationSteps.map((step, idx) => ({
          stepNumber: idx + 1,
          title: `Step ${idx + 1}`,
          ruleName: 'Analytical Derivation',
          expressionLatex: step,
          explanation: MathNormalizer.normalizeStepText(step)
        })),
        whyMethodRequired: gm.structuralProgression,
        engineeringInterpretation: gm.structuralProgression
      },
      hints: [
        {
          level: 1,
          category: 'RECOGNITION',
          text: gm.recognitionHint,
          revealsFinalAnswer: false
        },
        {
          level: 2,
          category: 'SETUP',
          text: gm.setupHint,
          revealsFinalAnswer: false
        },
        {
          level: 3,
          category: 'GUIDED_CALCULATION',
          text: `Common Mistake Alert: ${gm.commonMistake}`,
          revealsFinalAnswer: false
        }
      ],
      acceptedEquivalents: gm.acceptedEquivalents,
      structuralProgression: gm.structuralProgression,
      commonMistake: gm.commonMistake,
      topicTitle: gm.topic,
      qualityScore: {
        mathematicalValidity: 1,
        skillAlignment: 1,
        evidenceAlignment: 1,
        hintIntegrity: 1,
        overallQuality: 1
      },
      lifecycleStatus: gm.courseId === 'COURSE-GEN0102' ? 'APPROVED' : 'AWAITING_TEACHER_REVIEW',
      createdAt: '2026-09-06T00:00:00.000Z'
    };
  }

  /**
   * Seeds initial validated golden items into the bank across all courses:
   * - 780 calibrated structural problems from the Authoritative Master Problem Bank across the 5 syllabi courses.
   * - Supporting CTR0301 items for control engineering coverage.
   * - Strictly preserved validated generator/template pipeline for COURSE-GEN0107 (Differential Equations).
   */
  private seedInitialGoldenBank(): void {
    // 1. Ingest authoritative 780 calibrated structural problems from Master Problem Bank
    for (const item of masterBank780 as unknown as MasterBank780Problem[]) {
      const p = this.convert780ToValidatedProblem(item);
      this.storeProblem(p);
    }

    // 2. Ingest CTR0301 if present for control engineering coverage
    for (const gm of goldenMasterNonDiffEq as unknown as GoldenMasterProblem[]) {
      if (gm.courseId === 'COURSE-CTR0301') {
        const p = this.convertGoldenMasterToValidatedProblem(gm);
        this.storeProblem(p);
      }
    }

    // 3. For COURSE-GEN0107 (Differential Equations), strictly preserve existing validated generator/template pipeline
    const odeFamilies = Object.values(PROBLEM_FAMILIES_REGISTRY).filter(f => f.courseId === 'COURSE-GEN0107');
    for (const family of odeFamilies) {
      const recentSignatures: Array<{ signature: string; familyId: string }> = [];
      for (let i = 0; i < 3; i++) {
        const itemReq: ProblemGenerationRequest = {
          courseId: 'COURSE-GEN0107' as any,
          skillId: family.primarySkillId,
          familyId: family.id,
          evidenceType: family.primaryEvidenceType,
          difficulty: i + 1,
          excludeSignatures: recentSignatures.map(s => s.signature)
        };
        const res = ContentGenerator.generateForSkill(itemReq, recentSignatures);
        if (res.success && res.problem) {
          recentSignatures.push({
            signature: res.problem.dna.structureSignature,
            familyId: family.id
          });
          res.problem.lifecycleStatus = 'AWAITING_TEACHER_REVIEW';
          this.storeProblem(res.problem);
        }
      }
    }
  }

  public getProblemsForCourse(courseId: string): ValidatedProblem[] {
    return this.getProblemsByCourse(courseId);
  }
}

export const problemBank = ProblemBank.getInstance();


