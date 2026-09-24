/**
 * Structure Signatures & Anti-Cloning Diversity Engine
 * Computes deep structural fingerprints and evaluates novelty to avoid superficial clones.
 */

import { MathNode } from '../math/ast';

export class SignatureEngine {
  /**
   * Generates a structural fingerprint from an AST and family metadata.
   */
  public static extractSignature(
    node: MathNode,
    concept: string,
    representationType: string = 'Symbolic'
  ): string {
    const treeStructure = SignatureEngine.describeTree(node);
    return `${concept.toUpperCase().replace(/\s+/g, '_')}|${representationType.toUpperCase()}|${treeStructure}`;
  }

  private static describeTree(node: MathNode): string {
    switch (node.type) {
      case 'constant':
        return node.symbolic ? `CONST:${node.symbolic}` : 'CONST:num';

      case 'variable':
        return `VAR:${node.name}`;

      case 'derivative_term':
        return `DERIV:${node.target}/${node.wrt}`;

      case 'negate':
        return `NEG(${SignatureEngine.describeTree(node.arg)})`;

      case 'add': {
        const termDescs = node.terms.map(SignatureEngine.describeTree).sort();
        return `ADD[${termDescs.join(',')}]`;
      }

      case 'multiply': {
        const factorDescs = node.factors.map(SignatureEngine.describeTree).sort();
        return `MUL[${factorDescs.join(',')}]`;
      }

      case 'divide':
        return `DIV(${SignatureEngine.describeTree(node.numerator)},${SignatureEngine.describeTree(node.denominator)})`;

      case 'power': {
        const baseDesc = SignatureEngine.describeTree(node.base);
        let expDesc = 'exp:const';
        if (node.exponent.type === 'constant' && !node.exponent.symbolic) {
          expDesc = `n=${node.exponent.value.toString()}`;
        }
        return `POW(${baseDesc},${expDesc})`;
      }

      case 'function': {
        const argDescs = node.args.map(SignatureEngine.describeTree).join(',');
        return `FN:${node.fn.toUpperCase()}(${argDescs})`;
      }
    }
  }

  /**
   * Computes a novelty score in [0.0, 1.0] comparing a candidate problem against student history.
   */
  public static computeNoveltyScore(
    candidateSignature: string,
    candidateFamilyId: string,
    recentHistory: Array<{ signature: string; familyId: string; representationType: string }>,
    targetMisconception?: string
  ): { score: number; isNovel: boolean; reason: string } {
    if (!recentHistory || recentHistory.length === 0) {
      return { score: 1.0, isNovel: true, reason: 'First problem in session.' };
    }

    let score = 1.0;

    // 1. Check exact structure signature match
    const last3 = recentHistory.slice(-3);
    const hasExactMatchInRecent = last3.some((h) => h.signature === candidateSignature);
    if (hasExactMatchInRecent) {
      score -= 0.85;
    }

    // 2. Check family repetition penalty
    const familyOccurrences = recentHistory.slice(-5).filter((h) => h.familyId === candidateFamilyId).length;
    if (familyOccurrences >= 2) {
      score -= 0.45;
    } else if (familyOccurrences === 1) {
      score -= 0.20;
    }

    // 3. Deliberate remediation bonus (if student needs specific misconception practice)
    if (targetMisconception) {
      score += 0.35;
    }

    // 4. Representation diversity bonus
    const lastRepresentation = recentHistory[recentHistory.length - 1]?.representationType;
    const currentRepresentation = candidateSignature.split('|')[1];
    if (lastRepresentation && currentRepresentation && lastRepresentation !== currentRepresentation) {
      score += 0.25;
    }

    const clampedScore = Math.max(0.0, Math.min(1.0, score));
    const isNovel = clampedScore >= 0.35;

    return {
      score: clampedScore,
      isNovel,
      reason: isNovel
        ? `Sufficient structural diversity (score: ${clampedScore.toFixed(2)}).`
        : `Rejected as superficial clone or repetitive family (score: ${clampedScore.toFixed(2)}).`,
    };
  }
}
