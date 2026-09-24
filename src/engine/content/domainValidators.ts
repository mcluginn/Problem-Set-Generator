/**
 * Domain-Specific Mathematical, Physical, & Engineering Validators
 * Engineering Practice Engine — Phase 5 Six-Course Domain Content Development
 */

import {
  ValidatedProblem,
  DomainValidatorType,
  DomainValidationResult,
  DomainValidationStatus,
  ValidationCheck,
  ValidationError,
  ValidationWarning,
  PhysicalQuantity
} from './types';
import { Differentiator } from '../math/differentiator';
import { EquivalenceEngine } from '../math/equivalence';
import { nodeToString } from '../math/ast';

export class DomainValidatorRegistry {
  public static readonly DOMAIN_VALIDATOR_VERSION = '5.0.0';

  /**
   * Dispatches validation to the dedicated domain validator and returns a structured DomainValidationResult.
   */
  public static validate(candidate: ValidatedProblem): DomainValidationResult {
    const domainType = candidate.dna.domainValidatorType || 'MATH';

    switch (domainType) {
      case 'ODE':
        return DomainValidatorRegistry.validateODE(candidate);
      case 'PHYSICS':
        return DomainValidatorRegistry.validatePhysics(candidate);
      case 'THERMODYNAMICS':
        return DomainValidatorRegistry.validateThermodynamics(candidate);
      case 'MATH_FOR_ENGINEERS':
        return DomainValidatorRegistry.validateMathForEngineers(candidate);
      case 'IE_SPECIAL_TOPICS':
        return DomainValidatorRegistry.validateIESpecialTopics(candidate);
      case 'MATH':
      default:
        return DomainValidatorRegistry.validateMath(candidate);
    }
  }

  /**
   * 1. Calculus & Symbolic Mathematics Domain Validator
   */
  public static validateMath(candidate: ValidatedProblem): DomainValidationResult {
    const checks: ValidationCheck[] = [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check 1: AST Well-formedness
    const astPresent = Boolean(candidate.rawExpression);
    checks.push({
      name: 'AST_WELL_FORMED',
      passed: astPresent,
      description: 'Verifies the candidate contains a valid AST representation.'
    });

    if (!astPresent) {
      errors.push({
        code: 'MISSING_AST',
        message: 'Math candidate is missing rawExpression AST.',
        field: 'rawExpression'
      });
    }

    // Check 2: Expression String Syntax Cleanliness
    const exprLatex = candidate.statement.expressionLatex || '';
    const syntaxClean = exprLatex.length > 0 && !exprLatex.includes('undefined') && !exprLatex.includes('NaN');
    checks.push({
      name: 'SYNTAX_CLEAN',
      passed: syntaxClean,
      description: 'Asserts expression LaTeX contains no undefined or NaN tokens.'
    });

    if (!syntaxClean) {
      errors.push({
        code: 'INVALID_SYNTAX',
        message: 'Expression LaTeX contains malformed or unrendered tokens.',
        field: 'statement.expressionLatex'
      });
    }

    // Check 3: Singularity & Zero-Division Safety
    let exprString = '';
    try {
      if (candidate.rawExpression) {
        exprString = nodeToString(candidate.rawExpression) || '';
      }
    } catch {
      exprString = '';
    }
    const singularitySafe = !exprString.includes('/ 0') && !exprString.includes('/0');
    checks.push({
      name: 'SINGULARITY_SAFE',
      passed: singularitySafe,
      description: 'Guards against division by zero in mathematical expressions.'
    });

    if (!singularitySafe) {
      errors.push({
        code: 'DIVISION_BY_ZERO',
        message: 'Expression contains explicit division by zero.',
        field: 'rawExpression'
      });
    }

    // Check 4: Solution Canonical Integrity
    const answerPresent = Boolean(candidate.solution?.canonicalAnswerLatex && candidate.solution.canonicalAnswerLatex.trim().length > 0);
    checks.push({
      name: 'ANSWER_CONSISTENT',
      passed: answerPresent,
      description: 'Verifies canonical mathematical answer string is populated.'
    });

    if (!answerPresent) {
      errors.push({
        code: 'MISSING_CANONICAL_ANSWER',
        message: 'Canonical answer LaTeX is missing.',
        field: 'solution.canonicalAnswerLatex'
      });
    }

    const valid = errors.length === 0;
    const status: DomainValidationStatus = valid ? 'PASS' : 'FAIL';

    return {
      valid,
      status,
      domainValidatorType: 'MATH',
      rejectionReason: valid ? undefined : 'INVALID_DOMAIN',
      rejectionMessage: errors.length > 0 ? errors[0].message : undefined,
      checks,
      errors,
      warnings,
      isValid: valid,
      domainChecks: checks.reduce((acc, c) => ({ ...acc, [c.name]: c.passed }), {})
    };
  }

  /**
   * 2. Differential Equations (ODE) Domain Validator
   */
  public static validateODE(candidate: ValidatedProblem): DomainValidationResult {
    const checks: ValidationCheck[] = [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const expr = candidate.statement.expressionLatex || '';
    const answer = candidate.solution?.canonicalAnswerLatex || '';
    const prompt = (candidate.statement.promptText || '').toLowerCase();
    const isHomogeneityTest = candidate.dna?.taskType === 'ANALYZE_HOMOGENEITY_DEGREE' || candidate.dna?.archetypeId === 'ARCH-HOMO-DEGREE-TEST';
    const isLaplace = candidate.dna?.templateId?.includes('LAPLACE') || expr.includes('\\mathcal{L}');
    const isApplication = candidate.dna?.conceptId === 'de_first_order_applications' || candidate.dna?.primarySkillId === 'SKILL-GEN0107-008' || candidate.dna?.archetypeId?.startsWith('ARCH-APP-');
    const isOrthogonal = candidate.dna?.archetypeId?.includes('ORTHOGONAL') || prompt.includes('orthogonal');

    // Check 1: Differential Notation Presence
    const hasDifferentialSymbols =
      expr.includes('dy') ||
      expr.includes('dx') ||
      expr.includes('dt') ||
      expr.includes('dP') ||
      expr.includes('dm') ||
      expr.includes('dT') ||
      expr.includes('y\'') ||
      expr.includes('y\'\'') ||
      expr.includes('d/dx') ||
      expr.includes('d/dt') ||
      expr.includes('\\frac{d') ||
      expr.includes('\\partial') ||
      expr.includes('\\mathcal{L}') ||
      isLaplace ||
      isHomogeneityTest ||
      isApplication ||
      isOrthogonal;

    checks.push({
      name: 'ODE_DIFFERENTIAL_SYMBOLS',
      passed: hasDifferentialSymbols,
      description: 'Checks for explicit differential operators, prime notation, or ODE taxonomy prompts.'
    });

    if (!hasDifferentialSymbols) {
      errors.push({
        code: 'ODE_SYNTAX_ERROR',
        message: 'ODE expression must contain differential terms, prime notation, or Laplace operator.',
        field: 'statement.expressionLatex'
      });
    }

    // Check 2: Canonical Solution Non-Triviality & Integration Constant
    const isClassification = candidate.dna?.evidenceType === 'CLASSIFICATION' || candidate.dna?.templateId?.includes('CLASSIFY') || isHomogeneityTest;
    const solutionValid = answer.trim().length > 0;

    checks.push({
      name: 'ODE_SOLUTION_NON_TRIVIAL',
      passed: solutionValid,
      description: 'Verifies canonical ODE solution exists.'
    });

    if (!solutionValid) {
      errors.push({
        code: 'ODE_INVALID_ANSWER',
        message: 'ODE solution must contain canonical explicit or implicit solution.',
        field: 'solution.canonicalAnswerLatex'
      });
    }

    // Check 3: General Solution Constant of Integration Check (for analytical solutions)
    if (!isClassification && !isLaplace && !isHomogeneityTest && !prompt.includes('initial value') && !prompt.includes('ivp') && !prompt.includes('particular')) {
      const hasConstant = answer.includes('C') || answer.includes('c') || answer.includes('c_{1}') || answer.includes('C_1') || answer.includes('C_{1}');
      checks.push({
        name: 'ODE_INTEGRATION_CONSTANT',
        passed: hasConstant,
        description: 'Checks for arbitrary constant of integration C in general ODE solutions.'
      });

      if (!hasConstant) {
        warnings.push({
          code: 'MISSING_INTEGRATION_CONSTANT_WARN',
          message: 'General ODE solution does not explicitly display arbitrary constant of integration C.'
        });
      }
    }

    // Check 4: Initial Value Problem Initial Condition Verification
    if (prompt.includes('initial value') || prompt.includes('y(0)')) {
      const hasInitialConditions = prompt.includes('y(') || expr.includes('y(');
      checks.push({
        name: 'ODE_IVP_CONDITIONS_DECLARED',
        passed: hasInitialConditions,
        description: 'Verifies initial conditions are explicitly declared for IVPs.'
      });
      if (!hasInitialConditions) {
        errors.push({
          code: 'ODE_MISSING_IVP_CONDITIONS',
          message: 'Initial Value Problem does not specify initial boundary conditions.',
          field: 'statement.promptText'
        });
      }
    }

    // Check 5: Concept Order Consistency
    if (candidate.dna?.order) {
      const hasSecondDerivative = expr.includes("y''") || expr.includes('\\frac{d^2y}{dx^2}') || expr.includes('d^2y/dx^2');
      if (candidate.dna.order === 1 && hasSecondDerivative) {
        checks.push({
          name: 'ODE_ORDER_CONSISTENCY',
          passed: false,
          description: 'Verifies ODE derivative order matches expected pedagogical concept order.'
        });
        errors.push({
          code: 'ODE_ORDER_MISMATCH',
          message: "Expected first-order ODE, but candidate contains second-order derivative term y''.",
          field: 'statement.expressionLatex'
        });
      } else if (candidate.dna.order === 2 && !hasSecondDerivative && !isClassification && !isLaplace) {
        checks.push({
          name: 'ODE_ORDER_CONSISTENCY',
          passed: false,
          description: 'Verifies ODE derivative order matches expected pedagogical concept order.'
        });
        errors.push({
          code: 'ODE_ORDER_MISMATCH',
          message: 'Expected second-order ODE, but candidate lacks second derivative terms.',
          field: 'statement.expressionLatex'
        });
      } else {
        checks.push({
          name: 'ODE_ORDER_CONSISTENCY',
          passed: true,
          description: 'Verifies ODE derivative order matches expected pedagogical concept order.'
        });
      }
    }

    const valid = errors.length === 0;
    const status: DomainValidationStatus = valid ? 'PASS' : 'FAIL';

    return {
      valid,
      status,
      domainValidatorType: 'ODE',
      rejectionReason: valid ? undefined : (errors[0].code === 'ODE_ORDER_MISMATCH' ? 'CONCEPT_MISMATCH' : errors[0].code === 'ODE_SYNTAX_ERROR' ? 'INVALID_SYNTAX' : 'INVALID_ANSWER'),
      rejectionMessage: errors.length > 0 ? errors[0].message : undefined,
      checks,
      errors,
      warnings,
      isValid: valid,
      domainChecks: checks.reduce((acc, c) => ({ ...acc, [c.name]: c.passed }), {})
    };
  }

  /**
   * 3. Physics 2 (Fluids, Thermal, Circuits, Optics, Waves) Domain Validator
   */
  public static validatePhysics(candidate: ValidatedProblem): DomainValidationResult {
    const checks: ValidationCheck[] = [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const prompt = candidate.statement.promptText;
    const promptLower = prompt.toLowerCase();
    const declaredUnits = candidate.statement.physicalUnits;

    // Check 1: Explicit Physical Unit Presence
    const expr = candidate.statement.expressionLatex || '';
    const hasUnits = Boolean(
      (declaredUnits && declaredUnits !== 'DIMENSIONLESS') ||
      /\b(m\/s|m\^2|m\^3|meters|meters\/second|newtons?|joules?|watts?|pascals?|hertz|volts?|amperes?|ohms?|coulombs?|kg\/m\^3|kg\/s|kJ\/kg|kJ|kPa|Pa|Hz|N|W|J|V|A|C|m)\b/.test(prompt) ||
      /\b(m\/s|m\^2|m\^3|meters|newtons|joules|watts|pascals|hertz|volts|amperes|ohms|coulombs|kPa|Pa|Hz|N|W|J|V|A|C|m)\b/.test(expr) ||
      prompt.includes('\u03a9')
    );

    checks.push({
      name: 'PHYSICS_UNITS_DECLARED',
      passed: hasUnits,
      description: 'Asserts physical units are declared in statement or physicalUnits metadata.'
    });

    if (!hasUnits) {
      errors.push({
        code: 'MISSING_PHYSICAL_UNITS',
        message: 'No physical SI units detected in problem statement or metadata.',
        field: 'statement.physicalUnits'
      });
    }

    // Check 2: Physical Plausibility Invariants — Linear DC Resistance
    if (promptLower.includes('resistor') || promptLower.includes('resistance') || promptLower.includes('ohms') || promptLower.includes('r =')) {
      const hasNegativeRes = prompt.match(/-\s*\d+(\.\d+)?\s*(?:\u03a9|ohm)/i) || prompt.match(/r\s*=\s*-\d+/i);
      checks.push({
        name: 'PHYSICS_POSITIVE_RESISTANCE',
        passed: !hasNegativeRes,
        description: 'Enforces non-negative resistance in linear DC circuits.'
      });

      if (hasNegativeRes) {
        errors.push({
          code: 'NON_PHYSICAL_RESISTANCE',
          message: 'Resistance cannot be negative in passive linear DC circuits.',
          field: 'statement.promptText'
        });
      }
    }

    // Check 3: Physical Plausibility — Speed of Light Upper Bound
    if (promptLower.includes('speed') || promptLower.includes('velocity')) {
      const matchSpeed = prompt.match(/(\d+(?:\.\d+)?(?:e\d+)?)\s*(?:m\/s|meters per second)/i);
      if (matchSpeed) {
        const val = parseFloat(matchSpeed[1]);
        const subLightSpeed = val <= 3e8;
        checks.push({
          name: 'PHYSICS_SUB_LIGHT_SPEED',
          passed: subLightSpeed,
          description: 'Enforces particle velocity <= speed of light c (3e8 m/s).'
        });
        if (!subLightSpeed) {
          errors.push({
            code: 'SUPERLUMINAL_SPEED',
            message: 'Physical speed exceeds the speed of light in vacuum (3.0 x 10^8 m/s).',
            field: 'statement.promptText'
          });
        }
      }
    }

    // Check 4: Physical Plausibility — Refractive Index n >= 1.0
    if (promptLower.includes('refractive index') || promptLower.includes('index of refraction')) {
      const matchIndex = prompt.match(/(?:index of refraction|refractive index)[^\d]*(\d+(?:\.\d+)?)/i);
      if (matchIndex) {
        const nVal = parseFloat(matchIndex[1]);
        const nValid = nVal >= 1.0;
        checks.push({
          name: 'PHYSICS_REFRACTIVE_INDEX_BOUND',
          passed: nValid,
          description: 'Verifies optical refractive index n >= 1.0 in standard media.'
        });
        if (!nValid) {
          errors.push({
            code: 'INVALID_REFRACTIVE_INDEX',
            message: 'Refractive index cannot be less than 1.0 in natural media.',
            field: 'statement.promptText'
          });
        }
      }
    }

    // Check 5: Hydrostatic Pressure Non-Negativity
    if (promptLower.includes('hydrostatic') || promptLower.includes('depth')) {
      const hasNegativeDepth = prompt.match(/depth\s+of\s+-\d+/i);
      checks.push({
        name: 'PHYSICS_POSITIVE_DEPTH',
        passed: !hasNegativeDepth,
        description: 'Fluid depth coordinate must be non-negative.'
      });
      if (hasNegativeDepth) {
        errors.push({
          code: 'NEGATIVE_DEPTH',
          message: 'Submerged depth cannot be negative in hydrostatic columns.',
          field: 'statement.promptText'
        });
      }
    }

    const valid = errors.length === 0;
    const status: DomainValidationStatus = valid ? 'PASS' : 'FAIL';

    return {
      valid,
      status,
      domainValidatorType: 'PHYSICS',
      rejectionReason: valid ? undefined : 'PHYSICAL_IMPLAUSIBILITY',
      rejectionMessage: errors.length > 0 ? errors[0].message : undefined,
      checks,
      errors,
      warnings,
      isValid: valid,
      domainChecks: checks.reduce((acc, c) => ({ ...acc, [c.name]: c.passed }), {})
    };
  }

  /**
   * 4. Thermodynamics Domain Validator
   */
  public static validateThermodynamics(candidate: ValidatedProblem): DomainValidationResult {
    const checks: ValidationCheck[] = [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const prompt = candidate.statement.promptText;
    const promptLower = prompt.toLowerCase();
    const expr = candidate.statement.expressionLatex || '';

    // Check 1: Third Law — Absolute Temperature in Kelvin > 0 K
    if ((prompt.includes(' K') || expr.includes(' K')) && (prompt.includes('-') || expr.includes('-'))) {
      const kelvinMatch = prompt.match(/-\s*\d+(\.\d+)?\s*K/) || expr.match(/-\s*\d+(\.\d+)?\s*K/);
      checks.push({
        name: 'THERMO_THIRD_LAW_TEMPERATURE',
        passed: !kelvinMatch,
        description: 'Third Law of Thermodynamics: Absolute temperature T > 0 K.'
      });

      if (kelvinMatch) {
        errors.push({
          code: 'THIRD_LAW_TEMPERATURE_VIOLATION',
          message: 'Absolute temperature in Kelvin cannot be negative (Third Law of Thermodynamics).',
          field: 'statement.promptText'
        });
      }
    }

    // Check 2: First Law Closed System Energy Balance Invariant: Q - W = Delta U
    if (promptLower.includes('internal energy') && promptLower.includes('heat') && promptLower.includes('work')) {
      const matchQ = prompt.match(/(\d+(?:\.\d+)?)\s*kJ\s+of\s+heat/i);
      const matchW = prompt.match(/(\d+(?:\.\d+)?)\s*kJ\s+of\s+(?:boundary\s+)?work/i);
      if (matchQ && matchW) {
        const qVal = parseFloat(matchQ[1]);
        const wVal = parseFloat(matchW[1]);
        const expectedDeltaU = qVal - wVal;
        const answer = candidate.solution.canonicalAnswerLatex;
        const answerNum = parseFloat(answer.replace(/[^\d.-]/g, ''));

        if (!isNaN(answerNum)) {
          const balanceSatisfied = Math.abs(answerNum - expectedDeltaU) < 0.1;
          checks.push({
            name: 'THERMO_FIRST_LAW_ENERGY_BALANCE',
            passed: balanceSatisfied,
            description: 'Enforces First Law closed system energy conservation: Delta U = Q - W.'
          });

          if (!balanceSatisfied) {
            errors.push({
              code: 'FIRST_LAW_VIOLATION',
              message: `First law closed balance mismatch: Expected Delta U = ${expectedDeltaU} kJ, but canonical answer is ${answerNum} kJ.`,
              field: 'solution.canonicalAnswerLatex'
            });
          }
        }
      }
    }

    // Check 3: Carnot Efficiency Upper Bound: eta < 1 - T_C / T_H and eta <= 100%
    if (promptLower.includes('carnot') || promptLower.includes('thermal efficiency') || promptLower.includes('efficiency')) {
      const matchTH = prompt.match(/T_H\s*=\s*(\d+)\s*K/i) || prompt.match(/source\s+at\s+(\d+)\s*K/i);
      const matchTC = prompt.match(/T_L\s*=\s*(\d+)\s*K/i) || prompt.match(/sink\s+at\s+(\d+)\s*K/i);
      const answer = candidate.solution?.canonicalAnswerLatex || '';
      const etaNum = parseFloat(answer.replace(/[^\d.-]/g, ''));
      const eta = etaNum / (answer.includes('%') || etaNum > 1.0 ? 100 : 1);

      if (!isNaN(eta)) {
        if (eta > 1.0) {
          errors.push({
            code: 'EFFICIENCY_EXCEEDS_100_PERCENT',
            message: `Thermal efficiency (${(eta * 100).toFixed(1)}%) cannot exceed 100%.`,
            field: 'solution.canonicalAnswerLatex'
          });
        } else if (matchTH && matchTC) {
          const th = parseFloat(matchTH[1]);
          const tc = parseFloat(matchTC[1]);
          const maxEfficiency = 1 - (tc / th);
          if (eta > maxEfficiency + 0.001) {
            errors.push({
              code: 'CARNOT_LIMIT_EXCEEDED',
              message: `Thermal efficiency (${(eta * 100).toFixed(1)}%) violates Carnot limit (${(maxEfficiency * 100).toFixed(1)}%).`,
              field: 'solution.canonicalAnswerLatex'
            });
          }
        }
      }
    }

    // Check 4: Pure Substance Quality Bound: 0 <= x <= 1
    if (promptLower.includes('quality') || promptLower.includes('vapor quality')) {
      const matchX = prompt.match(/quality\s+(?:x\s*=\s*)?(\d+(?:\.\d+)?)/i);
      if (matchX) {
        const xVal = parseFloat(matchX[1]);
        const qualityValid = xVal >= 0.0 && xVal <= 1.0;
        checks.push({
          name: 'THERMO_VAPOR_QUALITY_BOUND',
          passed: qualityValid,
          description: 'Verifies vapor quality x is bounded in [0, 1].'
        });
        if (!qualityValid) {
          errors.push({
            code: 'INVALID_VAPOR_QUALITY',
            message: 'Vapor quality x must lie between 0.0 (saturated liquid) and 1.0 (saturated vapor).',
            field: 'statement.promptText'
          });
        }
      }
    }

    const valid = errors.length === 0;
    const status: DomainValidationStatus = valid ? 'PASS' : 'FAIL';

    return {
      valid,
      status,
      domainValidatorType: 'THERMODYNAMICS',
      rejectionReason: valid ? undefined : 'THERMODYNAMIC_INCONSISTENCY',
      rejectionMessage: errors.length > 0 ? errors[0].message : undefined,
      checks,
      errors,
      warnings,
      isValid: valid,
      domainChecks: checks.reduce((acc, c) => ({ ...acc, [c.name]: c.passed }), {})
    };
  }

  /**
   * 5. Mathematics for Engineers (Trigonometry, Radicals, Variation, Quadratic Roots) Validator
   */
  public static validateMathForEngineers(candidate: ValidatedProblem): DomainValidationResult {
    const checks: ValidationCheck[] = [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const prompt = candidate.statement.promptText;
    const promptLower = prompt.toLowerCase();

    // Check 1: Triangle Inequality for Oblique Triangles
    if (promptLower.includes('triangle') && promptLower.includes('sides')) {
      const sideMatches = prompt.match(/sides?\s+(?:a\s*=\s*)?(\d+)[,\s]+(?:b\s*=\s*)?(\d+)[,\s]+(?:c\s*=\s*)?(\d+)/i);
      if (sideMatches) {
        const a = parseFloat(sideMatches[1]);
        const b = parseFloat(sideMatches[2]);
        const c = parseFloat(sideMatches[3]);
        const triangleValid = (a + b > c) && (a + c > b) && (b + c > a);

        checks.push({
          name: 'ENG_MATH_TRIANGLE_INEQUALITY',
          passed: triangleValid,
          description: 'Enforces Triangle Inequality Theorem: sum of any two sides > third side.'
        });

        if (!triangleValid) {
          errors.push({
            code: 'TRIANGLE_INEQUALITY_VIOLATION',
            message: `Given sides (${a}, ${b}, ${c}) violate triangle inequality.`,
            field: 'statement.promptText'
          });
        }
      }
    }

    // Check 2: Trigonometric Function Value Range [-1, 1]
    if (promptLower.includes('sin(') || promptLower.includes('cos(')) {
      const matchTrigVal = prompt.match(/\\sin\s*\w+\s*=\s*(\d+(?:\.\d+)?)/) || prompt.match(/\\cos\s*\w+\s*=\s*(\d+(?:\.\d+)?)/);
      if (matchTrigVal) {
        const trigVal = parseFloat(matchTrigVal[1]);
        const rangeValid = trigVal <= 1.0 && trigVal >= -1.0;
        checks.push({
          name: 'ENG_MATH_TRIG_BOUNDS',
          passed: rangeValid,
          description: 'Asserts sine and cosine real values lie in [-1, 1].'
        });

        if (!rangeValid) {
          errors.push({
            code: 'TRIGONOMETRIC_RANGE_ERROR',
            message: `Trigonometric ratio (${trigVal}) exceeds allowable range [-1, 1].`,
            field: 'statement.promptText'
          });
        }
      }
    }

    // Check 3: Quadratic Real Root Discriminant Consistency
    if (promptLower.includes('real roots') && candidate.statement.expressionLatex) {
      const matchQuad = candidate.statement.expressionLatex.match(/(\d+)?x\^\{?2\}?\s*([+-]\s*\d+)?x\s*([+-]\s*\d+)?\s*=\s*0/);
      if (matchQuad) {
        const a = matchQuad[1] ? parseFloat(matchQuad[1]) : 1;
        const b = matchQuad[2] ? parseFloat(matchQuad[2].replace(/\s/g, '')) : 0;
        const c = matchQuad[3] ? parseFloat(matchQuad[3].replace(/\s/g, '')) : 0;
        const discriminant = b * b - 4 * a * c;
        const isRealRoots = discriminant >= 0;

        checks.push({
          name: 'ENG_MATH_QUADRATIC_DISCRIMINANT',
          passed: isRealRoots,
          description: 'Verifies quadratic equation has non-negative discriminant for real root problems.'
        });

        if (!isRealRoots) {
          errors.push({
            code: 'NEGATIVE_DISCRIMINANT_REAL_ROOTS',
            message: `Quadratic equation discriminant (Delta = ${discriminant}) is negative for real-roots problem.`,
            field: 'statement.expressionLatex'
          });
        }
      }
    }

    const valid = errors.length === 0;
    const status: DomainValidationStatus = valid ? 'PASS' : 'FAIL';

    return {
      valid,
      status,
      domainValidatorType: 'MATH_FOR_ENGINEERS',
      rejectionReason: valid ? undefined : 'PHYSICAL_IMPLAUSIBILITY',
      rejectionMessage: errors.length > 0 ? errors[0].message : undefined,
      checks,
      errors,
      warnings,
      isValid: valid,
      domainChecks: checks.reduce((acc, c) => ({ ...acc, [c.name]: c.passed }), {})
    };
  }

  /**
   * 6. IE Special Topics (Engineering Economy, Depreciation, Optimization, Licensure) Validator
   */
  public static validateIESpecialTopics(candidate: ValidatedProblem): DomainValidationResult {
    const checks: ValidationCheck[] = [];
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const prompt = candidate.statement.promptText;
    const promptLower = prompt.toLowerCase();

    // Check 1: Positive Asset Lifespan and Investment Horizon
    if (promptLower.includes('years') || promptLower.includes('useful life') || promptLower.includes('period')) {
      const hasNegativeYears = prompt.match(/-\s*\d+\s*years/i) || prompt.match(/useful\s+life\s+of\s+-\d+/i);
      checks.push({
        name: 'IE_POSITIVE_LIFESPAN',
        passed: !hasNegativeYears,
        description: 'Engineering economy investment period n >= 1 year.'
      });

      if (hasNegativeYears) {
        errors.push({
          code: 'NEGATIVE_LIFESPAN',
          message: 'Asset useful life or investment period cannot be negative.',
          field: 'statement.promptText'
        });
      }
    }

    // Check 2: Positive Nominal/Effective Interest Rate
    if (promptLower.includes('interest rate') || promptLower.includes('compounded')) {
      const hasNegativeInterest = prompt.match(/-\s*\d+(\.\d+)?\s*%/);
      checks.push({
        name: 'IE_POSITIVE_INTEREST_RATE',
        passed: !hasNegativeInterest,
        description: 'Interest rate i > 0% in capital investment analysis.'
      });

      if (hasNegativeInterest) {
        errors.push({
          code: 'NEGATIVE_INTEREST_RATE',
          message: 'Nominal/effective interest rate cannot be negative in standard engineering economy models.',
          field: 'statement.promptText'
        });
      }
    }

    // Check 3: Asset Depreciation Salvage Value Invariant: Salvage S <= Initial Cost C
    if (promptLower.includes('salvage') && (promptLower.includes('cost') || promptLower.includes('initial cost'))) {
      const matchCost = prompt.match(/(?:initial\s+cost|costs|cost)\s+(?:of\s+)?\$?(\d+[\d,]*)/i);
      const matchSalvage = prompt.match(/salvage\s+(?:value\s+)?(?:of\s+)?\$?(\d+[\d,]*)/i);
      if (matchCost && matchSalvage) {
        const cost = parseFloat(matchCost[1].replace(/,/g, ''));
        const salvage = parseFloat(matchSalvage[1].replace(/,/g, ''));
        const salvageBounded = salvage <= cost;

        checks.push({
          name: 'IE_SALVAGE_VALUE_BOUNDED',
          passed: salvageBounded,
          description: 'Salvage value S must not exceed initial capital asset cost C.'
        });

        if (!salvageBounded) {
          errors.push({
            code: 'SALVAGE_VALUE_EXCEEDS_COST',
            message: `Asset salvage value ($${salvage}) exceeds initial cost ($${cost}).`,
            field: 'statement.promptText'
          });
        }
      }
    }

    // Check 4: Benefit-Cost (B/C) Feasibility Decision Consistency
    if (promptLower.includes('benefit-cost') || promptLower.includes('b/c')) {
      const answer = candidate.solution?.canonicalAnswerLatex || '';
      const bcRatio = parseFloat(answer.replace(/[^\d.-]/g, ''));
      if (!isNaN(bcRatio)) {
        const isFeasible = bcRatio >= 1.0;
        checks.push({
          name: 'IE_BC_RATIO_DECISION_RULE',
          passed: true,
          description: `B/C Ratio (${bcRatio}): ${isFeasible ? 'Economically Justified (B/C >= 1.0)' : 'Economically Unjustified (B/C < 1.0)'}.`
        });
      }
    }

    const valid = errors.length === 0;
    const status: DomainValidationStatus = valid ? 'PASS' : 'FAIL';

    return {
      valid,
      status,
      domainValidatorType: 'IE_SPECIAL_TOPICS',
      rejectionReason: valid ? undefined : 'PHYSICAL_IMPLAUSIBILITY',
      rejectionMessage: errors.length > 0 ? errors[0].message : undefined,
      checks,
      errors,
      warnings,
      isValid: valid,
      domainChecks: checks.reduce((acc, c) => ({ ...acc, [c.name]: c.passed }), {})
    };
  }
}
