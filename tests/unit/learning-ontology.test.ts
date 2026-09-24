import { describe, it, expect } from 'vitest';
import { CurriculumRegistry } from '@/engine/curriculum/registry';
import { AUTHORITATIVE_SKILLS } from '@/engine/curriculum/skills';
import { AUTHORITATIVE_PREREQUISITES, PrerequisiteGraph } from '@/engine/curriculum/prerequisites';
import { CANONICAL_SKILL_DICTIONARY } from '@/engine/curriculum/skillDictionary';

describe('Learning Ontology & Skill Mapping Test Suite', () => {
  const registry = CurriculumRegistry.getInstance();

  describe('1. Skill Identification & Uniqueness Invariants', () => {
    it('contains authoritative skills across all 6 courses', () => {
      const allSkills = registry.getAllSkills();
      expect(allSkills.length).toBeGreaterThan(40);

      const courseIds = new Set(allSkills.map(s => s.parentCourseId));
      expect(courseIds.has('COURSE-GEN0101')).toBe(true);
      expect(courseIds.has('COURSE-GEN0102')).toBe(true);
      expect(courseIds.has('COURSE-GEN0107')).toBe(true);
      expect(courseIds.has('COURSE-GEN0110')).toBe(true);
      expect(courseIds.has('COURSE-GEN0161')).toBe(true);
      expect(courseIds.has('COURSE-BSIE3219')).toBe(true);
    });

    it('enforces globally unique skill IDs', () => {
      const skillIds = new Set<string>();
      for (const skill of registry.getAllSkills()) {
        expect(skillIds.has(skill.id)).toBe(false);
        skillIds.add(skill.id);
      }
    });

    it('enforces valid actionable naming convention (Verb + Object + Context)', () => {
      const actionVerbs = [
        'Apply', 'Calculate', 'Solve', 'Differentiate', 'Evaluate',
        'Analyze', 'Classify', 'Formulate', 'Identify', 'Compute', 'Perform',
        'Find', 'Factor', 'Determine', 'Model'
      ];

      for (const skill of registry.getAllSkills()) {
        const firstWord = skill.canonicalName.split(' ')[0];
        const startsWithVerb = actionVerbs.includes(firstWord);
        if (!startsWithVerb) {
          console.log(`Non-matching skill verb: "${firstWord}" in skill "${skill.canonicalName}"`);
        }
        expect(startsWithVerb).toBe(true);
        expect(skill.description.length).toBeGreaterThan(25);
      }
    });
  });

  describe('2. Referential Integrity & Hierarchy Mapping', () => {
    it('guarantees every skill maps to an existing course, topic, and subtopics', () => {
      for (const skill of registry.getAllSkills()) {
        const course = registry.getCourseById(skill.parentCourseId);
        expect(course).toBeDefined();

        const topic = registry.getTopicById(skill.parentTopicId);
        expect(topic).toBeDefined();
        expect(topic?.courseId).toBe(skill.parentCourseId);

        expect(skill.parentSubtopicIds.length).toBeGreaterThan(0);
        for (const subId of skill.parentSubtopicIds) {
          const subtopic = registry.getSubtopicById(subId);
          expect(subtopic).toBeDefined();
          expect(subtopic?.topicId).toBe(skill.parentTopicId);
        }
      }
    });

    it('ensures every skill has traceable source references', () => {
      for (const skill of registry.getAllSkills()) {
        expect(skill.sourceReferences.length).toBeGreaterThan(0);
        for (const ref of skill.sourceReferences) {
          expect(ref.syllabusId).toMatch(/^SYL-00[1-6]$/);
          expect(ref.filename.length).toBeGreaterThan(4);
          expect(ref.rawTextExtract.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('3. Prerequisite Graph Integrity & Acyclicity', () => {
    it('guarantees all prerequisite relationships point to existing skills', () => {
      const allRelations = registry.getAllPrerequisiteRelations();
      expect(allRelations.length).toBeGreaterThan(30);

      for (const rel of allRelations) {
        const sourceSkill = registry.getSkillById(rel.sourceSkillId);
        const targetSkill = registry.getSkillById(rel.targetSkillId);

        expect(sourceSkill).toBeDefined();
        expect(targetSkill).toBeDefined();
        expect(['REQUIRED', 'RECOMMENDED']).toContain(rel.strength);
        expect(['EXPLICIT', 'STRONGLY_INFERRED', 'WEAKLY_INFERRED']).toContain(rel.evidence);
      }
    });

    it('enforces a strictly acyclic prerequisite graph (Zero Cycles)', () => {
      const graph = new PrerequisiteGraph(AUTHORITATIVE_PREREQUISITES);
      const cycles = graph.detectCycles();
      expect(cycles).toHaveLength(0);
    });

    it('correctly traverses transitive prerequisite chains', () => {
      // Chain Rule (SKILL-GEN0102-005) -> depends on Power Rule (SKILL-GEN0102-002) and Function Composition (SKILL-GEN0101-010)
      const transitivePrereqs = registry.getTransitivePrerequisites('SKILL-GEN0102-005');
      expect(transitivePrereqs).toContain('SKILL-GEN0102-002'); // Power Rule
      expect(transitivePrereqs).toContain('SKILL-GEN0101-006'); // Exponent laws
      expect(transitivePrereqs).toContain('SKILL-GEN0101-001'); // Order of operations
      expect(transitivePrereqs).toContain('SKILL-GEN0101-010'); // Function composition
    });
  });

  describe('4. Mastery Evidence & Assessment Modalities', () => {
    it('verifies every skill has non-empty observable mastery criteria and evidence types', () => {
      for (const skill of registry.getAllSkills()) {
        expect(skill.masteryEvidence.length).toBeGreaterThan(0);
        for (const criterion of skill.masteryEvidence) {
          expect(criterion.length).toBeGreaterThan(15);
        }

        expect(skill.evidenceTypes.length).toBeGreaterThan(0);
        expect(skill.difficultyFactors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('5. Canonical Skill Dictionary Verification', () => {
    it('verifies all dictionary entries map exclusively to existing skills', () => {
      const entries = registry.getAllSkillDictionaryEntries();
      expect(entries.length).toBeGreaterThan(10);

      for (const entry of entries) {
        expect(entry.id).toMatch(/^SKILL-DICT-\d{3}$/);
        expect(entry.canonicalSkillName.length).toBeGreaterThan(5);
        expect(entry.mappedSkillIds.length).toBeGreaterThan(0);

        for (const skillId of entry.mappedSkillIds) {
          const skill = registry.getSkillById(skillId);
          expect(skill).toBeDefined();
        }
      }
    });

    it('verifies DO_NOT_MERGE separation between physics heat transfer and thermodynamic energy accounting', () => {
      const thermalEntry = registry.getSkillDictionaryEntryById('SKILL-DICT-011');
      expect(thermalEntry).toBeDefined();
      expect(thermalEntry?.relationship).toBe('DO_NOT_MERGE');
      expect(thermalEntry?.mappedSkillIds).toContain('SKILL-GEN0110-002'); // Physics Conduction/Convection
      expect(thermalEntry?.mappedSkillIds).toContain('SKILL-GEN0161-002'); // Thermo First Law
    });
  });

  describe('6. Skill Statistics & Comprehensive Validation', () => {
    it('computes accurate skill statistics across courses, audited provenance, and competencies', () => {
      const stats = registry.getSkillStatistics();

      expect(stats.totalSkills).toBe(71);
      expect(stats.explicitSkillsCount).toBe(33);
      expect(stats.derivedSkillsCount).toBe(38);
      expect(stats.proposedSkillsCount).toBe(0);
      expect(stats.skillsWithPrerequisitesCount).toBeGreaterThan(30);
      expect(stats.totalPrerequisiteEdges).toBe(108);

      // Verify skill distribution across courses
      expect(stats.skillsByCourse['COURSE-GEN0101']).toBe(17);
      expect(stats.skillsByCourse['COURSE-GEN0102']).toBe(15);
      expect(stats.skillsByCourse['COURSE-GEN0107']).toBe(11);
      expect(stats.skillsByCourse['COURSE-GEN0110']).toBe(10);
      expect(stats.skillsByCourse['COURSE-GEN0161']).toBe(8);
      expect(stats.skillsByCourse['COURSE-BSIE3219']).toBe(10);

      // Verify dominant competency coverage
      expect(stats.skillsByCompetency['DO']).toBeGreaterThan(30);
      expect(stats.skillsByCompetency['APPLY']).toBeGreaterThan(10);
      expect(stats.skillsByCompetency['MODEL']).toBe(5);
    });

    it('verifies that every single skill has non-empty source extract and valid competency', () => {
      for (const skill of registry.getAllSkills()) {
        expect(skill.dominantCompetency).toBeDefined();
        expect(skill.sourceReferences.length).toBeGreaterThan(0);
        expect(skill.sourceReferences[0].rawTextExtract.length).toBeGreaterThan(5);
      }
    });

    it('passes automated registry integrity validation with 0 errors', () => {
      const issues = registry.validateIntegrity();
      const errors = issues.filter(i => i.severity === 'ERROR');
      expect(errors).toHaveLength(0);
    });
  });
});
