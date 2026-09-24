import { describe, it, expect } from 'vitest';
import { CurriculumRegistry } from '@/engine/curriculum/registry';
import { AUTHORITATIVE_MANIFEST } from '@/engine/curriculum/manifest';
import { AUTHORITATIVE_COURSES } from '@/engine/curriculum/courses';
import { AUTHORITATIVE_UNITS, AUTHORITATIVE_TOPICS } from '@/engine/curriculum/coverage';
import { CANONICAL_TOPIC_DICTIONARY } from '@/engine/curriculum/topicDictionary';

describe('Curriculum Registry & Course Coverage Suite', () => {
  const registry = CurriculumRegistry.getInstance();

  describe('1. Ingestion Completeness & Manifest Verification', () => {
    it('contains all 6 authoritative syllabi in manifest', () => {
      const manifest = registry.getAllManifestEntries();
      expect(manifest.length).toBe(6);

      const syllabusIds = manifest.map(m => m.syllabusId);
      expect(syllabusIds).toEqual(['SYL-001', 'SYL-002', 'SYL-003', 'SYL-004', 'SYL-005', 'SYL-006']);
    });

    it('contains all 6 distinct courses with high extraction confidence', () => {
      const courses = registry.getAllCourses();
      expect(courses.length).toBe(6);

      for (const course of courses) {
        expect(course.id).toBeDefined();
        expect(course.code).toBeDefined();
        expect(course.title).toBeDefined();
        expect(course.officialTitle).toBeDefined();
        expect(course.credits).toBeGreaterThan(0);
        expect(course.extractionConfidence).toBe('HIGH');
        expect(course.description.length).toBeGreaterThan(20);
      }

      // Check course codes
      const courseCodes = courses.map(c => c.code.trim());
      expect(courseCodes).toContain('GEN 0101');
      expect(courseCodes).toContain('GEN 0102');
      expect(courseCodes).toContain('GEN 0107');
      expect(courseCodes).toContain('GEN 0110/ 0110L');
      expect(courseCodes).toContain('GEN 0161');
      expect(courseCodes).toContain('BSIE 3219');
    });
  });

  describe('2. Referential Integrity & Unique Identifiers', () => {
    it('enforces globally unique IDs across courses, units, topics, and subtopics', () => {
      const courseIds = new Set<string>();
      for (const c of registry.getAllCourses()) {
        expect(courseIds.has(c.id)).toBe(false);
        courseIds.add(c.id);
      }

      const unitIds = new Set<string>();
      for (const u of registry.getAllUnits()) {
        expect(unitIds.has(u.id)).toBe(false);
        unitIds.add(u.id);
      }

      const topicIds = new Set<string>();
      for (const t of registry.getAllTopics()) {
        expect(topicIds.has(t.id)).toBe(false);
        topicIds.add(t.id);
      }

      const subtopicIds = new Set<string>();
      for (const s of registry.getAllSubtopics()) {
        expect(subtopicIds.has(s.id)).toBe(false);
        subtopicIds.add(s.id);
      }
    });

    it('guarantees parent-child referential validity', () => {
      // Every unit points to a valid course
      for (const unit of registry.getAllUnits()) {
        const course = registry.getCourseById(unit.courseId);
        expect(course).toBeDefined();
      }

      // Every topic points to a valid unit and course
      for (const topic of registry.getAllTopics()) {
        const unit = registry.getUnitById(topic.unitId);
        expect(unit).toBeDefined();
        expect(unit?.courseId).toBe(topic.courseId);

        // Every subtopic points to its parent topic
        for (const sub of topic.subtopics) {
          expect(sub.topicId).toBe(topic.id);
          expect(registry.getSubtopicById(sub.id)).toBeDefined();
        }
      }
    });

    it('passes automated integrity validation with 0 errors', () => {
      const issues = registry.validateIntegrity();
      const errors = issues.filter(i => i.severity === 'ERROR');
      expect(errors).toHaveLength(0);
    });
  });

  describe('3. Unit & Assessment Period Hierarchy', () => {
    it('verifies every course has exactly 3 standard assessment units (Prelim, Midterm, Final)', () => {
      for (const course of registry.getAllCourses()) {
        const units = registry.getUnitsByCourse(course.id);
        expect(units.length).toBe(3);

        expect(units[0].sequence).toBe(1);
        expect(units[0].period).toBe('PRELIM');

        expect(units[1].sequence).toBe(2);
        expect(units[1].period).toBe('MIDTERM');

        expect(units[2].sequence).toBe(3);
        expect(units[2].period).toBe('FINAL');
      }
    });
  });

  describe('4. Source Traceability Invariant', () => {
    it('ensures every single topic contains verifiable source document references', () => {
      const allTopics = registry.getAllTopics();
      expect(allTopics.length).toBeGreaterThan(50);

      for (const topic of allTopics) {
        expect(topic.sourceReference).toBeDefined();
        expect(topic.sourceReference.syllabusId).toMatch(/^SYL-00[1-6]$/);
        expect(topic.sourceReference.filename.length).toBeGreaterThan(4);
        expect(topic.sourceReference.rawTextExtract.length).toBeGreaterThan(0);
        expect(topic.officialName.length).toBeGreaterThan(0);
        expect(topic.normalizedName.length).toBeGreaterThan(0);
        expect(topic.hours).toBeGreaterThan(0);
      }
    });
  });

  describe('5. Canonical Topic Dictionary & Cross-Course Mappings', () => {
    it('verifies all dictionary entries map exclusively to existing topic IDs', () => {
      const dictEntries = registry.getAllDictionaryEntries();
      expect(dictEntries.length).toBe(14);

      for (const entry of dictEntries) {
        expect(entry.id).toMatch(/^TOP-DICT-\d{3}$/);
        expect(entry.canonicalConcept.length).toBeGreaterThan(5);
        expect(entry.mappedTopicIds.length).toBeGreaterThan(0);

        for (const topicId of entry.mappedTopicIds) {
          const topic = registry.getTopicById(topicId);
          expect(topic).toBeDefined();
        }
      }
    });

    it('correctly segregates physics heat transfer from thermodynamic systems (DO_NOT_MERGE)', () => {
      const thermalEntry = registry.getDictionaryEntryById('TOP-DICT-013');
      expect(thermalEntry).toBeDefined();
      expect(thermalEntry?.relationship).toBe('DO_NOT_MERGE');
      expect(thermalEntry?.mappedTopicIds).toContain('CURR-GEN0110-U1-T02'); // Physics Heat Transfer
      expect(thermalEntry?.mappedTopicIds).toContain('CURR-GEN0161-U1-T03'); // Thermo First Law
    });

    it('identifies prerequisite relationship between Calculus implicit differentiation and DE arbitrary constants', () => {
      const implicitEntry = registry.getDictionaryEntryById('TOP-DICT-003');
      expect(implicitEntry).toBeDefined();
      expect(implicitEntry?.relationship).toBe('PREREQUISITE');
      expect(implicitEntry?.mappedTopicIds).toContain('CURR-GEN0102-U2-T08'); // Calc 1 Implicit
      expect(implicitEntry?.mappedTopicIds).toContain('CURR-GEN0107-U1-T02'); // DE Elimination of Constants
    });
  });

  describe('6. Statistics & Coverage Metrics', () => {
    it('calculates comprehensive curriculum metrics matching the extraction', () => {
      const stats = registry.getStatistics();

      expect(stats.totalSyllabi).toBe(6);
      expect(stats.totalCourses).toBe(6);
      expect(stats.totalUnits).toBe(18); // 6 courses * 3 units
      expect(stats.totalTopics).toBe(67);
      expect(stats.totalSubtopics).toBe(181);
      expect(stats.totalContactHours).toBe(269); // Exact sum of all 67 topics: 45h + 45h + 45h + 44h + 45h + 45h = 269h
      expect(stats.courseStats.length).toBe(6);

      // Verify specific course topic counts
      const calc1Stats = stats.courseStats.find(c => c.courseCode === 'GEN 0102');
      expect(calc1Stats).toBeDefined();
      expect(calc1Stats?.unitsCount).toBe(3);
      expect(calc1Stats?.topicsCount).toBe(13);

      const mathEngStats = stats.courseStats.find(c => c.courseCode === 'GEN 0101');
      expect(mathEngStats).toBeDefined();
      expect(mathEngStats?.topicsCount).toBe(16);

      const deStats = stats.courseStats.find(c => c.courseCode === 'GEN 0107');
      expect(deStats).toBeDefined();
      expect(deStats?.topicsCount).toBe(11);

      const phys2Stats = stats.courseStats.find(c => c.courseCode === 'GEN 0110/ 0110L');
      expect(phys2Stats).toBeDefined();
      expect(phys2Stats?.topicsCount).toBe(10);

      const thermoStats = stats.courseStats.find(c => c.courseCode === 'GEN 0161');
      expect(thermoStats).toBeDefined();
      expect(thermoStats?.topicsCount).toBe(8);

      const ieTopicsStats = stats.courseStats.find(c => c.courseCode === 'BSIE 3219');
      expect(ieTopicsStats).toBeDefined();
      expect(ieTopicsStats?.topicsCount).toBe(9);
    });
  });
});
