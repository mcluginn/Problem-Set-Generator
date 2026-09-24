# Mathematical Content & Rendering Architecture

## 1. Architectural Philosophy: Strict Pipeline Separation

The Engineering Practice Engine maintains a strict, un-compromised separation between three distinct systems:

```text
1. Mathematical AST Engine
   (ast.ts, parser.ts, differentiator.ts, simplifier.ts)
   • Generates authoritative, exact LaTeX formulas
   • E.g.: "y = \left(4x^{2} + 1x + 1\right)^{5}"

2. Mathematical Formula Renderer
   (MathRenderer.tsx -> KaTeX)
   • Sole responsibility: Takes clean LaTeX strings and renders them via KaTeX
   • NO heuristic word checking
   • NO regex text transformations
   • E.g.: katex.renderToString(latex, { displayMode, throwOnError: false })

3. Structured Content & Markdown Parser
   (RichContentRenderer.tsx, normalizer.ts)
   • Parses mixed Markdown prose containing LaTeX delimiters
   • Produces typed layout blocks (Heading, Paragraph, DisplayMath, ListItem)
   • Produces typed inline segments (Text, Bold, Italic, Code, InlineMath)
   • Renders text as standard React DOM nodes and math via <MathRenderer />
```

---

## 2. Canonical Math Data Flow

```text
Problem Expression / Math AST
             ↓
     expressionLatex
             ↓
    <MathRenderer />
             ↓
       KaTeX Engine
             ↓
  Rendered HTML + MathML
```

```text
Tutor Response / Problem Prompts / Hints
             ↓
  Mixed Text + Delimiters (\(..\), \[..\], $..$, $$..$$)
             ↓
 MathNormalizer.parseContentBlocks()
             ↓
    Structured Layout AST
 ┌───────────┴───────────┐
 ▼                       ▼
React Text Nodes    <MathRenderer />
(Prose/Bold/Code)    (KaTeX Math)
```

---

## 3. Delimiter Specification

The structured content parser natively supports:
- **Display Math**: `\[ ... \]` and `$$ ... $$`
- **Inline Math**: `\( ... \)` and `$ ... $`
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Code**: `` `code` ``

---

## 4. Root Cause of Previous Regression & Permanent Fix

### Regression Cause
An attempt to identify "pure math vs prose" via a regex word heuristic (`isPureMathFormula` using `/[a-zA-Z]{3,}/g`) caused standard LaTeX formulas containing LaTeX commands with 3+ letters (e.g. `\left` [4 letters], `\right` [5 letters]) to be classified as English prose. Consequently, `MathRenderer` bypassed KaTeX and rendered raw LaTeX strings into the DOM.

### Permanent Fix
1. Completely removed heuristic word-counting from `MathRenderer`.
2. `MathRenderer` receives pure LaTeX and passes it directly to `katex.renderToString()`.
3. `RichContentRenderer` tokenizes mixed content into distinct text segments and math segments.
4. Raw LaTeX is never rendered as plain text.

---

## 5. Security & Sanitization Policy

- **No Dangerous Raw HTML Injection**: All text segments are rendered as pure React strings (`<span>{seg.text}</span>`), which React automatically escapes.
- **KaTeX Safety**: KaTeX runs with `trust: false` and `throwOnError: false`.
- **AST Integrity**: Mathematical answers from students are parsed through `parseMath()` before being formatted into LaTeX.
