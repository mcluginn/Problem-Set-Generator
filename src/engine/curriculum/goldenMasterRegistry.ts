/**
 * Course Coverage Master Problem Bank (780 Calibrated Problems) Curriculum Registry
 * Automatically generated from authoritative 780 problems across 260 clusters.
 * Differential Equations (COURSE-GEN0107) is strictly preserved untouched in its original files.
 */

import { CurriculumUnit, CurriculumTopic, LearningSkill } from './types';

import {
  CLUSTER_TO_SYLLABUS_SKILL_MAP,
  CLUSTER_TO_SYLLABUS_TOPIC_MAP,
  SYLLABUS_SKILL_TO_CLUSTERS_MAP,
  SYLLABUS_TOPIC_TO_CLUSTERS_MAP
} from './masterBankMappings';

export {
  CLUSTER_TO_SYLLABUS_SKILL_MAP,
  CLUSTER_TO_SYLLABUS_TOPIC_MAP,
  SYLLABUS_SKILL_TO_CLUSTERS_MAP,
  SYLLABUS_TOPIC_TO_CLUSTERS_MAP
};

/**
 * Maps each syllabus skill to its primary/canonical 780 master cluster.
 * Extends backward-compatible mapping to cover all 5 syllabi courses.
 */
export const LEGACY_SKILL_TO_CLUSTER_MAP: Record<string, string> = {
  // Calculus 1
  'SKILL-GEN0102-001': 'GEN0102-U1-LIM',
  'SKILL-GEN0102-002': 'GEN0102-U1-DIFF',
  'SKILL-GEN0102-003': 'GEN0102-U1-DIFF',
  'SKILL-GEN0102-004': 'GEN0102-U1-DIFF',
  'SKILL-GEN0102-005': 'GEN0102-U1-DIFF',
  'SKILL-GEN0102-006': 'GEN0102-U2-INV',
  'SKILL-GEN0102-007': 'GEN0102-U2-LOG',
  'SKILL-GEN0102-008': 'GEN0102-U2-LOG',
  'SKILL-GEN0102-009': 'GEN0102-U2-IMP',
  'SKILL-GEN0102-010': 'GEN0102-U2-IMP',
  'SKILL-GEN0102-011': 'GEN0102-U1-DIFF',
  'SKILL-GEN0102-012': 'GEN0102-U3-CRV',
  'SKILL-GEN0102-013': 'GEN0102-U3-CRV',
  'SKILL-GEN0102-014': 'GEN0102-U3-OPT',
  'SKILL-GEN0102-015': 'GEN0102-U3-RATE',
  // Dynamically populated primary cluster for every syllabus skill
  ...Object.fromEntries(
    Object.entries(SYLLABUS_SKILL_TO_CLUSTERS_MAP).map(([skId, clusters]) => [skId, clusters[0]])
  )
};

export function getClustersForSkill(skillId: string): string[] {
  if (SYLLABUS_SKILL_TO_CLUSTERS_MAP[skillId]) {
    return SYLLABUS_SKILL_TO_CLUSTERS_MAP[skillId];
  }
  const alias = LEGACY_SKILL_TO_CLUSTER_MAP[skillId];
  if (alias) return [alias];
  // Direct cluster check
  if (CLUSTER_TO_SYLLABUS_SKILL_MAP[skillId]) {
    return [skillId];
  }
  return [];
}

export function getClustersForTopic(topicId: string): string[] {
  if (SYLLABUS_TOPIC_TO_CLUSTERS_MAP[topicId]) {
    return SYLLABUS_TOPIC_TO_CLUSTERS_MAP[topicId];
  }
  if (CLUSTER_TO_SYLLABUS_TOPIC_MAP[topicId]) {
    return [topicId];
  }
  return [];
}

export function getSkillForCluster(clusterId: string): string | undefined {
  return CLUSTER_TO_SYLLABUS_SKILL_MAP[clusterId];
}

export function getTopicForCluster(clusterId: string): string | undefined {
  return CLUSTER_TO_SYLLABUS_TOPIC_MAP[clusterId];
}


export const GOLDEN_MASTER_NON_DIFFEQ_UNITS: CurriculumUnit[] = [
  {
    id: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 1,
    period: "PRELIM",
    officialName: "Engineering Economics & Capital Budgeting",
    normalizedName: "Engineering Economics & Capital Budgeting",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Engineering Economics & Capital Budgeting",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics & Capital Budgeting"
    }
  },
  {
    id: "BSIE3219-U2",
    courseId: "COURSE-BSIE3219",
    sequence: 2,
    period: "MIDTERM",
    officialName: "Engineering Mechanics & Dynamics",
    normalizedName: "Engineering Mechanics & Dynamics",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Engineering Mechanics & Dynamics",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Mechanics & Dynamics"
    }
  },
  {
    id: "BSIE3219-U3",
    courseId: "COURSE-BSIE3219",
    sequence: 3,
    period: "FINAL",
    officialName: "Operations Research, Optimization & Industrial Sizing",
    normalizedName: "Operations Research, Optimization & Industrial Sizing",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Operations Research, Optimization & Industrial Sizing",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Operations Research, Optimization & Industrial Sizing"
    }
  },
  {
    id: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 4,
    period: "FINAL",
    officialName: "Machine Design, Materials, Ergonomics & Systems Engineering",
    normalizedName: "Machine Design, Materials, Ergonomics & Systems Engineering",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Machine Design, Materials, Ergonomics & Systems Engineering",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Machine Design, Materials, Ergonomics & Systems Engineering"
    }
  },
  {
    id: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 1,
    period: "PRELIM",
    officialName: "Algebraic Foundations, Factorization & Systems",
    normalizedName: "Algebraic Foundations, Factorization & Systems",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Algebraic Foundations, Factorization & Systems",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Algebraic Foundations, Factorization & Systems"
    }
  },
  {
    id: "GEN0101-U2",
    courseId: "COURSE-GEN0101",
    sequence: 2,
    period: "MIDTERM",
    officialName: "Trigonometry & Oblique Triangles",
    normalizedName: "Trigonometry & Oblique Triangles",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Trigonometry & Oblique Triangles",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Trigonometry & Oblique Triangles"
    }
  },
  {
    id: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 3,
    period: "FINAL",
    officialName: "Exponentials, Logarithms & Conics",
    normalizedName: "Exponentials, Logarithms & Conics",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Exponentials, Logarithms & Conics",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Exponentials, Logarithms & Conics"
    }
  },
  {
    id: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 4,
    period: "FINAL",
    officialName: "Numerical Analysis & Applied Methods",
    normalizedName: "Numerical Analysis & Applied Methods",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Numerical Analysis & Applied Methods",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Numerical Analysis & Applied Methods"
    }
  },
  {
    id: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 1,
    period: "PRELIM",
    officialName: "Limits & Continuity",
    normalizedName: "Limits & Continuity",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Limits & Continuity",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Limits & Continuity"
    }
  },
  {
    id: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 2,
    period: "MIDTERM",
    officialName: "Differentiation & Transcendental Applications",
    normalizedName: "Differentiation & Transcendental Applications",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Differentiation & Transcendental Applications",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation & Transcendental Applications"
    }
  },
  {
    id: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 3,
    period: "FINAL",
    officialName: "Integral Calculus & Definite Integral Applications",
    normalizedName: "Integral Calculus & Definite Integral Applications",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Integral Calculus & Definite Integral Applications",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Integral Calculus & Definite Integral Applications"
    }
  },
  {
    id: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 1,
    period: "PRELIM",
    officialName: "Electrostatics & Charge Mechanics",
    normalizedName: "Electrostatics & Charge Mechanics",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Electrostatics & Charge Mechanics",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electrostatics & Charge Mechanics"
    }
  },
  {
    id: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 2,
    period: "MIDTERM",
    officialName: "Circuits, Electromagnetism, Optics & Waves",
    normalizedName: "Circuits, Electromagnetism, Optics & Waves",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Circuits, Electromagnetism, Optics & Waves",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Circuits, Electromagnetism, Optics & Waves"
    }
  },
  {
    id: "GEN0110-U3",
    courseId: "COURSE-GEN0110",
    sequence: 3,
    period: "FINAL",
    officialName: "Modern Physics & Quantum Phenomena",
    normalizedName: "Modern Physics & Quantum Phenomena",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Modern Physics & Quantum Phenomena",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Modern Physics & Quantum Phenomena"
    }
  },
  {
    id: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 1,
    period: "PRELIM",
    officialName: "Thermodynamic Laws, Pure Substances & Steam",
    normalizedName: "Thermodynamic Laws, Pure Substances & Steam",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Thermodynamic Laws, Pure Substances & Steam",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermodynamic Laws, Pure Substances & Steam"
    }
  },
  {
    id: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 2,
    period: "MIDTERM",
    officialName: "Power Cycles, Heat Transfer, HVAC & Fluid Mechanics",
    normalizedName: "Power Cycles, Heat Transfer, HVAC & Fluid Mechanics",
    totalHours: 18,
    learningOutcomesSummary: "Covers authoritative competencies for Power Cycles, Heat Transfer, HVAC & Fluid Mechanics",
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Power Cycles, Heat Transfer, HVAC & Fluid Mechanics"
    }
  },
];

export const GOLDEN_MASTER_NON_DIFFEQ_TOPICS: CurriculumTopic[] = [
  {
    id: "BSIE3219-U1-CMB",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 1,
    officialName: "Combinatorics: Permutations vs Combinations",
    normalizedName: "Combinatorics: Permutations vs Combinations",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Combinatorics: Permutations vs Combinations"
    }
  },
  {
    id: "BSIE3219-U1-SEQ",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 2,
    officialName: "Progressions: Arithmetic Progression n-th Term and Series Sum",
    normalizedName: "Progressions: Arithmetic Progression n-th Term and Series Sum",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Progressions: Arithmetic Progression n-th Term and Series Sum"
    }
  },
  {
    id: "BSIE3219-U1-INT",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 3,
    officialName: "Engineering Economics: Simple vs Compound Interest Accumulation",
    normalizedName: "Engineering Economics: Simple vs Compound Interest Accumulation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Simple vs Compound Interest Accumulation"
    }
  },
  {
    id: "BSIE3219-U1-EFF",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 4,
    officialName: "Engineering Economics: Effective Annual Interest Rate from Compounding Frequency",
    normalizedName: "Engineering Economics: Effective Annual Interest Rate from Compounding Frequency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Effective Annual Interest Rate from Compounding Frequency"
    }
  },
  {
    id: "BSIE3219-U1-BEP",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 5,
    officialName: "Engineering Economics: Linear Break-Even Production Volume",
    normalizedName: "Engineering Economics: Linear Break-Even Production Volume",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Linear Break-Even Production Volume"
    }
  },
  {
    id: "BSIE3219-U1-GRD",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 6,
    officialName: "Engineering Economics: Present Worth of an Arithmetic Gradient Series",
    normalizedName: "Engineering Economics: Present Worth of an Arithmetic Gradient Series",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Present Worth of an Arithmetic Gradient Series"
    }
  },
  {
    id: "BSIE3219-U1-DEP",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 7,
    officialName: "Engineering Economics: Straight-Line Depreciation & Book Value",
    normalizedName: "Engineering Economics: Straight-Line Depreciation & Book Value",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Straight-Line Depreciation & Book Value"
    }
  },
  {
    id: "BSIE3219-U1-CAP",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 8,
    officialName: "Engineering Economics: Capitalized Cost for Infinite Service Life",
    normalizedName: "Engineering Economics: Capitalized Cost for Infinite Service Life",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Capitalized Cost for Infinite Service Life"
    }
  },
  {
    id: "BSIE3219-U1-BND",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 9,
    officialName: "Engineering Economy: Bond Purchase Price at Par and Yield",
    normalizedName: "Engineering Economy: Bond Purchase Price at Par and Yield",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economy: Bond Purchase Price at Par and Yield"
    }
  },
  {
    id: "BSIE3219-U1-BCR",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 10,
    officialName: "Engineering Economics: Conventional Benefit-Cost Ratio (B/C)",
    normalizedName: "Engineering Economics: Conventional Benefit-Cost Ratio (B/C)",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Conventional Benefit-Cost Ratio (B/C)"
    }
  },
  {
    id: "BSIE3219-U1-DPR",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 11,
    officialName: "Engineering Economics: Straight-Line Depreciation Schedule",
    normalizedName: "Engineering Economics: Straight-Line Depreciation Schedule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Straight-Line Depreciation Schedule"
    }
  },
  {
    id: "BSIE3219-U1-DOT",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 12,
    officialName: "Vectors: Algebraic Dot Product of Two 2D Vectors",
    normalizedName: "Vectors: Algebraic Dot Product of Two 2D Vectors",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vectors: Algebraic Dot Product of Two 2D Vectors"
    }
  },
  {
    id: "BSIE3219-U1-CNT",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 13,
    officialName: "Combinatorics: Fundamental Multiplication Counting Principle",
    normalizedName: "Combinatorics: Fundamental Multiplication Counting Principle",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Combinatorics: Fundamental Multiplication Counting Principle"
    }
  },
  {
    id: "BSIE3219-U1-SNK",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 14,
    officialName: "Engineering Economics: Sinking Fund Annual Deposit Factor (A/F)",
    normalizedName: "Engineering Economics: Sinking Fund Annual Deposit Factor (A/F)",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Sinking Fund Annual Deposit Factor (A/F)"
    }
  },
  {
    id: "BSIE3219-U1-BKE",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 15,
    officialName: "Engineering Economics: Linear Break-Even Production Volume",
    normalizedName: "Engineering Economics: Linear Break-Even Production Volume",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Linear Break-Even Production Volume"
    }
  },
  {
    id: "BSIE3219-U1-CMPX",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 16,
    officialName: "Complex Numbers: Multiplication of Complex Numbers",
    normalizedName: "Complex Numbers: Multiplication of Complex Numbers",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Complex Numbers: Multiplication of Complex Numbers"
    }
  },
  {
    id: "BSIE3219-U1-HYP",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 17,
    officialName: "Combinatorics: Combinations Formula & Complementary Symmetry",
    normalizedName: "Combinatorics: Combinations Formula & Complementary Symmetry",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Combinatorics: Combinations Formula & Complementary Symmetry"
    }
  },
  {
    id: "BSIE3219-U1-INF",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 18,
    officialName: "Progressions: Infinite Geometric Series Direct Summation",
    normalizedName: "Progressions: Infinite Geometric Series Direct Summation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Progressions: Infinite Geometric Series Direct Summation"
    }
  },
  {
    id: "BSIE3219-U1-EAR",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 19,
    officialName: "Engineering Economics: Effective Annual Interest Rate (Monthly Compounding)",
    normalizedName: "Engineering Economics: Effective Annual Interest Rate (Monthly Compounding)",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Effective Annual Interest Rate (Monthly Compounding)"
    }
  },
  {
    id: "BSIE3219-U1-MAT",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 20,
    officialName: "Matrices & Vectors: 2x2 Matrix Addition and Subtraction",
    normalizedName: "Matrices & Vectors: 2x2 Matrix Addition and Subtraction",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Matrices & Vectors: 2x2 Matrix Addition and Subtraction"
    }
  },
  {
    id: "BSIE3219-U1-DET",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 21,
    officialName: "Matrices & Vectors: 2x2 Matrix Multiplication",
    normalizedName: "Matrices & Vectors: 2x2 Matrix Multiplication",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Matrices & Vectors: 2x2 Matrix Multiplication"
    }
  },
  {
    id: "BSIE3219-U1-UAG",
    unitId: "BSIE3219-U1",
    courseId: "COURSE-BSIE3219",
    sequence: 22,
    officialName: "Engineering Economics: Arithmetic Gradient Cash Flow Identification",
    normalizedName: "Engineering Economics: Arithmetic Gradient Cash Flow Identification",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Arithmetic Gradient Cash Flow Identification"
    }
  },
  {
    id: "BSIE3219-U2-PAR",
    unitId: "BSIE3219-U2",
    courseId: "COURSE-BSIE3219",
    sequence: 1,
    officialName: "Analytic Geometry: Parabola Vertex, Focus & Directrix",
    normalizedName: "Analytic Geometry: Parabola Vertex, Focus & Directrix",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Parabola Vertex, Focus & Directrix"
    }
  },
  {
    id: "BSIE3219-U2-CRC",
    unitId: "BSIE3219-U2",
    courseId: "COURSE-BSIE3219",
    sequence: 2,
    officialName: "Analytic Geometry: Standard Center-Radius Circle Equation",
    normalizedName: "Analytic Geometry: Standard Center-Radius Circle Equation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Standard Center-Radius Circle Equation"
    }
  },
  {
    id: "BSIE3219-U2-ELP",
    unitId: "BSIE3219-U2",
    courseId: "COURSE-BSIE3219",
    sequence: 3,
    officialName: "Analytic Geometry: Ellipse Standard Parameters & Foci Distance",
    normalizedName: "Analytic Geometry: Ellipse Standard Parameters & Foci Distance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Ellipse Standard Parameters & Foci Distance"
    }
  },
  {
    id: "BSIE3219-U2-HYPR",
    unitId: "BSIE3219-U2",
    courseId: "COURSE-BSIE3219",
    sequence: 4,
    officialName: "Analytic Geometry: Standard Hyperbola Foci & Vertices",
    normalizedName: "Analytic Geometry: Standard Hyperbola Foci & Vertices",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Standard Hyperbola Foci & Vertices"
    }
  },
  {
    id: "BSIE3219-U2-FRS",
    unitId: "BSIE3219-U2",
    courseId: "COURSE-BSIE3219",
    sequence: 5,
    officialName: "Solid Mensuration: Frustum of a Right Circular Cone Volume",
    normalizedName: "Solid Mensuration: Frustum of a Right Circular Cone Volume",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Frustum of a Right Circular Cone Volume"
    }
  },
  {
    id: "BSIE3219-U3-SLD",
    unitId: "BSIE3219-U3",
    courseId: "COURSE-BSIE3219",
    sequence: 1,
    officialName: "Solid Geometry: Right Regular Hexagonal Prism Volume & Lateral Area",
    normalizedName: "Solid Geometry: Right Regular Hexagonal Prism Volume & Lateral Area",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Geometry: Right Regular Hexagonal Prism Volume & Lateral Area"
    }
  },
  {
    id: "BSIE3219-U3-FIN",
    unitId: "BSIE3219-U3",
    courseId: "COURSE-BSIE3219",
    sequence: 2,
    officialName: "Engineering Economics: Net Present Value (NPV) Discounted Cash Flow",
    normalizedName: "Engineering Economics: Net Present Value (NPV) Discounted Cash Flow",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Net Present Value (NPV) Discounted Cash Flow"
    }
  },
  {
    id: "BSIE3219-U3-PWR",
    unitId: "BSIE3219-U3",
    courseId: "COURSE-BSIE3219",
    sequence: 3,
    officialName: "Integral Calculus: Indefinite Integration Power Rule",
    normalizedName: "Integral Calculus: Indefinite Integration Power Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Integral Calculus: Indefinite Integration Power Rule"
    }
  },
  {
    id: "BSIE3219-U3-DEF",
    unitId: "BSIE3219-U3",
    courseId: "COURSE-BSIE3219",
    sequence: 4,
    officialName: "Integral Calculus: Fundamental Theorem of Calculus Definite Integral",
    normalizedName: "Integral Calculus: Fundamental Theorem of Calculus Definite Integral",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Integral Calculus: Fundamental Theorem of Calculus Definite Integral"
    }
  },
  {
    id: "BSIE3219-U4-KIN",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 1,
    officialName: "Applied Mechanics: Free Fall Maximum Height & Flight Time",
    normalizedName: "Applied Mechanics: Free Fall Maximum Height & Flight Time",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Free Fall Maximum Height & Flight Time"
    }
  },
  {
    id: "BSIE3219-U4-CIR",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 2,
    officialName: "Applied Mechanics: Centripetal Acceleration and Centripetal Force",
    normalizedName: "Applied Mechanics: Centripetal Acceleration and Centripetal Force",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Centripetal Acceleration and Centripetal Force"
    }
  },
  {
    id: "BSIE3219-U4-COP",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 3,
    officialName: "Applied Mechanics: Concurrent Coplanar Force Equilibrium",
    normalizedName: "Applied Mechanics: Concurrent Coplanar Force Equilibrium",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Concurrent Coplanar Force Equilibrium"
    }
  },
  {
    id: "BSIE3219-U4-REC",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 4,
    officialName: "Applied Mechanics: Constant Acceleration Velocity-Displacement Relation",
    normalizedName: "Applied Mechanics: Constant Acceleration Velocity-Displacement Relation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Constant Acceleration Velocity-Displacement Relation"
    }
  },
  {
    id: "BSIE3219-U4-FRC",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 5,
    officialName: "Applied Mechanics: Horizontal Static Friction Threshold",
    normalizedName: "Applied Mechanics: Horizontal Static Friction Threshold",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Horizontal Static Friction Threshold"
    }
  },
  {
    id: "BSIE3219-U4-DRP",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 6,
    officialName: "Applied Mechanics: Free Fall from Rest Velocity and Drop Distance",
    normalizedName: "Applied Mechanics: Free Fall from Rest Velocity and Drop Distance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Free Fall from Rest Velocity and Drop Distance"
    }
  },
  {
    id: "BSIE3219-U4-PRJ",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 7,
    officialName: "Applied Mechanics: Projectile Maximum Height and Total Flight Time",
    normalizedName: "Applied Mechanics: Projectile Maximum Height and Total Flight Time",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Projectile Maximum Height and Total Flight Time"
    }
  },
  {
    id: "BSIE3219-U4-BNK",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 8,
    officialName: "Applied Mechanics: Centripetal Acceleration on a Circular Curve",
    normalizedName: "Applied Mechanics: Centripetal Acceleration on a Circular Curve",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Centripetal Acceleration on a Circular Curve"
    }
  },
  {
    id: "BSIE3219-U4-WRK",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 9,
    officialName: "Applied Mechanics: Work-Energy Theorem Constant Force Braking",
    normalizedName: "Applied Mechanics: Work-Energy Theorem Constant Force Braking",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Work-Energy Theorem Constant Force Braking"
    }
  },
  {
    id: "BSIE3219-U4-TRS",
    unitId: "BSIE3219-U4",
    courseId: "COURSE-BSIE3219",
    sequence: 10,
    officialName: "Applied Mechanics: Pin-Jointed Planar Truss Zero-Force Member Inspection",
    normalizedName: "Applied Mechanics: Pin-Jointed Planar Truss Zero-Force Member Inspection",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Pin-Jointed Planar Truss Zero-Force Member Inspection"
    }
  },
  {
    id: "GEN0101-U1-ARITH",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 1,
    officialName: "Arithmetic Fluency: Canonical Prime Factorization",
    normalizedName: "Arithmetic Fluency: Canonical Prime Factorization",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Canonical Prime Factorization"
    }
  },
  {
    id: "GEN0101-U1-FRAC",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 2,
    officialName: "Fractions & Decimals: Conversion of Repeating Decimal to Rational Fraction",
    normalizedName: "Fractions & Decimals: Conversion of Repeating Decimal to Rational Fraction",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fractions & Decimals: Conversion of Repeating Decimal to Rational Fraction"
    }
  },
  {
    id: "GEN0101-U1-VAR",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 3,
    officialName: "Variation & Proportion: Direct and Inverse Variation",
    normalizedName: "Variation & Proportion: Direct and Inverse Variation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Variation & Proportion: Direct and Inverse Variation"
    }
  },
  {
    id: "GEN0101-U1-WRK",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 4,
    officialName: "Applied Word Problems: Combined Work Rate",
    normalizedName: "Applied Word Problems: Combined Work Rate",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Combined Work Rate"
    }
  },
  {
    id: "GEN0101-U1-MOT",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 5,
    officialName: "Applied Word Problems: Uniform Motion in Opposing Directions",
    normalizedName: "Applied Word Problems: Uniform Motion in Opposing Directions",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Uniform Motion in Opposing Directions"
    }
  },
  {
    id: "GEN0101-U1-CLK",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 6,
    officialName: "Applied Word Problems: Clock Hands Coincident Alignment",
    normalizedName: "Applied Word Problems: Clock Hands Coincident Alignment",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Clock Hands Coincident Alignment"
    }
  },
  {
    id: "GEN0101-U1-MIX",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 7,
    officialName: "Applied Word Problems: Two-Component Chemical Solution Blending",
    normalizedName: "Applied Word Problems: Two-Component Chemical Solution Blending",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Two-Component Chemical Solution Blending"
    }
  },
  {
    id: "GEN0101-U1-SYS",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 8,
    officialName: "Systems of Equations: Linear and Quadratic Intersection",
    normalizedName: "Systems of Equations: Linear and Quadratic Intersection",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Systems of Equations: Linear and Quadratic Intersection"
    }
  },
  {
    id: "GEN0101-U1-RAD",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 9,
    officialName: "Laws of Exponents: Evaluation of Fractional Exponents",
    normalizedName: "Laws of Exponents: Evaluation of Fractional Exponents",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Laws of Exponents: Evaluation of Fractional Exponents"
    }
  },
  {
    id: "GEN0101-U1-TRP",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 10,
    officialName: "Basic Algebra: Formula Transposition for a Single Variable",
    normalizedName: "Basic Algebra: Formula Transposition for a Single Variable",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Formula Transposition for a Single Variable"
    }
  },
  {
    id: "GEN0101-U1-ORD",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 11,
    officialName: "Arithmetic Fluency: Standard Order of Operations (PEMDAS)",
    normalizedName: "Arithmetic Fluency: Standard Order of Operations (PEMDAS)",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Standard Order of Operations (PEMDAS)"
    }
  },
  {
    id: "GEN0101-U1-RAT",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 12,
    officialName: "Percentage, Ratio & Proportion: Partitive Proportion Division",
    normalizedName: "Percentage, Ratio & Proportion: Partitive Proportion Division",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Percentage, Ratio & Proportion: Partitive Proportion Division"
    }
  },
  {
    id: "GEN0101-U1-FCT",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 13,
    officialName: "Basic Algebra: Factoring Monic Quadratic Trinomials",
    normalizedName: "Basic Algebra: Factoring Monic Quadratic Trinomials",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Factoring Monic Quadratic Trinomials"
    }
  },
  {
    id: "GEN0101-U1-LEQ",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 14,
    officialName: "Basic Algebra: Linear Equations with Parentheses",
    normalizedName: "Basic Algebra: Linear Equations with Parentheses",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Linear Equations with Parentheses"
    }
  },
  {
    id: "GEN0101-U1-QEQ",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 15,
    officialName: "Polynomial Equations: Discriminant Evaluation & Nature of Roots",
    normalizedName: "Polynomial Equations: Discriminant Evaluation & Nature of Roots",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Polynomial Equations: Discriminant Evaluation & Nature of Roots"
    }
  },
  {
    id: "GEN0101-U1-RTQ",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 16,
    officialName: "Basic Algebra: Simple Rational Equation by Cross-Multiplication",
    normalizedName: "Basic Algebra: Simple Rational Equation by Cross-Multiplication",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Simple Rational Equation by Cross-Multiplication"
    }
  },
  {
    id: "GEN0101-U1-PCT",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 17,
    officialName: "Percentage, Ratio & Proportion: Percentage Increase and Decrease",
    normalizedName: "Percentage, Ratio & Proportion: Percentage Increase and Decrease",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Percentage, Ratio & Proportion: Percentage Increase and Decrease"
    }
  },
  {
    id: "GEN0101-U1-DOM",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 18,
    officialName: "Functions & Models: Domain of a Square Root Radical Function",
    normalizedName: "Functions & Models: Domain of a Square Root Radical Function",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Functions & Models: Domain of a Square Root Radical Function"
    }
  },
  {
    id: "GEN0101-U1-ABS",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 19,
    officialName: "Arithmetic Fluency: Absolute Value Numerical Evaluation",
    normalizedName: "Arithmetic Fluency: Absolute Value Numerical Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Absolute Value Numerical Evaluation"
    }
  },
  {
    id: "GEN0101-U1-EXP",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 20,
    officialName: "Laws of Exponents: Zero and Negative Integer Exponents",
    normalizedName: "Laws of Exponents: Zero and Negative Integer Exponents",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Laws of Exponents: Zero and Negative Integer Exponents"
    }
  },
  {
    id: "GEN0101-U1-LINQ",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 21,
    officialName: "Polynomial Inequalities: One-Step Linear Inequality",
    normalizedName: "Polynomial Inequalities: One-Step Linear Inequality",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Polynomial Inequalities: One-Step Linear Inequality"
    }
  },
  {
    id: "GEN0101-U1-CFX",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 22,
    officialName: "Fractions & Decimals: Numerical Complex Fraction Evaluation",
    normalizedName: "Fractions & Decimals: Numerical Complex Fraction Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fractions & Decimals: Numerical Complex Fraction Evaluation"
    }
  },
  {
    id: "GEN0101-U1-VRP",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 23,
    officialName: "Percentage, Ratio & Proportion: Direct Variation Constant Evaluation",
    normalizedName: "Percentage, Ratio & Proportion: Direct Variation Constant Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Percentage, Ratio & Proportion: Direct Variation Constant Evaluation"
    }
  },
  {
    id: "GEN0101-U1-SYS2",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 24,
    officialName: "Linear Systems: 2x2 System Solution by Direct Elimination",
    normalizedName: "Linear Systems: 2x2 System Solution by Direct Elimination",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Linear Systems: 2x2 System Solution by Direct Elimination"
    }
  },
  {
    id: "GEN0101-U1-LOGQ",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 25,
    officialName: "Logarithmic & Exponential: Basic Exponential Equation with Common Base",
    normalizedName: "Logarithmic & Exponential: Basic Exponential Equation with Common Base",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Logarithmic & Exponential: Basic Exponential Equation with Common Base"
    }
  },
  {
    id: "GEN0101-U1-AIR",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 26,
    officialName: "Applied Word Problems: Effective Ground Speed with Wind",
    normalizedName: "Applied Word Problems: Effective Ground Speed with Wind",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Effective Ground Speed with Wind"
    }
  },
  {
    id: "GEN0101-U1-DIM",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 27,
    officialName: "Arithmetic Fluency: Multi-Step Dimensional Analysis Unit Conversion Chain",
    normalizedName: "Arithmetic Fluency: Multi-Step Dimensional Analysis Unit Conversion Chain",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Multi-Step Dimensional Analysis Unit Conversion Chain"
    }
  },
  {
    id: "GEN0101-U1-LIT",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 28,
    officialName: "Formula Transposition: Kinetic Energy Velocity Transposition",
    normalizedName: "Formula Transposition: Kinetic Energy Velocity Transposition",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Formula Transposition: Kinetic Energy Velocity Transposition"
    }
  },
  {
    id: "GEN0101-U1-ALM",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 29,
    officialName: "Applied Word Problems: Two-Solution Direct Concentration Blending",
    normalizedName: "Applied Word Problems: Two-Solution Direct Concentration Blending",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Two-Solution Direct Concentration Blending"
    }
  },
  {
    id: "GEN0101-U1-PRM",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 30,
    officialName: "Arithmetic Fluency: Prime Factorization of Composite Integers",
    normalizedName: "Arithmetic Fluency: Prime Factorization of Composite Integers",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Prime Factorization of Composite Integers"
    }
  },
  {
    id: "GEN0101-U1-MXF",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 31,
    officialName: "Fractions & Decimals: Addition and Subtraction of Mixed Numbers",
    normalizedName: "Fractions & Decimals: Addition and Subtraction of Mixed Numbers",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fractions & Decimals: Addition and Subtraction of Mixed Numbers"
    }
  },
  {
    id: "GEN0101-U1-SCL",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 32,
    officialName: "Percentage, Ratio & Proportion: Continuous Ratio Simplification",
    normalizedName: "Percentage, Ratio & Proportion: Continuous Ratio Simplification",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Percentage, Ratio & Proportion: Continuous Ratio Simplification"
    }
  },
  {
    id: "GEN0101-U1-SYN",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 33,
    officialName: "Polynomial Equations: Synthetic Division Remainder Theorem Evaluation",
    normalizedName: "Polynomial Equations: Synthetic Division Remainder Theorem Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Polynomial Equations: Synthetic Division Remainder Theorem Evaluation"
    }
  },
  {
    id: "GEN0101-U1-PROD",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 34,
    officialName: "Basic Algebra: Perfect Square Trinomial Expansion",
    normalizedName: "Basic Algebra: Perfect Square Trinomial Expansion",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Perfect Square Trinomial Expansion"
    }
  },
  {
    id: "GEN0101-U1-CKA",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 35,
    officialName: "Applied Word Problems: Clock Hand Angular Speeds",
    normalizedName: "Applied Word Problems: Clock Hand Angular Speeds",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Clock Hand Angular Speeds"
    }
  },
  {
    id: "GEN0101-U1-DET",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 36,
    officialName: "Linear Algebra: 2x2 Determinants & Matrix Inversion",
    normalizedName: "Linear Algebra: 2x2 Determinants & Matrix Inversion",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Linear Algebra: 2x2 Determinants & Matrix Inversion"
    }
  },
  {
    id: "GEN0101-U1-PF",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 37,
    officialName: "Partial Fraction Decomposition: Distinct Linear Factors",
    normalizedName: "Partial Fraction Decomposition: Distinct Linear Factors",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Partial Fraction Decomposition: Distinct Linear Factors"
    }
  },
  {
    id: "GEN0101-U1-BIN",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 38,
    officialName: "Binomial Expansion: Specific Term Extraction",
    normalizedName: "Binomial Expansion: Specific Term Extraction",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Binomial Expansion: Specific Term Extraction"
    }
  },
  {
    id: "GEN0101-U1-ANN",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 39,
    officialName: "Engineering Economics: Future Value of an Ordinary Annuity",
    normalizedName: "Engineering Economics: Future Value of an Ordinary Annuity",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Future Value of an Ordinary Annuity"
    }
  },
  {
    id: "GEN0101-U1-APS",
    unitId: "GEN0101-U1",
    courseId: "COURSE-GEN0101",
    sequence: 40,
    officialName: "Progressions: Sum of First n Positive Integers",
    normalizedName: "Progressions: Sum of First n Positive Integers",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Progressions: Sum of First n Positive Integers"
    }
  },
  {
    id: "GEN0101-U2-HARM",
    unitId: "GEN0101-U2",
    courseId: "COURSE-GEN0101",
    sequence: 1,
    officialName: "Trigonometry: Double Angle & Sum-to-Product Reductions",
    normalizedName: "Trigonometry: Double Angle & Sum-to-Product Reductions",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Trigonometry: Double Angle & Sum-to-Product Reductions"
    }
  },
  {
    id: "GEN0101-U2-TRIG",
    unitId: "GEN0101-U2",
    courseId: "COURSE-GEN0101",
    sequence: 2,
    officialName: "Oblique Triangles: Direct Law of Cosines",
    normalizedName: "Oblique Triangles: Direct Law of Cosines",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Oblique Triangles: Direct Law of Cosines"
    }
  },
  {
    id: "GEN0101-U2-ELV",
    unitId: "GEN0101-U2",
    courseId: "COURSE-GEN0101",
    sequence: 3,
    officialName: "Engineering Trigonometry: Angle of Elevation Height Calculation",
    normalizedName: "Engineering Trigonometry: Angle of Elevation Height Calculation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Trigonometry: Angle of Elevation Height Calculation"
    }
  },
  {
    id: "GEN0101-U2-RTR",
    unitId: "GEN0101-U2",
    courseId: "COURSE-GEN0101",
    sequence: 4,
    officialName: "Right-Triangle Principles: Trigonometric Ratios for Missing Side",
    normalizedName: "Right-Triangle Principles: Trigonometric Ratios for Missing Side",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Right-Triangle Principles: Trigonometric Ratios for Missing Side"
    }
  },
  {
    id: "GEN0101-U2-SSA",
    unitId: "GEN0101-U2",
    courseId: "COURSE-GEN0101",
    sequence: 5,
    officialName: "Oblique Triangles: Law of Sines Direct Angle Calculation",
    normalizedName: "Oblique Triangles: Law of Sines Direct Angle Calculation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Oblique Triangles: Law of Sines Direct Angle Calculation"
    }
  },
  {
    id: "GEN0101-U2-IDN",
    unitId: "GEN0101-U2",
    courseId: "COURSE-GEN0101",
    sequence: 6,
    officialName: "Engineering Trigonometry: Pythagorean Identity Cosine Evaluation",
    normalizedName: "Engineering Trigonometry: Pythagorean Identity Cosine Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Trigonometry: Pythagorean Identity Cosine Evaluation"
    }
  },
  {
    id: "GEN0101-U3-DST",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 1,
    officialName: "Analytic Geometry: Perpendicular Distance from a Point to a Line",
    normalizedName: "Analytic Geometry: Perpendicular Distance from a Point to a Line",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Perpendicular Distance from a Point to a Line"
    }
  },
  {
    id: "GEN0101-U3-ANG",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 2,
    officialName: "Analytic Geometry: Acute Angle Between Two Intersecting Lines",
    normalizedName: "Analytic Geometry: Acute Angle Between Two Intersecting Lines",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Acute Angle Between Two Intersecting Lines"
    }
  },
  {
    id: "GEN0101-U3-LIN",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 3,
    officialName: "Rectangular Coordinates: Distance and Midpoint of a Line Segment",
    normalizedName: "Rectangular Coordinates: Distance and Midpoint of a Line Segment",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Rectangular Coordinates: Distance and Midpoint of a Line Segment"
    }
  },
  {
    id: "GEN0101-U3-SEC",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 4,
    officialName: "Rectangular Coordinates: Internal Ratio Division of a Line Segment",
    normalizedName: "Rectangular Coordinates: Internal Ratio Division of a Line Segment",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Rectangular Coordinates: Internal Ratio Division of a Line Segment"
    }
  },
  {
    id: "GEN0101-U3-PTL",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 5,
    officialName: "Rectangular Coordinates: Point-to-Line Perpendicular Distance",
    normalizedName: "Rectangular Coordinates: Point-to-Line Perpendicular Distance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Rectangular Coordinates: Point-to-Line Perpendicular Distance"
    }
  },
  {
    id: "GEN0101-U3-LNA",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 6,
    officialName: "Rectangular Coordinates: Acute Angle Between Two Straight Lines",
    normalizedName: "Rectangular Coordinates: Acute Angle Between Two Straight Lines",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Rectangular Coordinates: Acute Angle Between Two Straight Lines"
    }
  },
  {
    id: "GEN0101-U3-CON",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 7,
    officialName: "Conic Sections: Shifted Parabola Vertex & Focal Parameters",
    normalizedName: "Conic Sections: Shifted Parabola Vertex & Focal Parameters",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Conic Sections: Shifted Parabola Vertex & Focal Parameters"
    }
  },
  {
    id: "GEN0101-U3-HYP",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 8,
    officialName: "Conic Sections: Centered Hyperbola Asymptotes & Foci",
    normalizedName: "Conic Sections: Centered Hyperbola Asymptotes & Foci",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Conic Sections: Centered Hyperbola Asymptotes & Foci"
    }
  },
  {
    id: "GEN0101-U3-3D",
    unitId: "GEN0101-U3",
    courseId: "COURSE-GEN0101",
    sequence: 9,
    officialName: "3D Analytic Geometry: Equation of a Plane Through Three Points",
    normalizedName: "3D Analytic Geometry: Equation of a Plane Through Three Points",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "3D Analytic Geometry: Equation of a Plane Through Three Points"
    }
  },
  {
    id: "GEN0101-U4-POL",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 1,
    officialName: "Solid Mensuration: Regular Polygon Apothem & Area",
    normalizedName: "Solid Mensuration: Regular Polygon Apothem & Area",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Regular Polygon Apothem & Area"
    }
  },
  {
    id: "GEN0101-U4-HRN",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 2,
    officialName: "Solid Mensuration: Heron's Formula for Triangle Area",
    normalizedName: "Solid Mensuration: Heron's Formula for Triangle Area",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Heron's Formula for Triangle Area"
    }
  },
  {
    id: "GEN0101-U4-QAD",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 3,
    officialName: "Solid Mensuration: Trapezoid Area Formula",
    normalizedName: "Solid Mensuration: Trapezoid Area Formula",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Trapezoid Area Formula"
    }
  },
  {
    id: "GEN0101-U4-REG",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 4,
    officialName: "Solid Mensuration: Regular Hexagon Area and Apothem",
    normalizedName: "Solid Mensuration: Regular Hexagon Area and Apothem",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Regular Hexagon Area and Apothem"
    }
  },
  {
    id: "GEN0101-U4-SEG",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 5,
    officialName: "Solid Mensuration: Circular Sector Area Formula",
    normalizedName: "Solid Mensuration: Circular Sector Area Formula",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Circular Sector Area Formula"
    }
  },
  {
    id: "GEN0101-U4-BUOY",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 6,
    officialName: "Solid Mensuration: Surface Area of a Spherical Zone",
    normalizedName: "Solid Mensuration: Surface Area of a Spherical Zone",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Surface Area of a Spherical Zone"
    }
  },
  {
    id: "GEN0101-U4-PHAS",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 7,
    officialName: "Complex Numbers: Rectangular to Polar Phasor Conversion",
    normalizedName: "Complex Numbers: Rectangular to Polar Phasor Conversion",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Complex Numbers: Rectangular to Polar Phasor Conversion"
    }
  },
  {
    id: "GEN0101-U4-VEC",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 8,
    officialName: "Vector Mechanics: Vector Cross Product & Parallelogram Area",
    normalizedName: "Vector Mechanics: Vector Cross Product & Parallelogram Area",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vector Mechanics: Vector Cross Product & Parallelogram Area"
    }
  },
  {
    id: "GEN0101-U4-SOL",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 9,
    officialName: "Solid Mensuration: Frustum of a Right Circular Cone",
    normalizedName: "Solid Mensuration: Frustum of a Right Circular Cone",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Frustum of a Right Circular Cone"
    }
  },
  {
    id: "GEN0101-U4-SCR",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 10,
    officialName: "Engineering Friction: Impending Slip on an Inclined Plane",
    normalizedName: "Engineering Friction: Impending Slip on an Inclined Plane",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Friction: Impending Slip on an Inclined Plane"
    }
  },
  {
    id: "GEN0101-U4-TRS",
    unitId: "GEN0101-U4",
    courseId: "COURSE-GEN0101",
    sequence: 11,
    officialName: "Structural Statics: Method of Joints at 2-Member Pin Node",
    normalizedName: "Structural Statics: Method of Joints at 2-Member Pin Node",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Structural Statics: Method of Joints at 2-Member Pin Node"
    }
  },
  {
    id: "GEN0102-U1-LIM",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 1,
    officialName: "Evaluating Limits: Factoring Standard Polynomial Forms",
    normalizedName: "Evaluating Limits: Factoring Standard Polynomial Forms",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Evaluating Limits: Factoring Standard Polynomial Forms"
    }
  },
  {
    id: "GEN0102-U1-INF",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 2,
    officialName: "Limits at Infinity: Equal-Degree Rational Polynomials",
    normalizedName: "Limits at Infinity: Equal-Degree Rational Polynomials",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Limits at Infinity: Equal-Degree Rational Polynomials"
    }
  },
  {
    id: "GEN0102-U1-TRGLIM",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 3,
    officialName: "Trigonometric Limits: Standard Sine Ratio Transformation",
    normalizedName: "Trigonometric Limits: Standard Sine Ratio Transformation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Trigonometric Limits: Standard Sine Ratio Transformation"
    }
  },
  {
    id: "GEN0102-U1-LHO",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 4,
    officialName: "L'H\u00f4pital's Rule: 0/0 and inf/inf Ratios",
    normalizedName: "L'H\u00f4pital's Rule: 0/0 and inf/inf Ratios",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "L'H\u00f4pital's Rule: 0/0 and inf/inf Ratios"
    }
  },
  {
    id: "GEN0102-U1-DIFF",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 5,
    officialName: "Differentiation Rules: Basic Power & Sum Rule",
    normalizedName: "Differentiation Rules: Basic Power & Sum Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Power & Sum Rule"
    }
  },
  {
    id: "GEN0102-U1-TRG",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 6,
    officialName: "Differentiation Rules: Basic Trigonometric Chain Rule",
    normalizedName: "Differentiation Rules: Basic Trigonometric Chain Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Trigonometric Chain Rule"
    }
  },
  {
    id: "GEN0102-U1-QUT",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 7,
    officialName: "Differentiation Rules: Basic Quotient Rule on Linear Rational Functions",
    normalizedName: "Differentiation Rules: Basic Quotient Rule on Linear Rational Functions",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Quotient Rule on Linear Rational Functions"
    }
  },
  {
    id: "GEN0102-U1-SNE",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 8,
    officialName: "Evaluating Limits: Standard Sine Ratio Limit Transformation",
    normalizedName: "Evaluating Limits: Standard Sine Ratio Limit Transformation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Evaluating Limits: Standard Sine Ratio Limit Transformation"
    }
  },
  {
    id: "GEN0102-U1-CNT",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 9,
    officialName: "Limits & Continuity Concepts: Left and Right Hand Limits",
    normalizedName: "Limits & Continuity Concepts: Left and Right Hand Limits",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Limits & Continuity Concepts: Left and Right Hand Limits"
    }
  },
  {
    id: "GEN0102-U1-CHN",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 10,
    officialName: "Differentiation Rules: Generalized Power Rule for Polynomial Powers",
    normalizedName: "Differentiation Rules: Generalized Power Rule for Polynomial Powers",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Generalized Power Rule for Polynomial Powers"
    }
  },
  {
    id: "GEN0102-U1-RATL",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 11,
    officialName: "Evaluating Limits: Conjugate Rationalization of Simple Radicals",
    normalizedName: "Evaluating Limits: Conjugate Rationalization of Simple Radicals",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Evaluating Limits: Conjugate Rationalization of Simple Radicals"
    }
  },
  {
    id: "GEN0102-U1-PRD",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 12,
    officialName: "Differentiation Rules: Product Rule for Polynomials",
    normalizedName: "Differentiation Rules: Product Rule for Polynomials",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Product Rule for Polynomials"
    }
  },
  {
    id: "GEN0102-U1-CUB",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 13,
    officialName: "Evaluating Limits: Difference of Cubes Factorization",
    normalizedName: "Evaluating Limits: Difference of Cubes Factorization",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Evaluating Limits: Difference of Cubes Factorization"
    }
  },
  {
    id: "GEN0102-U1-NTRG",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 14,
    officialName: "Differentiation Rules: Tangent Trigonometric Chain Rule",
    normalizedName: "Differentiation Rules: Tangent Trigonometric Chain Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Tangent Trigonometric Chain Rule"
    }
  },
  {
    id: "GEN0102-U1-NUM",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 15,
    officialName: "Limits & Continuity Concepts: Table of Values Numerical Limit Estimation",
    normalizedName: "Limits & Continuity Concepts: Table of Values Numerical Limit Estimation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Limits & Continuity Concepts: Table of Values Numerical Limit Estimation"
    }
  },
  {
    id: "GEN0102-U1-LINP",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 16,
    officialName: "Differentiation Rules: Power Rule with Linear Combination",
    normalizedName: "Differentiation Rules: Power Rule with Linear Combination",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Power Rule with Linear Combination"
    }
  },
  {
    id: "GEN0102-U1-CHNX",
    unitId: "GEN0102-U1",
    courseId: "COURSE-GEN0102",
    sequence: 17,
    officialName: "Differentiation Rules: Exponential of Trigonometric Chain Rule",
    normalizedName: "Differentiation Rules: Exponential of Trigonometric Chain Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Exponential of Trigonometric Chain Rule"
    }
  },
  {
    id: "GEN0102-U2-INV",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 1,
    officialName: "Inverse Trigonometric: Standard Arcsine Chain Rule",
    normalizedName: "Inverse Trigonometric: Standard Arcsine Chain Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Inverse Trigonometric: Standard Arcsine Chain Rule"
    }
  },
  {
    id: "GEN0102-U2-HYP",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 2,
    officialName: "Differentiation: Standard Hyperbolic Derivatives",
    normalizedName: "Differentiation: Standard Hyperbolic Derivatives",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation: Standard Hyperbolic Derivatives"
    }
  },
  {
    id: "GEN0102-U2-LOG",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 3,
    officialName: "Logarithmic & Exponential: Standard Forms",
    normalizedName: "Logarithmic & Exponential: Standard Forms",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Logarithmic & Exponential: Standard Forms"
    }
  },
  {
    id: "GEN0102-U2-IMP",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 4,
    officialName: "Implicit Differentiation: Standard Conic",
    normalizedName: "Implicit Differentiation: Standard Conic",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Implicit Differentiation: Standard Conic"
    }
  },
  {
    id: "GEN0102-U2-PRT",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 5,
    officialName: "Partial Differentiation: First-Order Partial Derivatives of Algebraic Functions",
    normalizedName: "Partial Differentiation: First-Order Partial Derivatives of Algebraic Functions",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Partial Differentiation: First-Order Partial Derivatives of Algebraic Functions"
    }
  },
  {
    id: "GEN0102-U2-MIX",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 6,
    officialName: "Partial Differentiation: Clairaut's Theorem & Mixed Second-Order Partials",
    normalizedName: "Partial Differentiation: Clairaut's Theorem & Mixed Second-Order Partials",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Partial Differentiation: Clairaut's Theorem & Mixed Second-Order Partials"
    }
  },
  {
    id: "GEN0102-U2-HOD",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 7,
    officialName: "Higher-Order Derivatives: Successive Derivatives of Polynomial & Rational Functions",
    normalizedName: "Higher-Order Derivatives: Successive Derivatives of Polynomial & Rational Functions",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Higher-Order Derivatives: Successive Derivatives of Polynomial & Rational Functions"
    }
  },
  {
    id: "GEN0102-U2-EXP",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 8,
    officialName: "Differentiation Rules: Basic Natural Exponential Chain Rule",
    normalizedName: "Differentiation Rules: Basic Natural Exponential Chain Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Natural Exponential Chain Rule"
    }
  },
  {
    id: "GEN0102-U2-LOGF",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 9,
    officialName: "Differentiation Rules: Basic Natural Logarithm Chain Rule",
    normalizedName: "Differentiation Rules: Basic Natural Logarithm Chain Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Natural Logarithm Chain Rule"
    }
  },
  {
    id: "GEN0102-U2-CIR",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 10,
    officialName: "Implicit Differentiation: Circle Tangent Slope",
    normalizedName: "Implicit Differentiation: Circle Tangent Slope",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Implicit Differentiation: Circle Tangent Slope"
    }
  },
  {
    id: "GEN0102-U2-ATAN",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 11,
    officialName: "Differentiation Rules: Inverse Sine Chain Rule",
    normalizedName: "Differentiation Rules: Inverse Sine Chain Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Inverse Sine Chain Rule"
    }
  },
  {
    id: "GEN0102-U2-CAT",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 12,
    officialName: "Differentiation Rules: Hyperbolic Sine Chain Rule",
    normalizedName: "Differentiation Rules: Hyperbolic Sine Chain Rule",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Hyperbolic Sine Chain Rule"
    }
  },
  {
    id: "GEN0102-U2-CLR",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 13,
    officialName: "Partial Differentiation: First-Order Partial Derivatives",
    normalizedName: "Partial Differentiation: First-Order Partial Derivatives",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Partial Differentiation: First-Order Partial Derivatives"
    }
  },
  {
    id: "GEN0102-U2-JRK",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 14,
    officialName: "Higher-Order Derivatives: Third Derivative Polynomial Evaluation",
    normalizedName: "Higher-Order Derivatives: Third Derivative Polynomial Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Higher-Order Derivatives: Third Derivative Polynomial Evaluation"
    }
  },
  {
    id: "GEN0102-U2-AXP",
    unitId: "GEN0102-U2",
    courseId: "COURSE-GEN0102",
    sequence: 15,
    officialName: "Differentiation Rules: General Base Exponential Function Derivative",
    normalizedName: "Differentiation Rules: General Base Exponential Function Derivative",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: General Base Exponential Function Derivative"
    }
  },
  {
    id: "GEN0102-U3-SLP",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 1,
    officialName: "Tangent & Normal Lines: Slope and Tangent Line Equation",
    normalizedName: "Tangent & Normal Lines: Slope and Tangent Line Equation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Tangent & Normal Lines: Slope and Tangent Line Equation"
    }
  },
  {
    id: "GEN0102-U3-CRV",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 2,
    officialName: "Curve Tracing: Critical Numbers & Local Extrema of Cubics",
    normalizedName: "Curve Tracing: Critical Numbers & Local Extrema of Cubics",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Curve Tracing: Critical Numbers & Local Extrema of Cubics"
    }
  },
  {
    id: "GEN0102-U3-OPT",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 3,
    officialName: "Applied Optimization: 1D Boundary Area Maximization",
    normalizedName: "Applied Optimization: 1D Boundary Area Maximization",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Optimization: 1D Boundary Area Maximization"
    }
  },
  {
    id: "GEN0102-U3-INS",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 4,
    officialName: "Geometric Optimization: Inscribed Cylinder in a Sphere",
    normalizedName: "Geometric Optimization: Inscribed Cylinder in a Sphere",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optimization: Inscribed Cylinder in a Sphere"
    }
  },
  {
    id: "GEN0102-U3-RATE",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 5,
    officialName: "Related Rates: Orthogonal Spherical Expansion",
    normalizedName: "Related Rates: Orthogonal Spherical Expansion",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Related Rates: Orthogonal Spherical Expansion"
    }
  },
  {
    id: "GEN0102-U3-KIN",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 6,
    officialName: "Kinematic Related Rates: Searchlight Tracking a Moving Runner",
    normalizedName: "Kinematic Related Rates: Searchlight Tracking a Moving Runner",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Kinematic Related Rates: Searchlight Tracking a Moving Runner"
    }
  },
  {
    id: "GEN0102-U3-EXT",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 7,
    officialName: "Applications of Derivative: Finding Critical Numbers of a Cubic Polynomial",
    normalizedName: "Applications of Derivative: Finding Critical Numbers of a Cubic Polynomial",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Finding Critical Numbers of a Cubic Polynomial"
    }
  },
  {
    id: "GEN0102-U3-INF",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 8,
    officialName: "Polynomial Curves: Second Derivative Concavity Test",
    normalizedName: "Polynomial Curves: Second Derivative Concavity Test",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Polynomial Curves: Second Derivative Concavity Test"
    }
  },
  {
    id: "GEN0102-U3-LAD",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 9,
    officialName: "Applications of Derivative: Sliding Ladder Related Rates",
    normalizedName: "Applications of Derivative: Sliding Ladder Related Rates",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Sliding Ladder Related Rates"
    }
  },
  {
    id: "GEN0102-U3-FNC",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 10,
    officialName: "Applications of Derivative: Perimeter-Constrained Rectangular Area Maximization",
    normalizedName: "Applications of Derivative: Perimeter-Constrained Rectangular Area Maximization",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Perimeter-Constrained Rectangular Area Maximization"
    }
  },
  {
    id: "GEN0102-U3-SLPE",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 11,
    officialName: "The Slope: Parabola Tangent Slope Evaluation",
    normalizedName: "The Slope: Parabola Tangent Slope Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "The Slope: Parabola Tangent Slope Evaluation"
    }
  },
  {
    id: "GEN0102-U3-CONE",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 12,
    officialName: "Applications of Derivative: Conical Water Volume-Height Geometric Relation",
    normalizedName: "Applications of Derivative: Conical Water Volume-Height Geometric Relation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Conical Water Volume-Height Geometric Relation"
    }
  },
  {
    id: "GEN0102-U3-BOX",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 13,
    officialName: "Applications of Derivative: Open-Top Box Volume Formulation",
    normalizedName: "Applications of Derivative: Open-Top Box Volume Formulation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Open-Top Box Volume Formulation"
    }
  },
  {
    id: "GEN0102-U3-SLK",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 14,
    officialName: "Applications of Derivative: Circular Surface Area Related Rate",
    normalizedName: "Applications of Derivative: Circular Surface Area Related Rate",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Circular Surface Area Related Rate"
    }
  },
  {
    id: "GEN0102-U3-CAN",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 15,
    officialName: "Applications of Derivative: Cylindrical Can Surface Area Formulation",
    normalizedName: "Applications of Derivative: Cylindrical Can Surface Area Formulation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Cylindrical Can Surface Area Formulation"
    }
  },
  {
    id: "GEN0102-U3-TNR",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 16,
    officialName: "Tangent and Normal Lines: Square Root Curve Tangent Line",
    normalizedName: "Tangent and Normal Lines: Square Root Curve Tangent Line",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Tangent and Normal Lines: Square Root Curve Tangent Line"
    }
  },
  {
    id: "GEN0102-U3-KAP",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 17,
    officialName: "Plane Curves: Curvature Formula at Parabola Vertex",
    normalizedName: "Plane Curves: Curvature Formula at Parabola Vertex",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Plane Curves: Curvature Formula at Parabola Vertex"
    }
  },
  {
    id: "GEN0102-U3-LOGB",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 18,
    officialName: "Applications of Derivative: Rectangular Beam Cut from Circular Log Constraint",
    normalizedName: "Applications of Derivative: Rectangular Beam Cut from Circular Log Constraint",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Rectangular Beam Cut from Circular Log Constraint"
    }
  },
  {
    id: "GEN0102-U3-SHD",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 19,
    officialName: "Related Rates: Walking Shadow Similar Triangles Formulation",
    normalizedName: "Related Rates: Walking Shadow Similar Triangles Formulation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Related Rates: Walking Shadow Similar Triangles Formulation"
    }
  },
  {
    id: "GEN0102-U3-AREA",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 20,
    officialName: "Applications of Definite Integrals: Area Between Parabola and Line",
    normalizedName: "Applications of Definite Integrals: Area Between Parabola and Line",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Definite Integrals: Area Between Parabola and Line"
    }
  },
  {
    id: "GEN0102-U3-VOL",
    unitId: "GEN0102-U3",
    courseId: "COURSE-GEN0102",
    sequence: 21,
    officialName: "Solids of Revolution: Disk Method About the x-Axis",
    normalizedName: "Solids of Revolution: Disk Method About the x-Axis",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solids of Revolution: Disk Method About the x-Axis"
    }
  },
  {
    id: "GEN0110-U1-CAL",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 1,
    officialName: "Calorimetry: Sensible Heat Transfer & Thermal Equilibrium",
    normalizedName: "Calorimetry: Sensible Heat Transfer & Thermal Equilibrium",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Calorimetry: Sensible Heat Transfer & Thermal Equilibrium"
    }
  },
  {
    id: "GEN0110-U1-LAT",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 2,
    officialName: "Calorimetry: Latent Heat of Phase Transition",
    normalizedName: "Calorimetry: Latent Heat of Phase Transition",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Calorimetry: Latent Heat of Phase Transition"
    }
  },
  {
    id: "GEN0110-U1-EXP",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 3,
    officialName: "Thermal Physics: Linear Thermal Expansion of Structural Members",
    normalizedName: "Thermal Physics: Linear Thermal Expansion of Structural Members",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermal Physics: Linear Thermal Expansion of Structural Members"
    }
  },
  {
    id: "GEN0110-U1-DOP",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 4,
    officialName: "Acoustics: Decibel Sound Intensity Level",
    normalizedName: "Acoustics: Decibel Sound Intensity Level",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Acoustics: Decibel Sound Intensity Level"
    }
  },
  {
    id: "GEN0110-U1-PIP",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 5,
    officialName: "Acoustic Waves: Open-Open Organ Pipe Resonant Frequencies",
    normalizedName: "Acoustic Waves: Open-Open Organ Pipe Resonant Frequencies",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Acoustic Waves: Open-Open Organ Pipe Resonant Frequencies"
    }
  },
  {
    id: "GEN0110-U1-WAV",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 6,
    officialName: "Mechanical Waves: Transverse Wave Speed on a Stretched String",
    normalizedName: "Mechanical Waves: Transverse Wave Speed on a Stretched String",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Mechanical Waves: Transverse Wave Speed on a Stretched String"
    }
  },
  {
    id: "GEN0110-U1-EFLD",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 7,
    officialName: "Electrostatics: Coulomb's Law Point Charges",
    normalizedName: "Electrostatics: Coulomb's Law Point Charges",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electrostatics: Coulomb's Law Point Charges"
    }
  },
  {
    id: "GEN0110-U1-GAUSS",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 8,
    officialName: "Gauss's Law: Electric Flux Through a Plane Area",
    normalizedName: "Gauss's Law: Electric Flux Through a Plane Area",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gauss's Law: Electric Flux Through a Plane Area"
    }
  },
  {
    id: "GEN0110-U1-OPT",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 9,
    officialName: "Optics: Snell's Law & Critical Angle for Total Internal Reflection",
    normalizedName: "Optics: Snell's Law & Critical Angle for Total Internal Reflection",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Optics: Snell's Law & Critical Angle for Total Internal Reflection"
    }
  },
  {
    id: "GEN0110-U1-MIR",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 10,
    officialName: "Geometric Optics: Concave Spherical Mirror Image Formation",
    normalizedName: "Geometric Optics: Concave Spherical Mirror Image Formation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Concave Spherical Mirror Image Formation"
    }
  },
  {
    id: "GEN0110-U1-LNS",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 11,
    officialName: "Geometric Optics: Converging Thin Lens Real Image Formation",
    normalizedName: "Geometric Optics: Converging Thin Lens Real Image Formation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Converging Thin Lens Real Image Formation"
    }
  },
  {
    id: "GEN0110-U1-DIF",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 12,
    officialName: "Physical Optics: Single-Slit Fraunhofer Diffraction Minima",
    normalizedName: "Physical Optics: Single-Slit Fraunhofer Diffraction Minima",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Physical Optics: Single-Slit Fraunhofer Diffraction Minima"
    }
  },
  {
    id: "GEN0110-U1-HYD",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 13,
    officialName: "Fluid Mechanics: Pascal's Principle & Hydraulic Mechanical Advantage",
    normalizedName: "Fluid Mechanics: Pascal's Principle & Hydraulic Mechanical Advantage",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Pascal's Principle & Hydraulic Mechanical Advantage"
    }
  },
  {
    id: "GEN0110-U1-CNT",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 14,
    officialName: "Fluid Mechanics: Continuity Equation Volumetric Flow Rate",
    normalizedName: "Fluid Mechanics: Continuity Equation Volumetric Flow Rate",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Continuity Equation Volumetric Flow Rate"
    }
  },
  {
    id: "GEN0110-U1-BUO",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 15,
    officialName: "Fluid Mechanics: Archimedes Principle Buoyant Force on Submerged Solid",
    normalizedName: "Fluid Mechanics: Archimedes Principle Buoyant Force on Submerged Solid",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Archimedes Principle Buoyant Force on Submerged Solid"
    }
  },
  {
    id: "GEN0110-U1-CMP",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 16,
    officialName: "Heat Transfer: 1D Plane Wall Conduction Heat Rate",
    normalizedName: "Heat Transfer: 1D Plane Wall Conduction Heat Rate",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Transfer: 1D Plane Wall Conduction Heat Rate"
    }
  },
  {
    id: "GEN0110-U1-SHR",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 17,
    officialName: "Thermal Physics: Area (Superficial) Thermal Expansion",
    normalizedName: "Thermal Physics: Area (Superficial) Thermal Expansion",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermal Physics: Area (Superficial) Thermal Expansion"
    }
  },
  {
    id: "GEN0110-U1-WEQ",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 18,
    officialName: "Calorimetry: Two-Fluid Thermal Equilibrium",
    normalizedName: "Calorimetry: Two-Fluid Thermal Equilibrium",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Calorimetry: Two-Fluid Thermal Equilibrium"
    }
  },
  {
    id: "GEN0110-U1-TIR",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 19,
    officialName: "Geometric Optics: Critical Angle for Total Internal Reflection",
    normalizedName: "Geometric Optics: Critical Angle for Total Internal Reflection",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Critical Angle for Total Internal Reflection"
    }
  },
  {
    id: "GEN0110-U1-PRS",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 20,
    officialName: "Fluid Mechanics: Hydrostatic Gauge Pressure at Fluid Depth",
    normalizedName: "Fluid Mechanics: Hydrostatic Gauge Pressure at Fluid Depth",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Hydrostatic Gauge Pressure at Fluid Depth"
    }
  },
  {
    id: "GEN0110-U1-SND",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 21,
    officialName: "Sound Waves: Speed of Sound Temperature Scaling",
    normalizedName: "Sound Waves: Speed of Sound Temperature Scaling",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Sound Waves: Speed of Sound Temperature Scaling"
    }
  },
  {
    id: "GEN0110-U1-REF",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 22,
    officialName: "Geometric Optics: Snell's Law of Refraction",
    normalizedName: "Geometric Optics: Snell's Law of Refraction",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Snell's Law of Refraction"
    }
  },
  {
    id: "GEN0110-U1-FUS",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 23,
    officialName: "Heat Measurements: Latent Heat of Ice Fusion Energy",
    normalizedName: "Heat Measurements: Latent Heat of Ice Fusion Energy",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Measurements: Latent Heat of Ice Fusion Energy"
    }
  },
  {
    id: "GEN0110-U1-DOPL",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 24,
    officialName: "Sound Waves: Approaching Moving Source Doppler Frequency Shift",
    normalizedName: "Sound Waves: Approaching Moving Source Doppler Frequency Shift",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Sound Waves: Approaching Moving Source Doppler Frequency Shift"
    }
  },
  {
    id: "GEN0110-U1-EFL",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 25,
    officialName: "Electrostatics: Electric Field Magnitude of a Point Charge",
    normalizedName: "Electrostatics: Electric Field Magnitude of a Point Charge",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electrostatics: Electric Field Magnitude of a Point Charge"
    }
  },
  {
    id: "GEN0110-U1-PLM",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 26,
    officialName: "Geometric Optics: Law of Reflection on a Flat Plane Mirror",
    normalizedName: "Geometric Optics: Law of Reflection on a Flat Plane Mirror",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Law of Reflection on a Flat Plane Mirror"
    }
  },
  {
    id: "GEN0110-U1-MAN2",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 27,
    officialName: "Fluid Mechanics: Single-Fluid U-Tube Manometer Gauge Pressure",
    normalizedName: "Fluid Mechanics: Single-Fluid U-Tube Manometer Gauge Pressure",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Single-Fluid U-Tube Manometer Gauge Pressure"
    }
  },
  {
    id: "GEN0110-U1-GAP",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 28,
    officialName: "Thermal Physics: Expansion Gap Closing Temperature",
    normalizedName: "Thermal Physics: Expansion Gap Closing Temperature",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermal Physics: Expansion Gap Closing Temperature"
    }
  },
  {
    id: "GEN0110-U1-STRG",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 29,
    officialName: "Mechanical Waves: Fundamental Resonant Frequency on Stretched String",
    normalizedName: "Mechanical Waves: Fundamental Resonant Frequency on Stretched String",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Mechanical Waves: Fundamental Resonant Frequency on Stretched String"
    }
  },
  {
    id: "GEN0110-U1-MRR",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 30,
    officialName: "Geometric Optics: Concave Mirror Real Image Location",
    normalizedName: "Geometric Optics: Concave Mirror Real Image Location",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Concave Mirror Real Image Location"
    }
  },
  {
    id: "GEN0110-U1-RAD",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 31,
    officialName: "Heat Transfer: Stefan-Boltzmann Blackbody Radiation Law",
    normalizedName: "Heat Transfer: Stefan-Boltzmann Blackbody Radiation Law",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Transfer: Stefan-Boltzmann Blackbody Radiation Law"
    }
  },
  {
    id: "GEN0110-U1-BIM",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 32,
    officialName: "Thermal Physics: Differential Expansion of Bonded Strips",
    normalizedName: "Thermal Physics: Differential Expansion of Bonded Strips",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermal Physics: Differential Expansion of Bonded Strips"
    }
  },
  {
    id: "GEN0110-U1-DBL",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 33,
    officialName: "Sound Waves: Decibel Sound Intensity Level Evaluation",
    normalizedName: "Sound Waves: Decibel Sound Intensity Level Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Sound Waves: Decibel Sound Intensity Level Evaluation"
    }
  },
  {
    id: "GEN0110-U1-DIV",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 34,
    officialName: "Geometric Optics: Diverging Concave Lens Thin Lens Equation",
    normalizedName: "Geometric Optics: Diverging Concave Lens Thin Lens Equation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Diverging Concave Lens Thin Lens Equation"
    }
  },
  {
    id: "GEN0110-U1-RAY",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 35,
    officialName: "Wave Optics: Single Slit Diffraction First Minimum Angle",
    normalizedName: "Wave Optics: Single Slit Diffraction First Minimum Angle",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Wave Optics: Single Slit Diffraction First Minimum Angle"
    }
  },
  {
    id: "GEN0110-U1-MET",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 36,
    officialName: "Fluid Mechanics: Iceberg Submerged Floating Volume Fraction",
    normalizedName: "Fluid Mechanics: Iceberg Submerged Floating Volume Fraction",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Iceberg Submerged Floating Volume Fraction"
    }
  },
  {
    id: "GEN0110-U1-VAP",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 37,
    officialName: "Heat Measurements: Latent Heat of Steam Condensation",
    normalizedName: "Heat Measurements: Latent Heat of Steam Condensation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Measurements: Latent Heat of Steam Condensation"
    }
  },
  {
    id: "GEN0110-U1-LMK",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 38,
    officialName: "Geometric Optics: Symmetric Biconvex Lensmaker's Equation",
    normalizedName: "Geometric Optics: Symmetric Biconvex Lensmaker's Equation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Symmetric Biconvex Lensmaker's Equation"
    }
  },
  {
    id: "GEN0110-U1-TOR",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 39,
    officialName: "Fluid Mechanics: Torricelli's Orifice Exit Velocity",
    normalizedName: "Fluid Mechanics: Torricelli's Orifice Exit Velocity",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Torricelli's Orifice Exit Velocity"
    }
  },
  {
    id: "GEN0110-U1-OGP",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 40,
    officialName: "Acoustics & Waves: Open Organ Pipe Fundamental & Harmonics",
    normalizedName: "Acoustics & Waves: Open Organ Pipe Fundamental & Harmonics",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Acoustics & Waves: Open Organ Pipe Fundamental & Harmonics"
    }
  },
  {
    id: "GEN0110-U1-FLM",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 41,
    officialName: "Wave Optics: Thin Film Reflection Phase Change Rules",
    normalizedName: "Wave Optics: Thin Film Reflection Phase Change Rules",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Wave Optics: Thin Film Reflection Phase Change Rules"
    }
  },
  {
    id: "GEN0110-U1-DBLS",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 42,
    officialName: "Wave Optics: Young's Double Slit Bright Fringe Angle",
    normalizedName: "Wave Optics: Young's Double Slit Bright Fringe Angle",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Wave Optics: Young's Double Slit Bright Fringe Angle"
    }
  },
  {
    id: "GEN0110-U1-DYN",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 43,
    officialName: "Engineering Dynamics: Constant Acceleration Projectile Kinematics",
    normalizedName: "Engineering Dynamics: Constant Acceleration Projectile Kinematics",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Dynamics: Constant Acceleration Projectile Kinematics"
    }
  },
  {
    id: "GEN0110-U1-ENG",
    unitId: "GEN0110-U1",
    courseId: "COURSE-GEN0110",
    sequence: 44,
    officialName: "Dynamics: Conservation of Mechanical Energy with Spring Arrestor",
    normalizedName: "Dynamics: Conservation of Mechanical Energy with Spring Arrestor",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Dynamics: Conservation of Mechanical Energy with Spring Arrestor"
    }
  },
  {
    id: "GEN0110-U2-CIRC",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 1,
    officialName: "DC Circuits: Series-Parallel Equivalent Resistance",
    normalizedName: "DC Circuits: Series-Parallel Equivalent Resistance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "DC Circuits: Series-Parallel Equivalent Resistance"
    }
  },
  {
    id: "GEN0110-U2-TRAN",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 2,
    officialName: "RC Transients: Time Constant & Charging Voltage",
    normalizedName: "RC Transients: Time Constant & Charging Voltage",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "RC Transients: Time Constant & Charging Voltage"
    }
  },
  {
    id: "GEN0110-U2-RES",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 3,
    officialName: "AC Circuits: Series RLC Resonant Frequency",
    normalizedName: "AC Circuits: Series RLC Resonant Frequency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "AC Circuits: Series RLC Resonant Frequency"
    }
  },
  {
    id: "GEN0110-U2-MAG",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 4,
    officialName: "Magnetostatics: Magnetic Force on a Straight Conductor",
    normalizedName: "Magnetostatics: Magnetic Force on a Straight Conductor",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Magnetostatics: Magnetic Force on a Straight Conductor"
    }
  },
  {
    id: "GEN0110-U2-IND",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 5,
    officialName: "Electromagnetic Induction: Faraday's Law with Time-Varying Field",
    normalizedName: "Electromagnetic Induction: Faraday's Law with Time-Varying Field",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electromagnetic Induction: Faraday's Law with Time-Varying Field"
    }
  },
  {
    id: "GEN0110-U2-REL",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 6,
    officialName: "Special Relativity: Lorentz Gamma Factor & Relativistic Time Dilation",
    normalizedName: "Special Relativity: Lorentz Gamma Factor & Relativistic Time Dilation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Special Relativity: Lorentz Gamma Factor & Relativistic Time Dilation"
    }
  },
  {
    id: "GEN0110-U2-ENR",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 7,
    officialName: "Special Relativity: Relativistic Linear Momentum",
    normalizedName: "Special Relativity: Relativistic Linear Momentum",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Special Relativity: Relativistic Linear Momentum"
    }
  },
  {
    id: "GEN0110-U2-PWR",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 8,
    officialName: "Electricity: Electrical Power Formulas & Current Draw",
    normalizedName: "Electricity: Electrical Power Formulas & Current Draw",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Electrical Power Formulas & Current Draw"
    }
  },
  {
    id: "GEN0110-U2-CKT",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 9,
    officialName: "Electricity: Series and Parallel Equivalent Resistance",
    normalizedName: "Electricity: Series and Parallel Equivalent Resistance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Series and Parallel Equivalent Resistance"
    }
  },
  {
    id: "GEN0110-U2-KCH",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 10,
    officialName: "Electricity: Kirchhoff's Current Law (KCL) Junction Balance",
    normalizedName: "Electricity: Kirchhoff's Current Law (KCL) Junction Balance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Kirchhoff's Current Law (KCL) Junction Balance"
    }
  },
  {
    id: "GEN0110-U2-RTRN",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 11,
    officialName: "Electricity: RC Circuit Transient Time Constant",
    normalizedName: "Electricity: RC Circuit Transient Time Constant",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: RC Circuit Transient Time Constant"
    }
  },
  {
    id: "GEN0110-U2-RLC",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 12,
    officialName: "Electricity: Series RLC Circuit Resonant Frequency",
    normalizedName: "Electricity: Series RLC Circuit Resonant Frequency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Series RLC Circuit Resonant Frequency"
    }
  },
  {
    id: "GEN0110-U2-CYC",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 13,
    officialName: "Electromagnetism: Lorentz Magnetic Force on a Moving Charge",
    normalizedName: "Electromagnetism: Lorentz Magnetic Force on a Moving Charge",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electromagnetism: Lorentz Magnetic Force on a Moving Charge"
    }
  },
  {
    id: "GEN0110-U2-BAT",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 14,
    officialName: "Electricity: Real Battery Terminal Voltage with Internal Resistance",
    normalizedName: "Electricity: Real Battery Terminal Voltage with Internal Resistance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Real Battery Terminal Voltage with Internal Resistance"
    }
  },
  {
    id: "GEN0110-U2-NRG",
    unitId: "GEN0110-U2",
    courseId: "COURSE-GEN0110",
    sequence: 15,
    officialName: "Electromagnetism: Electric Field Energy Density",
    normalizedName: "Electromagnetism: Electric Field Energy Density",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electromagnetism: Electric Field Energy Density"
    }
  },
  {
    id: "GEN0110-U3-REL",
    unitId: "GEN0110-U3",
    courseId: "COURSE-GEN0110",
    sequence: 1,
    officialName: "Special Relativity: Relativistic Lorentz Gamma Factor Evaluation",
    normalizedName: "Special Relativity: Relativistic Lorentz Gamma Factor Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Special Relativity: Relativistic Lorentz Gamma Factor Evaluation"
    }
  },
  {
    id: "GEN0110-U3-LGT",
    unitId: "GEN0110-U3",
    courseId: "COURSE-GEN0110",
    sequence: 2,
    officialName: "Special Relativity: Relativistic Doppler Redshift of Receding Source",
    normalizedName: "Special Relativity: Relativistic Doppler Redshift of Receding Source",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Special Relativity: Relativistic Doppler Redshift of Receding Source"
    }
  },
  {
    id: "GEN0161-U1-POLY",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 1,
    officialName: "Closed Systems: Constant Pressure (Isobaric) Work",
    normalizedName: "Closed Systems: Constant Pressure (Isobaric) Work",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Closed Systems: Constant Pressure (Isobaric) Work"
    }
  },
  {
    id: "GEN0161-U1-NOZ",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 2,
    officialName: "First Law Open Systems: Steady-Flow Energy Equation on an Adiabatic Nozzle",
    normalizedName: "First Law Open Systems: Steady-Flow Energy Equation on an Adiabatic Nozzle",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Steady-Flow Energy Equation on an Adiabatic Nozzle"
    }
  },
  {
    id: "GEN0161-U1-MIX",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 3,
    officialName: "First Law Open Systems: Adiabatic Steady Mixing Chamber Mass and Energy Balance",
    normalizedName: "First Law Open Systems: Adiabatic Steady Mixing Chamber Mass and Energy Balance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Adiabatic Steady Mixing Chamber Mass and Energy Balance"
    }
  },
  {
    id: "GEN0161-U1-STM",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 4,
    officialName: "Pure Substances: Wet Vapor Quality Evaluation",
    normalizedName: "Pure Substances: Wet Vapor Quality Evaluation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Pure Substances: Wet Vapor Quality Evaluation"
    }
  },
  {
    id: "GEN0161-U1-UNT",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 5,
    officialName: "Thermodynamic Concepts: Pressure Scale Conversions (Gauge, Absolute, Bar, kPa)",
    normalizedName: "Thermodynamic Concepts: Pressure Scale Conversions (Gauge, Absolute, Bar, kPa)",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermodynamic Concepts: Pressure Scale Conversions (Gauge, Absolute, Bar, kPa)"
    }
  },
  {
    id: "GEN0161-U1-WRK",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 6,
    officialName: "First Law Closed Systems: Constant Pressure Boundary Work",
    normalizedName: "First Law Closed Systems: Constant Pressure Boundary Work",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Closed Systems: Constant Pressure Boundary Work"
    }
  },
  {
    id: "GEN0161-U1-THR",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 7,
    officialName: "First Law Open Systems: Isenthalpic Throttling Process Quality",
    normalizedName: "First Law Open Systems: Isenthalpic Throttling Process Quality",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Isenthalpic Throttling Process Quality"
    }
  },
  {
    id: "GEN0161-U1-ISP",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 8,
    officialName: "Processes of Ideal Gases: Isentropic Expansion Pressure-Volume Relation",
    normalizedName: "Processes of Ideal Gases: Isentropic Expansion Pressure-Volume Relation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Isentropic Expansion Pressure-Volume Relation"
    }
  },
  {
    id: "GEN0161-U1-SAT",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 9,
    officialName: "Properties of Pure Substances: Specific Volume of Saturated Steam Mixture",
    normalizedName: "Properties of Pure Substances: Specific Volume of Saturated Steam Mixture",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Properties of Pure Substances: Specific Volume of Saturated Steam Mixture"
    }
  },
  {
    id: "GEN0161-U1-PLY",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 10,
    officialName: "Processes of Ideal Gases: Polytropic Expansion Boundary Work",
    normalizedName: "Processes of Ideal Gases: Polytropic Expansion Boundary Work",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Polytropic Expansion Boundary Work"
    }
  },
  {
    id: "GEN0161-U1-GAS",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 11,
    officialName: "Ideal Gas Laws: Boyle's Law Constant-Temperature Pressure-Volume Scaling",
    normalizedName: "Ideal Gas Laws: Boyle's Law Constant-Temperature Pressure-Volume Scaling",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Ideal Gas Laws: Boyle's Law Constant-Temperature Pressure-Volume Scaling"
    }
  },
  {
    id: "GEN0161-U1-PRP",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 12,
    officialName: "Thermodynamic Concepts: Intensive vs Extensive Property Classification",
    normalizedName: "Thermodynamic Concepts: Intensive vs Extensive Property Classification",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermodynamic Concepts: Intensive vs Extensive Property Classification"
    }
  },
  {
    id: "GEN0161-U1-ADB",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 13,
    officialName: "First Law Closed Systems: Reversible Adiabatic Boundary Work",
    normalizedName: "First Law Closed Systems: Reversible Adiabatic Boundary Work",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Closed Systems: Reversible Adiabatic Boundary Work"
    }
  },
  {
    id: "GEN0161-U1-VPR",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 14,
    officialName: "Processes of Ideal Gases: Constant Volume Heat Addition",
    normalizedName: "Processes of Ideal Gases: Constant Volume Heat Addition",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Constant Volume Heat Addition"
    }
  },
  {
    id: "GEN0161-U1-MAS",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 15,
    officialName: "First Law Open Systems: Steady-State Mass Flow Rate Formula",
    normalizedName: "First Law Open Systems: Steady-State Mass Flow Rate Formula",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Steady-State Mass Flow Rate Formula"
    }
  },
  {
    id: "GEN0161-U1-IST",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 16,
    officialName: "Processes of Ideal Gases: Reversible Isothermal Work Formulation",
    normalizedName: "Processes of Ideal Gases: Reversible Isothermal Work Formulation",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Reversible Isothermal Work Formulation"
    }
  },
  {
    id: "GEN0161-U1-REV",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 17,
    officialName: "Thermodynamic Concepts: Factors Causing Process Irreversibility",
    normalizedName: "Thermodynamic Concepts: Factors Causing Process Irreversibility",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermodynamic Concepts: Factors Causing Process Irreversibility"
    }
  },
  {
    id: "GEN0161-U1-BAR",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 18,
    officialName: "Processes of Ideal Gases: Isobaric Boundary Work and Heat Addition",
    normalizedName: "Processes of Ideal Gases: Isobaric Boundary Work and Heat Addition",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Isobaric Boundary Work and Heat Addition"
    }
  },
  {
    id: "GEN0161-U1-NZL",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 19,
    officialName: "First Law Open Systems: Adiabatic Nozzle Exit Velocity Formula",
    normalizedName: "First Law Open Systems: Adiabatic Nozzle Exit Velocity Formula",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Adiabatic Nozzle Exit Velocity Formula"
    }
  },
  {
    id: "GEN0161-U1-CLP",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 20,
    officialName: "Properties of Pure Substances: Clapeyron Equation Phase Boundary Slope",
    normalizedName: "Properties of Pure Substances: Clapeyron Equation Phase Boundary Slope",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Properties of Pure Substances: Clapeyron Equation Phase Boundary Slope"
    }
  },
  {
    id: "GEN0161-U1-MAN",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 21,
    officialName: "Fluid Statics: U-Tube Mercury Manometer Pressure Differential",
    normalizedName: "Fluid Statics: U-Tube Mercury Manometer Pressure Differential",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Statics: U-Tube Mercury Manometer Pressure Differential"
    }
  },
  {
    id: "GEN0161-U1-BERN",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 22,
    officialName: "Fluid Dynamics: Torricelli's Law Tank Orifice Discharge Velocity",
    normalizedName: "Fluid Dynamics: Torricelli's Law Tank Orifice Discharge Velocity",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Dynamics: Torricelli's Law Tank Orifice Discharge Velocity"
    }
  },
  {
    id: "GEN0161-U1-HT",
    unitId: "GEN0161-U1",
    courseId: "COURSE-GEN0161",
    sequence: 23,
    officialName: "Heat Transfer: 1D Plane Wall Conduction Thermal Resistance",
    normalizedName: "Heat Transfer: 1D Plane Wall Conduction Thermal Resistance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Transfer: 1D Plane Wall Conduction Thermal Resistance"
    }
  },
  {
    id: "GEN0161-U2-CYC",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 1,
    officialName: "Second Law: Maximum Carnot Thermal Efficiency",
    normalizedName: "Second Law: Maximum Carnot Thermal Efficiency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Second Law: Maximum Carnot Thermal Efficiency"
    }
  },
  {
    id: "GEN0161-U2-IC",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 2,
    officialName: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency",
    normalizedName: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency"
    }
  },
  {
    id: "GEN0161-U2-DSL",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 3,
    officialName: "Gas Power Cycles: Air-Standard Diesel Cycle Cutoff Ratio & Efficiency",
    normalizedName: "Gas Power Cycles: Air-Standard Diesel Cycle Cutoff Ratio & Efficiency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Diesel Cycle Cutoff Ratio & Efficiency"
    }
  },
  {
    id: "GEN0161-U2-BRY",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 4,
    officialName: "Gas Power Cycles: Ideal Brayton Cycle Thermal Efficiency",
    normalizedName: "Gas Power Cycles: Ideal Brayton Cycle Thermal Efficiency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Ideal Brayton Cycle Thermal Efficiency"
    }
  },
  {
    id: "GEN0161-U2-RHT",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 5,
    officialName: "Vapor Power Cycles: Two-Stage Reheat Turbine Enthalpy Drops",
    normalizedName: "Vapor Power Cycles: Two-Stage Reheat Turbine Enthalpy Drops",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vapor Power Cycles: Two-Stage Reheat Turbine Enthalpy Drops"
    }
  },
  {
    id: "GEN0161-U2-ENG",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 6,
    officialName: "Second Law: Heat Engine First-Law Energy Balance & Efficiency",
    normalizedName: "Second Law: Heat Engine First-Law Energy Balance & Efficiency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Second Law: Heat Engine First-Law Energy Balance & Efficiency"
    }
  },
  {
    id: "GEN0161-U2-COP",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 7,
    officialName: "Second Law: Refrigerator Coefficient of Performance (COP)",
    normalizedName: "Second Law: Refrigerator Coefficient of Performance (COP)",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Second Law: Refrigerator Coefficient of Performance (COP)"
    }
  },
  {
    id: "GEN0161-U2-OTT",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 8,
    officialName: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency",
    normalizedName: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency"
    }
  },
  {
    id: "GEN0161-U2-BRYT",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 9,
    officialName: "Gas Power Cycles: Ideal Brayton Gas Turbine Thermal Efficiency",
    normalizedName: "Gas Power Cycles: Ideal Brayton Gas Turbine Thermal Efficiency",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Ideal Brayton Gas Turbine Thermal Efficiency"
    }
  },
  {
    id: "GEN0161-U2-ENT",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 10,
    officialName: "Second Law: Reversible Isothermal Entropy Change",
    normalizedName: "Second Law: Reversible Isothermal Entropy Change",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Second Law: Reversible Isothermal Entropy Change"
    }
  },
  {
    id: "GEN0161-U2-CUT",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 11,
    officialName: "Gas Power Cycles: Air-Standard Diesel Cycle Thermal Efficiency Formula",
    normalizedName: "Gas Power Cycles: Air-Standard Diesel Cycle Thermal Efficiency Formula",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Diesel Cycle Thermal Efficiency Formula"
    }
  },
  {
    id: "GEN0161-U2-RNK",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 12,
    officialName: "Vapor Power Cycles: Simple Rankine Cycle Enthalpy Balance",
    normalizedName: "Vapor Power Cycles: Simple Rankine Cycle Enthalpy Balance",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vapor Power Cycles: Simple Rankine Cycle Enthalpy Balance"
    }
  },
  {
    id: "GEN0161-U2-MOI",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 13,
    officialName: "Vapor Power Cycles: Reheat Rankine Total Turbine Work",
    normalizedName: "Vapor Power Cycles: Reheat Rankine Total Turbine Work",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vapor Power Cycles: Reheat Rankine Total Turbine Work"
    }
  },
  {
    id: "GEN0161-U2-DUAL",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 14,
    officialName: "Gas Power Cycles: Air-Standard Dual Cycle Thermal Efficiency Formula",
    normalizedName: "Gas Power Cycles: Air-Standard Dual Cycle Thermal Efficiency Formula",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Dual Cycle Thermal Efficiency Formula"
    }
  },
  {
    id: "GEN0161-U2-OFW",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 15,
    officialName: "Vapor Power Cycles: Open Feedwater Heater Steam Extraction Fraction",
    normalizedName: "Vapor Power Cycles: Open Feedwater Heater Steam Extraction Fraction",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vapor Power Cycles: Open Feedwater Heater Steam Extraction Fraction"
    }
  },
  {
    id: "GEN0161-U2-RAD",
    unitId: "GEN0161-U2",
    courseId: "COURSE-GEN0161",
    sequence: 16,
    officialName: "Radiation Heat Transfer: Stefan-Boltzmann Blackbody Emissive Power",
    normalizedName: "Radiation Heat Transfer: Stefan-Boltzmann Blackbody Emissive Power",
    hours: 3,
    period: 'PRELIM',
    subtopics: [],
    sourceReference: {
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Radiation Heat Transfer: Stefan-Boltzmann Blackbody Emissive Power"
    }
  },
];

export const GOLDEN_MASTER_NON_DIFFEQ_SKILLS: LearningSkill[] = [
  {
    id: "BSIE3219-U1-BCR",
    canonicalName: "Engineering Economics: Conventional Benefit-Cost Ratio (B/C)",
    description: "Direct evaluation of conventional B/C = PW(Benefits) / PW(Costs) for public sector infrastructure justification.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-BCR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Conventional Benefit-Cost Ratio (B/C)."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Conventional Benefit-Cost Ratio (B/C)"
    }]
  },
  {
    id: "BSIE3219-U1-BEP",
    canonicalName: "Engineering Economics: Linear Break-Even Production Volume",
    description: "Direct calculation of break-even quantity Q_BE = Fixed Costs / (Price - Variable Cost) and contribution margin.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-BEP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Linear Break-Even Production Volume."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Linear Break-Even Production Volume"
    }]
  },
  {
    id: "BSIE3219-U1-BKE",
    canonicalName: "Engineering Economics: Linear Break-Even Production Volume",
    description: "Direct calculation of break-even volume x_BEP = FC / (p - VC) where revenue equals total cost.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-BKE",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Linear Break-Even Production Volume."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Linear Break-Even Production Volume"
    }]
  },
  {
    id: "BSIE3219-U1-BND",
    canonicalName: "Engineering Economy: Bond Purchase Price at Par and Yield",
    description: "Direct calculation of bond periodic dividend I = C * r_bond / m and present worth purchase price P = I*(P/A, i, n) + C*(P/F, i, n).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-BND",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economy: Bond Purchase Price at Par and Yield."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economy: Bond Purchase Price at Par and Yield"
    }]
  },
  {
    id: "BSIE3219-U1-CAP",
    canonicalName: "Engineering Economics: Capitalized Cost for Infinite Service Life",
    description: "Direct calculation of Capitalized Cost CC = C0 + A / i for perpetual annual operating maintenance.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-CAP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Capitalized Cost for Infinite Service Life."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Capitalized Cost for Infinite Service Life"
    }]
  },
  {
    id: "BSIE3219-U1-CMB",
    canonicalName: "Combinatorics: Permutations vs Combinations",
    description: "Direct calculation of combinations nCr = n! / (r! * (n - r)!) and permutations nPr = n! / (n - r)!.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-CMB",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Combinatorics: Permutations vs Combinations."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Combinatorics: Permutations vs Combinations"
    }]
  },
  {
    id: "BSIE3219-U1-CMPX",
    canonicalName: "Complex Numbers: Multiplication of Complex Numbers",
    description: "Direct expansion using i^2 = -1: (a + bi)*(c + di) = (ac - bd) + (ad + bc)i.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-CMPX",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Complex Numbers: Multiplication of Complex Numbers."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Complex Numbers: Multiplication of Complex Numbers"
    }]
  },
  {
    id: "BSIE3219-U1-CNT",
    canonicalName: "Combinatorics: Fundamental Multiplication Counting Principle",
    description: "Direct application of multiplication principle: total outcomes = n1 * n2 * n3.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-CNT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Combinatorics: Fundamental Multiplication Counting Principle."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Combinatorics: Fundamental Multiplication Counting Principle"
    }]
  },
  {
    id: "BSIE3219-U1-DEP",
    canonicalName: "Engineering Economics: Straight-Line Depreciation & Book Value",
    description: "Direct calculation of constant annual depreciation D = (Cost - Salvage) / N and book value BV_t = Cost - t*D.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-DEP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Straight-Line Depreciation & Book Value."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Straight-Line Depreciation & Book Value"
    }]
  },
  {
    id: "BSIE3219-U1-DET",
    canonicalName: "Matrices & Vectors: 2x2 Matrix Multiplication",
    description: "Direct calculation of matrix product C = A * B using row-by-column dot products.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-DET",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Matrices & Vectors: 2x2 Matrix Multiplication."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Matrices & Vectors: 2x2 Matrix Multiplication"
    }]
  },
  {
    id: "BSIE3219-U1-DOT",
    canonicalName: "Vectors: Algebraic Dot Product of Two 2D Vectors",
    description: "Direct scalar dot product calculation: A . B = Ax * Bx + Ay * By.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-DOT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Vectors: Algebraic Dot Product of Two 2D Vectors."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vectors: Algebraic Dot Product of Two 2D Vectors"
    }]
  },
  {
    id: "BSIE3219-U1-DPR",
    canonicalName: "Engineering Economics: Straight-Line Depreciation Schedule",
    description: "Direct calculation of uniform annual straight-line depreciation charge D = (B - S) / n and book value BV_t = B - t * D.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-DPR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Straight-Line Depreciation Schedule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Straight-Line Depreciation Schedule"
    }]
  },
  {
    id: "BSIE3219-U1-EAR",
    canonicalName: "Engineering Economics: Effective Annual Interest Rate (Monthly Compounding)",
    description: "Direct calculation of effective annual rate i_eff = (1 + r / m)^m - 1 for nominal rate r = 12% compounded monthly (m = 12).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-EAR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Effective Annual Interest Rate (Monthly Compounding)."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Effective Annual Interest Rate (Monthly Compounding)"
    }]
  },
  {
    id: "BSIE3219-U1-EFF",
    canonicalName: "Engineering Economics: Effective Annual Interest Rate from Compounding Frequency",
    description: "Direct calculation of effective annual interest rate i_e = (1 + r / m)^m - 1 for quarterly compounding.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-EFF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Effective Annual Interest Rate from Compounding Frequency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Effective Annual Interest Rate from Compounding Frequency"
    }]
  },
  {
    id: "BSIE3219-U1-GRD",
    canonicalName: "Engineering Economics: Present Worth of an Arithmetic Gradient Series",
    description: "Direct application of gradient present worth factor (P/G, i, n) = [ (1+i)^n - i*n - 1 ] / [ i^2 * (1+i)^n ] for a pure arithmetic gradient cash flow.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-GRD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Present Worth of an Arithmetic Gradient Series."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Present Worth of an Arithmetic Gradient Series"
    }]
  },
  {
    id: "BSIE3219-U1-HYP",
    canonicalName: "Combinatorics: Combinations Formula & Complementary Symmetry",
    description: "Direct combination formula C(n, r) = n! / [r! * (n - r)!] and symmetry C(n, r) = C(n, n - r).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-HYP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Combinatorics: Combinations Formula & Complementary Symmetry."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Combinatorics: Combinations Formula & Complementary Symmetry"
    }]
  },
  {
    id: "BSIE3219-U1-INF",
    canonicalName: "Progressions: Infinite Geometric Series Direct Summation",
    description: "Direct summation of infinite geometric series S_inf = a / (1 - r) for common ratio |r| < 1.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-INF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Progressions: Infinite Geometric Series Direct Summation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Progressions: Infinite Geometric Series Direct Summation"
    }]
  },
  {
    id: "BSIE3219-U1-INT",
    canonicalName: "Engineering Economics: Simple vs Compound Interest Accumulation",
    description: "Direct comparison between linear simple interest I = P * i * n and exponential compound interest F = P * (1 + i)^n.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-INT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Simple vs Compound Interest Accumulation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Simple vs Compound Interest Accumulation"
    }]
  },
  {
    id: "BSIE3219-U1-MAT",
    canonicalName: "Matrices & Vectors: 2x2 Matrix Addition and Subtraction",
    description: "Direct component-wise addition of 2x2 matrices: C_ij = A_ij + B_ij.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-MAT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Matrices & Vectors: 2x2 Matrix Addition and Subtraction."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Matrices & Vectors: 2x2 Matrix Addition and Subtraction"
    }]
  },
  {
    id: "BSIE3219-U1-SEQ",
    canonicalName: "Progressions: Arithmetic Progression n-th Term and Series Sum",
    description: "Direct calculation of AP n-th term a_n = a1 + (n - 1)*d and sum S_n = (n / 2) * (2*a1 + (n - 1)*d).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-SEQ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Progressions: Arithmetic Progression n-th Term and Series Sum."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Progressions: Arithmetic Progression n-th Term and Series Sum"
    }]
  },
  {
    id: "BSIE3219-U1-SNK",
    canonicalName: "Engineering Economics: Sinking Fund Annual Deposit Factor (A/F)",
    description: "Direct calculation of annual sinking fund deposit A = F * [ i / ((1 + i)^n - 1) ] to accumulate future target.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-SNK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Sinking Fund Annual Deposit Factor (A/F)."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Sinking Fund Annual Deposit Factor (A/F)"
    }]
  },
  {
    id: "BSIE3219-U1-UAG",
    canonicalName: "Engineering Economics: Arithmetic Gradient Cash Flow Identification",
    description: "Direct identification of gradient cash flow: base annuity A1 = $2,000, annual gradient G = $500, evaluating cash flow at year t: A_t = A1 + (t - 1) * G.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U1-UAG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Arithmetic Gradient Cash Flow Identification."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Arithmetic Gradient Cash Flow Identification"
    }]
  },
  {
    id: "BSIE3219-U2-CRC",
    canonicalName: "Analytic Geometry: Standard Center-Radius Circle Equation",
    description: "Direct formulation of circle equation (x - h)^2 + (y - k)^2 = r^2 from center C(-2, 5) and radius r = 4.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U2-CRC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Analytic Geometry: Standard Center-Radius Circle Equation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Standard Center-Radius Circle Equation"
    }]
  },
  {
    id: "BSIE3219-U2-ELP",
    canonicalName: "Analytic Geometry: Ellipse Standard Parameters & Foci Distance",
    description: "Direct extraction of parameters from standard horizontal ellipse x^2/a^2 + y^2/b^2 = 1: a = 5, b = 4, c = sqrt(a^2 - b^2) = 3.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U2-ELP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Analytic Geometry: Ellipse Standard Parameters & Foci Distance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Ellipse Standard Parameters & Foci Distance"
    }]
  },
  {
    id: "BSIE3219-U2-FRS",
    canonicalName: "Solid Mensuration: Frustum of a Right Circular Cone Volume",
    description: "Direct calculation of conical frustum volume V = (1/3) * pi * h * (R^2 + R*r + r^2) for bottom radius R = 6.0 cm, top radius r = 3.0 cm, height h = 10.0 cm.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U2-FRS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Mensuration: Frustum of a Right Circular Cone Volume."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Frustum of a Right Circular Cone Volume"
    }]
  },
  {
    id: "BSIE3219-U2-HYPR",
    canonicalName: "Analytic Geometry: Standard Hyperbola Foci & Vertices",
    description: "Direct calculation of parameters from standard horizontal hyperbola x^2/a^2 - y^2/b^2 = 1: a = 4, b = 3, foci c = sqrt(a^2 + b^2) = 5.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U2-HYPR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Analytic Geometry: Standard Hyperbola Foci & Vertices."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Standard Hyperbola Foci & Vertices"
    }]
  },
  {
    id: "BSIE3219-U2-PAR",
    canonicalName: "Analytic Geometry: Parabola Vertex, Focus & Directrix",
    description: "Direct extraction of focal parameter p from standard parabola equation y^2 = 4*p*x.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U2-PAR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Analytic Geometry: Parabola Vertex, Focus & Directrix."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Parabola Vertex, Focus & Directrix"
    }]
  },
  {
    id: "BSIE3219-U3-DEF",
    canonicalName: "Integral Calculus: Fundamental Theorem of Calculus Definite Integral",
    description: "Direct evaluation of definite integral integral_1^3 (2x + 1) dx = [ x^2 + x ]_1^3.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U3-DEF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Integral Calculus: Fundamental Theorem of Calculus Definite Integral."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Integral Calculus: Fundamental Theorem of Calculus Definite Integral"
    }]
  },
  {
    id: "BSIE3219-U3-FIN",
    canonicalName: "Engineering Economics: Net Present Value (NPV) Discounted Cash Flow",
    description: "Direct calculation of Net Present Value NPV = Sum [ CF_t / (1 + i)^t ] - Initial Cost.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U3-FIN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Net Present Value (NPV) Discounted Cash Flow."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Net Present Value (NPV) Discounted Cash Flow"
    }]
  },
  {
    id: "BSIE3219-U3-PWR",
    canonicalName: "Integral Calculus: Indefinite Integration Power Rule",
    description: "Direct integration using power rule: integral x^n dx = x^(n+1)/(n+1) + C for n != -1.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U3-PWR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Integral Calculus: Indefinite Integration Power Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Integral Calculus: Indefinite Integration Power Rule"
    }]
  },
  {
    id: "BSIE3219-U3-SLD",
    canonicalName: "Solid Geometry: Right Regular Hexagonal Prism Volume & Lateral Area",
    description: "Direct calculation of base regular hexagon area A_base = (3*sqrt(3)/2) * s^2, lateral area A_lat = 6 * s * H, and volume V = A_base * H.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U3-SLD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Geometry: Right Regular Hexagonal Prism Volume & Lateral Area."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Geometry: Right Regular Hexagonal Prism Volume & Lateral Area"
    }]
  },
  {
    id: "BSIE3219-U4-BNK",
    canonicalName: "Applied Mechanics: Centripetal Acceleration on a Circular Curve",
    description: "Direct calculation of centripetal acceleration a_c = v^2 / r for vehicle on highway curve.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-BNK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Centripetal Acceleration on a Circular Curve."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Centripetal Acceleration on a Circular Curve"
    }]
  },
  {
    id: "BSIE3219-U4-CIR",
    canonicalName: "Applied Mechanics: Centripetal Acceleration and Centripetal Force",
    description: "Direct calculation of centripetal acceleration a_c = v^2 / r and centripetal force F_c = m * v^2 / r.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-CIR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Centripetal Acceleration and Centripetal Force."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Centripetal Acceleration and Centripetal Force"
    }]
  },
  {
    id: "BSIE3219-U4-COP",
    canonicalName: "Applied Mechanics: Concurrent Coplanar Force Equilibrium",
    description: "Direct vector equilibrium sum F_x = 0, sum F_y = 0 on a suspended weight supported by two symmetric cables.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-COP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Concurrent Coplanar Force Equilibrium."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Concurrent Coplanar Force Equilibrium"
    }]
  },
  {
    id: "BSIE3219-U4-DRP",
    canonicalName: "Applied Mechanics: Free Fall from Rest Velocity and Drop Distance",
    description: "Direct calculation of free fall velocity v = g * t and drop distance h = (1/2) * g * t^2 under gravity g = 9.81 m/s^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-DRP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Free Fall from Rest Velocity and Drop Distance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Free Fall from Rest Velocity and Drop Distance"
    }]
  },
  {
    id: "BSIE3219-U4-FRC",
    canonicalName: "Applied Mechanics: Horizontal Static Friction Threshold",
    description: "Direct calculation of maximum static friction force F_s,max = mu_s * N = mu_s * m * g on horizontal surface.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-FRC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Horizontal Static Friction Threshold."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Horizontal Static Friction Threshold"
    }]
  },
  {
    id: "BSIE3219-U4-KIN",
    canonicalName: "Applied Mechanics: Free Fall Maximum Height & Flight Time",
    description: "Direct calculation of vertical projectile peak height h_max = v0^2 / (2*g) and flight time t_total = 2*v0 / g under acceleration g = 9.81 m/s^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-KIN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Free Fall Maximum Height & Flight Time."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Free Fall Maximum Height & Flight Time"
    }]
  },
  {
    id: "BSIE3219-U4-PRJ",
    canonicalName: "Applied Mechanics: Projectile Maximum Height and Total Flight Time",
    description: "Direct calculation of projectile apex height h_max = (v0*sin theta)^2 / (2*g) and flight time t = 2*v0*sin theta / g over flat ground.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-PRJ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Projectile Maximum Height and Total Flight Time."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Projectile Maximum Height and Total Flight Time"
    }]
  },
  {
    id: "BSIE3219-U4-REC",
    canonicalName: "Applied Mechanics: Constant Acceleration Velocity-Displacement Relation",
    description: "Direct calculation of stopping distance d = v0^2 / (2 * a) using kinematic equation v^2 = v0^2 + 2*a*d.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-REC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Constant Acceleration Velocity-Displacement Relation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Constant Acceleration Velocity-Displacement Relation"
    }]
  },
  {
    id: "BSIE3219-U4-TRS",
    canonicalName: "Applied Mechanics: Pin-Jointed Planar Truss Zero-Force Member Inspection",
    description: "Applies zero-force member inspection rules: if two non-collinear members meet at an unloaded pin joint, both members must carry zero force (F1 = F2 = 0).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-TRS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Pin-Jointed Planar Truss Zero-Force Member Inspection."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Pin-Jointed Planar Truss Zero-Force Member Inspection"
    }]
  },
  {
    id: "BSIE3219-U4-WRK",
    canonicalName: "Applied Mechanics: Work-Energy Theorem Constant Force Braking",
    description: "Direct calculation of mechanical work W = F * d and application of work-energy theorem W_net = Delta K = (1/2)*m*vf^2 - (1/2)*m*vi^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-BSIE3219",
    parentTopicId: "BSIE3219-U4-WRK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Mechanics: Work-Energy Theorem Constant Force Braking."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Mechanics: Work-Energy Theorem Constant Force Braking"
    }]
  },
  {
    id: "GEN0101-U1-ABS",
    canonicalName: "Arithmetic Fluency: Absolute Value Numerical Evaluation",
    description: "Direct calculation of absolute value distance |a - b| on the real number line.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-ABS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Arithmetic Fluency: Absolute Value Numerical Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Absolute Value Numerical Evaluation"
    }]
  },
  {
    id: "GEN0101-U1-AIR",
    canonicalName: "Applied Word Problems: Effective Ground Speed with Wind",
    description: "Direct calculation of ground speed: Tailwind v_ground = v_air + w, Headwind v_ground = v_air - w.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-AIR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Word Problems: Effective Ground Speed with Wind."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Effective Ground Speed with Wind"
    }]
  },
  {
    id: "GEN0101-U1-ALM",
    canonicalName: "Applied Word Problems: Two-Solution Direct Concentration Blending",
    description: "Direct evaluation of blended concentration c_f = (c1*V1 + c2*V2) / (V1 + V2).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-ALM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Word Problems: Two-Solution Direct Concentration Blending."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Two-Solution Direct Concentration Blending"
    }]
  },
  {
    id: "GEN0101-U1-ANN",
    canonicalName: "Engineering Economics: Future Value of an Ordinary Annuity",
    description: "Direct calculation of future accumulated annuity sum F = A * [((1 + i)^n - 1) / i].",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-ANN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Economics: Future Value of an Ordinary Annuity."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Economics: Future Value of an Ordinary Annuity"
    }]
  },
  {
    id: "GEN0101-U1-APS",
    canonicalName: "Progressions: Sum of First n Positive Integers",
    description: "Direct Gauss summation formula: S_n = n * (n + 1) / 2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-APS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Progressions: Sum of First n Positive Integers."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Progressions: Sum of First n Positive Integers"
    }]
  },
  {
    id: "GEN0101-U1-ARITH",
    canonicalName: "Arithmetic Fluency: Canonical Prime Factorization",
    description: "Direct decomposition of composite integers into product of prime powers.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-ARITH",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Arithmetic Fluency: Canonical Prime Factorization."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Canonical Prime Factorization"
    }]
  },
  {
    id: "GEN0101-U1-BIN",
    canonicalName: "Binomial Expansion: Specific Term Extraction",
    description: "Direct application of general term formula T_(r+1) = nCr * a^(n-r) * b^r for integer powers.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-BIN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Binomial Expansion: Specific Term Extraction."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Binomial Expansion: Specific Term Extraction"
    }]
  },
  {
    id: "GEN0101-U1-CFX",
    canonicalName: "Fractions & Decimals: Numerical Complex Fraction Evaluation",
    description: "Direct simplification of numerical complex fraction by evaluating numerator and denominator separately.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-CFX",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fractions & Decimals: Numerical Complex Fraction Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fractions & Decimals: Numerical Complex Fraction Evaluation"
    }]
  },
  {
    id: "GEN0101-U1-CKA",
    canonicalName: "Applied Word Problems: Clock Hand Angular Speeds",
    description: "Direct calculation of angular velocities: minute hand omega_m = 6.0 deg/min, hour hand omega_h = 0.50 deg/min, relative speed = 5.50 deg/min.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-CKA",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Word Problems: Clock Hand Angular Speeds."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Clock Hand Angular Speeds"
    }]
  },
  {
    id: "GEN0101-U1-CLK",
    canonicalName: "Applied Word Problems: Clock Hands Coincident Alignment",
    description: "Direct calculation of minute hand (6 deg/min) and hour hand (0.5 deg/min) relative speed (5.5 deg/min = 11/2 deg/min) to find exact coincident time after hour H.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-CLK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Word Problems: Clock Hands Coincident Alignment."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Clock Hands Coincident Alignment"
    }]
  },
  {
    id: "GEN0101-U1-DET",
    canonicalName: "Linear Algebra: 2x2 Determinants & Matrix Inversion",
    description: "Direct calculation of 2x2 determinant det(A) = ad - bc and inverse matrix.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-DET",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Linear Algebra: 2x2 Determinants & Matrix Inversion."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Linear Algebra: 2x2 Determinants & Matrix Inversion"
    }]
  },
  {
    id: "GEN0101-U1-DIM",
    canonicalName: "Arithmetic Fluency: Multi-Step Dimensional Analysis Unit Conversion Chain",
    description: "Direct conversion using unit fraction chains: converts speed v = 90.0 km/h to m/s.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-DIM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Arithmetic Fluency: Multi-Step Dimensional Analysis Unit Conversion Chain."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Multi-Step Dimensional Analysis Unit Conversion Chain"
    }]
  },
  {
    id: "GEN0101-U1-DOM",
    canonicalName: "Functions & Models: Domain of a Square Root Radical Function",
    description: "Direct inequality setup for real square roots: radicand >= 0 for f(x) = sqrt(2x - 6).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-DOM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Functions & Models: Domain of a Square Root Radical Function."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Functions & Models: Domain of a Square Root Radical Function"
    }]
  },
  {
    id: "GEN0101-U1-EXP",
    canonicalName: "Laws of Exponents: Zero and Negative Integer Exponents",
    description: "Direct evaluation of fundamental rules: a^0 = 1 and a^(-n) = 1 / a^n.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-EXP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Laws of Exponents: Zero and Negative Integer Exponents."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Laws of Exponents: Zero and Negative Integer Exponents"
    }]
  },
  {
    id: "GEN0101-U1-FCT",
    canonicalName: "Basic Algebra: Factoring Monic Quadratic Trinomials",
    description: "Direct factoring of quadratic trinomial x^2 + bx + c into (x + p)(x + q) where p*q = c and p + q = b.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-FCT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Basic Algebra: Factoring Monic Quadratic Trinomials."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Factoring Monic Quadratic Trinomials"
    }]
  },
  {
    id: "GEN0101-U1-FRAC",
    canonicalName: "Fractions & Decimals: Conversion of Repeating Decimal to Rational Fraction",
    description: "Direct algebraic conversion of repeating decimals x = 0.4777... to irreducible vulgar fraction a/b.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-FRAC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fractions & Decimals: Conversion of Repeating Decimal to Rational Fraction."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fractions & Decimals: Conversion of Repeating Decimal to Rational Fraction"
    }]
  },
  {
    id: "GEN0101-U1-LEQ",
    canonicalName: "Basic Algebra: Linear Equations with Parentheses",
    description: "Direct expansion of linear distribution: 4*(x - 1) + 2 = 3*x + 3.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-LEQ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Basic Algebra: Linear Equations with Parentheses."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Linear Equations with Parentheses"
    }]
  },
  {
    id: "GEN0101-U1-LINQ",
    canonicalName: "Polynomial Inequalities: One-Step Linear Inequality",
    description: "Direct solution of linear inequality ax - b > c: isolates x and writes in interval notation.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-LINQ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Polynomial Inequalities: One-Step Linear Inequality."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Polynomial Inequalities: One-Step Linear Inequality"
    }]
  },
  {
    id: "GEN0101-U1-LIT",
    canonicalName: "Formula Transposition: Kinetic Energy Velocity Transposition",
    description: "Direct formula transposition: K = (1/2)*m*v^2 ==> v = sqrt(2*K / m).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-LIT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Formula Transposition: Kinetic Energy Velocity Transposition."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Formula Transposition: Kinetic Energy Velocity Transposition"
    }]
  },
  {
    id: "GEN0101-U1-LOGQ",
    canonicalName: "Logarithmic & Exponential: Basic Exponential Equation with Common Base",
    description: "Direct equating of exponents for equal bases: 2^(x + 3) = 64.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-LOGQ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Logarithmic & Exponential: Basic Exponential Equation with Common Base."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Logarithmic & Exponential: Basic Exponential Equation with Common Base"
    }]
  },
  {
    id: "GEN0101-U1-MIX",
    canonicalName: "Applied Word Problems: Two-Component Chemical Solution Blending",
    description: "Direct linear conservation of solute mass equation: C1 * V1 + C2 * V2 = C_target * (V1 + V2).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-MIX",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Word Problems: Two-Component Chemical Solution Blending."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Two-Component Chemical Solution Blending"
    }]
  },
  {
    id: "GEN0101-U1-MOT",
    canonicalName: "Applied Word Problems: Uniform Motion in Opposing Directions",
    description: "Direct closing speed addition v_closing = v1 + v2 to find collision / encounter time t = Distance / v_closing.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-MOT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Word Problems: Uniform Motion in Opposing Directions."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Uniform Motion in Opposing Directions"
    }]
  },
  {
    id: "GEN0101-U1-MXF",
    canonicalName: "Fractions & Decimals: Addition and Subtraction of Mixed Numbers",
    description: "Direct subtraction of mixed numbers with common denominator: 3 1/2 - 1 3/4 = 7/2 - 7/4 = 7/4 = 1 3/4.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-MXF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fractions & Decimals: Addition and Subtraction of Mixed Numbers."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fractions & Decimals: Addition and Subtraction of Mixed Numbers"
    }]
  },
  {
    id: "GEN0101-U1-ORD",
    canonicalName: "Arithmetic Fluency: Standard Order of Operations (PEMDAS)",
    description: "Direct calculation enforcing strict hierarchy: Parentheses -> Exponents -> Multiplication/Division (left to right) -> Addition/Subtraction.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-ORD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Arithmetic Fluency: Standard Order of Operations (PEMDAS)."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Standard Order of Operations (PEMDAS)"
    }]
  },
  {
    id: "GEN0101-U1-PCT",
    canonicalName: "Percentage, Ratio & Proportion: Percentage Increase and Decrease",
    description: "Direct calculation of percentage change: Percentage = ((New - Old) / Old) * 100%.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-PCT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Percentage, Ratio & Proportion: Percentage Increase and Decrease."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Percentage, Ratio & Proportion: Percentage Increase and Decrease"
    }]
  },
  {
    id: "GEN0101-U1-PF",
    canonicalName: "Partial Fraction Decomposition: Distinct Linear Factors",
    description: "Denominator contains only distinct linear factors; solvable via direct Heaviside cover-up method.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-PF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Partial Fraction Decomposition: Distinct Linear Factors."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Partial Fraction Decomposition: Distinct Linear Factors"
    }]
  },
  {
    id: "GEN0101-U1-PRM",
    canonicalName: "Arithmetic Fluency: Prime Factorization of Composite Integers",
    description: "Direct prime factorization of composite number: 720 = 2^4 * 3^2 * 5.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-PRM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Arithmetic Fluency: Prime Factorization of Composite Integers."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Arithmetic Fluency: Prime Factorization of Composite Integers"
    }]
  },
  {
    id: "GEN0101-U1-PROD",
    canonicalName: "Basic Algebra: Perfect Square Trinomial Expansion",
    description: "Direct expansion of perfect square binomial: (3x + 5)^2 = 9x^2 + 30x + 25.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-PROD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Basic Algebra: Perfect Square Trinomial Expansion."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Perfect Square Trinomial Expansion"
    }]
  },
  {
    id: "GEN0101-U1-QEQ",
    canonicalName: "Polynomial Equations: Discriminant Evaluation & Nature of Roots",
    description: "Direct calculation of discriminant Delta = b^2 - 4*a*c to classify roots (real distinct, real repeated, or complex).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-QEQ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Polynomial Equations: Discriminant Evaluation & Nature of Roots."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Polynomial Equations: Discriminant Evaluation & Nature of Roots"
    }]
  },
  {
    id: "GEN0101-U1-RAD",
    canonicalName: "Laws of Exponents: Evaluation of Fractional Exponents",
    description: "Direct calculation of numerical expressions with fractional exponents a^(m/n) = (n-th root of a)^m.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-RAD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Laws of Exponents: Evaluation of Fractional Exponents."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Laws of Exponents: Evaluation of Fractional Exponents"
    }]
  },
  {
    id: "GEN0101-U1-RAT",
    canonicalName: "Percentage, Ratio & Proportion: Partitive Proportion Division",
    description: "Direct partition of a total quantity into parts according to given integer ratio k1 : k2 : k3.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-RAT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Percentage, Ratio & Proportion: Partitive Proportion Division."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Percentage, Ratio & Proportion: Partitive Proportion Division"
    }]
  },
  {
    id: "GEN0101-U1-RTQ",
    canonicalName: "Basic Algebra: Simple Rational Equation by Cross-Multiplication",
    description: "Direct cross-multiplication of single-fraction proportion: x / (x + 2) = 3 / (x + 4).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-RTQ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Basic Algebra: Simple Rational Equation by Cross-Multiplication."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Simple Rational Equation by Cross-Multiplication"
    }]
  },
  {
    id: "GEN0101-U1-SCL",
    canonicalName: "Percentage, Ratio & Proportion: Continuous Ratio Simplification",
    description: "Direct simplification of three-part continuous ratio by dividing by greatest common divisor: 12 : 18 : 30 = 2 : 3 : 5.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-SCL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Percentage, Ratio & Proportion: Continuous Ratio Simplification."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Percentage, Ratio & Proportion: Continuous Ratio Simplification"
    }]
  },
  {
    id: "GEN0101-U1-SYN",
    canonicalName: "Polynomial Equations: Synthetic Division Remainder Theorem Evaluation",
    description: "Direct evaluation of polynomial P(x) = 2x^3 - 5x^2 + 3x - 8 at x = 3 using synthetic division, verifying P(3) = Remainder.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-SYN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Polynomial Equations: Synthetic Division Remainder Theorem Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Polynomial Equations: Synthetic Division Remainder Theorem Evaluation"
    }]
  },
  {
    id: "GEN0101-U1-SYS",
    canonicalName: "Systems of Equations: Linear and Quadratic Intersection",
    description: "Direct substitution of a linear equation y = mx + b into a single parabolic curve.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-SYS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Systems of Equations: Linear and Quadratic Intersection."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Systems of Equations: Linear and Quadratic Intersection"
    }]
  },
  {
    id: "GEN0101-U1-SYS2",
    canonicalName: "Linear Systems: 2x2 System Solution by Direct Elimination",
    description: "Direct elimination where one variable cancels immediately upon addition or subtraction: 2x + 3y = 12 and 2x - y = 4.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-SYS2",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Linear Systems: 2x2 System Solution by Direct Elimination."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Linear Systems: 2x2 System Solution by Direct Elimination"
    }]
  },
  {
    id: "GEN0101-U1-TRP",
    canonicalName: "Basic Algebra: Formula Transposition for a Single Variable",
    description: "Direct algebraic isolation of variable in linear geometric formula: A = (1/2) * b * h to solve for h.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-TRP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Basic Algebra: Formula Transposition for a Single Variable."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Basic Algebra: Formula Transposition for a Single Variable"
    }]
  },
  {
    id: "GEN0101-U1-VAR",
    canonicalName: "Variation & Proportion: Direct and Inverse Variation",
    description: "Direct calculation of variation constant k in y = k * x and evaluating for new parameters.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-VAR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Variation & Proportion: Direct and Inverse Variation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Variation & Proportion: Direct and Inverse Variation"
    }]
  },
  {
    id: "GEN0101-U1-VRP",
    canonicalName: "Percentage, Ratio & Proportion: Direct Variation Constant Evaluation",
    description: "Direct calculation of direct variation constant k = y / x and evaluation for new independent variable.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-VRP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Percentage, Ratio & Proportion: Direct Variation Constant Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Percentage, Ratio & Proportion: Direct Variation Constant Evaluation"
    }]
  },
  {
    id: "GEN0101-U1-WRK",
    canonicalName: "Applied Word Problems: Combined Work Rate",
    description: "Direct reciprocal rate addition 1/t_total = 1/t1 + 1/t2 for two workers completing a task together.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U1-WRK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Word Problems: Combined Work Rate."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Word Problems: Combined Work Rate"
    }]
  },
  {
    id: "GEN0101-U2-ELV",
    canonicalName: "Engineering Trigonometry: Angle of Elevation Height Calculation",
    description: "Direct right-triangle tangent calculation: Height = Distance * tan(theta).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U2-ELV",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Trigonometry: Angle of Elevation Height Calculation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Trigonometry: Angle of Elevation Height Calculation"
    }]
  },
  {
    id: "GEN0101-U2-HARM",
    canonicalName: "Trigonometry: Double Angle & Sum-to-Product Reductions",
    description: "Direct simplification using fundamental trigonometric identities.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U2-HARM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Trigonometry: Double Angle & Sum-to-Product Reductions."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Trigonometry: Double Angle & Sum-to-Product Reductions"
    }]
  },
  {
    id: "GEN0101-U2-IDN",
    canonicalName: "Engineering Trigonometry: Pythagorean Identity Cosine Evaluation",
    description: "Direct application of fundamental identity sin^2(theta) + cos^2(theta) = 1 for acute angle theta.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U2-IDN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Trigonometry: Pythagorean Identity Cosine Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Trigonometry: Pythagorean Identity Cosine Evaluation"
    }]
  },
  {
    id: "GEN0101-U2-RTR",
    canonicalName: "Right-Triangle Principles: Trigonometric Ratios for Missing Side",
    description: "Direct calculation of opposite side y = hyp * sin(theta) and adjacent side x = hyp * cos(theta).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U2-RTR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Right-Triangle Principles: Trigonometric Ratios for Missing Side."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Right-Triangle Principles: Trigonometric Ratios for Missing Side"
    }]
  },
  {
    id: "GEN0101-U2-SSA",
    canonicalName: "Oblique Triangles: Law of Sines Direct Angle Calculation",
    description: "Direct calculation of angle using Law of Sines: sin(B) = (b / a) * sin(A) for acute oblique triangle.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U2-SSA",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Oblique Triangles: Law of Sines Direct Angle Calculation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Oblique Triangles: Law of Sines Direct Angle Calculation"
    }]
  },
  {
    id: "GEN0101-U2-TRIG",
    canonicalName: "Oblique Triangles: Direct Law of Cosines",
    description: "Standard SAS triangle with straightforward application of Law of Cosines to find the opposing side.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U2-TRIG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Oblique Triangles: Direct Law of Cosines."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Oblique Triangles: Direct Law of Cosines"
    }]
  },
  {
    id: "GEN0101-U3-3D",
    canonicalName: "3D Analytic Geometry: Equation of a Plane Through Three Points",
    description: "Constructs two displacement vectors in 3D and computes their vector cross product to find plane normal vector n = [A, B, C].",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-3D",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for 3D Analytic Geometry: Equation of a Plane Through Three Points."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "3D Analytic Geometry: Equation of a Plane Through Three Points"
    }]
  },
  {
    id: "GEN0101-U3-ANG",
    canonicalName: "Analytic Geometry: Acute Angle Between Two Intersecting Lines",
    description: "Direct calculation of intersection angle tan(theta) = |(m2 - m1) / (1 + m1 * m2)| from slopes m1 and m2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-ANG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Analytic Geometry: Acute Angle Between Two Intersecting Lines."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Acute Angle Between Two Intersecting Lines"
    }]
  },
  {
    id: "GEN0101-U3-CON",
    canonicalName: "Conic Sections: Shifted Parabola Vertex & Focal Parameters",
    description: "Completing the square on standard quadratic single variable to find focal length, vertex, and directrix.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-CON",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Conic Sections: Shifted Parabola Vertex & Focal Parameters."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Conic Sections: Shifted Parabola Vertex & Focal Parameters"
    }]
  },
  {
    id: "GEN0101-U3-DST",
    canonicalName: "Analytic Geometry: Perpendicular Distance from a Point to a Line",
    description: "Direct calculation of perpendicular distance d = |A*x0 + B*y0 + C| / sqrt(A^2 + B^2).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-DST",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Analytic Geometry: Perpendicular Distance from a Point to a Line."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Analytic Geometry: Perpendicular Distance from a Point to a Line"
    }]
  },
  {
    id: "GEN0101-U3-HYP",
    canonicalName: "Conic Sections: Centered Hyperbola Asymptotes & Foci",
    description: "Direct extraction of standard parameters a, b, c = sqrt(a^2 + b^2) and asymptote lines y = +-(b/a)x.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-HYP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Conic Sections: Centered Hyperbola Asymptotes & Foci."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Conic Sections: Centered Hyperbola Asymptotes & Foci"
    }]
  },
  {
    id: "GEN0101-U3-LIN",
    canonicalName: "Rectangular Coordinates: Distance and Midpoint of a Line Segment",
    description: "Direct calculation of distance d = sqrt((x2 - x1)^2 + (y2 - y1)^2) and midpoint M = ((x1+x2)/2, (y1+y2)/2).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-LIN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Rectangular Coordinates: Distance and Midpoint of a Line Segment."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Rectangular Coordinates: Distance and Midpoint of a Line Segment"
    }]
  },
  {
    id: "GEN0101-U3-LNA",
    canonicalName: "Rectangular Coordinates: Acute Angle Between Two Straight Lines",
    description: "Direct calculation of acute angle tan(theta) = | (m2 - m1) / (1 + m1*m2) | between lines of slopes m1 = 2 and m2 = -3.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-LNA",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Rectangular Coordinates: Acute Angle Between Two Straight Lines."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Rectangular Coordinates: Acute Angle Between Two Straight Lines"
    }]
  },
  {
    id: "GEN0101-U3-PTL",
    canonicalName: "Rectangular Coordinates: Point-to-Line Perpendicular Distance",
    description: "Direct application of distance formula d = |A*x0 + B*y0 + C| / sqrt(A^2 + B^2) for P(2, 3) to 3x + 4y - 6 = 0.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-PTL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Rectangular Coordinates: Point-to-Line Perpendicular Distance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Rectangular Coordinates: Point-to-Line Perpendicular Distance"
    }]
  },
  {
    id: "GEN0101-U3-SEC",
    canonicalName: "Rectangular Coordinates: Internal Ratio Division of a Line Segment",
    description: "Direct application of section formula: x = (m*x2 + n*x1)/(m + n) for ratio m : n = 1 : 2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U3-SEC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Rectangular Coordinates: Internal Ratio Division of a Line Segment."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Rectangular Coordinates: Internal Ratio Division of a Line Segment"
    }]
  },
  {
    id: "GEN0101-U4-BUOY",
    canonicalName: "Solid Mensuration: Surface Area of a Spherical Zone",
    description: "Direct application of Archimedes spherical zone surface area formula A = 2*pi*R*h.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-BUOY",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Mensuration: Surface Area of a Spherical Zone."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Surface Area of a Spherical Zone"
    }]
  },
  {
    id: "GEN0101-U4-HRN",
    canonicalName: "Solid Mensuration: Heron's Formula for Triangle Area",
    description: "Direct calculation of triangle area using semi-perimeter s = (a + b + c)/2 and Heron's formula A = sqrt(s*(s-a)*(s-b)*(s-c)).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-HRN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Mensuration: Heron's Formula for Triangle Area."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Heron's Formula for Triangle Area"
    }]
  },
  {
    id: "GEN0101-U4-PHAS",
    canonicalName: "Complex Numbers: Rectangular to Polar Phasor Conversion",
    description: "Direct conversion of complex impedance Z = R + jX into polar magnitude |Z| and argument theta.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-PHAS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Complex Numbers: Rectangular to Polar Phasor Conversion."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Complex Numbers: Rectangular to Polar Phasor Conversion"
    }]
  },
  {
    id: "GEN0101-U4-POL",
    canonicalName: "Solid Mensuration: Regular Polygon Apothem & Area",
    description: "Direct calculation of regular polygon apothem a = s / [2*tan(180/n)] and area A = (1/2) * n * s * a.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-POL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Mensuration: Regular Polygon Apothem & Area."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Regular Polygon Apothem & Area"
    }]
  },
  {
    id: "GEN0101-U4-QAD",
    canonicalName: "Solid Mensuration: Trapezoid Area Formula",
    description: "Direct calculation of trapezoid area A = (1/2) * (b1 + b2) * h.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-QAD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Mensuration: Trapezoid Area Formula."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Trapezoid Area Formula"
    }]
  },
  {
    id: "GEN0101-U4-REG",
    canonicalName: "Solid Mensuration: Regular Hexagon Area and Apothem",
    description: "Direct calculation of regular hexagon apothem a = (sqrt(3)/2)*s and area A = (3*sqrt(3)/2)*s^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-REG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Mensuration: Regular Hexagon Area and Apothem."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Regular Hexagon Area and Apothem"
    }]
  },
  {
    id: "GEN0101-U4-SCR",
    canonicalName: "Engineering Friction: Impending Slip on an Inclined Plane",
    description: "Direct relationship between static friction coefficient and critical angle of repose theta_c = arctan(mu_s).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-SCR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Friction: Impending Slip on an Inclined Plane."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Friction: Impending Slip on an Inclined Plane"
    }]
  },
  {
    id: "GEN0101-U4-SEG",
    canonicalName: "Solid Mensuration: Circular Sector Area Formula",
    description: "Direct calculation of circular sector area A = (1/2)*r^2*theta (with theta in radians) or A = (theta_deg / 360) * pi * r^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-SEG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Mensuration: Circular Sector Area Formula."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Circular Sector Area Formula"
    }]
  },
  {
    id: "GEN0101-U4-SOL",
    canonicalName: "Solid Mensuration: Frustum of a Right Circular Cone",
    description: "Direct calculation of volume using standard frustum formula V = (1/3)pi h (R^2 + r^2 + R*r).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-SOL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solid Mensuration: Frustum of a Right Circular Cone."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solid Mensuration: Frustum of a Right Circular Cone"
    }]
  },
  {
    id: "GEN0101-U4-TRS",
    canonicalName: "Structural Statics: Method of Joints at 2-Member Pin Node",
    description: "Direct 2D concurrent force equilibrium Sum(Fx) = 0 and Sum(Fy) = 0 at a single pin joint.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-TRS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Structural Statics: Method of Joints at 2-Member Pin Node."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Structural Statics: Method of Joints at 2-Member Pin Node"
    }]
  },
  {
    id: "GEN0101-U4-VEC",
    canonicalName: "Vector Mechanics: Vector Cross Product & Parallelogram Area",
    description: "Direct computation of cross product u x v and its magnitude |u x v| representing geometric area.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0101",
    parentTopicId: "GEN0101-U4-VEC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Vector Mechanics: Vector Cross Product & Parallelogram Area."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vector Mechanics: Vector Cross Product & Parallelogram Area"
    }]
  },
  {
    id: "GEN0102-U1-CHN",
    canonicalName: "Differentiation Rules: Generalized Power Rule for Polynomial Powers",
    description: "Direct chain rule on power function: d/dx[(u)^n] = n * (u)^(n-1) * (du/dx).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-CHN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Generalized Power Rule for Polynomial Powers."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Generalized Power Rule for Polynomial Powers"
    }]
  },
  {
    id: "GEN0102-U1-CHNX",
    canonicalName: "Differentiation Rules: Exponential of Trigonometric Chain Rule",
    description: "Direct chain rule on e^(sin(2x)): d/dx[ e^(sin(2x)) ] = 2*cos(2x) * e^(sin(2x)).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-CHNX",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Exponential of Trigonometric Chain Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Exponential of Trigonometric Chain Rule"
    }]
  },
  {
    id: "GEN0102-U1-CNT",
    canonicalName: "Limits & Continuity Concepts: Left and Right Hand Limits",
    description: "Direct evaluation of one-sided limits from left (x -> c^-) and right (x -> c^+) for a piecewise function.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-CNT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Limits & Continuity Concepts: Left and Right Hand Limits."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Limits & Continuity Concepts: Left and Right Hand Limits"
    }]
  },
  {
    id: "GEN0102-U1-CUB",
    canonicalName: "Evaluating Limits: Difference of Cubes Factorization",
    description: "Direct evaluation of 0/0 limit by factoring difference of cubes: x^3 - 8 = (x - 2)(x^2 + 2x + 4).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-CUB",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Evaluating Limits: Difference of Cubes Factorization."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Evaluating Limits: Difference of Cubes Factorization"
    }]
  },
  {
    id: "GEN0102-U1-DIFF",
    canonicalName: "Differentiation Rules: Basic Power & Sum Rule",
    description: "Direct application of power rule d/dx[x^n] = n*x^(n-1) across standard polynomial terms.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-DIFF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Basic Power & Sum Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Power & Sum Rule"
    }]
  },
  {
    id: "GEN0102-U1-INF",
    canonicalName: "Limits at Infinity: Equal-Degree Rational Polynomials",
    description: "Direct identification of leading coefficients for equal degree polynomials as x -> infinity.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-INF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Limits at Infinity: Equal-Degree Rational Polynomials."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Limits at Infinity: Equal-Degree Rational Polynomials"
    }]
  },
  {
    id: "GEN0102-U1-LHO",
    canonicalName: "L'H\u00f4pital's Rule: 0/0 and inf/inf Ratios",
    description: "Direct single application of L'H\u00f4pital's rule on standard algebraic-exponential quotient.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-LHO",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for L'H\u00f4pital's Rule: 0/0 and inf/inf Ratios."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "L'H\u00f4pital's Rule: 0/0 and inf/inf Ratios"
    }]
  },
  {
    id: "GEN0102-U1-LIM",
    canonicalName: "Evaluating Limits: Factoring Standard Polynomial Forms",
    description: "Direct algebraic cancellation of a linear binomial factor (x - c). No radicals or parameter solving.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-LIM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Evaluating Limits: Factoring Standard Polynomial Forms."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Evaluating Limits: Factoring Standard Polynomial Forms"
    }]
  },
  {
    id: "GEN0102-U1-LINP",
    canonicalName: "Differentiation Rules: Power Rule with Linear Combination",
    description: "Direct differentiation of polynomial using constant multiple and sum/difference rules: d/dx[4x^5 - 3x^3 + 7x - 9] = 20x^4 - 9x^2 + 7.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-LINP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Power Rule with Linear Combination."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Power Rule with Linear Combination"
    }]
  },
  {
    id: "GEN0102-U1-NTRG",
    canonicalName: "Differentiation Rules: Tangent Trigonometric Chain Rule",
    description: "Direct differentiation of tangent chain rule: d/dx[tan(kx)] = k * sec^2(kx).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-NTRG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Tangent Trigonometric Chain Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Tangent Trigonometric Chain Rule"
    }]
  },
  {
    id: "GEN0102-U1-NUM",
    canonicalName: "Limits & Continuity Concepts: Table of Values Numerical Limit Estimation",
    description: "Direct numerical estimation of lim_{x -> 1} (x^2 - 1)/(x - 1) by evaluating function at x = 0.9, 0.99, 0.999 and x = 1.1, 1.01, 1.001.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-NUM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Limits & Continuity Concepts: Table of Values Numerical Limit Estimation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Limits & Continuity Concepts: Table of Values Numerical Limit Estimation"
    }]
  },
  {
    id: "GEN0102-U1-PRD",
    canonicalName: "Differentiation Rules: Product Rule for Polynomials",
    description: "Direct calculation using Product Rule d/dx[u*v] = u'*v + u*v' for f(x) = (2x + 3)*(x^2 - 1).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-PRD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Product Rule for Polynomials."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Product Rule for Polynomials"
    }]
  },
  {
    id: "GEN0102-U1-QUT",
    canonicalName: "Differentiation Rules: Basic Quotient Rule on Linear Rational Functions",
    description: "Direct application of quotient rule d/dx[u/v] = (u'*v - u*v') / v^2 on rational function f(x) = (3x + 1)/(x - 2).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-QUT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Basic Quotient Rule on Linear Rational Functions."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Quotient Rule on Linear Rational Functions"
    }]
  },
  {
    id: "GEN0102-U1-RATL",
    canonicalName: "Evaluating Limits: Conjugate Rationalization of Simple Radicals",
    description: "Direct evaluation of indeterminate 0/0 limit by multiplying numerator and denominator by radical conjugate: lim_{x -> 4} (sqrt(x) - 2)/(x - 4).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-RATL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Evaluating Limits: Conjugate Rationalization of Simple Radicals."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Evaluating Limits: Conjugate Rationalization of Simple Radicals"
    }]
  },
  {
    id: "GEN0102-U1-SNE",
    canonicalName: "Evaluating Limits: Standard Sine Ratio Limit Transformation",
    description: "Direct transformation to fundamental limit lim_{u -> 0} [ sin(u) / u ] = 1: lim_{x -> 0} [ sin(7x) / x ] = 7.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-SNE",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Evaluating Limits: Standard Sine Ratio Limit Transformation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Evaluating Limits: Standard Sine Ratio Limit Transformation"
    }]
  },
  {
    id: "GEN0102-U1-TRG",
    canonicalName: "Differentiation Rules: Basic Trigonometric Chain Rule",
    description: "Direct differentiation of fundamental trigonometric functions with linear arguments: d/dx[cos(ax)] = -a*sin(ax).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-TRG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Basic Trigonometric Chain Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Trigonometric Chain Rule"
    }]
  },
  {
    id: "GEN0102-U1-TRGLIM",
    canonicalName: "Trigonometric Limits: Standard Sine Ratio Transformation",
    description: "Direct scaling of argument using the fundamental limit lim (u -> 0) sin(u)/u = 1.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U1-TRGLIM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Trigonometric Limits: Standard Sine Ratio Transformation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Trigonometric Limits: Standard Sine Ratio Transformation"
    }]
  },
  {
    id: "GEN0102-U2-ATAN",
    canonicalName: "Differentiation Rules: Inverse Sine Chain Rule",
    description: "Direct chain rule on arcsin(u): d/dx[arcsin(2x)] = 2 / sqrt(1 - 4x^2).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-ATAN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Inverse Sine Chain Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Inverse Sine Chain Rule"
    }]
  },
  {
    id: "GEN0102-U2-AXP",
    canonicalName: "Differentiation Rules: General Base Exponential Function Derivative",
    description: "Direct differentiation using general base formula: d/dx[a^x] = a^x * ln(a) for a = 2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-AXP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: General Base Exponential Function Derivative."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: General Base Exponential Function Derivative"
    }]
  },
  {
    id: "GEN0102-U2-CAT",
    canonicalName: "Differentiation Rules: Hyperbolic Sine Chain Rule",
    description: "Direct chain rule on hyperbolic sine: d/dx[sinh(kx)] = k * cosh(kx).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-CAT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Hyperbolic Sine Chain Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Hyperbolic Sine Chain Rule"
    }]
  },
  {
    id: "GEN0102-U2-CIR",
    canonicalName: "Implicit Differentiation: Circle Tangent Slope",
    description: "Direct implicit differentiation of circle x^2 + y^2 = 25: 2x + 2y*y' = 0 ==> y' = -x / y.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-CIR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Implicit Differentiation: Circle Tangent Slope."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Implicit Differentiation: Circle Tangent Slope"
    }]
  },
  {
    id: "GEN0102-U2-CLR",
    canonicalName: "Partial Differentiation: First-Order Partial Derivatives",
    description: "Direct calculation of first-order partial derivatives fx and fy by treating the other variable as constant.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-CLR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Partial Differentiation: First-Order Partial Derivatives."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Partial Differentiation: First-Order Partial Derivatives"
    }]
  },
  {
    id: "GEN0102-U2-EXP",
    canonicalName: "Differentiation Rules: Basic Natural Exponential Chain Rule",
    description: "Direct chain rule on natural exponential function: d/dx[e^u] = e^u * (du/dx).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-EXP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Basic Natural Exponential Chain Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Natural Exponential Chain Rule"
    }]
  },
  {
    id: "GEN0102-U2-HOD",
    canonicalName: "Higher-Order Derivatives: Successive Derivatives of Polynomial & Rational Functions",
    description: "Sequential computation of derivatives up to 4th order: y, y', y'', y''', y^(4).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-HOD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Higher-Order Derivatives: Successive Derivatives of Polynomial & Rational Functions."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Higher-Order Derivatives: Successive Derivatives of Polynomial & Rational Functions"
    }]
  },
  {
    id: "GEN0102-U2-HYP",
    canonicalName: "Differentiation: Standard Hyperbolic Derivatives",
    description: "Direct differentiation of fundamental hyperbolic functions: d/dx(sinh(u)) = cosh(u)*u' and d/dx(cosh(u)) = sinh(u)*u'.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-HYP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation: Standard Hyperbolic Derivatives."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation: Standard Hyperbolic Derivatives"
    }]
  },
  {
    id: "GEN0102-U2-IMP",
    canonicalName: "Implicit Differentiation: Standard Conic",
    description: "First-order implicit differentiation on an orthogonal circle with numerical slope evaluation.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-IMP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Implicit Differentiation: Standard Conic."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Implicit Differentiation: Standard Conic"
    }]
  },
  {
    id: "GEN0102-U2-INV",
    canonicalName: "Inverse Trigonometric: Standard Arcsine Chain Rule",
    description: "Direct differentiation using standard derivative formula d/dx[arcsin(u)] = (1/sqrt(1 - u^2)) * du/dx.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-INV",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Inverse Trigonometric: Standard Arcsine Chain Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Inverse Trigonometric: Standard Arcsine Chain Rule"
    }]
  },
  {
    id: "GEN0102-U2-JRK",
    canonicalName: "Higher-Order Derivatives: Third Derivative Polynomial Evaluation",
    description: "Direct evaluation of third derivative f'''(x) for polynomial f(x) = x^4 - 5x^3 + 2x^2 - 7.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-JRK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Higher-Order Derivatives: Third Derivative Polynomial Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Higher-Order Derivatives: Third Derivative Polynomial Evaluation"
    }]
  },
  {
    id: "GEN0102-U2-LOG",
    canonicalName: "Logarithmic & Exponential: Standard Forms",
    description: "Direct differentiation of base e exponential and natural logarithm terms with simple constant multipliers.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-LOG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Logarithmic & Exponential: Standard Forms."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Logarithmic & Exponential: Standard Forms"
    }]
  },
  {
    id: "GEN0102-U2-LOGF",
    canonicalName: "Differentiation Rules: Basic Natural Logarithm Chain Rule",
    description: "Direct differentiation using logarithmic rule d/dx[ln(u)] = (du/dx) / u.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-LOGF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Differentiation Rules: Basic Natural Logarithm Chain Rule."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Differentiation Rules: Basic Natural Logarithm Chain Rule"
    }]
  },
  {
    id: "GEN0102-U2-MIX",
    canonicalName: "Partial Differentiation: Clairaut's Theorem & Mixed Second-Order Partials",
    description: "Verifies equality of mixed second partial derivatives f_xy = f_yx for a bivariate polynomial.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-MIX",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Partial Differentiation: Clairaut's Theorem & Mixed Second-Order Partials."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Partial Differentiation: Clairaut's Theorem & Mixed Second-Order Partials"
    }]
  },
  {
    id: "GEN0102-U2-PRT",
    canonicalName: "Partial Differentiation: First-Order Partial Derivatives of Algebraic Functions",
    description: "Direct partial differentiation: holding one variable strictly constant while differentiating with respect to the other.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U2-PRT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Partial Differentiation: First-Order Partial Derivatives of Algebraic Functions."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Partial Differentiation: First-Order Partial Derivatives of Algebraic Functions"
    }]
  },
  {
    id: "GEN0102-U3-AREA",
    canonicalName: "Applications of Definite Integrals: Area Between Parabola and Line",
    description: "Standard single-region vertical slicing Area = integral [y_top - y_bottom] dx between two intersection roots.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-AREA",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Definite Integrals: Area Between Parabola and Line."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Definite Integrals: Area Between Parabola and Line"
    }]
  },
  {
    id: "GEN0102-U3-BOX",
    canonicalName: "Applications of Derivative: Open-Top Box Volume Formulation",
    description: "Direct geometric formulation of open-top box volume V(x) = x*(L - 2x)*(W - 2x) formed by cutting squares of side x from corners of rectangular sheet.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-BOX",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Derivative: Open-Top Box Volume Formulation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Open-Top Box Volume Formulation"
    }]
  },
  {
    id: "GEN0102-U3-CAN",
    canonicalName: "Applications of Derivative: Cylindrical Can Surface Area Formulation",
    description: "Expresses total surface area A(r) = 2*pi*r^2 + 2*V/r of closed cylindrical can of fixed volume V = 1000 cm^3.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-CAN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Derivative: Cylindrical Can Surface Area Formulation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Cylindrical Can Surface Area Formulation"
    }]
  },
  {
    id: "GEN0102-U3-CONE",
    canonicalName: "Applications of Derivative: Conical Water Volume-Height Geometric Relation",
    description: "Direct geometric reduction of cone volume V = (1/3)*pi*r^2*h using similar triangles r = (R/H)*h.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-CONE",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Derivative: Conical Water Volume-Height Geometric Relation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Conical Water Volume-Height Geometric Relation"
    }]
  },
  {
    id: "GEN0102-U3-CRV",
    canonicalName: "Curve Tracing: Critical Numbers & Local Extrema of Cubics",
    description: "First derivative test on standard cubic polynomial with integer critical points.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-CRV",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Curve Tracing: Critical Numbers & Local Extrema of Cubics."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Curve Tracing: Critical Numbers & Local Extrema of Cubics"
    }]
  },
  {
    id: "GEN0102-U3-EXT",
    canonicalName: "Applications of Derivative: Finding Critical Numbers of a Cubic Polynomial",
    description: "Direct calculation of critical points by setting derivative f'(x) = 0 for a cubic polynomial.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-EXT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Derivative: Finding Critical Numbers of a Cubic Polynomial."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Finding Critical Numbers of a Cubic Polynomial"
    }]
  },
  {
    id: "GEN0102-U3-FNC",
    canonicalName: "Applications of Derivative: Perimeter-Constrained Rectangular Area Maximization",
    description: "Direct optimization of A(x) = x * (P/2 - x) for fixed perimeter P = 100 m, proving square shape yields maximum area.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-FNC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Derivative: Perimeter-Constrained Rectangular Area Maximization."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Perimeter-Constrained Rectangular Area Maximization"
    }]
  },
  {
    id: "GEN0102-U3-INF",
    canonicalName: "Polynomial Curves: Second Derivative Concavity Test",
    description: "Direct calculation of f''(x) to test whether a curve is concave upward (f'' > 0) or concave downward (f'' < 0) at a given point.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-INF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Polynomial Curves: Second Derivative Concavity Test."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Polynomial Curves: Second Derivative Concavity Test"
    }]
  },
  {
    id: "GEN0102-U3-INS",
    canonicalName: "Geometric Optimization: Inscribed Cylinder in a Sphere",
    description: "Maximizing cylinder volume inscribed in a sphere of fixed radius R using Pythagorean constraint r^2 + (h/2)^2 = R^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-INS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optimization: Inscribed Cylinder in a Sphere."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optimization: Inscribed Cylinder in a Sphere"
    }]
  },
  {
    id: "GEN0102-U3-KAP",
    canonicalName: "Plane Curves: Curvature Formula at Parabola Vertex",
    description: "Direct evaluation of curvature kappa = |y''| / [ 1 + (y')^2 ]^(3/2) at vertex of parabola y = x^2 / 4.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-KAP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Plane Curves: Curvature Formula at Parabola Vertex."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Plane Curves: Curvature Formula at Parabola Vertex"
    }]
  },
  {
    id: "GEN0102-U3-KIN",
    canonicalName: "Kinematic Related Rates: Searchlight Tracking a Moving Runner",
    description: "Relates linear runner velocity dx/dt to angular searchlight rotational speed dtheta/dt via tan(theta) = x / d.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-KIN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Kinematic Related Rates: Searchlight Tracking a Moving Runner."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Kinematic Related Rates: Searchlight Tracking a Moving Runner"
    }]
  },
  {
    id: "GEN0102-U3-LAD",
    canonicalName: "Applications of Derivative: Sliding Ladder Related Rates",
    description: "Direct differentiation of Pythagorean relation x^2 + y^2 = L^2: 2x*(dx/dt) + 2y*(dy/dt) = 0.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-LAD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Derivative: Sliding Ladder Related Rates."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Sliding Ladder Related Rates"
    }]
  },
  {
    id: "GEN0102-U3-LOGB",
    canonicalName: "Applications of Derivative: Rectangular Beam Cut from Circular Log Constraint",
    description: "Direct Pythagorean geometric constraint for rectangle of width w and depth d cut from circular log of diameter D = 30.0 cm: w^2 + d^2 = D^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-LOGB",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Derivative: Rectangular Beam Cut from Circular Log Constraint."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Rectangular Beam Cut from Circular Log Constraint"
    }]
  },
  {
    id: "GEN0102-U3-OPT",
    canonicalName: "Applied Optimization: 1D Boundary Area Maximization",
    description: "Standard single-constraint geometric optimization with one open boundary.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-OPT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applied Optimization: 1D Boundary Area Maximization."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applied Optimization: 1D Boundary Area Maximization"
    }]
  },
  {
    id: "GEN0102-U3-RATE",
    canonicalName: "Related Rates: Orthogonal Spherical Expansion",
    description: "Direct time differentiation of standard 1-variable volume formula V = (4/3)pi r^3.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-RATE",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Related Rates: Orthogonal Spherical Expansion."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Related Rates: Orthogonal Spherical Expansion"
    }]
  },
  {
    id: "GEN0102-U3-SHD",
    canonicalName: "Related Rates: Walking Shadow Similar Triangles Formulation",
    description: "Direct similar triangles proportion: person height h = 1.8 m, lamppost height H = 6.0 m at distance x from post with shadow length s: s / h = (x + s) / H ==> s = 3/7 * x.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-SHD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Related Rates: Walking Shadow Similar Triangles Formulation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Related Rates: Walking Shadow Similar Triangles Formulation"
    }]
  },
  {
    id: "GEN0102-U3-SLK",
    canonicalName: "Applications of Derivative: Circular Surface Area Related Rate",
    description: "Direct related rates on circle area A = pi * r^2: dA/dt = 2*pi*r * (dr/dt).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-SLK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Applications of Derivative: Circular Surface Area Related Rate."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Applications of Derivative: Circular Surface Area Related Rate"
    }]
  },
  {
    id: "GEN0102-U3-SLP",
    canonicalName: "Tangent & Normal Lines: Slope and Tangent Line Equation",
    description: "Direct calculation of tangent line slope m = f'(x0) and point-slope line equation y - y0 = m*(x - x0).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-SLP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Tangent & Normal Lines: Slope and Tangent Line Equation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Tangent & Normal Lines: Slope and Tangent Line Equation"
    }]
  },
  {
    id: "GEN0102-U3-SLPE",
    canonicalName: "The Slope: Parabola Tangent Slope Evaluation",
    description: "Direct differentiation of quadratic curve y = 2x^2 - 3x + 1 and evaluation of slope m = y'(x0) at x0 = 2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-SLPE",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for The Slope: Parabola Tangent Slope Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "The Slope: Parabola Tangent Slope Evaluation"
    }]
  },
  {
    id: "GEN0102-U3-TNR",
    canonicalName: "Tangent and Normal Lines: Square Root Curve Tangent Line",
    description: "Direct calculation of tangent line y - y0 = m*(x - x0) to y = sqrt(x) at (4, 2) where m = 1/(2*sqrt(4)) = 1/4.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-TNR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Tangent and Normal Lines: Square Root Curve Tangent Line."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Tangent and Normal Lines: Square Root Curve Tangent Line"
    }]
  },
  {
    id: "GEN0102-U3-VOL",
    canonicalName: "Solids of Revolution: Disk Method About the x-Axis",
    description: "Direct single-curve revolution about coordinate axis V = pi * integral [f(x)]^2 dx.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0102",
    parentTopicId: "GEN0102-U3-VOL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Solids of Revolution: Disk Method About the x-Axis."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Solids of Revolution: Disk Method About the x-Axis"
    }]
  },
  {
    id: "GEN0110-U1-BIM",
    canonicalName: "Thermal Physics: Differential Expansion of Bonded Strips",
    description: "Direct calculation of length difference Delta L_diff = (alpha_brass - alpha_steel) * L0 * Delta T.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-BIM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Thermal Physics: Differential Expansion of Bonded Strips."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermal Physics: Differential Expansion of Bonded Strips"
    }]
  },
  {
    id: "GEN0110-U1-BUO",
    canonicalName: "Fluid Mechanics: Archimedes Principle Buoyant Force on Submerged Solid",
    description: "Direct calculation of buoyant force F_b = rho_fluid * g * V_submerged for a completely submerged block.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-BUO",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Mechanics: Archimedes Principle Buoyant Force on Submerged Solid."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Archimedes Principle Buoyant Force on Submerged Solid"
    }]
  },
  {
    id: "GEN0110-U1-CAL",
    canonicalName: "Calorimetry: Sensible Heat Transfer & Thermal Equilibrium",
    description: "Direct calculation of heat transfer Q = m * c * Delta T and final equilibrium temperature of two mixed liquids.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-CAL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Calorimetry: Sensible Heat Transfer & Thermal Equilibrium."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Calorimetry: Sensible Heat Transfer & Thermal Equilibrium"
    }]
  },
  {
    id: "GEN0110-U1-CMP",
    canonicalName: "Heat Transfer: 1D Plane Wall Conduction Heat Rate",
    description: "Direct calculation of Fourier conduction heat rate Q_dot = k * A * (T1 - T2) / L.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-CMP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Heat Transfer: 1D Plane Wall Conduction Heat Rate."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Transfer: 1D Plane Wall Conduction Heat Rate"
    }]
  },
  {
    id: "GEN0110-U1-CNT",
    canonicalName: "Fluid Mechanics: Continuity Equation Volumetric Flow Rate",
    description: "Direct calculation of volumetric flow rate Q = A * v and constriction velocity v2 = v1 * (A1 / A2).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-CNT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Mechanics: Continuity Equation Volumetric Flow Rate."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Continuity Equation Volumetric Flow Rate"
    }]
  },
  {
    id: "GEN0110-U1-DBL",
    canonicalName: "Sound Waves: Decibel Sound Intensity Level Evaluation",
    description: "Direct calculation of decibel level beta = 10 * log10(I / I0) where I0 = 1.0 x 10^-12 W/m^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-DBL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Sound Waves: Decibel Sound Intensity Level Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Sound Waves: Decibel Sound Intensity Level Evaluation"
    }]
  },
  {
    id: "GEN0110-U1-DBLS",
    canonicalName: "Wave Optics: Young's Double Slit Bright Fringe Angle",
    description: "Direct calculation of bright fringe angle d * sin(theta) = m * lambda for m = 1 with slit separation d = 0.20 mm.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-DBLS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Wave Optics: Young's Double Slit Bright Fringe Angle."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Wave Optics: Young's Double Slit Bright Fringe Angle"
    }]
  },
  {
    id: "GEN0110-U1-DIF",
    canonicalName: "Physical Optics: Single-Slit Fraunhofer Diffraction Minima",
    description: "Direct calculation of single-slit dark fringe minima condition: a * sin(theta) = m * lambda.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-DIF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Physical Optics: Single-Slit Fraunhofer Diffraction Minima."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Physical Optics: Single-Slit Fraunhofer Diffraction Minima"
    }]
  },
  {
    id: "GEN0110-U1-DIV",
    canonicalName: "Geometric Optics: Diverging Concave Lens Thin Lens Equation",
    description: "Direct calculation using thin lens equation with negative focal length f = -20.0 cm: proves diverging lenses ALWAYS yield virtual image d_i < 0.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-DIV",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optics: Diverging Concave Lens Thin Lens Equation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Diverging Concave Lens Thin Lens Equation"
    }]
  },
  {
    id: "GEN0110-U1-DOP",
    canonicalName: "Acoustics: Decibel Sound Intensity Level",
    description: "Direct calculation of decibel intensity level beta = 10*log10(I / I0) with reference threshold I0 = 10^-12 W/m^2.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-DOP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Acoustics: Decibel Sound Intensity Level."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Acoustics: Decibel Sound Intensity Level"
    }]
  },
  {
    id: "GEN0110-U1-DOPL",
    canonicalName: "Sound Waves: Approaching Moving Source Doppler Frequency Shift",
    description: "Direct calculation of perceived frequency f' = f * v / (v - v_s) for approaching acoustic source.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-DOPL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Sound Waves: Approaching Moving Source Doppler Frequency Shift."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Sound Waves: Approaching Moving Source Doppler Frequency Shift"
    }]
  },
  {
    id: "GEN0110-U1-DYN",
    canonicalName: "Engineering Dynamics: Constant Acceleration Projectile Kinematics",
    description: "Decoupled 2D ballistic projectile motion: horizontal constant velocity v_x = v0*cos(theta) and vertical free-fall acceleration a_y = -g.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-DYN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Engineering Dynamics: Constant Acceleration Projectile Kinematics."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Engineering Dynamics: Constant Acceleration Projectile Kinematics"
    }]
  },
  {
    id: "GEN0110-U1-EFL",
    canonicalName: "Electrostatics: Electric Field Magnitude of a Point Charge",
    description: "Direct calculation of electric field E = k * |q| / r^2 in vacuum.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-EFL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electrostatics: Electric Field Magnitude of a Point Charge."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electrostatics: Electric Field Magnitude of a Point Charge"
    }]
  },
  {
    id: "GEN0110-U1-EFLD",
    canonicalName: "Electrostatics: Coulomb's Law Point Charges",
    description: "Direct vector addition of two point charges on a straight 1D axis.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-EFLD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electrostatics: Coulomb's Law Point Charges."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electrostatics: Coulomb's Law Point Charges"
    }]
  },
  {
    id: "GEN0110-U1-ENG",
    canonicalName: "Dynamics: Conservation of Mechanical Energy with Spring Arrestor",
    description: "Direct work-energy balance (1/2) m v^2 = (1/2) k x^2 to compute maximum spring compression to stop a moving mass.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-ENG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Dynamics: Conservation of Mechanical Energy with Spring Arrestor."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Dynamics: Conservation of Mechanical Energy with Spring Arrestor"
    }]
  },
  {
    id: "GEN0110-U1-EXP",
    canonicalName: "Thermal Physics: Linear Thermal Expansion of Structural Members",
    description: "Direct calculation of linear expansion Delta L = alpha * L0 * Delta T.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-EXP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Thermal Physics: Linear Thermal Expansion of Structural Members."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermal Physics: Linear Thermal Expansion of Structural Members"
    }]
  },
  {
    id: "GEN0110-U1-FLM",
    canonicalName: "Wave Optics: Thin Film Reflection Phase Change Rules",
    description: "Direct classification of reflection phase change: light reflecting from a medium with HIGHER refractive index undergoes 180 deg (pi rad, lambda/2) phase shift; reflection from LOWER index has ZERO phase shift.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-FLM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Wave Optics: Thin Film Reflection Phase Change Rules."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Wave Optics: Thin Film Reflection Phase Change Rules"
    }]
  },
  {
    id: "GEN0110-U1-FUS",
    canonicalName: "Heat Measurements: Latent Heat of Ice Fusion Energy",
    description: "Direct calculation of latent heat of fusion Q = m * L_f for ice melting at 0 deg C.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-FUS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Heat Measurements: Latent Heat of Ice Fusion Energy."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Measurements: Latent Heat of Ice Fusion Energy"
    }]
  },
  {
    id: "GEN0110-U1-GAP",
    canonicalName: "Thermal Physics: Expansion Gap Closing Temperature",
    description: "Direct calculation of temperature rise Delta T = gap / (alpha * L0) required to close expansion joint.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-GAP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Thermal Physics: Expansion Gap Closing Temperature."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermal Physics: Expansion Gap Closing Temperature"
    }]
  },
  {
    id: "GEN0110-U1-GAUSS",
    canonicalName: "Gauss's Law: Electric Flux Through a Plane Area",
    description: "Direct vector dot product of uniform electric field with planar area vector Phi = E * A * cos(theta).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-GAUSS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Gauss's Law: Electric Flux Through a Plane Area."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gauss's Law: Electric Flux Through a Plane Area"
    }]
  },
  {
    id: "GEN0110-U1-HYD",
    canonicalName: "Fluid Mechanics: Pascal's Principle & Hydraulic Mechanical Advantage",
    description: "Direct calculation of transmitted force F2 = F1 * (A2 / A1) in an enclosed incompressible hydraulic system.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-HYD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Mechanics: Pascal's Principle & Hydraulic Mechanical Advantage."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Pascal's Principle & Hydraulic Mechanical Advantage"
    }]
  },
  {
    id: "GEN0110-U1-LAT",
    canonicalName: "Calorimetry: Latent Heat of Phase Transition",
    description: "Direct calculation of latent heat of vaporization Q = m * L_v.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-LAT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Calorimetry: Latent Heat of Phase Transition."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Calorimetry: Latent Heat of Phase Transition"
    }]
  },
  {
    id: "GEN0110-U1-LMK",
    canonicalName: "Geometric Optics: Symmetric Biconvex Lensmaker's Equation",
    description: "Direct calculation using Lensmaker's Equation: 1/f = (n - 1) * (1/R1 - 1/R2) for symmetric biconvex glass lens.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-LMK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optics: Symmetric Biconvex Lensmaker's Equation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Symmetric Biconvex Lensmaker's Equation"
    }]
  },
  {
    id: "GEN0110-U1-LNS",
    canonicalName: "Geometric Optics: Converging Thin Lens Real Image Formation",
    description: "Direct calculation of thin lens equation 1/f = 1/d_o + 1/d_i and lateral magnification m = -d_i / d_o for converging lens.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-LNS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optics: Converging Thin Lens Real Image Formation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Converging Thin Lens Real Image Formation"
    }]
  },
  {
    id: "GEN0110-U1-MAN2",
    canonicalName: "Fluid Mechanics: Single-Fluid U-Tube Manometer Gauge Pressure",
    description: "Direct calculation of gas container gauge pressure P_gauge = rho * g * h from open-end manometer column height differential.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-MAN2",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Mechanics: Single-Fluid U-Tube Manometer Gauge Pressure."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Single-Fluid U-Tube Manometer Gauge Pressure"
    }]
  },
  {
    id: "GEN0110-U1-MET",
    canonicalName: "Fluid Mechanics: Iceberg Submerged Floating Volume Fraction",
    description: "Direct calculation of submerged volume fraction V_sub / V_total = rho_body / rho_fluid for floating ice in fresh water.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-MET",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Mechanics: Iceberg Submerged Floating Volume Fraction."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Iceberg Submerged Floating Volume Fraction"
    }]
  },
  {
    id: "GEN0110-U1-MIR",
    canonicalName: "Geometric Optics: Concave Spherical Mirror Image Formation",
    description: "Direct calculation of image distance d_i from mirror equation 1/f = 1/d_o + 1/d_i and lateral magnification m = -d_i / d_o.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-MIR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optics: Concave Spherical Mirror Image Formation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Concave Spherical Mirror Image Formation"
    }]
  },
  {
    id: "GEN0110-U1-MRR",
    canonicalName: "Geometric Optics: Concave Mirror Real Image Location",
    description: "Direct application of mirror equation 1/f = 1/d_o + 1/d_i for object placed beyond focal point.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-MRR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optics: Concave Mirror Real Image Location."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Concave Mirror Real Image Location"
    }]
  },
  {
    id: "GEN0110-U1-OGP",
    canonicalName: "Acoustics & Waves: Open Organ Pipe Fundamental & Harmonics",
    description: "Direct calculation of open organ pipe frequencies: f_n = n * v / (2 * L) for n = 1, 2, 3 in pipe of length L = 0.85 m.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-OGP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Acoustics & Waves: Open Organ Pipe Fundamental & Harmonics."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Acoustics & Waves: Open Organ Pipe Fundamental & Harmonics"
    }]
  },
  {
    id: "GEN0110-U1-OPT",
    canonicalName: "Optics: Snell's Law & Critical Angle for Total Internal Reflection",
    description: "Direct calculation of critical angle theta_c = arcsin(n2 / n1) for light propagating from dense to less dense optical medium.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-OPT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Optics: Snell's Law & Critical Angle for Total Internal Reflection."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Optics: Snell's Law & Critical Angle for Total Internal Reflection"
    }]
  },
  {
    id: "GEN0110-U1-PIP",
    canonicalName: "Acoustic Waves: Open-Open Organ Pipe Resonant Frequencies",
    description: "Direct calculation of open pipe resonant harmonics f_n = n * v / (2 * L) where n = 1, 2, 3...",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-PIP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Acoustic Waves: Open-Open Organ Pipe Resonant Frequencies."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Acoustic Waves: Open-Open Organ Pipe Resonant Frequencies"
    }]
  },
  {
    id: "GEN0110-U1-PLM",
    canonicalName: "Geometric Optics: Law of Reflection on a Flat Plane Mirror",
    description: "Direct calculation: angle of incidence equals angle of reflection (theta_i = theta_r) and virtual image distance equals object distance (d_i = d_o).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-PLM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optics: Law of Reflection on a Flat Plane Mirror."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Law of Reflection on a Flat Plane Mirror"
    }]
  },
  {
    id: "GEN0110-U1-PRS",
    canonicalName: "Fluid Mechanics: Hydrostatic Gauge Pressure at Fluid Depth",
    description: "Direct calculation of hydrostatic fluid pressure P_gauge = rho * g * h.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-PRS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Mechanics: Hydrostatic Gauge Pressure at Fluid Depth."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Hydrostatic Gauge Pressure at Fluid Depth"
    }]
  },
  {
    id: "GEN0110-U1-RAD",
    canonicalName: "Heat Transfer: Stefan-Boltzmann Blackbody Radiation Law",
    description: "Direct calculation of radiated power P = sigma * A * T^4 for blackbody emitter (sigma = 5.67 x 10^-8 W/m^2-K^4).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-RAD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Heat Transfer: Stefan-Boltzmann Blackbody Radiation Law."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Transfer: Stefan-Boltzmann Blackbody Radiation Law"
    }]
  },
  {
    id: "GEN0110-U1-RAY",
    canonicalName: "Wave Optics: Single Slit Diffraction First Minimum Angle",
    description: "Direct calculation of first diffraction minimum angle sin(theta) = lambda / a.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-RAY",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Wave Optics: Single Slit Diffraction First Minimum Angle."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Wave Optics: Single Slit Diffraction First Minimum Angle"
    }]
  },
  {
    id: "GEN0110-U1-REF",
    canonicalName: "Geometric Optics: Snell's Law of Refraction",
    description: "Direct calculation of refraction angle sin(theta2) = (n1 / n2) * sin(theta1) across a flat boundary.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-REF",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optics: Snell's Law of Refraction."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Snell's Law of Refraction"
    }]
  },
  {
    id: "GEN0110-U1-SHR",
    canonicalName: "Thermal Physics: Area (Superficial) Thermal Expansion",
    description: "Direct calculation of area expansion Delta A = 2 * alpha * A0 * Delta T.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-SHR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Thermal Physics: Area (Superficial) Thermal Expansion."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermal Physics: Area (Superficial) Thermal Expansion"
    }]
  },
  {
    id: "GEN0110-U1-SND",
    canonicalName: "Sound Waves: Speed of Sound Temperature Scaling",
    description: "Direct calculation of sound speed in air v = 331.0 + 0.60 * T_C for given Celsius temperature.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-SND",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Sound Waves: Speed of Sound Temperature Scaling."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Sound Waves: Speed of Sound Temperature Scaling"
    }]
  },
  {
    id: "GEN0110-U1-STRG",
    canonicalName: "Mechanical Waves: Fundamental Resonant Frequency on Stretched String",
    description: "Direct calculation of fundamental frequency f1 = v / (2*L) from string length L and wave speed v.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-STRG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Mechanical Waves: Fundamental Resonant Frequency on Stretched String."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Mechanical Waves: Fundamental Resonant Frequency on Stretched String"
    }]
  },
  {
    id: "GEN0110-U1-TIR",
    canonicalName: "Geometric Optics: Critical Angle for Total Internal Reflection",
    description: "Direct calculation of critical angle sin(theta_c) = n2 / n1 for light propagating from dense optical medium to air.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-TIR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Geometric Optics: Critical Angle for Total Internal Reflection."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Geometric Optics: Critical Angle for Total Internal Reflection"
    }]
  },
  {
    id: "GEN0110-U1-TOR",
    canonicalName: "Fluid Mechanics: Torricelli's Orifice Exit Velocity",
    description: "Direct calculation of Torricelli's exit velocity v = sqrt(2 * g * h) from open liquid head h = 5.0 m.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-TOR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Mechanics: Torricelli's Orifice Exit Velocity."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Mechanics: Torricelli's Orifice Exit Velocity"
    }]
  },
  {
    id: "GEN0110-U1-VAP",
    canonicalName: "Heat Measurements: Latent Heat of Steam Condensation",
    description: "Direct calculation of latent heat of vaporization Q = m * L_v for steam condensing at 100 deg C.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-VAP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Heat Measurements: Latent Heat of Steam Condensation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Measurements: Latent Heat of Steam Condensation"
    }]
  },
  {
    id: "GEN0110-U1-WAV",
    canonicalName: "Mechanical Waves: Transverse Wave Speed on a Stretched String",
    description: "Direct calculation of wave speed v = sqrt(T_tension / mu) from string tension and linear mass density mu = m / L.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-WAV",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Mechanical Waves: Transverse Wave Speed on a Stretched String."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Mechanical Waves: Transverse Wave Speed on a Stretched String"
    }]
  },
  {
    id: "GEN0110-U1-WEQ",
    canonicalName: "Calorimetry: Two-Fluid Thermal Equilibrium",
    description: "Direct calculation of final equilibrium temperature T_f = (m1*T1 + m2*T2)/(m1 + m2) for two liquid water samples.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U1-WEQ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Calorimetry: Two-Fluid Thermal Equilibrium."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Calorimetry: Two-Fluid Thermal Equilibrium"
    }]
  },
  {
    id: "GEN0110-U2-BAT",
    canonicalName: "Electricity: Real Battery Terminal Voltage with Internal Resistance",
    description: "Direct calculation of terminal voltage V_term = E - I * r for battery with internal resistance r = 0.20 ohms.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-BAT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electricity: Real Battery Terminal Voltage with Internal Resistance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Real Battery Terminal Voltage with Internal Resistance"
    }]
  },
  {
    id: "GEN0110-U2-CIRC",
    canonicalName: "DC Circuits: Series-Parallel Equivalent Resistance",
    description: "Step-by-step reduction of a series-parallel resistor ladder to a single equivalent resistance.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-CIRC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for DC Circuits: Series-Parallel Equivalent Resistance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "DC Circuits: Series-Parallel Equivalent Resistance"
    }]
  },
  {
    id: "GEN0110-U2-CKT",
    canonicalName: "Electricity: Series and Parallel Equivalent Resistance",
    description: "Direct calculation of series R_s = R1 + R2 and parallel R_p = (R1 * R2) / (R1 + R2).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-CKT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electricity: Series and Parallel Equivalent Resistance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Series and Parallel Equivalent Resistance"
    }]
  },
  {
    id: "GEN0110-U2-CYC",
    canonicalName: "Electromagnetism: Lorentz Magnetic Force on a Moving Charge",
    description: "Direct calculation of magnetic force F = q * v * B * sin(theta) for perpendicular velocity and magnetic field.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-CYC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electromagnetism: Lorentz Magnetic Force on a Moving Charge."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electromagnetism: Lorentz Magnetic Force on a Moving Charge"
    }]
  },
  {
    id: "GEN0110-U2-ENR",
    canonicalName: "Special Relativity: Relativistic Linear Momentum",
    description: "Direct calculation of relativistic momentum p = gamma * m0 * v.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-ENR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Special Relativity: Relativistic Linear Momentum."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Special Relativity: Relativistic Linear Momentum"
    }]
  },
  {
    id: "GEN0110-U2-IND",
    canonicalName: "Electromagnetic Induction: Faraday's Law with Time-Varying Field",
    description: "Direct time derivative of magnetic flux through a multi-turn flat coil E = -N * A * (dB/dt).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-IND",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electromagnetic Induction: Faraday's Law with Time-Varying Field."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electromagnetic Induction: Faraday's Law with Time-Varying Field"
    }]
  },
  {
    id: "GEN0110-U2-KCH",
    canonicalName: "Electricity: Kirchhoff's Current Law (KCL) Junction Balance",
    description: "Direct application of KCL at circuit node: Sum I_in = Sum I_out.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-KCH",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electricity: Kirchhoff's Current Law (KCL) Junction Balance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Kirchhoff's Current Law (KCL) Junction Balance"
    }]
  },
  {
    id: "GEN0110-U2-MAG",
    canonicalName: "Magnetostatics: Magnetic Force on a Straight Conductor",
    description: "Direct cross product vector magnitude F = I * L * B * sin(theta).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-MAG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Magnetostatics: Magnetic Force on a Straight Conductor."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Magnetostatics: Magnetic Force on a Straight Conductor"
    }]
  },
  {
    id: "GEN0110-U2-NRG",
    canonicalName: "Electromagnetism: Electric Field Energy Density",
    description: "Direct calculation of electric energy density u_E = (1/2) * epsilon_0 * E^2 for electric field E = 3.0 x 10^6 V/m.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-NRG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electromagnetism: Electric Field Energy Density."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electromagnetism: Electric Field Energy Density"
    }]
  },
  {
    id: "GEN0110-U2-PWR",
    canonicalName: "Electricity: Electrical Power Formulas & Current Draw",
    description: "Direct calculation of electric power P = V * I and resistance R = V^2 / P for a standard appliance.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-PWR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electricity: Electrical Power Formulas & Current Draw."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Electrical Power Formulas & Current Draw"
    }]
  },
  {
    id: "GEN0110-U2-REL",
    canonicalName: "Special Relativity: Lorentz Gamma Factor & Relativistic Time Dilation",
    description: "Direct calculation of Lorentz factor gamma = 1 / sqrt(1 - (v/c)^2) and time dilation Delta t = gamma * Delta t0.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-REL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Special Relativity: Lorentz Gamma Factor & Relativistic Time Dilation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Special Relativity: Lorentz Gamma Factor & Relativistic Time Dilation"
    }]
  },
  {
    id: "GEN0110-U2-RES",
    canonicalName: "AC Circuits: Series RLC Resonant Frequency",
    description: "Direct calculation of series resonant angular frequency omega_0 = 1/sqrt(LC) and cyclic frequency f_0 in Hertz.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-RES",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for AC Circuits: Series RLC Resonant Frequency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "AC Circuits: Series RLC Resonant Frequency"
    }]
  },
  {
    id: "GEN0110-U2-RLC",
    canonicalName: "Electricity: Series RLC Circuit Resonant Frequency",
    description: "Direct calculation of series AC resonance frequency f0 = 1 / [ 2*pi * sqrt(L * C) ].",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-RLC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electricity: Series RLC Circuit Resonant Frequency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: Series RLC Circuit Resonant Frequency"
    }]
  },
  {
    id: "GEN0110-U2-RTRN",
    canonicalName: "Electricity: RC Circuit Transient Time Constant",
    description: "Direct calculation of RC charging time constant tau = R * C.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-RTRN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Electricity: RC Circuit Transient Time Constant."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Electricity: RC Circuit Transient Time Constant"
    }]
  },
  {
    id: "GEN0110-U2-TRAN",
    canonicalName: "RC Transients: Time Constant & Charging Voltage",
    description: "Direct calculation of time constant tau = R*C and exponential voltage rise V(t) = V_s * (1 - e^(-t / tau)).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U2-TRAN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for RC Transients: Time Constant & Charging Voltage."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "RC Transients: Time Constant & Charging Voltage"
    }]
  },
  {
    id: "GEN0110-U3-LGT",
    canonicalName: "Special Relativity: Relativistic Doppler Redshift of Receding Source",
    description: "Direct calculation of relativistic optical Doppler shift f_obs = f_source * sqrt((1 - beta)/(1 + beta)) for receding source at beta = 0.60.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U3-LGT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Special Relativity: Relativistic Doppler Redshift of Receding Source."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Special Relativity: Relativistic Doppler Redshift of Receding Source"
    }]
  },
  {
    id: "GEN0110-U3-REL",
    canonicalName: "Special Relativity: Relativistic Lorentz Gamma Factor Evaluation",
    description: "Direct evaluation of Lorentz gamma factor gamma = 1 / sqrt(1 - (v/c)^2) for speed v = 0.60*c.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0110",
    parentTopicId: "GEN0110-U3-REL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Special Relativity: Relativistic Lorentz Gamma Factor Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Special Relativity: Relativistic Lorentz Gamma Factor Evaluation"
    }]
  },
  {
    id: "GEN0161-U1-ADB",
    canonicalName: "First Law Closed Systems: Reversible Adiabatic Boundary Work",
    description: "Direct calculation of adiabatic work W = -Delta U = -m * cv * (T2 - T1).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-ADB",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for First Law Closed Systems: Reversible Adiabatic Boundary Work."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Closed Systems: Reversible Adiabatic Boundary Work"
    }]
  },
  {
    id: "GEN0161-U1-BAR",
    canonicalName: "Processes of Ideal Gases: Isobaric Boundary Work and Heat Addition",
    description: "Direct calculation of constant-pressure boundary work W = P * Delta V = m * R * Delta T and heat addition Q = Delta H = m * cp * Delta T.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-BAR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Processes of Ideal Gases: Isobaric Boundary Work and Heat Addition."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Isobaric Boundary Work and Heat Addition"
    }]
  },
  {
    id: "GEN0161-U1-BERN",
    canonicalName: "Fluid Dynamics: Torricelli's Law Tank Orifice Discharge Velocity",
    description: "Direct application of Torricelli's law v = sqrt(2*g*h) derived from Bernoulli equation for free surface draining.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-BERN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Dynamics: Torricelli's Law Tank Orifice Discharge Velocity."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Dynamics: Torricelli's Law Tank Orifice Discharge Velocity"
    }]
  },
  {
    id: "GEN0161-U1-CLP",
    canonicalName: "Properties of Pure Substances: Clapeyron Equation Phase Boundary Slope",
    description: "Direct evaluation of Clapeyron equation: dP/dT = h_fg / (T * v_fg) for water boiling at 100 deg C (373.15 K).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-CLP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Properties of Pure Substances: Clapeyron Equation Phase Boundary Slope."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Properties of Pure Substances: Clapeyron Equation Phase Boundary Slope"
    }]
  },
  {
    id: "GEN0161-U1-GAS",
    canonicalName: "Ideal Gas Laws: Boyle's Law Constant-Temperature Pressure-Volume Scaling",
    description: "Direct calculation of final volume V2 = V1 * (P1 / P2) for isothermal process.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-GAS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Ideal Gas Laws: Boyle's Law Constant-Temperature Pressure-Volume Scaling."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Ideal Gas Laws: Boyle's Law Constant-Temperature Pressure-Volume Scaling"
    }]
  },
  {
    id: "GEN0161-U1-HT",
    canonicalName: "Heat Transfer: 1D Plane Wall Conduction Thermal Resistance",
    description: "Direct calculation of conduction thermal resistance R_cond = L / (k * A) and steady-state heat flow Q_dot = Delta T / R_total.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-HT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Heat Transfer: 1D Plane Wall Conduction Thermal Resistance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Heat Transfer: 1D Plane Wall Conduction Thermal Resistance"
    }]
  },
  {
    id: "GEN0161-U1-ISP",
    canonicalName: "Processes of Ideal Gases: Isentropic Expansion Pressure-Volume Relation",
    description: "Direct calculation of isentropic state pressure P2 = P1 * (V1 / V2)^k for air (k = 1.40).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-ISP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Processes of Ideal Gases: Isentropic Expansion Pressure-Volume Relation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Isentropic Expansion Pressure-Volume Relation"
    }]
  },
  {
    id: "GEN0161-U1-IST",
    canonicalName: "Processes of Ideal Gases: Reversible Isothermal Work Formulation",
    description: "Direct calculation of isothermal boundary work W = P1 * V1 * ln(V2 / V1) = m * R * T * ln(V2 / V1).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-IST",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Processes of Ideal Gases: Reversible Isothermal Work Formulation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Reversible Isothermal Work Formulation"
    }]
  },
  {
    id: "GEN0161-U1-MAN",
    canonicalName: "Fluid Statics: U-Tube Mercury Manometer Pressure Differential",
    description: "Direct hydrostatic manometer balance equation Delta P = rho_Hg * g * h.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-MAN",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Fluid Statics: U-Tube Mercury Manometer Pressure Differential."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Fluid Statics: U-Tube Mercury Manometer Pressure Differential"
    }]
  },
  {
    id: "GEN0161-U1-MAS",
    canonicalName: "First Law Open Systems: Steady-State Mass Flow Rate Formula",
    description: "Direct calculation of mass flow rate m_dot = rho * A * v = (A * v) / v_spec.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-MAS",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for First Law Open Systems: Steady-State Mass Flow Rate Formula."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Steady-State Mass Flow Rate Formula"
    }]
  },
  {
    id: "GEN0161-U1-MIX",
    canonicalName: "First Law Open Systems: Adiabatic Steady Mixing Chamber Mass and Energy Balance",
    description: "Direct calculation of mixed stream exit temperature T3 = (m1*T1 + m2*T2) / (m1 + m2) for two liquid water streams.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-MIX",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for First Law Open Systems: Adiabatic Steady Mixing Chamber Mass and Energy Balance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Adiabatic Steady Mixing Chamber Mass and Energy Balance"
    }]
  },
  {
    id: "GEN0161-U1-NOZ",
    canonicalName: "First Law Open Systems: Steady-Flow Energy Equation on an Adiabatic Nozzle",
    description: "Direct calculation of nozzle exit velocity v2 = sqrt(2 * (h1 - h2) + v1^2) from enthalpy drop.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-NOZ",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for First Law Open Systems: Steady-Flow Energy Equation on an Adiabatic Nozzle."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Steady-Flow Energy Equation on an Adiabatic Nozzle"
    }]
  },
  {
    id: "GEN0161-U1-NZL",
    canonicalName: "First Law Open Systems: Adiabatic Nozzle Exit Velocity Formula",
    description: "Direct calculation of nozzle exit velocity from steady-flow enthalpy drop: v2 = sqrt[ 2000 * (h1 - h2) ] for h1 = 3200 kJ/kg, h2 = 3000 kJ/kg.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-NZL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for First Law Open Systems: Adiabatic Nozzle Exit Velocity Formula."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Adiabatic Nozzle Exit Velocity Formula"
    }]
  },
  {
    id: "GEN0161-U1-PLY",
    canonicalName: "Processes of Ideal Gases: Polytropic Expansion Boundary Work",
    description: "Direct calculation of polytropic boundary work W = (P1*V1 - P2*V2) / (n - 1) for polytropic index n = 1.30.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-PLY",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Processes of Ideal Gases: Polytropic Expansion Boundary Work."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Polytropic Expansion Boundary Work"
    }]
  },
  {
    id: "GEN0161-U1-POLY",
    canonicalName: "Closed Systems: Constant Pressure (Isobaric) Work",
    description: "Direct calculation of boundary work W = P * (V2 - V1) for an isobaric expansion process.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-POLY",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Closed Systems: Constant Pressure (Isobaric) Work."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Closed Systems: Constant Pressure (Isobaric) Work"
    }]
  },
  {
    id: "GEN0161-U1-PRP",
    canonicalName: "Thermodynamic Concepts: Intensive vs Extensive Property Classification",
    description: "Direct classification: intensive properties are independent of system mass; extensive properties scale proportionally with system size.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-PRP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Thermodynamic Concepts: Intensive vs Extensive Property Classification."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermodynamic Concepts: Intensive vs Extensive Property Classification"
    }]
  },
  {
    id: "GEN0161-U1-REV",
    canonicalName: "Thermodynamic Concepts: Factors Causing Process Irreversibility",
    description: "Direct classification: identifies primary physical factors causing process irreversibilities in real engineering systems.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-REV",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Thermodynamic Concepts: Factors Causing Process Irreversibility."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermodynamic Concepts: Factors Causing Process Irreversibility"
    }]
  },
  {
    id: "GEN0161-U1-SAT",
    canonicalName: "Properties of Pure Substances: Specific Volume of Saturated Steam Mixture",
    description: "Direct calculation of mixture specific volume v = v_f + x * v_fg from quality x and steam table values.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-SAT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Properties of Pure Substances: Specific Volume of Saturated Steam Mixture."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Properties of Pure Substances: Specific Volume of Saturated Steam Mixture"
    }]
  },
  {
    id: "GEN0161-U1-STM",
    canonicalName: "Pure Substances: Wet Vapor Quality Evaluation",
    description: "Direct evaluation of steam dryness fraction (quality x) from specific volume inside the saturation dome.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-STM",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Pure Substances: Wet Vapor Quality Evaluation."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Pure Substances: Wet Vapor Quality Evaluation"
    }]
  },
  {
    id: "GEN0161-U1-THR",
    canonicalName: "First Law Open Systems: Isenthalpic Throttling Process Quality",
    description: "Direct calculation of throttling flash quality x = (h_in - h_f) / h_fg across an adiabatic expansion valve.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-THR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for First Law Open Systems: Isenthalpic Throttling Process Quality."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Open Systems: Isenthalpic Throttling Process Quality"
    }]
  },
  {
    id: "GEN0161-U1-UNT",
    canonicalName: "Thermodynamic Concepts: Pressure Scale Conversions (Gauge, Absolute, Bar, kPa)",
    description: "Direct conversion between pressure scales: P_abs = P_gauge + P_atm and bar to kPa.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-UNT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Thermodynamic Concepts: Pressure Scale Conversions (Gauge, Absolute, Bar, kPa)."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Thermodynamic Concepts: Pressure Scale Conversions (Gauge, Absolute, Bar, kPa)"
    }]
  },
  {
    id: "GEN0161-U1-VPR",
    canonicalName: "Processes of Ideal Gases: Constant Volume Heat Addition",
    description: "Direct calculation of isochoric heat addition Q = m * cv * (T2 - T1) with boundary work W = 0.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-VPR",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Processes of Ideal Gases: Constant Volume Heat Addition."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Processes of Ideal Gases: Constant Volume Heat Addition"
    }]
  },
  {
    id: "GEN0161-U1-WRK",
    canonicalName: "First Law Closed Systems: Constant Pressure Boundary Work",
    description: "Direct calculation of isobaric expansion boundary work W = P * (V2 - V1).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U1-WRK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for First Law Closed Systems: Constant Pressure Boundary Work."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "First Law Closed Systems: Constant Pressure Boundary Work"
    }]
  },
  {
    id: "GEN0161-U2-BRY",
    canonicalName: "Gas Power Cycles: Ideal Brayton Cycle Thermal Efficiency",
    description: "Direct calculation of gas turbine thermal efficiency from pressure ratio r_p using air specific heat ratio k = 1.4.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-BRY",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Gas Power Cycles: Ideal Brayton Cycle Thermal Efficiency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Ideal Brayton Cycle Thermal Efficiency"
    }]
  },
  {
    id: "GEN0161-U2-BRYT",
    canonicalName: "Gas Power Cycles: Ideal Brayton Gas Turbine Thermal Efficiency",
    description: "Direct calculation of Brayton cycle thermal efficiency eta_th = 1 - 1 / r_p^((k - 1)/k) from pressure ratio r_p = 8.0.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-BRYT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Gas Power Cycles: Ideal Brayton Gas Turbine Thermal Efficiency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Ideal Brayton Gas Turbine Thermal Efficiency"
    }]
  },
  {
    id: "GEN0161-U2-COP",
    canonicalName: "Second Law: Refrigerator Coefficient of Performance (COP)",
    description: "Direct calculation of refrigerator COP_R = Q_L / W_net.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-COP",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Second Law: Refrigerator Coefficient of Performance (COP)."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Second Law: Refrigerator Coefficient of Performance (COP)"
    }]
  },
  {
    id: "GEN0161-U2-CUT",
    canonicalName: "Gas Power Cycles: Air-Standard Diesel Cycle Thermal Efficiency Formula",
    description: "Direct calculation of Diesel cycle thermal efficiency eta_th = 1 - (1 / r^(k-1)) * [ (r_c^k - 1) / (k*(r_c - 1)) ] for r = 18.0 and r_c = 2.0.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-CUT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Gas Power Cycles: Air-Standard Diesel Cycle Thermal Efficiency Formula."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Diesel Cycle Thermal Efficiency Formula"
    }]
  },
  {
    id: "GEN0161-U2-CYC",
    canonicalName: "Second Law: Maximum Carnot Thermal Efficiency",
    description: "Direct calculation of Carnot cycle thermal efficiency using absolute temperatures (Kelvin).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-CYC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Second Law: Maximum Carnot Thermal Efficiency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Second Law: Maximum Carnot Thermal Efficiency"
    }]
  },
  {
    id: "GEN0161-U2-DSL",
    canonicalName: "Gas Power Cycles: Air-Standard Diesel Cycle Cutoff Ratio & Efficiency",
    description: "Direct calculation of Diesel cycle thermal efficiency: eta_th = 1 - (1/r^(k-1)) * [ (r_c^k - 1) / (k*(r_c - 1)) ].",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-DSL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Gas Power Cycles: Air-Standard Diesel Cycle Cutoff Ratio & Efficiency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Diesel Cycle Cutoff Ratio & Efficiency"
    }]
  },
  {
    id: "GEN0161-U2-DUAL",
    canonicalName: "Gas Power Cycles: Air-Standard Dual Cycle Thermal Efficiency Formula",
    description: "Direct calculation of Dual cycle thermal efficiency eta_th = 1 - (1 / r^(k-1)) * [ (r_p * r_c^k - 1) / ((r_p - 1) + k*r_p*(r_c - 1)) ].",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-DUAL",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Gas Power Cycles: Air-Standard Dual Cycle Thermal Efficiency Formula."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Dual Cycle Thermal Efficiency Formula"
    }]
  },
  {
    id: "GEN0161-U2-ENG",
    canonicalName: "Second Law: Heat Engine First-Law Energy Balance & Efficiency",
    description: "Direct calculation of net work W_net = Q_H - Q_L and thermal efficiency eta_th = W_net / Q_H.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-ENG",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Second Law: Heat Engine First-Law Energy Balance & Efficiency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Second Law: Heat Engine First-Law Energy Balance & Efficiency"
    }]
  },
  {
    id: "GEN0161-U2-ENT",
    canonicalName: "Second Law: Reversible Isothermal Entropy Change",
    description: "Direct calculation of entropy change Delta S = Q_rev / T for constant-temperature reservoir heat addition.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-ENT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Second Law: Reversible Isothermal Entropy Change."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Second Law: Reversible Isothermal Entropy Change"
    }]
  },
  {
    id: "GEN0161-U2-IC",
    canonicalName: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency",
    description: "Direct calculation of ideal Otto cycle efficiency from compression ratio r using specific heat ratio k = 1.4.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-IC",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency"
    }]
  },
  {
    id: "GEN0161-U2-MOI",
    canonicalName: "Vapor Power Cycles: Reheat Rankine Total Turbine Work",
    description: "Direct calculation of dual-turbine reheat work w_t = (h1 - h2) + (h3 - h4).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-MOI",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Vapor Power Cycles: Reheat Rankine Total Turbine Work."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vapor Power Cycles: Reheat Rankine Total Turbine Work"
    }]
  },
  {
    id: "GEN0161-U2-OFW",
    canonicalName: "Vapor Power Cycles: Open Feedwater Heater Steam Extraction Fraction",
    description: "Energy balance on Open Feedwater Heater (OFWH): y * h_bleed + (1 - y) * h_subcooled = 1 * h_sat_liquid, solving for bleed fraction y.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-OFW",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Vapor Power Cycles: Open Feedwater Heater Steam Extraction Fraction."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vapor Power Cycles: Open Feedwater Heater Steam Extraction Fraction"
    }]
  },
  {
    id: "GEN0161-U2-OTT",
    canonicalName: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency",
    description: "Direct calculation of Otto cycle thermal efficiency eta_th = 1 - 1 / r^(k - 1) for compression ratio r = 8.5.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-OTT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Gas Power Cycles: Air-Standard Otto Cycle Thermal Efficiency"
    }]
  },
  {
    id: "GEN0161-U2-RAD",
    canonicalName: "Radiation Heat Transfer: Stefan-Boltzmann Blackbody Emissive Power",
    description: "Direct calculation of blackbody emissive power E_b = sigma * T^4 using absolute temperature (Kelvin) and Stefan-Boltzmann constant sigma = 5.67 x 10^-8 W/m^2-K^4.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-RAD",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Radiation Heat Transfer: Stefan-Boltzmann Blackbody Emissive Power."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Radiation Heat Transfer: Stefan-Boltzmann Blackbody Emissive Power"
    }]
  },
  {
    id: "GEN0161-U2-RHT",
    canonicalName: "Vapor Power Cycles: Two-Stage Reheat Turbine Enthalpy Drops",
    description: "Direct summation of high-pressure and low-pressure turbine work outputs: W_t,total = (h1 - h2) + (h3 - h4).",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-RHT",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Vapor Power Cycles: Two-Stage Reheat Turbine Enthalpy Drops."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vapor Power Cycles: Two-Stage Reheat Turbine Enthalpy Drops"
    }]
  },
  {
    id: "GEN0161-U2-RNK",
    canonicalName: "Vapor Power Cycles: Simple Rankine Cycle Enthalpy Balance",
    description: "Direct calculation of net work w_net = (h1 - h2) - (h4 - h3) and thermal efficiency eta = w_net / (h1 - h4) from steam enthalpies.",
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: "COURSE-GEN0161",
    parentTopicId: "GEN0161-U2-RNK",
    parentSubtopicIds: [],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      "Correctly solves qualitative progression problems for Vapor Power Cycles: Simple Rankine Cycle Enthalpy Balance."
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Qualitative 3-stage progression from Level 1 to Level 3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'MASTER-BANK-780',
      filename: 'Engineering Practice Engine - Course Coverage Master Problem Bank (780 Calibrated Problems).docx',
      rawTextExtract: "Vapor Power Cycles: Simple Rankine Cycle Enthalpy Balance"
    }]
  },
];
