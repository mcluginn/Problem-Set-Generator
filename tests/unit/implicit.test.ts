import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { ImplicitDifferentiator } from '@/engine/math/implicit';
import { nodeToLatex } from '@/engine/math/ast';

describe('Implicit Differentiation Engine', () => {
  it('differentiates circle equation: x^2 + y^2 = 25 -> dy/dx = -x/y', () => {
    // F(x, y) = x^2 + y^2 - 25
    const circleEq = parseMath('x^2 + y^2 - 25');
    const result = ImplicitDifferentiator.solveImplicit(circleEq, 'x^2 + y^2 = 25');

    expect(result.steps.length).toBe(4);
    expect(result.steps[0].ruleName).toBe('Implicit Differentiation');
    expect(result.steps[0].conceptualNote).toContain('Chain Rule');
    expect(result.simplifiedDerivativeLatex).toBe('-\\frac{x}{y}');
    expect(result.whyImplicitRequired).toContain('Why Implicit Differentiation?');
  });

  it('differentiates product terms containing y: x^2 * y = 10 -> dy/dx = -2y/x', () => {
    // F(x, y) = x^2 * y - 10
    const eq = parseMath('x^2 * y - 10');
    const result = ImplicitDifferentiator.solveImplicit(eq, 'x^2 y = 10');

    expect(result.simplifiedDerivativeLatex).toBe('-\\frac{2 y}{x}');
  });

  it('differentiates mixed cubic curve: x^3 + y^3 - 9xy = 0 (Folium of Descartes)', () => {
    // F(x, y) = x^3 + y^3 - 9*x*y
    const folium = parseMath('x^3 + y^3 - 9*x*y');
    const result = ImplicitDifferentiator.solveImplicit(folium, 'x^3 + y^3 - 9xy = 0');

    expect(result.steps.length).toBeGreaterThanOrEqual(4);
    expect(result.simplifiedDerivativeLatex).toBe('\\frac{3 y - x^{2}}{y^{2} - 3 x}');
  });
});
