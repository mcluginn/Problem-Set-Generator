'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MathRenderer } from './MathRenderer';
import { parseMath } from '../../engine/math/parser';
import { nodeToLatex } from '../../engine/math/ast';
import { Check, AlertCircle, Sparkles } from 'lucide-react';

interface MathInputProps {
  id?: string;
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  ariaLabel?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}

export const MathInput: React.FC<MathInputProps> = ({
  id,
  value,
  onChange,
  onSubmit,
  placeholder = 'Type your mathematical answer (e.g. 5(3x^2 - 2x + 4)^4 * (6x - 2))',
  disabled = false,
  autoFocus = true,
  ariaLabel,
  ariaInvalid,
  ariaDescribedBy,
}) => {
  const [parsedLatex, setParsedLatex] = useState<string | null>(null);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value.trim()) {
      setParsedLatex(null);
      setSyntaxError(null);
      return;
    }

    try {
      const ast = parseMath(value);
      setParsedLatex(nodeToLatex(ast));
      setSyntaxError(null);
    } catch (err: unknown) {
      setParsedLatex(null);
      if (err instanceof Error) {
        setSyntaxError(err.message);
      }
    }
  }, [value]);

  const insertSymbol = (sym: string, offset: number = 0) => {
    if (!inputRef.current) return;
    const input = inputRef.current;
    const start = input.selectionStart || value.length;
    const end = input.selectionEnd || value.length;
    const nextVal = value.substring(0, start) + sym + value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      input.focus();
      const nextCursor = start + sym.length + offset;
      input.setSelectionRange(nextCursor, nextCursor);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && onSubmit && value.trim() && !syntaxError) {
      e.preventDefault();
      onSubmit();
    }
  };

  const SYMBOLS = [
    { label: 'x²', insert: '^2' },
    { label: 'xⁿ', insert: '^()', offset: -1 },
    { label: '√x', insert: 'sqrt()', offset: -1 },
    { label: 'a/b', insert: '() / ()', offset: -5 },
    { label: 'sin', insert: 'sin()' },
    { label: 'cos', insert: 'cos()' },
    { label: 'tan', insert: 'tan()' },
    { label: 'eˣ', insert: 'exp()', offset: -1 },
    { label: 'ln', insert: 'ln()', offset: -1 },
    { label: '·', insert: ' * ' },
    { label: 'π', insert: 'pi' },
    { label: 'θ', insert: 'theta' },
  ];

  return (
    <div className="w-full space-y-3">
      {/* Live Preview Box */}
      <div className="min-h-[56px] px-4 py-3 bg-[#06162f] border border-[#2c4f75]/35 rounded-lg flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-3 overflow-x-auto py-1">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 select-none">
            Math Preview:
          </span>
          {parsedLatex ? (
            <div className="text-lg text-brass-300 font-medium">
              <MathRenderer latex={parsedLatex} />
            </div>
          ) : (
            <span className="text-sm italic text-slate-500">
              {value.trim() ? (
                <span className="text-amber-400/90 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incomplete or invalid mathematical syntax
                </span>
              ) : (
                'Enter an answer above to preview its mathematical form.'
              )}
            </span>
          )}
        </div>

        {value.trim() && (
          <div className="flex-shrink-0 ml-2">
            {parsedLatex ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
                <Check className="w-3 h-3 mr-1" /> Input parsed successfully
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-950 text-amber-300 border border-amber-800">
                Syntax incomplete...
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Answer Input */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          aria-label={ariaLabel || 'Mathematical answer input'}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          className={`w-full px-4 py-3.5 bg-[#06162f] border-2 ${
            syntaxError && value.trim()
              ? 'border-amber-500/60 focus:border-amber-400 focus:ring-amber-500/20'
              : 'border-[#2c4f75]/40 focus:border-brass-500 focus:ring-brass-500/20'
          } rounded-lg text-slate-100 placeholder-slate-500 font-mono text-base focus:outline-none focus:ring-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
        />
      </div>

      {/* Quick Mathematical Palette */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs font-medium text-slate-400 mr-1 select-none flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brass-400" /> Insert:
        </span>
        {SYMBOLS.map((sym, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => insertSymbol(sym.insert, sym.offset)}
            disabled={disabled}
            className="px-2.5 py-1 text-xs font-mono font-medium bg-[#102d52] hover:bg-[#1d3b5e] active:bg-brass-500 active:text-[#061b3a] text-slate-200 hover:text-white border border-[#2c4f75]/40 rounded-md transition shadow-sm disabled:opacity-50"
          >
            {sym.label}
          </button>
        ))}
      </div>
    </div>
  );
};
