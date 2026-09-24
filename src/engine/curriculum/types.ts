/**
 * Curriculum Domain Types & Learning Ontology
 * Engineering Practice Engine — Authoritative Course Coverage & Skill Architecture
 */

export type AssessmentPeriod = 'PRELIM' | 'MIDTERM' | 'FINAL' | 'UNSPECIFIED';

export type ExtractionConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'REVIEW_REQUIRED';

export type CrossCourseRelationship = 
  | 'EXACT_MATCH'
  | 'NORMALIZED_MATCH'
  | 'RELATED'
  | 'PREREQUISITE'
  | 'COURSE_SPECIFIC'
  | 'DO_NOT_MERGE';

export type SkillType =
  | 'RECALL'
  | 'RECOGNITION'
  | 'INTERPRETATION'
  | 'PROCEDURAL'
  | 'CALCULATION'
  | 'REASONING'
  | 'APPLICATION'
  | 'MODELING'
  | 'ERROR_ANALYSIS'
  | 'COMMUNICATION'
  | 'METHOD_RECOGNITION';

export type DominantCompetency = 'KNOW' | 'DO' | 'APPLY' | 'EXPLAIN' | 'INTERPRET' | 'MODEL' | 'REASON';

export type SkillSourceType =
  | 'SYLLABUS_EXPLICIT'
  | 'SYLLABUS_DERIVED'
  | 'SYSTEM_PROPOSED';

export type SkillRole = 'PRIMARY' | 'SUPPORTING';

export type SkillStatus = 'DRAFT' | 'REVIEWED' | 'APPROVED';

export type EvidenceType =
  | 'MCQ_RECOGNITION'
  | 'DIRECT_CALCULATION'
  | 'SYMBOLIC_DERIVATION'
  | 'WORD_PROBLEM'
  | 'ERROR_ANALYSIS'
  | 'EXPLANATION'
  | 'INTERPRETATION'
  | 'MULTI_STEP_SOLUTION'
  | 'GRAPHICAL_ANALYSIS';

export type PrerequisiteStrength = 'REQUIRED' | 'RECOMMENDED';

export type PrerequisiteEvidence = 'EXPLICIT' | 'STRONGLY_INFERRED' | 'WEAKLY_INFERRED';

export interface SourceReference {
  syllabusId: string;
  filename: string;
  tableReference?: string;
  rowReference?: string | number;
  paragraphIndex?: number;
  rawTextExtract: string;
}

export interface CurriculumManifestEntry {
  syllabusId: string;
  filename: string;
  courseCode: string;
  courseTitle: string;
  fileType: string;
  creditUnits: number;
  creditType: 'LEC' | 'LAB' | 'LEC_LAB';
  academicYear: string;
  term: string;
  revision: string;
  extractionStatus: 'COMPLETE' | 'PARTIAL' | 'FAILED';
  confidence: ExtractionConfidence;
  notes?: string;
}

export interface CurriculumCourse {
  id: string;
  code: string;
  title: string;
  officialTitle: string;
  credits: number;
  creditType: 'LEC' | 'LAB' | 'LEC_LAB';
  prerequisites: string[];
  academicYear: string;
  term: string;
  institution: string;
  college: string;
  sourceSyllabusId: string;
  description: string;
  extractionConfidence: ExtractionConfidence;
}

export interface CurriculumUnit {
  id: string;
  courseId: string;
  sequence: number;
  period: AssessmentPeriod;
  officialName: string;
  normalizedName: string;
  totalHours: number;
  learningOutcomesSummary?: string;
  sourceReference: SourceReference;
}

export interface CurriculumSubtopic {
  id: string;
  topicId: string;
  sequence: number;
  officialName: string;
  normalizedName: string;
  isExplicitInSource: boolean;
  sourceReference?: SourceReference;
}

export interface CurriculumTopic {
  id: string;
  unitId: string;
  courseId: string;
  sequence: number;
  officialName: string;
  normalizedName: string;
  hours: number;
  period: AssessmentPeriod;
  associatedLLOs?: string[];
  canonicalTopicId?: string;
  sourceReference: SourceReference;
  subtopics: CurriculumSubtopic[];
}

export interface TopicDictionaryEntry {
  id: string;
  canonicalConcept: string;
  relationship: CrossCourseRelationship;
  mappedTopicIds: string[];
  notes: string;
}

// =========================================================================
// PHASE 2 & 2.5: LEARNING ONTOLOGY TYPES
// =========================================================================

export interface PrerequisiteRelation {
  sourceSkillId: string;       // The required prior skill
  targetSkillId: string;       // The downstream skill that depends on source
  strength: PrerequisiteStrength;
  evidence: PrerequisiteEvidence;
  notes?: string;
}

export interface LearningSkill {
  id: string;                  // e.g. "SKILL-GEN0102-001"
  canonicalName: string;       // Action verb + object + context
  description: string;         // Definition of successful performance
  skillType: SkillType;
  dominantCompetency: DominantCompetency; // KNOW | DO | APPLY | EXPLAIN | INTERPRET | MODEL
  sourceType: SkillSourceType;
  role: SkillRole;
  parentCourseId: string;      // Primary course ID (e.g. "COURSE-GEN0102")
  parentTopicId: string;       // Primary topic ID (e.g. "CURR-GEN0102-U1-T04")
  parentSubtopicIds: string[]; // Associated subtopic IDs
  prerequisiteSkillIds: string[]; // IDs of required/recommended prior skills
  masteryEvidence: string[];   // Specific observable criteria for mastery
  evidenceTypes: EvidenceType[]; // Assessment modalities supported
  difficultyFactors: string[]; // What increases task complexity
  potentialMisconceptions?: string[]; // Targeted error codes or descriptions
  transferRequired?: boolean;  // Whether cross-domain or symbolic->word transfer is expected
  engineeringContext?: string; // Explicit engineering application link if supported
  associatedOutcomeIds?: string[]; // Syllabus learning outcome references (e.g. LLO1, CILO-2)
  status: SkillStatus;
  sourceReferences: SourceReference[];
}

export interface CourseSkillMapping {
  courseId: string;
  skillId: string;
  localName?: string;
  emphasis?: string;
  sourceReference: SourceReference;
}

export interface SubtopicSkillMapping {
  subtopicId: string;
  skillId: string;
  relationship: 'PRIMARY' | 'SUPPORTING' | 'PREREQUISITE';
}

export interface CanonicalSkillDictionaryEntry {
  id: string;                  // e.g. "SKILL-DICT-001"
  canonicalSkillName: string;
  relationship: CrossCourseRelationship;
  mappedSkillIds: string[];    // Array of LearningSkill IDs across courses
  notes: string;
}

export interface CurriculumStatistics {
  totalSyllabi: number;
  totalCourses: number;
  totalUnits: number;
  totalTopics: number;
  totalSubtopics: number;
  totalContactHours: number;
  coursesWithWeeklySequencing: number;
  coursesWithExplicitUnitStructure: number;
  courseStats: Array<{
    courseId: string;
    courseCode: string;
    courseTitle: string;
    unitsCount: number;
    topicsCount: number;
    subtopicsCount: number;
    totalHours: number;
  }>;
}

export interface SkillStatistics {
  totalSkills: number;
  explicitSkillsCount: number;
  derivedSkillsCount: number;
  proposedSkillsCount: number;
  primarySkillsCount: number;
  supportingSkillsCount: number;
  skillsWithPrerequisitesCount: number;
  totalPrerequisiteEdges: number;
  skillsByCourse: Record<string, number>;
  skillsByType: Record<SkillType, number>;
  skillsByCompetency: Record<DominantCompetency, number>;
  skillsByEvidenceType: Record<EvidenceType, number>;
}

export interface ValidationIssue {
  severity: 'ERROR' | 'WARNING';
  entityType: 'COURSE' | 'UNIT' | 'TOPIC' | 'SUBTOPIC' | 'MANIFEST' | 'DICTIONARY' | 'SKILL' | 'PREREQUISITE' | 'SKILL_DICTIONARY';
  entityId: string;
  message: string;
}
