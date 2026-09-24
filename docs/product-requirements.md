# Product Requirements Document (PRD)
## Engineering Practice Engine

### 1. Vision & Core Philosophy
The **Engineering Practice Engine** is an intelligent, high-rigor educational platform designed to provide unlimited, mathematically verified, conceptually diverse practice for engineering students. 

The initial release targets **Differential Calculus → Derivatives**, engineered with an extensible foundation to scale into Integral Calculus, Differential Equations, Statics, Dynamics, Thermodynamics, Fluid Mechanics, and Mechanics of Deformable Bodies.

#### Core Tenets:
1. **AI is Optional, Not Foundational**: The entire practice, generation, deterministic verification, hint generation, step-by-step solutions, mastery calculation, and adaptive recommendation system works 100% without an active AI connection or API key.
2. **Zero Unverified Mathematics**: Large Language Models (LLMs) are **never** the authoritative arbiter of mathematical correctness. Problem generation, differentiation, simplification, equivalent answer checks, and grading are executed by a deterministic mathematical engine and verified through independent multi-method validation.
3. **True Conceptual Diversity (Anti-Cloning)**: A "new problem" is NOT merely the same template with randomized coefficients. The engine enforces structural, representational, and reasoning variation through parameterized Problem Families and Structure Signatures.
4. **Pedagogical Reveal Control**: Hints are structured progressively (Recognition → Direction → Formula → Setup → Guided Calculation → Step-by-Step). The system never reveals solutions unprompted after a single incorrect attempt.
5. **Deterministic Misconception Diagnosis**: Student errors are parsed symbolically and classified into specific misconceptions (e.g., missing inner derivative, power rule exponent reduction error, quotient rule sign reversal), triggering targeted remediation rather than random problem recycling.

---

### 2. Target Users & Personas

#### 2.1 Student Persona ("Alex - Engineering Sophomore")
- **Pain Points**: Re-solving identical textbook problems without learning transfer; getting answers wrong without knowing which sub-step failed; relying prematurely on full solution manuals; struggling when rules are mixed or disguised in engineering contexts.
- **Needs**: Unlimited fresh problems, granular step hints, clear algebraic equivalence acceptance (e.g., $(6x+2)(3x^2+2x)^4$ vs $2(3x+1)(3x^2+2x)^4$), diagnosis of specific mistakes, and visible concept/skill mastery tracking.

#### 2.2 Teacher / Instructor Persona ("Dr. Mercer - Mechanics & Calculus Professor")
- **Pain Points**: Students cheating with LLMs that output unverifiable solutions; lack of insight into which specific misconceptions plague the class; time-consuming homework generation.
- **Needs**: Curated problem bank with verified difficulty metadata, ability to assign targeted problem sets, and class-level misconception heatmaps.

---

### 3. Functional Scope (Version 1: Differential Calculus → Derivatives)

#### 3.1 Initial Concepts Covered
1. **Constant Rule**: $\frac{d}{dx}[c] = 0$
2. **Constant Multiple Rule**: $\frac{d}{dx}[c \cdot f(x)] = c \cdot f'(x)$
3. **Sum & Difference Rules**: $\frac{d}{dx}[f(x) \pm g(x)] = f'(x) \pm g'(x)$
4. **Power Rule**: $\frac{d}{dx}[x^n] = n x^{n-1}$ (integer, fractional, negative powers)
5. **Product Rule**: $\frac{d}{dx}[u \cdot v] = u'v + uv'$
6. **Quotient Rule**: $\frac{d}{dx}\left[\frac{u}{v}\right] = \frac{u'v - uv'}{v^2}$
7. **Chain Rule**: $\frac{d}{dx}[f(g(x))] = f'(g(x)) \cdot g'(x)$
8. **Trigonometric Derivatives**: $\sin x, \cos x, \tan x, \sec x, \csc x, \cot x$
9. **Exponential Derivatives**: $e^{g(x)}, a^{g(x)}$
10. **Logarithmic Derivatives**: $\ln(g(x)), \log_a(g(x))$
11. **Implicit Differentiation**: $\frac{d}{dx}[F(x, y) = 0] \implies \frac{dy}{dx}$
12. **Higher-Order Derivatives**: $f''(x), f'''(x), \frac{d^2y}{dx^2}$
13. **Basic Applications of Derivatives**: Tangent line equations, instantaneous velocity/acceleration, rate of change in physical contexts.

#### 3.2 Practice Modes
- **Adaptive Practice (Default)**: Automatically modulates difficulty and selects problem families targeting the student's weakest skills.
- **Standard Concept Practice**: Practice within a specific concept with progressive hints available.
- **Mixed Practice**: Concept headers hidden; student must recognize the applicable rule.
- **Exam Mode**: Timed, hints and solutions disabled until submission.
- **Mistake Remediation Mode**: Practice generated specifically from classified past misconceptions.

---

### 4. Non-Functional Requirements
- **Performance**: Deterministic generation and grading latency $< 15\text{ms}$. Full page interactivity instant.
- **Mathematical Accuracy**: $100\%$ verified test suite pass rate across 10,000+ generated problems and golden regression suites.
- **Reliability & Offline Capability**: Full practice loop functional offline or during AI outages with zero data loss.
- **Security & Privacy**: Zero student PII transmitted to external AI providers. API keys isolated on backend.
- **Accessibility & UX**: Accessible keyboard input, screen-reader semantic tags, high-contrast mathematical typography using KaTeX.
