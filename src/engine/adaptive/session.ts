/**
 * Practice Session Lifecycle Manager
 * Engineering Practice Engine — Phase 7 Hard Topic Selection Invariant
 */

import { AssessmentEvidenceTypeId } from '../content/assessmentEvidence';
import { ValidatedProblem } from '../content/types';
import { AdaptiveSelector } from './selector';
import { LearningEventStore } from './events';
import { MasteryEngine } from './mastery';
import { ScopeValidator } from './scopeValidator';
import {
  AdaptiveConstraintPolicy,
  AttemptInputSource,
  PracticeAttempt,
  PracticeMode,
  PracticeScope,
  PracticeSession,
  SessionSummary,
} from './types';

export class PracticeSessionManager {
  private static sessions: Map<string, PracticeSession> = new Map();

  /**
   * Starts a new practice session for a student in a specific course.
   * Attaches an immutable PracticeScope and enforces hard scope eligibility.
   */
  public static startSession(
    studentId: string,
    courseId: string,
    modeOrOptions?: PracticeMode | {
      mode?: PracticeMode;
      targetTopicId?: string;
      targetSkillId?: string;
      sessionLength?: number;
      targetEvidenceTypes?: AssessmentEvidenceTypeId[];
      policy?: AdaptiveConstraintPolicy;
      forceDifficulty?: number;
      forceSkillId?: string;
      forceTopicId?: string;
    },
    maybeOptions?: {
      mode?: PracticeMode;
      targetTopicId?: string;
      targetSkillId?: string;
      sessionLength?: number;
      targetEvidenceTypes?: AssessmentEvidenceTypeId[];
      policy?: AdaptiveConstraintPolicy;
      forceDifficulty?: number;
      forceSkillId?: string;
      forceTopicId?: string;
    }
  ): PracticeSession {
    const rawOptions = typeof modeOrOptions === 'object' ? modeOrOptions : (maybeOptions || {});
    const explicitMode = typeof modeOrOptions === 'string' ? modeOrOptions : (modeOrOptions as any)?.mode;

    const targetSkillId = rawOptions.targetSkillId || rawOptions.forceSkillId;
    const targetTopicId = rawOptions.targetTopicId || rawOptions.forceTopicId;
    const forceDifficulty = rawOptions.forceDifficulty ?? rawOptions.policy?.forceDifficulty;

    const sessionId = `SESS-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const mode = explicitMode || rawOptions.mode || (targetSkillId ? 'SKILL_PRACTICE' : targetTopicId ? 'TOPIC_PRACTICE' : 'RECOMMENDED');
    const sessionLength = rawOptions.sessionLength || 5;

    const effectivePolicy: AdaptiveConstraintPolicy | undefined = rawOptions.policy || (forceDifficulty !== undefined || targetSkillId || targetTopicId ? {
      courseId,
      forceDifficulty,
      forceSkillId: targetSkillId,
      forceTopicId: targetTopicId,
      ...(rawOptions.policy || {})
    } : undefined);

    // Construct immutable PracticeScope
    const scope: PracticeScope = {
      courseId,
      topicId: targetTopicId,
      skillId: targetSkillId,
      mode,
      allowedTopicIds: effectivePolicy?.allowedTopicIds,
      allowedSkillIds: effectivePolicy?.allowedSkillIds,
      disabledFamilyIds: effectivePolicy?.disabledFamilyIds,
      difficultyRange: effectivePolicy?.difficultyRange,
      forceDifficulty: effectivePolicy?.forceDifficulty,
      forceArchetypeId: effectivePolicy?.forceArchetypeId,
      forceTaskType: effectivePolicy?.forceTaskType,
      examMode: effectivePolicy?.examMode
    };

    // Log telemetry event
    LearningEventStore.logEvent(studentId, courseId, 'SESSION_STARTED', {
      sessionId,
      mode,
      sessionLength,
      targetTopicId: scope.topicId,
      targetSkillId: scope.skillId
    }, { sessionId });

    // Initial adaptive selection strictly within scope
    const decision = AdaptiveSelector.selectNextBestProblem(
      studentId,
      scope,
      [],
      effectivePolicy
    );

    // Delivery-time final scope check
    if (decision.selectedProblem && !ScopeValidator.isProblemEligible(decision.selectedProblem, scope)) {
      console.error('DELIVERY-TIME SCOPE VIOLATION BLOCKED in startSession:', {
        problem: decision.selectedProblem.dna,
        scope
      });
      decision.selectedProblem = undefined;
      decision.selectedProblemId = 'NO_ELIGIBLE_PROBLEM';
      decision.fallbackReason = 'NO_ELIGIBLE_PROBLEM';
    }

    if (!scope.excludeSignatures) {
      scope.excludeSignatures = [];
    }
    if (decision.selectedProblem?.dna?.structureSignature) {
      scope.excludeSignatures.push(decision.selectedProblem.dna.structureSignature);
    }

    const session: PracticeSession = {
      id: sessionId,
      studentId,
      courseId,
      mode,
      scope,
      targetTopicId: scope.topicId,
      targetSkillId: scope.skillId,
      targetEvidenceTypes: rawOptions.targetEvidenceTypes,
      currentProblemId: decision.selectedProblemId,
      currentProblem: decision.selectedProblem,
      attempts: [],
      sessionLength,
      problemsCompleted: 0,
      status: 'ACTIVE',
      startedAt: new Date().toISOString()
    };

    PracticeSessionManager.sessions.set(sessionId, session);

    // Log problem presentation event
    if (decision.selectedProblem) {
      LearningEventStore.logEvent(studentId, courseId, 'PROBLEM_PRESENTED', {
        problemId: decision.selectedProblemId,
        skillId: decision.targetSkillId,
        topicId: decision.targetTopicId,
        reason: decision.reason
      }, { sessionId, problemId: decision.selectedProblemId, skillId: decision.targetSkillId });
    }

    return session;
  }

  /**
   * Retrieves an active session by ID.
   */
  public static getSession(sessionId: string): PracticeSession | undefined {
    return PracticeSessionManager.sessions.get(sessionId);
  }

  /**
   * Records a student attempt on the current problem in the session.
   */
  public static submitAttempt(
    sessionId: string,
    payload: {
      studentAnswer: string;
      source: AttemptInputSource;
      isCorrect: boolean;
      timeSpentSeconds: number;
      hintLevelUsed: number;
      solutionViewed: boolean;
      mistakeCode?: string;
      mistakeName?: string;
      idempotencyKey?: string;
    }
  ): { attempt: PracticeAttempt; session: PracticeSession; isSessionComplete: boolean } {
    const session = PracticeSessionManager.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Practice session "${sessionId}" not found.`);
    }

    const currentProblem = session.currentProblem;
    const skillId = currentProblem?.dna.primarySkillId || session.targetSkillId || 'SKILL-GEN0102-005';
    const evidenceType = currentProblem?.dna.evidenceType || 'DIRECT_CALCULATION';
    const representationType = currentProblem?.dna.representationType || 'SYMBOLIC';

    // Calculate attempt number for this problem
    const previousAttemptsOnProblem = session.attempts.filter(
      a => a.problemId === session.currentProblemId
    );
    const attemptNumber = previousAttemptsOnProblem.length + 1;

    const attempt: PracticeAttempt = {
      id: `ATT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      sessionId,
      studentId: session.studentId,
      problemId: session.currentProblemId || 'PROB-UNKNOWN',
      courseId: session.courseId,
      topicId: session.targetTopicId || currentProblem?.dna.topicId,
      skillId,
      familyId: currentProblem?.dna.familyId,
      evidenceType,
      representationType,
      studentAnswer: payload.studentAnswer,
      source: payload.source,
      isCorrect: payload.isCorrect,
      mistakeCode: payload.mistakeCode,
      mistakeName: payload.mistakeName,
      hintLevelUsed: payload.hintLevelUsed,
      solutionViewed: payload.solutionViewed,
      timeSpentSeconds: payload.timeSpentSeconds,
      attemptNumber,
      idempotencyKey: payload.idempotencyKey,
      createdAt: new Date().toISOString()
    };

    session.attempts.push(attempt);

    // 1. Telemetry Log
    LearningEventStore.logEvent(
      session.studentId,
      session.courseId,
      'ATTEMPT_SUBMITTED',
      {
        attemptId: attempt.id,
        source: payload.source,
        isCorrect: payload.isCorrect,
        hintLevel: payload.hintLevelUsed,
        solutionViewed: payload.solutionViewed,
        mistakeCode: payload.mistakeCode,
        timeSpentSeconds: payload.timeSpentSeconds,
        attemptNumber
      },
      {
        sessionId,
        problemId: attempt.problemId,
        skillId: attempt.skillId,
        idempotencyKey: payload.idempotencyKey
      }
    );

    // 2. Update Mastery Engine
    MasteryEngine.updateFromAttempt(attempt);

    // 3. Update Session Progress
    if (payload.isCorrect || payload.solutionViewed) {
      session.problemsCompleted++;
      LearningEventStore.logEvent(session.studentId, session.courseId, 'PROBLEM_COMPLETED', {
        problemId: attempt.problemId,
        skillId: attempt.skillId,
        solved: payload.isCorrect,
        totalAttemptsOnProblem: attemptNumber
      }, { sessionId, problemId: attempt.problemId });
    }

    const isSessionComplete = session.problemsCompleted >= session.sessionLength;
    if (isSessionComplete && session.status === 'ACTIVE') {
      PracticeSessionManager.completeSession(sessionId);
    }

    return { attempt, session, isSessionComplete };
  }

  /**
   * Advances the session to the next adaptive problem strictly preserving the session scope.
   */
  public static nextProblem(
    sessionId: string,
    policy?: AdaptiveConstraintPolicy
  ): { problem?: ValidatedProblem; decision: import('./types').AdaptiveDecision } {
    const session = PracticeSessionManager.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Practice session "${sessionId}" not found.`);
    }

    const excludedProblemIds = new Set<string>();
    if (session.currentProblemId && session.currentProblemId !== 'NO_ELIGIBLE_PROBLEM') {
      excludedProblemIds.add(session.currentProblemId);
    }
    for (const attempt of session.attempts) {
      excludedProblemIds.add(attempt.problemId);
    }
    if (session.scope.excludeProblemIds) {
      for (const id of session.scope.excludeProblemIds) {
        excludedProblemIds.add(id);
      }
    }
    if (policy?.excludeProblemIds) {
      for (const id of policy.excludeProblemIds) {
        excludedProblemIds.add(id);
      }
    }

    const excludedSignatures = new Set<string>();
    if (session.currentProblem?.dna?.structureSignature) {
      excludedSignatures.add(session.currentProblem.dna.structureSignature);
    }
    if (session.scope.excludeSignatures) {
      for (const sig of session.scope.excludeSignatures) {
        if (sig) excludedSignatures.add(sig);
      }
    }
    if (policy?.excludeSignatures) {
      for (const sig of policy.excludeSignatures) {
        if (sig) excludedSignatures.add(sig);
      }
    }

    const excludedArchetypes = new Set<string>();
    if (session.currentProblem?.dna?.archetypeId) {
      excludedArchetypes.add(session.currentProblem.dna.archetypeId);
    }
    if (session.scope.excludeArchetypeIds) {
      for (const arch of session.scope.excludeArchetypeIds) if (arch) excludedArchetypes.add(arch);
    }
    if (policy?.excludeArchetypeIds) {
      for (const arch of policy.excludeArchetypeIds) if (arch) excludedArchetypes.add(arch);
    }

    const recentHistory = session.attempts.map(a => ({
      skillId: a.skillId,
      familyId: a.familyId,
      problemId: a.problemId
    }));
    if (session.currentProblem && session.currentProblemId && session.currentProblemId !== 'NO_ELIGIBLE_PROBLEM') {
      recentHistory.push({
        skillId: session.currentProblem.dna.primarySkillId,
        familyId: session.currentProblem.dna.familyId,
        problemId: session.currentProblemId
      });
    }

    // Merge session scope with any transient adjustment policy without escaping course or topic
    const effectiveScope: PracticeScope = {
      ...session.scope,
      skillId: policy?.forceSkillId || session.scope.skillId,
      topicId: policy?.forceTopicId || session.scope.topicId,
      difficultyRange: policy?.difficultyRange || session.scope.difficultyRange,
      forceDifficulty: policy?.forceDifficulty !== undefined ? policy.forceDifficulty : session.scope.forceDifficulty,
      allowedTopicIds: policy?.allowedTopicIds || session.scope.allowedTopicIds,
      allowedSkillIds: policy?.allowedSkillIds || session.scope.allowedSkillIds,
      disabledFamilyIds: policy?.disabledFamilyIds || session.scope.disabledFamilyIds,
      examMode: policy?.examMode !== undefined ? policy.examMode : session.scope.examMode,
      excludeProblemIds: Array.from(excludedProblemIds),
      excludeSignatures: Array.from(excludedSignatures),
      excludeArchetypeIds: Array.from(excludedArchetypes),
      forceArchetypeId: policy?.forceArchetypeId || session.scope.forceArchetypeId,
      forceTaskType: policy?.forceTaskType || session.scope.forceTaskType
    };

    const mergedPolicy: AdaptiveConstraintPolicy = {
      courseId: policy?.courseId || session.courseId,
      ...policy,
      excludeProblemIds: Array.from(excludedProblemIds),
      excludeSignatures: Array.from(excludedSignatures),
      excludeArchetypeIds: Array.from(excludedArchetypes),
      forceArchetypeId: policy?.forceArchetypeId,
      forceTaskType: policy?.forceTaskType
    };

    const decision = AdaptiveSelector.selectNextBestProblem(
      session.studentId,
      effectiveScope,
      recentHistory,
      mergedPolicy
    );

    // Delivery-time final scope check
    if (decision.selectedProblem && !ScopeValidator.isProblemEligible(decision.selectedProblem, session.scope)) {
      console.error('DELIVERY-TIME SCOPE VIOLATION BLOCKED in nextProblem:', {
        problem: decision.selectedProblem.dna,
        scope: session.scope
      });
      decision.selectedProblem = undefined;
      decision.selectedProblemId = 'NO_ELIGIBLE_PROBLEM';
      decision.fallbackReason = 'NO_ELIGIBLE_PROBLEM';
    }

    // Persist all presented and excluded problem IDs, signatures, and archetypes in session scope
    session.scope.excludeProblemIds = Array.from(excludedProblemIds);
    session.scope.excludeSignatures = Array.from(excludedSignatures);
    session.scope.excludeArchetypeIds = Array.from(excludedArchetypes);

    session.currentProblemId = decision.selectedProblemId;
    session.currentProblem = decision.selectedProblem;

    if (decision.selectedProblemId && decision.selectedProblemId !== 'NO_ELIGIBLE_PROBLEM') {
      if (!session.scope.excludeProblemIds.includes(decision.selectedProblemId)) {
        session.scope.excludeProblemIds.push(decision.selectedProblemId);
      }
    }
    if (decision.selectedProblem?.dna?.structureSignature) {
      if (!session.scope.excludeSignatures.includes(decision.selectedProblem.dna.structureSignature)) {
        session.scope.excludeSignatures.push(decision.selectedProblem.dna.structureSignature);
      }
    }
    if (decision.selectedProblem?.dna?.archetypeId) {
      if (!session.scope.excludeArchetypeIds.includes(decision.selectedProblem.dna.archetypeId)) {
        session.scope.excludeArchetypeIds.push(decision.selectedProblem.dna.archetypeId);
      }
    }

    if (decision.selectedProblem) {
      LearningEventStore.logEvent(session.studentId, session.courseId, 'PROBLEM_PRESENTED', {
        problemId: decision.selectedProblemId,
        skillId: decision.targetSkillId,
        topicId: decision.targetTopicId,
        reason: decision.reason
      }, { sessionId, problemId: decision.selectedProblemId, skillId: decision.targetSkillId });
    }

    return { problem: decision.selectedProblem, decision };
  }

  /**
   * Completes a practice session and compiles a comprehensive pedagogical summary.
   */
  public static completeSession(sessionId: string): SessionSummary {
    const session = PracticeSessionManager.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Practice session "${sessionId}" not found.`);
    }

    session.status = 'COMPLETED';
    session.completedAt = new Date().toISOString();

    const skillsPracticedSet = new Set<string>();
    let totalTimeSpent = 0;
    let totalHintsUsed = 0;
    let solutionsViewedCount = 0;
    let totalSolved = 0;

    for (const att of session.attempts) {
      skillsPracticedSet.add(att.skillId);
      totalTimeSpent += att.timeSpentSeconds;
      totalHintsUsed += att.hintLevelUsed;
      if (att.solutionViewed) solutionsViewedCount++;
      if (att.isCorrect) {
        totalSolved++;
      }
    }

    const skillsPracticed = Array.from(skillsPracticedSet);
    const strongSkills: string[] = [];
    const skillsNeedingReview: string[] = [];

    for (const skillId of skillsPracticed) {
      const mastery = MasteryEngine.getSkillMastery(session.studentId, skillId);
      if (mastery.masteryPercentage >= 75) {
        strongSkills.push(skillId);
      } else {
        skillsNeedingReview.push(skillId);
      }
    }

    // Determine adaptive next recommendation strictly within active course
    const nextDecision = AdaptiveSelector.selectNextBestProblem(
      session.studentId,
      session.courseId,
      session.attempts.map(a => ({ skillId: a.skillId, familyId: a.familyId, problemId: a.problemId }))
    );

    const summary: SessionSummary = {
      sessionId,
      courseId: session.courseId,
      mode: session.mode,
      totalProblemsAttempted: session.problemsCompleted,
      totalProblemsSolved: totalSolved,
      totalTimeSpentSeconds: totalTimeSpent,
      skillsPracticed,
      strongSkills,
      skillsNeedingReview,
      totalHintsUsed,
      solutionsViewedCount,
      recommendedNextSkillId: nextDecision.targetSkillId,
      recommendedNextReason: nextDecision.explanation,
      completedAt: session.completedAt
    };

    session.summary = summary;

    LearningEventStore.logEvent(session.studentId, session.courseId, 'SESSION_COMPLETED', {
      totalProblemsSolved: totalSolved,
      totalTimeSpentSeconds: totalTimeSpent,
      strongSkillsCount: strongSkills.length,
      skillsNeedingReviewCount: skillsNeedingReview.length
    }, { sessionId });

    return summary;
  }

  /**
   * Resets all stored sessions (testing utility).
   */
  public static clear(): void {
    PracticeSessionManager.sessions.clear();
  }
}
