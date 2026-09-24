/**
 * AST Structural Fingerprinting & Structural Similarity Engine
 * Engineering Practice Engine — Phase 8 Pedagogical Archetype & Structural Diversity
 *
 * Implements deterministic structural fingerprinting of mathematical ASTs and statements,
 * and computes pedagogical structural similarity between problem candidates to prevent
 * trivial coefficient variations and enforce genuine structural diversity.
 */

import { MathNode } from './ast';
import {
  ASTStructuralFingerprint,
  PedagogicalTaskType,
  ContentRepresentationType
} from '../content/types';

/**
 * Computes the operator shape string of a MathNode.
 * Constants become 'C', variables become 'V', operators retain their operational name.
 */
export function computeNodeShape(node: MathNode): string {
  if (!node) return 'NULL';
  switch (node.type) {
    case 'constant':
      return 'C';
    case 'variable':
      return `V(${node.name})`;
    case 'add':
      return `ADD(${node.terms.map(computeNodeShape).join(',')})`;
    case 'multiply':
      return `MUL(${node.factors.map(computeNodeShape).join(',')})`;
    case 'power':
      return `POW(${computeNodeShape(node.base)},${computeNodeShape(node.exponent)})`;
    case 'divide':
      return `DIV(${computeNodeShape(node.numerator)},${computeNodeShape(node.denominator)})`;
    case 'negate':
      return `NEG(${computeNodeShape(node.arg)})`;
    case 'function':
      return `FN:${node.fn}(${node.args.map(computeNodeShape).join(',')})`;
    case 'derivative_term':
      return `DERIV(${node.order ?? 1},${node.target},${node.wrt})`;
    default:
      return 'NODE';
  }
}

/**
 * Computes tree depth of a MathNode.
 */
export function computeTreeDepth(node: MathNode): number {
  if (!node) return 0;
  switch (node.type) {
    case 'constant':
    case 'variable':
    case 'derivative_term':
      return 1;
    case 'negate':
      return 1 + computeTreeDepth(node.arg);
    case 'power':
      return 1 + Math.max(computeTreeDepth(node.base), computeTreeDepth(node.exponent));
    case 'divide':
      return 1 + Math.max(computeTreeDepth(node.numerator), computeTreeDepth(node.denominator));
    case 'add':
      return 1 + (node.terms.length > 0 ? Math.max(...node.terms.map(computeTreeDepth)) : 0);
    case 'multiply':
      return 1 + (node.factors.length > 0 ? Math.max(...node.factors.map(computeTreeDepth)) : 0);
    case 'function':
      return 1 + (node.args.length > 0 ? Math.max(...node.args.map(computeTreeDepth)) : 0);
    default:
      return 1;
  }
}

/**
 * Computes total node count of a MathNode.
 */
export function computeNodeCount(node: MathNode): number {
  if (!node) return 0;
  switch (node.type) {
    case 'constant':
    case 'variable':
    case 'derivative_term':
      return 1;
    case 'negate':
      return 1 + computeNodeCount(node.arg);
    case 'power':
      return 1 + computeNodeCount(node.base) + computeNodeCount(node.exponent);
    case 'divide':
      return 1 + computeNodeCount(node.numerator) + computeNodeCount(node.denominator);
    case 'add':
      return 1 + node.terms.reduce((acc, t) => acc + computeNodeCount(t), 0);
    case 'multiply':
      return 1 + node.factors.reduce((acc, f) => acc + computeNodeCount(f), 0);
    case 'function':
      return 1 + node.args.reduce((acc, a) => acc + computeNodeCount(a), 0);
    default:
      return 1;
  }
}

/**
 * Computes an operator histogram mapping operator types to frequency count.
 */
export function computeOperatorHistogram(node: MathNode): Record<string, number> {
  const hist: Record<string, number> = {};

  function traverse(n: MathNode) {
    if (!n) return;
    hist[n.type] = (hist[n.type] || 0) + 1;
    if (n.type === 'function') {
      hist[`fn_${n.fn}`] = (hist[`fn_${n.fn}`] || 0) + 1;
    }
    switch (n.type) {
      case 'negate':
        traverse(n.arg);
        break;
      case 'power':
        traverse(n.base);
        traverse(n.exponent);
        break;
      case 'divide':
        traverse(n.numerator);
        traverse(n.denominator);
        break;
      case 'add':
        n.terms.forEach(traverse);
        break;
      case 'multiply':
        n.factors.forEach(traverse);
        break;
      case 'function':
        n.args.forEach(traverse);
        break;
    }
  }

  traverse(node);
  return hist;
}

/**
 * Creates a normalized structural fingerprint from an AST and contextual statement metadata.
 */
export function calculateASTFingerprint(
  node: MathNode,
  context?: {
    taskType?: PedagogicalTaskType;
    archetypeId?: import('../content/types').ProblemArchetypeId;
    representation?: ContentRepresentationType;
    expressionLatex?: string;
    statementPrompt?: string;
    applicationDomain?: 'MIXING_TANK' | 'COOLING_HEATING' | 'GROWTH_DECAY' | 'ORTHOGONAL_TRAJECTORIES';
    physicalConfiguration?: string;
    governingModel?: string;
    unknownTarget?: string;
  }
): ASTStructuralFingerprint {
  const taskType = context?.taskType || 'SOLVE_GENERAL_SOLUTION';
  const archetypeId = context?.archetypeId;
  const representation = context?.representation || 'SYMBOLIC';

  let rawShape = computeNodeShape(node);
  const treeDepth = computeTreeDepth(node);
  const nodeCount = computeNodeCount(node);
  const operatorHistogram = computeOperatorHistogram(node);

  // In differential equations, expressions may also be characterized by their differential form vs derivative form
  let statementForm = 'EXPLICIT_ODE';
  if (context?.expressionLatex) {
    const latex = context.expressionLatex;
    if (latex.includes('dx') && latex.includes('dy')) {
      statementForm = 'DIFFERENTIAL_FORM_MDX_NDY';
    } else if (latex.includes('y(') && latex.includes(')=')) {
      statementForm = 'INITIAL_VALUE_PROBLEM';
    } else if (latex.includes('f(\\lambda') || latex.includes('f(tx')) {
      statementForm = 'HOMOGENEITY_EULER_TEST';
    }
  }

  // Incorporate fine-grained application domain and configuration tags if present
  const appTag = context?.applicationDomain
    ? `:${context.applicationDomain}:${context.physicalConfiguration || 'CFG'}:${context.governingModel || 'MODEL'}:${context.unknownTarget || 'TARGET'}`
    : '';

  const operatorShape = `[${taskType}:${archetypeId || 'ARCH'}:${statementForm}${appTag}]_${rawShape}`;

  // Deterministic 32-bit FNV-1a hash
  const hashSource = `${operatorShape}#D${treeDepth}#N${nodeCount}#${JSON.stringify(operatorHistogram)}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < hashSource.length; i++) {
    hash ^= hashSource.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const normalizedHash = (hash >>> 0).toString(16).padStart(8, '0');

  return {
    operatorShape,
    treeDepth,
    nodeCount,
    operatorHistogram,
    taskType,
    archetypeId,
    representation,
    normalizedHash,
    applicationDomain: context?.applicationDomain,
    physicalConfiguration: context?.physicalConfiguration,
    governingModel: context?.governingModel,
    unknownTarget: context?.unknownTarget
  };
}

/**
 * Computes structural similarity between two fingerprints in the interval [0.0, 1.0].
 * - 1.0 indicates identical mathematical AST structure (e.g. pure coefficient variation).
 * - Values <= 0.70 represent substantial pedagogical and structural variation.
 */
export function calculateStructuralSimilarity(
  fp1: ASTStructuralFingerprint,
  fp2: ASTStructuralFingerprint
): number {
  if (!fp1 || !fp2) return 0;

  // Exact structural fingerprint match: pure coefficient variation
  if (fp1.normalizedHash === fp2.normalizedHash && fp1.operatorShape === fp2.operatorShape) {
    return 1.0;
  }

  // Check Application Domain and Physical Model Dimensions
  if (fp1.applicationDomain && fp2.applicationDomain) {
    if (
      fp1.applicationDomain === fp2.applicationDomain &&
      fp1.physicalConfiguration === fp2.physicalConfiguration &&
      fp1.governingModel === fp2.governingModel &&
      fp1.unknownTarget === fp2.unknownTarget
    ) {
      // Isomorphic application problem with only coefficient changes: high similarity
      return 0.95;
    }
  }

  // 1. Task Type & Archetype Compatibility Check
  // Different pedagogical task types (e.g. IVP vs General Solution vs Verification vs Degree Test)
  // or different structural archetypes represent fundamentally different pedagogical tasks.
  let discountFactor = 1.0;
  if (fp1.taskType !== fp2.taskType) {
    discountFactor = 0.35; // Maximum possible similarity capped if task types differ
  } else if (fp1.applicationDomain && fp2.applicationDomain) {
    if (fp1.applicationDomain !== fp2.applicationDomain) {
      discountFactor = 0.45; // Different application domain (e.g. mixing tank vs cooling)
    } else if (fp1.physicalConfiguration !== fp2.physicalConfiguration || fp1.governingModel !== fp2.governingModel) {
      discountFactor = 0.55; // Same domain but different physical configuration (e.g. const vol vs var vol vs flush)
    } else if (fp1.unknownTarget !== fp2.unknownTarget) {
      discountFactor = 0.60; // Same domain/config but different target variable (e.g. solve state vs threshold time)
    } else if (fp1.archetypeId && fp2.archetypeId && fp1.archetypeId !== fp2.archetypeId) {
      discountFactor = 0.65;
    }
  } else if (fp1.archetypeId && fp2.archetypeId && fp1.archetypeId !== fp2.archetypeId) {
    discountFactor = 0.65; // Distinct pedagogical archetypes within the same task type
  }

  // 2. Exact Operator Shape Match
  if (fp1.operatorShape === fp2.operatorShape) {
    // Same shape, archetype, and task type
    return 0.92 * discountFactor;
  }

  // 3. Histogram Cosine Similarity
  const allOps = new Set([
    ...Object.keys(fp1.operatorHistogram),
    ...Object.keys(fp2.operatorHistogram)
  ]);

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (const op of allOps) {
    const v1 = fp1.operatorHistogram[op] || 0;
    const v2 = fp2.operatorHistogram[op] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  }

  const cosineSim = (mag1 > 0 && mag2 > 0) ? dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2)) : 0;

  // 4. Tree Depth Proximity
  const maxDepth = Math.max(fp1.treeDepth, fp2.treeDepth, 1);
  const depthSim = 1 - Math.abs(fp1.treeDepth - fp2.treeDepth) / maxDepth;

  // 5. Node Count Proximity
  const maxNodes = Math.max(fp1.nodeCount, fp2.nodeCount, 1);
  const nodeSim = 1 - Math.abs(fp1.nodeCount - fp2.nodeCount) / maxNodes;

  // Weighted Combination
  const structuralScore = (0.55 * cosineSim) + (0.25 * depthSim) + (0.20 * nodeSim);

  const finalSimilarity = Math.min(1.0, Math.max(0.0, structuralScore * discountFactor));
  return Number(finalSimilarity.toFixed(4));
}

/**
 * Detects if candidate problem is merely a parameter-only variation of the original problem
 * (i.e. same physical application, same governing differential equation structure, same unknown target variable,
 * but only coefficients, rates, initial values, or constant values changed).
 */
export function isParameterOnlyVariation(
  original: import('../content/types').ValidatedProblem,
  candidate: import('../content/types').ValidatedProblem
): boolean {
  if (!original || !candidate) return false;

  const fp1 = original.dna.structuralFingerprint;
  const fp2 = candidate.dna.structuralFingerprint;

  // 1. If archetypes are identical and non-null
  if (original.dna.archetypeId && candidate.dna.archetypeId && original.dna.archetypeId === candidate.dna.archetypeId) {
    // If fine-grained application dimensions are set and match:
    if (
      fp1?.applicationDomain && fp2?.applicationDomain &&
      fp1.applicationDomain === fp2.applicationDomain &&
      fp1.physicalConfiguration === fp2.physicalConfiguration &&
      fp1.governingModel === fp2.governingModel &&
      fp1.unknownTarget === fp2.unknownTarget
    ) {
      return true;
    }

    // Identical template and taskType with same AST operator shape
    if (
      original.dna.templateId === candidate.dna.templateId &&
      original.dna.taskType === candidate.dna.taskType &&
      fp1?.operatorShape === fp2?.operatorShape
    ) {
      return true;
    }
  }

  // 2. If both have application fingerprints that match across all physical and mathematical dimensions
  if (fp1?.applicationDomain && fp2?.applicationDomain) {
    if (
      fp1.applicationDomain === fp2.applicationDomain &&
      fp1.physicalConfiguration === fp2.physicalConfiguration &&
      fp1.governingModel === fp2.governingModel &&
      fp1.unknownTarget === fp2.unknownTarget &&
      original.dna.taskType === candidate.dna.taskType
    ) {
      return true;
    }
  }

  // 3. Normalized hash identity
  if (
    fp1?.normalizedHash &&
    fp2?.normalizedHash &&
    fp1.normalizedHash === fp2.normalizedHash &&
    fp1.operatorShape === fp2.operatorShape
  ) {
    return true;
  }

  return false;
}

/**
 * Detects if candidate problem is a story-only variation
 * (i.e. superficial rewording or renaming like "tank in Manila" -> "reservoir in Laguna"
 * while the underlying physical equations, dimensions, parameters, and solving steps are isomorphic).
 */
export function isStoryOnlyVariation(
  original: import('../content/types').ValidatedProblem,
  candidate: import('../content/types').ValidatedProblem
): boolean {
  if (!original || !candidate) return false;

  // Any parameter-only variation is by definition isomorphic in structure
  if (isParameterOnlyVariation(original, candidate)) {
    return true;
  }

  const fp1 = original.dna.structuralFingerprint;
  const fp2 = candidate.dna.structuralFingerprint;

  // If both are application problems with identical physical and governing model dimensions
  if (fp1?.applicationDomain && fp2?.applicationDomain) {
    const sameModel =
      fp1.applicationDomain === fp2.applicationDomain &&
      fp1.physicalConfiguration === fp2.physicalConfiguration &&
      fp1.governingModel === fp2.governingModel &&
      fp1.unknownTarget === fp2.unknownTarget &&
      original.dna.expectedMethod === candidate.dna.expectedMethod &&
      original.dna.taskType === candidate.dna.taskType;
    if (sameModel) {
      return true;
    }
  }

  return false;
}
