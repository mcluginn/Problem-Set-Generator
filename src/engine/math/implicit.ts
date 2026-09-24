/**
 * Implicit Differentiation Solver & Step Generator
 * Differentiates implicit equations F(x, y) = C treating y as a dependent function y(x).
 */

import {
  MathNode,
  constant,
  variable,
  add,
  subtract,
  multiply,
  divide,
  power,
  negate,
  derivativeTerm,
  nodeToLatex,
  getVariables,
  ZERO,
  ONE,
} from './ast';
import { Differentiator } from './differentiator';
import { simplify, expand } from './simplifier';
import { SolutionStep } from './steps';

export interface ImplicitDifferentiationResult {
  equationLatex: string;
  derivativeDydx: MathNode;
  simplifiedDerivativeLatex: string;
  steps: SolutionStep[];
  whyImplicitRequired: string;
}

export class ImplicitDifferentiator {
  /**
   * Solves dy/dx for an implicit expression relation F(x, y) = 0.
   */
  public static solveImplicit(
    expressionF: MathNode,
    equationLatex?: string
  ): ImplicitDifferentiationResult {
    // 1. Differentiate F(x, y) with respect to x treating y as implicit
    const diffResult = Differentiator.differentiate(expressionF, 'x', true);
    const expandedDeriv = expand(diffResult.derivative);
    const rawDeriv = simplify(expandedDeriv);

    // 2. Separate terms with dy/dx and terms without dy/dx
    // Conceptually: A(x, y) * dy/dx + B(x, y) = 0  =>  dy/dx = -B(x, y) / A(x, y)
    const { dydxCoeff, otherTerms } = ImplicitDifferentiator.extractDydxComponents(rawDeriv);

    const numerator = simplify(negate(otherTerms));
    const denominator = simplify(dydxCoeff);
    const finalDydx = simplify(divide(numerator, denominator));

    const finalLatex = nodeToLatex(finalDydx);
    const eqDisplay = equationLatex || `${nodeToLatex(expressionF)} = 0`;

    // 3. Build step-by-step pedagogical explanation
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: 'Differentiate Both Sides with Respect to x',
        ruleName: 'Implicit Differentiation',
        expressionLatex: `\\frac{d}{dx}\\left[${nodeToLatex(expressionF)}\\right] = \\frac{d}{dx}[0]`,
        explanation:
          'Differentiate each term with respect to $x$. Because $y$ represents a dependent function $y(x)$, whenever you differentiate a term containing $y$, the Chain Rule produces a factor of $\\frac{dy}{dx}$.',
        conceptualNote:
          'Why does differentiating $y$ produce $\\frac{dy}{dx}$? By the Chain Rule, $\\frac{d}{dx}[f(y)] = \\frac{df}{dy} \\cdot \\frac{dy}{dx}$.',
      },
      {
        stepNumber: 2,
        title: 'Apply the Chain Rule to y-Terms',
        ruleName: 'Chain Rule on Dependent Variable',
        expressionLatex: `${nodeToLatex(rawDeriv)} = 0`,
        explanation: `Result of term-by-term differentiation: terms involving $y$ have their derivatives multiplied by $\\frac{dy}{dx}$.`,
      },
      {
        stepNumber: 3,
        title: 'Collect Terms Containing dy/dx',
        ruleName: 'Algebraic Grouping',
        expressionLatex: `\\left(${nodeToLatex(denominator)}\\right) \\frac{dy}{dx} = ${nodeToLatex(numerator)}`,
        explanation: 'Move all terms without $\\frac{dy}{dx}$ to the right-hand side, and keep all terms with $\\frac{dy}{dx}$ on the left-hand side.',
      },
      {
        stepNumber: 4,
        title: 'Factor and Isolate dy/dx',
        ruleName: 'Isolate dy/dx',
        expressionLatex: `\\frac{dy}{dx} = \\frac{${nodeToLatex(numerator)}}{${nodeToLatex(denominator)}} = ${finalLatex}`,
        explanation: 'Divide both sides by the coefficient of $\\frac{dy}{dx}$ to obtain the explicit derivative in terms of $x$ and $y$.',
      },
    ];

    const whyImplicitRequired = `Why Implicit Differentiation?
The given curve $${eqDisplay}$ defines an implicit relationship where $y$ is not explicitly isolated as $y = f(x)$.
Solving explicitly for $y$ is often impossible or introduces multiple ambiguous square root branches (e.g. circles $x^2 + y^2 = r^2$).
Implicit differentiation enables finding the exact tangent slope $\\frac{dy}{dx}$ at any point $(x, y)$ directly using the Chain Rule.`;

    return {
      equationLatex: eqDisplay,
      derivativeDydx: finalDydx,
      simplifiedDerivativeLatex: finalLatex,
      steps,
      whyImplicitRequired,
    };
  }

  private static extractDydxComponents(node: MathNode): { dydxCoeff: MathNode; otherTerms: MathNode } {
    const flatTerms = node.type === 'add' ? node.terms : [node];
    const withDydx: MathNode[] = [];
    const withoutDydx: MathNode[] = [];

    for (const t of flatTerms) {
      if (ImplicitDifferentiator.hasDydx(t)) {
        withDydx.push(ImplicitDifferentiator.stripDydx(t));
      } else {
        withoutDydx.push(t);
      }
    }

    const dydxCoeff = withDydx.length === 0 ? ONE : add(...withDydx);
    const otherTerms = withoutDydx.length === 0 ? ZERO : add(...withoutDydx);

    return {
      dydxCoeff: simplify(dydxCoeff),
      otherTerms: simplify(otherTerms),
    };
  }

  private static hasDydx(node: MathNode): boolean {
    if (node.type === 'derivative_term' && node.target === 'y' && node.wrt === 'x') return true;
    if (node.type === 'multiply') return node.factors.some(ImplicitDifferentiator.hasDydx);
    if (node.type === 'add') return node.terms.some(ImplicitDifferentiator.hasDydx);
    if (node.type === 'negate') return ImplicitDifferentiator.hasDydx(node.arg);
    return false;
  }

  private static stripDydx(node: MathNode): MathNode {
    if (node.type === 'derivative_term') return ONE;
    if (node.type === 'negate') return negate(ImplicitDifferentiator.stripDydx(node.arg));
    if (node.type === 'multiply') {
      const remaining = node.factors.filter((f) => !ImplicitDifferentiator.hasDydx(f));
      return remaining.length === 1 ? remaining[0] : multiply(...remaining);
    }
    return ONE;
  }
}
