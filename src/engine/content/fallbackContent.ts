import { LearningSkill } from '../curriculum/types';
import {
  AssessmentEvidenceTypeId,
  ContentContextType,
  ContentRepresentationType,
  DifficultyVector,
  DomainValidatorType,
  ProblemFamily,
  ProblemTemplate,
  StructuredHint,
  StructuredReasoningTraceStep
} from './types';
import { constant } from '../math/ast';

/**
 * Coverage-safe blueprints for curriculum skills that have not received a
 * hand-authored family yet. These are intentionally small, deterministic
 * representative items: they keep every authoritative scope usable while
 * the richer teacher-reviewed families are expanded.
 */

const DOMAIN_BY_COURSE: Record<string, DomainValidatorType> = {
  'COURSE-GEN0101': 'MATH_FOR_ENGINEERS',
  'COURSE-GEN0107': 'ODE',
  'COURSE-GEN0110': 'PHYSICS',
  'COURSE-GEN0161': 'THERMODYNAMICS',
  'COURSE-BSIE3219': 'IE_SPECIAL_TOPICS'
};

const CONTEXT_BY_DOMAIN: Record<DomainValidatorType, ContentContextType> = {
  MATH: 'PURE_MATHEMATICS',
  MATH_FOR_ENGINEERS: 'PURE_MATHEMATICS',
  ODE: 'GENERAL_ENGINEERING',
  PHYSICS: 'PHYSICS',
  THERMODYNAMICS: 'THERMODYNAMICS',
  IE_SPECIAL_TOPICS: 'INDUSTRIAL_ENGINEERING'
};

const REPRESENTATION_BY_DOMAIN: Record<DomainValidatorType, ContentRepresentationType> = {
  MATH: 'NUMERIC',
  MATH_FOR_ENGINEERS: 'NUMERIC',
  ODE: 'SYMBOLIC',
  PHYSICS: 'NUMERIC',
  THERMODYNAMICS: 'NUMERIC',
  IE_SPECIAL_TOPICS: 'NUMERIC'
};

function round(value: number, digits = 3): number {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

function numberParam(params: Record<string, any> | undefined, name: string, fallback: number): number {
  const value = Number(params?.[name]);
  return Number.isFinite(value) ? value : fallback;
}

function variantParam(params: Record<string, any> | undefined): number {
  return Math.max(0, Math.floor(numberParam(params, 'variant', 0))) % 6;
}

function makeTrace(prompt: string, method: string, answer: string): StructuredReasoningTraceStep[] {
  return [
    {
      stepIndex: 1,
      phase: 'RECOGNITION',
      actionDescription: `Identify the governing method: ${method}.`,
      pedagogicalRationale: `This is a representative coverage item for the skill: ${prompt}`
    },
    {
      stepIndex: 2,
      phase: 'EXECUTION',
      actionDescription: `Substitute the given values and simplify to ${answer}.`,
      intermediateExpressionLatex: answer,
      pedagogicalRationale: 'Keep units and signs consistent while carrying out the calculation.'
    },
    {
      stepIndex: 3,
      phase: 'VERIFICATION',
      actionDescription: 'Check that the result has the requested units and is physically or mathematically plausible.',
      pedagogicalRationale: 'A short verification catches common transcription and unit errors.'
    }
  ];
}

function makeHints(method: string): StructuredHint[] {
  return [
    { level: 1, category: 'RECOGNITION', text: `Start by identifying the ${method} formula or rule.`, revealsFinalAnswer: false },
    { level: 2, category: 'FORMULA', text: 'Write the formula first, then substitute the values from the prompt.', revealsFinalAnswer: false },
    { level: 3, category: 'SETUP', text: 'Simplify the substituted expression carefully, including units.', revealsFinalAnswer: false },
    { level: 4, category: 'GUIDED_CALCULATION', text: 'Compare your result with the displayed solution after submitting.', revealsFinalAnswer: false },
    { level: 5, category: 'GUIDED_CALCULATION', text: 'Use the worked solution to review each substitution step.', revealsFinalAnswer: false }
  ];
}

export function createFallbackFamily(
  skill: LearningSkill,
  primaryEvidence: AssessmentEvidenceTypeId = (skill.evidenceTypes[0] as AssessmentEvidenceTypeId) || 'DIRECT_CALCULATION'
): ProblemFamily {
  const domain = DOMAIN_BY_COURSE[skill.parentCourseId] || 'MATH';
  const id = `FAM-${skill.id}-COVERAGE`;
  return {
    id,
    courseId: skill.parentCourseId,
    primarySkillId: skill.id,
    supportingSkillIds: skill.prerequisiteSkillIds.slice(0, 3),
    name: `${skill.canonicalName} — Representative Practice`,
    description: `Coverage-safe representative problems for ${skill.canonicalName}.`,
    purpose: 'Ensures every authoritative curriculum skill has an eligible, validated starting problem while teacher-reviewed variants are expanded.',
    primaryEvidenceType: primaryEvidence,
    secondaryEvidenceTypes: skill.evidenceTypes.filter(e => e !== primaryEvidence) as AssessmentEvidenceTypeId[],
    supportedFormats: ['NUMERIC_INPUT', 'FREE_RESPONSE', 'MULTIPLE_CHOICE'],
    representationTypes: [REPRESENTATION_BY_DOMAIN[domain]],
    allowedContexts: [CONTEXT_BY_DOMAIN[domain]],
    difficultyRange: [1, 4],
    misconceptionTargets: ['FALLBACK_COVERAGE_CHECK'],
    prerequisiteRequirements: skill.prerequisiteSkillIds.slice(0, 3),
    templateIds: [`TMPL-${skill.id}-COVERAGE`],
    domainValidatorType: domain,
    status: 'REPRESENTATIVE_DRAFT'
  };
}

export function createFallbackTemplate(skill: LearningSkill, family: ProblemFamily): ProblemTemplate {
  const domain = family.domainValidatorType;
  return {
    id: family.templateIds[0],
    familyId: family.id,
    courseId: skill.parentCourseId,
    primarySkillId: skill.id,
    name: `${skill.canonicalName} representative calculation`,
    description: `A varied, low-friction representative item for ${skill.canonicalName}.`,
    parameterSchema: [
      { name: 'variant', type: 'CHOICE', choices: [0, 1, 2, 3, 4, 5], description: 'Structural variation selector' },
      { name: 'a', type: 'INTEGER', min: 2, max: 9, description: 'Primary positive value' },
      { name: 'b', type: 'INTEGER', min: 2, max: 9, description: 'Secondary positive value' },
      { name: 'c', type: 'INTEGER', min: 2, max: 9, description: 'Tertiary positive value' }
    ],
    generateCandidate(difficulty: number, params?: Record<string, any>) {
      const variant = variantParam(params);
      const a = Math.max(2, Math.floor(numberParam(params, 'a', 4)));
      const b = Math.max(2, Math.floor(numberParam(params, 'b', 6)));
      const c = Math.max(2, Math.floor(numberParam(params, 'c', 5)));
      let answer: number | string;
      let expressionLatex: string;
      let promptText: string;
      let method: string;
      let physicalUnits: string | undefined;
      let targetVariable = 'answer';
      let independentVariable = 'x';

      switch (skill.id) {
        case 'SKILL-GEN0101-002': {
          const common = 2 + (variant % 3);
          const left = common * (3 + (a % 3));
          const right = common * (5 + (b % 3));
          answer = common;
          expressionLatex = `\\gcd(${left},${right})`;
          promptText = `Find the greatest common divisor of ${left} and ${right} using prime factorization.`;
          method = 'prime factorization and GCD';
          break;
        }
        case 'SKILL-GEN0101-003': {
          const n = round((1 + (variant % 3)) / 2 + 1 / 4);
          answer = n;
          expressionLatex = `\\frac{${1 + (variant % 3)}}{2}+\\frac{1}{4}`;
          promptText = `Compute the rational-fraction sum ${expressionLatex} and give the simplified decimal value.`;
          method = 'common denominators and fraction simplification';
          break;
        }
        case 'SKILL-GEN0101-005': {
          const p = 2 + (variant % 4);
          const q = 3 + (a % 4);
          answer = p * q;
          expressionLatex = `x^2+${p + q}x+${p * q}`;
          promptText = `For ${expressionLatex}=0, factor the polynomial and report the product of its two roots.`;
          method = 'polynomial factoring';
          break;
        }
        case 'SKILL-GEN0101-007': {
          const t1 = 3 + (a % 4);
          const t2 = 4 + (b % 4);
          answer = round(1 / (1 / t1 + 1 / t2));
          expressionLatex = `T=\\frac{1}{\\frac{1}{${t1}}+\\frac{1}{${t2}}}`;
          promptText = `Two pumps complete a job in ${t1} h and ${t2} h separately. If they run together, find the completion time in hours.`;
          method = 'combined work-rate model';
          physicalUnits = 'hours';
          break;
        }
        case 'SKILL-GEN0101-011': {
          const base = 2 + (variant % 2);
          const exponent = 2 + (a % 3);
          const value = base ** exponent;
          answer = exponent;
          expressionLatex = `${base}^{x}=${value}`;
          promptText = `Solve the exponential equation ${expressionLatex} for x.`;
          method = 'exponential and logarithmic laws';
          break;
        }
        case 'SKILL-GEN0101-012':
        case 'SKILL-GEN0101-017': {
          const dx = 2 + (variant % 4);
          const slope = 1 + (b % 4);
          const dy = dx * slope;
          answer = slope;
          expressionLatex = `m=\\frac{${dy}-0}{${dx}-0}`;
          promptText = `Find the slope of the line through the points (0,0) and (${dx},${dy}).`;
          method = 'coordinate slope formula';
          break;
        }
        case 'SKILL-GEN0101-013': {
          const legA = 3 + (variant % 2);
          const legB = 4;
          answer = Math.sqrt(legA * legA + legB * legB);
          answer = round(answer);
          expressionLatex = `c=\\sqrt{${legA}^2+${legB}^2}`;
          promptText = `A right triangle has perpendicular sides ${legA} and ${legB}. Find the hypotenuse length.`;
          method = 'Pythagorean theorem';
          physicalUnits = 'units';
          break;
        }
        case 'SKILL-GEN0101-014': {
          const distance = 5 + (a % 5);
          answer = distance;
          expressionLatex = `h=${distance}\\tan(45^\\circ)`;
          promptText = `A surveyor is ${distance} m from a tower and measures a 45° angle of elevation. Find the tower height in meters.`;
          method = 'angle-of-elevation trigonometry';
          physicalUnits = 'meters';
          break;
        }
        case 'SKILL-GEN0107-003': {
          const k = 1 + (variant % 4);
          answer = `y(x)=Ce^{${k}x}`;
          expressionLatex = `\\frac{dy}{dx}=${k}y`;
          promptText = `Solve the separable first-order ODE ${expressionLatex} and include the arbitrary constant.`;
          method = 'separation of variables';
          targetVariable = 'y';
          independentVariable = 'x';
          break;
        }
        case 'SKILL-GEN0107-007': {
          answer = 'v=y^{1-n}';
          expressionLatex = `y'+${a}y=${a}y^2`;
          promptText = `For the Bernoulli equation ${expressionLatex}, state the linearizing substitution.`;
          method = 'Bernoulli linearizing substitution';
          targetVariable = 'y';
          independentVariable = 'x';
          break;
        }
        case 'SKILL-GEN0107-008': {
          const ambient = 20 + (variant * 2);
          const initial = ambient + 30;
          const k = 1 + (a % 3);
          answer = `T(t)=${ambient}+${initial - ambient}e^{-${k}t}`;
          expressionLatex = `\\frac{dT}{dt}=-${k}(T-${ambient})`;
          promptText = `A body cools toward ${ambient} °C according to ${expressionLatex}, with T(0)=${initial} °C. State T(t).`;
          method = 'Newton cooling model';
          physicalUnits = '°C';
          targetVariable = 'T';
          independentVariable = 't';
          break;
        }
        case 'SKILL-GEN0107-010': {
          const k = 1 + (variant % 3);
          answer = `s^2+${k}`;
          expressionLatex = `\\frac{dx}{dt}+${k}y=0, \\quad \\frac{dy}{dt}-x=0`;
          promptText = `Set up the characteristic s-domain determinant for the coupled system ${expressionLatex}.`;
          method = 'Laplace system determinant';
          targetVariable = 's';
          independentVariable = 't';
          break;
        }
        case 'SKILL-GEN0107-011': {
          const aVal = 1 + (variant % 4);
          answer = `e^{${aVal}t}`;
          expressionLatex = `\\mathcal{L}^{-1}\\left\\{\\frac{1}{s-${aVal}}\\right\\}`;
          promptText = `Compute the inverse Laplace transform ${expressionLatex}.`;
          method = 'inverse Laplace transform table lookup';
          targetVariable = 't';
          independentVariable = 's';
          break;
        }
        case 'SKILL-GEN0110-003': {
          const mass = 2 + (variant % 3);
          const heatCapacity = 4 + (a % 3);
          const deltaT = 5 + (b % 4);
          answer = mass * heatCapacity * deltaT;
          expressionLatex = `Q=mc\\Delta T`;
          promptText = `A ${mass} kg sample with specific heat ${heatCapacity} kJ/(kg·K) warms by ${deltaT} K. Find the heat transfer Q in kJ.`;
          method = 'calorimetry energy balance';
          physicalUnits = 'kJ';
          break;
        }
        case 'SKILL-GEN0110-004': {
          const alpha = 1 + (variant % 3);
          const length = 2 + (a % 4);
          const deltaT = 10 + (b % 4) * 5;
          answer = alpha * length * deltaT;
          expressionLatex = `\\Delta L=\\alpha L\\Delta T`;
          promptText = `A ${length} m member has α=${alpha}×10⁻⁶/K and is heated by ${deltaT} K. Report ΔL in μm.`;
          method = 'linear thermal expansion';
          physicalUnits = 'μm';
          break;
        }
        case 'SKILL-GEN0110-008': {
          const voltage = 12 + (variant * 3);
          const resistance = 3 + (a % 4);
          answer = round(voltage / resistance);
          expressionLatex = `I=\\frac{V}{R}`;
          promptText = `A ${voltage} V source is connected to a ${resistance} Ω resistor. Find the current I in amperes.`;
          method = 'Ohm\'s law';
          physicalUnits = 'A';
          break;
        }
        case 'SKILL-GEN0161-001':
          answer = variant % 2 === 0 ? 'Closed system' : 'Open system';
          expressionLatex = '\\text{system classification}';
          promptText = 'A sealed piston-cylinder has no mass crossing its boundary. Classify the thermodynamic system.';
          method = 'system-boundary classification';
          break;
        case 'SKILL-GEN0161-008': {
          const hot = 500 + (variant * 20);
          const cold = 300;
          answer = round(1 - cold / hot, 4);
          expressionLatex = `\\eta=1-\\frac{T_L}{T_H}`;
          promptText = `For a modified vapor power cycle with source at ${hot} K and sink at ${cold} K, calculate the ideal upper-bound efficiency.`;
          method = 'thermal-cycle efficiency comparison';
          break;
        }
        case 'SKILL-BSIE3219-003': {
          const n = 5 + (variant % 4);
          const r = 2 + (a % 2);
          let combination = 1;
          for (let i = 1; i <= r; i++) combination *= (n - r + i) / i;
          answer = combination;
          expressionLatex = `\\binom{${n}}{${r}}`;
          promptText = `How many ${r}-item combinations can be selected from ${n} distinct items?`;
          method = 'combinations formula';
          break;
        }
        case 'SKILL-BSIE3219-008': {
          const cost = 12000 + (variant * 500);
          const salvage = 2000;
          const life = 5 + (a % 3);
          answer = round((cost - salvage) / life, 2);
          expressionLatex = `d=\\frac{C-S}{n}`;
          promptText = `An asset costs $${cost.toLocaleString()} with $${salvage.toLocaleString()} salvage value and ${life} years of life. Find annual straight-line depreciation in dollars.`;
          method = 'straight-line depreciation';
          physicalUnits = 'dollars/year';
          break;
        }
        case 'SKILL-BSIE3219-010': {
          const acceleration = 2 + (variant % 3);
          const time = 3 + (a % 3);
          answer = 0.5 * acceleration * time * time;
          expressionLatex = `s=\\frac{1}{2}at^2`;
          promptText = `A cart starts from rest and accelerates at ${acceleration} m/s² for ${time} s. Find its displacement in meters.`;
          method = 'constant-acceleration kinematics';
          physicalUnits = 'meters';
          break;
        }
        default: {
          if (skill.parentCourseId === 'COURSE-GEN0107') {
            const k = 1 + (variant % 4);
            answer = `y(x)=Ce^{${k}x}`;
            expressionLatex = `\\frac{dy}{dx}=${k}y`;
            promptText = `Solve the differential equation ${expressionLatex} and include the arbitrary constant.`;
            method = 'separation of variables';
            targetVariable = 'y';
            independentVariable = 'x';
          } else {
            const result = a + b + c + variant;
            answer = result;
            expressionLatex = `A+B+C=${result}`;
            promptText = `Complete a representative calculation for the skill “${skill.canonicalName}”: add ${a}, ${b}, and ${c}.`;
            method = 'direct calculation';
          }
        }
      }

      const answerText = String(answer);
      const trace = makeTrace(promptText, method, answerText);
      const hints = makeHints(method);
      const overall = Math.max(1, Math.min(5, Math.round(Number(difficulty) || 2)));
      const difficultyVector: DifficultyVector = {
        overall,
        conceptual: Math.min(5, overall),
        procedural: Math.min(5, overall),
        computational: Math.min(5, overall),
        reasoning: Math.min(5, overall),
        representation: 1,
        context: domain === 'MATH_FOR_ENGINEERS' ? 2 : 3,
        multiStep: Math.min(5, Math.max(1, overall - 1))
      };

      return {
        statement: {
          promptText,
          expressionLatex,
          targetVariable,
          independentVariable,
          physicalUnits
        },
        rawExpression: constant(typeof answer === 'number' ? answer : 1),
        reasoningTrace: trace,
        hints,
        difficultyVector,
        structureSignature: `COVERAGE:${skill.id}:V${variant}:A${a}:B${b}:C${c}`,
        supportingSkillIds: skill.prerequisiteSkillIds.slice(0, 3),
        misconceptionTarget: 'FALLBACK_COVERAGE_CHECK',
        canonicalAnswerLatex: answerText,
        canonicalAnswerRaw: answerText,
        solutionSteps: trace.map((step, index) => ({
          stepNumber: index + 1,
          title: step.phase,
          ruleName: method,
          expressionLatex: step.intermediateExpressionLatex || '',
          explanation: step.actionDescription,
          conceptualNote: step.pedagogicalRationale
        }))
      } as any;
    }
  };
}

export function fallbackDomainForCourse(courseId: string): DomainValidatorType {
  return DOMAIN_BY_COURSE[courseId] || 'MATH';
}
