/**
 * Socratic Ask Tutor Contextuality & Reset Test Suite
 * Validates that the tutor receives full authoritative context, differentiates questions,
 * handles multi-turn follow-ups, and completely resets on new problems.
 */

import { describe, it, expect } from 'vitest';
import { DeterministicFallbackProvider, TutorContext } from '@/services/ai';

describe('Socratic Ask Tutor Contextuality & Request Pipeline', () => {
  const fallback = new DeterministicFallbackProvider();

  // Reference Problem 1: Chain Rule (5x^2 + 2x + 6)^3
  const problemChain5Context: TutorContext = {
    problemId: 'prob_chain_05',
    subject: 'Differential Calculus',
    topic: 'Derivatives',
    concept: 'Chain Rule',
    problemPrompt: 'Find the derivative $\\frac{dy}{dx}$ for the function:',
    expressionLatex: 'y = (5x^2 + 2x + 6)^3',
    verifiedAnswerLatex: '3(5x^2 + 2x + 6)^2(10x + 2)',
    whyMethodRequired:
      'The function is composite with an inner polynomial base u(x) = 5x^2 + 2x + 6 raised to the 3rd power. By the Chain Rule, we must multiply the outer power derivative by the inner derivative.',
    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Identify Inner and Outer Functions',
        ruleName: 'Chain Rule Setup',
        expressionLatex: 'u = 5x^2 + 2x + 6,\\quad f(u) = u^3',
        explanation: 'Define u as the inner quadratic polynomial.',
      },
      {
        stepNumber: 2,
        title: 'Differentiate Inner Function',
        ruleName: 'Power & Constant Rules',
        expressionLatex: 'u\'(x) = \\frac{d}{dx}[5x^2 + 2x + 6] = 10x + 2',
        explanation: 'Compute the rate of change of the inside function with respect to x.',
      },
      {
        stepNumber: 3,
        title: 'Apply Chain Rule Multiplication',
        ruleName: 'Chain Rule Formula',
        expressionLatex: '\\frac{dy}{dx} = 3u^2 \\cdot u\' = 3(5x^2 + 2x + 6)^2(10x + 2)',
        explanation: 'Multiply the outer derivative by the inner derivative.',
      },
    ],
    studentAnswerRaw: '3(5x^2 + 2x + 6)^2',
    mistakeClassification: 'Omitted Inner Derivative',
    mistakeDiagnosis:
      'You differentiated the outer exponent 3 but forgot to multiply by the inner derivative 10x + 2.',
    studentQuestion: '',
  };

  // Reference Problem 2: Product Rule
  const problemProductContext: TutorContext = {
    problemId: 'prob_product_01',
    subject: 'Differential Calculus',
    topic: 'Derivatives',
    concept: 'Product Rule',
    problemPrompt: 'Find $\\frac{dy}{dx}$:',
    expressionLatex: 'y = x^2 \\sin(x)',
    verifiedAnswerLatex: '2x \\sin(x) + x^2 \\cos(x)',
    whyMethodRequired:
      'The function is a product of two variable functions u(x) = x^2 and v(x) = sin(x). Differentiating requires the Leibniz Product Rule: d/dx[uv] = u\'v + uv\'.',
    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Identify Product Factors',
        ruleName: 'Product Rule Setup',
        expressionLatex: 'u = x^2, \\quad v = \\sin(x)',
        explanation: 'Split expression into factors u and v.',
      },
      {
        stepNumber: 2,
        title: 'Differentiate Each Factor',
        ruleName: 'Power & Trig Rules',
        expressionLatex: "u' = 2x, \\quad v' = \\cos(x)",
        explanation: 'Find derivatives of individual factors.',
      },
      {
        stepNumber: 3,
        title: 'Apply Product Rule Assembly',
        ruleName: 'Product Rule Formula',
        expressionLatex: '\\frac{dy}{dx} = u\'v + uv\' = 2x\\sin(x) + x^2\\cos(x)',
        explanation: 'Assemble terms using the Product Rule formula.',
      },
    ],
    studentAnswerRaw: '2x \\cos(x)',
    mistakeClassification: 'Multiplied Individual Derivatives',
    mistakeDiagnosis:
      'You multiplied the derivatives of each factor together instead of using u\'v + uv\'.',
    studentQuestion: '',
  };

  // Reference Problem 3: Quotient Rule
  const problemQuotientContext: TutorContext = {
    problemId: 'prob_quotient_01',
    subject: 'Differential Calculus',
    topic: 'Derivatives',
    concept: 'Quotient Rule',
    problemPrompt: 'Find $\\frac{dy}{dx}$:',
    expressionLatex: 'y = \\frac{2x + 1}{x^2 + 3}',
    verifiedAnswerLatex: '\\frac{2(x^2 + 3) - (2x + 1)(2x)}{(x^2 + 3)^2}',
    whyMethodRequired:
      'The function is a fraction of two variable expressions. By the Quotient Rule, d/dx[u/v] = (u\'v - uv\') / v^2.',
    studentQuestion: '',
  };

  /* ========================================================================= */
  /* 1. Critical Sequence on Chain Rule Problem y = (5x^2 + 2x + 6)^3          */
  /* ========================================================================= */
  describe('1. Five-Question Sequence on y = (5x^2 + 2x + 6)^3 (Section 2 & 50)', () => {
    it('Question A: answers "Why is Chain Rule required for this function?" contextually', async () => {
      const q = 'Why is Chain Rule required for this function?';
      const res = await fallback.answerTutorQuestion(
        { ...problemChain5Context, studentQuestion: q },
        q
      );
      expect(res).toContain('composite');
      expect(res).toContain('(5x^2 + 2x + 6)^3');
      expect(res).toContain('\\frac{dy}{dx} = \\frac{df}{du} \\cdot \\frac{du}{dx}');
    });

    it('Question B: answers "What is the inner function?" focusing specifically on u(x)', async () => {
      const q = 'What is the inner function?';
      const res = await fallback.answerTutorQuestion(
        { ...problemChain5Context, studentQuestion: q },
        q
      );
      expect(res).toContain('u(x) = 5x^2 + 2x + 6');
      expect(res).toContain('f(u) = u^3');
      expect(res).not.toContain('u\'(x) = 10x + 2'); // Focus is on u, not the derivative of u
    });

    it('Question C: answers "What is the derivative of the inner function?" focusing on 10x + 2', async () => {
      const q = 'What is the derivative of the inner function?';
      const res = await fallback.answerTutorQuestion(
        { ...problemChain5Context, studentQuestion: q },
        q
      );
      expect(res).toContain('10x + 2');
      expect(res).toContain('u(x) = 5x^2 + 2x + 6');
    });

    it('Question D: answers "Explain Step 2 in simpler terms." with simplified Step 2 explanation', async () => {
      const q = 'Explain Step 2 in simpler terms.';
      const res = await fallback.answerTutorQuestion(
        { ...problemChain5Context, studentQuestion: q },
        q
      );
      expect(res).toContain('Step 2');
      expect(res).toContain('Differentiate Inner Function');
    });

    it('Question E: answers "Give me a similar example." with a parallel Chain Rule problem', async () => {
      const q = 'Give me a similar example.';
      const res = await fallback.answerTutorQuestion(
        { ...problemChain5Context, studentQuestion: q },
        q
      );
      expect(res).toContain('Parallel Chain Rule Example');
      expect(res).toContain('(2x^2 + 3x + 1)^4');
    });
  });

  /* ========================================================================= */
  /* 2. Product and Quotient Rule Transitions                                  */
  /* ========================================================================= */
  describe('2. Concept Transitions: Product & Quotient Rules (Section 2 & 50)', () => {
    it('Product Rule: explains why method is required for y = x^2 sin x', async () => {
      const q = 'Why is this rule required?';
      const res = await fallback.answerTutorQuestion(
        { ...problemProductContext, studentQuestion: q },
        q
      );
      expect(res).toContain('Product Rule');
      expect(res).toContain('x^2 \\sin(x)');
      expect(res).toContain("u'v + uv'");
    });

    it('Quotient Rule: explains "Why is the denominator squared?" mathematically', async () => {
      const q = 'Why is the denominator squared?';
      const res = await fallback.answerTutorQuestion(
        { ...problemQuotientContext, studentQuestion: q },
        q
      );
      expect(res).toContain('Why the Denominator is Squared');
      expect(res).toContain('v^{-1}');
      expect(res).toContain('v^2');
    });
  });

  /* ========================================================================= */
  /* 3. New-Problem Context Reset & Stale State Prevention                     */
  /* ========================================================================= */
  describe('3. New-Problem Reset Guarantee (Section 11 & 40)', () => {
    it('guarantees switching from Chain Rule to Product Rule has zero leaked context', async () => {
      const newProblemContext: TutorContext = {
        ...problemProductContext,
        studentAnswerRaw: undefined,
        mistakeClassification: undefined,
        conversationHistory: [], // reset
        studentQuestion: 'Why is this method used?',
      };

      const res = await fallback.answerTutorQuestion(
        newProblemContext,
        'Why is this method used?'
      );

      expect(res).toContain('Product Rule');
      expect(res).not.toContain('5x^2 + 2x + 6');
      expect(res).not.toContain('Omitted Inner Derivative');
    });
  });

  /* ========================================================================= */
  /* 4. Follow-up Context Retention                                            */
  /* ========================================================================= */
  describe('4. Follow-up Retention (Section 12 & 41)', () => {
    it('maintains context across follow-up questions within the same problem thread', async () => {
      const history = [
        { role: 'user' as const, text: 'Why did we multiply by 10x + 2?' },
        {
          role: 'assistant' as const,
          text: 'Because 10x + 2 is the derivative of the inner polynomial u(x) = 5x^2 + 2x + 6.',
        },
      ];

      const followUpResponse = await fallback.answerTutorQuestion(
        {
          ...problemChain5Context,
          studentQuestion: 'Where did 10x come from?',
          conversationHistory: history,
        },
        'Where did 10x come from?',
        history
      );

      expect(followUpResponse).toContain('5x^2 + 2x + 6');
    });
  });
});
