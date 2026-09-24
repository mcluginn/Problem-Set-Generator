/**
 * Mode A: Check Final Answer Integration Test Suite (Section 86)
 */

import { describe, it, expect } from 'vitest';
import { HandwritingRecognitionService } from '@/services/picture/recognitionService';
import { ProblemGenerator } from '@/engine/generation/generator';
import { parseMath } from '@/engine/math/parser';
import { checkEquivalence } from '@/engine/math/equivalence';
import { PracticeStore } from '@/services/database/store';

describe('Picture Mode A (Check Final Answer) End-to-End Integration', () => {
  it('runs complete flow: photograph -> local recognition -> user confirmation -> deterministic grading', async () => {
    // 1. Generate problem
    const problem = ProblemGenerator.generateProblem({ concept: 'Chain Rule', difficulty: 3 });
    const canonicalAnswer = problem.solution.canonicalAnswerRaw;

    // 2. Simulate photo submission of correct answer
    const fakeDataUrl = `data:image/jpeg;base64,sample_expr=${encodeURIComponent(canonicalAnswer)}`;
    const { result, qualityPassed } = await HandwritingRecognitionService.processImage(fakeDataUrl, {
      mode: 'final_answer',
    });

    expect(qualityPassed).toBe(true);
    expect(result.expression).toBeDefined();

    // 3. Simulate user confirmation (Tier 2 Manual Confirmation / Edit)
    const confirmedExpr = result.expression;
    const manualResult = await HandwritingRecognitionService.recordManualEdit(confirmedExpr, 'final_answer');
    expect(manualResult.confidence).toBe(1.0);

    // 4. Deterministic grading via checkEquivalence
    const studentAst = parseMath(manualResult.expression);
    const expectedAst = parseMath(canonicalAnswer);
    const eq = checkEquivalence(studentAst, expectedAst, {
      targetVariable: problem.statement.independentVariable || 'x',
    });

    expect(eq.equivalent).toBe(true);

    // 5. Store attempt in PracticeStore
    PracticeStore.recordAttempt({
      id: `att_photo_${Date.now()}`,
      studentId: 'test_student',
      problemId: problem.dna.id,
      concept: problem.dna.concept,
      familyId: problem.dna.familyId,
      representationType: problem.dna.representationType,
      submittedAnswer: manualResult.expression,
      isCorrect: true,
      attemptNumber: 1,
      hintsUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 15,
      createdAt: new Date().toISOString(),
    });

    const mastery = PracticeStore.getMastery()['Chain Rule'];
    expect(mastery.totalAttempts).toBeGreaterThanOrEqual(1);
  });
});
