import { describe, it, expect } from 'vitest';
import { MathParser } from '@/engine/math/parser';
import { Differentiator } from '@/engine/math/differentiator';
import { StepGenerator } from '@/engine/math/steps';
import { nodeToLatex } from '@/engine/math/ast';

import { ExpStandardFamily, LogStandardFamily } from '@/engine/generation/families/trig_exp_log';

describe('Exp and Log Advanced Differentiation', () => {
  it('differentiates exponential with quadratic argument', () => {
    const node = MathParser.parse('3 * exp(2 * x^2)');
    const res = Differentiator.differentiate(node, 'x');
    expect(res.derivative).toBeDefined();
    const latex = nodeToLatex(res.derivative);
    expect(latex).toContain('e');
  });

  it('generates solution steps for exponential with quadratic exponent', () => {
    const node = MathParser.parse('3 * exp(2 * x^2)');
    const sol = StepGenerator.generateSolution(node, 'Exponential Derivatives', 'x');
    expect(sol.canonicalAnswerLatex).toBeDefined();
    expect(sol.steps.length).toBeGreaterThan(0);
  });

  it('generates distinct structural expressions across levels 1 to 4 for ExpStandardFamily', () => {
    const p1 = ExpStandardFamily.generate(1);
    const p2 = ExpStandardFamily.generate(2);
    const p3 = ExpStandardFamily.generate(3);
    const p4 = ExpStandardFamily.generate(4);

    expect(p1.difficulty.overall).toBe(1);
    expect(p2.difficulty.overall).toBe(2);
    expect(p3.difficulty.overall).toBe(3);
    expect(p4.difficulty.overall).toBe(4);

    // Level 3 has quadratic exponent, Level 4 has product
    expect(p3.structureSignature).toContain('QUAD_EXP');
    expect(p4.structureSignature).toContain('PRODUCT');
  });

  it('generates distinct structural expressions across levels 1 to 4 for LogStandardFamily', () => {
    const p1 = LogStandardFamily.generate(1);
    const p2 = LogStandardFamily.generate(2);
    const p3 = LogStandardFamily.generate(3);
    const p4 = LogStandardFamily.generate(4);

    expect(p1.difficulty.overall).toBe(1);
    expect(p2.difficulty.overall).toBe(2);
    expect(p3.difficulty.overall).toBe(3);
    expect(p4.difficulty.overall).toBe(4);

    // Level 3 has quadratic inner, Level 4 has product
    expect(p3.structureSignature).toContain('QUAD_INNER');
    expect(p4.structureSignature).toContain('PRODUCT');
  });
});
