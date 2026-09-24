# Math Rendering Regression & Architecture Report

## Overview
Phase 7 resolved all historical math and delimiter rendering issues by introducing an upgraded universal `MathRenderer.tsx` parsing pipeline.

---

## 1. Supported Math Delimiters & Formats

| Format Type | Syntax | Render Behavior | Verified Example |
| :--- | :--- | :--- | :--- |
| **Pure LaTeX** | `\frac{dy}{dx}` | KaTeX Display / Inline Node | $y = (4x^2 + x + 1)^5$ |
| **Inline Parentheses** | `\( \frac{dy}{dx} \)` | In-flow inline KaTeX HTML | $\frac{dy}{dx}$ |
| **Inline Dollar** | `$u'(x) = 8x + 1$` | In-flow inline KaTeX HTML | $8x + 1$ |
| **Display Double Dollar** | `$$\Delta U = Q - W$$` | Centered display block with overflow | $\Delta U = Q - W$ |
| **Display Bracket** | `\[ \oint \vec{E}\cdot d\vec{A} \]` | Centered display block with overflow | $\oint \vec{E}\cdot d\vec{A} = \frac{Q}{\varepsilon_0}$ |
| **Mixed Prose / Markdown** | `"Given \(y=f(u)\), find \(\frac{dy}{dx}\)"` | Segmented token stream preserving spaces | Natural sentence flow |

---

## 2. Regression Protections

1. **Zero Raw Token Leakage**:
   - `\frac`, `\left`, `\right`, `^{...}`, `\$` never render as unparsed text strings.
2. **Word Spacing Preservation**:
   - Delimiter splitting retains original whitespace and punctuation around mathematical symbols, eliminating concatenation bugs (e.g. `Ordinarypowertrigonometricrules...`).
3. **Graceful Fallback**:
   - If an expression contains unparseable characters, `throwOnError: false` safely renders the raw token in monospace without crashing the React virtual DOM tree.
