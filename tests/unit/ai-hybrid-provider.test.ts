/**
 * Unit Tests for Hybrid AI Provider Router and Resilience
 * Verifies that:
 * 1. Without GEMINI_API_KEY, getAIProvider returns DeterministicFallbackProvider.
 * 2. With GEMINI_API_KEY, getAIProvider returns GeminiProvider.
 * 3. GeminiProvider gracefully falls back to DeterministicFallbackProvider on network/timeout/auth failure.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAIProvider, GeminiProvider, DeterministicFallbackProvider, TutorContext } from '@/services/ai';

describe('AI Gateway Hybrid Behavior & Resilience', () => {
  const originalKey = process.env.GEMINI_API_KEY;

  const sampleContext: TutorContext = {
    problemId: 'prob_test_01',
    subject: 'Thermodynamics',
    topic: 'First Law of Thermodynamics',
    concept: 'Isobaric Work',
    expressionLatex: 'W = P(V_2 - V_1)',
    verifiedAnswerLatex: '75.0\\text{ kJ}',
    studentQuestion: 'What is the formula?',
    whyMethodRequired: 'Pressure remains constant during boundary displacement.',
  };

  beforeEach(() => {
    process.env.GEMINI_API_KEY = '';
  });

  afterEach(() => {
    if (originalKey !== undefined) {
      process.env.GEMINI_API_KEY = originalKey;
    } else {
      delete process.env.GEMINI_API_KEY;
    }
  });

  it('selects DeterministicFallbackProvider when GEMINI_API_KEY is unset', () => {
    process.env.GEMINI_API_KEY = '';
    const provider = getAIProvider();
    expect(provider).toBeInstanceOf(DeterministicFallbackProvider);
    expect(provider.name).toBe('Deterministic Contextual Tutor');
  });

  it('switches to GeminiProvider when GEMINI_API_KEY is provided', () => {
    process.env.GEMINI_API_KEY = 'mock-test-key-12345';
    const provider = getAIProvider();
    expect(provider).toBeInstanceOf(GeminiProvider);
    expect(provider.name).toContain('Google Gemini');
  });

  it('GeminiProvider seamlessly falls back to deterministic engine on API error', async () => {
    // With an invalid key, the Gemini call will fail, but must NOT throw.
    // It should seamlessly return a high-quality deterministic response.
    const gemini = new GeminiProvider('invalid_dummy_key');
    const response = await gemini.answerTutorQuestion(sampleContext, 'What is the formula?');

    expect(response).toBeDefined();
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(20);
    // Verified that it returned the deterministic response
    expect(response).toContain('Isobaric');
  });

  it('GeminiProvider seamlessly falls back for generateExplanation', async () => {
    const gemini = new GeminiProvider('invalid_dummy_key');
    const explanation = await gemini.generateExplanation(sampleContext);

    expect(explanation).toBeDefined();
    expect(typeof explanation).toBe('string');
    expect(explanation.length).toBeGreaterThan(20);
  });

  it('GeminiProvider seamlessly falls back for generateContextualHint', async () => {
    const gemini = new GeminiProvider('invalid_dummy_key');
    const hint = await gemini.generateContextualHint(sampleContext, 2);

    expect(hint).toBeDefined();
    expect(typeof hint).toBe('string');
    expect(hint.length).toBeGreaterThan(10);
  });

  it('GeminiProvider seamlessly falls back for diagnoseMistake', async () => {
    const gemini = new GeminiProvider('invalid_dummy_key');
    const mistake = await gemini.diagnoseMistake(sampleContext, '100 kJ');

    expect(mistake).toBeDefined();
    expect(mistake.diagnosis).toBeDefined();
    expect(mistake.guidanceTip).toBeDefined();
  });
});
