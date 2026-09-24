/**
 * Problem Families: Chain Rule
 * Implements polynomial inner, trig inner, exp inner, log inner, kinematics, and error analysis families.
 */

import { ProblemFamily, StandardHint } from '../types';
import { MathNode, constant, variable, add, subtract, multiply, divide, power, func, nodeToLatex } from '../../math/ast';
import { Rational } from '../../math/rational';

function sampleInt(min: number, max: number, avoidZero: boolean = true): number {
  let val = 0;
  while (val === 0 && avoidZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export const ChainPowerPolynomialFamily: ProblemFamily = {
  id: 'CHAIN_POWER_POLYNOMIAL',
  concept: 'Chain Rule',
  name: 'Composite Power of Polynomial Function',
  description: 'Differentiation of (a*x^2 + b*x + c)^n where n is an integer or rational power.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['identify inner function', 'power rule', 'chain rule multiplication'],
  targetedMisconceptions: ['MISSING_INNER_DERIVATIVE', 'POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    const a = sampleInt(2, 5);
    const b = sampleInt(-4, 4);
    const c = sampleInt(1, 6);
    const n = difficultyLevel >= 3 ? (difficultyLevel === 4 ? 6 : sampleInt(3, 5)) : sampleInt(2, 3);

    // Inner polynomial: ax^2 + bx + c
    const innerTerms: MathNode[] = [multiply(constant(a), power(variable('x'), 2))];
    if (b !== 0) {
      innerTerms.push(multiply(constant(b), variable('x')));
    }
    innerTerms.push(constant(c));
    const inner = add(...innerTerms);

    // (ax^2 + bx + c)^n
    const rawExpression = power(inner, constant(n));
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'Identify what rule applies when one mathematical expression is enclosed inside a power.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Define the inner function as $u = ${nodeToLatex(inner)}$ and the outer function as $f(u) = u^{${n}}$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: 'Recall the Chain Rule formula: $\\frac{dy}{dx} = \\frac{df}{du} \\cdot \\frac{du}{dx} = n u^{n-1} \\cdot u\'$.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Differentiate the inner function: $\\frac{du}{dx} = \\frac{d}{dx}\\left[${nodeToLatex(inner)}\\right] = ${2 * a}x ${b < 0 ? `- ${-b}` : b > 0 ? `+ ${b}` : ''}$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Multiply outer derivative $${n}(${nodeToLatex(inner)})^{${n - 1}}$ by the inner derivative.`,
      },
    ];

    return {
      statement: {
        promptText: 'Find the derivative $\\frac{dy}{dx}$ for the function:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `CHAIN|OUTER:POW:n=${n}|INNER:POLY:deg=2`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 2 + (difficultyLevel > 3 ? 1 : 0),
        procedural: 3,
        reasoning: 2,
      },
      hints,
    };
  },
};

export const ChainTrigInnerFamily: ProblemFamily = {
  id: 'CHAIN_TRIG_INNER',
  concept: 'Chain Rule',
  name: 'Trigonometric Function with Nested Polynomial',
  description: 'Differentiation of sin(ax^2 + b), cos(kx^2), etc.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['identify inner function', 'trig derivative', 'chain rule'],
  targetedMisconceptions: ['MISSING_INNER_DERIVATIVE', 'TRIG_DERIVATIVE_SIGN_ERROR'],

  generate(difficultyLevel: number) {
    const a = sampleInt(2, 5);
    const b = sampleInt(1, 7);
    const trigFn = difficultyLevel >= 3 ? (Math.random() > 0.5 ? 'cos' : 'tan') : 'sin';

    const inner = add(multiply(constant(a), power(variable('x'), 2)), constant(b));
    const rawExpression = func(trigFn as any, inner);
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'This is a trigonometric function with a polynomial argument inside.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Let $u = ${nodeToLatex(inner)}$. The outer function is $\\${trigFn}(u)$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: `\\frac{d}{dx}[\\${trigFn}(u)] = \\frac{d}{du}[\\${trigFn}(u)] \\cdot \\frac{du}{dx}.`,
      },
      {
        level: 4,
        category: 'Setup',
        text: `The derivative of the inside is $\\frac{du}{dx} = ${2 * a}x$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Multiply the outer derivative by $${2 * a}x$.`,
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
      structureSignature: `CHAIN|OUTER:TRIG:${trigFn.toUpperCase()}|INNER:POLY:deg=2`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 2,
        procedural: 3,
        reasoning: 3,
      },
      hints,
    };
  },
};

export const ChainKinematicsFamily: ProblemFamily = {
  id: 'CHAIN_KINEMATICS',
  concept: 'Chain Rule',
  name: 'Kinematics Oscillatory Motion',
  description: 'Physical displacement s(t) requiring chain rule to find instantaneous velocity.',
  representationType: 'Kinematics',
  contextType: 'Physics',
  difficultyRange: [3, 5],
  requiredSkills: ['rate of change interpretation', 'chain rule', 'trigonometric differentiation'],
  targetedMisconceptions: ['MISSING_INNER_DERIVATIVE', 'TRIG_DERIVATIVE_SIGN_ERROR'],

  generate(difficultyLevel: number) {
    const A = sampleInt(3, 12);
    const omega = sampleInt(2, 6);
    const phi = sampleInt(1, 4);

    const inner = add(multiply(constant(omega), variable('t')), constant(phi));
    const rawExpression = multiply(constant(A), func('cos', inner));

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'Velocity $v(t)$ is the derivative of position with respect to time: $v(t) = \\frac{ds}{dt}$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Differentiate the composite cosine expression using the Chain Rule with $u = ${nodeToLatex(inner)}$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dt}[A \\cos(\\omega t + \\phi)] = -A \\omega \\sin(\\omega t + \\phi).',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Inner derivative $\\frac{du}{dt} = ${omega}$, outer derivative $-${A} \\sin(u)$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Multiply by $\\omega = ${omega}$ to obtain the final velocity function.`,
      },
    ];

    return {
      statement: {
        promptText: 'An oscillating piston has displacement (in meters) given by position function $s(t)$. Find the instantaneous velocity $v(t) = \\frac{ds}{dt}$:',
        expressionLatex: `s(t) = ${A} \\cos(${omega}t + ${phi})`,
        targetVariable: 'ds/dt',
        independentVariable: 't',
        contextDescription: 'Harmonic oscillatory motion in Mechanical Engineering.',
      },
      rawExpression,
      structureSignature: `CHAIN|CONTEXT:PHYSICS|OUTER:COS|INNER:LINEAR:w=${omega}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 4,
        computational: 2,
        procedural: 3,
        reasoning: 4,
      },
      hints,
    };
  },
};
