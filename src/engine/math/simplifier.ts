/**
 * Deterministic Mathematical Simplifier & Canonicalizer
 * Handles constant folding, algebraic reductions, term gathering, and canonical sorting.
 */

import {
  MathNode,
  ConstantNode,
  AddNode,
  constant,
  variable,
  add,
  subtract,
  multiply,
  divide,
  power,
  negate,
  func,
  nodeEquals,
  ZERO,
  ONE,
  NEG_ONE,
  countNodes,
  getPrecedence,
} from './ast';
import { Rational, R0, R1, R_NEG1 } from './rational';

export class Simplifier {
  /**
   * Fully simplifies a math expression using fixed-point iteration until convergence.
   */
  public static simplify(node: MathNode): MathNode {
    let current = node;
    let prev = node;
    const maxPasses = 25; // Terminating bound to prevent cycles

    for (let i = 0; i < maxPasses; i++) {
      current = Simplifier.canonicalize(Simplifier.simplifyPass(current));
      if (nodeEquals(current, prev)) {
        break;
      }
      prev = current;
    }

    return current;
  }

  private static simplifyPass(node: MathNode): MathNode {
    switch (node.type) {
      case 'constant':
      case 'variable':
      case 'derivative_term':
        return node;

      case 'negate': {
        const arg = Simplifier.simplifyPass(node.arg);
        if (arg.type === 'constant' && !arg.symbolic) {
          return constant(arg.value.neg());
        }
        if (arg.type === 'negate') {
          return arg.arg;
        }
        if (arg.type === 'constant' && arg.value.isZero()) {
          return ZERO;
        }
        // Distribute negation over addition: -(a + b) -> -a - b
        if (arg.type === 'add') {
          return add(...arg.terms.map(negate));
        }
        // Distribute negation into multiply with constant: -(c * x) -> (-c) * x
        if (arg.type === 'multiply' && arg.factors.length > 0 && arg.factors[0].type === 'constant' && !arg.factors[0].symbolic) {
          const newConst = constant(arg.factors[0].value.neg());
          return multiply(newConst, ...arg.factors.slice(1));
        }
        return negate(arg);
      }

      case 'add':
        return Simplifier.simplifyAdd(node);

      case 'multiply':
        return Simplifier.simplifyMultiply(node);

      case 'divide':
        return Simplifier.simplifyDivide(node);

      case 'power':
        return Simplifier.simplifyPower(node);

      case 'function': {
        const simplifiedArgs = node.args.map(Simplifier.simplifyPass);
        // Special function evaluations
        if (node.fn === 'sqrt' && simplifiedArgs[0].type === 'constant' && !simplifiedArgs[0].symbolic) {
          const val = simplifiedArgs[0].value;
          if (val.isZero()) return ZERO;
          if (val.isOne()) return ONE;
          if (val.isInteger()) {
            const n = Number(val.num);
            const r = Math.round(Math.sqrt(n));
            if (r * r === n) return constant(r);
          }
        }
        if (node.fn === 'ln' && simplifiedArgs[0].type === 'constant') {
          if (simplifiedArgs[0].symbolic === 'e') return ONE;
          if (simplifiedArgs[0].value.isOne()) return ZERO;
        }
        if (node.fn === 'exp' && simplifiedArgs[0].type === 'constant' && simplifiedArgs[0].value.isZero()) {
          return ONE;
        }
        if (node.fn === 'sin' && simplifiedArgs[0].type === 'constant' && simplifiedArgs[0].value.isZero()) {
          return ZERO;
        }
        if (node.fn === 'cos' && simplifiedArgs[0].type === 'constant' && simplifiedArgs[0].value.isZero()) {
          return ONE;
        }
        return func(node.fn, ...simplifiedArgs);
      }
    }
  }

  /* ========================================================================= */
  /*                             Add Simplification                            */
  /* ========================================================================= */

  private static simplifyAdd(node: MathNode): MathNode {
    if (node.type !== 'add') return node;

    // 1. Flatten and recursively simplify child terms
    const rawTerms: MathNode[] = [];
    for (const t of node.terms) {
      const s = Simplifier.simplifyPass(t);
      if (s.type === 'add') {
        rawTerms.push(...s.terms);
      } else {
        rawTerms.push(s);
      }
    }

    // 2. Separate constants and collect like terms
    let constSum = R0;
    const termMap: Array<{ coeff: Rational; core: MathNode }> = [];

    for (const t of rawTerms) {
      if (t.type === 'constant' && !t.symbolic) {
        constSum = constSum.add(t.value);
        continue;
      }

      // Extract coefficient from term: e.g. 5x -> coeff 5, core x; -x -> coeff -1, core x
      const { coeff, core } = Simplifier.extractCoeff(t);

      // Check if core already in termMap
      const existing = termMap.find((item) => nodeEquals(item.core, core));
      if (existing) {
        existing.coeff = existing.coeff.add(coeff);
      } else {
        termMap.push({ coeff, core });
      }
    }

    // 3. Reconstruct non-zero terms
    const newTerms: MathNode[] = [];

    for (const item of termMap) {
      if (item.coeff.isZero()) continue;
      if (item.coeff.isOne()) {
        newTerms.push(item.core);
      } else if (item.coeff.equals(R_NEG1)) {
        newTerms.push(negate(item.core));
      } else {
        newTerms.push(multiply(constant(item.coeff), item.core));
      }
    }

    if (!constSum.isZero() || newTerms.length === 0) {
      if (newTerms.length === 0) {
        return constant(constSum);
      }
      newTerms.push(constant(constSum));
    }

    if (newTerms.length === 1) return newTerms[0];
    return add(...newTerms);
  }

  /* ========================================================================= */
  /*                          Multiply Simplification                          */
  /* ========================================================================= */

  private static simplifyMultiply(node: MathNode): MathNode {
    if (node.type !== 'multiply') return node;

    // 1. Flatten and simplify factors
    const rawFactors: MathNode[] = [];
    for (const f of node.factors) {
      const s = Simplifier.simplifyPass(f);
      if (s.type === 'multiply') {
        rawFactors.push(...s.factors);
      } else {
        rawFactors.push(s);
      }
    }

    // 2. Annihilator check: if any factor is 0, entire product is 0
    let constProduct = R1;
    let hasNegation = false;
    const factorMap: Array<{ base: MathNode; exponent: Rational }> = [];

    for (const f of rawFactors) {
      if (f.type === 'constant' && !f.symbolic) {
        if (f.value.isZero()) return ZERO;
        constProduct = constProduct.mul(f.value);
        continue;
      }

      let current = f;
      if (current.type === 'negate') {
        hasNegation = !hasNegation;
        current = current.arg;
      }

      // Extract base and power: e.g. x^3 -> base x, exp 3; x -> base x, exp 1
      const { base, exp } = Simplifier.extractBaseExponent(current);
      const existing = factorMap.find((item) => nodeEquals(item.base, base));
      if (existing) {
        existing.exponent = existing.exponent.add(exp);
      } else {
        factorMap.push({ base, exponent: exp });
      }
    }

    if (hasNegation) {
      constProduct = constProduct.neg();
    }

    // 3. Reconstruct terms
    const newFactors: MathNode[] = [];

    if (!constProduct.isOne() || factorMap.length === 0) {
      if (constProduct.equals(R_NEG1) && factorMap.length > 0) {
        // Handle -1 by wrapping first factor in negate or keeping -1
        newFactors.push(constant(-1));
      } else {
        newFactors.push(constant(constProduct));
      }
    }

    for (const item of factorMap) {
      if (item.exponent.isZero()) continue;
      if (item.exponent.isOne()) {
        newFactors.push(item.base);
      } else {
        newFactors.push(power(item.base, constant(item.exponent)));
      }
    }

    if (newFactors.length === 0) return ONE;
    if (newFactors.length === 1) return newFactors[0];

    // If first factor is -1 and 2nd factor is present, we can simplify (-1)*x -> -x
    if (newFactors.length === 2 && newFactors[0].type === 'constant' && newFactors[0].value.equals(R_NEG1)) {
      return negate(newFactors[1]);
    }

    const sorted = [...newFactors].sort(Simplifier.compareFactors);
    return multiply(...sorted);
  }

  /* ========================================================================= */
  /*                            Divide Simplification                          */
  /* ========================================================================= */

  private static simplifyDivide(node: MathNode): MathNode {
    if (node.type !== 'divide') return node;

    const num = Simplifier.simplifyPass(node.numerator);
    const den = Simplifier.simplifyPass(node.denominator);

    // Division by 1: x / 1 -> x
    if (den.type === 'constant' && den.value.isOne()) {
      return num;
    }

    // 0 / x -> 0
    if (num.type === 'constant' && num.value.isZero()) {
      return ZERO;
    }

    // Exact constants: c1 / c2 -> c1 / c2
    if (num.type === 'constant' && !num.symbolic && den.type === 'constant' && !den.symbolic) {
      return constant(num.value.div(den.value));
    }

    // x / x -> 1
    if (nodeEquals(num, den)) {
      return ONE;
    }

    // Handle negative signs: (-A)/B -> -(A/B), A/(-B) -> -(A/B), (-A)/(-B) -> A/B
    if (num.type === 'negate' && den.type === 'negate') {
      return Simplifier.simplifyDivide(divide(num.arg, den.arg));
    }
    if (num.type === 'negate') {
      return negate(Simplifier.simplifyDivide(divide(num.arg, den)));
    }
    if (den.type === 'negate') {
      return negate(Simplifier.simplifyDivide(divide(num, den.arg)));
    }

    // Fraction of constants in numerator & denominator: (c1 * X) / (c2 * Y) -> (c1/c2) * (X/Y)
    const numCoeff = Simplifier.extractCoeff(num);
    const denCoeff = Simplifier.extractCoeff(den);

    if (!numCoeff.coeff.equals(R1) || !denCoeff.coeff.equals(R1)) {
      const combinedCoeff = numCoeff.coeff.div(denCoeff.coeff);
      const reducedNumCore = numCoeff.core;
      const reducedDenCore = denCoeff.core;

      if (combinedCoeff.isZero()) return ZERO;
      if (nodeEquals(reducedNumCore, reducedDenCore)) {
        return constant(combinedCoeff);
      }

      const simplifiedCoreDiv =
        reducedNumCore.type === 'constant' && reducedNumCore.value.isOne()
          ? divide(ONE, reducedDenCore)
          : Simplifier.simplifyDivide(divide(reducedNumCore, reducedDenCore));

      if (combinedCoeff.isOne()) return simplifiedCoreDiv;
      if (combinedCoeff.equals(R_NEG1)) return negate(simplifiedCoreDiv);

      if (simplifiedCoreDiv.type === 'divide') {
        const top =
          combinedCoeff.num === 1n
            ? simplifiedCoreDiv.numerator
            : combinedCoeff.num === -1n
            ? negate(simplifiedCoreDiv.numerator)
            : multiply(constant(combinedCoeff.num), simplifiedCoreDiv.numerator);

        const bot =
          combinedCoeff.den === 1n
            ? simplifiedCoreDiv.denominator
            : multiply(constant(combinedCoeff.den), simplifiedCoreDiv.denominator);

        return divide(Simplifier.simplifyPass(top), Simplifier.simplifyPass(bot));
      }

      return Simplifier.simplifyPass(multiply(constant(combinedCoeff), simplifiedCoreDiv));
    }

    // Fraction of polynomial sum terms with common integer factor:
    // e.g. (-3x^2 + 9y) / (3y^2 - 9x) -> (3y - x^2) / (y^2 - 3x)
    if (num.type === 'add' && den.type === 'add') {
      const numGcd = Simplifier.extractAddScalarGcd(num);
      const denGcd = Simplifier.extractAddScalarGcd(den);
      if (numGcd > 1n && denGcd > 1n) {
        const commonGcd = Simplifier.gcdBigInt(numGcd, denGcd);
        if (commonGcd > 1n) {
          const reducedNum = Simplifier.divideAddByScalar(num, commonGcd);
          const reducedDen = Simplifier.divideAddByScalar(den, commonGcd);
          return Simplifier.simplifyPass(divide(reducedNum, reducedDen));
        }
      }
    }

    // Common factor reduction: e.g. (2 * x * y) / x^2 -> 2y / x
    if (num.type === 'multiply' || den.type === 'multiply' || num.type === 'variable' || den.type === 'variable') {
      const numFactors = num.type === 'multiply' ? [...num.factors] : [num];
      let denFactors = den.type === 'multiply' ? [...den.factors] : [den];

      const newNumFactors: MathNode[] = [];
      const usedDenIndices = new Set<number>();
      let hasReduction = false;

      for (const nf of numFactors) {
        const matchIdx = denFactors.findIndex((df, idx) => !usedDenIndices.has(idx) && nodeEquals(nf, df));
        if (matchIdx !== -1) {
          usedDenIndices.add(matchIdx); // Cancel factor
          hasReduction = true;
        } else {
          // Check power cancellation: e.g. x / x^2
          let canceled = false;
          for (let dIdx = 0; dIdx < denFactors.length; dIdx++) {
            if (usedDenIndices.has(dIdx)) continue;
            const df = denFactors[dIdx];
            if (nf.type === 'variable' && df.type === 'power' && nodeEquals(df.base, nf)) {
              if (df.exponent.type === 'constant' && df.exponent.value.isInteger()) {
                const expVal = Number(df.exponent.value.num);
                if (expVal === 2) {
                  denFactors[dIdx] = nf; // x / x^2 -> 1 / x
                  canceled = true;
                  hasReduction = true;
                  break;
                }
              }
            }
          }
          if (!canceled) {
            newNumFactors.push(nf);
          }
        }
      }

      const newDenFactors = denFactors.filter((_, idx) => !usedDenIndices.has(idx));
      if (hasReduction) {
        const resNum = newNumFactors.length === 0 ? ONE : newNumFactors.length === 1 ? newNumFactors[0] : multiply(...newNumFactors);
        const resDen = newDenFactors.length === 0 ? ONE : newDenFactors.length === 1 ? newDenFactors[0] : multiply(...newDenFactors);
        if (resDen.type === 'constant' && resDen.value.isOne()) return resNum;
        return divide(resNum, resDen);
      }
    }

    return divide(num, den);
  }

  private static gcdBigInt(a: bigint, b: bigint): bigint {
    let x = a < 0n ? -a : a;
    let y = b < 0n ? -b : b;
    while (y !== 0n) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

  private static extractAddScalarGcd(node: AddNode): bigint {
    let currentGcd = 0n;
    for (const t of node.terms) {
      const { coeff } = Simplifier.extractCoeff(t);
      if (!coeff.isInteger()) return 1n;
      const val = coeff.num < 0n ? -coeff.num : coeff.num;
      if (currentGcd === 0n) currentGcd = val;
      else currentGcd = Simplifier.gcdBigInt(currentGcd, val);
    }
    return currentGcd;
  }

  private static divideAddByScalar(node: AddNode, scalar: bigint): MathNode {
    const sRat = new Rational(scalar, 1n);
    const newTerms = node.terms.map((t) => {
      const { coeff, core } = Simplifier.extractCoeff(t);
      const newCoeff = coeff.div(sRat);
      if (newCoeff.isOne()) return core;
      if (newCoeff.equals(R_NEG1)) return negate(core);
      if (core.type === 'constant' && core.value.isOne()) return constant(newCoeff);
      return multiply(constant(newCoeff), core);
    });
    return add(...newTerms);
  }

  /* ========================================================================= */
  /*                            Power Simplification                           */
  /* ========================================================================= */

  private static simplifyPower(node: MathNode): MathNode {
    if (node.type !== 'power') return node;

    const base = Simplifier.simplifyPass(node.base);
    const exp = Simplifier.simplifyPass(node.exponent);

    // x^0 = 1
    if (exp.type === 'constant' && exp.value.isZero()) {
      return ONE;
    }

    // x^1 = x
    if (exp.type === 'constant' && exp.value.isOne()) {
      return base;
    }

    // 0^x = 0
    if (base.type === 'constant' && !base.symbolic && base.value.isZero()) {
      return ZERO;
    }

    // 1^x = 1
    if (base.type === 'constant' && !base.symbolic && base.value.isOne()) {
      return ONE;
    }

    // Constant^Constant with exact integer exponent
    if (
      base.type === 'constant' &&
      !base.symbolic &&
      exp.type === 'constant' &&
      !exp.symbolic &&
      exp.value.isInteger()
    ) {
      const expInt = Number(exp.value.num);
      if (Math.abs(expInt) <= 10) {
        return constant(base.value.pow(expInt));
      }
    }

    // (x^a)^b -> x^(a*b)
    if (base.type === 'power' && exp.type === 'constant' && !exp.symbolic) {
      if (base.exponent.type === 'constant' && !base.exponent.symbolic) {
        const combinedExp = base.exponent.value.mul(exp.value);
        return power(base.base, constant(combinedExp));
      }
    }

    return power(base, exp);
  }

  /* ========================================================================= */
  /*                         Expansion for Level 2 Tests                       */
  /* ========================================================================= */

  /**
   * Distributes multiplication over addition: (a + b)*(c + d) -> a*c + a*d + b*c + b*d
   * Used strictly for zero-difference verification with recursion depth protection.
   */
  public static expand(node: MathNode, depth: number = 0): MathNode {
    if (depth > 5) return Simplifier.simplifyPass(node);

    const s = Simplifier.simplifyPass(node);

    if (s.type === 'multiply') {
      let terms: MathNode[] = [ONE];
      for (const factor of s.factors) {
        const expandedFactor = Simplifier.expand(factor, depth + 1);
        const factorTerms = expandedFactor.type === 'add' ? expandedFactor.terms : [expandedFactor];
        const newTerms: MathNode[] = [];
        for (const t1 of terms) {
          for (const t2 of factorTerms) {
            newTerms.push(Simplifier.simplifyPass(multiply(t1, t2)));
          }
        }
        terms = newTerms;
      }
      return Simplifier.simplifyPass(add(...terms));
    }

    if (s.type === 'add') {
      return Simplifier.simplifyPass(add(...s.terms.map((t) => Simplifier.expand(t, depth + 1))));
    }

    if (
      s.type === 'power' &&
      s.exponent.type === 'constant' &&
      !s.exponent.symbolic &&
      s.exponent.value.isInteger()
    ) {
      const n = Number(s.exponent.value.num);
      if (n > 1 && n <= 4 && s.base.type === 'add') {
        let res: MathNode = s.base;
        for (let i = 1; i < n; i++) {
          res = Simplifier.expand(multiply(res, s.base), depth + 1);
        }
        return res;
      }
    }

    if (s.type === 'negate') {
      return Simplifier.simplifyPass(negate(Simplifier.expand(s.arg, depth + 1)));
    }

    return s;
  }

  /* ========================================================================= */
  /*                            Canonicalization                               */
  /* ========================================================================= */

  public static canonicalize(node: MathNode): MathNode {
    switch (node.type) {
      case 'add': {
        const sorted = [...node.terms]
          .map(Simplifier.canonicalize)
          .sort(Simplifier.compareNodes);
        return add(...sorted);
      }
      case 'multiply': {
        const sorted = [...node.factors]
          .map(Simplifier.canonicalize)
          .sort(Simplifier.compareFactors);
        return multiply(...sorted);
      }
      case 'divide':
        return divide(Simplifier.canonicalize(node.numerator), Simplifier.canonicalize(node.denominator));
      case 'power':
        return power(Simplifier.canonicalize(node.base), Simplifier.canonicalize(node.exponent));
      case 'negate':
        return negate(Simplifier.canonicalize(node.arg));
      case 'function':
        return func(node.fn, ...node.args.map(Simplifier.canonicalize));
      default:
        return node;
    }
  }

  private static compareFactors(a: MathNode, b: MathNode): number {
    if (a.type === 'constant' && b.type !== 'constant') return -1;
    if (a.type !== 'constant' && b.type === 'constant') return 1;
    return Simplifier.compareNodes(a, b);
  }

  /**
   * Deterministic ordering for canonical sorting:
   * 1. Variables & Powers of variables (highest degree first)
   * 2. Functions (sin, cos, etc.)
   * 3. Constants (at the end for addition, beginning for multiplication)
   */
  private static compareNodes(a: MathNode, b: MathNode): number {
    const typeOrder: Record<string, number> = {
      power: 1,
      variable: 2,
      function: 3,
      derivative_term: 4,
      divide: 5,
      add: 6,
      multiply: 7,
      negate: 8,
      constant: 9,
    };

    const rankA = typeOrder[a.type] || 10;
    const rankB = typeOrder[b.type] || 10;
    if (rankA !== rankB) return rankA - rankB;

    if (a.type === 'power' && b.type === 'power') {
      if (a.base.type === 'variable' && b.base.type === 'variable') {
        if (a.base.name === b.base.name) {
          // Compare exponents in descending order
          if (a.exponent.type === 'constant' && b.exponent.type === 'constant') {
            return b.exponent.value.toNumber() - a.exponent.value.toNumber();
          }
        }
      }
    }

    if (a.type === 'variable' && b.type === 'variable') {
      return a.name.localeCompare(b.name);
    }

    if (a.type === 'constant' && b.type === 'constant') {
      return a.value.toNumber() - b.value.toNumber();
    }

    return countNodes(b) - countNodes(a);
  }

  /* ========================================================================= */
  /*                              Helper Extractors                            */
  /* ========================================================================= */

  private static extractCoeff(node: MathNode): { coeff: Rational; core: MathNode } {
    if (node.type === 'constant' && !node.symbolic) {
      return { coeff: node.value, core: ONE };
    }
    if (node.type === 'negate') {
      const inner = Simplifier.extractCoeff(node.arg);
      return { coeff: inner.coeff.neg(), core: inner.core };
    }
    if (node.type === 'multiply') {
      const first = node.factors[0];
      if (first.type === 'constant' && !first.symbolic) {
        const rest = node.factors.slice(1);
        return {
          coeff: first.value,
          core: rest.length === 1 ? rest[0] : multiply(...rest),
        };
      }
    }
    return { coeff: R1, core: node };
  }

  private static extractBaseExponent(node: MathNode): { base: MathNode; exp: Rational } {
    if (node.type === 'power' && node.exponent.type === 'constant' && !node.exponent.symbolic) {
      return { base: node.base, exp: node.exponent.value };
    }
    return { base: node, exp: R1 };
  }
}

export function simplify(node: MathNode): MathNode {
  return Simplifier.simplify(node);
}

export function expand(node: MathNode): MathNode {
  return Simplifier.expand(node);
}
