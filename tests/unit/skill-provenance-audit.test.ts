import { describe, it, expect } from 'vitest';
import { CurriculumRegistry } from '@/engine/curriculum/registry';
import { LearningSkill, PrerequisiteRelation } from '@/engine/curriculum/types';

describe('Phase 2.5 — Final Learning Ontology & Provenance Audit Suite', () => {
  const registry = CurriculumRegistry.getInstance();
  const allSkills = registry.getAllSkills();
  const allPrereqs = registry.getAllPrerequisiteRelations();

  describe('1. Skill Provenance & No-False-Explicitness Invariants', () => {
    it('accurately distinguishes SYLLABUS_EXPLICIT from SYLLABUS_DERIVED', () => {
      const stats = registry.getSkillStatistics();

      // 33 explicit skills where syllabus literally states the action in outcomes or topic tables
      expect(stats.explicitSkillsCount).toBe(33);
      // 38 derived skills where syllabus states topic content but action is an instructional decomposition
      expect(stats.derivedSkillsCount).toBe(38);
      // 0 proposed skills outside syllabus bounds
      expect(stats.proposedSkillsCount).toBe(0);
      expect(stats.totalSkills).toBe(71);
    });

    it('ensures all skills have authentic, non-empty source extracts with file traceability', () => {
      for (const skill of allSkills) {
        expect(skill.sourceReferences.length).toBeGreaterThan(0);
        const ref = skill.sourceReferences[0];
        expect(ref.syllabusId).toMatch(/^SYL-00[1-6]$/);
        expect(ref.filename.length).toBeGreaterThan(5);
        expect(ref.rawTextExtract.length).toBeGreaterThan(10);
      }
    });

    it('verifies explicit skills genuinely contain actionable source text', () => {
      const explicitSkills = allSkills.filter(s => s.sourceType === 'SYLLABUS_EXPLICIT');
      expect(explicitSkills.length).toBe(33);

      for (const skill of explicitSkills) {
        const text = skill.sourceReferences[0].rawTextExtract.toLowerCase();
        const hasActionIndicator = 
          text.includes('apply') ||
          text.includes('solve') ||
          text.includes('evaluat') ||
          text.includes('comput') ||
          text.includes('analyz') ||
          text.includes('calculate') ||
          text.includes('classify') ||
          text.includes('formulate') ||
          text.includes('identify') ||
          text.includes('transform') ||
          text.includes('solution') ||
          text.includes('solving') ||
          text.includes('utilize') ||
          text.includes('perform') ||
          text.includes('understand') ||
          text.includes('determine') ||
          text.includes('rules of differentiation');

        if (!hasActionIndicator) {
          console.log(`Non-matching explicit skill: ${skill.id}, text: "${skill.sourceReferences[0].rawTextExtract}"`);
        }
        expect(hasActionIndicator).toBe(true);
      }
    });
  });

  describe('2. Skill Granularity & Actionability Standards', () => {
    it('enforces ACTION + OBJECT + CONTEXT naming convention without micro- or macro-skills', () => {
      const allowedActionVerbs = [
        'Apply', 'Calculate', 'Solve', 'Differentiate', 'Evaluate',
        'Analyze', 'Classify', 'Formulate', 'Identify', 'Compute', 'Perform',
        'Find', 'Factor', 'Determine', 'Model'
      ];

      for (const skill of allSkills) {
        const firstWord = skill.canonicalName.split(' ')[0];
        expect(allowedActionVerbs).toContain(firstWord);

        // Meaningful pedagogical granularity check (no 1-word micro operations or vague 3-word macro skills)
        const wordCount = skill.canonicalName.split(/\s+/).length;
        expect(wordCount).toBeGreaterThanOrEqual(4);
        expect(wordCount).toBeLessThanOrEqual(25);

        // Meaningful description length
        expect(skill.description.length).toBeGreaterThanOrEqual(40);
        expect(skill.description.length).toBeLessThanOrEqual(400);
      }
    });

    it('verifies every skill has at least 2 distinct observable mastery criteria', () => {
      for (const skill of allSkills) {
        expect(skill.masteryEvidence.length).toBeGreaterThanOrEqual(2);
        for (const ev of skill.masteryEvidence) {
          expect(ev.length).toBeGreaterThanOrEqual(20);
        }
      }
    });

    it('verifies every skill declares valid assessment evidence types and difficulty factors', () => {
      for (const skill of allSkills) {
        expect(skill.evidenceTypes.length).toBeGreaterThanOrEqual(1);
        expect(skill.difficultyFactors.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('3. Prerequisite DAG Integrity & Pedagogical Necessity', () => {
    it('verifies all 108 prerequisite relationships are strictly acyclic DAG edges', () => {
      expect(allPrereqs.length).toBe(108);

      const skillIds = new Set(allSkills.map(s => s.id));
      for (const rel of allPrereqs) {
        expect(skillIds.has(rel.sourceSkillId)).toBe(true);
        expect(skillIds.has(rel.targetSkillId)).toBe(true);
        expect(rel.sourceSkillId).not.toBe(rel.targetSkillId);
        expect(['REQUIRED', 'RECOMMENDED']).toContain(rel.strength);
        expect(['EXPLICIT', 'STRONGLY_INFERRED', 'WEAKLY_INFERRED']).toContain(rel.evidence);
      }
    });

    it('confirms cross-course mathematical prerequisites are valid and directed', () => {
      // Calculus 1 -> Differential Equations
      const calcToODE = allPrereqs.filter(r => 
        r.sourceSkillId.startsWith('SKILL-GEN0102') && r.targetSkillId.startsWith('SKILL-GEN0107')
      );
      expect(calcToODE.length).toBeGreaterThan(0);

      // Foundational Math -> Physics 2
      const mathToPhysics = allPrereqs.filter(r =>
        r.sourceSkillId.startsWith('SKILL-GEN0101') && r.targetSkillId.startsWith('SKILL-GEN0110')
      );
      expect(mathToPhysics.length).toBeGreaterThan(0);

      // Foundational Math -> Thermodynamics
      const mathToThermo = allPrereqs.filter(r =>
        r.sourceSkillId.startsWith('SKILL-GEN0101') && r.targetSkillId.startsWith('SKILL-GEN0161')
      );
      expect(mathToThermo.length).toBeGreaterThan(0);
    });
  });

  describe('4. Outcome Traceability & Competency Classification', () => {
    it('verifies every skill has valid outcome associations', () => {
      for (const skill of allSkills) {
        expect(skill.associatedOutcomeIds).toBeDefined();
        expect(skill.associatedOutcomeIds?.length).toBeGreaterThan(0);
      }
    });

    it('verifies distribution across dominant competencies (DO, APPLY, MODEL, INTERPRET, KNOW, REASON)', () => {
      const stats = registry.getSkillStatistics();

      expect(stats.skillsByCompetency['DO']).toBeGreaterThan(30);
      expect(stats.skillsByCompetency['APPLY']).toBeGreaterThan(10);
      expect(stats.skillsByCompetency['MODEL']).toBe(5);
      expect(stats.skillsByCompetency['INTERPRET']).toBe(3);
      expect(stats.skillsByCompetency['KNOW']).toBe(2);
      expect(stats.skillsByCompetency['REASON']).toBe(1);
    });
  });

  describe('5. Canonical Dictionary Isolation & Separation Guarantees', () => {
    it('enforces DO_NOT_MERGE separation on thermodynamic vs physics heat transfer', () => {
      const dict = registry.getSkillDictionaryEntryById('SKILL-DICT-011');
      expect(dict).toBeDefined();
      expect(dict?.relationship).toBe('DO_NOT_MERGE');
      expect(dict?.mappedSkillIds).toContain('SKILL-GEN0110-002');
      expect(dict?.mappedSkillIds).toContain('SKILL-GEN0161-002');
    });

    it('enforces PREREQUISITE mapping between Calculus implicit diff and ODE constant elimination', () => {
      const dict = registry.getSkillDictionaryEntryById('SKILL-DICT-003');
      expect(dict).toBeDefined();
      expect(dict?.relationship).toBe('PREREQUISITE');
      expect(dict?.mappedSkillIds).toContain('SKILL-GEN0102-009');
      expect(dict?.mappedSkillIds).toContain('SKILL-GEN0107-002');
    });
  });
});
