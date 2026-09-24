/**
 * Multi-Course Content Registry Unit Test Suite
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import { describe, it, expect } from 'vitest';
import { ContentRegistry } from '@/engine/content/registry';

describe('Multi-Course Content Registry Query API (Phase 4)', () => {
  const registry = ContentRegistry.getInstance();

  it('retrieves problem families by courseId across all 6 courses', () => {
    const mathFamilies = registry.getFamiliesByCourse('COURSE-GEN0101');
    const calcFamilies = registry.getFamiliesByCourse('COURSE-GEN0102');
    const odeFamilies = registry.getFamiliesByCourse('COURSE-GEN0107');
    const physicsFamilies = registry.getFamiliesByCourse('COURSE-GEN0110');
    const thermoFamilies = registry.getFamiliesByCourse('COURSE-GEN0161');
    const ieFamilies = registry.getFamiliesByCourse('COURSE-BSIE3219');

    expect(mathFamilies.length).toBeGreaterThan(0);
    expect(calcFamilies.length).toBeGreaterThan(0);
    expect(odeFamilies.length).toBeGreaterThan(0);
    expect(physicsFamilies.length).toBeGreaterThan(0);
    expect(thermoFamilies.length).toBeGreaterThan(0);
    expect(ieFamilies.length).toBeGreaterThan(0);
  });

  it('retrieves evidence mapping and templates by skill ID', () => {
    const evidence = registry.getEvidenceBySkill('SKILL-GEN0161-002');
    expect(evidence).toBeDefined();
    expect(evidence?.primaryEvidence.id).toBe('TABLE_INTERPRETATION');

    const families = registry.getFamiliesBySkill('SKILL-GEN0161-002');
    expect(families.length).toBeGreaterThan(0);

    const templates = registry.getTemplatesByFamily(families[0].id);
    expect(templates.length).toBeGreaterThan(0);
  });

  it('generates a complete six-course content readiness summary', () => {
    const summary = registry.getCourseReadinessSummary();
    expect(summary.length).toBe(6);

    const calc1 = summary.find(s => s.courseCode === 'GEN 0102')!;
    expect(calc1.status).toBe('PILOT');
    expect(calc1.statusLabel).toContain('Active Pilot');

    const thermo = summary.find(s => s.courseCode === 'GEN 0161')!;
    expect(['ARCHITECTURE_READY', 'REPRESENTATIVE_READY']).toContain(thermo.status);
    expect(thermo.totalSkills).toBe(8);
    expect(thermo.mappedEvidenceCount).toBe(8);
  });
});
