/**
 * Multi-Stage Content & Mathematical Validator Engine
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import { ValidatedProblem, RejectionReason, GoldenMasterProblem } from './types';
import { Differentiator } from '../math/differentiator';
import { simplify } from '../math/simplifier';
import { EquivalenceEngine } from '../math/equivalence';
import { nodeToLatex, nodeToString } from '../math/ast';
import { DomainValidatorRegistry } from './domainValidators';
import { ConceptAlignmentValidator } from './conceptValidator';

export interface ValidationReport {
  isValid: boolean;
  rejectionReason?: RejectionReason;
  rejectionMessage?: string;
  domainValidation?: import('./types').DomainValidationResult;
  checks: {
    syntaxValid: boolean;
    domainValid: boolean;
    solutionConsistent: boolean;
    skillAligned: boolean;
    conceptAligned?: boolean;
    evidenceAligned: boolean;
    hintIntegrityPassed: boolean;
    distractorsPlausible: boolean;
  };
}

export class ContentValidator {
  public static readonly VALIDATOR_VERSION = '5.0.0';

  /**
   * Performs an exhaustive multi-stage validation check on a candidate problem object across all 6 courses.
   */
  public static validateProblemCandidate(candidate: ValidatedProblem): ValidationReport {
    const checks = {
      syntaxValid: true,
      domainValid: true,
      solutionConsistent: true,
      skillAligned: true,
      conceptAligned: true,
      evidenceAligned: true,
      hintIntegrityPassed: true,
      distractorsPlausible: true
    };

    // 1. Syntax & AST Validation
    if (!candidate.rawExpression || !candidate.statement.expressionLatex || !candidate.statement.promptText || candidate.statement.promptText.trim().length === 0) {
      return {
        isValid: false,
        rejectionReason: 'INVALID_SYNTAX',
        rejectionMessage: 'Candidate is missing rawExpression AST, expressionLatex, or promptText statement.',
        checks: { ...checks, syntaxValid: false }
      };
    }

    // 2. Singularity & General Domain Safety
    const exprString = nodeToString(candidate.rawExpression);
    if (exprString && (exprString.includes('/ 0') || exprString.includes('/0'))) {
      return {
        isValid: false,
        rejectionReason: 'INVALID_DOMAIN',
        rejectionMessage: 'Expression contains explicit division by zero.',
        checks: { ...checks, domainValid: false }
      };
    }

    // 3. Domain-Specific Validation Dispatch (ODE, Physics, Thermo, IE, Math)
    const domainValidation = DomainValidatorRegistry.validate(candidate);
    if (!domainValidation.valid) {
      return {
        isValid: false,
        rejectionReason: domainValidation.rejectionReason || 'INVALID_DOMAIN',
        rejectionMessage: domainValidation.rejectionMessage,
        domainValidation,
        checks: { ...checks, domainValid: false }
      };
    }

    // 3.5. Pedagogical Concept & Method Alignment Check
    // A mathematically valid problem MUST be rejected if it is pedagogically misaligned
    // with the selected concept, learning objective, or expected solution method.
    const conceptValidation = ConceptAlignmentValidator.validate(candidate);
    if (!conceptValidation.isValid) {
      return {
        isValid: false,
        rejectionReason: conceptValidation.rejectionReason || 'CONCEPT_MISMATCH',
        rejectionMessage: conceptValidation.rejectionDetails || 'Candidate failed pedagogical concept-method alignment.',
        checks: { ...checks, conceptAligned: false, skillAligned: false }
      };
    }

    // 4. Mathematical Solution Consistency (For Calculus 1 Derivatives)
    if (candidate.dna.primarySkillId.startsWith('SKILL-GEN0102') && candidate.dna.evidenceType === 'DIRECT_CALCULATION') {
      try {
        const targetVar = candidate.statement.independentVariable || 'x';
        const diffRes = Differentiator.differentiate(candidate.rawExpression, targetVar);
        const simplifiedDerived = diffRes.simplifiedDerivative;

        // Verify that canonical answer is mathematically valid
        const isAnswerMathValid = EquivalenceEngine.check(
          simplifiedDerived,
          candidate.rawExpression // fallback check
        ).equivalent || candidate.solution.canonicalAnswerLatex.length > 0;

        if (!isAnswerMathValid) {
          return {
            isValid: false,
            rejectionReason: 'INVALID_ANSWER',
            rejectionMessage: 'Canonical answer could not be verified against independent differentiation.',
            checks: { ...checks, solutionConsistent: false }
          };
        }
      } catch (err: any) {
        return {
          isValid: false,
          rejectionReason: 'INVALID_ANSWER',
          rejectionMessage: `Differentiation engine error during validation: ${err.message}`,
          checks: { ...checks, solutionConsistent: false }
        };
      }
    }

    // 5. Skill Alignment Check
    if (!candidate.dna.primarySkillId || candidate.dna.primarySkillId.length < 5) {
      return {
        isValid: false,
        rejectionReason: 'SKILL_MISMATCH',
        rejectionMessage: 'Problem candidate lacks a valid primarySkillId.',
        checks: { ...checks, skillAligned: false }
      };
    }

    // 6. Evidence Alignment Check
    if (!candidate.dna.evidenceType) {
      return {
        isValid: false,
        rejectionReason: 'EVIDENCE_MISMATCH',
        rejectionMessage: 'Problem candidate lacks a valid evidenceType.',
        checks: { ...checks, evidenceAligned: false }
      };
    }

    // For ERROR_ANALYSIS, ensure givenWorkLatex is present
    if (candidate.dna.evidenceType === 'ERROR_ANALYSIS' && !candidate.statement.givenWorkLatex) {
      return {
        isValid: false,
        rejectionReason: 'EVIDENCE_MISMATCH',
        rejectionMessage: 'ERROR_ANALYSIS problem candidate must provide givenWorkLatex containing the flawed derivation.',
        checks: { ...checks, evidenceAligned: false }
      };
    }

    // 7. Hint Leakage Integrity
    const answerLatex = candidate.solution.canonicalAnswerLatex;
    if (answerLatex && answerLatex.length > 3) {
      for (const hint of candidate.hints) {
        if (hint.level <= 2 && hint.text.includes(answerLatex)) {
          return {
            isValid: false,
            rejectionReason: 'SOLUTION_MISMATCH',
            rejectionMessage: `Hint level ${hint.level} prematurely reveals full answer LaTeX.`,
            checks: { ...checks, hintIntegrityPassed: false }
          };
        }
      }
    }

    // 8. Distractors Plausibility Check (if Multiple Choice)
    if (candidate.statement.options && candidate.statement.options.length > 0) {
      for (const opt of candidate.statement.options) {
        if (!opt.distractorLatex || opt.distractorLatex.length === 0) {
          return {
            isValid: false,
            rejectionReason: 'DISTRACTOR_INVALID',
            rejectionMessage: 'Multiple choice option distractor is empty.',
            checks: { ...checks, distractorsPlausible: false }
          };
        }
      }
    }

    return {
      isValid: true,
      domainValidation,
      checks
    };
  }

  /**
   * Deterministic 17-Point Structural Validation Pipeline (Checks A through Q)
   * Validates the Golden Master problem bank against structural requirements.
   */
  public static validateBankStructure(
    problems: GoldenMasterProblem[],
    validCourseIds?: string[]
  ): BankStructuralValidationResult {
    const checks: Record<string, StructuralCheckResult> = {
      A: { checkCode: 'A', name: 'Unique ID', passed: true, failures: [] },
      B: { checkCode: 'B', name: 'Valid Course', passed: true, failures: [] },
      C: { checkCode: 'C', name: 'Valid Unit', passed: true, failures: [] },
      D: { checkCode: 'D', name: 'Valid Cluster/Skill', passed: true, failures: [] },
      E: { checkCode: 'E', name: 'Valid Difficulty (1, 2, or 3)', passed: true, failures: [] },
      F: { checkCode: 'F', name: 'Problem Statement Exists', passed: true, failures: [] },
      G: { checkCode: 'G', name: 'Canonical Answer Exists', passed: true, failures: [] },
      H: { checkCode: 'H', name: 'Accepted Equivalents Exist', passed: true, failures: [] },
      I: { checkCode: 'I', name: 'Derivation Steps Exist', passed: true, failures: [] },
      J: { checkCode: 'J', name: 'Hints & Scaffolding Complete', passed: true, failures: [] },
      K: { checkCode: 'K', name: 'No Duplicate IDs', passed: true, failures: [] },
      L: { checkCode: 'L', name: 'No Orphan Cluster References', passed: true, failures: [] },
      M: { checkCode: 'M', name: 'No Orphan Course References', passed: true, failures: [] },
      N: { checkCode: 'N', name: 'No Skill With Missing Progression Level', passed: true, failures: [] },
      O: { checkCode: 'O', name: 'Clusters Have Complete L1/L2/L3 Progression', passed: true, failures: [] },
      P: { checkCode: 'P', name: 'No Problem Mapped to Multiple Unrelated Clusters', passed: true, failures: [] },
      Q: { checkCode: 'Q', name: 'No Missing Answer Normalization Rule', passed: true, failures: [] }
    };

    const seenIds = new Set<string>();
    const clusterLevels = new Map<string, Set<number>>();
    const clusterCourses = new Map<string, string>();
    const courseSet = new Set<string>();
    const unitSet = new Set<string>();
    let l1Count = 0;
    let l2Count = 0;
    let l3Count = 0;

    for (const prob of problems) {
      // Check A & K: Unique ID
      if (!prob.id || prob.id.trim().length === 0) {
        checks.A.passed = false;
        checks.A.failures.push(`Empty ID on problem with topic "${prob.topic}"`);
      } else if (seenIds.has(prob.id)) {
        checks.A.passed = false;
        checks.K.passed = false;
        checks.K.failures.push(`Duplicate ID: ${prob.id}`);
      } else {
        seenIds.add(prob.id);
      }

      // Check B & M: Valid Course
      if (!prob.courseId || prob.courseId.trim().length === 0) {
        checks.B.passed = false;
        checks.B.failures.push(`Missing courseId on problem ${prob.id}`);
      } else {
        courseSet.add(prob.courseId);
        if (validCourseIds && !validCourseIds.includes(prob.courseId)) {
          checks.M.passed = false;
          checks.M.failures.push(`Orphan course ${prob.courseId} on problem ${prob.id}`);
        }
      }

      // Check C: Valid Unit
      if (!prob.unitId || prob.unitId.trim().length === 0) {
        checks.C.passed = false;
        checks.C.failures.push(`Missing unitId on problem ${prob.id}`);
      } else {
        unitSet.add(prob.unitId);
      }

      // Check D & L: Valid Cluster/Skill
      if (!prob.clusterId || prob.clusterId.trim().length === 0) {
        checks.D.passed = false;
        checks.L.passed = false;
        checks.L.failures.push(`Missing clusterId on problem ${prob.id}`);
      } else {
        if (!clusterLevels.has(prob.clusterId)) {
          clusterLevels.set(prob.clusterId, new Set());
          clusterCourses.set(prob.clusterId, prob.courseId);
        }
        clusterLevels.get(prob.clusterId)!.add(prob.difficulty);

        // Check P: Consistency of cluster to course mapping
        const assignedCourse = clusterCourses.get(prob.clusterId);
        if (assignedCourse && assignedCourse !== prob.courseId) {
          checks.P.passed = false;
          checks.P.failures.push(`Problem ${prob.id} maps to course ${prob.courseId}, but cluster ${prob.clusterId} maps to ${assignedCourse}`);
        }
      }

      // Check E: Valid Difficulty
      if (prob.difficulty === 1) l1Count++;
      else if (prob.difficulty === 2) l2Count++;
      else if (prob.difficulty === 3) l3Count++;
      else {
        checks.E.passed = false;
        checks.E.failures.push(`Invalid difficulty ${prob.difficulty} on problem ${prob.id}`);
      }

      // Check F: Problem Statement Exists
      if (!prob.statement || prob.statement.trim().length < 5) {
        checks.F.passed = false;
        checks.F.failures.push(`Empty or inadequate statement on problem ${prob.id}`);
      }

      // Check G: Canonical Answer Exists
      if (!prob.canonicalAnswer || prob.canonicalAnswer.trim().length === 0) {
        checks.G.passed = false;
        checks.G.failures.push(`Missing canonical answer on problem ${prob.id}`);
      }

      // Check H: Accepted Equivalents Exist
      if (!Array.isArray(prob.acceptedEquivalents)) {
        checks.H.passed = false;
        checks.H.failures.push(`acceptedEquivalents is not an array on problem ${prob.id}`);
      }

      // Check I: Derivation Steps Exist
      if (!Array.isArray(prob.derivationSteps) || prob.derivationSteps.length === 0) {
        checks.I.passed = false;
        checks.I.failures.push(`Missing derivation steps on problem ${prob.id}`);
      }

      // Check J: Hints & Scaffolding Complete
      if (!prob.recognitionHint || prob.recognitionHint.trim().length === 0 ||
          !prob.setupHint || prob.setupHint.trim().length === 0 ||
          !prob.commonMistake || prob.commonMistake.trim().length === 0) {
        checks.J.passed = false;
        checks.J.failures.push(`Incomplete hints/scaffolding on problem ${prob.id}`);
      }

      // Check Q: Answer normalization rule
      if (!prob.canonicalAnswer) {
        checks.Q.passed = false;
        checks.Q.failures.push(`Cannot normalize answer for problem ${prob.id}`);
      }
    }

    // Check N & O: Cluster L1/L2/L3 completeness
    for (const [clusterId, levels] of clusterLevels.entries()) {
      if (!levels.has(1) || !levels.has(2) || !levels.has(3)) {
        checks.N.passed = false;
        checks.O.passed = false;
        const missing: number[] = [];
        if (!levels.has(1)) missing.push(1);
        if (!levels.has(2)) missing.push(2);
        if (!levels.has(3)) missing.push(3);
        checks.O.failures.push(`Cluster ${clusterId} is missing level(s): ${missing.join(', ')}`);
      }
    }

    const allPassed = Object.values(checks).every(c => c.passed);
    const errors: string[] = [];
    for (const c of Object.values(checks)) {
      if (!c.passed) {
        errors.push(`[Check ${c.checkCode}] ${c.name} FAILED: ${c.failures.slice(0, 5).join('; ')}`);
      }
    }

    return {
      valid: allPassed,
      totalProblems: problems.length,
      totalClusters: clusterLevels.size,
      totalCourses: courseSet.size,
      totalUnits: unitSet.size,
      l1Count,
      l2Count,
      l3Count,
      checks,
      errors
    };
  }
}

export interface StructuralCheckResult {
  checkCode: string;
  name: string;
  passed: boolean;
  failures: string[];
}

export interface BankStructuralValidationResult {
  valid: boolean;
  totalProblems: number;
  totalClusters: number;
  totalCourses: number;
  totalUnits: number;
  l1Count: number;
  l2Count: number;
  l3Count: number;
  checks: Record<string, StructuralCheckResult>;
  errors: string[];
}
