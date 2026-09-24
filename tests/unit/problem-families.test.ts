/**
 * Problem Families Registry Tests
 * Engineering Practice Engine — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { PROBLEM_FAMILIES_REGISTRY } from '@/engine/content/problemFamilies';
import { CurriculumRegistry } from '@/engine/curriculum/registry';

describe('Problem Families Registry & Pedagogical Integrity', () => {
  const currRegistry = CurriculumRegistry.getInstance();

  it('verifies that every registered problem family links to an authoritative skill', () => {
    const families = Object.values(PROBLEM_FAMILIES_REGISTRY);
    expect(families.length).toBeGreaterThanOrEqual(15);

    for (const family of families) {
      expect(family.id).toBeDefined();
      expect(family.name.length).toBeGreaterThan(5);
      expect(family.description.length).toBeGreaterThan(15);
      expect(family.purpose.length).toBeGreaterThan(15);
      expect(family.templateIds.length).toBeGreaterThan(0);

      // Verify skill exists in Curriculum Registry
      const primarySkill = currRegistry.getSkillById(family.primarySkillId);
      expect(primarySkill).toBeDefined();
      expect(primarySkill?.id).toBe(family.primarySkillId);
    }
  });

  it('contains dedicated diverse problem families for Chain Rule vertical slice (SKILL-GEN0102-005)', () => {
    const chainFamilies = Object.values(PROBLEM_FAMILIES_REGISTRY).filter(
      f => f.primarySkillId === 'SKILL-GEN0102-005'
    );

    expect(chainFamilies.length).toBeGreaterThanOrEqual(4);

    const familyIds = chainFamilies.map(f => f.id);
    expect(familyIds).toContain('FAM-GEN0102-CHAIN-POLY');
    expect(familyIds).toContain('FAM-GEN0102-CHAIN-TRIG');
    expect(familyIds).toContain('FAM-GEN0102-CHAIN-ERROR');
    expect(familyIds).toContain('FAM-GEN0102-CHAIN-APP');

    // Error analysis family must have ERROR_ANALYSIS primary evidence
    const errorFamily = PROBLEM_FAMILIES_REGISTRY['FAM-GEN0102-CHAIN-ERROR'];
    expect(errorFamily.primaryEvidenceType).toBe('ERROR_ANALYSIS');
    expect(errorFamily.misconceptionTargets).toContain('MISSING_INNER_DERIVATIVE');

    // Kinematics family must have APPLICATION primary evidence and PHYSICAL representation
    const appFamily = PROBLEM_FAMILIES_REGISTRY['FAM-GEN0102-CHAIN-APP'];
    expect(appFamily.primaryEvidenceType).toBe('APPLICATION');
    expect(appFamily.representationTypes).toContain('PHYSICAL');
  });
});
