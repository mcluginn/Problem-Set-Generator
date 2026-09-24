/**
 * Quiz Mode Type Definitions
 * Engineering Practice Engine — Quiz Assessment Engine
 */

import { ValidatedProblem } from '../content/types';

export type QuizQuestionFormat = 'WRITTEN' | 'MULTIPLE_CHOICE' | 'MIXED';

export type QuizDifficultySetting = 'EASY' | 'MEDIUM' | 'HARD' | 'ADAPTIVE';

export interface QuizOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  label: string;
  textLatex: string;
  textRaw: string;
  isCorrect: boolean;
  targetedMisconceptionCode?: string;
  pedagogicalExplanation?: string;
}

export interface QuizQuestion {
  questionIndex: number; // 0-based
  problem: ValidatedProblem;
  format: 'WRITTEN' | 'MULTIPLE_CHOICE';
  options?: QuizOption[];
  userAnswer?: string;
  selectedOptionId?: string;
  isFlagged?: boolean;
  isCorrect?: boolean;
  timeSpentSeconds?: number;
  diagnosedMisconception?: {
    code: string;
    name: string;
    explanation: string;
  };
}

export interface QuizConfig {
  courseId: string;
  topicId?: string;
  skillId?: string;
  questionCount: 5 | 10 | 20;
  format: QuizQuestionFormat;
  difficulty: QuizDifficultySetting;
  timeLimitMinutes?: number; // 0 or undefined for untimed
}

export interface QuizSession {
  id: string;
  studentId: string;
  config: QuizConfig;
  questions: QuizQuestion[];
  currentIndex: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  startedAt: string;
  completedAt?: string;
  elapsedSeconds: number;
}

export interface TopicScore {
  topicId: string;
  topicName: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface FormatScore {
  correct: number;
  total: number;
  percentage: number;
}

export interface QuizResult {
  quizId: string;
  studentId: string;
  config: QuizConfig;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  mcqScore?: FormatScore;
  writtenScore?: FormatScore;
  elapsedSeconds: number;
  questions: QuizQuestion[];
  topicBreakdown: TopicScore[];
  misconceptionsEncountered: Array<{
    code: string;
    name: string;
    explanation: string;
    questionIndex: number;
  }>;
  completedAt: string;
}
