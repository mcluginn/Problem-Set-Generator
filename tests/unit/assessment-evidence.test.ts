/**
 * Assessment Evidence Registry Tests
 * Engineering Practice Engine — Phase 3
 */

import { describe, it, expect } from 'vitest';
import { ASSESSMENT_EVIDENCE_REGISTRY, CALCULUS_SKILL_EVIDENCE_MAP } from '@/engine/content/assessmentEvidence';
import { AssessmentEvidenceTypeId } from '@/engine/content/types';

describe('Assessment Evidence Taxonomy & Registry', () => {
  it('defines all 12 core assessment evidence types with complete metadata', () => {
    const requiredEvidenceTypes: AssessmentEvidenceTypeId[] = [
      'DIRECT_CALCULATION',
      'METHOD_RECOGNITION',
      'MULTI_STEP_SOLUTION',
      'ERROR_ANALYSIS',
      'APPLICATION',
      'INTERPRETATION',
      'EXPLANATION',
      'GRAPH_READING',
      'UNIT_ANALYSIS',
      'MODELING',
      'CLASSIFICATION',
      'COMPARISON'
    ];

    expect(Object.keys(ASSESSMENT_EVIDENCE_REGISTRY).length).toBeGreaterThanOrEqual(12);

    for (const typeId of requiredEvidenceTypes) {
      const def = ASSESSMENT_EVIDENCE_REGISTRY[typeId];
      expect(def).toBeDefined();
      expect(def.id).toBe(typeId);
      expect(def.name.length).toBeGreaterThan(3);
      expect(def.description.length).toBeGreaterThan(15);
      expect(def.observableStudentBehavior.length).toBeGreaterThan(15);
      expect(def.suitableSkillTypes.length).toBeGreaterThan(0);
      expect(def.supportedQuestionFormats.length).toBeGreaterThan(0);
      expect(def.samplePromptFraming.length).toBeGreaterThan(5);
    }
  });

  it('maps all 15 Calculus 1 skills to primary and secondary evidence types', () => {
    const calculusSkills = [
      'SKILL-GEN0102-001', 'SKILL-GEN0102-002', 'SKILL-GEN0102-003', 'SKILL-GEN0102-004',
      'SKILL-GEN0102-005', 'SKILL-GEN0102-006', 'SKILL-GEN0102-007', 'SKILL-GEN0102-008',
      'SKILL-GEN0102-009', 'SKILL-GEN0102-010', 'SKILL-GEN0102-011', 'SKILL-GEN0102-012',
      'SKILL-GEN0102-013', 'SKILL-GEN0102-014', 'SKILL-GEN0102-015'
    ];

    expect(Object.keys(CALCULUS_SKILL_EVIDENCE_MAP).length).toBe(15);

    for (const skillId of calculusSkills) {
      const mapping = CALCULUS_SKILL_EVIDENCE_MAP[skillId];
      expect(mapping).toBeDefined();
      expect(ASSESSMENT_EVIDENCE_REGISTRY[mapping.primaryEvidence]).toBeDefined();
      expect(mapping.secondaryEvidence.length).toBeGreaterThan(0);
    }
  });

  it('accurately differentiates procedural calculation from geometric/engineering modeling', () => {
    // Chain Rule (SKILL-GEN0102-005) primary evidence is DIRECT_CALCULATION
    expect(CALCULUS_SKILL_EVIDENCE_MAP['SKILL-GEN0102-005'].primaryEvidence).toBe('DIRECT_CALCULATION');

    // Tangent lines (SKILL-GEN0102-012) primary evidence is APPLICATION
    expect(CALCULUS_SKILL_EVIDENCE_MAP['SKILL-GEN0102-012'].primaryEvidence).toBe('APPLICATION');

    // Optimization (SKILL-GEN0102-014) and Related Rates (015) primary evidence is MODELING
    expect(CALCULUS_SKILL_EVIDENCE_MAP['SKILL-GEN0102-014'].primaryEvidence).toBe('MODELING');
    expect(CALCULUS_SKILL_EVIDENCE_MAP['SKILL-GEN0102-015'].primaryEvidence).toBe('MODELING');
  });
});
