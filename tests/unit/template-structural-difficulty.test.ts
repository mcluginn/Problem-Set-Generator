import { describe, it, expect } from 'vitest';
import { PROBLEM_TEMPLATES_REGISTRY } from '../../src/engine/content/problemTemplates';

describe('Structural Difficulty Progression Across Templates', () => {
  const testTemplateProgression = (templateId: string) => {
    const template = PROBLEM_TEMPLATES_REGISTRY[templateId];
    expect(template).toBeDefined();

    const c1 = template.generateCandidate(1);
    const c2 = template.generateCandidate(2);
    const c3 = template.generateCandidate(3);
    const c4 = template.generateCandidate(4);

    const expr1 = c1.statement.expressionLatex;
    const expr2 = c2.statement.expressionLatex;
    const expr3 = c3.statement.expressionLatex;
    const expr4 = c4.statement.expressionLatex;

    // Expressions across difficulty levels must not be identical
    expect(expr1).not.toBe(expr2);
    expect(expr2).not.toBe(expr3);
    expect(expr3).not.toBe(expr4);

    // Canonical answers must exist and not be blank
    const ans1 = (c1 as any).canonicalAnswerLatex || c1.reasoningTrace?.[c1.reasoningTrace.length - 1]?.intermediateExpressionLatex;
    const ans2 = (c2 as any).canonicalAnswerLatex || c2.reasoningTrace?.[c2.reasoningTrace.length - 1]?.intermediateExpressionLatex;
    const ans3 = (c3 as any).canonicalAnswerLatex || c3.reasoningTrace?.[c3.reasoningTrace.length - 1]?.intermediateExpressionLatex;
    const ans4 = (c4 as any).canonicalAnswerLatex || c4.reasoningTrace?.[c4.reasoningTrace.length - 1]?.intermediateExpressionLatex;

    expect(ans1).toBeTruthy();
    expect(ans2).toBeTruthy();
    expect(ans3).toBeTruthy();
    expect(ans4).toBeTruthy();

    // Signatures must differentiate difficulty
    expect(c1.structureSignature).not.toBe(c2.structureSignature);
    expect(c2.structureSignature).not.toBe(c3.structureSignature);
    expect(c3.structureSignature).not.toBe(c4.structureSignature);
  };

  describe('Calculus 1 (COURSE-GEN0102)', () => {
    it('scales TMPL-LIMIT-POLY-CANCEL structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-LIMIT-POLY-CANCEL');
    });

    it('scales TMPL-CHAIN-POLY-STD structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-CHAIN-POLY-STD');
    });

    it('scales TMPL-CHAIN-POWER-POLYNOMIAL structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-CHAIN-POWER-POLYNOMIAL');
    });

    it('scales TMPL-CHAIN-TRIG-POLY structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-CHAIN-TRIG-POLY');
    });

    it('scales TMPL-GEN0102-TRIG-CIRCULAR structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-TRIG-CIRCULAR');
    });

    it('scales TMPL-GEN0102-EXP-LOG structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-EXP-LOG');
    });

    it('scales TMPL-GEN0102-IMPLICIT-DIFF structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-IMPLICIT-DIFF');
    });

    it('scales TMPL-GEN0102-HIGHER-ORDER structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-HIGHER-ORDER');
    });

    it('scales TMPL-GEN0102-PARTIAL-DERIV structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-PARTIAL-DERIV');
    });

    it('scales TMPL-GEN0102-RELATED-RATES structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-RELATED-RATES');
    });

    it('scales TMPL-TANGENT-LINE-STD structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-TANGENT-LINE-STD');
    });

    it('scales TMPL-GEN0102-CURVE-SKETCH structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-CURVE-SKETCH');
    });

    it('scales TMPL-GEN0102-OPTIMIZATION structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-OPTIMIZATION');
    });

    it('scales TMPL-GEN0102-DIFFERENTIALS structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0102-DIFFERENTIALS');
    });
  });

  describe('Mathematics for Engineers (COURSE-GEN0101)', () => {
    it('scales TMPL-GEN0101-OPERATIONS-STD structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0101-OPERATIONS-STD');
    });

    it('scales TMPL-GEN0101-VARIATION-APP structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0101-VARIATION-APP');
    });

    it('scales TMPL-GEN0101-QUADRATIC-ROOTS structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0101-QUADRATIC-ROOTS');
    });

    it('scales TMPL-GEN0101-RADICAL-SIMPLIFY structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0101-RADICAL-SIMPLIFY');
    });

    it('scales TMPL-GEN0101-LINEAR-SYSTEMS structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0101-LINEAR-SYSTEMS');
    });

    it('scales TMPL-GEN0101-TRIG-TRIANGLE structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0101-TRIG-TRIANGLE');
    });

    it('scales TMPL-GEN0101-PARTIAL-FRACTIONS structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0101-PARTIAL-FRACTIONS');
    });

    it('scales TMPL-GEN0101-WORD-PROBLEMS structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0101-WORD-PROBLEMS');
    });
  });

  describe('Differential Equations (COURSE-GEN0107)', () => {
    it('scales TMPL-GEN0107-SEPARABLE-STD structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0107-SEPARABLE-STD');
    });

    it('scales TMPL-GEN0107-LINEAR-1ST-IF structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0107-LINEAR-1ST-IF');
    });

    it('scales TMPL-GEN0107-EXACT-ODE structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0107-EXACT-ODE');
    });

    it('scales TMPL-GEN0107-2ND-ORDER-HOMO structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0107-2ND-ORDER-HOMO');
    });

    it('scales TMPL-GEN0107-LAPLACE-TRANSFORM structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0107-LAPLACE-TRANSFORM');
    });

    it('scales TMPL-GEN0107-IVP-FIRST-ORDER structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0107-IVP-FIRST-ORDER');
    });
  });

  describe('Physics 2 (COURSE-GEN0110)', () => {
    it('scales TMPL-GEN0110-DC-CIRCUITS-OHM structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0110-DC-CIRCUITS-OHM');
    });

    it('scales TMPL-GEN0110-COULOMB-FORCE structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0110-COULOMB-FORCE');
    });

    it('scales TMPL-GEN0110-BUOYANCY-ARCHIMEDES structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0110-BUOYANCY-ARCHIMEDES');
    });

    it('scales TMPL-GEN0110-HEAT-CONDUCTION structurally across levels 1-4', () => {
      testTemplateProgression('TMPL-GEN0110-HEAT-CONDUCTION');
    });
  });
});
