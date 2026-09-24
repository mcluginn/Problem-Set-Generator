/**
 * Persistence & In-Memory / LocalStorage Repository Store
 * Preserves student progress, telemetry, attempts, mastery, and mistake logs.
 */

import {
  AttemptRecord,
  ConceptMasteryRecord,
  INITIAL_CURRICULUM,
  MistakeRecord,
  StudentProfile,
  User,
} from './types';

const DEFAULT_USER: User = {
  id: 'usr_student_demo',
  email: 'student@engineering.edu',
  fullName: 'Engineering Student',
  role: 'STUDENT',
  createdAt: new Date().toISOString(),
};

const DEFAULT_PROFILE: StudentProfile = {
  id: 'prof_student_demo',
  userId: 'usr_student_demo',
  currentStreak: 3,
  bestStreak: 7,
  totalProblemsSolved: 14,
  totalAttempts: 18,
  totalTimeSpentSeconds: 1420,
  preferredGuidedness: 1,
};

function initializeDefaultMastery(): Record<string, ConceptMasteryRecord> {
  const mastery: Record<string, ConceptMasteryRecord> = {};
  for (const c of INITIAL_CURRICULUM) {
    let initialPct = 0;
    if (c.name === 'Constant Rule') initialPct = 100;
    else if (c.name === 'Constant Multiple Rule') initialPct = 92;
    else if (c.name === 'Sum Rule') initialPct = 90;
    else if (c.name === 'Difference Rule') initialPct = 90;
    else if (c.name === 'Power Rule') initialPct = 94;
    else if (c.name === 'Product Rule') initialPct = 88;
    else if (c.name === 'Quotient Rule') initialPct = 81;
    else if (c.name === 'Chain Rule') initialPct = 63;
    else if (c.name === 'Trigonometric Derivatives') initialPct = 70;
    else if (c.name === 'Exponential Derivatives') initialPct = 75;
    else if (c.name === 'Logarithmic Derivatives') initialPct = 68;
    else if (c.name === 'Implicit Differentiation') initialPct = 55;
    else if (c.name === 'Higher-Order Derivatives') initialPct = 65;
    else if (c.name === 'Basic Applications of Derivatives') initialPct = 50;

    mastery[c.name] = {
      conceptId: c.id,
      conceptName: c.name,
      masteryPercentage: initialPct,
      totalAttempts: initialPct > 0 ? 5 : 0,
      correctAttempts: initialPct > 0 ? 4 : 0,
      recentTrend: initialPct > 75 ? 'improving' : initialPct > 0 ? 'stable' : 'new',
    };
  }
  return mastery;
}

export class PracticeStore {
  private static user: User = DEFAULT_USER;
  private static profile: StudentProfile = DEFAULT_PROFILE;
  private static attempts: AttemptRecord[] = [];
  private static mastery: Record<string, ConceptMasteryRecord> = initializeDefaultMastery();
  private static mistakes: MistakeRecord[] = [
    {
      id: 'mst_01',
      studentId: 'prof_student_demo',
      concept: 'Chain Rule',
      misconceptionCode: 'MISSING_INNER_DERIVATIVE',
      misconceptionName: 'Omitted Derivative of Inner Function',
      problemStatement: 'Find dy/dx for y = (3x^2 - 2x + 4)^5',
      problemLatex: 'y = (3x^2 - 2x + 4)^5',
      studentAnswer: '5(3x^2 - 2x + 4)^4',
      correctAnswerLatex: '5(3x^2 - 2x + 4)^4(6x - 2)',
      explanation: 'Differentiated outer power but forgot to multiply by inner derivative (6x - 2).',
      occurredCount: 2,
      resolved: false,
      lastOccurredAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  public static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public static load(): void {
    if (!PracticeStore.isBrowser()) return;
    try {
      const storedProfile = localStorage.getItem('epe_profile');
      if (storedProfile) PracticeStore.profile = JSON.parse(storedProfile);

      const storedMastery = localStorage.getItem('epe_mastery');
      if (storedMastery) PracticeStore.mastery = JSON.parse(storedMastery);

      const storedAttempts = localStorage.getItem('epe_attempts');
      if (storedAttempts) PracticeStore.attempts = JSON.parse(storedAttempts);

      const storedMistakes = localStorage.getItem('epe_mistakes');
      if (storedMistakes) PracticeStore.mistakes = JSON.parse(storedMistakes);
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }

  public static save(): void {
    if (!PracticeStore.isBrowser()) return;
    try {
      localStorage.setItem('epe_profile', JSON.stringify(PracticeStore.profile));
      localStorage.setItem('epe_mastery', JSON.stringify(PracticeStore.mastery));
      localStorage.setItem('epe_attempts', JSON.stringify(PracticeStore.attempts));
      localStorage.setItem('epe_mistakes', JSON.stringify(PracticeStore.mistakes));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  public static getProfile(): StudentProfile {
    PracticeStore.load();
    return PracticeStore.profile;
  }

  public static getMastery(): Record<string, ConceptMasteryRecord> {
    PracticeStore.load();
    return PracticeStore.mastery;
  }

  public static getAttempts(): AttemptRecord[] {
    PracticeStore.load();
    return PracticeStore.attempts;
  }

  public static getMistakes(): MistakeRecord[] {
    PracticeStore.load();
    return PracticeStore.mistakes;
  }

  public static recordAttempt(attempt: AttemptRecord): void {
    PracticeStore.load();
    PracticeStore.attempts.push(attempt);
    PracticeStore.profile.totalAttempts++;
    PracticeStore.profile.totalTimeSpentSeconds += attempt.timeSpentSeconds;

    if (attempt.isCorrect) {
      if (attempt.attemptNumber === 1 && attempt.hintsUsed === 0) {
        PracticeStore.profile.currentStreak++;
        if (PracticeStore.profile.currentStreak > PracticeStore.profile.bestStreak) {
          PracticeStore.profile.bestStreak = PracticeStore.profile.currentStreak;
        }
      }
      PracticeStore.profile.totalProblemsSolved++;
    } else {
      if (!attempt.isCorrect && attempt.solutionViewed) {
        PracticeStore.profile.currentStreak = 0;
      }
    }

    // Update concept mastery
    const conceptName = attempt.concept;
    if (PracticeStore.mastery[conceptName]) {
      const rec = PracticeStore.mastery[conceptName];
      rec.totalAttempts++;
      rec.lastPracticedAt = new Date().toISOString();

      let delta = 0;
      if (attempt.isCorrect) {
        rec.correctAttempts++;
        if (attempt.attemptNumber === 1 && attempt.hintsUsed === 0) delta = 8;
        else if (attempt.hintsUsed > 0) delta = 4;
        else delta = 6;
      } else {
        delta = attempt.solutionViewed ? -6 : -3;
      }

      rec.masteryPercentage = Math.max(0, Math.min(100, rec.masteryPercentage + delta));
      rec.recentTrend = delta > 0 ? 'improving' : 'declining';
    }

    // Record or update mistake if error code present
    if (attempt.mistakeCode && !attempt.isCorrect) {
      const existing = PracticeStore.mistakes.find(
        (m) => m.concept === attempt.concept && m.misconceptionCode === attempt.mistakeCode
      );
      if (existing) {
        existing.occurredCount++;
        existing.lastOccurredAt = new Date().toISOString();
        existing.resolved = false;
      }
    }

    PracticeStore.save();
  }

  public static logMistake(mistake: MistakeRecord): void {
    PracticeStore.load();
    const existing = PracticeStore.mistakes.find(
      (m) => m.concept === mistake.concept && m.misconceptionCode === mistake.misconceptionCode
    );
    if (existing) {
      existing.occurredCount++;
      existing.studentAnswer = mistake.studentAnswer;
      existing.lastOccurredAt = new Date().toISOString();
      existing.resolved = false;
    } else {
      PracticeStore.mistakes.push(mistake);
    }
    PracticeStore.save();
  }

  public static resolveMistake(misconceptionCode: string): void {
    PracticeStore.load();
    const m = PracticeStore.mistakes.find((item) => item.misconceptionCode === misconceptionCode);
    if (m) {
      m.resolved = true;
      PracticeStore.save();
    }
  }
}

/**
 * Isolated User Practice Repository
 * Strictly isolates student state, preventing cross-tenant data leakage.
 */
export class UserPracticeRepository {
  private user: User;
  private profile: StudentProfile;
  private attempts: AttemptRecord[] = [];
  private mastery: Record<string, ConceptMasteryRecord>;
  private mistakes: MistakeRecord[] = [];

  constructor(user: User) {
    this.user = user;
    this.profile = {
      id: `prof_${user.id}`,
      userId: user.id,
      currentStreak: 0,
      bestStreak: 0,
      totalProblemsSolved: 0,
      totalAttempts: 0,
      totalTimeSpentSeconds: 0,
      preferredGuidedness: 1,
    };
    this.mastery = initializeDefaultMastery();
  }

  public getUser(): User {
    return this.user;
  }

  public getProfile(): StudentProfile {
    return { ...this.profile };
  }

  public getMastery(): Record<string, ConceptMasteryRecord> {
    return { ...this.mastery };
  }

  public getAttempts(): AttemptRecord[] {
    return [...this.attempts];
  }

  public getMistakes(): MistakeRecord[] {
    return [...this.mistakes];
  }

  public recordAttempt(attempt: AttemptRecord): void {
    if (attempt.studentId !== this.user.id && attempt.studentId !== this.profile.id) {
      throw new Error(`Unauthorized: Cannot write attempt for student ${attempt.studentId} in store ${this.user.id}`);
    }

    this.attempts.push(attempt);
    this.profile.totalAttempts++;
    this.profile.totalTimeSpentSeconds += attempt.timeSpentSeconds;

    if (attempt.isCorrect) {
      if (attempt.attemptNumber === 1 && attempt.hintsUsed === 0) {
        this.profile.currentStreak++;
        if (this.profile.currentStreak > this.profile.bestStreak) {
          this.profile.bestStreak = this.profile.currentStreak;
        }
      }
      this.profile.totalProblemsSolved++;
    } else {
      if (attempt.solutionViewed) {
        this.profile.currentStreak = 0;
      }
    }

    const conceptName = attempt.concept;
    if (this.mastery[conceptName]) {
      const rec = this.mastery[conceptName];
      rec.totalAttempts++;
      rec.lastPracticedAt = new Date().toISOString();

      let delta = 0;
      if (attempt.isCorrect) {
        rec.correctAttempts++;
        if (attempt.attemptNumber === 1 && attempt.hintsUsed === 0) delta = 8;
        else if (attempt.hintsUsed > 0) delta = 4;
        else delta = 6;
      } else {
        delta = attempt.solutionViewed ? -6 : -3;
      }

      rec.masteryPercentage = Math.max(0, Math.min(100, rec.masteryPercentage + delta));
      rec.masteryConfidence = Math.min(1.0, rec.totalAttempts / 10);
      rec.recentTrend = delta > 0 ? 'improving' : 'declining';
    }
  }

  public logMistake(mistake: MistakeRecord): void {
    const existing = this.mistakes.find(
      (m) => m.concept === mistake.concept && m.misconceptionCode === mistake.misconceptionCode
    );
    if (existing) {
      existing.occurredCount++;
      existing.studentAnswer = mistake.studentAnswer;
      existing.lastOccurredAt = new Date().toISOString();
      existing.resolved = false;
    } else {
      this.mistakes.push(mistake);
    }
  }
}

/**
 * Multi-Tenant Isolated User Store Manager
 */
export class MultiUserStore {
  private static userStores = new Map<string, UserPracticeRepository>();

  public static forUser(user: User): UserPracticeRepository {
    if (!MultiUserStore.userStores.has(user.id)) {
      MultiUserStore.userStores.set(user.id, new UserPracticeRepository(user));
    }
    return MultiUserStore.userStores.get(user.id)!;
  }

  public static reset(): void {
    MultiUserStore.userStores.clear();
  }
}
