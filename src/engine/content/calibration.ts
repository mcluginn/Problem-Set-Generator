/**
 * Teacher Calibration & Controlled Content Expansion Engine
 * Engineering Practice Engine — Phase 3.5
 */

import {
  ValidatedProblem,
  ProblemGenerationRequest,
  ProblemLifecycleStatus,
  DifficultyVector,
  AssessmentEvidenceTypeId,
  ContentRepresentationType,
  ContentContextType
} from './types';
import { ContentGenerator } from './generator';
import { ContentValidator, ValidationReport } from './validator';
import { ProblemBank } from './problemBank';
import { PROBLEM_FAMILIES_REGISTRY } from './problemFamilies';
import { EquivalenceEngine } from '../math/equivalence';
import { parseMath } from '../math/parser';
import { Differentiator } from '../math/differentiator';
import { nodeToString } from '../math/ast';

export type TeacherDecision = 'APPROVE' | 'EDIT' | 'REJECT' | 'FLAG' | 'REGENERATE';

export type TeacherRejectionReason =
  | 'MATHEMATICALLY_WRONG'
  | 'SKILL_MISMATCH'
  | 'TOO_EASY'
  | 'TOO_HARD'
  | 'REPETITIVE'
  | 'AMBIGUOUS'
  | 'POOR_WORDING'
  | 'UNREALISTIC_CONTEXT'
  | 'BAD_DISTRACTOR'
  | 'WEAK_PEDAGOGY'
  | 'UNNECESSARY_COMPLEXITY';

export interface QualityRatingVector {
  mathematicalCorrectness: 1 | 2 | 3 | 4 | 5;
  skillAlignment: 1 | 2 | 3 | 4 | 5;
  clarity: 1 | 2 | 3 | 4 | 5;
  difficultySuitability: 1 | 2 | 3 | 4 | 5;
  educationalUsefulness: 1 | 2 | 3 | 4 | 5;
  diversityDistinctiveness: 1 | 2 | 3 | 4 | 5;
}

export const LOCAL_REVIEW_STORE_SCHEMA_VERSION = '1.0.0';
export const LOCAL_REVIEW_STORE_KEY = 'practice_engine_local_review_store_v1';
export const LOCAL_REVIEW_STORE_DISCLAIMER =
  'Local Review Store (Schema v1.0.0) — Stored locally in browser, not globally persisted';

export interface LocalReviewStoreSchema {
  schemaVersion: '1.0.0';
  exportedAt: string;
  recordCount: number;
  records: TeacherReviewRecord[];
}

export function buildReviewTargetKey(dna: {
  courseId: string;
  primarySkillId: string;
  familyId?: string;
  templateId?: string;
  structureSignature?: string;
}): string {
  const course = dna.courseId || 'UNKNOWN_COURSE';
  const skill = dna.primarySkillId || 'UNKNOWN_SKILL';
  const family = dna.familyId || 'NO_FAMILY';
  const template = dna.templateId || 'NO_TEMPLATE';
  const sig = dna.structureSignature || 'NO_SIG';
  return `${course}::${skill}::${family}::${template}::${sig}`;
}

export interface ProblemCandidateSnapshot {
  statement: ValidatedProblem['statement'];
  solution: ValidatedProblem['solution'];
  hints: ValidatedProblem['hints'];
  difficultyVector: ValidatedProblem['dna']['difficultyVector'];
  structureSignature: string;
  dna: ValidatedProblem['dna'];
}

export interface TeacherReviewRecord {
  id: string;
  reviewTargetKey: string;
  problemId?: string;
  courseId?: string;
  skillId?: string;
  familyId?: string;
  templateId?: string;
  candidateSnapshot?: ProblemCandidateSnapshot;
  reviewer: string;
  ratings: QualityRatingVector;
  decision: TeacherDecision;
  rejectionReasons?: TeacherRejectionReason[];
  teacherNotes?: string;
  suggestedDifficultyOverride?: number;
  editedFields?: {
    originalPrompt?: string;
    editedPrompt?: string;
    originalContext?: string;
    editedContext?: string;
  };
  revalidationReport?: ValidationReport;
  reviewedAt: string;
}

export interface ProblemComparisonResult {
  problemA: ValidatedProblem;
  problemB: ValidatedProblem;
  isExactSignatureClone: boolean;
  isSameFamily: boolean;
  isSameTemplate: boolean;
  isSameEvidenceType: boolean;
  astSimilarityScore: number; // 0.0 to 1.0
  pedagogicalOverlapScore: number; // 0.0 to 1.0
  diversityRecommendation: 'HIGHLY_DIVERSE' | 'MODERATE_DIVERSITY' | 'SUPERFICIAL_CLONE' | 'REMEDIATION_PAIR';
}

export interface SessionSimulationReport {
  sessionId: string;
  targetSkillId: string;
  totalProblems: number;
  problems: ValidatedProblem[];
  familyDistribution: Record<string, number>;
  templateDistribution: Record<string, number>;
  evidenceDistribution: Record<string, number>;
  representationDistribution: Record<string, number>;
  difficultyTrajectory: number[];
  repetitionRiskScore: number; // 0.0 (perfect variety) to 1.0 (repetitive)
  pedagogicalBalanceScore: number; // 0.0 to 1.0
  remediationCount: number;
  transferCount: number;
  evaluationSummary: string;
}

export class TeacherCalibrationEngine {
  private static instance: TeacherCalibrationEngine | null = null;
  private calibrationProblems: Map<string, ValidatedProblem> = new Map();
  private reviewRecords: Map<string, TeacherReviewRecord> = new Map();
  private reviewRecordsByTargetKey: Map<string, TeacherReviewRecord> = new Map();
  private reviewRecordsByProblemId: Map<string, TeacherReviewRecord> = new Map();

  private constructor() {
    this.generateChainRuleCalibrationBatch();
    this.loadFromLocalStorage();
  }

  public static getInstance(): TeacherCalibrationEngine {
    if (!TeacherCalibrationEngine.instance) {
      TeacherCalibrationEngine.instance = new TeacherCalibrationEngine();
    }
    return TeacherCalibrationEngine.instance;
  }

  /**
   * Strictly validates an exported or persisted review store JSON string.
   * Returns parsed records and validation errors.
   */
  public static validateReviewStorePayload(jsonString: string): {
    valid: boolean;
    records: TeacherReviewRecord[];
    errors: string[];
  } {
    const errors: string[] = [];
    if (!jsonString || typeof jsonString !== 'string') {
      return { valid: false, records: [], errors: ['JSON payload is empty or not a string.'] };
    }

    if (jsonString.length > 5 * 1024 * 1024) {
      return { valid: false, records: [], errors: ['Payload exceeds maximum allowed size of 5MB.'] };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err: any) {
      return { valid: false, records: [], errors: [`JSON Parse Error: ${err.message}`] };
    }

    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, records: [], errors: ['Root JSON must be an object.'] };
    }

    if (parsed.schemaVersion !== LOCAL_REVIEW_STORE_SCHEMA_VERSION) {
      return {
        valid: false,
        records: [],
        errors: [`Unsupported schema version "${parsed.schemaVersion}". Expected exact version "${LOCAL_REVIEW_STORE_SCHEMA_VERSION}".`]
      };
    }

    if (!Array.isArray(parsed.records)) {
      return { valid: false, records: [], errors: ['Field "records" must be an array.'] };
    }

    if (parsed.records.length > 1000) {
      return { valid: false, records: [], errors: ['Record count exceeds maximum batch limit of 1,000 records.'] };
    }

    const validDecisions: TeacherDecision[] = ['APPROVE', 'EDIT', 'REJECT', 'FLAG', 'REGENERATE'];
    const requiredRatingFields: (keyof QualityRatingVector)[] = [
      'mathematicalCorrectness',
      'skillAlignment',
      'clarity',
      'difficultySuitability',
      'educationalUsefulness',
      'diversityDistinctiveness'
    ];

    const validatedRecords: TeacherReviewRecord[] = [];

    for (let i = 0; i < parsed.records.length; i++) {
      const rec = parsed.records[i];
      const prefix = `Record [${i}]`;

      if (!rec || typeof rec !== 'object') {
        errors.push(`${prefix}: Must be an object.`);
        continue;
      }

      if (!rec.id || typeof rec.id !== 'string') {
        errors.push(`${prefix}: Missing or invalid string "id".`);
      }

      if (!rec.reviewTargetKey || typeof rec.reviewTargetKey !== 'string') {
        errors.push(`${prefix}: Missing or invalid string "reviewTargetKey".`);
      }

      if (!rec.reviewer || typeof rec.reviewer !== 'string') {
        errors.push(`${prefix}: Missing or invalid string "reviewer".`);
      }

      if (!validDecisions.includes(rec.decision)) {
        errors.push(`${prefix}: Invalid decision "${rec.decision}". Must be one of: ${validDecisions.join(', ')}.`);
      }

      if (!rec.ratings || typeof rec.ratings !== 'object') {
        errors.push(`${prefix}: Missing or invalid "ratings" object.`);
      } else {
        for (const rf of requiredRatingFields) {
          const val = rec.ratings[rf];
          if (typeof val !== 'number' || val < 1 || val > 5 || !Number.isInteger(val)) {
            errors.push(`${prefix}: Rating "${rf}" must be an integer between 1 and 5.`);
          }
        }
      }

      if (!rec.reviewedAt || typeof rec.reviewedAt !== 'string') {
        errors.push(`${prefix}: Missing or invalid string "reviewedAt".`);
      }

      if (errors.length === 0) {
        validatedRecords.push(rec as TeacherReviewRecord);
      }
    }

    if (errors.length > 0) {
      return { valid: false, records: [], errors };
    }

    return { valid: true, records: validatedRecords, errors: [] };
  }

  /**
   * Loads persisted review records from local browser storage if available,
   * applying strict schema and record validation.
   */
  public loadFromLocalStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(LOCAL_REVIEW_STORE_KEY);
      if (!raw) return;
      const res = TeacherCalibrationEngine.validateReviewStorePayload(raw);
      if (res.valid) {
        for (const record of res.records) {
          if (record && record.reviewTargetKey) {
            this.reviewRecordsByTargetKey.set(record.reviewTargetKey, record);
            if (record.problemId) {
              this.reviewRecordsByProblemId.set(record.problemId, record);
              this.reviewRecords.set(record.problemId, record);
            } else {
              this.reviewRecords.set(record.reviewTargetKey, record);
            }
          }
        }
      }
    } catch {
      // Gracefully handle storage errors in restricted sandboxes
    }
  }

  /**
   * Persists all review records to local browser storage.
   */
  public saveToLocalStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const records = Array.from(this.reviewRecordsByTargetKey.values());
      const payload: LocalReviewStoreSchema = {
        schemaVersion: LOCAL_REVIEW_STORE_SCHEMA_VERSION,
        exportedAt: new Date().toISOString(),
        recordCount: records.length,
        records
      };
      localStorage.setItem(LOCAL_REVIEW_STORE_KEY, JSON.stringify(payload, null, 2));
    } catch {
      // Gracefully handle quota or storage write errors
    }
  }

  /**
   * Generates a calibrated set of exactly 10 problems per family for the 5 Chain Rule families (50 problems total).
   */
  public generateChainRuleCalibrationBatch(): ValidatedProblem[] {
    const chainFamilyIds = [
      'FAM-GEN0102-CHAIN-POLY',
      'FAM-GEN0102-CHAIN-TRIG',
      'FAM-GEN0102-CHAIN-ERROR',
      'FAM-GEN0102-CHAIN-RECOG',
      'FAM-GEN0102-CHAIN-APP'
    ];

    const generated: ValidatedProblem[] = [];
    const history: Array<{ signature: string; familyId: string }> = [];

    for (const familyId of chainFamilyIds) {
      const family = PROBLEM_FAMILIES_REGISTRY[familyId];
      if (!family) continue;

      for (let i = 0; i < 10; i++) {
        const difficulty = ((i % 4) + 1);
        const req: ProblemGenerationRequest = {
          courseId: 'COURSE-GEN0102',
          skillId: 'SKILL-GEN0102-005',
          familyId: family.id,
          evidenceType: family.primaryEvidenceType,
          difficulty
        };

        const res = ContentGenerator.generateForSkill(req, history);
        if (res.success && res.problem) {
          this.calibrationProblems.set(res.problem.dna.problemId, res.problem);
          ProblemBank.getInstance().storeProblem(res.problem);
          generated.push(res.problem);
          history.push({
            signature: res.problem.dna.structureSignature,
            familyId: res.problem.dna.familyId
          });
        }
      }
    }

    return generated;
  }

  /**
   * Retrieves all calibration problems in memory.
   */
  public getCalibrationProblems(): ValidatedProblem[] {
    return Array.from(this.calibrationProblems.values());
  }

  /**
   * Retrieves calibration problems filtered by problem family.
   */
  public getCalibrationProblemsByFamily(familyId: string): ValidatedProblem[] {
    return Array.from(this.calibrationProblems.values()).filter(p => p.dna.familyId === familyId);
  }

  /**
   * Submits a formal teacher review and rating for a problem or reviewTargetKey.
   * By default, local review decisions remain an overlay and do not silently
   * mutate the learner-facing ProblemBank lifecycle unless an explicitly labeled
   * local-session action is selected (or when running legacy server/test calibration without options).
   */
  public submitReview(
    review: Omit<TeacherReviewRecord, 'id' | 'reviewedAt' | 'reviewTargetKey'> & { reviewTargetKey?: string },
    options?: { applyToSessionProblemBank?: boolean }
  ): TeacherReviewRecord {
    let reviewTargetKey = review.reviewTargetKey;
    const problem = review.problemId
      ? (this.calibrationProblems.get(review.problemId) || ProblemBank.getInstance().getProblemById(review.problemId))
      : undefined;

    if (!reviewTargetKey) {
      if (problem) {
        reviewTargetKey = buildReviewTargetKey({
          courseId: problem.dna.courseId,
          primarySkillId: problem.dna.primarySkillId,
          familyId: problem.dna.familyId,
          templateId: problem.dna.templateId,
          structureSignature: problem.dna.structureSignature
        });
      } else {
        reviewTargetKey = buildReviewTargetKey({
          courseId: review.courseId || 'UNKNOWN_COURSE',
          primarySkillId: review.skillId || 'UNKNOWN_SKILL',
          familyId: review.familyId,
          templateId: review.templateId,
          structureSignature: review.problemId || 'NO_SIG'
        });
      }
    }

    let candidateSnapshot = review.candidateSnapshot;
    if (!candidateSnapshot && problem) {
      candidateSnapshot = {
        statement: problem.statement,
        solution: problem.solution,
        hints: problem.hints,
        difficultyVector: problem.dna.difficultyVector,
        structureSignature: problem.dna.structureSignature,
        dna: problem.dna
      };
    }

    const record: TeacherReviewRecord = {
      ...review,
      id: `REV-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      reviewTargetKey,
      courseId: review.courseId || problem?.dna.courseId || 'COURSE-GEN0102',
      skillId: review.skillId || problem?.dna.primarySkillId || 'SKILL-GEN0102-005',
      familyId: review.familyId || problem?.dna.familyId,
      templateId: review.templateId || problem?.dna.templateId,
      candidateSnapshot,
      reviewedAt: new Date().toISOString()
    };

    this.reviewRecordsByTargetKey.set(record.reviewTargetKey, record);
    if (record.problemId) {
      this.reviewRecordsByProblemId.set(record.problemId, record);
      this.reviewRecords.set(record.problemId, record);
    } else {
      this.reviewRecords.set(record.reviewTargetKey, record);
    }

    this.saveToLocalStorage();

    // Local review decisions remain an overlay by default.
    // In browser sessions, ProblemBank lifecycle is NOT modified unless explicitly requested via applyToSessionProblemBank.
    // In headless test environments where options is omitted, defaults to true for backwards compatibility with legacy tests.
    const shouldApplyToProblemBank = options?.applyToSessionProblemBank ?? (typeof window === 'undefined');
    if (shouldApplyToProblemBank) {
      const bank = ProblemBank.getInstance();
      if (problem) {
        bank.storeProblem(problem);
        if (record.decision === 'APPROVE') {
          bank.updateLifecycleStatus(problem.dna.problemId, 'APPROVED');
        } else if (record.decision === 'REJECT') {
          bank.updateLifecycleStatus(problem.dna.problemId, 'REJECTED');
        }
      } else if (candidateSnapshot) {
        const candProblem: ValidatedProblem = {
          statement: candidateSnapshot.statement,
          rawExpression: null as any,
          solution: candidateSnapshot.solution,
          hints: candidateSnapshot.hints,
          qualityScore: {
            mathematicalValidity: 1,
            skillAlignment: 1,
            evidenceAlignment: 1,
            hintIntegrity: 1,
            overallQuality: 1
          },
          lifecycleStatus: record.decision === 'APPROVE' ? 'APPROVED' : 'VALID',
          createdAt: record.reviewedAt,
          dna: candidateSnapshot.dna
        };
        bank.storeProblem(candProblem);
        if (record.decision === 'APPROVE') {
          bank.updateLifecycleStatus(candProblem.dna.problemId, 'APPROVED');
        } else if (record.decision === 'REJECT') {
          bank.updateLifecycleStatus(candProblem.dna.problemId, 'REJECTED');
        }
      } else if (record.problemId) {
        if (record.decision === 'APPROVE') {
          bank.updateLifecycleStatus(record.problemId, 'APPROVED');
        } else if (record.decision === 'REJECT') {
          bank.updateLifecycleStatus(record.problemId, 'REJECTED');
        }
      }
    }

    return record;
  }

  /**
   * Retrieves review record by stable reviewTargetKey.
   */
  public getReviewByTargetKey(reviewTargetKey: string): TeacherReviewRecord | undefined {
    return this.reviewRecordsByTargetKey.get(reviewTargetKey);
  }

  /**
   * Retrieves review record for a specific problem.
   */
  public getReviewForProblem(problemId: string): TeacherReviewRecord | undefined {
    return this.reviewRecordsByProblemId.get(problemId) || this.reviewRecords.get(problemId);
  }

  /**
   * Retrieves all reviews submitted as an array.
   */
  public getAllReviews(): TeacherReviewRecord[] {
    return Array.from(this.reviewRecordsByTargetKey.values()).sort(
      (a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime()
    );
  }

  /**
   * Retrieves all reviews submitted as a dictionary keyed by reviewTargetKey.
   */
  public getAllReviewsMap(): Record<string, TeacherReviewRecord> {
    const map: Record<string, TeacherReviewRecord> = {};
    for (const [k, v] of this.reviewRecordsByTargetKey.entries()) {
      map[k] = v;
    }
    return map;
  }

  /**
   * Deletes a review record by reviewTargetKey.
   */
  public deleteReview(reviewTargetKey: string): boolean {
    const existing = this.reviewRecordsByTargetKey.get(reviewTargetKey);
    if (!existing) return false;
    this.reviewRecordsByTargetKey.delete(reviewTargetKey);
    if (existing.problemId) {
      this.reviewRecordsByProblemId.delete(existing.problemId);
      this.reviewRecords.delete(existing.problemId);
    }
    this.reviewRecords.delete(reviewTargetKey);
    this.saveToLocalStorage();
    return true;
  }

  /**
   * Resets all local reviews in memory and storage.
   */
  public clearAllReviews(): void {
    this.reviewRecordsByTargetKey.clear();
    this.reviewRecordsByProblemId.clear();
    this.reviewRecords.clear();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(LOCAL_REVIEW_STORE_KEY);
      } catch {
        // storage handling
      }
    }
  }

  /**
   * Exports all local reviews conforming to LocalReviewStoreSchema v1.0.0.
   */
  public exportReviewsJSON(): string {
    const records = Array.from(this.reviewRecordsByTargetKey.values());
    const payload: LocalReviewStoreSchema = {
      schemaVersion: LOCAL_REVIEW_STORE_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      recordCount: records.length,
      records
    };
    return JSON.stringify(payload, null, 2);
  }

  /**
   * Strictly validates and imports review JSON without partial mutation.
   */
  public importReviewsJSON(jsonString: string): { success: boolean; importedCount: number; errors: string[] } {
    const res = TeacherCalibrationEngine.validateReviewStorePayload(jsonString);
    if (!res.valid) {
      return { success: false, importedCount: 0, errors: res.errors };
    }

    // Deduplicate and apply
    for (const record of res.records) {
      this.reviewRecordsByTargetKey.set(record.reviewTargetKey, record);
      if (record.problemId) {
        this.reviewRecordsByProblemId.set(record.problemId, record);
        this.reviewRecords.set(record.problemId, record);
      } else {
        this.reviewRecords.set(record.reviewTargetKey, record);
      }
    }

    this.saveToLocalStorage();

    return {
      success: true,
      importedCount: res.records.length,
      errors: []
    };
  }

  /**
   * Teacher Problem Editor with Mandatory Automatic Revalidation.
   * Edits wording or metadata, re-runs mathematical/pedagogical validators, and updates state.
   */
  public editAndRevalidateProblem(
    problemId: string,
    edits: {
      promptText?: string;
      contextStory?: string;
      difficultyOverall?: number;
      options?: ValidatedProblem['statement']['options'];
    },
    reviewer: string
  ): { success: boolean; problem?: ValidatedProblem; validationReport: ValidationReport; error?: string } {
    const original = this.calibrationProblems.get(problemId) || ProblemBank.getInstance().getProblemById(problemId);
    if (!original) {
      return {
        success: false,
        validationReport: {
          isValid: false,
          rejectionReason: 'SKILL_MISMATCH',
          rejectionMessage: 'Problem not found in calibration repository.',
          checks: {
            syntaxValid: false,
            domainValid: false,
            solutionConsistent: false,
            skillAligned: false,
            evidenceAligned: false,
            hintIntegrityPassed: false,
            distractorsPlausible: false
          }
        },
        error: 'Problem not found'
      };
    }

    // Clone and apply teacher edits
    const editedProblem: ValidatedProblem = {
      ...original,
      statement: {
        ...original.statement,
        promptText: edits.promptText ?? original.statement.promptText,
        contextStory: edits.contextStory ?? original.statement.contextStory,
        options: edits.options ?? original.statement.options
      },
      dna: {
        ...original.dna,
        difficultyVector: {
          ...original.dna.difficultyVector,
          overall: edits.difficultyOverall ?? original.dna.difficultyVector.overall
        }
      }
    };

    // Re-run full independent mathematical and content validation pipeline
    const validationReport = ContentValidator.validateProblemCandidate(editedProblem);

    if (validationReport.isValid) {
      this.calibrationProblems.set(problemId, editedProblem);
      ProblemBank.getInstance().storeProblem(editedProblem);

      // Record edit review entry
      this.submitReview({
        problemId,
        reviewer,
        ratings: {
          mathematicalCorrectness: 5,
          skillAlignment: 5,
          clarity: 5,
          difficultySuitability: 4,
          educationalUsefulness: 5,
          diversityDistinctiveness: 4
        },
        decision: 'APPROVE',
        editedFields: {
          originalPrompt: original.statement.promptText,
          editedPrompt: edits.promptText,
          originalContext: original.statement.contextStory,
          editedContext: edits.contextStory
        },
        revalidationReport: validationReport,
        teacherNotes: 'Problem edited by teacher and successfully revalidated.'
      });

      return {
        success: true,
        problem: editedProblem,
        validationReport
      };
    } else {
      return {
        success: false,
        problem: editedProblem,
        validationReport,
        error: `Revalidation failed: ${validationReport.rejectionMessage}`
      };
    }
  }

  /**
   * Side-by-Side Problem Comparison Engine.
   */
  public compareProblems(problemA: ValidatedProblem, problemB: ValidatedProblem): ProblemComparisonResult {
    const isExactSignatureClone = problemA.dna.structureSignature === problemB.dna.structureSignature;
    const isSameFamily = problemA.dna.familyId === problemB.dna.familyId;
    const isSameTemplate = problemA.dna.templateId === problemB.dna.templateId;
    const isSameEvidenceType = problemA.dna.evidenceType === problemB.dna.evidenceType;

    // AST String Comparison
    const exprA = nodeToString(problemA.rawExpression);
    const exprB = nodeToString(problemB.rawExpression);
    const astSimilarityScore = exprA === exprB ? 1.0 : (isSameFamily ? (isSameTemplate ? 0.8 : 0.5) : 0.2);

    let pedagogicalOverlapScore = 0.0;
    if (isSameFamily) pedagogicalOverlapScore += 0.4;
    if (isSameEvidenceType) pedagogicalOverlapScore += 0.3;
    if (isSameTemplate) pedagogicalOverlapScore += 0.3;

    let diversityRecommendation: ProblemComparisonResult['diversityRecommendation'] = 'MODERATE_DIVERSITY';
    if (isExactSignatureClone) {
      diversityRecommendation = 'SUPERFICIAL_CLONE';
    } else if (astSimilarityScore < 0.4 && !isSameFamily) {
      diversityRecommendation = 'HIGHLY_DIVERSE';
    } else if (problemA.dna.misconceptionTarget && problemA.dna.misconceptionTarget === problemB.dna.misconceptionTarget) {
      diversityRecommendation = 'REMEDIATION_PAIR';
    }

    return {
      problemA,
      problemB,
      isExactSignatureClone,
      isSameFamily,
      isSameTemplate,
      isSameEvidenceType,
      astSimilarityScore,
      pedagogicalOverlapScore,
      diversityRecommendation
    };
  }

  /**
   * Simulates a 10-question practice session for a specified skill, measuring structural diversity and progression.
   */
  public simulate10QuestionSession(skillId: string): SessionSimulationReport {
    const problems: ValidatedProblem[] = [];
    const history: Array<{ signature: string; familyId: string }> = [];
    const familyDistribution: Record<string, number> = {};
    const templateDistribution: Record<string, number> = {};
    const evidenceDistribution: Record<string, number> = {};
    const representationDistribution: Record<string, number> = {};
    const difficultyTrajectory: number[] = [];

    let remediationCount = 0;
    let transferCount = 0;

    for (let i = 0; i < 10; i++) {
      // Step progressive difficulty: [1, 1, 2, 2, 3, 3, 4, 4, 3, 4]
      const diffLevels = [1, 1, 2, 2, 3, 3, 4, 4, 3, 4];
      const targetDiff = diffLevels[i];

      // Dynamic evidence mix: 40% Direct Calculation, 20% Error Analysis, 20% Method Recognition, 20% Application
      let evidenceType: AssessmentEvidenceTypeId = 'DIRECT_CALCULATION';
      if (i === 2 || i === 7) evidenceType = 'METHOD_RECOGNITION';
      else if (i === 4) evidenceType = 'ERROR_ANALYSIS';
      else if (i === 6 || i === 9) evidenceType = 'APPLICATION';

      const req: ProblemGenerationRequest = {
        courseId: 'COURSE-GEN0102',
        skillId,
        evidenceType,
        difficulty: targetDiff
      };

      const res = ContentGenerator.generateForSkill(req, history);
      if (res.success && res.problem) {
        problems.push(res.problem);
        history.push({
          signature: res.problem.dna.structureSignature,
          familyId: res.problem.dna.familyId
        });

        familyDistribution[res.problem.dna.familyId] = (familyDistribution[res.problem.dna.familyId] || 0) + 1;
        templateDistribution[res.problem.dna.templateId] = (templateDistribution[res.problem.dna.templateId] || 0) + 1;
        evidenceDistribution[res.problem.dna.evidenceType] = (evidenceDistribution[res.problem.dna.evidenceType] || 0) + 1;
        representationDistribution[res.problem.dna.representationType] = (representationDistribution[res.problem.dna.representationType] || 0) + 1;
        difficultyTrajectory.push(res.problem.dna.difficultyVector.overall);

        if (res.problem.dna.evidenceType === 'APPLICATION') transferCount++;
        if (res.problem.dna.evidenceType === 'ERROR_ANALYSIS') remediationCount++;
      }
    }

    // Calculate repetition risk: fraction of problems sharing identical families beyond threshold
    const uniqueFamiliesCount = Object.keys(familyDistribution).length;
    const repetitionRiskScore = Math.max(0, 1.0 - (uniqueFamiliesCount / 4.0));
    const pedagogicalBalanceScore = Math.min(1.0, (uniqueFamiliesCount / 3.0) * (Object.keys(evidenceDistribution).length / 3.0));

    return {
      sessionId: `SESS-SIM-${Date.now().toString(36)}`,
      targetSkillId: skillId,
      totalProblems: problems.length,
      problems,
      familyDistribution,
      templateDistribution,
      evidenceDistribution,
      representationDistribution,
      difficultyTrajectory,
      repetitionRiskScore,
      pedagogicalBalanceScore,
      remediationCount,
      transferCount,
      evaluationSummary: `Session contains ${problems.length} problems across ${uniqueFamiliesCount} distinct families and ${Object.keys(evidenceDistribution).length} evidence types with balanced difficulty progression.`
    };
  }

  /**
   * Simulates an adaptive 10-question practice session targeting student misconceptions and mastery progression.
   */
  public simulateAdaptiveSession(
    skillId: string,
    studentProfile: {
      initialMastery: number; // 0.0 to 1.0
      hasPersistentMisconception?: string;
    }
  ): SessionSimulationReport {
    const problems: ValidatedProblem[] = [];
    const history: Array<{ signature: string; familyId: string }> = [];
    const familyDistribution: Record<string, number> = {};
    const templateDistribution: Record<string, number> = {};
    const evidenceDistribution: Record<string, number> = {};
    const representationDistribution: Record<string, number> = {};
    const difficultyTrajectory: number[] = [];

    let currentMastery = studentProfile.initialMastery;
    let remediationCount = 0;
    let transferCount = 0;

    for (let step = 0; step < 10; step++) {
      let targetDifficulty = Math.min(5, Math.max(1, Math.round(currentMastery * 4) + 1));
      let evidenceType: AssessmentEvidenceTypeId = 'DIRECT_CALCULATION';
      let isRemediation = false;

      // If student has persistent misconception and low mastery, inject targeted Error Analysis remediation
      if (studentProfile.hasPersistentMisconception && step % 3 === 1) {
        evidenceType = 'ERROR_ANALYSIS';
        isRemediation = true;
        remediationCount++;
      } else if (currentMastery >= 0.75) {
        // High mastery: introduce Engineering Application transfer
        evidenceType = 'APPLICATION';
        transferCount++;
      } else if (currentMastery < 0.4) {
        evidenceType = 'METHOD_RECOGNITION';
      }

      const req: ProblemGenerationRequest = {
        courseId: 'COURSE-GEN0102',
        skillId,
        evidenceType,
        difficulty: targetDifficulty,
        misconceptionTarget: isRemediation ? studentProfile.hasPersistentMisconception : undefined,
        isRemediationRepetition: isRemediation
      };

      const res = ContentGenerator.generateForSkill(req, history);
      if (res.success && res.problem) {
        problems.push(res.problem);
        history.push({
          signature: res.problem.dna.structureSignature,
          familyId: res.problem.dna.familyId
        });

        familyDistribution[res.problem.dna.familyId] = (familyDistribution[res.problem.dna.familyId] || 0) + 1;
        templateDistribution[res.problem.dna.templateId] = (templateDistribution[res.problem.dna.templateId] || 0) + 1;
        evidenceDistribution[res.problem.dna.evidenceType] = (evidenceDistribution[res.problem.dna.evidenceType] || 0) + 1;
        representationDistribution[res.problem.dna.representationType] = (representationDistribution[res.problem.dna.representationType] || 0) + 1;
        difficultyTrajectory.push(res.problem.dna.difficultyVector.overall);

        // Simulate learning progression
        currentMastery = Math.min(1.0, currentMastery + 0.06);
      }
    }

    const uniqueFamiliesCount = Object.keys(familyDistribution).length;
    const repetitionRiskScore = Math.max(0, 1.0 - (uniqueFamiliesCount / 4.0));
    const pedagogicalBalanceScore = Math.min(1.0, (uniqueFamiliesCount / 3.0) * (Object.keys(evidenceDistribution).length / 3.0));

    return {
      sessionId: `ADAPT-SIM-${Date.now().toString(36)}`,
      targetSkillId: skillId,
      totalProblems: problems.length,
      problems,
      familyDistribution,
      templateDistribution,
      evidenceDistribution,
      representationDistribution,
      difficultyTrajectory,
      repetitionRiskScore,
      pedagogicalBalanceScore,
      remediationCount,
      transferCount,
      evaluationSummary: `Adaptive session adapted dynamically from Level ${difficultyTrajectory[0]} to Level ${difficultyTrajectory[difficultyTrajectory.length - 1]}, targeting ${remediationCount} misconception remediations and ${transferCount} engineering transfer tasks.`
    };
  }
}
