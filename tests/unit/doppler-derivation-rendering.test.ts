import { describe, it, expect } from 'vitest';
import { MathNormalizer } from '../../src/lib/math/mathNormalizer';
import { ProblemBank } from '../../src/engine/content/problemBank';
import katex from 'katex';

describe('Doppler Derivation Steps Normalization and Rendering', () => {
  const steps = [
    "Two-stage Doppler shift derivation:",
    "Stage 1 (fluid cell acts as moving observer):",
    "Effective velocity component along sound beam is v_parallel = v_flow * cos(theta).",
    "Frequency received by moving fluid cell: f_cell = f0 * [ (c + v_flow*cos theta) / c ].",
    "Stage 2 (fluid cell acts as moving source re-emitting back to stationary transducer):",
    "Frequency received at transducer: f_rec = f_cell * [ c / (c - v_flow*cos theta) ] = f0 * [ (c + v_flow*cos theta) / (c - v_flow*cos theta) ].",
    "Since flow velocity v_flow << c (typically < 2 m/s vs 1540 m/s):",
    "f_rec ~= f0 * [ 1 + (v_flow*cos theta)/c ] * [ 1 + (v_flow*cos theta)/c ] ~= f0 * [ 1 + (2 * v_flow * cos theta) / c ].",
    "Beat frequency Delta f = f_rec - f0 = (2 * f0 * v_flow * cos theta) / c.",
    "Solve for flow velocity v_flow:",
    "v_flow = (Delta f * c) / (2 * f0 * cos theta).",
    "Substitute parameters: Delta f = 1300.0 Hz, c = 1540.0 m/s, f0 = 2.00 x 10^6 Hz, theta = 60.0 deg (cos 60 deg = 0.50):",
    "v_flow = (1300.0 * 1540.0) / (2 * 2.00e6 * 0.50) = 2,002,000 / 2,000,000 = 1.001 m/s ~= 1.00 m/s."
  ];

  it('normalizes every step into valid, parseable LaTeX without errors', () => {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const norm = MathNormalizer.normalizeStepText(step);

      // Extract all math blocks: \[ ... \] and \( ... \)
      const mathTokens = norm.match(/\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g) || [];

      for (const tok of mathTokens) {
        let isDisplay = tok.startsWith('\\[');
        let inner = isDisplay ? tok.slice(2, -2).trim() : tok.slice(2, -2).trim();

        // Must not contain unbalanced delimiters
        expect(() => {
          const rendered = katex.renderToString(inner, {
            displayMode: isDisplay,
            throwOnError: true
          });
          expect(rendered).not.toContain('#cc0000');
        }).not.toThrow();
      }

      // Plain text outside math must not contain raw LaTeX commands like \cos, \text, \frac
      const strippedMath = norm.replace(/\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, ' ');
      expect(strippedMath).not.toMatch(/\\[a-zA-Z]+/);
    }
  });

  it('verifies ProblemBank loads GEN0110-U1-DOP-L3-001 with normalized reasoning trace', () => {
    const bank = ProblemBank.getInstance();
    const problem = bank.getProblemById('GEN0110-U1-DOP-L3-003');
    expect(problem).toBeDefined();

    const trace = problem!.solution.reasoningTrace;
    expect(trace).toBeDefined();
    expect(trace.length).toBe(13);

    // Step 4 (index 3) should have normalized formula
    const step4 = trace[3].actionDescription;
    expect(step4).toContain('\\[');
    expect(step4).toContain('\\]');
    expect(step4).not.toContain('\\(v');

    // Step 6 (index 5) should have normalized formula
    const step6 = trace[5].actionDescription;
    expect(step6).toContain('\\[');
    expect(step6).toContain('\\]');

    // Step 8 (index 7) should be pure display math
    const step8 = trace[7].actionDescription;
    expect(step8).toContain('\\[');
    expect(step8).toContain('\\approx');

    // Step 13 (index 12) should have clean fractions without comma bugs
    const step13 = trace[12].actionDescription;
    expect(step13).toContain('\\frac{2002000}{2000000}');
  });
});
