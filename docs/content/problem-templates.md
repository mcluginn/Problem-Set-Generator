# Problem Template Blueprints & Mathematical Construction

**Engineering Practice Engine — Generative Template Engine**  
**Document Revision**: 3.0.0  
**Phase**: PHASE 3 — ASSESSMENT EVIDENCE → PROBLEM FAMILIES → VERIFIED GENERATION  
**Date**: August 28, 2026  
**Status**: ACTIVE & AUTHORITATIVE  

---

## 1. Generative Template Principles

In the Engineering Practice Engine, a **Problem Template** is a concrete mathematical generative blueprint.

### Core Architectural Rules:
1. **Never a Giant String Prompt**: Templates do NOT generate mathematical expressions via natural language prompting (`"Create a hard derivative problem..."`).
2. **Deterministic AST Construction**: All expressions are built using strongly-typed Abstract Syntax Tree nodes (`constant`, `variable`, `add`, `multiply`, `power`, `divide`, `func`).
3. **Strict Parameter Validation**: Every parameter has an explicit schema (type, range, non-zero conditions, singularity avoidance).
4. **Structured Reasoning Traces**: Every template produces an explicit 4-to-6 step reasoning trace linking recognition, decomposition, theorem execution, and algebraic simplification.
5. **5-Tier Progressive Hints**: Every template provides 5 levels of hints (Recognition $\rightarrow$ Direction $\rightarrow$ Formula $\rightarrow$ Setup $\rightarrow$ Guided Calculation) with strict answer leakage prevention.
6. **Misconception-Driven Distractors**: For error-analysis and multiple-choice modalities, distractors are derived from actual student cognitive traps (e.g. `MISSING_INNER_DERIVATIVE`, `POWER_RULE_NO_REDUCE`).

---

## 2. Chain Rule Template Blueprint Example

### Template: `TMPL-CHAIN-POLY-STD`
* **Family ID**: `FAM-GEN0102-CHAIN-POLY`
* **Target Skill ID**: `SKILL-GEN0102-005` (Chain Rule differentiation)
* **Parameter Schema**:
  * $a \in [1, 5]$ (non-zero leading quadratic coefficient)
  * $b \in [-5, 5]$ (linear coefficient)
  * $c \in [1, 8]$ (non-zero constant term)
  * $p \in [3, 7]$ (outer power exponent)
* **AST Construction**:
  ```ts
  const ax2 = multiply(constant(a), power(variable('x'), constant(2)));
  const bx = multiply(constant(b), variable('x'));
  const innerAst = add(ax2, bx, constant(c));
  const rawAst = power(innerAst, constant(p));
  ```
* **Structured Reasoning Trace**:
  * **Step 1 (Recognition)**: Identify $f(u) = u^p$ and $u(x) = ax^2 + bx + c$.
  * **Step 2 (Decomposition)**: Compute inner derivative $\frac{du}{dx} = 2ax + b$.
  * **Step 3 (Formula Selection)**: Apply $\frac{d}{dx}[u^p] = p u^{p-1} \frac{du}{dx}$.
  * **Step 4 (Simplification)**: Assemble $p(2ax + b)(ax^2 + bx + c)^{p-1}$.

---

## 3. Registered Problem Templates Summary

| Template ID | Target Family | Primary Skill | Description | Formats |
| :--- | :--- | :--- | :--- | :--- |
| `TMPL-CHAIN-POLY-STD` | `FAM-GEN0102-CHAIN-POLY` | `SKILL-GEN0102-005` | Standard quadratic power $(ax^2 + bx + c)^p$ | `SYMBOLIC_INPUT`, `FREE_RESPONSE` |
| `TMPL-CHAIN-POLY-RADICAL` | `FAM-GEN0102-CHAIN-POLY` | `SKILL-GEN0102-005` | Radical square root $\sqrt{ax^2 + c}$ | `SYMBOLIC_INPUT` |
| `TMPL-CHAIN-TRIG-POLY` | `FAM-GEN0102-CHAIN-TRIG` | `SKILL-GEN0102-005` | Trigonometric composite $\sin(ax^2 + c)$ | `SYMBOLIC_INPUT` |
| `TMPL-CHAIN-ERROR-DIAG` | `FAM-GEN0102-CHAIN-ERROR` | `SKILL-GEN0102-005` | Error analysis diagnosing missing $u'(x)$ | `ERROR_ANALYSIS`, `MULTIPLE_CHOICE` |
| `TMPL-CHAIN-METHOD-RECOG` | `FAM-GEN0102-CHAIN-RECOG` | `SKILL-GEN0102-005` | Multiple choice rule discrimination | `MULTIPLE_CHOICE` |
| `TMPL-CHAIN-KINEMATICS-APP`| `FAM-GEN0102-CHAIN-APP` | `SKILL-GEN0102-005` | Instantaneous velocity $v(t) = s'(t)$ | `NUMERIC_INPUT`, `FREE_RESPONSE` |
| `TMPL-POWER-POLY-STD` | `FAM-GEN0102-POWER-STD` | `SKILL-GEN0102-002` | Term-by-term polynomial Power Rule | `SYMBOLIC_INPUT` |
| `TMPL-PRODUCT-POLY-TRIG` | `FAM-GEN0102-PRODUCT-STD`| `SKILL-GEN0102-003` | Product Rule $(ax^2 + b)\sin(x)$ | `SYMBOLIC_INPUT` |
| `TMPL-QUOTIENT-POLY-POLY` | `FAM-GEN0102-QUOTIENT-STD`| `SKILL-GEN0102-004`| Quotient Rule $(ax + b)/(cx + d)$ | `SYMBOLIC_INPUT` |
| `TMPL-TANGENT-LINE-STD` | `FAM-GEN0102-TANGENT-APP`| `SKILL-GEN0102-012`| Tangent line equation at $x = x_0$ | `FREE_RESPONSE`, `SYMBOLIC_INPUT` |
