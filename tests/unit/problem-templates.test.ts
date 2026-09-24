/**
 * Problem Templates Registry & Blueprint Tests
 * Engineering Practice Engine — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { PROBLEM_TEMPLATES_REGISTRY } from '@/engine/content/problemTemplates';
import { PROBLEM_FAMILIES_REGISTRY } from '@/engine/content/problemFamilies';

describe('Problem Templates Generative Blueprint Validation', () => {
  it('verifies that every template defines a parameter schema and belongs to a family', () => {
    const templates = Object.values(PROBLEM_TEMPLATES_REGISTRY);
    expect(templates.length).toBeGreaterThanOrEqual(7);

    for (const template of templates) {
      expect(template.id).toBeDefined();
      expect(template.familyId).toBeDefined();
      expect(PROBLEM_FAMILIES_REGISTRY[template.familyId]).toBeDefined();
      expect(template.parameterSchema.length).toBeGreaterThan(0);
      for (const field of template.parameterSchema) {
        expect(field.name.length).toBeGreaterThan(0);
        expect(field.description.length).toBeGreaterThan(5);
      }
    }
  });

  it('generates valid candidates with multi-step reasoning traces and 5-tier hints', () => {
    const stdChainTemplate = PROBLEM_TEMPLATES_REGISTRY['TMPL-CHAIN-POLY-STD'];
    expect(stdChainTemplate).toBeDefined();

    for (const diff of [1, 2, 3, 4]) {
      const candidate = stdChainTemplate.generateCandidate(diff);
      expect(candidate.rawExpression).toBeDefined();
      expect(candidate.statement.expressionLatex).toContain('x');
      expect(candidate.reasoningTrace.length).toBeGreaterThanOrEqual(3);
      expect(candidate.hints.length).toBe(5);
      expect(candidate.difficultyVector.overall).toBe(diff);
      expect(candidate.structureSignature).toContain('CHAIN:OUTER=POWER');
    }
  });

  it('generates error analysis candidates targeting MISSING_INNER_DERIVATIVE with valid flawed work', () => {
    const errTemplate = PROBLEM_TEMPLATES_REGISTRY['TMPL-CHAIN-ERROR-DIAG'];
    expect(errTemplate).toBeDefined();

    const candidate = errTemplate.generateCandidate(2);
    expect(candidate.statement.givenWorkLatex).toBeDefined();
    expect(candidate.statement.options).toBeDefined();
    expect(candidate.statement.options?.length).toBeGreaterThanOrEqual(3);
    expect(candidate.misconceptionTarget).toBe('MISSING_INNER_DERIVATIVE');
  });
});
