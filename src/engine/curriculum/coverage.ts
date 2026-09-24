import { CurriculumUnit, CurriculumTopic } from './types';

export const AUTHORITATIVE_UNITS: CurriculumUnit[] = [
  // --- GEN 0101 (Math for Engineers) ---
  {
    id: 'UNIT-GEN0101-U1',
    courseId: 'COURSE-GEN0101',
    sequence: 1,
    period: 'PRELIM',
    officialName: 'Arithmetic, Algebraic Fluency & Applied Word Problems',
    normalizedName: 'Arithmetic, Algebraic Fluency, and Applied Word Problems',
    totalHours: 15,
    learningOutcomesSummary: 'Operations on real numbers, fractions, decimals, percentage, ratio, basic algebra, exponent laws, and applied word problems.',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Rows 1-6',
      rawTextExtract: 'Arithmetic and Algebraic Fluency; Applied Word Problems'
    }
  },
  {
    id: 'UNIT-GEN0101-U2',
    courseId: 'COURSE-GEN0101',
    sequence: 2,
    period: 'MIDTERM',
    officialName: 'Equations, Systems, Functions and Coordinate Geometry',
    normalizedName: 'Equations, Systems, Functions, and Models',
    totalHours: 15,
    learningOutcomesSummary: 'Polynomial equations & inequalities, linear/non-linear systems, functions & mathematical models, exponential & logarithmic functions.',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Rows 8-11',
      rawTextExtract: 'Polynomial Equations and Inequalities; Linear and Non-Linear Systems; Functions and Coordinate Geometry'
    }
  },
  {
    id: 'UNIT-GEN0101-U3',
    courseId: 'COURSE-GEN0101',
    sequence: 3,
    period: 'FINAL',
    officialName: 'Rectangular Coordinates, Trigonometry and Mensuration',
    normalizedName: 'Rectangular Coordinates, Trigonometry, and Solid Mensuration',
    totalHours: 15,
    learningOutcomesSummary: 'Rectangular coordinates, equations of lines, right triangle trigonometry, engineering trigonometry, oblique triangles, and plane areas of solid mensuration.',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Rows 13-18',
      rawTextExtract: 'Rectangular Coordinates; Equation of a Line; Trigonometry and Geometric Areas; Oblique Triangles; Plane Areas of Solid Mensuration'
    }
  },

  // --- GEN 0102 (Calculus 1) ---
  {
    id: 'UNIT-GEN0102-U1',
    courseId: 'COURSE-GEN0102',
    sequence: 1,
    period: 'PRELIM',
    officialName: 'Limits, Continuity & Differentiation Methods',
    normalizedName: 'Foundations of Calculus, Limits, and Differentiation Methods',
    totalHours: 15,
    learningOutcomesSummary: 'Introduction to calculus, limits, continuity, evaluating limits, product/quotient/chain differentiation rules.',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Introduction to Calculus, Limits & Continuity Concepts, Evaluating Limits, Analysis of Calculus Methods'
    }
  },
  {
    id: 'UNIT-GEN0102-U2',
    courseId: 'COURSE-GEN0102',
    sequence: 2,
    period: 'MIDTERM',
    officialName: 'Transcendental Derivatives, Implicit & Higher-Order Differentiation',
    normalizedName: 'Transcendental Derivatives, Implicit, and Higher-Order Differentiation',
    totalHours: 15,
    learningOutcomesSummary: 'Derivatives of inverse trigonometric, hyperbolic, logarithmic, exponential functions; implicit & partial differentiation; higher order derivatives.',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Derivatives of Inverse Trigonometric Functions, Derivatives of Hyperbolic Functions, Derivatives of Logarithmic and Exponential Functions, Implicit Differentiation, Partial Differentiation, Higher order derivatives'
    }
  },
  {
    id: 'UNIT-GEN0102-U3',
    courseId: 'COURSE-GEN0102',
    sequence: 3,
    period: 'FINAL',
    officialName: 'Geometric Properties & Applications of Derivatives',
    normalizedName: 'Geometric Analysis, Curve Sketching, and Derivative Applications',
    totalHours: 15,
    learningOutcomesSummary: 'Slope analysis, polynomial curves, maxima/minima optimization, and related rates.',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'The slope, Polynomial curves, Applications of the Derivative(Maxima, minima, related rates)'
    }
  },

  // --- GEN 0107 (Differential Equations) ---
  {
    id: 'UNIT-GEN0107-U1',
    courseId: 'COURSE-GEN0107',
    sequence: 1,
    period: 'PRELIM',
    officialName: 'Classification, Arbitrary Constants & Variable Separation',
    normalizedName: 'DE Classification, Elimination of Constants, and Variable Separation',
    totalHours: 15,
    learningOutcomesSummary: 'Classification of DEs, elimination of arbitrary constants, variable separable ODE solutions.',
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Classification of Differential Equations, Elimination of Arbitrary Constant, Variable Separable'
    }
  },
  {
    id: 'UNIT-GEN0107-U2',
    courseId: 'COURSE-GEN0107',
    sequence: 2,
    period: 'MIDTERM',
    officialName: 'First-Order Differential Equations and Applications',
    normalizedName: 'First-Order Differential Equations and Engineering Applications',
    totalHours: 15,
    learningOutcomesSummary: 'Homogeneous linear DEs, exact DEs, linear 1st order DEs, Bernoulli DEs, physical applications.',
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Homogeneous Linear Differential Equation with and without Constant Coefficients, Exact Differential Equation of Order one, Linear Differential Equation of Order one, Bernoulli Differential Equation of Order one, Application of 1st Order Differential Equations'
    }
  },
  {
    id: 'UNIT-GEN0107-U3',
    courseId: 'COURSE-GEN0107',
    sequence: 3,
    period: 'FINAL',
    officialName: 'Laplace Transforms and Systems of Linear Differential Equations',
    normalizedName: 'Laplace Transforms, Systems of DEs, and Inverse Transforms',
    totalHours: 15,
    learningOutcomesSummary: 'Laplace transform solutions of IVPs, simultaneous systems of DEs, inverse Laplace transforms.',
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Solution of Systems of Linear Differential Equation with Initial Values/Simultaneous Solution to DE (Laplace Transform Method), Inverse Laplace Transforms of Functions'
    }
  },

  // --- GEN 0110 (Physics 2 for Engineers) ---
  {
    id: 'UNIT-GEN0110-U1',
    courseId: 'COURSE-GEN0110',
    sequence: 1,
    period: 'PRELIM',
    officialName: 'Fluids, Heat Transfer and Thermal Expansion',
    normalizedName: 'Fluid Mechanics, Heat Transfer, and Thermal Expansion',
    totalHours: 20,
    learningOutcomesSummary: 'Fluid mechanics, heat transfer mechanisms, calorimetry, thermal expansion & thermal stress.',
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Fluid Mechanics, Heat Transfer, heat measurements, Thermal Expansion'
    }
  },
  {
    id: 'UNIT-GEN0110-U2',
    courseId: 'COURSE-GEN0110',
    sequence: 2,
    period: 'MIDTERM',
    officialName: 'Wave Mechanics, Sound Waves and Electrostatics',
    normalizedName: 'Acoustics, Wave Mechanics, and Electrostatics',
    totalHours: 9,
    learningOutcomesSummary: 'Sound waves, transverse waves, electrostatics (Coulombs law, Gauss law, potential).',
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Sound waves, Transverse Waves, Eletrostartics'
    }
  },
  {
    id: 'UNIT-GEN0110-U3',
    courseId: 'COURSE-GEN0110',
    sequence: 3,
    period: 'FINAL',
    officialName: 'Electricity, Optics and Special Relativity',
    normalizedName: 'Electric Circuits, Optics, and Special Relativity',
    totalHours: 15,
    learningOutcomesSummary: 'DC/AC circuits, geometric and physical optics, postulates of special relativity.',
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Electricity, Optics, Special Relativity'
    }
  },

  // --- GEN 0161 (Thermodynamics) ---
  {
    id: 'UNIT-GEN0161-U1',
    courseId: 'COURSE-GEN0161',
    sequence: 1,
    period: 'PRELIM',
    officialName: 'Foundations of Thermodynamics and the First Law',
    normalizedName: 'Thermodynamic Principles, Systems, and the First Law',
    totalHours: 15,
    learningOutcomesSummary: 'Course scope, thermodynamic definitions, closed/open systems, First Law energy balances.',
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Introduction /Orientation, Basic Principles, Concept and Definition of thermodynamics, First Law of Thermodynamics'
    }
  },
  {
    id: 'UNIT-GEN0161-U2',
    courseId: 'COURSE-GEN0161',
    sequence: 2,
    period: 'MIDTERM',
    officialName: 'Ideal Gases, Gas Processes and Pure Substances',
    normalizedName: 'Ideal Gases, Processes, and Properties of Pure Substances',
    totalHours: 15,
    learningOutcomesSummary: 'Ideal gas laws, thermodynamic processes (isobaric, isochoric, isothermal, isentropic, polytropic), pure substances.',
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Ideal Gases / Ideal gas Laws, Processes of Ideal Gases, Properties of Pure Substance'
    }
  },
  {
    id: 'UNIT-GEN0161-U3',
    courseId: 'COURSE-GEN0161',
    sequence: 3,
    period: 'FINAL',
    officialName: 'The Second Law of Thermodynamics and Power Cycles',
    normalizedName: 'Second Law of Thermodynamics, Entropy, and Power Cycles',
    totalHours: 15,
    learningOutcomesSummary: 'Second Law, heat engines, entropy, introduction to gas and vapor power cycles (Rankine).',
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Introduction to cycle analysis: Second Law of Thermodynamics, Introduction to Gas and Vapor Cycles'
    }
  },

  // --- BSIE 3219 (IE Special Topics 1) ---
  {
    id: 'UNIT-BSIE3219-U1',
    courseId: 'COURSE-BSIE3219',
    sequence: 1,
    period: 'PRELIM',
    officialName: 'Advanced Algebra, Complex Numbers, Vectors & Progressions',
    normalizedName: 'Advanced Algebra, Vectors, Combinatorics, and Progressions',
    totalHours: 15,
    learningOutcomesSummary: 'Algebra fundamentals, equations & matrices, complex numbers & vectors, combinatorics, and progressions.',
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Fundamentals of Algebra, Equations, and Matrices; Complex Numbers, Vectors, and Applied Problem-Solving; Advanced Algebra, Combinatorics, and Progressions'
    }
  },
  {
    id: 'UNIT-BSIE3219-U2',
    courseId: 'COURSE-BSIE3219',
    sequence: 2,
    period: 'MIDTERM',
    officialName: 'Trigonometry, Analytic Geometry & Differential Calculus',
    normalizedName: 'Geometry, Conics, and Differential Calculus Foundations',
    totalHours: 15,
    learningOutcomesSummary: 'Trigonometry, logarithms, geometry, conic sections, limits, and differential calculus applications.',
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Trigonometry, Logarithms, and Basic Geometry; Analytic Geometry and Conic Sections; Fundamentals and Applications of Differential Calculus'
    }
  },
  {
    id: 'UNIT-BSIE3219-U3',
    courseId: 'COURSE-BSIE3219',
    sequence: 3,
    period: 'FINAL',
    officialName: 'Integral Calculus, Engineering Economy & Applied Mechanics',
    normalizedName: 'Integral Calculus, Engineering Economy, and Applied Mechanics',
    totalHours: 15,
    learningOutcomesSummary: 'Integral calculus, time value of money, cash flow & depreciation, economic evaluations, statics and dynamics.',
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Integral Calculus and Introductory Engineering Economy; Advanced Cash Flow Analysis and Depreciation; Economic Evaluation Methods and Applied Mechanics'
    }
  }
];

export const AUTHORITATIVE_TOPICS: CurriculumTopic[] = [
  // =========================================================================
  // COURSE: GEN 0101 (Mathematics for Engineers)
  // =========================================================================
  {
    id: 'CURR-GEN0101-U1-T01',
    unitId: 'UNIT-GEN0101-U1',
    courseId: 'COURSE-GEN0101',
    sequence: 1,
    officialName: 'Operations on Numbers',
    normalizedName: 'Real Number Operations and Prime Factorization',
    hours: 2,
    period: 'PRELIM',
    associatedLLOs: ['LLO1'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Operations on Numbers: Fundamental operations on real numbers, Order of operations, Prime numbers, Prime factorization'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U1-T01-S1', topicId: 'CURR-GEN0101-U1-T01', sequence: 1, officialName: 'Fundamental operations on real numbers', normalizedName: 'Fundamental Real Number Operations', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T01-S2', topicId: 'CURR-GEN0101-U1-T01', sequence: 2, officialName: 'Order of operations', normalizedName: 'Order of Operations', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T01-S3', topicId: 'CURR-GEN0101-U1-T01', sequence: 3, officialName: 'Prime numbers', normalizedName: 'Prime Numbers', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T01-S4', topicId: 'CURR-GEN0101-U1-T01', sequence: 4, officialName: 'Prime factorization', normalizedName: 'Prime Factorization', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U1-T02',
    unitId: 'UNIT-GEN0101-U1',
    courseId: 'COURSE-GEN0101',
    sequence: 2,
    officialName: 'Fractions and Decimal Fractions',
    normalizedName: 'Fractions, Decimals, and Conversions',
    hours: 2,
    period: 'PRELIM',
    associatedLLOs: ['LLO2'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 2',
      rawTextExtract: 'Fractions and Decimal Fractions: Review of fractions and decimal numbers, Conversion between fractions and decimals, Operations on fractions and decimal numbers'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U1-T02-S1', topicId: 'CURR-GEN0101-U1-T02', sequence: 1, officialName: 'Review of fractions and decimal numbers', normalizedName: 'Fraction and Decimal Review', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T02-S2', topicId: 'CURR-GEN0101-U1-T02', sequence: 2, officialName: 'Conversion between fractions and decimals', normalizedName: 'Fraction-Decimal Conversions', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T02-S3', topicId: 'CURR-GEN0101-U1-T02', sequence: 3, officialName: 'Operations on fractions and decimal numbers', normalizedName: 'Arithmetic on Fractions and Decimals', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U1-T03',
    unitId: 'UNIT-GEN0101-U1',
    courseId: 'COURSE-GEN0101',
    sequence: 3,
    officialName: 'Percentage, Ratio, and Proportion',
    normalizedName: 'Percentage, Ratio, Proportion, and Variation',
    hours: 2,
    period: 'PRELIM',
    associatedLLOs: ['LLO3'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Percentage, Ratio, and Proportion: Percentage, Ratio and proportion, Direct and inverse variation'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U1-T03-S1', topicId: 'CURR-GEN0101-U1-T03', sequence: 1, officialName: 'Percentage', normalizedName: 'Percentages and Applications', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T03-S2', topicId: 'CURR-GEN0101-U1-T03', sequence: 2, officialName: 'Ratio and proportion', normalizedName: 'Ratios and Proportions', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T03-S3', topicId: 'CURR-GEN0101-U1-T03', sequence: 3, officialName: 'Direct and inverse variation', normalizedName: 'Direct and Inverse Variation', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U1-T04',
    unitId: 'UNIT-GEN0101-U1',
    courseId: 'COURSE-GEN0101',
    sequence: 4,
    officialName: 'Basic Algebra: Fundamentals',
    normalizedName: 'Algebraic Expressions, Factorization, and Transposition',
    hours: 4,
    period: 'PRELIM',
    associatedLLOs: ['LLO4'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 4',
      rawTextExtract: 'Basic Algebra: Fundamentals: Mathematical notation and symbols, Algebraic expressions, Simplification, Factorization, Formula substitution, Formulae and transposition'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U1-T04-S1', topicId: 'CURR-GEN0101-U1-T04', sequence: 1, officialName: 'Mathematical notation and symbols', normalizedName: 'Mathematical Notation', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T04-S2', topicId: 'CURR-GEN0101-U1-T04', sequence: 2, officialName: 'Algebraic expressions & Simplification', normalizedName: 'Algebraic Expression Simplification', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T04-S3', topicId: 'CURR-GEN0101-U1-T04', sequence: 3, officialName: 'Factorization', normalizedName: 'Polynomial Factorization', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T04-S4', topicId: 'CURR-GEN0101-U1-T04', sequence: 4, officialName: 'Formula substitution and transposition', normalizedName: 'Formula Substitution and Transposition', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U1-T05',
    unitId: 'UNIT-GEN0101-U1',
    courseId: 'COURSE-GEN0101',
    sequence: 5,
    officialName: 'Basic Algebra: Laws of Exponents',
    normalizedName: 'Laws of Exponents and Engineering Applications',
    hours: 2,
    period: 'PRELIM',
    associatedLLOs: ['LLO5'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Basic Algebra: Laws of Exponents: Positive and negative exponents, Zero and fractional exponents, Laws of exponents, Introduction to engineering applications'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U1-T05-S1', topicId: 'CURR-GEN0101-U1-T05', sequence: 1, officialName: 'Positive and negative exponents', normalizedName: 'Positive and Negative Exponents', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T05-S2', topicId: 'CURR-GEN0101-U1-T05', sequence: 2, officialName: 'Zero and fractional exponents', normalizedName: 'Zero and Fractional Exponents', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T05-S3', topicId: 'CURR-GEN0101-U1-T05', sequence: 3, officialName: 'Laws of exponents', normalizedName: 'Exponent Laws', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U1-T06',
    unitId: 'UNIT-GEN0101-U1',
    courseId: 'COURSE-GEN0101',
    sequence: 6,
    officialName: 'Applied Word Problems',
    normalizedName: 'Algebraic Word Problems',
    hours: 3,
    period: 'PRELIM',
    associatedLLOs: ['LLO6'],
    canonicalTopicId: 'TOP-DICT-008',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 6',
      rawTextExtract: 'Applied Word Problems: Age problems, Work problems, Rate and distance problems, Mixture problems, Clock and time problems'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U1-T06-S1', topicId: 'CURR-GEN0101-U1-T06', sequence: 1, officialName: 'Age problems', normalizedName: 'Age Problems', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T06-S2', topicId: 'CURR-GEN0101-U1-T06', sequence: 2, officialName: 'Work problems', normalizedName: 'Work Problems', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T06-S3', topicId: 'CURR-GEN0101-U1-T06', sequence: 3, officialName: 'Rate and distance problems', normalizedName: 'Rate, Uniform Motion, and Distance', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T06-S4', topicId: 'CURR-GEN0101-U1-T06', sequence: 4, officialName: 'Mixture problems', normalizedName: 'Mixture and Solution Problems', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U1-T06-S5', topicId: 'CURR-GEN0101-U1-T06', sequence: 5, officialName: 'Clock and time problems', normalizedName: 'Clock and Time Problems', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U2-T07',
    unitId: 'UNIT-GEN0101-U2',
    courseId: 'COURSE-GEN0101',
    sequence: 7,
    officialName: 'Polynomial Equations and Inequalities',
    normalizedName: 'Polynomial Equations and Inequalities',
    hours: 4,
    period: 'MIDTERM',
    associatedLLOs: ['LLO7'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 8',
      rawTextExtract: 'Polynomial Equations and Inequalities: Solving linear equations, Solving quadratic equations, Factoring polynomial expressions, Solving polynomial equations, Solving linear and polynomial inequalities'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U2-T07-S1', topicId: 'CURR-GEN0101-U2-T07', sequence: 1, officialName: 'Solving linear equations', normalizedName: 'Linear Equations', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U2-T07-S2', topicId: 'CURR-GEN0101-U2-T07', sequence: 2, officialName: 'Solving quadratic equations', normalizedName: 'Quadratic Equations and Quadratic Formula', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U2-T07-S3', topicId: 'CURR-GEN0101-U2-T07', sequence: 3, officialName: 'Solving polynomial equations', normalizedName: 'Higher-Degree Polynomial Equations', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U2-T07-S4', topicId: 'CURR-GEN0101-U2-T07', sequence: 4, officialName: 'Solving linear and polynomial inequalities', normalizedName: 'Linear and Polynomial Inequalities', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U2-T08',
    unitId: 'UNIT-GEN0101-U2',
    courseId: 'COURSE-GEN0101',
    sequence: 8,
    officialName: 'Linear and Non-Linear Systems',
    normalizedName: 'Linear and Non-Linear Systems of Equations',
    hours: 4,
    period: 'MIDTERM',
    associatedLLOs: ['LLO8'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 9',
      rawTextExtract: 'Linear and Non-Linear Systems: Systems of linear equations, Substitution method, Elimination method, Graphical method, Introduction to non-linear systems'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U2-T08-S1', topicId: 'CURR-GEN0101-U2-T08', sequence: 1, officialName: 'Systems of linear equations', normalizedName: 'Linear Systems of Equations', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U2-T08-S2', topicId: 'CURR-GEN0101-U2-T08', sequence: 2, officialName: 'Substitution and Elimination methods', normalizedName: 'Algebraic Methods (Substitution, Elimination)', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U2-T08-S3', topicId: 'CURR-GEN0101-U2-T08', sequence: 3, officialName: 'Introduction to non-linear systems', normalizedName: 'Non-Linear Systems of Equations', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U2-T09',
    unitId: 'UNIT-GEN0101-U2',
    courseId: 'COURSE-GEN0101',
    sequence: 9,
    officialName: 'Functions and Mathematical Models',
    normalizedName: 'Functions, Graphs, and Inverses',
    hours: 4,
    period: 'MIDTERM',
    associatedLLOs: ['LLO9'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 10',
      rawTextExtract: 'Functions and Coordinate Geometry: Basic concept of functions, Function notation, Domain and range, Graphs of functions, Composition of functions, One-to-one functions, Inverse functions, Parametric representation'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U2-T09-S1', topicId: 'CURR-GEN0101-U2-T09', sequence: 1, officialName: 'Function concept, notation, domain and range', normalizedName: 'Function Notation, Domain, and Range', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U2-T09-S2', topicId: 'CURR-GEN0101-U2-T09', sequence: 2, officialName: 'Composition of functions', normalizedName: 'Function Composition', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U2-T09-S3', topicId: 'CURR-GEN0101-U2-T09', sequence: 3, officialName: 'Inverse functions and parametric representation', normalizedName: 'Inverse Functions and Parametrics', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U2-T10',
    unitId: 'UNIT-GEN0101-U2',
    courseId: 'COURSE-GEN0101',
    sequence: 10,
    officialName: 'Logarithmic and Exponential Functions and Applications',
    normalizedName: 'Exponential and Logarithmic Functions and Equations',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO10'],
    canonicalTopicId: 'TOP-DICT-007',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 11',
      rawTextExtract: 'Logarithmic and Exponential Functions and Applications'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U2-T10-S1', topicId: 'CURR-GEN0101-U2-T10', sequence: 1, officialName: 'Exponential equations and conversions', normalizedName: 'Exponential Equations', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U2-T10-S2', topicId: 'CURR-GEN0101-U2-T10', sequence: 2, officialName: 'Logarithmic equations and properties', normalizedName: 'Logarithmic Equations and Properties', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U3-T11',
    unitId: 'UNIT-GEN0101-U3',
    courseId: 'COURSE-GEN0101',
    sequence: 11,
    officialName: 'Rectangular Coordinates',
    normalizedName: 'Rectangular Coordinates and Points',
    hours: 2,
    period: 'FINAL',
    associatedLLOs: ['LLO11'],
    canonicalTopicId: 'TOP-DICT-009',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 13',
      rawTextExtract: 'Rectangular Coordinates: Cartesian plane, Plotting points, Distance between two points, Midpoint of a line segment, Slope of a line'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U3-T11-S1', topicId: 'CURR-GEN0101-U3-T11', sequence: 1, officialName: 'Cartesian plane and plotting points', normalizedName: 'Cartesian Coordinate Plane', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T11-S2', topicId: 'CURR-GEN0101-U3-T11', sequence: 2, officialName: 'Distance between two points', normalizedName: 'Distance Formula', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T11-S3', topicId: 'CURR-GEN0101-U3-T11', sequence: 3, officialName: 'Midpoint and Slope of a line', normalizedName: 'Midpoint and Line Slope', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U3-T12',
    unitId: 'UNIT-GEN0101-U3',
    courseId: 'COURSE-GEN0101',
    sequence: 12,
    officialName: 'Equation of a Line',
    normalizedName: 'Equations of Lines and Coordinate Geometry',
    hours: 2,
    period: 'FINAL',
    associatedLLOs: ['LLO11'],
    canonicalTopicId: 'TOP-DICT-009',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 14',
      rawTextExtract: 'Equation of a Line: Slope-intercept form, Point-slope form, Two-point form, General equation of a line, Parallel and perpendicular lines, Distance from a point to a line, Introduction to axis transformation'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U3-T12-S1', topicId: 'CURR-GEN0101-U3-T12', sequence: 1, officialName: 'Slope-intercept, point-slope, two-point forms', normalizedName: 'Standard Forms of Line Equations', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T12-S2', topicId: 'CURR-GEN0101-U3-T12', sequence: 2, officialName: 'Parallel and perpendicular lines', normalizedName: 'Parallel and Perpendicular Lines', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T12-S3', topicId: 'CURR-GEN0101-U3-T12', sequence: 3, officialName: 'Distance from a point to a line', normalizedName: 'Point-to-Line Distance', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U3-T13',
    unitId: 'UNIT-GEN0101-U3',
    courseId: 'COURSE-GEN0101',
    sequence: 13,
    officialName: 'Right-Triangle Principles',
    normalizedName: 'Right-Triangle Trigonometry',
    hours: 2,
    period: 'FINAL',
    associatedLLOs: ['LLO12'],
    canonicalTopicId: 'TOP-DICT-011',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 15',
      rawTextExtract: 'Trigonometry and Geometric Areas: Right-Triangle Principles: Pythagorean theorem, Trigonometric ratios, Solution of right-angled triangles'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U3-T13-S1', topicId: 'CURR-GEN0101-U3-T13', sequence: 1, officialName: 'Pythagorean theorem', normalizedName: 'Pythagorean Theorem', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T13-S2', topicId: 'CURR-GEN0101-U3-T13', sequence: 2, officialName: 'Trigonometric ratios (SOH-CAH-TOA)', normalizedName: 'Trigonometric Ratios', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T13-S3', topicId: 'CURR-GEN0101-U3-T13', sequence: 3, officialName: 'Solution of right-angled triangles', normalizedName: 'Right-Angled Triangle Solutions', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U3-T14',
    unitId: 'UNIT-GEN0101-U3',
    courseId: 'COURSE-GEN0101',
    sequence: 14,
    officialName: 'Engineering Trigonometry',
    normalizedName: 'Engineering Trigonometry and Bearings',
    hours: 3,
    period: 'FINAL',
    associatedLLOs: ['LLO12'],
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 16',
      rawTextExtract: 'Engineering Trigonometry: Angles and angle measurement, Degrees and radians, Bearings, Angles of elevation and depression, Introductory engineering applications'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U3-T14-S1', topicId: 'CURR-GEN0101-U3-T14', sequence: 1, officialName: 'Degrees and radians angle measurement', normalizedName: 'Degrees and Radians Conversions', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T14-S2', topicId: 'CURR-GEN0101-U3-T14', sequence: 2, officialName: 'Bearings and navigational angles', normalizedName: 'Surveying and Navigational Bearings', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T14-S3', topicId: 'CURR-GEN0101-U3-T14', sequence: 3, officialName: 'Angles of elevation and depression', normalizedName: 'Elevation and Depression Problems', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U3-T15',
    unitId: 'UNIT-GEN0101-U3',
    courseId: 'COURSE-GEN0101',
    sequence: 15,
    officialName: 'Solution of Oblique Triangles',
    normalizedName: 'Oblique Triangles — Sine and Cosine Laws',
    hours: 3,
    period: 'FINAL',
    associatedLLOs: ['LLO12'],
    canonicalTopicId: 'TOP-DICT-011',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 17',
      rawTextExtract: 'Solution of Oblique Triangles: Sine Law, Cosine Law, Area of an oblique triangle, Engineering and surveying applications'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U3-T15-S1', topicId: 'CURR-GEN0101-U3-T15', sequence: 1, officialName: 'Sine Law', normalizedName: 'Law of Sines', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T15-S2', topicId: 'CURR-GEN0101-U3-T15', sequence: 2, officialName: 'Cosine Law', normalizedName: 'Law of Cosines', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T15-S3', topicId: 'CURR-GEN0101-U3-T15', sequence: 3, officialName: 'Area of an oblique triangle', normalizedName: 'Oblique Triangle Area Formulas', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0101-U3-T16',
    unitId: 'UNIT-GEN0101-U3',
    courseId: 'COURSE-GEN0101',
    sequence: 16,
    officialName: 'Plane Areas of Solid Mensuration',
    normalizedName: 'Plane Areas and Mensuration of Geometric Figures',
    hours: 3,
    period: 'FINAL',
    associatedLLOs: ['LLO13'],
    canonicalTopicId: 'TOP-DICT-012',
    sourceReference: {
      syllabusId: 'SYL-005',
      filename: 'GE_SYL_GEN0101_20260720 (2) - Copy.docx',
      tableReference: 'Table-36, Row 18',
      rawTextExtract: 'Plane Areas of Solid Mensuration: Area of squares and rectangles, Area of triangles, Area of quadrilaterals, Area of regular polygons, Area of circles and sectors, Composite plane figures'
    },
    subtopics: [
      { id: 'SUB-GEN0101-U3-T16-S1', topicId: 'CURR-GEN0101-U3-T16', sequence: 1, officialName: 'Area of squares, rectangles, triangles, quadrilaterals', normalizedName: 'Areas of Polygons and Quadrilaterals', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T16-S2', topicId: 'CURR-GEN0101-U3-T16', sequence: 2, officialName: 'Area of regular polygons, circles and sectors', normalizedName: 'Areas of Regular Polygons, Circles, and Sectors', isExplicitInSource: true },
      { id: 'SUB-GEN0101-U3-T16-S3', topicId: 'CURR-GEN0101-U3-T16', sequence: 3, officialName: 'Composite plane figures', normalizedName: 'Composite Plane Figures', isExplicitInSource: true }
    ]
  },

  // =========================================================================
  // COURSE: GEN 0102 (Calculus 1)
  // =========================================================================
  {
    id: 'CURR-GEN0102-U1-T01',
    unitId: 'UNIT-GEN0102-U1',
    courseId: 'COURSE-GEN0102',
    sequence: 1,
    officialName: '1. Introduction to Calculus',
    normalizedName: 'Introduction to Calculus',
    hours: 3,
    period: 'PRELIM',
    associatedLLOs: ['LLO1'],
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: '1. Introduction to Calculus'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U1-T01-S1', topicId: 'CURR-GEN0102-U1-T01', sequence: 1, officialName: 'Overview of Calculus in Engineering', normalizedName: 'Overview of Calculus in Engineering', isExplicitInSource: false }
    ]
  },
  {
    id: 'CURR-GEN0102-U1-T02',
    unitId: 'UNIT-GEN0102-U1',
    courseId: 'COURSE-GEN0102',
    sequence: 2,
    officialName: '2. Limits & Continuity Concepts',
    normalizedName: 'Limits and Continuity Concepts',
    hours: 3,
    period: 'PRELIM',
    associatedLLOs: ['LLO1'],
    canonicalTopicId: 'TOP-DICT-001',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: '2. Limits & Continuity Concepts'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U1-T02-S1', topicId: 'CURR-GEN0102-U1-T02', sequence: 1, officialName: 'Definition of limits and intuitive approach', normalizedName: 'Limit Definition and Intuition', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U1-T02-S2', topicId: 'CURR-GEN0102-U1-T02', sequence: 2, officialName: 'Continuity of functions', normalizedName: 'Continuity Conditions', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U1-T02-S3', topicId: 'CURR-GEN0102-U1-T02', sequence: 3, officialName: 'Definition of a derivative as a limit', normalizedName: 'Derivative as a Limit of Difference Quotient', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U1-T03',
    unitId: 'UNIT-GEN0102-U1',
    courseId: 'COURSE-GEN0102',
    sequence: 3,
    officialName: '3. Evaluating Limits',
    normalizedName: 'Evaluating Limits',
    hours: 3,
    period: 'PRELIM',
    associatedLLOs: ['LLO2'],
    canonicalTopicId: 'TOP-DICT-001',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: '3. Evaluating Limits'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U1-T03-S1', topicId: 'CURR-GEN0102-U1-T03', sequence: 1, officialName: 'Algebraic limit evaluation (factoring, rationalization)', normalizedName: 'Algebraic Limit Evaluation Techniques', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U1-T03-S2', topicId: 'CURR-GEN0102-U1-T03', sequence: 2, officialName: 'Infinite limits and limits at infinity', normalizedName: 'Infinite Limits and Asymptotes', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U1-T04',
    unitId: 'UNIT-GEN0102-U1',
    courseId: 'COURSE-GEN0102',
    sequence: 4,
    officialName: '4. Analysis of Calculus Methods',
    normalizedName: 'Differentiation Rules and Calculus Methods Analysis',
    hours: 6,
    period: 'PRELIM',
    associatedLLOs: ['LLO3', 'LLO4'],
    canonicalTopicId: 'TOP-DICT-002',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: '4. Analysis of Calculus Methods'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U1-T04-S1', topicId: 'CURR-GEN0102-U1-T04', sequence: 1, officialName: 'Basic algebraic derivative rules (Power, Sum, Difference)', normalizedName: 'Algebraic Differentiation Rules', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U1-T04-S2', topicId: 'CURR-GEN0102-U1-T04', sequence: 2, officialName: 'Product Rule', normalizedName: 'Product Rule', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U1-T04-S3', topicId: 'CURR-GEN0102-U1-T04', sequence: 3, officialName: 'Quotient Rule', normalizedName: 'Quotient Rule', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U1-T04-S4', topicId: 'CURR-GEN0102-U1-T04', sequence: 4, officialName: 'Chain Rule for composite functions', normalizedName: 'Chain Rule', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U2-T05',
    unitId: 'UNIT-GEN0102-U2',
    courseId: 'COURSE-GEN0102',
    sequence: 5,
    officialName: '5. Derivatives of Inverse Trigonometric Functions',
    normalizedName: 'Inverse Trigonometric Derivatives',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO5'],
    canonicalTopicId: 'TOP-DICT-002',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '5. Derivatives of Inverse Trigonometric Functions'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U2-T05-S1', topicId: 'CURR-GEN0102-U2-T05', sequence: 1, officialName: 'Derivatives of arcsin, arccos, arctan', normalizedName: 'Standard Inverse Trigonometric Derivatives', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U2-T05-S2', topicId: 'CURR-GEN0102-U2-T05', sequence: 2, officialName: 'Chain rule with inverse trigonometric functions', normalizedName: 'Chain Rule with Inverse Trig Functions', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U2-T06',
    unitId: 'UNIT-GEN0102-U2',
    courseId: 'COURSE-GEN0102',
    sequence: 6,
    officialName: '6. Derivatives of Hyperbolic Functions',
    normalizedName: 'Hyperbolic Function Derivatives',
    hours: 2,
    period: 'MIDTERM',
    associatedLLOs: ['LLO7'],
    canonicalTopicId: 'TOP-DICT-002',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '6. Derivatives of Hyperbolic Functions'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U2-T06-S1', topicId: 'CURR-GEN0102-U2-T06', sequence: 1, officialName: 'Derivatives of sinh, cosh, tanh', normalizedName: 'Standard Hyperbolic Derivatives', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U2-T06-S2', topicId: 'CURR-GEN0102-U2-T06', sequence: 2, officialName: 'Derivatives of sech, csch, coth', normalizedName: 'Reciprocal Hyperbolic Derivatives', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U2-T07',
    unitId: 'UNIT-GEN0102-U2',
    courseId: 'COURSE-GEN0102',
    sequence: 7,
    officialName: '7. Derivatives of Logarithmic and Exponential Functions',
    normalizedName: 'Logarithmic and Exponential Derivatives',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO6'],
    canonicalTopicId: 'TOP-DICT-007',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '7. Derivatives of Logarithmic and Exponential Functions'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U2-T07-S1', topicId: 'CURR-GEN0102-U2-T07', sequence: 1, officialName: 'Derivatives of natural and base-a logarithms', normalizedName: 'Logarithmic Derivatives', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U2-T07-S2', topicId: 'CURR-GEN0102-U2-T07', sequence: 2, officialName: 'Derivatives of exponential functions (e^x, a^x)', normalizedName: 'Exponential Derivatives', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U2-T07-S3', topicId: 'CURR-GEN0102-U2-T07', sequence: 3, officialName: 'Logarithmic differentiation technique', normalizedName: 'Logarithmic Differentiation', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U2-T08',
    unitId: 'UNIT-GEN0102-U2',
    courseId: 'COURSE-GEN0102',
    sequence: 8,
    officialName: '8. Implicit Differentiation',
    normalizedName: 'Implicit Differentiation',
    hours: 2,
    period: 'MIDTERM',
    associatedLLOs: ['LLO8'],
    canonicalTopicId: 'TOP-DICT-003',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '8. Implicit Differentiation'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U2-T08-S1', topicId: 'CURR-GEN0102-U2-T08', sequence: 1, officialName: 'Differentiating implicit algebraic equations', normalizedName: 'First-Order Implicit Differentiation', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U2-T08-S2', topicId: 'CURR-GEN0102-U2-T08', sequence: 2, officialName: 'Higher order implicit derivatives', normalizedName: 'Second-Order Implicit Derivatives', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U2-T09',
    unitId: 'UNIT-GEN0102-U2',
    courseId: 'COURSE-GEN0102',
    sequence: 9,
    officialName: '9. Partial Differentiation',
    normalizedName: 'Partial Differentiation',
    hours: 2,
    period: 'MIDTERM',
    associatedLLOs: ['LLO9'],
    canonicalTopicId: 'TOP-DICT-004',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '9. Partial Differentiation'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U2-T09-S1', topicId: 'CURR-GEN0102-U2-T09', sequence: 1, officialName: 'First-order partial derivatives (df/dx, df/dy)', normalizedName: 'First-Order Partial Derivatives', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U2-T09-S2', topicId: 'CURR-GEN0102-U2-T09', sequence: 2, officialName: 'Partial derivatives in multivariable functions', normalizedName: 'Multivariable Functions', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U2-T10',
    unitId: 'UNIT-GEN0102-U2',
    courseId: 'COURSE-GEN0102',
    sequence: 10,
    officialName: '10. Higher order derivatives',
    normalizedName: 'Higher-Order Derivatives',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO10'],
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: '10. Higher order derivatives'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U2-T10-S1', topicId: 'CURR-GEN0102-U2-T10', sequence: 1, officialName: 'Successive derivatives (y", y"\'', normalizedName: 'Successive Derivatives', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U2-T10-S2', topicId: 'CURR-GEN0102-U2-T10', sequence: 2, officialName: 'Acceleration and rectilinear kinematics', normalizedName: 'Kinematics and Acceleration', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U3-T11',
    unitId: 'UNIT-GEN0102-U3',
    courseId: 'COURSE-GEN0102',
    sequence: 11,
    officialName: '11. The slope',
    normalizedName: 'Tangent Slopes and Rates of Change',
    hours: 3,
    period: 'FINAL',
    associatedLLOs: ['LLO11'],
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: '11. The slope'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U3-T11-S1', topicId: 'CURR-GEN0102-U3-T11', sequence: 1, officialName: 'Slope of a tangent line to a curve', normalizedName: 'Tangent Line Slope', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U3-T11-S2', topicId: 'CURR-GEN0102-U3-T11', sequence: 2, officialName: 'Equations of tangent and normal lines', normalizedName: 'Tangent and Normal Lines', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U3-T12',
    unitId: 'UNIT-GEN0102-U3',
    courseId: 'COURSE-GEN0102',
    sequence: 12,
    officialName: '12. Polynomial curves',
    normalizedName: 'Polynomial Curve Sketching and Analysis',
    hours: 3,
    period: 'FINAL',
    associatedLLOs: ['LLO12'],
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: '12. Polynomial curves'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U3-T12-S1', topicId: 'CURR-GEN0102-U3-T12', sequence: 1, officialName: 'Increasing/decreasing intervals and critical points', normalizedName: 'Critical Points and Monotonicity', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U3-T12-S2', topicId: 'CURR-GEN0102-U3-T12', sequence: 2, officialName: 'Concavity and inflection points', normalizedName: 'Concavity and Points of Inflection', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U3-T12-S3', topicId: 'CURR-GEN0102-U3-T12', sequence: 3, officialName: 'Curve sketching algorithms', normalizedName: 'Curve Sketching', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0102-U3-T13',
    unitId: 'UNIT-GEN0102-U3',
    courseId: 'COURSE-GEN0102',
    sequence: 13,
    officialName: '13. Applications of the Derivative(Maxima, minima, related rates)',
    normalizedName: 'Applications of the Derivative — Maxima, Minima, and Related Rates',
    hours: 9,
    period: 'FINAL',
    associatedLLOs: ['LLO13'],
    canonicalTopicId: 'TOP-DICT-005',
    sourceReference: {
      syllabusId: 'SYL-001',
      filename: 'Calculus 1.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: '13. Applications of the Derivative(Maxima, minima, related rates)'
    },
    subtopics: [
      { id: 'SUB-GEN0102-U3-T13-S1', topicId: 'CURR-GEN0102-U3-T13', sequence: 1, officialName: 'Applied optimization (maxima and minima)', normalizedName: 'Applied Optimization Problems', isExplicitInSource: true },
      { id: 'SUB-GEN0102-U3-T13-S2', topicId: 'CURR-GEN0102-U3-T13', sequence: 2, officialName: 'Related rates in geometric and physical problems', normalizedName: 'Related Rates of Change', isExplicitInSource: true }
    ]
  },

  // =========================================================================
  // COURSE: GEN 0107 (Differential Equations)
  // =========================================================================
  {
    id: 'CURR-GEN0107-U1-T01',
    unitId: 'UNIT-GEN0107-U1',
    courseId: 'COURSE-GEN0107',
    sequence: 1,
    officialName: 'Classification of Differential Equations',
    normalizedName: 'Classification of Differential Equations',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO1'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Classification of Differential Equations'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U1-T01-S1', topicId: 'CURR-GEN0107-U1-T01', sequence: 1, officialName: 'Classification by type (ODE vs PDE)', normalizedName: 'ODE vs PDE Type', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U1-T01-S2', topicId: 'CURR-GEN0107-U1-T01', sequence: 2, officialName: 'Order, degree, and linearity', normalizedName: 'Order, Degree, and Linearity', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U1-T02',
    unitId: 'UNIT-GEN0107-U1',
    courseId: 'COURSE-GEN0107',
    sequence: 2,
    officialName: 'Elimination of Arbitrary Constant',
    normalizedName: 'Elimination of Arbitrary Constants',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO2'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Elimination of Arbitrary Constant'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U1-T02-S1', topicId: 'CURR-GEN0107-U1-T02', sequence: 1, officialName: 'Eliminating constants from single-parameter families', normalizedName: 'Single-Parameter Families', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U1-T02-S2', topicId: 'CURR-GEN0107-U1-T02', sequence: 2, officialName: 'Eliminating constants from multi-parameter families', normalizedName: 'Multi-Parameter Families', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U1-T03',
    unitId: 'UNIT-GEN0107-U1',
    courseId: 'COURSE-GEN0107',
    sequence: 3,
    officialName: 'Variable Separable',
    normalizedName: 'Separation of Variables',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO3'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Variable Separable'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U1-T03-S1', topicId: 'CURR-GEN0107-U1-T03', sequence: 1, officialName: 'General solutions of separable ODEs', normalizedName: 'General Solution via Variable Separation', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U1-T03-S2', topicId: 'CURR-GEN0107-U1-T03', sequence: 2, officialName: 'Initial value problems for separable equations', normalizedName: 'Initial Value Problems (Separable)', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U2-T04',
    unitId: 'UNIT-GEN0107-U2',
    courseId: 'COURSE-GEN0107',
    sequence: 4,
    officialName: 'Homogeneous Linear Differential Equation with and without Constant Coefficients',
    normalizedName: 'Homogeneous Linear Differential Equations',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO4'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Homogeneous Linear Differential Equation with and without Constant Coefficients'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U2-T04-S1', topicId: 'CURR-GEN0107-U2-T04', sequence: 1, officialName: 'Homogeneous functions and y=vx substitution', normalizedName: 'Homogeneous 1st Order Equations (y=vx)', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U2-T04-S2', topicId: 'CURR-GEN0107-U2-T04', sequence: 2, officialName: 'Higher order homogeneous linear equations with constant coefficients', normalizedName: 'Constant-Coefficient Characteristic Equations', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U2-T05',
    unitId: 'UNIT-GEN0107-U2',
    courseId: 'COURSE-GEN0107',
    sequence: 5,
    officialName: 'Exact Differential Equation of Order one',
    normalizedName: 'Exact First-Order Differential Equations',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO5'],
    canonicalTopicId: 'TOP-DICT-004',
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Exact Differential Equation of Order one'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U2-T05-S1', topicId: 'CURR-GEN0107-U2-T05', sequence: 1, officialName: 'Test for exactness (dM/dy = dN/dx)', normalizedName: 'Exactness Verification', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U2-T05-S2', topicId: 'CURR-GEN0107-U2-T05', sequence: 2, officialName: 'General potential function solution', normalizedName: 'Potential Function Integration', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U2-T06',
    unitId: 'UNIT-GEN0107-U2',
    courseId: 'COURSE-GEN0107',
    sequence: 6,
    officialName: 'Linear Differential Equation of Order one',
    normalizedName: 'First-Order Linear Differential Equations',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO6'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Linear Differential Equation of Order one'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U2-T06-S1', topicId: 'CURR-GEN0107-U2-T06', sequence: 1, officialName: 'Standard linear form dy/dx + P(x)y = Q(x)', normalizedName: 'Standard 1st Order Linear Form', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U2-T06-S2', topicId: 'CURR-GEN0107-U2-T06', sequence: 2, officialName: 'Integrating factor method exp(int P dx)', normalizedName: 'Integrating Factor Technique', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U2-T07',
    unitId: 'UNIT-GEN0107-U2',
    courseId: 'COURSE-GEN0107',
    sequence: 7,
    officialName: 'Bernoulli Differential Equation of Order one',
    normalizedName: 'Bernoulli Differential Equations',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO7'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Bernoulli Differential Equation of Order one'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U2-T07-S1', topicId: 'CURR-GEN0107-U2-T07', sequence: 1, officialName: 'Bernoulli form dy/dx + P(x)y = Q(x)y^n', normalizedName: 'Bernoulli Form Recognition', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U2-T07-S2', topicId: 'CURR-GEN0107-U2-T07', sequence: 2, officialName: 'Transformation substitution v = y^(1-n)', normalizedName: 'Linearizing Transformation (v=y^(1-n))', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U2-T08',
    unitId: 'UNIT-GEN0107-U2',
    courseId: 'COURSE-GEN0107',
    sequence: 8,
    officialName: 'Application of 1st Order Differential Equations',
    normalizedName: 'First-Order Differential Equation Applications',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO8'],
    canonicalTopicId: 'TOP-DICT-007',
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Application of 1st Order Differential Equations'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U2-T08-S1', topicId: 'CURR-GEN0107-U2-T08', sequence: 1, officialName: 'Exponential growth and decay models', normalizedName: 'Growth and Decay Modeling', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U2-T08-S2', topicId: 'CURR-GEN0107-U2-T08', sequence: 2, officialName: 'Newton\'s law of cooling and mixture problems', normalizedName: 'Cooling and Fluid Mixture Problems', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U2-T08-S3', topicId: 'CURR-GEN0107-U2-T08', sequence: 3, officialName: 'Orthogonal trajectories', normalizedName: 'Orthogonal Trajectories', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U3-T09',
    unitId: 'UNIT-GEN0107-U3',
    courseId: 'COURSE-GEN0107',
    sequence: 9,
    officialName: 'Solution of Systems of Linear Differential Equation with Initial Values (Laplace Transform Method)',
    normalizedName: 'Systems of Linear Differential Equations — Laplace Transform Method',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO9'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Solution of Systems of Linear Differential Equation with Initial Values/Simultaneous Solution to DE (Laplace Transform Method) [Part 1]'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U3-T09-S1', topicId: 'CURR-GEN0107-U3-T09', sequence: 1, officialName: 'Definition of Laplace transform and standard transform pairs', normalizedName: 'Laplace Transform Tables and Properties', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U3-T09-S2', topicId: 'CURR-GEN0107-U3-T09', sequence: 2, officialName: 'Transforming derivative initial value problems (IVPs)', normalizedName: 'Derivative IVP Transformation', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U3-T10',
    unitId: 'UNIT-GEN0107-U3',
    courseId: 'COURSE-GEN0107',
    sequence: 10,
    officialName: 'Simultaneous Solution to DE (Laplace Transform Method)',
    normalizedName: 'Simultaneous Systems of Differential Equations via Laplace Transforms',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO10'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Solution of Systems of Linear Differential Equation with Initial Values/Simultaneous Solution to DE (Laplace Transform Method) [Part 2]'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U3-T10-S1', topicId: 'CURR-GEN0107-U3-T10', sequence: 1, officialName: 'Coupled systems of differential equations in s-domain', normalizedName: 'Coupled Linear Systems in s-Domain', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U3-T10-S2', topicId: 'CURR-GEN0107-U3-T10', sequence: 2, officialName: 'Algebraic matrix and Cramer\'s rule solution for transforms', normalizedName: 'Simultaneous Transform Solutions', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0107-U3-T11',
    unitId: 'UNIT-GEN0107-U3',
    courseId: 'COURSE-GEN0107',
    sequence: 11,
    officialName: 'Inverse Laplace Transforms of Functions',
    normalizedName: 'Inverse Laplace Transforms and Partial Fractions',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO11'],
    sourceReference: {
      syllabusId: 'SYL-002',
      filename: 'Differential Equations.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: 'Inverse Laplace Transforms of Functions'
    },
    subtopics: [
      { id: 'SUB-GEN0107-U3-T11-S1', topicId: 'CURR-GEN0107-U3-T11', sequence: 1, officialName: 'Partial fraction decomposition in inverse transforms', normalizedName: 'Partial Fraction Decomposition in s-Domain', isExplicitInSource: true },
      { id: 'SUB-GEN0107-U3-T11-S2', topicId: 'CURR-GEN0107-U3-T11', sequence: 2, officialName: 'First and second shifting theorems', normalizedName: 'Shifting Theorems in Inverse Transforms', isExplicitInSource: true }
    ]
  },

  // =========================================================================
  // COURSE: GEN 0110 (Physics 2 for Engineers)
  // =========================================================================
  {
    id: 'CURR-GEN0110-U1-T01',
    unitId: 'UNIT-GEN0110-U1',
    courseId: 'COURSE-GEN0110',
    sequence: 1,
    officialName: 'Fluid Mechanics',
    normalizedName: 'Fluid Mechanics',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO1'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Fluid Mechanics'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U1-T01-S1', topicId: 'CURR-GEN0110-U1-T01', sequence: 1, officialName: 'Hydrostatic pressure and Pascal\'s principle', normalizedName: 'Fluid Statics and Hydrostatic Pressure', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U1-T01-S2', topicId: 'CURR-GEN0110-U1-T01', sequence: 2, officialName: 'Buoyancy and Archimedes\' principle', normalizedName: 'Buoyancy and Archimedes\' Principle', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U1-T01-S3', topicId: 'CURR-GEN0110-U1-T01', sequence: 3, officialName: 'Fluid dynamics, continuity equation, Bernoulli\'s equation', normalizedName: 'Fluid Dynamics and Flow Rates', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U1-T02',
    unitId: 'UNIT-GEN0110-U1',
    courseId: 'COURSE-GEN0110',
    sequence: 2,
    officialName: 'Heat Transfer',
    normalizedName: 'Heat Transfer Mechanisms',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO2'],
    canonicalTopicId: 'TOP-DICT-013',
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Heat Transfer'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U1-T02-S1', topicId: 'CURR-GEN0110-U1-T02', sequence: 1, officialName: 'Conduction and Fourier\'s law', normalizedName: 'Thermal Conduction', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U1-T02-S2', topicId: 'CURR-GEN0110-U1-T02', sequence: 2, officialName: 'Convection heat transfer', normalizedName: 'Thermal Convection', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U1-T02-S3', topicId: 'CURR-GEN0110-U1-T02', sequence: 3, officialName: 'Thermal radiation and Stefan-Boltzmann law', normalizedName: 'Thermal Radiation', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U1-T03',
    unitId: 'UNIT-GEN0110-U1',
    courseId: 'COURSE-GEN0110',
    sequence: 3,
    officialName: 'heat measurements',
    normalizedName: 'Calorimetry and Heat Measurements',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO3'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'heat measurements'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U1-T03-S1', topicId: 'CURR-GEN0110-U1-T03', sequence: 1, officialName: 'Specific heat capacity calculations (Q = mc dT)', normalizedName: 'Specific Heat and Calorimetry', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U1-T03-S2', topicId: 'CURR-GEN0110-U1-T03', sequence: 2, officialName: 'Latent heats of fusion and vaporization', normalizedName: 'Latent Heat and Phase Changes', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U1-T04',
    unitId: 'UNIT-GEN0110-U1',
    courseId: 'COURSE-GEN0110',
    sequence: 4,
    officialName: 'Thermal Expansion',
    normalizedName: 'Thermal Expansion and Thermal Stress',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO4'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 1',
      rawTextExtract: 'Thermal Expansion'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U1-T04-S1', topicId: 'CURR-GEN0110-U1-T04', sequence: 1, officialName: 'Linear thermal expansion', normalizedName: 'Linear Thermal Expansion', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U1-T04-S2', topicId: 'CURR-GEN0110-U1-T04', sequence: 2, officialName: 'Area and volume thermal expansion', normalizedName: 'Area and Volumetric Expansion', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U1-T04-S3', topicId: 'CURR-GEN0110-U1-T04', sequence: 3, officialName: 'Thermal stress in constrained elements', normalizedName: 'Thermal Stress in Engineering Materials', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U2-T05',
    unitId: 'UNIT-GEN0110-U2',
    courseId: 'COURSE-GEN0110',
    sequence: 5,
    officialName: 'Sound waves',
    normalizedName: 'Sound Waves and Acoustics',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO5'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Sound waves'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U2-T05-S1', topicId: 'CURR-GEN0110-U2-T05', sequence: 1, officialName: 'Speed of sound and acoustic intensity', normalizedName: 'Sound Speed and Intensity', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U2-T05-S2', topicId: 'CURR-GEN0110-U2-T05', sequence: 2, officialName: 'Resonance and standing sound waves', normalizedName: 'Acoustic Resonance', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U2-T05-S3', topicId: 'CURR-GEN0110-U2-T05', sequence: 3, officialName: 'Doppler effect for sound sources', normalizedName: 'Doppler Effect', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U2-T06',
    unitId: 'UNIT-GEN0110-U2',
    courseId: 'COURSE-GEN0110',
    sequence: 6,
    officialName: 'Transverse Waves',
    normalizedName: 'Transverse Waves and Wave Mechanics',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO6'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Transverse Waves'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U2-T06-S1', topicId: 'CURR-GEN0110-U2-T06', sequence: 1, officialName: 'Mathematical description of transverse waves', normalizedName: 'Transverse Wave Equation', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U2-T06-S2', topicId: 'CURR-GEN0110-U2-T06', sequence: 2, officialName: 'Superposition and wave interference', normalizedName: 'Wave Superposition and Interference', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U2-T07',
    unitId: 'UNIT-GEN0110-U2',
    courseId: 'COURSE-GEN0110',
    sequence: 7,
    officialName: 'Eletrostartics',
    normalizedName: 'Electrostatics',
    hours: 3,
    period: 'MIDTERM',
    associatedLLOs: ['LLO7'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 3',
      rawTextExtract: 'Eletrostartics'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U2-T07-S1', topicId: 'CURR-GEN0110-U2-T07', sequence: 1, officialName: 'Coulomb\'s Law and electric forces', normalizedName: 'Coulomb\'s Law', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U2-T07-S2', topicId: 'CURR-GEN0110-U2-T07', sequence: 2, officialName: 'Electric fields and Gauss\'s Law', normalizedName: 'Electric Fields and Gauss\'s Law', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U2-T07-S3', topicId: 'CURR-GEN0110-U2-T07', sequence: 3, officialName: 'Electric potential and potential energy', normalizedName: 'Electric Potential', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U3-T08',
    unitId: 'UNIT-GEN0110-U3',
    courseId: 'COURSE-GEN0110',
    sequence: 8,
    officialName: 'Electricity',
    normalizedName: 'Electric Circuits (DC and AC)',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO8'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Electricity'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U3-T08-S1', topicId: 'CURR-GEN0110-U3-T08', sequence: 1, officialName: 'Ohm\'s Law, resistance, and resistivity', normalizedName: 'Ohm\'s Law and Resistance', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U3-T08-S2', topicId: 'CURR-GEN0110-U3-T08', sequence: 2, officialName: 'DC circuits and Kirchhoff\'s laws', normalizedName: 'DC Circuits and Kirchhoff\'s Rules', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U3-T08-S3', topicId: 'CURR-GEN0110-U3-T08', sequence: 3, officialName: 'Introduction to AC circuits and electrical power', normalizedName: 'AC Circuits and Power', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U3-T09',
    unitId: 'UNIT-GEN0110-U3',
    courseId: 'COURSE-GEN0110',
    sequence: 9,
    officialName: 'Optics',
    normalizedName: 'Geometric and Physical Optics',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO10'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Optics'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U3-T09-S1', topicId: 'CURR-GEN0110-U3-T09', sequence: 1, officialName: 'Reflection, refraction, and Snell\'s Law', normalizedName: 'Reflection and Refraction', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U3-T09-S2', topicId: 'CURR-GEN0110-U3-T09', sequence: 2, officialName: 'Image formation by mirrors and thin lenses', normalizedName: 'Mirrors and Thin Lenses', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U3-T09-S3', topicId: 'CURR-GEN0110-U3-T09', sequence: 3, officialName: 'Interference and diffraction patterns', normalizedName: 'Physical Optics and Diffraction', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0110-U3-T10',
    unitId: 'UNIT-GEN0110-U3',
    courseId: 'COURSE-GEN0110',
    sequence: 10,
    officialName: 'Special Relativity',
    normalizedName: 'Special Relativity',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO9'],
    sourceReference: {
      syllabusId: 'SYL-004',
      filename: 'Physics 2.docx',
      tableReference: 'Table-36, Row 5',
      rawTextExtract: 'Special Relativity'
    },
    subtopics: [
      { id: 'SUB-GEN0110-U3-T10-S1', topicId: 'CURR-GEN0110-U3-T10', sequence: 1, officialName: 'Einstein\'s postulates and time dilation', normalizedName: 'Postulates and Time Dilation', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U3-T10-S2', topicId: 'CURR-GEN0110-U3-T10', sequence: 2, officialName: 'Length contraction and relativistic momentum', normalizedName: 'Length Contraction and Relativistic Momentum', isExplicitInSource: true },
      { id: 'SUB-GEN0110-U3-T10-S3', topicId: 'CURR-GEN0110-U3-T10', sequence: 3, officialName: 'Mass-energy equivalence (E = mc^2)', normalizedName: 'Mass-Energy Equivalence', isExplicitInSource: true }
    ]
  },

  // =========================================================================
  // COURSE: GEN 0161 (Thermodynamics)
  // =========================================================================
  {
    id: 'CURR-GEN0161-U1-T01',
    unitId: 'UNIT-GEN0161-U1',
    courseId: 'COURSE-GEN0161',
    sequence: 1,
    officialName: '1. Introduction /Orientation',
    normalizedName: 'Thermodynamics Introduction and Engineering Scope',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO1'],
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: '1. Introduction /Orientation'
    },
    subtopics: [
      { id: 'SUB-GEN0161-U1-T01-S1', topicId: 'CURR-GEN0161-U1-T01', sequence: 1, officialName: 'Significance of thermodynamics in mechanical engineering', normalizedName: 'Thermodynamics Engineering Scope', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0161-U1-T02',
    unitId: 'UNIT-GEN0161-U1',
    courseId: 'COURSE-GEN0161',
    sequence: 2,
    officialName: '2. Basic Principles, Concept and Definition of thermodynamics',
    normalizedName: 'Thermodynamic Systems, Properties, and States',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO2'],
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: '2. Basic Principles, Concept and Definition of thermodynamics'
    },
    subtopics: [
      { id: 'SUB-GEN0161-U1-T02-S1', topicId: 'CURR-GEN0161-U1-T02', sequence: 1, officialName: 'Closed and open systems, control volumes', normalizedName: 'Closed and Open Systems', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U1-T02-S2', topicId: 'CURR-GEN0161-U1-T02', sequence: 2, officialName: 'Thermodynamic properties, state postulate, equilibrium', normalizedName: 'Properties, States, and Equilibrium', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0161-U1-T03',
    unitId: 'UNIT-GEN0161-U1',
    courseId: 'COURSE-GEN0161',
    sequence: 3,
    officialName: '3. First Law of Thermodynamics',
    normalizedName: 'First Law of Thermodynamics and Energy Conservation',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO3'],
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: '3. First Law of Thermodynamics'
    },
    subtopics: [
      { id: 'SUB-GEN0161-U1-T03-S1', topicId: 'CURR-GEN0161-U1-T03', sequence: 1, officialName: 'Energy conservation in closed systems (Q - W = dU)', normalizedName: 'First Law for Closed Systems', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U1-T03-S2', topicId: 'CURR-GEN0161-U1-T03', sequence: 2, officialName: 'Energy conservation in steady-flow open systems (Enthalpy)', normalizedName: 'First Law for Open Systems (Control Volumes)', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0161-U2-T04',
    unitId: 'UNIT-GEN0161-U2',
    courseId: 'COURSE-GEN0161',
    sequence: 4,
    officialName: '1. Ideal Gases / Ideal gas Laws',
    normalizedName: 'Ideal Gas Laws and Equations of State',
    hours: 5,
    period: 'MIDTERM',
    associatedLLOs: ['LLO4'],
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: '1. Ideal Gases / Ideal gas Laws'
    },
    subtopics: [
      { id: 'SUB-GEN0161-U2-T04-S1', topicId: 'CURR-GEN0161-U2-T04', sequence: 1, officialName: 'Equation of state PV = mRT', normalizedName: 'Ideal Gas Equation of State', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U2-T04-S2', topicId: 'CURR-GEN0161-U2-T04', sequence: 2, officialName: 'Specific heat relations (cp, cv, k, R)', normalizedName: 'Ideal Gas Specific Heat Relations', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0161-U2-T05',
    unitId: 'UNIT-GEN0161-U2',
    courseId: 'COURSE-GEN0161',
    sequence: 5,
    officialName: '2. Processes of Ideal Gases',
    normalizedName: 'Thermodynamic Processes of Ideal Gases',
    hours: 5,
    period: 'MIDTERM',
    associatedLLOs: ['LLO5'],
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: '2. Processes of Ideal Gases'
    },
    subtopics: [
      { id: 'SUB-GEN0161-U2-T05-S1', topicId: 'CURR-GEN0161-U2-T05', sequence: 1, officialName: 'Isobaric (constant pressure) and isochoric (constant volume) processes', normalizedName: 'Isobaric and Isochoric Processes', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U2-T05-S2', topicId: 'CURR-GEN0161-U2-T05', sequence: 2, officialName: 'Isothermal (constant temperature) and isentropic processes', normalizedName: 'Isothermal and Isentropic Processes', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U2-T05-S3', topicId: 'CURR-GEN0161-U2-T05', sequence: 3, officialName: 'Polytropic process PV^n = C and boundary work', normalizedName: 'Polytropic Processes and Boundary Work', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0161-U2-T06',
    unitId: 'UNIT-GEN0161-U2',
    courseId: 'COURSE-GEN0161',
    sequence: 6,
    officialName: '3. Properties of Pure Substance',
    normalizedName: 'Properties and Phase Diagrams of Pure Substances',
    hours: 5,
    period: 'MIDTERM',
    associatedLLOs: ['LLO6'],
    canonicalTopicId: 'TOP-DICT-013',
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: '3. Properties of Pure Substance'
    },
    subtopics: [
      { id: 'SUB-GEN0161-U2-T06-S1', topicId: 'CURR-GEN0161-U2-T06', sequence: 1, officialName: 'Phase change phenomena and saturation states', normalizedName: 'Phase Changes and Saturation Conditions', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U2-T06-S2', topicId: 'CURR-GEN0161-U2-T06', sequence: 2, officialName: 'Vapor quality (x) and steam table property lookups', normalizedName: 'Vapor Quality and Thermodynamic Property Tables', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0161-U3-T07',
    unitId: 'UNIT-GEN0161-U3',
    courseId: 'COURSE-GEN0161',
    sequence: 7,
    officialName: '1. Introduction to cycle analysis: Second Law of Thermodynamics',
    normalizedName: 'Second Law of Thermodynamics, Heat Engines, and Entropy',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO7'],
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: '1. Introduction to cycle analysis: Second Law of Thermodynamics'
    },
    subtopics: [
      { id: 'SUB-GEN0161-U3-T07-S1', topicId: 'CURR-GEN0161-U3-T07', sequence: 1, officialName: 'Kelvin-Planck, Clausius statements and Carnot efficiency', normalizedName: 'Second Law Statements and Carnot Principle', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U3-T07-S2', topicId: 'CURR-GEN0161-U3-T07', sequence: 2, officialName: 'Entropy principle and isentropic efficiencies', normalizedName: 'Entropy Generation and Isentropic Efficiency', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-GEN0161-U3-T08',
    unitId: 'UNIT-GEN0161-U3',
    courseId: 'COURSE-GEN0161',
    sequence: 8,
    officialName: '2. Introduction to Gas and Vapor Cycles',
    normalizedName: 'Gas and Vapor Power Cycles',
    hours: 10,
    period: 'FINAL',
    associatedLLOs: ['LLO8'],
    sourceReference: {
      syllabusId: 'SYL-003',
      filename: '1Thermodynamics.docx',
      tableReference: 'Table-35, Row 5',
      rawTextExtract: '2. Introduction to Gas and Vapor Cycles'
    },
    subtopics: [
      { id: 'SUB-GEN0161-U3-T08-S1', topicId: 'CURR-GEN0161-U3-T08', sequence: 1, officialName: 'Ideal Rankine vapor power cycle', normalizedName: 'Ideal Rankine Vapor Power Cycle', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U3-T08-S2', topicId: 'CURR-GEN0161-U3-T08', sequence: 2, officialName: 'Reheat and Regenerative Rankine cycles', normalizedName: 'Reheat and Regenerative Cycle Modifications', isExplicitInSource: true },
      { id: 'SUB-GEN0161-U3-T08-S3', topicId: 'CURR-GEN0161-U3-T08', sequence: 3, officialName: 'Introductory gas power cycles (Otto, Diesel, Brayton)', normalizedName: 'Introductory Gas Power Cycles', isExplicitInSource: true }
    ]
  },

  // =========================================================================
  // COURSE: BSIE 3219 (IE Special Topics 1)
  // =========================================================================
  {
    id: 'CURR-BSIE3219-U1-T01',
    unitId: 'UNIT-BSIE3219-U1',
    courseId: 'COURSE-BSIE3219',
    sequence: 1,
    officialName: 'Fundamentals of Algebra, Equations, and Matrices',
    normalizedName: 'Algebra, Polynomial Equations, and Matrix Fundamentals',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO1'],
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Fundamentals of Algebra, Equations, and Matrices (Covers: Significant Figures, Factoring, Laws of Exponents, Linear/Quadratic/Cubic/Quartic Equations, and Matrices)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U1-T01-S1', topicId: 'CURR-BSIE3219-U1-T01', sequence: 1, officialName: 'Significant Figures and Factoring', normalizedName: 'Significant Figures and Factoring', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T01-S2', topicId: 'CURR-BSIE3219-U1-T01', sequence: 2, officialName: 'Laws of Exponents', normalizedName: 'Laws of Exponents', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T01-S3', topicId: 'CURR-BSIE3219-U1-T01', sequence: 3, officialName: 'Linear, Quadratic, Cubic, and Quartic Equations', normalizedName: 'Higher-Degree Polynomial Equations', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T01-S4', topicId: 'CURR-BSIE3219-U1-T01', sequence: 4, officialName: 'Matrices and Matrix Operations', normalizedName: 'Matrix Algebra and Determinants', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-BSIE3219-U1-T02',
    unitId: 'UNIT-BSIE3219-U1',
    courseId: 'COURSE-BSIE3219',
    sequence: 2,
    officialName: 'Complex Numbers, Vectors, and Applied Problem-Solving',
    normalizedName: 'Complex Numbers, Vectors, and Comprehensive Word Problems',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO2'],
    canonicalTopicId: 'TOP-DICT-008',
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Complex Numbers, Vectors, and Applied Problem-Solving (Covers: Complex Numbers & Operations, Vectors, Variation Problems, and Word Problems involving Numbers, Rates, Work, Age, Mixtures, Clocks, Geometry, and Investments)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U1-T02-S1', topicId: 'CURR-BSIE3219-U1-T02', sequence: 1, officialName: 'Complex Numbers & Operations', normalizedName: 'Complex Number Algebra', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T02-S2', topicId: 'CURR-BSIE3219-U1-T02', sequence: 2, officialName: 'Vectors and Vector Operations', normalizedName: 'Vector Mathematics', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T02-S3', topicId: 'CURR-BSIE3219-U1-T02', sequence: 3, officialName: 'Variation Problems', normalizedName: 'Variation Problems', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T02-S4', topicId: 'CURR-BSIE3219-U1-T02', sequence: 4, officialName: 'Word Problems (Numbers, Rates, Work, Age, Mixtures, Clocks, Geometry, Investments)', normalizedName: 'Comprehensive Word Problem Suite', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-BSIE3219-U1-T03',
    unitId: 'UNIT-BSIE3219-U1',
    courseId: 'COURSE-BSIE3219',
    sequence: 3,
    officialName: 'Advanced Algebra, Combinatorics, and Progressions',
    normalizedName: 'Binomial Theorem, Partial Fractions, Combinatorics, and Progressions',
    hours: 5,
    period: 'PRELIM',
    associatedLLOs: ['LLO3'],
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 1',
      rawTextExtract: 'Advanced Algebra, Combinatorics, and Progressions (Covers: Binomial Theorem, Partial Fractions, Permutations, Combinations, and Arithmetic/Geometric/Harmonic Progressions)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U1-T03-S1', topicId: 'CURR-BSIE3219-U1-T03', sequence: 1, officialName: 'Binomial Theorem', normalizedName: 'Binomial Theorem and Series Expansion', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T03-S2', topicId: 'CURR-BSIE3219-U1-T03', sequence: 2, officialName: 'Partial Fractions', normalizedName: 'Partial Fraction Decomposition', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T03-S3', topicId: 'CURR-BSIE3219-U1-T03', sequence: 3, officialName: 'Permutations and Combinations', normalizedName: 'Combinatorics (Permutations and Combinations)', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U1-T03-S4', topicId: 'CURR-BSIE3219-U1-T03', sequence: 4, officialName: 'Arithmetic, Geometric, and Harmonic Progressions', normalizedName: 'Mathematical Progressions and Series', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-BSIE3219-U2-T04',
    unitId: 'UNIT-BSIE3219-U2',
    courseId: 'COURSE-BSIE3219',
    sequence: 4,
    officialName: 'Trigonometry, Logarithms, and Basic Geometry',
    normalizedName: 'Trigonometry, Logarithms, Plane Areas, and Volumes',
    hours: 5,
    period: 'MIDTERM',
    associatedLLOs: ['LLO4'],
    canonicalTopicId: 'TOP-DICT-011',
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Trigonometry, Logarithms, and Basic Geometry (Covers: Trigonometry & Logarithms, Polygons, Plane Areas, Volumes, and the Cartesian Coordinate System)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U2-T04-S1', topicId: 'CURR-BSIE3219-U2-T04', sequence: 1, officialName: 'Trigonometry & Logarithms', normalizedName: 'Trigonometric and Logarithmic Foundations', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U2-T04-S2', topicId: 'CURR-BSIE3219-U2-T04', sequence: 2, officialName: 'Polygons, Plane Areas, and Volumes', normalizedName: 'Plane Areas and Solid Mensuration', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U2-T04-S3', topicId: 'CURR-BSIE3219-U2-T04', sequence: 3, officialName: 'Cartesian Coordinate System', normalizedName: 'Cartesian Coordinates', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-BSIE3219-U2-T05',
    unitId: 'UNIT-BSIE3219-U2',
    courseId: 'COURSE-BSIE3219',
    sequence: 5,
    officialName: 'Analytic Geometry and Conic Sections',
    normalizedName: 'Analytic Geometry, Conic Sections, and Solid Geometry',
    hours: 5,
    period: 'MIDTERM',
    associatedLLOs: ['LLO5'],
    canonicalTopicId: 'TOP-DICT-010',
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Analytic Geometry and Conic Sections (Covers: Straight Lines, Circles, Parabolas, Ellipses, Hyperbolas, Inclined Axes, and Solid Geometry)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U2-T05-S1', topicId: 'CURR-BSIE3219-U2-T05', sequence: 1, officialName: 'Straight Lines', normalizedName: 'Straight Lines and Linear Relations', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U2-T05-S2', topicId: 'CURR-BSIE3219-U2-T05', sequence: 2, officialName: 'Conic Sections (Circles, Parabolas, Ellipses, Hyperbolas)', normalizedName: 'Conic Sections Equations', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U2-T05-S3', topicId: 'CURR-BSIE3219-U2-T05', sequence: 3, officialName: 'Inclined Axes and Solid Geometry', normalizedName: 'Inclined Axes and 3D Geometry', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-BSIE3219-U2-T06',
    unitId: 'UNIT-BSIE3219-U2',
    courseId: 'COURSE-BSIE3219',
    sequence: 6,
    officialName: 'Fundamentals and Applications of Differential Calculus',
    normalizedName: 'Differential Calculus Foundations and Applications',
    hours: 5,
    period: 'MIDTERM',
    associatedLLOs: ['LLO6'],
    canonicalTopicId: 'TOP-DICT-002',
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 3',
      rawTextExtract: 'Fundamentals and Applications of Differential Calculus (Covers: Limits of a Function, Differentiation Formulas, Partial Differentiation, Differential Applications, Maxima/Minima, and Time Rates)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U2-T06-S1', topicId: 'CURR-BSIE3219-U2-T06', sequence: 1, officialName: 'Limits of a Function', normalizedName: 'Limits of Functions', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U2-T06-S2', topicId: 'CURR-BSIE3219-U2-T06', sequence: 2, officialName: 'Differentiation Formulas', normalizedName: 'Core Differentiation Formulas', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U2-T06-S3', topicId: 'CURR-BSIE3219-U2-T06', sequence: 3, officialName: 'Partial Differentiation', normalizedName: 'Partial Differentiation', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U2-T06-S4', topicId: 'CURR-BSIE3219-U2-T06', sequence: 4, officialName: 'Differential Applications (Maxima/Minima, Time Rates)', normalizedName: 'Optimization and Time Rates', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-BSIE3219-U3-T07',
    unitId: 'UNIT-BSIE3219-U3',
    courseId: 'COURSE-BSIE3219',
    sequence: 7,
    officialName: 'Integral Calculus and Introductory Engineering Economy',
    normalizedName: 'Integral Calculus and Time Value of Money',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO7'],
    canonicalTopicId: 'TOP-DICT-014',
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Integral Calculus and Introductory Engineering Economy (Covers: Integration Formulas, Plane Areas, Volumes of Revolution via Disk & Ring Methods, Simple & Compound Interest, and Nominal & Effective Rates)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U3-T07-S1', topicId: 'CURR-BSIE3219-U3-T07', sequence: 1, officialName: 'Integration Formulas', normalizedName: 'Indefinite and Definite Integration Formulas', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U3-T07-S2', topicId: 'CURR-BSIE3219-U3-T07', sequence: 2, officialName: 'Plane Areas and Volumes of Revolution (Disk & Ring)', normalizedName: 'Areas and Volumes of Revolution', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U3-T07-S3', topicId: 'CURR-BSIE3219-U3-T07', sequence: 3, officialName: 'Simple & Compound Interest, Nominal & Effective Rates', normalizedName: 'Interest Rates and Time Value of Money', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-BSIE3219-U3-T08',
    unitId: 'UNIT-BSIE3219-U3',
    courseId: 'COURSE-BSIE3219',
    sequence: 8,
    officialName: 'Advanced Cash Flow Analysis and Depreciation',
    normalizedName: 'Cash Flow Analysis, Annuities, and Asset Depreciation',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO8'],
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Advanced Cash Flow Analysis and Depreciation (Covers: Continuous Compounding & Decreasing Value, Breakeven Analysis, Annuities, Uniform Gradient Cash Flow, and Depreciation)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U3-T08-S1', topicId: 'CURR-BSIE3219-U3-T08', sequence: 1, officialName: 'Continuous Compounding and Breakeven Analysis', normalizedName: 'Continuous Compounding and Breakeven Analysis', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U3-T08-S2', topicId: 'CURR-BSIE3219-U3-T08', sequence: 2, officialName: 'Annuities and Uniform Gradient Cash Flows', normalizedName: 'Annuities and Gradient Cash Flows', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U3-T08-S3', topicId: 'CURR-BSIE3219-U3-T08', sequence: 3, officialName: 'Depreciation Methods (SL, SF, DB, SYD)', normalizedName: 'Asset Depreciation Methods', isExplicitInSource: true }
    ]
  },
  {
    id: 'CURR-BSIE3219-U3-T09',
    unitId: 'UNIT-BSIE3219-U3',
    courseId: 'COURSE-BSIE3219',
    sequence: 9,
    officialName: 'Economic Evaluation Methods and Applied Mechanics',
    normalizedName: 'Capital Evaluation, Statics, and Dynamics',
    hours: 5,
    period: 'FINAL',
    associatedLLOs: ['LLO9'],
    sourceReference: {
      syllabusId: 'SYL-006',
      filename: 'Topics.docx',
      tableReference: 'Table-35, Row 4',
      rawTextExtract: 'Economic Evaluation Methods and Applied Mechanics (Covers: Capital Recovery, Capitalized Cost, Bond Value Equations, Annual Cost & Benefit-To-Cost Ratios, Statics & Friction, and Rectilinear/Free-Falling/Circular/Projectile Motion)'
    },
    subtopics: [
      { id: 'SUB-BSIE3219-U3-T09-S1', topicId: 'CURR-BSIE3219-U3-T09', sequence: 1, officialName: 'Capital Recovery, Capitalized Cost, Bond Values, B/C Ratios', normalizedName: 'Project Economic Evaluation Methods', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U3-T09-S2', topicId: 'CURR-BSIE3219-U3-T09', sequence: 2, officialName: 'Engineering Mechanics: Statics & Friction', normalizedName: 'Statics Equilibrium and Friction', isExplicitInSource: true },
      { id: 'SUB-BSIE3219-U3-T09-S3', topicId: 'CURR-BSIE3219-U3-T09', sequence: 3, officialName: 'Engineering Mechanics: Kinematic Motion (Rectilinear, Free-Falling, Circular, Projectile)', normalizedName: 'Dynamics and Kinematics of Motion', isExplicitInSource: true }
    ]
  }
];
