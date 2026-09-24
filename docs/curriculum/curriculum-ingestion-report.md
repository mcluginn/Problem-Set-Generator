# Master Curriculum Ingestion & Authoritative Course Coverage Report

**Engineering Practice Engine**  
**Document Revision**: 1.0.0  
**Date**: August 28, 2026  
**Execution Directive**: MASTER CURRICULUM INGESTION: SIX SYLLABI → AUTHORITATIVE COURSE COVERAGE DATABASE  
**Status**: COMPLETE, VERIFIED & PRODUCTION READY  

---

## 1. Executive Summary

This report documents the ingestion, extraction, normalization, and validation of the **six official course syllabus documents** uploaded to the Engineering Practice Engine workspace.

In strict adherence to the **No Hallucination Rule** and foundational curriculum design principles:
- **No practice questions were generated.**
- **No unstated topics or subtopics were invented.**
- **No generic textbook outlines replaced official syllabus content.**
- Every curriculum node in the database is directly traceable back to its source document, table, row, and text excerpt.

---

## 2. Files Found and Processed (6 / 6 Syllabi)

| Syllabus ID | Filename | Course Code | Official Course Title | Credit Units | Academic Year & Term | Status |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| **SYL-001** | `Calculus 1.docx` | `GEN 0102` | `Calculus 1` | 3.0 | First Semester, AY 2025–2026 | **COMPLETE** |
| **SYL-002** | `Differential Equations.docx` | `GEN 0107` | `Differential Equations` | 3.0 | First Semester, AY 2026–2027 | **COMPLETE** |
| **SYL-003** | `1Thermodynamics.docx` | `GEN 0161` | `Thermodynamics` *(Thermodynamics 1)* | 3.0 (Lec) | First Semester, AY 2026–2027 | **COMPLETE** |
| **SYL-004** | `Physics 2.docx` | `GEN 0110/ 0110L` | `Physics 2 for Engineers -  Lec/ Lab` | 3.0 | First Semester, AY 2026–2027 | **COMPLETE** |
| **SYL-005** | `GE_SYL_GEN0101_20260720 (2) - Copy.docx` | `GEN 0101` | `MATHEMATICS FOR ENGINEERS` | 3.0 | First Semester, AY 2025–2026 | **COMPLETE** |
| **SYL-006** | `Topics.docx` | `BSIE 3219` | `IE Special Topics 1` | 3.0 (Lec) | First Semester, AY 2026–2027 | **COMPLETE** |

---

## 3. Curriculum Extraction Statistics

- **Total Ingested Syllabi**: `6`
- **Total Authoritative Courses**: `6`
- **Total Curriculum Units**: `18` (Exactly 3 units / assessment periods per course: Prelim, Midterm, Final)
- **Total Authoritative Topics**: `67`
- **Total Documented Subtopic Nodes**: `181`
- **Total Documented Contact Hours**: `269` hours
- **Courses with Explicit Unit Structure**: `6 / 6` (100%)
- **Courses with Weekly/Periodic Sequencing**: `6 / 6` (100%)

### Course-by-Course Depth Summary

| Course Code | Title | Units | Topics | Subtopics | Contact Hours |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **GEN 0101** | Mathematics for Engineers | 3 | 16 | 45 | 45 hrs |
| **GEN 0102** | Calculus 1 | 3 | 13 | 31 | 45 hrs |
| **GEN 0107** | Differential Equations | 3 | 11 | 24 | 45 hrs |
| **GEN 0110** | Physics 2 for Engineers | 3 | 10 | 27 | 44 hrs |
| **GEN 0161** | Thermodynamics | 3 | 8 | 17 | 45 hrs |
| **BSIE 3219** | IE Special Topics 1 | 3 | 9 | 37 | 45 hrs |
| **TOTALS** | **6 Courses** | **18** | **67** | **181** | **269 hrs** |

---

## 4. Cross-Syllabus Reconciliation & Topic Dictionary

Fourteen canonical cross-course conceptual mappings were identified and recorded in [`docs/curriculum/topic-dictionary.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/topic-dictionary.md):

1. **`TOP-DICT-001`**: Limits of Functions & Continuity (`RELATED` — GEN 0102 vs BSIE 3219)
2. **`TOP-DICT-002`**: Differentiation Rules (`NORMALIZED_MATCH` — GEN 0102 vs BSIE 3219)
3. **`TOP-DICT-003`**: Implicit Differentiation (`PREREQUISITE` — GEN 0102 slope tool $\rightarrow$ GEN 0107 constant elimination)
4. **`TOP-DICT-004`**: Partial Differentiation (`NORMALIZED_MATCH` — GEN 0102, GEN 0107 exactness test, BSIE 3219)
5. **`TOP-DICT-005`**: Maxima, Minima & Optimization (`EXACT_MATCH` — GEN 0102 vs BSIE 3219)
6. **`TOP-DICT-006`**: Related Rates / Time Rates (`EXACT_MATCH` — GEN 0102 vs BSIE 3219)
7. **`TOP-DICT-007`**: Logarithmic & Exponential Modeling (`RELATED` — Algebraic $\rightarrow$ Differential $\rightarrow$ ODE progression across GEN 0101, GEN 0102, GEN 0107, BSIE 3219)
8. **`TOP-DICT-008`**: Applied Algebraic Word Problems (`EXACT_MATCH` — GEN 0101 vs BSIE 3219)
9. **`TOP-DICT-009`**: Rectangular Coordinates & Lines (`EXACT_MATCH` — GEN 0101 vs BSIE 3219)
10. **`TOP-DICT-010`**: Analytic Geometry & Conics (`EXACT_MATCH` — GEN 0101 vs BSIE 3219)
11. **`TOP-DICT-011`**: Trigonometry & Oblique Triangles (`EXACT_MATCH` — GEN 0101 vs BSIE 3219)
12. **`TOP-DICT-012`**: Plane Areas & Mensuration (`EXACT_MATCH` — GEN 0101 vs BSIE 3219)
13. **`TOP-DICT-013`**: Heat Transfer vs Thermodynamics (`DO_NOT_MERGE` — Physics empirical mechanisms kept distinct from macroscopic control-volume steam table thermodynamics)
14. **`TOP-DICT-014`**: Integral Calculus & Solid Volumes (`COURSE_SPECIFIC` — BSIE 3219 licensure module)

---

## 5. Reconciliation with Existing Differential Calculus Implementation

As documented in [`docs/curriculum/existing-vs-syllabus.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/existing-vs-syllabus.md):
- All **14 existing concept generators** in the v1.0.0 application are directly supported by `GEN 0102: Calculus 1` (`Topic 4`, `Topic 7`, `Topic 8`, `Topic 10`, `Topic 11`, `Topic 13`).
- Zero existing concepts are extraneous or invalid.
- Additional syllabus topics in `GEN 0102` (Limits, Inverse Trig, Hyperbolic, Partials, Polynomial Curves, Advanced Optimization) are catalogued as roadmap milestones for future expansion without modifying the existing stable core.

---

## 6. Verification and Test Results

### 1. Automated Vitest Suite
- **Test File**: `tests/unit/curriculum-registry.test.ts` (11 / 11 tests passing)
- **Full Repository Suite**: **31 / 31 test files passing, 399 / 399 total tests passing cleanly**.
- Verified invariants:
  - 100% unique ID constraints across all 6 courses, 18 units, 67 topics, 181 subtopics.
  - 0 orphan topics or units.
  - 100% source traceability coverage.
  - Parent-child referential validity.

### 2. Next.js Production Build
- `npm run build`: Compiled with **0 errors (Exit Code 0)**.
- Developer / Teacher inspection interface accessible at `/curriculum` and embedded in Teacher Review Mode.

---

## 7. Output Artifacts Generated

1. [`docs/curriculum/syllabus-manifest.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/syllabus-manifest.md): Complete manifest of the 6 syllabi.
2. [`docs/curriculum/course-coverage-master.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/course-coverage-master.md): Full hierarchical breakdown with exact source excerpts.
3. [`docs/curriculum/course-coverage-matrix.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/course-coverage-matrix.md): Master tabular matrix across all 6 courses.
4. [`docs/curriculum/topic-dictionary.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/topic-dictionary.md): Canonical cross-syllabus topic dictionary.
5. [`docs/curriculum/coverage-gaps.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/coverage-gaps.md): Audit of source gaps, typos, and template discrepancies.
6. [`docs/curriculum/review-queue.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/review-queue.md): Human decision queue.
7. [`docs/curriculum/existing-vs-syllabus.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/existing-vs-syllabus.md): Line-by-line reconciliation with current app.
8. [`docs/curriculum/curriculum-schema.md`](file:///c:/Users/My%20PC/Documents/Problem%20Set/docs/curriculum/curriculum-schema.md): Data schema and relational DDL.
9. [`src/engine/curriculum/`](file:///c:/Users/My%20PC/Documents/Problem%20Set/src/engine/curriculum): Programmatic TypeScript registry (`types.ts`, `manifest.ts`, `courses.ts`, `coverage.ts`, `topicDictionary.ts`, `registry.ts`, `index.ts`).
10. [`src/app/curriculum/page.tsx`](file:///c:/Users/My%20PC/Documents/Problem%20Set/src/app/curriculum/page.tsx) & [`src/components/curriculum/CurriculumBrowser.tsx`](file:///c:/Users/My%20PC/Documents/Problem%20Set/src/components/curriculum/CurriculumBrowser.tsx): Interactive curriculum explorer.
