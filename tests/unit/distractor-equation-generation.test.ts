import { describe, it, expect } from 'vitest';
import { DistractorGenerator } from '@/engine/quiz/distractorGenerator';
import { MathNormalizer } from '@/lib/math/mathNormalizer';
import { ValidatedProblem } from '@/engine/content/types';

function createMockProblem(canonicalLatex: string, canonicalRaw: string): ValidatedProblem {
  return {
    dna: {
      problemId: 'TEST-PROB-001',
      primarySkillId: 'SKILL-GEN0110-005',
      courseId: 'COURSE-GEN0110',
      difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 2, reasoning: 2, representation: 1, context: 2, multiStep: 2 }
    } as any,
    statement: {
      promptText: 'Test Doppler problem statement',
      expressionLatex: canonicalLatex
    } as any,
    rawExpression: {} as any,
    solution: {
      canonicalAnswerLatex: canonicalLatex,
      canonicalAnswerRaw: canonicalRaw,
      reasoningTrace: []
    } as any,
    hints: []
  };
}

describe('DistractorGenerator Equation Handling', () => {
  it('generates 4 mathematically coherent options for multi-variable physics equations', () => {
    const doppler = createMockProblem(
      'f_{\\text{approach}} = 929.03\\text{ Hz }, f_{\\text{recede}} = 691.89\\text{ Hz }',
      'f_approach = 929.03 Hz, f_recede = 691.89 Hz'
    );

    const options = DistractorGenerator.generateOptions(doppler);
    expect(options).toHaveLength(4);

    const correct = options.filter(o => o.isCorrect);
    expect(correct).toHaveLength(1);
    expect(correct[0].textLatex).toBe('f_{\\text{approach}} = 929.03\\text{ Hz }, f_{\\text{recede}} = 691.89\\text{ Hz }');

    // No distractor should have invalid negative equation syntax or 2 (...) wrappers
    for (const opt of options) {
      expect(opt.textLatex).not.toMatch(/^-f/);
      expect(opt.textLatex).not.toMatch(/^2\s*\(/);
      expect(opt.textLatex).toContain('f_{\\text{approach}}');
      expect(opt.textLatex).toContain('f_{\\text{recede}}');
    }

    // All 4 options must be distinct
    const unique = new Set(options.map(o => o.textLatex));
    expect(unique.size).toBe(4);
  });

  it('generates consistent LHS equations for differential/algebraic equations', () => {
    const diffeq = createMockProblem(
      '\\frac{dy}{dx} = 2ye^{2xy} + 6x',
      'dy/dx = 2*y*e^(2*x*y) + 6*x'
    );

    const options = DistractorGenerator.generateOptions(diffeq);
    expect(options).toHaveLength(4);

    const correct = options.filter(o => o.isCorrect);
    expect(correct).toHaveLength(1);

    for (const opt of options) {
      expect(opt.textLatex).toMatch(/\\frac\{dy\}\{dx\}\s*=/);
      expect(opt.textLatex).not.toMatch(/^-\\frac/);
      expect(opt.textLatex).not.toMatch(/^2\s*\(/);
    }
  });
});

describe('MathNormalizer Polish & Precision', () => {
  it('correctly classifies equation with LaTeX text subscripts as pure math without prose words', () => {
    const opt = 'f_{\\text{approach}} = 929.03\\text{ Hz }, f_{\\text{recede}} = 691.89\\text{ Hz }';
    expect(MathNormalizer.hasProseWords(opt)).toBe(false);
    expect(MathNormalizer.isPureMath(opt)).toBe(true);
  });

  it('identifies instructional hints with English words as prose', () => {
    const hint = 'Approach: 800 * (340 + 20)/(340 - 30). Recede: 800 * (340 - 20)/(340 + 30).';
    expect(MathNormalizer.hasProseWords(hint)).toBe(true);
    expect(MathNormalizer.isPureMath(hint)).toBe(false);
  });

  it('normalizes fractions containing floating point decimals without splitting digits', () => {
    const expr = '360.0 / 310.0';
    const norm = MathNormalizer.normalizePureMath(expr);
    expect(norm).toBe('\\frac{360.0}{310.0}');
  });

  it('normalizes prompt equations without cutting off decimals before period', () => {
    const prompt = 'Travels at v_src = 30.0 m/s. A car travels at v_obs = 20.0 m/s. Speed of sound is v = 340.0 m/s.';
    const norm = MathNormalizer.normalizeText(prompt);
    expect(norm).toContain('\\(v_{{\\text{src}}} = 30.0\\text{ m/s }\\)');
    expect(norm).toContain('\\(v_{{\\text{obs}}} = 20.0\\text{ m/s }\\)');
    expect(norm).toContain('\\(v = 340.0\\text{ m/s }\\)');
    expect(norm).not.toContain('30\\).0');
    expect(norm).not.toContain('20\\).0');
    expect(norm).not.toContain('340\\).0');
  });

  it('normalizes multi-colon step text by putting only the formula in display math', () => {
    const step = '• Step 2: Observer moves toward source (+ in numerator): v + v_obs = 340.0 + 20.0 = 360.0 m/s.';
    const norm = MathNormalizer.normalizeStepText(step);
    expect(norm).toContain('• Step 2: Observer moves toward source (+ in numerator):');
    expect(norm).toContain('\\[ v + v_{{\\text{obs}}} = 340.0 + 20.0 = 360.0\\text{ m/s } \\]');
    expect(norm).not.toContain('\\[ Observer moves toward source');
  });
});
