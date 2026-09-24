# System Architecture
## Engineering Practice Engine

### 1. High-Level Architectural Diagram

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                               │
│  React / Next.js UI • KaTeX Math Rendering • MathQuill / Virtual MathPad │
│  Student Dashboard • Practice Screen • Hint Controller • Mistake Center  │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ JSON API / RPC
┌────────────────────────────────────▼─────────────────────────────────────┐
│                          Application Layer                               │
│  PracticeService  •  MasteryService  •  AttemptService  •  AuthService   │
│  AdaptiveEngine   •  RemediationRouter  •  TeacherAssignmentService      │
└───────────────────┬────────────────────────────────┬─────────────────────┘
                    │                                │
┌───────────────────▼──────────────┐   ┌─────────────▼─────────────────────┐
│    Deterministic Math Engine     │   │     AI Enhancement Gateway        │
│  • AST Parser & Tokenizer        │   │  • AIProvider Interface           │
│  • Symbolic Differentiator       │   │  • GeminiProvider (Structured)    │
│  • Canonical Simplifier          │   │  • OpenAIProvider / LocalFallback │
│  • Algebraic Equivalence Checker │   │  • Natural Language Hint Enhancer │
│  • Multi-Point Sampler (Verify)  │   │  • Socratic Mistake Explainer     │
│  • Deterministic Step Generator  │   │  • Strict Safety & Fallback Guard │
└───────────────────┬──────────────┘   └───────────────────────────────────┘
                    │
┌───────────────────▼──────────────────────────────────────────────────────┐
│                  Problem Generation & Validation Pipeline                │
│  Curriculum Spec → Family Selector → Template Injector → AST Generator   │
│  → Deterministic Solver → Multi-Method Validator → Structure Signature   │
│  → Diversity Filter (Reject/Accept) → Question Bank Repository           │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                          Persistence Layer                               │
│  PostgreSQL / Supabase / SQLite (Relational Schema)                      │
│  Curriculum Trees • Problem Bank • Student Attempts • Skill Mastery      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

### 2. The Core Mathematical Verification Hierarchy

To uphold absolute mathematical integrity, the application strictly enforces the following decision pipeline:

```text
       Curriculum Rules & Prerequisites
                     ↓
         Problem Family Selection
                     ↓
       Mathematical Parameter Sampling
                     ↓
         Construct Symbolic AST
                     ↓
       Deterministic Symbolic Solver (Derive)
                     ↓
       Canonical Form Simplifier
                     ↓
  Independent Multi-Point Numerical / Equivalence Validator
                     ↓
    Structure Signature & Diversity Verification
                     ↓
       [ Is Valid & Sufficiently Diverse? ]
            ├── NO  ──→ Regenerate / Reject (max retries = 5)
            └── YES ──→ Store in Bank / Present to Student
                     ↓
             Student Answer Attempt
                     ↓
       Symbolic Equivalence & Error Classifier
            ├── Correct: Update Mastery, Record Metrics
            └── Incorrect: Classify Misconception, Unlock Hints
                     ↓
     (Optional) AI Contextual Explanation / Socratic Tutor
```

---

### 3. Service Boundaries & Interface Contracts

```text
src/
├── app/                      # Next.js App Router (Pages, Layouts, API Routes)
│   ├── (auth)/               # Login, Register, Session Management
│   ├── (student)/            # Student Practice, Dashboard, Mistakes, Analytics
│   ├── (teacher)/            # Teacher Classrooms, Assignments, Problem Review
│   └── api/                  # RESTful & RPC Endpoints
│       ├── math/             # Differentiation, parse, equivalent-check
│       ├── practice/         # Next problem, submit attempt, request hint
│       ├── mastery/          # Progress summaries, radar charts, weak concepts
│       └── tutor/            # Contextual AI tutoring with fallback
├── components/               # Atomic & Domain UI Components
│   ├── ui/                   # Buttons, Modals, Cards, Tabs, Badges
│   ├── math/                 # MathRenderer (KaTeX), MathInput (Symbolic/LaTeX)
│   ├── practice/             # ProblemCard, HintAccordion, StepByStepView
│   └── analytics/            # MasteryBar, SkillRadar, AttemptHistoryTable
├── engine/                   # Pure, Zero-Dependency Core Engines
│   ├── math/                 # Symbolic AST, Parser, Derivative Rules, Equivalence
│   ├── generation/           # Problem Families, Template Engine, Diversity Filter
│   ├── validation/           # Correctness Validators, Range Checks, Singularity Audits
│   ├── mastery/              # Bayesian / Weighted Exponential Mastery Models
│   └── misconceptions/       # Rule-based error pattern detectors
├── services/                 # Business Logic & Infrastructure
│   ├── ai/                   # AIProvider, GeminiService, PromptTemplates, SafeParsers
│   ├── database/             # Database Client, Repositories, Query Helpers
│   └── adaptive/             # NextBestProblem selector algorithm
├── types/                    # Shared TypeScript Domain Interfaces
└── lib/                      # Utilities, Configuration, Constants
```

---

### 4. Expansion Architecture for Future Engineering Disciplines

The architecture defines generalized base interfaces:
```typescript
export interface IProblemGenerator<TContext, TProblem> {
  generate(spec: ProblemSpecification): GeneratedProblem<TProblem>;
}

export interface IMathematicalSolver<TProblem, TSolution> {
  solve(problem: TProblem): ValidatedSolution<TSolution>;
}

export interface IAnswerValidator<TInput, TExpected> {
  validate(studentInput: TInput, expected: TExpected): ValidationResult;
}
```

Future modules (*StaticsEngine*, *ThermodynamicsEngine*, *FluidMechanicsEngine*) implement these exact contracts without altering the practice loop, user tracking, or hint revelation pipelines.
