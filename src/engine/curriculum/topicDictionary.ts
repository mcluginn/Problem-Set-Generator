import { TopicDictionaryEntry } from './types';

export const CANONICAL_TOPIC_DICTIONARY: TopicDictionaryEntry[] = [
  {
    id: 'TOP-DICT-001',
    canonicalConcept: 'Limits of Functions and Algebraic Continuity',
    relationship: 'RELATED',
    mappedTopicIds: ['CURR-GEN0102-U1-T02', 'CURR-GEN0102-U1-T03', 'CURR-BSIE3219-U2-T06'],
    notes: 'Foundational 6-hour treatment in Calculus 1 (GEN 0102); synthesized review in IE Special Topics 1 (BSIE 3219).'
  },
  {
    id: 'TOP-DICT-002',
    canonicalConcept: 'Differentiation Rules and Techniques (Algebraic & Transcendental)',
    relationship: 'NORMALIZED_MATCH',
    mappedTopicIds: [
      'CURR-GEN0102-U1-T04',
      'CURR-GEN0102-U2-T05',
      'CURR-GEN0102-U2-T06',
      'CURR-GEN0102-U2-T07',
      'CURR-BSIE3219-U2-T06'
    ],
    notes: 'Core rules (Power, Product, Quotient, Chain) and transcendental function derivatives.'
  },
  {
    id: 'TOP-DICT-003',
    canonicalConcept: 'Implicit Differentiation',
    relationship: 'PREREQUISITE',
    mappedTopicIds: ['CURR-GEN0102-U2-T08', 'CURR-GEN0107-U1-T02'],
    notes: 'Taught for slope computation in Calculus 1; applied for arbitrary constant elimination in Differential Equations.'
  },
  {
    id: 'TOP-DICT-004',
    canonicalConcept: 'Partial Differentiation',
    relationship: 'NORMALIZED_MATCH',
    mappedTopicIds: ['CURR-GEN0102-U2-T09', 'CURR-GEN0107-U2-T05', 'CURR-BSIE3219-U2-T06'],
    notes: 'Multivariable partials in Calculus 1, exactness testing in Differential Equations, and licensure review in BSIE 3219.'
  },
  {
    id: 'TOP-DICT-005',
    canonicalConcept: 'Extrema, Maxima/Minima, and Optimization',
    relationship: 'EXACT_MATCH',
    mappedTopicIds: ['CURR-GEN0102-U3-T13', 'CURR-BSIE3219-U2-T06'],
    notes: 'Mathematical optimization modeling using first and second derivative tests.'
  },
  {
    id: 'TOP-DICT-006',
    canonicalConcept: 'Related Rates / Time Rates of Change',
    relationship: 'EXACT_MATCH',
    mappedTopicIds: ['CURR-GEN0102-U3-T13', 'CURR-BSIE3219-U2-T06'],
    notes: 'Implicit differentiation with respect to time for geometric and physical systems.'
  },
  {
    id: 'TOP-DICT-007',
    canonicalConcept: 'Logarithmic and Exponential Functions & Growth/Decay Modeling',
    relationship: 'RELATED',
    mappedTopicIds: [
      'CURR-GEN0101-U2-T10',
      'CURR-GEN0102-U2-T07',
      'CURR-GEN0107-U2-T08',
      'CURR-BSIE3219-U2-T04'
    ],
    notes: 'Algebraic equations in GEN 0101 -> differential models in GEN 0102 -> 1st order ODE modeling in GEN 0107.'
  },
  {
    id: 'TOP-DICT-008',
    canonicalConcept: 'Algebraic Word Problems (Age, Work, Rate, Mixture, Clock)',
    relationship: 'EXACT_MATCH',
    mappedTopicIds: ['CURR-GEN0101-U1-T06', 'CURR-BSIE3219-U1-T02'],
    notes: 'Standard engineering word problems with identical taxonomy across foundational and review courses.'
  },
  {
    id: 'TOP-DICT-009',
    canonicalConcept: 'Rectangular Coordinates and Equations of Lines',
    relationship: 'EXACT_MATCH',
    mappedTopicIds: [
      'CURR-GEN0101-U3-T11',
      'CURR-GEN0101-U3-T12',
      'CURR-BSIE3219-U2-T04',
      'CURR-BSIE3219-U2-T05'
    ],
    notes: '2D Cartesian geometry, line forms, perpendicularity, distance formulas.'
  },
  {
    id: 'TOP-DICT-010',
    canonicalConcept: 'Analytic Geometry and Conic Sections',
    relationship: 'EXACT_MATCH',
    mappedTopicIds: ['CURR-BSIE3219-U2-T05'],
    notes: 'Conic sections (circles, parabolas, ellipses, hyperbolas) and coordinate transformations.'
  },
  {
    id: 'TOP-DICT-011',
    canonicalConcept: 'Trigonometry, Right Triangles, and Oblique Triangles',
    relationship: 'EXACT_MATCH',
    mappedTopicIds: [
      'CURR-GEN0101-U3-T13',
      'CURR-GEN0101-U3-T14',
      'CURR-GEN0101-U3-T15',
      'CURR-BSIE3219-U2-T04'
    ],
    notes: 'Right-triangle trigonometry, bearings, elevations, Sine Law, and Cosine Law.'
  },
  {
    id: 'TOP-DICT-012',
    canonicalConcept: 'Plane Areas and Solid Mensuration',
    relationship: 'EXACT_MATCH',
    mappedTopicIds: ['CURR-GEN0101-U3-T16', 'CURR-BSIE3219-U2-T04'],
    notes: 'Geometric formulas for areas of polygons/circles and volumes of 3D solids.'
  },
  {
    id: 'TOP-DICT-013',
    canonicalConcept: 'Thermal Physics and Heat Transfer (Physics vs. Thermodynamics)',
    relationship: 'DO_NOT_MERGE',
    mappedTopicIds: [
      'CURR-GEN0110-U1-T02',
      'CURR-GEN0110-U1-T03',
      'CURR-GEN0110-U1-T04',
      'CURR-GEN0161-U1-T02',
      'CURR-GEN0161-U1-T03',
      'CURR-GEN0161-U2-T06'
    ],
    notes: 'Empirical physics mechanisms kept strictly separate from control-volume thermodynamic property frameworks.'
  },
  {
    id: 'TOP-DICT-014',
    canonicalConcept: 'Integral Calculus (Areas, Volumes of Revolution)',
    relationship: 'COURSE_SPECIFIC',
    mappedTopicIds: ['CURR-BSIE3219-U3-T07'],
    notes: 'Indefinite and definite integration, disk/ring methods for volumes of revolution.'
  }
];
