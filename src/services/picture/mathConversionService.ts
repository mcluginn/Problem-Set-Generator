/**
 * Mathematical String Normalization & AST Conversion Service
 * Converts raw OCR / handwritten recognition outputs into canonical, parseable mathematical expressions.
 */

import { parseMath } from '../../engine/math/parser';
import { MathNode } from '../../engine/math/ast';

export interface MathConversionResult {
  success: boolean;
  normalizedExpression: string;
  ast?: MathNode;
  error?: string;
  warnings: string[];
}

export class MathConversionService {
  /**
   * Normalizes handwritten OCR string variations into standard ASCII math tokens.
   */
  public static normalizeHandwrittenString(raw: string): string {
    if (!raw) return '';

    let text = raw.trim();

    // 1. Strip derivative or variable assignment prefix: e.g. "dy/dx = ...", "du/dx = ...", "u = ...", "y' = ..."
    text = text.replace(/^(?:\\frac\{d[a-zA-Z]\}\{d[a-zA-Z]\}|d[a-zA-Z]\/d[a-zA-Z]|[a-zA-Z]'\(?[a-zA-Z]?\)?|[a-zA-Z]\b)\s*=\s*/i, '');

    // Strip trailing LaTeX space delimiters like \quad y = ...
    if (text.includes('\\quad')) {
      text = text.split('\\quad')[0].replace(/[,;]\s*$/, '');
    }

    // 2. Unicode minus, dashes, and bullet points
    text = text.replace(/[−–—]/g, '-');
    text = text.replace(/[×·•]/g, '*');
    text = text.replace(/÷/g, '/');

    // 3. Unicode superscript numbers to caret exponents
    const superscripts: Record<string, string> = {
      '⁰': '^0',
      '¹': '^1',
      '²': '^2',
      '³': '^3',
      '⁴': '^4',
      '⁵': '^5',
      '⁶': '^6',
      '⁷': '^7',
      '⁸': '^8',
      '⁹': '^9',
      '⁺': '^+',
      '⁻': '^-',
    };
    for (const [sup, repl] of Object.entries(superscripts)) {
      text = text.split(sup).join(repl);
    }

    // 4. Normalize LaTeX commands if present in raw OCR
    text = text.replace(/\\left\(/g, '(');
    text = text.replace(/\\right\)/g, ')');
    text = text.replace(/\\left\[/g, '(');
    text = text.replace(/\\right\]/g, ')');
    text = text.replace(/\\left\\\{/g, '(');
    text = text.replace(/\\cdot/g, '*');
    text = text.replace(/\\times/g, '*');

    // Strip backslashes from common function names: \sin -> sin, \cos -> cos, etc.
    text = text.replace(/\\(sin|cos|tan|sec|csc|cot|arcsin|arccos|arctan|ln|exp|log)\b/g, '$1');

    // LaTeX \frac{u}{v} -> ((u)/(v))
    while (text.includes('\\frac{')) {
      const fracIdx = text.indexOf('\\frac{');
      let numerator = '';
      let denominator = '';
      let depth = 0;
      let i = fracIdx + 5; // after \frac

      // Extract numerator
      if (text[i] === '{') {
        let start = i + 1;
        depth = 1;
        i++;
        while (i < text.length && depth > 0) {
          if (text[i] === '{') depth++;
          if (text[i] === '}') depth--;
          i++;
        }
        numerator = text.substring(start, i - 1);
      }

      // Extract denominator
      while (i < text.length && (text[i] === ' ' || text[i] === '\t')) i++;
      if (text[i] === '{') {
        let start = i + 1;
        depth = 1;
        i++;
        while (i < text.length && depth > 0) {
          if (text[i] === '{') depth++;
          if (text[i] === '}') depth--;
          i++;
        }
        denominator = text.substring(start, i - 1);
      }

      const replacement = `((${numerator})/(${denominator}))`;
      text = text.substring(0, fracIdx) + replacement + text.substring(i);
    }

    // LaTeX \sqrt{x} -> (x)^(1/2)
    text = text.replace(/\\sqrt\{([^}]+)\}/g, '($1)^(1/2)');
    text = text.replace(/sqrt\(([^)]+)\)/g, '($1)^(1/2)');

    // 5. Standardize variable casing: e.g. uppercase X to lowercase x if x is likely the variable
    text = text.replace(/\bX\b/g, 'x');
    text = text.replace(/(\d)X/g, '$1x');
    text = text.replace(/X(\^|\d|\()/g, 'x$1');

    // 6. Fix double operators or spacing quirks
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\+\s*\-/g, '-');
    text = text.replace(/\-\s*\-/g, '+');

    // 7. Balance brackets: replace square/curly brackets with parentheses
    text = text.replace(/\[/g, '(').replace(/\]/g, ')');
    text = text.replace(/\{/g, '(').replace(/\}/g, ')');

    return text.trim();
  }

  /**
   * Converts a normalized expression string into a verified MathNode AST.
   */
  public static convertToAST(rawExpression: string): MathConversionResult {
    const warnings: string[] = [];
    const normalized = this.normalizeHandwrittenString(rawExpression);

    if (!normalized) {
      return {
        success: false,
        normalizedExpression: '',
        error: 'Empty expression.',
        warnings: ['No mathematical expression detected.'],
      };
    }

    // Check parentheses balance
    let openCount = 0;
    for (const char of normalized) {
      if (char === '(') openCount++;
      if (char === ')') openCount--;
      if (openCount < 0) {
        warnings.push('Unbalanced parentheses detected in handwritten input.');
        break;
      }
    }
    if (openCount > 0) {
      warnings.push('Unclosed opening parenthesis in handwritten input.');
    }

    try {
      const ast = parseMath(normalized);
      return {
        success: true,
        normalizedExpression: normalized,
        ast,
        warnings,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        normalizedExpression: normalized,
        error: msg,
        warnings: [...warnings, `Parser error: ${msg}`],
      };
    }
  }
}
