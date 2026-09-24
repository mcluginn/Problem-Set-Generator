/**
 * Problem Families: Product Rule
 */

import { ProblemFamily, StandardHint } from '../types';
import { MathNode, constant, variable, multiply, power, func, nodeToLatex, add } from '../../math/ast';

function sampleInt(min: number, max: number, avoidZero: boolean = true): number {
  let val = 0;
  while (val === 0 && avoidZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export const ProductPolyTrigFamily: ProblemFamily = {
  id: 'PRODUCT_POLY_TRIG',
  concept: 'Product Rule',
  name: 'Polynomial Multiplied by Trigonometric Function',
  description: 'Differentiation of x^n * sin(ax) or (ax+b) * cos(x).',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['product rule formula', 'power rule', 'trig derivative'],
  targetedMisconceptions: ['PRODUCT_RULE_MULTIPLY_DERIVS', 'PRODUCT_RULE_OMITTED_TERM'],

  generate(difficultyLevel: number) {
    const n = sampleInt(2, 4);
    const trigFn = Math.random() > 0.5 ? 'sin' : 'cos';
    const a = sampleInt(2, 5);

    const u = power(variable('x'), n);
    const v = a === 1 ? func(trigFn as any, variable('x')) : func(trigFn as any, multiply(constant(a), variable('x')));

    const rawExpression = multiply(u, v);
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'The expression is a product of two variable functions $u(x) \\cdot v(x)$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Set $u = ${nodeToLatex(u)}$ and $v = ${nodeToLatex(v)}$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: 'Use the Leibniz Product Rule: $\\frac{d}{dx}[u \\cdot v] = u\'v + uv\'.$',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Compute the derivatives: $u\' = ${n}x^{${n - 1}}$, and $v\' = \\frac{d}{dx}[${nodeToLatex(v)}]$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: 'Assemble $u\'v + uv\'$ and factor out any common terms like $x^{${n - 1}}$.',
      },
    ];

    return {
      statement: {
        promptText: 'Find $\\frac{dy}{dx}$ using the Product Rule:',
        expressionLatex: `y = ${latex}`,
        targetVariable: 'dy/dx',
        independentVariable: 'x',
      },
      rawExpression,
      structureSignature: `PRODUCT|U:POW:deg=${n}|V:TRIG:${trigFn.toUpperCase()}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 2,
        procedural: 3,
        reasoning: 2,
      },
      hints,
    };
  },
};

export const ProductPolyExpFamily: ProblemFamily = {
  id: 'PRODUCT_POLY_EXP',
  concept: 'Product Rule',
  name: 'Polynomial Multiplied by Exponential',
  description: 'Differentiation of x^n * exp(ax).',
  representationType: 'Symbolic',
  contextType: 'PureMath',
  difficultyRange: [2, 4],
  requiredSkills: ['product rule', 'exponential derivative'],
  targetedMisconceptions: ['PRODUCT_RULE_MULTIPLY_DERIVS'],

  generate(difficultyLevel: number) {
    const n = sampleInt(2, 4);
    const a = sampleInt(2, 4);

    const u = power(variable('x'), n);
    const v = func('exp', multiply(constant(a), variable('x')));

    const rawExpression = multiply(u, v);
    const latex = nodeToLatex(rawExpression);

    const hints: StandardHint[] = [
      {
        level: 1,
        category: 'Recognition',
        text: 'Product Rule is required for multiplying $x^n$ with $e^{ax}$.',
      },
      {
        level: 2,
        category: 'Direction',
        text: `Identify $u = ${nodeToLatex(u)}$ and $v = ${nodeToLatex(v)}$.`,
      },
      {
        level: 3,
        category: 'Formula',
        text: '\\frac{d}{dx}[u v] = u\' v + u v\'.',
      },
      {
        level: 4,
        category: 'Setup',
        text: `Note that $\\frac{d}{dx}[e^{${a}x}] = ${a} e^{${a}x}$.`,
      },
      {
        level: 5,
        category: 'GuidedCalculation',
        text: `Assemble: $(${n}x^{${n - 1}}) e^{${a}x} + (x^{${n}}) (${a} e^{${a}x})$.`,
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
      structureSignature: `PRODUCT|U:POW:deg=${n}|V:EXP:a=${a}`,
      difficulty: {
        overall: difficultyLevel,
        conceptual: 3,
        computational: 2,
        procedural: 3,
        reasoning: 2,
      },
      hints,
    };
  },
};
