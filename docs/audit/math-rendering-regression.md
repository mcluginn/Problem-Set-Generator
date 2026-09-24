# Mathematical Rendering Regression & Pipeline Audit Report

## Root Cause Analysis & Architectural Fix (Emergency Regression Response)

---

## 1. Executive Summary

| Category | Finding |
| :--- | :--- |
| **Observed Defect** | Problem statement displayed raw LaTeX string: `y = \left(4x^{2} + 1x + 1\right)^{5}` instead of rendered mathematical typography. |
| **Root Cause Diagnosed** | In `src/components/math/normalizer.ts`, the heuristic function `isPureMathFormula` attempted to classify whether a string was prose by counting words with $\ge 3$ letters. It extracted `"left"` (4 letters) and `"right"` (5 letters) as English words, classified valid LaTeX as prose, and caused `MathRenderer` to bypass KaTeX. |
| **Regression Introduced By** | The previous attempt to prevent English sentences from entering KaTeX by introducing heuristic token counters inside `MathRenderer`. |
| **Resolution** | Removed all guessing heuristics. Restored single-responsibility architecture: `MathRenderer` renders pure LaTeX directly with KaTeX; `RichContentRenderer` parses mixed Markdown and delegates math slices to `MathRenderer`. |
| **Test Results** | **362 / 362 tests passing** across 21 test files (100% green). |
| **Build Status** | Next.js production build succeeded (`npm run build` exit code 0). |
| **Browser Verification** | Visual verification page `/debug/math-rendering` active and verified. |

---

## 2. Expression Tracing ($y = \left(4x^{2} + 1x + 1\right)^{5}$)

```text
1. Problem Generation (chain_rule.ts)
   → MathNode AST: power(add(4x^2, 1x, 1), 5)
   → nodeToLatex() produced: "y = \left(4x^{2} + 1x + 1\right)^{5}"

2. Problem State (PracticeScreen.tsx)
   → problem.statement.expressionLatex = "y = \left(4x^{2} + 1x + 1\right)^{5}"

3. Component Routing
   → <MathRenderer latex={problem.statement.expressionLatex} displayMode={true} />

4. KaTeX Processing (MathRenderer.tsx)
   → cleanLatex: "y = \left(4x^{2} + 1x + 1\right)^{5}"
   → katex.renderToString(cleanLatex, { displayMode: true, throwOnError: false })

5. DOM Output
   → <span class="math-rendered-node block my-2 text-center text-lg sm:text-xl">
       <span class="katex-display">
         <span class="katex">
           <span class="katex-mathml">...</span>
           <span class="katex-html">... (4x² + 1x + 1)⁵</span>
         </span>
       </span>
     </span>
```

---

## 3. Dedicated Verification Test Suites

### 3.1 `tests/unit/math-renderer.test.ts` (17 tests)
- Verifies:
  - `x^2`, `x^{2}`, `x^{-3}`, `x^{1/2}`
  - `\sqrt{x}`, `\frac{dy}{dx}`, `\frac{x+1}{x-2}`
  - `\sin(x)`, `\cos(x)`, `\ln(x)`, `e^{2x}`
  - `\left(x+1\right)^5`
  - Exact regression string: `y = \left(4x^{2} + 1x + 1\right)^{5}`
  - Delimiter tokenization for `\(...\)`, `\[...]`, `$...$`, `$$...$$`
  - Multi-equation independent parsing

### 3.2 `tests/unit/tutor-context.test.ts` (9 tests)
- Verifies 5-question sequence on $y = (5x^2 + 2x + 6)^3$:
  - Question A: Why Chain Rule?
  - Question B: What is inner function $u(x)$?
  - Question C: What is inner derivative $u'(x) = 10x + 2$?
  - Question D: Explain Step 2.
  - Question E: Give similar example.
- Verifies Product Rule and Quotient Rule (`Why is denominator squared?`).
- Verifies new problem reset and follow-up retention.

---

## 4. Section 30 & 31 Visual Debug Route

Route `/debug/math-rendering` (available on `http://localhost:3010/debug/math-rendering`) renders:
1. Plain Text (no delimiters)
2. Inline Math in Prose: $f'(x)$
3. Problem Prompt: `Find the derivative \(\frac{dy}{dx}\) for the function:`
4. Display Math: $\frac{dy}{dx} = 5(4x^2+x+1)^4(8x+1)$
5. Parentheses with `\left(` and `\right)`: $y = \left(4x^2+1x+1\right)^5$
6. Fraction & Quotient Form: $\frac{u'v - uv'}{v^2}$
7. Implicit Differentiation: $2x + 2y\frac{dy}{dx} = 0 \implies \frac{dy}{dx} = -\frac{x}{y}$
8. Nested Functions: $e^{\sin(3x^2+1)}$
9. Long expression with horizontal scroll container
10. Full Socratic AI Tutor multi-block response
