# Master Curriculum Schema & Data Architecture

**Engineering Practice Engine — Technical Architecture**  
**Document Revision**: 1.0.0  
**Date**: August 28, 2026  
**Status**: SPECIFICATION COMPLETE  

---

## 1. Architectural Philosophy

The curriculum layer establishes the authoritative boundary for the application:
```text
Syllabus (Source Document)
   ↓
Course Coverage
   ↓
Curriculum Registry (Course → Unit → Topic → Subtopic)
   ↓
[Future Extension Layers]
   ↓
Skills & Competencies
   ↓
Problem Families & Templates
   ↓
Verified Practice Questions
```

The curriculum records store **WHAT is taught**, completely decoupled from generation algorithms, AI prompts, or grading logic.

---

## 2. TypeScript Interfaces (`src/engine/curriculum/types.ts`)

```typescript
export type AssessmentPeriod = 'PRELIM' | 'MIDTERM' | 'FINAL' | 'UNSPECIFIED';

export type ExtractionConfidence = 'HIGH' | 'MEDIUM' | 'LOW' | 'REVIEW_REQUIRED';

export type CrossCourseRelationship = 
  | 'EXACT_MATCH'
  | 'NORMALIZED_MATCH'
  | 'RELATED'
  | 'PREREQUISITE'
  | 'COURSE_SPECIFIC'
  | 'DO_NOT_MERGE';

export interface SourceReference {
  syllabusId: string;
  filename: string;
  tableReference?: string;
  rowReference?: string | number;
  paragraphIndex?: number;
  pageNumber?: number;
  rawTextExtract: string;
}

export interface CurriculumCourse {
  id: string;                      // e.g. "COURSE-GEN0102"
  code: string;                    // e.g. "GEN 0102"
  title: string;                   // e.g. "Calculus 1"
  officialTitle: string;           // Exact wording from document
  credits: number;                 // e.g. 3.0
  creditType?: 'LEC' | 'LAB' | 'LEC_LAB';
  prerequisites: string[];         // e.g. ["Calculus 2"] or []
  academicYear: string;            // e.g. "2025-2026"
  term: string;                    // e.g. "First Semester"
  institution: string;             // "University of Perpetual Help System DALTA"
  college: string;                 // "College of Engineering"
  sourceSyllabusId: string;        // "SYL-001"
  description: string;
  extractionConfidence: ExtractionConfidence;
}

export interface CurriculumUnit {
  id: string;                      // e.g. "UNIT-GEN0102-U1"
  courseId: string;                // "COURSE-GEN0102"
  sequence: number;                // 1, 2, 3
  period: AssessmentPeriod;        // "PRELIM", "MIDTERM", "FINAL"
  officialName: string;            // Exact source heading
  normalizedName: string;          // Clean human-readable title
  totalHours?: number;             // Sum of topic hours
  learningOutcomesSummary?: string;
  sourceReference: SourceReference;
}

export interface CurriculumTopic {
  id: string;                      // e.g. "CURR-GEN0102-U1-T04"
  unitId: string;                  // "UNIT-GEN0102-U1"
  courseId: string;                // "COURSE-GEN0102"
  sequence: number;                // 1, 2, 3...
  officialName: string;            // Exact text from syllabus table
  normalizedName: string;          // Standardized canonical name
  hours: number;                   // Contact hours (e.g. 6)
  period: AssessmentPeriod;        // "PRELIM"
  associatedLLOs?: string[];       // e.g. ["LLO3", "LLO4"]
  canonicalTopicId?: string;       // Link to TOP-DICT-XXX
  sourceReference: SourceReference;
  subtopics: CurriculumSubtopic[];
}

export interface CurriculumSubtopic {
  id: string;                      // e.g. "SUB-GEN0102-U1-T04-S1"
  topicId: string;                 // "CURR-GEN0102-U1-T04"
  sequence: number;                // 1, 2, 3...
  officialName: string;            // Source wording
  normalizedName: string;          // Standardized name
  isExplicitInSource: boolean;     // true if in syllabus table/bullets
  sourceReference?: SourceReference;
}

export interface TopicDictionaryEntry {
  id: string;                      // e.g. "TOP-DICT-001"
  canonicalConcept: string;
  relationship: CrossCourseRelationship;
  mappedTopicIds: string[];        // Array of CurriculumTopic IDs
  notes: string;
}
```

---

## 3. Relational Database Schema (SQL DDL Equivalent)

```sql
CREATE TABLE curriculum_sources (
    syllabus_id VARCHAR(64) PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    course_code VARCHAR(64) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    academic_year VARCHAR(64),
    term VARCHAR(64),
    revision VARCHAR(64),
    extraction_status VARCHAR(32) NOT NULL,
    confidence VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE curriculum_courses (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    official_title VARCHAR(255) NOT NULL,
    credits NUMERIC(3,1) NOT NULL,
    credit_type VARCHAR(32) DEFAULT 'LEC',
    prerequisites TEXT[], -- JSON or array of course strings
    academic_year VARCHAR(64),
    term VARCHAR(64),
    institution VARCHAR(255),
    college VARCHAR(255),
    source_syllabus_id VARCHAR(64) REFERENCES curriculum_sources(syllabus_id),
    description TEXT,
    extraction_confidence VARCHAR(32) NOT NULL
);

CREATE TABLE curriculum_units (
    id VARCHAR(64) PRIMARY KEY,
    course_id VARCHAR(64) REFERENCES curriculum_courses(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    period VARCHAR(32) NOT NULL,
    official_name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    total_hours NUMERIC(4,1),
    learning_outcomes_summary TEXT,
    source_reference JSONB
);

CREATE TABLE curriculum_topics (
    id VARCHAR(64) PRIMARY KEY,
    unit_id VARCHAR(64) REFERENCES curriculum_units(id) ON DELETE CASCADE,
    course_id VARCHAR(64) REFERENCES curriculum_courses(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    official_name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    hours NUMERIC(4,1) NOT NULL,
    period VARCHAR(32) NOT NULL,
    canonical_topic_id VARCHAR(64),
    source_reference JSONB NOT NULL
);

CREATE TABLE curriculum_subtopics (
    id VARCHAR(64) PRIMARY KEY,
    topic_id VARCHAR(64) REFERENCES curriculum_topics(id) ON DELETE CASCADE,
    sequence INTEGER NOT NULL,
    official_name VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    is_explicit_in_source BOOLEAN NOT NULL,
    source_reference JSONB
);

CREATE TABLE canonical_topic_dictionary (
    id VARCHAR(64) PRIMARY KEY,
    canonical_concept VARCHAR(255) NOT NULL,
    relationship VARCHAR(32) NOT NULL,
    mapped_topic_ids TEXT[] NOT NULL,
    notes TEXT
);
```
