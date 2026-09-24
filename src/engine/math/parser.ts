/**
 * Robust Mathematical Expression Parser
 * Supports algebraic notation, implicit multiplication, LaTeX commands, and exact rational numbers.
 */

import {
  MathNode,
  constant,
  variable,
  add,
  subtract,
  multiply,
  divide,
  power,
  negate,
  func,
  derivativeTerm,
  FunctionName,
  PI,
  EULER,
} from './ast';
import { Rational } from './rational';

export type TokenType =
  | 'NUMBER'
  | 'IDENT'
  | 'PLUS'
  | 'MINUS'
  | 'STAR'
  | 'SLASH'
  | 'CARET'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACE'
  | 'RBRACE'
  | 'COMMA'
  | 'PRIME'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
  pos: number;
}

export const MAX_MATH_INPUT_LENGTH = 500;
export const MAX_PARSER_DEPTH = 30;

export class ParseError extends Error {
  public pos: number;
  public userMessage: string;

  constructor(message: string, pos: number = 0) {
    super(`${message} at position ${pos}`);
    this.name = 'ParseError';
    this.pos = pos;
    this.userMessage = `Syntax note near character ${pos + 1}: ${message}. Please check parentheses and mathematical notation.`;
  }
}

export class Lexer {
  private input: string;
  private pos: number = 0;

  constructor(input: string) {
    if (input.length > MAX_MATH_INPUT_LENGTH) {
      throw new ParseError(`Expression length (${input.length}) exceeds maximum limit of ${MAX_MATH_INPUT_LENGTH} characters.`, 0);
    }

    // Normalize input: strip \left, \right, replace \cdot with *, replace \times with *
    this.input = input
      .replace(/\\left/g, '')
      .replace(/\\right/g, '')
      .replace(/\\cdot/g, '*')
      .replace(/\\times/g, '*')
      .replace(/\\,/g, ' ')
      .replace(/\\;/g, ' ')
      .replace(/\\quad/g, ' ')
      .replace(/\\qquad/g, ' ')
      .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width spaces
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];

      if (/\s/.test(ch)) {
        this.pos++;
        continue;
      }

      const startPos = this.pos;

      if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(this.input[this.pos + 1] || ''))) {
        let numStr = '';
        while (this.pos < this.input.length && /[0-9.]/.test(this.input[this.pos])) {
          numStr += this.input[this.pos];
          this.pos++;
        }
        tokens.push({ type: 'NUMBER', value: numStr, pos: startPos });
        continue;
      }

      if (ch === '\\') {
        // LaTeX command e.g. \sin, \frac, \pi, \theta
        this.pos++;
        let cmd = '';
        while (this.pos < this.input.length && /[a-zA-Z]/.test(this.input[this.pos])) {
          cmd += this.input[this.pos];
          this.pos++;
        }
        if (cmd === 'frac') {
          // Special handling in parser
          tokens.push({ type: 'IDENT', value: '\\frac', pos: startPos });
        } else if (cmd === 'sqrt') {
          tokens.push({ type: 'IDENT', value: 'sqrt', pos: startPos });
        } else if (cmd === 'pi') {
          tokens.push({ type: 'IDENT', value: 'pi', pos: startPos });
        } else if (cmd === 'theta') {
          tokens.push({ type: 'IDENT', value: 'theta', pos: startPos });
        } else {
          tokens.push({ type: 'IDENT', value: cmd, pos: startPos });
        }
        continue;
      }

      if (/[a-zA-Z_]/.test(ch)) {
        let ident = '';
        while (this.pos < this.input.length && /[a-zA-Z0-9_]/.test(this.input[this.pos])) {
          ident += this.input[this.pos];
          this.pos++;
        }
        tokens.push({ type: 'IDENT', value: ident, pos: startPos });
        continue;
      }

      switch (ch) {
        case '+':
          tokens.push({ type: 'PLUS', value: '+', pos: startPos });
          this.pos++;
          break;
        case '-':
          tokens.push({ type: 'MINUS', value: '-', pos: startPos });
          this.pos++;
          break;
        case '*':
          tokens.push({ type: 'STAR', value: '*', pos: startPos });
          this.pos++;
          break;
        case '/':
          tokens.push({ type: 'SLASH', value: '/', pos: startPos });
          this.pos++;
          break;
        case '^':
          tokens.push({ type: 'CARET', value: '^', pos: startPos });
          this.pos++;
          break;
        case '(':
          tokens.push({ type: 'LPAREN', value: '(', pos: startPos });
          this.pos++;
          break;
        case ')':
          tokens.push({ type: 'RPAREN', value: ')', pos: startPos });
          this.pos++;
          break;
        case '{':
          tokens.push({ type: 'LBRACE', value: '{', pos: startPos });
          this.pos++;
          break;
        case '}':
          tokens.push({ type: 'RBRACE', value: '}', pos: startPos });
          this.pos++;
          break;
        case ',':
          tokens.push({ type: 'COMMA', value: ',', pos: startPos });
          this.pos++;
          break;
        case "'":
          tokens.push({ type: 'PRIME', value: "'", pos: startPos });
          this.pos++;
          break;
        default:
          throw new ParseError(`Unexpected character '${ch}'`, startPos);
      }
    }

    tokens.push({ type: 'EOF', value: '', pos: this.pos });
    return tokens;
  }
}

const KNOWN_FUNCTIONS = new Set<string>([
  'sin',
  'cos',
  'tan',
  'sec',
  'csc',
  'cot',
  'ln',
  'log',
  'exp',
  'sqrt',
  'abs',
]);

export class Parser {
  private tokens: Token[] = [];
  private current: number = 0;
  private depth: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public static parse(input: string): MathNode {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new ParseError('Empty mathematical expression');
    }

    // Strip leading "y =" or "f(x) =" or "dy/dx =" if student included equation prefix
    let sanitized = trimmed;
    if (/^[yY]\s*=\s*/.test(sanitized)) {
      sanitized = sanitized.replace(/^[yY]\s*=\s*/, '');
    } else if (/^f\([a-zA-Z]\)\s*=\s*/.test(sanitized)) {
      sanitized = sanitized.replace(/^f\([a-zA-Z]\)\s*=\s*/, '');
    } else if (/^(?:\\frac\{dy\}\{dx\}|dy\/dx)\s*=\s*/.test(sanitized)) {
      sanitized = sanitized.replace(/^(?:\\frac\{dy\}\{dx\}|dy\/dx)\s*=\s*/, '');
    }

    const lexer = new Lexer(sanitized);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parseExpression();

    if (!parser.isAtEnd()) {
      throw new ParseError(`Unexpected extra token '${parser.peek().value}'`, parser.peek().pos);
    }
    return ast;
  }

  private checkDepth() {
    this.depth++;
    if (this.depth > MAX_PARSER_DEPTH) {
      throw new ParseError(`Expression exceeds maximum nesting depth (${MAX_PARSER_DEPTH})`, this.peek().pos);
    }
  }

  private leaveDepth() {
    this.depth--;
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '', pos: 0 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private match(...types: TokenType[]): boolean {
    for (const t of types) {
      if (this.check(t)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new ParseError(`${message}. Found '${this.peek().value}'`, this.peek().pos);
  }

  /* ========================================================================= */
  /*                             Recursive Descent                             */
  /* ========================================================================= */

  public parseExpression(): MathNode {
    return this.parseAdd();
  }

  private parseAdd(): MathNode {
    let expr = this.parseMul();

    while (this.match('PLUS', 'MINUS')) {
      const op = this.previous();
      const right = this.parseMul();
      if (op.type === 'PLUS') {
        expr = add(expr, right);
      } else {
        expr = subtract(expr, right);
      }
    }

    return expr;
  }

  private parseMul(): MathNode {
    let expr = this.parseUnary();

    while (true) {
      if (this.match('STAR')) {
        const right = this.parseUnary();
        expr = multiply(expr, right);
      } else if (this.match('SLASH')) {
        const right = this.parseUnary();
        expr = divide(expr, right);
      } else if (this.canStartImplicitMul()) {
        // Implicit multiplication, e.g. 3x, 2(x+1), (x+1)(x-1), sin(x)cos(x)
        const right = this.parseUnary();
        expr = multiply(expr, right);
      } else {
        break;
      }
    }

    return expr;
  }

  private canStartImplicitMul(): boolean {
    if (this.isAtEnd()) return false;
    const nextType = this.peek().type;
    return (
      nextType === 'NUMBER' ||
      nextType === 'IDENT' ||
      nextType === 'LPAREN' ||
      nextType === 'LBRACE'
    );
  }

  private parseUnary(): MathNode {
    if (this.match('MINUS')) {
      const right = this.parseUnary();
      return negate(right);
    }
    if (this.match('PLUS')) {
      return this.parseUnary();
    }
    return this.parsePower();
  }

  private parsePower(): MathNode {
    let expr = this.parsePrimary();

    if (this.match('CARET')) {
      // Right-associative power: a^b^c = a^(b^c)
      // Exponent can be unary (e.g. x^-2 or x^(-2))
      const exponent = this.parseUnary();
      expr = power(expr, exponent);
    }

    return expr;
  }

  private parsePrimary(): MathNode {
    // 1. Grouping (Parentheses / Braces)
    if (this.match('LPAREN')) {
      const expr = this.parseExpression();
      this.consume('RPAREN', "Expected closing ')'");
      return expr;
    }
    if (this.match('LBRACE')) {
      const expr = this.parseExpression();
      this.consume('RBRACE', "Expected closing '}'");
      return expr;
    }

    // 2. Numbers
    if (this.match('NUMBER')) {
      const numStr = this.previous().value;
      return constant(numStr);
    }

    // 3. LaTeX \frac{a}{b}
    if (this.check('IDENT') && this.peek().value === '\\frac') {
      this.advance();
      const num = this.parseGroupOrPrimary();
      const den = this.parseGroupOrPrimary();
      return divide(num, den);
    }

    // 4. Identifiers & Functions
    if (this.match('IDENT')) {
      const name = this.previous().value;

      // Special constants: pi, e
      if (name === 'pi') {
        return PI;
      }
      if (name === 'e' && !this.check('LPAREN')) {
        return EULER;
      }

      // Derivative terms: dy/dx or dy_dx
      if (name === 'dy_dx' || name === 'dydx') {
        return derivativeTerm('y', 'x', 1);
      }

      // Function calls: sin(x), ln(x^2), etc.
      if (KNOWN_FUNCTIONS.has(name.toLowerCase())) {
        const fnName = name.toLowerCase() as FunctionName;
        // Arguments can be in () or {} (for LaTeX like \sqrt{x})
        const arg = this.parseGroupOrPrimary();
        return func(fnName, arg);
      }

      // Variable with primes (e.g. y' or y'')
      let primeCount = 0;
      while (this.match('PRIME')) {
        primeCount++;
      }
      if (primeCount > 0 && (name === 'y' || name === 'f')) {
        return derivativeTerm(name, 'x', primeCount);
      }

      // Ordinary variable (e.g. x, y, t, u, theta)
      return variable(name);
    }

    throw new ParseError(`Unexpected token '${this.peek().value}'`, this.peek().pos);
  }

  private parseGroupOrPrimary(): MathNode {
    this.checkDepth();
    try {
      if (this.match('LPAREN')) {
        const expr = this.parseExpression();
        this.consume('RPAREN', "Expected closing ')'");
        return expr;
      }
      if (this.match('LBRACE')) {
        const expr = this.parseExpression();
        this.consume('RBRACE', "Expected closing '}'");
        return expr;
      }
      if (this.match('NUMBER')) {
        return constant(this.previous().value);
      }
      if (this.match('IDENT')) {
        const id = this.previous().value;
        if (id === 'pi') return PI;
        if (id === 'e') return EULER;
        return variable(id);
      }
      return this.parsePrimary();
    } finally {
      this.leaveDepth();
    }
  }
}

export function parseMath(input: string): MathNode {
  return Parser.parse(input);
}

export const MathParser = {
  parse: parseMath
};

