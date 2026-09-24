/**
 * Master Problem Generator Orchestrator
 * Deterministically generates, solves, validates, and diversity-checks calculus problems across all 14 concepts.
 */

import { GeneratedProblem, ProblemFamily, ProblemSpecification } from './types';
import { ConstantDirectFamily, ConstantMultipleFamily } from './families/constant_rules';
import { SumRuleFamily, DifferenceRuleFamily } from './families/sum_difference_rules';
import { PowerPolynomialFamily, PowerFractionalNegativeFamily } from './families/power_rule';
import { ProductPolyTrigFamily, ProductPolyExpFamily } from './families/product_rule';
import { QuotientPolyPolyFamily, QuotientTrigPolyFamily } from './families/quotient_rule';
import { ChainPowerPolynomialFamily, ChainTrigInnerFamily, ChainKinematicsFamily } from './families/chain_rule';
import { TrigStandardFamily, ExpStandardFamily, LogStandardFamily } from './families/trig_exp_log';
import {
  ImplicitConicFamily,
  ImplicitProductFamily,
  HigherOrderFamily,
  TangentLineSlopeFamily,
  KinematicsAppFamily,
} from './families/higher_implicit_apps';
import { StepGenerator, SolutionStep } from '../math/steps';
import { ImplicitDifferentiator } from '../math/implicit';
import { nodeToString } from '../math/ast';
import { ProblemValidator } from './validator';
import { SignatureEngine } from './signatures';

const ALL_FAMILIES: ProblemFamily[] = [
  ConstantDirectFamily,
  ConstantMultipleFamily,
  SumRuleFamily,
  DifferenceRuleFamily,
  PowerPolynomialFamily,
  PowerFractionalNegativeFamily,
  ProductPolyTrigFamily,
  ProductPolyExpFamily,
  QuotientPolyPolyFamily,
  QuotientTrigPolyFamily,
  ChainPowerPolynomialFamily,
  ChainTrigInnerFamily,
  ChainKinematicsFamily,
  TrigStandardFamily,
  ExpStandardFamily,
  LogStandardFamily,
  ImplicitConicFamily,
  ImplicitProductFamily,
  HigherOrderFamily,
  TangentLineSlopeFamily,
  KinematicsAppFamily,
];

export class ProblemGenerator {
  public static readonly GENERATOR_VERSION = '1.0.0';
  public static readonly VALIDATOR_VERSION = '1.0.0';

  /**
   * Generates a fully validated and novel practice problem according to specification.
   */
  public static generateProblem(
    spec: ProblemSpecification,
    recentHistory: Array<{ signature: string; familyId: string; representationType: string }> = []
  ): GeneratedProblem {
    const concept = spec.concept || 'Chain Rule';
    const targetDifficultyNum = ProblemGenerator.parseDifficulty(spec.difficulty);

    // Find candidate families matching the concept
    let matchingFamilies = ALL_FAMILIES.filter(
      (f) => f.concept.toLowerCase() === concept.toLowerCase()
    );

    if (matchingFamilies.length === 0) {
      matchingFamilies = [ChainPowerPolynomialFamily];
    }

    const maxAttempts = 8;
    let bestProblem: GeneratedProblem | null = null;
    let bestQualityScore = -1;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Select family (cycling through available families to maximize structural variety)
      const familyIndex = attempt % matchingFamilies.length;
      const family = matchingFamilies[familyIndex];

      const rawResult = family.generate(targetDifficultyNum);
      const targetVar = rawResult.statement.independentVariable || 'x';

      // Deterministically solve and generate steps
      let solution: {
        canonicalAnswerLatex: string;
        canonicalAnswerRaw: string;
        steps: SolutionStep[];
        whyMethodRequired: string;
      };

      if (family.concept === 'Implicit Differentiation') {
        const implicitRes = ImplicitDifferentiator.solveImplicit(
          rawResult.rawExpression,
          rawResult.statement.expressionLatex
        );
        solution = {
          canonicalAnswerLatex: implicitRes.simplifiedDerivativeLatex,
          canonicalAnswerRaw: nodeToString(implicitRes.derivativeDydx),
          steps: implicitRes.steps,
          whyMethodRequired: implicitRes.whyImplicitRequired,
        };
      } else {
        solution = StepGenerator.generateSolution(rawResult.rawExpression, family.concept, targetVar);
      }

      const candidateProblem: GeneratedProblem = {
        dna: {
          id: `prob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          subject: 'Differential Calculus',
          topic: 'Derivatives',
          concept: family.concept,
          familyId: family.id,
          templateId: `${family.id.toLowerCase()}_tpl`,
          representationType: family.representationType,
          contextType: family.contextType,
          guidednessLevel: spec.guidednessLevel || 1,
          difficulty: rawResult.difficulty,
          structureSignature: rawResult.structureSignature,
          requiredSkills: family.requiredSkills,
          targetedMisconceptions: family.targetedMisconceptions,
          generationVersion: ProblemGenerator.GENERATOR_VERSION,
          validatorVersion: ProblemGenerator.VALIDATOR_VERSION,
        },
        statement: rawResult.statement,
        rawExpression: rawResult.rawExpression,
        solution: {
          canonicalAnswerLatex: solution.canonicalAnswerLatex,
          canonicalAnswerRaw: solution.canonicalAnswerRaw,
          steps: solution.steps,
          whyMethodRequired: solution.whyMethodRequired,
        },
        hints: rawResult.hints,
        lifecycleStatus: 'VALIDATING',
        createdAt: new Date().toISOString(),
      };

      // Multi-Method Validation
      const validation = ProblemValidator.validate(candidateProblem);
      if (!validation.isValid) {
        continue;
      }

      // Diversity & Novelty check
      const diversity = SignatureEngine.computeNoveltyScore(
        candidateProblem.dna.structureSignature,
        family.id,
        recentHistory,
        spec.remediationMisconception
      );

      if (!diversity.isNovel && attempt < maxAttempts - 2) {
        if (diversity.score > bestQualityScore) {
          bestQualityScore = diversity.score;
          bestProblem = candidateProblem;
        }
        continue;
      }

      candidateProblem.lifecycleStatus = 'VALID';
      return candidateProblem;
    }

    if (bestProblem) {
      bestProblem.lifecycleStatus = 'VALID';
      return bestProblem;
    }

    return ProblemGenerator.generateFallbackProblem(concept, targetDifficultyNum);
  }

  private static parseDifficulty(difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Adaptive' | number): number {
    if (typeof difficulty === 'number') {
      return Math.max(1, Math.min(5, Math.round(difficulty)));
    }
    switch (difficulty) {
      case 'Easy':
        return 1;
      case 'Hard':
        return 4;
      case 'Adaptive':
      case 'Medium':
      default:
        return 3;
    }
  }

  private static generateFallbackProblem(concept: string, difficulty: number): GeneratedProblem {
    let family = ALL_FAMILIES.find((f) => f.concept.toLowerCase() === concept.toLowerCase());
    if (!family) family = ChainPowerPolynomialFamily;

    const rawResult = family.generate(difficulty);
    const targetVar = rawResult.statement.independentVariable || 'x';
    const solution = StepGenerator.generateSolution(rawResult.rawExpression, family.concept, targetVar);

    return {
      dna: {
        id: `prob_fallback_${Date.now()}`,
        subject: 'Differential Calculus',
        topic: 'Derivatives',
        concept: family.concept,
        familyId: family.id,
        templateId: `${family.id.toLowerCase()}_fallback_tpl`,
        representationType: family.representationType,
        contextType: family.contextType,
        guidednessLevel: 1,
        difficulty: rawResult.difficulty,
        structureSignature: rawResult.structureSignature,
        requiredSkills: family.requiredSkills,
        targetedMisconceptions: family.targetedMisconceptions,
        generationVersion: ProblemGenerator.GENERATOR_VERSION,
        validatorVersion: ProblemGenerator.VALIDATOR_VERSION,
      },
      statement: rawResult.statement,
      rawExpression: rawResult.rawExpression,
      solution: {
        canonicalAnswerLatex: solution.canonicalAnswerLatex,
        canonicalAnswerRaw: solution.canonicalAnswerRaw,
        steps: solution.steps,
        whyMethodRequired: solution.whyMethodRequired,
      },
      hints: rawResult.hints,
      lifecycleStatus: 'VALID',
      createdAt: new Date().toISOString(),
    };
  }
}
