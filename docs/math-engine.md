# Mathematical Engine Specification
## Engineering Practice Engine

### 1. Architectural Role
The **Mathematical Engine** (`src/engine/math/`) is a standalone, deterministic symbolic computation module. It has **zero dependencies on AI services** and operates identically in Node.js server runtimes and browser client runtimes.

---

### 2. Abstract Syntax Tree (AST) & Node Architecture

Every mathematical expression is tokenized and parsed into a strongly-typed AST:

```typescript
export type MathNode =
  | ConstantNode       // e.g. 5, -3/4, pi, e
  | VariableNode       // e.g. x, y, t, theta
  | OperatorNode       // e.g. +, -, *, /, ^
  | FunctionNode       // e.g. sin, cos, tan, ln, exp, sqrt
  | ParenthesisNode    // explicit grouping
  | DerivativeNode;    // e.g. d/dx [f(x)]
```

#### Node Definitions:
- **`ConstantNode`**: Stores exact rational numbers (`numerator: bigint, denominator: bigint`) or symbolic constants ($\pi, e$).
- **`VariableNode`**: Variable symbol name (`name: string`), default `'x'`.
- **`OperatorNode`**: Binary operator (`op: '+' | '-' | '*' | '/' | '^'`) with `left: MathNode` and `right: MathNode`.
- **`FunctionNode`**: Standard unary mathematical functions (`fn: 'sin' | 'cos' | 'tan' | 'sec' | 'csc' | 'cot' | 'ln' | 'exp' | 'sqrt'`) with `args: MathNode[]`.

---

### 3. Symbolic Differentiation Engine

The differentiator recursively traverses the AST applying standard calculus theorems:

#### Rule Implementation Table:
| Rule | Mathematical Definition | Engine Handler |
| :--- | :--- | :--- |
| **Constant Rule** | $\frac{d}{dx}[c] = 0$ | `diffConstant(node)` |
| **Power Rule** | $\frac{d}{dx}[x^n] = n x^{n-1}$ | `diffPower(node)` |
| **Sum / Difference** | $\frac{d}{dx}[u \pm v] = u' \pm v'$ | `diffSum(node)` |
| **Product Rule** | $\frac{d}{dx}[u \cdot v] = u'v + uv'$ | `diffProduct(node)` |
| **Quotient Rule** | $\frac{d}{dx}\left[\frac{u}{v}\right] = \frac{u'v - uv'}{v^2}$ | `diffQuotient(node)` |
| **Chain Rule** | $\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)$ | `diffChain(node)` |
| **Trigonometric** | $\frac{d}{dx}[\sin(u)] = \cos(u) \cdot u'$, etc. | `diffTrig(node)` |
| **Exponential** | $\frac{d}{dx}[e^u] = e^u \cdot u'$, $\frac{d}{dx}[a^u] = a^u \ln(a) \cdot u'$ | `diffExp(node)` |
| **Logarithmic** | $\frac{d}{dx}[\ln(u)] = \frac{u'}{u}$, $\frac{d}{dx}[\log_a(u)] = \frac{u'}{u \ln(a)}$ | `diffLog(node)` |
| **Higher-Order** | $\frac{d^n}{dx^n}[f(x)] = \text{diff}^n(f(x))$ | `diffHigherOrder(node, n)` |
| **Implicit** | $F(x, y) = 0 \implies \frac{dy}{dx} = -\frac{F_x}{F_y}$ | `diffImplicit(equation, varX, varY)` |

---

### 4. Algebraic Equivalence Checking Hierarchy

A student's answer must never be graded with strict string comparison. The engine uses a strict **4-Level Hierarchy**:

```text
Level 1: AST Normalization / Canonicalization
         Structural sorting of commutative terms/factors, sign normalization.
         If AST_canonical(S) == AST_canonical(E) → MATCH (Confidence: 1.0)
                           │ (If false)
                           ▼
Level 2: Exact Symbolic Simplification of Difference: D(x) = S(x) - E(x)
         Expand, cancel, factor, and reduce exact rational fractions.
         If Simplify(S(x) - E(x)) == 0 → MATCH (Confidence: 1.0)
                           │ (If false or ambiguous)
                           ▼
Level 3: Domain-Aware Symbolic Comparison
         Trigonometric identity rewrites, logarithmic property expansion,
         rational denominator matching with domain restriction auditing.
         If verified symbolically → MATCH (Confidence: 1.0)
                           │ (If symbolic match inconclusive)
                           ▼
Level 4: Domain-Safe Numerical Multi-Point Confidence Check (Probabilistic Only)
         NOT A PROOF: Used only as an assistive confidence check.
         1. Domain Audit: Detects roots, denominators, log arguments, trig singularities.
         2. Safe Sampling: Samples N=20 points strictly within the open domain,
            with safety margin delta >= 0.25 away from any branch cut or singularity.
         3. Adaptive Tolerance: |S(x_i) - E(x_i)| <= atol + rtol * max(|S(x_i)|, |E(x_i)|)
            (Default: atol = 1e-9, rtol = 1e-7).
         4. Output: Returns probabilistic confidence score without claiming mathematical proof.
```

### 4.1 Exact Rational Arithmetic

The math engine implements an internal **`Rational`** class (`numerator: bigint, denominator: bigint`) for:
- Polynomial and rational coefficients
- Fractional exponents (e.g. $x^{2/3}$)
- Negative exponents
- Exact differentiation constants

Floating-point approximations are strictly forbidden during symbolic simplification, differentiation, and AST canonicalization. Float conversions occur solely during Level 4 numerical sampling.

---

### 5. Deterministic Step-by-Step Generation

Step generation is built directly into rule evaluation. When a rule is applied, it emits structured explanation objects:

```typescript
export interface SolutionStep {
  stepNumber: number;
  title: string;
  ruleName: string;
  expressionLatex: string;
  explanation: string;
  subSteps?: SolutionStep[];
  conceptualNote?: string;
}
```

#### Example (Chain Rule on $y = (3x^2 - 2x + 4)^5$):
1. **Step 1 - Identify Outer and Inner Functions**:
   - Outer function: $f(u) = u^5$, where $u = 3x^2 - 2x + 4$.
   - Inner function: $g(x) = 3x^2 - 2x + 4$.
2. **Step 2 - Differentiate Outer Function**:
   - $\frac{df}{du} = 5u^4 = 5(3x^2 - 2x + 4)^4$.
3. **Step 3 - Differentiate Inner Function**:
   - $\frac{du}{dx} = \frac{d}{dx}[3x^2 - 2x + 4] = 6x - 2$.
4. **Step 4 - Apply the Chain Rule**:
   - $\frac{dy}{dx} = \frac{df}{du} \cdot \frac{du}{dx} = 5(3x^2 - 2x + 4)^4 \cdot (6x - 2)$.
5. **Step 5 - Optional Algebraic Simplification / Factoring**:
   - Factoring $2$ out of $(6x - 2)$: $\frac{dy}{dx} = 10(3x - 1)(3x^2 - 2x + 4)^4$.

---

### 6. Misconception / Buggy Rules Engine

The math engine contains a **Perturbation Generator** implementing common calculus misconceptions:
- `MISSING_INNER_DERIVATIVE`: Evaluates $f'(g(x))$ without multiplying by $g'(x)$.
- `POWER_RULE_NO_REDUCE`: Evaluates $n \cdot x^n$ instead of $n \cdot x^{n-1}$.
- `PRODUCT_RULE_MULTIPLY_DERIVS`: Evaluates $u' \cdot v'$ instead of $u'v + uv'$.
- `QUOTIENT_RULE_SIGN_FLIP`: Evaluates $\frac{u'v + uv'}{v^2}$.
- `QUOTIENT_RULE_NO_SQUARE`: Evaluates $\frac{u'v - uv'}{v}$.
- `IMPLICIT_FORGOT_DYDX`: Treats $y$ as a constant rather than $y(x)$.

When a student submits an incorrect answer, it is compared against these synthetic buggy ASTs. An exact match triggers immediate high-precision diagnosis (e.g., *"You differentiated the outer function correctly, but forgot to multiply by the derivative of the inside $(6x - 2)$"*).
