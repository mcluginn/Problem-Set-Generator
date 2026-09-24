/**
 * Mandatory Section 106 & Section 56 Vertical Slice End-to-End Test
 * Tests the exact full user journey specified in the Master Product Prompt.
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { diff } from '@/engine/math/differentiator';
import { checkEquivalence } from '@/engine/math/equivalence';
import { MisconceptionEngine } from '@/engine/math/misconceptions';
import { StepGenerator } from '@/engine/math/steps';
import { PracticeStore } from '@/services/database/store';
import { AdaptiveEngine } from '@/services/adaptive/adaptive';
import { ProblemGenerator } from '@/engine/generation/generator';
import { ProblemValidator } from '@/engine/generation/validator';

describe('Section 106 & 56 Mandatory Vertical Slice Workflow', () => {
  it('executes the full Chain Rule vertical slice with diagnosis, hints, factoring equivalence, and adaptive update', () => {
    // 1. Student selects: Differential Calculus -> Derivatives -> Chain Rule -> Medium
    const problem = ProblemGenerator.generateProblem({
      concept: 'Chain Rule',
      difficulty: 'Medium',
    });

    // 2. System generates a mathematically valid problem
    const validation = ProblemValidator.validate(problem);
    expect(validation.isValid).toBe(true);
    expect(problem.dna.concept).toBe('Chain Rule');
    expect(problem.hints.length).toBe(5);

    // 3. Exact Golden Problem from Prompt: y = (3x^2 - 2x + 4)^5
    const goldenExpression = parseMath('(3x^2 - 2x + 4)^5');
    const goldenSolve = diff(goldenExpression);

    // 4. Student submits INCORRECT answer (Section 56 requirement): 5(3x^2 - 2x + 4)^4
    const incorrectAttemptStr = '5*(3x^2 - 2x + 4)^4';
    const incorrectAst = parseMath(incorrectAttemptStr);
    const check1 = checkEquivalence(incorrectAst, goldenSolve.simplifiedDerivative);

    expect(check1.equivalent).toBe(false);

    // 5. System independently verifies and classifies misconception: MISSING_INNER_DERIVATIVE
    const diagnosis = MisconceptionEngine.diagnose(incorrectAst, goldenExpression, 'Chain Rule');
    expect(diagnosis.detected).toBe(true);
    expect(diagnosis.code).toBe('MISSING_INNER_DERIVATIVE');
    expect(diagnosis.name).toBe('Omitted Derivative of Inner Function');
    expect(diagnosis.confidence).toBeGreaterThan(0.9);

    // Record the first attempt telemetry in the store
    PracticeStore.recordAttempt({
      id: 'att_vslice_1',
      studentId: 'prof_student_demo',
      problemId: problem.dna.id,
      concept: 'Chain Rule',
      familyId: 'CHAIN_POWER_POLYNOMIAL',
      representationType: 'Symbolic',
      submittedAnswer: incorrectAttemptStr,
      isCorrect: false,
      attemptNumber: 1,
      hintsUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 18,
      mistakeCode: diagnosis.code,
      createdAt: new Date().toISOString(),
    });

    PracticeStore.logMistake({
      id: 'mst_vslice_1',
      studentId: 'prof_student_demo',
      concept: 'Chain Rule',
      misconceptionCode: 'MISSING_INNER_DERIVATIVE',
      misconceptionName: diagnosis.name!,
      problemStatement: 'Find dy/dx',
      problemLatex: 'y = (3x^2 - 2x + 4)^5',
      studentAnswer: incorrectAttemptStr,
      correctAnswerLatex: '5(3x^2 - 2x + 4)^4(6x - 2)',
      explanation: diagnosis.diagnosis!,
      occurredCount: 1,
      resolved: false,
      lastOccurredAt: new Date().toISOString(),
    });

    // 6. Student unlocks Hint 1, Hint 2, Hint 3, and Step-by-Step
    const solution = StepGenerator.generateSolution(goldenExpression, 'Chain Rule');
    expect(solution.steps.length).toBeGreaterThanOrEqual(4);
    expect(solution.whyMethodRequired).toContain('Why Chain Rule?');

    // 7. Student submits CORRECT FACTORED answer (Section 57 requirement): 10(3x - 1)(3x^2 - 2x + 4)^4
    const correctFactoredStr = '10*(3x - 1)*(3x^2 - 2x + 4)^4';
    const correctAst = parseMath(correctFactoredStr);
    const check2 = checkEquivalence(correctAst, goldenSolve.simplifiedDerivative);

    expect(check2.equivalent).toBe(true);

    // Also verify un-factored form: 5(3x^2 - 2x + 4)^4 * (6x - 2)
    const correctExpandedStr = '5*(3x^2 - 2x + 4)^4 * (6x - 2)';
    const check3 = checkEquivalence(parseMath(correctExpandedStr), correctAst);
    expect(check3.equivalent).toBe(true);

    // Record the second attempt (success)
    PracticeStore.recordAttempt({
      id: 'att_vslice_2',
      studentId: 'prof_student_demo',
      problemId: problem.dna.id,
      concept: 'Chain Rule',
      familyId: 'CHAIN_POWER_POLYNOMIAL',
      representationType: 'Symbolic',
      submittedAnswer: correctFactoredStr,
      isCorrect: true,
      attemptNumber: 2,
      hintsUsed: 3,
      solutionViewed: false,
      timeSpentSeconds: 45,
      createdAt: new Date().toISOString(),
    });

    // 8. Adaptive engine selects next appropriate problem based on telemetry
    const mastery = PracticeStore.getMastery();
    const mistakes = PracticeStore.getMistakes();
    const nextRec = AdaptiveEngine.selectNextBestProblem(mastery, mistakes);

    expect(nextRec.concept).toBeDefined();
    expect(nextRec.difficulty).toBeDefined();
    expect(nextRec.reason).toBeDefined();
  });
});
