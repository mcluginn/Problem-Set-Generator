/**
 * Deterministic Distractor Generator for Quiz Mode Multiple Choice
 * Engineering Practice Engine — Quiz Assessment Engine
 */

import { ValidatedProblem } from '../content/types';
import { QuizOption } from './types';
import { MathNormalizer } from '../../lib/math/mathNormalizer';
import katex from 'katex';

export class DistractorGenerator {
  /**
   * Helper to normalize mathematical strings for duplicate comparisons.
   */
  private static normalize(s?: string): string {
    if (!s) return '';
    return s.replace(/\s+/g, '').replace(/[{}]/g, '').toLowerCase();
  }

  /**
   * Seeded pseudo-random number generator (Mulberry32-based).
   */
  private static createSeededRng(seedStr: string): () => number {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function() {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  /**
   * Deterministic Fisher-Yates shuffle.
   */
  private static seededShuffle<T>(array: T[], rng: () => number): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const temp = result[i];
      result[i] = result[j];
      result[j] = temp;
    }
    return result;
  }

  /**
   * Generates 4 distinct, pedagogically grounded options (1 correct, 3 unique distractors) for a given problem.
   */
  public static generateOptions(problem: ValidatedProblem, seedKey?: string): QuizOption[] {
    const canonicalLatex = (problem.solution.canonicalAnswerLatex || '0').trim();
    const canonicalRaw = (problem.solution.canonicalAnswerRaw || canonicalLatex).trim();
    const normCanonicalLatex = this.normalize(canonicalLatex);
    const normCanonicalRaw = this.normalize(canonicalRaw);

    const rawDistractors: Array<{
      latex: string;
      raw: string;
      code: string;
      explanation: string;
    }> = [];

    const isValidOptionLatex = (cand: string): boolean => {
      if (!cand || !cand.trim()) return false;
      let p = 0, b = 0;
      for (let i = 0; i < cand.length; i++) {
        const c = cand[i];
        if (c === '(') p++;
        else if (c === ')') p--;
        else if (c === '{' && (i === 0 || cand[i - 1] !== '\\')) b++;
        else if (c === '}' && (i === 0 || cand[i - 1] !== '\\')) b--;
        if (p < 0 || b < 0) return false;
      }
      if (p !== 0 || b !== 0) return false;
      try {
        const normalized = MathNormalizer.normalizePureMath(cand);
        const html = katex.renderToString(normalized, { throwOnError: false });
        return !html.includes('katex-error') && !html.includes('#cc0000');
      } catch {
        return false;
      }
    };

    const isDuplicate = (candLatex: string, candRaw: string) => {
      if (!isValidOptionLatex(candLatex)) return true;
      const nLatex = this.normalize(candLatex);
      const nRaw = this.normalize(candRaw);
      if (!nLatex || !nRaw) return true;
      if (nLatex === normCanonicalLatex || nRaw === normCanonicalRaw) return true;
      if (candLatex === canonicalLatex || candRaw === canonicalRaw) return true;
      return rawDistractors.some(d =>
        this.normalize(d.latex) === nLatex ||
        this.normalize(d.raw) === nRaw ||
        d.latex === candLatex ||
        d.raw === candRaw
      );
    };

    // 1. Check if problem template already defined verified distractors
    const existingDistractors = (problem as any).statement?.distractors || (problem as any).distractors || [];
    if (Array.isArray(existingDistractors)) {
      for (const d of existingDistractors) {
        if (rawDistractors.length >= 3) break;
        const dLatex = (d.distractorLatex || d.textLatex || d.distractorRaw || '').trim();
        const dRaw = (d.distractorRaw || d.textRaw || d.distractorLatex || '').trim();
        if (dLatex && !isDuplicate(dLatex, dRaw)) {
          rawDistractors.push({
            latex: dLatex,
            raw: dRaw || dLatex,
            code: d.targetedMisconceptionCode || 'MISC-GEN-01',
            explanation: d.pedagogicalExplanation || 'Common conceptual procedural slip.'
          });
        }
      }
    }

    // 2. Synthesize domain-specific distractors if needed
    if (rawDistractors.length < 3) {
      const generated = this.synthesizeDistractors(problem, canonicalLatex, canonicalRaw);
      for (const g of generated) {
        if (rawDistractors.length >= 3) break;
        if (!isDuplicate(g.latex, g.raw)) {
          rawDistractors.push(g);
        }
      }
    }

    // 2b. If still under 3 and canonical answer is algebraic, synthesize algebraic distractors
    const cleanCanonical = canonicalRaw.trim();
    const isPureNumber = /^-?\d+(?:\.\d+)?$/.test(cleanCanonical);
    const isPureFraction = /^-?\d+\s*\/\s*\d+$/.test(cleanCanonical);
    const isNumeric = isPureNumber || isPureFraction;

    if (rawDistractors.length < 3 && !isNumeric) {
      const algGenerated = this.synthesizeAlgebraicDistractors(canonicalLatex, canonicalRaw);
      for (const g of algGenerated) {
        if (rawDistractors.length >= 3) break;
        if (!isDuplicate(g.latex, g.raw)) {
          rawDistractors.push(g);
        }
      }
    }

    // 3. Fallback generic distractors if still under 3
    let fallbackCounter = 1;
    while (rawDistractors.length < 3 && fallbackCounter < 25) {
      let fakeLatex = '';
      let fakeRaw = '';
      let code = `MISC-ALG-0${fallbackCounter}`;
      let explanation = 'Algebraic calculation or procedural step slip.';

      if (isPureNumber) {
        const numVal = parseFloat(cleanCanonical);
        const offset = fallbackCounter === 1
          ? (numVal === 0 ? 1 : -numVal)
          : fallbackCounter === 2
          ? numVal + 2
          : fallbackCounter === 3
          ? numVal * 2 + 1
          : numVal - fallbackCounter * 2;
        fakeLatex = offset.toString();
        fakeRaw = offset.toString();
        code = fallbackCounter === 1 ? 'MISC-SIGN-001' : 'MISC-ARITH-001';
        explanation = fallbackCounter === 1 ? 'Sign error during calculation.' : 'Arithmetic offset slip.';
      } else if (isPureFraction) {
        const parts = cleanCanonical.split('/');
        const n = parseInt(parts[0], 10);
        const d = parseInt(parts[1], 10);
        if (fallbackCounter === 1) {
          fakeLatex = `-\\frac{${Math.abs(n)}}{${d}}`;
          fakeRaw = `-${Math.abs(n)}/${d}`;
          code = 'MISC-SIGN-001';
          explanation = 'Sign error in fraction evaluation.';
        } else if (fallbackCounter === 2 && n !== 0) {
          fakeLatex = `\\frac{${d}}{${n}}`;
          fakeRaw = `${d}/${n}`;
          code = 'MISC-RECIP-001';
          explanation = 'Inverted reciprocal numerator and denominator.';
        } else {
          fakeLatex = `\\frac{${n + fallbackCounter}}{${d}}`;
          fakeRaw = `${n + fallbackCounter}/${d}`;
          code = 'MISC-ARITH-002';
          explanation = 'Numerator calculation offset.';
        }
      } else if (canonicalLatex.includes('=')) {
        // Equation fallback: scale numbers inside equation instead of prepending '-' or '2 (...)'
        const numMatch = canonicalLatex.match(/\d+(?:\.\d+)?/g);
        if (numMatch && numMatch.length > 0) {
          const targetNum = numMatch[fallbackCounter % numMatch.length];
          const val = parseFloat(targetNum);
          const factor = 1 + ((fallbackCounter % 3) + 1) * 0.12 * (fallbackCounter % 2 === 0 ? -1 : 1);
          const newNum = Math.abs(val * factor).toFixed(targetNum.includes('.') ? 2 : 0);
          const tIdx = canonicalLatex.lastIndexOf(targetNum);
          if (tIdx !== -1) {
            fakeLatex = canonicalLatex.substring(0, tIdx) + newNum + canonicalLatex.substring(tIdx + targetNum.length);
          } else {
            fakeLatex = canonicalLatex.replace(targetNum, newNum);
          }
        } else {
          fakeLatex = canonicalLatex.replace('=', '= -');
        }
        fakeRaw = fakeLatex;
        code = `MISC-CALC-0${fallbackCounter}`;
        explanation = 'Formula parameter evaluation error in equation.';
      } else {
        // Pure algebraic fallback variations (non-equation expressions)
        if (fallbackCounter === 1) {
          fakeLatex = canonicalLatex.includes('+')
            ? canonicalLatex.replace('+', '-')
            : canonicalLatex.includes('-')
            ? canonicalLatex.replace('-', '+')
            : `-${canonicalLatex}`;
          fakeRaw = fakeLatex;
          code = 'MISC-SIGN-001';
          explanation = 'Sign transformation error across terms.';
        } else if (fallbackCounter === 2) {
          fakeLatex = canonicalLatex.replace(/(\d+)/, (m, c) => `${Number(c) * 2}`);
          fakeRaw = fakeLatex;
          code = 'MISC-COEFF-001';
          explanation = 'Incorrect scaling multiplier or factor doubling.';
        } else if (fallbackCounter === 3) {
          fakeLatex = canonicalLatex.replace(/x\^(\d+)/, (m, p) => `x^{${Number(p) + 1}}`);
          fakeRaw = fakeLatex;
          code = 'MISC-POWER-001';
          explanation = 'Exponent calculation slip.';
        } else {
          fakeLatex = fallbackCounter % 2 === 0
            ? `2 (${canonicalLatex})`
            : canonicalLatex.startsWith('-')
            ? canonicalLatex.slice(1)
            : `-${canonicalLatex}`;
          fakeRaw = fakeLatex;
          code = `MISC-ALG-0${fallbackCounter}`;
          explanation = 'Procedural algebraic transformation variation.';
        }
      }

      if (fakeLatex && !isDuplicate(fakeLatex, fakeRaw)) {
        rawDistractors.push({
          latex: fakeLatex,
          raw: fakeRaw,
          code,
          explanation
        });
      }
      fallbackCounter++;
    }

    // Ensure we have exactly 3 distractors
    while (rawDistractors.length < 3) {
      const idx = rawDistractors.length + 1;
      let fake: string;
      if (isNumeric) {
        fake = `${idx * 3 + 1}`;
      } else if (canonicalLatex.includes('=')) {
        // Safe equation fallback: mutate numbers if available, else mutate after '='
        const m = Array.from(canonicalLatex.matchAll(/-?\d+(?:\.\d+)?/g));
        if (m.length > 0) {
          const targetM = m[Math.min(idx - 1, m.length - 1)];
          const val = parseFloat(targetM[0]);
          const newV = (val * (1 + idx * 0.15 * (idx % 2 === 0 ? -1 : 1))).toFixed(targetM[0].includes('.') ? 2 : 0);
          fake = canonicalLatex.substring(0, targetM.index!) + newV + canonicalLatex.substring(targetM.index! + targetM[0].length);
        } else {
          fake = canonicalLatex.replace('=', idx % 2 === 0 ? '= -' : '= 2');
        }
      } else {
        fake = idx === 1
          ? `-${canonicalLatex}`
          : idx === 2
          ? `2 (${canonicalLatex})`
          : `(${canonicalLatex}) + 1`;
      }
      rawDistractors.push({
        latex: fake,
        raw: fake,
        code: `MISC-SYNTH-0${idx}`,
        explanation: 'Procedural variation distractor.'
      });
    }

    // 4. Combine canonical answer with 3 distractors
    const candidateItems: Array<{
      latex: string;
      raw: string;
      isCorrect: boolean;
      code?: string;
      explanation?: string;
    }> = [
      {
        latex: canonicalLatex,
        raw: canonicalRaw,
        isCorrect: true
      },
      ...rawDistractors.slice(0, 3).map(d => ({
        latex: d.latex,
        raw: d.raw,
        isCorrect: false,
        code: d.code,
        explanation: d.explanation
      }))
    ];

    // 5. Seeded Fisher-Yates shuffle based on quiz / problem seed
    const effectiveSeed = seedKey || `${problem.dna.problemId}-${problem.dna.primarySkillId}`;
    const rng = this.createSeededRng(effectiveSeed);
    const shuffled = this.seededShuffle(candidateItems, rng);

    // 6. Validate invariant: exactly 1 correct, exactly 3 distractors, exactly 4 unique options
    const correctCount = shuffled.filter(opt => opt.isCorrect).length;
    if (correctCount !== 1 || shuffled.length !== 4) {
      throw new Error(`DistractorGenerator Invariant Violation: expected 1 correct option and 3 distractors, got ${correctCount} correct out of ${shuffled.length}.`);
    }

    const optionLabels = ['A', 'B', 'C', 'D'];
    return shuffled.map((item, index) => ({
      id: optionLabels[index],
      label: optionLabels[index],
      textLatex: item.latex,
      textRaw: item.raw,
      isCorrect: item.isCorrect,
      targetedMisconceptionCode: item.code,
      pedagogicalExplanation: item.explanation
    }));
  }

  private static synthesizeDistractors(
    problem: ValidatedProblem,
    canonicalLatex: string,
    canonicalRaw: string
  ): Array<{ latex: string; raw: string; code: string; explanation: string }> {
    const list: Array<{ latex: string; raw: string; code: string; explanation: string }> = [];
    const skillId = problem.dna.primarySkillId;
    const num = parseFloat(canonicalRaw.replace(/[^\d.-]/g, ''));

    // If numerical answer (e.g. limit evaluation, definite integral, or physics evaluation)
    if (!isNaN(num) && canonicalRaw.trim().match(/^-?\d+(\.\d+)?$/)) {
      list.push({
        latex: '0',
        raw: '0',
        code: 'MISC-LIMIT-001',
        explanation: 'Evaluated indeterminate form 0/0 by direct substitution without algebraic simplification.'
      });
      list.push({
        latex: (-num).toString(),
        raw: (-num).toString(),
        code: 'MISC-SIGN-001',
        explanation: 'Sign error during algebraic factoring and cancellation.'
      });
      list.push({
        latex: (num * 2).toString(),
        raw: (num * 2).toString(),
        code: 'MISC-COEFF-001',
        explanation: 'Multiplication or reciprocal factor error during substitution.'
      });
      list.push({
        latex: (num + 2).toString(),
        raw: (num + 2).toString(),
        code: 'MISC-ARITH-001',
        explanation: 'Arithmetic evaluation slip at the substitution boundary.'
      });
      return list;
    }

    // Polynomial derivative distractors
    if (skillId.includes('002') || skillId.includes('POWER')) {
      // e.g. canonical 12x^2 + 3
      // Distractor 1: forgot to multiply power
      list.push({
        latex: canonicalLatex.replace(/(\d+)x\^?(\d*)/g, (m, c, p) => `${Math.max(1, Math.round(Number(c) / (Number(p) + 1 || 2)))}x^{${p}}`),
        raw: 'forgot-power-factor',
        code: 'MISC-POWER-001',
        explanation: 'Subtracted 1 from exponent but forgot to multiply term by original power.'
      });
      // Distractor 2: did not decrement exponent
      list.push({
        latex: canonicalLatex.replace(/x\^?(\d*)/g, (m, p) => `x^{${(Number(p) || 1) + 1}}`),
        raw: 'failed-to-decrement',
        code: 'MISC-POWER-002',
        explanation: 'Multiplied by power but forgot to decrease the exponent by 1.'
      });
      // Distractor 3: differentiated linear term as 0
      list.push({
        latex: canonicalLatex.replace(/[+-]\s*\d+$/, ''),
        raw: 'dropped-linear-derivative',
        code: 'MISC-POWER-003',
        explanation: 'Treated linear term derivative as constant 0.'
      });
    }

    // Product Rule Distractor: (f' * g')
    if (skillId.includes('003') || skillId.includes('PRODUCT')) {
      list.push({
        latex: canonicalLatex.replace(/\+/g, '\\cdot'),
        raw: 'product-of-derivatives',
        code: 'MISC-PRODUCT-001',
        explanation: 'Multiplied individual derivatives (f\'(x) * g\'(x)) instead of using the product rule (f\'g + fg\').'
      });
      list.push({
        latex: canonicalLatex.replace(/\+/g, '-'),
        raw: 'sign-flip-product',
        code: 'MISC-PRODUCT-002',
        explanation: 'Subtracted terms instead of adding in the product rule expansion.'
      });
    }

    // Quotient Rule Distractor: sign error or missing denominator squared
    if (skillId.includes('004') || skillId.includes('QUOTIENT')) {
      list.push({
        latex: canonicalLatex.replace(/-/g, '+'),
        raw: 'quotient-sign-flip',
        code: 'MISC-QUOTIENT-001',
        explanation: 'Added instead of subtracted in quotient rule numerator (f\'g - fg\').'
      });
      list.push({
        latex: canonicalLatex.replace(/\^2/g, ''),
        raw: 'unsquared-denominator',
        code: 'MISC-QUOTIENT-002',
        explanation: 'Forgot to square the denominator function g(x) in the quotient rule.'
      });
    }

    // Chain Rule Distractor: omitted inner derivative
    if (skillId.includes('005') || skillId.includes('CHAIN')) {
      list.push({
        latex: canonicalLatex.replace(/\\cdot.*/, ''),
        raw: 'omitted-inner-derivative',
        code: 'MISC-CHAIN-001',
        explanation: 'Differentiated outer function but forgot to multiply by the derivative of the inner function.'
      });
    }

    return list;
  }

  /**
   * Synthesizes mathematically coherent algebraic distractors for general symbolic expressions.
   * Produces realistic pedagogical variations (sign flips, coefficient errors, chain/product slips).
   */
  private static synthesizeAlgebraicDistractors(
    canonicalLatex: string,
    canonicalRaw: string
  ): Array<{ latex: string; raw: string; code: string; explanation: string }> {
    const list: Array<{ latex: string; raw: string; code: string; explanation: string }> = [];
    const expr = canonicalLatex.trim();

    // 0. Equations and multi-part results (containing '=')
    if (expr.includes('=')) {
      const numberMatches = Array.from(expr.matchAll(/-?\d+(?:\.\d+)?/g));
      if (numberMatches.length >= 2) {
        // Multi-part equation with multiple numbers e.g. f_app = 929.03 Hz, f_rec = 691.89 Hz
        // Variation 1: scale first number
        const num1Str = numberMatches[0][0];
        const num1Val = parseFloat(num1Str);
        const scale1 = (num1Val * 0.88).toFixed(num1Str.includes('.') ? 2 : 0);
        const cand1 = expr.substring(0, numberMatches[0].index!) + scale1 + expr.substring(numberMatches[0].index! + num1Str.length);
        list.push({
          latex: cand1,
          raw: cand1,
          code: 'MISC-CALC-01',
          explanation: 'Parameter evaluation error in first equation term.'
        });

        // Variation 2: scale second number
        const num2Str = numberMatches[1][0];
        const num2Val = parseFloat(num2Str);
        const scale2 = (num2Val * 1.14).toFixed(num2Str.includes('.') ? 2 : 0);
        const cand2 = expr.substring(0, numberMatches[1].index!) + scale2 + expr.substring(numberMatches[1].index! + num2Str.length);
        list.push({
          latex: cand2,
          raw: cand2,
          code: 'MISC-CALC-02',
          explanation: 'Parameter evaluation error in second equation term.'
        });

        // Variation 3: scale both numbers
        const scaleBoth1 = (num1Val * 1.12).toFixed(num1Str.includes('.') ? 2 : 0);
        const scaleBoth2 = (num2Val * 0.85).toFixed(num2Str.includes('.') ? 2 : 0);
        let cand3 = expr.substring(0, numberMatches[0].index!) + scaleBoth1 + expr.substring(numberMatches[0].index! + num1Str.length);
        const delta = scaleBoth1.length - num1Str.length;
        const newIdx2 = numberMatches[1].index! + delta;
        cand3 = cand3.substring(0, newIdx2) + scaleBoth2 + cand3.substring(newIdx2 + num2Str.length);
        list.push({
          latex: cand3,
          raw: cand3,
          code: 'MISC-CALC-03',
          explanation: 'Compound evaluation error across both variables.'
        });

        return list;
      } else if (numberMatches.length === 1) {
        // Single numerical equation e.g. v = 25.4 m/s or T = 150 deg C
        const numStr = numberMatches[0][0];
        const numVal = parseFloat(numStr);
        const isDec = numStr.includes('.');
        const factors = [0.85, 1.18, 0.5];
        for (let fi = 0; fi < factors.length; fi++) {
          const newNum = (numVal * factors[fi]).toFixed(isDec ? 2 : 0);
          const cand = expr.substring(0, numberMatches[0].index!) + newNum + expr.substring(numberMatches[0].index! + numStr.length);
          list.push({
            latex: cand,
            raw: cand,
            code: `MISC-CALC-0${fi + 1}`,
            explanation: 'Numerical parameter evaluation slip in equation.'
          });
        }
        return list;
      } else {
        // Pure algebraic equation without numbers, e.g. dy/dx = f(x)
        // Keep LHS intact and mutate RHS
        const eqIdx = expr.indexOf('=');
        const lhs = expr.substring(0, eqIdx + 1);
        const rhs = expr.substring(eqIdx + 1).trim();
        const rhsDistractors = DistractorGenerator.synthesizeAlgebraicDistractors(rhs, rhs);
        for (const rd of rhsDistractors) {
          list.push({
            latex: `${lhs} ${rd.latex}`,
            raw: `${lhs} ${rd.raw}`,
            code: rd.code,
            explanation: rd.explanation
          });
        }
        return list;
      }
    }

    // 1. Sign flip in compound expressions
    if (expr.includes('+')) {
      list.push({
        latex: expr.replace('+', '-'),
        raw: expr.replace('+', '-'),
        code: 'MISC-SIGN-001',
        explanation: 'Sign error: subtracted terms instead of adding.'
      });
    }
    if (expr.includes('-')) {
      list.push({
        latex: expr.replace('-', '+'),
        raw: expr.replace('-', '+'),
        code: 'MISC-SIGN-002',
        explanation: 'Sign error: added terms instead of subtracting.'
      });
    }

    // 2. Multiplier / coefficient slips (chain rule / product rule)
    // Halve or drop first leading integer coefficient (e.g. 2y -> y, 4x -> 2x, 6x -> 3x)
    const coeffMatch = expr.match(/(^|[^a-zA-Z0-9])([2-9])([a-zA-Z])/);
    if (coeffMatch) {
      const origCoeff = Number(coeffMatch[2]);
      const newCoeff = origCoeff === 2 ? '' : `${Math.floor(origCoeff / 2)}`;
      const candidate = expr.replace(coeffMatch[0], `${coeffMatch[1]}${newCoeff}${coeffMatch[3]}`);
      if (candidate !== expr) {
        list.push({
          latex: candidate,
          raw: candidate,
          code: 'MISC-CHAIN-001',
          explanation: 'Omitted inner derivative multiplier during differentiation.'
        });
      }
    }

    // Double first integer coefficient (e.g. 2y -> 4y, 3x -> 6x)
    if (coeffMatch) {
      const origCoeff = Number(coeffMatch[2]);
      const candidate = expr.replace(coeffMatch[0], `${coeffMatch[1]}${origCoeff * 2}${coeffMatch[3]}`);
      if (candidate !== expr) {
        list.push({
          latex: candidate,
          raw: candidate,
          code: 'MISC-COEFF-002',
          explanation: 'Incorrect multiplier factor applied during chain rule execution.'
        });
      }
    }

    // 3. Omitted variable factor in product rule (e.g. 2ye^{2xy} -> 2e^{2xy})
    const productVarMatch = expr.match(/(\d+)?([a-zA-Z])(e\^|\\sin|\\cos|\\ln)/);
    if (productVarMatch) {
      const numPrefix = productVarMatch[1] || '';
      const fnPart = productVarMatch[3];
      const candidate = expr.replace(productVarMatch[0], `${numPrefix}${fnPart}`);
      if (candidate !== expr) {
        list.push({
          latex: candidate,
          raw: candidate,
          code: 'MISC-PRODUCT-001',
          explanation: 'Omitted variable factor during product rule differentiation.'
        });
      }
    }

    // 4. Exponent slip (e.g. e^{2xy} -> e^{xy} or e^{2x})
    const expMatch = expr.match(/e\^\{([^}]+)\}/);
    if (expMatch) {
      const innerExp = expMatch[1];
      if (/\d/.test(innerExp)) {
        const droppedNumExp = innerExp.replace(/\d+/g, '');
        const cand1 = expr.replace(expMatch[0], `e^{${droppedNumExp}}`);
        if (cand1 !== expr) {
          list.push({
            latex: cand1,
            raw: cand1,
            code: 'MISC-EXP-001',
            explanation: 'Failed to preserve exponent constant scaling factor.'
          });
        }
      }
      if (innerExp.length >= 2) {
        const droppedVarExp = innerExp.slice(0, -1);
        const cand2 = expr.replace(expMatch[0], `e^{${droppedVarExp}}`);
        if (cand2 !== expr) {
          list.push({
            latex: cand2,
            raw: cand2,
            code: 'MISC-EXP-002',
            explanation: 'Omitted inner variable in exponential function.'
          });
        }
      }
    }

    // 5. Incomplete multi-term evaluation (differentiated only first or second term)
    // Only split at depth 0 of parentheses and braces so fractions and expressions are not cut in half
    if (expr.includes(' + ')) {
      let depthParen = 0;
      let depthBrace = 0;
      let splitIdx = -1;
      for (let i = 0; i < expr.length - 3; i++) {
        const c = expr[i];
        if (c === '(' || c === '[') depthParen++;
        else if (c === ')' || c === ']') depthParen--;
        else if (c === '{') depthBrace++;
        else if (c === '}') depthBrace--;
        if (depthParen === 0 && depthBrace === 0 && expr.substring(i, i + 3) === ' + ') {
          splitIdx = i;
          break;
        }
      }
      if (splitIdx !== -1) {
        const part0 = expr.substring(0, splitIdx).trim();
        const part1 = expr.substring(splitIdx + 3).trim();
        if (part0 && part1) {
          list.push({
            latex: part0,
            raw: part0,
            code: 'MISC-TERM-001',
            explanation: 'Incomplete derivative: evaluated only the first term and dropped remaining terms.'
          });
          list.push({
            latex: part1,
            raw: part1,
            code: 'MISC-TERM-002',
            explanation: 'Incomplete derivative: dropped leading term and evaluated only the second term.'
          });
        }
      }
    }

    // 6. Polynomial power shift (e.g. 6x -> 6 or 6x -> 6x^2)
    const linMatch = expr.match(/(^|\+|\-)\s*(\d+)([a-zA-Z])(?!\^)/);
    if (linMatch) {
      // Differentiated to constant (6x -> 6)
      const candConst = expr.replace(linMatch[0], `${linMatch[1]} ${linMatch[2]}`);
      if (candConst !== expr) {
        list.push({
          latex: candConst.trim(),
          raw: candConst.trim(),
          code: 'MISC-POWER-003',
          explanation: 'Differentiated linear polynomial term directly to constant.'
        });
      }
      // Integrated instead (6x -> 3x^2)
      const halfC = Math.max(1, Math.floor(Number(linMatch[2]) / 2));
      const candInteg = expr.replace(linMatch[0], `${linMatch[1]} ${halfC}${linMatch[3]}^{2}`);
      if (candInteg !== expr) {
        list.push({
          latex: candInteg.trim(),
          raw: candInteg.trim(),
          code: 'MISC-INT-001',
          explanation: 'Integrated term instead of differentiating.'
        });
      }
    }

    // 7. Overall sign inversion
    const inverted = expr.startsWith('-') ? expr.slice(1).trim() : `-${expr}`;
    list.push({
      latex: inverted,
      raw: inverted,
      code: 'MISC-SIGN-003',
      explanation: 'Overall sign inversion error.'
    });

    return list;
  }
}
