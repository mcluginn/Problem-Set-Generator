/**
 * Parametric Problem Templates Registry Across All Six Courses
 * Engineering Practice Engine — Phase 5 Six-Course Domain Content Development
 */

import {
  ProblemTemplate,
  StructuredReasoningTraceStep,
  StructuredHint,
  ProblemDistractor
} from './types';
import {
  constant,
  variable,
  add,
  subtract,
  multiply,
  divide,
  power,
  negate,
  func
} from '../math/ast';
import { ARCHETYPE_REGISTRY } from './archetypeRegistry';
import { calculateASTFingerprint } from '../math/structuralFingerprint';
import { curriculumRegistry } from '../curriculum/registry';
import { PROBLEM_FAMILIES_REGISTRY } from './problemFamilies';
import { createFallbackTemplate } from './fallbackContent';

export const PROBLEM_TEMPLATES_REGISTRY: Record<string, ProblemTemplate> = {
  // =========================================================================
  // COURSE: GEN 0101 (Mathematics for Engineers)
  // =========================================================================
  'TMPL-GEN0101-OPERATIONS-STD': {
    id: 'TMPL-GEN0101-OPERATIONS-STD',
    familyId: 'FAM-GEN0101-OPERATIONS-STD',
    courseId: 'COURSE-GEN0101',
    primarySkillId: 'SKILL-GEN0101-001',
    name: 'Order of Operations Multi-Tier Evaluation',
    description: 'Evaluates arithmetic expressions with parentheses, exponents, multiplication, division, and addition/subtraction.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 6, description: 'Leading arithmetic constant' },
      { name: 'b', type: 'INTEGER', min: 3, max: 8, description: 'Inner bracket term' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? (difficulty >= 3 ? 3 : 4);
      const b = params?.b ?? 6;
      let exprLatex = '';
      let result = 0;
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Two operations - multiplication and addition: a * (b + 3)
        const inner = b + 3;
        result = a * inner;
        exprLatex = `${a}\\left(${b} + 3\\right)`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Evaluate inside parentheses: (${b} + 3).`, pedagogicalRationale: 'Parentheses first.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Add: ${b} + 3 = ${inner}.`, pedagogicalRationale: 'Inner arithmetic.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Multiply by ${a}: ${a} * ${inner} = ${result}.`, pedagogicalRationale: 'Multiplication.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Parentheses take precedence over multiplication.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `First calculate (${b} + 3) = ${inner}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `${a} * ${inner} = ${result}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Three operations with parentheses: a * (b - 2) + 5
        const inner = b - 2;
        const product = a * inner;
        result = product + 5;
        exprLatex = `${a}\\left(${b} - 2\\right) + 5`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'PEMDAS: evaluate inner parenthesis (b - 2) first.', pedagogicalRationale: 'Parentheses first.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Inner bracket: ${b} - 2 = ${inner}.`, pedagogicalRationale: 'Inner arithmetic.' },
          { stepIndex: 3, phase: 'EXECUTION', actionDescription: `Multiply by ${a}: ${a} * ${inner} = ${product}.`, pedagogicalRationale: 'Multiplication precedence.' },
          { stepIndex: 4, phase: 'SIMPLIFICATION', actionDescription: `Add 5: ${product} + 5 = ${result}.`, pedagogicalRationale: 'Final summation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Follow PEMDAS: Parentheses, then Multiplication, then Addition.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Evaluate inside parentheses: (${b} - 2) = ${inner}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `${a} * ${inner} + 5 = ${product} + 5.`, revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Exponents, multiplication and subtraction: a^2 + 2 * (b - 1)
        const aSq = a * a;
        const inner = b - 1;
        const prod = 2 * inner;
        result = aSq + prod;
        exprLatex = `${a}^{2} + 2\\left(${b} - 1\\right)`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Evaluate exponent and parentheses: a^2 and (b - 1).', pedagogicalRationale: 'PEMDAS.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `${a}^2 = ${aSq}, and (${b} - 1) = ${inner}.`, pedagogicalRationale: 'Exponents and parentheses.' },
          { stepIndex: 3, phase: 'EXECUTION', actionDescription: `Multiply: 2 * ${inner} = ${prod}.`, pedagogicalRationale: 'Multiplication.' },
          { stepIndex: 4, phase: 'SIMPLIFICATION', actionDescription: `Add: ${aSq} + ${prod} = ${result}.`, pedagogicalRationale: 'Addition.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Evaluate parentheses and exponents before multiplication and addition.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `${a}^2 = ${aSq} and (${b} - 1) = ${inner}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `${aSq} + 2(${inner}) = ${aSq} + ${prod} = ${result}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Nested parentheses and division: [a * (b - 1)^2 - 4] / 2
        const inner = b - 1;
        const innerSq = inner * inner;
        const num = a * innerSq - 4;
        result = Math.round(num / 2);
        exprLatex = `\\frac{${a}\\left(${b} - 1\\right)^{2} - 4}{2}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Evaluate inner bracket, square it, multiply, subtract, then divide.', pedagogicalRationale: 'PEMDAS multi-tier.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `(${b} - 1)^2 = ${inner}^2 = ${innerSq}. Multiply by ${a}: ${a * innerSq}.`, pedagogicalRationale: 'Numerator exponent.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Subtract 4: ${a * innerSq - 4}. Divide by 2: ${result}.`, pedagogicalRationale: 'Final division.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Evaluate the entire numerator before dividing by 2.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Numerator: ${a}(${inner})^2 - 4 = ${a * innerSq} - 4 = ${num}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `Divide by 2: ${num} / 2 = ${result}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(result);
      return {
        statement: {
          promptText: 'Evaluate the real number arithmetic expression:',
          expressionLatex: exprLatex,
          targetVariable: 'x',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: `${result}`,
        canonicalAnswerRaw: `${result}`,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 1, conceptual: difficulty, procedural: difficulty, computational: difficulty, reasoning: 1, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0101:OPS:DIFF${difficulty}_A${a}_B${b}`
      };
    }
  },

  'TMPL-GEN0101-VARIATION-APP': {
    id: 'TMPL-GEN0101-VARIATION-APP',
    familyId: 'FAM-GEN0101-VARIATION-APP',
    courseId: 'COURSE-GEN0101',
    primarySkillId: 'SKILL-GEN0101-004',
    name: 'Direct and Inverse Variation Modeling',
    description: 'Solve for variation constant k and unknown variable.',
    parameterSchema: [
      { name: 'k', type: 'INTEGER', min: 2, max: 10, description: 'Variation proportionality constant' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const k = params?.k ?? 6;
      let promptText = '';
      let exprLatex = '';
      let result = 0;
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Direct variation y = kx
        const x1 = 3;
        const y1 = k * x1;
        const x2 = 5;
        result = k * x2;
        promptText = `If y varies directly with x, and y = ${y1} when x = ${x1}, find y when x = ${x2}:`;
        exprLatex = 'y \\propto x';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Direct variation equation: y = k * x.', pedagogicalRationale: 'Direct variation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `k = y1 / x1 = ${y1} / ${x1} = ${k}.`, pedagogicalRationale: 'Constant extraction.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `y = ${k} * ${x2} = ${result}.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Since y varies directly as x, y = kx.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `k = ${y1} / ${x1} = ${k}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `y = ${k} * ${x2} = ${result}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Inverse variation y = k / x
        const x1 = 2;
        const y1 = k * 6;
        const totalK = x1 * y1;
        const x2 = 4;
        result = Math.round(totalK / x2);
        promptText = `If y varies inversely with x, and y = ${y1} when x = ${x1}, find y when x = ${x2}:`;
        exprLatex = 'y \\propto \\frac{1}{x}';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Inverse variation equation: y = k / x => k = x * y.', pedagogicalRationale: 'Inverse variation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `k = ${x1} * ${y1} = ${totalK}.`, pedagogicalRationale: 'Constant extraction.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `y = ${totalK} / ${x2} = ${result}.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Inverse variation formula is y = k / x (or xy = k).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `k = ${x1} * ${y1} = ${totalK}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `y = ${totalK} / ${x2} = ${result}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Joint variation z = k * x * y
        const x1 = 2;
        const y1 = 3;
        const z1 = k * x1 * y1;
        const x2 = 4;
        const y2 = 5;
        result = k * x2 * y2;
        promptText = `If z varies jointly with x and y, and z = ${z1} when x = ${x1} and y = ${y1}, find z when x = ${x2} and y = ${y2}:`;
        exprLatex = 'z \\propto xy';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Joint variation equation: z = k * x * y.', pedagogicalRationale: 'Joint variation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `k = ${z1} / (${x1} * ${y1}) = ${k}.`, pedagogicalRationale: 'Constant extraction.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `z = ${k} * ${x2} * ${y2} = ${result}.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Joint variation formula: z = k * x * y.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Find k: k = ${z1} / (${x1} * ${y1}) = ${k}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `z = ${k} * ${x2} * ${y2} = ${result}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Inverse square law y = k / x^2
        const x1 = 2;
        const y1 = 36;
        const totalK = y1 * (x1 * x1); // 144
        const x2 = 6;
        result = Math.round(totalK / (x2 * x2)); // 4
        promptText = `If y varies inversely as the square of x, and y = ${y1} when x = ${x1}, find y when x = ${x2}:`;
        exprLatex = 'y \\propto \\frac{1}{x^{2}}';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Inverse-square variation equation: y = k / x^2 => k = y * x^2.', pedagogicalRationale: 'Inverse square.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `k = ${y1} * (${x1}^2) = ${totalK}.`, pedagogicalRationale: 'Constant extraction.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `y = ${totalK} / (${x2}^2) = ${result}.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Inverse square law formula: y = k / x^2.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `k = ${y1} * ${x1}^2 = ${totalK}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `y = ${totalK} / ${x2}^2 = ${result}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${result}`, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(result);
      return {
        statement: {
          promptText,
          expressionLatex: exprLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: `${result}`,
        canonicalAnswerRaw: `${result}`,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: 2, representation: 1, context: 2, multiStep: difficulty },
        structureSignature: `GEN0101:VARIATION:DIFF${difficulty}_K${k}`
      };
    }
  },

  'TMPL-GEN0101-QUADRATIC-ROOTS': {
    id: 'TMPL-GEN0101-QUADRATIC-ROOTS',
    familyId: 'FAM-GEN0101-QUADRATIC-ROOTS',
    courseId: 'COURSE-GEN0101',
    primarySkillId: 'SKILL-GEN0101-008',
    name: 'Quadratic Equation Solution by Factoring',
    description: 'Find roots of quadratic equation by factoring across difficulty tiers.',
    parameterSchema: [
      { name: 'r1', type: 'INTEGER', min: 1, max: 4, description: 'First integer root' },
      { name: 'r2', type: 'INTEGER', min: 2, max: 6, description: 'Second integer root' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const r1 = params?.r1 ?? 2;
      const r2 = params?.r2 ?? 5;
      let exprLatex = '';
      let ansLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Monic with positive integer roots: x^2 - (r1+r2)x + r1*r2 = 0
        const b = -(r1 + r2);
        const c = r1 * r2;
        ansLatex = `x = ${r1}, ${r2}`;
        exprLatex = `x^{2} ${b}x + ${c} = 0`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Find factors of ${c} that sum to ${b}.`, pedagogicalRationale: 'Factoring.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Factor as (x - ${r1})(x - ${r2}) = 0.`, pedagogicalRationale: 'Factorization.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Roots are x = ${r1} and x = ${r2}.`, pedagogicalRationale: 'Root extraction.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Factor the quadratic equation (x - r1)(x - r2) = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Find two numbers whose product is ${c} and sum is ${-b}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Monic with mixed signs: (x - r1)(x + r2) = x^2 + (r2 - r1)x - r1*r2 = 0
        const b = r2 - r1;
        const c = -(r1 * r2);
        ansLatex = `x = ${r1}, -${r2}`;
        const bSign = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
        exprLatex = `x^{2} ${bSign}x ${c} = 0`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Find factors of ${c} that sum to ${b}.`, pedagogicalRationale: 'Mixed-sign factoring.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Factor as (x - ${r1})(x + ${r2}) = 0.`, pedagogicalRationale: 'Factorization.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Roots are x = ${r1} and x = -${r2}.`, pedagogicalRationale: 'Root extraction.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'The constant term is negative, so the factors have opposite signs.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `(x - ${r1})(x + ${r2}) = 0.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Non-monic leading coefficient 2: (2x - r1)(x - r2) = 2x^2 - (r1 + 2*r2)x + r1*r2 = 0
        const b = -(r1 + 2 * r2);
        const c = r1 * r2;
        ansLatex = `x = \\frac{${r1}}{2}, ${r2}`;
        exprLatex = `2x^{2} ${b}x + ${c} = 0`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Non-monic quadratic: factor by grouping (ac method).', pedagogicalRationale: 'Non-monic factoring.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Factor as (2x - ${r1})(x - ${r2}) = 0.`, pedagogicalRationale: 'Factorization.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Roots are x = ${r1}/2 and x = ${r2}.`, pedagogicalRationale: 'Root extraction.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'The leading coefficient is 2. Factor into (2x - p)(x - q).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `(2x - ${r1})(x - ${r2}) = 0.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Difference of squares with leading coefficient: 4x^2 - a^2 = 0
        const aVal = 2 * r1 + 1;
        const aSq = aVal * aVal;
        ansLatex = `x = \\pm \\frac{${aVal}}{2}`;
        exprLatex = `4x^{2} - ${aSq} = 0`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Recognize difference of squares: (2x)^2 - ${aVal}^2 = 0.`, pedagogicalRationale: 'Difference of squares.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Factor as (2x - ${aVal})(2x + ${aVal}) = 0.`, pedagogicalRationale: 'Factorization.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Roots are x = +${aVal}/2 and x = -${aVal}/2.`, pedagogicalRationale: 'Roots.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Notice this is a difference of squares: (2x)^2 - a^2 = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `(2x - ${aVal})(2x + ${aVal}) = 0.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(Math.max(r1, r2));
      return {
        statement: {
          promptText: 'Solve the quadratic equation for its real roots:',
          expressionLatex: exprLatex,
          targetVariable: 'x',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0101:QUAD:DIFF${difficulty}_R1_${r1}_R2_${r2}`
      };
    }
  },

  'TMPL-GEN0101-RADICAL-SIMPLIFY': {
    id: 'TMPL-GEN0101-RADICAL-SIMPLIFY',
    familyId: 'FAM-GEN0101-RADICAL-SIMPLIFY',
    courseId: 'COURSE-GEN0101',
    primarySkillId: 'SKILL-GEN0101-006',
    name: 'Radical Simplification and Extraction',
    description: 'Simplify square root expressions across difficulty tiers.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 5, description: 'Square root factor coefficient' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 3;
      let exprLatex = '';
      let ansLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Simple integer radical with prime 2: sqrt(2 * a^2) = a * sqrt(2)
        const radicand = 2 * a * a;
        exprLatex = `\\sqrt{${radicand}}`;
        ansLatex = `${a}\\sqrt{2}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Extract largest perfect square factor ${a*a} from ${radicand}.`, pedagogicalRationale: 'Square extraction.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `sqrt(${radicand}) = sqrt(${a*a} * 2) = ${a}*sqrt(2).`, pedagogicalRationale: 'Radical extraction.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Factor the radicand to identify perfect square factors.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `${radicand} = ${a * a} * 2.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Distinct prime base 3: sqrt(3 * a^2)
        const radicand = 3 * a * a;
        exprLatex = `\\sqrt{${radicand}}`;
        ansLatex = `${a}\\sqrt{3}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Factor ${radicand} into ${a*a} * 3.`, pedagogicalRationale: 'Square extraction.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `sqrt(${radicand}) = ${a}*sqrt(3).`, pedagogicalRationale: 'Radical evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Extract the perfect square factor out of the radical.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `${radicand} = ${a * a} * 3.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Algebraic variable in radicand: sqrt(a^2 * x^3) = a*x*sqrt(x)
        const aSq = a * a;
        exprLatex = `\\sqrt{${aSq}x^{3}}`;
        ansLatex = `${a}x\\sqrt{x}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Separate perfect squares: ${aSq}x^3 = (${a}x)^2 * x.`, pedagogicalRationale: 'Algebraic radical.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `sqrt((${a}x)^2 * x) = ${a}x * sqrt(x).`, pedagogicalRationale: 'Variable extraction.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Factor x^3 as x^2 * x to pull x out of the square root.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `sqrt(${aSq} * x^2 * x) = ${a} * x * sqrt(x).`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Sum of like radicals: sqrt(2 * a^2) + sqrt(2 * (a+1)^2) = (2a + 1)*sqrt(2)
        const rad1 = 2 * a * a;
        const a2 = a + 1;
        const rad2 = 2 * a2 * a2;
        const sumCoeff = a + a2;
        exprLatex = `\\sqrt{${rad1}} + \\sqrt{${rad2}}`;
        ansLatex = `${sumCoeff}\\sqrt{2}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Simplify each radical: sqrt(${rad1}) = ${a}*sqrt(2) and sqrt(${rad2}) = ${a2}*sqrt(2).`, pedagogicalRationale: 'Radical simplification.' },
          { stepIndex: 2, phase: 'SIMPLIFICATION', actionDescription: `Combine like radicals: (${a} + ${a2})*sqrt(2) = ${sumCoeff}*sqrt(2).`, pedagogicalRationale: 'Summation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Simplify both square roots first, then combine like terms.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `${a}*sqrt(2) + ${a2}*sqrt(2).`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = multiply(constant(a), func('sqrt', constant(2)));
      return {
        statement: {
          promptText: 'Simplify the radical expression to its canonical form:',
          expressionLatex: exprLatex,
          targetVariable: 'x',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 1, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0101:RADICAL:DIFF${difficulty}_A${a}`
      };
    }
  },

  'TMPL-GEN0101-LINEAR-SYSTEMS': {
    id: 'TMPL-GEN0101-LINEAR-SYSTEMS',
    familyId: 'FAM-GEN0101-LINEAR-SYSTEMS',
    courseId: 'COURSE-GEN0101',
    primarySkillId: 'SKILL-GEN0101-009',
    name: 'Two-Variable Linear System Elimination Solution',
    description: 'Solve 2x2 linear system for x and y across difficulty tiers.',
    parameterSchema: [
      { name: 'x', type: 'INTEGER', min: 2, max: 5, description: 'True x solution value' },
      { name: 'y', type: 'INTEGER', min: 1, max: 4, description: 'True y solution value' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const xTrue = params?.x ?? 3;
      const yTrue = params?.y ?? 2;
      let exprLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Direct addition elimination: x + y = c1, x - y = c2
        const c1 = xTrue + yTrue;
        const c2 = xTrue - yTrue;
        exprLatex = `\\begin{cases} x + y = ${c1} \\\\ x - y = ${c2} \\end{cases}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Add the two equations directly to eliminate y: 2x = c1 + c2.', pedagogicalRationale: 'Direct elimination.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `2x = ${c1 + c2} => x = ${xTrue}.`, pedagogicalRationale: 'Solve x.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Substitute x = ${xTrue}: y = ${c1} - ${xTrue} = ${yTrue}.`, pedagogicalRationale: 'Solve y.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Add the two equations to eliminate y.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `2x = ${c1 + c2} => x = ${xTrue}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Single multiplier: 2x + y = c1, x - y = c2
        const c1 = 2 * xTrue + yTrue;
        const c2 = xTrue - yTrue;
        exprLatex = `\\begin{cases} 2x + y = ${c1} \\\\ x - y = ${c2} \\end{cases}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Add the two equations to eliminate y: 3x = c1 + c2.', pedagogicalRationale: 'Elimination.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `3x = ${c1 + c2} => x = ${xTrue}.`, pedagogicalRationale: 'Solve x.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Substitute x = ${xTrue}: y = ${xTrue} - ${c2} = ${yTrue}.`, pedagogicalRationale: 'Solve y.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Adding the equations eliminates y immediately.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `3x = ${c1 + c2} => x = ${xTrue}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Dual multiplier: 2x + 3y = c1, 3x - 2y = c2
        const c1 = 2 * xTrue + 3 * yTrue;
        const c2 = 3 * xTrue - 2 * yTrue;
        exprLatex = `\\begin{cases} 2x + 3y = ${c1} \\\\ 3x - 2y = ${c2} \\end{cases}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Multiply eq1 by 2 and eq2 by 3 to eliminate y.', pedagogicalRationale: 'Dual multiplier elimination.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `13x = ${2 * c1 + 3 * c2} => x = ${xTrue}.`, pedagogicalRationale: 'Solve x.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Substitute into eq1: 3y = ${c1} - 2(${xTrue}) => y = ${yTrue}.`, pedagogicalRationale: 'Solve y.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Multiply eq1 by 2 and eq2 by 3 to cancel y.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `13x = ${2 * c1 + 3 * c2} => x = ${xTrue}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: 3x + 5y = c1, 4x - 3y = c2
        const c1 = 3 * xTrue + 5 * yTrue;
        const c2 = 4 * xTrue - 3 * yTrue;
        exprLatex = `\\begin{cases} 3x + 5y = ${c1} \\\\ 4x - 3y = ${c2} \\end{cases}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Multiply eq1 by 3 and eq2 by 5 to eliminate y.', pedagogicalRationale: 'Elimination.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `29x = ${3 * c1 + 5 * c2} => x = ${xTrue}.`, pedagogicalRationale: 'Solve x.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Substitute into eq1: 5y = ${c1} - 3(${xTrue}) => y = ${yTrue}.`, pedagogicalRationale: 'Solve y.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Multiply eq1 by 3 and eq2 by 5 to eliminate y.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `29x = ${3 * c1 + 5 * c2} => x = ${xTrue}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `x = ${xTrue}, y = ${yTrue}`, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(xTrue);
      return {
        statement: {
          promptText: 'Solve the system of linear equations for x and y:',
          expressionLatex: exprLatex,
          targetVariable: 'x',
          independentVariable: 'y'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: `x = ${xTrue}, y = ${yTrue}`,
        canonicalAnswerRaw: `x = ${xTrue}, y = ${yTrue}`,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0101:SYSTEMS:DIFF${difficulty}_X${xTrue}_Y${yTrue}`
      };
    }
  },

  'TMPL-GEN0101-TRIG-TRIANGLE': {
    id: 'TMPL-GEN0101-TRIG-TRIANGLE',
    familyId: 'FAM-GEN0101-TRIG-TRIANGLE',
    courseId: 'COURSE-GEN0101',
    primarySkillId: 'SKILL-GEN0101-013',
    name: 'Right Triangle Elevation Trigonometric Calculation',
    description: 'Calculate unknown sides using trigonometric ratios across difficulty tiers.',
    parameterSchema: [
      { name: 'd', type: 'INTEGER', min: 10, max: 50, description: 'Base distance in meters' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const d = params?.d ?? 20;
      let promptText = '';
      let exprLatex = '';
      let ansLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: 45 degree angle: tan(45) = 1 => h = d
        const h = d;
        promptText = `A surveyor measures an angle of elevation of 45° to the top of a tower from a distance of ${d} m. Find the height h (in meters):`;
        exprLatex = `\\tan(45^{\\circ}) = \\frac{h}{${d}}`;
        ansLatex = `${h} \\text{ m}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'tan(45°) = Opposite / Adjacent = h / d.', pedagogicalRationale: 'Trig definition.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Since tan(45°) = 1, h = ${d} * 1 = ${h} m.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'tan(theta) = Opposite / Adjacent.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `tan(45°) = 1, so h = ${d} * 1.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: 30 degree angle using sine for hypotenuse: sin(30°) = 0.5 => L = 2h
        const h = 15;
        const L = 2 * h;
        promptText = `A cable rises at an angle of 30° to a height of ${h} m. Find the length L of the cable (in meters):`;
        exprLatex = `\\sin(30^{\\circ}) = \\frac{${h}}{L}`;
        ansLatex = `${L} \\text{ m}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'sin(30°) = Opposite / Hypotenuse = h / L.', pedagogicalRationale: 'Sine definition.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `L = ${h} / sin(30°) = ${h} / 0.5 = ${L} m.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'sin(theta) = Opposite / Hypotenuse.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `sin(30°) = 0.5 => L = ${h} / 0.5.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: 60 degree angle with cosine: cos(60°) = 0.5 => Adjacent = Hypotenuse * 0.5
        const L = 40;
        const adj = L * 0.5;
        promptText = `A ladder of length ${L} m leans against a vertical wall at an angle of 60° to the horizontal ground. Find the distance from the base of the ladder to the wall (in meters):`;
        exprLatex = `\\cos(60^{\\circ}) = \\frac{d}{${L}}`;
        ansLatex = `${adj} \\text{ m}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'cos(60°) = Adjacent / Hypotenuse = d / L.', pedagogicalRationale: 'Cosine ratio.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d = ${L} * cos(60°) = ${L} * 0.5 = ${adj} m.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'cos(theta) = Adjacent / Hypotenuse.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `cos(60°) = 0.5 => d = ${L} * 0.5.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: 3-4-5 Pythagorean Right Triangle with Tangent: tan(theta) = 3/4
        const base = 24;
        const height = (base * 3) / 4;
        promptText = `A triangular roof truss has a slope angle theta where tan(theta) = 3/4. For a horizontal span of ${base} m, calculate the vertical rise h (in meters):`;
        exprLatex = `\\tan(\\theta) = \\frac{3}{4} = \\frac{h}{${base}}`;
        ansLatex = `${height} \\text{ m}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Ratio formulation: tan(theta) = h / base = 3/4.', pedagogicalRationale: 'Ratio analysis.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `h = ${base} * (3/4) = ${height} m.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'tan(theta) = Rise / Run.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `h = ${base} * (3/4).`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText,
          expressionLatex: exprLatex,
          targetVariable: 'h',
          independentVariable: 'd',
          physicalUnits: 'm'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: 2, representation: 2, context: 3, multiStep: difficulty },
        structureSignature: `GEN0101:TRIG_TRI:DIFF${difficulty}_D${d}`
      };
    }
  },

  'TMPL-GEN0101-PARTIAL-FRACTIONS': {
    id: 'TMPL-GEN0101-PARTIAL-FRACTIONS',
    familyId: 'FAM-GEN0101-PARTIAL-FRACTIONS',
    courseId: 'COURSE-GEN0101',
    primarySkillId: 'SKILL-GEN0101-003',
    name: 'Partial Fraction Decomposition for Distinct Linear Factors',
    description: 'Decompose rational expressions into partial fractions across difficulty tiers.',
    parameterSchema: [
      { name: 'offset', type: 'INTEGER', min: 1, max: 3, description: 'Factor offset coefficient' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let exprLatex = '';
      let ansLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: 1 / ((x - 1)(x - 2)) = -1/(x - 1) + 1/(x - 2)
        exprLatex = '\\frac{1}{(x - 1)(x - 2)}';
        ansLatex = '\\frac{-1}{x - 1} + \\frac{1}{x - 2}';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Formulate: 1 / ((x-1)(x-2)) = A/(x-1) + B/(x-2).', pedagogicalRationale: 'Partial fractions.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Heaviside cover-up: A = -1, B = 1.', pedagogicalRationale: 'Cover-up method.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Set up A/(x - 1) + B/(x - 2).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: '1 = A(x - 2) + B(x - 1). Let x = 1 for A, x = 2 for B.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: x / ((x - 1)(x - 2)) = -1/(x - 1) + 2/(x - 2)
        exprLatex = '\\frac{x}{(x - 1)(x - 2)}';
        ansLatex = '\\frac{-1}{x - 1} + \\frac{2}{x - 2}';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Formulate: x / ((x-1)(x-2)) = A/(x-1) + B/(x-2).', pedagogicalRationale: 'Partial fractions.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'x = A(x-2) + B(x-1). At x=1 => 1 = -A => A = -1. At x=2 => 2 = B => B = 2.', pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Set up x / ((x - 1)(x - 2)) = A/(x - 1) + B/(x - 2).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'x = A(x - 2) + B(x - 1). At x=1, A = -1. At x=2, B = 2.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: (2x + 3) / ((x + 1)(x + 2)) = 1/(x + 1) + 1/(x + 2)
        exprLatex = '\\frac{2x + 3}{(x + 1)(x + 2)}';
        ansLatex = '\\frac{1}{x + 1} + \\frac{1}{x + 2}';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Formulate: (2x+3)/((x+1)(x+2)) = A/(x+1) + B/(x+2).', pedagogicalRationale: 'Decomposition.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: '2x+3 = A(x+2) + B(x+1). At x=-1 => 1 = A. At x=-2 => -1 = -B => B = 1.', pedagogicalRationale: 'Solve A and B.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Decompose into A/(x + 1) + B/(x + 2).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: '2x + 3 = A(x + 2) + B(x + 1).', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: 1 / (x(x^2 - 1))
        exprLatex = '\\frac{1}{x\\left(x^{2} - 1\\right)}';
        ansLatex = '-\\frac{1}{x} + \\frac{1}{2(x - 1)} + \\frac{1}{2(x + 1)}';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Factor denominator: x(x-1)(x+1) -> 3 distinct linear factors.', pedagogicalRationale: 'Denominator factoring.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'A/x + B/(x-1) + C/(x+1). A = -1, B = 1/2, C = 1/2.', pedagogicalRationale: 'Heaviside cover-up.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Factor x^2 - 1 into (x - 1)(x + 1) for 3 linear terms.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: '1/(x(x-1)(x+1)) = A/x + B/(x-1) + C/(x+1).', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText: 'Decompose the rational expression into partial fractions:',
          expressionLatex: exprLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 3, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 3, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0101:PARTIAL_FRAC:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0101-WORD-PROBLEMS': {
    id: 'TMPL-GEN0101-WORD-PROBLEMS',
    familyId: 'FAM-GEN0101-WORD-PROBLEMS',
    courseId: 'COURSE-GEN0101',
    primarySkillId: 'SKILL-GEN0101-007',
    name: 'Chemical Solution Concentration Mixture Modeling',
    description: 'Solve for final concentration or added volume across difficulty tiers.',
    parameterSchema: [
      { name: 'v1', type: 'INTEGER', min: 10, max: 50, description: 'First solution volume in liters' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const v1 = params?.v1 ?? 20;
      let promptText = '';
      let exprLatex = '';
      let ansLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Standard 2-solution mixture: v1 L of 10% + 30 L of 20%
        const c1 = 0.10;
        const v2 = 30;
        const c2 = 0.20;
        const totalSolute = c1 * v1 + c2 * v2;
        const totalVolume = v1 + v2;
        const pct = Math.round((totalSolute / totalVolume) * 100);
        promptText = `A chemical engineer mixes ${v1} liters of a 10% acid solution with ${v2} liters of a 20% acid solution. Find the resulting concentration percentage (%):`;
        exprLatex = 'C_{f} = \\frac{C_{1}V_{1} + C_{2}V_{2}}{V_{1} + V_{2}}';
        ansLatex = `${pct}%`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Total solute = C1*V1 + C2*V2.', pedagogicalRationale: 'Mixture balance.' },
          { stepIndex: 2, phase: 'SIMPLIFICATION', actionDescription: `Cf = ${totalSolute} / ${totalVolume} = ${pct}%.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Calculate total pure acid divided by total volume.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Solute = 0.10*${v1} + 0.20*${v2} = ${totalSolute} L. Total volume = ${totalVolume} L.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Dilution with pure water (0% acid)
        const vWater = 20;
        const totalVol = v1 + vWater;
        const solute = 0.30 * v1;
        const pct = Math.round((solute / totalVol) * 100);
        promptText = `${v1} liters of a 30% salt solution is diluted by adding ${vWater} liters of pure water (0% salt). Find the new concentration percentage (%):`;
        exprLatex = 'C_{f} = \\frac{C_{1}V_{1}}{V_{1} + V_{\\text{water}}}';
        ansLatex = `${pct}%`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Pure water adds 0 solute.', pedagogicalRationale: 'Dilution.' },
          { stepIndex: 2, phase: 'SIMPLIFICATION', actionDescription: `Cf = ${solute} / ${totalVol} = ${pct}%.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Water adds volume but zero solute: Solute = 0.30 * V1.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Solute = 0.30*${v1} = ${solute} L. Total volume = ${totalVol} L.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Adding pure acid (100%) to strengthen solution
        const vPure = 10;
        const totalVol = v1 + vPure;
        const solute = 0.15 * v1 + 1.00 * vPure;
        const pct = Math.round((solute / totalVol) * 100);
        promptText = `How concentrated (%) is a mixture made by adding ${vPure} liters of pure 100% acid to ${v1} liters of a 15% acid solution?`;
        exprLatex = 'C_{f} = \\frac{C_{1}V_{1} + 1.00V_{\\text{pure}}}{V_{1} + V_{\\text{pure}}}';
        ansLatex = `${pct}%`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Pure acid is 100% (solute = 1.00 * V_pure).', pedagogicalRationale: 'Strengthening.' },
          { stepIndex: 2, phase: 'SIMPLIFICATION', actionDescription: `Solute = ${solute} L. Cf = ${solute} / ${totalVol} = ${pct}%.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Pure acid contributes 100% of its volume as pure solute.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Total solute = 0.15*${v1} + ${vPure} = ${solute} L. Total volume = ${totalVol} L.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: 3-component mixture
        const v2 = 20;
        const v3 = 10;
        const totalVol = v1 + v2 + v3;
        const totalSolute = 0.10 * v1 + 0.25 * v2 + 0.40 * v3;
        const pct = Math.round((totalSolute / totalVol) * 100);
        promptText = `Three batches of chemical solution are blended: ${v1} L at 10%, ${v2} L at 25%, and ${v3} L at 40%. Find the final concentration percentage (%):`;
        exprLatex = 'C_{f} = \\frac{C_{1}V_{1} + C_{2}V_{2} + C_{3}V_{3}}{V_{1} + V_{2} + V_{3}}';
        ansLatex = `${pct}%`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Three-component conservation of solute.', pedagogicalRationale: 'Multi-component mixture.' },
          { stepIndex: 2, phase: 'SIMPLIFICATION', actionDescription: `Solute = ${totalSolute} L. Volume = ${totalVol} L. Cf = ${pct}%.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Sum the solute from all 3 batches and divide by the total volume.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Solute = 0.10*${v1} + 0.25*${v2} + 0.40*${v3} = ${totalSolute} L. Total volume = ${totalVol} L.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText,
          expressionLatex: exprLatex,
          targetVariable: 'C_f',
          independentVariable: 'V',
          physicalUnits: '%'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 2, representation: 1, context: 3, multiStep: difficulty },
        structureSignature: `GEN0101:MIXTURE:DIFF${difficulty}_V1_${v1}`
      };
    }
  },
  // =========================================================================
  // COURSE: GEN 0102 (Calculus 1 — Complete 15 Skills)
  // =========================================================================
  'TMPL-LIMIT-POLY-CANCEL': {
    id: 'TMPL-LIMIT-POLY-CANCEL',
    familyId: 'FAM-GEN0102-LIMITS-ALG',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-001',
    name: 'Algebraic Limit Removable Discontinuity Cancellation',
    description: 'Evaluate indeterminate limits using factoring, conjugates, and algebraic cancellation across difficulty tiers.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 7, defaultValue: 3, description: 'Limit evaluation point' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const aVal = params?.a ?? 3;
      let exprLatex = '';
      let ansLatex = '';
      let rawAst: any;
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Linear cancellation: (2x - 2a) / (x - a) -> 2
        const ans = 2;
        rawAst = constant(ans);
        exprLatex = `\\lim_{x \\to ${aVal}} \\frac{2x - ${2 * aVal}}{x - ${aVal}}`;
        ansLatex = `${ans}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Direct substitution yields 0/0 indeterminate form.', intermediateExpressionLatex: '\\frac{0}{0}', pedagogicalRationale: 'Indeterminate limit check.' },
          { stepIndex: 2, phase: 'DECOMPOSITION', actionDescription: `Factor out constant 2 from numerator: 2(x - ${aVal}).`, intermediateExpressionLatex: `\\lim_{x \\to ${aVal}} \\frac{2(x - ${aVal})}{x - ${aVal}}`, pedagogicalRationale: 'Common factor.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Cancel (x - a) factor: limit evaluates to 2.', intermediateExpressionLatex: `${ans}`, pedagogicalRationale: 'Limit evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Direct substitution gives 0/0. Factor 2 out of the numerator.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `2x - ${2 * aVal} = 2(x - ${aVal}).`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `Cancel (x - ${aVal}) to get ${ans}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${ans}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${ans}`, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Difference of squares: (x^2 - a^2) / (x - a) -> 2a
        const a2 = aVal * aVal;
        const ans = 2 * aVal;
        rawAst = constant(ans);
        exprLatex = `\\lim_{x \\to ${aVal}} \\frac{x^{2} - ${a2}}{x - ${aVal}}`;
        ansLatex = `${ans}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Direct substitution yields 0/0 indeterminate form.', intermediateExpressionLatex: '\\frac{0}{0}', pedagogicalRationale: 'Indeterminate limit check.' },
          { stepIndex: 2, phase: 'DECOMPOSITION', actionDescription: `Factor difference of squares: (x^2 - ${a2}) = (x - ${aVal})(x + ${aVal}).`, intermediateExpressionLatex: `\\lim_{x \\to ${aVal}} \\frac{(x - ${aVal})(x + ${aVal})}{x - ${aVal}}`, pedagogicalRationale: 'Factoring numerator.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Cancel (x - ${aVal}) factor: limit reduces to (x + ${aVal}) => ${aVal} + ${aVal} = ${ans}.`, intermediateExpressionLatex: `${ans}`, pedagogicalRationale: 'Limit evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Direct substitution gives 0/0. Factor the numerator.', revealsFinalAnswer: false },
          { level: 2, category: 'FORMULA', text: `x^2 - ${a2} = (x - ${aVal})(x + ${aVal}).`, revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: `Cancel (x - ${aVal}) to get (x + ${aVal}).`, revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: `Substitute x = ${aVal}: ${aVal} + ${aVal} = ${ans}.`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${ans}`, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Trinomial factoring: (x^2 + (b-a)x - a*b) / (x - a) -> a + b
        const bVal = aVal + 2;
        const diffCoeff = bVal - aVal; // 2
        const prod = aVal * bVal;
        const ans = aVal + bVal;
        rawAst = constant(ans);
        exprLatex = `\\lim_{x \\to ${aVal}} \\frac{x^{2} + ${diffCoeff}x - ${prod}}{x - ${aVal}}`;
        ansLatex = `${ans}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Direct substitution yields 0/0.', intermediateExpressionLatex: '\\frac{0}{0}', pedagogicalRationale: 'Indeterminate form.' },
          { stepIndex: 2, phase: 'DECOMPOSITION', actionDescription: `Factor quadratic numerator: (x - ${aVal})(x + ${bVal}).`, intermediateExpressionLatex: `\\lim_{x \\to ${aVal}} \\frac{(x - ${aVal})(x + ${bVal})}{x - ${aVal}}`, pedagogicalRationale: 'Quadratic factoring.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Cancel (x - ${aVal}): evaluate ${aVal} + ${bVal} = ${ans}.`, intermediateExpressionLatex: `${ans}`, pedagogicalRationale: 'Limit evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Factor the quadratic numerator into (x - a)(x + b).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `(x^2 + ${diffCoeff}x - ${prod}) = (x - ${aVal})(x + ${bVal}).`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `Cancel (x - ${aVal}) and evaluate at x = ${aVal}: ${aVal} + ${bVal} = ${ans}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${ans}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${ans}`, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Difference of cubes: (x^3 - a^3) / (x - a) -> 3*a^2
        const a3 = aVal * aVal * aVal;
        const ans = 3 * aVal * aVal;
        rawAst = constant(ans);
        exprLatex = `\\lim_{x \\to ${aVal}} \\frac{x^{3} - ${a3}}{x - ${aVal}}`;
        ansLatex = `${ans}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Direct substitution yields 0/0. Factor difference of cubes: x^3 - a^3 = (x - a)(x^2 + ax + a^2).', intermediateExpressionLatex: `\\lim_{x \\to ${aVal}} \\frac{(x - ${aVal})(x^2 + ${aVal}x + ${aVal * aVal})}{x - ${aVal}}`, pedagogicalRationale: 'Difference of cubes.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Cancel (x - ${aVal}): evaluate x^2 + ${aVal}x + ${aVal * aVal} at x = ${aVal}.`, intermediateExpressionLatex: `x^2 + ${aVal}x + ${aVal * aVal}`, pedagogicalRationale: 'Cancellation.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `${aVal}^2 + ${aVal}^2 + ${aVal}^2 = 3(${aVal}^2) = ${ans}.`, intermediateExpressionLatex: `${ans}`, pedagogicalRationale: 'Limit evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Factor difference of cubes: x^3 - a^3 = (x - a)(x^2 + ax + a^2).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Cancel (x - ${aVal}) to get x^2 + ${aVal}x + ${aVal * aVal}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: `Substitute x = ${aVal}: ${aVal}^2 + ${aVal}^2 + ${aVal}^2 = ${ans}.`, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: `${ans}`, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: `${ans}`, revealsFinalAnswer: true }
        ];
      }

      return {
        statement: {
          promptText: 'Evaluate the algebraic limit:',
          expressionLatex: exprLatex,
          targetVariable: 'L',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `LIMIT_CANCEL:DIFF${difficulty}_A${aVal}`
      };
    }
  },
  'TMPL-POWER-POLY-STD': {
    id: 'TMPL-POWER-POLY-STD',
    familyId: 'FAM-GEN0102-POWER-STD',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-002',
    name: 'Polynomial Power Rule Differentiation Template',
    description: 'Differentiate standard polynomial expressions.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 7, description: 'Leading polynomial coefficient' },
      { name: 'b', type: 'INTEGER', min: 1, max: 8, description: 'Secondary polynomial coefficient' },
      { name: 'c', type: 'INTEGER', min: 1, max: 6, description: 'Tertiary polynomial coefficient' },
      { name: 'd', type: 'INTEGER', min: 1, max: 5, description: 'Quaternary polynomial coefficient' },
      { name: 'variant', type: 'CHOICE', choices: [0, 1, 2], description: 'Structural form variation' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? (Math.floor(Math.random() * 6) + 2);
      const b = params?.b ?? (Math.floor(Math.random() * 7) + 2);
      const c = params?.c ?? (Math.floor(Math.random() * 5) + 1);
      const d = params?.d ?? (Math.floor(Math.random() * 4) + 1);
      const variant = Number(params?.variant ?? 0) % 3;

      const promptText = 'Differentiate the polynomial function with respect to x:';
      let expressionLatex = '';
      let rawAst: any;
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];
      let canonicalAnswerLatex = '';
      let canonicalAnswerRaw = '';

      if (difficulty <= 1) {
        // Level 1 rotates between quadratic, cubic, and sparse quartic forms
        // so same-difficulty requests do not only change coefficients.
        const useCubic = variant === 1 || (variant === 0 && a % 2 === 0);
        if (variant === 2) {
          expressionLatex = `y = ${a}x^{4} - ${b}`;
          rawAst = add(multiply(constant(a), power(variable('x'), constant(4))), constant(-b));
          canonicalAnswerLatex = `${4 * a}x^{3}`;
          canonicalAnswerRaw = `${4 * a}*x^3`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'EXECUTION', actionDescription: `Differentiate the sparse quartic: d/dx[${a}x^4 - ${b}] = ${4 * a}x^3.`, pedagogicalRationale: 'Power rule with a constant term.' }
          ];
        } else if (useCubic) {
          expressionLatex = `y = ${a}x^{3} + ${b}x`;
          rawAst = add(multiply(constant(a), power(variable('x'), constant(3))), multiply(constant(b), variable('x')));
          canonicalAnswerLatex = `${3 * a}x^{2} + ${b}`;
          canonicalAnswerRaw = `${3 * a}*x^2 + ${b}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'EXECUTION', actionDescription: `Differentiate term-by-term: d/dx[${a}x^3 + ${b}x] = ${3 * a}x^2 + ${b}.`, pedagogicalRationale: 'Power rule.' }
          ];
        } else {
          expressionLatex = `y = ${a}x^{2} + ${b}x`;
          rawAst = add(multiply(constant(a), power(variable('x'), constant(2))), multiply(constant(b), variable('x')));
          canonicalAnswerLatex = `${2 * a}x + ${b}`;
          canonicalAnswerRaw = `${2 * a}*x + ${b}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'EXECUTION', actionDescription: `Differentiate term-by-term: d/dx[${a}x^2 + ${b}x] = ${2 * a}x + ${b}.`, pedagogicalRationale: 'Power rule.' }
          ];
        }
      } else if (difficulty === 2) {
        // Level 2 alternates cubic, quartic-with-constant, and mixed powers.
        if (variant === 1) {
          expressionLatex = `y = ${a}x^{4} - ${b}x + ${c}`;
          rawAst = add(multiply(constant(a), power(variable('x'), constant(4))), add(multiply(constant(-b), variable('x')), constant(c)));
          canonicalAnswerLatex = `${4 * a}x^{3} - ${b}`;
          canonicalAnswerRaw = `${4 * a}*x^3 - ${b}`;
        } else if (variant === 2) {
          expressionLatex = `y = ${a}x^{2} + ${b}x^{3} + ${c}`;
          rawAst = add(multiply(constant(a), power(variable('x'), constant(2))), add(multiply(constant(b), power(variable('x'), constant(3))), constant(c)));
          canonicalAnswerLatex = `${2 * a}x + ${3 * b}x^{2}`;
          canonicalAnswerRaw = `${2 * a}*x + ${3 * b}*x^2`;
        } else {
          expressionLatex = `y = ${a}x^{3} - ${b}x^{2} + ${c}x`;
          rawAst = add(multiply(constant(a), power(variable('x'), constant(3))), add(multiply(constant(-b), power(variable('x'), constant(2))), multiply(constant(c), variable('x'))));
          canonicalAnswerLatex = `${3 * a}x^{2} - ${2 * b}x + ${c}`;
          canonicalAnswerRaw = `${3 * a}*x^2 - ${2 * b}*x + ${c}`;
        }
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: `Differentiate term-by-term to obtain ${canonicalAnswerLatex}.`, pedagogicalRationale: 'Term-by-term power rule.' }
        ];
      } else if (difficulty === 3) {
        // Level 3 alternates a full quartic and a cubic-plus-constant form.
        if (variant === 1) {
          expressionLatex = `y = ${a}x^{5} - ${b}x^{2} + ${c}`;
          rawAst = add(multiply(constant(a), power(variable('x'), constant(5))), add(multiply(constant(-b), power(variable('x'), constant(2))), constant(c)));
          canonicalAnswerLatex = `${5 * a}x^{4} - ${2 * b}x`;
          canonicalAnswerRaw = `${5 * a}*x^4 - ${2 * b}*x`;
        } else {
          expressionLatex = `y = ${a}x^{4} + ${b}x^{3} - ${c}x^{2} + ${d}x`;
          rawAst = add(multiply(constant(a), power(variable('x'), constant(4))), add(multiply(constant(b), power(variable('x'), constant(3))), add(multiply(constant(-c), power(variable('x'), constant(2))), multiply(constant(d), variable('x')))));
          canonicalAnswerLatex = `${4 * a}x^{3} + ${3 * b}x^{2} - ${2 * c}x + ${d}`;
          canonicalAnswerRaw = `${4 * a}*x^3 + ${3 * b}*x^2 - ${2 * c}*x + ${d}`;
        }
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: `Differentiate the selected polynomial form to obtain ${canonicalAnswerLatex}.`, pedagogicalRationale: 'Higher-degree power rule.' }
        ];
      } else {
        // Level 4: 5-term quintic polynomial
        expressionLatex = `y = ${a}x^{5} - ${b}x^{4} + ${c}x^{3} - ${d}x^{2} + ${a + b}x`;
        rawAst = add(
          multiply(constant(a), power(variable('x'), constant(5))),
          add(
            multiply(constant(-b), power(variable('x'), constant(4))),
            add(
              multiply(constant(c), power(variable('x'), constant(3))),
              add(multiply(constant(-d), power(variable('x'), constant(2))), multiply(constant(a + b), variable('x')))
            )
          )
        );
        canonicalAnswerLatex = `${5 * a}x^{4} - ${4 * b}x^{3} + ${3 * c}x^{2} - ${2 * d}x + ${a + b}`;
        canonicalAnswerRaw = `${5 * a}*x^4 - ${4 * b}*x^3 + ${3 * c}*x^2 - ${2 * d}*x + ${a + b}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: `Differentiate 5th-degree polynomial: ${5 * a}x^4 - ${4 * b}x^3 + ${3 * c}x^2 - ${2 * d}x + ${a + b}.`, pedagogicalRationale: 'Extended power rule polynomial differentiation.' }
        ];
      }

      hints = [
        { level: 1, category: 'RECOGNITION', text: 'Recall the Power Rule: d/dx[x^n] = n*x^(n-1).', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: 'Differentiate each term individually and preserve positive/negative signs.', revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: 'Multiply each coefficient by the term power and decrease each exponent by 1.', revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `Resulting derivative: ${canonicalAnswerLatex}`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${canonicalAnswerLatex}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 1, conceptual: difficulty, procedural: difficulty, computational: difficulty, reasoning: 1, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `POWER_POLY:DIFF${difficulty}_A${a}_B${b}_C${c}_D${d}`
      };
    }
  },

  'TMPL-PRODUCT-POLY-TRIG': {
    id: 'TMPL-PRODUCT-POLY-TRIG',
    familyId: 'FAM-GEN0102-PRODUCT-STD',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-003',
    name: 'Polynomial and Trigonometric Product Rule Template',
    description: 'Differentiate y = x^2 * sin(x).',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 6, description: 'Polynomial multiplier' },
      { name: 'b', type: 'INTEGER', min: 1, max: 6, description: 'Secondary constant offset' },
      { name: 'variant', type: 'CHOICE', choices: [0, 1, 2], description: 'Product structure variation' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? (Math.floor(Math.random() * 5) + 2);
      const b = params?.b ?? (Math.floor(Math.random() * 5) + 1);
      const variant = Number(params?.variant ?? 0) % 3;
      const isCos = ((a + variant) % 2 === 0);
      const trigFunc = isCos ? 'cos' : 'sin';
      const trigLatex = isCos ? '\\cos(x)' : '\\sin(x)';

      const promptText = 'Differentiate the product function with respect to x:';
      let expressionLatex = '';
      let rawAst: any;
      let canonicalAnswerLatex = '';
      let canonicalAnswerRaw = '';
      let reasoningTrace: StructuredReasoningTraceStep[];

      // Rotate the structural level within a difficulty band. A learner can
      // request another Level 2 problem and receive a linear, quadratic, or
      // composite polynomial factor rather than a coefficient-only clone.
      const shapeLevel = Math.min(3, Math.max(0, (difficulty <= 1 ? 0 : difficulty - 1) + (variant === 1 ? 1 : variant === 2 ? -1 : 0)));
      if (shapeLevel === 0) {
        // Level 1: y = a*x*trig(x)
        expressionLatex = `y = ${a}x ${trigLatex}`;
        rawAst = multiply(multiply(constant(a), variable('x')), func(trigFunc, variable('x')));
        if (isCos) {
          canonicalAnswerLatex = `${a}\\cos(x) - ${a}x\\sin(x)`;
          canonicalAnswerRaw = `${a}*cos(x) - ${a}*x*sin(x)`;
        } else {
          canonicalAnswerLatex = `${a}\\sin(x) + ${a}x\\cos(x)`;
          canonicalAnswerRaw = `${a}*sin(x) + ${a}*x*cos(x)`;
        }
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply Product Rule: (u*v)\' = u\'v + uv\'.', pedagogicalRationale: 'Product rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `u = ${a}x => u\' = ${a}; v = ${trigFunc}(x). Assembly: ${canonicalAnswerRaw}.`, pedagogicalRationale: 'Product differentiation.' }
        ];
      } else if (shapeLevel === 1) {
        // Level 2: y = a*x^2 * trig(x)
        expressionLatex = `y = ${a}x^{2} ${trigLatex}`;
        rawAst = multiply(multiply(constant(a), power(variable('x'), constant(2))), func(trigFunc, variable('x')));
        if (isCos) {
          canonicalAnswerLatex = `${2 * a}x\\cos(x) - ${a}x^{2}\\sin(x)`;
          canonicalAnswerRaw = `${2 * a}*x*cos(x) - ${a}*x^2*sin(x)`;
        } else {
          canonicalAnswerLatex = `${2 * a}x\\sin(x) + ${a}x^{2}\\cos(x)`;
          canonicalAnswerRaw = `${2 * a}*x*sin(x) + ${a}*x^2*cos(x)`;
        }
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply Product Rule: (u*v)\' = u\'v + uv\'.', pedagogicalRationale: 'Product rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `u = ${a}x^2 => u\' = ${2 * a}x; v = ${trigFunc}(x). Assembly: ${canonicalAnswerRaw}.`, pedagogicalRationale: 'Product differentiation.' }
        ];
      } else if (shapeLevel === 2) {
        // Level 3: y = (ax^2 + b)*trig(x)
        expressionLatex = `y = \\left(${a}x^{2} + ${b}\\right) ${trigLatex}`;
        rawAst = multiply(add(multiply(constant(a), power(variable('x'), constant(2))), constant(b)), func(trigFunc, variable('x')));
        if (isCos) {
          canonicalAnswerLatex = `${2 * a}x\\cos(x) - \\left(${a}x^{2} + ${b}\\right)\\sin(x)`;
          canonicalAnswerRaw = `${2 * a}*x*cos(x) - (${a}*x^2 + ${b})*sin(x)`;
        } else {
          canonicalAnswerLatex = `${2 * a}x\\sin(x) + \\left(${a}x^{2} + ${b}\\right)\\cos(x)`;
          canonicalAnswerRaw = `${2 * a}*x*sin(x) + (${a}*x^2 + ${b})*cos(x)`;
        }
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply Product Rule: (u*v)\' = u\'v + uv\'.', pedagogicalRationale: 'Product rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `u = ${a}x^2 + ${b} => u\' = ${2 * a}x; v = ${trigFunc}(x). Assembly: ${canonicalAnswerRaw}.`, pedagogicalRationale: 'Product differentiation.' }
        ];
      } else {
        // Level 4: y = (ax^3 + bx)*trig(x)
        expressionLatex = `y = \\left(${a}x^{3} + ${b}x\\right) ${trigLatex}`;
        rawAst = multiply(add(multiply(constant(a), power(variable('x'), constant(3))), multiply(constant(b), variable('x'))), func(trigFunc, variable('x')));
        if (isCos) {
          canonicalAnswerLatex = `\\left(${3 * a}x^{2} + ${b}\\right)\\cos(x) - \\left(${a}x^{3} + ${b}x\\right)\\sin(x)`;
          canonicalAnswerRaw = `(${3 * a}*x^2 + ${b})*cos(x) - (${a}*x^3 + ${b}*x)*sin(x)`;
        } else {
          canonicalAnswerLatex = `\\left(${3 * a}x^{2} + ${b}\\right)\\sin(x) + \\left(${a}x^{3} + ${b}x\\right)\\cos(x)`;
          canonicalAnswerRaw = `(${3 * a}*x^2 + ${b})*sin(x) + (${a}*x^3 + ${b}*x)*cos(x)`;
        }
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply Product Rule: (u*v)\' = u\'v + uv\'.', pedagogicalRationale: 'Product rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `u = ${a}x^3 + ${b}x => u\' = ${3 * a}x^2 + ${b}; v = ${trigFunc}(x). Assembly: ${canonicalAnswerRaw}.`, pedagogicalRationale: 'Product differentiation.' }
        ];
      }

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Use the Product Rule: (u*v)\' = u\'v + uv\'.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: 'Identify u and v, then compute their individual derivatives.', revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: 'Substitute u, u\', v, and v\' into the product rule formula: u\'v + uv\'.', revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `Combined expression: ${canonicalAnswerLatex}`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${canonicalAnswerLatex}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: difficulty, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `PRODUCT_POLY_TRIG:DIFF${difficulty}_A${a}_B${b}_${trigFunc.toUpperCase()}`
      };
    }
  },

  'TMPL-QUOTIENT-POLY-POLY': {
    id: 'TMPL-QUOTIENT-POLY-POLY',
    familyId: 'FAM-GEN0102-QUOTIENT-STD',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-004',
    name: 'Rational Function Quotient Rule Template',
    description: 'Differentiate rational expressions.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 1, max: 5, description: 'Numerator offset' },
      { name: 'b', type: 'INTEGER', min: 2, max: 7, description: 'Denominator offset' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? (Math.floor(Math.random() * 4) + 1);
      const b = params?.b ?? (Math.floor(Math.random() * 5) + (a + 1));
      const diffCoeff = b - a;

      const promptText = 'Differentiate the rational function with respect to x:';
      let expressionLatex = '';
      let rawAst: any;
      let canonicalAnswerLatex = '';
      let canonicalAnswerRaw = '';
      let reasoningTrace: StructuredReasoningTraceStep[];

      if (difficulty <= 1) {
        // Level 1: y = x / (x + b)
        expressionLatex = `y = \\frac{x}{x + ${b}}`;
        rawAst = divide(variable('x'), add(variable('x'), constant(b)));
        canonicalAnswerLatex = `\\frac{${b}}{\\left(x + ${b}\\right)^{2}}`;
        canonicalAnswerRaw = `${b} / (x + ${b})^2`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply Quotient Rule: (u/v)\' = (u\'v - uv\') / v^2.', pedagogicalRationale: 'Quotient rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `u = x, v = x + ${b}. Numerator: 1*(x + ${b}) - x*1 = ${b}. Result: ${b} / (x + ${b})^2.`, pedagogicalRationale: 'Quotient simplification.' }
        ];
      } else if (difficulty === 2) {
        // Level 2: y = (x + a) / (x + b)
        expressionLatex = `y = \\frac{x + ${a}}{x + ${b}}`;
        rawAst = divide(add(variable('x'), constant(a)), add(variable('x'), constant(b)));
        canonicalAnswerLatex = `\\frac{${diffCoeff}}{\\left(x + ${b}\\right)^{2}}`;
        canonicalAnswerRaw = `${diffCoeff} / (x + ${b})^2`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply Quotient Rule: (u/v)\' = (u\'v - uv\') / v^2.', pedagogicalRationale: 'Quotient rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `u = x + ${a}, v = x + ${b}. Numerator: 1*(x + ${b}) - (x + ${a})*1 = ${diffCoeff}. Result: ${diffCoeff} / (x + ${b})^2.`, pedagogicalRationale: 'Quotient simplification.' }
        ];
      } else {
        // Level 3 & 4: y = (ax + b) / (x + 1)
        const c = 1;
        const det = a * c - b;
        expressionLatex = `y = \\frac{${a}x + ${b}}{x + ${c}}`;
        rawAst = divide(add(multiply(constant(a), variable('x')), constant(b)), add(variable('x'), constant(c)));
        canonicalAnswerLatex = `\\frac{${det}}{\\left(x + ${c}\\right)^{2}}`;
        canonicalAnswerRaw = `${det} / (x + ${c})^2`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply Quotient Rule: (u/v)\' = (u\'v - uv\') / v^2.', pedagogicalRationale: 'Quotient rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `u = ${a}x + ${b}, v = x + ${c}. Numerator: ${a}(x + ${c}) - (${a}x + ${b})*1 = ${det}. Result: ${det} / (x + ${c})^2.`, pedagogicalRationale: 'Quotient simplification.' }
        ];
      }

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Use Quotient Rule: (u/v)\' = (u\'v - uv\') / v^2.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: 'Identify numerator u and denominator v, then differentiate each.', revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: 'Substitute into (u\'v - uv\') / v^2 and simplify the numerator.', revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `Simplified quotient: ${canonicalAnswerLatex}`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${canonicalAnswerLatex}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: difficulty, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `QUOTIENT_POLY:DIFF${difficulty}_A${a}_B${b}`
      };
    }
  },

  'TMPL-CHAIN-POLY-STD': {
    id: 'TMPL-CHAIN-POLY-STD',
    familyId: 'FAM-GEN0102-CHAIN-POLY',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-005',
    name: 'Composite Polynomial Power Chain Rule Template',
    description: 'Differentiates composite polynomial expressions across difficulty tiers.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 5, description: 'Inner coefficient' },
      { name: 'c', type: 'INTEGER', min: 1, max: 6, description: 'Inner constant' },
      { name: 'p', type: 'INTEGER', min: 3, max: 7, description: 'Outer exponent' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 3;
      const c = params?.c ?? 4;
      const p = params?.p ?? 5;
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let rawAst: any;
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Linear inner function: y = (ax + c)^p => y' = p * a * (ax + c)^(p - 1)
        const totalCoeff = p * a;
        exprLatex = `y = \\left(${a}x + ${c}\\right)^{${p}}`;
        ansLatex = `${totalCoeff}\\left(${a}x + ${c}\\right)^{${p - 1}}`;
        ansRaw = `${totalCoeff}*( ${a}*x + ${c} )^${p - 1}`;
        rawAst = power(add(multiply(constant(a), variable('x')), constant(c)), constant(p));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Inner function u = ${a}x + ${c}, outer function u^${p}.`, pedagogicalRationale: 'Structural decomposition.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `du/dx = ${a}, d/du[u^${p}] = ${p}u^${p - 1}.`, pedagogicalRationale: 'Chain rule factors.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `y' = ${p} * ${a}(${a}x + ${c})^${p - 1} = ${totalCoeff}(${a}x + ${c})^${p - 1}.`, pedagogicalRationale: 'Assembly.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Let u = ax + c. Use d/dx[u^n] = n * u^(n-1) * du/dx.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `u = ${a}x + ${c}, so du/dx = ${a}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Quadratic binomial inner function: y = (ax^2 + c)^p => y' = 2ap * x * (ax^2 + c)^(p - 1)
        const totalCoeff = 2 * a * p;
        exprLatex = `y = \\left(${a}x^{2} + ${c}\\right)^{${p}}`;
        ansLatex = `${totalCoeff}x\\left(${a}x^{2} + ${c}\\right)^{${p - 1}}`;
        ansRaw = `${totalCoeff}*x*( ${a}*x^2 + ${c} )^${p - 1}`;
        rawAst = power(add(multiply(constant(a), power(variable('x'), constant(2))), constant(c)), constant(p));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Inner function u = ${a}x^2 + ${c}, outer function u^${p}.`, intermediateExpressionLatex: `u = ${a}x^{2} + ${c}`, pedagogicalRationale: 'Decomposition.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `du/dx = ${2 * a}x, d/du[u^${p}] = ${p}u^${p - 1}.`, intermediateExpressionLatex: `\\frac{du}{dx} = ${2 * a}x`, pedagogicalRationale: 'Chain rule.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `y' = ${p}(${a}x^2 + ${c})^${p - 1} * (${2 * a}x) = ${totalCoeff}x(${a}x^2 + ${c})^${p - 1}.`, intermediateExpressionLatex: ansLatex, pedagogicalRationale: 'Assembly.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Let u = ax^2 + c. Outer derivative is p*u^(p-1), inner is 2ax.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `du/dx = ${2 * a}x.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Full quadratic trinomial: y = (ax^2 + 2x + c)^p
        exprLatex = `y = \\left(${a}x^{2} + 2x + ${c}\\right)^{${p}}`;
        ansLatex = `${p}\\left(${2 * a}x + 2\\right)\\left(${a}x^{2} + 2x + ${c}\\right)^{${p - 1}}`;
        ansRaw = `${p}*( ${2 * a}*x + 2 )*( ${a}*x^2 + 2*x + ${c} )^${p - 1}`;
        rawAst = power(add(multiply(constant(a), power(variable('x'), constant(2))), add(multiply(constant(2), variable('x')), constant(c))), constant(p));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Inner function u = ${a}x^2 + 2x + ${c}.`, pedagogicalRationale: 'Trinomial inner function.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `du/dx = ${2 * a}x + 2.`, pedagogicalRationale: 'Inner derivative.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `y' = ${p}(${2 * a}x + 2)(${a}x^2 + 2x + ${c})^${p - 1}.`, pedagogicalRationale: 'Assembly.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Apply General Power Rule to a 3-term polynomial.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `du/dx = ${2 * a}x + 2.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Square root radical composite: y = sqrt(ax^2 + c)
        exprLatex = `y = \\sqrt{${a}x^{2} + ${c}}`;
        ansLatex = `\\frac{${a}x}{\\sqrt{${a}x^{2} + ${c}}}`;
        ansRaw = `(${a}*x) / sqrt(${a}*x^2 + ${c})`;
        rawAst = func('sqrt', add(multiply(constant(a), power(variable('x'), constant(2))), constant(c)));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Write as power: y = (${a}x^2 + ${c})^(1/2).`, pedagogicalRationale: 'Radical as fractional power.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d/dx = (1/2)(${a}x^2 + ${c})^(-1/2) * (${2 * a}x).`, pedagogicalRationale: 'Chain rule.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Simplify: (${a}x) / sqrt(${a}x^2 + ${c}).`, pedagogicalRationale: 'Simplification.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Rewrite \\sqrt{u} as u^(1/2).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `d/dx[\\sqrt{u}] = \\frac{u'}{2\\sqrt{u}}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      return {
        statement: {
          promptText: 'Differentiate the composite function with respect to x:',
          expressionLatex: exprLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 1, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `CHAIN:OUTER=POWER_POLY:DIFF${difficulty}_A${a}_C${c}`
      };
    }
  },

  'TMPL-CHAIN-POWER-POLYNOMIAL': {
    id: 'TMPL-CHAIN-POWER-POLYNOMIAL',
    familyId: 'FAM-GEN0102-CHAIN-POLY',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-005',
    name: 'Composite Polynomial Power Chain Rule Template',
    description: 'Differentiates composite polynomial expressions across difficulty tiers.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 5, description: 'Inner coefficient' },
      { name: 'c', type: 'INTEGER', min: 1, max: 6, description: 'Inner constant' },
      { name: 'p', type: 'INTEGER', min: 3, max: 7, description: 'Outer exponent' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      return PROBLEM_TEMPLATES_REGISTRY['TMPL-CHAIN-POLY-STD'].generateCandidate(difficulty, params);
    }
  },

  'TMPL-CHAIN-TRIG-POLY': {
    id: 'TMPL-CHAIN-TRIG-POLY',
    familyId: 'FAM-GEN0102-CHAIN-TRIG',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-005',
    name: 'Composite Trigonometric Chain Rule Template',
    description: 'Differentiates composite trigonometric functions across difficulty tiers.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 6, description: 'Inner coefficient' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 3;
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let rawAst: any;
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Linear argument: y = sin(ax) => y' = a * cos(ax)
        exprLatex = `y = \\sin(${a}x)`;
        ansLatex = `${a}\\cos(${a}x)`;
        ansRaw = `${a}*cos(${a}*x)`;
        rawAst = func('sin', multiply(constant(a), variable('x')));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Inner function u = ${a}x, outer function sin(u).`, pedagogicalRationale: 'Decomposition.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d/dx[sin(${a}x)] = cos(${a}x) * ${a} = ${a}cos(${a}x).`, pedagogicalRationale: 'Chain rule.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[sin(kx)] = k cos(kx).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `Derivative of inside (${a}x) is ${a}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Quadratic argument: y = sin(a*x^2) => y' = 2ax * cos(a*x^2)
        exprLatex = `y = \\sin\\left(${a}x^{2}\\right)`;
        ansLatex = `${2 * a}x\\cos\\left(${a}x^{2}\\right)`;
        ansRaw = `${2 * a}*x*cos(${a}*x^2)`;
        rawAst = func('sin', multiply(constant(a), power(variable('x'), constant(2))));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Inner u = ${a}x^2, outer sin(u).`, pedagogicalRationale: 'Decomposition.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `du/dx = ${2 * a}x; d/du[sin(u)] = cos(u). Assembly: ${2 * a}x * cos(${a}x^2).`, pedagogicalRationale: 'Chain rule.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Apply Chain Rule: d/dx[sin(u)] = cos(u) * du/dx.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `u = ${a}x^2 => du/dx = ${2 * a}x.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Power of trig function: y = sin^2(ax) => y' = 2a * sin(ax) * cos(ax) = a * sin(2ax)
        const totalCoeff = 2 * a;
        exprLatex = `y = \\sin^{2}\\left(${a}x\\right)`;
        ansLatex = `${totalCoeff}\\sin(${a}x)\\cos(${a}x)`;
        ansRaw = `${totalCoeff}*sin(${a}*x)*cos(${a}*x)`;
        rawAst = power(func('sin', multiply(constant(a), variable('x'))), constant(2));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Outer function u^2 where u = sin(ax).', pedagogicalRationale: 'Double chain rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d/dx[u^2] = 2u * (du/dx) = 2*sin(${a}x) * [${a}cos(${a}x)] = ${totalCoeff}sin(${a}x)cos(${a}x).`, pedagogicalRationale: 'Power and trig chain rule.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Apply the power rule to sin(ax)^2 first: 2*sin(ax)*d/dx[sin(ax)].', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `d/dx[sin(${a}x)] = ${a}cos(${a}x).`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Composite tangent function: y = tan(ax^2 + 1) => y' = 2ax * sec^2(ax^2 + 1)
        exprLatex = `y = \\tan\\left(${a}x^{2} + 1\\right)`;
        ansLatex = `${2 * a}x\\sec^{2}\\left(${a}x^{2} + 1\\right)`;
        ansRaw = `${2 * a}*x*sec(${a}*x^2 + 1)^2`;
        rawAst = func('tan', add(multiply(constant(a), power(variable('x'), constant(2))), constant(1)));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Outer function tan(u) with inner u = ax^2 + 1.', pedagogicalRationale: 'Tangent composite.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d/du[tan(u)] = sec^2(u); du/dx = ${2 * a}x. Assembly: ${2 * a}x*sec^2(${a}x^2 + 1).`, pedagogicalRationale: 'Chain rule.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[tan(u)] = sec^2(u) * du/dx.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `u = ${a}x^2 + 1 => du/dx = ${2 * a}x.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      return {
        statement: {
          promptText: 'Differentiate the composite trigonometric function with respect to x:',
          expressionLatex: exprLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `CHAIN_TRIG:DIFF${difficulty}_A${a}`
      };
    }
  },
  'TMPL-CHAIN-ERROR-DIAG': {
    id: 'TMPL-CHAIN-ERROR-DIAG',
    familyId: 'FAM-GEN0102-CHAIN-ERROR',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-005',
    name: 'Chain Rule Missing Inner Derivative Error Analysis',
    description: 'Diagnoses omission of inner derivative du/dx.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 4, description: 'Inner coefficient' },
      { name: 'p', type: 'INTEGER', min: 3, max: 6, description: 'Power exponent' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 3;
      const c = 4;
      const p = params?.p ?? 5;
      const innerAst = add(multiply(constant(a), power(variable('x'), constant(2))), constant(c));
      const rawAst = power(innerAst, constant(p));
      const flawedDerivLatex = `${p}\\left(${a}x^{2} + ${c}\\right)^{${p - 1}}`;

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Inspect student work and check for inner derivative du/dx.', pedagogicalRationale: 'Misconception analysis.' },
        { stepIndex: 2, phase: 'VERIFICATION', actionDescription: `Observe that multiplication by d/dx[${a}x^2 + ${c}] = ${2 * a}x is omitted.`, pedagogicalRationale: 'Error pinpointing.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Check if the student applied the Chain Rule completely.', revealsFinalAnswer: false },
        { level: 2, category: 'DIRECTION', text: 'What is the derivative of the inner function?', revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `Inner derivative is ${2 * a}x.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `The student omitted the inner derivative factor ${2 * a}x.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `Missing inner derivative: ${2 * a}x.`, revealsFinalAnswer: true }
      ];

      const distractors: ProblemDistractor[] = [
        { id: 'ERR-INNER-OMIT', distractorLatex: `Missing inner derivative: ${2 * a}x`, distractorRaw: 'Missing inner derivative', pedagogicalExplanation: 'Inner derivative was omitted in student derivation.', isPlausible: true },
        { id: 'ERR-OUTER-POWER', distractorLatex: 'Incorrect outer power reduction', distractorRaw: 'Power not reduced', pedagogicalExplanation: 'Outer power was correctly reduced.', isPlausible: true },
        { id: 'ERR-INNER-SIGN', distractorLatex: 'Inner polynomial sign error', distractorRaw: 'Inner sign flipped', pedagogicalExplanation: 'No sign error in inner polynomial.', isPlausible: true }
      ];

      return {
        statement: {
          promptText: 'A student claims the derivative of the given function is shown below. Identify the conceptual error in their work:',
          expressionLatex: `y = \\left(${a}x^{2} + ${c}\\right)^{${p}}`,
          givenWorkLatex: `\\frac{dy}{dx} = ${flawedDerivLatex}`,
          targetVariable: 'y',
          independentVariable: 'x',
          options: distractors
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        distractors,
        misconceptionTarget: 'MISSING_INNER_DERIVATIVE',
        difficultyVector: { overall: difficulty || 2, conceptual: 3, procedural: 2, computational: 1, reasoning: 3, representation: 1, context: 1, multiStep: 2 },
        structureSignature: `ERROR_DIAG:CHAIN_OMIT_INNER:A${a}_P${p}`
      };
    }
  },

  'TMPL-CHAIN-METHOD-RECOG': {
    id: 'TMPL-CHAIN-METHOD-RECOG',
    familyId: 'FAM-GEN0102-CHAIN-RECOG',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-005',
    name: 'Differentiation Rule Identification Multiple Choice Template',
    description: 'Presents an expression and asks which primary differentiation rule is necessary.',
    parameterSchema: [
      { name: 'expressionType', type: 'CHOICE', choices: ['COMPOSITE_POWER', 'TRIG_COMPOSITE'], description: 'Type of composite function' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const exprLatex = '\\left(4x^{3} + 5x - 1\\right)^{6}';
      const rawAst = power(add(multiply(constant(4), power(variable('x'), constant(3))), multiply(constant(5), variable('x')), constant(-1)), constant(6));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Observe composite power structure requiring the Chain Rule.', pedagogicalRationale: 'Rule discrimination.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Look at the outermost operation: an entire expression is raised to power 6.', revealsFinalAnswer: false },
        { level: 2, category: 'FORMULA', text: 'Composite powers require the Chain Rule (General Power Rule).', revealsFinalAnswer: true },
        { level: 3, category: 'GUIDED_CALCULATION', text: 'Select Chain Rule.', revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: 'Chain Rule', revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: 'Chain Rule', revealsFinalAnswer: true }
      ];

      const distractors: ProblemDistractor[] = [
        { id: 'OPT-CHAIN', distractorLatex: 'Chain Rule (General Power Rule)', distractorRaw: 'Chain Rule', pedagogicalExplanation: 'Correct rule for composed functions.', isPlausible: true },
        { id: 'OPT-PRODUCT', distractorLatex: 'Product Rule', distractorRaw: 'Product Rule', pedagogicalExplanation: 'Expression is not a product of two distinct variable terms.', isPlausible: true },
        { id: 'OPT-QUOTIENT', distractorLatex: 'Quotient Rule', distractorRaw: 'Quotient Rule', pedagogicalExplanation: 'No variable denominator fraction.', isPlausible: true }
      ];

      return {
        statement: {
          promptText: 'Which primary differentiation rule must be used to differentiate the given function?',
          expressionLatex: `y = ${exprLatex}`,
          targetVariable: 'y',
          independentVariable: 'x',
          options: distractors
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        distractors,
        difficultyVector: { overall: 1, conceptual: 2, procedural: 1, computational: 1, reasoning: 2, representation: 1, context: 1, multiStep: 1 },
        structureSignature: 'METHOD_RECOG:CHAIN_VS_PROD_QUOT'
      };
    }
  },

  'TMPL-CHAIN-KINEMATICS-APP': {
    id: 'TMPL-CHAIN-KINEMATICS-APP',
    familyId: 'FAM-GEN0102-CHAIN-APP',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-005',
    name: 'Actuator Instantaneous Velocity via Chain Rule',
    description: 'Evaluate physical velocity v(t) = s\'(t) from composite displacement model.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 4, description: 'Displacement coefficient' },
      { name: 'p', type: 'INTEGER', min: 2, max: 3, description: 'Power exponent' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 2;
      const p = params?.p ?? 3;
      const t0 = 1;
      const innerAt1 = a * (t0 * t0) + 1;
      const innerDerivAt1 = 2 * a * t0;
      const v1 = p * Math.pow(innerAt1, p - 1) * innerDerivAt1;

      const rawAst = power(add(multiply(constant(a), power(variable('t'), constant(2))), constant(1)), constant(p));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Velocity is the time derivative of displacement: v(t) = ds/dt.', pedagogicalRationale: 'Kinematic rate definition.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Apply Chain Rule: v(t) = ${p}(${a}t^2 + 1)^${p - 1} * (${2 * a}t).`, pedagogicalRationale: 'Chain rule differentiation.' },
        { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Evaluate at t = ${t0}: v(${t0}) = ${p}(${innerAt1})^${p - 1} * (${innerDerivAt1}) = ${v1} m/s.`, pedagogicalRationale: 'Numerical evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Velocity is the derivative of displacement: v(t) = s\'(t).', revealsFinalAnswer: false },
        { level: 2, category: 'FORMULA', text: `Differentiate s(t) = (${a}t^2 + 1)^${p} using the Chain Rule.`, revealsFinalAnswer: false },
        { level: 3, category: 'SETUP', text: `v(t) = ${p}(${a}t^2 + 1)^${p - 1} * (${2 * a}t).`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `Substitute t = ${t0}: v(${t0}) = ${v1} m/s.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${v1} m/s`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A linear robotic actuator moves with displacement s(t) = (${a}t^2 + 1)^${p} meters. Calculate its instantaneous velocity v(t) at t = ${t0} second in m/s:`,
          contextStory: 'Robotics kinematics linear actuator moving on precision linear guide.',
          expressionLatex: `s(t) = \\left(${a}t^{2} + 1\\right)^{${p}}`,
          targetVariable: 'v',
          independentVariable: 't',
          physicalUnits: 'm/s'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 3, conceptual: 3, procedural: 3, computational: 2, reasoning: 2, representation: 2, context: 3, multiStep: 2 },
        structureSignature: `APP_KINEMATICS:CHAIN:A${a}_P${p}_T${t0}`
      };
    }
  },

  'TMPL-GEN0102-TRIG-CIRCULAR': {
    id: 'TMPL-GEN0102-TRIG-CIRCULAR',
    familyId: 'FAM-GEN0102-TRIG-CIRCULAR',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-006',
    name: 'Circular Trigonometric Sine and Cosine Differentiation',
    description: 'Differentiate circular trigonometric functions across difficulty tiers.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 5, description: 'Trig frequency multiplier' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 3;
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let rawAst: any;
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Basic linear combination: y = a*sin(x) + 2*cos(x)
        exprLatex = `y = ${a}\\sin(x) + 2\\cos(x)`;
        ansLatex = `${a}\\cos(x) - 2\\sin(x)`;
        ansRaw = `${a}*cos(x) - 2*sin(x)`;
        rawAst = add(multiply(constant(a), func('sin', variable('x'))), multiply(constant(2), func('cos', variable('x'))));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Basic trig derivatives: d/dx[sin(x)] = cos(x), d/dx[cos(x)] = -sin(x).', pedagogicalRationale: 'Trig rules.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d/dx[${a}sin(x) + 2cos(x)] = ${a}cos(x) - 2sin(x).`, pedagogicalRationale: 'Linearity.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[sin(x)] = cos(x), d/dx[cos(x)] = -sin(x).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Differentiate each term linearly.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Frequency scaled: y = sin(ax) + cos(2x)
        exprLatex = `y = \\sin(${a}x) + \\cos(2x)`;
        ansLatex = `${a}\\cos(${a}x) - 2\\sin(2x)`;
        ansRaw = `${a}*cos(${a}*x) - 2*sin(2*x)`;
        rawAst = add(func('sin', multiply(constant(a), variable('x'))), func('cos', multiply(constant(2), variable('x'))));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'd/dx[sin(ax)] = a*cos(ax), d/dx[cos(bx)] = -b*sin(bx).', pedagogicalRationale: 'Chain rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d/dx[sin(${a}x) + cos(2x)] = ${a}cos(${a}x) - 2sin(2x).`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Chain rule: d/dx[sin(kx)] = k cos(kx).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Multiply by argument frequency.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Tangent and Cosine: y = a*tan(x) + cos(ax)
        exprLatex = `y = ${a}\\tan(x) + \\cos(${a}x)`;
        ansLatex = `${a}\\sec^{2}(x) - ${a}\\sin(${a}x)`;
        ansRaw = `${a}*sec(x)^2 - ${a}*sin(${a}*x)`;
        rawAst = add(multiply(constant(a), func('tan', variable('x'))), func('cos', multiply(constant(a), variable('x'))));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'd/dx[tan(x)] = sec^2(x), d/dx[cos(ax)] = -a*sin(ax).', pedagogicalRationale: 'Tangent rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d/dx = ${a}sec^2(x) - ${a}sin(${a}x).`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[tan(x)] = sec^2(x).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Recall derivative of tan(x) is sec^2(x).', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Tangent with frequency: y = tan(ax) - sin(2x)
        exprLatex = `y = \\tan(${a}x) - \\sin(2x)`;
        ansLatex = `${a}\\sec^{2}(${a}x) - 2\\cos(2x)`;
        ansRaw = `${a}*sec(${a}*x)^2 - 2*cos(2*x)`;
        rawAst = add(func('tan', multiply(constant(a), variable('x'))), multiply(constant(-1), func('sin', multiply(constant(2), variable('x')))));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'd/dx[tan(ax)] = a*sec^2(ax), d/dx[sin(2x)] = 2*cos(2x).', pedagogicalRationale: 'Composite trig rules.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `d/dx = ${a}sec^2(${a}x) - 2cos(2x).`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[tan(kx)] = k sec^2(kx).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Apply chain rule factor k to sec^2(kx).', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      return {
        statement: {
          promptText: 'Differentiate the circular trigonometric expression with respect to x:',
          expressionLatex: exprLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 1, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0102:TRIG:DIFF${difficulty}_A${a}`
      };
    }
  },

  'TMPL-GEN0102-EXP-LOG': {
    id: 'TMPL-GEN0102-EXP-LOG',
    familyId: 'FAM-GEN0102-EXP-LOG',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-008',
    name: 'Exponential and Natural Logarithmic Differentiation',
    description: 'Differentiate exponential and logarithmic functions across difficulty tiers.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 5, description: 'Exponential rate constant' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 3;
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let rawAst: any;
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Basic sum: y = e^x + a*ln(x)
        exprLatex = `y = e^{x} + ${a}\\ln(x)`;
        ansLatex = `e^{x} + \\frac{${a}}{x}`;
        ansRaw = `e^x + ${a}/x`;
        rawAst = add(func('exp', variable('x')), multiply(constant(a), func('ln', variable('x'))));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'd/dx[e^x] = e^x, d/dx[ln(x)] = 1/x.', pedagogicalRationale: 'Transcendental derivatives.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `y' = e^x + ${a}/x.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[e^x] = e^x, d/dx[ln(x)] = 1/x.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Differentiate each term separately.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Scaled exponent: y = e^(ax) + ln(x)
        exprLatex = `y = e^{${a}x} + \\ln(x)`;
        ansLatex = `${a}e^{${a}x} + \\frac{1}{x}`;
        ansRaw = `${a}*e^(${a}*x) + 1/x`;
        rawAst = add(func('exp', multiply(constant(a), variable('x'))), func('ln', variable('x')));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Chain rule on e^(ax) gives a*e^(ax); derivative of ln(x) is 1/x.', pedagogicalRationale: 'Chain rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `y' = ${a}e^(${a}x) + 1/x.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[e^(kx)] = k e^(kx).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Apply exponential chain rule factor k.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Composite quadratic exponent: y = e^(ax^2) + ln(x)
        const coeff = 2 * a;
        exprLatex = `y = e^{${a}x^{2}} + \\ln(x)`;
        ansLatex = `${coeff}xe^{${a}x^{2}} + \\frac{1}{x}`;
        ansRaw = `${coeff}*x*e^(${a}*x^2) + 1/x`;
        rawAst = add(func('exp', multiply(constant(a), power(variable('x'), constant(2)))), func('ln', variable('x')));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'd/dx[e^(u)] = e^u * u\' where u = ax^2, so u\' = 2ax.', pedagogicalRationale: 'Exponential chain rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `y' = ${coeff}x*e^(${a}x^2) + 1/x.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[e^(ax^2)] = 2ax * e^(ax^2).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Differentiate the inner quadratic exponent.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Composite logarithm: y = ln(ax^2 + 1) + e^(ax)
        const coeff = 2 * a;
        exprLatex = `y = \\ln\\left(${a}x^{2} + 1\\right) + e^{${a}x}`;
        ansLatex = `\\frac{${coeff}x}{${a}x^{2} + 1} + ${a}e^{${a}x}`;
        ansRaw = `(${coeff}*x)/(${a}*x^2 + 1) + ${a}*e^(${a}*x)`;
        rawAst = add(func('ln', add(multiply(constant(a), power(variable('x'), constant(2))), constant(1))), func('exp', multiply(constant(a), variable('x'))));
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'd/dx[ln(u)] = u\'/u where u = ax^2 + 1, so u\' = 2ax.', pedagogicalRationale: 'Logarithmic chain rule.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `y' = (${coeff}x)/(${a}x^2 + 1) + ${a}e^(${a}x).`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[ln(u)] = u\' / u.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Compute u\' for u = ax^2 + 1.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      return {
        statement: {
          promptText: 'Differentiate the exponential and logarithmic function with respect to x:',
          expressionLatex: exprLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: 1, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0102:EXP_LOG:DIFF${difficulty}_A${a}`
      };
    }
  },

  'TMPL-GEN0102-IMPLICIT-DIFF': {
    id: 'TMPL-GEN0102-IMPLICIT-DIFF',
    familyId: 'FAM-GEN0102-IMPLICIT-DIFF',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-009',
    name: 'Implicit Curve Differentiation for dy/dx',
    description: 'Find dy/dx by implicit differentiation across difficulty tiers.',
    parameterSchema: [
      { name: 'r', type: 'INTEGER', min: 3, max: 8, description: 'Curve parameter' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const r = params?.r ?? 5;
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Circle: x^2 + y^2 = r^2 => dy/dx = -x / y
        const r2 = r * r;
        exprLatex = `x^{2} + y^{2} = ${r2}`;
        ansLatex = `-\\frac{x}{y}`;
        ansRaw = `-x / y`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Differentiate implicitly: 2x + 2y(dy/dx) = 0.', pedagogicalRationale: 'Implicit differentiation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: '2y(dy/dx) = -2x => dy/dx = -x/y.', pedagogicalRationale: 'Solve dy/dx.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Remember d/dx[y^2] = 2y (dy/dx).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: '2x + 2y(dy/dx) = 0.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Ellipse with unequal coefficients: 2x^2 + 3y^2 = 24 => dy/dx = -2x / (3y)
        exprLatex = `2x^{2} + 3y^{2} = 24`;
        ansLatex = `-\\frac{2x}{3y}`;
        ansRaw = `(-2*x) / (3*y)`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Differentiate: 4x + 6y(dy/dx) = 0.', pedagogicalRationale: 'Implicit differentiation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: '6y(dy/dx) = -4x => dy/dx = -4x/(6y) = -2x/(3y).', pedagogicalRationale: 'Simplification.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate term by term: 4x + 6y(dy/dx) = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Solve for dy/dx = -4x / (6y).', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Cross term: x^2 + xy + y^2 = 12 => 2x + y + x(dy/dx) + 2y(dy/dx) = 0
        exprLatex = `x^{2} + xy + y^{2} = 12`;
        ansLatex = `-\\frac{2x + y}{x + 2y}`;
        ansRaw = `-(2*x + y) / (x + 2*y)`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Use Product Rule on xy: d/dx[xy] = 1*y + x(dy/dx).', pedagogicalRationale: 'Product rule implicitly.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: '2x + y + x(dy/dx) + 2y(dy/dx) = 0 => (x + 2y)(dy/dx) = -(2x + y).', pedagogicalRationale: 'Factoring dy/dx.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'dy/dx = -(2x + y) / (x + 2y).', pedagogicalRationale: 'Isolation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Apply the product rule to the middle term xy: y + x(dy/dx).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: '(x + 2y) dy/dx = -(2x + y).', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Folium cross-product: x^3 + y^3 = 6xy => 3x^2 + 3y^2(dy/dx) = 6y + 6x(dy/dx)
        exprLatex = `x^{3} + y^{3} = 6xy`;
        ansLatex = `\\frac{2y - x^{2}}{y^{2} - 2x}`;
        ansRaw = `(2*y - x^2) / (y^2 - 2*x)`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: '3x^2 + 3y^2(dy/dx) = 6y + 6x(dy/dx).', pedagogicalRationale: 'Differentiation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Divide by 3: x^2 + y^2(dy/dx) = 2y + 2x(dy/dx) => (y^2 - 2x)dy/dx = 2y - x^2.', pedagogicalRationale: 'Grouping.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'dy/dx = (2y - x^2) / (y^2 - 2x).', pedagogicalRationale: 'Result.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate: 3x^2 + 3y^2 dy/dx = 6(y + x dy/dx).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: '(y^2 - 2x) dy/dx = 2y - x^2.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = divide(multiply(constant(-1), variable('x')), variable('y'));
      return {
        statement: {
          promptText: 'Find dy/dx by implicit differentiation for the given equation:',
          expressionLatex: exprLatex,
          targetVariable: 'dy/dx',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 3, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0102:IMPLICIT:DIFF${difficulty}_R${r}`
      };
    }
  },

  'TMPL-GEN0102-HIGHER-ORDER': {
    id: 'TMPL-GEN0102-HIGHER-ORDER',
    familyId: 'FAM-GEN0102-HIGHER-ORDER',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-011',
    name: 'Polynomial Second Derivative Evaluation',
    description: 'Find d^2y/dx^2 across difficulty tiers.',
    parameterSchema: [
      { name: 'n', type: 'INTEGER', min: 4, max: 6, description: 'Polynomial power parameter' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Cubic polynomial: y = 2x^3 + 5x^2 - 4x => y'' = 12x + 10
        exprLatex = 'y = 2x^{3} + 5x^{2} - 4x';
        ansLatex = '12x + 10';
        ansRaw = '12*x + 10';
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'First derivative: y\' = 6x^2 + 10x - 4.', pedagogicalRationale: '1st derivative.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Second derivative: y\'\' = 12x + 10.', pedagogicalRationale: '2nd derivative.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate the function twice using the power rule.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'y\' = 6x^2 + 10x - 4.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Quartic polynomial: y = x^4 - 2x^3 => y'' = 12x^2 - 12x
        exprLatex = 'y = x^{4} - 2x^{3}';
        ansLatex = '12x^{2} - 12x';
        ansRaw = '12*x^2 - 12*x';
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'y\' = 4x^3 - 6x^2.', pedagogicalRationale: '1st derivative.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'y\'\' = 12x^2 - 12x.', pedagogicalRationale: '2nd derivative.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate twice.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'y\' = 4x^3 - 6x^2.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Trigonometric second derivative: y = cos(3x) => y'' = -9*cos(3x)
        exprLatex = 'y = \\cos(3x)';
        ansLatex = '-9\\cos(3x)';
        ansRaw = '-9*cos(3*x)';
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'y\' = -3sin(3x).', pedagogicalRationale: '1st derivative.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'y\'\' = -9cos(3x).', pedagogicalRationale: '2nd derivative.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[cos(kx)] = -k sin(kx).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'y\' = -3sin(3x). Differentiate again.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Exponential mixed second derivative: y = e^{2x} + x^4 => y'' = 4e^{2x} + 12x^2
        exprLatex = 'y = e^{2x} + x^{4}';
        ansLatex = '4e^{2x} + 12x^{2}';
        ansRaw = '4*e^(2*x) + 12*x^2';
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'y\' = 2e^{2x} + 4x^3.', pedagogicalRationale: '1st derivative.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'y\'\' = 4e^{2x} + 12x^2.', pedagogicalRationale: '2nd derivative.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate term by term twice.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'y\' = 2e^(2x) + 4x^3.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText: 'Find the second derivative (d^2y/dx^2) of the function:',
          expressionLatex: exprLatex,
          targetVariable: "y''",
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 1, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0102:HIGHER_ORDER:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0102-PARTIAL-DERIV': {
    id: 'TMPL-GEN0102-PARTIAL-DERIV',
    familyId: 'FAM-GEN0102-PARTIAL-DERIV',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-010',
    name: 'First-Order Partial Derivative Evaluation',
    description: 'Find del f / del x across difficulty tiers.',
    parameterSchema: [
      { name: 'p', type: 'INTEGER', min: 2, max: 4, description: 'Power degree parameter' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Simple polynomial: f(x, y) = 3x^2*y + 4x
        exprLatex = 'f(x, y) = 3x^{2}y + 4x';
        ansLatex = '6xy + 4';
        ansRaw = '6*x*y + 4';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Treat y as a constant when differentiating with respect to x.', pedagogicalRationale: 'Partial differentiation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'del/del x [3x^2*y + 4x] = 3*(2x)*y + 4 = 6xy + 4.', pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Treat y as a constant when finding del f / del x.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'd/dx[3x^2] = 6x, so d/dx[3x^2*y] = 6xy.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Higher powers: f(x, y) = x^2 * y^3 + 4x
        exprLatex = 'f(x, y) = x^{2}y^{3} + 4x';
        ansLatex = '2xy^{3} + 4';
        ansRaw = '2*x*y^3 + 4';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Treat y as constant: del/del x [x^2*y^3] = 2x*y^3.', pedagogicalRationale: 'Partial differentiation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'del f / del x = 2xy^3 + 4.', pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'y is treated as a constant.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'del/del x [x^2 y^3] = 2x y^3.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Trigonometric combination: f(x, y) = y*sin(2x) + x^2 * y^2
        exprLatex = 'f(x, y) = y\\sin(2x) + x^{2}y^{2}';
        ansLatex = '2y\\cos(2x) + 2xy^{2}';
        ansRaw = '2*y*cos(2*x) + 2*x*y^2';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'del/del x [y*sin(2x)] = 2y*cos(2x).', pedagogicalRationale: 'Trig partial.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'del/del x [x^2*y^2] = 2x*y^2. Total: 2y*cos(2x) + 2xy^2.', pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[sin(2x)] = 2 cos(2x). Multiply by constant y.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'del/del x = y*(2 cos(2x)) + 2x y^2.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Exponential combination: f(x, y) = e^(2xy) + 3x^2
        exprLatex = 'f(x, y) = e^{2xy} + 3x^{2}';
        ansLatex = '2ye^{2xy} + 6x';
        ansRaw = '2*y*e^(2*x*y) + 6*x';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Chain rule: del/del x [e^(2xy)] = e^(2xy) * del/del x[2xy] = 2y*e^(2xy).', pedagogicalRationale: 'Exponential chain partial.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'del f / del x = 2y*e^(2xy) + 6x.', pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'del/del x [e^(u)] = e^u * (del u / del x).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'del/del x [2xy] = 2y.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText: 'Find the first-order partial derivative with respect to x (del f / del x):',
          expressionLatex: exprLatex,
          targetVariable: '\\frac{\\partial f}{\\partial x}',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: 2, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0102:PARTIAL_DERIV:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0102-RELATED-RATES': {
    id: 'TMPL-GEN0102-RELATED-RATES',
    familyId: 'FAM-GEN0102-RELATED-RATES',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-015',
    name: 'Expanding Geometric Related Rate Calculation',
    description: 'Calculate rate of change of geometric quantities across difficulty tiers.',
    parameterSchema: [
      { name: 'r', type: 'INTEGER', min: 2, max: 10, description: 'Radius or dimension' },
      { name: 'drdt', type: 'INTEGER', min: 2, max: 5, description: 'Rate of dimension change' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const r = params?.r ?? 5;
      const drdt = params?.drdt ?? 2;
      let promptText = '';
      let exprLatex = '';
      let ansLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Expanding square: A = s^2 => dA/dt = 2s * ds/dt
        const s = r;
        const dsdt = drdt;
        const dAdt = 2 * s * dsdt;
        promptText = `A square plate expands such that each side s increases at ${dsdt} m/s. Calculate dA/dt when s = ${s} m:`;
        exprLatex = 'A = s^{2}';
        ansLatex = `${dAdt} \\text{ m}^2/\\text{s}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'A = s^2 => dA/dt = 2s(ds/dt).', pedagogicalRationale: 'Square rate.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `dA/dt = 2 * ${s} * ${dsdt} = ${dAdt} m^2/s.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate A = s^2 with respect to time: dA/dt = 2s (ds/dt).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `dA/dt = 2 * ${s} * ${dsdt}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Expanding circle: A = pi * r^2 => dA/dt = 2*pi*r * dr/dt
        const dAdtCoeff = 2 * r * drdt;
        promptText = `A circular ripple expands such that its radius increases at ${drdt} m/s. Calculate dA/dt when r = ${r} m:`;
        exprLatex = 'A = \\pi r^{2}';
        ansLatex = `${dAdtCoeff}\\pi \\text{ m}^2/\\text{s}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'A = pi*r^2 => dA/dt = 2*pi*r*(dr/dt).', pedagogicalRationale: 'Circle rate.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `dA/dt = 2*pi*${r}*${drdt} = ${dAdtCoeff}pi m^2/s.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'dA/dt = 2*pi*r (dr/dt).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `dA/dt = 2*pi * ${r} * ${drdt}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Expanding sphere: V = (4/3)*pi*r^3 => dV/dt = 4*pi*r^2 * dr/dt
        const rVal = 3;
        const drVal = 2;
        const dVdtCoeff = 4 * rVal * rVal * drVal; // 72 pi
        promptText = `A spherical weather balloon expands such that its radius increases at ${drVal} m/s. Calculate dV/dt when r = ${rVal} m:`;
        exprLatex = 'V = \\frac{4}{3}\\pi r^{3}';
        ansLatex = `${dVdtCoeff}\\pi \\text{ m}^3/\\text{s}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'V = (4/3)pi*r^3 => dV/dt = 4*pi*r^2*(dr/dt).', pedagogicalRationale: 'Sphere volume rate.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `dV/dt = 4*pi*(${rVal}^2)*${drVal} = ${dVdtCoeff}pi m^3/s.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'dV/dt = 4*pi*r^2 (dr/dt).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `dV/dt = 4*pi * (${rVal})^2 * ${drVal}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Sliding ladder: x^2 + y^2 = 100 (L = 10) => dy/dt = -(x/y)*dx/dt
        const xVal = 6;
        const yVal = 8;
        const dxdt = 2;
        const dydt = -((xVal * dxdt) / yVal); // -1.5 m/s
        promptText = `A 10-meter ladder slides down a wall. If the base moves away at ${dxdt} m/s when x = ${xVal} m (y = ${yVal} m), calculate dy/dt in m/s:`;
        exprLatex = 'x^{2} + y^{2} = 100';
        ansLatex = `${dydt} \\text{ m/s}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: '2x(dx/dt) + 2y(dy/dt) = 0 => dy/dt = -(x/y)(dx/dt).', pedagogicalRationale: 'Pythagorean rate.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `dy/dt = -(${xVal}/${yVal}) * ${dxdt} = ${dydt} m/s.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate x^2 + y^2 = L^2: 2x(dx/dt) + 2y(dy/dt) = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `dy/dt = -(x/y) * dx/dt = -(${xVal}/${yVal}) * ${dxdt}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText,
          expressionLatex: exprLatex,
          targetVariable: 'Rate',
          independentVariable: 't',
          physicalUnits: 'm/s'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 3, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 3, representation: 1, context: 3, multiStep: difficulty },
        structureSignature: `GEN0102:RELATED_RATES:DIFF${difficulty}_R${r}`
      };
    }
  },

  'TMPL-TANGENT-LINE-STD': {
    id: 'TMPL-TANGENT-LINE-STD',
    familyId: 'FAM-GEN0102-TANGENT-APP',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-012',
    name: 'Tangent Line Slope and Equation Construction',
    description: 'Construct tangent line equation across difficulty tiers.',
    parameterSchema: [
      { name: 'x0', type: 'INTEGER', min: 1, max: 3, description: 'Point of tangency x-coordinate' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const x0 = params?.x0 ?? 1;
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Monic parabola: y = x^2 + 2x at x = x0
        const y0 = x0 * x0 + 2 * x0;
        const slope = 2 * x0 + 2;
        const intercept = y0 - slope * x0; // -x0^2
        exprLatex = 'y = x^{2} + 2x';
        ansLatex = intercept === 0 ? `y = ${slope}x` : intercept > 0 ? `y = ${slope}x + ${intercept}` : `y = ${slope}x - ${Math.abs(intercept)}`;
        ansRaw = ansLatex;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `f'(x) = 2x + 2 => slope m = f'(${x0}) = ${slope}.`, pedagogicalRationale: 'Slope evaluation.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `y0 = f(${x0}) = ${y0}. Equation: y - ${y0} = ${slope}(x - ${x0}).`, pedagogicalRationale: 'Line construction.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'm = f\'(x0).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `f'(${x0}) = ${slope}, f(${x0}) = ${y0}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: General parabola: y = 2x^2 - 3x + 1 at x = x0
        const y0 = 2 * x0 * x0 - 3 * x0 + 1;
        const slope = 4 * x0 - 3;
        const intercept = y0 - slope * x0;
        exprLatex = 'y = 2x^{2} - 3x + 1';
        ansLatex = intercept === 0 ? `y = ${slope}x` : intercept > 0 ? `y = ${slope}x + ${intercept}` : `y = ${slope}x - ${Math.abs(intercept)}`;
        ansRaw = ansLatex;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `f'(x) = 4x - 3 => m = ${slope}.`, pedagogicalRationale: 'Slope.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `y - ${y0} = ${slope}(x - ${x0}).`, pedagogicalRationale: 'Line equation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate f(x) to find slope m.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `m = ${slope}, y0 = ${y0}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Cubic curve: y = x^3 - 3x at x = x0
        const y0 = x0 * x0 * x0 - 3 * x0;
        const slope = 3 * x0 * x0 - 3;
        const intercept = y0 - slope * x0;
        exprLatex = 'y = x^{3} - 3x';
        ansLatex = intercept === 0 ? `y = ${slope}x` : intercept > 0 ? `y = ${slope}x + ${intercept}` : `y = ${slope}x - ${Math.abs(intercept)}`;
        ansRaw = ansLatex;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `f'(x) = 3x^2 - 3 => m = ${slope}.`, pedagogicalRationale: 'Cubic slope.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `y - ${y0} = ${slope}(x - ${x0}).`, pedagogicalRationale: 'Line equation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'f\'(x) = 3x^2 - 3.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `m = ${slope}, y0 = ${y0}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Rational curve: y = 4 / x at x = 2
        const ptX = 2;
        const y0 = 4 / ptX; // 2
        const slope = -4 / (ptX * ptX); // -1
        const intercept = y0 - slope * ptX; // 4
        exprLatex = 'y = \\frac{4}{x}';
        ansLatex = `y = -x + 4`;
        ansRaw = `y = -x + 4`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'f\'(x) = -4/x^2 => m = f\'(2) = -1.', pedagogicalRationale: 'Rational derivative.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'y - 2 = -1(x - 2) => y = -x + 4.', pedagogicalRationale: 'Line equation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[4/x] = -4/x^2.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'At x = 2: m = -1, y = 2.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText: `Find the equation of the line tangent to the curve at x = ${difficulty >= 4 ? 2 : x0}:`,
          expressionLatex: exprLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 3, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 2, representation: 1, context: 2, multiStep: difficulty },
        structureSignature: `APP_TANGENT_LINE:DIFF${difficulty}_X${x0}`
      };
    }
  },

  'TMPL-GEN0102-CURVE-SKETCH': {
    id: 'TMPL-GEN0102-CURVE-SKETCH',
    familyId: 'FAM-GEN0102-CURVE-SKETCH',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-013',
    name: 'Critical Point and Local Extrema Classification',
    description: 'Classify critical points via First and Second Derivative Tests across difficulty tiers.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 1, max: 3, description: 'Scale factor parameter' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let promptText = '';
      let exprLatex = '';
      let ansLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Parabola: f(x) = x^2 - 4x at x = 2
        promptText = 'Classify the critical point of the function at x = 2:';
        exprLatex = 'f(x) = x^{2} - 4x';
        ansLatex = 'Local Minimum at x = 2';
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'f\'(x) = 2x - 4 = 0 => x = 2.', pedagogicalRationale: 'Critical point.' },
          { stepIndex: 2, phase: 'VERIFICATION', actionDescription: 'f\'\'(x) = 2 > 0 => Concave Up => Local Minimum.', pedagogicalRationale: '2nd derivative test.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Compute f\'\'(x). If f\'\'(c) > 0, it is a local minimum.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'f\'\'(2) = 2 > 0.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Cubic polynomial: f(x) = x^3 - 3x at x = 1
        promptText = 'Classify the critical point of the function at x = 1:';
        exprLatex = 'f(x) = x^{3} - 3x';
        ansLatex = 'Local Minimum at x = 1';
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'f\'(x) = 3x^2 - 3 = 0 => x = 1 or x = -1.', pedagogicalRationale: 'Critical points.' },
          { stepIndex: 2, phase: 'VERIFICATION', actionDescription: 'f\'\'(x) = 6x => f\'\'(1) = 6 > 0 => Local Minimum.', pedagogicalRationale: '2nd derivative test.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Evaluate f\'\'(1). Since 6 > 0, the curve is concave up.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'f\'\'(1) = 6 > 0.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Cubic at negative critical point: f(x) = x^3 - 12x at x = -2
        promptText = 'Classify the critical point of the function at x = -2:';
        exprLatex = 'f(x) = x^{3} - 12x';
        ansLatex = 'Local Maximum at x = -2';
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'f\'(x) = 3x^2 - 12 = 0 => x^2 = 4 => x = -2 or 2.', pedagogicalRationale: 'Critical points.' },
          { stepIndex: 2, phase: 'VERIFICATION', actionDescription: 'f\'\'(x) = 6x => f\'\'(-2) = -12 < 0 => Concave Down => Local Maximum.', pedagogicalRationale: '2nd derivative test.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'If f\'\'(c) < 0, the point is a local maximum.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'f\'\'(-2) = 6(-2) = -12 < 0.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Quartic polynomial: f(x) = -x^4 + 4x^2 at x = 0
        promptText = 'Classify the critical point of the function at x = 0:';
        exprLatex = 'f(x) = -x^{4} + 4x^{2}';
        ansLatex = 'Local Minimum at x = 0';
        reasoningTrace = [
          { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'f\'(x) = -4x^3 + 8x = 0 => x = 0 is a critical point.', pedagogicalRationale: 'Critical point.' },
          { stepIndex: 2, phase: 'VERIFICATION', actionDescription: 'f\'\'(x) = -12x^2 + 8 => f\'\'(0) = 8 > 0 => Local Minimum.', pedagogicalRationale: '2nd derivative test.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Evaluate f\'\'(0).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'f\'\'(0) = 8 > 0, so concave up (local minimum).', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const distractors: ProblemDistractor[] = [
        { id: 'OPT-LOCAL-MIN', distractorLatex: 'Local Minimum', distractorRaw: 'Local Minimum', pedagogicalExplanation: 'Concave up indicates local minimum.', isPlausible: true },
        { id: 'OPT-LOCAL-MAX', distractorLatex: 'Local Maximum', distractorRaw: 'Local Maximum', pedagogicalExplanation: 'Concave down indicates local maximum.', isPlausible: true },
        { id: 'OPT-INFLECTION', distractorLatex: 'Inflection Point', distractorRaw: 'Inflection Point', pedagogicalExplanation: 'f\'\' != 0, not an inflection point.', isPlausible: true }
      ];

      const rawAst = constant(1);
      return {
        statement: {
          promptText,
          expressionLatex: exprLatex,
          targetVariable: 'class',
          independentVariable: 'x',
          options: distractors
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        distractors,
        difficultyVector: { overall: difficulty || 3, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 3, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0102:CURVE_SKETCH:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0102-OPTIMIZATION': {
    id: 'TMPL-GEN0102-OPTIMIZATION',
    familyId: 'FAM-GEN0102-OPTIMIZATION',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-014',
    name: 'Applied Optimization Geometry Modeling',
    description: 'Solve optimization problems with perimeter, area, and volume constraints across difficulty tiers.',
    parameterSchema: [
      { name: 'p', type: 'INTEGER', min: 20, max: 80, description: 'Constraint parameter' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const p = params?.p ?? 40;
      let promptText = '';
      let exprLatex = '';
      let ansLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: 4-sided rectangular enclosure: A = x * (p/2 - x) => max at x = p/4
        const xMax = p / 4;
        const maxArea = xMax * xMax;
        promptText = `A farmer has ${p} meters of fencing to enclose a 4-sided rectangular field. Find the maximum area (in m^2):`;
        exprLatex = `A(x) = x\\left(\\frac{${p}}{2} - x\\right)`;
        ansLatex = `${maxArea} \\text{ m}^2`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `A'(x) = ${p/2} - 2x = 0 => x = ${xMax} m.`, pedagogicalRationale: 'Critical point.' },
          { stepIndex: 2, phase: 'SIMPLIFICATION', actionDescription: `Max Area = ${xMax} * ${xMax} = ${maxArea} m^2.`, pedagogicalRationale: 'Area evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Set A\'(x) = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `x = ${p}/4 = ${xMax}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: 3-sided enclosure (river border): 2x + y = p => A = x(p - 2x) => x = p/4, y = p/2 => A = p^2 / 8
        const xMax = p / 4;
        const yMax = p / 2;
        const maxArea = xMax * yMax;
        promptText = `A rectangular field is fenced on three sides, with the fourth side bordered by a straight river. With ${p} meters of fencing, find the maximum area (in m^2):`;
        exprLatex = `A(x) = x\\left(${p} - 2x\\right)`;
        ansLatex = `${maxArea} \\text{ m}^2`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `2x + y = ${p} => y = ${p} - 2x. A(x) = ${p}x - 2x^2.`, pedagogicalRationale: '3-sided objective.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `A'(x) = ${p} - 4x = 0 => x = ${xMax} m, y = ${yMax} m. Max Area = ${maxArea} m^2.`, pedagogicalRationale: 'Evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Only three sides are fenced: 2x + y = P.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `A'(x) = ${p} - 4x = 0 => x = ${p}/4.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Minimum perimeter for fixed Area 100: P(x) = 2x + 200/x => P' = 2 - 200/x^2 = 0 => x = 10, P = 40
        const fixedArea = 100;
        const minP = 40;
        promptText = `Find the minimum perimeter P (in meters) required to enclose a rectangular area of ${fixedArea} m^2:`;
        exprLatex = `P(x) = 2x + \\frac{2(${fixedArea})}{x}`;
        ansLatex = `${minP} \\text{ m}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'P(x) = 2x + 200/x => P\'(x) = 2 - 200/x^2 = 0 => x = 10.', pedagogicalRationale: 'Perimeter minimization.' },
          { stepIndex: 2, phase: 'SIMPLIFICATION', actionDescription: 'Min Perimeter = 2(10) + 2(10) = 40 m.', pedagogicalRationale: 'Square minimizer.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'P\'(x) = 2 - 200/x^2 = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'x^2 = 100 => x = 10 m.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Open box from 12x12 cardboard: V(x) = x(12 - 2x)^2 => max at x = 2 => V = 128
        promptText = 'An open box is constructed from a 12 cm by 12 cm square cardboard by cutting equal square corners of side x. Find the maximum volume V (in cm^3):';
        exprLatex = 'V(x) = x\\left(12 - 2x\\right)^{2}';
        ansLatex = '128 \\text{ cm}^3';
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'V(x) = 4x^3 - 48x^2 + 144x => V\'(x) = 12x^2 - 96x + 144 = 0.', pedagogicalRationale: 'Box optimization.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'x^2 - 8x + 12 = (x - 2)(x - 6) = 0 => x = 2 cm.', pedagogicalRationale: 'Critical value.' },
          { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Max Volume = 2 * (12 - 4)^2 = 2 * 64 = 128 cm^3.', pedagogicalRationale: 'Volume evaluation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate V(x) = x(12 - 2x)^2.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'V\'(x) = (12 - 2x)^2 - 4x(12 - 2x) = (12 - 2x)(12 - 6x) = 0 => x = 2.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText,
          expressionLatex: exprLatex,
          targetVariable: 'Opt',
          independentVariable: 'x',
          physicalUnits: 'm^2'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 3, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 3, representation: 1, context: 3, multiStep: difficulty },
        structureSignature: `GEN0102:OPTIMIZATION:DIFF${difficulty}_P${p}`
      };
    }
  },

  'TMPL-GEN0102-DIFFERENTIALS': {
    id: 'TMPL-GEN0102-DIFFERENTIALS',
    familyId: 'FAM-GEN0102-DIFFERENTIALS',
    courseId: 'COURSE-GEN0102',
    primarySkillId: 'SKILL-GEN0102-015',
    name: 'Differentials and Local Linear Approximation Estimation',
    description: 'Calculate dy = f\'(x) dx across difficulty tiers.',
    parameterSchema: [
      { name: 'x', type: 'INTEGER', min: 1, max: 4, description: 'Evaluation point x' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const x = params?.x ?? 2;
      let promptText = '';
      let exprLatex = '';
      let ansLatex = '';
      let ansRaw = '';
      let reasoningTrace: StructuredReasoningTraceStep[];
      let hints: StructuredHint[];

      if (difficulty <= 1) {
        // Level 1: Parabola: y = x^2 + 3x => dy = (2x + 3) dx
        const dx = 0.01;
        const deriv = 2 * x + 3;
        const dy = Math.round(deriv * dx * 1000) / 1000;
        promptText = `Use differentials to compute dy for y = x^2 + 3x when x = ${x} and dx = ${dx}:`;
        exprLatex = 'dy = (2x + 3)\\,dx';
        ansLatex = `${dy}`;
        ansRaw = `${dy}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'dy = f\'(x) * dx.', pedagogicalRationale: 'Differential formula.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `f'(${x}) = 2(${x}) + 3 = ${deriv} => dy = ${deriv} * ${dx} = ${dy}.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'dy = f\'(x) dx.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `f'(${x}) = ${deriv}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: Cubic: y = 2x^3 - x => dy = (6x^2 - 1) dx
        const dx = 0.01;
        const deriv = 6 * x * x - 1;
        const dy = Math.round(deriv * dx * 1000) / 1000;
        promptText = `Use differentials to compute dy for y = 2x^3 - x when x = ${x} and dx = ${dx}:`;
        exprLatex = 'dy = (6x^{2} - 1)\\,dx';
        ansLatex = `${dy}`;
        ansRaw = `${dy}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'dy = (6x^2 - 1) * dx.', pedagogicalRationale: 'Differential.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `f'(${x}) = ${deriv} => dy = ${deriv} * ${dx} = ${dy}.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'f\'(x) = 6x^2 - 1.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: `f'(${x}) = ${deriv}.`, revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 3) {
        // Level 3: Square root: y = sqrt(x) at x = 4 with dx = 0.04 => dy = (1 / (2*sqrt(x))) * dx = 0.01
        const ptX = 4;
        const dx = 0.04;
        const dy = 0.01;
        promptText = `Use differentials to estimate dy for y = \\sqrt{x} when x = ${ptX} and dx = ${dx}:`;
        exprLatex = 'dy = \\frac{1}{2\\sqrt{x}}\\,dx';
        ansLatex = `${dy}`;
        ansRaw = `${dy}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'f\'(x) = 1/(2*sqrt(x)).', pedagogicalRationale: 'Square root differential.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `f'(${ptX}) = 1/(2*2) = 0.25 => dy = 0.25 * ${dx} = ${dy}.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[\\sqrt{x}] = 1 / (2\\sqrt{x}).', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'f\'(4) = 1/4 = 0.25.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: Rational: y = 1 / x at x = 2 with dx = 0.02 => dy = -1/x^2 * dx = -0.005
        const ptX = 2;
        const dx = 0.02;
        const dy = -0.005;
        promptText = `Use differentials to compute dy for y = 1/x when x = ${ptX} and dx = ${dx}:`;
        exprLatex = 'dy = -\\frac{1}{x^{2}}\\,dx';
        ansLatex = `${dy}`;
        ansRaw = `${dy}`;
        reasoningTrace = [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'f\'(x) = -1/x^2.', pedagogicalRationale: 'Rational differential.' },
          { stepIndex: 2, phase: 'EXECUTION', actionDescription: `f'(${ptX}) = -1/4 = -0.25 => dy = -0.25 * ${dx} = ${dy}.`, pedagogicalRationale: 'Computation.' }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'd/dx[1/x] = -1/x^2.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'f\'(2) = -1/4 = -0.25.', revealsFinalAnswer: false },
          { level: 3, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 4, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: ansLatex, revealsFinalAnswer: true }
        ];
      }

      const rawAst = constant(1);
      return {
        statement: {
          promptText,
          expressionLatex: exprLatex,
          targetVariable: 'dy',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex: ansLatex,
        canonicalAnswerRaw: ansRaw,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty || 2, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: 2, representation: 1, context: 2, multiStep: difficulty },
        structureSignature: `GEN0102:DIFFERENTIALS:DIFF${difficulty}_X${x}`
      };
    }
  },

  // =========================================================================
  // COURSE: GEN 0107 (Differential Equations)
  // =========================================================================
  'TMPL-GEN0107-CLASSIFY-ORDER': {
    id: 'TMPL-GEN0107-CLASSIFY-ORDER',
    familyId: 'FAM-GEN0107-CLASSIFY-ORDER',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-001',
    name: 'Differential Equation Classification Template',
    description: 'Classify ODE by order, degree, and linearity.',
    parameterSchema: [
      { name: 'order', type: 'INTEGER', min: 1, max: 3, defaultValue: 2, description: 'Differential equation order degree' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const order = params?.order ?? (difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3);
      let exprLatex = 'y\'\' + 4y\' + 3y = e^{x}';
      let rawAst: any = constant(2);
      let canonicalAnswerLatex = 'Second-order Linear';
      let canonicalAnswerRaw = 'Second-order Linear';

      if (order === 1) {
        exprLatex = 'y\' + 3y = e^{x}';
        rawAst = constant(1);
        canonicalAnswerLatex = 'First-order Linear';
        canonicalAnswerRaw = 'First-order Linear';
      } else if (order === 2) {
        if (difficulty >= 3) {
          exprLatex = 'y\'\' + 4(y\')^{2} + 3y = 0';
          rawAst = constant(2);
          canonicalAnswerLatex = 'Second-order Non-linear';
          canonicalAnswerRaw = 'Second-order Non-linear';
        } else {
          exprLatex = 'y\'\' + 4y\' + 3y = e^{x}';
          rawAst = constant(2);
          canonicalAnswerLatex = 'Second-order Linear';
          canonicalAnswerRaw = 'Second-order Linear';
        }
      } else {
        exprLatex = 'y\'\'\' + 2y\'\' + y = 0';
        rawAst = constant(3);
        canonicalAnswerLatex = 'Third-order Linear';
        canonicalAnswerRaw = 'Third-order Linear';
      }

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Highest derivative is ${order === 1 ? "y'" : order === 2 ? "y''" : "y'''"}. Order is ${order}.`, pedagogicalRationale: 'ODE classification.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Order is the highest derivative present in the equation.', revealsFinalAnswer: false },
        { level: 2, category: 'FORMULA', text: 'Check linearity: all dependent variables and derivatives appear to power 1 without products.', revealsFinalAnswer: false },
        { level: 3, category: 'SETUP', text: `Highest derivative order is ${order}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
      ];

      const distractors: ProblemDistractor[] = [
        { id: 'OPT-CORR', distractorLatex: canonicalAnswerLatex, distractorRaw: canonicalAnswerRaw, pedagogicalExplanation: 'Correct classification.', isPlausible: true },
        { id: 'OPT-1', distractorLatex: order === 1 ? 'Second-order Linear' : 'First-order Linear', distractorRaw: order === 1 ? 'Second-order Linear' : 'First-order Linear', pedagogicalExplanation: 'Incorrect order identification.', isPlausible: true },
        { id: 'OPT-2', distractorLatex: order === 2 && difficulty >= 3 ? 'Second-order Linear' : 'Second-order Non-linear', distractorRaw: order === 2 && difficulty >= 3 ? 'Second-order Linear' : 'Second-order Non-linear', pedagogicalExplanation: 'Check exponent or linearity of derivatives.', isPlausible: true }
      ];

      return {
        statement: {
          promptText: 'Classify the given differential equation by order and linearity:',
          expressionLatex: exprLatex,
          targetVariable: 'class',
          independentVariable: 'x',
          options: distractors
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        distractors,
        difficultyVector: { overall: difficulty || 1, conceptual: 2, procedural: 1, computational: 1, reasoning: 2, representation: 1, context: 1, multiStep: 1 },
        structureSignature: `GEN0107:CLASSIFY:ORD${order}_DIFF${difficulty || 1}`
      };
    }
  },

  'TMPL-GEN0107-SEPARABLE-STD': {
    id: 'TMPL-GEN0107-SEPARABLE-STD',
    familyId: 'FAM-GEN0107-SEPARABLE-STD',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-003',
    name: 'Separable First-Order ODE Solution Template',
    description: 'Solve separable first-order differential equations with structural difficulty scaling.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 5, description: 'Separation coefficient' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 2;
      let promptText = '';
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let rawAst: any = constant(1);
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Direct integration separable dy/dx = a*x
          promptText = 'Solve the first-order differential equation by direct integration:';
          expressionLatex = `\\frac{dy}{dx} = ${a}x`;
          canonicalAnswerLatex = a === 2 ? `y(x) = x^{2} + C` : `y(x) = \\frac{${a}}{2}x^{2} + C`;
          rawAst = add(multiply(constant(a / 2), power(variable('x'), constant(2))), variable('C'));
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Separate variables: dy = ${a}x dx.`, pedagogicalRationale: 'Separation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Integrate both sides: y(x) = (${a}/2)x^2 + C.`, pedagogicalRationale: 'Polynomial integration.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: `Rewrite as dy = ${a}x dx.`, revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate both sides with respect to x.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Standard product separation dy/dx = a*x*y
          promptText = 'Solve the separable first-order differential equation:';
          expressionLatex = `\\frac{dy}{dx} = ${a}xy`;
          canonicalAnswerLatex = a === 2 ? `y(x) = C e^{x^{2}}` : `y(x) = C e^{\\frac{${a}}{2}x^{2}}`;
          rawAst = multiply(variable('C'), func('exp', multiply(constant(a / 2), power(variable('x'), constant(2)))));
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Separate variables: (1/y) dy = ${a}x dx.`, pedagogicalRationale: 'Variable separation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Integrate both sides: ln|y| = (${a}/2)x^2 + c_1.`, pedagogicalRationale: 'Logarithmic integration.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Exponentiate: y(x) = C * e^{(${a / 2})x^2}.`, pedagogicalRationale: 'Explicit solution.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: `Separate variables: (1/y) dy = ${a}x dx.`, revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate both sides to obtain ln|y| = (a/2)x^2 + C.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Quotient separation dy/dx = (a*x) / y
          promptText = 'Find the general implicit solution to the separable differential equation:';
          expressionLatex = `\\frac{dy}{dx} = \\frac{${a}x}{y}`;
          canonicalAnswerLatex = `y^{2} - ${a}x^{2} = C`;
          rawAst = constant(1);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Multiply by y and dx to separate: y dy = ${a}x dx.`, pedagogicalRationale: 'Cross multiplication separation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Integrate both sides: (1/2)y^2 = (${a}/2)x^2 + C_0.`, pedagogicalRationale: 'Integration.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Multiply by 2: y^2 - ${a}x^2 = C.`, pedagogicalRationale: 'Implicit algebraic form.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Separate variables to obtain y dy = a*x dx.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate both sides: (1/2)y^2 = (a/2)x^2 + C_0.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Transcendental / nonlinear separation dy/dx = (x + 1)(y^2 + 1)
          promptText = 'Solve the nonlinear separable differential equation for y(x):';
          expressionLatex = `\\frac{dy}{dx} = (x + 1)(y^{2} + 1)`;
          canonicalAnswerLatex = `y(x) = \\tan\\left(\\frac{1}{2}x^{2} + x + C\\right)`;
          rawAst = func('tan', add(add(divide(power(variable('x'), constant(2)), constant(2)), variable('x')), variable('C')));
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Separate variables: [1 / (y^2 + 1)] dy = (x + 1) dx.', pedagogicalRationale: 'Nonlinear separation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Integrate both sides: arctan(y) = (1/2)x^2 + x + C.', pedagogicalRationale: 'Inverse trig integration.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Solve for y: y(x) = tan((1/2)x^2 + x + C).', pedagogicalRationale: 'Explicit transcendental solution.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Divide by (y^2 + 1) and multiply by dx.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Recall integral of 1/(1+y^2) dy is arctan(y).', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:SEPARABLE:DIFF${difficulty}_A${a}`
      };
    }
  },

  'TMPL-GEN0107-LINEAR-1ST-IF': {
    id: 'TMPL-GEN0107-LINEAR-1ST-IF',
    familyId: 'FAM-GEN0107-LINEAR-1ST-IF',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-006',
    name: 'First-Order Linear ODE Integrating Factor Template',
    description: 'Solve first-order linear ODEs using integrating factors with structural scaling.',
    parameterSchema: [
      { name: 'coeff', type: 'INTEGER', min: 1, max: 4, description: 'Integrating factor constant coefficient' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let promptText = 'Solve the first-order linear differential equation:';
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let rawAst: any = constant(1);
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Constant coefficient dy/dx + 2y = 4
          expressionLatex = `\\frac{dy}{dx} + 2y = 4`;
          canonicalAnswerLatex = `y(x) = 2 + C e^{-2x}`;
          rawAst = add(constant(2), multiply(variable('C'), func('exp', multiply(constant(-2), variable('x')))));
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Identify standard linear form dy/dx + P(x)y = Q(x) with P = 2, Q = 4.', pedagogicalRationale: 'Linear form.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Integrating factor mu(x) = exp(integral 2 dx) = e^{2x}.', pedagogicalRationale: 'Integrating factor.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'y * e^{2x} = integral 4e^{2x} dx = 2e^{2x} + C => y(x) = 2 + C*e^{-2x}.', pedagogicalRationale: 'Solution assembly.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Use integrating factor mu(x) = e^(integral 2 dx) = e^(2x).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Multiply both sides by e^(2x) and integrate.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Linear forcing term dy/dx + y = 2x
          expressionLatex = `\\frac{dy}{dx} + y = 2x`;
          canonicalAnswerLatex = `y(x) = 2x - 2 + C e^{-x}`;
          rawAst = add(add(multiply(constant(2), variable('x')), constant(-2)), multiply(variable('C'), func('exp', multiply(constant(-1), variable('x')))));
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Integrating factor mu(x) = exp(integral 1 dx) = e^x.', pedagogicalRationale: 'Integrating factor.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Multiply and integrate: y * e^x = integral 2x e^x dx = 2(x - 1)e^x + C.', pedagogicalRationale: 'Integration by parts.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Divide by e^x: y(x) = 2x - 2 + C*e^{-x}.', pedagogicalRationale: 'General solution.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'The integrating factor is mu(x) = e^x.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate 2x e^x dx using integration by parts.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Exponential forcing term dy/dx + 3y = e^{2x}
          expressionLatex = `\\frac{dy}{dx} + 3y = e^{2x}`;
          canonicalAnswerLatex = `y(x) = \\frac{1}{5}e^{2x} + C e^{-3x}`;
          rawAst = add(multiply(divide(constant(1), constant(5)), func('exp', multiply(constant(2), variable('x')))), multiply(variable('C'), func('exp', multiply(constant(-3), variable('x')))));
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Integrating factor mu(x) = exp(integral 3 dx) = e^{3x}.', pedagogicalRationale: 'Integrating factor.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'y * e^{3x} = integral e^{2x} * e^{3x} dx = integral e^{5x} dx = (1/5)e^{5x} + C.', pedagogicalRationale: 'Exponential integration.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Multiply by e^{-3x}: y(x) = (1/5)e^{2x} + C*e^{-3x}.', pedagogicalRationale: 'General solution.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Multiply both sides by mu(x) = e^(3x).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate e^(5x) on the right hand side.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Variable coefficient P(x) = 1/x: dy/dx + (1/x)y = 3x
          expressionLatex = `\\frac{dy}{dx} + \\frac{1}{x}y = 3x`;
          canonicalAnswerLatex = `y(x) = x^{2} + \\frac{C}{x}`;
          rawAst = add(power(variable('x'), constant(2)), divide(variable('C'), variable('x')));
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Variable coefficient P(x) = 1/x. Integrating factor mu(x) = exp(integral (1/x) dx) = exp(ln|x|) = x.', pedagogicalRationale: 'Variable integrating factor.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Multiply through by x: d/dx[x*y] = 3x^2 => x*y = integral 3x^2 dx = x^3 + C.', pedagogicalRationale: 'Product rule reverse integration.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Divide by x: y(x) = x^2 + C/x.', pedagogicalRationale: 'Explicit solution.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Integrating factor is mu(x) = exp(integral 1/x dx) = x.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Notice d/dx(x*y) = 3x^2. Integrate both sides.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:LINEAR_IF:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0107-EXACT-ODE': {
    id: 'TMPL-GEN0107-EXACT-ODE',
    familyId: 'FAM-GEN0107-EXACT-ODE',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-005',
    name: 'Exact Differential Equation Potential Function Solution',
    description: 'Solve exact differential equations M(x,y)dx + N(x,y)dy = 0 with structural difficulty scaling.',
    parameterSchema: [
      { name: 'coeff', type: 'INTEGER', min: 1, max: 4, description: 'Exact equation coefficient' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Linear exact form (2x + y)dx + (x + 2y)dy = 0
          expressionLatex = `(2x + y)\\,dx + (x + 2y)\\,dy = 0`;
          canonicalAnswerLatex = `x^{2} + xy + y^{2} = C`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Exactness check: dM/dy = 1, dN/dx = 1. Equation is exact.', pedagogicalRationale: 'Exactness condition.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Integrate M with respect to x: Psi = x^2 + xy + g(y). dPsi/dy = x + g\'(y) = x + 2y => g(y) = y^2.', pedagogicalRationale: 'Potential integration.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'General solution: x^2 + xy + y^2 = C.', pedagogicalRationale: 'Implicit solution.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Verify exactness by testing if del M / del y = del N / del x.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate (2x + y) with respect to x.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Quadratic terms (3x^2 + 2xy)dx + (x^2 + 3y^2)dy = 0
          expressionLatex = `(3x^{2} + 2xy)\\,dx + (x^{2} + 3y^{2})\\,dy = 0`;
          canonicalAnswerLatex = `x^{3} + x^{2}y + y^{3} = C`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'dM/dy = 2x, dN/dx = 2x. Equation is exact.', pedagogicalRationale: 'Exactness condition.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Psi = integral (3x^2 + 2xy) dx = x^3 + x^2 y + g(y). dPsi/dy = x^2 + g\'(y) = x^2 + 3y^2 => g(y) = y^3.', pedagogicalRationale: 'Potential extraction.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'General solution: x^3 + x^2 y + y^3 = C.', pedagogicalRationale: 'Implicit solution.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Check that dM/dy = 2x and dN/dx = 2x.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate 3x^2 + 2xy dx to get x^3 + x^2 y + g(y).', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Exponential combination (e^y + 2x)dx + (x e^y + 3y^2)dy = 0
          expressionLatex = `(e^{y} + 2x)\\,dx + (x e^{y} + 3y^{2})\\,dy = 0`;
          canonicalAnswerLatex = `x e^{y} + x^{2} + y^{3} = C`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'dM/dy = e^y, dN/dx = e^y. Equation is exact.', pedagogicalRationale: 'Transcendental exactness.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Psi = integral (e^y + 2x) dx = x e^y + x^2 + g(y). dPsi/dy = x e^y + g\'(y) = x e^y + 3y^2 => g(y) = y^3.', pedagogicalRationale: 'Potential integration.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'General solution: x e^y + x^2 + y^3 = C.', pedagogicalRationale: 'Solution assembly.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Differentiate e^y + 2x with respect to y to get e^y.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate M with respect to x: x e^y + x^2 + g(y).', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Trigonometric cross-coupling (cos(y) + 3x^2)dx + (-x sin(y) + 2y)dy = 0
          expressionLatex = `(\\cos y + 3x^{2})\\,dx + (2y - x\\sin y)\\,dy = 0`;
          canonicalAnswerLatex = `x\\cos y + x^{3} + y^{2} = C`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'dM/dy = -sin(y), dN/dx = -sin(y). Equation is exact.', pedagogicalRationale: 'Trigonometric exactness.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Psi = integral (cos y + 3x^2) dx = x cos y + x^3 + g(y). dPsi/dy = -x sin y + g\'(y) = 2y - x sin y => g(y) = y^2.', pedagogicalRationale: 'Trig potential extraction.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'General solution: x cos y + x^3 + y^2 = C.', pedagogicalRationale: 'Solution assembly.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'd/dy[cos(y) + 3x^2] = -sin(y) and d/dx[2y - x sin(y)] = -sin(y).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Integrate M with respect to x: x cos(y) + x^3 + g(y).', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText: 'Solve the exact differential equation for its general solution:',
          expressionLatex,
          targetVariable: '\\psi(x, y)',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: constant(1),
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:EXACT:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0107-HOMOGENEOUS-VX': {
    id: 'TMPL-GEN0107-HOMOGENEOUS-VX',
    familyId: 'FAM-GEN0107-HOMOGENEOUS-VX',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    archetypeId: 'ARCH-HOMO-DIRECT-RATIO',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-DIRECT-RATIO']?.sourceMetadata,
    name: 'First-Order Homogeneous ODE via Substitution y = vx',
    description: 'Solve homogeneous first-order differential equations dy/dx = F(y/x) using the substitution y = vx (dy/dx = v + x dv/dx).',
    parameterSchema: [
      { name: 'k', type: 'INTEGER', min: 1, max: 4, defaultValue: 1, description: 'Scale factor' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      switch (difficulty) {
        case 1:
          expressionLatex = `\\frac{dy}{dx} = \\frac{x + y}{x}`;
          canonicalAnswerLatex = `y(x) = x(\\ln|x| + C)`;
          rawAst = divide(add(variable('x'), variable('y')), variable('x'));
          reasoningTrace = [
            {
              stepIndex: 1,
              phase: 'RECOGNITION',
              actionDescription: 'Verify homogeneity of degree 0: Rewrite RHS as F(y/x) = 1 + y/x.',
              pedagogicalRationale: 'Confirm homogeneous structure of degree 0.'
            },
            {
              stepIndex: 2,
              phase: 'FORMULA_SELECTION',
              actionDescription: 'Apply the substitution y = vx, which implies dy/dx = v + x dv/dx by the product rule.',
              pedagogicalRationale: 'Standard substitution for first-order homogeneous ODEs.'
            },
            {
              stepIndex: 3,
              phase: 'EXECUTION',
              actionDescription: 'Substitute into ODE: v + x dv/dx = 1 + v. Subtract v from both sides: x dv/dx = 1.',
              pedagogicalRationale: 'Reduction to separable ODE in variables v and x.'
            },
            {
              stepIndex: 4,
              phase: 'SIMPLIFICATION',
              actionDescription: 'Separate variables: dv = dx/x. Integrate both sides: int dv = int (1/x) dx => v = ln|x| + C.',
              pedagogicalRationale: 'Direct integration of separated differential form.'
            },
            {
              stepIndex: 5,
              phase: 'VERIFICATION',
              actionDescription: 'Back-substitute v = y/x: y/x = ln|x| + C => y(x) = x(ln|x| + C).',
              pedagogicalRationale: 'Restore original dependent variable y.'
            }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Notice the RHS is homogeneous of degree 0: (x + y)/x = 1 + (y/x).', revealsFinalAnswer: false },
            { level: 2, category: 'DIRECTION', text: 'Substitute y = vx, where v = v(x). By product rule, dy/dx = v + x(dv/dx).', revealsFinalAnswer: false },
            { level: 3, category: 'SETUP', text: 'Substitute into the equation: v + x(dv/dx) = 1 + v. Subtract v to obtain x(dv/dx) = 1.', revealsFinalAnswer: false },
            { level: 4, category: 'GUIDED_CALCULATION', text: 'Separate variables: dv = dx/x. Integrating gives v = ln|x| + C.', revealsFinalAnswer: false },
            { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          expressionLatex = `\\frac{dy}{dx} = \\frac{x^2 + y^2}{2xy}`;
          canonicalAnswerLatex = `x^2 - y^2 = Cx`;
          rawAst = divide(add(power(variable('x'), constant(2)), power(variable('y'), constant(2))), multiply(constant(2), variable('x'), variable('y')));
          reasoningTrace = [
            {
              stepIndex: 1,
              phase: 'RECOGNITION',
              actionDescription: 'Both numerator x^2 + y^2 and denominator 2xy are homogeneous polynomials of degree 2.',
              pedagogicalRationale: 'Degree 2 homogeneity check.'
            },
            {
              stepIndex: 2,
              phase: 'FORMULA_SELECTION',
              actionDescription: 'Apply y = vx => dy/dx = v + x dv/dx. Express RHS as (1 + v^2)/(2v).',
              pedagogicalRationale: 'Homogeneous substitution.'
            },
            {
              stepIndex: 3,
              phase: 'EXECUTION',
              actionDescription: 'v + x dv/dx = (1 + v^2)/(2v) => x dv/dx = (1 - v^2)/(2v).',
              pedagogicalRationale: 'Algebraic isolation of derivative.'
            },
            {
              stepIndex: 4,
              phase: 'SIMPLIFICATION',
              actionDescription: 'Separate variables: (2v / (1 - v^2)) dv = dx/x. Integrate: -ln|1 - v^2| = ln|x| + C_1 => ln|x(1 - v^2)| = C_2.',
              pedagogicalRationale: 'Logarithmic integration with chain rule.'
            },
            {
              stepIndex: 5,
              phase: 'VERIFICATION',
              actionDescription: 'Back-substitute v = y/x: x(1 - y^2/x^2) = C => (x^2 - y^2)/x = C => x^2 - y^2 = Cx.',
              pedagogicalRationale: 'General implicit solution.'
            }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Numerator and denominator are homogeneous of degree 2. Divide top and bottom by x^2.', revealsFinalAnswer: false },
            { level: 2, category: 'DIRECTION', text: 'Let y = vx, so dy/dx = v + x(dv/dx). The equation becomes v + x(dv/dx) = (1 + v^2)/(2v).', revealsFinalAnswer: false },
            { level: 3, category: 'SETUP', text: 'Subtract v: x(dv/dx) = (1 - v^2)/(2v). Then separate variables: (2v / (1 - v^2)) dv = dx/x.', revealsFinalAnswer: false },
            { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate both sides: -ln|1 - v^2| = ln|x| + C_1 => x(1 - v^2) = C.', revealsFinalAnswer: false },
            { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
        default:
          expressionLatex = `\\frac{dy}{dx} = \\frac{2xy + y^2}{x^2}`;
          canonicalAnswerLatex = `y(x) = \\frac{Cx^2}{1 - Cx}`;
          rawAst = divide(add(multiply(constant(2), variable('x'), variable('y')), power(variable('y'), constant(2))), power(variable('x'), constant(2)));
          reasoningTrace = [
            {
              stepIndex: 1,
              phase: 'RECOGNITION',
              actionDescription: 'Rewrite RHS as 2(y/x) + (y/x)^2, which is homogeneous of degree 0 in y/x.',
              pedagogicalRationale: 'Verification of degree 0 rational form.'
            },
            {
              stepIndex: 2,
              phase: 'FORMULA_SELECTION',
              actionDescription: 'Substitute y = vx, dy/dx = v + x dv/dx: v + x dv/dx = 2v + v^2.',
              pedagogicalRationale: 'Transformation to separable form.'
            },
            {
              stepIndex: 3,
              phase: 'EXECUTION',
              actionDescription: 'Subtract v: x dv/dx = v + v^2 = v(v + 1). Separate variables: dv / (v(v + 1)) = dx/x.',
              pedagogicalRationale: 'Separation and factoring denominator.'
            },
            {
              stepIndex: 4,
              phase: 'SIMPLIFICATION',
              actionDescription: 'Partial fraction expansion: (1/v - 1/(v+1)) dv = dx/x. Integrate: ln|v / (v+1)| = ln|x| + C_1 => v / (v + 1) = Cx.',
              pedagogicalRationale: 'Partial fraction integration.'
            },
            {
              stepIndex: 5,
              phase: 'VERIFICATION',
              actionDescription: 'Back-substitute v = y/x: (y/x) / (y/x + 1) = Cx => y / (y + x) = Cx => y = Cx(y + x) => y(1 - Cx) = Cx^2 => y(x) = (Cx^2) / (1 - Cx).',
              pedagogicalRationale: 'Explicit solution in terms of y(x).'
            }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Express RHS as 2(y/x) + (y/x)^2, confirming homogeneity of degree 0.', revealsFinalAnswer: false },
            { level: 2, category: 'DIRECTION', text: 'Substitute y = vx and dy/dx = v + x(dv/dx): v + x(dv/dx) = 2v + v^2.', revealsFinalAnswer: false },
            { level: 3, category: 'SETUP', text: 'Subtract v to get x(dv/dx) = v(v + 1). Separate: dv / (v(v + 1)) = dx/x.', revealsFinalAnswer: false },
            { level: 4, category: 'GUIDED_CALCULATION', text: 'Decompose 1/(v(v+1)) = 1/v - 1/(v+1). Integrate to obtain ln|v/(v+1)| = ln|x| + C_1 => v/(v+1) = Cx.', revealsFinalAnswer: false },
            { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      const taskType = 'SOLVE_GENERAL_SOLUTION';
      const archetypeId = 'ARCH-HOMO-DIRECT-RATIO';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Solve the homogeneous first-order differential equation using the substitution y = vx:'
      });

      return {
        statement: {
          promptText: 'Solve the homogeneous first-order differential equation using the substitution y = vx:',
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:HOMO_DIRECT_RATIO:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-HOMO-DIFF-FORM': {
    id: 'TMPL-GEN0107-HOMO-DIFF-FORM',
    familyId: 'FAM-GEN0107-HOMO-DIFF-FORM',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    archetypeId: 'ARCH-HOMO-DIFF-FORM',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-DIFF-FORM']?.sourceMetadata,
    name: 'Homogeneous ODE Differential Form Rearrangement M dx + N dy = 0',
    description: 'Solve homogeneous differential equations in differential form M dx + N dy = 0 requiring algebraic rearrangement.',
    parameterSchema: [
      { name: 'coeff', type: 'INTEGER', min: 1, max: 3, defaultValue: 1, description: 'Coefficient multiplier' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      if (difficulty <= 1) {
        // Level 1: (x + 2y) dx - x dy = 0
        expressionLatex = `(x + 2y)\\,dx - x\\,dy = 0`;
        canonicalAnswerLatex = `y(x) = Cx^2 - x`;
        rawAst = subtract(
          multiply(add(variable('x'), multiply(constant(2), variable('y'))), variable('dx')),
          multiply(variable('x'), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Observe that M(x, y) = x + 2y and N(x, y) = -x are both homogeneous of degree 1.',
            pedagogicalRationale: 'Check homogeneity of differential form M dx + N dy = 0.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Apply homogeneous substitution y = vx => dy = v dx + x dv.',
            pedagogicalRationale: 'Differential transformation for homogeneous ODEs.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: 'Substitute: (x + 2vx) dx - x(v dx + x dv) = 0 => x(1 + 2v) dx - x(v dx + x dv) = 0 => (1 + v) dx - x dv = 0.',
            pedagogicalRationale: 'Factor out x and group terms in dx and dv.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate variables: dx/x = dv/(1 + v). Integrate: ln|x| + C_1 = ln|1 + v| => 1 + v = Cx.',
            pedagogicalRationale: 'Separable variable integration.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Back-substitute v = y/x: 1 + y/x = Cx => y/x = Cx - 1 => y(x) = Cx^2 - x.',
            pedagogicalRationale: 'Algebraic isolation of dependent variable y(x).'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Both coefficients M = (x + 2y) and N = -x are homogeneous of degree 1.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Substitute y = vx and dy = v dx + x dv into the differential form.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Expand and group: (x + 2vx) dx - x(v dx + x dv) = x[(1 + v) dx - x dv] = 0.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Separate variables: dx/x = dv/(1 + v). Integrate to obtain ln|1 + v| = ln|x| + C_1 => 1 + v = Cx.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else if (difficulty === 2) {
        // Level 2: (x^2 + y^2) dx - 2xy dy = 0
        expressionLatex = `(x^2 + y^2)\\,dx - 2xy\\,dy = 0`;
        canonicalAnswerLatex = `x^2 - y^2 = Cx`;
        rawAst = subtract(
          multiply(add(power(variable('x'), constant(2)), power(variable('y'), constant(2))), variable('dx')),
          multiply(constant(2), variable('x'), variable('y'), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'M(x, y) = x^2 + y^2 and N(x, y) = -2xy are homogeneous polynomials of degree 2.',
            pedagogicalRationale: 'Degree 2 homogeneity verification.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Let y = vx, then dy = v dx + x dv.',
            pedagogicalRationale: 'Substitution into differential form.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: 'Substitute: (x^2 + v^2 x^2) dx - 2x(vx)(v dx + x dv) = 0 => x^2(1 + v^2) dx - 2x^2 v(v dx + x dv) = 0.',
            pedagogicalRationale: 'Divide by x^2 and simplify.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: '(1 - v^2) dx - 2vx dv = 0 => dx/x = (2v / (1 - v^2)) dv. Integrate: ln|x| = -ln|1 - v^2| + ln|C| => x(1 - v^2) = C.',
            pedagogicalRationale: 'Separation of variables and logarithmic integration.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Back-substitute v = y/x: x(1 - y^2/x^2) = C => (x^2 - y^2)/x = C => x^2 - y^2 = Cx.',
            pedagogicalRationale: 'Implicit algebraic form.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Both M = (x^2 + y^2) and N = -2xy are homogeneous of degree 2.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Substitute y = vx and dy = v dx + x dv, then factor out x^2.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: '(1 + v^2 - 2v^2) dx - 2vx dv = (1 - v^2) dx - 2vx dv = 0.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Separate: dx/x = 2v/(1 - v^2) dv. Integrating yields ln|x(1 - v^2)| = ln|C| => x(1 - v^2) = C.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 3: (y^2 - 2xy) dx - x^2 dy = 0
        expressionLatex = `(y^2 - 2xy)\\,dx - x^2\\,dy = 0`;
        canonicalAnswerLatex = `y(x) = \\frac{3x}{1 - Cx^3}`;
        rawAst = subtract(
          multiply(subtract(power(variable('y'), constant(2)), multiply(constant(2), variable('x'), variable('y'))), variable('dx')),
          multiply(power(variable('x'), constant(2)), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Degree 2 differential form: M(x, y) = y^2 - 2xy, N(x, y) = -x^2.',
            pedagogicalRationale: 'Castro Chapter 2 differential form recognition.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Substitute y = vx, dy = v dx + x dv.',
            pedagogicalRationale: 'Homogeneous substitution.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: '(v^2 x^2 - 2x^2 v) dx - x^2 (v dx + x dv) = 0 => (v^2 - 3v) dx - x dv = 0.',
            pedagogicalRationale: 'Cancel x^2 and group like terms.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate: dx/x = dv / (v(v - 3)) = (1/3)(1/(v - 3) - 1/v) dv. Integrate: 3 ln|x| + ln|C| = ln|(v - 3)/v| => (v - 3)/v = Cx^3.',
            pedagogicalRationale: 'Partial fraction decomposition in v.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Substitute v = y/x: (y/x - 3)/(y/x) = (y - 3x)/y = Cx^3 => y - 3x = Cx^3 y => y(1 - Cx^3) = 3x => y(x) = 3x / (1 - Cx^3).',
            pedagogicalRationale: 'Explicit solution construction.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Notice the equation is in differential form M dx + N dy = 0 with homogeneous polynomials of degree 2.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Let y = vx and dy = v dx + x dv. Divide through by x^2.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Grouping yields (v^2 - 3v) dx - x dv = 0 => dx/x = dv / (v(v - 3)).', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate using partial fractions: (1/3) ln|(v - 3)/v| = ln|x| + C_1 => (v - 3)/v = Cx^3.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      }

      const taskType = 'SOLVE_GENERAL_SOLUTION';
      const archetypeId = 'ARCH-HOMO-DIFF-FORM';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Solve the homogeneous first-order differential equation in differential form using substitution y = vx:'
      });

      return {
        statement: {
          promptText: 'Solve the homogeneous first-order differential equation in differential form using substitution y = vx:',
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty + 1, computational: 2, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty + 1 },
        structureSignature: `GEN0107:HOMO_DIFF_FORM:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-HOMO-DUAL-SUB': {
    id: 'TMPL-GEN0107-HOMO-DUAL-SUB',
    familyId: 'FAM-GEN0107-HOMO-DUAL-SUB',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    archetypeId: 'ARCH-HOMO-DUAL-SUB',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-DUAL-SUB']?.sourceMetadata,
    name: 'Homogeneous ODE Dual Monomial Substitution (x = vy vs y = vx)',
    description: 'Solve homogeneous equations where dx coefficient is simpler monomial, making x = vy structurally superior to y = vx.',
    parameterSchema: [
      { name: 'scale', type: 'INTEGER', min: 1, max: 3, defaultValue: 1, description: 'Scale factor' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      if (difficulty <= 2) {
        // Level 2: 2xy dx + (y^2 - x^2) dy = 0
        expressionLatex = `2xy\\,dx + (y^2 - x^2)\\,dy = 0`;
        canonicalAnswerLatex = `x^2 + y^2 = Cy`;
        rawAst = add(
          multiply(constant(2), variable('x'), variable('y'), variable('dx')),
          multiply(subtract(power(variable('y'), constant(2)), power(variable('x'), constant(2))), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'M(x, y) = 2xy is a single monomial, whereas N(x, y) = y^2 - x^2 is a binomial. According to Castro pedagogical rule, substituting x = vy (dx = v dy + y dv) is algebraically simpler than y = vx.',
            pedagogicalRationale: 'Monomial coefficient duality selection rule.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Let x = vy, dx = v dy + y dv.',
            pedagogicalRationale: 'Dual substitution selection.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: 'Substitute: 2(vy)y (v dy + y dv) + (y^2 - v^2 y^2) dy = 0 => 2v y^2 (v dy + y dv) + y^2(1 - v^2) dy = 0.',
            pedagogicalRationale: 'Factor out y^2.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Divide by y^2: (2v^2 + 1 - v^2) dy + 2vy dv = 0 => (v^2 + 1) dy + 2vy dv = 0 => dy/y + (2v/(v^2 + 1)) dv = 0.',
            pedagogicalRationale: 'Direct separation of variables.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Integrate: ln|y| + ln(v^2 + 1) = ln|C| => y(v^2 + 1) = C. Back-substitute v = x/y: y(x^2/y^2 + 1) = C => (x^2 + y^2)/y = C => x^2 + y^2 = Cy.',
            pedagogicalRationale: 'Back-substitution in terms of original variables.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Notice that M(x, y) = 2xy is a monomial while N(x, y) has two terms. Using dual substitution x = vy is algebraically simpler.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Substitute x = vy and dx = v dy + y dv. Factor out y^2 from the equation.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'The equation simplifies to (v^2 + 1) dy + 2vy dv = 0 => dy/y + (2v/(v^2 + 1)) dv = 0.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate: ln|y(v^2 + 1)| = ln|C| => y(v^2 + 1) = C.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 3: y dx + (2 sqrt(xy) - x) dy = 0
        expressionLatex = `y\\,dx + (2\\sqrt{xy} - x)\\,dy = 0`;
        canonicalAnswerLatex = `\\ln|y| + 2\\sqrt{\\frac{x}{y}} = C`;
        rawAst = add(
          multiply(variable('y'), variable('dx')),
          multiply(subtract(multiply(constant(2), func('sqrt', multiply(variable('x'), variable('y')))), variable('x')), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'M(x, y) = y is a pure monomial. Castro dual rule strongly favors x = vy.',
            pedagogicalRationale: 'Optimal substitution selection.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Set x = vy, dx = v dy + y dv.',
            pedagogicalRationale: 'Dual substitution transformation.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: 'y(v dy + y dv) + (2\\sqrt{v y^2} - vy) dy = 0 => y(v dy + y dv) + y(2\\sqrt{v} - v) dy = 0.',
            pedagogicalRationale: 'Factor y.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Divide by y: v dy + y dv + 2\\sqrt{v} dy - v dy = 0 => 2\\sqrt{v} dy + y dv = 0 => dy/y + dv/(2\\sqrt{v}) = 0.',
            pedagogicalRationale: 'Separation and radical integration.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Integrate: ln|y| + \\sqrt{v} = C => ln|y| + \\sqrt{x/y} = C.',
            pedagogicalRationale: 'Final algebraic back-substitution.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Since dx has a single monomial coefficient y, substitute x = vy and dx = v dy + y dv.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Substitute and simplify the radical: sqrt(xy) = sqrt(v y^2) = y sqrt(v).', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Canceling v dy terms leaves 2 sqrt(v) dy + y dv = 0 => dy/y + dv / (2 sqrt(v)) = 0.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate: ln|y| + sqrt(v) = C.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      }

      const taskType = 'SOLVE_GENERAL_SOLUTION';
      const archetypeId = 'ARCH-HOMO-DUAL-SUB';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Solve the homogeneous differential equation using the optimal dual substitution (x = vy or y = vx):'
      });

      return {
        statement: {
          promptText: 'Solve the homogeneous differential equation using the optimal dual substitution (x = vy or y = vx):',
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty + 1, procedural: difficulty, computational: 2, reasoning: difficulty + 1, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:HOMO_DUAL_SUB:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-HOMO-PARTIAL-FRAC': {
    id: 'TMPL-GEN0107-HOMO-PARTIAL-FRAC',
    familyId: 'FAM-GEN0107-HOMO-PARTIAL-FRAC',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    archetypeId: 'ARCH-HOMO-PARTIAL-FRAC',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-PARTIAL-FRAC']?.sourceMetadata,
    name: 'Homogeneous ODE with Quadratic/Partial Fraction Separation',
    description: 'Solve homogeneous ODEs where substitution y = vx produces a quadratic denominator in v requiring partial fractions.',
    parameterSchema: [
      { name: 'b', type: 'INTEGER', min: 2, max: 4, defaultValue: 2, description: 'Trinomial coefficient' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      if (difficulty <= 3) {
        // Level 3: dy/dx = (2xy + 2y^2)/x^2
        expressionLatex = `\\frac{dy}{dx} = \\frac{2xy + 2y^2}{x^2}`;
        canonicalAnswerLatex = `y(x) = \\frac{Cx^2}{1 - 2Cx}`;
        rawAst = divide(
          add(multiply(constant(2), variable('x'), variable('y')), multiply(constant(2), power(variable('y'), constant(2)))),
          power(variable('x'), constant(2))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Homogeneous degree 0 on RHS: 2(y/x) + 2(y/x)^2.',
            pedagogicalRationale: 'Homogeneous ratio test.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Apply y = vx => dy/dx = v + x dv/dx.',
            pedagogicalRationale: 'Standard substitution y = vx.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: 'v + x dv/dx = 2v + 2v^2 => x dv/dx = v + 2v^2 = v(2v + 1). Separate: dv / (v(2v + 1)) = dx/x.',
            pedagogicalRationale: 'Algebraic reduction to separable differential form.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Decompose: 1/(v(2v + 1)) = 1/v - 2/(2v + 1). Integrate: ln|v| - ln|2v + 1| = ln|x| + ln|C| => v / (2v + 1) = Cx.',
            pedagogicalRationale: 'Partial fractions integration in v.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Back-substitute v = y/x: (y/x)/(2y/x + 1) = Cx => y/(2y + x) = Cx => y = Cx(2y + x) => y(1 - 2Cx) = Cx^2 => y(x) = Cx^2 / (1 - 2Cx).',
            pedagogicalRationale: 'Explicit solution in terms of y(x).'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Express the RHS as 2(y/x) + 2(y/x)^2, confirming homogeneity of degree 0.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Substitute y = vx and dy/dx = v + x(dv/dx): v + x(dv/dx) = 2v + 2v^2.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Subtract v: x(dv/dx) = v(2v + 1). Separate variables: dv / (v(2v + 1)) = dx/x.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Decompose into partial fractions: 1/v - 2/(2v + 1). Integrate to obtain v/(2v + 1) = Cx.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: dy/dx = (2x^2 + 5xy + 2y^2)/x^2
        expressionLatex = `\\frac{dy}{dx} = \\frac{2x^2 + 5xy + 2y^2}{x^2}`;
        canonicalAnswerLatex = `-\\frac{x}{x + y} = 2\\ln|x| + C`;
        rawAst = divide(
          add(multiply(constant(2), power(variable('x'), constant(2))), multiply(constant(5), variable('x'), variable('y')), multiply(constant(2), power(variable('y'), constant(2)))),
          power(variable('x'), constant(2))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'RHS is 2 + 5(y/x) + 2(y/x)^2, homogeneous of degree 0.',
            pedagogicalRationale: 'Quadratic ratio recognition.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Let y = vx, dy/dx = v + x dv/dx.',
            pedagogicalRationale: 'Homogeneous substitution.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: 'v + x dv/dx = 2 + 5v + 2v^2 => x dv/dx = 2v^2 + 4v + 2 = 2(v + 1)^2.',
            pedagogicalRationale: 'Grouping into perfect square trinomial.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate variables: dv / (v + 1)^2 = 2 dx/x. Integrate: -1/(v + 1) = 2 ln|x| + C.',
            pedagogicalRationale: 'Power rule integration.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Back-substitute v = y/x: -1/(y/x + 1) = -x/(x + y) = 2 ln|x| + C.',
            pedagogicalRationale: 'Restoration of dependent variable.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Substitute y = vx into dy/dx = 2 + 5(y/x) + 2(y/x)^2.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'v + x(dv/dx) = 2 + 5v + 2v^2. Subtract v to obtain x(dv/dx) = 2(v + 1)^2.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Separate variables: dv / (v + 1)^2 = 2 dx/x.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate both sides: -1/(v + 1) = 2 ln|x| + C. Replace v with y/x.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      }

      const taskType = 'SOLVE_GENERAL_SOLUTION';
      const archetypeId = 'ARCH-HOMO-PARTIAL-FRAC';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Solve the homogeneous first-order differential equation using substitution y = vx:'
      });

      return {
        statement: {
          promptText: 'Solve the homogeneous first-order differential equation using substitution y = vx:',
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty + 1, computational: 3, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty + 1 },
        structureSignature: `GEN0107:HOMO_PARTIAL_FRAC:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-HOMO-INVERSE-TRIG': {
    id: 'TMPL-GEN0107-HOMO-INVERSE-TRIG',
    familyId: 'FAM-GEN0107-HOMO-INVERSE-TRIG',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    archetypeId: 'ARCH-HOMO-INVERSE-TRIG',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-INVERSE-TRIG']?.sourceMetadata,
    name: 'Homogeneous ODE with Irreducible Quadratic Denominator / Inverse Trig Integration',
    description: 'Solve homogeneous ODEs where substitution y = vx leads to an irreducible quadratic denominator (1 + v^2) integrating to arctan(y/x).',
    parameterSchema: [
      { name: 'scale', type: 'INTEGER', min: 1, max: 3, defaultValue: 1, description: 'Scale parameter' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      if (difficulty <= 3) {
        // Level 3 / Castro Spread 14 Problem 1: (x - 2y) dx + (2x + y) dy = 0
        expressionLatex = `(x - 2y)\\,dx + (2x + y)\\,dy = 0`;
        canonicalAnswerLatex = `\\ln(x^2 + y^2) + 4\\arctan\\left(\\frac{y}{x}\\right) = C`;
        rawAst = add(
          multiply(subtract(variable('x'), multiply(constant(2), variable('y'))), variable('dx')),
          multiply(add(multiply(constant(2), variable('x')), variable('y')), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'M(x, y) = x - 2y and N(x, y) = 2x + y are homogeneous polynomials of degree 1.',
            pedagogicalRationale: 'Castro Spread 14 Problem 1 recognition of homogeneous differential form.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Apply substitution y = vx => dy = v dx + x dv.',
            pedagogicalRationale: 'Homogeneous differential transformation.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: '(x - 2vx) dx + (2x + vx)(v dx + x dv) = 0 => (1 - 2v) dx + (2 + v)(v dx + x dv) = 0 => (1 - 2v + 2v + v^2) dx + x(2 + v) dv = 0 => (1 + v^2) dx + x(2 + v) dv = 0.',
            pedagogicalRationale: 'Factor out x and expand into grouped differentials.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate variables: dx/x + (2 + v)/(1 + v^2) dv = 0 => dx/x + 2/(1 + v^2) dv + v/(1 + v^2) dv = 0. Integrate: ln|x| + 2 arctan(v) + (1/2)ln(1 + v^2) = C_0.',
            pedagogicalRationale: 'Integration producing arctan(v) and logarithmic terms.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Combine logs: 2 ln|x| + ln(1 + v^2) + 4 arctan(v) = C => ln[x^2(1 + y^2/x^2)] + 4 arctan(y/x) = C => ln(x^2 + y^2) + 4 arctan(y/x) = C.',
            pedagogicalRationale: 'Algebraic consolidation into implicit general solution.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Both M = (x - 2y) and N = (2x + y) are homogeneous of degree 1. Use substitution y = vx and dy = v dx + x dv.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Substitute and factor out x: (1 - 2v) dx + (2 + v)(v dx + x dv) = (1 + v^2) dx + x(2 + v) dv = 0.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Separate variables: dx/x + 2/(1 + v^2) dv + v/(1 + v^2) dv = 0.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate: ln|x| + 2 arctan(v) + (1/2)ln(1 + v^2) = C_0. Multiply by 2 and combine logarithmic arguments.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 4: (x + y) dx + (x - y) dy = 0
        expressionLatex = `(x + y)\\,dx + (x - y)\\,dy = 0`;
        canonicalAnswerLatex = `x^2 + 2xy - y^2 = C`;
        rawAst = add(
          multiply(add(variable('x'), variable('y')), variable('dx')),
          multiply(subtract(variable('x'), variable('y')), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Degree 1 homogeneous differential form with cross-signs in M and N.',
            pedagogicalRationale: 'Irreducible quadratic denominator verification.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Substitute y = vx, dy = v dx + x dv.',
            pedagogicalRationale: 'Homogeneous substitution.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: '(1 + v) dx + (1 - v)(v dx + x dv) = 0 => (1 + v + v - v^2) dx + x(1 - v) dv = 0 => (1 + 2v - v^2) dx + x(1 - v) dv = 0.',
            pedagogicalRationale: 'Grouping into differential separation.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate: dx/x + (1 - v)/(1 + 2v - v^2) dv = 0. Notice d/dv[1 + 2v - v^2] = 2 - 2v = 2(1 - v). Integrate: ln|x| + (1/2)ln|1 + 2v - v^2| = C.',
            pedagogicalRationale: 'Logarithmic integration with quadratic argument.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Multiply by 2 and combine: ln[x^2(1 + 2(y/x) - y^2/x^2)] = C => x^2 + 2xy - y^2 = C.',
            pedagogicalRationale: 'Implicit algebraic general solution.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Substitute y = vx and dy = v dx + x dv into (x + y) dx + (x - y) dy = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Expand and group: (1 + 2v - v^2) dx + x(1 - v) dv = 0.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Notice the numerator (1 - v) is proportional to the derivative of (1 + 2v - v^2).', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate: 2 ln|x| + ln|1 + 2v - v^2| = ln|C| => x^2(1 + 2y/x - y^2/x^2) = C.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      }

      const taskType = 'SOLVE_GENERAL_SOLUTION';
      const archetypeId = 'ARCH-HOMO-INVERSE-TRIG';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Solve the homogeneous first-order differential equation for its general solution:'
      });

      return {
        statement: {
          promptText: 'Solve the homogeneous first-order differential equation for its general solution:',
          expressionLatex,
          targetVariable: 'C',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty + 1, procedural: difficulty + 1, computational: 3, reasoning: difficulty + 1, representation: 1, context: 1, multiStep: difficulty + 1 },
        structureSignature: `GEN0107:HOMO_INVERSE_TRIG:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-HOMO-TRANSCENDENTAL': {
    id: 'TMPL-GEN0107-HOMO-TRANSCENDENTAL',
    familyId: 'FAM-GEN0107-HOMO-TRANSCENDENTAL',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    archetypeId: 'ARCH-HOMO-TRANSCENDENTAL',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-TRANSCENDENTAL']?.sourceMetadata,
    name: 'Homogeneous ODE with Transcendental Trigonometric / Radical Separation',
    description: 'Solve homogeneous ODEs involving transcendental functions of (y/x) or radical expressions.',
    parameterSchema: [
      { name: 'variant', type: 'INTEGER', min: 1, max: 2, defaultValue: 1, description: 'Trig vs radical variant' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      if (difficulty <= 4) {
        // Level 4 / Castro Spread 17 Problem 14: [x csc(y/x) - y] dx + x dy = 0
        expressionLatex = `\\left[x\\csc\\left(\\frac{y}{x}\\right) - y\\right]\\,dx + x\\,dy = 0`;
        canonicalAnswerLatex = `\\ln|x| - \\cos\\left(\\frac{y}{x}\\right) = C`;
        rawAst = add(
          multiply(subtract(multiply(variable('x'), func('csc', divide(variable('y'), variable('x')))), variable('y')), variable('dx')),
          multiply(variable('x'), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Equation is homogeneous of degree 1 with transcendental trigonometric term csc(y/x).',
            pedagogicalRationale: 'Castro Spread 17 Problem 14 transcendental archetype recognition.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Apply homogeneous substitution y = vx => dy = v dx + x dv.',
            pedagogicalRationale: 'Standard substitution y = vx.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: '[x csc(v) - vx] dx + x(v dx + x dv) = 0 => x[csc(v) - v] dx + x[v dx + x dv] = 0 => csc(v) dx - v dx + v dx + x dv = 0 => csc(v) dx + x dv = 0.',
            pedagogicalRationale: 'Cancellation of v dx terms leaving pure separable form.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate variables: dx/x + dv / csc(v) = 0 => dx/x + sin(v) dv = 0. Integrate: ln|x| - cos(v) = C.',
            pedagogicalRationale: 'Trigonometric integration.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Back-substitute v = y/x: ln|x| - cos(y/x) = C.',
            pedagogicalRationale: 'Restore original variables.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Notice csc(y/x) depends strictly on y/x. Substitute y = vx and dy = v dx + x dv.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Factor out x: [csc(v) - v] dx + (v dx + x dv) = 0. Notice the -v dx and +v dx terms cancel.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'The simplified equation is csc(v) dx + x dv = 0 => dx/x + sin(v) dv = 0.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate: ln|x| - cos(v) = C. Replace v with y/x.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 5 / Castro Spread 16 Problem 10: (y + sqrt(x^2 - y^2)) dx - x dy = 0
        expressionLatex = `\\left(y + \\sqrt{x^2 - y^2}\\right)\\,dx - x\\,dy = 0`;
        canonicalAnswerLatex = `\\arcsin\\left(\\frac{y}{x}\\right) = \\ln|x| + C`;
        rawAst = subtract(
          multiply(add(variable('y'), func('sqrt', subtract(power(variable('x'), constant(2)), power(variable('y'), constant(2))))), variable('dx')),
          multiply(variable('x'), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'M(x, y) = y + sqrt(x^2 - y^2) and N(x, y) = -x are homogeneous of degree 1 since sqrt(t^2 x^2 - t^2 y^2) = t sqrt(x^2 - y^2).',
            pedagogicalRationale: 'Castro Spread 16 Problem 10 radical homogeneity verification.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Substitute y = vx, dy = v dx + x dv.',
            pedagogicalRationale: 'Homogeneous substitution.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: '(vx + x sqrt(1 - v^2)) dx - x(v dx + x dv) = 0 => (v + sqrt(1 - v^2)) dx - v dx - x dv = 0 => sqrt(1 - v^2) dx - x dv = 0.',
            pedagogicalRationale: 'Cancellation of v dx terms.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate variables: dx/x = dv / sqrt(1 - v^2). Integrate both sides: ln|x| + C = arcsin(v).',
            pedagogicalRationale: 'Inverse sine integration.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Back-substitute v = y/x: arcsin(y/x) = ln|x| + C.',
            pedagogicalRationale: 'Restoration of dependent variable.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Substitute y = vx and factor out x from the square root: sqrt(x^2 - v^2 x^2) = x sqrt(1 - v^2).', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: '(vx + x sqrt(1 - v^2)) dx - x(v dx + x dv) = 0. Divide by x: sqrt(1 - v^2) dx - x dv = 0.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Separate variables: dx/x = dv / sqrt(1 - v^2).', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Integrate: ln|x| + C = arcsin(v). Replace v with y/x.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      }

      const taskType = 'SOLVE_GENERAL_SOLUTION';
      const archetypeId = 'ARCH-HOMO-TRANSCENDENTAL';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Solve the homogeneous first-order differential equation for its general solution:'
      });

      return {
        statement: {
          promptText: 'Solve the homogeneous first-order differential equation for its general solution:',
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty + 1, procedural: difficulty + 1, computational: 3, reasoning: difficulty + 1, representation: 1, context: 1, multiStep: difficulty + 1 },
        structureSignature: `GEN0107:HOMO_TRANSCENDENTAL:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-HOMO-IVP': {
    id: 'TMPL-GEN0107-HOMO-IVP',
    familyId: 'FAM-GEN0107-HOMO-IVP',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    archetypeId: 'ARCH-HOMO-IVP',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-IVP']?.sourceMetadata,
    name: 'Homogeneous Initial Value Problem (Particular Solution)',
    description: 'Solve homogeneous first-order initial value problems to find the unique particular solution.',
    parameterSchema: [
      { name: 'y0', type: 'INTEGER', min: 1, max: 3, defaultValue: 2, description: 'Initial condition y(1)' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const y0 = params?.y0 ?? 2;
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      if (difficulty <= 2) {
        // Level 2: dy/dx = (x + y)/x, y(1) = y0
        expressionLatex = `\\frac{dy}{dx} = \\frac{x + y}{x}, \\quad y(1) = ${y0}`;
        canonicalAnswerLatex = `y(x) = x(\\ln|x| + ${y0})`;
        rawAst = divide(add(variable('x'), variable('y')), variable('x'));
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: `Homogeneous first-order ODE subject to initial boundary constraint y(1) = ${y0}.`,
            pedagogicalRationale: 'Initial value problem definition.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Apply substitution y = vx => dy/dx = v + x dv/dx.',
            pedagogicalRationale: 'Homogeneous reduction.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: 'v + x dv/dx = 1 + v => x dv/dx = 1 => dv = dx/x => v = ln|x| + C => y = x(ln|x| + C).',
            pedagogicalRationale: 'General solution derivation.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: `Apply initial condition y(1) = ${y0}: ${y0} = 1(ln(1) + C) = 1(0 + C) => C = ${y0}.`,
            pedagogicalRationale: 'Evaluation of constant of integration.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: `Substitute C = ${y0} into general solution: y(x) = x(ln|x| + ${y0}).`,
            pedagogicalRationale: 'Particular solution verification.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: `First find the general solution using y = vx, then evaluate the boundary condition y(1) = ${y0}.`, revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Substitution y = vx gives x(dv/dx) = 1 => v = ln|x| + C => y = x(ln|x| + C).', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: `Substitute x = 1 and y = ${y0}: ${y0} = 1(ln(1) + C) => C = ${y0}.`, revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: `Particular solution: y(x) = x(ln|x| + ${y0}).`, revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 3: (x^2 + y^2) dx - 2xy dy = 0, y(2) = 0
        expressionLatex = `(x^2 + y^2)\\,dx - 2xy\\,dy = 0, \\quad y(2) = 0`;
        canonicalAnswerLatex = `x^2 - y^2 = 2x`;
        rawAst = subtract(
          multiply(add(power(variable('x'), constant(2)), power(variable('y'), constant(2))), variable('dx')),
          multiply(constant(2), variable('x'), variable('y'), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Degree 2 differential form with initial condition y(2) = 0.',
            pedagogicalRationale: 'Castro IVP archetype.'
          },
          {
            stepIndex: 2,
            phase: 'FORMULA_SELECTION',
            actionDescription: 'Let y = vx, dy = v dx + x dv.',
            pedagogicalRationale: 'Differential form substitution.'
          },
          {
            stepIndex: 3,
            phase: 'EXECUTION',
            actionDescription: 'Separation yields dx/x = 2v/(1 - v^2) dv => ln|x| = -ln|1 - v^2| + ln|C| => x^2 - y^2 = Cx.',
            pedagogicalRationale: 'General implicit solution.'
          },
          {
            stepIndex: 4,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Evaluate at (2, 0): 2^2 - 0^2 = C(2) => 4 = 2C => C = 2.',
            pedagogicalRationale: 'Constant evaluation.'
          },
          {
            stepIndex: 5,
            phase: 'VERIFICATION',
            actionDescription: 'Particular solution: x^2 - y^2 = 2x.',
            pedagogicalRationale: 'Particular implicit solution.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Find the general solution of (x^2 + y^2) dx - 2xy dy = 0 using y = vx, then apply y(2) = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'The general solution is x^2 - y^2 = Cx.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Substitute x = 2, y = 0: (2)^2 - (0)^2 = C(2) => 4 = 2C => C = 2.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Particular solution: x^2 - y^2 = 2x.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      }

      const taskType = 'SOLVE_INITIAL_VALUE_PROBLEM';
      const archetypeId = 'ARCH-HOMO-IVP';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Solve the homogeneous first-order initial value problem for the particular solution using substitution y = vx:'
      });

      return {
        statement: {
          promptText: 'Solve the homogeneous first-order initial value problem for the particular solution using substitution y = vx:',
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty + 1, computational: 2, reasoning: difficulty + 1, representation: 1, context: 1, multiStep: difficulty + 1 },
        structureSignature: `GEN0107:HOMO_IVP:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-HOMO-DEGREE-TEST': {
    id: 'TMPL-GEN0107-HOMO-DEGREE-TEST',
    familyId: 'FAM-GEN0107-HOMO-DEGREE-TEST',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'ANALYZE_HOMOGENEITY_DEGREE',
    archetypeId: 'ARCH-HOMO-DEGREE-TEST',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-DEGREE-TEST']?.sourceMetadata,
    name: 'Euler Homogeneity & Degree Verification Test',
    description: 'Verify whether a given function or differential equation is homogeneous and determine its degree n using Euler scaling.',
    parameterSchema: [
      { name: 'variant', type: 'INTEGER', min: 1, max: 2, defaultValue: 1, description: 'Polynomial vs rational' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      if (difficulty <= 1) {
        // Level 1: f(x, y) = x^3 + 3x^2 y - 4y^3
        expressionLatex = `f(x, y) = x^3 + 3x^2 y - 4y^3`;
        canonicalAnswerLatex = `n = 3`;
        rawAst = add(
          power(variable('x'), constant(3)),
          multiply(constant(3), power(variable('x'), constant(2)), variable('y')),
          negate(multiply(constant(4), power(variable('y'), constant(3))))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Test definition of homogeneity: Evaluate f(\\lambda x, \\lambda y).',
            pedagogicalRationale: 'Castro Euler scaling definition f(tx, ty) = t^n f(x, y).'
          },
          {
            stepIndex: 2,
            phase: 'EXECUTION',
            actionDescription: 'f(\\lambda x, \\lambda y) = (\\lambda x)^3 + 3(\\lambda x)^2(\\lambda y) - 4(\\lambda y)^3 = \\lambda^3 x^3 + 3\\lambda^3 x^2 y - 4\\lambda^3 y^3.',
            pedagogicalRationale: 'Algebraic expansion with scalar parameter \\lambda.'
          },
          {
            stepIndex: 3,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Factor out \\lambda^3: \\lambda^3 (x^3 + 3x^2 y - 4y^3) = \\lambda^3 f(x, y).',
            pedagogicalRationale: 'Degree extraction.'
          },
          {
            stepIndex: 4,
            phase: 'INTERPRETATION',
            actionDescription: 'Since f(\\lambda x, \\lambda y) = \\lambda^3 f(x, y), the function is homogeneous of degree n = 3.',
            pedagogicalRationale: 'Conclusion.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'A function is homogeneous of degree n if f(tx, ty) = t^n f(x, y).', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Replace x with tx and y with ty: (tx)^3 + 3(tx)^2(ty) - 4(ty)^3.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Factor out the common power of t: t^3 [x^3 + 3x^2 y - 4y^3] = t^3 f(x, y).', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'The exponent of t is 3, so degree n = 3.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else {
        // Level 2: f(x, y) = (x^2 - 3xy) / (x + 4y)
        expressionLatex = `f(x, y) = \\frac{x^2 - 3xy}{x + 4y}`;
        canonicalAnswerLatex = `n = 1`;
        rawAst = divide(
          subtract(power(variable('x'), constant(2)), multiply(constant(3), variable('x'), variable('y'))),
          add(variable('x'), multiply(constant(4), variable('y')))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Evaluate rational function scaling: f(\\lambda x, \\lambda y).',
            pedagogicalRationale: 'Homogeneous rational degree evaluation.'
          },
          {
            stepIndex: 2,
            phase: 'EXECUTION',
            actionDescription: 'f(\\lambda x, \\lambda y) = [(\\lambda x)^2 - 3(\\lambda x)(\\lambda y)] / [(\\lambda x) + 4(\\lambda y)] = \\lambda^2(x^2 - 3xy) / [\\lambda(x + 4y)].',
            pedagogicalRationale: 'Numerator and denominator scaling.'
          },
          {
            stepIndex: 3,
            phase: 'SIMPLIFICATION',
            actionDescription: '\\lambda^2 / \\lambda = \\lambda^1 = \\lambda f(x, y).',
            pedagogicalRationale: 'Exponent quotient.'
          },
          {
            stepIndex: 4,
            phase: 'INTERPRETATION',
            actionDescription: 'The function is homogeneous of degree n = 1.',
            pedagogicalRationale: 'Degree confirmation.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Evaluate scaling of both numerator and denominator with factor t.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Numerator scales as t^2; denominator scales as t^1.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'f(tx, ty) = [t^2 (x^2 - 3xy)] / [t (x + 4y)] = t^(2 - 1) f(x, y) = t^1 f(x, y).', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'The resulting exponent is 2 - 1 = 1, so degree n = 1.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      }

      const taskType = 'ANALYZE_HOMOGENEITY_DEGREE';
      const archetypeId = 'ARCH-HOMO-DEGREE-TEST';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Apply the Euler homogeneity test f(tx, ty) = t^n f(x, y) to find the degree of homogeneity n:'
      });

      return {
        statement: {
          promptText: 'Apply the Euler homogeneity test f(tx, ty) = t^n f(x, y) to find the degree of homogeneity n:',
          expressionLatex,
          targetVariable: 'n',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: difficulty + 1, representation: 1, context: 1, multiStep: 1 },
        structureSignature: `GEN0107:HOMO_DEGREE_TEST:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-HOMO-VERIFY': {
    id: 'TMPL-GEN0107-HOMO-VERIFY',
    familyId: 'FAM-GEN0107-HOMO-VERIFY',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_first_order_homogeneous_y_vx',
    taskType: 'VERIFY_SOLUTION',
    archetypeId: 'ARCH-HOMO-VERIFY',
    sourceMetadata: ARCHETYPE_REGISTRY['ARCH-HOMO-VERIFY']?.sourceMetadata,
    name: 'Homogeneous ODE Solution Verification',
    description: 'Verify whether a proposed algebraic relation satisfies a given homogeneous differential equation.',
    parameterSchema: [
      { name: 'mode', type: 'INTEGER', min: 1, max: 2, defaultValue: 1, description: 'Verification relation mode' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = 'Verified: The relation satisfies the differential equation.';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];
      let rawAst: any = constant(1);

      if (difficulty <= 1) {
        expressionLatex = `\\frac{dy}{dx} = \\frac{x + y}{x}, \\quad \\text{Relation: } y(x) = x(\\ln|x| + C)`;
        rawAst = divide(add(variable('x'), variable('y')), variable('x'));
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Differentiate proposed candidate y(x) = x(ln|x| + C) using product rule.',
            pedagogicalRationale: 'Backward solution verification.'
          },
          {
            stepIndex: 2,
            phase: 'EXECUTION',
            actionDescription: 'dy/dx = 1 * (ln|x| + C) + x * (1/x) = ln|x| + C + 1.',
            pedagogicalRationale: 'Calculus differentiation.'
          },
          {
            stepIndex: 3,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Substitute candidate y into RHS of ODE: (x + y)/x = 1 + y/x = 1 + (x(ln|x| + C))/x = 1 + ln|x| + C.',
            pedagogicalRationale: 'Algebraic substitution.'
          },
          {
            stepIndex: 4,
            phase: 'VERIFICATION',
            actionDescription: 'LHS = 1 + ln|x| + C = RHS. Identity holds for all x != 0.',
            pedagogicalRationale: 'Verification confirmed.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate y(x) = x(ln|x| + C) using product rule: dy/dx = (ln|x| + C) + 1.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Compute the RHS of the differential equation: (x + y)/x = 1 + y/x.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Substitute y = x(ln|x| + C): 1 + x(ln|x| + C)/x = 1 + ln|x| + C.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Both sides equal ln|x| + C + 1, verifying the solution.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      } else {
        expressionLatex = `(x^2 + y^2)\\,dx - 2xy\\,dy = 0, \\quad \\text{Relation: } x^2 - y^2 = Cx`;
        rawAst = subtract(
          multiply(add(power(variable('x'), constant(2)), power(variable('y'), constant(2))), variable('dx')),
          multiply(constant(2), variable('x'), variable('y'), variable('dy'))
        );
        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Differentiate candidate relation x^2 - y^2 = Cx implicitly with respect to x.',
            pedagogicalRationale: 'Implicit differentiation verification.'
          },
          {
            stepIndex: 2,
            phase: 'EXECUTION',
            actionDescription: '2x - 2y(dy/dx) = C. From candidate relation, C = (x^2 - y^2)/x.',
            pedagogicalRationale: 'Eliminate parameter C.'
          },
          {
            stepIndex: 3,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Substitute C: 2x - 2y(dy/dx) = (x^2 - y^2)/x => 2x^2 - 2xy(dy/dx) = x^2 - y^2 => 2xy(dy/dx) = x^2 + y^2.',
            pedagogicalRationale: 'Algebraic clearing of denominator.'
          },
          {
            stepIndex: 4,
            phase: 'VERIFICATION',
            actionDescription: 'Rearrange in differential form: (x^2 + y^2) dx - 2xy dy = 0. Exactly matches original ODE.',
            pedagogicalRationale: 'Verification confirmed.'
          }
        ];
        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate x^2 - y^2 = Cx implicitly to verify the homogeneous differential equation: 2x - 2y dy/dx = C.', revealsFinalAnswer: false },
          { level: 2, category: 'DIRECTION', text: 'Express constant C from the relation: C = (x^2 - y^2)/x.', revealsFinalAnswer: false },
          { level: 3, category: 'SETUP', text: 'Substitute C into the differentiated equation: 2x - 2y y\' = (x^2 - y^2)/x.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Multiply by x and rearrange: (x^2 + y^2) dx - 2xy dy = 0, verifying the homogeneous ODE.', revealsFinalAnswer: false },
          { level: 5, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
        ];
      }

      const taskType = 'VERIFY_SOLUTION';
      const archetypeId = 'ARCH-HOMO-VERIFY';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: 'Verify whether the proposed relation is a valid solution to the homogeneous differential equation:'
      });

      return {
        statement: {
          promptText: 'Verify whether the proposed relation is a valid solution to the homogeneous differential equation:',
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty + 1, procedural: difficulty, computational: 2, reasoning: difficulty + 1, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:HOMO_VERIFY:D${difficulty}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-2ND-ORDER-HOMO': {
    id: 'TMPL-GEN0107-2ND-ORDER-HOMO',
    familyId: 'FAM-GEN0107-2ND-ORDER-HOMO',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-004',
    conceptId: 'de_second_order_linear_homogeneous_constant_coeff',
    name: 'Second-Order Linear Homogeneous ODE with Real Distinct Roots',
    description: 'Solve second-order linear homogeneous ODEs with distinct, repeated, and complex roots.',
    parameterSchema: [
      { name: 'r1', type: 'INTEGER', min: 1, max: 3, description: 'First characteristic root' },
      { name: 'r2', type: 'INTEGER', min: 2, max: 5, description: 'Second characteristic root' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Distinct positive real roots y'' - 5y' + 6y = 0
          expressionLatex = `y'' - 5y' + 6y = 0`;
          canonicalAnswerLatex = `y(x) = C_{1}e^{2x} + C_{2}e^{3x}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Characteristic equation: r^2 - 5r + 6 = 0.', pedagogicalRationale: 'Characteristic equation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Factor: (r - 2)(r - 3) = 0 => r = 2, r = 3 (distinct real roots).', pedagogicalRationale: 'Root extraction.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'General solution: y(x) = C_1 e^{2x} + C_2 e^{3x}.', pedagogicalRationale: 'Linear superposition.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Write the auxiliary equation: r^2 - 5r + 6 = 0.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Roots are r = 2 and r = 3.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Opposite real roots y'' - 9y = 0
          expressionLatex = `y'' - 9y = 0`;
          canonicalAnswerLatex = `y(x) = C_{1}e^{3x} + C_{2}e^{-3x}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Characteristic equation: r^2 - 9 = 0.', pedagogicalRationale: 'Auxiliary equation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Roots: r = 3, r = -3 (opposite real roots).', pedagogicalRationale: 'Root extraction.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'General solution: y(x) = C_1 e^{3x} + C_2 e^{-3x}.', pedagogicalRationale: 'Superposition.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'The characteristic equation is r^2 - 9 = 0.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'The roots are r = 3 and r = -3.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Repeated real roots y'' - 4y' + 4y = 0
          expressionLatex = `y'' - 4y' + 4y = 0`;
          canonicalAnswerLatex = `y(x) = (C_{1} + C_{2}x)e^{2x}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Characteristic equation: r^2 - 4r + 4 = 0.', pedagogicalRationale: 'Auxiliary equation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Factor: (r - 2)^2 = 0 => r = 2 (repeated real root with multiplicity 2).', pedagogicalRationale: 'Degenerate roots.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Second linearly independent solution is x * e^{2x} => y(x) = (C_1 + C_2 x) e^{2x}.', pedagogicalRationale: 'Reduction of order.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Auxiliary equation: (r - 2)^2 = 0.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'For repeated root r = 2, multiply the second basis term by x.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Pure imaginary complex roots y'' + 16y = 0
          expressionLatex = `y'' + 16y = 0`;
          canonicalAnswerLatex = `y(x) = C_{1}\\cos(4x) + C_{2}\\sin(4x)`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Characteristic equation: r^2 + 16 = 0.', pedagogicalRationale: 'Auxiliary equation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Roots: r = +- 4i (complex conjugate roots with alpha = 0, beta = 4).', pedagogicalRationale: 'Complex roots.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Euler formula gives trigonometric basis: y(x) = C_1 cos(4x) + C_2 sin(4x).', pedagogicalRationale: 'Harmonic basis.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Characteristic equation is r^2 + 16 = 0, giving r = +- 4i.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Complex roots alpha +- i*beta correspond to e^(alpha*x)(C1 cos(beta*x) + C2 sin(beta*x)).', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText: 'Find the general solution to the second-order homogeneous differential equation:',
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: constant(1),
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:HOMO_2ND:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0107-LAPLACE-TRANSFORM': {
    id: 'TMPL-GEN0107-LAPLACE-TRANSFORM',
    familyId: 'FAM-GEN0107-LAPLACE-TRANSFORM',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-009',
    name: 'Exponential Laplace Transform Evaluation',
    description: 'Evaluate Laplace transforms of elementary and shifted functions with structural scaling.',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 2, max: 6, description: 'Exponential shift parameter' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 3;
      let promptText = 'Compute the Laplace transform:';
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Exponential function L{e^{at}}
          promptText = 'Compute the Laplace transform of the exponential function:';
          expressionLatex = `\\mathcal{L}\\left\\{e^{${a}t}\\right\\}`;
          canonicalAnswerLatex = `\\frac{1}{s - ${a}}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: `Standard transform pair: L{e^{at}} = 1 / (s - a) for s > ${a}.`, pedagogicalRationale: 'Transform pair definition.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Recall the definition L{e^(at)} = 1 / (s - a).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: `Substitute shift parameter a = ${a}.`, revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Polynomial power function L{t^3}
          promptText = 'Compute the Laplace transform of the polynomial power:';
          expressionLatex = `\\mathcal{L}\\left\\{t^{3}\\right\\}`;
          canonicalAnswerLatex = `\\frac{6}{s^{4}}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply standard power transform formula: L{t^n} = n! / s^{n+1}.', pedagogicalRationale: 'Power transform pair.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'For n = 3: 3! / s^{3+1} = 6 / s^4.', pedagogicalRationale: 'Factorial computation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Use the transform pair L{t^n} = n! / s^(n+1).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Evaluate 3! = 6 in the numerator.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Trigonometric function L{sin(4t)}
          promptText = 'Compute the Laplace transform of the trigonometric function:';
          expressionLatex = `\\mathcal{L}\\left\\{\\sin(4t)\\right\\}`;
          canonicalAnswerLatex = `\\frac{4}{s^{2} + 16}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apply standard sine transform pair: L{sin(omega*t)} = omega / (s^2 + omega^2).', pedagogicalRationale: 'Trig transform pair.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'With omega = 4: 4 / (s^2 + 4^2) = 4 / (s^2 + 16).', pedagogicalRationale: 'Evaluation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Recall that L{sin(w*t)} = w / (s^2 + w^2).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Substitute frequency omega = 4.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: First Shift Theorem L{e^{2t} cos(3t)}
          promptText = 'Compute the Laplace transform using the first shifting theorem:';
          expressionLatex = `\\mathcal{L}\\left\\{e^{2t}\\cos(3t)\\right\\}`;
          canonicalAnswerLatex = `\\frac{s - 2}{(s - 2)^{2} + 9}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Recall L{cos(3t)} = s / (s^2 + 9).', pedagogicalRationale: 'Base transform.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'First Shift Theorem: L{e^{at} f(t)} = F(s - a). Here a = 2.', pedagogicalRationale: 'Frequency shift.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Substitute s -> s - 2: (s - 2) / ((s - 2)^2 + 9).', pedagogicalRationale: 'Evaluation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'First find L{cos(3t)} = s / (s^2 + 9).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Apply the s-shift property: replace s with s - 2.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'F(s)',
          independentVariable: 's'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: constant(1),
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:LAPLACE:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0107-IVP-FIRST-ORDER': {
    id: 'TMPL-GEN0107-IVP-FIRST-ORDER',
    familyId: 'FAM-GEN0107-IVP-FIRST-ORDER',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-002',
    name: 'First-Order Initial Value Problem Particular Solution',
    description: 'Solve first-order IVPs for particular solutions with structural difficulty scaling.',
    parameterSchema: [
      { name: 'y0', type: 'INTEGER', min: 1, max: 6, description: 'Initial value at x=0' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const y0 = params?.y0 ?? 3;
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Direct integration dy/dx = 2x, y(0) = y0
          expressionLatex = `\\frac{dy}{dx} = 2x, \\quad y(0) = ${y0}`;
          canonicalAnswerLatex = `y(x) = x^{2} + ${y0}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'EXECUTION', actionDescription: 'General solution by direct integration: y(x) = integral 2x dx = x^2 + C.', pedagogicalRationale: 'Direct integration.' },
            { stepIndex: 2, phase: 'VERIFICATION', actionDescription: `Apply initial condition y(0) = ${y0} => 0^2 + C = ${y0} => C = ${y0}.`, pedagogicalRationale: 'Constant evaluation.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Particular solution: y(x) = x^2 + ${y0}.`, pedagogicalRationale: 'Assembly.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Integrate to find the general solution: y = x^2 + C.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: `Substitute x = 0 and y = ${y0} to solve for C.`, revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Separable exponential IVP dy/dx = 2xy, y(0) = y0
          expressionLatex = `\\frac{dy}{dx} = 2xy, \\quad y(0) = ${y0}`;
          canonicalAnswerLatex = `y(x) = ${y0}e^{x^{2}}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Separate variables: (1/y) dy = 2x dx => ln|y| = x^2 + c_1 => y(x) = C e^{x^2}.', pedagogicalRationale: 'Separable general solution.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Apply y(0) = ${y0}: C * e^0 = ${y0} => C = ${y0}.`, pedagogicalRationale: 'Initial condition.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: `Particular solution: y(x) = ${y0} e^{x^2}.`, pedagogicalRationale: 'Particular assembly.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'General solution is y(x) = C e^(x^2).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: `Set x = 0 to find C = ${y0}.`, revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Linear integrating factor IVP dy/dx + 2y = 6, y(0) = 1
          expressionLatex = `\\frac{dy}{dx} + 2y = 6, \\quad y(0) = 1`;
          canonicalAnswerLatex = `y(x) = 3 - 2e^{-2x}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Linear ODE with mu(x) = e^{2x}. General solution: y(x) = 3 + C*e^{-2x}.', pedagogicalRationale: 'Linear ODE solution.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Apply y(0) = 1: 3 + C = 1 => C = -2.', pedagogicalRationale: 'Constant evaluation.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Particular solution: y(x) = 3 - 2e^{-2x}.', pedagogicalRationale: 'Particular assembly.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'General solution is y(x) = 3 + C e^(-2x).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Substitute y(0) = 1 to find C = -2.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Nonlinear separable IVP dy/dx = 3x^2 y^2, y(0) = 1
          expressionLatex = `\\frac{dy}{dx} = 3x^{2}y^{2}, \\quad y(0) = 1`;
          canonicalAnswerLatex = `y(x) = \\frac{1}{1 - x^{3}}`;
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Separate variables: y^{-2} dy = 3x^2 dx => -1/y = x^3 + C.', pedagogicalRationale: 'Nonlinear separation.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Apply y(0) = 1: -1/1 = 0^3 + C => C = -1.', pedagogicalRationale: 'Constant evaluation.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Solve for y: -1/y = x^3 - 1 => y(x) = 1 / (1 - x^3).', pedagogicalRationale: 'Explicit particular solution.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Integrate y^(-2) dy = 3x^2 dx to get -1/y = x^3 + C.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Set x = 0 and y = 1 to obtain C = -1.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText: `Solve the initial value problem for its particular solution:`,
          expressionLatex,
          targetVariable: 'y(x)',
          independentVariable: 'x'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: constant(1),
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 1, reasoning: difficulty, representation: 1, context: 1, multiStep: difficulty },
        structureSignature: `GEN0107:IVP:DIFF${difficulty}_Y0_${y0}`
      };
    }
  },

  'TMPL-GEN0107-MIXING-TANK': {
    id: 'TMPL-GEN0107-MIXING-TANK',
    familyId: 'FAM-GEN0107-MIXING-TANK',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    archetypeId: 'ARCH-APP-MIXING-CONSTANT-VOL',
    name: 'Well-Stirred Mixing Tank Solute Initial Value Problem',
    description: 'Model rate of change of solute mass dm/dt = Rate_in - Rate_out and solve for mass m(t).',
    parameterSchema: [
      { name: 'volume', type: 'INTEGER', min: 60, max: 150, defaultValue: 80, description: 'Tank volume in gallons' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const volume = params?.volume ?? 80;
      const rateIn = 2; // gal/min
      const rateOut = 2; // gal/min
      const cIn = 2; // lb/gal
      const initialMass = 0; // pure water initially
      const limitingMass = volume * cIn; // e.g. 160 lbs
      const timeConstant = volume / rateOut; // e.g. 40 min

      const expressionLatex = `\\frac{dm}{dt} + \\frac{${rateOut}}{${volume}}m = ${rateIn * cIn}`;
      const canonicalAnswerLatex = `m(t) = ${limitingMass}\\left(1 - e^{-t/${timeConstant}}\\right)`;

      const rawAst = subtract(
        constant(limitingMass),
        multiply(constant(limitingMass), func('exp', divide(negate(variable('t')), constant(timeConstant))))
      );

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Identify mass conservation balance: dm/dt = (Rate in) - (Rate out). Rate in = (${rateIn} gal/min) * (${cIn} lb/gal) = ${rateIn * cIn} lb/min. Rate out = (${rateOut} gal/min) * (m / ${volume} lb/gal) = m/${timeConstant} lb/min.`,
          pedagogicalRationale: 'Castro Spread 48 dynamic mass balance recognition.'
        },
        {
          stepIndex: 2,
          phase: 'FORMULA_SELECTION',
          actionDescription: `Standard linear ODE: dm/dt + (1/${timeConstant})m = ${rateIn * cIn}. Integrating factor: mu(t) = e^{int (1/${timeConstant})dt} = e^{t/${timeConstant}}.`,
          pedagogicalRationale: 'First-order linear integrating factor method.'
        },
        {
          stepIndex: 3,
          phase: 'EXECUTION',
          actionDescription: `Multiply by mu(t): d/dt [m * e^{t/${timeConstant}}] = ${rateIn * cIn} e^{t/${timeConstant}}. Integrating yields m * e^{t/${timeConstant}} = ${limitingMass} e^{t/${timeConstant}} + C.`,
          pedagogicalRationale: 'Product rule integration.'
        },
        {
          stepIndex: 4,
          phase: 'SIMPLIFICATION',
          actionDescription: `Apply initial condition m(0) = ${initialMass} lb: 0 = ${limitingMass} + C => C = -${limitingMass}. Therefore, m(t) = ${limitingMass}(1 - e^{-t/${timeConstant}}) lbs.`,
          pedagogicalRationale: 'Initial condition evaluation for particular solute trajectory.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Apply conservation of mass: dm/dt = Rate In - Rate Out.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Rate In = (${rateIn})(${cIn}) = ${rateIn * cIn} lb/min. Rate Out = (${rateOut}) * (m/${volume}) = m/${timeConstant} lb/min.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `Standard form: \\frac{dm}{dt} + \\frac{1}{${timeConstant}}m = ${rateIn * cIn}. Integrating factor is \\mu(t) = e^{t/${timeConstant}}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `m(t)e^{t/${timeConstant}} = \\int ${rateIn * cIn}e^{t/${timeConstant}}dt = ${limitingMass}e^{t/${timeConstant}} + C.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `Since m(0) = 0, C = -${limitingMass}. The solution is m(t) = ${limitingMass}(1 - e^{-t/${timeConstant}}).`, revealsFinalAnswer: true }
      ];

      const taskType = 'SOLVE_INITIAL_VALUE_PROBLEM';
      const archetypeId = 'ARCH-APP-MIXING-CONSTANT-VOL';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A tank contains ${volume} gallons of pure water. A brine solution with ${cIn} lb/gal of salt enters at ${rateIn} gal/min, and the well-stirred mixture leaves at ${rateOut} gal/min. Solve for the amount of salt m(t) in pounds in the tank at any time t:`,
        applicationDomain: 'MIXING_TANK',
        physicalConfiguration: 'CONSTANT_VOLUME_ACCUMULATION',
        governingModel: 'dm_dt_plus_k_m_eq_R_Cin',
        unknownTarget: 'MASS_AT_TIME_T'
      });

      return {
        statement: {
          promptText: `A tank contains ${volume} gallons of pure water. A brine solution with ${cIn} lb/gal of salt enters at ${rateIn} gal/min, and the well-stirred mixture leaves at ${rateOut} gal/min. Solve for the amount of salt m(t) in pounds in the tank at any time t:`,
          expressionLatex,
          targetVariable: 'm(t)',
          independentVariable: 't',
          physicalUnits: 'lb'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: 2, procedural: 3, computational: 2, reasoning: 3, representation: 2, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:APP_MIX_CONST:V${volume}_R${rateIn}_C${cIn}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-MIX-CONST-SOLVE': {
    id: 'TMPL-GEN0107-APP-MIX-CONST-SOLVE',
    familyId: 'FAM-GEN0107-APP-MIXING-CONSTANT',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    archetypeId: 'ARCH-APP-MIXING-CONSTANT-VOL',
    name: 'Castro Constant-Volume Mixing Tank Solute Solution',
    description: 'Directly reflects Castro Spread 48 Problem 24: constant volume tank solute IVP formulation.',
    parameterSchema: [
      { name: 'volume', type: 'INTEGER', min: 60, max: 120, defaultValue: 80, description: 'Tank volume' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const volume = params?.volume ?? 80;
      const rate = 2; // gal/min
      const cIn = 2; // lb/gal
      const limitingMass = volume * cIn; // e.g. 160
      const timeConstant = volume / rate; // e.g. 40

      const expressionLatex = `\\frac{dm}{dt} + \\frac{${rate}}{${volume}}m = ${rate * cIn}`;
      const canonicalAnswerLatex = `m(t) = ${limitingMass}(1 - e^{-t/${timeConstant}})`;

      const rawAst = subtract(
        constant(limitingMass),
        multiply(constant(limitingMass), func('exp', divide(negate(variable('t')), constant(timeConstant))))
      );

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Rate of accumulation balance: dm/dt = C_i V_i - C_o V_o. With V_i = V_o = ${rate} gal/min, dm/dt = 2(2) - (m/${volume})(2) = 4 - m/${timeConstant}.`,
          pedagogicalRationale: 'Castro Spread 48 Problem 24 dynamic mass balance.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Separate variables: dm / (4 - m/${timeConstant}) = dt => -${timeConstant} ln|${limitingMass} - m| = t + C.`,
          pedagogicalRationale: 'Separable ODE integration.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `With m(0) = 0, C = -${timeConstant} ln(${limitingMass}). Thus, ln(1 - m/${limitingMass}) = -t/${timeConstant} => m(t) = ${limitingMass}(1 - e^{-t/${timeConstant}}).`,
          pedagogicalRationale: 'Initial condition isolation of exponential mass trajectory.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Set up dm/dt = Rate In - Rate Out.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `dm/dt = (${rate})(${cIn}) - (${rate})(m/${volume}) = ${rate * cIn} - m/${timeConstant}.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `\\frac{dm}{${limitingMass} - m} = \\frac{dt}{${timeConstant}}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `-\\ln(${limitingMass} - m) = \\frac{t}{${timeConstant}} + C_1.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `m(t) = ${limitingMass}(1 - e^{-t/${timeConstant}}).`, revealsFinalAnswer: true }
      ];

      const taskType = 'SOLVE_INITIAL_VALUE_PROBLEM';
      const archetypeId = 'ARCH-APP-MIXING-CONSTANT-VOL';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A tank contains ${volume} gallons of pure water. A brine solution with ${cIn} lb/gal of salt enters at ${rate} gal/min, and the well-stirred mixture leaves at the same rate. Find the amount of salt m(t) in pounds in the tank at any time t:`,
        applicationDomain: 'MIXING_TANK',
        physicalConfiguration: 'CONSTANT_VOLUME_ACCUMULATION',
        governingModel: 'dm_dt_plus_k_m_eq_R_Cin',
        unknownTarget: 'MASS_AT_TIME_T'
      });

      return {
        statement: {
          promptText: `A tank contains ${volume} gallons of pure water. A brine solution with ${cIn} lb/gal of salt enters at ${rate} gal/min, and the well-stirred mixture leaves at the same rate. Find the amount of salt m(t) in pounds in the tank at any time t:`,
          expressionLatex,
          targetVariable: 'm(t)',
          independentVariable: 't',
          physicalUnits: 'lb'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 3, computational: 2, reasoning: 3, representation: 2, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_MIX_SOLVE:V${volume}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-MIX-CONST-THRESHOLD': {
    id: 'TMPL-GEN0107-APP-MIX-CONST-THRESHOLD',
    familyId: 'FAM-GEN0107-APP-MIXING-CONSTANT',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    archetypeId: 'ARCH-APP-MIXING-THRESHOLD-TIME',
    name: 'Castro Mixing Tank Elapsed Time to Concentration Threshold',
    description: 'Directly reflects Castro Spread 48 Problem 24(b) & 25(b): calculate elapsed time to target concentration threshold.',
    parameterSchema: [
      { name: 'targetConcentration', type: 'INTEGER', min: 1, max: 2, defaultValue: 1, description: 'Target concentration in lb/gal' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const volume = 80;
      const rate = 2;
      const cIn = 2;
      const timeConstant = volume / rate; // 40 min
      const targetC = params?.targetConcentration ?? 1; // 1 lb/gal

      const expressionLatex = `\\frac{dm}{dt} + \\frac{${rate}}{${volume}}m = ${rate * cIn}, \\quad C_o(t) = \\frac{m(t)}{${volume}} = ${targetC}`;
      const canonicalAnswerLatex = `t = ${timeConstant}\\ln(2) \\approx 27.7\\text{ min}`;

      const rawAst = multiply(constant(timeConstant), func('ln', constant(2)));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `From the general solution m(t) = 160(1 - e^{-t/40}), concentration is C_o(t) = m(t)/${volume} = 2(1 - e^{-t/40}). We require C_o(t) = ${targetC} lb/gal.`,
          pedagogicalRationale: 'Castro Spread 48 Problem 24(b) threshold condition.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Set up the algebraic equality: 2(1 - e^{-t/40}) = 1 => 1 - e^{-t/40} = 1/2 => e^{-t/40} = 1/2.`,
          pedagogicalRationale: 'Isolation of exponential factor.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Take natural logarithm of both sides: -t/40 = ln(1/2) = -ln(2) => t = 40 ln(2) approx 27.7 minutes.`,
          pedagogicalRationale: 'Logarithmic inversion to solve for threshold time.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: `Set the outgoing concentration C_o(t) = m(t)/${volume} equal to ${targetC} lb/gal.`, revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `m(t) = ${volume * targetC} lb salt required in the tank.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `Use m(t) = 160(1 - e^{-t/40}) = 80.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `1 - e^{-t/40} = 1/2 \\implies e^{-t/40} = 1/2.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `t = 40\\ln(2) \\approx 27.7\\text{ minutes}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'CALCULATE_THRESHOLD_TIME';
      const archetypeId = 'ARCH-APP-MIXING-THRESHOLD-TIME';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A tank contains 80 gallons of pure water. Brine with 2 lb/gal of salt enters at 2 gal/min and leaves at 2 gal/min. Find the time t in minutes at which the leaving brine will contain 1 lb/gal of salt:`,
        applicationDomain: 'MIXING_TANK',
        physicalConfiguration: 'CONSTANT_VOLUME_THRESHOLD',
        governingModel: 'dm_dt_plus_k_m_eq_R_Cin',
        unknownTarget: 'TIME_TO_CONCENTRATION_THRESHOLD'
      });

      return {
        statement: {
          promptText: `A tank contains 80 gallons of pure water. Brine with 2 lb/gal of salt enters at 2 gal/min and leaves at 2 gal/min. Find the time t in minutes at which the leaving brine will contain 1 lb/gal of salt:`,
          expressionLatex,
          targetVariable: 't',
          independentVariable: 'C_o',
          physicalUnits: 'min'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 3, conceptual: 3, procedural: 3, computational: 3, reasoning: 3, representation: 2, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_MIX_THRESHOLD:C${targetC}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-MIX-VAR-ACCUM': {
    id: 'TMPL-GEN0107-APP-MIX-VAR-ACCUM',
    familyId: 'FAM-GEN0107-APP-MIXING-VARIABLE',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'MODEL_AND_SOLVE',
    archetypeId: 'ARCH-APP-MIXING-VARIABLE-VOL',
    name: 'Castro Variable-Volume Tank Mixture Accumulation',
    description: 'Model solute concentration in tanks where inflow rate != outflow rate with integrating factor mu(t) = (V0 + delta_R t)^n.',
    parameterSchema: [
      { name: 'v0', type: 'INTEGER', min: 80, max: 150, defaultValue: 100, description: 'Initial volume in liters' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const v0 = params?.v0 ?? 100;
      const rIn = 3; // L/min
      const rOut = 2; // L/min
      const cIn = 2; // kg/L
      const deltaR = rIn - rOut; // 1 L/min net accumulation
      const nPower = rOut / deltaR; // 2

      const expressionLatex = `\\frac{dm}{dt} + \\frac{${rOut}}{${v0} + t}m = ${rIn * cIn}`;
      const canonicalAnswerLatex = `m(t) = ${cIn}(${v0} + t) - \\frac{${cIn * Math.pow(v0, nPower + 1)}}{(${v0} + t)^${nPower}}`;

      const rawAst = subtract(
        multiply(constant(cIn), add(constant(v0), variable('t'))),
        divide(constant(cIn * Math.pow(v0, nPower + 1)), power(add(constant(v0), variable('t')), constant(nPower)))
      );

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Variable volume balance: V(t) = V0 + (R_in - R_out)t = ${v0} + (3 - 2)t = ${v0} + t liters. Outflow concentration is m(t)/(${v0} + t).`,
          pedagogicalRationale: 'Hydraulic accumulation volume modeling.'
        },
        {
          stepIndex: 2,
          phase: 'FORMULA_SELECTION',
          actionDescription: `Rate of accumulation: dm/dt = R_in * C_in - R_out * C_out => dm/dt + [2/(${v0} + t)]m = 6. Variable-coefficient linear ODE.`,
          pedagogicalRationale: 'First-order linear ODE standard form.'
        },
        {
          stepIndex: 3,
          phase: 'EXECUTION',
          actionDescription: `Integrating factor: mu(t) = exp(int [2/(${v0} + t)]dt) = exp(2 ln(${v0} + t)) = (${v0} + t)^2. Multiply ODE: d/dt [(${v0} + t)^2 m] = 6(${v0} + t)^2.`,
          pedagogicalRationale: 'Polynomial integrating factor derivation.'
        },
        {
          stepIndex: 4,
          phase: 'SIMPLIFICATION',
          actionDescription: `Integrate: (${v0} + t)^2 m = 2(${v0} + t)^3 + C. With m(0) = 0: C = -2(${v0})^3 = -${cIn * Math.pow(v0, nPower + 1)}. Therefore, m(t) = 2(${v0} + t) - ${cIn * Math.pow(v0, nPower + 1)}/(${v0} + t)^2 kg.`,
          pedagogicalRationale: 'Boundary condition integration and particular solution.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: `Tank volume varies with time: V(t) = ${v0} + (${rIn} - ${rOut})t = ${v0} + t liters.`, revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Formulate dm/dt + \\frac{${rOut}}{${v0} + t}m = ${rIn * cIn}.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `Integrating factor is \\mu(t) = e^{\\int \\frac{2}{${v0} + t}dt} = (${v0} + t)^2.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `(${v0} + t)^2 m = \\int 6(${v0} + t)^2 dt = 2(${v0} + t)^3 + C.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `Apply m(0) = 0 \\implies C = -2(${v0})^3. Solution: m(t) = 2(${v0} + t) - \\frac{${cIn * Math.pow(v0, 3)}}{(${v0} + t)^2}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'MODEL_AND_SOLVE';
      const archetypeId = 'ARCH-APP-MIXING-VARIABLE-VOL';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A tank initially holds ${v0} liters of pure water. A solution containing ${cIn} kg/L of salt flows in at ${rIn} L/min, while the well-stirred mixture leaves at ${rOut} L/min. Find the mass of salt m(t) in kg in the tank at any time t before overflow:`,
        applicationDomain: 'MIXING_TANK',
        physicalConfiguration: 'VARIABLE_VOLUME_ACCUMULATION',
        governingModel: 'dm_dt_plus_P_t_m_eq_Q',
        unknownTarget: 'MASS_EXPRESSION_VAR_VOLUME'
      });

      return {
        statement: {
          promptText: `A tank initially holds ${v0} liters of pure water. A solution containing ${cIn} kg/L of salt flows in at ${rIn} L/min, while the well-stirred mixture leaves at ${rOut} L/min. Find the mass of salt m(t) in kg in the tank at any time t before overflow:`,
          expressionLatex,
          targetVariable: 'm(t)',
          independentVariable: 't',
          physicalUnits: 'kg'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 4, conceptual: 4, procedural: 4, computational: 3, reasoning: 4, representation: 2, context: 4, multiStep: 4 },
        structureSignature: `GEN0107:CASTRO_MIX_VAR_VOL:V0_${v0}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-MIX-DILUTION-FLUSH': {
    id: 'TMPL-GEN0107-APP-MIX-DILUTION-FLUSH',
    familyId: 'FAM-GEN0107-APP-MIXING-DILUTION',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    archetypeId: 'ARCH-APP-MIXING-PURE-FLUSH',
    name: 'Castro Pure Solvent Dilution Washout Kinetics',
    description: 'Directly reflects pure water flush (C_in = 0) leading to separable exponential washout dm/dt = -(R/V)m.',
    parameterSchema: [
      { name: 'm0', type: 'INTEGER', min: 20, max: 80, defaultValue: 50, description: 'Initial solute in pounds' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const m0 = params?.m0 ?? 50;
      const volume = 100;
      const rate = 4;
      const kDecay = rate / volume; // 0.04

      const expressionLatex = `\\frac{dm}{dt} = -\\frac{${rate}}{${volume}}m = -${kDecay}m`;
      const canonicalAnswerLatex = `m(t) = ${m0}e^{-${kDecay}t}`;

      const rawAst = multiply(constant(m0), func('exp', multiply(constant(-kDecay), variable('t'))));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Pure solvent inflow means C_in = 0, so Rate_in = 0. Rate_out = (${rate} gal/min) * (m / ${volume} lb/gal) = ${kDecay}m lb/min.`,
          pedagogicalRationale: 'Pure washout condition recognition.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Separable ODE: dm/m = -${kDecay} dt => ln|m| = -${kDecay}t + C => m(t) = m_0 e^{-${kDecay}t}.`,
          pedagogicalRationale: 'Direct separation and integration.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `With m(0) = ${m0} lb: m(t) = ${m0}e^{-${kDecay}t} lbs.`,
          pedagogicalRationale: 'Exponential washout formulation.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Since the inflow is pure solvent, Rate In = 0.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `dm/dt = -Rate Out = -(${rate}/${volume})m = -${kDecay}m.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `\\frac{dm}{m} = -${kDecay}dt \\implies \\ln(m) = -${kDecay}t + C.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `m(t) = C_0 e^{-${kDecay}t}.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `Apply m(0) = ${m0} \\implies m(t) = ${m0}e^{-${kDecay}t}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'SOLVE_INITIAL_VALUE_PROBLEM';
      const archetypeId = 'ARCH-APP-MIXING-PURE-FLUSH';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A vat contains ${volume} gallons of solution holding ${m0} pounds of chemical contaminant. Pure water flows in at ${rate} gal/min and the well-stirred solution drains at ${rate} gal/min. Solve for the residual mass m(t) in pounds in the vat at time t:`,
        applicationDomain: 'MIXING_TANK',
        physicalConfiguration: 'PURE_SOLVENT_DILUTION_FLUSH',
        governingModel: 'dm_dt_plus_k_m_eq_0',
        unknownTarget: 'RESIDUAL_SOLUTE_AT_TIME_T'
      });

      return {
        statement: {
          promptText: `A vat contains ${volume} gallons of solution holding ${m0} pounds of chemical contaminant. Pure water flows in at ${rate} gal/min and the well-stirred solution drains at ${rate} gal/min. Solve for the residual mass m(t) in pounds in the vat at time t:`,
          expressionLatex,
          targetVariable: 'm(t)',
          independentVariable: 't',
          physicalUnits: 'lb'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 1, conceptual: 1, procedural: 2, computational: 1, reasoning: 2, representation: 1, context: 2, multiStep: 2 },
        structureSignature: `GEN0107:CASTRO_MIX_FLUSH:M0_${m0}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-COOL-DIRECT': {
    id: 'TMPL-GEN0107-APP-COOL-DIRECT',
    familyId: 'FAM-GEN0107-APP-COOLING-NEWTON',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    archetypeId: 'ARCH-APP-COOLING-CONSTANT-AMBIENT',
    name: 'Castro Newton Cooling Temperature Prediction',
    description: 'Directly reflects Castro Spread 44 Problem 1: Newton law of cooling in constant ambient temperature medium.',
    parameterSchema: [
      { name: 't0', type: 'INTEGER', min: 80, max: 150, defaultValue: 100, description: 'Initial temperature in C' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const t0 = params?.t0 ?? 100;
      const tm = 20; // ambient temperature 20 C
      const k = 0.05; // min^-1
      const deltaT = t0 - tm; // e.g. 80

      const expressionLatex = `\\frac{dT}{dt} = -${k}(T - ${tm})`;
      const canonicalAnswerLatex = `T(t) = ${tm} + ${deltaT}e^{-${k}t}`;

      const rawAst = add(constant(tm), multiply(constant(deltaT), func('exp', multiply(constant(-k), variable('t')))));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Newton's Law of Cooling: dT/dt = -k(T - T_m). Ambient temperature T_m = ${tm} C, cooling constant k = ${k} min^-1.`,
          pedagogicalRationale: 'Castro Spread 44 Newton cooling law definition.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Separate variables: dT / (T - ${tm}) = -${k} dt => ln|T - ${tm}| = -${k}t + C_1 => T(t) = ${tm} + C e^{-${k}t}.`,
          pedagogicalRationale: 'Separable ODE integration.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Apply initial condition T(0) = ${t0} C: ${t0} = ${tm} + C => C = ${deltaT}. Thus, T(t) = ${tm} + ${deltaT}e^{-${k}t} C.`,
          pedagogicalRationale: 'Initial condition substitution.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: `Newton's law states dT/dt = -k(T - T_m) where T_m = ${tm}^\\circ\\text{C}.`, revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Separate variables: \\frac{dT}{T - ${tm}} = -${k}dt.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `\\ln(T - ${tm}) = -${k}t + C \\implies T(t) = ${tm} + Ce^{-${k}t}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `At t = 0, T = ${t0} \\implies C = ${t0} - ${tm} = ${deltaT}.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `T(t) = ${tm} + ${deltaT}e^{-${k}t}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'SOLVE_INITIAL_VALUE_PROBLEM';
      const archetypeId = 'ARCH-APP-COOLING-CONSTANT-AMBIENT';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A metal forging initially at ${t0}°C is quenched in an oil bath maintained at a constant ${tm}°C. If the cooling rate constant is k = ${k} min⁻¹, solve for the temperature T(t) in °C of the metal at time t:`,
        applicationDomain: 'COOLING_HEATING',
        physicalConfiguration: 'CONSTANT_AMBIENT_MEDIUM',
        governingModel: 'dT_dt_eq_minus_k_T_minus_Tm',
        unknownTarget: 'TEMPERATURE_AT_TIME_T'
      });

      return {
        statement: {
          promptText: `A metal forging initially at ${t0}°C is quenched in an oil bath maintained at a constant ${tm}°C. If the cooling rate constant is k = ${k} min⁻¹, solve for the temperature T(t) in °C of the metal at time t:`,
          expressionLatex,
          targetVariable: 'T(t)',
          independentVariable: 't',
          physicalUnits: '°C'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 1, conceptual: 1, procedural: 2, computational: 1, reasoning: 2, representation: 1, context: 2, multiStep: 2 },
        structureSignature: `GEN0107:CASTRO_COOL_DIRECT:T0_${t0}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-COOL-TIME-TARGET': {
    id: 'TMPL-GEN0107-APP-COOL-TIME-TARGET',
    familyId: 'FAM-GEN0107-APP-COOLING-NEWTON',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    archetypeId: 'ARCH-APP-COOLING-TIME-TARGET',
    name: 'Castro Newton Cooling Time to Threshold Temperature',
    description: 'Directly reflects Castro Spread 44 Problem 4: calculate elapsed cooling duration required to reach target threshold temperature.',
    parameterSchema: [
      { name: 'targetTemp', type: 'INTEGER', min: 25, max: 40, defaultValue: 30, description: 'Target threshold temperature in F' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const t0 = 75; // F
      const tm = 20; // F
      const t1Reading = 65; // after 1 min
      const targetT = params?.targetTemp ?? 30; // F

      // k = ln((t0 - tm)/(t1Reading - tm)) = ln(55/45) = ln(11/9)
      const expressionLatex = `\\frac{dT}{dt} = -k(T - ${tm}), \\quad T(0) = ${t0}, \\quad T(1) = ${t1Reading}, \\quad T(t) = ${targetT}`;
      // t* = ln((t0 - tm)/(targetT - tm)) / ln((t0 - tm)/(t1Reading - tm)) = ln(55/10) / ln(11/9) = ln(5.5)/ln(1.222) approx 8.5 min
      const canonicalAnswerLatex = `t = \\frac{\\ln(5.5)}{\\ln(11/9)} \\approx 8.5\\text{ min}`;

      const rawAst = divide(func('ln', constant(5.5)), func('ln', divide(constant(11), constant(9))));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Newton's Law of Cooling: T(t) = T_m + (T_0 - T_m)e^{-kt} = 20 + 55 e^{-kt}. Given T(1) = 65 F, find k.`,
          pedagogicalRationale: 'Castro Spread 44 Problem 4 setup.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Evaluate at t = 1 min: 65 = 20 + 55 e^{-k} => 45 = 55 e^{-k} => e^{-k} = 45/55 = 9/11 => k = ln(11/9) approx 0.2007 min^-1.`,
          pedagogicalRationale: 'Extracting cooling rate constant k from intermediate observation.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Set target temperature T(t*) = ${targetT} F: 20 + 55 e^{-kt*} = ${targetT} => 55 e^{-kt*} = 10 => e^{-kt*} = 10/55 = 2/11 => t* = ln(5.5)/k = ln(5.5)/ln(11/9) approx 8.5 minutes.`,
          pedagogicalRationale: 'Logarithmic inversion for threshold time.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: `Use T(t) = T_m + (T_0 - T_m)e^{-kt} with T_0 = ${t0} and T_m = ${tm}.`, revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Substitute T(1) = ${t1Reading}: 65 = 20 + 55e^{-k} \\implies e^{-k} = 9/11.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `Cooling constant k = \\ln(11/9) \\approx 0.2007\\text{ min}^{-1}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `Set 20 + 55e^{-kt} = ${targetT} \\implies e^{-kt} = 10/55.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `t = \\frac{\\ln(55/10)}{k} = \\frac{\\ln(5.5)}{\\ln(11/9)} \\approx 8.5\\text{ minutes}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'CALCULATE_THRESHOLD_TIME';
      const archetypeId = 'ARCH-APP-COOLING-TIME-TARGET';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A thermometer reading ${t0}°F is taken outdoors where the air temperature is ${tm}°F. The reading is ${t1Reading}°F after 1 minute. How long in minutes will it take for the thermometer to drop to ${targetT}°F?`,
        applicationDomain: 'COOLING_HEATING',
        physicalConfiguration: 'COOLING_THRESHOLD_TARGET',
        governingModel: 'dT_dt_eq_minus_k_T_minus_Tm',
        unknownTarget: 'TIME_TO_TEMPERATURE_THRESHOLD'
      });

      return {
        statement: {
          promptText: `A thermometer reading ${t0}°F is taken outdoors where the air temperature is ${tm}°F. The reading is ${t1Reading}°F after 1 minute. How long in minutes will it take for the thermometer to drop to ${targetT}°F?`,
          expressionLatex,
          targetVariable: 't',
          independentVariable: 'T',
          physicalUnits: 'min'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 3, conceptual: 3, procedural: 3, computational: 3, reasoning: 3, representation: 2, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_COOL_THRESHOLD:T_${targetT}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-COOL-TWO-POINT': {
    id: 'TMPL-GEN0107-APP-COOL-TWO-POINT',
    familyId: 'FAM-GEN0107-APP-COOLING-NEWTON',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'MODEL_AND_SOLVE',
    archetypeId: 'ARCH-APP-COOLING-TWO-POINT',
    name: 'Castro Newton Cooling Two-Point Rate Parameter Model',
    description: 'Directly reflects Castro Spread 44 Problem 1: extract rate constant k from intermediate reading to predict future state.',
    parameterSchema: [
      { name: 't2', type: 'FLOAT', min: 1.0, max: 2.0, defaultValue: 1.0, description: 'Future time in minutes' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const t0 = 70; // initial temp
      const tm = 10; // outside air temp
      const t1 = 0.5; // 0.5 min
      const reading1 = 50; // reading at t1

      // T(t) = 10 + 60 e^{-kt}
      // 50 = 10 + 60 e^{-0.5k} => 40/60 = 2/3 => e^{-0.5k} = 2/3
      // At t = 1.0 min = 2 * 0.5: e^{-k(1.0)} = (2/3)^2 = 4/9
      // T(1.0) = 10 + 60(4/9) = 10 + 80/3 = 110/3 approx 36.67 F
      const expressionLatex = `\\frac{dT}{dt} = -k(T - ${tm}), \\quad T(0) = ${t0}, \\quad T(${t1}) = ${reading1}`;
      const canonicalAnswerLatex = `T(1.0) = \\frac{110}{3} \\approx 36.7^\\circ\\text{F}`;

      const rawAst = add(constant(10), multiply(constant(60), power(divide(constant(2), constant(3)), constant(2))));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Newton's Cooling Law: T(t) = T_m + (T_0 - T_m)e^{-kt} = 10 + 60 e^{-kt}. Given initial reading T(0) = 70 F and T(0.5) = 50 F.`,
          pedagogicalRationale: 'Castro Spread 44 Problem 1 two-point modeling.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Substitute t = 0.5 min: 50 = 10 + 60 e^{-0.5k} => 40 = 60 e^{-0.5k} => e^{-0.5k} = 2/3.`,
          pedagogicalRationale: 'Extracting half-interval exponential multiplier.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `At t = 1.0 min: e^{-k(1.0)} = (e^{-0.5k})^2 = (2/3)^2 = 4/9. Thus, T(1.0) = 10 + 60(4/9) = 10 + 26.67 = 36.67 F.`,
          pedagogicalRationale: 'Direct scaling prediction at future timestamp.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Set up T(t) = 10 + (70 - 10)e^{-kt} = 10 + 60e^{-kt}.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: 'Use the condition T(0.5) = 50 to find the factor e^{-0.5k} = 40/60 = 2/3.', revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: 'Since t = 1.0 is twice 0.5, e^{-k(1.0)} = (e^{-0.5k})^2 = (2/3)^2 = 4/9.', revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: 'T(1.0) = 10 + 60(4/9) = 10 + 26.67.', revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `T(1.0) = 110/3 \\approx 36.7^\\circ\\text{F}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'MODEL_AND_SOLVE';
      const archetypeId = 'ARCH-APP-COOLING-TWO-POINT';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A thermometer reading 70°F is taken outside where the air temperature is 10°F. After 1/2 minute it reads 50°F. Determine the thermometer reading in °F at t = 1.0 minute:`,
        applicationDomain: 'COOLING_HEATING',
        physicalConfiguration: 'TWO_POINT_RATE_EXTRACTION',
        governingModel: 'dT_dt_eq_minus_k_T_minus_Tm',
        unknownTarget: 'FUTURE_TEMPERATURE_AFTER_OBSERVATION'
      });

      return {
        statement: {
          promptText: `A thermometer reading 70°F is taken outside where the air temperature is 10°F. After 1/2 minute it reads 50°F. Determine the thermometer reading in °F at t = 1.0 minute:`,
          expressionLatex,
          targetVariable: 'T(1.0)',
          independentVariable: 't',
          physicalUnits: '°F'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 3, conceptual: 3, procedural: 3, computational: 3, reasoning: 3, representation: 2, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_COOL_TWO_POINT`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-DECAY-HALF-LIFE': {
    id: 'TMPL-GEN0107-APP-DECAY-HALF-LIFE',
    familyId: 'FAM-GEN0107-APP-GROWTH-DECAY',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    archetypeId: 'ARCH-APP-DECAY-HALF-LIFE',
    name: 'Castro Radioactive Decomposition & Half-Life Determination',
    description: 'Directly reflects Castro Spread 47 Problem 13: Radium decomposition dm/dt = -km with half-life derivation.',
    parameterSchema: [
      { name: 'remainingPct', type: 'INTEGER', min: 90, max: 98, defaultValue: 96, description: 'Percentage remaining after 100 years' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const remainingPct = params?.remainingPct ?? 96;
      const tElapsed = 100; // years
      const ratio = remainingPct / 100; // 0.96

      // m(100) = m0 e^{-100k} = 0.96 m0 => k = -ln(0.96)/100 approx 0.00040822
      // t_half = ln(2) / k = 100 ln(2) / (-ln(0.96)) approx 1698 years
      const expressionLatex = `\\frac{dm}{dt} = -km, \\quad m(0) = m_0, \\quad m(${tElapsed}) = ${ratio}m_0`;
      const canonicalAnswerLatex = `t_{1/2} = \\frac{${tElapsed}\\ln(2)}{-\\ln(${ratio})} \\approx 1698\\text{ years}`;

      const rawAst = divide(
        multiply(constant(tElapsed), func('ln', constant(2))),
        negate(func('ln', constant(ratio)))
      );

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Radioactive decay rate is proportional to mass present: dm/dt = -km => m(t) = m_0 e^{-kt}.`,
          pedagogicalRationale: 'Castro Spread 47 Problem 13 radioactive decay model.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `In ${tElapsed} years, m(${tElapsed}) = ${ratio} m_0: e^{-${tElapsed}k} = ${ratio} => -${tElapsed}k = ln(${ratio}) => k = -ln(${ratio})/${tElapsed} approx 0.000408 yr^-1.`,
          pedagogicalRationale: 'Decay constant extraction from century observation.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Half-life condition m(t_half) = 0.5 m_0: e^{-k t_half} = 0.5 => t_half = ln(2)/k = 100 ln(2)/(-ln(0.96)) approx 1698 years.`,
          pedagogicalRationale: 'Logarithmic half-life extraction.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Radioactive decay follows m(t) = m_0 e^{-kt}.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Use m(${tElapsed}) = ${ratio}m_0 to set up e^{-${tElapsed}k} = ${ratio}.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `k = -\\frac{\\ln(${ratio})}{${tElapsed}} \\approx 0.000408\\text{ yr}^{-1}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: 'The half-life satisfies e^{-k t_{1/2}} = 1/2 \\implies t_{1/2} = \\frac{\\ln(2)}{k}.', revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `t_{1/2} = \\frac{100\\ln(2)}{-\\ln(${ratio})} \\approx 1698\\text{ years}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'CALCULATE_THRESHOLD_TIME';
      const archetypeId = 'ARCH-APP-DECAY-HALF-LIFE';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `Radium decomposes at a rate proportional to the quantity present. In 100 years, a 100 mg sample decomposes to ${remainingPct} mg. Determine the half-life of radium in years:`,
        applicationDomain: 'GROWTH_DECAY',
        physicalConfiguration: 'RADIOACTIVE_HALF_LIFE_DECAY',
        governingModel: 'dm_dt_eq_minus_km',
        unknownTarget: 'HALF_LIFE_OR_PERCENTAGE_TIME'
      });

      return {
        statement: {
          promptText: `Radium decomposes at a rate proportional to the quantity present. In 100 years, a 100 mg sample decomposes to ${remainingPct} mg. Determine the half-life of radium in years:`,
          expressionLatex,
          targetVariable: 't_{1/2}',
          independentVariable: 't',
          physicalUnits: 'years'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 3, reasoning: 3, representation: 1, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_RADIUM_HALF_LIFE:P${remainingPct}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-ORTHO-TRAJECTORIES': {
    id: 'TMPL-GEN0107-APP-ORTHO-TRAJECTORIES',
    familyId: 'FAM-GEN0107-APP-ORTHOGONAL',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'SOLVE_GENERAL_SOLUTION',
    archetypeId: 'ARCH-APP-ORTHOGONAL-ALGEBRAIC',
    name: 'Castro Orthogonal Trajectories of Planar Curves',
    description: 'Directly reinforces Castro Spread 49 Problems 1-3: finding orthogonal trajectories to algebraic families.',
    parameterSchema: [
      { name: 'familyType', type: 'CHOICE', choices: ['PARABOLA', 'CIRCLES', 'HYPERBOLA'], defaultValue: 'PARABOLA', description: 'Curve family' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const familyType = params?.familyType ?? (difficulty >= 3 ? 'CIRCLES' : 'PARABOLA');

      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let promptText = '';
      let rawAst: any = constant(1);
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      if (familyType === 'CIRCLES') {
        // Castro Spread 49 Problem 2: x^2 + y^2 = C^2 => Orthogonal: y = kx
        promptText = 'Find the orthogonal trajectories of the family of concentric circles x^2 + y^2 = C^2:';
        expressionLatex = `x^2 + y^2 = C^2, \\quad \\frac{dy}{dx} = -\\frac{x}{y}`;
        canonicalAnswerLatex = `y = kx`;
        rawAst = multiply(variable('k'), variable('x'));

        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Differentiate given family x^2 + y^2 = C^2 implicitly with respect to x: 2x + 2y dy/dx = 0 => dy/dx = -x/y.',
            pedagogicalRationale: 'Castro Spread 49 Problem 2 original slope derivation.'
          },
          {
            stepIndex: 2,
            phase: 'EXECUTION',
            actionDescription: 'The differential equation of the orthogonal trajectories replaces dy/dx with -dx/dy (or reciprocal negative): dy/dx = y/x.',
            pedagogicalRationale: 'Negative reciprocal orthogonality substitution.'
          },
          {
            stepIndex: 3,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate variables: dy/y = dx/x => ln|y| = ln|x| + ln(k) => y = kx (family of straight lines through the origin).',
            pedagogicalRationale: 'Integration to yield orthogonal family equation.'
          }
        ];

        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Differentiate x^2 + y^2 = C^2 implicitly: 2x + 2y y\' = 0.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'Solve for the original slope: y\' = -x/y.', revealsFinalAnswer: false },
          { level: 3, category: 'FORMULA', text: 'Replace y\' with -1/y\' to get the orthogonal slope: \\frac{dy}{dx} = \\frac{y}{x}.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: '\\frac{dy}{y} = \\frac{dx}{x} \\implies \\ln(y) = \\ln(x) + \\ln(k).', revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: 'y = kx (straight lines passing through the origin).', revealsFinalAnswer: true }
        ];
      } else {
        // Castro Spread 49 Problem 1 variation: y = C x^2 => Orthogonal: x^2 + 2y^2 = k
        promptText = 'Find the orthogonal trajectories of the family of parabolas y = C x^2:';
        expressionLatex = `y = C x^2, \\quad \\frac{dy}{dx} = \\frac{2y}{x}`;
        canonicalAnswerLatex = `x^2 + 2y^2 = k`;
        rawAst = add(power(variable('x'), constant(2)), multiply(constant(2), power(variable('y'), constant(2))));

        reasoningTrace = [
          {
            stepIndex: 1,
            phase: 'RECOGNITION',
            actionDescription: 'Eliminate parameter C: y = C x^2 => C = y / x^2. Differentiating gives dy/dx = 2Cx = 2(y/x^2)x = 2y/x.',
            pedagogicalRationale: 'Castro Spread 49 parameter elimination.'
          },
          {
            stepIndex: 2,
            phase: 'EXECUTION',
            actionDescription: 'For orthogonal trajectories, replace dy/dx with -dx/dy: dy/dx = -x / (2y).',
            pedagogicalRationale: 'Orthogonal slope replacement.'
          },
          {
            stepIndex: 3,
            phase: 'SIMPLIFICATION',
            actionDescription: 'Separate variables: 2y dy = -x dx => x dx + 2y dy = 0 => x^2/2 + y^2 = C_1 => x^2 + 2y^2 = k (family of concentric ellipses).',
            pedagogicalRationale: 'Separation and integration yielding ellipse family.'
          }
        ];

        hints = [
          { level: 1, category: 'RECOGNITION', text: 'Eliminate C from y = C x^2 to express the slope dy/dx purely in x and y.', revealsFinalAnswer: false },
          { level: 2, category: 'SETUP', text: 'dy/dx = 2Cx = 2(y/x^2)x = 2y/x.', revealsFinalAnswer: false },
          { level: 3, category: 'FORMULA', text: 'The orthogonal slope satisfies \\frac{dy}{dx} = -\\frac{x}{2y}.', revealsFinalAnswer: false },
          { level: 4, category: 'GUIDED_CALCULATION', text: 'Separate variables: 2y\\,dy = -x\\,dx \\implies x\\,dx + 2y\\,dy = 0.', revealsFinalAnswer: true },
          { level: 5, category: 'GUIDED_CALCULATION', text: 'x^2 + 2y^2 = k (concentric ellipses).', revealsFinalAnswer: true }
        ];
      }

      const taskType = 'SOLVE_GENERAL_SOLUTION';
      const archetypeId = 'ARCH-APP-ORTHOGONAL-ALGEBRAIC';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: promptText,
        applicationDomain: 'ORTHOGONAL_TRAJECTORIES',
        physicalConfiguration: 'CARTESIAN_ALGEBRAIC_FAMILY',
        governingModel: 'dy_dx_eq_minus_dx_dy',
        unknownTarget: 'ORTHOGONAL_FAMILY_EQUATION'
      });

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'y',
          independentVariable: 'x'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: 3, procedural: 3, computational: 2, reasoning: 3, representation: 2, context: 2, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_ORTHO:${familyType}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-HEAT-DIRECT': {
    id: 'TMPL-GEN0107-APP-HEAT-DIRECT',
    familyId: 'FAM-GEN0107-APP-COOLING-NEWTON',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    archetypeId: 'ARCH-APP-HEATING-CONSTANT-AMBIENT',
    name: 'Castro Newton Law of Warming in Heated Ambient Medium',
    description: 'Directly reinforces Castro Spread 45 Problem 6: body warming where ambient temperature T_m > initial temperature T_0.',
    parameterSchema: [
      { name: 'tm', type: 'INTEGER', min: 180, max: 250, defaultValue: 200, description: 'Furnace ambient temperature in C' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const tm = params?.tm ?? 200; // C
      const t0 = 20; // C
      const deltaT = tm - t0; // 180
      const k = 0.05; // min^-1

      const expressionLatex = `\\frac{dT}{dt} = ${k}(${tm} - T), \\quad T(0) = ${t0}`;
      const canonicalAnswerLatex = `T(t) = ${tm} - ${deltaT}e^{-${k}t}`;

      const rawAst = subtract(constant(tm), multiply(constant(deltaT), func('exp', multiply(constant(-k), variable('t')))));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Newton's Law of Warming: dT/dt = k(T_m - T) = -k(T - T_m). Ambient temperature T_m = ${tm} C, initial T(0) = ${t0} C, k = ${k} min^-1.`,
          pedagogicalRationale: 'Castro Spread 45 Problem 6 warming law formulation.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Separate variables: dT / (${tm} - T) = ${k} dt => -ln(${tm} - T) = ${k}t + C_1 => ${tm} - T(t) = C e^{-${k}t}.`,
          pedagogicalRationale: 'Direct separation and integration with negative derivative sign.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Initial condition T(0) = ${t0}: ${tm} - ${t0} = C => C = ${deltaT}. Thus, T(t) = ${tm} - ${deltaT}e^{-${k}t} C.`,
          pedagogicalRationale: 'Particular warming trajectory solution.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: `For warming in a hot medium, dT/dt = k(T_m - T) where T_m = ${tm}^\\circ\\text{C}.`, revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Separate variables: \\frac{dT}{${tm} - T} = ${k}dt.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `-\\ln(${tm} - T) = ${k}t + C \\implies T(t) = ${tm} - Ce^{-${k}t}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `At t = 0, T = ${t0} \\implies C = ${tm} - ${t0} = ${deltaT}.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `T(t) = ${tm} - ${deltaT}e^{-${k}t}^\\circ\\text{C}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'SOLVE_INITIAL_VALUE_PROBLEM';
      const archetypeId = 'ARCH-APP-HEATING-CONSTANT-AMBIENT';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A metal billet initially at ${t0}°C is placed into an annealing furnace maintained at ${tm}°C. If the heating rate constant is k = ${k} min⁻¹, solve for the temperature T(t) in °C at time t:`,
        applicationDomain: 'COOLING_HEATING',
        physicalConfiguration: 'HEATING_CONSTANT_AMBIENT',
        governingModel: 'dT_dt_eq_k_Tm_minus_T',
        unknownTarget: 'TEMPERATURE_AT_TIME_T'
      });

      return {
        statement: {
          promptText: `A metal billet initially at ${t0}°C is placed into an annealing furnace maintained at ${tm}°C. If the heating rate constant is k = ${k} min⁻¹, solve for the temperature T(t) in °C at time t:`,
          expressionLatex,
          targetVariable: 'T(t)',
          independentVariable: 't',
          physicalUnits: '°C'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 1, conceptual: 1, procedural: 2, computational: 1, reasoning: 2, representation: 1, context: 2, multiStep: 2 },
        structureSignature: `GEN0107:CASTRO_HEAT_DIRECT:TM_${tm}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-HEAT-TIME-TARGET': {
    id: 'TMPL-GEN0107-APP-HEAT-TIME-TARGET',
    familyId: 'FAM-GEN0107-APP-COOLING-NEWTON',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    archetypeId: 'ARCH-APP-HEATING-TIME-TARGET',
    name: 'Castro Newton Warming Elapsed Time to Threshold Temperature',
    description: 'Directly reflects Castro Spread 45 Problem 6: calculate duration required for cold object to warm to target temperature.',
    parameterSchema: [
      { name: 'targetTemp', type: 'INTEGER', min: 55, max: 65, defaultValue: 60, description: 'Target threshold temperature in F' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const t0 = 30; // F
      const tm = 70; // F
      const t1Reading = 50; // after 1 min
      const targetT = params?.targetTemp ?? 60; // F

      // T(t) = 70 - 40 e^{-kt}. T(1) = 50 => 40 e^{-k} = 20 => e^{-k} = 1/2 => k = ln(2)
      // T(t*) = targetT => 40 e^{-kt*} = 70 - targetT => e^{-kt*} = (70 - targetT)/40
      // t* = ln(40 / (70 - targetT)) / ln(2). For targetT = 60, t* = ln(4)/ln(2) = 2.0 min
      const deltaT = tm - targetT; // 10
      const ratio = 40 / deltaT; // 4
      const expressionLatex = `\\frac{dT}{dt} = k(${tm} - T), \\quad T(0) = ${t0}, \\quad T(1) = ${t1Reading}, \\quad T(t) = ${targetT}`;
      const canonicalAnswerLatex = `t = \\frac{\\ln(${ratio})}{\\ln(2)} = 2.0\\text{ min}`;

      const rawAst = divide(func('ln', constant(ratio)), func('ln', constant(2)));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Newton's Law of Warming: T(t) = T_m - (T_m - T_0)e^{-kt} = 70 - 40 e^{-kt}. Given T(1) = 50 F.`,
          pedagogicalRationale: 'Castro Spread 45 Problem 6 warming rate setup.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Substitute t = 1 min: 50 = 70 - 40 e^{-k} => 40 e^{-k} = 20 => e^{-k} = 1/2 => k = ln(2) approx 0.6931 min^-1.`,
          pedagogicalRationale: 'Extracting rate parameter k from 1-minute observation.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Set target temperature T(t*) = ${targetT} F: 70 - 40 e^{-kt*} = ${targetT} => 40 e^{-kt*} = ${deltaT} => e^{-kt*} = 1/${ratio} => t* = ln(${ratio})/ln(2) = 2.0 minutes.`,
          pedagogicalRationale: 'Logarithmic threshold inversion for warming duration.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: `Use T(t) = ${tm} - (${tm} - ${t0})e^{-kt} = 70 - 40e^{-kt}.`, revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Substitute T(1) = ${t1Reading}: 50 = 70 - 40e^{-k} \\implies e^{-k} = 1/2.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `Warming constant k = \\ln(2) \\approx 0.6931\\text{ min}^{-1}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `Set 70 - 40e^{-kt} = ${targetT} \\implies e^{-kt} = ${deltaT}/40 = 1/${ratio}.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `t = \\frac{\\ln(${ratio})}{\\ln(2)} = 2.0\\text{ minutes}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'CALCULATE_THRESHOLD_TIME';
      const archetypeId = 'ARCH-APP-HEATING-TIME-TARGET';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A frozen sample at ${t0}°F is placed in a warm room at ${tm}°F. After 1 minute the reading is ${t1Reading}°F. How long in minutes will it take for the sample to warm to ${targetT}°F?`,
        applicationDomain: 'COOLING_HEATING',
        physicalConfiguration: 'HEATING_THRESHOLD_TARGET',
        governingModel: 'dT_dt_eq_k_Tm_minus_T',
        unknownTarget: 'TIME_TO_WARMING_THRESHOLD'
      });

      return {
        statement: {
          promptText: `A frozen sample at ${t0}°F is placed in a warm room at ${tm}°F. After 1 minute the reading is ${t1Reading}°F. How long in minutes will it take for the sample to warm to ${targetT}°F?`,
          expressionLatex,
          targetVariable: 't',
          independentVariable: 'T',
          physicalUnits: 'min'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 3, conceptual: 3, procedural: 3, computational: 3, reasoning: 3, representation: 2, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_HEAT_THRESHOLD:T_${targetT}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-MIX-WASHOUT-TIME': {
    id: 'TMPL-GEN0107-APP-MIX-WASHOUT-TIME',
    familyId: 'FAM-GEN0107-APP-MIXING-DILUTION',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    archetypeId: 'ARCH-APP-MIXING-WASHOUT-TIME',
    name: 'Castro Dilution Pure Flush Elapsed Time to Residue Threshold',
    description: 'Directly reflects Castro Spread 48 Problem 25(b): calculate flushing duration required to eliminate 90% of contaminant.',
    parameterSchema: [
      { name: 'removalPct', type: 'INTEGER', min: 80, max: 95, defaultValue: 90, description: 'Percentage of contaminant eliminated' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const removalPct = params?.removalPct ?? 90; // 90%
      const volume = 100; // gal
      const rate = 4; // gal/min
      const m0 = 50; // initial lb
      const kDecay = rate / volume; // 0.04 min^-1
      const remainingFrac = (100 - removalPct) / 100; // 0.10
      const remainingMass = m0 * remainingFrac; // 5 lb

      // m(t) = 50 e^{-0.04 t} = 5 => e^{-0.04 t} = 0.10 => t = ln(10)/0.04 = 25 ln(10) approx 57.6 min
      const expressionLatex = `\\frac{dm}{dt} = -${kDecay}m, \\quad m(0) = ${m0}, \\quad m(t) = ${remainingMass}`;
      const canonicalAnswerLatex = `t = \\frac{\\ln(10)}{${kDecay}} \\approx 57.6\\text{ min}`;

      const rawAst = divide(func('ln', constant(10)), constant(kDecay));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Dilution washout model: dm/dt = -(R/V)m = -${kDecay}m. Solution is m(t) = m_0 e^{-${kDecay}t} = ${m0} e^{-${kDecay}t}.`,
          pedagogicalRationale: 'Castro Spread 48 Problem 25(b) pure water flushing solution.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Removal of ${removalPct}% leaves ${(remainingFrac * 100).toFixed(0)}% of initial solute: m(t*) = ${remainingMass} lb => ${m0} e^{-${kDecay}t*} = ${remainingMass}.`,
          pedagogicalRationale: 'Threshold mass condition assignment.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Solve for t*: e^{-${kDecay}t*} = ${remainingFrac} => -${kDecay}t* = ln(${remainingFrac}) = -ln(10) => t* = ln(10)/${kDecay} = 25 ln(10) approx 57.6 minutes.`,
          pedagogicalRationale: 'Logarithmic threshold inversion.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: `With pure solvent inflow, m(t) = m_0 e^{-(R/V)t} = ${m0}e^{-${kDecay}t}.`, revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Eliminating ${removalPct}% means ${(remainingFrac * 100).toFixed(0)}% remains: ${m0}e^{-${kDecay}t} = ${remainingMass}.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `e^{-${kDecay}t} = ${remainingFrac} \\implies -${kDecay}t = \\ln(${remainingFrac}).`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `t = \\frac{-\\ln(${remainingFrac})}{${kDecay}} = \\frac{\\ln(10)}{0.04}.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `t = 25\\ln(10) \\approx 57.6\\text{ minutes}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'CALCULATE_THRESHOLD_TIME';
      const archetypeId = 'ARCH-APP-MIXING-WASHOUT-TIME';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A tank contains ${volume} gallons of water holding ${m0} pounds of contaminant. Pure water flushes the tank at ${rate} gal/min and the well-stirred solution drains at ${rate} gal/min. How long in minutes will it take to eliminate ${removalPct}% of the contaminant?`,
        applicationDomain: 'MIXING_TANK',
        physicalConfiguration: 'PURE_SOLVENT_WASHOUT_THRESHOLD',
        governingModel: 'dm_dt_plus_k_m_eq_0',
        unknownTarget: 'TIME_TO_WASHOUT_PERCENTAGE'
      });

      return {
        statement: {
          promptText: `A tank contains ${volume} gallons of water holding ${m0} pounds of contaminant. Pure water flushes the tank at ${rate} gal/min and the well-stirred solution drains at ${rate} gal/min. How long in minutes will it take to eliminate ${removalPct}% of the contaminant?`,
          expressionLatex,
          targetVariable: 't',
          independentVariable: 'm',
          physicalUnits: 'min'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 3, conceptual: 3, procedural: 3, computational: 3, reasoning: 3, representation: 2, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_MIX_WASHOUT_TIME:R${removalPct}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-POP-GROWTH-IVP': {
    id: 'TMPL-GEN0107-APP-POP-GROWTH-IVP',
    familyId: 'FAM-GEN0107-APP-GROWTH-DECAY',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'SOLVE_INITIAL_VALUE_PROBLEM',
    archetypeId: 'ARCH-APP-POPULATION-GROWTH-IVP',
    name: 'Castro Malthusian Bacterial Population Growth Kinetics',
    description: 'Directly reflects Castro Spread 47: population growth dP/dt = kP with multi-hour observational scaling.',
    parameterSchema: [
      { name: 'growthFactor', type: 'INTEGER', min: 2, max: 4, defaultValue: 3, description: 'Population multiplier after 2 hours' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const factor = params?.growthFactor ?? 3; // triples in 2 hours
      const tObs = 2; // hours

      // dP/dt = kP => P(t) = P0 e^{kt}. P(2) = P0 e^{2k} = factor P0 => k = ln(factor)/2
      // P(t) = P0 (factor)^{t/2}
      const expressionLatex = `\\frac{dP}{dt} = kP, \\quad P(0) = P_0, \\quad P(${tObs}) = ${factor}P_0`;
      const canonicalAnswerLatex = `P(t) = P_0 (${factor})^{t/${tObs}} = P_0 e^{\\frac{\\ln(${factor})}{${tObs}}t}`;

      const rawAst = multiply(variable('P_0'), power(constant(factor), divide(variable('t'), constant(tObs))));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Malthusian growth model: rate of population growth is proportional to population: dP/dt = kP. General solution: P(t) = P_0 e^{kt}.`,
          pedagogicalRationale: 'Castro Spread 47 exponential growth formulation.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Apply intermediate condition P(${tObs}) = ${factor}P_0: P_0 e^{${tObs}k} = ${factor}P_0 => e^{${tObs}k} = ${factor} => k = ln(${factor})/${tObs} approx ${(Math.log(factor)/tObs).toFixed(4)} hr^-1.`,
          pedagogicalRationale: 'Growth rate parameter determination.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Substitute k back into general solution: P(t) = P_0 (e^{k})^t = P_0 (${factor})^{t/${tObs}}.`,
          pedagogicalRationale: 'Algebraic closed-form representation.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Population growth follows dP/dt = kP \\implies P(t) = P_0 e^{kt}.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Use P(${tObs}) = ${factor}P_0 to determine e^{${tObs}k} = ${factor}.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `Growth constant k = \\frac{\\ln(${factor})}{${tObs}} \\approx ${(Math.log(factor)/tObs).toFixed(4)}\\text{ hr}^{-1}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `P(t) = P_0 e^{\\left(\\frac{\\ln(${factor})}{${tObs}}\\right)t} = P_0 (${factor})^{t/${tObs}}.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `P(t) = P_0 (${factor})^{t/${tObs}}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'SOLVE_INITIAL_VALUE_PROBLEM';
      const archetypeId = 'ARCH-APP-POPULATION-GROWTH-IVP';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A culture of bacteria grows at a rate proportional to the population present. If the initial count is P₀ and the population increases to ${factor}P₀ in ${tObs} hours, solve for the population P(t) at any time t:`,
        applicationDomain: 'GROWTH_DECAY',
        physicalConfiguration: 'POPULATION_MALTHUSIAN_GROWTH',
        governingModel: 'dP_dt_eq_plus_kP',
        unknownTarget: 'POPULATION_AT_TIME_T'
      });

      return {
        statement: {
          promptText: `A culture of bacteria grows at a rate proportional to the population present. If the initial count is P₀ and the population increases to ${factor}P₀ in ${tObs} hours, solve for the population P(t) at any time t:`,
          expressionLatex,
          targetVariable: 'P(t)',
          independentVariable: 't'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 2, reasoning: 2, representation: 1, context: 2, multiStep: 2 },
        structureSignature: `GEN0107:CASTRO_POP_GROWTH:F${factor}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  'TMPL-GEN0107-APP-POP-DOUBLING': {
    id: 'TMPL-GEN0107-APP-POP-DOUBLING',
    familyId: 'FAM-GEN0107-APP-GROWTH-DECAY',
    courseId: 'COURSE-GEN0107',
    primarySkillId: 'SKILL-GEN0107-008',
    conceptId: 'de_first_order_applications',
    taskType: 'CALCULATE_THRESHOLD_TIME',
    archetypeId: 'ARCH-APP-POPULATION-DOUBLING',
    name: 'Castro Bacterial Culture Population Doubling Time',
    description: 'Directly reflects Castro Spread 47 Problem 15: calculating doubling time from observed percentage growth.',
    parameterSchema: [
      { name: 'growthPct', type: 'INTEGER', min: 20, max: 30, defaultValue: 25, description: 'Hourly percentage growth rate' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const growthPct = params?.growthPct ?? 25; // 25% increase in 1 hour
      const ratio = 1 + growthPct / 100; // 1.25

      // P(1) = 1.25 P0 => e^k = 1.25 => k = ln(1.25) approx 0.2231 hr^-1
      // Doubling: P(t_d) = 2 P0 => e^{k t_d} = 2 => t_d = ln(2)/ln(1.25) approx 3.11 hr
      const expressionLatex = `\\frac{dP}{dt} = kP, \\quad P(0) = P_0, \\quad P(1) = ${ratio}P_0`;
      const canonicalAnswerLatex = `t_{\\text{double}} = \\frac{\\ln(2)}{\\ln(${ratio})} \\approx 3.1\\text{ hours}`;

      const rawAst = divide(func('ln', constant(2)), func('ln', constant(ratio)));

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: `Malthusian growth: dP/dt = kP => P(t) = P_0 e^{kt}. Hourly growth of ${growthPct}% gives P(1) = ${ratio} P_0.`,
          pedagogicalRationale: 'Castro Spread 47 Problem 15 model formulation.'
        },
        {
          stepIndex: 2,
          phase: 'EXECUTION',
          actionDescription: `Determine rate constant k: e^k = ${ratio} => k = ln(${ratio}) approx ${(Math.log(ratio)).toFixed(4)} hr^-1.`,
          pedagogicalRationale: 'Logarithmic rate constant extraction.'
        },
        {
          stepIndex: 3,
          phase: 'SIMPLIFICATION',
          actionDescription: `Doubling condition P(t_d) = 2 P_0: e^{k t_d} = 2 => t_d = ln(2)/k = ln(2)/ln(${ratio}) approx 3.1 hours.`,
          pedagogicalRationale: 'Logarithmic doubling time calculation.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Set up P(t) = P_0 e^{kt}.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Use P(1) = ${ratio}P_0 \\implies e^k = ${ratio}.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `k = \\ln(${ratio}) \\approx ${(Math.log(ratio)).toFixed(4)}\\text{ hr}^{-1}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `Doubling requires e^{k t} = 2 \\implies t = \\frac{\\ln(2)}{k}.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `t = \\frac{\\ln(2)}{\\ln(${ratio})} \\approx 3.1\\text{ hours}.`, revealsFinalAnswer: true }
      ];

      const taskType = 'CALCULATE_THRESHOLD_TIME';
      const archetypeId = 'ARCH-APP-POPULATION-DOUBLING';
      const fp = calculateASTFingerprint(rawAst, {
        taskType,
        archetypeId,
        expressionLatex,
        statementPrompt: `A culture of bacteria grows at a rate proportional to the population present. In 1 hour, the population increases by ${growthPct}%. Determine the doubling time of the culture in hours:`,
        applicationDomain: 'GROWTH_DECAY',
        physicalConfiguration: 'POPULATION_DOUBLING_TIME',
        governingModel: 'dP_dt_eq_plus_kP',
        unknownTarget: 'POPULATION_DOUBLING_TIME'
      });

      return {
        statement: {
          promptText: `A culture of bacteria grows at a rate proportional to the population present. In 1 hour, the population increases by ${growthPct}%. Determine the doubling time of the culture in hours:`,
          expressionLatex,
          targetVariable: 't_{double}',
          independentVariable: 't',
          physicalUnits: 'hours'
        },
        rawExpression: rawAst,
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 3, reasoning: 3, representation: 1, context: 3, multiStep: 3 },
        structureSignature: `GEN0107:CASTRO_POP_DOUBLING:P${growthPct}`,
        taskType,
        archetypeId,
        sourceMetadata: ARCHETYPE_REGISTRY[archetypeId]?.sourceMetadata,
        structuralFingerprint: fp
      };
    }
  },

  // =========================================================================
  // COURSE: GEN 0110 (Physics 2 for Engineers - Lec/Lab)
  // =========================================================================
  'TMPL-GEN0110-FLUID-PRESSURE': {
    id: 'TMPL-GEN0110-FLUID-PRESSURE',
    familyId: 'FAM-GEN0110-FLUID-PRESSURE',
    courseId: 'COURSE-GEN0110',
    primarySkillId: 'SKILL-GEN0110-001',
    name: 'Hydrostatic Pressure Gauge Calculation',
    description: 'Calculate hydrostatic gauge pressure P = rho * g * h.',
    parameterSchema: [
      { name: 'depth', type: 'INTEGER', min: 5, max: 50, description: 'Depth in meters' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const depth = params?.depth ?? 10;
      const rho = 1000; // kg/m^3
      const g = 9.8;    // m/s^2
      const gaugePressureKPa = (rho * g * depth) / 1000; // 98 kPa

      const rawAst = constant(gaugePressureKPa);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Hydrostatic gauge pressure formula: P_gauge = rho * g * h.', pedagogicalRationale: 'Fluid statics formula.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `P = 1000 kg/m^3 * 9.8 m/s^2 * ${depth} m = ${gaugePressureKPa * 1000} Pa = ${gaugePressureKPa} kPa.`, pedagogicalRationale: 'Pressure calculation with unit conversion.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Use P_gauge = rho * g * h with water density 1000 kg/m^3 and g = 9.8 m/s^2.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `P = 1000 * 9.8 * ${depth} Pascals.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: 'Divide Pascals by 1000 to convert to kiloPascals (kPa).', revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `P = ${gaugePressureKPa} kPa.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${gaugePressureKPa} kPa`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `Calculate the hydrostatic gauge pressure at a depth of ${depth} meters in pure water (density = 1000 kg/m^3, g = 9.8 m/s^2) in kPa:`,
          expressionLatex: `P = \\rho g h`,
          targetVariable: 'P',
          independentVariable: 'h',
          physicalUnits: 'kPa'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 2, reasoning: 2, representation: 2, context: 3, multiStep: 2 },
        structureSignature: `GEN0110:HYDROSTATIC:DEPTH_${depth}`
      };
    }
  },

  'TMPL-GEN0110-BUOYANCY-ARCHIMEDES': {
    id: 'TMPL-GEN0110-BUOYANCY-ARCHIMEDES',
    familyId: 'FAM-GEN0110-BUOYANCY-ARCHIMEDES',
    courseId: 'COURSE-GEN0110',
    primarySkillId: 'SKILL-GEN0110-001',
    name: 'Archimedes Principle Submerged Buoyant Force Calculation',
    description: 'Calculate buoyant force and equilibrium submerged volume across structural difficulty levels.',
    parameterSchema: [
      { name: 'volume', type: 'INTEGER', min: 1, max: 10, description: 'Volume in tenths of cubic meters (0.1 V)' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let promptText = '';
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let rawAst: any = constant(490);
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Fully submerged in freshwater
          promptText = 'A solid metal object with a volume of 0.05 m^3 is completely submerged in freshwater (density = 1000 kg/m^3, g = 9.8 m/s^2). Calculate the upward buoyant force in Newtons (N):';
          expressionLatex = `F_{b} = \\rho V g`;
          canonicalAnswerLatex = `490\\text{ N}`;
          rawAst = constant(490);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Archimedes Principle: F_b = rho_fluid * V_submerged * g.', pedagogicalRationale: 'Buoyancy formula.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'F_b = 1000 kg/m^3 * 0.05 m^3 * 9.8 m/s^2 = 490 N.', pedagogicalRationale: 'Force calculation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Buoyant force equals the weight of the displaced water: F_b = rho * V * g.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'F_b = 1000 * 0.05 * 9.8.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Fully submerged in oil (rho = 800 kg/m^3)
          promptText = 'A metal component with volume 0.05 m^3 is submerged in an oil bath with density rho = 800 kg/m^3 (g = 9.8 m/s^2). Compute the buoyant force in Newtons (N):';
          expressionLatex = `F_{b} = \\rho_{\\text{oil}} V g`;
          canonicalAnswerLatex = `392\\text{ N}`;
          rawAst = constant(392);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'F_b = rho_oil * V * g with rho_oil = 800 kg/m^3.', pedagogicalRationale: 'Fluid density substitution.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'F_b = 800 * 0.05 * 9.8 = 392 N.', pedagogicalRationale: 'Computation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Substitute the density of oil (800 kg/m^3) instead of water.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'F_b = 800 * 0.05 * 9.8.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Floating body equilibrium submerged volume fraction
          promptText = 'A block of wood with total volume V = 0.10 m^3 and density 600 kg/m^3 floats in freshwater (1000 kg/m^3). Calculate the submerged volume V_sub in m^3:';
          expressionLatex = `V_{\\text{sub}} = \\frac{\\rho_{\\text{obj}}}{\\rho_{\\text{fluid}}} V`;
          canonicalAnswerLatex = `0.06\\text{ m}^{3}`;
          rawAst = constant(0.06);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Floating equilibrium: Weight = Buoyant force => rho_obj * V * g = rho_fluid * V_sub * g.', pedagogicalRationale: 'Floating equilibrium.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'V_sub = (rho_obj / rho_fluid) * V = (600 / 1000) * 0.10 = 0.06 m^3.', pedagogicalRationale: 'Submerged fraction.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'For a floating body, buoyant force equals total gravitational weight.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'V_sub = (600 / 1000) * 0.10 m^3.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Apparent weight in fluid
          promptText = 'A solid aluminum block (volume V = 0.02 m^3, density = 2700 kg/m^3) is submerged in water (rho = 1000 kg/m^3, g = 9.8 m/s^2). Calculate its apparent weight W_app in Newtons (N):';
          expressionLatex = `W_{\\text{app}} = (\\rho_{\\text{Al}} - \\rho_{\\text{water}}) V g`;
          canonicalAnswerLatex = `333\\text{ N}`;
          rawAst = constant(333);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Apparent weight: W_app = W - F_b = (rho_obj - rho_fluid) * V * g.', pedagogicalRationale: 'Effective submerged force.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'W_app = (2700 - 1000) kg/m^3 * 0.02 m^3 * 9.8 m/s^2 = 1700 * 0.02 * 9.8 = 333.2 N => 333 N.', pedagogicalRationale: 'Net force evaluation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Apparent weight is true weight minus upward buoyant force.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'W_app = (2700 - 1000) * 0.02 * 9.8.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'F_b',
          independentVariable: 'V',
          physicalUnits: difficulty === 3 ? 'm^3' : 'N'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 1, context: 3, multiStep: difficulty },
        structureSignature: `GEN0110:BUOYANCY:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0110-HEAT-CONDUCTION': {
    id: 'TMPL-GEN0110-HEAT-CONDUCTION',
    familyId: 'FAM-GEN0110-HEAT-CONDUCTION',
    courseId: 'COURSE-GEN0110',
    primarySkillId: 'SKILL-GEN0110-002',
    name: 'Fourier 1D Conduction Rate Calculation',
    description: 'Calculate conductive heat transfer rates and thermal resistances with structural scaling.',
    parameterSchema: [
      { name: 'deltaT', type: 'INTEGER', min: 10, max: 50, description: 'Temperature difference in K' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let promptText = '';
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let rawAst: any = constant(1600);
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Single plane glass wall
          promptText = 'A plane glass wall with area A = 10 m^2, thickness L = 0.1 m, and thermal conductivity k = 0.8 W/(m*K) has a temperature difference Delta T = 20 K across its faces. Calculate the heat conduction rate in Watts (W):';
          expressionLatex = `\\dot{Q} = \\frac{k A \\Delta T}{L}`;
          canonicalAnswerLatex = `1600\\text{ W}`;
          rawAst = constant(1600);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Fourier Law: Q_dot = k * A * Delta T / L.', pedagogicalRationale: 'Conduction formula.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Q_dot = (0.8 * 10 * 20) / 0.1 = 1600 W.', pedagogicalRationale: 'Computation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Use Fourier\'s law: Q_dot = k * A * Delta T / L.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Q_dot = (0.8 * 10 * 20) / 0.1.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: High-conductivity metal rod
          promptText = 'A cylindrical copper rod with cross-sectional area A = 0.01 m^2, length L = 0.5 m, and thermal conductivity k = 400 W/(m*K) has Delta T = 50 K across its ends. Compute the heat flow rate in Watts (W):';
          expressionLatex = `\\dot{Q} = \\frac{k_{\\text{Cu}} A \\Delta T}{L}`;
          canonicalAnswerLatex = `400\\text{ W}`;
          rawAst = constant(400);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Fourier conduction along rod: Q_dot = k_Cu * A * Delta T / L.', pedagogicalRationale: 'Rod conduction.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Q_dot = (400 * 0.01 * 50) / 0.5 = 200 / 0.5 = 400 W.', pedagogicalRationale: 'Evaluation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Apply Fourier Law: Q_dot = (k * A * Delta T) / L.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Substitute: (400 * 0.01 * 50) / 0.5.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Thermal resistance calculation
          promptText = 'An insulating fiberglass wall has thickness L = 0.2 m, area A = 5 m^2, and thermal conductivity k = 0.04 W/(m*K). Calculate its conductive thermal resistance R_th in K/W:';
          expressionLatex = `R_{\\text{th}} = \\frac{L}{k A}`;
          canonicalAnswerLatex = `1\\text{ K/W}`;
          rawAst = constant(1);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Thermal resistance: R_th = L / (k * A).', pedagogicalRationale: 'Thermal resistance concept.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'R_th = 0.2 / (0.04 * 5) = 0.2 / 0.2 = 1.0 K/W.', pedagogicalRationale: 'Evaluation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Thermal resistance is R_th = L / (k * A).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'R_th = 0.2 / (0.04 * 5) = 1.0 K/W.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Two composite layers in series
          promptText = 'A composite wall consists of two layers in series with thermal resistances R_1 = 0.2 K/W and R_2 = 0.4 K/W. If the total temperature difference across the combined slab is Delta T = 60 K, compute the steady-state heat flow rate in Watts (W):';
          expressionLatex = `\\dot{Q} = \\frac{\\Delta T}{R_{1} + R_{2}}`;
          canonicalAnswerLatex = `100\\text{ W}`;
          rawAst = constant(100);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Composite series resistances add: R_total = R_1 + R_2 = 0.2 + 0.4 = 0.6 K/W.', pedagogicalRationale: 'Series thermal circuit.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Q_dot = Delta T / R_total = 60 K / 0.6 K/W = 100 W.', pedagogicalRationale: 'Conduction heat rate.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Add series thermal resistances: R_total = R_1 + R_2 = 0.6 K/W.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Q_dot = 60 / 0.6 = 100 W.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: difficulty === 3 ? 'R_th' : '\\dot{Q}',
          independentVariable: 'T',
          physicalUnits: difficulty === 3 ? 'K/W' : 'W'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 1, context: 3, multiStep: difficulty },
        structureSignature: `GEN0110:CONDUCTION:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0110-DC-CIRCUITS-OHM': {
    id: 'TMPL-GEN0110-DC-CIRCUITS-OHM',
    familyId: 'FAM-GEN0110-DC-CIRCUITS-OHM',
    courseId: 'COURSE-GEN0110',
    primarySkillId: 'SKILL-GEN0110-008',
    name: 'DC Resistor Series-Parallel Network and Current Analysis',
    description: 'Calculate equivalent resistance and circuit currents across series, parallel, and compound networks.',
    parameterSchema: [
      { name: 'v', type: 'INTEGER', min: 12, max: 48, description: 'Voltage supply' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let promptText = '';
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let rawAst: any = constant(2);
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Pure series circuit
          promptText = 'A DC voltage source of 24 V is connected across two resistors R_1 = 4 ohms and R_2 = 8 ohms in series. Calculate the circuit current in Amperes (A):';
          expressionLatex = `I = \\frac{V}{R_{1} + R_{2}}`;
          canonicalAnswerLatex = `2\\text{ A}`;
          rawAst = constant(2);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Series resistance: R_total = R_1 + R_2 = 4 + 8 = 12 ohms.', pedagogicalRationale: 'Series addition.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Ohm\'s Law: I = V / R_total = 24 / 12 = 2 A.', pedagogicalRationale: 'Current calculation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Resistors in series add directly: R_total = 4 + 8 = 12 ohms.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'I = 24 / 12.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Pure parallel circuit
          promptText = 'A DC source of 12 V is connected across two parallel resistors R_1 = 6 ohms and R_2 = 12 ohms. Calculate the total circuit current delivered by the source in Amperes (A):';
          expressionLatex = `I = \\frac{V}{R_{1} \\parallel R_{2}}`;
          canonicalAnswerLatex = `3\\text{ A}`;
          rawAst = constant(3);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Parallel equivalent resistance: R_p = (6 * 12) / (6 + 12) = 72 / 18 = 4 ohms.', pedagogicalRationale: 'Parallel formula.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'I_total = V / R_p = 12 / 4 = 3 A.', pedagogicalRationale: 'Total current.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Calculate equivalent resistance: R_p = (R1 * R2) / (R1 + R2).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'R_p = 72 / 18 = 4 ohms. Then I = 12 / 4.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Series-parallel combination
          promptText = 'A DC voltage source of 24 V is connected to a 6-ohm resistor in series with two 12-ohm resistors connected in parallel. Calculate the total circuit current in Amperes (A):';
          expressionLatex = `I = \\frac{V}{R_{1} + (R_{2} \\parallel R_{3})}`;
          canonicalAnswerLatex = `2\\text{ A}`;
          rawAst = constant(2);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Parallel reduction: R_p = (12 * 12) / (12 + 12) = 6 ohms.', pedagogicalRationale: 'Parallel branch.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Series combination: R_total = 6 + 6 = 12 ohms. I = 24 / 12 = 2 A.', pedagogicalRationale: 'Total current.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'First combine the two 12-ohm parallel resistors to get 6 ohms.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Total resistance R_total = 6 + 6 = 12 ohms.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Dual parallel-parallel network
          promptText = 'A DC supply of 36 V feeds a network consisting of a parallel pair (10 ohms || 10 ohms) connected in series with another parallel pair (8 ohms || 8 ohms). Determine the total circuit current in Amperes (A):';
          expressionLatex = `I = \\frac{V}{(R_{1} \\parallel R_{2}) + (R_{3} \\parallel R_{4})}`;
          canonicalAnswerLatex = `4\\text{ A}`;
          rawAst = constant(4);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Reduce pair 1: 10 || 10 = 5 ohms. Reduce pair 2: 8 || 8 = 4 ohms.', pedagogicalRationale: 'Dual parallel reduction.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'Series total: R_total = 5 + 4 = 9 ohms. Total current: I = 36 / 9 = 4 A.', pedagogicalRationale: 'Total current.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Reduce each parallel pair independently: 10 || 10 = 5 ohms and 8 || 8 = 4 ohms.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'Total resistance is 5 + 4 = 9 ohms. Current is 36 / 9.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: 'I',
          independentVariable: 'V',
          physicalUnits: 'A'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 2, context: 3, multiStep: difficulty },
        structureSignature: `GEN0110:CIRCUITS:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0110-COULOMB-FORCE': {
    id: 'TMPL-GEN0110-COULOMB-FORCE',
    familyId: 'FAM-GEN0110-COULOMB-FORCE',
    courseId: 'COURSE-GEN0110',
    primarySkillId: 'SKILL-GEN0110-007',
    name: 'Coulomb Electrostatic Force Point Charge Calculation',
    description: 'Calculate electrostatic force, separation distance, and equilibrium configurations with structural scaling.',
    parameterSchema: [
      { name: 'rCm', type: 'INTEGER', min: 5, max: 20, description: 'Separation distance in centimeters' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      let promptText = '';
      let expressionLatex = '';
      let canonicalAnswerLatex = '';
      let rawAst: any = constant(1);
      let reasoningTrace: StructuredReasoningTraceStep[] = [];
      let hints: StructuredHint[] = [];

      switch (difficulty) {
        case 1:
          // Level 1: Symmetric equal point charges
          promptText = 'Two identical point charges of +2 microCoulombs each are separated by 0.2 m in vacuum (k = 8.99 x 10^9 N*m^2/C^2). Compute the magnitude of the repulsive electrostatic force in Newtons (N):';
          expressionLatex = `F = \\frac{k q^{2}}{r^{2}}`;
          canonicalAnswerLatex = `0.9\\text{ N}`;
          rawAst = constant(0.9);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Coulomb Law for identical charges: F = k * q^2 / r^2.', pedagogicalRationale: 'Coulomb formula.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'F = (8.99e9 * (2e-6)^2) / (0.2)^2 = (0.03596) / 0.04 = 0.899 N => 0.9 N.', pedagogicalRationale: 'Force evaluation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Use Coulomb\'s Law with q1 = q2 = 2 x 10^-6 C and r = 0.2 m.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'F = (8.99e9 * 4e-12) / 0.04 = 0.9 N.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 2:
          // Level 2: Asymmetric point charges
          promptText = 'Two point charges of +2 microCoulombs and +5 microCoulombs are separated by a distance of 10 cm in vacuum (k = 8.99 x 10^9 N*m^2/C^2). Compute the repulsive electrostatic force in Newtons (N):';
          expressionLatex = `F = \\frac{k |q_{1} q_{2}|}{r^{2}}`;
          canonicalAnswerLatex = `9\\text{ N}`;
          rawAst = constant(9);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Coulomb Law: F = k * |q1 * q2| / r^2.', pedagogicalRationale: 'Coulomb formula.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'F = (8.99e9 * 2e-6 * 5e-6) / (0.1)^2 = 0.0899 / 0.01 = 8.99 N => 9 N.', pedagogicalRationale: 'Force evaluation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Convert 10 cm to 0.1 m and microCoulombs to 10^-6 C.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'F = (8.99e9 * 10e-12) / 0.01 = 9 N.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 3:
          // Level 3: Inverting Coulomb's law to solve for separation distance r
          promptText = 'Two point charges of +2 microCoulombs each repel each other with an electrostatic force of 3.6 N in vacuum (k = 9.0 x 10^9 N*m^2/C^2). Find their separation distance r in meters (m):';
          expressionLatex = `r = \\sqrt{\\frac{k |q_{1} q_{2}|}{F}}`;
          canonicalAnswerLatex = `0.1\\text{ m}`;
          rawAst = constant(0.1);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Invert Coulomb\'s Law: r^2 = k * q1 * q2 / F => r = sqrt(k * q^2 / F).', pedagogicalRationale: 'Algebraic inversion.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'r^2 = (9e9 * 4e-12) / 3.6 = 0.036 / 3.6 = 0.01 => r = 0.1 m.', pedagogicalRationale: 'Square root evaluation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Rearrange Coulomb\'s formula: r = sqrt(k * q1 * q2 / F).', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'r = sqrt((9e9 * 4e-12) / 3.6) = sqrt(0.01) = 0.1 m.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;

        case 4:
        default:
          // Level 4: Three collinear charges net force / equilibrium
          promptText = 'A charge q_0 = +1 microCoulomb is placed at the origin x = 0. Charge q_1 = +4 microCoulombs is at x = +0.2 m, and charge q_2 = +9 microCoulombs is at x = -0.3 m. Compute the net electrostatic force on q_0 in Newtons (N):';
          expressionLatex = `F_{\\text{net}} = F_{2} - F_{1}`;
          canonicalAnswerLatex = `0\\text{ N}`;
          rawAst = constant(0);
          reasoningTrace = [
            { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Superposition principle: Net force on q_0 is the vector sum of forces from q_1 (pushes left) and q_2 (pushes right).', pedagogicalRationale: 'Superposition principle.' },
            { stepIndex: 2, phase: 'EXECUTION', actionDescription: 'F_1 = 9e9 * 1e-6 * 4e-6 / (0.2)^2 = 0.036 / 0.04 = 0.9 N (left). F_2 = 9e9 * 1e-6 * 9e-6 / (0.3)^2 = 0.081 / 0.09 = 0.9 N (right).', pedagogicalRationale: 'Component forces.' },
            { stepIndex: 3, phase: 'SIMPLIFICATION', actionDescription: 'Net force F_net = 0.9 N - 0.9 N = 0 N (equilibrium).', pedagogicalRationale: 'Vector cancellation.' }
          ];
          hints = [
            { level: 1, category: 'RECOGNITION', text: 'Calculate the force from q1 and q2 on q0 separately using vector directions.', revealsFinalAnswer: false },
            { level: 2, category: 'SETUP', text: 'F1 = 0.9 N directed in -x, F2 = 0.9 N directed in +x.', revealsFinalAnswer: false },
            { level: 3, category: 'GUIDED_CALCULATION', text: canonicalAnswerLatex, revealsFinalAnswer: true }
          ];
          break;
      }

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable: difficulty === 3 ? 'r' : 'F',
          independentVariable: 'r',
          physicalUnits: difficulty === 3 ? 'm' : 'N'
        },
        canonicalAnswerLatex,
        canonicalAnswerRaw: canonicalAnswerLatex,
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: difficulty, conceptual: difficulty, procedural: difficulty, computational: 2, reasoning: difficulty, representation: 1, context: 3, multiStep: difficulty },
        structureSignature: `GEN0110:COULOMB:DIFF${difficulty}`
      };
    }
  },

  'TMPL-GEN0110-SNELL-REFRACTION': {
    id: 'TMPL-GEN0110-SNELL-REFRACTION',
    familyId: 'FAM-GEN0110-SNELL-REFRACTION',
    courseId: 'COURSE-GEN0110',
    primarySkillId: 'SKILL-GEN0110-009',
    name: 'Snell Law Optical Refraction Angle Calculation',
    description: 'Calculate sin(theta2) = (n1/n2)*sin(theta1).',
    parameterSchema: [
      { name: 'thetaDeg', type: 'INTEGER', min: 20, max: 45, description: 'Angle of incidence in degrees' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const n1 = 1.0; // air
      const n2 = 1.5; // glass
      const theta1Deg = 30;
      const sinTheta1 = 0.5;
      const sinTheta2 = parseFloat(((n1 / n2) * sinTheta1).toFixed(3)); // 0.333

      const rawAst = constant(sinTheta2);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Snell Law of Refraction: n1 * sin(theta1) = n2 * sin(theta2).', pedagogicalRationale: 'Snell formula.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `sin(theta2) = (n1 / n2) * sin(30°) = (1.0 / 1.5) * 0.5 = 0.333.`, pedagogicalRationale: 'Angle calculation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Apply Snell\'s Law: n1 sin(theta1) = n2 sin(theta2).', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: 'sin(theta2) = (1.0 / 1.5) * sin(30°).', revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `\\sin(\\theta_{2}) = ${sinTheta2}`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${sinTheta2}`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${sinTheta2}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A ray of light in air (n1 = 1.0) strikes a flat glass interface (n2 = 1.5) at an incidence angle of 30° to the normal. Calculate sin(theta2) of the refracted angle:`,
          expressionLatex: `n_{1} \\sin(\\theta_{1}) = n_{2} \\sin(\\theta_{2})`,
          targetVariable: '\\sin(\\theta_2)',
          independentVariable: '\\theta',
          physicalUnits: 'DIMENSIONLESS'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 1, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: 'GEN0110:SNELL:THETA30'
      };
    }
  },

  'TMPL-GEN0110-DOPPLER-SHIFT': {
    id: 'TMPL-GEN0110-DOPPLER-SHIFT',
    familyId: 'FAM-GEN0110-DOPPLER-SHIFT',
    courseId: 'COURSE-GEN0110',
    primarySkillId: 'SKILL-GEN0110-005',
    name: 'Acoustic Doppler Approaching Source Frequency Calculation',
    description: 'Calculate perceived frequency f\' = f * v / (v - v_s).',
    parameterSchema: [
      { name: 'speed', type: 'INTEGER', min: 15, max: 40, description: 'Source velocity in m/s' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const f = 400;   // Hz
      const v = 340;   // m/s
      const vs = 34;   // m/s
      const fPrime = Math.round((f * v) / (v - vs)); // 400 * 340 / 306 = 444 Hz

      const rawAst = constant(fPrime);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Doppler frequency formula for moving source approaching stationary observer: f\' = f * v / (v - v_s).', pedagogicalRationale: 'Doppler formula.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `f' = 400 * 340 / (340 - 34) = 400 * 340 / 306 = ${fPrime} Hz.`, pedagogicalRationale: 'Evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'When source approaches stationary observer, use f\' = f * v / (v - v_s).', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `f' = 400 * 340 / (340 - 34).`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `f' = ${fPrime} Hz.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${fPrime} Hz`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${fPrime} Hz`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A police siren emits sound at a frequency of 400 Hz and travels at 34 m/s directly toward a stationary observer in still air (speed of sound v = 340 m/s). Compute the perceived frequency in Hertz (Hz):`,
          expressionLatex: `f' = f \\left(\\frac{v}{v - v_{s}}\\right)`,
          targetVariable: 'f\'',
          independentVariable: 'v_s',
          physicalUnits: 'Hz'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 2, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: 'GEN0110:DOPPLER:VS34'
      };
    }
  },

  // =========================================================================
  // COURSE: GEN 0161 (Thermodynamics)
  // =========================================================================
  'TMPL-GEN0161-STATE-PROPERTY-TABLE': {
    id: 'TMPL-GEN0161-STATE-PROPERTY-TABLE',
    familyId: 'FAM-GEN0161-STATE-PROPERTY-TABLE',
    courseId: 'COURSE-GEN0161',
    primarySkillId: 'SKILL-GEN0161-005',
    name: 'Thermodynamic Water State Phase Identification',
    description: 'Determine water phase at specified P and T.',
    parameterSchema: [
      { name: 'pressure', type: 'INTEGER', min: 50, max: 500, description: 'System pressure in kPa' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const pKPa = 100; // 100 kPa (T_sat = 99.63 deg C)
      const tDegC = 150; // Superheated vapor
      const rawAst = constant(1);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        {
          stepIndex: 1,
          phase: 'RECOGNITION',
          actionDescription: 'Look up saturation temperature at P = 100 kPa: T_sat = 99.63 °C.',
          intermediateExpressionLatex: 'T_{\\text{sat}} = 99.63^{\\circ}\\text{C}',
          pedagogicalRationale: 'Table property lookup.'
        },
        {
          stepIndex: 2,
          phase: 'VERIFICATION',
          actionDescription: 'Compare given T = 150 °C with T_sat: since T > T_sat, state is Superheated Vapor.',
          intermediateExpressionLatex: '\\text{Superheated Vapor}',
          pedagogicalRationale: 'Phase identification criterion.'
        }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'At P = 100 kPa, the boiling (saturation) temperature of water is approximately 99.6 °C.', revealsFinalAnswer: false },
        { level: 2, category: 'FORMULA', text: 'Compare given T with T_sat: if T > T_sat, the phase is vapor.', revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: 'Since 150 °C > 99.6 °C, state is Superheated Vapor.', revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: '\\text{Superheated Vapor}', revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: '\\text{Superheated Vapor}', revealsFinalAnswer: true }
      ];

      const distractors: ProblemDistractor[] = [
        { id: 'OPT-SUPERHEATED', distractorLatex: 'Superheated Vapor', distractorRaw: 'Superheated Vapor', pedagogicalExplanation: 'Correct phase: T > T_sat.', isPlausible: true },
        { id: 'OPT-COMPRESSED', distractorLatex: 'Compressed Liquid', distractorRaw: 'Compressed Liquid', pedagogicalExplanation: 'Would require T < T_sat.', isPlausible: true },
        { id: 'OPT-SATURATED', distractorLatex: 'Saturated Liquid-Vapor Mixture', distractorRaw: 'Saturated Mixture', pedagogicalExplanation: 'Would require T = T_sat.', isPlausible: true }
      ];

      return {
        statement: {
          promptText: `Determine the thermodynamic phase state of pure water at pressure P = 100 kPa and temperature T = 150 °C:`,
          expressionLatex: `P = 100\\text{ kPa}, \\quad T = 150^{\\circ}\\text{C}`,
          targetVariable: 'state',
          independentVariable: 'P',
          options: distractors
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        distractors,
        difficultyVector: { overall: 2, conceptual: 3, procedural: 2, computational: 1, reasoning: 3, representation: 2, context: 3, multiStep: 2 },
        structureSignature: 'GEN0161:PHASE:P100_T150'
      };
    }
  },

  'TMPL-GEN0161-BOUNDARY-WORK-IDEAL': {
    id: 'TMPL-GEN0161-BOUNDARY-WORK-IDEAL',
    familyId: 'FAM-GEN0161-BOUNDARY-WORK-IDEAL',
    courseId: 'COURSE-GEN0161',
    primarySkillId: 'SKILL-GEN0161-004',
    name: 'Isobaric Ideal Gas Boundary Work Calculation',
    description: 'Calculate boundary work W = P * (V2 - V1).',
    parameterSchema: [
      { name: 'pressure', type: 'INTEGER', min: 100, max: 400, description: 'Pressure in kPa' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const pKPa = params?.pressure ?? 200;
      const v1 = 0.2; // m^3
      const v2 = 0.7; // m^3
      const workKJ = pKPa * (v2 - v1); // 200 * 0.5 = 100 kJ

      const rawAst = constant(workKJ);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Boundary work for constant-pressure (isobaric) process: W_b = P * (V2 - V1).', pedagogicalRationale: 'Isobaric work formula.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `W_b = ${pKPa} kPa * (0.7 - 0.2) m^3 = ${pKPa} * 0.5 = ${workKJ} kJ.`, pedagogicalRationale: 'Work evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'For an isobaric process, boundary work W = P * Delta V.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `W = ${pKPa} * (0.7 - 0.2).`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `W = ${workKJ} kJ.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${workKJ} kJ`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${workKJ} kJ`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A piston-cylinder device expands isobarically at a constant pressure P = ${pKPa} kPa from an initial volume of 0.2 m^3 to a final volume of 0.7 m^3. Calculate the boundary work performed in kJ:`,
          expressionLatex: `W_{b} = P(V_{2} - V_{1})`,
          targetVariable: 'W_b',
          independentVariable: 'V',
          physicalUnits: 'kJ'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 1, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `GEN0161:WORK:P${pKPa}`
      };
    }
  },

  'TMPL-GEN0161-1ST-LAW-CLOSED': {
    id: 'TMPL-GEN0161-1ST-LAW-CLOSED',
    familyId: 'FAM-GEN0161-1ST-LAW-CLOSED',
    courseId: 'COURSE-GEN0161',
    primarySkillId: 'SKILL-GEN0161-002',
    name: 'First Law Closed System Heat and Work Energy Balance',
    description: 'Calculate change in internal energy Delta U = Q - W.',
    parameterSchema: [
      { name: 'q', type: 'INTEGER', min: 20, max: 100, description: 'Heat input in kJ' },
      { name: 'w', type: 'INTEGER', min: 5, max: 40, description: 'Work output in kJ' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const q = params?.q ?? 50;
      const w = params?.w ?? 20;
      const deltaU = q - w; // 30 kJ

      const rawAst = constant(deltaU);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'First Law for closed stationary system: Q_in - W_out = Delta U.', pedagogicalRationale: 'First Law energy balance.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Delta U = ${q} kJ - ${w} kJ = ${deltaU} kJ.`, pedagogicalRationale: 'Energy calculation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Apply First Law for a closed system: Delta U = Q - W.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Delta U = ${q} kJ - ${w} kJ.`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `Delta U = ${deltaU} kJ.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${deltaU} kJ`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${deltaU} kJ`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A closed piston-cylinder system absorbs ${q} kJ of heat while performing ${w} kJ of boundary work on its surroundings. Compute the change in internal energy (Delta U) in kJ:`,
          expressionLatex: `Q - W = \\Delta U`,
          targetVariable: '\\Delta U',
          independentVariable: 'Q',
          physicalUnits: 'kJ'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 1, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `GEN0161:1ST_LAW:Q${q}_W${w}`
      };
    }
  },

  'TMPL-GEN0161-1ST-LAW-OPEN-DEVICE': {
    id: 'TMPL-GEN0161-1ST-LAW-OPEN-DEVICE',
    familyId: 'FAM-GEN0161-1ST-LAW-OPEN-DEVICE',
    courseId: 'COURSE-GEN0161',
    primarySkillId: 'SKILL-GEN0161-005',
    name: 'Steady-Flow Steam Turbine Power Output Calculation',
    description: 'Calculate shaft power W_dot = m_dot * (h1 - h2).',
    parameterSchema: [
      { name: 'mDot', type: 'INTEGER', min: 2, max: 8, description: 'Mass flow rate in kg/s' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const mDot = params?.mDot ?? 2;
      const h1 = 3200; // kJ/kg (inlet)
      const h2 = 2400; // kJ/kg (exit)
      const powerKW = mDot * (h1 - h2); // 2 * 800 = 1600 kW

      const rawAst = constant(powerKW);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'First Law for adiabatic steady-flow turbine: W_dot = m_dot * (h_in - h_out).', pedagogicalRationale: 'Turbine energy balance.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `W_dot = ${mDot} kg/s * (3200 - 2400) kJ/kg = ${mDot} * 800 = ${powerKW} kW.`, pedagogicalRationale: 'Power evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'For an adiabatic turbine, Power = mass flow rate * (inlet enthalpy - exit enthalpy).', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `W_dot = ${mDot} * (3200 - 2400).`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `W_dot = ${powerKW} kW.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${powerKW} kW`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${powerKW} kW`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `Superheated steam enters an adiabatic steady-flow turbine at ${mDot} kg/s with enthalpy h1 = 3200 kJ/kg and exits at h2 = 2400 kJ/kg. Calculate the power output in kilowatts (kW):`,
          expressionLatex: `\\dot{W} = \\dot{m}(h_{1} - h_{2})`,
          targetVariable: '\\dot{W}',
          independentVariable: 'm',
          physicalUnits: 'kW'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 3, conceptual: 3, procedural: 2, computational: 2, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `GEN0161:TURBINE:M${mDot}`
      };
    }
  },

  'TMPL-GEN0161-CARNOT-EFFICIENCY': {
    id: 'TMPL-GEN0161-CARNOT-EFFICIENCY',
    familyId: 'FAM-GEN0161-CARNOT-EFFICIENCY',
    courseId: 'COURSE-GEN0161',
    primarySkillId: 'SKILL-GEN0161-006',
    name: 'Carnot Heat Engine Thermal Efficiency Calculation',
    description: 'Calculate theoretical max efficiency eta = 1 - T_L / T_H.',
    parameterSchema: [
      { name: 'th', type: 'INTEGER', min: 500, max: 900, description: 'Source temperature in Kelvin' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const th = params?.th ?? 600;
      const tl = 300;
      const efficiencyPercent = Math.round((1 - tl / th) * 100); // 50%

      const rawAst = constant(efficiencyPercent);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Carnot thermal efficiency formula: eta_th = 1 - T_L / T_H.', pedagogicalRationale: 'Carnot theorem.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `eta_th = 1 - (${tl} / ${th}) = 1 - 0.50 = 0.50 (50%).`, pedagogicalRationale: 'Efficiency evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Use Carnot efficiency formula: eta = 1 - (T_sink / T_source). Temperatures must be in Kelvin.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `eta = 1 - (${tl} / ${th}).`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `eta = ${efficiencyPercent}%.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${efficiencyPercent}%`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${efficiencyPercent}%`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A reversible Carnot heat engine operates between a thermal source at ${th} K and a low-temperature sink at ${tl} K. Compute the maximum theoretical thermal efficiency (%):`,
          expressionLatex: `\\eta_{\\text{th}} = 1 - \\frac{T_{L}}{T_{H}}`,
          targetVariable: '\\eta_{\\text{th}}',
          independentVariable: 'T',
          physicalUnits: '%'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 1, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `GEN0161:CARNOT:TH${th}`
      };
    }
  },

  'TMPL-GEN0161-IDEAL-GAS-ENTROPY': {
    id: 'TMPL-GEN0161-IDEAL-GAS-ENTROPY',
    familyId: 'FAM-GEN0161-IDEAL-GAS-ENTROPY',
    courseId: 'COURSE-GEN0161',
    primarySkillId: 'SKILL-GEN0161-006',
    name: 'Isothermal Ideal Gas Specific Entropy Change Calculation',
    description: 'Calculate Delta s = R * ln(V2 / V1).',
    parameterSchema: [
      { name: 'ratio', type: 'INTEGER', min: 2, max: 4, description: 'Volume expansion ratio' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const ratio = params?.ratio ?? 2;
      const rAir = 0.287; // kJ/kg*K
      const deltaS = parseFloat((rAir * Math.log(ratio)).toFixed(3)); // 0.287 * 0.693 = 0.199

      const rawAst = constant(deltaS);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'For isothermal process (T1=T2), ideal gas entropy change reduces to Delta s = R * ln(V2 / V1).', pedagogicalRationale: 'T-ds equation.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Delta s = 0.287 kJ/kg*K * ln(${ratio}) = ${deltaS} kJ/kg*K.`, pedagogicalRationale: 'Evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'For an isothermal expansion of an ideal gas, Delta s = R * ln(V2 / V1).', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Delta s = 0.287 * ln(${ratio}).`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `Delta s = ${deltaS} kJ/kg*K.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${deltaS} kJ/kg*K`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${deltaS} kJ/kg*K`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `Air (ideal gas constant R = 0.287 kJ/kg*K) undergoes an isothermal expansion doubling its volume (V2/V1 = ${ratio}). Compute the specific entropy change Delta s in kJ/kg*K:`,
          expressionLatex: `\\Delta s = R \\ln\\left(\\frac{V_{2}}{V_{1}}\\right)`,
          targetVariable: '\\Delta s',
          independentVariable: 'V',
          physicalUnits: 'kJ/kg*K'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 3, procedural: 2, computational: 2, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `GEN0161:ENTROPY:RATIO${ratio}`
      };
    }
  },

  // =========================================================================
  // COURSE: BSIE 3219 (IE Special Topics 1)
  // =========================================================================
  'TMPL-BSIE3219-COMPOUND-INTEREST': {
    id: 'TMPL-BSIE3219-COMPOUND-INTEREST',
    familyId: 'FAM-BSIE3219-COMPOUND-INTEREST',
    courseId: 'COURSE-BSIE3219',
    primarySkillId: 'SKILL-BSIE3219-006',
    name: 'Engineering Economy Single-Payment Compound Future Worth',
    description: 'Calculate Future Worth F = P(1+i)^n.',
    parameterSchema: [
      { name: 'p', type: 'INTEGER', min: 1000, max: 10000, description: 'Principal amount in USD' },
      { name: 'n', type: 'INTEGER', min: 2, max: 5, description: 'Investment period in years' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const p = params?.p ?? 5000;
      const rate = 0.10; // 10%
      const n = params?.n ?? 2;
      const futureWorth = Math.round(p * Math.pow(1 + rate, n)); // 5000 * 1.21 = 6050

      const rawAst = constant(futureWorth);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Single payment compound interest formula: F = P * (1 + i)^n.', pedagogicalRationale: 'Time value of money.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `F = ${p} * (1 + 0.10)^${n} = ${p} * ${Math.pow(1.10, n).toFixed(2)} = $${futureWorth}.`, pedagogicalRationale: 'Future worth computation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Use the compound interest formula F = P(1 + i)^n.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `P = ${p}, i = 0.10, n = ${n}.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: `(1.10)^${n} = ${Math.pow(1.10, n).toFixed(2)}.`, revealsFinalAnswer: false },
        { level: 4, category: 'GUIDED_CALCULATION', text: `F = ${p} * ${Math.pow(1.10, n).toFixed(2)} = $${futureWorth}.`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `$${futureWorth}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `An engineering investment of $${p} earns compound interest at an annual rate of 10% compounded annually. Calculate the Future Worth (F) after ${n} years in dollars:`,
          expressionLatex: `F = P(1 + i)^{n}`,
          targetVariable: 'F',
          independentVariable: 'P',
          physicalUnits: 'USD'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 2, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `BSIE3219:COMPOUND:P${p}_N${n}`
      };
    }
  },

  'TMPL-BSIE3219-UNIFORM-ANNUITY': {
    id: 'TMPL-BSIE3219-UNIFORM-ANNUITY',
    familyId: 'FAM-BSIE3219-UNIFORM-ANNUITY',
    courseId: 'COURSE-BSIE3219',
    primarySkillId: 'SKILL-BSIE3219-007',
    name: 'Uniform Series Annuity Present Worth Calculation (P/A)',
    description: 'Calculate Present Worth P = A * [((1+i)^n - 1) / (i*(1+i)^n)].',
    parameterSchema: [
      { name: 'a', type: 'INTEGER', min: 1000, max: 5000, description: 'Annual annuity in USD' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const a = params?.a ?? 2000;
      const i = 0.10;
      const n = 3;
      // factor = (1.10^3 - 1) / (0.10 * 1.10^3) = (1.331 - 1) / 0.1331 = 0.331 / 0.1331 = 2.48685
      const factor = (Math.pow(1 + i, n) - 1) / (i * Math.pow(1 + i, n));
      const presentWorth = Math.round(a * factor); // 2000 * 2.48685 = 4974

      const rawAst = constant(presentWorth);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Uniform series present worth factor (P/A, i, n): P = A * [((1+i)^n - 1) / (i*(1+i)^n)].', pedagogicalRationale: 'Annuity formula.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `P = ${a} * ${factor.toFixed(4)} = $${presentWorth}.`, pedagogicalRationale: 'Evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Use the (P/A, i%, n) factor formula: P = A * [((1+i)^n - 1) / (i(1+i)^n)].', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Factor for i=10%, n=3 is approximately 2.4869.`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `P = ${a} * 2.4869 = $${presentWorth}.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `$${presentWorth}`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `$${presentWorth}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `An engineering project yields uniform annual savings of $${a} at the end of each year for ${n} years. With an interest rate of 10% compounded annually, calculate the Present Worth (P) in dollars:`,
          expressionLatex: `P = A\\left[\\frac{(1 + i)^{n} - 1}{i(1 + i)^{n}}\\right]`,
          targetVariable: 'P',
          independentVariable: 'A',
          physicalUnits: 'USD'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 3, computational: 2, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `BSIE3219:ANNUITY:A${a}`
      };
    }
  },

  'TMPL-BSIE3219-DEPRECIATION-SCHEDULE': {
    id: 'TMPL-BSIE3219-DEPRECIATION-SCHEDULE',
    familyId: 'FAM-BSIE3219-DEPRECIATION-SCHEDULE',
    courseId: 'COURSE-BSIE3219',
    primarySkillId: 'SKILL-BSIE3219-008',
    name: 'Straight-Line Annual Asset Depreciation Calculation',
    description: 'Calculate annual depreciation D = (Cost - Salvage) / Useful_Life.',
    parameterSchema: [
      { name: 'cost', type: 'INTEGER', min: 20000, max: 100000, description: 'Initial asset cost in USD' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const cost = params?.cost ?? 50000;
      const salvage = 10000;
      const lifeYears = 5;
      const annualDepreciation = (cost - salvage) / lifeYears; // 8000

      const rawAst = constant(annualDepreciation);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Straight-line depreciation formula: D = (Initial Cost - Salvage Value) / Useful Life.', pedagogicalRationale: 'Depreciation definition.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `D = ($${cost} - $${salvage}) / ${lifeYears} = $40,000 / 5 = $${annualDepreciation}/year.`, pedagogicalRationale: 'Evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Straight-Line Depreciation D = (C - S) / N.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `D = (${cost} - ${salvage}) / ${lifeYears}.`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `D = $${annualDepreciation}/year.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `$${annualDepreciation}`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `$${annualDepreciation}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A manufacturing robot has an initial cost of $${cost}, a salvage value of $${salvage}, and a useful life of ${lifeYears} years. Calculate the annual straight-line depreciation charge in dollars/year:`,
          expressionLatex: `D = \\frac{C - S}{N}`,
          targetVariable: 'D',
          independentVariable: 'C',
          physicalUnits: 'USD/year'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 1, reasoning: 1, representation: 1, context: 3, multiStep: 1 },
        structureSignature: `BSIE3219:DEPRECIATION:C${cost}`
      };
    }
  },

  'TMPL-BSIE3219-BENEFIT-COST-ANALYSIS': {
    id: 'TMPL-BSIE3219-BENEFIT-COST-ANALYSIS',
    familyId: 'FAM-BSIE3219-BENEFIT-COST-ANALYSIS',
    courseId: 'COURSE-BSIE3219',
    primarySkillId: 'SKILL-BSIE3219-009',
    name: 'Benefit-Cost Ratio Project Feasibility Evaluation',
    description: 'Calculate B/C ratio and evaluate project economic viability.',
    parameterSchema: [
      { name: 'benefits', type: 'INTEGER', min: 50000, max: 200000, description: 'Present worth of benefits in USD' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const pvBenefits = params?.benefits ?? 150000;
      const pvCosts = 100000;
      const bcRatio = pvBenefits / pvCosts; // 1.50
      const rawAst = constant(bcRatio);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Benefit-Cost ratio definition: B/C = PV(Benefits) / PV(Costs).', pedagogicalRationale: 'B/C ratio formula.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `B/C = ${pvBenefits} / ${pvCosts} = ${bcRatio.toFixed(2)}. Since B/C >= 1.0, the project is economically justified.`, pedagogicalRationale: 'Decision rule.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'B/C ratio = Present Worth of Benefits / Present Worth of Costs.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `B/C = ${pvBenefits} / 100,000 = ${bcRatio.toFixed(2)}.`, revealsFinalAnswer: false },
        { level: 3, category: 'FORMULA', text: 'A project is economically viable if B/C >= 1.0.', revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `B/C = ${bcRatio.toFixed(2)} (Economically Justified).`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${bcRatio.toFixed(2)}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A public works engineering project has a Present Worth of Benefits of $${pvBenefits} and a Present Worth of Costs of $100,000. Calculate the Benefit-Cost (B/C) ratio:`,
          expressionLatex: `B/C = \\frac{\\text{PW}(\\text{Benefits})}{\\text{PW}(\\text{Costs})}`,
          targetVariable: 'B/C',
          independentVariable: 'B'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 1, reasoning: 3, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `BSIE3219:BC_RATIO:B${pvBenefits}`
      };
    }
  },

  'TMPL-BSIE3219-LINEAR-PROGRAMMING': {
    id: 'TMPL-BSIE3219-LINEAR-PROGRAMMING',
    familyId: 'FAM-BSIE3219-LINEAR-PROGRAMMING',
    courseId: 'COURSE-BSIE3219',
    primarySkillId: 'SKILL-BSIE3219-006',
    name: 'Linear Programming Two-Variable Profit Maximization Formulation',
    description: 'Formulate objective Z = 50*x1 + 40*x2 and resource constraints.',
    parameterSchema: [
      { name: 'p1', type: 'INTEGER', min: 30, max: 80, description: 'Unit profit on product 1' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const p1 = params?.p1 ?? 50;
      const rawAst = constant(p1);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Objective function formulation: Maximize Total Profit Z = (Profit_1 * x1) + (Profit_2 * x2).', pedagogicalRationale: 'LP objective formulation.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Z = ${p1}x_1 + 40x_2 subject to resource constraints: 2x_1 + x_2 <= 100 (Labor), x_1 + 2x_2 <= 80 (Material), x_1, x_2 >= 0.`, pedagogicalRationale: 'Constraint setup.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Total profit is the sum of profits from both products: Z = c1*x1 + c2*x2.', revealsFinalAnswer: false },
        { level: 2, category: 'FORMULA', text: `Max Z = ${p1}x_1 + 40x_2.`, revealsFinalAnswer: true },
        { level: 3, category: 'GUIDED_CALCULATION', text: `\\max Z = ${p1}x_{1} + 40x_{2}`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `\\max Z = ${p1}x_{1} + 40x_{2}`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `\\max Z = ${p1}x_{1} + 40x_{2}`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A factory manufactures product 1 (profit $${p1}/unit) and product 2 (profit $40/unit). Formulate the linear programming objective function (Z) to maximize profit:`,
          expressionLatex: `\\max Z = ${p1}x_{1} + 40x_{2}`,
          targetVariable: 'Z',
          independentVariable: 'x_1'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 3, procedural: 2, computational: 1, reasoning: 3, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `BSIE3219:LP:P1_${p1}`
      };
    }
  },

  'TMPL-BSIE3219-CPM-PERT-NETWORK': {
    id: 'TMPL-BSIE3219-CPM-PERT-NETWORK',
    familyId: 'FAM-BSIE3219-CPM-PERT-NETWORK',
    courseId: 'COURSE-BSIE3219',
    primarySkillId: 'SKILL-BSIE3219-007',
    name: 'Critical Path Method Sequential Duration Summation',
    description: 'Calculate critical path total project completion duration.',
    parameterSchema: [
      { name: 'durB', type: 'INTEGER', min: 4, max: 10, description: 'Duration of critical activity B in days' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const durA = 4;
      const durB = params?.durB ?? 6;
      const durC = 3;
      const totalDays = durA + durB + durC; // 13 days

      const rawAst = constant(totalDays);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Critical path is the longest sequence of dependent activities without slack: Path A -> B -> C.', pedagogicalRationale: 'CPM identification.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `Total Duration = ${durA} + ${durB} + ${durC} = ${totalDays} days.`, pedagogicalRationale: 'Duration summation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Sum the durations of all sequential activities on the critical path.', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `Duration = ${durA} + ${durB} + ${durC} days.`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `${totalDays} days`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${totalDays} days`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${totalDays} days`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `A construction project consists of three strictly sequential critical activities: Activity A (${durA} days), Activity B (${durB} days), and Activity C (${durC} days). Find the total critical path project duration in days:`,
          expressionLatex: `T_{\\text{crit}} = T_{A} + T_{B} + T_{C}`,
          targetVariable: 'T_{\\text{crit}}',
          independentVariable: 'T',
          physicalUnits: 'days'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 1, reasoning: 2, representation: 1, context: 3, multiStep: 1 },
        structureSignature: `BSIE3219:CPM:B${durB}`
      };
    }
  },

  'TMPL-BSIE3219-EOQ-INVENTORY': {
    id: 'TMPL-BSIE3219-EOQ-INVENTORY',
    familyId: 'FAM-BSIE3219-EOQ-INVENTORY',
    courseId: 'COURSE-BSIE3219',
    primarySkillId: 'SKILL-BSIE3219-009',
    name: 'Economic Order Quantity Optimal Order Size Calculation',
    description: 'Calculate EOQ = sqrt(2*D*S / H).',
    parameterSchema: [
      { name: 'demand', type: 'INTEGER', min: 5000, max: 20000, description: 'Annual demand units' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const d = params?.demand ?? 10000;
      const s = 50; // setup cost ($/order)
      const h = 4;  // holding cost ($/unit/year)
      const eoq = Math.round(Math.sqrt((2 * d * s) / h)); // sqrt(1000000 / 4) = sqrt(250000) = 500 units

      const rawAst = constant(eoq);

      const reasoningTrace: StructuredReasoningTraceStep[] = [
        { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Classic Ford W. Harris EOQ formula: EOQ = sqrt(2 * D * S / H).', pedagogicalRationale: 'EOQ model.' },
        { stepIndex: 2, phase: 'EXECUTION', actionDescription: `EOQ = sqrt((2 * ${d} * 50) / 4) = sqrt(${2 * d * s / h}) = ${eoq} units.`, pedagogicalRationale: 'Evaluation.' }
      ];

      const hints: StructuredHint[] = [
        { level: 1, category: 'RECOGNITION', text: 'Use the EOQ formula: EOQ = sqrt(2*D*S / H).', revealsFinalAnswer: false },
        { level: 2, category: 'SETUP', text: `EOQ = sqrt(2 * ${d} * 50 / 4).`, revealsFinalAnswer: false },
        { level: 3, category: 'GUIDED_CALCULATION', text: `EOQ = ${eoq} units.`, revealsFinalAnswer: true },
        { level: 4, category: 'GUIDED_CALCULATION', text: `${eoq} units`, revealsFinalAnswer: true },
        { level: 5, category: 'GUIDED_CALCULATION', text: `${eoq} units`, revealsFinalAnswer: true }
      ];

      return {
        statement: {
          promptText: `An industrial supply warehouse has an annual demand of ${d} units, an ordering cost of $50 per order, and an annual holding cost of $4 per unit per year. Calculate the Economic Order Quantity (EOQ) in units:`,
          expressionLatex: `\\text{EOQ} = \\sqrt{\\frac{2DS}{H}}`,
          targetVariable: '\\text{EOQ}',
          independentVariable: 'D',
          physicalUnits: 'units'
        },
        rawExpression: rawAst,
        reasoningTrace,
        hints,
        difficultyVector: { overall: 2, conceptual: 2, procedural: 2, computational: 2, reasoning: 2, representation: 1, context: 3, multiStep: 2 },
        structureSignature: `BSIE3219:EOQ:D${d}`
      };
    }
  }
};

// Register the companion template for each coverage family after the
// hand-authored registry is constructed. This lets the normal generator and
// ProblemBank seeding path treat coverage items exactly like any other family.
for (const family of Object.values(PROBLEM_FAMILIES_REGISTRY)) {
  if (!family.id.endsWith('-COVERAGE')) continue;
  const skill = curriculumRegistry.getSkillById(family.primarySkillId);
  if (!skill) continue;
  const template = createFallbackTemplate(skill, family);
  PROBLEM_TEMPLATES_REGISTRY[template.id] = template;
}
