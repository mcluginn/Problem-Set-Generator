/**
 * Deterministic Pedagogical Concept & Method Alignment Validator
 * Engineering Practice Engine — Concept-Method Verification Engine
 *
 * Enforces the core invariant:
 * "A generated problem MUST be rejected if it is mathematically valid but
 * pedagogically misaligned with the selected concept, learning objective,
 * or expected solution method. Mathematical validity alone is insufficient."
 */

import {
  ValidatedProblem,
  DifferentialEquationOrder,
  DifferentialEquationMethod,
  RejectionReason
} from './types';
import { conceptRegistry, ConceptDefinition } from './conceptRegistry';

export interface ConceptValidationResult {
  isValid: boolean;
  conceptId?: string;
  expectedMethod?: DifferentialEquationMethod | string;
  actualMethod?: string;
  orderExpected?: DifferentialEquationOrder;
  orderDetected?: DifferentialEquationOrder;
  rejectionReason?: RejectionReason;
  rejectionDetails?: string;
}

export class ConceptAlignmentValidator {
  public static readonly VALIDATOR_VERSION = '1.0.0';

  /**
   * Detects the effective differential equation order of an expression string.
   */
  public static detectOrder(expressionLatex: string, rawText?: string): DifferentialEquationOrder {
    const combined = `${expressionLatex} ${rawText || ''}`;

    if (
      combined.includes("y'''") ||
      combined.includes('\\frac{d^3y}{dx^3}') ||
      combined.includes('d^3y/dx^3')
    ) {
      return 'HIGHER';
    }

    if (
      combined.includes("y''") ||
      combined.includes('\\frac{d^2y}{dx^2}') ||
      combined.includes('\\frac{d^2}{dx^2}') ||
      combined.includes('d^2y/dx^2') ||
      combined.includes("y''(x)") ||
      combined.includes("y''''") === false && combined.includes("y''")
    ) {
      return 2;
    }

    if (
      combined.includes("y'") ||
      combined.includes('\\frac{dy}{dx}') ||
      combined.includes('dy/dx') ||
      combined.includes('dy') ||
      combined.includes('\\frac{d}{dx}')
    ) {
      return 1;
    }

    return 1;
  }

  /**
   * Validates a candidate problem against its intended pedagogical concept and method.
   */
  public static validate(
    candidate: ValidatedProblem,
    explicitConceptId?: string,
    explicitMethod?: string
  ): ConceptValidationResult {
    // 1. Resolve Target Concept Definition
    const targetConceptId =
      explicitConceptId ||
      candidate.dna.conceptId ||
      conceptRegistry.getConceptForSkill(candidate.dna.primarySkillId)?.conceptId ||
      conceptRegistry.getConceptForSubtopic(candidate.dna.subtopicId)?.conceptId;

    if (!targetConceptId) {
      // Non-ODE or unmapped course skill: pass through
      return { isValid: true };
    }

    const concept = conceptRegistry.getConceptById(targetConceptId);
    if (!concept) {
      return { isValid: true };
    }

    const expr = candidate.statement.expressionLatex || '';
    const prompt = candidate.statement.promptText || '';
    const answer = candidate.solution.canonicalAnswerLatex || '';
    const traceText = candidate.solution.reasoningTrace.map(s => `${s.actionDescription} ${s.pedagogicalRationale}`).join(' ');
    const hintsText = candidate.hints.map(h => `${h.text} ${h.hintLatex || ''}`).join(' ');
    const allProblemText = `${expr} ${prompt} ${answer} ${traceText} ${hintsText}`;

    // 2. Hard Order Validation
    const detectedOrder = ConceptAlignmentValidator.detectOrder(expr, prompt);
    if (concept.order !== undefined && concept.order !== 'HIGHER') {
      if (concept.order === 1 && detectedOrder !== 1) {
        return {
          isValid: false,
          conceptId: concept.conceptId,
          expectedMethod: concept.primaryMethod,
          orderExpected: concept.order,
          orderDetected: detectedOrder,
          rejectionReason: 'CONCEPT_MISMATCH',
          rejectionDetails: `Order mismatch: Concept "${concept.name}" strictly requires a 1st-order differential equation, but candidate expression contains second-order derivative terms (${detectedOrder === 2 ? "y''" : 'higher order'}).`
        };
      }

      if (concept.order === 2 && detectedOrder !== 2) {
        return {
          isValid: false,
          conceptId: concept.conceptId,
          expectedMethod: concept.primaryMethod,
          orderExpected: concept.order,
          orderDetected: detectedOrder,
          rejectionReason: 'CONCEPT_MISMATCH',
          rejectionDetails: `Order mismatch: Concept "${concept.name}" strictly requires a 2nd-order differential equation, but candidate expression lacks second-order terms (detected order ${detectedOrder}).`
        };
      }
    }

    // 3. Intended Method Alignment Check
    const expectedMethod = explicitMethod || candidate.dna.expectedMethod || concept.primaryMethod;

    // Check A: First-order homogeneous substitution y = vx
    if (expectedMethod === 'SUBSTITUTION_Y_EQUALS_VX' || concept.primaryMethod === 'SUBSTITUTION_Y_EQUALS_VX') {
      // Must NOT contain characteristic equation tokens or higher-order roots
      const characteristicTokens = [
        "y''",
        "r^2",
        "r =",
        "r_{1}",
        "r_1",
        "characteristic equation",
        "auxiliary equation",
        "characteristic root",
        "C_{1}e^{",
        "C_1 e^{"
      ];

      for (const token of characteristicTokens) {
        if (expr.includes(token) || hintsText.toLowerCase().includes(token.toLowerCase()) || traceText.toLowerCase().includes(token.toLowerCase())) {
          return {
            isValid: false,
            conceptId: concept.conceptId,
            expectedMethod: 'SUBSTITUTION_Y_EQUALS_VX',
            actualMethod: 'CHARACTERISTIC_EQUATION',
            orderExpected: 1,
            orderDetected: detectedOrder,
            rejectionReason: 'METHOD_MISMATCH',
            rejectionDetails: `Method mismatch: Concept "${concept.name}" requires substitution y = vx, but problem utilizes characteristic equation method (${token}).`
          };
        }
      }

      // Must provide progressive hints teaching y = vx or homogeneous method
      const hintsLower = hintsText.toLowerCase();
      const hintsTeachVx =
        hintsLower.includes('v') ||
        hintsLower.includes('substitut') ||
        hintsLower.includes('homogeneous') ||
        candidate.dna?.taskType === 'VERIFY_SOLUTION';
      if (!hintsTeachVx && candidate.hints.length > 0) {
        return {
          isValid: false,
          conceptId: concept.conceptId,
          expectedMethod: 'SUBSTITUTION_Y_EQUALS_VX',
          rejectionReason: 'SOLUTION_MISMATCH',
          rejectionDetails: `Hint mismatch: Hints for concept "${concept.name}" do not teach substitution y = vx or variable v separation.`
        };
      }
    }

    // Check B: Second-order characteristic equation
    if (expectedMethod === 'CHARACTERISTIC_EQUATION' || concept.primaryMethod === 'CHARACTERISTIC_EQUATION') {
      // Must NOT contain y = vx tokens
      const vxTokens = ['y = vx', 'v = y/x', 'v+x\\frac{dv}{dx}', 'v + x dv/dx'];
      for (const token of vxTokens) {
        if (allProblemText.toLowerCase().includes(token.toLowerCase())) {
          return {
            isValid: false,
            conceptId: concept.conceptId,
            expectedMethod: 'CHARACTERISTIC_EQUATION',
            actualMethod: 'SUBSTITUTION_Y_EQUALS_VX',
            rejectionReason: 'METHOD_MISMATCH',
            rejectionDetails: `Method mismatch: Second-order constant-coefficient concept "${concept.name}" cannot use first-order substitution y = vx.`
          };
        }
      }

      // Must be homogeneous RHS = 0 for linear homogeneous constant coeff
      if (concept.homogeneity === 'HOMOGENEOUS') {
        const hasZeroRhs = expr.endsWith('= 0') || expr.endsWith('=0') || expr.includes('= 0');
        if (!hasZeroRhs && !prompt.toLowerCase().includes('homogeneous')) {
          return {
            isValid: false,
            conceptId: concept.conceptId,
            expectedMethod: 'CHARACTERISTIC_EQUATION',
            rejectionReason: 'CONCEPT_MISMATCH',
            rejectionDetails: `Homogeneity mismatch: Homogeneous linear DE requires RHS = 0, but expression is "${expr}".`
          };
        }
      }
    }

    // 4. Disallowed Keywords Check
    if (concept.disallowedKeywords && concept.disallowedKeywords.length > 0) {
      for (const disallowed of concept.disallowedKeywords) {
        if (allProblemText.includes(disallowed)) {
          return {
            isValid: false,
            conceptId: concept.conceptId,
            expectedMethod: concept.primaryMethod,
            rejectionReason: 'METHOD_MISMATCH',
            rejectionDetails: `Concept leakage: Problem contains prohibited token "${disallowed}" for concept "${concept.name}".`
          };
        }
      }
    }

    // Passed all pedagogical and method consistency checks
    return {
      isValid: true,
      conceptId: concept.conceptId,
      expectedMethod: concept.primaryMethod,
      orderExpected: concept.order,
      orderDetected: detectedOrder
    };
  }
}
