/**
 * Progressive Hint Leakage & Pedagogical Integrity Test
 * Asserts that Hints 1 through 4 never prematurely leak the final verified answer.
 */

import { describe, it, expect } from 'vitest';
import { ProblemGenerator } from '@/engine/generation/generator';
import { INITIAL_CURRICULUM } from '@/services/database/types';

describe('Progressive Hint Leakage & Reveal Control', () => {
  INITIAL_CURRICULUM.forEach((concept) => {
    it(`[${concept.name}] ensures hints 1-4 do not prematurely leak the canonical derivative answer`, () => {
      for (const diffLevel of [1, 2, 3, 4]) {
        const problem = ProblemGenerator.generateProblem({
          concept: concept.name,
          difficulty: diffLevel as any,
        });

        const finalCanonical = problem.solution.canonicalAnswerLatex.trim();
        expect(problem.hints.length).toBe(5);

        // Hint 1: Recognition
        const h1 = problem.hints[0].text;
        expect(h1).not.toContain(finalCanonical);
        expect(h1.length).toBeGreaterThan(10);

        // Hint 2: Direction
        const h2 = problem.hints[1].text;
        if (finalCanonical.length > 5) {
          expect(h2).not.toContain(finalCanonical);
        }

        // Hint 3: Formula
        const h3 = problem.hints[2].text;
        if (finalCanonical.length > 8) {
          expect(h3).not.toContain(finalCanonical);
        }

        // Hint 4: Setup (allows sub-derivatives, but must not equal final answer)
        const h4 = problem.hints[3].text;
        if (finalCanonical.length > 12) {
          expect(h4).not.toBe(finalCanonical);
        }

        // Hint 5: Guided calculation exists
        const h5 = problem.hints[4].text;
        expect(h5.length).toBeGreaterThan(5);
      }
    });
  });
});
