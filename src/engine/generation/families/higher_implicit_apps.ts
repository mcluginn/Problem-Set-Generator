/**
 * Problem Families: Implicit Differentiation, Higher-Order Derivatives, and Engineering Applications
 */

import { ProblemFamily, StandardHint } from '../types';
import {
  MathNode,
  constant,
  variable,
  multiply,
  add,
  power,
  func,
  nodeToLatex,
  subtract,
} from '../../math/ast';

function sampleInt(min: number, max: number, avoidZero: boolean = true): number {
  let val = 0;
  while (val === 0 && avoidZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export const ImplicitConicFamily: ProblemFamily = {
  id: 'IMPLICIT_CONIC',
  concept: 'Implicit Differentiation',
  name: 'Implicit Conic Curves',
  description: 'Differentiating circular and conic relations x^2 + y^2 = r^2 with respect to x.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['implicit differentiation', 'chain rule on y', 'algebraic grouping'],
  targetedMisconceptions: ['MISSING_INNER_DERIVATIVE'],

  generate(difficultyLevel: number) {
    const rSq = sampleInt(4, 36);
    // F(x, y) = x^2 + y^2 - r^2
    const rawExpression = add(
      power(variable('x'), 2),
      power(variable('y'), 2)
    );
    const latex = `x^2 + y^2 = ${rSq}`;

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'This is an implicit relation $x^2 + y^2 = r^2$ where $y$ is a dependent function of $x$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: 'Differentiate both sides with respect to $x$. When differentiating $y^2$, apply the Chain Rule to get $2y \\frac{dy}{dx}$.',
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}[x^2 + y^2] = 2x + 2y \\frac{dy}{dx} = 0.',
      },
      {
        level: 4,
        category: 'Setup',
        text: 'Subtract $2x$ from both sides: $2y \\frac{dy}{dx} = -2x$.',
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: 'Divide by $2y$ and cancel 2: $\\frac{dy}{dx} = -\\frac{x}{y}$.',
      },
    ];

    return {
      statement: {
        promptText: `Find $\\frac{dy}{dx}$ using implicit differentiation for the curve:`,
        expressionLatex: latex,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
        contextDescription: 'Implicit differentiation: Differentiating dependent variable y(x).',
      },
      rawExpression: subtract(rawExpression, constant(rSq)),
      structureSignature: `IMPLICIT|CIRCLE|rSq=${rSq}`,
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

export const ImplicitProductFamily: ProblemFamily = {
  id: 'IMPLICIT_PRODUCT',
  concept: 'Implicit Differentiation',
  name: 'Implicit Mixed Products',
  description: 'Differentiating mixed xy products: x^2 y + y^3 = C.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [3, 5],
  requiredSkills: ['product rule with implicit', 'chain rule', 'dy/dx isolation'],
  targetedMisconceptions: ['MISSING_INNER_DERIVATIVE', 'PRODUCT_RULE_MULTIPLY_DERIVS'],

  generate(difficultyLevel: number) {
    const c = sampleInt(5, 25);
    // F(x, y) = x^2 * y - c
    const rawExpression = multiply(power(variable('x'), 2), variable('y'));
    const latex = `x^2 y = ${c}`;

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The term $x^2 y$ is a product of two functions of $x$: $u = x^2$ and $v = y(x)$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: 'Apply the Product Rule: $\\frac{d}{dx}[x^2 y] = (2x)(y) + (x^2)\\left(\\frac{dy}{dx}\\right)$.',
      },
      {
        level: 3,
        category: 'Formula',
        text: '2xy + x^2 \\frac{dy}{dx} = 0.',
      },
      {
        level: 4,
        category: 'Setup',
        text: 'Isolate $\\frac{dy}{dx}$: $x^2 \\frac{dy}{dx} = -2xy$.',
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: 'Divide by $x^2$ and reduce: $\\frac{dy}{dx} = -\\frac{2y}{x}$.',
      },
    ];

    return {
      statement: {
        promptText: `Find $\\frac{dy}{dx}$ by implicit differentiation for:`,
        expressionLatex: latex,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
        contextDescription: 'Implicit curve analysis with Product Rule.',
      },
      rawExpression: subtract(rawExpression, constant(c)),
      structureSignature: `IMPLICIT|PROD|degX=2|degY=1`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 4,
        computational: 3,
        procedural: 4,
        reasoning: 3,
      },
      hints,
    };
  },
};

export const HigherOrderFamily: ProblemFamily = {
  id: 'HIGHER_ORDER_POLY',
  concept: 'Higher-Order Derivatives',
  name: 'Second and Third Order Polynomial Derivatives',
  description: 'Computing f\'\'(x) or d^2y/dx^2 for polynomials.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['repeated differentiation', 'power rule', 'polynomial algebra'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    const a = sampleInt(2, 6);
    const b = sampleInt(-5, 5);
    const c = sampleInt(2, 8);

    // f(x) = a x^4 + b x^3 + c x^2
    const rawExpression = add(
      multiply(constant(a), power(variable('x'), 4)),
      multiply(constant(b), power(variable('x'), 3)),
      multiply(constant(c), power(variable('x'), 2))
    );
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The second derivative $\\frac{d^2y}{dx^2}$ is found by differentiating the first derivative: $\\frac{d}{dx}\\left[\\frac{dy}{dx}\\right]$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `First find $\\frac{dy}{dx} = ${4 * a}x^3 + ${3 * b}x^2 + ${2 * c}x$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d^2y}{dx^2} = \\frac{d}{dx}[f\'(x)].',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Differentiate each term of the first derivative once more: $\\frac{d}{dx}[${4 * a}x^3] = ${12 * a}x^2$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `The final second derivative is $${12 * a}x^2 + ${6 * b}x + ${2 * c}$.`,
      },
    ];

    return {
      statement: {
        promptText: 'Find the second derivative $\\frac{d^2y}{dx^2}$ for:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'd^2y/dx^2',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `HIGHER|ORDER=2|DEG=4`,
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

export const TangentLineSlopeFamily: ProblemFamily = {
  id: 'APP_TANGENT_SLOPE',
  concept: 'Basic Applications of Derivatives',
  name: 'Tangent Line Slope Application',
  description: 'Find the slope m = f\'(x_0) or equation of tangent line to a curve.',
  representationType: 'TangentLine',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['derivative evaluation', 'geometric interpretation of derivative'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    const a = sampleInt(1, 4);
    const b = sampleInt(-4, 4);
    const x0 = sampleInt(1, 3);

    const rawExpression = add(multiply(constant(a), power(variable('x'), 2)), multiply(constant(b), variable('x')));
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The slope $m$ of the tangent line at $x = x_0$ is equal to the value of the derivative $f\'(x_0)$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `First find the general derivative function $f\'(x) = \\frac{d}{dx}[${latex}]$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: 'm = f\'(x_0) = 2ax + b \\text{ evaluated at } x = x_0.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `General derivative: $f\'(x) = ${2 * a}x ${b < 0 ? `- ${-b}` : b > 0 ? `+ ${b}` : ''}$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Evaluate at $x = ${x0}$: $m = ${2 * a}(${x0}) ${b < 0 ? `- ${-b}` : b > 0 ? `+ ${b}` : ''} = ${2 * a * x0 + b}$.`,
      },
    ];

    return {
      statement: {
        promptText: `Find the general derivative function $\\frac{dy}{dx}$ used to determine the slope of the curve at any point:`,
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
        contextDescription: `Geometric application: Tangent line slope analysis at $x = ${x0}$.`,
      },
      rawExpression,
      structureSignature: `APP|TANGENT|DEG=2|x0=${x0}`,
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

export const KinematicsAppFamily: ProblemFamily = {
  id: 'APP_KINEMATICS',
  concept: 'Basic Applications of Derivatives',
  name: 'Physics Kinematics: Velocity and Acceleration',
  description: 'Physical rate of change modeling: velocity v(t) = s\'(t).',
  representationType: 'Kinematics',
  contextType: 'Physics',
  difficultyRange: [2, 4],
  requiredSkills: ['rate of change', 'velocity as derivative', 'kinematics modeling'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE'],

  generate(difficultyLevel: number) {
    const s0 = sampleInt(5, 20);
    const v0 = sampleInt(10, 30);
    const halfG = 5; // standard ~10m/s^2 -> 5t^2

    // s(t) = s0 + v0*t - 5*t^2
    const rawExpression = subtract(
      add(constant(s0), multiply(constant(v0), variable('t'))),
      multiply(constant(halfG), power(variable('t'), 2))
    );
    const latex = `s(t) = ${s0} + ${v0}t - 5t^2`;

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'Instantaneous velocity $v(t)$ is the first time-derivative of position: $v(t) = \\frac{ds}{dt}$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: 'Differentiate each term with respect to time $t$.',
      },
      {
        level: 3,
        category: 'Formula',
        text: 'v(t) = s\'(t) = \\frac{d}{dt}[s_0 + v_0 t - 5t^2] = v_0 - 10t.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `\\frac{d}{dt}[${s0}] = 0, \\quad \\frac{d}{dt}[${v0}t] = ${v0}, \\quad \\frac{d}{dt}[5t^2] = 10t.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `The velocity function is $v(t) = ${v0} - 10t$.`,
      },
    ];

    return {
      statement: {
        promptText: 'A projectile moves with position $s(t)$ (in meters). Find the instantaneous velocity function $v(t) = \\frac{ds}{dt}$:',
        expressionLatex: latex,
        targetVariable: 'ds/dt',
        independentVariable: 't',
        contextDescription: 'Mechanical Kinematics: 1D projectile motion.',
      },
      rawExpression,
      structureSignature: `KINEMATICS|DEG=2|v0=${v0}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 2,
        procedural: 2,
        reasoning: 3,
      },
      hints,
    };
  },
};
