/**
 * Mathematical Content Normalizer & Structured Block Parser
 * Robust tokenizer for separating text, inline math, display math, headings, and lists
 * without arbitrary HTML injections or fragile heuristic string replacements.
 */

import { MathNormalizer as LibMathNormalizer, ContentSegment } from '@/lib/math/mathNormalizer';

export type { ContentSegment };

export interface InlineSegment {
  type: 'text' | 'bold' | 'italic' | 'code' | 'inline_math';
  text?: string;
  code?: string;
  latex?: string;
}

export interface ContentBlock {
  type: 'heading' | 'paragraph' | 'display_math' | 'list_item';
  level?: number;
  listType?: 'ordered' | 'unordered';
  latex?: string;
  segments?: InlineSegment[];
}

export class MathNormalizer {
  /**
   * Tokenizes a line of text into typed inline segments (text, math, bold, italic, code).
   * Supports both $...$ / $$...$$ and \(...\) / \[...\] delimiters, as well as automatic
   * detection of plain-text mathematical formulas.
   */
  public static parseInlineSegments(rawText: string): InlineSegment[] {
    if (!rawText) return [];

    // Automatically normalize plain-text mathematical patterns if un-delimited
    const text = LibMathNormalizer.normalizeText(rawText);

    // Delimiter token pattern matching:
    // 1. $$ ... $$ (display math within line)
    // 2. \[ ... \] (display math within line)
    // 3. $ ... $ (inline math)
    // 4. \( ... \) (inline math)
    // 5. ** ... ** (bold)
    // 6. * ... * (italic)
    // 7. ` ... ` (code)
    const tokenRegex =
      /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\([\s\S]*?\\\)|(?<!\*)\*\*(?!\*)([^\*]+?)(?<!\*)\*\*(?!\*)|(?<!\*)\*(?!\*)([^\*]+?)(?<!\*)\*(?!\*)|`([^`]+?)`)/g;

    const segments: InlineSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = tokenRegex.lastIndex;
      const fullMatch = match[0];

      // Capture preceding plain text
      if (matchStart > lastIndex) {
        segments.push({ type: 'text', text: text.substring(lastIndex, matchStart) });
      }

      if (fullMatch.startsWith('$$') && fullMatch.endsWith('$$')) {
        segments.push({ type: 'inline_math', latex: fullMatch.slice(2, -2).trim() });
      } else if (fullMatch.startsWith('\\[') && fullMatch.endsWith('\\]')) {
        segments.push({ type: 'inline_math', latex: fullMatch.slice(2, -2).trim() });
      } else if (fullMatch.startsWith('$') && fullMatch.endsWith('$')) {
        segments.push({ type: 'inline_math', latex: fullMatch.slice(1, -1).trim() });
      } else if (fullMatch.startsWith('\\(') && fullMatch.endsWith('\\)')) {
        segments.push({ type: 'inline_math', latex: fullMatch.slice(2, -2).trim() });
      } else if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
        segments.push({ type: 'bold', text: fullMatch.slice(2, -2) });
      } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
        segments.push({ type: 'italic', text: fullMatch.slice(1, -1) });
      } else if (fullMatch.startsWith('`') && fullMatch.endsWith('`')) {
        segments.push({ type: 'code', code: fullMatch.slice(1, -1) });
      }

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      segments.push({ type: 'text', text: text.substring(lastIndex) });
    }

    return segments;
  }

  /**
   * Parses rich mixed Markdown & LaTeX text into structured, typed layout blocks.
   */
  public static parseContentBlocks(rawText: string): ContentBlock[] {
    if (!rawText || !rawText.trim()) return [];

    const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const blocks: ContentBlock[] = [];
    const lines = text.split('\n');

    let currentParagraphLines: string[] = [];
    let inDisplayMath = false;
    let displayMathDelimiter = '';
    let displayMathBuffer: string[] = [];

    const flushParagraph = () => {
      if (currentParagraphLines.length > 0) {
        const paragraphText = currentParagraphLines.join(' ').trim();
        if (paragraphText) {
          blocks.push({
            type: 'paragraph',
            segments: MathNormalizer.parseInlineSegments(paragraphText),
          });
        }
        currentParagraphLines = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Inside multi-line display math
      if (inDisplayMath) {
        if (
          (displayMathDelimiter === '$$' && line.endsWith('$$')) ||
          (displayMathDelimiter === '\\[' && line.endsWith('\\]'))
        ) {
          inDisplayMath = false;
          const closingLen = 2;
          const lineContent = line.slice(0, -closingLen).trim();
          if (lineContent) displayMathBuffer.push(lineContent);
          blocks.push({
            type: 'display_math',
            latex: displayMathBuffer.join('\n').trim(),
          });
          displayMathBuffer = [];
          displayMathDelimiter = '';
        } else {
          displayMathBuffer.push(lines[i]);
        }
        continue;
      }

      // Single-line display math: $$ ... $$ or \[ ... \]
      if (
        (line.startsWith('$$') && line.endsWith('$$') && line.length >= 4) ||
        (line.startsWith('\\[') && line.endsWith('\\]') && line.length >= 4)
      ) {
        flushParagraph();
        const math = line.slice(2, -2).trim();
        blocks.push({ type: 'display_math', latex: math });
        continue;
      }

      // Multi-line display math opening: $$ or \[
      if (line.startsWith('$$') || line.startsWith('\\[')) {
        flushParagraph();
        inDisplayMath = true;
        displayMathDelimiter = line.startsWith('$$') ? '$$' : '\\[';
        const remainder = line.slice(2).trim();
        displayMathBuffer = remainder ? [remainder] : [];
        continue;
      }

      // Empty line -> paragraph separator
      if (!line) {
        flushParagraph();
        continue;
      }

      // Headings: # Heading, ## Heading, ### Heading
      if (line.startsWith('#')) {
        flushParagraph();
        const match = line.match(/^(#{1,6})\s+(.*)$/);
        if (match) {
          blocks.push({
            type: 'heading',
            level: match[1].length,
            segments: MathNormalizer.parseInlineSegments(match[2].trim()),
          });
          continue;
        }
      }

      // List items: - Item, * Item, 1. Item
      const listMatch = line.match(/^(\d+\.|\-|\*)\s+(.*)$/);
      if (listMatch) {
        flushParagraph();
        const marker = listMatch[1];
        const isOrdered = /^\d+\./.test(marker);
        blocks.push({
          type: 'list_item',
          listType: isOrdered ? 'ordered' : 'unordered',
          segments: MathNormalizer.parseInlineSegments(listMatch[2].trim()),
        });
        continue;
      }

      currentParagraphLines.push(line);
    }

    flushParagraph();

    if (inDisplayMath && displayMathBuffer.length > 0) {
      blocks.push({
        type: 'display_math',
        latex: displayMathBuffer.join('\n').trim(),
      });
    }

    return blocks;
  }

  /**
   * Normalizes disparate delimiters into standard $ / $$ representation for text strings.
   */
  public static normalizeDelimiters(text: string): string {
    if (!text) return '';
    return text
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => `$$\n${math.trim()}\n$$`)
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => `$${math.trim()}$`);
  }

  public static escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
