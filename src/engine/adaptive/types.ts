/**
 * Multi-Course Adaptive Learning & Practice Session Types
 * Engineering Practice Engine — Phase 6 & Phase 7 Hard Topic Selection Constraints
 */

import { AssessmentEvidenceTypeId } from '../content/assessmentEvidence';
import { ContentRepresentationType, PedagogicalTaskType, ProblemDNA, ValidatedProblem } from '../content/types';

export type PracticeMode =
  | 'RECOMMENDED'
  | 'TOPIC_PRACTICE'
  | 'SKILL_PRACTICE'
  | 'REMEDIATION'
  | 'REVIEW'
  | 'CHALLENGE'
  | 'EXAM'
  | 'TEACHER_ASSIGNMENT';

export type AttemptInputSource = 'TYPED' | 'PICTURE' | 'MANUAL_CORRECTION';

export type AdaptiveDecisionReason =
  | 'USER_REQUEST'
  | 'REMEDIATION'
  | 'PREREQUISITE'
  | 'RETRIEVAL'
  | 'PROGRESSION'
  | 'TRANSFER'
  | 'DIVERSITY'
  | 'TEACHER_ASSIGNMENT';

export type LearningEventType =
  | 'SESSION_STARTED'
  | 'PROBLEM_PRESENTED'
  | 'ATTEMPT_SUBMITTED'
  | 'HINT_REQUESTED'
  | 'SOLUTION_VIEWED'
  | 'PICTURE_RECOGNIZED'
  | 'RECOGNITION_CORRECTED'
  | 'TUTOR_INTERACTION'
  | 'PROBLEM_COMPLETED'
  | 'PROBLEM_ABANDONED'
  | 'SESSION_COMPLETED';

/**
 * Authoritative Practice Scope
 * Immutable boundary definition that strictly bounds problem selection,
 * generation, and adaptive decisions.
 */
export interface PracticeScope {
  courseId: string;
  topicId?: string;
  subtopicId?: string;
  skillId?: string;
  mode: PracticeMode;
  allowedTopicIds?: string[];
  allowedSkillIds?: string[];
  disabledFamilyIds?: string[];
  difficultyRange?: [number, number];
  forceDifficulty?: number;
  excludeProblemIds?: string[];
  excludeSignatures?: string[];
  excludeArchetypeIds?: string[];
  forceArchetypeId?: string;
  forceTaskType?: PedagogicalTaskType;
  examMode?: boolean;
}

export type ScopeValidationErrorCode =
  | 'COURSE_MISMATCH'
  | 'TOPIC_MISMATCH'
  | 'SUBTOPIC_MISMATCH'
  | 'SKILL_MISMATCH'
  | 'ORPHAN_PROBLEM'
  | 'INVALID_CURRICULUM_LINEAGE'
  | 'NO_ELIGIBLE_PROBLEM';

export interface ScopeValidationError {
  code: ScopeValidationErrorCode;
  message: string;
  expected?: string;
  actual?: string;
}

export interface ScopeValidationResult {
  valid: boolean;
  errors: ScopeValidationError[];
}

export interface PracticeAttempt {
  id: string;
  sessionId: string;
  studentId: string;
  problemId: string;
  courseId: string;
  topicId?: string;
  skillId: string;
  familyId?: string;
  problemFamilyId?: string;
  masterProblemId?: string;
  skillClusterId?: string;
  isParameterVariation?: boolean;
  evidenceType: AssessmentEvidenceTypeId;
  representationType: ContentRepresentationType;
  studentAnswer: string;
  source: AttemptInputSource;
  isCorrect: boolean;
  mistakeCode?: string;
  mistakeName?: string;
  hintLevelUsed: number;
  solutionViewed: boolean;
  timeSpentSeconds: number;
  attemptNumber: number; // 1 for first try, 2 for retry, etc.
  idempotencyKey?: string;
  createdAt: string;
}

export interface LearningEvent {
  id: string;
  studentId: string;
  courseId: string;
  skillId?: string;
  problemId?: string;
  sessionId?: string;
  type: LearningEventType;
  timestamp: string;
  sequenceNumber: number;
  idempotencyKey?: string;
  metadata: Record<string, unknown>;
}

export interface AdaptiveDecision {
  selectedProblem?: ValidatedProblem;
  selectedProblemId: string;
  courseId: string;
  targetSkillId: string;
  targetTopicId?: string;
  targetEvidenceType: AssessmentEvidenceTypeId;
  targetDifficulty: number;
  targetRepresentation: ContentRepresentationType;
  reason: AdaptiveDecisionReason;
  explanation: string; // Plain-English student-facing explanation
  teacherExplanation?: string; // Pedagogical explanation for teachers
  supportingFactors: string[];
  confidence: number;
  fallbackReason?: string;
}

export interface ActiveMisconceptionRecord {
  code: string;
  name: string;
  occurredCount: number;
  lastOccurredAt: string;
  resolved: boolean;
}

export interface SkillMasteryRecord {
  skillId: string;
  courseId: string;
  masteryScore: number; // 0.0 to 1.0 (or 0% to 100%)
  masteryPercentage: number; // 0 to 100
  confidence: number; // 0.0 to 1.0 based on attempt sample size
  totalAttempts: number;
  correctAttempts: number;
  unaidedCorrectAttempts: number; // hintLevel === 0, attemptNumber === 1
  assistedCorrectAttempts: number; // hintLevel > 0 or attemptNumber > 1
  evidenceMastery: Partial<Record<AssessmentEvidenceTypeId, number>>;
  representationMastery: Partial<Record<ContentRepresentationType, number>>;
  activeMisconceptions: ActiveMisconceptionRecord[];
  lastPracticedAt?: string;
  recentTrend: 'IMPROVING' | 'DECLINING' | 'STABLE' | 'NEW';
}

export interface CourseMasteryRecord {
  courseId: string;
  courseName: string;
  overallMasteryPercentage: number;
  skillsPracticedCount: number;
  skillsMasteredCount: number;
  totalAttempts: number;
  totalCorrectAttempts: number;
  skillMasteries: Record<string, SkillMasteryRecord>;
  lastPracticedAt?: string;
}

export interface SessionSummary {
  sessionId: string;
  courseId: string;
  mode: PracticeMode;
  totalProblemsAttempted: number;
  totalProblemsSolved: number;
  totalTimeSpentSeconds: number;
  skillsPracticed: string[];
  strongSkills: string[];
  skillsNeedingReview: string[];
  totalHintsUsed: number;
  solutionsViewedCount: number;
  recommendedNextSkillId?: string;
  recommendedNextReason?: string;
  completedAt: string;
}

export interface PracticeSession {
  id: string;
  studentId: string;
  courseId: string;
  mode: PracticeMode;
  scope: PracticeScope;
  targetTopicId?: string;
  targetSkillId?: string;
  targetEvidenceTypes?: AssessmentEvidenceTypeId[];
  currentProblemId?: string;
  currentProblem?: ValidatedProblem;
  attempts: PracticeAttempt[];
  sessionLength: number; // default 5, 10, 15, 20
  problemsCompleted: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  startedAt: string;
  completedAt?: string;
  summary?: SessionSummary;
}

export interface AdaptiveConstraintPolicy {
  courseId: string;
  allowedTopicIds?: string[];
  allowedSkillIds?: string[];
  disabledFamilyIds?: string[];
  difficultyRange?: [number, number];
  forceDifficulty?: number;
  excludeProblemIds?: string[];
  excludeSignatures?: string[];
  excludeArchetypeIds?: string[];
  forceArchetypeId?: string;
  forceTaskType?: PedagogicalTaskType;
  forceTopicId?: string;
  forceSkillId?: string;
  forceEvidenceType?: AssessmentEvidenceTypeId;
  forceRepresentation?: ContentRepresentationType;
  examMode?: boolean;
  hintsEnabled?: boolean;
  tutorEnabled?: boolean;
  pictureEnabled?: boolean;
}
