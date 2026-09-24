/**
 * Problem Families: Sum Rule & Difference Rule
 */

import { ProblemFamily, StandardHint } from '../types';
import { MathNode, constant, variable, multiply, add, subtract, power, nodeToLatex } from '../../math/ast';

function sampleInt(min: number, max: number, avoidZero: boolean = true): number {
  let val = 0;
  while (val === 0 && avoidZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export const SumRuleFamily: ProblemFamily = {
  id: 'SUM_POLY',
  concept: 'Sum Rule',
  name: 'Sum of Polynomial Terms',
  description: 'Differentiating a sum of independent terms: d/dx[u + v] = u\' + v\'.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [1, 3],
  requiredSkills: ['term-by-term differentiation', 'power rule', 'constant multiple rule'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    const a = sampleInt(2, 6);
    const b = sampleInt(2, 8);
    const n = sampleInt(3, 5);
    const m = sampleInt(1, 2);

    // f(x) = a x^n + b x^m
    const rawExpression = add(
      multiply(constant(a), power(variable('x'), n)),
      m === 1 ? multiply(constant(b), variable('x')) : multiply(constant(b), power(variable('x'), m))
    );
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The function is a sum of two terms: $f(x) = u(x) + v(x)$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Differentiate each term independently: $\\frac{d}{dx}[${a}x^{${n}}] + \\frac{d}{dx}[${b}x^{${m}}]$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}[u + v] = \\frac{du}{dx} + \\frac{dv}{dx}.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `$\\frac{d}{dx}[${a}x^{${n}}] = ${a * n}x^{${n - 1}}$ and $\\frac{d}{dx}[${b}x^{${m}}] = ${
          m === 1 ? b : `${b * m}x^{${m - 1}}`
        }$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Add the derivatives together: $${a * n}x^{${n - 1}} + ${m === 1 ? b : `${b * m}x^{${m - 1}}`}$.`,
      },
    ];

    return {
      statement: {
        promptText: 'Differentiate the polynomial sum $\\frac{dy}{dx}$ for:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `SUM|POLY|deg=${n}`,
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

export const DifferenceRuleFamily: ProblemFamily = {
  id: 'DIFFERENCE_POLY',
  concept: 'Difference Rule',
  name: 'Difference of Functions',
  description: 'Differentiating a difference of terms: d/dx[u - v] = u\' - v\'.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [1, 3],
  requiredSkills: ['difference rule', 'sign preservation', 'power rule'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    const a = sampleInt(2, 6);
    const b = sampleInt(2, 8);
    const n = sampleInt(3, 5);

    // f(x) = a x^n - b x
    const rawExpression = subtract(
      multiply(constant(a), power(variable('x'), n)),
      multiply(constant(b), variable('x'))
    );
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The function is a difference of two terms: $f(x) = u(x) - v(x)$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Differentiate each term and preserve the minus sign: $\\frac{d}{dx}[${a}x^{${n}}] - \\frac{d}{dx}[${b}x]$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}[u - v] = \\frac{du}{dx} - \\frac{dv}{dx}.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `$\\frac{d}{dx}[${a}x^{${n}}] = ${a * n}x^{${n - 1}}$ and $\\frac{d}{dx}[${b}x] = ${b}$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Combine terms: $${a * n}x^{${n - 1}} - ${b}$.`,
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
      structureSignature: `DIFF|POLY|deg=${n}`,
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
