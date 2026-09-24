/**
 * Multi-Distribution Generator Fuzz & Stress Validation Test Suite
 * Test A: Balanced Coverage (all 14 concepts evenly distributed)
 * Test B: Fully Randomized (concept, difficulty, representation, guidedness)
 * Test C: Adversarial Stress (edge coefficients, zero/unit terms, fractions, composite powers)
 */

import { describe, it, expect } from 'vitest';
import { ProblemGenerator } from '@/engine/generation/generator';
import { INITIAL_CURRICULUM } from '@/services/database/types';
import { parseMath } from '@/engine/math/parser';
import { diff } from '@/engine/math/differentiator';
import { simplify } from '@/engine/math/simplifier';
import { checkEquivalence } from '@/engine/math/equivalence';

describe('Multi-Distribution Generator Fuzz & Stress Validation', () => {
  const conceptNames = INITIAL_CURRICULUM.map((c) => c.name);

  // ---------------------------------------------------------------------------
  // Test A: Balanced Coverage Suite (1,400 problems: exactly 100 per concept)
  // ---------------------------------------------------------------------------
  it('Test A: Balanced Coverage generates 1,400 problems with 100% valid delivery across all 14 concepts', () => {
    const PROBLEMS_PER_CONCEPT = 100;
    const TOTAL_PROBLEMS = conceptNames.length * PROBLEMS_PER_CONCEPT; // 1,400

    let acceptedCount = 0;
    let rejectedCount = 0;
    const conceptCounts: Record<string, number> = {};

    const startTime = performance.now();

    for (const concept of conceptNames) {
      for (let i = 0; i < PROBLEMS_PER_CONCEPT; i++) {
        const diffLevel = (i % 3 === 0 ? 'Easy' : i % 3 === 1 ? 'Medium' : 'Hard');
        try {
          const problem = ProblemGenerator.generateProblem({
            concept,
            difficulty: diffLevel,
            guidednessLevel: ((i % 3) + 1) as 1 | 2 | 3,
          });

          if (problem && problem.lifecycleStatus === 'VALID') {
            acceptedCount++;
            conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;

            expect(problem.hints.length).toBe(5);
            expect(problem.solution.steps.length).toBeGreaterThanOrEqual(1);
            expect(problem.statement.expressionLatex.length).toBeGreaterThan(0);
          } else {
            rejectedCount++;
          }
        } catch (err) {
          rejectedCount++;
          console.error(`Test A crash on ${concept}:`, err);
        }
      }
    }

    const duration = performance.now() - startTime;
    console.log(`[Test A Balanced] Generated ${acceptedCount}/${TOTAL_PROBLEMS} in ${duration.toFixed(2)}ms (${(duration / TOTAL_PROBLEMS).toFixed(3)} ms/problem)`);

    expect(acceptedCount).toBe(TOTAL_PROBLEMS);
    expect(rejectedCount).toBe(0);
    expect(Object.keys(conceptCounts).length).toBe(14);
    for (const count of Object.values(conceptCounts)) {
      expect(count).toBe(PROBLEMS_PER_CONCEPT);
    }
  });

  // ---------------------------------------------------------------------------
  // Test B: Fully Randomized Fuzz Suite (2,500 problems)
  // ---------------------------------------------------------------------------
  it('Test B: Fully Randomized Fuzz generates 2,500 diverse problems with zero crashes', () => {
    const NUM_PROBLEMS = 2500;
    const difficulties: Array<'Easy' | 'Medium' | 'Hard' | 'Adaptive'> = ['Easy', 'Medium', 'Hard', 'Adaptive'];

    let acceptedCount = 0;
    let rejectedCount = 0;
    const signatures = new Set<string>();

    const startTime = performance.now();

    for (let i = 0; i < NUM_PROBLEMS; i++) {
      const randConcept = conceptNames[Math.floor(Math.random() * conceptNames.length)];
      const randDiff = difficulties[Math.floor(Math.random() * difficulties.length)];
      const randGuided = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;

      try {
        const problem = ProblemGenerator.generateProblem({
          concept: randConcept,
          difficulty: randDiff,
          guidednessLevel: randGuided,
        });

        if (problem && problem.lifecycleStatus === 'VALID') {
          acceptedCount++;
          signatures.add(problem.dna.structureSignature);

          if (problem.dna.concept !== 'Implicit Differentiation') {
            const canonicalAst = parseMath(problem.solution.canonicalAnswerRaw);
            expect(canonicalAst).toBeDefined();
          }
        } else {
          rejectedCount++;
        }
      } catch (err) {
        rejectedCount++;
      }
    }

    const duration = performance.now() - startTime;
    console.log(`[Test B Randomized] Generated ${acceptedCount}/${NUM_PROBLEMS} (unique signatures: ${signatures.size}) in ${duration.toFixed(2)}ms (${(duration / NUM_PROBLEMS).toFixed(3)} ms/problem)`);

    expect(acceptedCount).toBe(NUM_PROBLEMS);
    expect(rejectedCount).toBe(0);
    expect(signatures.size).toBeGreaterThan(50);
  });

  // ---------------------------------------------------------------------------
  // Test C: Adversarial Mathematical Edge-Case Suite (1,000 problems)
  // ---------------------------------------------------------------------------
  it('Test C: Adversarial suite verifies symbolic stability on edge-case coefficient bounds', () => {
    const ADVERSARIAL_CASES = [
      // Zero / Unit / Negative Coefficients
      '0*x + 5',
      '1*x^1',
      '-1*x^2',
      '-3*x^3 + 0*x^2 - 1',
      // Negative / Fractional Exponents
      'x^(-1)',
      'x^(-2) + 3*x^(-1)',
      'x^(1/2)',
      'x^(3/2) - x^(1/2)',
      // Rational expressions with sums
      '(x + 1) / (x - 1)',
      '1 / (x^2 + 1)',
      'x / (x^2 + 4)',
      // Trigonometric & Exponential Chains
      'sin(-x)',
      'cos(2*x) - sin(3*x)',
      'exp(-2*x)',
      'ln(x^2 + 1)',
      // Composite product/quotients
      'x^(-2) * sin(x)',
      '(x^2 - 1) / (x^2 + 1)',
    ];

    let solvedCount = 0;

    for (let i = 0; i < 1000; i++) {
      const exprStr = ADVERSARIAL_CASES[i % ADVERSARIAL_CASES.length];
      const ast = parseMath(exprStr);
      expect(ast).toBeDefined();

      const diffRes = diff(ast, 'x');
      expect(diffRes.simplifiedDerivative).toBeDefined();

      const simplifiedTwice = simplify(diffRes.simplifiedDerivative);
      expect(simplifiedTwice).toBeDefined();

      const eq = checkEquivalence(diffRes.simplifiedDerivative, simplifiedTwice, { targetVariable: 'x' });
      expect(eq.equivalent).toBe(true);

      solvedCount++;
    }

    expect(solvedCount).toBe(1000);
  });
});
