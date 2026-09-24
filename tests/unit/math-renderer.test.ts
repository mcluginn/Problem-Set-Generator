/**
 * Dedicated Math Renderer & Content Pipeline Test Suite (Section 18 & 19)
 * Tests raw LaTeX rendering, delimiter normalization, structured content parsing,
 * and regression-proofs against raw LaTeX leakage (\left, \right, ^{}, etc.).
 */

import { describe, it, expect } from 'vitest';
import katex from 'katex';
import { MathNormalizer } from '@/components/math/normalizer';
import { isPureMathExpression } from '@/components/math/MathRenderer';

describe('Math Renderer & KaTeX Core Integration (Section 18 & 19)', () => {
  /* ========================================================================= */
  /* 1. Required Mathematical Constructs (Section 18)                          */
  /* ========================================================================= */
  describe('1. Section 18 Mathematical Constructs', () => {
    const formulas = [
      'x^2',
      'x^{2}',
      'x^{-3}',
      'x^{1/2}',
      '\\sqrt{x}',
      '\\frac{dy}{dx}',
      '\\frac{x+1}{x-2}',
      '\\sin(x)',
      '\\cos(x)',
      '\\ln(x)',
      'e^{2x}',
      '\\left(x+1\\right)^5',
    ];

    formulas.forEach((latex) => {
      it(`renders formula "${latex}" via KaTeX to valid HTML/MathML without error`, () => {
        const html = katex.renderToString(latex, {
          displayMode: false,
          throwOnError: true,
          output: 'htmlAndMathml',
        });
        expect(html).toBeDefined();
        expect(html).toContain('katex');
        expect(html).toContain('math');
      });
    });
  });

  /* ========================================================================= */
  /* 2. Exact Regression Case (Section 19)                                     */
  /* ========================================================================= */
  describe('2. Exact Regression Case: y = \\left(4x^{2} + 1x + 1\\right)^{5}', () => {
    it('renders y = \\left(4x^{2} + 1x + 1\\right)^{5} into rendered mathematics without throwing', () => {
      const expr = 'y = \\left(4x^{2} + 1x + 1\\right)^{5}';
      const html = katex.renderToString(expr, {
        displayMode: true,
        throwOnError: true,
        output: 'htmlAndMathml',
      });

      expect(html).toContain('katex-display');
      expect(html).toContain('annotation');
      // The annotation is in a hidden MathML tag, but the visual HTML output uses delimsizing and base spans
      expect(html).toContain('delimsizing');
    });
  });

  /* ========================================================================= */
  /* 3. Structured Content Tokenization (Section 20, 21 & 22)                  */
  /* ========================================================================= */
  describe('3. Mixed Content & Delimiter Tokenization (Section 20 & 21)', () => {
    it('parses "Find the derivative \\(dy/dx\\) for the function:" into Text, InlineMath, Text', () => {
      const input = 'Find the derivative \\(dy/dx\\) for the function:';
      const segments = MathNormalizer.parseInlineSegments(input);

      expect(segments.length).toBe(3);
      expect(segments[0]).toEqual({ type: 'text', text: 'Find the derivative ' });
      expect(segments[1]).toEqual({ type: 'inline_math', latex: 'dy/dx' });
      expect(segments[2]).toEqual({ type: 'text', text: ' for the function:' });
    });

    it('parses "Find the derivative $\\frac{dy}{dx}$ for the function:" into Text, InlineMath, Text', () => {
      const input = 'Find the derivative $\\frac{dy}{dx}$ for the function:';
      const segments = MathNormalizer.parseInlineSegments(input);

      expect(segments.length).toBe(3);
      expect(segments[0]).toEqual({ type: 'text', text: 'Find the derivative ' });
      expect(segments[1]).toEqual({ type: 'inline_math', latex: '\\frac{dy}{dx}' });
      expect(segments[2]).toEqual({ type: 'text', text: ' for the function:' });
    });

    it('parses "Find dy/dx by implicit differentiation for the given equation:" preserving spaces', () => {
      const input = 'Find dy/dx by implicit differentiation for the given equation:';
      const segments = MathNormalizer.parseInlineSegments(input);

      expect(segments.length).toBe(3);
      expect(segments[0]).toEqual({ type: 'text', text: 'Find ' });
      expect(segments[1]).toEqual({ type: 'inline_math', latex: '\\frac{dy}{dx}' });
      expect(segments[2]).toEqual({ type: 'text', text: ' by implicit differentiation for the given equation:' });
    });

    it('rejects English prose from isPureMathExpression even with displayMode=true', () => {
      expect(isPureMathExpression('Find dy/dx by implicit differentiation for the given equation:', true)).toBe(false);
      expect(isPureMathExpression('Find dy/dx by implicit differentiation for the given equation:', false)).toBe(false);
    });

    it('parses multi-paragraph and display math blocks into structured content', () => {
      const raw = `The Chain Rule is used because the function contains an inner function.

\\[
y=(5x^2+2x+6)^3
\\]

The inner derivative is:

\\[
10x+2
\\]`;

      const blocks = MathNormalizer.parseContentBlocks(raw);
      expect(blocks.length).toBe(4);
      expect(blocks[0].type).toBe('paragraph');
      expect(blocks[1].type).toBe('display_math');
      expect(blocks[1].latex).toBe('y=(5x^2+2x+6)^3');
      expect(blocks[2].type).toBe('paragraph');
      expect(blocks[3].type).toBe('display_math');
      expect(blocks[3].latex).toBe('10x+2');
    });

    it('parses multiple sequential equations independently (Section 22)', () => {
      const text = `Let $u=5x^2+2x+6$.

Then:
$$
\\frac{du}{dx}=10x+2
$$

Therefore:
$$
\\frac{dy}{dx}=3u^2 \\cdot (10x+2)
$$`;

      const blocks = MathNormalizer.parseContentBlocks(text);
      expect(blocks.length).toBe(5);
      expect(blocks[0].type).toBe('paragraph');
      expect(blocks[1].type).toBe('paragraph');
      expect(blocks[2].type).toBe('display_math');
      expect(blocks[3].type).toBe('paragraph');
      expect(blocks[4].type).toBe('display_math');
    });
  });
});
