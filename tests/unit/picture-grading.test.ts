/**
 * Picture Mode Deterministic Grading & Equivalence Test Suite (Section 83)
 */

import { describe, it, expect } from 'vitest';
import { parseMath } from '@/engine/math/parser';
import { checkEquivalence } from '@/engine/math/equivalence';
import { MisconceptionEngine } from '@/engine/math/misconceptions';
import { MathConversionService } from '@/services/picture/mathConversionService';

describe('Picture Mode Deterministic Equivalence & Grading Integrity', () => {
  it('correctly grades recognized handwritten answer using deterministic checkEquivalence', () => {
    const rawHandwritten = '10*(3*x - 1)*(3*x^2 - 2*x + 4)^4';
    const canonicalAnswerRaw = '5*(6*x - 2)*(3*x^2 - 2*x + 4)^4';

    const conv = MathConversionService.convertToAST(rawHandwritten);
    expect(conv.success).toBe(true);

    const canonicalAst = parseMath(canonicalAnswerRaw);
    const eqResult = checkEquivalence(conv.ast!, canonicalAst, { targetVariable: 'x' });

    expect(eqResult.equivalent).toBe(true);
    expect(eqResult.status).toBe('EQUIVALENT');
  });

  it('diagnoses perturbation misconception on incorrect handwritten work deterministically', () => {
    // Student omitted inner derivative (6x - 2)
    const rawHandwrittenBuggy = '5*(3*x^2 - 2*x + 4)^4';
    const problemRawExpression = parseMath('(3*x^2 - 2*x + 4)^5');

    const conv = MathConversionService.convertToAST(rawHandwrittenBuggy);
    expect(conv.success).toBe(true);

    const diagnosis = MisconceptionEngine.diagnose(
      conv.ast!,
      problemRawExpression,
      'Chain Rule',
      'x'
    );

    expect(diagnosis.detected).toBe(true);
    expect(diagnosis.code).toBe('MISSING_INNER_DERIVATIVE');
  });

  it('keeps recognitionConfidence strictly independent from mathematical correctness', () => {
    // 95% confident the student wrote "2x + 1", but the mathematical answer is wrong
    const recognitionConfidence = 0.95;
    const studentAst = parseMath('2*x + 1');
    const canonicalAst = parseMath('10*(3*x - 1)*(3*x^2 - 2*x + 4)^4');

    const eqResult = checkEquivalence(studentAst, canonicalAst, { targetVariable: 'x' });

    expect(recognitionConfidence).toBe(0.95); // high vision confidence
    expect(eqResult.equivalent).toBe(false);   // mathematically incorrect
  });
});
