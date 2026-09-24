/**
 * Problem Families: Constant Rule & Constant Multiple Rule
 */

import { ProblemFamily, StandardHint } from '../types';
import { MathNode, constant, variable, multiply, power, func, nodeToLatex, ZERO, PI, EULER } from '../../math/ast';

function sampleInt(min: number, max: number, avoidZero: boolean = true): number {
  let val = 0;
  while (val === 0 && avoidZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export const ConstantDirectFamily: ProblemFamily = {
  id: 'CONSTANT_DIRECT',
  concept: 'Constant Rule',
  name: 'Constant Function Differentiation',
  description: 'Differentiating pure constant values (numbers, pi, e, symbolic constants) with respect to x.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [1, 2],
  requiredSkills: ['constant recognition', 'derivative of constant is zero'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    let rawExpression: MathNode;
    let signature = '';

    if (difficultyLevel === 1) {
      const c = sampleInt(-50, 50);
      rawExpression = constant(c);
      signature = `CONST|VAL=${c}`;
    } else {
      // Symbolic constant trick (e.g. pi^2 or e^3 or sqrt(7))
      const type = Math.random() > 0.5 ? 'pi' : 'euler';
      if (type === 'pi') {
        rawExpression = power(PI, constant(2));
        signature = `CONST|SYMBOLIC=pi^2`;
      } else {
        rawExpression = power(EULER, constant(3));
        signature = `CONST|SYMBOLIC=e^3`;
      }
    }

    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'Identify whether the variable $x$ appears in the expression.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Notice that $y = ${latex}$ contains no variable $x$; it is entirely constant.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: 'The derivative of any constant $c$ is zero: $\\frac{d}{dx}[c] = 0$.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `$\\frac{dy}{dx} = \\frac{d}{dx}[${latex}] = 0$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: 'The derivative is $0$.',
      },
    ];

    return {
      statement: {
        promptText: 'Find the derivative $\\frac{dy}{dx}$ for:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: signature,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 2,
        computational: 1,
        procedural: 1,
        reasoning: 2,
      },
      hints,
    };
  },
};

export const ConstantMultipleFamily: ProblemFamily = {
  id: 'CONSTANT_MULTIPLE',
  concept: 'Constant Multiple Rule',
  name: 'Constant Multiple Scaling',
  description: 'Differentiating c * f(x) by factoring out the constant multiplier.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [1, 3],
  requiredSkills: ['constant multiple rule', 'power/trig rule'],
  targetedMisconceptions: ['POWER_RULE_FORGOT_COEFF'],

  generate(difficultyLevel: number) {
    const c = sampleInt(2, 9);
    const n = sampleInt(2, 5);

    // f(x) = c * x^n
    const rawExpression = multiply(constant(c), power(variable('x'), n));
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The expression is of the form $c \\cdot f(x)$, where $c = ' + c + '$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Factor out the constant $${c}$ and differentiate $x^{${n}}$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}[c \\cdot f(x)] = c \\cdot f\'(x).',
      },
      {
        level: 4,
        category: 'Setup',
        text: `\\frac{dy}{dx} = ${c} \\cdot \\frac{d}{dx}[x^{${n}}] = ${c} \\cdot (${n}x^{${n - 1}}).`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Multiply constants: $${c * n}x^{${n - 1}}$.`,
      },
    ];

    return {
      statement: {
        promptText: 'Find $\\frac{dy}{dx}$ for:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `CONST_MUL|c=${c}|n=${n}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 1,
        computational: 2,
        procedural: 2,
        reasoning: 1,
      },
      hints,
    };
  },
};
