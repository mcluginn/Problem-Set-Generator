/**
 * Database & Persistence Layer Types
 */

import { DifficultyMetrics, GeneratedProblem, RepresentationType } from '../../engine/generation/types';
import { MisconceptionCode } from '../../engine/math/misconceptions';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  currentStreak: number;
  bestStreak: number;
  totalProblemsSolved: number;
  totalAttempts: number;
  totalTimeSpentSeconds: number;
  preferredGuidedness: 1 | 2 | 3 | 4;
}

export interface AttemptRecord {
  id: string;
  studentId: string;
  problemId: string;
  concept: string;
  familyId: string;
  representationType: RepresentationType;
  submittedAnswer: string;
  isCorrect: boolean;
  attemptNumber: number;
  hintsUsed: number;
  solutionViewed: boolean;
  timeSpentSeconds: number;
  mistakeCode?: MisconceptionCode;
  createdAt: string;
}

export interface ConceptMasteryRecord {
  conceptId: string;
  conceptName: string;
  masteryPercentage: number;
  masteryConfidence?: number; // 0.0 - 1.0 based on sample size
  totalAttempts: number;
  correctAttempts: number;
  lastPracticedAt?: string;
  recentTrend: 'improving' | 'declining' | 'stable' | 'new';
}

export interface MistakeRecord {
  id: string;
  studentId: string;
  concept: string;
  misconceptionCode: MisconceptionCode;
  misconceptionName: string;
  problemStatement: string;
  problemLatex: string;
  studentAnswer: string;
  correctAnswerLatex: string;
  explanation: string;
  occurredCount: number;
  resolved: boolean;
  lastOccurredAt: string;
}

export interface CurriculumConcept {
  id: string;
  slug: string;
  name: string;
  description: string;
  prerequisites: string[];
  sortOrder: number;
  defaultDifficulty: 'Easy' | 'Medium' | 'Hard';
}

export const INITIAL_CURRICULUM: CurriculumConcept[] = [
  {
    id: 'c_constant_rule',
    slug: 'constant-rule',
    name: 'Constant Rule',
    description: 'Derivative of any constant value is zero: d/dx[c] = 0.',
    prerequisites: [],
    sortOrder: 1,
    defaultDifficulty: 'Easy',
  },
  {
    id: 'c_constant_multiple',
    slug: 'constant-multiple-rule',
    name: 'Constant Multiple Rule',
    description: 'Pulling constant multipliers out: d/dx[c*f(x)] = c*f\'(x).',
    prerequisites: ['c_constant_rule'],
    sortOrder: 2,
    defaultDifficulty: 'Easy',
  },
  {
    id: 'c_sum_rule',
    slug: 'sum-rule',
    name: 'Sum Rule',
    description: 'Derivative of a sum is the sum of derivatives: d/dx[u + v] = u\' + v\'.',
    prerequisites: ['c_constant_multiple'],
    sortOrder: 3,
    defaultDifficulty: 'Easy',
  },
  {
    id: 'c_difference_rule',
    slug: 'difference-rule',
    name: 'Difference Rule',
    description: 'Derivative of a difference: d/dx[u - v] = u\' - v\'.',
    prerequisites: ['c_sum_rule'],
    sortOrder: 4,
    defaultDifficulty: 'Easy',
  },
  {
    id: 'c_power_rule',
    slug: 'power-rule',
    name: 'Power Rule',
    description: 'Differentiating powers of x: d/dx[x^n] = n*x^(n-1).',
    prerequisites: ['c_constant_rule'],
    sortOrder: 5,
    defaultDifficulty: 'Easy',
  },
  {
    id: 'c_product_rule',
    slug: 'product-rule',
    name: 'Product Rule',
    description: 'Differentiating products of functions: d/dx[u*v] = u\'v + uv\'.',
    prerequisites: ['c_sum_rule', 'c_power_rule'],
    sortOrder: 6,
    defaultDifficulty: 'Medium',
  },
  {
    id: 'c_quotient_rule',
    slug: 'quotient-rule',
    name: 'Quotient Rule',
    description: 'Differentiating ratios: d/dx[u/v] = (u\'v - uv\') / v^2.',
    prerequisites: ['c_product_rule'],
    sortOrder: 7,
    defaultDifficulty: 'Medium',
  },
  {
    id: 'c_chain_rule',
    slug: 'chain-rule',
    name: 'Chain Rule',
    description: 'Composite functions differentiation: d/dx[f(g(x))] = f\'(g(x))*g\'(x).',
    prerequisites: ['c_power_rule', 'c_product_rule'],
    sortOrder: 8,
    defaultDifficulty: 'Medium',
  },
  {
    id: 'c_trig_derivatives',
    slug: 'trig-derivatives',
    name: 'Trigonometric Derivatives',
    description: 'Derivatives of sin, cos, tan, sec, csc, cot.',
    prerequisites: ['c_sum_rule'],
    sortOrder: 9,
    defaultDifficulty: 'Medium',
  },
  {
    id: 'c_exp_derivatives',
    slug: 'exponential-derivatives',
    name: 'Exponential Derivatives',
    description: 'Natural and general exponential differentiation: d/dx[e^u] = e^u * u\'.',
    prerequisites: ['c_chain_rule'],
    sortOrder: 10,
    defaultDifficulty: 'Medium',
  },
  {
    id: 'c_log_derivatives',
    slug: 'logarithmic-derivatives',
    name: 'Logarithmic Derivatives',
    description: 'Natural and general logarithm differentiation: d/dx[ln(u)] = u\' / u.',
    prerequisites: ['c_chain_rule'],
    sortOrder: 11,
    defaultDifficulty: 'Medium',
  },
  {
    id: 'c_implicit_differentiation',
    slug: 'implicit-differentiation',
    name: 'Implicit Differentiation',
    description: 'Differentiating relations F(x, y) = C where y is an implicit function y(x).',
    prerequisites: ['c_chain_rule', 'c_product_rule'],
    sortOrder: 12,
    defaultDifficulty: 'Hard',
  },
  {
    id: 'c_higher_order',
    slug: 'higher-order-derivatives',
    name: 'Higher-Order Derivatives',
    description: 'Repeated differentiation: second, third, and nth derivatives.',
    prerequisites: ['c_chain_rule', 'c_power_rule'],
    sortOrder: 13,
    defaultDifficulty: 'Hard',
  },
  {
    id: 'c_applications',
    slug: 'basic-applications',
    name: 'Basic Applications of Derivatives',
    description: 'Tangent line slopes, instantaneous velocity, acceleration, and rates of change.',
    prerequisites: ['c_chain_rule', 'c_power_rule'],
    sortOrder: 14,
    defaultDifficulty: 'Hard',
  },
];
