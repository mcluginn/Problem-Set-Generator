'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import { MathNormalizer as LibMathNormalizer, ContentSegment } from '@/lib/math/mathNormalizer';
import { RichContentRenderer } from './RichContentRenderer';

export interface MathContentProps {
  content?: string | ContentSegment[] | null;
  displayMode?: boolean;
  inline?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Global Mathematical Presentation Component
 * Renders LaTeX formulas, DOCX-extracted plain-text math, mixed prose,
 * and multi-line derivations using KaTeX with accessible MathML output.
 */
export const MathContent: React.FC<MathContentProps> = ({
  content,
  displayMode = false,
  inline = false,
  className = '',
  fallback = null,
}) => {
  // Memoized rendering
  const renderedElement = useMemo(() => {
    if (!content) return fallback;

    // Case 1: Array of ContentSegments
    if (Array.isArray(content)) {
      return (
        <span className={`math-content-segments ${className}`}>
          {content.map((seg, idx) => {
            if (seg.type === 'text') {
              return <span key={idx}>{seg.value}</span>;
            }

            const cleanLatex = LibMathNormalizer.normalizePureMath(seg.source || '');
            try {
              const html = katex.renderToString(cleanLatex, {
                displayMode: seg.displayMode ?? displayMode,
                throwOnError: false,
                output: 'html',
                trust: false,
              });

              return (
                <span
                  key={idx}
                  className={
                    seg.displayMode || displayMode
                      ? 'block my-3 py-2 px-3 text-center overflow-x-auto text-base sm:text-lg bg-slate-950/60 rounded-lg border border-slate-800/60'
                      : 'inline-block align-baseline mx-0.5'
                  }
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              );
            } catch (err) {
              return (
                <span key={idx} className="font-mono text-xs text-amber-400">
                  {seg.source}
                </span>
              );
            }
          })}
        </span>
      );
    }

    if (typeof content !== 'string') return fallback;

    const trimmed = content.trim();
    if (!trimmed) return fallback;

    // Case 2: Pure mathematical expression (displayMode block or inline formula)
    const hasLatexSyntax =
      trimmed.includes('\\') ||
      trimmed.includes('_{') ||
      trimmed.includes('^{') ||
      trimmed.includes('\\text{');

    const isMathFormula =
      LibMathNormalizer.isPureMath(trimmed) ||
      (hasLatexSyntax && !LibMathNormalizer.hasProseWords(trimmed));

    if (isMathFormula) {
      const cleanLatex = LibMathNormalizer.normalizePureMath(trimmed);
      try {
        const html = katex.renderToString(cleanLatex, {
          displayMode: displayMode,
          throwOnError: false,
          output: 'html',
          trust: false,
        });

        if (displayMode) {
          return (
            <div
              className={`math-content-display my-3 py-2.5 px-4 bg-slate-950/70 border border-slate-800/70 rounded-xl text-center overflow-x-auto shadow-inner text-slate-100 ${className}`}
            >
              <span dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          );
        } else {
          return (
            <span
              className={`inline-block align-baseline ${className}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
      } catch (err) {
        return (
          <div className="my-2 p-2 bg-slate-900 text-amber-400 font-mono text-xs rounded">
            {trimmed}
          </div>
        );
      }
    }

    // Case 3: Mixed prose + math, or general text with embedded formulas
    return <RichContentRenderer content={trimmed} inline={inline} className={className} />;
  }, [content, displayMode, inline, className, fallback]);

  return <>{renderedElement}</>;
};

export default MathContent;
