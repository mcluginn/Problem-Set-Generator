/**
 * Problem Families: Quotient Rule
 */

import { ProblemFamily, StandardHint } from '../types';
import { MathNode, constant, variable, divide, add, power, func, nodeToLatex, multiply } from '../../math/ast';

function sampleInt(min: number, max: number, avoidZero: boolean = true): number {
  let val = 0;
  while (val === 0 && avoidZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export const QuotientPolyPolyFamily: ProblemFamily = {
  id: 'QUOTIENT_POLY_POLY',
  concept: 'Quotient Rule',
  name: 'Rational Function of Polynomials',
  description: 'Differentiation of (ax + b) / (x^2 + c) or (x^2 - a) / (x^2 + b).',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['quotient rule formula', 'polynomial algebra', 'derivative calculation'],
  targetedMisconceptions: ['QUOTIENT_RULE_SIGN_FLIP', 'QUOTIENT_RULE_NO_SQUARE', 'QUOTIENT_RULE_REVERSED_NUMERATOR'],

  generate(difficultyLevel: number) {
    const a = sampleInt(2, 5);
    const b = sampleInt(1, 5);
    const c = sampleInt(2, 7);

    const numerator = add(multiply(constant(a), variable('x')), constant(b));
    const denominator = add(power(variable('x'), 2), constant(c));

    const rawExpression = divide(numerator, denominator);
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The expression is a fraction with variable terms in both numerator and denominator.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Let $u = ${nodeToLatex(numerator)}$ and $v = ${nodeToLatex(denominator)}$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: 'Use the Quotient Rule: $\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}.$',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Compute $u\' = ${a}$ and $v\' = 2x$. The denominator squared is $(${nodeToLatex(denominator)})^2$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Substitute into numerator: $(${a})(${nodeToLatex(denominator)}) - (${nodeToLatex(numerator)})(2x)$ and simplify.`,
      },
    ];

    return {
      statement: {
        promptText: 'Find $\\frac{dy}{dx}$ using the Quotient Rule:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `QUOTIENT|NUM:POLY:deg=1|DEN:POLY:deg=2`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 3,
        procedural: 3,
        reasoning: 2,
      },
      hints,
    };
  },
};

export const QuotientTrigPolyFamily: ProblemFamily = {
  id: 'QUOTIENT_TRIG_POLY',
  concept: 'Quotient Rule',
  name: 'Trigonometric Function Divided by Polynomial',
  description: 'Differentiation of sin(x) / (x^2 + a).',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [3, 4],
  requiredSkills: ['quotient rule', 'trig derivatives'],
  targetedMisconceptions: ['QUOTIENT_RULE_SIGN_FLIP', 'QUOTIENT_RULE_NO_SQUARE'],

  generate(difficultyLevel: number) {
    const c = sampleInt(1, 5);
    const trigFn = Math.random() > 0.5 ? 'sin' : 'cos';

    const numerator = func(trigFn as any, variable('x'));
    const denominator = add(power(variable('x'), 2), constant(c));

    const rawExpression = divide(numerator, denominator);
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'This is a quotient of a trigonometric numerator and quadratic denominator.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Numerator $u = \\${trigFn}(x)$, Denominator $v = ${nodeToLatex(denominator)}$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Remember that $\\frac{d}{dx}[\\${trigFn}(x)] = ${trigFn === 'sin' ? '\\cos(x)' : '-\\sin(x)'}$ and $v\' = 2x$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Assemble the Quotient Rule fraction over $(${nodeToLatex(denominator)})^2$.`,
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
      structureSignature: `QUOTIENT|NUM:TRIG:${trigFn.toUpperCase()}|DEN:POLY:deg=2`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 3,
        procedural: 3,
        reasoning: 3,
      },
      hints,
    };
  },
};
