# Handwriting Recognition & Normalization Specification

## 1. Local Image Preprocessing (`src/services/picture/preprocessor.ts`)

The preprocessor runs entirely in the browser (or Node test runner) and evaluates image quality before attempting parsing or network dispatch.

### 1.1 Resolution & Bounds Checks
- Supported MIME types: `image/jpeg`, `image/png`, `image/webp`.
- Maximum file size: **8.0 MB** (`MAX_FILE_SIZE_BYTES`).
- Minimum dimension: **100 px** (`MIN_DIMENSION_PX`).
- Downscaling target: Proportional scaling down to **1280 px** (`MAX_TARGET_DIMENSION_PX`) to accelerate matrix operations.

### 1.2 Luminance & Glare Assessment
Using standard Rec. 601 grayscale coefficients:
$$Y = 0.299R + 0.587G + 0.114B$$
- **Brightness Score**: $\mu_Y / 255 \times 100$.
- **Contrast Score**: $\sigma_Y / 64 \times 100$.
- Flags: `IMAGE_TOO_DARK` ($\mu_Y < 15$), `IMAGE_TOO_BRIGHT_GLARE` ($\mu_Y > 95 \land \sigma_Y < 15$).

### 1.3 High-Pass Laplacian Edge Variance (Blur Detection)
A discrete Laplacian $3 \times 3$ convolution is computed across stride samples:
$$\Delta I(x,y) = I(x+1,y) + I(x-1,y) + I(x,y+1) + I(x,y-1) - 4 I(x,y)$$
Blur score is calibrated:
$$\text{BlurScore} = \min\left(100, \frac{\sqrt{\operatorname{Var}(\Delta I)}}{25} \times 100\right)$$
If $\text{BlurScore} < 15$, the image is flagged as `IMAGE_TOO_BLURRY` with guidance to hold the camera steady.

### 1.4 Stroke-Preserving Dynamic Contrast Optimization
Dynamic S-curve contrast enhancement preserves thin fraction bars, negative signs, decimal dots, and parentheses without binary threshold clipping:
$$v_{\text{adj}} = \operatorname{clamp}\left(0, 255, 255 \times \left((v / 255 - 0.5) \times \text{factor} + 0.5\right)\right)$$

---

## 2. Mathematical String Normalization (`src/services/picture/mathConversionService.ts`)

OCR engines frequently introduce character ambiguities. The normalizer deterministically resolves these before AST construction:

| Handwritten / OCR Character | Normalized Canonical Token |
| :--- | :--- |
| Uppercase `X` variable | Lowercase `x` |
| Superscript digits `⁰¹²³⁴⁵⁶⁷⁸⁹` | `^0`, `^1`, `^2`, ..., `^9` |
| `·`, `×`, `•`, `\cdot`, `\times` | `*` |
| `÷` | `/` |
| LaTeX `\frac{u}{v}` | `((u)/(v))` |
| LaTeX `\sqrt{x}` | `(x)^(1/2)` |
| LaTeX `\sin`, `\cos`, `\tan`, `\ln` | `sin`, `cos`, `tan`, `ln` |
| Brackets `[ ... ]`, `{ ... }` | `( ... )` |
| Assignment prefixes (`dy/dx = `, `u = `, `y' = `) | Stripped to isolate RHS expression |

---

## 3. AST Generation & Syntax Verification
`MathConversionService.convertToAST(raw)` runs `parseMath(normalized)`.
- If parsing succeeds: Returns `{ success: true, ast: MathNode, normalizedExpression }`.
- If parsing fails: Returns descriptive warnings and opens Tier 2 student editor prefilled with the best-effort string.
