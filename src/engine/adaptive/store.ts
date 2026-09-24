/**
 * Unified Multi-Course Practice Store & Persistence Repository
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { AssessmentEvidenceTypeId } from '../content/assessmentEvidence';
import { ContentRepresentationType, ValidatedProblem } from '../content/types';
import { curriculumRegistry } from '../curriculum/registry';
import { LearningEventStore } from './events';
import { MasteryEngine } from './mastery';
import { AdaptiveSelector } from './selector';
import { PracticeSessionManager } from './session';
import {
  AdaptiveConstraintPolicy,
  AdaptiveDecision,
  AttemptInputSource,
  CourseMasteryRecord,
  LearningEvent,
  PracticeAttempt,
  PracticeMode,
  PracticeSession,
  SessionSummary,
  SkillMasteryRecord,
} from './types';

export interface UnifiedStudentProfile {
  id: string;
  userId: string;
  fullName: string;
  activeCourseId: string;
  currentStreak: number;
  bestStreak: number;
  totalProblemsSolved: number;
  totalAttempts: number;
  totalTimeSpentSeconds: number;
  preferredGuidedness: 1 | 2 | 3 | 4;
}

export const DEFAULT_PROFILE: UnifiedStudentProfile = {
  id: 'usr_student_demo',
  userId: 'usr_student_demo',
  fullName: 'Engineering Practice Student',
  activeCourseId: 'COURSE-GEN0102',
  currentStreak: 3,
  bestStreak: 7,
  totalProblemsSolved: 14,
  totalAttempts: 18,
  totalTimeSpentSeconds: 1420,
  preferredGuidedness: 1,
};

export class UnifiedPracticeStore {
  private static profile: UnifiedStudentProfile = { ...DEFAULT_PROFILE };
  private static activeCourseId = 'COURSE-GEN0102';
  private static attempts: PracticeAttempt[] = [];
  private static isInitialized = false;

  public static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public static initialize(): void {
    if (UnifiedPracticeStore.isInitialized) return;
    UnifiedPracticeStore.load();
    UnifiedPracticeStore.isInitialized = true;
  }

  public static load(): void {
    if (!UnifiedPracticeStore.isBrowser()) return;
    try {
      const storedProfile = localStorage.getItem('epe_unified_profile');
      if (storedProfile) {
        UnifiedPracticeStore.profile = JSON.parse(storedProfile);
        UnifiedPracticeStore.activeCourseId = UnifiedPracticeStore.profile.activeCourseId || 'COURSE-GEN0102';
      }

      const storedCourse = localStorage.getItem('epe_active_course');
      if (storedCourse) {
        UnifiedPracticeStore.activeCourseId = storedCourse;
      }

      const storedAttempts = localStorage.getItem('epe_unified_attempts');
      if (storedAttempts) {
        UnifiedPracticeStore.attempts = JSON.parse(storedAttempts);
      }

      const storedEvents = localStorage.getItem('epe_telemetry_events');
      if (storedEvents) {
        const events: LearningEvent[] = JSON.parse(storedEvents);
        LearningEventStore.loadHistoricalEvents(events);
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
  }

  public static save(): void {
    if (!UnifiedPracticeStore.isBrowser()) return;
    try {
      localStorage.setItem('epe_unified_profile', JSON.stringify(UnifiedPracticeStore.profile));
      localStorage.setItem('epe_active_course', UnifiedPracticeStore.activeCourseId);
      localStorage.setItem('epe_unified_attempts', JSON.stringify(UnifiedPracticeStore.attempts));
      localStorage.setItem(
        'epe_telemetry_events',
        JSON.stringify(LearningEventStore.getEventsForStudent(UnifiedPracticeStore.profile.id))
      );
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  public static getProfile(): UnifiedStudentProfile {
    UnifiedPracticeStore.initialize();
    return UnifiedPracticeStore.profile;
  }

  public static getActiveCourseId(): string {
    UnifiedPracticeStore.initialize();
    return UnifiedPracticeStore.activeCourseId;
  }

  public static setActiveCourseId(courseId: string): void {
    UnifiedPracticeStore.initialize();
    UnifiedPracticeStore.activeCourseId = courseId;
    UnifiedPracticeStore.profile.activeCourseId = courseId;
    UnifiedPracticeStore.save();
  }

  public static getCourseMastery(courseId?: string): CourseMasteryRecord {
    UnifiedPracticeStore.initialize();
    const targetCourse = courseId || UnifiedPracticeStore.activeCourseId;
    return MasteryEngine.getCourseMastery(UnifiedPracticeStore.profile.id, targetCourse);
  }

  public static getSkillMastery(skillId: string): SkillMasteryRecord {
    UnifiedPracticeStore.initialize();
    return MasteryEngine.getSkillMastery(UnifiedPracticeStore.profile.id, skillId);
  }

  public static getAttempts(): PracticeAttempt[] {
    UnifiedPracticeStore.initialize();
    return UnifiedPracticeStore.attempts;
  }

  public static startSession(
    courseId?: string,
    options?: {
      mode?: PracticeMode;
      targetTopicId?: string;
      targetSkillId?: string;
      sessionLength?: number;
      targetEvidenceTypes?: AssessmentEvidenceTypeId[];
      policy?: AdaptiveConstraintPolicy;
    }
  ): PracticeSession {
    UnifiedPracticeStore.initialize();
    const targetCourse = courseId || UnifiedPracticeStore.activeCourseId;
    const session = PracticeSessionManager.startSession(
      UnifiedPracticeStore.profile.id,
      targetCourse,
      options
    );
    UnifiedPracticeStore.save();
    return session;
  }

  public static getSession(sessionId: string): PracticeSession | undefined {
    UnifiedPracticeStore.initialize();
    return PracticeSessionManager.getSession(sessionId);
  }

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
    UnifiedPracticeStore.initialize();
    const res = PracticeSessionManager.submitAttempt(sessionId, payload);

    UnifiedPracticeStore.attempts.push(res.attempt);
    UnifiedPracticeStore.profile.totalAttempts++;
    UnifiedPracticeStore.profile.totalTimeSpentSeconds += payload.timeSpentSeconds;

    if (payload.isCorrect) {
      if (res.attempt.attemptNumber === 1 && payload.hintLevelUsed === 0) {
        UnifiedPracticeStore.profile.currentStreak++;
        if (UnifiedPracticeStore.profile.currentStreak > UnifiedPracticeStore.profile.bestStreak) {
          UnifiedPracticeStore.profile.bestStreak = UnifiedPracticeStore.profile.currentStreak;
        }
      }
      UnifiedPracticeStore.profile.totalProblemsSolved++;
    } else if (payload.solutionViewed) {
      UnifiedPracticeStore.profile.currentStreak = 0;
    }

    UnifiedPracticeStore.save();
    return res;
  }

  public static nextProblem(
    sessionId: string,
    policy?: AdaptiveConstraintPolicy
  ): { problem?: ValidatedProblem; decision: AdaptiveDecision } {
    UnifiedPracticeStore.initialize();
    const res = PracticeSessionManager.nextProblem(sessionId, policy);
    UnifiedPracticeStore.save();
    return res;
  }

  public static completeSession(sessionId: string): SessionSummary {
    UnifiedPracticeStore.initialize();
    const summary = PracticeSessionManager.completeSession(sessionId);
    UnifiedPracticeStore.save();
    return summary;
  }

  public static getRecommendation(courseId?: string): AdaptiveDecision {
    UnifiedPracticeStore.initialize();
    const targetCourse = courseId || UnifiedPracticeStore.activeCourseId;
    const recentHistory = UnifiedPracticeStore.attempts.slice(-5).map(a => ({
      skillId: a.skillId,
      familyId: a.familyId,
      problemId: a.problemId
    }));
    return AdaptiveSelector.selectNextBestProblem(
      UnifiedPracticeStore.profile.id,
      targetCourse,
      recentHistory
    );
  }

  public static clear(): void {
    UnifiedPracticeStore.profile = { ...DEFAULT_PROFILE };
    UnifiedPracticeStore.activeCourseId = 'COURSE-GEN0102';
    UnifiedPracticeStore.attempts = [];
    UnifiedPracticeStore.isInitialized = false;
    MasteryEngine.clear();
    PracticeSessionManager.clear();
    LearningEventStore.clear();
    if (UnifiedPracticeStore.isBrowser()) {
      localStorage.removeItem('epe_unified_profile');
      localStorage.removeItem('epe_active_course');
      localStorage.removeItem('epe_unified_attempts');
      localStorage.removeItem('epe_telemetry_events');
    }
  }
}
