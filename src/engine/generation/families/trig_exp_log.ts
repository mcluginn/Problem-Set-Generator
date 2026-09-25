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
  description: 'Differentiation of exponential functions ranging from simple multiples to non-linear arguments and products.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [1, 4],
  requiredSkills: ['exponential derivative', 'chain rule with exp', 'product rule'],
  targetedMisconceptions: ['POWER_RULE_NO_REDUCE', 'MISSING_INNER_DERIVATIVE'],

  generate(difficultyLevel: number) {
    const level = Math.max(1, Math.min(4, Math.round(difficultyLevel || 2)));
    let rawExpression: MathNode;
    let structureSignature: string;
    let hints: StandardHint[];

    if (level === 1) {
      // Level 1: Pure linear exponential: a * e^(k*x) + c
      const a = sampleInt(2, 6);
      const k = sampleInt(2, 5);
      const c = sampleInt(1, 9);
      const expTerm = multiply(constant(a), power(EULER, multiply(constant(k), variable('x'))));
      rawExpression = add(expTerm, constant(c));
      structureSignature = `EXP|L1|k=${k}|a=${a}|c=${c}`;
      hints = [
        { level: 1, category: 'Recognition', text: 'Identify the exponential term $a e^{kx}$ and constant $c$.' },
        { level: 2, category: 'Direction', text: 'Use $\\frac{d}{dx}[e^{kx}] = k e^{kx}$ and remember constant derivative is 0.' },
        { level: 3, category: 'Formula', text: '\\frac{d}{dx}[a e^{kx} + c] = a k e^{kx}.' },
        { level: 4, category: 'Setup', text: `$\\frac{d}{dx}[${a} e^{${k}x}] = ${a * k} e^{${k}x}$.` },
        { level: 5, category: 'GuidedCalculation', text: `The canonical derivative is $${a * k} e^{${k}x}$.` }
      ];
    } else if (level === 2) {
      // Level 2: Sum with linear term: a * e^(k*x) + c * x
      const a = sampleInt(2, 6);
      const k = sampleInt(2, 5);
      const c = sampleInt(2, 7);
      const expTerm = multiply(constant(a), power(EULER, multiply(constant(k), variable('x'))));
      const polyTerm = multiply(constant(c), variable('x'));
      rawExpression = add(expTerm, polyTerm);
      structureSignature = `EXP|L2|k=${k}|a=${a}|c=${c}`;
      hints = [
        { level: 1, category: 'Recognition', text: 'Apply the Sum Rule: differentiate $a e^{kx}$ and $cx$ individually.' },
        { level: 2, category: 'Direction', text: 'Use the exponential chain rule: $\\frac{d}{dx}[e^{kx}] = k e^{kx}$.' },
        { level: 3, category: 'Formula', text: '\\frac{d}{dx}[a e^{kx} + c x] = a k e^{kx} + c.' },
        { level: 4, category: 'Setup', text: `$\\frac{d}{dx}[${a} e^{${k}x}] = ${a * k} e^{${k}x}$ and $\\frac{d}{dx}[${c}x] = ${c}$.` },
        { level: 5, category: 'GuidedCalculation', text: `Combine terms: $${a * k} e^{${k}x} + ${c}$.` }
      ];
    } else if (level === 3) {
      // Level 3: Non-linear exponent (Quadratic argument): a * e^(k * x^2)
      const a = sampleInt(2, 5);
      const k = sampleInt(2, 4);
      const quadExponent = multiply(constant(k), power(variable('x'), 2));
      rawExpression = multiply(constant(a), power(EULER, quadExponent));
      structureSignature = `EXP|L3|QUAD_EXP|k=${k}|a=${a}`;
      hints = [
        { level: 1, category: 'Recognition', text: 'Notice the exponent is non-linear: $u = k x^2$. Chain Rule is required!' },
        { level: 2, category: 'Direction', text: 'Chain Rule for exponentials: $\\frac{d}{dx}[e^{u}] = e^{u} \\cdot \\frac{du}{dx}$.' },
        { level: 3, category: 'Formula', text: `\\frac{d}{dx}[${a} e^{${k}x^2}] = ${a} e^{${k}x^2} \\cdot \\frac{d}{dx}[${k}x^2].` },
        { level: 4, category: 'Setup', text: `Since $\\frac{d}{dx}[${k}x^2] = ${2 * k}x$, multiply by $${a}$.` },
        { level: 5, category: 'GuidedCalculation', text: `Combine to get $${2 * k * a} x e^{${k}x^2}$.` }
      ];
    } else {
      // Level 4: Product of polynomial and exponential: (a * x + b) * e^(k * x)
      const a = sampleInt(2, 4);
      const b = sampleInt(1, 5);
      const k = sampleInt(2, 4);
      const poly = add(multiply(constant(a), variable('x')), constant(b));
      const exp = power(EULER, multiply(constant(k), variable('x')));
      rawExpression = multiply(poly, exp);
      structureSignature = `EXP|L4|PRODUCT_POLY_EXP|a=${a}|b=${b}|k=${k}`;
      hints = [
        { level: 1, category: 'Recognition', text: 'This is a product of two functions: $u = ax + b$ and $v = e^{kx}$. Product Rule is required.' },
        { level: 2, category: 'Direction', text: 'Product Rule formula: $(uv)\' = u\'v + uv\'.' },
        { level: 3, category: 'Formula', text: `u\' = ${a},\\quad v\' = ${k}e^{${k}x}.` },
        { level: 4, category: 'Setup', text: `Substitute: ${a}(e^{${k}x}) + (${a}x + ${b})(${k}e^{${k}x}).` },
        { level: 5, category: 'GuidedCalculation', text: 'Factor out $e^{kx}$ and collect the polynomial terms.' }
      ];
    }

    const latex = nodeToLatex(rawExpression);

    return {
      statement: {
        promptText: 'Find $\\frac{dy}{dx}$ for the exponential function:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature,
      difficulty: {
        overall: level,
        conceptual: level >= 3 ? 3 : 2,
        computational: level >= 3 ? 3 : 2,
        procedural: level >= 3 ? 3 : 2,
        reasoning: level >= 3 ? 3 : 2,
      },
      hints,
    };
  },
};

export const LogStandardFamily: ProblemFamily = {
  id: 'LOG_STANDARD',
  concept: 'Logarithmic Derivatives',
  name: 'Logarithmic Functions',
  description: 'Differentiation of logarithmic functions from simple scales to linear, quadratic arguments, and products.',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [1, 4],
  requiredSkills: ['log derivative', 'chain rule with log', 'product rule'],
  targetedMisconceptions: ['MISSING_INNER_DERIVATIVE'],

  generate(difficultyLevel: number) {
    const level = Math.max(1, Math.min(4, Math.round(difficultyLevel || 2)));
    let rawExpression: MathNode;
    let structureSignature: string;
    let hints: StandardHint[];

    if (level === 1) {
      // Level 1: Scaled logarithm b * ln(x) + c
      const b = sampleInt(2, 6);
      const c = sampleInt(1, 8);
      rawExpression = add(multiply(constant(b), func('ln', variable('x'))), constant(c));
      structureSignature = `LOG|L1|b=${b}|c=${c}`;
      hints = [
        { level: 1, category: 'Recognition', text: 'Standard natural logarithm derivative: $\\frac{d}{dx}[\\ln(x)] = \\frac{1}{x}$.' },
        { level: 2, category: 'Direction', text: 'Constant multiple rule: multiply the derivative by $b$, and constant $c$ drops to 0.' },
        { level: 3, category: 'Formula', text: `\\frac{d}{dx}[${b} \\ln(x) + ${c}] = ${b} \\cdot \\frac{1}{x}.` },
        { level: 4, category: 'Setup', text: `Evaluate: $\\frac{${b}}{x}$.` },
        { level: 5, category: 'GuidedCalculation', text: `The canonical answer is $\\frac{${b}}{x}$.` }
      ];
    } else if (level === 2) {
      // Level 2: Linear composite b * ln(a * x + c)
      const b = sampleInt(2, 6);
      const a = sampleInt(2, 5);
      const c = sampleInt(1, 8);
      const inner = add(multiply(constant(a), variable('x')), constant(c));
      rawExpression = multiply(constant(b), func('ln', inner));
      structureSignature = `LOG|L2|a=${a}|b=${b}|c=${c}`;
      hints = [
        { level: 1, category: 'Recognition', text: 'Composite logarithmic function: $u = ax + c$.' },
        { level: 2, category: 'Direction', text: 'Logarithmic Chain Rule: $\\frac{d}{dx}[\\ln(u)] = \\frac{u\'}{u}$.' },
        { level: 3, category: 'Formula', text: `\\frac{d}{dx}[${b} \\ln(${a}x + ${c})] = \\frac{${b} \\cdot ${a}}{${a}x + ${c}}.` },
        { level: 4, category: 'Setup', text: `Numerator is $${b} \\cdot ${a} = ${b * a}$.` },
        { level: 5, category: 'GuidedCalculation', text: `Canonical form is $\\frac{${b * a}}{${a}x + ${c}}$.` }
      ];
    } else if (level === 3) {
      // Level 3: Quadratic composite b * ln(a * x^2 + c)
      const b = sampleInt(2, 5);
      const a = sampleInt(2, 4);
      const c = sampleInt(1, 9);
      const inner = add(multiply(constant(a), power(variable('x'), 2)), constant(c));
      rawExpression = multiply(constant(b), func('ln', inner));
      structureSignature = `LOG|L3|QUAD_INNER|a=${a}|b=${b}|c=${c}`;
      hints = [
        { level: 1, category: 'Recognition', text: 'Notice the inner argument is quadratic: $u = a x^2 + c$.' },
        { level: 2, category: 'Direction', text: 'Apply $\\frac{d}{dx}[\\ln(u)] = \\frac{u\'}{u}$. First find $u\' = \\frac{d}{dx}[${a}x^2 + ${c}]$.' },
        { level: 3, category: 'Formula', text: `u\' = ${2 * a}x, \\quad \\text{so } \\frac{d}{dx}[\\ln(u)] = \\frac{${2 * a}x}{${a}x^2 + ${c}}` },
        { level: 4, category: 'Setup', text: `Multiply by the coefficient $${b}$: $${b} \\cdot \\frac{${2 * a}x}{${a}x^2 + ${c}}$.` },
        { level: 5, category: 'GuidedCalculation', text: `The derivative is $\\frac{${2 * a * b}x}{${a}x^2 + ${c}}$.` }
      ];
    } else {
      // Level 4: Product rule with log: (a * x) * ln(x)
      const a = sampleInt(2, 5);
      const u = multiply(constant(a), variable('x'));
      const v = func('ln', variable('x'));
      rawExpression = multiply(u, v);
      structureSignature = `LOG|L4|PRODUCT_POLY_LOG|a=${a}`;
      hints = [
        { level: 1, category: 'Recognition', text: 'This is a product of polynomial $u = ax$ and logarithm $v = \\ln(x)$. Product Rule is required.' },
        { level: 2, category: 'Direction', text: 'Product Rule: $(uv)\' = u\'v + uv\'.' },
        { level: 3, category: 'Formula', text: `u\' = ${a}, \\quad v\' = \\frac{1}{x}.` },
        { level: 4, category: 'Setup', text: `Substitute: ${a}(\\ln(x)) + (${a}x)\\left(\\frac{1}{x}\\right).` },
        { level: 5, category: 'GuidedCalculation', text: `Since $${a}x \\cdot \\frac{1}{x} = ${a}$, the result is $${a} \\ln(x) + ${a}$.` }
      ];
    }

    const latex = nodeToLatex(rawExpression);

    return {
      statement: {
        promptText: 'Find $\\frac{dy}{dx}$ for the logarithmic function:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature,
      difficulty: {
        overall: level,
        conceptual: level >= 3 ? 3 : 2,
        computational: level >= 3 ? 3 : 2,
        procedural: level >= 3 ? 3 : 2,
        reasoning: level >= 3 ? 3 : 2,
      },
      hints,
    };
  },
};
