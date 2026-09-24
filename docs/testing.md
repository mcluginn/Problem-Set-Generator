# Testing Strategy & Quality Assurance Plan
## Engineering Practice Engine

### 1. The Quality Assurance Pyramid

```text
               ┌───────────────────────┐
               │    End-to-End (E2E)   │ (Full practice loop, login, streak)
               ├───────────────────────┤
               │   Integration Tests   │ (Gen → Solve → Grade → Mastery flow)
               ├───────────────────────┤
               │ Mathematical Fuzzing  │ (1,000+ Problem Batch Stress Test)
               ├───────────────────────┤
               │   Golden Test Suite   │ (50+ Benchmark calculus problems)
               ├───────────────────────┤
               │      Unit Tests       │ (Rules, AST, Simplifier, Equivalence)
               └───────────────────────┘
```

---

### 2. Golden Benchmark Test Suite

A hardcoded regression suite of calculus problems with hand-verified derivatives across all 14 concepts:

```typescript
export const GOLDEN_CALCULUS_SUITE = [
  {
    id: 'golden_power_01',
    concept: 'Power Rule',
    expression: '3*x^4 - 5*x^2 + 7*x - 9',
    expectedDerivative: '12*x^3 - 10*x + 7',
    alternateEquivalentAnswers: ['7 + 12*x^3 - 10*x', 'x*(12*x^2 - 10) + 7']
  },
  {
    id: 'golden_chain_poly_01',
    concept: 'Chain Rule',
    expression: '(3*x^2 - 2*x + 4)^5',
    expectedDerivative: '5*(3*x^2 - 2*x + 4)^4 * (6*x - 2)',
    alternateEquivalentAnswers: ['10*(3*x - 1)*(3*x^2 - 2*x + 4)^4', '(30*x - 10)*(3*x^2 - 2*x + 4)^4']
  },
  {
    id: 'golden_product_trig_01',
    concept: 'Product Rule',
    expression: 'x^3 * sin(x)',
    expectedDerivative: '3*x^2*sin(x) + x^3*cos(x)',
    alternateEquivalentAnswers: ['x^2*(3*sin(x) + x*cos(x))']
  },
  {
    id: 'golden_quotient_01',
    concept: 'Quotient Rule',
    expression: '(2*x + 1)/(x^2 + 3)',
    expectedDerivative: '(2*(x^2 + 3) - (2*x + 1)*(2*x)) / (x^2 + 3)^2',
    alternateEquivalentAnswers: ['(6 - 2*x^2 - 2*x)/(x^2 + 3)^2', '(-2*x^2 - 2*x + 6)/(x^2 + 3)^2']
  },
  {
    id: 'golden_implicit_01',
    concept: 'Implicit Differentiation',
    expression: 'x^2 + y^2 - 25',
    expectedDerivative: '-x/y',
    alternateEquivalentAnswers: ['-(x/y)', '-(x)/(y)']
  }
];
```

---

### 3. Automated Mathematical Stress Test (1,000+ Problem Batch Generator)

Before releasing or accepting new problem generators, an automated test generates 1,000 problems across concepts and audits:
1. **Syntactic Validity**: AST parse succeeds without error.
2. **Solvability**: Differentiator and simplifier produce exact canonical answer.
3. **Equivalence Invariance**: Evaluates multi-level equivalence hierarchy:
   - Level 1: Canonical AST equality.
   - Level 2: Exact symbolic zero-difference simplification $\text{Simplify}(E_{\text{factored}} - E_{\text{expanded}}) = 0$.
   - Level 3: Domain-aware symbolic identity check.
   - Level 4: Domain-safe numerical confidence check with adaptive tolerance $\text{abs}(a-b) \le \text{atol} + \text{rtol} \cdot \max(\text{abs}(a), \text{abs}(b))$.
4. **Singularity & Domain Audit**: Verifies that all tested points strictly reside outside poles, zero denominators, and branch cuts.
5. **Structural Novelty**: Computes pairwise signature distances to verify variety across problem families.
6. **Step Continuity**: Verifies each step $k+1$ is a valid mathematical transformation of step $k$.

---

### 4. AI Resilience & Failure Mode Testing
- **Timeout Test**: Simulates 1500ms AI delay; verifies deterministic hint renders without delay.
- **Quota Error Test**: Simulates HTTP 429; practice session continues without interruption.
- **Malformed Payload Test**: Simulates invalid JSON with hallucinated mathematical symbols; sanitizer falls back safely.
- **Solution Leakage Test**: Asserts that AI hints never include raw solution expressions prior to explicit student unlock.
