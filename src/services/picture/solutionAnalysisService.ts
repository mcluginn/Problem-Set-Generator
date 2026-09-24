/**
 * Full Solution Multi-Step Analysis Service (Mode B - Experimental)
 * Aligns recognized handwritten steps against the deterministic problem solution trace,
 * localizes the first reasoning divergence, and maps errors to the Misconception Engine.
 */

import { SolutionStep } from '../../engine/math/steps';
import { MathNode } from '../../engine/math/ast';
import { checkEquivalence } from '../../engine/math/equivalence';
import { MisconceptionEngine, MisconceptionDiagnosis } from '../../engine/math/misconceptions';
import { MathConversionService } from './mathConversionService';
import { RecognizedStep } from './types';

export interface StepEvaluation {
  stepNumber: number;
  title: string;
  studentRaw: string;
  studentNormalized: string;
  expectedLatex: string;
  isEquivalent: boolean;
  confidence: number;
  divergenceReason?: string;
}

export interface FullSolutionReport {
  overallCorrect: boolean;
  totalStepsRecognized: number;
  totalExpectedSteps: number;
  firstDivergenceStepNumber: number | null;
  stepEvaluations: StepEvaluation[];
  diagnosedMisconception?: MisconceptionDiagnosis;
  feedbackMessage: string;
}

export class SolutionAnalysisService {
  /**
   * Evaluates recognized multi-line student steps against authoritative problem solution steps.
   */
  public static analyzeFullSolution(
    recognizedSteps: RecognizedStep[],
    expectedSteps: SolutionStep[],
    rawProblemExpression: MathNode,
    concept: string,
    targetVariable: string = 'x'
  ): FullSolutionReport {
    const stepEvaluations: StepEvaluation[] = [];
    let firstDivergenceStepNumber: number | null = null;
    let divergentAst: MathNode | null = null;

    for (let i = 0; i < expectedSteps.length; i++) {
      const expected = expectedSteps[i];
      const student = recognizedSteps[i];

      if (!student) {
        // Missing step in student work
        if (firstDivergenceStepNumber === null) {
          firstDivergenceStepNumber = expected.stepNumber;
        }
        stepEvaluations.push({
          stepNumber: expected.stepNumber,
          title: expected.title,
          studentRaw: '(Step omitted)',
          studentNormalized: '',
          expectedLatex: expected.expressionLatex,
          isEquivalent: false,
          confidence: 0,
          divergenceReason: 'Step was omitted in handwritten work.',
        });
        continue;
      }

      // Convert student step to AST if not already parsed
      const conv = student.ast
        ? { success: true, normalizedExpression: student.expression, ast: student.ast }
        : MathConversionService.convertToAST(student.expression);

      if (!conv.success || !conv.ast) {
        if (firstDivergenceStepNumber === null) {
          firstDivergenceStepNumber = expected.stepNumber;
        }
        stepEvaluations.push({
          stepNumber: expected.stepNumber,
          title: expected.title,
          studentRaw: student.rawText,
          studentNormalized: student.expression,
          expectedLatex: expected.expressionLatex,
          isEquivalent: false,
          confidence: student.confidence,
          divergenceReason: 'Could not parse mathematical expression for this step.',
        });
        continue;
      }

      // Convert expected step expression to AST
      let expectedAst: MathNode | null = null;
      try {
        const expectedConv = MathConversionService.convertToAST(expected.expressionLatex);
        expectedAst = expectedConv.ast || null;
      } catch {
        expectedAst = null;
      }

      let isEquivalent = false;
      if (expectedAst) {
        const eqResult = checkEquivalence(conv.ast, expectedAst, { targetVariable });
        isEquivalent = eqResult.equivalent;
      } else {
        // Fallback to text matching if expected step is an annotation
        isEquivalent = conv.normalizedExpression.trim() === expected.expressionLatex.trim();
      }

      if (!isEquivalent && firstDivergenceStepNumber === null) {
        firstDivergenceStepNumber = expected.stepNumber;
        divergentAst = conv.ast;
      }

      stepEvaluations.push({
        stepNumber: expected.stepNumber,
        title: expected.title,
        studentRaw: student.rawText,
        studentNormalized: conv.normalizedExpression,
        expectedLatex: expected.expressionLatex,
        isEquivalent,
        confidence: student.confidence,
        divergenceReason: isEquivalent ? undefined : 'Expression does not match expected intermediate derivation.',
      });
    }

    // Misconception diagnosis on the first divergent step or final answer
    let diagnosedMisconception: MisconceptionDiagnosis | undefined;
    if (divergentAst) {
      diagnosedMisconception = MisconceptionEngine.diagnose(
        divergentAst,
        rawProblemExpression,
        concept,
        targetVariable
      );
    }

    const overallCorrect = firstDivergenceStepNumber === null && stepEvaluations.every((s) => s.isEquivalent);

    let feedbackMessage = '';
    if (overallCorrect) {
      feedbackMessage = '✓ Outstanding! Every handwritten solution step is verified and algebraically sound.';
    } else if (firstDivergenceStepNumber !== null) {
      feedbackMessage = `Your solution first diverges at Step ${firstDivergenceStepNumber}. Review this step carefully.`;
      if (diagnosedMisconception?.detected) {
        feedbackMessage += ` Likely issue: ${diagnosedMisconception.name}.`;
      }
    } else {
      feedbackMessage = 'Your handwritten work contains incomplete or divergent reasoning steps.';
    }

    return {
      overallCorrect,
      totalStepsRecognized: recognizedSteps.length,
      totalExpectedSteps: expectedSteps.length,
      firstDivergenceStepNumber,
      stepEvaluations,
      diagnosedMisconception,
      feedbackMessage,
    };
  }
}
