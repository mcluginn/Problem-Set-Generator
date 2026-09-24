/**
 * Deterministic Step-by-Step Solution & Conceptual Explanation Generator
 * Generates verified pedagogical steps without reliance on external AI.
 */

import { MathNode, nodeToLatex } from './ast';
import { Differentiator, DifferentiationStepMeta } from './differentiator';
import { simplify } from './simplifier';

export interface SolutionStep {
  stepNumber: number;
  title: string;
  ruleName: string;
  expressionLatex: string;
  explanation: string;
  subSteps?: SolutionStep[];
  conceptualNote?: string;
}

export interface CompleteSolution {
  originalExpressionLatex: string;
  canonicalAnswerLatex: string;
  canonicalAnswerRaw: string;
  steps: SolutionStep[];
  whyMethodRequired: string;
}

export class StepGenerator {
  /**
   * Generates step-by-step solution from mathematical expression and differentiation metadata.
   */
  public static generateSolution(
    expression: MathNode,
    concept: string,
    targetVar: string = 'x'
  ): CompleteSolution {
    const diffResult = Differentiator.differentiate(expression, targetVar);
    const originalLatex = nodeToLatex(expression);
    const canonicalLatex = nodeToLatex(diffResult.simplifiedDerivative);

    const steps: SolutionStep[] = [];
    let stepCount = 1;

    // Build structured steps from differentiation metadata
    for (const meta of diffResult.steps) {
      if (meta.ruleCategory === 'CHAIN') {
        steps.push({
          stepNumber: stepCount++,
          title: 'Identify Inner and Outer Functions',
          ruleName: meta.ruleUsed,
          expressionLatex: `u = ${meta.innerExpressionLatex || 'g(x)'},\\quad f(u) = ${meta.outerExpressionLatex || 'f(u)'}`,
          explanation: `Notice that the expression is a composite function $f(g(${targetVar}))$. Set the inside expression as $u = ${meta.innerExpressionLatex || 'g(x)'}$.`,
        });

        if (meta.innerDerivativeLatex) {
          steps.push({
            stepNumber: stepCount++,
            title: 'Differentiate the Inner Function',
            ruleName: 'Inner Derivative',
            expressionLatex: `\\frac{du}{d${targetVar}} = ${meta.innerDerivativeLatex}`,
            explanation: `Compute the derivative of the inside function $u(${targetVar})$ with respect to $${targetVar}$.`,
          });
        }

        steps.push({
          stepNumber: stepCount++,
          title: 'Apply the Chain Rule Formula',
          ruleName: meta.ruleUsed,
          expressionLatex: `\\frac{dy}{d${targetVar}} = \\frac{df}{du} \\cdot \\frac{du}{d${targetVar}} = ${meta.outputLatex}`,
          explanation: meta.reason,
        });
      } else if (meta.ruleCategory === 'PRODUCT') {
        steps.push({
          stepNumber: stepCount++,
          title: 'Apply the Product Rule',
          ruleName: meta.ruleUsed,
          expressionLatex: `\\frac{d}{d${targetVar}}[u \\cdot v] = u'v + uv' = ${meta.outputLatex}`,
          explanation: `Differentiate the first factor times the second plus the first factor times the derivative of the second.`,
        });
      } else if (meta.ruleCategory === 'QUOTIENT') {
        steps.push({
          stepNumber: stepCount++,
          title: 'Apply the Quotient Rule',
          ruleName: meta.ruleUsed,
          expressionLatex: `\\frac{d}{d${targetVar}}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2} = ${meta.outputLatex}`,
          explanation: `Compute the derivative of the numerator times denominator minus numerator times derivative of denominator, all divided by denominator squared.`,
        });
      } else {
        steps.push({
          stepNumber: stepCount++,
          title: `Apply ${meta.ruleUsed}`,
          ruleName: meta.ruleUsed,
          expressionLatex: meta.outputLatex,
          explanation: meta.reason,
        });
      }
    }

    // Final simplification step if raw output differs from canonical form
    const rawLatex = nodeToLatex(diffResult.derivative);
    if (rawLatex !== canonicalLatex) {
      steps.push({
        stepNumber: stepCount++,
        title: 'Simplify and Factor the Derivative',
        ruleName: 'Algebraic Simplification',
        expressionLatex: `\\frac{dy}{d${targetVar}} = ${canonicalLatex}`,
        explanation: 'Combine like terms and factor common constants to produce the final canonical form.',
      });
    }

    const whyMethodRequired = StepGenerator.generateWhyExplanation(concept, expression, targetVar);

    return {
      originalExpressionLatex: originalLatex,
      canonicalAnswerLatex: canonicalLatex,
      canonicalAnswerRaw: nodeToLatex(diffResult.simplifiedDerivative),
      steps,
      whyMethodRequired,
    };
  }

  /**
   * Explains conceptually why the specific calculus method is necessary using structured Markdown & KaTeX.
   */
  private static generateWhyExplanation(concept: string, node: MathNode, targetVar: string): string {
    switch (concept) {
      case 'Chain Rule':
        return `### Why Chain Rule?

The mathematical expression is a **composite function** $f(g(${targetVar}))$, where an inner expression is nested inside an outer operation.

Ordinary power or trigonometric rules only apply directly when the argument is a single variable $${targetVar}$.

By the Chain Rule of calculus, any rate of change in the outer function must be multiplied by how rapidly the inner function itself changes:
$$
\\frac{dy}{d${targetVar}} = \\frac{df}{du} \\cdot \\frac{du}{d${targetVar}}
$$`;

      case 'Product Rule':
        return `### Why the Product Rule is Required

The expression is the multiplication of two non-constant variable functions $u(${targetVar}) \\cdot v(${targetVar})$.

Differentiating each factor separately and multiplying them ($(u' \\cdot v')$) is a classic misconception that violates the Leibniz product law.

The total rate of change accounts for simultaneous growth across both factors:
$$
\\frac{d}{d${targetVar}}[u \\cdot v] = u'v + uv'
$$`;

      case 'Quotient Rule':
        return `### Why the Quotient Rule is Required

The expression is a ratio of two variable functions $\\frac{u(${targetVar})}{v(${targetVar})}$.

As the independent variable changes, both the numerator and denominator change simultaneously.

The Quotient Rule accounts for the inverse rate of growth in the denominator:
$$
\\frac{d}{d${targetVar}}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}
$$`;

      case 'Constant Rule':
        return `### Why the Constant Rule is Required

A constant value does not change as $${targetVar}$ varies (its rate of change is zero).

Therefore, the derivative of any constant number is identically zero:
$$
\\frac{d}{d${targetVar}}[c] = 0
$$`;

      case 'Constant Multiple Rule':
        return `### Why the Constant Multiple Rule is Required

Multiplying a function by a constant factor $c$ scales its graph and slope vertically by $c$.

The derivative scales proportionally:
$$
\\frac{d}{d${targetVar}}[c \\cdot f(${targetVar})] = c \\cdot f'(${targetVar})
$$`;

      case 'Sum Rule':
        return `### Why the Sum Rule is Required

Differentiation is a linear operator. The instantaneous rate of change of a sum $u(${targetVar}) + v(${targetVar})$ equals the sum of the individual rates of change:
$$
(u + v)' = u' + v'
$$`;

      case 'Difference Rule':
        return `### Why the Difference Rule is Required

The rate of change of a difference $u(${targetVar}) - v(${targetVar})$ is the difference of their individual rates:
$$
(u - v)' = u' - v'
$$`;

      case 'Trigonometric Derivatives':
        return `### Why Trigonometric Derivative Rules are Required

Trigonometric functions model circular and periodic oscillatory behavior.

The rate of change of sine, cosine, and tangent maps directly to their geometric derivatives:
$$
\\frac{d}{dx}[\\sin x] = \\cos x, \\quad \\frac{d}{dx}[\\cos x] = -\\sin x
$$`;

      case 'Exponential Derivatives':
        return `### Why Exponential Derivative Rules are Required

Exponential functions grow at a rate directly proportional to their current value.

For the natural base $e$, the constant of proportionality is 1:
$$
\\frac{d}{dx}[e^x] = e^x
$$`;

      case 'Logarithmic Derivatives':
        return `### Why Logarithmic Derivative Rules are Required

Logarithms are the inverses of exponential functions.

By inverse function differentiation:
$$
\\frac{d}{dx}[\\ln x] = \\frac{1}{x}
$$`;

      case 'Higher-Order Derivatives':
        return `### Why Higher-Order Derivatives are Required

Higher-order derivatives measure rates of change of rates of change.

For instance, the second derivative $f''(${targetVar})$ measures the concavity and curvature of a function, corresponding to acceleration in physical kinematics:
$$
a(t) = s''(t)
$$`;

      case 'Basic Applications of Derivatives':
        return `### Why Derivative Applications are Required

The derivative $\\frac{dy}{dx}$ provides the exact geometric slope of the tangent line to the curve at any point, and represents physical rates such as velocity:
$$
v(t) = \\frac{ds}{dt}
$$`;

      default:
        return `This problem tests the fundamental definition and theorems of differential calculus for **${concept}**.`;
    }
  }
}
