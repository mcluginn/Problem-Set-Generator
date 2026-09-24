/**
 * Multi-Course Skill & Dimensional Mastery Engine
 * Engineering Practice Engine — Phase 6 Adaptive Learning Loop
 */

import { AssessmentEvidenceTypeId } from '../content/assessmentEvidence';
import { ContentRepresentationType } from '../content/types';
import { curriculumRegistry } from '../curriculum/registry';
import { LEGACY_SKILL_TO_CLUSTER_MAP } from '../curriculum/goldenMasterRegistry';
import {
  ActiveMisconceptionRecord,
  CourseMasteryRecord,
  PracticeAttempt,
  SkillMasteryRecord,
} from './types';

export class MasteryEngine {
  // Keyed by studentId -> skillId -> SkillMasteryRecord
  private static studentMasteryStore: Map<string, Map<string, SkillMasteryRecord>> = new Map();
  // Keyed by studentId -> familyOrClusterId -> exposure count
  private static studentFamilyExposureStore: Map<string, Map<string, number>> = new Map();

  /**
   * Returns deterministic damping multiplier based on structural family exposure count:
   * 1st exposure: 1.00 (100%)
   * 2nd exposure: 0.60 (60%)
   * 3rd exposure: 0.30 (30%)
   * 4th and later: 0.10 (10%)
   */
  public static getDampingMultiplier(exposureCount: number): number {
    if (exposureCount <= 1) return 1.0;
    if (exposureCount === 2) return 0.6;
    if (exposureCount === 3) return 0.3;
    return 0.1;
  }

  public static getFamilyExposureCount(studentId: string, familyKey: string): number {
    const studentStore = MasteryEngine.studentFamilyExposureStore.get(studentId);
    return studentStore?.get(familyKey) || 0;
  }

  public static recordFamilyExposure(studentId: string, familyKey: string): number {
    let studentStore = MasteryEngine.studentFamilyExposureStore.get(studentId);
    if (!studentStore) {
      studentStore = new Map();
      MasteryEngine.studentFamilyExposureStore.set(studentId, studentStore);
    }
    const current = (studentStore.get(familyKey) || 0) + 1;
    studentStore.set(familyKey, current);
    return current;
  }

  public static resetStudentData(studentId?: string): void {
    if (studentId) {
      MasteryEngine.studentMasteryStore.delete(studentId);
      MasteryEngine.studentFamilyExposureStore.delete(studentId);
    } else {
      MasteryEngine.studentMasteryStore.clear();
      MasteryEngine.studentFamilyExposureStore.clear();
    }
  }

  /**
   * Initializes a default baseline mastery record for a given skill.
   */
  public static createDefaultSkillMastery(
    skillId: string,
    courseId: string,
    initialMastery = 0
  ): SkillMasteryRecord {
    return {
      skillId,
      courseId,
      masteryScore: initialMastery / 100,
      masteryPercentage: initialMastery,
      confidence: initialMastery > 0 ? 0.3 : 0.0,
      totalAttempts: 0,
      correctAttempts: 0,
      unaidedCorrectAttempts: 0,
      assistedCorrectAttempts: 0,
      evidenceMastery: {},
      representationMastery: {},
      activeMisconceptions: [],
      recentTrend: initialMastery > 0 ? 'STABLE' : 'NEW',
    };
  }

  /**
   * Retrieves mastery record for a specific student and skill.
   */
  public static getSkillMastery(studentId: string, skillId: string): SkillMasteryRecord {
    let studentSkills = MasteryEngine.studentMasteryStore.get(studentId);
    if (!studentSkills) {
      studentSkills = new Map();
      MasteryEngine.studentMasteryStore.set(studentId, studentSkills);
    }

    let record = studentSkills.get(skillId);
    if (!record) {
      const alias = LEGACY_SKILL_TO_CLUSTER_MAP[skillId];
      if (alias) {
        record = studentSkills.get(alias);
      }
    }
    if (!record) {
      // Also check if skillId is a cluster that has a registered legacy skill
      for (const [legacyId, clusterId] of Object.entries(LEGACY_SKILL_TO_CLUSTER_MAP)) {
        if (clusterId === skillId && studentSkills.has(legacyId)) {
          record = studentSkills.get(legacyId);
          break;
        }
      }
    }
    if (!record) {
      const skill = curriculumRegistry.getSkillById(skillId);
      const courseId = skill?.parentCourseId || 'COURSE-GEN0102';
      record = MasteryEngine.createDefaultSkillMastery(skillId, courseId, 0);
      studentSkills.set(skillId, record);
    }

    return record;
  }

  /**
   * Processes a real practice attempt and deterministically updates skill & dimensional mastery.
   */
  public static updateFromAttempt(attempt: PracticeAttempt): SkillMasteryRecord {
    const record = MasteryEngine.getSkillMastery(attempt.studentId, attempt.skillId);

    record.totalAttempts++;
    record.lastPracticedAt = attempt.createdAt || new Date().toISOString();

    let delta = 0;
    const isUnaided = attempt.isCorrect && attempt.attemptNumber === 1 && attempt.hintLevelUsed === 0 && !attempt.solutionViewed;
    const isLowHintAssisted = attempt.isCorrect && attempt.attemptNumber === 1 && attempt.hintLevelUsed <= 2 && !attempt.solutionViewed;
    const isHighHintAssisted = attempt.isCorrect && (attempt.hintLevelUsed >= 3 || attempt.solutionViewed);
    const isRetryCorrect = attempt.isCorrect && attempt.attemptNumber > 1 && !attempt.solutionViewed;

    if (attempt.isCorrect) {
      record.correctAttempts++;

      if (isUnaided) {
        record.unaidedCorrectAttempts++;
        delta = 10;
      } else if (isLowHintAssisted) {
        record.assistedCorrectAttempts++;
        delta = 5;
      } else if (isHighHintAssisted) {
        record.assistedCorrectAttempts++;
        delta = 2;
      } else if (isRetryCorrect) {
        record.assistedCorrectAttempts++;
        delta = 4;
      } else {
        delta = 5;
      }

      // Structural Family Exposure Tracking & Mastery Damping
      // Diminishing returns on repeated coefficient variants of the same structural family:
      // Exposure 1: 1.00 (100%), Exposure 2: 0.60 (60%), Exposure 3: 0.30 (30%), Exposure 4+: 0.10 (10%)
      const familyKey = attempt.problemFamilyId || attempt.familyId || attempt.skillClusterId;
      let dampingMultiplier = 1.0;
      if (familyKey) {
        const exposure = MasteryEngine.recordFamilyExposure(attempt.studentId, familyKey);
        dampingMultiplier = MasteryEngine.getDampingMultiplier(exposure);
        delta = Math.round(delta * dampingMultiplier * 10) / 10;
      }

      // If correct, check if any active misconception can now be resolved
      if (record.activeMisconceptions.length > 0) {
        for (const misc of record.activeMisconceptions) {
          if (!misc.resolved) {
            misc.resolved = true;
          }
        }
      }
    } else {
      // Incorrect attempt
      if (attempt.solutionViewed) {
        delta = -6;
      } else {
        delta = -4;
      }

      // Register or update active misconception
      if (attempt.mistakeCode) {
        const existing = record.activeMisconceptions.find(m => m.code === attempt.mistakeCode);
        if (existing) {
          existing.occurredCount++;
          existing.lastOccurredAt = attempt.createdAt || new Date().toISOString();
          existing.resolved = false;
        } else {
          record.activeMisconceptions.push({
            code: attempt.mistakeCode,
            name: attempt.mistakeName || attempt.mistakeCode,
            occurredCount: 1,
            lastOccurredAt: attempt.createdAt || new Date().toISOString(),
            resolved: false
          });
        }
      }
    }

    // Apply bounded percentage update
    record.masteryPercentage = Math.max(0, Math.min(100, record.masteryPercentage + delta));
    record.masteryScore = record.masteryPercentage / 100;
    record.confidence = Math.min(1.0, record.totalAttempts / 8);
    record.recentTrend = delta > 0 ? 'IMPROVING' : delta < 0 ? 'DECLINING' : 'STABLE';

    // Update Evidence-Specific Mastery Dimension
    const familyKey = attempt.problemFamilyId || attempt.familyId || attempt.skillClusterId;
    const dampingMul = familyKey ? MasteryEngine.getDampingMultiplier(MasteryEngine.getFamilyExposureCount(attempt.studentId, familyKey)) : 1.0;
    if (attempt.evidenceType) {
      const currentEv = record.evidenceMastery[attempt.evidenceType] ?? record.masteryPercentage;
      const evDelta = attempt.isCorrect ? Math.round((isUnaided ? 12 : 6) * dampingMul) : -5;
      record.evidenceMastery[attempt.evidenceType] = Math.max(0, Math.min(100, currentEv + evDelta));
    }

    // Update Representation-Specific Mastery Dimension
    if (attempt.representationType) {
      const currentRep = record.representationMastery[attempt.representationType] ?? record.masteryPercentage;
      const repDelta = attempt.isCorrect ? Math.round((isUnaided ? 12 : 6) * dampingMul) : -5;
      record.representationMastery[attempt.representationType] = Math.max(0, Math.min(100, currentRep + repDelta));
    }

    return record;
  }

  /**
   * Aggregates course-wide mastery across all skills in an authoritative course.
   */
  public static getCourseMastery(studentId: string, courseId: string): CourseMasteryRecord {
    const course = curriculumRegistry.getCourseById(courseId);
    const courseSkills = curriculumRegistry.getSkillsByCourse(courseId);
    const studentSkills = MasteryEngine.studentMasteryStore.get(studentId);

    const skillMasteries: Record<string, SkillMasteryRecord> = {};
    let totalAttempts = 0;
    let totalCorrect = 0;
    let totalMasterySum = 0;
    let skillsPracticedCount = 0;
    let skillsMasteredCount = 0;
    let lastPracticedAt: string | undefined;

    for (const skill of courseSkills) {
      let record = studentSkills?.get(skill.id);
      if (!record) {
        record = MasteryEngine.createDefaultSkillMastery(skill.id, courseId, 0);
      }
      skillMasteries[skill.id] = record;

      if (record.totalAttempts > 0) {
        skillsPracticedCount++;
        totalAttempts += record.totalAttempts;
        totalCorrect += record.correctAttempts;
        if (!lastPracticedAt || (record.lastPracticedAt && record.lastPracticedAt > lastPracticedAt)) {
          lastPracticedAt = record.lastPracticedAt;
        }
      }
      if (record.masteryPercentage >= 75) {
        skillsMasteredCount++;
      }
      totalMasterySum += record.masteryPercentage;
    }

    const overallMasteryPercentage = courseSkills.length > 0
      ? Math.round(totalMasterySum / courseSkills.length)
      : 0;

    return {
      courseId,
      courseName: course?.title || courseId,
      overallMasteryPercentage,
      skillsPracticedCount,
      skillsMasteredCount,
      totalAttempts,
      totalCorrectAttempts: totalCorrect,
      skillMasteries,
      lastPracticedAt
    };
  }

  /**
   * Retrieves all skill mastery records for a student across all courses.
   */
  public static getAllMasteries(studentId: string): Record<string, SkillMasteryRecord> {
    const studentSkills = MasteryEngine.studentMasteryStore.get(studentId);
    if (!studentSkills) return {};

    const result: Record<string, SkillMasteryRecord> = {};
    for (const [skillId, record] of studentSkills.entries()) {
      result[skillId] = record;
      const mapped = LEGACY_SKILL_TO_CLUSTER_MAP[skillId];
      if (mapped && !result[mapped]) {
        result[mapped] = record;
      }
    }
    for (const [legacyId, clusterId] of Object.entries(LEGACY_SKILL_TO_CLUSTER_MAP)) {
      if (result[clusterId] && !result[legacyId]) {
        result[legacyId] = result[clusterId];
      }
    }
    return result;
  }

  /**
   * Sets or overrides skill mastery directly (for testing or profile hydration).
   */
  public static setSkillMastery(studentId: string, record: SkillMasteryRecord): void {
    let studentSkills = MasteryEngine.studentMasteryStore.get(studentId);
    if (!studentSkills) {
      studentSkills = new Map();
      MasteryEngine.studentMasteryStore.set(studentId, studentSkills);
    }
    studentSkills.set(record.skillId, record);
  }

  /**
   * Clears state for testing.
   */
  public static clear(): void {
    MasteryEngine.studentMasteryStore.clear();
  }
}
