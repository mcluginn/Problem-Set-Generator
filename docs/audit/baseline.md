# Baseline Architecture, Security & Mathematical Audit Report
## Engineering Practice Engine (Differential Calculus → Derivatives)
**Audit Date**: 2026-08-27  
**Auditor**: Senior Software Architect & Mathematical Reviewer  
**Repository Source of Truth**: `c:\Users\My PC\Documents\Problem Set`

---

## 1. Executive Status & Claim Verification Matrix

| Area | Architectural Claim | Code Verification Status | Evidence & Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js 14 App Router, React 18, TS Strict | **VERIFIED** | `package.json` contains Next.js 14.2.35, React 18.3.1, TypeScript 5.6.2 with `"strict": true` in `tsconfig.json`. |
| **Styling & Math** | Tailwind CSS + KaTeX Math Rendering | **VERIFIED** | `katex` 0.16.11 and `@types/katex` installed. `MathRenderer.tsx` and `MathInput.tsx` render LaTeX accurately. |
| **Exact Rational Arithmetic** | Exact BigInt rational numbers without float loss | **VERIFIED** | `Rational` class in `src/engine/math/rational.ts` implements BigInt GCD/LCM arithmetic with exact fraction representations. |
| **Deterministic Core** | Zero AI dependency for generation, solving, grading | **VERIFIED** | Core practice loop operates 100% locally with 0 external network requests when AI is absent. |
| **Equivalence Hierarchy** | 4-Level Algebraic Equivalence Hierarchy | **PARTIALLY VERIFIED** | Levels 1-4 implemented, but structured status types (`EQUIVALENT`, `NOT_EQUIVALENT`, `UNABLE_TO_VERIFY`, `DOMAIN_MISMATCH`, `INVALID_INPUT`) need standardization. |
| **Terminology Integrity** | Probabilistic sampling vs formal proof | **PARTIALLY VERIFIED** | Code implements domain-safe sampling; historical references to formal Schwartz-Zippel proof must be corrected to "Domain-safe randomized numerical equivalence check". |
| **Implicit Differentiation** | Explicit dependent variable solver for $F(x,y)=0$ | **PARTIALLY VERIFIED** | Basic term differentiation supported; full equation solver isolating $\frac{dy}{dx} = -\frac{F_x}{F_y}$ with step breakdown needs formal extraction. |
| **Curriculum Coverage** | 14 Curriculum Concepts | **PARTIALLY VERIFIED** | 14 concepts cataloged in curriculum; problem families currently cover 8 core classes. Dedicated families needed for all 14 concepts. |
| **Golden Benchmark** | 50+ Hand-verified calculus problems | **VERIFIED** | 51 benchmark test cases in `tests/unit/golden.test.ts` pass with 100% success rate. Needs expansion to 100+ cases. |
| **Generator Stress** | 1,000 problem batch stress testing | **VERIFIED** | `tests/stress/generator-stress.test.ts` generates 1,000 valid problems with 0.19ms average latency. Needs randomized fuzz mode. |
| **Misconception Engine** | Synthetic Buggy AST error classification | **VERIFIED** | AST perturbation models classify `MISSING_INNER_DERIVATIVE`, `POWER_RULE_NO_REDUCE`, etc. without string substitution. |
| **AI Resilience & Fallback** | 100% graceful fallback to deterministic engine | **VERIFIED** | `DeterministicFallbackProvider` provides identical contract without network dependencies or student interruption. |

---

## 2. Identified Architectural & Mathematical Risks

### Risk 1: Equivalence Engine Status Representation & Domain Policy
- **Issue**: Equivalence returned a boolean `equivalent: boolean`. In educational software, uncertainty must be clearly distinguished from proven falsehood (`UNABLE_TO_VERIFY` vs `NOT_EQUIVALENT` vs `DOMAIN_MISMATCH`).
- **Remediation**: Standardize return interface on `EquivalenceStatus = 'EQUIVALENT' | 'NOT_EQUIVALENT' | 'UNABLE_TO_VERIFY' | 'DOMAIN_MISMATCH' | 'INVALID_INPUT'`, and define central configuration constants (`MIN_NUMERIC_SAMPLES = 8`, `DEFAULT_NUMERIC_SAMPLES = 20`, `DEFAULT_ATOL = 1e-9`, `DEFAULT_RTOL = 1e-7`).

### Risk 2: Parser Security & Untrusted Input Protection
- **Issue**: The parser accepted arbitrary input lengths without recursion depth limits, creating potential ReDoS or stack overflow vulnerability on pathological inputs (e.g. 500 nested parentheses).
- **Remediation**: Add explicit constraints: maximum expression length (500 chars), maximum AST nesting depth (25 levels), and user-friendly error messages that do not expose internal stack traces.

### Risk 3: Implicit Differentiation Equation Solver
- **Issue**: Implicit differentiation requires solving an algebraic equation $F(x, y) = C$ for $\frac{dy}{dx}$, collecting $\frac{dy}{dx}$ terms, and explaining why $y$ introduces $\frac{dy}{dx}$ via the Chain Rule.
- **Remediation**: Build a dedicated `ImplicitEngine` that differentiates equations symbolically, isolates $\frac{dy}{dx}$, checks for singularities where $F_y = 0$, and emits pedagogical rationale.

### Risk 4: Curriculum Family Density Across 14 Concepts
- **Issue**: The initial problem generator grouped several basic concepts (Constant Rule, Sum Rule, Difference Rule) into generic polynomial families.
- **Remediation**: Implement dedicated problem families for all 14 curriculum concepts with diverse representations (Symbolic, Word/Kinematics, Error Analysis, Tangent Line Geometric Slopes, and Concept Recognition).

### Risk 5: Stress Testing Methodology (Balanced vs Randomized Fuzzing)
- **Issue**: The current 1,000-problem stress test executes in a balanced round-robin mode. A true adversarial test requires randomized parameter fuzzing, singular edge cases, and 10,000+ iterations.
- **Remediation**: Maintain two distinct test suites: `balanced-coverage.test.ts` and `random-fuzz-stress.test.ts`.

---

## 3. Immediate Action Plan

1. **Mathematical Core Hardening**:
   - Secure parser against pathological inputs and add depth limits.
   - Refactor `EquivalenceEngine` to output structured `EquivalenceStatus` and centralized tolerances.
   - Build dedicated `ImplicitDifferentiator` for $F(x, y) = 0$ relations.
2. **Curriculum & Generation Expansion**:
   - Author dedicated problem families for all 14 concepts.
   - Generate `docs/content-coverage.md` matrix.
3. **Testing Suite Expansion**:
   - Expand Golden Benchmark Suite to 100+ problems.
   - Add property-based invariant tests and cross-runtime consistency tests.
   - Add Hint Leakage test suite and Misconception Benchmark test suite.
   - Add Synthetic Student adaptive tests (Students A–E) and concurrency/idempotency tests.
4. **UI & Teacher Review Mode**:
   - Build Teacher Review workspace for inspecting problem DNA, signatures, and approving/flagging content.
   - Ensure mobile responsiveness and accessible keyboard interactions.
5. **Final Production Verification Report**:
   - Produce `docs/audit/verification-report.md`.
