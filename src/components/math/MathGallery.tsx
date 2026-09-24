'use client';

import React from 'react';
import { MathRenderer } from './MathRenderer';
import { RichContentRenderer } from './RichContentRenderer';

interface GalleryItem {
  title: string;
  category: string;
  latex: string;
  displayMode?: boolean;
}

const GALLERY_SAMPLES: GalleryItem[] = [
  {
    title: 'Derivative Notation',
    category: 'Derivatives',
    latex: '\\frac{dy}{dx}',
  },
  {
    title: 'Chain Rule (Power Polynomial)',
    category: 'Derivatives',
    latex: '5(3x^2 - 2x + 4)^4(6x - 2)',
    displayMode: true,
  },
  {
    title: 'Factored Canonical Chain Form',
    category: 'Derivatives',
    latex: '10(3x - 1)(3x^2 - 2x + 4)^4',
    displayMode: true,
  },
  {
    title: 'Quotient Rule Formula',
    category: 'Quotient',
    latex: '\\frac{u\'v - uv\'}{v^2}',
    displayMode: true,
  },
  {
    title: 'Implicit Differentiation Step',
    category: 'Implicit',
    latex: '2x + 2y\\frac{dy}{dx} = 0 \\implies \\frac{dy}{dx} = -\\frac{x}{y}',
    displayMode: true,
  },
  {
    title: 'Negative Power',
    category: 'Powers',
    latex: 'x^{-3} = \\frac{1}{x^3}',
  },
  {
    title: 'Fractional Power & Radical',
    category: 'Powers',
    latex: 'x^{\\frac{1}{2}} = \\sqrt{x}',
  },
  {
    title: 'Trigonometric Power Notation',
    category: 'Trigonometry',
    latex: '\\sin^2(x) + \\cos^2(x) = 1',
  },
  {
    title: 'Implicit Derivative Form',
    category: 'Implicit',
    latex: '\\frac{dy}{dx} = -\\frac{x}{y}',
    displayMode: true,
  },
  {
    title: 'Composite Chain Expansion',
    category: 'Derivatives',
    latex: '5(5x^2 + 2x + 6)^2(10x + 2)',
    displayMode: true,
  },
  {
    title: 'Logarithm Quotient Derivative',
    category: 'Logarithms',
    latex: '\\frac{d}{dx}[\\ln(x^2 + 1)] = \\frac{2x}{x^2 + 1}',
    displayMode: true,
  },
];

const MIXED_MARKDOWN_SAMPLE = `### Example: Differentiating a Composite Function

To find the derivative of $y = (3x^2 - 2x + 4)^5$, we apply the **Chain Rule**:

1. **Outer derivative:** Bring down the exponent 5 and reduce power to 4:
$$
5(3x^2 - 2x + 4)^4
$$

2. **Inner derivative:** Differentiate $u(x) = 3x^2 - 2x + 4$:
$$
u'(x) = 6x - 2
$$

3. **Combined Canonical Derivative:**
$$
\\frac{dy}{dx} = 5(3x^2 - 2x + 4)^4(6x - 2) = 10(3x - 1)(3x^2 - 2x + 4)^4
$$`;

export const MathGallery: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          Mathematical Expression Gallery & Visual Regression Test
        </h3>
        <p className="text-xs text-slate-400">
          Validates that all standard calculus constructs, fractions, exponents, radicals, and mixed markdown render without clipping.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GALLERY_SAMPLES.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl space-y-2 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-brass-400">{item.title}</span>
              <span className="text-slate-300 bg-[#102d52] border border-[#2c4f75]/40 px-2 py-0.5 rounded text-[10px]">
                {item.category}
              </span>
            </div>

            <div className="py-3 px-3 bg-[#06162f] border border-[#2c4f75]/30 rounded-lg text-center overflow-x-auto my-auto text-slate-100">
              <MathRenderer latex={item.latex} displayMode={item.displayMode} />
            </div>

            <div className="text-[10px] font-mono text-slate-400 truncate">
              Raw: {item.latex}
            </div>
          </div>
        ))}
      </div>

      {/* Mixed Markdown & LaTeX Composite Test */}
      <div className="p-5 bg-[#0a2344]/60 border border-[#2c4f75]/35 rounded-xl space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brass-400">
          Rich Markdown + Multi-Line LaTeX Composite Rendering:
        </span>
        <div className="p-4 bg-[#06162f] rounded-xl border border-[#2c4f75]/30">
          <RichContentRenderer content={MIXED_MARKDOWN_SAMPLE} />
        </div>
      </div>
    </div>
  );
};
