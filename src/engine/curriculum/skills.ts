import { LearningSkill } from './types';

export const AUTHORITATIVE_SKILLS: LearningSkill[] = [
  // =========================================================================
  // COURSE: GEN 0101 (Mathematics for Engineers)
  // =========================================================================
  {
    id: 'SKILL-GEN0101-001',
    canonicalName: 'Apply standard order of operations to evaluate real number expressions',
    description: 'Accurately compute expressions with mixed arithmetic operations, parentheses, exponents, and negative integers without sign errors.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U1-T01',
    parentSubtopicIds: ['SUB-GEN0101-U1-T01-S1', 'SUB-GEN0101-U1-T01-S2'],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      'Correctly simplifies multi-tier nested numerical arithmetic expressions without sign or precedence mistakes.',
      'Identifies and evaluates integer exponents and radical terms in correct sequential order.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MCQ_RECOGNITION'],
    difficultyFactors: ['Nested parentheses depth', 'Mixed negative signs', 'Fractional exponents'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Fundamental operations on real numbers, Order of operations'
    }]
  },
  {
    id: 'SKILL-GEN0101-002',
    canonicalName: 'Find prime factorizations and greatest common divisors',
    description: 'Decompose composite integers into canonical prime power products to determine GCD and LCM for algebraic simplification.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U1-T01',
    parentSubtopicIds: ['SUB-GEN0101-U1-T01-S3', 'SUB-GEN0101-U1-T01-S4'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Expresses integers as unique prime factor power representations.',
      'Determines common denominators and simplified fractional roots using prime decomposition.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Large integer magnitude', 'Multiple 3+ digit factors'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Prime numbers, Prime factorization'
    }]
  },
  {
    id: 'SKILL-GEN0101-003',
    canonicalName: 'Perform arithmetic and algebraic operations on rational fractions',
    description: 'Add, subtract, multiply, divide, and simplify rational numerical fractions and mixed numbers using common denominators.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U1-T02',
    parentSubtopicIds: ['SUB-GEN0101-U1-T02-S1', 'SUB-GEN0101-U1-T02-S2', 'SUB-GEN0101-U1-T02-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-002'],
    masteryEvidence: [
      'Computes sums and differences of fractions with unlike denominators.',
      'Simplifies complex fractional expressions to lowest terms.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Multiple fractional tiers', 'Negative fractional signs', 'Mixed whole/fraction numbers'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 2',
      rawTextExtract: 'Review of fractions and decimal numbers, Conversion, Operations'
    }]
  },
  {
    id: 'SKILL-GEN0101-004',
    canonicalName: 'Solve direct, inverse, and joint variation engineering models',
    description: 'Set up variation constant equations (y = kx, y = k/x, z = kxy/w) and solve for unknown physical parameters.',
    skillType: 'MODELING',
    dominantCompetency: 'MODEL',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U1-T03',
    parentSubtopicIds: ['SUB-GEN0101-U1-T03-S1', 'SUB-GEN0101-U1-T03-S2', 'SUB-GEN0101-U1-T03-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-003'],
    masteryEvidence: [
      'Translates verbal variation statements into algebraic equations with constant of proportionality k.',
      'Calculates parameter changes given initial and boundary state conditions.'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'DIRECT_CALCULATION'],
    difficultyFactors: ['Joint and combined variations', 'Nonlinear power dependencies (e.g. inverse square)'],
    engineeringContext: 'Physical scaling laws, electrical resistance, and pressure-volume gas relations.',
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Percentage, Ratio and proportion, Direct and inverse variation'
    }]
  },
  {
    id: 'SKILL-GEN0101-005',
    canonicalName: 'Factor algebraic polynomials and transpose physical formulas',
    description: 'Factor trinomials, differences of squares, and group terms; isolate target variables in engineering formulas.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U1-T04',
    parentSubtopicIds: ['SUB-GEN0101-U1-T04-S1', 'SUB-GEN0101-U1-T04-S2', 'SUB-GEN0101-U1-T04-S3', 'SUB-GEN0101-U1-T04-S4'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Completely factors multi-term polynomials into irreducible linear and quadratic factors.',
      'Rearranges formula equations to isolate a designated variable without algebraic errors.'
    ],
    evidenceTypes: ['SYMBOLIC_DERIVATION', 'DIRECT_CALCULATION'],
    difficultyFactors: ['Leading coefficient a != 1', 'Variables in denominators or radicands'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 4',
      rawTextExtract: 'Simplification, Factorization, Formula substitution, Formulae and transposition'
    }]
  },
  {
    id: 'SKILL-GEN0101-006',
    canonicalName: 'Apply index and exponent laws to simplify algebraic expressions',
    description: 'Combine expressions involving positive, negative, zero, and fractional exponents using product, quotient, and power rules.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U1-T05',
    parentSubtopicIds: ['SUB-GEN0101-U1-T05-S1', 'SUB-GEN0101-U1-T05-S2', 'SUB-GEN0101-U1-T05-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Converts radical expressions to rational exponent powers.',
      'Eliminates negative exponents and simplifies multi-base algebraic expressions.'
    ],
    evidenceTypes: ['SYMBOLIC_DERIVATION', 'DIRECT_CALCULATION'],
    difficultyFactors: ['Fractional exponent arithmetic', 'Multi-variable products under radicals'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Positive and negative exponents, Zero and fractional exponents, Laws of exponents'
    }]
  },
  {
    id: 'SKILL-GEN0101-007',
    canonicalName: 'Formulate and solve algebraic applied word problems (Rate, Mixture, Work, Age)',
    description: 'Translate word problem scenarios into linear algebraic equations, solve systematically, and verify physical realism.',
    skillType: 'APPLICATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U1-T06',
    parentSubtopicIds: ['SUB-GEN0101-U1-T06-S1', 'SUB-GEN0101-U1-T06-S2', 'SUB-GEN0101-U1-T06-S3', 'SUB-GEN0101-U1-T06-S4', 'SUB-GEN0101-U1-T06-S5'],
    prerequisiteSkillIds: ['SKILL-GEN0101-005'],
    masteryEvidence: [
      'Defines variables and constructs consistent algebraic governing equations from text.',
      'Solves mixture concentration balances (C1*V1 + C2*V2 = C_final*V_final) and work-rate models (1/t1 + 1/t2 = 1/T).'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Multiple simultaneous rates', 'Inflow/outflow mixture changes', 'Indirect time offsets'],
    engineeringContext: 'Chemical batching, pumping rates, fluid tank blending, and scheduling.',
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 6',
      rawTextExtract: 'Age problems, Work problems, Rate and distance problems, Mixture problems, Clock and time problems'
    }]
  },
  {
    id: 'SKILL-GEN0101-008',
    canonicalName: 'Solve quadratic and polynomial equations using factoring and quadratic formula',
    description: 'Determine exact real and complex solutions of second- and higher-degree polynomial equations.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U2-T07',
    parentSubtopicIds: ['SUB-GEN0101-U2-T07-S1', 'SUB-GEN0101-U2-T07-S2', 'SUB-GEN0101-U2-T07-S3', 'SUB-GEN0101-U2-T07-S4'],
    prerequisiteSkillIds: ['SKILL-GEN0101-005', 'SKILL-GEN0101-006'],
    masteryEvidence: [
      'Applies quadratic formula x = (-b +- sqrt(b^2 - 4ac)) / (2a) accurately.',
      'Solves higher-degree polynomial equations reducible to quadratic form.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Irrational roots', 'Complex conjugate roots', 'Discriminant analysis'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 8',
      rawTextExtract: 'Solving quadratic equations, Factoring polynomial expressions, Solving polynomial equations'
    }]
  },
  {
    id: 'SKILL-GEN0101-009',
    canonicalName: 'Solve 2x2 and 3x3 linear and non-linear systems of equations',
    description: 'Compute intersection solutions using substitution, elimination, and matrix methods.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U2-T08',
    parentSubtopicIds: ['SUB-GEN0101-U2-T08-S1', 'SUB-GEN0101-U2-T08-S2', 'SUB-GEN0101-U2-T08-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-005', 'SKILL-GEN0101-008'],
    masteryEvidence: [
      'Eliminates variables systematically to isolate single-variable expressions.',
      'Identifies non-linear intersection points between linear lines and quadratic curves.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['3-variable systems', 'Non-linear quadratic-linear combinations'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 9',
      rawTextExtract: 'Systems of linear equations, Substitution method, Elimination method, Non-linear systems'
    }]
  },
  {
    id: 'SKILL-GEN0101-010',
    canonicalName: 'Analyze function domain, range, composition, and inverse functions',
    description: 'Determine natural domains of algebraic functions, compose f(g(x)), and find algebraic inverses f^(-1)(x).',
    skillType: 'INTERPRETATION',
    dominantCompetency: 'INTERPRET',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U2-T09',
    parentSubtopicIds: ['SUB-GEN0101-U2-T09-S1', 'SUB-GEN0101-U2-T09-S2', 'SUB-GEN0101-U2-T09-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-005'],
    masteryEvidence: [
      'Identifies domain restrictions (zero denominators, negative radicands).',
      'Constructs composite functions and derives inverse function formulas.'
    ],
    evidenceTypes: ['SYMBOLIC_DERIVATION', 'MCQ_RECOGNITION'],
    difficultyFactors: ['Rational radicand domains', 'Inverse of fractional linear mappings'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 10',
      rawTextExtract: 'Domain and range, Composition of functions, Inverse functions, Parametric representation'
    }]
  },
  {
    id: 'SKILL-GEN0101-011',
    canonicalName: 'Solve exponential and logarithmic algebraic equations',
    description: 'Apply log properties (product, quotient, power, change-of-base) to isolate variables in exponential equations.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U2-T10',
    parentSubtopicIds: ['SUB-GEN0101-U2-T10-S1', 'SUB-GEN0101-U2-T10-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0101-006', 'SKILL-GEN0101-010'],
    masteryEvidence: [
      'Applies natural and common logarithms to solve equations where unknown is in exponent.',
      'Combines logarithmic terms using log(ab) = log a + log b and log(a/b) = log a - log b.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Different exponential bases on both sides', 'Quadratic form in exponential terms'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 11',
      rawTextExtract: 'Logarithmic and Exponential Functions and Applications'
    }]
  },
  {
    id: 'SKILL-GEN0101-012',
    canonicalName: 'Calculate coordinate distance, midpoint, and slope in the Cartesian plane',
    description: 'Compute distance, midpoint, and slope between Cartesian coordinate pairs.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U3-T11',
    parentSubtopicIds: ['SUB-GEN0101-U3-T11-S1', 'SUB-GEN0101-U3-T11-S2', 'SUB-GEN0101-U3-T11-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Calculates Euclidean distance d = sqrt((x2 - x1)^2 + (y2 - y1)^2).',
      'Calculates midpoint coordinates and slope m = (y2 - y1) / (x2 - x1).'
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Fractional and negative coordinates', 'Radical distance simplification'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 13',
      rawTextExtract: 'Distance between two points, Midpoint formula, Slope of a line'
    }]
  },
  {
    id: 'SKILL-GEN0101-017',
    canonicalName: 'Formulate equations of straight lines and determine parallel and perpendicular relationships',
    description: 'Construct lines in slope-intercept, point-slope, and general form; compute perpendicular distances.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U3-T12',
    parentSubtopicIds: ['SUB-GEN0101-U3-T12-S1', 'SUB-GEN0101-U3-T12-S2', 'SUB-GEN0101-U3-T12-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-012', 'SKILL-GEN0101-005'],
    masteryEvidence: [
      'Determines parallel (m1 = m2) and perpendicular (m1 * m2 = -1) line equations.',
      'Computes perpendicular distance from a point (x0, y0) to line Ax + By + C = 0.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Perpendicular distance formula with absolute values', 'General form conversions'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 14',
      rawTextExtract: 'Slope-intercept form, Point-slope form, Parallel and perpendicular lines'
    }]
  },
  {
    id: 'SKILL-GEN0101-013',
    canonicalName: 'Solve right-angled triangles using trigonometric ratios and Pythagorean theorem',
    description: 'Apply sine, cosine, tangent (SOH-CAH-TOA) and reciprocal ratios to solve unknown sides and angles in right triangles.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U3-T13',
    parentSubtopicIds: ['SUB-GEN0101-U3-T13-S1', 'SUB-GEN0101-U3-T13-S2', 'SUB-GEN0101-U3-T13-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-008'],
    masteryEvidence: [
      'Selects correct trig ratio relating given and unknown triangle components.',
      'Computes inverse trig angles accurately in degrees and radians.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Multi-triangle nested diagrams', 'Degree-minute-second conversions'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 15',
      rawTextExtract: 'Pythagorean theorem, Trigonometric ratios, Solution of right-angled triangles'
    }]
  },
  {
    id: 'SKILL-GEN0101-014',
    canonicalName: 'Solve engineering trigonometric problems involving bearings and elevation angles',
    description: 'Translate surveying angles of elevation/depression and compass bearings into geometric triangles to calculate distances and heights.',
    skillType: 'APPLICATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U3-T14',
    parentSubtopicIds: ['SUB-GEN0101-U3-T14-S1', 'SUB-GEN0101-U3-T14-S2', 'SUB-GEN0101-U3-T14-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-013'],
    masteryEvidence: [
      'Draws geometric diagrams representing compass bearings (e.g. N 45 deg E) correctly.',
      'Computes inaccessible object heights using elevation angle trigonometry.'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['3D bearing offsets', 'Moving observation points with multiple angles'],
    engineeringContext: 'Surveying, navigation, civil site leveling, structural mast heights.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 16',
      rawTextExtract: 'Angles and angle measurement, Bearings, Angles of elevation and depression'
    }]
  },
  {
    id: 'SKILL-GEN0101-015',
    canonicalName: 'Solve oblique triangles using the Law of Sines and Law of Cosines',
    description: 'Select and apply Sine Law (a/sin A = b/sin B = c/sin C) and Cosine Law (a^2 = b^2 + c^2 - 2bc cos A) for non-right triangles.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U3-T15',
    parentSubtopicIds: ['SUB-GEN0101-U3-T15-S1', 'SUB-GEN0101-U3-T15-S2', 'SUB-GEN0101-U3-T15-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-013'],
    masteryEvidence: [
      'Identifies SAS/SSS vs ASA/AAS cases and selects optimal trigonometric law.',
      'Identifies ambiguous SSA case possibilities (0, 1, or 2 triangles).',
      'Calculates oblique triangle area using Heron\'s formula and (1/2)ab sin C.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Ambiguous SSA case analysis', 'Heron\'s formula large square roots'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 17',
      rawTextExtract: 'Sine Law, Cosine Law, Area of an oblique triangle'
    }]
  },
  {
    id: 'SKILL-GEN0101-016',
    canonicalName: 'Calculate areas and volumes of composite geometric figures and solids',
    description: 'Compute exact plane areas (polygons, circular sectors) and solid mensuration parameters for regular geometric shapes.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0101',
    parentTopicId: 'CURR-GEN0101-U3-T16',
    parentSubtopicIds: ['SUB-GEN0101-U3-T16-S1', 'SUB-GEN0101-U3-T16-S2', 'SUB-GEN0101-U3-T16-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-013'],
    masteryEvidence: [
      'Decomposes irregular composite figures into standard geometric primitives.',
      'Computes area of circular segments and regular n-sided polygon perimeters/areas.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Subtractive composite geometries', 'Trigonometric apothem calculations for n-gons'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 18',
      rawTextExtract: 'Area of regular polygons, Area of circles and sectors, Composite plane figures'
    }]
  },

  // =========================================================================
  // COURSE: GEN 0102 (Calculus 1)
  // =========================================================================
  {
    id: 'SKILL-GEN0102-001',
    canonicalName: 'Evaluate function limits using algebraic factoring, rationalization, and standard forms',
    description: 'Evaluate finite limits, indeterminate forms (0/0), one-sided limits, and infinite limits using algebraic simplification.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U1-T03',
    parentSubtopicIds: ['SUB-GEN0102-U1-T03-S1', 'SUB-GEN0102-U1-T03-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0101-005', 'SKILL-GEN0101-010'],
    masteryEvidence: [
      'Factors numerator and denominator to cancel vanishing terms in 0/0 indeterminate limits.',
      'Multiplies by conjugate binomials to rationalize radical limit expressions.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Radical conjugate rationalization', 'Limits at infinity with higher power quotients'],
    potentialMisconceptions: ['ZERO_DERIVATIVE_CONFUSION'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Evaluating Limits, Apply algebraic techniques and conceptual understanding to evaluate various limits'
    }]
  },
  {
    id: 'SKILL-GEN0102-002',
    canonicalName: 'Apply the Power Rule to differentiate polynomial, radical, and rational power functions',
    description: 'Compute d/dx [x^n] = n*x^(n-1) for positive, negative, and fractional exponent values.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U1-T04',
    parentSubtopicIds: ['SUB-GEN0102-U1-T04-S1'],
    prerequisiteSkillIds: ['SKILL-GEN0101-006'],
    masteryEvidence: [
      'Multiplies coefficient by power n and decrements exponent by 1.',
      'Rewrites radical terms (sqrt[k](x^m) -> x^(m/k)) prior to differentiation.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Fractional negative powers', 'Radical denominators'],
    potentialMisconceptions: ['POWER_RULE_NO_REDUCE', 'POWER_RULE_FORGOT_COEFF'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Analysis of Calculus Methods, Apply the rules of differentiation'
    }]
  },
  {
    id: 'SKILL-GEN0102-003',
    canonicalName: 'Apply the Product Rule to differentiate products of algebraic and transcendental functions',
    description: 'Compute d/dx [u*v] = u\'*v + u*v\' for products of polynomials, trigonometric, and exponential terms.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U1-T04',
    parentSubtopicIds: ['SUB-GEN0102-U1-T04-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-002'],
    masteryEvidence: [
      'Identifies two distinct factors u(x) and v(x).',
      'Differentiates each factor and assembles the sum u\'v + uv\'.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Mixed polynomial and trigonometric factors', '3-term product expansion'],
    potentialMisconceptions: ['PRODUCT_RULE_MULTIPLY_DERIVS', 'PRODUCT_RULE_OMITTED_TERM'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'rules of differentiation, including the product, quotient, and chain rules'
    }]
  },
  {
    id: 'SKILL-GEN0102-004',
    canonicalName: 'Apply the Quotient Rule to differentiate rational and fractional functions',
    description: 'Compute d/dx [u/v] = (u\'*v - u*v\') / v^2, preserving correct subtraction order and squaring the denominator.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U1-T04',
    parentSubtopicIds: ['SUB-GEN0102-U1-T04-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0102-002'],
    masteryEvidence: [
      'Applies (Lo d-Hi - Hi d-Lo) / Lo^2 with correct negative sign placement.',
      'Simplifies numerator terms without prematurely canceling across denominator terms.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Multi-term numerator and denominator', 'Negative signs in denominator derivative'],
    potentialMisconceptions: ['QUOTIENT_RULE_SIGN_FLIP', 'QUOTIENT_RULE_NO_SQUARE', 'QUOTIENT_RULE_REVERSED_NUMERATOR'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'rules of differentiation, including the product, quotient, and chain rules'
    }]
  },
  {
    id: 'SKILL-GEN0102-005',
    canonicalName: 'Apply the Chain Rule to differentiate composite functions',
    description: 'Identify inner function u(x) and outer function f(u); compute d/dx [f(u(x))] = f\'(u(x)) * u\'(x).',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U1-T04',
    parentSubtopicIds: ['SUB-GEN0102-U1-T04-S4'],
    prerequisiteSkillIds: ['SKILL-GEN0102-002', 'SKILL-GEN0101-010'],
    masteryEvidence: [
      'Identifies inner core u(x) and outer function wrapper.',
      'Differentiates outer function with inner left intact, then multiplies by du/dx.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION', 'ERROR_ANALYSIS'],
    difficultyFactors: ['Multi-nested composite layers (e.g. sin^3(4x^2 - 1))', 'Combination with Product/Quotient rules'],
    potentialMisconceptions: ['MISSING_INNER_DERIVATIVE', 'CHAIN_FORGOT_OUTER'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'rules of differentiation, including the product, quotient, and chain rules'
    }]
  },
  {
    id: 'SKILL-GEN0102-006',
    canonicalName: 'Differentiate inverse trigonometric functions',
    description: 'Compute derivatives of arcsin(u), arccos(u), arctan(u), arccot(u), arcsec(u), arccsc(u) combined with the Chain Rule.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U2-T05',
    parentSubtopicIds: ['SUB-GEN0102-U2-T05-S1', 'SUB-GEN0102-U2-T05-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-005'],
    masteryEvidence: [
      'Applies d/dx[arctan(u)] = u\' / (1 + u^2) and d/dx[arcsin(u)] = u\' / sqrt(1 - u^2).',
      'Simplifies algebraic radical denominators in composite inverse trig derivatives.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Rational inner arguments (e.g. arctan(x/a))', 'Nested square root simplification'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '5. Derivatives of Inverse Trigonometric Functions'
    }]
  },
  {
    id: 'SKILL-GEN0102-007',
    canonicalName: 'Differentiate hyperbolic and inverse hyperbolic functions',
    description: 'Compute derivatives of sinh(u), cosh(u), tanh(u), sech(u), csch(u), coth(u) and their Chain Rule extensions.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U2-T06',
    parentSubtopicIds: ['SUB-GEN0102-U2-T06-S1', 'SUB-GEN0102-U2-T06-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-005'],
    masteryEvidence: [
      'Correctly applies sign rules (d/dx[cosh(u)] = +sinh(u)*u\', d/dx[tanh(u)] = sech^2(u)*u\').',
      'Distinguishes hyperbolic derivative sign patterns from circular trigonometric derivatives.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['Distinguishing circular vs hyperbolic sign conventions', 'Composite arguments'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '6. Derivatives of Hyperbolic Functions'
    }]
  },
  {
    id: 'SKILL-GEN0102-008',
    canonicalName: 'Differentiate logarithmic and exponential functions and apply logarithmic differentiation',
    description: 'Compute derivatives of ln(u), log_a(u), e^u, and a^u; apply log differentiation to complicated products and variable powers f(x)^g(x).',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U2-T07',
    parentSubtopicIds: ['SUB-GEN0102-U2-T07-S1', 'SUB-GEN0102-U2-T07-S2', 'SUB-GEN0102-U2-T07-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0102-005', 'SKILL-GEN0101-011'],
    masteryEvidence: [
      'Applies d/dx[ln(u)] = u\'/u and d/dx[e^u] = e^u * u\'.',
      'Applies natural log to both sides of y = f(x)^g(x) before differentiating implicitly.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Variable base and variable exponent (x^x, x^sin x)', 'Multi-factor rational quotients'],
    potentialMisconceptions: ['LOG_FORGOT_RECIPROCAL', 'EXP_FORGOT_CHAIN_COEFF'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '7. Derivatives of Logarithmic and Exponential Functions'
    }]
  },
  {
    id: 'SKILL-GEN0102-009',
    canonicalName: 'Perform implicit differentiation on bivariate equations F(x, y) = 0',
    description: 'Differentiate each term with respect to x using the Chain Rule (treating y as a function of x), collect dy/dx terms, and solve for dy/dx.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U2-T08',
    parentSubtopicIds: ['SUB-GEN0102-U2-T08-S1', 'SUB-GEN0102-U2-T08-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-003', 'SKILL-GEN0102-005'],
    masteryEvidence: [
      'Applies Product Rule to mixed product terms (e.g. d/dx[xy] = y + x*(dy/dx)).',
      'Factors out dy/dx and expresses the derivative as a clean rational expression.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Higher powers of y', 'Mixed trigonometric or exponential terms containing y', 'Second derivatives d^2y/dx^2'],
    potentialMisconceptions: ['IMPLICIT_FORGOT_DYDX_FACTOR', 'IMPLICIT_SIGN_ERROR'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '8. Implicit Differentiation, Apply implicit differentiation to find derivatives'
    }]
  },
  {
    id: 'SKILL-GEN0102-010',
    canonicalName: 'Compute first-order partial derivatives for multivariable functions',
    description: 'Compute partial derivatives df/dx (holding y constant) and df/dy (holding x constant) for z = f(x, y).',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U2-T09',
    parentSubtopicIds: ['SUB-GEN0102-U2-T09-S1', 'SUB-GEN0102-U2-T09-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-002', 'SKILL-GEN0102-005'],
    masteryEvidence: [
      'Treats unselected independent variables strictly as constants during differentiation.',
      'Computes mixed second partials d^2f/(dx dy) and verifies Clairaut\'s theorem equality.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Functions with 3+ independent variables', 'Implicit partial derivatives dz/dx'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '9. Partial Differentiation, Compute partial derivatives for multivariable functions'
    }]
  },
  {
    id: 'SKILL-GEN0102-011',
    canonicalName: 'Compute higher-order derivatives and evaluate physical acceleration',
    description: 'Compute successive derivatives (f\'\', f\'\'\', f^(n)) to determine curve concavity and kinematics motion acceleration.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U2-T10',
    parentSubtopicIds: ['SUB-GEN0102-U2-T10-S1', 'SUB-GEN0102-U2-T10-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-002', 'SKILL-GEN0102-005'],
    masteryEvidence: [
      'Differentiates successive derivative expressions accurately.',
      'Evaluates instantaneous position s(t), velocity v(t) = s\'(t), and acceleration a(t) = s\'\'(t).'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Product Rule terms expanding exponentially in higher orders', 'General nth derivative formula deduction'],
    potentialMisconceptions: ['HIGHER_ORDER_STOP_EARLY'],
    engineeringContext: 'Vibration dynamics, jerk/acceleration analysis, beam deflection curvature.',
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '10. Higher order derivatives, Calculate and interpret higher-order derivatives'
    }]
  },
  {
    id: 'SKILL-GEN0102-012',
    canonicalName: 'Determine slopes and equations of tangent and normal lines to curves',
    description: 'Evaluate m_tan = f\'(x0) and formulate tangent line y - y0 = m_tan(x - x0) and normal line y - y0 = (-1/m_tan)(x - x0).',
    skillType: 'APPLICATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U3-T11',
    parentSubtopicIds: ['SUB-GEN0102-U3-T11-S1', 'SUB-GEN0102-U3-T11-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-002', 'SKILL-GEN0101-017'],
    masteryEvidence: [
      'Differentiates curve formula, evaluates derivative at given point to find slope.',
      'Constructs tangent and perpendicular normal line equations with exact fractions.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Implicit curve points', 'Horizontal or vertical tangent lines'],
    potentialMisconceptions: ['APP_EVALUATION_BEFORE_DIFF'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: '11. The slope, Understand and apply the concept of slope to analyze the rate of change'
    }]
  },
  {
    id: 'SKILL-GEN0102-013',
    canonicalName: 'Perform polynomial curve analysis (Critical points, intervals of increase/decrease, concavity, and inflection points)',
    description: 'Use the First Derivative Test and Second Derivative Test to classify local extrema and points of inflection for curve sketching.',
    skillType: 'REASONING',
    dominantCompetency: 'REASON',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U3-T12',
    parentSubtopicIds: ['SUB-GEN0102-U3-T12-S1', 'SUB-GEN0102-U3-T12-S2', 'SUB-GEN0102-U3-T12-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0102-011', 'SKILL-GEN0101-008'],
    masteryEvidence: [
      'Finds critical numbers by solving f\'(x) = 0 and points where f\'(x) is undefined.',
      'Constructs sign chart to determine intervals of increase/decrease and concavity f\'\'(x) > 0 / f\'\'(x) < 0.'
    ],
    evidenceTypes: ['GRAPHICAL_ANALYSIS', 'MULTI_STEP_SOLUTION', 'MCQ_RECOGNITION'],
    difficultyFactors: ['Higher-order polynomial sign charts', 'Cusp points and vertical asymptotes'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: '12. Polynomial curves, Analyze and sketch polynomial curves'
    }]
  },
  {
    id: 'SKILL-GEN0102-014',
    canonicalName: 'Formulate and solve engineering optimization problems (Maxima and Minima)',
    description: 'Translate geometric, structural, or financial constraints into single-variable objective functions and determine optimal dimensions.',
    skillType: 'MODELING',
    dominantCompetency: 'MODEL',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U3-T13',
    parentSubtopicIds: ['SUB-GEN0102-U3-T13-S1'],
    prerequisiteSkillIds: ['SKILL-GEN0102-013', 'SKILL-GEN0101-005'],
    masteryEvidence: [
      'Expresses primary objective quantity in terms of a single variable using secondary constraint equations.',
      'Differentiates, finds stationary points, and verifies absolute maximum/minimum via second derivative test or boundary check.'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Multi-variable constraints', 'Trigonometric geometric angles', 'Non-linear material cost functions'],
    engineeringContext: 'Structural beam strength maximization, container material minimization, fluid pipe throughput.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: '13. Applications of the Derivative(Maxima, minima, related rates)'
    }]
  },
  {
    id: 'SKILL-GEN0102-015',
    canonicalName: 'Formulate and solve geometric and physical related rates problems',
    description: 'Relate physical quantities via geometric formulas, differentiate with respect to time t implicitly, and substitute instantaneous values.',
    skillType: 'MODELING',
    dominantCompetency: 'MODEL',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0102',
    parentTopicId: 'CURR-GEN0102-U3-T13',
    parentSubtopicIds: ['SUB-GEN0102-U3-T13-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-009', 'SKILL-GEN0101-013'],
    masteryEvidence: [
      'Writes geometric equation relating variables before substituting numerical values.',
      'Differentiates implicitly with respect to time d/dt and solves for the target rate of change (e.g. dh/dt, dV/dt, dtheta/dt).'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Conical tank volume scaling (r/h similarity)', 'Trigonometric angle of elevation rates', 'Pythagorean moving ladder problems'],
    engineeringContext: 'Reservoir drainage, moving vehicle tracking, radar range rate, hydraulic piston flow.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: '13. Applications of the Derivative(Maxima, minima, related rates)'
    }]
  },

  // =========================================================================
  // COURSE: GEN 0107 (Differential Equations)
  // =========================================================================
  {
    id: 'SKILL-GEN0107-001',
    canonicalName: 'Classify differential equations by type, order, degree, and linearity',
    description: 'Inspect ODEs and PDEs to identify highest derivative order, polynomial power of highest derivative, and linear vs non-linear properties.',
    skillType: 'RECOGNITION',
    dominantCompetency: 'KNOW',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U1-T01',
    parentSubtopicIds: ['SUB-GEN0107-U1-T01-S1', 'SUB-GEN0107-U1-T01-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-011'],
    masteryEvidence: [
      'Correctly states ODE vs PDE type, order, degree, and identifies non-linear terms (e.g. y*y\', sin(y), (y\')^2).',
      'Distinguishes linear ordinary differential equations from non-linear equations with variable coefficients.'
    ],
    evidenceTypes: ['MCQ_RECOGNITION', 'ERROR_ANALYSIS'],
    difficultyFactors: ['Implicit differential forms', 'Non-linear dependent variable terms inside transcendental functions'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Classification of Differential Equations, Classify differential equations according to their type, order, degree, and linearity'
    }]
  },
  {
    id: 'SKILL-GEN0107-002',
    canonicalName: 'Formulate differential equations by eliminating arbitrary constants',
    description: 'Differentiate an n-parameter family of curves n times and algebraically eliminate the n constants to construct the governing ODE.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U1-T02',
    parentSubtopicIds: ['SUB-GEN0107-U1-T02-S1', 'SUB-GEN0107-U1-T02-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-009', 'SKILL-GEN0101-009'],
    masteryEvidence: [
      'Differentiates curve relation successively and eliminates arbitrary constants C1, C2.',
      'Constructs ODE of order equal to the number of independent arbitrary constants.'
    ],
    evidenceTypes: ['SYMBOLIC_DERIVATION', 'DIRECT_CALCULATION'],
    difficultyFactors: ['2-parameter families requiring simultaneous algebraic substitution', 'Exponential/trigonometric curve families'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Elimination of Arbitrary Constant, Formulate differential equations by eliminating arbitrary constants'
    }]
  },
  {
    id: 'SKILL-GEN0107-003',
    canonicalName: 'Solve first-order ODEs using separation of variables',
    description: 'Rearrange equations into g(y) dy = f(x) dx, integrate both sides, and solve for explicit/implicit general or IVP solutions.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U1-T03',
    parentSubtopicIds: ['SUB-GEN0107-U1-T03-S1', 'SUB-GEN0107-U1-T03-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0101-005', 'SKILL-GEN0102-002'],
    masteryEvidence: [
      'Separates x and y terms to opposite sides of equality.',
      'Integrates both sides and applies initial condition y(x0) = y0 to evaluate particular constant C.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Algebraic factoring required before separation', 'Logarithmic integration resulting in absolute values'],
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Variable Separable, Solve first-order differential equations by applying the method of separation of variables'
    }]
  },
  {
    id: 'SKILL-GEN0107-004',
    canonicalName: 'Solve homogeneous first-order differential equations using substitution y = vx',
    description: 'Verify homogeneity condition M(tx, ty) = t^n M(x, y), apply y = vx (dy = v dx + x dv), separate variables in v and x, and back-substitute.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U2-T04',
    parentSubtopicIds: ['SUB-GEN0107-U2-T04-S1', 'SUB-GEN0107-U2-T04-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0107-003', 'SKILL-GEN0101-005'],
    masteryEvidence: [
      'Tests polynomial degrees for homogeneous uniformity.',
      'Transforms ODE into separable form in variables v and x, integrates, and restores y/x.'
    ],
    evidenceTypes: ['MULTI_STEP_SOLUTION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Partial fraction integration in v', 'Algebraic simplification of back-substituted terms'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Homogeneous Linear Differential Equation with and without Constant Coefficients'
    }]
  },
  {
    id: 'SKILL-GEN0107-005',
    canonicalName: 'Solve exact first-order differential equations and determine integrating factors',
    description: 'Verify exactness dM/dy = dN/dx for M dx + N dy = 0, find potential function psi(x, y) = C by partial integration.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U2-T05',
    parentSubtopicIds: ['SUB-GEN0107-U2-T05-S1', 'SUB-GEN0107-U2-T05-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-010'],
    masteryEvidence: [
      'Evaluates partial derivatives dM/dy and dN/dx to confirm exactness.',
      'Integrates M with respect to x with arbitrary function k(y), differentiates with respect to y, and matches with N.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Integrating factor finding when initially non-exact', 'Multi-term potential function matching'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Exact Differential Equation of Order one, Identify exact differential equations and solve them'
    }]
  },
  {
    id: 'SKILL-GEN0107-006',
    canonicalName: 'Solve first-order linear differential equations using integrating factors',
    description: 'Put ODE in standard form dy/dx + P(x)y = Q(x), compute integrating factor mu(x) = exp(int P(x) dx), and integrate d/dx[mu*y] = mu*Q.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U2-T06',
    parentSubtopicIds: ['SUB-GEN0107-U2-T06-S1', 'SUB-GEN0107-U2-T06-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-008', 'SKILL-GEN0101-005'],
    masteryEvidence: [
      'Identifies P(x) and Q(x) after dividing by leading coefficient.',
      'Computes mu(x) = e^(int P dx) and evaluates y = (1/mu) * int (mu * Q dx + C).'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Integration by parts required in int(mu*Q dx)', 'Negative signs in P(x) resulting in fractional integrating factors'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Linear Differential Equation of Order one, Solve linear differential equations of order one using the integrating factor method'
    }]
  },
  {
    id: 'SKILL-GEN0107-007',
    canonicalName: 'Solve Bernoulli differential equations using linearizing substitution',
    description: 'Transform Bernoulli equation dy/dx + P(x)y = Q(x)y^n into standard linear form in v using substitution v = y^(1-n).',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U2-T07',
    parentSubtopicIds: ['SUB-GEN0107-U2-T07-S1', 'SUB-GEN0107-U2-T07-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0107-006', 'SKILL-GEN0102-005'],
    masteryEvidence: [
      'Divides through by y^n and substitutes v = y^(1-n), dv/dx = (1-n)y^(-n) dy/dx.',
      'Solves the resulting linear ODE for v(x) and back-substitutes y = v^(1/(1-n)).'
    ],
    evidenceTypes: ['MULTI_STEP_SOLUTION', 'DIRECT_CALCULATION'],
    difficultyFactors: ['Negative powers n < 0', 'Complex linear integrating factor in v-space'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Bernoulli Differential Equation of Order one, Transform Bernoulli differential equations of order one into linear form'
    }]
  },
  {
    id: 'SKILL-GEN0107-008',
    canonicalName: 'Model engineering physical systems using first-order differential equations (Growth, Cooling, Mixtures)',
    description: 'Set up and solve IVP differential models for Newton\'s Law of Cooling, radioactive decay, and dynamic tank mixing.',
    skillType: 'MODELING',
    dominantCompetency: 'MODEL',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U2-T08',
    parentSubtopicIds: ['SUB-GEN0107-U2-T08-S1', 'SUB-GEN0107-U2-T08-S2', 'SUB-GEN0107-U2-T08-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0107-003', 'SKILL-GEN0107-006', 'SKILL-GEN0101-007'],
    masteryEvidence: [
      'Constructs rate of accumulation balance: dQ/dt = Rate_in - Rate_out.',
      'Solves cooling equation dT/dt = -k(T - T_env) with boundary conditions.'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Variable tank volume (inflow rate != outflow rate)', 'Non-constant ambient temperature T_env(t)'],
    engineeringContext: 'Heat dissipation, chemical reactor kinetics, hydraulic reservoir contamination dilution.',
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Application of 1st Order Differential Equations, Apply first-order differential equations to model and solve practical engineering applications'
    }]
  },
  {
    id: 'SKILL-GEN0107-009',
    canonicalName: 'Solve linear initial value problems using the Laplace transform',
    description: 'Transform derivative IVPs into algebraic s-domain equations using L{y\'} = sY(s) - y(0) and L{y\'\'} = s^2 Y(s) - s y(0) - y\'(0).',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U3-T09',
    parentSubtopicIds: ['SUB-GEN0107-U3-T09-S1', 'SUB-GEN0107-U3-T09-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-011', 'SKILL-GEN0101-005'],
    masteryEvidence: [
      'Applies Laplace transform linearity and derivative initial condition formulas.',
      'Isolates algebraic response transform Y(s) in s-domain.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Non-zero initial conditions y(0) != 0, y\'(0) != 0', 'Transcendental forcing functions (sin(wt), e^(at))'],
    engineeringContext: 'Mechanical mass-spring vibrations, electrical RLC circuit transient analysis.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Solution of Systems of Linear Differential Equation with Initial Values (Laplace Transform Method)'
    }]
  },
  {
    id: 'SKILL-GEN0107-010',
    canonicalName: 'Solve simultaneous coupled linear differential systems using Laplace transforms',
    description: 'Transform coupled 2-variable differential equations into a 2x2 linear algebraic system in s-domain, solve via Cramer\'s rule, and invert.',
    skillType: 'PROCEDURAL',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U3-T10',
    parentSubtopicIds: ['SUB-GEN0107-U3-T10-S1', 'SUB-GEN0107-U3-T10-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0107-009', 'SKILL-GEN0101-009'],
    masteryEvidence: [
      'Constructs coupled s-domain matrix system for X(s) and Y(s).',
      'Solves algebraic transform determinant equations simultaneously.'
    ],
    evidenceTypes: ['MULTI_STEP_SOLUTION', 'DIRECT_CALCULATION'],
    difficultyFactors: ['Coupled 2-degree-of-freedom mass systems', 'Higher-degree characteristic determinant polynomials'],
    engineeringContext: 'Two-tank interconnected liquid mixing, multi-loop electrical circuits, coupled vibration dampers.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Simultaneous Solution to DE (Laplace Transform Method)'
    }]
  },
  {
    id: 'SKILL-GEN0107-011',
    canonicalName: 'Compute inverse Laplace transforms using partial fraction decomposition and shifting theorems',
    description: 'Decompose rational s-domain functions F(s) into partial fractions and apply inverse transforms L^(-1){F(s)} using table pairs and first shifting theorem.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0107',
    parentTopicId: 'CURR-GEN0107-U3-T11',
    parentSubtopicIds: ['SUB-GEN0107-U3-T11-S1', 'SUB-GEN0107-U3-T11-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0101-005', 'SKILL-GEN0107-009'],
    masteryEvidence: [
      'Expands rational s-fractions with linear, repeated, and irreducible quadratic denominator factors.',
      'Applies first shifting theorem L^(-1){F(s - a)} = e^(at) f(t) and completes the square in quadratic denominators.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Completing the square with non-monic quadratics', 'Repeated irreducible quadratic factors (s^2 + w^2)^2'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Inverse Laplace Transforms of Functions, Evaluate the inverse Laplace transforms'
    }]
  },

  // =========================================================================
  // COURSE: GEN 0110 (Physics 2 for Engineers - Lec/Lab)
  // =========================================================================
  {
    id: 'SKILL-GEN0110-001',
    canonicalName: 'Calculate hydrostatic pressure, buoyant force, and fluid discharge rate',
    description: 'Apply P = P0 + rho*g*h, Archimedes\' principle F_b = rho_fluid * V_sub * g, and continuity equation A1*v1 = A2*v2.',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U1-T01',
    parentSubtopicIds: ['SUB-GEN0110-U1-T01-S1', 'SUB-GEN0110-U1-T01-S2', 'SUB-GEN0110-U1-T01-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Calculates absolute and gauge pressure at varying liquid depths.',
      'Computes submerged volume fraction and apparent weight of floating bodies.',
      'Calculates fluid flow velocity and volume discharge rate Q = A*v through tapering pipes.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Multi-layer immiscible fluids in U-tube manometers', 'Hydraulic press mechanical advantage'],
    engineeringContext: 'Hydraulic jacks, dam wall hydrostatic thrust, pipe sizing for municipal water flow.',
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Fluid Mechanics, Apply principles of fluid mechanics to analyze static and dynamic fluid behaviors'
    }]
  },
  {
    id: 'SKILL-GEN0110-002',
    canonicalName: 'Calculate thermal heat conduction, convection, and radiation energy transfer rates',
    description: 'Apply Fourier\'s law H = k*A*(Th - Tc)/L, Newton\'s cooling law, and Stefan-Boltzmann radiation law P = epsilon*sigma*A*T^4.',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U1-T02',
    parentSubtopicIds: ['SUB-GEN0110-U1-T02-S1', 'SUB-GEN0110-U1-T02-S2', 'SUB-GEN0110-U1-T02-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Computes composite wall conduction heat transfer rate through series thermal resistances.',
      'Calculates net radiation heat exchange between an object and its surrounding environment using absolute temperatures in Kelvin.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Series and parallel composite wall layers', 'T^4 radiation temperature differences with Kelvin conversion'],
    engineeringContext: 'Building thermal insulation, heat sink design, furnace radiant heat loss.',
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Heat Transfer, Evaluate the mechanisms of heat transfer (conduction, convection, and radiation)'
    }]
  },
  {
    id: 'SKILL-GEN0110-003',
    canonicalName: 'Perform calorimetry energy balance calculations for phase changes and thermal equilibrium',
    description: 'Apply Q = m*c*delta_T and Q = m*L to solve multi-component calorimetry mixture equilibrium temperatures and phase changes.',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U1-T03',
    parentSubtopicIds: ['SUB-GEN0110-U1-T03-S1', 'SUB-GEN0110-U1-T03-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001', 'SKILL-GEN0101-005'],
    masteryEvidence: [
      'Sets up conservation of thermal energy: sum(Q_lost) = sum(Q_gained).',
      'Determines whether ice completely melts or steam completely condenses at equilibrium.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Intermediate incomplete phase changes (ice-water mixture at 0 C)', 'Calorimeter container thermal capacity inclusion'],
    engineeringContext: 'Thermal quench cooling of metal alloys, cryogenic storage, cooling water injection.',
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'heat measurements, Perform heat measurement and calorimetry calculations'
    }]
  },
  {
    id: 'SKILL-GEN0110-004',
    canonicalName: 'Calculate linear, area, and volumetric thermal expansion and thermal stress in constrained members',
    description: 'Apply delta_L = alpha*L0*delta_T, delta_V = beta*V0*delta_T, and compute thermal stress sigma = -E*alpha*delta_T in rigidly constrained beams.',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U1-T04',
    parentSubtopicIds: ['SUB-GEN0110-U1-T04-S1', 'SUB-GEN0110-U1-T04-S2', 'SUB-GEN0110-U1-T04-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Calculates expansion gap requirements for bridge joints and railroad tracks.',
      'Computes thermal compressive/tensile stress when thermal expansion is fully or partially prevented.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Bimetallic strip differential expansion', 'Partially constrained expansion with gap clearance'],
    engineeringContext: 'Piping expansion loops, structural steel building thermal joints, engine piston clearances.',
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Thermal Expansion, compute the linear, area, and volume thermal expansion'
    }]
  },
  {
    id: 'SKILL-GEN0110-005',
    canonicalName: 'Calculate acoustic intensity, decibel sound levels, and Doppler frequency shifts',
    description: 'Apply sound intensity decibel formula beta = 10*log10(I/I0) and Doppler equation f_obs = f_src * (v +- v_obs)/(v -+ v_src).',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U2-T05',
    parentSubtopicIds: ['SUB-GEN0110-U2-T05-S1', 'SUB-GEN0110-U2-T05-S2', 'SUB-GEN0110-U2-T05-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-011'],
    masteryEvidence: [
      'Calculates decibel sound level increases when multiple sound sources combine.',
      'Determines observed pitch frequency shift for moving sources and moving detectors.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Both source and observer moving simultaneously', 'Reflected echo Doppler shift from moving targets'],
    engineeringContext: 'Acoustic noise dampening, ultrasonic flow measurement, radar speed guns.',
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Sound waves, Apply principles of sound waves to evaluate acoustic properties and Doppler effect'
    }]
  },
  {
    id: 'SKILL-GEN0110-006',
    canonicalName: 'Analyze wave speed, wavelength, frequency, and standing wave harmonics on strings',
    description: 'Apply v = f*lambda = sqrt(T/mu) and standing wave condition L = n*(lambda/2) for fixed-end vibrating strings.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U2-T06',
    parentSubtopicIds: ['SUB-GEN0110-U2-T06-S1', 'SUB-GEN0110-U2-T06-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Calculates fundamental frequency and higher harmonic resonance frequencies.',
      'Computes wave speed given string tension T and linear mass density mu.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['String tension variations with hanging masses', 'Node and antinode count positioning'],
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Transverse Waves, wave propagation, superposition, and interference'
    }]
  },
  {
    id: 'SKILL-GEN0110-007',
    canonicalName: 'Apply Coulomb\'s Law and Gauss\'s Law to compute electric fields and potentials',
    description: 'Calculate electrostatic force F = k*q1*q2/r^2, field E = F/q, and flux Phi_E = closed_int E*dA = Q_enc / epsilon_0.',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U2-T07',
    parentSubtopicIds: ['SUB-GEN0110-U2-T07-S1', 'SUB-GEN0110-U2-T07-S2', 'SUB-GEN0110-U2-T07-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-013', 'SKILL-GEN0101-001'],
    masteryEvidence: [
      'Performs 2D vector addition of electric forces from multiple discrete point charges.',
      'Applies Gaussian pillbox/cylinder surfaces to find electric field around symmetric conductors and sheets.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Vector resolution of multiple non-collinear charge forces', 'Electric potential difference between concentric spherical shells'],
    engineeringContext: 'Electrostatic precipitators, high-voltage insulator breakdown, capacitor dielectric design.',
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Eletrostartics, Coulomb\'s Law and Gauss\'s Law'
    }]
  },
  {
    id: 'SKILL-GEN0110-008',
    canonicalName: 'Analyze DC circuits using Ohm\'s Law, Kirchhoff\'s Laws, and equivalent resistance',
    description: 'Compute branch currents, node voltages, and power dissipation P = V*I = I^2*R in multi-loop resistor circuits.',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U3-T08',
    parentSubtopicIds: ['SUB-GEN0110-U3-T08-S1', 'SUB-GEN0110-U3-T08-S2', 'SUB-GEN0110-U3-T08-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-009'],
    masteryEvidence: [
      'Simplifies series and parallel resistor combinations into single equivalent resistance.',
      'Writes Kirchhoff\'s Current Law (junction) and Kirchhoff\'s Voltage Law (loop) equations and solves for branch currents.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Multi-loop circuits with multiple independent voltage/current sources', 'Bridge circuits (Wheatstone bridge)'],
    engineeringContext: 'Electrical power distribution, instrumentation sensors, DC motor power feeds.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Electricity, direct current (DC) and alternating current (AC) electrical circuits'
    }]
  },
  {
    id: 'SKILL-GEN0110-009',
    canonicalName: 'Apply Snell\'s Law and the thin lens / mirror equation to calculate image positions and magnifications',
    description: 'Apply n1*sin(theta1) = n2*sin(theta2) for refraction, critical angle sin(theta_c) = n2/n1, and 1/f = 1/do + 1/di with magnification m = -di/do.',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U3-T09',
    parentSubtopicIds: ['SUB-GEN0110-U3-T09-S1', 'SUB-GEN0110-U3-T09-S2', 'SUB-GEN0110-U3-T09-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-013'],
    masteryEvidence: [
      'Determines image distance, magnification, and characteristics (real vs virtual, inverted vs upright).',
      'Calculates total internal reflection critical angle and refraction through prisms.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Sign conventions for diverging lenses and convex mirrors', 'Two-lens optical systems (microscopes/telescopes)'],
    engineeringContext: 'Fiber optic communications, laser beam alignment, optical inspection systems.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Optics, geometric and physical optics, reflection, refraction, lenses, mirrors'
    }]
  },
  {
    id: 'SKILL-GEN0110-010',
    canonicalName: 'Calculate relativistic time dilation, length contraction, and mass-energy equivalence',
    description: 'Apply Lorentz factor gamma = 1 / sqrt(1 - v^2/c^2) to compute dilated time delta_t = gamma*delta_t0, contracted length L = L0/gamma, and relativistic energy E = gamma*m0*c^2.',
    skillType: 'CALCULATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0110',
    parentTopicId: 'CURR-GEN0110-U3-T10',
    parentSubtopicIds: ['SUB-GEN0110-U3-T10-S1', 'SUB-GEN0110-U3-T10-S2', 'SUB-GEN0110-U3-T10-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001', 'SKILL-GEN0101-006'],
    masteryEvidence: [
      'Identifies proper time t0 and proper length L0 in correct reference frames.',
      'Computes kinetic energy and rest energy conversion using E = mc^2.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MCQ_RECOGNITION'],
    difficultyFactors: ['Speeds close to c (0.99c) requiring high-precision decimal powers', 'Relativistic Doppler effect'],
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Special Relativity, Apply principles of special relativity to compute time dilation, length contraction, and mass-energy equivalence'
    }]
  },

  // =========================================================================
  // COURSE: GEN 0161 (Thermodynamics)
  // =========================================================================
  {
    id: 'SKILL-GEN0161-001',
    canonicalName: 'Identify thermodynamic system boundaries, states, properties, and equilibrium conditions',
    description: 'Distinguish between open (control volume), closed (control mass), and isolated systems; classify intensive vs extensive properties.',
    skillType: 'RECOGNITION',
    dominantCompetency: 'KNOW',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0161',
    parentTopicId: 'CURR-GEN0161-U1-T02',
    parentSubtopicIds: ['SUB-GEN0161-U1-T02-S1', 'SUB-GEN0161-U1-T02-S2'],
    prerequisiteSkillIds: [],
    masteryEvidence: [
      'Correctly identifies system boundary across turbines, nozzles, pistons, and rigid tanks.',
      'Distinguishes intensive properties (T, P, v) from extensive properties (m, V, U, H).'
    ],
    evidenceTypes: ['MCQ_RECOGNITION', 'INTERPRETATION'],
    difficultyFactors: ['Moving boundary control volumes (piston-cylinder)', 'Rigid insulated tanks with partition rupture'],
    engineeringContext: 'Power plant component modeling, engine cylinder boundaries.',
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Basic Principles, Concept and Definition of thermodynamics, closed and open systems'
    }]
  },
  {
    id: 'SKILL-GEN0161-002',
    canonicalName: 'Apply the First Law of Thermodynamics to closed-system non-flow energy balances',
    description: 'Apply Q - W = delta_U = m*c_v*delta_T to compute heat transfer, boundary work W = int P dV, and internal energy changes.',
    skillType: 'APPLICATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0161',
    parentTopicId: 'CURR-GEN0161-U1-T03',
    parentSubtopicIds: ['SUB-GEN0161-U1-T03-S1'],
    prerequisiteSkillIds: ['SKILL-GEN0161-001', 'SKILL-GEN0101-001'],
    masteryEvidence: [
      'Applies thermodynamic sign conventions (Q > 0 into system, W > 0 work done by system).',
      'Calculates net energy exchange across single and multi-stage closed cycles.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Spring-loaded piston boundary work W = int P dV', 'Simultaneous heat loss and electrical paddle work'],
    engineeringContext: 'Reciprocating compressor compression, autoclave heating, closed chamber combustion.',
    associatedOutcomeIds: ['LLO1'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'First Law of Thermodynamics, formulate energy balance equations and calculate heat, work, and internal energy'
    }]
  },
  {
    id: 'SKILL-GEN0161-003',
    canonicalName: 'Apply the ideal gas equation of state and specific heat relations',
    description: 'Calculate pressure, temperature, volume, and mass using P*V = m*R*T and evaluate c_p - c_v = R and k = c_p/c_v.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0161',
    parentTopicId: 'CURR-GEN0161-U2-T04',
    parentSubtopicIds: ['SUB-GEN0161-U2-T04-S1', 'SUB-GEN0161-U2-T04-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0161-001', 'SKILL-GEN0101-005'],
    masteryEvidence: [
      'Converts temperatures strictly to absolute Kelvin and pressures to absolute kPa.',
      'Computes gas constant R = R_u / M for specific gases and determines mass from PV=mRT.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Gauge vs absolute pressure conversion', 'Mixed gas molecular weights'],
    engineeringContext: 'Pneumatic accumulator sizing, compressed air tank storage, gas turbine intake air density.',
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Ideal Gases / Ideal gas Laws, Utilize the ideal gas equation of state'
    }]
  },
  {
    id: 'SKILL-GEN0161-004',
    canonicalName: 'Calculate boundary work, heat transfer, and property changes for standard ideal gas processes',
    description: 'Compute W, Q, delta_U, and delta_H for isobaric (P=C), isochoric (V=C), isothermal (T=C), isentropic (PV^k=C), and polytropic (PV^n=C) processes.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0161',
    parentTopicId: 'CURR-GEN0161-U2-T05',
    parentSubtopicIds: ['SUB-GEN0161-U2-T05-S1', 'SUB-GEN0161-U2-T05-S2', 'SUB-GEN0161-U2-T05-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0161-002', 'SKILL-GEN0161-003'],
    masteryEvidence: [
      'Selects correct boundary work formula (e.g. W = (P2*V2 - P1*V1)/(1-n) for polytropic, W = mRT*ln(V2/V1) for isothermal).',
      'Constructs P-v process paths and correctly determines sign of heat and work.'
    ],
    evidenceTypes: ['MULTI_STEP_SOLUTION', 'DIRECT_CALCULATION'],
    difficultyFactors: ['Multi-process sequential cycles (e.g. 1-2 isobaric, 2-3 isentropic, 3-1 isothermal)', 'Polytropic exponent n determination from endpoints'],
    engineeringContext: 'Internal combustion engine compression stroke, gas turbine expansion nozzle.',
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Processes of Ideal Gases, Analyze standard thermodynamic processes of ideal gases (isobaric, isochoric, isothermal, isentropic, and polytropic)'
    }]
  },
  {
    id: 'SKILL-GEN0161-005',
    canonicalName: 'Evaluate thermodynamic properties of pure substances using steam tables and phase diagrams',
    description: 'Look up and interpolate specific volume, enthalpy, and entropy across compressed liquid, saturated mixture, and superheated vapor states using quality x = (y - y_f) / y_fg.',
    skillType: 'INTERPRETATION',
    dominantCompetency: 'INTERPRET',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0161',
    parentTopicId: 'CURR-GEN0161-U2-T06',
    parentSubtopicIds: ['SUB-GEN0161-U2-T06-S1', 'SUB-GEN0161-U2-T06-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0161-001'],
    masteryEvidence: [
      'Determines state phase (subcooled, saturated, superheated) by comparing given T or P against saturation values T_sat, P_sat.',
      'Computes mixture properties y = y_f + x*y_fg using vapor quality x.',
      'Performs linear interpolation between steam table rows accurately.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'INTERPRETATION'],
    difficultyFactors: ['Double linear interpolation in superheat tables', 'Constant-enthalpy throttling into wet mixture region'],
    engineeringContext: 'Steam boiler drums, steam turbine inlets, refrigeration evaporator coils.',
    associatedOutcomeIds: ['LLO2'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Properties of Pure Substance, Evaluate the thermodynamic properties of pure substances across different phases'
    }]
  },
  {
    id: 'SKILL-GEN0161-006',
    canonicalName: 'Calculate thermal efficiency, coefficient of performance, and entropy changes using the Second Law',
    description: 'Apply Carnot efficiency eta_th,rev = 1 - T_L/T_H, COP_heatpump = 1 / (1 - T_L/T_H), and calculate entropy change delta_S = int dQ/T.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0161',
    parentTopicId: 'CURR-GEN0161-U3-T07',
    parentSubtopicIds: ['SUB-GEN0161-U3-T07-S1', 'SUB-GEN0161-U3-T07-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0161-002', 'SKILL-GEN0161-004'],
    masteryEvidence: [
      'Calculates maximum theoretical thermal efficiency given reservoir temperatures in Kelvin.',
      'Evaluates entropy generation S_gen >= 0 to determine process feasibility.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MCQ_RECOGNITION'],
    difficultyFactors: ['Clausius inequality integration', 'Isentropic turbine and compressor efficiencies eta_t = W_actual / W_isentropic'],
    engineeringContext: 'Power plant thermal discharge limits, industrial heat pump COP optimization.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Second Law of Thermodynamics, evaluate the performance and entropy changes of heat engines'
    }]
  },
  {
    id: 'SKILL-GEN0161-007',
    canonicalName: 'Analyze the Ideal Rankine vapor power cycle and compute thermal efficiency',
    description: 'Analyze 4-state Rankine cycle (1: pump, 2: boiler, 3: turbine, 4: condenser), determine enthalpies h1, h2, h3, h4, and calculate eta = (w_turb - w_pump) / q_in.',
    skillType: 'APPLICATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_EXPLICIT',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0161',
    parentTopicId: 'CURR-GEN0161-U3-T08',
    parentSubtopicIds: ['SUB-GEN0161-U3-T08-S1'],
    prerequisiteSkillIds: ['SKILL-GEN0161-005', 'SKILL-GEN0161-006'],
    masteryEvidence: [
      'Draws T-s diagram of Rankine cycle showing isobaric boiler/condenser and isentropic pump/turbine lines.',
      'Calculates net power output W_net = m_dot * (w_t - w_p) and cycle thermal efficiency.'
    ],
    evidenceTypes: ['MULTI_STEP_SOLUTION', 'DIRECT_CALCULATION'],
    difficultyFactors: ['Turbine exhaust moisture content limit (x4 > 0.88)', 'Pump work approximation w_p = v1*(P2 - P1)'],
    engineeringContext: 'Coal, natural gas, and nuclear steam turbine power plants.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Introduction to Gas and Vapor Cycles, Identify the core components of basic gas and vapor power cycles (such as the Ideal Rankine cycle)'
    }]
  },
  {
    id: 'SKILL-GEN0161-008',
    canonicalName: 'Analyze reheat and regenerative modifications to vapor power cycles',
    description: 'Evaluate open/closed feedwater heater mass extraction fractions (y) and reheat stages to compute improved thermal efficiency in modified Rankine cycles.',
    skillType: 'MODELING',
    dominantCompetency: 'MODEL',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-GEN0161',
    parentTopicId: 'CURR-GEN0161-U3-T08',
    parentSubtopicIds: ['SUB-GEN0161-U3-T08-S2', 'SUB-GEN0161-U3-T08-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0161-007'],
    masteryEvidence: [
      'Performs energy balance on open feedwater heater to compute extraction fraction y = (h_out - h_in) / (h_bleed - h_in).',
      'Calculates multi-stage net work and thermal efficiency improvements.'
    ],
    evidenceTypes: ['MULTI_STEP_SOLUTION', 'DIRECT_CALCULATION'],
    difficultyFactors: ['Multiple bleed extraction stages (2+ feedwater heaters)', 'Reheat pressure optimization'],
    engineeringContext: 'Supercritical modern utility power generation plants, cogeneration facilities.',
    associatedOutcomeIds: ['LLO3'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Introduction to Gas and Vapor Cycles, Reheat and Regenerative Rankine Cycle'
    }]
  },

  // =========================================================================
  // COURSE: BSIE 3219 (IE Special Topics 1)
  // =========================================================================
  {
    id: 'SKILL-BSIE3219-001',
    canonicalName: 'Perform matrix operations, determinants, and matrix inverses for engineering systems',
    description: 'Add, multiply matrices, compute 2x2 and 3x3 determinants, and solve matrix equations A*X = B via Cramer\'s rule and matrix inverses.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U1-T01',
    parentSubtopicIds: ['SUB-BSIE3219-U1-T01-S4'],
    prerequisiteSkillIds: ['SKILL-GEN0101-009'],
    masteryEvidence: [
      'Computes matrix product A*B (checking dimension compatibility).',
      'Evaluates 3x3 determinant using cofactor expansion or Sarrus\' rule.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION'],
    difficultyFactors: ['3x3 matrix inverse formula A^(-1) = adj(A)/det(A)', 'Singular determinant conditions det(A) = 0'],
    associatedOutcomeIds: ['CILO-01'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Fundamentals of Algebra, Equations, and Matrices (Covers: Significant Figures, Factoring, Laws of Exponents, Linear/Quadratic/Cubic/Quartic Equations, and Matrices)'
    }]
  },
  {
    id: 'SKILL-BSIE3219-002',
    canonicalName: 'Perform operations on complex numbers and vector algebra',
    description: 'Add, multiply, and divide complex numbers in rectangular (a + bi) and polar (r cis theta) form; compute vector dot and cross products.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U1-T02',
    parentSubtopicIds: ['SUB-BSIE3219-U1-T02-S1', 'SUB-BSIE3219-U1-T02-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0101-008', 'SKILL-GEN0101-013'],
    masteryEvidence: [
      'Converts complex numbers between rectangular and polar form using r = sqrt(a^2 + b^2) and theta = arctan(b/a).',
      'Applies De Moivre\'s theorem to compute powers and roots of complex numbers.',
      'Computes vector dot product A.B and cross product A x B.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'SYMBOLIC_DERIVATION'],
    difficultyFactors: ['Complex number division requiring conjugate multiplication', '3D vector cross product components'],
    associatedOutcomeIds: ['CILO-01'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Complex Numbers, Vectors, and Applied Problem-Solving'
    }]
  },
  {
    id: 'SKILL-BSIE3219-003',
    canonicalName: 'Solve combinatorics, permutations, combinations, and progression series problems',
    description: 'Apply P(n, r) = n!/(n-r)!, C(n, r) = n!/(r!(n-r)!), Binomial Theorem, and arithmetic/geometric progression formulas (a_n, S_n, S_inf).',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U1-T03',
    parentSubtopicIds: ['SUB-BSIE3219-U1-T03-S1', 'SUB-BSIE3219-U1-T03-S3', 'SUB-BSIE3219-U1-T03-S4'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001'],
    masteryEvidence: [
      'Distinguishes order-dependent permutation scenarios from order-independent combinations.',
      'Finds designated kth term in binomial expansion (a + b)^n.',
      'Computes infinite geometric series sum S_inf = a / (1 - r) for |r| < 1.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Permutations with repeated identical elements', 'Harmonic progression term interpolation'],
    associatedOutcomeIds: ['CILO-01'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Advanced Algebra, Combinatorics, and Progressions (Covers: Binomial Theorem, Partial Fractions, Permutations, Combinations, and Progressions)'
    }]
  },
  {
    id: 'SKILL-BSIE3219-004',
    canonicalName: 'Analyze conic sections equations (Circles, Parabolas, Ellipses, Hyperbolas)',
    description: 'Determine center, vertices, foci, directrices, asymptotes, and eccentricity for conic sections from general quadratic equations Ax^2 + Cy^2 + Dx + Ey + F = 0.',
    skillType: 'INTERPRETATION',
    dominantCompetency: 'INTERPRET',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U2-T05',
    parentSubtopicIds: ['SUB-BSIE3219-U2-T05-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0101-012', 'SKILL-GEN0101-008'],
    masteryEvidence: [
      'Completes the square to convert general second-degree equations into standard conic forms.',
      'Identifies conic type based on discriminant B^2 - 4AC (or A*C sign when B=0).'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MCQ_RECOGNITION'],
    difficultyFactors: ['Hyperbola slant asymptotes y - k = +- (b/a)(x - h)', 'Rotated conics with Bxy cross term'],
    associatedOutcomeIds: ['CILO-02'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Analytic Geometry and Conic Sections (Covers: Straight Lines, Circles, Parabolas, Ellipses, Hyperbolas, Inclined Axes, and Solid Geometry)'
    }]
  },
  {
    id: 'SKILL-BSIE3219-005',
    canonicalName: 'Apply definite integration to compute plane areas and volumes of revolution (Disk and Ring methods)',
    description: 'Set up single integrals A = int (y_top - y_bottom) dx and volume of revolution formulas V = pi * int (R^2 - r^2) dx.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U3-T07',
    parentSubtopicIds: ['SUB-BSIE3219-U3-T07-S1', 'SUB-BSIE3219-U3-T07-S2'],
    prerequisiteSkillIds: ['SKILL-GEN0102-002', 'SKILL-GEN0101-008'],
    masteryEvidence: [
      'Finds bounding curve intersection points to establish definite integral limits [a, b].',
      'Selects disk method vs washer/ring method based on axis of revolution.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Revolutions around non-origin offset lines (e.g. y = -2 or x = 4)', 'Integration requiring trigonometric substitution'],
    engineeringContext: 'Mechanical flywheel mass moments, hydraulic reservoir storage volumes.',
    associatedOutcomeIds: ['CILO-03'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Integral Calculus and Introductory Engineering Economy (Covers: Integration Formulas, Plane Areas, Volumes of Revolution via Disk & Ring Methods)'
    }]
  },
  {
    id: 'SKILL-BSIE3219-006',
    canonicalName: 'Calculate simple interest, compound interest, nominal and effective interest rates',
    description: 'Apply F = P(1 + in), F = P(1 + i)^n, and effective rate i_eff = (1 + r/m)^m - 1 to solve time-value-of-money investment scenarios.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U3-T07',
    parentSubtopicIds: ['SUB-BSIE3219-U3-T07-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-001', 'SKILL-GEN0101-011'],
    masteryEvidence: [
      'Converts nominal annual interest rates r compounded m times/year into effective annual rates.',
      'Computes present worth P given future worth F, compound interest rate i, and periods n.'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'WORD_PROBLEM'],
    difficultyFactors: ['Continuous compounding F = P*e^(rt)', 'Mixed compounding frequencies (monthly vs quarterly)'],
    engineeringContext: 'Capital project financing, equipment loan interest comparison.',
    associatedOutcomeIds: ['CILO-03'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Simple & Compound Interest, and Nominal & Effective Rates'
    }]
  },
  {
    id: 'SKILL-BSIE3219-007',
    canonicalName: 'Evaluate ordinary annuities, uniform gradient cash flows, and breakeven production points',
    description: 'Apply annuity present worth P = A * [(1 - (1+i)^(-n))/i] and future worth formulas, gradient factors (P/G, i, n), and calculate production breakeven volume Q_be = FC / (P - VC).',
    skillType: 'APPLICATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U3-T08',
    parentSubtopicIds: ['SUB-BSIE3219-U3-T08-S1', 'SUB-BSIE3219-U3-T08-S2'],
    prerequisiteSkillIds: ['SKILL-BSIE3219-006', 'SKILL-GEN0101-005'],
    masteryEvidence: [
      'Computes equal periodic annual payments A needed to amortize a capital debt.',
      'Calculates present worth of arithmetic gradient maintenance cash flows G.',
      'Determines breakeven sales quantity where Total Revenue equals Total Cost.'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Deferred annuities with multi-year payment grace periods', 'Geometric gradient cash flows with inflation rate g'],
    engineeringContext: 'Manufacturing line payback analysis, equipment replacement scheduling, production breakeven.',
    associatedOutcomeIds: ['CILO-03'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Advanced Cash Flow Analysis and Depreciation (Covers: Continuous Compounding & Decreasing Value, Breakeven Analysis, Annuities, Uniform Gradient Cash Flow)'
    }]
  },
  {
    id: 'SKILL-BSIE3219-008',
    canonicalName: 'Calculate asset depreciation schedules using Straight Line, Sinking Fund, Declining Balance, and Sum-of-the-Years-Digits methods',
    description: 'Compute annual depreciation d_t and book value BV_t across standard asset depreciation methods.',
    skillType: 'CALCULATION',
    dominantCompetency: 'DO',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U3-T08',
    parentSubtopicIds: ['SUB-BSIE3219-U3-T08-S3'],
    prerequisiteSkillIds: ['SKILL-BSIE3219-006', 'SKILL-GEN0101-001'],
    masteryEvidence: [
      'Applies Straight Line formula d = (FC - SV) / n.',
      'Computes Declining Balance depreciation rate k = 1 - (SV/FC)^(1/n) and SYD multiplier (n - t + 1) / [n(n+1)/2].'
    ],
    evidenceTypes: ['DIRECT_CALCULATION', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Double Declining Balance (DDB) rate 2/n with salvage value floor cap', 'Mid-year asset acquisition pro-rating'],
    engineeringContext: 'Industrial equipment tax depreciation, machinery salvage valuation.',
    associatedOutcomeIds: ['CILO-03'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Depreciation'
    }]
  },
  {
    id: 'SKILL-BSIE3219-009',
    canonicalName: 'Perform project economic evaluations using Capital Recovery, Capitalized Cost, and Benefit-to-Cost ratios',
    description: 'Compute Capitalized Cost CC = FC + A/i, Annual Worth AW = PW*(A/P, i, n), and evaluate project viability using B/C = (B - D) / C >= 1.0.',
    skillType: 'APPLICATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U3-T09',
    parentSubtopicIds: ['SUB-BSIE3219-U3-T09-S1'],
    prerequisiteSkillIds: ['SKILL-BSIE3219-007'],
    masteryEvidence: [
      'Calculates infinite-horizon capitalized cost for permanent public works projects.',
      'Selects mutually exclusive engineering alternatives based on incremental B/C ratio delta_B / delta_C.'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Incremental B/C analysis between 3+ mutually exclusive alternatives', 'Disbenefit accounting in numerator vs cost in denominator'],
    engineeringContext: 'Public infrastructure economic justification, industrial equipment capital expenditure approval.',
    associatedOutcomeIds: ['CILO-03'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Economic Evaluation Methods and Applied Mechanics (Covers: Capital Recovery, Capitalized Cost, Bond Value Equations, Annual Cost & Benefit-To-Cost Ratios)'
    }]
  },
  {
    id: 'SKILL-BSIE3219-010',
    canonicalName: 'Analyze statics equilibrium, friction, and kinematics motion (Rectilinear, Projectile, Circular)',
    description: 'Solve 2D particle/rigid body equilibrium sum(F)=0, sum(M)=0, friction force F_f <= mu*N, and kinematics equations v = v0 + at, s = v0*t + 0.5*a*t^2, a_c = v^2/r.',
    skillType: 'APPLICATION',
    dominantCompetency: 'APPLY',
    sourceType: 'SYLLABUS_DERIVED',
    role: 'PRIMARY',
    parentCourseId: 'COURSE-BSIE3219',
    parentTopicId: 'CURR-BSIE3219-U3-T09',
    parentSubtopicIds: ['SUB-BSIE3219-U3-T09-S2', 'SUB-BSIE3219-U3-T09-S3'],
    prerequisiteSkillIds: ['SKILL-GEN0101-013', 'SKILL-BSIE3219-002'],
    masteryEvidence: [
      'Draws complete Free Body Diagram (FBD) resolving forces into orthogonal components.',
      'Solves projectile motion trajectories separating horizontal constant velocity and vertical gravitational acceleration.',
      'Computes centripetal acceleration and required friction force on banked/unbanked roadway curves.'
    ],
    evidenceTypes: ['WORD_PROBLEM', 'MULTI_STEP_SOLUTION'],
    difficultyFactors: ['Impending slipping on inclined planes with friction', 'Projectile launched onto inclined terrain'],
    engineeringContext: 'Material handling conveyor belt friction, robotic arm static torque equilibrium, vehicle braking distance.',
    associatedOutcomeIds: ['CILO-03'],
    status: 'APPROVED',
    sourceReferences: [{
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Statics & Friction, and Rectilinear/Free-Falling/Circular/Projectile Motion'
    }]
  }
];
