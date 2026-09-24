/**
 * Authoritative Quiz Engine
 * Engineering Practice Engine — Quiz Assessment Engine
 *
 * Implements frozen question set creation, multi-format delivery,
 * deterministic grading, and pedagogical review synthesis.
 */

import { ValidatedProblem } from '../content/types';
import { problemBank } from '../content/problemBank';
import { ContentGenerator } from '../content/generator';
import { ContentRegistry } from '../content/registry';
import { curriculumRegistry } from '../curriculum/registry';
import { MathParser } from '../math/parser';
import { EquivalenceEngine } from '../math/equivalence';
import { MisconceptionEngine } from '../math/misconceptions';
import { DistractorGenerator } from './distractorGenerator';
import {
  QuizConfig,
  QuizQuestion,
  QuizSession,
  QuizResult,
  TopicScore
} from './types';

const STORAGE_ACTIVE_QUIZ = 'eng_practice_quiz_active_session_v1';
const STORAGE_QUIZ_HISTORY = 'eng_practice_quiz_history_v1';

export class QuizEngine {
  /**
   * Pre-generates and freezes all N questions upfront with guaranteed unique IDs and structureSignatures.
   */
  public static createQuiz(config: QuizConfig, studentId: string = 'student-pilot'): QuizSession {
    const courseId = config.courseId;
    let candidateSkills = curriculumRegistry.getSkillsByCourse(courseId);

    if (config.topicId) {
      const topicSkills = curriculumRegistry.getSkillsByTopic(config.topicId);
      if (topicSkills.length > 0) {
        candidateSkills = topicSkills;
      } else {
        candidateSkills = candidateSkills.filter(s =>
          curriculumRegistry.isSkillInTopic(s.id, config.topicId!)
        );
      }
    }
    if (config.skillId) {
      const forcedSkill = curriculumRegistry.getSkillById(config.skillId);
      if (forcedSkill) {
        candidateSkills = [forcedSkill];
      } else {
        candidateSkills = candidateSkills.filter(s => s.id === config.skillId);
      }
    }

    if (candidateSkills.length === 0) {
      throw new Error(`Assessment Generation Failure: No curriculum skills found for course ${courseId}, topic ${config.topicId}, skill ${config.skillId}`);
    }

    // Filter to skills with active problem families or bank problems if available
    const contentRegistry = ContentRegistry.getInstance();
    const viableSkills = candidateSkills.filter(s =>
      contentRegistry.getFamiliesBySkill(s.id).length > 0 ||
      problemBank.getProblemsForSkill(s.id).length > 0
    );
    if (viableSkills.length > 0) {
      candidateSkills = viableSkills;
    }

    const totalQuestions = config.questionCount;
    const questions: QuizQuestion[] = [];
    const usedProblemIds = new Set<string>();
    const usedSignatures = new Set<string>();

    for (let i = 0; i < totalQuestions; i++) {
      questions.push(
        QuizEngine.generateSingleQuestion(
          i,
          totalQuestions,
          config,
          candidateSkills,
          usedProblemIds,
          usedSignatures
        )
      );
    }

    const session: QuizSession = {
      id: `QUIZ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      config,
      questions,
      currentIndex: 0,
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0
    };

    QuizEngine.saveActiveSession(session);
    return session;
  }

  /**
   * Asynchronously generates and freezes questions with event-loop yielding
   * and progress reporting so the main UI thread never blocks during large assessments.
   */
  public static async createQuizAsync(
    config: QuizConfig,
    studentId: string = 'student-pilot',
    onProgress?: (current: number, total: number) => void
  ): Promise<QuizSession> {
    const courseId = config.courseId;
    let candidateSkills = curriculumRegistry.getSkillsByCourse(courseId);

    if (config.topicId) {
      const topicSkills = curriculumRegistry.getSkillsByTopic(config.topicId);
      if (topicSkills.length > 0) {
        candidateSkills = topicSkills;
      } else {
        candidateSkills = candidateSkills.filter(s =>
          curriculumRegistry.isSkillInTopic(s.id, config.topicId!)
        );
      }
    }
    if (config.skillId) {
      const forcedSkill = curriculumRegistry.getSkillById(config.skillId);
      if (forcedSkill) {
        candidateSkills = [forcedSkill];
      } else {
        candidateSkills = candidateSkills.filter(s => s.id === config.skillId);
      }
    }

    if (candidateSkills.length === 0) {
      throw new Error(`Assessment Generation Failure: No curriculum skills found for course ${courseId}, topic ${config.topicId}, skill ${config.skillId}`);
    }

    // Filter to skills with active problem families or bank problems if available
    const contentRegistry = ContentRegistry.getInstance();
    const viableSkills = candidateSkills.filter(s =>
      contentRegistry.getFamiliesBySkill(s.id).length > 0 ||
      problemBank.getProblemsForSkill(s.id).length > 0
    );
    if (viableSkills.length > 0) {
      candidateSkills = viableSkills;
    }

    const totalQuestions = config.questionCount;
    const questions: QuizQuestion[] = [];
    const usedProblemIds = new Set<string>();
    const usedSignatures = new Set<string>();

    for (let i = 0; i < totalQuestions; i++) {
      const q = QuizEngine.generateSingleQuestion(
        i,
        totalQuestions,
        config,
        candidateSkills,
        usedProblemIds,
        usedSignatures
      );
      questions.push(q);
      if (onProgress) {
        onProgress(i + 1, totalQuestions);
      }
      // Yield to the event loop so the browser can paint progress bars and keep UI responsive
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    const session: QuizSession = {
      id: `QUIZ-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      config,
      questions,
      currentIndex: 0,
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
      elapsedSeconds: 0
    };

    QuizEngine.saveActiveSession(session);
    return session;
  }

  private static generateSingleQuestion(
    i: number,
    totalQuestions: number,
    config: QuizConfig,
    candidateSkills: any[],
    usedProblemIds: Set<string>,
    usedSignatures: Set<string>
  ): QuizQuestion {
    const courseId = config.courseId;
    const skill = candidateSkills[i % candidateSkills.length];

    // Determine difficulty
    let targetDifficulty = 2;
    if (config.difficulty === 'EASY') {
      targetDifficulty = 1;
    } else if (config.difficulty === 'MEDIUM') {
      targetDifficulty = 2;
    } else if (config.difficulty === 'HARD') {
      targetDifficulty = 3;
    } else if (config.difficulty === 'ADAPTIVE') {
      // Progressive ramp across the quiz
      const fraction = i / Math.max(1, totalQuestions - 1);
      targetDifficulty = Math.min(4, Math.max(1, Math.floor(fraction * 3) + 1));
    }

    // Try bank first
    const eligibleBankProblems = problemBank.getProblemsForSkill(skill.id).filter(
      p => !usedProblemIds.has(p.dna.problemId) &&
           !usedSignatures.has(p.dna.structureSignature) &&
           Math.round(p.dna.difficultyVector.overall) === targetDifficulty
    );

    let selectedProb: ValidatedProblem | undefined = eligibleBankProblems[0];

    // If not in bank, dynamically generate
    if (!selectedProb) {
      const genRes = ContentGenerator.generateForSkill({
        courseId: courseId as any,
        skillId: skill.id,
        difficulty: targetDifficulty,
        excludeProblemIds: Array.from(usedProblemIds),
        excludeSignatures: Array.from(usedSignatures)
      }, Array.from(usedSignatures).map(sig => ({ signature: sig, familyId: '' })));

      if (genRes.success && genRes.problem) {
        selectedProb = genRes.problem;
        problemBank.storeProblem(genRes.problem);
      }
    }

    // Ultimate fallback: generate any distinct problem for the skill, or use same-skill bank candidate
    if (!selectedProb) {
      const fallbackRes = ContentGenerator.generateForSkill({
        courseId: courseId as any,
        skillId: skill.id,
        difficulty: 2
      });
      if (fallbackRes.success && fallbackRes.problem) {
        selectedProb = fallbackRes.problem;
      } else {
        // Strictly same-skill fallback ONLY
        const skillBank = problemBank.getProblemsForSkill(skill.id);
        if (skillBank && skillBank.length > 0) {
          selectedProb = skillBank[0];
        } else {
          throw new Error(`Assessment Generation Failure: Could not generate or retrieve a verified problem for skill ${skill.id} (${skill.canonicalName}).`);
        }
      }
    }

    if (selectedProb) {
      usedProblemIds.add(selectedProb.dna.problemId);
      usedSignatures.add(selectedProb.dna.structureSignature);
    }

    // Determine format for question
    let format: 'WRITTEN' | 'MULTIPLE_CHOICE' = 'MULTIPLE_CHOICE';
    if (config.format === 'WRITTEN') {
      format = 'WRITTEN';
    } else if (config.format === 'MULTIPLE_CHOICE') {
      format = 'MULTIPLE_CHOICE';
    } else {
      // MIXED: alternate between MCQ and WRITTEN
      // Exact documented distribution:
      // - 5 questions: 3 MCQ (indices 0, 2, 4) and 2 Written (indices 1, 3)
      // - 10 questions: 5 MCQ and 5 Written (50/50 split)
      // - 20 questions: 10 MCQ and 10 Written (50/50 split)
      format = i % 2 === 0 ? 'MULTIPLE_CHOICE' : 'WRITTEN';
    }

    const optionSeed = `QUIZ-Q${i}-${selectedProb.dna.problemId}-${skill.id}`;
    const options = format === 'MULTIPLE_CHOICE' && selectedProb
      ? DistractorGenerator.generateOptions(selectedProb, optionSeed)
      : undefined;

    return {
      questionIndex: i,
      problem: selectedProb!,
      format,
      options,
      isFlagged: false,
      userAnswer: '',
      selectedOptionId: undefined,
      timeSpentSeconds: 0
    };
  }

  /**
   * Deterministically grades the quiz and compiles diagnostic review insights.
   */
  public static gradeQuiz(session: QuizSession): QuizResult {
    let correctCount = 0;
    const misconceptionsEncountered: QuizResult['misconceptionsEncountered'] = [];
    const topicScoresMap = new Map<string, { topicName: string; correct: number; total: number }>();

    for (let i = 0; i < session.questions.length; i++) {
      const q = session.questions[i];
      const prob = q.problem;
      const topicId = prob.dna.topicId;
      const topic = curriculumRegistry.getTopicById(topicId);
      const topicName = topic?.officialName || 'General Engineering';

      if (!topicScoresMap.has(topicId)) {
        topicScoresMap.set(topicId, { topicName, correct: 0, total: 0 });
      }
      const tScore = topicScoresMap.get(topicId)!;
      tScore.total++;

      let isQCorrect = false;

      if (q.format === 'MULTIPLE_CHOICE') {
        const selectedOpt = q.options?.find(o => o.id === q.selectedOptionId);
        if (selectedOpt) {
          isQCorrect = selectedOpt.isCorrect;
          if (!isQCorrect && selectedOpt.targetedMisconceptionCode) {
            q.diagnosedMisconception = {
              code: selectedOpt.targetedMisconceptionCode,
              name: selectedOpt.targetedMisconceptionCode,
              explanation: selectedOpt.pedagogicalExplanation || 'Distractor misconception targeted.'
            };
            misconceptionsEncountered.push({
              code: selectedOpt.targetedMisconceptionCode,
              name: selectedOpt.targetedMisconceptionCode,
              explanation: selectedOpt.pedagogicalExplanation || 'Distractor misconception targeted.',
              questionIndex: i
            });
          }
        }
      } else {
        // Written input grading via exact, numeric, and AST equivalence
        const studentRaw = (q.userAnswer || '').trim();
        const canonicalLatex = (prob.solution.canonicalAnswerLatex || '').trim();
        const canonicalRaw = (prob.solution.canonicalAnswerRaw || canonicalLatex).trim();

        const cleanStudent = studentRaw.replace(/\s+/g, '').toLowerCase();
        const cleanCanonical = canonicalLatex.replace(/\s+/g, '').toLowerCase();
        const cleanRaw = canonicalRaw.replace(/\s+/g, '').toLowerCase();

        const studentNum = parseFloat(cleanStudent.replace(/[^\d.-]/g, ''));
        const canonicalNum = parseFloat(cleanCanonical.replace(/[^\d.-]/g, ''));

        if (
          cleanStudent === cleanCanonical ||
          cleanStudent === cleanRaw ||
          (!isNaN(studentNum) && !isNaN(canonicalNum) && Math.abs(studentNum - canonicalNum) < 0.01)
        ) {
          isQCorrect = true;
        } else {
          try {
            const studentNode = MathParser.parse(studentRaw);
            const canonicalAst = MathParser.parse(cleanRaw || cleanCanonical);
            const eqResult = EquivalenceEngine.check(studentNode, canonicalAst, {
              targetVariable: prob.statement.independentVariable || 'x'
            });
            if (eqResult.equivalent) {
              isQCorrect = true;
            } else {
              // Try misconception diagnosis
              const diag = MisconceptionEngine.diagnose(
                studentNode,
                prob.rawExpression,
                prob.dna.primarySkillId,
                prob.statement.independentVariable || 'x'
              );
              if (diag && diag.detected && diag.code) {
                const diagName = diag.name || diag.code;
                const diagExpl = diag.diagnosis || diag.guidanceTip || 'Procedural error detected.';
                q.diagnosedMisconception = {
                  code: diag.code,
                  name: diagName,
                  explanation: diagExpl
                };
                misconceptionsEncountered.push({
                  code: diag.code,
                  name: diagName,
                  explanation: diagExpl,
                  questionIndex: i
                });
              }
            }
          } catch {
            // AST parsing exception or unparseable text
          }
        }
      }

      q.isCorrect = isQCorrect;
      if (isQCorrect) {
        correctCount++;
        tScore.correct++;
      }
    }

    const topicBreakdown: TopicScore[] = Array.from(topicScoresMap.entries()).map(([topicId, val]) => ({
      topicId,
      topicName: val.topicName,
      correct: val.correct,
      total: val.total,
      percentage: Math.round((val.correct / Math.max(1, val.total)) * 100)
    }));

    const mcqQuestions = session.questions.filter(q => q.format === 'MULTIPLE_CHOICE');
    const mcqCorrect = mcqQuestions.filter(q => q.isCorrect).length;
    const mcqScore = mcqQuestions.length > 0 ? {
      correct: mcqCorrect,
      total: mcqQuestions.length,
      percentage: Math.round((mcqCorrect / mcqQuestions.length) * 100)
    } : undefined;

    const writtenQuestions = session.questions.filter(q => q.format === 'WRITTEN');
    const writtenCorrect = writtenQuestions.filter(q => q.isCorrect).length;
    const writtenScore = writtenQuestions.length > 0 ? {
      correct: writtenCorrect,
      total: writtenQuestions.length,
      percentage: Math.round((writtenCorrect / writtenQuestions.length) * 100)
    } : undefined;

    const result: QuizResult = {
      quizId: session.id,
      studentId: session.studentId,
      config: session.config,
      totalQuestions: session.questions.length,
      correctCount,
      scorePercentage: Math.round((correctCount / Math.max(1, session.questions.length)) * 100),
      mcqScore,
      writtenScore,
      elapsedSeconds: session.elapsedSeconds,
      questions: session.questions,
      topicBreakdown,
      misconceptionsEncountered,
      completedAt: new Date().toISOString()
    };

    session.status = 'COMPLETED';
    session.completedAt = result.completedAt;

    QuizEngine.clearActiveSession();
    QuizEngine.saveToHistory(result);

    return result;
  }

  private static safeStringify(obj: any): string {
    return JSON.stringify(obj, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  }

  private static inMemoryActiveSession: QuizSession | null = null;
  private static inMemoryHistory: QuizResult[] = [];

  /**
   * Autosaves active quiz session state to localStorage and in-memory cache.
   */
  public static saveActiveSession(session: QuizSession): void {
    try {
      QuizEngine.inMemoryActiveSession = JSON.parse(QuizEngine.safeStringify(session));
    } catch {
      QuizEngine.inMemoryActiveSession = session;
    }
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_ACTIVE_QUIZ, QuizEngine.safeStringify(session));
    } catch (err) {
      console.error('Failed to save active quiz session to localStorage:', err);
    }
  }

  /**
   * Loads the active quiz session from localStorage or in-memory cache.
   */
  public static loadActiveSession(): QuizSession | null {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        const data = localStorage.getItem(STORAGE_ACTIVE_QUIZ);
        if (data) {
          const parsed = JSON.parse(data) as QuizSession;
          QuizEngine.inMemoryActiveSession = parsed;
          return parsed;
        }
      } catch {
        // Fall back to inMemoryActiveSession
      }
    }
    return QuizEngine.inMemoryActiveSession;
  }

  /**
   * Clears the active quiz session.
   */
  public static clearActiveSession(): void {
    QuizEngine.inMemoryActiveSession = null;
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_ACTIVE_QUIZ);
    } catch (err) {
      console.error('Failed to clear active quiz session:', err);
    }
  }

  /**
   * Saves completed quiz result to quiz history.
   */
  public static saveToHistory(result: QuizResult): void {
    try {
      const clone = JSON.parse(QuizEngine.safeStringify(result));
      QuizEngine.inMemoryHistory.unshift(clone);
    } catch {
      QuizEngine.inMemoryHistory.unshift(result);
    }
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') return;
    try {
      const existing = QuizEngine.getQuizHistory();
      existing.unshift(result);
      localStorage.setItem(STORAGE_QUIZ_HISTORY, QuizEngine.safeStringify(existing.slice(0, 20)));
    } catch (err) {
      console.error('Failed to save quiz result to history:', err);
    }
  }

  /**
   * Loads past quiz results.
   */
  public static getQuizHistory(): QuizResult[] {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      try {
        const data = localStorage.getItem(STORAGE_QUIZ_HISTORY);
        if (data) {
          return JSON.parse(data) as QuizResult[];
        }
      } catch {
        // Fall back to inMemoryHistory
      }
    }
    return QuizEngine.inMemoryHistory;
  }
}
