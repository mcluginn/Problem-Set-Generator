import {
  CurriculumCourse,
  CurriculumUnit,
  CurriculumTopic,
  CurriculumSubtopic,
  CurriculumManifestEntry,
  TopicDictionaryEntry,
  CurriculumStatistics,
  ValidationIssue,
  LearningSkill,
  SkillType,
  EvidenceType,
  CanonicalSkillDictionaryEntry,
  SkillStatistics,
  PrerequisiteRelation
} from './types';
import { AUTHORITATIVE_MANIFEST } from './manifest';
import { AUTHORITATIVE_COURSES } from './courses';
import { AUTHORITATIVE_UNITS, AUTHORITATIVE_TOPICS } from './coverage';
import { CANONICAL_TOPIC_DICTIONARY } from './topicDictionary';
import { AUTHORITATIVE_SKILLS } from './skills';
import { AUTHORITATIVE_PREREQUISITES, PrerequisiteGraph } from './prerequisites';
import { CANONICAL_SKILL_DICTIONARY } from './skillDictionary';
import {
  GOLDEN_MASTER_NON_DIFFEQ_UNITS,
  GOLDEN_MASTER_NON_DIFFEQ_TOPICS,
  GOLDEN_MASTER_NON_DIFFEQ_SKILLS,
  LEGACY_SKILL_TO_CLUSTER_MAP,
  getClustersForSkill,
  getClustersForTopic,
  getSkillForCluster,
  getTopicForCluster
} from './goldenMasterRegistry';
import { CLUSTER_TO_SYLLABUS_TOPIC_MAP } from './masterBankMappings';

export class CurriculumRegistry {
  private static instance: CurriculumRegistry;

  private manifest: Map<string, CurriculumManifestEntry> = new Map();
  private courses: Map<string, CurriculumCourse> = new Map();
  private coursesByCode: Map<string, CurriculumCourse> = new Map();
  private units: Map<string, CurriculumUnit> = new Map();
  private topics: Map<string, CurriculumTopic> = new Map();
  private subtopics: Map<string, CurriculumSubtopic> = new Map();
  private topicDictionary: Map<string, TopicDictionaryEntry> = new Map();

  // Learning Ontology Maps
  private syllabusSkills: Map<string, LearningSkill> = new Map();
  private goldenMasterSkills: Map<string, LearningSkill> = new Map();
  private goldenMasterUnits: Map<string, CurriculumUnit> = new Map();
  private goldenMasterTopics: Map<string, CurriculumTopic> = new Map();
  private clustersByCourse: Map<string, LearningSkill[]> = new Map();
  private skills: Map<string, LearningSkill> = new Map();
  private skillsByCourse: Map<string, LearningSkill[]> = new Map();
  private skillsByTopic: Map<string, LearningSkill[]> = new Map();
  private skillsBySubtopic: Map<string, LearningSkill[]> = new Map();
  private skillDictionary: Map<string, CanonicalSkillDictionaryEntry> = new Map();
  private prerequisiteGraph: PrerequisiteGraph;

  private constructor() {
    this.prerequisiteGraph = new PrerequisiteGraph(AUTHORITATIVE_PREREQUISITES);
    this.initialize();
  }

  public static getInstance(): CurriculumRegistry {
    if (!CurriculumRegistry.instance) {
      CurriculumRegistry.instance = new CurriculumRegistry();
    }
    return CurriculumRegistry.instance;
  }

  private initialize(): void {
    // 1. Ingest Manifest
    for (const entry of AUTHORITATIVE_MANIFEST) {
      this.manifest.set(entry.syllabusId, entry);
    }

    // 2. Ingest Courses
    for (const course of AUTHORITATIVE_COURSES) {
      this.courses.set(course.id, course);
      this.coursesByCode.set(course.code.trim().toUpperCase(), course);
    }

    // 3. Ingest Units
    for (const unit of AUTHORITATIVE_UNITS) {
      this.units.set(unit.id, unit);
    }

    // 4. Ingest Topics & Subtopics
    for (const topic of AUTHORITATIVE_TOPICS) {
      this.topics.set(topic.id, topic);
      for (const sub of topic.subtopics) {
        this.subtopics.set(sub.id, sub);
      }
    }

    // 5. Ingest Topic Dictionary
    for (const entry of CANONICAL_TOPIC_DICTIONARY) {
      this.topicDictionary.set(entry.id, entry);
    }

    // 6. Ingest Learning Skills
    for (const skill of AUTHORITATIVE_SKILLS) {
      this.syllabusSkills.set(skill.id, skill);
      this.skills.set(skill.id, skill);

      // Course index
      if (!this.skillsByCourse.has(skill.parentCourseId)) {
        this.skillsByCourse.set(skill.parentCourseId, []);
      }
      this.skillsByCourse.get(skill.parentCourseId)!.push(skill);

      // Topic index
      if (!this.skillsByTopic.has(skill.parentTopicId)) {
        this.skillsByTopic.set(skill.parentTopicId, []);
      }
      this.skillsByTopic.get(skill.parentTopicId)!.push(skill);

      // Subtopic index
      for (const subId of skill.parentSubtopicIds) {
        if (!this.skillsBySubtopic.has(subId)) {
          this.skillsBySubtopic.set(subId, []);
        }
        this.skillsBySubtopic.get(subId)!.push(skill);
      }
    }

    // 7. Ingest Skill Dictionary
    for (const entry of CANONICAL_SKILL_DICTIONARY) {
      this.skillDictionary.set(entry.id, entry);
    }

    // 8. Ingest Golden Master Authoritative Units, Topics, and Skills for non-DiffEq courses into dedicated Golden Master collections
    for (const unit of GOLDEN_MASTER_NON_DIFFEQ_UNITS) {
      this.goldenMasterUnits.set(unit.id, unit);
    }

    for (const topic of GOLDEN_MASTER_NON_DIFFEQ_TOPICS) {
      this.goldenMasterTopics.set(topic.id, topic);
    }

    for (const skill of GOLDEN_MASTER_NON_DIFFEQ_SKILLS) {
      const mappedTopic = CLUSTER_TO_SYLLABUS_TOPIC_MAP[skill.id];
      const normalizedSkill = mappedTopic ? { ...skill, parentTopicId: mappedTopic } : skill;
      this.goldenMasterSkills.set(skill.id, normalizedSkill);

      if (!this.clustersByCourse.has(skill.parentCourseId)) {
        this.clustersByCourse.set(skill.parentCourseId, []);
      }
      this.clustersByCourse.get(skill.parentCourseId)!.push(normalizedSkill);
    }
  }

  // --- Course Accessors ---

  public getAllCourses(): CurriculumCourse[] {
    return Array.from(this.courses.values());
  }

  public getCourseById(id: string): CurriculumCourse | undefined {
    return this.courses.get(id);
  }

  public getCourseByCode(code: string): CurriculumCourse | undefined {
    return this.coursesByCode.get(code.trim().toUpperCase());
  }

  // --- Manifest Accessors ---

  public getAllManifestEntries(): CurriculumManifestEntry[] {
    return Array.from(this.manifest.values());
  }

  public getManifestEntryById(syllabusId: string): CurriculumManifestEntry | undefined {
    return this.manifest.get(syllabusId);
  }

  // --- Unit Accessors ---

  public getAllUnits(): CurriculumUnit[] {
    return Array.from(this.units.values());
  }

  public getUnitById(id: string): CurriculumUnit | undefined {
    return this.units.get(id) || this.goldenMasterUnits.get(id);
  }

  public getUnitsByCourse(courseId: string): CurriculumUnit[] {
    return Array.from(this.units.values())
      .filter(u => u.courseId === courseId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  // --- Topic Accessors ---

  public getAllTopics(): CurriculumTopic[] {
    return Array.from(this.topics.values());
  }

  public getTopicById(id: string): CurriculumTopic | undefined {
    return this.topics.get(id) || this.goldenMasterTopics.get(id);
  }

  public getTopicsByUnit(unitId: string): CurriculumTopic[] {
    return Array.from(this.topics.values())
      .filter(t => t.unitId === unitId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  public getTopicsByCourse(courseId: string): CurriculumTopic[] {
    return Array.from(this.topics.values())
      .filter(t => t.courseId === courseId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  // --- Subtopic Accessors ---

  public getAllSubtopics(): CurriculumSubtopic[] {
    return Array.from(this.subtopics.values());
  }

  public getSubtopicById(id: string): CurriculumSubtopic | undefined {
    return this.subtopics.get(id);
  }

  public getSubtopicsByTopic(topicId: string): CurriculumSubtopic[] {
    const topic = this.topics.get(topicId);
    return topic ? [...topic.subtopics].sort((a, b) => a.sequence - b.sequence) : [];
  }

  // --- Learning Skills Accessors ---

  public getAllSkills(): LearningSkill[] {
    return Array.from(this.syllabusSkills.values());
  }

  public getAllClusters(): LearningSkill[] {
    return Array.from(this.goldenMasterSkills.values());
  }

  public getClustersByCourse(courseId: string): LearningSkill[] {
    return this.clustersByCourse.get(courseId) || [];
  }

  public getGoldenMasterUnits(): CurriculumUnit[] {
    return Array.from(this.goldenMasterUnits.values());
  }

  public getGoldenMasterTopics(): CurriculumTopic[] {
    return Array.from(this.goldenMasterTopics.values());
  }

  public getSkillById(id: string): LearningSkill | undefined {
    const directSyllabus = this.skills.get(id);
    if (directSyllabus) return directSyllabus;
    const directGm = this.goldenMasterSkills.get(id);
    if (directGm) return directGm;
    const alias = LEGACY_SKILL_TO_CLUSTER_MAP[id];
    if (alias) return this.goldenMasterSkills.get(alias) || this.skills.get(alias);
    for (const [legacyId, clusterId] of Object.entries(LEGACY_SKILL_TO_CLUSTER_MAP)) {
      if (clusterId === id) return this.skills.get(legacyId);
    }
    return undefined;
  }

  public getSkillsByCourse(courseId: string): LearningSkill[] {
    return this.skillsByCourse.get(courseId) || [];
  }

  public getSkillsByTopic(topicId: string): LearningSkill[] {
    const zeroSkillTopics = new Set([
      'CURR-GEN0102-U1-T01',
      'CURR-GEN0102-U1-T02',
      'CURR-GEN0161-U1-T01',
      'CURR-BSIE3219-U2-T04',
      'CURR-BSIE3219-U2-T06'
    ]);
    if (zeroSkillTopics.has(topicId)) return [];

    const syllabusSkills = this.skillsByTopic.get(topicId);
    if (syllabusSkills && syllabusSkills.length > 0) return syllabusSkills;
    const gmSkills = Array.from(this.goldenMasterSkills.values()).filter(s => s.parentTopicId === topicId);
    return gmSkills;
  }


  public getSkillsBySubtopic(subtopicId: string): LearningSkill[] {
    return this.skillsBySubtopic.get(subtopicId) || [];
  }

  public getSkillsByType(type: SkillType): LearningSkill[] {
    return Array.from(this.skills.values()).filter(s => s.skillType === type);
  }

  public getSkillsByEvidenceType(evidenceType: EvidenceType): LearningSkill[] {
    return Array.from(this.skills.values()).filter(s => s.evidenceTypes.includes(evidenceType));
  }

  // --- Prerequisite Traversal ---

  public getImmediatePrerequisites(skillId: string): string[] {
    return this.prerequisiteGraph.getImmediatePrerequisites(skillId);
  }

  public getImmediateDependents(skillId: string): string[] {
    return this.prerequisiteGraph.getImmediateDependents(skillId);
  }

  public getTransitivePrerequisites(skillId: string): string[] {
    return this.prerequisiteGraph.getTransitivePrerequisites(skillId);
  }

  public getAllPrerequisiteRelations(): PrerequisiteRelation[] {
    return AUTHORITATIVE_PREREQUISITES;
  }

  // --- Topic Dictionary Accessors ---

  public getAllDictionaryEntries(): TopicDictionaryEntry[] {
    return Array.from(this.topicDictionary.values());
  }

  public getDictionaryEntryById(id: string): TopicDictionaryEntry | undefined {
    return this.topicDictionary.get(id);
  }

  // --- Skill Dictionary Accessors ---

  public getAllSkillDictionaryEntries(): CanonicalSkillDictionaryEntry[] {
    return Array.from(this.skillDictionary.values());
  }

  public getSkillDictionaryEntryById(id: string): CanonicalSkillDictionaryEntry | undefined {
    return this.skillDictionary.get(id);
  }

  // --- Curriculum Hierarchy & Lineage Helpers ---

  /**
   * Checks if a topic is identical to or a descendant of an ancestor topic.
   */
  public isTopicDescendant(topicId: string, ancestorTopicId: string): boolean {
    if (!topicId || !ancestorTopicId) return false;
    if (topicId === ancestorTopicId) return true;
    const topic = this.topics.get(topicId);
    if (!topic) return false;
    // Direct unit comparison or hierarchy check
    const ancestorTopic = this.topics.get(ancestorTopicId);
    if (ancestorTopic && topic.unitId === ancestorTopic.unitId && topic.courseId === ancestorTopic.courseId) {
      return topicId === ancestorTopicId;
    }
    return false;
  }

  /**
   * Checks if a skill strictly belongs to a given topic.
   */
  public isSkillInTopic(skillId: string, topicId: string): boolean {
    if (!skillId || !topicId) return false;
    const skill = this.skills.get(skillId) || this.goldenMasterSkills.get(skillId);
    if (skill && skill.parentTopicId === topicId) return true;
    const mappedTopic = getTopicForCluster(skillId);
    if (mappedTopic && mappedTopic === topicId) return true;
    const clustersInTopic = getClustersForTopic(topicId);
    if (clustersInTopic.includes(skillId)) return true;
    return false;
  }

  /**
   * Checks if a skill strictly belongs to a given subtopic.
   */
  public isSkillInSubtopic(skillId: string, subtopicId: string): boolean {
    if (!skillId || !subtopicId) return false;
    const skill = this.skills.get(skillId) || this.goldenMasterSkills.get(skillId);
    if (!skill) return false;
    return skill.parentSubtopicIds.includes(subtopicId);
  }

  /**
   * Resolves the parent topic for a given skill.
   */
  public getTopicForSkill(skillId: string): CurriculumTopic | undefined {
    const skill = this.skills.get(skillId) || this.goldenMasterSkills.get(skillId);
    if (!skill) return undefined;
    const direct = this.topics.get(skill.parentTopicId) || this.goldenMasterTopics.get(skill.parentTopicId);
    if (direct) return direct;
    const mappedTopicId = getTopicForCluster(skillId);
    if (mappedTopicId) return this.topics.get(mappedTopicId) || this.goldenMasterTopics.get(mappedTopicId);
    return undefined;
  }

  public getClustersForSkill(skillId: string): string[] {
    return getClustersForSkill(skillId);
  }

  public getClustersForTopic(topicId: string): string[] {
    return getClustersForTopic(topicId);
  }

  public getSkillForCluster(clusterId: string): string | undefined {
    return getSkillForCluster(clusterId);
  }

  public getTopicForCluster(clusterId: string): string | undefined {
    return getTopicForCluster(clusterId);
  }

  /**
   * Resolves the parent course for a given topic.
   */
  public getCourseForTopic(topicId: string): CurriculumCourse | undefined {
    const topic = this.topics.get(topicId);
    if (!topic) return undefined;
    return this.courses.get(topic.courseId);
  }

  /**
   * Resolves the parent course for a given skill.
   */
  public getCourseForSkill(skillId: string): CurriculumCourse | undefined {
    const skill = this.skills.get(skillId);
    if (!skill) return undefined;
    return this.courses.get(skill.parentCourseId);
  }

  /**
   * Validates the complete curriculum ancestry chain: Course -> Topic -> Subtopic -> Skill.
   */
  public validateCurriculumAncestry(metadata: {
    courseId: string;
    topicId?: string;
    subtopicId?: string;
    primarySkillId: string;
  }): boolean {
    const skill = this.skills.get(metadata.primarySkillId);
    if (!skill) return false;

    // Course check
    if (skill.parentCourseId !== metadata.courseId) return false;

    // Topic check (if declared)
    if (metadata.topicId && skill.parentTopicId !== metadata.topicId) {
      return false;
    }

    // Subtopic check (if declared)
    if (metadata.subtopicId && !skill.parentSubtopicIds.includes(metadata.subtopicId)) {
      return false;
    }

    return true;
  }

  // --- Statistics ---

  public getStatistics(): CurriculumStatistics {
    const courseStats = this.getAllCourses().map(course => {
      const courseUnits = this.getUnitsByCourse(course.id);
      const courseTopics = this.getTopicsByCourse(course.id);
      const subtopicsCount = courseTopics.reduce((sum, t) => sum + t.subtopics.length, 0);
      const totalHours = courseTopics.reduce((sum, t) => sum + t.hours, 0);

      return {
        courseId: course.id,
        courseCode: course.code,
        courseTitle: course.title,
        unitsCount: courseUnits.length,
        topicsCount: courseTopics.length,
        subtopicsCount,
        totalHours
      };
    });

    const totalContactHours = courseStats.reduce((sum, c) => sum + c.totalHours, 0);

    return {
      totalSyllabi: this.manifest.size,
      totalCourses: this.courses.size,
      totalUnits: this.units.size,
      totalTopics: this.topics.size,
      totalSubtopics: this.subtopics.size,
      totalContactHours,
      coursesWithWeeklySequencing: this.courses.size,
      coursesWithExplicitUnitStructure: this.courses.size,
      courseStats
    };
  }

  public getSkillStatistics(): SkillStatistics {
    const allSkills = this.getAllSkills();
    const skillsByCourse: Record<string, number> = {};
    const skillsByType: Record<string, number> = {} as any;
    const skillsByEvidenceType: Record<string, number> = {} as any;
    const skillsByCompetency: Record<string, number> = {} as any;

    let explicitCount = 0;
    let derivedCount = 0;
    let proposedCount = 0;
    let primaryCount = 0;
    let supportingCount = 0;
    let withPrereqsCount = 0;

    for (const skill of allSkills) {
      // Course tally
      skillsByCourse[skill.parentCourseId] = (skillsByCourse[skill.parentCourseId] || 0) + 1;

      // Type tally
      skillsByType[skill.skillType] = (skillsByType[skill.skillType] || 0) + 1;

      // Competency tally
      skillsByCompetency[skill.dominantCompetency] = (skillsByCompetency[skill.dominantCompetency] || 0) + 1;

      // Evidence tally
      for (const ev of skill.evidenceTypes) {
        skillsByEvidenceType[ev] = (skillsByEvidenceType[ev] || 0) + 1;
      }

      // Source tally
      if (skill.sourceType === 'SYLLABUS_EXPLICIT') explicitCount++;
      else if (skill.sourceType === 'SYLLABUS_DERIVED') derivedCount++;
      else if (skill.sourceType === 'SYSTEM_PROPOSED') proposedCount++;

      // Role tally
      if (skill.role === 'PRIMARY') primaryCount++;
      else if (skill.role === 'SUPPORTING') supportingCount++;

      if (skill.prerequisiteSkillIds && skill.prerequisiteSkillIds.length > 0) {
        withPrereqsCount++;
      }
    }

    return {
      totalSkills: allSkills.length,
      explicitSkillsCount: explicitCount,
      derivedSkillsCount: derivedCount,
      proposedSkillsCount: proposedCount,
      primarySkillsCount: primaryCount,
      supportingSkillsCount: supportingCount,
      skillsWithPrerequisitesCount: withPrereqsCount,
      totalPrerequisiteEdges: AUTHORITATIVE_PREREQUISITES.length,
      skillsByCourse,
      skillsByType: skillsByType as Record<SkillType, number>,
      skillsByCompetency: skillsByCompetency as any,
      skillsByEvidenceType: skillsByEvidenceType as Record<EvidenceType, number>
    };
  }

  // --- Validation and Quality Control ---

  public validateIntegrity(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // 1. Verify Manifest
    if (this.manifest.size < 6) {
      issues.push({
        severity: 'ERROR',
        entityType: 'MANIFEST',
        entityId: 'MANIFEST_COUNT',
        message: `Expected at least 6 syllabi manifest entries, found ${this.manifest.size}`
      });
    }

    // 2. Verify Courses
    for (const course of this.courses.values()) {
      if (!this.manifest.has(course.sourceSyllabusId)) {
        issues.push({
          severity: 'ERROR',
          entityType: 'COURSE',
          entityId: course.id,
          message: `Course references missing source syllabus ID: ${course.sourceSyllabusId}`
        });
      }

      const units = this.getUnitsByCourse(course.id);
      if (units.length === 0) {
        issues.push({
          severity: 'ERROR',
          entityType: 'COURSE',
          entityId: course.id,
          message: `Course has no associated units`
        });
      }
    }

    // 3. Verify Units
    for (const unit of this.units.values()) {
      if (!this.courses.has(unit.courseId)) {
        issues.push({
          severity: 'ERROR',
          entityType: 'UNIT',
          entityId: unit.id,
          message: `Unit references non-existent courseId: ${unit.courseId}`
        });
      }

      const topics = this.getTopicsByUnit(unit.id);
      if (topics.length === 0) {
        issues.push({
          severity: 'WARNING',
          entityType: 'UNIT',
          entityId: unit.id,
          message: `Unit contains no topics`
        });
      }
    }

    // 4. Verify Topics
    for (const topic of this.topics.values()) {
      if (!this.units.has(topic.unitId)) {
        issues.push({
          severity: 'ERROR',
          entityType: 'TOPIC',
          entityId: topic.id,
          message: `Topic references non-existent unitId: ${topic.unitId}`
        });
      }

      if (!this.courses.has(topic.courseId)) {
        issues.push({
          severity: 'ERROR',
          entityType: 'TOPIC',
          entityId: topic.id,
          message: `Topic references non-existent courseId: ${topic.courseId}`
        });
      }

      if (!topic.sourceReference || !topic.sourceReference.syllabusId) {
        issues.push({
          severity: 'ERROR',
          entityType: 'TOPIC',
          entityId: topic.id,
          message: `Topic is missing required sourceReference`
        });
      }

      for (const sub of topic.subtopics) {
        if (sub.topicId !== topic.id) {
          issues.push({
            severity: 'ERROR',
            entityType: 'SUBTOPIC',
            entityId: sub.id,
            message: `Subtopic parent topicId mismatch: expected ${topic.id}, got ${sub.topicId}`
          });
        }
      }
    }

    // 5. Verify Topic Dictionary
    for (const entry of this.topicDictionary.values()) {
      for (const mappedId of entry.mappedTopicIds) {
        if (!this.topics.has(mappedId)) {
          issues.push({
            severity: 'ERROR',
            entityType: 'DICTIONARY',
            entityId: entry.id,
            message: `Dictionary entry maps to non-existent topicId: ${mappedId}`
          });
        }
      }
    }

    // 6. Verify Learning Skills
    for (const skill of this.syllabusSkills.values()) {
      if (!this.courses.has(skill.parentCourseId)) {
        issues.push({
          severity: 'ERROR',
          entityType: 'SKILL',
          entityId: skill.id,
          message: `Skill references non-existent parentCourseId: ${skill.parentCourseId}`
        });
      }

      if (!this.topics.has(skill.parentTopicId)) {
        issues.push({
          severity: 'ERROR',
          entityType: 'SKILL',
          entityId: skill.id,
          message: `Skill references non-existent parentTopicId: ${skill.parentTopicId}`
        });
      }

      for (const subId of skill.parentSubtopicIds) {
        if (!this.subtopics.has(subId)) {
          issues.push({
            severity: 'ERROR',
            entityType: 'SKILL',
            entityId: skill.id,
            message: `Skill references non-existent parentSubtopicId: ${subId}`
          });
        }
      }

      for (const prereqId of skill.prerequisiteSkillIds) {
        if (!this.skills.has(prereqId)) {
          issues.push({
            severity: 'ERROR',
            entityType: 'SKILL',
            entityId: skill.id,
            message: `Skill references non-existent prerequisiteSkillId: ${prereqId}`
          });
        }
      }
    }

    // 7. Verify Prerequisites Graph & Acyclicity
    for (const rel of AUTHORITATIVE_PREREQUISITES) {
      if (!this.skills.has(rel.sourceSkillId)) {
        issues.push({
          severity: 'ERROR',
          entityType: 'PREREQUISITE',
          entityId: `${rel.sourceSkillId}->${rel.targetSkillId}`,
          message: `Prerequisite relationship source skill does not exist: ${rel.sourceSkillId}`
        });
      }
      if (!this.skills.has(rel.targetSkillId)) {
        issues.push({
          severity: 'ERROR',
          entityType: 'PREREQUISITE',
          entityId: `${rel.sourceSkillId}->${rel.targetSkillId}`,
          message: `Prerequisite relationship target skill does not exist: ${rel.targetSkillId}`
        });
      }
    }

    const cycles = this.prerequisiteGraph.detectCycles();
    if (cycles.length > 0) {
      for (const cycle of cycles) {
        issues.push({
          severity: 'ERROR',
          entityType: 'PREREQUISITE',
          entityId: cycle.join('->'),
          message: `Circular prerequisite dependency detected: ${cycle.join(' -> ')}`
        });
      }
    }

    // 8. Verify Skill Dictionary
    for (const entry of this.skillDictionary.values()) {
      for (const mappedId of entry.mappedSkillIds) {
        if (!this.skills.has(mappedId)) {
          issues.push({
            severity: 'ERROR',
            entityType: 'SKILL_DICTIONARY',
            entityId: entry.id,
            message: `Skill dictionary maps to non-existent skillId: ${mappedId}`
          });
        }
      }
    }

    return issues;
  }
}

export const curriculumRegistry = CurriculumRegistry.getInstance();
