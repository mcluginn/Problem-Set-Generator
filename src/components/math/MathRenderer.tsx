'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import { MathNormalizer as LibMathNormalizer } from '@/lib/math/mathNormalizer';

interface MathRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

/**
 * Robust Math & Mixed Markdown/LaTeX Renderer
 * Correctly renders pure LaTeX formulas, inline math delimiters \(...\) and $...$,
 */
export function isPureMathExpression(latex: string, displayMode = false): boolean {
  if (!latex || typeof latex !== 'string' || !latex.trim()) return false;

  const trimmed = latex.trim();

  // If text contains natural prose words, it is NEVER a pure math expression
  if (LibMathNormalizer.hasProseWords(trimmed)) return false;

  const isLatexEnv = /\\begin\{(?:cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|aligned|align|array|split|gather)\}/.test(trimmed);
  if (isLatexEnv) return true;

  if (displayMode) return true;
  if (LibMathNormalizer.isPureMath(trimmed)) return true;

  const hasMathSymbols =
    trimmed.includes('\\') ||
    trimmed.includes('^') ||
    trimmed.includes('_') ||
    trimmed.includes('=') ||
    trimmed.includes('+') ||
    trimmed.includes('-') ||
    trimmed.includes('*') ||
    trimmed.includes('/') ||
    /^[0-9]+(\.[0-9]+)?$/.test(trimmed) ||
    /^[a-zA-Z]$/.test(trimmed) ||
    /^[0-9]+[a-zA-Z]/.test(trimmed);

  const isAlgebraic =
    /^[-a-zA-Z0-9_\\^+*\/()={}\[\];,.\s]+$/.test(trimmed) &&
    !/[a-zA-Z]{3,}\s+[a-zA-Z]{3,}/.test(trimmed) &&
    hasMathSymbols;

  return (
    (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length >= 4) ||
    (trimmed.startsWith('\\[') && trimmed.endsWith('\\]') && trimmed.length >= 4) ||
    (trimmed.startsWith('\\(') && trimmed.endsWith('\\)') && trimmed.length >= 4) ||
    (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length >= 2 && !trimmed.slice(1, -1).includes('$')) ||
    isAlgebraic
  );
}

/**
 * Enhanced MathRenderer component that renders LaTeX formulas using KaTeX,
 * and display math blocks \[...\] and $$...$$ without raw delimiter leakage
 * or accidental word concatenation.
 */
export const MathRenderer: React.FC<MathRendererProps> = ({
  latex,
  displayMode = false,
  className = '',
}) => {
  const renderedContent = useMemo(() => {
    if (!latex || typeof latex !== 'string' || !latex.trim()) return null;

    const trimmed = latex.trim();
    const isPureMath = isPureMathExpression(trimmed, displayMode);

    if (isPureMath) {
      let cleanLatex = trimmed;
      if (cleanLatex.startsWith('$$') && cleanLatex.endsWith('$$') && cleanLatex.length >= 4) {
        cleanLatex = cleanLatex.slice(2, -2).trim();
      } else if (cleanLatex.startsWith('\\[') && cleanLatex.endsWith('\\]') && cleanLatex.length >= 4) {
        cleanLatex = cleanLatex.slice(2, -2).trim();
      } else if (cleanLatex.startsWith('\\(') && cleanLatex.endsWith('\\)') && cleanLatex.length >= 4) {
        cleanLatex = cleanLatex.slice(2, -2).trim();
      } else if (cleanLatex.startsWith('$') && cleanLatex.endsWith('$') && cleanLatex.length >= 2) {
        cleanLatex = cleanLatex.slice(1, -1).trim();
      }

      // Normalize plain math formulas e.g. 1/6, dy/dx, sqrt(x)
      cleanLatex = LibMathNormalizer.normalizePureMath(cleanLatex);

      try {
        const html = katex.renderToString(cleanLatex, {
          displayMode: displayMode || trimmed.startsWith('$$') || trimmed.startsWith('\\['),
          throwOnError: false,
          output: 'html',
          trust: false,
        });
        return { isBlock: displayMode || trimmed.startsWith('$$') || trimmed.startsWith('\\['), html };
      } catch (e) {
        console.warn('KaTeX pure render fallback for:', cleanLatex, e);
      }
    }

    // 2. Parse mixed text containing embedded inline & display math delimiters
    // Delimiters supported: $$, \[, \], \(, \), $
    const tokens: Array<{ type: 'text' | 'inline' | 'display'; content: string }> = [];
    let remaining = LibMathNormalizer.normalizeText(trimmed);

    while (remaining.length > 0) {
      // Look for display math $$...$$
      const displayMatch = remaining.match(/^([\s\S]*?)\$\$([\s\S]+?)\$\$([\s\S]*)$/);
      // Look for display math \[...\]
      const bracketMatch = remaining.match(/^([\s\S]*?)\\\[([\s\S]+?)\\\]([\s\S]*)$/);
      // Look for explicit LaTeX environment: \begin{cases}...\end{cases}, etc.
      const envMatch = remaining.match(/^([\s\S]*?)(\\begin\{(?:cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|aligned|align|array|split|gather)\}[\s\S]*?\\end\{(?:cases|matrix|pmatrix|bmatrix|vmatrix|Vmatrix|aligned|align|array|split|gather)\})([\s\S]*)$/);
      // Look for inline math \(...\)
      const parenMatch = remaining.match(/^([\s\S]*?)\\\(([\s\S]+?)\\\)([\s\S]*)$/);
      // Look for inline math $...$
      const dollarMatch = remaining.match(/^([\s\S]*?)\$([^\$\n]+?)\$([\s\S]*)$/);

      // Find the earliest match
      interface MatchCandidate {
        type: 'display' | 'inline';
        pre: string;
        math: string;
        post: string;
        index: number;
      }

      const candidates: MatchCandidate[] = [];

      if (displayMatch && displayMatch.index !== undefined) {
        candidates.push({ type: 'display', pre: displayMatch[1], math: displayMatch[2], post: displayMatch[3], index: displayMatch[1].length });
      }
      if (bracketMatch && bracketMatch.index !== undefined) {
        candidates.push({ type: 'display', pre: bracketMatch[1], math: bracketMatch[2], post: bracketMatch[3], index: bracketMatch[1].length });
      }
      if (envMatch && envMatch.index !== undefined) {
        candidates.push({ type: 'display', pre: envMatch[1], math: envMatch[2], post: envMatch[3], index: envMatch[1].length });
      }
      if (parenMatch && parenMatch.index !== undefined) {
        candidates.push({ type: 'inline', pre: parenMatch[1], math: parenMatch[2], post: parenMatch[3], index: parenMatch[1].length });
      }
      if (dollarMatch && dollarMatch.index !== undefined) {
        candidates.push({ type: 'inline', pre: dollarMatch[1], math: dollarMatch[2], post: dollarMatch[3], index: dollarMatch[1].length });
      }

      if (candidates.length === 0) {
        tokens.push({ type: 'text', content: remaining });
        break;
      }

      // Sort by earliest match index
      candidates.sort((a, b) => a.index - b.index);
      const earliest = candidates[0];

      if (earliest.pre) {
        tokens.push({ type: 'text', content: earliest.pre });
      }
      tokens.push({ type: earliest.type, content: earliest.math });
      remaining = earliest.post;
    }

    const segments = tokens.map((token, idx) => {
      if (token.type === 'text') {
        return (
          <span key={idx} className="whitespace-pre-wrap">
            {token.content}
          </span>
        );
      }

      try {
        const mathHtml = katex.renderToString(token.content.trim(), {
          displayMode: token.type === 'display',
          throwOnError: false,
          output: 'html',
          trust: false,
        });

        return (
          <span
            key={idx}
            className={token.type === 'display' ? 'block my-3 text-center overflow-x-auto' : 'inline-block align-baseline mx-0.5'}
            dangerouslySetInnerHTML={{ __html: mathHtml }}
          />
        );
      } catch (err) {
        return (
          <span key={idx} className="font-mono text-xs text-amber-300">
            {token.content}
          </span>
        );
      }
    });

    return { isBlock: false, segments };
  }, [latex, displayMode]);

  if (!latex || !latex.trim()) return null;

  if (renderedContent && 'html' in renderedContent) {
    return (
      <span
        className={`math-rendered-node ${
          renderedContent.isBlock ? 'block my-2 text-center text-lg sm:text-xl overflow-x-auto' : 'inline-block align-baseline'
        } ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedContent.html || '' }}
      />
    );
  }

  if (renderedContent && 'segments' in renderedContent) {
    return (
      <span className={`math-rendered-mixed leading-relaxed ${className}`}>
        {renderedContent.segments}
      </span>
    );
  }

  return <span>{latex}</span>;
};
