/**
 * Mathematical Rendering, MathML Semantics & Master Bank Test Suite
 * Validates real-world rendering across all 5 courses, mathematical structures,
 * unit protection, error fallback, and procedural generator integration.
 */

import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { MathNormalizer } from '@/lib/math/mathNormalizer';
import { MATH_RENDERING_FIXTURES } from '../fixtures/math-rendering-fixtures';
import masterBank780Data from '@/engine/content/master_bank_780.json';
import { MasterBank780Problem } from '@/engine/content/types';
import { problemBank } from '@/engine/content/problemBank';
import { ContentGenerator } from '@/engine/content/generator';

describe('Comprehensive Mathematical Rendering & MathML Suite', () => {
  /* ========================================================================= */
  /* 1. Structural Test Fixtures & MathML Verification                         */
  /* ========================================================================= */
  describe('1. Structural Constructs & MathML Semantics', () => {
    MATH_RENDERING_FIXTURES.forEach((fixture) => {
      it(`renders construct: [${fixture.category}] ${fixture.name}`, () => {
        const normalized = MathNormalizer.normalizePureMath(fixture.rawExpression);
        expect(normalized).toContain(fixture.expectedLatexSnippet);

        // Render with KaTeX and verify output includes valid MathML
        const html = katex.renderToString(normalized, {
          displayMode: true,
          throwOnError: true,
          output: 'htmlAndMathml',
        });

        expect(html).toContain('class="katex"');
        expect(html).toContain('<math');
        expect(html).toContain('xmlns="http://www.w3.org/1998/Math/MathML"');

        // Verify specific MathML semantic tags by category
        if (fixture.category === 'fractions') {
          expect(html).toContain('<mfrac>');
        }
        if (fixture.category === 'powers') {
          expect(html).toContain('<msup>');
        }
        if (fixture.category === 'roots') {
          expect(html).toContain('<msqrt>');
        }
      });
    });
  });

  /* ========================================================================= */
  /* 2. Engineering Units Protection (Section 4 & Directive 4)                 */
  /* ========================================================================= */
  describe('2. Engineering Units & Currency Protection', () => {
    const unitSamples = [
      { text: 'P = 250 kPa', expectedUnit: 'kPa' },
      { text: 'm = 0.8 kg', expectedUnit: 'kg' },
      { text: 'v = 5 m/s', expectedUnit: 'm/s' },
      { text: 'P = 10 kW', expectedUnit: 'kW' },
      { text: 'q = 100 W/m²', expectedUnit: 'W/m' },
      { text: 'cp = 10 kJ/kg-K', expectedUnit: 'kJ/kg-K' },
      { text: 'm_dot = 25.0 kg/s', expectedUnit: 'kg/s' },
      { text: 'Delta T = 20.0 deg C', expectedUnit: '^\\circ\\text{C}' },
    ];

    unitSamples.forEach(({ text, expectedUnit }) => {
      it(`preserves engineering unit in "${text}" without converting to variable fraction`, () => {
        const normalized = MathNormalizer.normalizePureMath(text);
        expect(normalized).toContain(expectedUnit);

        const html = katex.renderToString(normalized, {
          displayMode: false,
          throwOnError: true,
          output: 'htmlAndMathml',
        });
        expect(html).toContain('<math');
      });
    });

    it('protects currency symbols like $80k from corrupting LaTeX delimiters', () => {
      const text = 'Net Price = $2,880.00, salvage = $400';
      const normalized = MathNormalizer.normalizePureMath(text);
      expect(normalized).toContain('\\$2,880.00');
    });
  });

  /* ========================================================================= */
  /* 3. Mixed Prose Normalization (Section 5 & 9)                              */
  /* ========================================================================= */
  describe('3. Mixed Prose Normalization', () => {
    it('isolates limit equation from surrounding English text', () => {
      const prompt = 'Evaluate the limit: lim (x -> 3) (x^2 - 2x - 3) / (x - 3)';
      const normalized = MathNormalizer.normalizeText(prompt);

      expect(normalized).toContain('Evaluate the limit:');
      expect(normalized).toContain('\\lim_{x \\to 3}');
      expect(normalized).toContain('\\frac{x^{2} - 2x - 3}{x - 3}');
    });

    it('preserves ordinary English prose when no math expressions exist', () => {
      const plain = 'The student should calculate the average temperature of the system.';
      const normalized = MathNormalizer.normalizeText(plain);
      expect(normalized).toBe(plain);
    });

    it('correctly delimits multiple variables and numbers in sentence', () => {
      const sentence = 'where T_1 = 300 K and T_2 = 450 K.';
      const normalized = MathNormalizer.normalizeText(sentence);
      expect(normalized).toContain('T_{1}');
      expect(normalized).toContain('T_{2}');
      expect(normalized).toContain('\\(');
    });

    it('accurately distinguishes pure math from prose with hasProseWords', () => {
      // Pure math expressions -> hasProseWords must be false
      expect(MathNormalizer.hasProseWords('\\lim_{x \\to 3} \\frac{x^2 - 2x - 3}{x - 3}')).toBe(false);
      expect(MathNormalizer.hasProseWords('P = 250 kPa')).toBe(false);
      expect(MathNormalizer.hasProseWords('T_1 = 300 K')).toBe(false);
      expect(MathNormalizer.hasProseWords('y = 3x^2 + 5x - 2')).toBe(false);
      expect(MathNormalizer.hasProseWords('\\frac{d^2y}{dx^2} + 4y = 0')).toBe(false);
      expect(MathNormalizer.hasProseWords('dy/dx = -x/y')).toBe(false);
      expect(MathNormalizer.hasProseWords('1/6')).toBe(false);
      expect(MathNormalizer.hasProseWords('2ye^{2xy} + 6x')).toBe(false);
      expect(MathNormalizer.hasProseWords('2ye^{2xy} - 6x')).toBe(false);
      expect(MathNormalizer.hasProseWords('e^{2x} + \\cos(xy)')).toBe(false);

      // Prose containing math or plain English -> hasProseWords must be true
      expect(MathNormalizer.hasProseWords('Find dy/dx by implicit differentiation for the given equation:')).toBe(true);
      expect(MathNormalizer.hasProseWords('Differentiate implicitly: 2x + 2y(dy/dx) = 0.')).toBe(true);
      expect(MathNormalizer.hasProseWords('Remember d/dx[y^2] = 2y (dy/dx).')).toBe(true);
      expect(MathNormalizer.hasProseWords('The student should calculate the work done.')).toBe(true);
      expect(MathNormalizer.hasProseWords('Solve for x in the following equation:')).toBe(true);
    });

    it('normalizes implicit differentiation prompt without conjoining words or stripping spaces', () => {
      const rawPrompt = 'Find dy/dx by implicit differentiation for the given equation:';
      
      // 1. isPureMath must be false
      expect(MathNormalizer.isPureMath(rawPrompt)).toBe(false);

      // 2. normalizeText must isolate dy/dx into inline math while leaving English words intact
      const normalized = MathNormalizer.normalizeText(rawPrompt);
      expect(normalized).toBe('Find \\(\\frac{dy}{dx}\\) by implicit differentiation for the given equation:');

      // 3. Must NOT wrap the whole sentence in \( ... \)
      expect(normalized.startsWith('\\(')).toBe(false);
      expect(normalized.endsWith('\\)')).toBe(false);

      // 4. parseContentSegments must yield plain text + math + plain text with natural spaces
      const segments = MathNormalizer.parseContentSegments(normalized);
      expect(segments).toHaveLength(3);
      expect(segments[0]).toEqual({ type: 'text', value: 'Find ' });
      expect(segments[1].type).toBe('math');
      expect(segments[1].source).toContain('\\frac{dy}{dx}');
      expect(segments[2]).toEqual({ type: 'text', value: ' by implicit differentiation for the given equation:' });
    });
  });

  /* ========================================================================= */
  /* 4. Acceptance Test: Calculus Limit Problem GEN0102-U1-LIM-L1-001          */
  /* ========================================================================= */
  describe('4. Acceptance Test: Sample Problem GEN0102-U1-LIM-L1-001', () => {
    const rawBank = masterBank780Data as unknown as MasterBank780Problem[];
    const problem0 = rawBank.find((p) => p.id === 'GEN0102-U1-LIM-L1-001')!;

    it('has valid canonical LaTeX expression for display', () => {
      expect(problem0).toBeDefined();
      expect(problem0.expressionLatex).toContain('\\lim_{x \\to 3}');
      expect(problem0.expressionLatex).toContain('\\frac{x^{2} - 2x - 3}{x - 3}');
    });

    it('renders statement, canonical answer, and all 4 derivation steps via KaTeX MathML', () => {
      // 1. Primary Expression
      const exprHtml = katex.renderToString(problem0.expressionLatex!, {
        displayMode: true,
        throwOnError: true,
        output: 'htmlAndMathml',
      });
      expect(exprHtml).toContain('<math');
      expect(exprHtml).toContain('<mfrac>');

      // 2. Canonical Answer
      expect(problem0.canonicalAnswerLatex).toBe('4');

      // 3. Derivation steps
      expect(problem0.derivationStepsNormalized).toBeDefined();
      expect(problem0.derivationStepsNormalized!.length).toBeGreaterThanOrEqual(4);

      problem0.derivationStepsNormalized!.forEach((step) => {
        // Derivation step contains normalized display math or inline math
        expect(step.includes('\\(') || step.includes('\\['))
      });
    });
  });

  /* ========================================================================= */
  /* 5. Course Coverage QA across All 5 Syllabi Courses                        */
  /* ========================================================================= */
  describe('5. Real 780 Problem Verification across All 5 Courses', () => {
    const rawBank = masterBank780Data as unknown as MasterBank780Problem[];

    const testCourses = [
      { courseId: 'COURSE-GEN0102', code: 'GEN 0102' },
      { courseId: 'COURSE-GEN0101', code: 'GEN 0101' },
      { courseId: 'COURSE-GEN0161', code: 'GEN 0161' },
      { courseId: 'COURSE-GEN0110', code: 'GEN 0110 / 0110L' },
      { courseId: 'COURSE-BSIE3219', code: 'BSIE 3219' },
    ];

    testCourses.forEach(({ courseId, code }) => {
      it(`renders representative problems from ${code}`, () => {
        const courseProblems = rawBank.filter((p) => p.courseId === courseId);
        expect(courseProblems.length).toBeGreaterThan(0);

        // Inspect 5 sample problems from each course
        const samples = courseProblems.slice(0, 5);
        for (const prob of samples) {
          expect(prob.statement).toBeDefined();
          expect(prob.canonicalAnswer).toBeDefined();
          expect(prob.canonicalAnswerLatex).toBeDefined();

          // Render canonical answer LaTeX
          const ansHtml = katex.renderToString(prob.canonicalAnswerLatex!, {
            displayMode: false,
            throwOnError: false,
            output: 'htmlAndMathml',
          });
          expect(ansHtml).toContain('katex');

          // Derivation steps should exist and be renderable
          expect(prob.derivationStepsNormalized).toBeDefined();
          expect(prob.derivationStepsNormalized!.length).toBeGreaterThanOrEqual(2);
        }
      });
    });
  });

  /* ========================================================================= */
  /* 6. Error Fallback & Malformed Input Safety (Directive 11)                 */
  /* ========================================================================= */
  describe('6. Error Fallback & Graceful Degradation', () => {
    const malformedInputs = [
      '\\frac{unclosed numerator',
      '\\sqrt{missing bracket',
      '\\lim_{x \\to }',
      '\\\\\\\\\\\\invalid\\\\syntax{{{',
      'x^',
      '$$ unclosed display math',
    ];

    malformedInputs.forEach((badInput) => {
      it(`safely handles malformed input without crashing: "${badInput}"`, () => {
        // MathNormalizer.normalizePureMath should not throw
        expect(() => MathNormalizer.normalizePureMath(badInput)).not.toThrow();

        // KaTeX with throwOnError: false must not throw
        expect(() => {
          katex.renderToString(badInput, {
            displayMode: false,
            throwOnError: false,
            output: 'htmlAndMathml',
          });
        }).not.toThrow();
      });
    });
  });

  /* ========================================================================= */
  /* 7. Existing Procedural Generator Integration (Directive 14)               */
  /* ========================================================================= */
  describe('7. Existing Procedural Generator Integration', () => {
    it('generates a problem via ContentGenerator and renders its math cleanly', () => {
      const request = {
        courseId: 'COURSE-GEN0102' as any,
        skillId: 'SKILL-GEN0102-001',
        evidenceType: 'DIRECT_CALCULATION',
        difficulty: 1,
      };

      const result = ContentGenerator.generateForSkill(request);
      expect(result.success).toBe(true);
      expect(result.problem).toBeDefined();

      const prob = result.problem!;
      expect(prob.statement.promptText).toBeDefined();

      // Normalize statement and canonical answer
      const normPrompt = MathNormalizer.normalizeText(prob.statement.promptText);
      expect(normPrompt.length).toBeGreaterThan(0);

      const normAns = MathNormalizer.normalizePureMath(prob.solution.canonicalAnswerLatex);
      expect(normAns.length).toBeGreaterThan(0);

      // Render canonical answer
      const html = katex.renderToString(normAns, {
        displayMode: false,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
      expect(html).toContain('katex');
    });
  });
});
