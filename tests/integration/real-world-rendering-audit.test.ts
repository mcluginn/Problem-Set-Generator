/**
 * Real-World Mathematical Rendering Audit Test Suite
 * Validates complete end-to-end rendering across all 5 courses, mathematical structures,
 * engineering units, UI surfaces (Practice, Quiz, Solution View, Hints), MathML tags,
 * error fallbacks, and procedural generator integration.
 */

import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { MathNormalizer } from '@/lib/math/mathNormalizer';
import masterBank780Data from '@/engine/content/master_bank_780.json';
import { MasterBank780Problem } from '@/engine/content/types';
import { problemBank } from '@/engine/content/problemBank';
import { ContentGenerator } from '@/engine/content/generator';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { QuizEngine } from '@/engine/quiz/quizEngine';
import { UnifiedPracticeStore } from '@/engine/adaptive/store';

describe('Engineering Practice Engine — Real-World Mathematical Rendering Audit', () => {
  const rawBank = masterBank780Data as unknown as MasterBank780Problem[];

  /* ========================================================================= */
  /* 1. Live Application Endpoints Audit (Port 3010)                           */
  /* ========================================================================= */
  describe('1. Production Application HTTP Endpoints Verification', () => {
    it('verifies live production server is running and responds with HTTP 200', async () => {
      const baseUrl = 'http://localhost:3010';
      const endpoints = ['/', '/curriculum', '/debug/math-rendering'];

      for (const ep of endpoints) {
        const res = await fetch(`${baseUrl}${ep}`);
        expect(res.status).toBe(200);
        const html = await res.text();
        expect(html.length).toBeGreaterThan(500);
      }
    });

    it('verifies debug math-rendering page serves KaTeX & MathML markup', async () => {
      const res = await fetch('http://localhost:3010/debug/math-rendering');
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain('katex');
    });
  });

  /* ========================================================================= */
  /* 2. Real Questions across All 5 Non-DiffEq Courses                         */
  /* ========================================================================= */
  describe('2. Real 780-Bank Questions across All 5 Syllabi Courses', () => {
    const courseAuditConfigs = [
      {
        courseId: 'COURSE-GEN0102',
        name: 'Calculus 1',
        sampleProblemId: 'GEN0102-U1-LIM-L1-001',
        expectedMathKeywords: ['\\lim', '\\frac'],
      },
      {
        courseId: 'COURSE-GEN0101',
        name: 'Mathematics for Engineers',
        sampleProblemId: 'GEN0101-U1-EUC-L1-001',
        expectedMathKeywords: ['\\gcd', '='],
      },
      {
        courseId: 'COURSE-GEN0161',
        name: 'Thermodynamics',
        sampleProblemId: 'GEN0161-U2-GAS-L1-001',
        expectedMathKeywords: ['P', 'V', 'kJ'],
      },
      {
        courseId: 'COURSE-GEN0110',
        name: 'Physics 2 for Engineers',
        sampleProblemId: 'GEN0110-U2-CAL-L1-001',
        expectedMathKeywords: ['m', 'c', 'T'],
      },
      {
        courseId: 'COURSE-BSIE3219',
        name: 'IE Special Topics 1',
        sampleProblemId: 'GEN0101-U4-COMB-L1-001',
        expectedMathKeywords: ['!', '\\frac'],
      },
    ];

    courseAuditConfigs.forEach(({ courseId, name, sampleProblemId, expectedMathKeywords }) => {
      it(`verifies real question from ${name} (${courseId}) renders cleanly with MathML`, () => {
        const prob = rawBank.find((p) => p.id === sampleProblemId) || rawBank.find((p) => p.courseId === courseId)!;
        expect(prob).toBeDefined();

        // 1. Raw fields preserved
        expect(prob.statement).toBeDefined();
        expect(prob.canonicalAnswer).toBeDefined();
        expect(prob.derivationSteps).toBeDefined();
        expect(prob.recognitionHint || prob.setupHint).toBeDefined();

        // 2. Normalized canonical math expressions & segments
        expect(prob.expressionLatex || prob.statementNormalized).toBeDefined();

        if (prob.expressionLatex) {
          const rendered = katex.renderToString(MathNormalizer.normalizePureMath(prob.expressionLatex), {
            displayMode: true,
            throwOnError: false,
            output: 'htmlAndMathml',
          });
          expect(rendered).toContain('class="katex"');
          expect(rendered).toContain('<math');
          expect(rendered).toContain('xmlns="http://www.w3.org/1998/Math/MathML"');
        }

        const segments = MathNormalizer.parseToContentSegments(prob.statementNormalized || prob.statement);
        expect(segments.length).toBeGreaterThan(0);

        // 3. Derivation steps renderable
        expect(prob.derivationStepsNormalized).toBeDefined();
        expect(prob.derivationStepsNormalized!.length).toBeGreaterThanOrEqual(2);
        for (const step of prob.derivationStepsNormalized!) {
          const stepSegments = MathNormalizer.parseToContentSegments(step);
          expect(stepSegments.length).toBeGreaterThan(0);
        }

        // 4. Canonical answer renderable via KaTeX with htmlAndMathml
        const ansLatex = MathNormalizer.normalizePureMath(prob.canonicalAnswerLatex || prob.canonicalAnswer);
        const ansHtml = katex.renderToString(ansLatex, {
          displayMode: false,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
        expect(ansHtml).toContain('katex');
        expect(ansHtml).toContain('<math');
      });
    });
  });

  /* ========================================================================= */
  /* 3. Mathematical Structures Deep-Dive & MathML Semantics                   */
  /* ========================================================================= */
  describe('3. Mathematical Structures Deep-Dive & MathML Semantics', () => {
    const structures = [
      { name: 'fraction', input: '(x^2 - 1) / (x + 1)', expectedTag: '<mfrac>' },
      { name: 'nested fraction', input: '(1 / x) / (1 + 1 / y)', expectedTag: '<mfrac>' },
      { name: 'power', input: 'x^3 + 2x^2 + 1', expectedTag: '<msup>' },
      { name: 'negative exponent', input: 'x^-2 + 3y^-1', expectedTag: '<msup>' },
      { name: 'subscript', input: 'T_1 = 300, T_eq = 350', expectedTag: '<msub>' },
      { name: 'square root', input: 'sqrt(x^2 + y^2)', expectedTag: '<msqrt>' },
      { name: 'limits', input: 'lim (x -> 3) (x^2 - 9)/(x - 3)', expectedTag: '<mfrac>' },
      { name: 'derivatives', input: 'dy/dx = 3x^2 + 2x', expectedTag: '<mfrac>' },
      { name: 'second derivative', input: 'd^2y/dx^2 = 6x + 2', expectedTag: '<mfrac>' },
      { name: 'partial derivative', input: '\\frac{\\partial f}{\\partial x} = 2x y', expectedTag: '<mfrac>' },
      { name: 'integrals', input: '\\int_{0}^{1} x^2 dx = 1/3', expectedTag: '<msubsup>' },
      { name: 'summations', input: 'sum i=1 to n of i^2', expectedTag: '<munderover' },
      { name: 'matrices', input: '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}', expectedTag: '<mtable' },
      { name: 'piecewise', input: '\\begin{cases} x & x > 0 \\\\ -x & x \\le 0 \\end{cases}', expectedTag: '<mtable' },
      { name: 'trigonometric', input: 'sin(2x) = 2 sin(x) cos(x)', expectedTag: '<mi>sin</mi>' },
      { name: 'inverse trig', input: 'arctan(1) = pi/4', expectedTag: '<mfrac>' },
      { name: 'logarithms', input: 'ln(x^2) = 2 ln(x)', expectedTag: '<mi>ln</mi>' },
      { name: 'exponential', input: 'e^(2x + 1)', expectedTag: '<msup>' },
      { name: 'Greek symbols', input: 'alpha + beta = gamma + theta', expectedTag: '<mi>α</mi>' },
      { name: 'engineering formula', input: 'P * V^1.3 = C', expectedTag: '<msup>' },
      { name: 'multi-line derivation', input: 'Step 1: x^2 - 1 = 0 \\implies x = \\pm 1', expectedTag: '<mo>=' },
    ];

    structures.forEach(({ name, input, expectedTag }) => {
      it(`correctly normalizes and renders ${name} with MathML semantic ${expectedTag}`, () => {
        const normalized = MathNormalizer.normalizePureMath(input);
        const html = katex.renderToString(normalized, {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml',
        });

        expect(html).toContain('class="katex"');
        expect(html).toContain('<math');
        expect(html).toContain(expectedTag);
      });
    });
  });

  /* ========================================================================= */
  /* 4. Engineering Units Very Carefully Tested                                */
  /* ========================================================================= */
  describe('4. Engineering Units & Protection Audit', () => {
    const requiredUnits = [
      { raw: '250 kPa', expectedUnit: 'kPa' },
      { raw: '0.8 kg', expectedUnit: 'kg' },
      { raw: '5 m/s', expectedUnit: 'm/s' },
      { raw: '10 kW', expectedUnit: 'kW' },
      { raw: '100 W/m²', expectedUnit: 'W/m' },
      { raw: '10 kJ/kg-K', expectedUnit: 'kJ/kg-K' },
      { raw: '25 kg/s', expectedUnit: 'kg/s' },
    ];

    requiredUnits.forEach(({ raw, expectedUnit }) => {
      it(`strictly preserves unit "${raw}" without converting to malformed fraction variables`, () => {
        const normalized = MathNormalizer.normalizePureMath(raw);
        expect(normalized).toContain(expectedUnit);

        const html = katex.renderToString(normalized, {
          displayMode: false,
          throwOnError: true,
          output: 'htmlAndMathml',
        });

        expect(html).toContain('<math');
        expect(html).not.toContain('katex-error');
      });
    });
  });

  /* ========================================================================= */
  /* 5. Mixed Prose Normalization                                              */
  /* ========================================================================= */
  describe('5. Mixed Prose Separation and Normalization', () => {
    it('verifies prompt: "Evaluate the limit lim (x -> 3) (x^2 - 2x - 3) / (x - 3)"', () => {
      const rawPrompt = 'Evaluate the limit lim (x -> 3) (x^2 - 2x - 3) / (x - 3)';
      const normalized = MathNormalizer.normalizeText(rawPrompt);

      expect(normalized).toContain('Evaluate the limit');
      expect(normalized).toContain('\\lim_{x \\to 3}');
      expect(normalized).toContain('\\frac{x^{2} - 2x - 3}{x - 3}');

      const segments = MathNormalizer.parseToContentSegments(rawPrompt);
      expect(segments.length).toBeGreaterThan(0);
    });
  });

  /* ========================================================================= */
  /* 6. Sample Calculus Problem GEN0102-U1-LIM-L1-001 Verification             */
  /* ========================================================================= */
  describe('6. Sample Calculus Problem GEN0102-U1-LIM-L1-001 Acceptance', () => {
    const p = rawBank.find((item) => item.id === 'GEN0102-U1-LIM-L1-001')!;

    it('matches required limit notation and answer', () => {
      expect(p).toBeDefined();
      expect(p.expressionLatex).toContain('\\lim_{x \\to 3}');
      expect(p.expressionLatex).toContain('\\frac{x^{2} - 2x - 3}{x - 3}');
      expect(p.canonicalAnswerLatex).toBe('4');

      expect(p.derivationStepsNormalized?.length).toBe(4);
      expect(p.recognitionHint).toBeDefined();
      expect(p.setupHint).toBeDefined();
      expect(p.commonMistake).toBeDefined();

      const validated = problemBank.getProblemById('GEN0102-U1-LIM-L1-001');
      expect(validated).toBeDefined();
      expect(validated?.hints.length).toBe(3);

      const html = katex.renderToString(p.expressionLatex!, {
        displayMode: true,
        throwOnError: true,
        output: 'htmlAndMathml',
      });
      expect(html).toContain('<mfrac>');
      expect(html).toContain('<msup>');
    });
  });

  /* ========================================================================= */
  /* 7. Error Fallback Verification                                            */
  /* ========================================================================= */
  describe('7. Error Fallback & Malformed Math Safety', () => {
    const badInputs = [
      '\\frac{1}{',
      '\\sqrt[',
      '\\undefinedcmd{x}',
      '$$ unclosed display math',
      'x^^^2',
      '\\begin{matrix} 1 & 2',
    ];

    badInputs.forEach((bad) => {
      it(`safely degrades without throwing for "${bad}"`, () => {
        expect(() => {
          const norm = MathNormalizer.normalizePureMath(bad);
          katex.renderToString(norm, {
            displayMode: false,
            throwOnError: false,
            output: 'htmlAndMathml',
          });
        }).not.toThrow();
      });
    });
  });

  /* ========================================================================= */
  /* 8. Procedural Content Generator Verification                              */
  /* ========================================================================= */
  describe('8. Procedural Content Generator Math Rendering', () => {
    it('generates problem via ContentGenerator and renders cleanly', () => {
      const generated = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0102' as any,
        skillId: 'SKILL-GEN0102-001',
        evidenceType: 'DIRECT_CALCULATION',
        difficulty: 2,
      });

      expect(generated.success).toBe(true);
      expect(generated.problem).toBeDefined();
      const prob = generated.problem!;

      expect(prob.statement.promptText).toBeDefined();
      if (prob.statement.expressionLatex) {
        const exprHtml = katex.renderToString(prob.statement.expressionLatex, {
          displayMode: true,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
        expect(exprHtml).toContain('katex');
      }

      const ansHtml = katex.renderToString(prob.solution.canonicalAnswerLatex, {
        displayMode: false,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
      expect(ansHtml).toContain('katex');
    });
  });

  /* ========================================================================= */
  /* 9. End-to-End Student Practice Flow Verification                          */
  /* ========================================================================= */
  describe('9. End-to-End Student Practice Flow Lifecycle', () => {
    it('initiates a practice session, loads problem, checks hints, and evaluates answers', () => {
      UnifiedPracticeStore.initialize();
      const session = UnifiedPracticeStore.startSession('COURSE-GEN0102', {
        mode: 'RECOMMENDED',
        sessionLength: 3,
      });

      expect(session).toBeDefined();
      expect(session.currentProblem).toBeDefined();
      const prob = session.currentProblem!;

      expect(prob.statement.promptText.length).toBeGreaterThan(0);
      expect(prob.hints.length).toBeGreaterThanOrEqual(1);
      for (const hint of prob.hints) {
        const hintNormalized = MathNormalizer.normalizeText(hint.text);
        expect(hintNormalized.length).toBeGreaterThan(0);
      }

      expect(prob.solution.reasoningTrace.length).toBeGreaterThanOrEqual(1);
      for (const step of prob.solution.reasoningTrace) {
        expect(step.actionDescription.length).toBeGreaterThan(0);
      }

      expect(prob.solution.canonicalAnswerLatex.length).toBeGreaterThan(0);
    });
  });

  /* ========================================================================= */
  /* 10. End-to-End Quiz Flow Verification                                     */
  /* ========================================================================= */
  describe('10. End-to-End Quiz Flow & Math Rendering Lifecycle', async () => {
    it('generates a 5-question quiz across courses and renders all question options and answers', async () => {
      const quiz = await QuizEngine.createQuizAsync(
        {
          courseId: 'COURSE-GEN0102',
          questionCount: 5,
          format: 'MIXED',
          difficulty: 'ADAPTIVE',
        },
        'audit-user'
      );

      expect(quiz.questions.length).toBe(5);
      for (const q of quiz.questions) {
        expect(q.problem.statement.promptText.length).toBeGreaterThan(0);
        if (q.format === 'MULTIPLE_CHOICE') {
          expect(q.options?.length).toBe(4);
          for (const opt of q.options!) {
            const optHtml = katex.renderToString(MathNormalizer.normalizePureMath(opt.textLatex), {
              displayMode: false,
              throwOnError: false,
              output: 'htmlAndMathml',
            });
            expect(optHtml).toContain('katex');
          }
        }
      }
    });
  });
});
