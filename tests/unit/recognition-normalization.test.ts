/**
 * Recognition Math Normalization Test Suite (Section 82)
 */

import { describe, it, expect } from 'vitest';
import { MathConversionService } from '@/services/picture/mathConversionService';

describe('Handwritten Math Normalization Service', () => {
  it('normalizes uppercase X variable to lowercase x', () => {
    const raw = '2*X + 5';
    const result = MathConversionService.convertToAST(raw);
    expect(result.success).toBe(true);
    expect(result.normalizedExpression).toBe('2*x + 5');
  });

  it('normalizes unicode superscripts to standard carat exponent notation', () => {
    const raw = '3x² - 2x³ + x⁴';
    const result = MathConversionService.convertToAST(raw);
    expect(result.success).toBe(true);
    expect(result.normalizedExpression).toContain('3x^2');
    expect(result.normalizedExpression).toContain('2x^3');
    expect(result.normalizedExpression).toContain('x^4');
  });

  it('normalizes unicode multiplication and division symbols (·, ×, ÷)', () => {
    const raw = '5 · 2 × x ÷ 3';
    const result = MathConversionService.convertToAST(raw);
    expect(result.success).toBe(true);
    expect(result.normalizedExpression).toBe('5 * 2 * x / 3');
  });

  it('normalizes LaTeX fraction macros (\\frac{u}{v}) into standard nested division', () => {
    const raw = '\\frac{2x + 1}{x^2 + 3}';
    const result = MathConversionService.convertToAST(raw);
    expect(result.success).toBe(true);
    expect(result.normalizedExpression).toContain('((2x + 1)/(x^2 + 3))');
  });

  it('normalizes LaTeX radicals (\\sqrt{x}) into power notation (x)^(1/2)', () => {
    const raw = '\\sqrt{x^2 + 1}';
    const result = MathConversionService.convertToAST(raw);
    expect(result.success).toBe(true);
    expect(result.normalizedExpression).toContain('(x^2 + 1)^(1/2)');
  });

  it('normalizes trigonometric functions with LaTeX backslashes', () => {
    const raw = '\\sin(x) + \\cos(2x) - \\tan(x)';
    const result = MathConversionService.convertToAST(raw);
    expect(result.success).toBe(true);
    expect(result.normalizedExpression).toBe('sin(x) + cos(2x) - tan(x)');
  });

  it('converts normalized mathematical expression into a valid MathNode AST', () => {
    const raw = '10*(3x - 1)*(3*x^2 - 2*x + 4)^4';
    const result = MathConversionService.convertToAST(raw);
    expect(result.success).toBe(true);
    expect(result.ast).toBeDefined();
    expect(result.ast?.type).toBe('multiply');
  });
});
