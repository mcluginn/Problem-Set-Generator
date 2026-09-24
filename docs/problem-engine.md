# Problem Engine & Generation Specification
## Engineering Practice Engine

### 1. Generation Pipeline Overview

```text
┌──────────────────────────────┐
│  Problem Specification (DNA) │ (Subject, Topic, Concept, Target Difficulty, Mode)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│    Select Problem Family     │ (Selects family avoiding recently practiced signatures)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│    Select Family Template    │ (Algebraic, Trig, Exp, Log, Composite, Error Analysis)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│ Generate Math Parameters     │ (Coefficients, exponents, variables, avoiding trivial zeros)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│  Construct Symbolic AST      │ (Generates problem statement, question prompt, LaTeX)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│     Solve Deterministically  │ (Calculates exact symbolic derivative + step breakdown)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│ Multi-Method Validation      │ (Syntax audit, singularity checks, derivative verification)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│ Calculate Structure Sign.    │ (Structural hash & AST complexity metrics)
└──────────────┬───────────────┘
               │
┌──────────────▼───────────────┐
│ Similarity & Diversity Check │ (Rejects if signature too close to last N problems)
└──────────────┬───────────────┘
               │
      [ Valid & Novel? ]
       ├── NO  ──→ Retry with new family (up to max attempts = 5)
       └── YES ──→ Output Validated Problem
```

---

### 2. Problem DNA & Metadata Schema

Every generated problem is stamped with comprehensive educational and structural DNA:

```typescript
export interface ProblemDNA {
  id: string;
  subject: string;                  // e.g. "Differential Calculus"
  topic: string;                    // e.g. "Derivatives"
  concept: string;                  // e.g. "Chain Rule"
  subConcept?: string;              // e.g. "Trigonometric Composition"
  problemFamilyId: string;          // e.g. "CHAIN_POWER_POLYNOMIAL"
  templateId: string;               // e.g. "tpl_chain_poly_pow_01"
  
  representationType: 'Symbolic' | 'WordProblem' | 'Graphical' | 'ErrorAnalysis' | 'Conceptual';
  contextType: 'PureMath' | 'Physics' | 'MechanicalEngineering' | 'ElectricalEngineering';
  guidednessLevel: 1 | 2 | 3 | 4;   // 1=Explicit rule named, 4=Exam style unguided
  
  difficulty: {
    overall: number;                // 1 (Beginner) to 5 (Master)
    conceptual: number;             // Depth of abstract rule understanding
    computational: number;          // Algebraic expansion/simplification load
    procedural: number;             // Number of sequential sub-steps
    reasoning: number;              // Cognitive deduction required
  };

  structureSignature: string;       // e.g. "CHAIN|OUTER:POWER:n=5|INNER:POLY:deg=2"
  requiredSkills: string[];
  targetedMisconceptions: string[];
  
  statement: {
    promptText: string;
    expressionLatex: string;
    targetVariable: string;
    independentVariable: string;
  };
  
  solution: {
    canonicalAnswerLatex: string;
    canonicalAnswerRaw: string;
    equivalentForms: string[];
    steps: SolutionStep[];
    conceptualWhy: string;
  };

  hints: StandardHint[];
  lifecycleState: 'GENERATED' | 'VALIDATING' | 'VALID' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  createdAt: string;
}
```

---

### 3. Problem Families Taxonomy (Derivatives)

To guarantee that problems are not numerical clones, each concept implements diverse families:

#### 3.1 Chain Rule Families:
1. **`CHAIN_POWER_POLYNOMIAL`**: $(ax^k + bx + c)^n$, with integer or fractional $n$.
2. **`CHAIN_TRIG_INNER`**: $\sin(ax^2 + b)$, $\cos(e^{ax})$, $\tan(\ln x)$.
3. **`CHAIN_POWER_TRIG`**: $\sin^n(ax)$, $\cos^n(kx + b)$, $\tan^n(x)$.
4. **`CHAIN_EXP_COMPOSITE`**: $e^{ax^2 + bx}$, $a^{\sin(x)}$.
5. **`CHAIN_LOG_COMPOSITE`**: $\ln(ax^3 + bx)$, $\log_2(\cos x)$.
6. **`CHAIN_NESTED_DOUBLE`**: $\sin(\sqrt{x^2 + 1})$, $e^{\cos(3x)}$.
7. **`CHAIN_PHYSICS_KINEMATICS`**: Instantaneous velocity for $x(t) = A \cos(\omega t + \phi)$.
8. **`CHAIN_ERROR_ANALYSIS`**: Identify missing inner factor in pre-calculated work.

#### 3.2 Product & Quotient Families:
1. **`PRODUCT_POLY_TRIG`**: $(ax^n + b) \cdot \sin(cx)$.
2. **`PRODUCT_POLY_EXP`**: $x^n e^{ax}$.
3. **`PRODUCT_TRIG_EXP`**: $e^{ax} \cos(bx)$.
4. **`QUOTIENT_POLY_POLY`**: $\frac{ax+b}{cx+d}$ and $\frac{ax^2+b}{x-c}$.
5. **`QUOTIENT_TRIG_POLY`**: $\frac{\sin x}{x^2+1}$.
6. **`QUOTIENT_EXP_POLY`**: $\frac{e^{ax}}{x^n+b}$.

#### 3.3 Implicit Differentiation Families:
1. **`IMPLICIT_CIRCLE_ELLIPSE`**: $ax^2 + by^2 = c$.
2. **`IMPLICIT_PRODUCT_MIXED`**: $x^2 y + xy^2 = k$.
3. **`IMPLICIT_TRIG_RELATION`**: $\sin(xy) = x + y$.
4. **`IMPLICIT_TANGENT_LINE`**: Find slope of tangent at given point $(x_0, y_0)$.

---

### 4. Structure Signatures & Diversity Scoring

The system computes a normalized **Structural Signature**:
$$\text{Signature} = \text{Concept} \parallel \text{OpTree} \parallel \text{Depth} \parallel \text{FunctionTypes}$$

#### Diversity Metric:
When selecting the next problem for a student session with history $H = [P_{t-1}, P_{t-2}, \dots, P_{t-k}]$:
1. Exact Signature Match penalty: $-80\%$ novelty score if identical signature in last 3 questions.
2. Parameter Perturbation penalty: $-50\%$ novelty if same family but different numbers.
3. Family Rotation bonus: $+40\%$ novelty if switching representation (e.g. Symbolic $\to$ Error Analysis or Engineering Context).
4. Weakness Alignment bonus: $+50\%$ if family addresses student's lowest-scoring skill.
