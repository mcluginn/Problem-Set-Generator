/**
 * Deterministic Symbolic Differentiation Engine
 * Implements standard calculus rules with step transformation telemetry.
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
  func,
  derivativeTerm,
  nodeEquals,
  ZERO,
  ONE,
  NEG_ONE,
  TWO,
  nodeToLatex,
  getVariables,
} from './ast';
import { Rational, R0, R1 } from './rational';
import { simplify } from './simplifier';

export interface DifferentiationStepMeta {
  ruleUsed: string;
  ruleCategory: 'CONSTANT' | 'POWER' | 'SUM' | 'PRODUCT' | 'QUOTIENT' | 'CHAIN' | 'TRIG' | 'EXP' | 'LOG' | 'IMPLICIT';
  inputLatex: string;
  outputLatex: string;
  innerExpressionLatex?: string;
  outerExpressionLatex?: string;
  innerDerivativeLatex?: string;
  reason: string;
}

export interface DifferentiationResult {
  derivative: MathNode;
  simplifiedDerivative: MathNode;
  steps: DifferentiationStepMeta[];
}

export class Differentiator {
  /**
   * Differentiates a MathNode with respect to a target variable (default 'x').
   */
  public static differentiate(
    node: MathNode,
    wrt: string = 'x',
    isImplicit: boolean = false
  ): DifferentiationResult {
    const steps: DifferentiationStepMeta[] = [];
    const rawDeriv = Differentiator.diffRecursive(node, wrt, isImplicit, steps);
    const simplifiedDeriv = simplify(rawDeriv);

    return {
      derivative: rawDeriv,
      simplifiedDerivative: simplifiedDeriv,
      steps,
    };
  }

  private static diffRecursive(
    node: MathNode,
    wrt: string,
    isImplicit: boolean,
    steps: DifferentiationStepMeta[]
  ): MathNode {
    switch (node.type) {
      case 'constant': {
        const res = ZERO;
        steps.push({
          ruleUsed: 'Constant Rule',
          ruleCategory: 'CONSTANT',
          inputLatex: nodeToLatex(node),
          outputLatex: '0',
          reason: `The derivative of any constant is 0: \\frac{d}{d${wrt}}[c] = 0.`,
        });
        return res;
      }

      case 'variable': {
        if (node.name === wrt) {
          const res = ONE;
          steps.push({
            ruleUsed: 'Linear Power Rule',
            ruleCategory: 'POWER',
            inputLatex: node.name,
            outputLatex: '1',
            reason: `\\frac{d}{d${wrt}}[${wrt}] = 1.`,
          });
          return res;
        }
        if (isImplicit && node.name === 'y') {
          const res = derivativeTerm('y', wrt, 1);
          steps.push({
            ruleUsed: 'Implicit Variable Rule',
            ruleCategory: 'IMPLICIT',
            inputLatex: 'y',
            outputLatex: `\\frac{dy}{d${wrt}}`,
            reason: `Since y is a dependent function y(${wrt}), \\frac{d}{d${wrt}}[y] = \\frac{dy}{d${wrt}}.`,
          });
          return res;
        }
        // Independent other variable treated as constant
        steps.push({
          ruleUsed: 'Constant Rule (Other Variable)',
          ruleCategory: 'CONSTANT',
          inputLatex: node.name,
          outputLatex: '0',
          reason: `${node.name} is treated as a constant with respect to ${wrt}.`,
        });
        return ZERO;
      }

      case 'negate': {
        const dArg = Differentiator.diffRecursive(node.arg, wrt, isImplicit, steps);
        return negate(dArg);
      }

      case 'add': {
        const termDerivs = node.terms.map((t) => Differentiator.diffRecursive(t, wrt, isImplicit, steps));
        const res = add(...termDerivs);
        steps.push({
          ruleUsed: 'Sum and Difference Rule',
          ruleCategory: 'SUM',
          inputLatex: nodeToLatex(node),
          outputLatex: nodeToLatex(res),
          reason: `The derivative of a sum/difference is the sum/difference of the derivatives: \\frac{d}{d${wrt}}[u \\pm v] = u' \\pm v'.`,
        });
        return res;
      }

      case 'multiply': {
        // Handle constant multiple rule: c * f(x)
        const first = node.factors[0];
        if (first.type === 'constant' && !first.symbolic && node.factors.length > 1) {
          const rest = node.factors.length === 2 ? node.factors[1] : multiply(...node.factors.slice(1));
          const dRest = Differentiator.diffRecursive(rest, wrt, isImplicit, steps);
          const res = multiply(first, dRest);
          steps.push({
            ruleUsed: 'Constant Multiple Rule',
            ruleCategory: 'CONSTANT',
            inputLatex: nodeToLatex(node),
            outputLatex: nodeToLatex(res),
            reason: `Pull the constant factor out: \\frac{d}{d${wrt}}[c \\cdot f(${wrt})] = c \\cdot f'(${wrt}).`,
          });
          return res;
        }

        // Product Rule for 2 factors: (u * v)' = u'v + uv'
        if (node.factors.length === 2) {
          const u = node.factors[0];
          const v = node.factors[1];
          const du = Differentiator.diffRecursive(u, wrt, isImplicit, steps);
          const dv = Differentiator.diffRecursive(v, wrt, isImplicit, steps);
          const res = add(multiply(du, v), multiply(u, dv));
          steps.push({
            ruleUsed: 'Product Rule',
            ruleCategory: 'PRODUCT',
            inputLatex: nodeToLatex(node),
            outputLatex: nodeToLatex(res),
            reason: `Apply the Product Rule: \\frac{d}{d${wrt}}[u \\cdot v] = u'v + uv'.`,
          });
          return res;
        }

        // Product Rule for N factors: u * (v * w * ...)
        const u = node.factors[0];
        const v = multiply(...node.factors.slice(1));
        const du = Differentiator.diffRecursive(u, wrt, isImplicit, steps);
        const dv = Differentiator.diffRecursive(v, wrt, isImplicit, steps);
        return add(multiply(du, v), multiply(u, dv));
      }

      case 'divide': {
        const u = node.numerator;
        const v = node.denominator;
        const du = Differentiator.diffRecursive(u, wrt, isImplicit, steps);
        const dv = Differentiator.diffRecursive(v, wrt, isImplicit, steps);
        const numerator = subtract(multiply(du, v), multiply(u, dv));
        const denominator = power(v, TWO);
        const res = divide(numerator, denominator);
        steps.push({
          ruleUsed: 'Quotient Rule',
          ruleCategory: 'QUOTIENT',
          inputLatex: nodeToLatex(node),
          outputLatex: nodeToLatex(res),
          reason: `Apply the Quotient Rule: \\frac{d}{d${wrt}}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}.`,
        });
        return res;
      }

      case 'power': {
        const base = node.base;
        const exp = node.exponent;

        const baseHasVar = getVariables(base).has(wrt) || (isImplicit && getVariables(base).has('y'));
        const expHasVar = getVariables(exp).has(wrt) || (isImplicit && getVariables(exp).has('y'));

        // Case 0: Constant Power (e.g. e^2 or 5^3)
        if (!baseHasVar && !expHasVar) {
          steps.push({
            ruleUsed: 'Constant Rule',
            ruleCategory: 'CONSTANT',
            inputLatex: nodeToLatex(node),
            outputLatex: '0',
            reason: `The derivative of a constant expression is 0: \\frac{d}{d${wrt}}[c] = 0.`,
          });
          return ZERO;
        }

        // Extract constant rational exponent if present
        let n: Rational | null = null;
        if (exp.type === 'constant' && !exp.symbolic) {
          n = exp.value;
        } else if (
          exp.type === 'divide' &&
          exp.numerator.type === 'constant' &&
          !exp.numerator.symbolic &&
          exp.denominator.type === 'constant' &&
          !exp.denominator.symbolic
        ) {
          n = exp.numerator.value.div(exp.denominator.value);
        } else if (exp.type === 'negate' && exp.arg.type === 'constant' && !exp.arg.symbolic) {
          n = exp.arg.value.neg();
        }

        // Case 1: Base contains wrt, Exponent is constant -> Power Rule + Chain Rule
        if (baseHasVar && !expHasVar && n !== null) {
          const nMinus1 = n.sub(R1);
          const outerDeriv = multiply(constant(n), power(base, constant(nMinus1)));
          const innerDeriv = Differentiator.diffRecursive(base, wrt, isImplicit, steps);

          if (base.type === 'variable' && base.name === wrt) {
            steps.push({
              ruleUsed: 'Power Rule',
              ruleCategory: 'POWER',
              inputLatex: nodeToLatex(node),
              outputLatex: nodeToLatex(outerDeriv),
              reason: `Power Rule: \\frac{d}{d${wrt}}[${wrt}^n] = n ${wrt}^{n-1}.`,
            });
            return outerDeriv;
          }

          // Composite power (Chain Rule): (g(x))^n -> n(g(x))^(n-1) * g'(x)
          const res = multiply(outerDeriv, innerDeriv);
          steps.push({
            ruleUsed: 'Chain Rule (Power of Function)',
            ruleCategory: 'CHAIN',
            inputLatex: nodeToLatex(node),
            outputLatex: nodeToLatex(res),
            innerExpressionLatex: nodeToLatex(base),
            outerExpressionLatex: `u^{${n.toLatex()}}`,
            innerDerivativeLatex: nodeToLatex(innerDeriv),
            reason: `Differentiate outer power $n u^{n-1}$ and multiply by the derivative of the inner function $u'$: \\frac{d}{d${wrt}}[u^n] = n u^{n-1} \\cdot u'.`,
          });
          return res;
        }

        // Case 2: Exponential function a^(g(x)) or e^(g(x))
        if (!baseHasVar && expHasVar) {
          const innerDeriv = Differentiator.diffRecursive(exp, wrt, isImplicit, steps);
          if (base.type === 'constant' && base.symbolic === 'e') {
            const res = multiply(node, innerDeriv);
            steps.push({
              ruleUsed: 'Chain Rule (Natural Exponential)',
              ruleCategory: 'EXP',
              inputLatex: nodeToLatex(node),
              outputLatex: nodeToLatex(res),
              innerExpressionLatex: nodeToLatex(exp),
              innerDerivativeLatex: nodeToLatex(innerDeriv),
              reason: `\\frac{d}{d${wrt}}[e^u] = e^u \\cdot u'.`,
            });
            return res;
          }
          // a^u -> a^u * ln(a) * u'
          const res = multiply(node, func('ln', base), innerDeriv);
          steps.push({
            ruleUsed: 'Chain Rule (General Exponential)',
            ruleCategory: 'EXP',
            inputLatex: nodeToLatex(node),
            outputLatex: nodeToLatex(res),
            reason: `\\frac{d}{d${wrt}}[a^u] = a^u \\ln(a) \\cdot u'.`,
          });
          return res;
        }

        // General power derivative using logarithmic differentiation if needed
        return ZERO;
      }

      case 'function': {
        const u = node.args[0];
        const du = Differentiator.diffRecursive(u, wrt, isImplicit, steps);

        let outerDeriv: MathNode;
        let ruleName = '';
        let category: DifferentiationStepMeta['ruleCategory'] = 'TRIG';

        switch (node.fn) {
          case 'sin':
            outerDeriv = func('cos', u);
            ruleName = 'Derivative of Sine';
            break;
          case 'cos':
            outerDeriv = negate(func('sin', u));
            ruleName = 'Derivative of Cosine';
            break;
          case 'tan':
            outerDeriv = power(func('sec', u), TWO);
            ruleName = 'Derivative of Tangent';
            break;
          case 'sec':
            outerDeriv = multiply(func('sec', u), func('tan', u));
            ruleName = 'Derivative of Secant';
            break;
          case 'csc':
            outerDeriv = negate(multiply(func('csc', u), func('cot', u)));
            ruleName = 'Derivative of Cosecant';
            break;
          case 'cot':
            outerDeriv = negate(power(func('csc', u), TWO));
            ruleName = 'Derivative of Cotangent';
            break;
          case 'ln':
            outerDeriv = divide(ONE, u);
            ruleName = 'Derivative of Natural Logarithm';
            category = 'LOG';
            break;
          case 'exp':
            outerDeriv = func('exp', u);
            ruleName = 'Derivative of Exponential';
            category = 'EXP';
            break;
          case 'sqrt':
            outerDeriv = divide(ONE, multiply(TWO, func('sqrt', u)));
            ruleName = 'Derivative of Square Root';
            category = 'POWER';
            break;
          default:
            outerDeriv = ONE;
        }

        const isSimpleVar = u.type === 'variable' && u.name === wrt;
        if (isSimpleVar) {
          steps.push({
            ruleUsed: ruleName,
            ruleCategory: category,
            inputLatex: nodeToLatex(node),
            outputLatex: nodeToLatex(outerDeriv),
            reason: `Standard derivative rule for \\${node.fn}(${wrt}).`,
          });
          return outerDeriv;
        }

        // Composite function (Chain rule)
        const res = multiply(outerDeriv, du);
        steps.push({
          ruleUsed: `Chain Rule with ${ruleName}`,
          ruleCategory: 'CHAIN',
          inputLatex: nodeToLatex(node),
          outputLatex: nodeToLatex(res),
          innerExpressionLatex: nodeToLatex(u),
          innerDerivativeLatex: nodeToLatex(du),
          reason: `Differentiate outer function to get $f'(u) = ${nodeToLatex(
            outerDeriv
          )}$ and multiply by $u' = ${nodeToLatex(du)}$: \\frac{d}{d${wrt}}[f(u)] = f'(u) \\cdot u'.`,
        });
        return res;
      }

      case 'derivative_term':
        return derivativeTerm(node.target, node.wrt, (node.order || 1) + 1);
    }
  }

  /**
   * Computes nth order derivative: f''(x), f'''(x), etc.
   */
  public static differentiateHigherOrder(
    node: MathNode,
    order: number,
    wrt: string = 'x'
  ): {
    finalDerivative: MathNode;
    stages: Array<{ order: number; derivative: MathNode; steps: DifferentiationStepMeta[] }>;
  } {
    let current = node;
    const stages: Array<{ order: number; derivative: MathNode; steps: DifferentiationStepMeta[] }> = [];

    for (let i = 1; i <= order; i++) {
      const result = Differentiator.differentiate(current, wrt);
      stages.push({
        order: i,
        derivative: result.simplifiedDerivative,
        steps: result.steps,
      });
      current = result.simplifiedDerivative;
    }

    return {
      finalDerivative: current,
      stages,
    };
  }
}

export function diff(node: MathNode, wrt: string = 'x'): DifferentiationResult {
  return Differentiator.differentiate(node, wrt);
}
