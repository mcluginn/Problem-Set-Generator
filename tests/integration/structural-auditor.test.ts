import { describe, it, expect } from 'vitest';
import { StructuralAuditor } from '@/engine/content/structuralAuditor';
import masterBank780 from '@/engine/content/master_bank_780.json';
import { MasterBank780Problem } from '@/engine/content/types';

describe('StructuralAuditor Duplicate Detection & Section 39 Reporting', () => {
  const problems = masterBank780 as unknown as MasterBank780Problem[];

  it('correctly classifies identical problems as STRUCTURAL_DUPLICATE', () => {
    const p1 = problems[0];
    const result = StructuralAuditor.compareProblems(p1, p1);

    expect(result.relationship).toBe('STRUCTURAL_DUPLICATE');
    expect(result.similarityScore).toBe(1.0);
  });

  it('correctly classifies different difficulty levels within a cluster as STRUCTURAL_UNIQUE (progression)', () => {
    const l1 = problems.find(p => p.clusterId === 'GEN0102-U1-LIM' && p.difficulty === 1)!;
    const l2 = problems.find(p => p.clusterId === 'GEN0102-U1-LIM' && p.difficulty === 2)!;

    expect(l1).toBeDefined();
    expect(l2).toBeDefined();

    const result = StructuralAuditor.compareProblems(l1, l2);
    expect(result.relationship).toBe('STRUCTURAL_UNIQUE');
    expect(result.rationale).toContain('Pedagogical structural progression');
  });

  it('correctly identifies parameter variants having identical operator shape but differing coefficients', () => {
    const p1: MasterBank780Problem = {
      ...problems[0],
      id: 'TEST-P1',
      statement: 'Evaluate the derivative of f(x) = 3x^2 + 5x - 7.',
      canonicalAnswer: '6x + 5'
    };

    const p2: MasterBank780Problem = {
      ...problems[0],
      id: 'TEST-P2',
      statement: 'Evaluate the derivative of f(x) = 8x^2 + 2x - 4.',
      canonicalAnswer: '16x + 2'
    };

    const result = StructuralAuditor.compareProblems(p1, p2);
    expect(result.relationship).toBe('PARAMETER_VARIANT');
    expect(result.similarityScore).toBeGreaterThanOrEqual(0.8);
  });

  it('runs full audit across the 780 master bank and produces consistent metrics', () => {
    const metrics = StructuralAuditor.runFullAudit();

    expect(metrics.masterBank.imported).toBe(780);
    expect(metrics.masterBank.validated).toBe(780);
    expect(metrics.masterBank.rejected).toBe(0);
    expect(metrics.masterBank.active).toBe(780);

    expect(metrics.courseCoverage.totalProblems).toBe(780);
    expect(metrics.courseCoverage.totalClusters).toBe(260);

    // Exact course counts
    expect(metrics.courseCoverage.gen0102.problems).toBe(159);
    expect(metrics.courseCoverage.gen0101.problems).toBe(198);
    expect(metrics.courseCoverage.gen0110.problems).toBe(183);
    expect(metrics.courseCoverage.gen0161.problems).toBe(117);
    expect(metrics.courseCoverage.bsie3219.problems).toBe(123);

    expect(metrics.generation.existingGeneratorPreserved).toBe(true);
    expect(metrics.generation.coefficientVariationPreserved).toBe(true);
    expect(metrics.mastery.dampingImplemented).toBe(true);
  });

  it('generates the authoritative Section 39 formatted audit report text', () => {
    const report = StructuralAuditor.generateSection39Report();

    expect(report).toContain('ENGINEERING PRACTICE ENGINE — AUDIT REPORT');
    expect(report).toContain('780 MASTER BANK');
    expect(report).toContain('Imported:    780');
    expect(report).toContain('Validated:   780');
    expect(report).toContain('STRUCTURAL_UNIQUE:    780');
    expect(report).toContain('GEN0102:        159 problems (53 clusters)');
    expect(report).toContain('GEN0101:        198 problems (66 clusters)');
    expect(report).toContain('GEN0161:        117 problems (39 clusters)');
    expect(report).toContain('GEN0110/0110L:  183 problems (61 clusters)');
    expect(report).toContain('BSIE3219:       123 problems (41 clusters)');
    expect(report).toContain('TOTAL:          780 problems (260 clusters)');
    expect(report).toContain('SUCCESS: ZERO changes to Differential Equations');
  });
});
