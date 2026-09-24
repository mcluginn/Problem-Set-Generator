'use client';

import React, { useMemo } from 'react';
import { MathNormalizer, ContentBlock, InlineSegment } from './normalizer';
import { MathRenderer } from './MathRenderer';

interface RichContentRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

const renderInlineSegments = (segments: InlineSegment[], keyPrefix: string) => {
  return segments.map((seg, idx) => {
    const key = `${keyPrefix}_${idx}`;
    switch (seg.type) {
      case 'inline_math':
        return <MathRenderer key={key} latex={seg.latex || ''} displayMode={false} />;
      case 'bold':
        return (
          <strong key={key} className="font-semibold text-slate-100">
            {seg.text}
          </strong>
        );
      case 'italic':
        return (
          <em key={key} className="italic text-slate-300">
            {seg.text}
          </em>
        );
      case 'code':
        return (
          <code
            key={key}
            className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700"
          >
            {seg.code}
          </code>
        );
      case 'text':
      default:
        return <span key={key}>{seg.text}</span>;
    }
  });
};

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  const blocks: ContentBlock[] = useMemo(() => {
    if (!content || !content.trim()) return [];
    return MathNormalizer.parseContentBlocks(content);
  }, [content]);

  if (blocks.length === 0) return null;

  // Single-line inline rendering mode (for headers, prompt texts, badges)
  if (inline && blocks.length === 1 && blocks[0].type === 'paragraph') {
    return (
      <span className={`inline-rich-content ${className}`}>
        {renderInlineSegments(blocks[0].segments || [], 'inline')}
      </span>
    );
  }

  return (
    <div className={`rich-content-container space-y-3 leading-relaxed text-sm text-slate-200 ${className}`}>
      {blocks.map((block, idx) => {
        const key = `blk_${idx}`;
        switch (block.type) {
          case 'heading': {
            if (block.level === 1 || block.level === 2) {
              return (
                <h3
                  key={key}
                  className="text-base font-bold text-slate-100 tracking-tight pt-1 border-b border-slate-800/60 pb-1 flex flex-wrap items-center gap-1.5"
                >
                  {renderInlineSegments(block.segments || [], key)}
                </h3>
              );
            }
            return (
              <h4
                key={key}
                className="text-xs font-mono font-bold uppercase tracking-wider text-engineering-400 pt-1 flex flex-wrap items-center gap-1.5"
              >
                {renderInlineSegments(block.segments || [], key)}
              </h4>
            );
          }

          case 'display_math': {
            return (
              <div
                key={key}
                className="my-3 py-3 px-4 bg-slate-950/80 border border-slate-800/80 rounded-xl text-center overflow-x-auto shadow-inner"
              >
                <div className="inline-block text-slate-100 font-serif text-base sm:text-lg">
                  <MathRenderer latex={block.latex || ''} displayMode={true} />
                </div>
              </div>
            );
          }

          case 'list_item': {
            return (
              <div key={key} className="flex items-start space-x-2.5 pl-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-engineering-400 mt-2 flex-shrink-0" />
                <div className="flex-1 text-slate-200">
                  {renderInlineSegments(block.segments || [], key)}
                </div>
              </div>
            );
          }

          case 'paragraph':
          default: {
            return (
              <p key={key} className="text-slate-200 leading-relaxed break-words">
                {renderInlineSegments(block.segments || [], key)}
              </p>
            );
          }
        }
      })}
    </div>
  );
};
