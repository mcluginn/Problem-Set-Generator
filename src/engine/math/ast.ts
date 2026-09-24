/**
 * Mathematical Abstract Syntax Tree (AST)
 * Pure, strongly typed, immutable mathematical representation.
 */

import { Rational, R0, R1 } from './rational';

export type MathNodeType =
  | 'constant'
  | 'variable'
  | 'add'
  | 'multiply'
  | 'power'
  | 'divide'
  | 'negate'
  | 'function'
  | 'derivative_term';

export type FunctionName =
  | 'sin'
  | 'cos'
  | 'tan'
  | 'sec'
  | 'csc'
  | 'cot'
  | 'ln'
  | 'log'
  | 'exp'
  | 'sqrt'
  | 'abs';

export interface BaseNode {
  type: MathNodeType;
}

export interface ConstantNode extends BaseNode {
  type: 'constant';
  value: Rational;
  symbolic?: 'pi' | 'e';
}

export interface VariableNode extends BaseNode {
  type: 'variable';
  name: string;
}

export interface AddNode extends BaseNode {
  type: 'add';
  terms: MathNode[]; // Represents sum: term1 + term2 + ...
}

export interface MultiplyNode extends BaseNode {
  type: 'multiply';
  factors: MathNode[]; // Represents product: factor1 * factor2 * ...
}

export interface PowerNode extends BaseNode {
  type: 'power';
  base: MathNode;
  exponent: MathNode;
}

export interface DivideNode extends BaseNode {
  type: 'divide';
  numerator: MathNode;
  denominator: MathNode;
}

export interface NegateNode extends BaseNode {
  type: 'negate';
  arg: MathNode;
}

export interface FunctionNode extends BaseNode {
  type: 'function';
  fn: FunctionName;
  args: MathNode[];
}

export interface DerivativeTermNode extends BaseNode {
  type: 'derivative_term';
  target: string; // e.g. "y"
  wrt: string;    // e.g. "x" -> dy/dx
  order?: number; // default 1
}

export type MathNode =
  | ConstantNode
  | VariableNode
  | AddNode
  | MultiplyNode
  | PowerNode
  | DivideNode
  | NegateNode
  | FunctionNode
  | DerivativeTermNode;

/* ========================================================================= */
/*                              Factory Helpers                              */
/* ========================================================================= */

export function constant(val: Rational | number | bigint | string, symbolic?: 'pi' | 'e'): ConstantNode {
  if (symbolic === 'pi') {
    return { type: 'constant', value: R1, symbolic: 'pi' };
  }
  if (symbolic === 'e') {
    return { type: 'constant', value: R1, symbolic: 'e' };
  }
  return { type: 'constant', value: Rational.from(val) };
}

export function variable(name: string): VariableNode {
  return { type: 'variable', name };
}

export function add(...terms: MathNode[]): MathNode {
  const flatTerms: MathNode[] = [];
  for (const t of terms) {
    if (t.type === 'add') {
      flatTerms.push(...t.terms);
    } else {
      flatTerms.push(t);
    }
  }
  if (flatTerms.length === 0) return constant(0);
  if (flatTerms.length === 1) return flatTerms[0];
  return { type: 'add', terms: flatTerms };
}

export function subtract(left: MathNode, right: MathNode): MathNode {
  return add(left, negate(right));
}

export function multiply(...factors: MathNode[]): MathNode {
  const flatFactors: MathNode[] = [];
  for (const f of factors) {
    if (f.type === 'multiply') {
      flatFactors.push(...f.factors);
    } else {
      flatFactors.push(f);
    }
  }
  if (flatFactors.length === 0) return constant(1);
  if (flatFactors.length === 1) return flatFactors[0];
  return { type: 'multiply', factors: flatFactors };
}

export function divide(numerator: MathNode, denominator: MathNode): MathNode {
  return { type: 'divide', numerator, denominator };
}

export function power(base: MathNode, exponent: MathNode | number | bigint | Rational): MathNode {
  const expNode: MathNode =
    typeof exponent === 'number' || typeof exponent === 'bigint' || exponent instanceof Rational
      ? constant(exponent)
      : exponent;
  return { type: 'power', base, exponent: expNode };
}

export function negate(arg: MathNode): MathNode {
  if (arg.type === 'negate') return arg.arg;
  if (arg.type === 'constant' && !arg.symbolic) {
    return constant(arg.value.neg());
  }
  return { type: 'negate', arg };
}

export function func(fn: FunctionName, ...args: MathNode[]): FunctionNode {
  return { type: 'function', fn, args };
}

export function derivativeTerm(target: string = 'y', wrt: string = 'x', order: number = 1): DerivativeTermNode {
  return { type: 'derivative_term', target, wrt, order };
}

/* ========================================================================= */
/*                              Common Constants                             */
/* ========================================================================= */

export const ZERO = constant(0);
export const ONE = constant(1);
export const NEG_ONE = constant(-1);
export const TWO = constant(2);
export const PI = constant(1, 'pi');
export const EULER = constant(1, 'e');

/* ========================================================================= */
/*                              Precedence Logic                             */
/* ========================================================================= */

export function getPrecedence(node: MathNode): number {
  switch (node.type) {
    case 'add':
      return 1;
    case 'multiply':
    case 'divide':
      return 2;
    case 'negate':
      return 3;
    case 'power':
      return 4;
    case 'function':
    case 'derivative_term':
    case 'variable':
    case 'constant':
      return 5;
  }
}

/* ========================================================================= */
/*                        Formatting & Serialization                         */
/* ========================================================================= */

export function nodeToString(node: MathNode): string {
  switch (node.type) {
    case 'constant':
      if (node.symbolic === 'pi') return 'pi';
      if (node.symbolic === 'e') return 'e';
      return node.value.toString();

    case 'variable':
      return node.name;

    case 'derivative_term':
      if (node.order && node.order > 1) {
        return `d^${node.order}${node.target}/d${node.wrt}^${node.order}`;
      }
      return `d${node.target}/d${node.wrt}`;

    case 'negate': {
      const childStr = nodeToString(node.arg);
      if (getPrecedence(node.arg) < getPrecedence(node)) {
        return `-(${childStr})`;
      }
      return `-${childStr}`;
    }

    case 'add': {
      return node.terms
        .map((t, idx) => {
          if (idx === 0) return nodeToString(t);
          if (t.type === 'negate') {
            return ` - ${nodeToString(t.arg)}`;
          }
          if (t.type === 'constant' && t.value.isNegative() && !t.symbolic) {
            return ` - ${nodeToString(constant(t.value.neg()))}`;
          }
          return ` + ${nodeToString(t)}`;
        })
        .join('');
    }

    case 'multiply': {
      return node.factors
        .map((f) => {
          const str = nodeToString(f);
          if (getPrecedence(f) < getPrecedence(node)) {
            return `(${str})`;
          }
          return str;
        })
        .join(' * ');
    }

    case 'divide': {
      const numStr =
        getPrecedence(node.numerator) < getPrecedence(node)
          ? `(${nodeToString(node.numerator)})`
          : nodeToString(node.numerator);
      const denStr =
        getPrecedence(node.denominator) <= getPrecedence(node)
          ? `(${nodeToString(node.denominator)})`
          : nodeToString(node.denominator);
      return `${numStr} / ${denStr}`;
    }

    case 'power': {
      const baseStr =
        getPrecedence(node.base) < getPrecedence(node) || node.base.type === 'constant' && !node.base.value.isInteger()
          ? `(${nodeToString(node.base)})`
          : nodeToString(node.base);
      const expStr =
        getPrecedence(node.exponent) < getPrecedence(node) || node.exponent.type === 'divide'
          ? `(${nodeToString(node.exponent)})`
          : nodeToString(node.exponent);
      return `${baseStr}^${expStr}`;
    }

    case 'function': {
      return `${node.fn}(${node.args.map(nodeToString).join(', ')})`;
    }
  }
}

export function nodeToLatex(node: MathNode): string {
  switch (node.type) {
    case 'constant':
      if (node.symbolic === 'pi') return '\\pi';
      if (node.symbolic === 'e') return 'e';
      return node.value.toLatex();

    case 'variable':
      if (node.name === 'theta') return '\\theta';
      return node.name;

    case 'derivative_term':
      if (node.order && node.order > 1) {
        return `\\frac{d^{${node.order}}${node.target}}{d${node.wrt}^{${node.order}}}`;
      }
      return `\\frac{d${node.target}}{d${node.wrt}}`;

    case 'negate': {
      const child = nodeToLatex(node.arg);
      if (node.arg.type === 'add') {
        return `-\\left(${child}\\right)`;
      }
      return `-${child}`;
    }

    case 'add': {
      return node.terms
        .map((t, idx) => {
          if (idx === 0) return nodeToLatex(t);
          if (t.type === 'negate') {
            return ` - ${nodeToLatex(t.arg)}`;
          }
          if (t.type === 'constant' && t.value.isNegative() && !t.symbolic) {
            return ` - ${constant(t.value.neg()).value.toLatex()}`;
          }
          if (
            t.type === 'multiply' &&
            t.factors[0].type === 'constant' &&
            !t.factors[0].symbolic &&
            t.factors[0].value.isNegative()
          ) {
            const posFirst = constant(t.factors[0].value.neg());
            const rest = t.factors.slice(1);
            const posMul = rest.length === 1 ? multiply(posFirst, rest[0]) : multiply(posFirst, ...rest);
            return ` - ${nodeToLatex(posMul)}`;
          }
          return ` + ${nodeToLatex(t)}`;
        })
        .join('');
    }

    case 'multiply': {
      // Check if first factor is a negative constant or negate
      let hasLeadingNegative = false;
      const formattedFactors: string[] = [];

      for (let idx = 0; idx < node.factors.length; idx++) {
        const f = node.factors[idx];
        let latex = nodeToLatex(f);
        const needsParens = f.type === 'add' || (f.type === 'negate' && idx > 0);
        if (needsParens) {
          formattedFactors.push(`\\left(${latex}\\right)`);
        } else {
          formattedFactors.push(latex);
        }
      }

      // If factors are [constant, variable(s)], join with space e.g. "2 x" instead of "2 \cdot x"
      if (
        formattedFactors.length === 2 &&
        node.factors[0].type === 'constant' &&
        !node.factors[0].symbolic &&
        (node.factors[1].type === 'variable' || node.factors[1].type === 'function')
      ) {
        return `${formattedFactors[0]} ${formattedFactors[1]}`;
      }

      return formattedFactors.join(' ');
    }

    case 'divide': {
      if (node.numerator.type === 'negate') {
        return `-\\frac{${nodeToLatex(node.numerator.arg)}}{${nodeToLatex(node.denominator)}}`;
      }
      if (node.numerator.type === 'constant' && !node.numerator.symbolic && node.numerator.value.isNegative()) {
        const posConst = constant(node.numerator.value.neg());
        return `-\\frac{${nodeToLatex(posConst)}}{${nodeToLatex(node.denominator)}}`;
      }
      if (
        node.numerator.type === 'multiply' &&
        node.numerator.factors[0].type === 'constant' &&
        !node.numerator.factors[0].symbolic &&
        node.numerator.factors[0].value.isNegative()
      ) {
        const posFirst = constant(node.numerator.factors[0].value.neg());
        const rest = node.numerator.factors.slice(1);
        const posNum = rest.length === 1 ? multiply(posFirst, rest[0]) : multiply(posFirst, ...rest);
        return `-\\frac{${nodeToLatex(posNum)}}{${nodeToLatex(node.denominator)}}`;
      }
      return `\\frac{${nodeToLatex(node.numerator)}}{${nodeToLatex(node.denominator)}}`;
    }

    case 'power': {
      let baseLatex = nodeToLatex(node.base);
      if (
        node.base.type === 'add' ||
        node.base.type === 'multiply' ||
        node.base.type === 'divide' ||
        node.base.type === 'negate'
      ) {
        baseLatex = `\\left(${baseLatex}\\right)`;
      }
      const expLatex = nodeToLatex(node.exponent);
      return `${baseLatex}^{${expLatex}}`;
    }

    case 'function': {
      const inner = node.args.map(nodeToLatex).join(', ');
      if (node.fn === 'sqrt') {
        return `\\sqrt{${inner}}`;
      }
      if (node.fn === 'abs') {
        return `\\left|${inner}\\right|`;
      }
      const fnLatex =
        node.fn === 'sin' ||
        node.fn === 'cos' ||
        node.fn === 'tan' ||
        node.fn === 'sec' ||
        node.fn === 'csc' ||
        node.fn === 'cot' ||
        node.fn === 'ln' ||
        node.fn === 'log' ||
        node.fn === 'exp'
          ? `\\${node.fn}`
          : node.fn;
      return `${fnLatex}\\left(${inner}\\right)`;
    }
  }
}

/* ========================================================================= */
/*                              AST Utilities                                */
/* ========================================================================= */

export function nodeEquals(a: MathNode, b: MathNode): boolean {
  if (a.type !== b.type) return false;

  switch (a.type) {
    case 'constant': {
      const bc = b as ConstantNode;
      return a.symbolic === bc.symbolic && a.value.equals(bc.value);
    }
    case 'variable':
      return a.name === (b as VariableNode).name;
    case 'derivative_term': {
      const bd = b as DerivativeTermNode;
      return a.target === bd.target && a.wrt === bd.wrt && (a.order || 1) === (bd.order || 1);
    }
    case 'negate':
      return nodeEquals(a.arg, (b as NegateNode).arg);
    case 'add': {
      const ba = b as AddNode;
      if (a.terms.length !== ba.terms.length) return false;
      return a.terms.every((t, i) => nodeEquals(t, ba.terms[i]));
    }
    case 'multiply': {
      const bm = b as MultiplyNode;
      if (a.factors.length !== bm.factors.length) return false;
      return a.factors.every((f, i) => nodeEquals(f, bm.factors[i]));
    }
    case 'divide': {
      const bd = b as DivideNode;
      return nodeEquals(a.numerator, bd.numerator) && nodeEquals(a.denominator, bd.denominator);
    }
    case 'power': {
      const bp = b as PowerNode;
      return nodeEquals(a.base, bp.base) && nodeEquals(a.exponent, bp.exponent);
    }
    case 'function': {
      const bf = b as FunctionNode;
      if (a.fn !== bf.fn || a.args.length !== bf.args.length) return false;
      return a.args.every((arg, i) => nodeEquals(arg, bf.args[i]));
    }
  }
}

export function cloneNode(node: MathNode): MathNode {
  switch (node.type) {
    case 'constant':
      return { type: 'constant', value: new Rational(node.value.num, node.value.den), symbolic: node.symbolic };
    case 'variable':
      return { type: 'variable', name: node.name };
    case 'derivative_term':
      return { type: 'derivative_term', target: node.target, wrt: node.wrt, order: node.order };
    case 'negate':
      return { type: 'negate', arg: cloneNode(node.arg) };
    case 'add':
      return { type: 'add', terms: node.terms.map(cloneNode) };
    case 'multiply':
      return { type: 'multiply', factors: node.factors.map(cloneNode) };
    case 'divide':
      return { type: 'divide', numerator: cloneNode(node.numerator), denominator: cloneNode(node.denominator) };
    case 'power':
      return { type: 'power', base: cloneNode(node.base), exponent: cloneNode(node.exponent) };
    case 'function':
      return { type: 'function', fn: node.fn, args: node.args.map(cloneNode) };
  }
}

export function getVariables(node: MathNode): Set<string> {
  const vars = new Set<string>();
  function walk(n: MathNode) {
    if (n.type === 'variable') {
      vars.add(n.name);
    } else if (n.type === 'add') {
      n.terms.forEach(walk);
    } else if (n.type === 'multiply') {
      n.factors.forEach(walk);
    } else if (n.type === 'divide') {
      walk(n.numerator);
      walk(n.denominator);
    } else if (n.type === 'power') {
      walk(n.base);
      walk(n.exponent);
    } else if (n.type === 'negate') {
      walk(n.arg);
    } else if (n.type === 'function') {
      n.args.forEach(walk);
    }
  }
  walk(node);
  return vars;
}

export function countNodes(node: MathNode): number {
  let count = 1;
  switch (node.type) {
    case 'add':
      node.terms.forEach((t) => (count += countNodes(t)));
      break;
    case 'multiply':
      node.factors.forEach((f) => (count += countNodes(f)));
      break;
    case 'divide':
      count += countNodes(node.numerator) + countNodes(node.denominator);
      break;
    case 'power':
      count += countNodes(node.base) + countNodes(node.exponent);
      break;
    case 'negate':
      count += countNodes(node.arg);
      break;
    case 'function':
      node.args.forEach((a) => (count += countNodes(a)));
      break;
  }
  return count;
}
