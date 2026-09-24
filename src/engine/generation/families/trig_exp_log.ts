/**
 * Problem Families: Trigonometric, Exponential, and Logarithmic Derivatives
 */

import { ProblemFamily, StandardHint } from '../types';
import { MathNode, constant, variable, multiply, add, power, func, nodeToLatex, divide, EULER } from '../../math/ast';

function sampleInt(min: number, max: number, avoidZero: boolean = true): number {
  let val = 0;
  while (val === 0 && avoidZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export const TrigStandardFamily: ProblemFamily = {
  id: 'TRIG_STANDARD',
  concept: 'Trigonometric Derivatives',
  name: 'Standard Trigonometric Derivatives',
  description: 'Differentiation of linear combinations of sin(x), cos(x), tan(x), sec(x), csc(x), cot(x).',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [1, 3],
  requiredSkills: ['trig derivative rules', 'constant multiple rule', 'sum rule'],
  targetedMisconceptions: ['TRIG_DERIVATIVE_SIGN_ERROR'],

  generate(difficultyLevel: number) {
    const fns = ['sin', 'cos', 'tan', 'sec', 'csc', 'cot'];
    const fn1 = fns[sampleInt(0, 2)];
    const fn2 = fns[sampleInt(3, 5)];
    const c1 = sampleInt(2, 6);
    const c2 = sampleInt(-5, 5);

    const term1 = multiply(constant(c1), func(fn1 as any, variable('x')));
    const term2 = multiply(constant(c2), func(fn2 as any, variable('x')));
    const rawExpression = add(term1, term2);
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'Apply trigonometric derivative rules term by term.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Recall that the derivative of $\\${fn1}(x)$ is $\\frac{d}{dx}[\\${fn1}(x)]$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: 'Remember: functions starting with "co-" (cos, cot, csc) always produce a negative sign in their derivative!',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Differentiate $${c1}\\${fn1}(x)$ and $${c2}\\${fn2}(x)$ separately.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: 'Combine the resulting terms with proper signs.',
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
      structureSignature: `TRIG|FN1:${fn1.toUpperCase()}|FN2:${fn2.toUpperCase()}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 2,
        computational: 2,
        procedural: 2,
        reasoning: 2,
      },
      hints,
    };
  },
};

export const ExpStandardFamily: ProblemFamily = {
  id: 'EXP_STANDARD',
  concept: 'Exponential Derivatives',
  name: 'Exponential Functions',
  description: 'Differentiation of a*e^(kx) + c*x.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 3],
  requiredSkills: ['exponential derivative', 'chain rule with exp'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    const a = sampleInt(2, 6);
    const k = sampleInt(2, 5);
    const c = sampleInt(2, 7);

    // f(x) = a * e^(kx) + c * x
    const expTerm = multiply(constant(a), power(EULER, multiply(constant(k), variable('x'))));
    const polyTerm = multiply(constant(c), variable('x'));
    const rawExpression = add(expTerm, polyTerm);
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'Identify the exponential term $e^{kx}$ and linear term $cx$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: 'Use $\\frac{d}{dx}[e^{kx}] = k e^{kx}$.',
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}[a e^{kx} + c x] = a k e^{kx} + c.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `$\\frac{d}{dx}[${a} e^{${k}x}] = ${a * k} e^{${k}x}$ and $\\frac{d}{dx}[${c}x] = ${c}$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `The final derivative is $${a * k} e^{${k}x} + ${c}$.`,
      },
    ];

    return {
      statement: {
        promptText: 'Find $\\frac{dy}{dx}$ for the exponential function:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `EXP|k=${k}|a=${a}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 2,
        computational: 2,
        procedural: 2,
        reasoning: 2,
      },
      hints,
    };
  },
};

export const LogStandardFamily: ProblemFamily = {
  id: 'LOG_STANDARD',
  concept: 'Logarithmic Derivatives',
  name: 'Logarithmic Functions',
  description: 'Differentiation of b*ln(ax + c).',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['log derivative', 'chain rule with log'],
  targetedMisconceptions: ['MISSING_INNER_DERIVATIVE'],

  generate(difficultyLevel: number) {
    const b = sampleInt(2, 6);
    const a = sampleInt(2, 5);
    const c = sampleInt(1, 8);

    // f(x) = b * ln(a*x + c)
    const inner = add(multiply(constant(a), variable('x')), constant(c));
    const rawExpression = multiply(constant(b), func('ln', inner));
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'This is a logarithmic composite function $b \\ln(u)$ where $u = ax + c$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: 'Apply the Logarithmic Chain Rule: $\\frac{d}{dx}[\\ln(u)] = \\frac{u\'}{u}$.',
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}[b \\ln(ax + c)] = \\frac{b \\cdot a}{ax + c}.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Inside derivative $u\' = \\frac{d}{dx}[${a}x + ${c}] = ${a}$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Multiply by $${b}$: $\\frac{${a * b}}{${a}x + ${c}}$.`,
      },
    ];

    return {
      statement: {
        promptText: 'Find $\\frac{dy}{dx}$ for the logarithmic function:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `LOG|a=${a}|b=${b}|c=${c}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 2,
        procedural: 2,
        reasoning: 2,
      },
      hints,
    };
  },
};
