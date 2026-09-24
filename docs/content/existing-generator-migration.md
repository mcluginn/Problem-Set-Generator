# Legacy Concept Generator to Phase 3 Content Architecture Migration

**Engineering Practice Engine — Generator Migration Bridge**  
**Document Revision**: 3.0.0  
**Phase**: PHASE 3 — ASSESSMENT EVIDENCE → PROBLEM FAMILIES → VERIFIED GENERATION  
**Date**: August 28, 2026  
**Status**: ACTIVE & AUTHORITATIVE  

---

## 1. Migration Policy

To maintain 100% backward compatibility with existing tests and student workflows:
1. **Zero Breaking Changes**: Legacy concept strings (`'Constant Rule'`, `'Power Rule'`, `'Chain Rule'`) remain fully functional in `src/engine/generation/generator.ts`.
2. **Dual-Stack Architecture**: The new skill-driven content architecture (`src/engine/content/`) operates alongside legacy generators, mapping legacy requests to authoritative Skill IDs and Problem Families.

---

## 2. Legacy-to-Phase-3 Generator Mapping Table

| Legacy Concept | Mapped Skill ID | Mapped Evidence Type | Phase 3 Problem Family | Phase 3 Problem Template | Migration Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **`Constant Rule`** | `SKILL-GEN0102-002` | `DIRECT_CALCULATION` | `FAM-GEN0102-POWER-STD` | `TMPL-POWER-POLY-STD` | **MIGRATED & BRIDGED** |
| **`Power Rule`** | `SKILL-GEN0102-002` | `DIRECT_CALCULATION` | `FAM-GEN0102-POWER-STD` | `TMPL-POWER-POLY-STD` | **MIGRATED & BRIDGED** |
| **`Sum Rule`** | `SKILL-GEN0102-002` | `DIRECT_CALCULATION` | `FAM-GEN0102-POWER-STD` | `TMPL-POWER-POLY-STD` | **MIGRATED & BRIDGED** |
| **`Difference Rule`** | `SKILL-GEN0102-002` | `DIRECT_CALCULATION` | `FAM-GEN0102-POWER-STD` | `TMPL-POWER-POLY-STD` | **MIGRATED & BRIDGED** |
| **`Product Rule`** | `SKILL-GEN0102-003` | `DIRECT_CALCULATION` | `FAM-GEN0102-PRODUCT-STD` | `TMPL-PRODUCT-POLY-TRIG` | **MIGRATED & BRIDGED** |
| **`Quotient Rule`** | `SKILL-GEN0102-004` | `DIRECT_CALCULATION` | `FAM-GEN0102-QUOTIENT-STD` | `TMPL-QUOTIENT-POLY-POLY` | **MIGRATED & BRIDGED** |
| **`Chain Rule`** | `SKILL-GEN0102-005` | `DIRECT_CALCULATION` | `FAM-GEN0102-CHAIN-POLY` | `TMPL-CHAIN-POLY-STD` | **MIGRATED & EXPANDED (VERTICAL SLICE)** |
| **`Trigonometric Functions`** | `SKILL-GEN0102-005` | `DIRECT_CALCULATION` | `FAM-GEN0102-CHAIN-TRIG` | `TMPL-CHAIN-TRIG-POLY` | **MIGRATED & BRIDGED** |
| **`Exponential Functions`** | `SKILL-GEN0102-008` | `DIRECT_CALCULATION` | `FAM-GEN0102-EXPLOG-STD` | `TMPL-EXPLOG-STD` | **MIGRATED & BRIDGED** |
| **`Logarithmic Functions`** | `SKILL-GEN0102-008` | `DIRECT_CALCULATION` | `FAM-GEN0102-EXPLOG-STD` | `TMPL-EXPLOG-STD` | **MIGRATED & BRIDGED** |
| **`Implicit Differentiation`**| `SKILL-GEN0102-009` | `DIRECT_CALCULATION` | `FAM-GEN0102-IMPLICIT-STD`| `TMPL-IMPLICIT-CONIC` | **MIGRATED & BRIDGED** |
| **`Higher Order Derivatives`**| `SKILL-GEN0102-011` | `DIRECT_CALCULATION` | `FAM-GEN0102-HIGHER-STD` | `TMPL-HIGHER-ORDER-POLY` | **MIGRATED & BRIDGED** |
| **`Tangent Line Slope`** | `SKILL-GEN0102-012` | `APPLICATION` | `FAM-GEN0102-TANGENT-APP` | `TMPL-TANGENT-LINE-STD` | **MIGRATED & BRIDGED** |
| **`Kinematics Application`** | `SKILL-GEN0102-005` | `APPLICATION` | `FAM-GEN0102-CHAIN-APP` | `TMPL-CHAIN-KINEMATICS-APP`| **MIGRATED & BRIDGED** |
