'use client';

import React from 'react';
import { MathRenderer } from '@/components/math/MathRenderer';
import { RichContentRenderer } from '@/components/math/RichContentRenderer';

export default function MathRenderingDebugPage() {
  const TUTOR_SAMPLE = `### Why is the Chain Rule required?

The function contains an **outer function** applied to an **inner function**, so it is a composite function.

For:
$$
y = \\left(4x^{2} + 1x + 1\\right)^{5}
$$

the inner function is:
$$
u = 4x^{2} + 1x + 1
$$

Therefore:
$$
\\frac{du}{dx} = 8x + 1
$$

The response must have clean paragraph spacing and correctly rendered mathematics.

Key Observations:
- Power rule differentiates outer exponent: $5u^4$.
- Chain rule multiplies by inner rate: $\\frac{du}{dx} = 8x + 1$.
- Combined canonical derivative: $\\frac{dy}{dx} = 5(4x^2+x+1)^4(8x+1)$.`;

  const LONG_EXPRESSION =
    '\\frac{dy}{dx} = 10(3x - 1)(3x^2 - 2x + 4)^4 + \\frac{2(x^2 + 3) - (2x + 1)(2x)}{(x^2 + 3)^2} + 4x^3 \\cos(x^2) - 2x^5 \\sin(x^2) + \\frac{1}{x \\ln(x)}';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Mathematical Rendering Debug & Verification Page</h1>
        <p className="text-sm text-slate-400">
          Section 30 & 31: Isolated test harness verifying that LaTeX expressions, parentheses, fractions, implicit forms, and mixed prose render with zero raw LaTeX leakage.
        </p>
      </div>

      {/* 1. Plain Text */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">1. Plain Text (No Delimiters)</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-slate-200 text-sm">
          <RichContentRenderer content="This is plain English text describing calculus concepts. It contains ordinary words, punctuation, and spaces that must not be concatenated." />
        </div>
      </section>

      {/* 2. Inline Math in Normal Prose */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">2. Inline Math in Prose (Section 31)</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-slate-200 text-sm">
          <RichContentRenderer content="The derivative is: $f'(x)$ inside normal prose. Also testing delimiter notation: \\(f'(x) = 2x\\) smoothly embedded in text." />
        </div>
      </section>

      {/* 3. Problem Prompt With LaTeX */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">3. Problem Prompt Rendering (No Raw Dollars)</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-slate-200 text-sm">
          <RichContentRenderer content="Find the derivative $\frac{dy}{dx}$ for the function:" inline />
        </div>
      </section>

      {/* 4. Display Math Formula */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">4. Display Math (Section 31)</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-center">
          <MathRenderer latex="\frac{dy}{dx} = 5(4x^2+x+1)^4(8x+1)" displayMode={true} />
        </div>
      </section>

      {/* 5. Parentheses with \left( and \right) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">5. LaTeX Parentheses with \left( and \right) (Regression Test)</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-center">
          <MathRenderer latex="y = \left(4x^{2} + 1x + 1\right)^{5}" displayMode={true} />
        </div>
      </section>

      {/* 6. Fractions & Quotient Form */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">6. Fraction & Quotient Form</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-center">
          <MathRenderer latex="\frac{u'v - uv'}{v^2}" displayMode={true} />
        </div>
      </section>

      {/* 7. Implicit Differentiation */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">7. Implicit Differentiation Formula</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-center">
          <MathRenderer latex="2x + 2y\frac{dy}{dx} = 0 \implies \frac{dy}{dx} = -\frac{x}{y}" displayMode={true} />
        </div>
      </section>

      {/* 8. Nested Function Form */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">8. Nested Function Form</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-center">
          <MathRenderer latex="e^{\sin(3x^2+1)}" displayMode={true} />
        </div>
      </section>

      {/* 9. Controlled Horizontal Overflow for Long Expressions */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-engineering-400">9. Long Expression with Controlled Overflow</h2>
        <div className="p-4 bg-slate-950 rounded-xl text-center overflow-x-auto shadow-inner">
          <MathRenderer latex={LONG_EXPRESSION} displayMode={true} />
        </div>
      </section>

      {/* 10. AI Socratic Tutor Markdown Composite */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
        <h2 className="text-xs font-mono font-bold uppercase text-brass-400">10. Socratic Tutor Mixed Content Walkthrough</h2>
        <div className="p-5 bg-slate-950 rounded-xl border border-slate-800">
          <RichContentRenderer content={TUTOR_SAMPLE} />
        </div>
      </section>
    </div>
  );
}
