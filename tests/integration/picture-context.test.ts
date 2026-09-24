/**
 * Picture Context AI Integration & Multi-Step Reasoning Trace Test Suite (Section 87)
 */

import { describe, it, expect } from 'vitest';
import { SolutionAnalysisService } from '@/services/picture/solutionAnalysisService';
import { parseMath } from '@/engine/math/parser';
import { SolutionStep } from '@/engine/math/steps';
import { DeterministicFallbackProvider, TutorContext } from '@/services/ai';

describe('Picture Context AI Integration & Mode B Reasoning Trace', () => {
  it('localizes first reasoning divergence step in Mode B multi-step handwritten solution', () => {
    const rawProblem = parseMath('(3*x^2 - 2*x + 4)^5');
    const expectedSteps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: 'Identify Inner and Outer Functions',
        ruleName: 'Decomposition',
        expressionLatex: 'u = 3x^2 - 2x + 4, \\quad y = u^5',
        explanation: 'Decompose the composite function.',
      },
      {
        stepNumber: 2,
        title: 'Differentiate Inner Function',
        ruleName: 'Power Rule + Sum/Difference',
        expressionLatex: '\\frac{du}{dx} = 6x - 2',
        explanation: 'Differentiate 3x^2 - 2x + 4 to obtain 6x - 2.',
      },
      {
        stepNumber: 3,
        title: 'Differentiate Outer Function',
        ruleName: 'Power Rule',
        expressionLatex: '\\frac{dy}{du} = 5u^4',
        explanation: 'Differentiate u^5 to obtain 5u^4.',
      },
      {
        stepNumber: 4,
        title: 'Multiply Derivatives (Chain Rule)',
        ruleName: 'Chain Rule',
        expressionLatex: '\\frac{dy}{dx} = 5(6x - 2)(3x^2 - 2x + 4)^4',
        explanation: 'Multiply dy/du by du/dx.',
      },
    ];

    // Student makes an error at Step 2 (wrote du/dx = 6x instead of 6x - 2)
    const recognizedStudentSteps = [
      { stepIndex: 1, rawText: 'u = 3x^2 - 2x + 4', expression: 'u = 3x^2 - 2x + 4', confidence: 0.9 },
      { stepIndex: 2, rawText: 'du/dx = 6x', expression: '6x', confidence: 0.88 }, // error here
      { stepIndex: 3, rawText: 'dy/du = 5u^4', expression: '5u^4', confidence: 0.9 },
      { stepIndex: 4, rawText: 'dy/dx = 5(6x)(3x^2 - 2x + 4)^4', expression: '5*(6*x)*(3*x^2 - 2*x + 4)^4', confidence: 0.9 },
    ];

    const report = SolutionAnalysisService.analyzeFullSolution(
      recognizedStudentSteps,
      expectedSteps,
      rawProblem,
      'Chain Rule',
      'x'
    );

    expect(report.overallCorrect).toBe(false);
    expect(report.firstDivergenceStepNumber).toBe(2);
    expect(report.feedbackMessage).toContain('first diverges at Step 2');
  });

  it('passes structured mathematical text to AI Tutor without resending raw photograph bytes', async () => {
    const tutor = new DeterministicFallbackProvider();

    const tutorContext: TutorContext = {
      problemId: 'prob_pic_1',
      subject: 'Differential Calculus',
      topic: 'Derivatives',
      concept: 'Chain Rule',
      problemPrompt: 'Find the derivative of y = (3x^2 - 2x + 4)^5',
      expressionLatex: 'y = (3x^2 - 2x + 4)^5',
      verifiedAnswerLatex: '5(6x - 2)(3x^2 - 2x + 4)^4',
      whyMethodRequired: 'Chain rule is required because the function is composite.',
      studentAnswerRaw: '5(3x^2 - 2x + 4)^4', // converted from photo
      mistakeClassification: 'MISSING_INNER_DERIVATIVE',
      mistakeDiagnosis: 'The inner function derivative (6x - 2) was omitted.',
      studentQuestion: 'Why is my answer missing something?',
    };

    // Ensure context does NOT have image base64 data
    expect((tutorContext as any).imageDataUrl).toBeUndefined();

    const response = await tutor.answerTutorQuestion(tutorContext, tutorContext.studentQuestion!);
    expect(response).toBeDefined();
    expect(response.length).toBeGreaterThan(20);
    expect(response).toContain('inner');
  });
});
