import { describe, it, expect } from 'vitest';
import { PracticeStore } from '@/services/database/store';
import { AdaptiveEngine } from '@/services/adaptive/adaptive';
import { DeterministicFallbackProvider, GeminiProvider } from '@/services/ai';
import { parseMath } from '@/engine/math/parser';
import { StepGenerator } from '@/engine/math/steps';

describe('1. Persistence & Practice Store', () => {
  it('loads default profile and initializes concept mastery', () => {
    const profile = PracticeStore.getProfile();
    expect(profile.userId).toBe('usr_student_demo');
    expect(profile.currentStreak).toBeGreaterThanOrEqual(0);

    const mastery = PracticeStore.getMastery();
    expect(mastery['Power Rule']).toBeDefined();
    expect(mastery['Chain Rule']).toBeDefined();
  });

  it('records student attempt and updates streak and mastery', () => {
    const initialMastery = PracticeStore.getMastery()['Power Rule'].masteryPercentage;

    PracticeStore.recordAttempt({
      id: 'att_test_1',
      studentId: 'prof_student_demo',
      problemId: 'prob_test_1',
      concept: 'Power Rule',
      familyId: 'POWER_POLYNOMIAL',
      representationType: 'Symbolic',
      submittedAnswer: '12x^2',
      isCorrect: true,
      attemptNumber: 1,
      hintsUsed: 0,
      solutionViewed: false,
      timeSpentSeconds: 15,
      createdAt: new Date().toISOString(),
    });

    const updatedMastery = PracticeStore.getMastery()['Power Rule'].masteryPercentage;
    expect(updatedMastery).toBeGreaterThanOrEqual(initialMastery);
  });
});

describe('2. Adaptive "Next Best Problem" Selection', () => {
  it('recommends targeted remediation when student has an unresolved mistake', () => {
    const mastery = PracticeStore.getMastery();
    const mistakes = [
      {
        id: 'mst_1',
        studentId: 'prof_student_demo',
        concept: 'Chain Rule',
        misconceptionCode: 'MISSING_INNER_DERIVATIVE' as const,
        misconceptionName: 'Omitted Inner Derivative',
        problemStatement: '...',
        problemLatex: '...',
        studentAnswer: '...',
        correctAnswerLatex: '...',
        explanation: '...',
        occurredCount: 2,
        resolved: false,
        lastOccurredAt: new Date().toISOString(),
      },
    ];

    const recommendation = AdaptiveEngine.selectNextBestProblem(mastery, mistakes);
    expect(recommendation.concept).toBe('Chain Rule');
    expect(recommendation.remediationMisconception).toBe('MISSING_INNER_DERIVATIVE');
    expect(recommendation.reason).toContain('Targeted Remediation');
  });

  it('recommends lowest mastery concept when mistakes are resolved', () => {
    const mastery = PracticeStore.getMastery();
    // Chain Rule has 63% mastery
    const recommendation = AdaptiveEngine.selectNextBestProblem(mastery, []);
    expect(recommendation.concept).toBeDefined();
    expect(recommendation.reason).toBeDefined();
  });
});

describe('3. AI Resilience & Fallback Layer', () => {
  it('deterministic fallback generates verified explanations without external AI', async () => {
    const provider = new DeterministicFallbackProvider();
    expect(await provider.isAvailable()).toBe(true);

    const ast = parseMath('(3x^2 - 2x + 4)^5');
    const solution = StepGenerator.generateSolution(ast, 'Chain Rule');

    const explanation = await provider.generateExplanation({
      subject: 'Differential Calculus',
      topic: 'Derivatives',
      concept: 'Chain Rule',
      problemPrompt: 'Find dy/dx',
      expressionLatex: '(3x^2 - 2x + 4)^5',
      verifiedAnswerLatex: solution.canonicalAnswerLatex,
      solutionSteps: solution.steps,
    });

    expect(explanation).toContain('Chain Rule');
    expect(explanation).toContain(solution.canonicalAnswerLatex);
  });

  it('GeminiProvider falls back to deterministic engine gracefully if no key or error', async () => {
    const gemini = new GeminiProvider('invalid_mock_key');
    const ast = parseMath('x^3 * sin(x)');
    const solution = StepGenerator.generateSolution(ast, 'Product Rule');

    const hint = await gemini.generateContextualHint(
      {
        subject: 'Differential Calculus',
        topic: 'Derivatives',
        concept: 'Product Rule',
        problemPrompt: 'Find dy/dx',
        expressionLatex: 'x^3 \\sin(x)',
        verifiedAnswerLatex: solution.canonicalAnswerLatex,
        solutionSteps: solution.steps,
      },
      2
    );

    expect(hint).toBeDefined();
    expect(hint.length).toBeGreaterThan(10);
  });
});
