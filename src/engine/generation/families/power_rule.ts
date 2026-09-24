/**
 * Problem Families: Power Rule & Polynomials
 */

import { ProblemFamily, StandardHint } from '../types';
import { MathNode, constant, variable, add, multiply, power, nodeToLatex } from '../../math/ast';
import { Rational } from '../../math/rational';

function sampleInt(min: number, max: number, avoidZero: boolean = true): number {
  let val = 0;
  while (val === 0 && avoidZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export const PowerPolynomialFamily: ProblemFamily = {
  id: 'POWER_POLYNOMIAL',
  concept: 'Power Rule',
  name: 'Polynomial Function Derivative',
  description: 'Sum of power terms with integer coefficients and exponents: sum(a_i * x^n_i)',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [1, 3],
  requiredSkills: ['power rule', 'sum rule', 'constant multiple rule'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE', 'POWER_RULE_FORGOT_COEFF'],

  generate(difficultyLevel: number) {
    const degree = difficultyLevel === 1 ? 3 : difficultyLevel === 2 ? 4 : 5;
    const terms: MathNode[] = [];

    for (let d = degree; d >= 1; d--) {
      const coeff = sampleInt(-6, 7);
      if (coeff === 0) continue;
      if (d === 1) {
        terms.push(multiply(constant(coeff), variable('x')));
      } else {
        terms.push(multiply(constant(coeff), power(variable('x'), d)));
      }
    }
    const c = sampleInt(-9, 9);
    if (c !== 0) terms.push(constant(c));

    const rawExpression = add(...terms);
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'Apply the Power Rule term-by-term to each power of $x$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: 'Recall that the derivative of a constant term is 0, and $\\frac{d}{dx}[c x] = c$.',
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}[a x^n] = a \\cdot n x^{n-1}.',
      },
      {
        level: 4,
        category: 'Setup',
        text: 'Differentiate the highest power term first, then proceed to lower degree terms.',
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: 'Multiply each coefficient by its exponent and subtract 1 from each power.',
      },
    ];

    return {
      statement: {
        promptText: 'Find the derivative $\\frac{dy}{dx}$:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `POWER|POLY:deg=${degree}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 1,
        computational: 2 + (difficultyLevel > 2 ? 1 : 0),
        procedural: 2,
        reasoning: 1,
      },
      hints,
    };
  },
};

export const PowerFractionalNegativeFamily: ProblemFamily = {
  id: 'POWER_FRACTIONAL_NEGATIVE',
  concept: 'Power Rule',
  name: 'Fractional and Negative Exponents',
  description: 'Power rule involving negative powers (x^-n) and rational fractional powers (x^(p/q)).',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [3, 4],
  requiredSkills: ['fraction arithmetic', 'negative exponent rule', 'power rule'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    const isFractional = Math.random() > 0.5;
    let rawExpression: MathNode;
    let signature: string;

    if (isFractional) {
      const p = sampleInt(1, 3);
      const q = p === 1 ? sampleInt(2, 4) : 3;
      const coeff = sampleInt(2, 6);
      const exp = new Rational(p, q);
      rawExpression = multiply(constant(coeff), power(variable('x'), constant(exp)));
      signature = `POWER|EXP:FRAC=${p}/${q}`;
    } else {
      const n = sampleInt(2, 5);
      const coeff = sampleInt(2, 7);
      const exp = new Rational(-n, 1);
      rawExpression = multiply(constant(coeff), power(variable('x'), constant(exp)));
      signature = `POWER|EXP:NEG=-${n}`;
    }

    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The Power Rule applies to any real exponent $n$, including fractions and negative numbers.',
      },
      {
        level: 2,
        category: 'Direction',
        text: 'Formula: $\\frac{d}{dx}[a x^n] = a n x^{n-1}$.',
      },
      {
        level: 3,
        category: 'Formula',
        text: 'Subtract 1 from the exponent using exact common denominators: $n - 1$.',
      },
      {
        level: 4,
        category: 'Setup',
        text: 'Compute the new coefficient: $\\text{coeff} \\times n$.',
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: 'Combine the simplified coefficient with the new power $x^{n-1}$.',
      },
    ];

    return {
      statement: {
        promptText: 'Find $\\frac{dy}{dx}$:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: signature,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 3,
        procedural: 2,
        reasoning: 2,
      },
      hints,
    };
  },
};
