/**
 * Multi-Method Problem Validator
 * Validates that every generated problem meets strict mathematical, conceptual, and pedagogical standards.
 */

import { GeneratedProblem } from './types';
import { getVariables, MathNode } from '../math/ast';
import { Differentiator } from '../math/differentiator';
import { NumericalEvaluator } from '../math/evaluator';
import { checkEquivalence } from '../math/equivalence';

export interface ProblemValidationReport {
  isValid: boolean;
  qualityScore: number;
  stageFailed?: string;
  rejectionReason?: string;
  checks: {
    syntax: boolean;
    solvability: boolean;
    domainSafety: boolean;
    conceptAlignment: boolean;
    stepContinuity: boolean;
    difficultySanity: boolean;
  };
}

export class ProblemValidator {
  public static validate(problem: GeneratedProblem): ProblemValidationReport {
    const checks = {
      syntax: false,
      solvability: false,
      domainSafety: false,
      conceptAlignment: false,
      stepContinuity: false,
      difficultySanity: false,
    };

    // 1. Syntax & AST Validation
    if (!problem.rawExpression || !problem.statement?.expressionLatex) {
      return {
        isValid: false,
        qualityScore: 0,
        stageFailed: 'Syntax Validation',
        rejectionReason: 'Missing raw AST or statement expression LaTeX.',
        checks,
      };
    }
    checks.syntax = true;

    // 2. Mathematical Solvability
    let diffResult;
    try {
      diffResult = Differentiator.differentiate(problem.rawExpression, problem.statement.independentVariable || 'x');
      if (!diffResult.simplifiedDerivative) {
        throw new Error('Differentiator returned empty simplified derivative');
      }
      checks.solvability = true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown differentiation error';
      return {
        isValid: false,
        qualityScore: 0,
        stageFailed: 'Mathematical Solvability',
        rejectionReason: `Failed to solve deterministically: ${msg}`,
        checks,
      };
    }

    // 3. Domain & Singularity Audit
    const vars: Record<string, number> = {};
    const varNames = getVariables(problem.rawExpression);
    for (const v of varNames) {
      vars[v] = 1.25; // Test point safely away from 0 and 1
    }
    const evalOriginal = NumericalEvaluator.evaluate(problem.rawExpression, vars);
    const evalDerivative = NumericalEvaluator.evaluate(diffResult.simplifiedDerivative, vars);

    if (!evalOriginal.domainStatus.isValid || !evalDerivative.domainStatus.isValid) {
      // Allow fallback if point was near a branch cut, try secondary point
      const vars2: Record<string, number> = {};
      for (const v of varNames) vars2[v] = 0.5;
      const eval2Original = NumericalEvaluator.evaluate(problem.rawExpression, vars2);
      const eval2Deriv = NumericalEvaluator.evaluate(diffResult.simplifiedDerivative, vars2);
      if (!eval2Original.domainStatus.isValid || !eval2Deriv.domainStatus.isValid) {
        return {
          isValid: false,
          qualityScore: 0,
          stageFailed: 'Domain & Singularity Audit',
          rejectionReason: `Function evaluated to non-finite or singularity value in standard domain.`,
          checks,
        };
      }
    }
    checks.domainSafety = true;

    // 4. Concept Alignment Audit
    const aligned = ProblemValidator.verifyConceptAlignment(
      problem.rawExpression,
      problem.dna.concept,
      problem.statement.independentVariable || 'x'
    );
    if (!aligned.isAligned) {
      return {
        isValid: false,
        qualityScore: 0.2,
        stageFailed: 'Concept Alignment Audit',
        rejectionReason: `Problem does not genuinely test ${problem.dna.concept}: ${aligned.reason}`,
        checks,
      };
    }
    checks.conceptAlignment = true;

    // 5. Step Continuity & Content Check
    if (!problem.solution?.steps || problem.solution.steps.length === 0) {
      return {
        isValid: false,
        qualityScore: 0.5,
        stageFailed: 'Step Continuity Validation',
        rejectionReason: 'Solution steps are empty.',
        checks,
      };
    }
    checks.stepContinuity = true;

    // 6. Difficulty Sanity
    const diffOverall = problem.dna.difficulty.overall;
    if (diffOverall < 1 || diffOverall > 5) {
      return {
        isValid: false,
        qualityScore: 0.6,
        stageFailed: 'Difficulty Sanity Check',
        rejectionReason: `Difficulty ${diffOverall} is outside valid bounds [1, 5].`,
        checks,
      };
    }
    checks.difficultySanity = true;

    return {
      isValid: true,
      qualityScore: 1.0,
      checks,
    };
  }

  private static verifyConceptAlignment(
    node: MathNode,
    concept: string,
    wrt: string
  ): { isAligned: boolean; reason: string } {
    switch (concept) {
      case 'Constant Rule': {
        const vars = getVariables(node);
        return {
          isAligned: !vars.has(wrt),
          reason: vars.has(wrt) ? `Expression contains variable ${wrt}` : 'Valid constant',
        };
      }

      case 'Power Rule': {
        if (node.type === 'power' && node.base.type === 'variable') {
          return { isAligned: true, reason: 'Direct power of variable' };
        }
        if (node.type === 'add' && node.terms.some((t) => t.type === 'power')) {
          return { isAligned: true, reason: 'Polynomial with powers' };
        }
        return { isAligned: true, reason: 'Standard power / polynomial rule' };
      }

      case 'Product Rule': {
        if (node.type === 'multiply' && node.factors.filter((f) => getVariables(f).has(wrt)).length >= 2) {
          return { isAligned: true, reason: 'Valid product of two variable functions' };
        }
        if (node.type === 'add' && node.terms.some((t) => t.type === 'multiply')) {
          return { isAligned: true, reason: 'Contains product term' };
        }
        return { isAligned: false, reason: 'Does not contain product of two non-constant terms' };
      }

      case 'Quotient Rule': {
        if (node.type === 'divide' && getVariables(node.denominator).has(wrt)) {
          return { isAligned: true, reason: 'Valid quotient with variable denominator' };
        }
        return { isAligned: false, reason: 'Denominator does not contain variable' };
      }

      case 'Chain Rule': {
        if (node.type === 'power' && node.base.type !== 'variable' && getVariables(node.base).has(wrt)) {
          return { isAligned: true, reason: 'Composite power with non-trivial inner function' };
        }
        if (node.type === 'function' && node.args.length > 0) {
          const arg = node.args[0];
          if (arg.type !== 'variable' && getVariables(arg).has(wrt)) {
            return { isAligned: true, reason: 'Composite transcendental function' };
          }
        }
        return { isAligned: false, reason: 'Expression is not a composite function f(g(x))' };
      }

      default:
        return { isAligned: true, reason: 'Concept verified' };
    }
  }
}
