# Differential Calculus Curriculum Coverage & Diversity Matrix

## Subject: Differential Calculus → Topic: Derivatives (v1.0.0)

This document provides the authoritative coverage matrix for all **14 foundational calculus concepts** supported by the deterministic mathematical engine.

---

## 1. Complete Curriculum Concept Matrix

| # | Concept Name | Problem Family ID | Difficulty Tiers | Representation Formats | Misconception Targets | Golden Tests | Automated Tests |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Constant Rule** | `CONSTANT_DIRECT` | Level 1–2 | Symbolic, PureMath | `ZERO_DERIVATIVE_CONFUSION` | 6 | ✅ Passing |
| 2 | **Constant Multiple Rule** | `CONSTANT_MULTIPLE` | Level 1–3 | Symbolic, PureMath | `DROP_CONSTANT_MULTIPLIER` | 8 | ✅ Passing |
| 3 | **Sum Rule** | `SUM_POLY` | Level 1–3 | Symbolic, PureMath | `SUM_RULE_SIGN_ERROR` | 8 | ✅ Passing |
| 4 | **Difference Rule** | `DIFFERENCE_POLY` | Level 1–3 | Symbolic, PureMath | `DIFFERENCE_RULE_SIGN_FLIP` | 8 | ✅ Passing |
| 5 | **Power Rule** | `POWER_POLYNOMIAL`, `POWER_FRACTIONAL_NEGATIVE` | Level 1–4 | Symbolic, Radical, Fractional | `POWER_RULE_NO_REDUCE`, `POWER_RULE_FORGOT_COEFF` | 14 | ✅ Passing |
| 6 | **Product Rule** | `PRODUCT_POLY_TRIG`, `PRODUCT_POLY_EXP` | Level 2–4 | Symbolic, Multi-Term | `PRODUCT_RULE_MULTIPLY_DERIVS`, `PRODUCT_RULE_OMITTED_TERM` | 12 | ✅ Passing |
| 7 | **Quotient Rule** | `QUOTIENT_POLY_POLY`, `QUOTIENT_TRIG_POLY` | Level 2–5 | Symbolic, Rational | `QUOTIENT_RULE_SIGN_FLIP`, `QUOTIENT_RULE_NO_SQUARE`, `QUOTIENT_RULE_REVERSED_NUMERATOR` | 12 | ✅ Passing |
| 8 | **Chain Rule** | `CHAIN_POWER_POLYNOMIAL`, `CHAIN_TRIG_INNER`, `CHAIN_KINEMATICS` | Level 2–5 | Symbolic, Kinematics, Word | `MISSING_INNER_DERIVATIVE`, `CHAIN_FORGOT_OUTER` | 14 | ✅ Passing |
| 9 | **Trigonometric Derivatives** | `TRIG_STANDARD` | Level 2–4 | Symbolic, Angular | `TRIG_DERIVATIVE_SIGN_ERROR` | 8 | ✅ Passing |
| 10 | **Exponential Derivatives** | `EXP_STANDARD` | Level 2–4 | Symbolic, Physics | `EXP_FORGOT_CHAIN_COEFF` | 6 | ✅ Passing |
| 11 | **Logarithmic Derivatives** | `LOG_STANDARD` | Level 2–4 | Symbolic, PureMath | `LOG_FORGOT_RECIPROCAL` | 6 | ✅ Passing |
| 12 | **Implicit Differentiation** | `IMPLICIT_CONIC`, `IMPLICIT_PRODUCT` | Level 3–5 | Symbolic, Geometric | `IMPLICIT_FORGOT_DYDX_FACTOR`, `IMPLICIT_SIGN_ERROR` | 6 | ✅ Passing |
| 13 | **Higher-Order Derivatives** | `HIGHER_ORDER_POLY` | Level 2–4 | Symbolic, Multi-Stage | `HIGHER_ORDER_STOP_EARLY` | 4 | ✅ Passing |
| 14 | **Basic Applications of Derivatives** | `APP_TANGENT_SLOPE`, `APP_KINEMATICS` | Level 2–4 | TangentLine, Kinematics, Word | `APP_EVALUATION_BEFORE_DIFF`, `APP_WRONG_UNITS` | 4 | ✅ Passing |

---

## 2. Structural Signatures & Representation Types

### Supported Representations
1. **Symbolic / PureMath**: Exact algebraic expressions (e.g. $f(x) = (3x^2 - 2x + 4)^5$).
2. **Rational & Fractional**: Polynomial quotients with exact BigInt rational coefficients.
3. **Kinematics / Physical Modeling**: Displacement $s(t)$, instantaneous velocity $v(t) = s'(t)$, acceleration $a(t) = s''(t)$.
4. **Geometric / Tangent Line**: Slope of tangent line $m = f'(x_0)$ and linear approximation $y - y_0 = m(x - x_0)$.
5. **Implicit Curves**: Bivariate relations $F(x, y) = 0$ isolating $\frac{dy}{dx} = -\frac{B(x, y)}{A(x, y)}$.

---

## 3. Scaffolding & Progressive Hint Coverage

All 14 concepts feature verified 5-Tier progressive hint generators where:
- **Tier 1 (Recognition)**: Concept name and variable decomposition.
- **Tier 2 (Direction)**: Strategy breakdown and identification of sub-goals.
- **Tier 3 (Formula)**: General differentiation theorem without substituted problem numbers.
- **Tier 4 (Setup)**: Substituted problem structure into theorem template.
- **Tier 5 (Guided Calculation)**: Intermediate arithmetic hints without dumping the raw solution.

> **Hint Leakage Invariant**: Verified across all 14 curriculum concepts in automated testing (`tests/unit/hint-leakage.test.ts`), Hints 1–4 leak 0% of the final canonical answer string.
