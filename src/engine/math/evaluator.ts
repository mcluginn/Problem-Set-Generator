/**
 * Domain-Safe Numerical Expression Evaluator
 * Safely evaluates ASTs at concrete numerical values with singularity and domain detection.
 */

import { MathNode } from './ast';

export interface EvaluationDomainStatus {
  isValid: boolean;
  singularityDetected: boolean;
  reason?: string;
}

export class NumericalEvaluator {
  /**
   * Safely evaluates a MathNode for given variable values (e.g. { x: 1.5, y: 2.0 }).
   * Returns NaN if point is outside domain or causes division by zero.
   */
  public static evaluate(
    node: MathNode,
    variables: Record<string, number>
  ): { value: number; domainStatus: EvaluationDomainStatus } {
    try {
      const val = NumericalEvaluator.evalNode(node, variables);
      if (!Number.isFinite(val) || Number.isNaN(val)) {
        return {
          value: NaN,
          domainStatus: {
            isValid: false,
            singularityDetected: true,
            reason: 'Evaluated to non-finite or NaN value',
          },
        };
      }
      return {
        value: val,
        domainStatus: { isValid: true, singularityDetected: false },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation error';
      return {
        value: NaN,
        domainStatus: {
          isValid: false,
          singularityDetected: true,
          reason: msg,
        },
      };
    }
  }

  private static evalNode(node: MathNode, vars: Record<string, number>): number {
    switch (node.type) {
      case 'constant':
        if (node.symbolic === 'pi') return Math.PI;
        if (node.symbolic === 'e') return Math.E;
        return node.value.toNumber();

      case 'variable': {
        const val = vars[node.name];
        if (val === undefined) {
          throw new Error(`Unassigned variable: ${node.name}`);
        }
        return val;
      }

      case 'derivative_term':
        throw new Error('Cannot numerically evaluate unresolved derivative term');

      case 'negate':
        return -NumericalEvaluator.evalNode(node.arg, vars);

      case 'add': {
        let sum = 0;
        for (const t of node.terms) {
          sum += NumericalEvaluator.evalNode(t, vars);
        }
        return sum;
      }

      case 'multiply': {
        let prod = 1;
        for (const f of node.factors) {
          prod *= NumericalEvaluator.evalNode(f, vars);
        }
        return prod;
      }

      case 'divide': {
        const num = NumericalEvaluator.evalNode(node.numerator, vars);
        const den = NumericalEvaluator.evalNode(node.denominator, vars);
        if (Math.abs(den) < 1e-12) {
          throw new Error('Division by near-zero singularity');
        }
        return num / den;
      }

      case 'power': {
        const base = NumericalEvaluator.evalNode(node.base, vars);
        const exp = NumericalEvaluator.evalNode(node.exponent, vars);

        if (base < 0 && !Number.isInteger(exp)) {
          throw new Error('Negative base with non-integer fractional power (complex domain)');
        }
        if (Math.abs(base) < 1e-12 && exp < 0) {
          throw new Error('Zero base with negative exponent singularity');
        }
        return Math.pow(base, exp);
      }

      case 'function': {
        const arg = NumericalEvaluator.evalNode(node.args[0], vars);
        switch (node.fn) {
          case 'sin':
            return Math.sin(arg);
          case 'cos':
            return Math.cos(arg);
          case 'tan': {
            // Check for odd multiples of pi/2
            const cosVal = Math.cos(arg);
            if (Math.abs(cosVal) < 1e-9) throw new Error('Tangent pole singularity');
            return Math.tan(arg);
          }
          case 'sec': {
            const cosVal = Math.cos(arg);
            if (Math.abs(cosVal) < 1e-9) throw new Error('Secant pole singularity');
            return 1 / cosVal;
          }
          case 'csc': {
            const sinVal = Math.sin(arg);
            if (Math.abs(sinVal) < 1e-9) throw new Error('Cosecant pole singularity');
            return 1 / sinVal;
          }
          case 'cot': {
            const sinVal = Math.sin(arg);
            if (Math.abs(sinVal) < 1e-9) throw new Error('Cotangent pole singularity');
            return Math.cos(arg) / sinVal;
          }
          case 'ln':
          case 'log': {
            if (arg <= 1e-12) throw new Error('Logarithm non-positive domain error');
            return Math.log(arg);
          }
          case 'exp':
            return Math.exp(arg);
          case 'sqrt': {
            if (arg < 0) throw new Error('Square root negative domain error');
            return Math.sqrt(arg);
          }
          case 'abs':
            return Math.abs(arg);
        }
      }
    }
  }
}
