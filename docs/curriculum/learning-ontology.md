# Learning Ontology Technical Specification

**Engineering Practice Engine — Learning Capability Architecture**  
**Document Revision**: 1.0.0  
**Phase**: PHASE 2 — CURRICULUM SKILL MAPPING & LEARNING ONTOLOGY  
**Date**: August 28, 2026  
**Status**: APPROVED & ACTIVE  

---

## 1. Fundamental Principle & Architectural Separation

The Engineering Practice Engine explicitly separates three core layers:

```text
1. COURSE COVERAGE (What is officially taught in the syllabus)
       ↓
2. LEARNING ONTOLOGY (What the student is expected to KNOW, RECOGNIZE, DO, APPLY, MODEL, and EXPLAIN)
       ↓
3. PROBLEM ENGINE (What specific problem instances, templates, and representations assess that ability)
```

The Learning Ontology acts as the foundational semantic bridge between institutional course syllabi and future adaptive learning systems, deterministic solution engines, misconception diagnostics, and AI tutoring services.

---

## 2. Absolute No-Hallucination Rule & Skill Source Classifications

To ensure academic authenticity, every learning skill is classified into one of three strict source categories:

| Source Classification | Definition | Example |
| :--- | :--- | :--- |
| **`SYLLABUS_EXPLICIT`** | Literally and explicitly stated in the course syllabus table, topics, or course learning outcomes. | *Solve first-order differential equations using separation of variables* (`GEN 0107`). |
| **`SYLLABUS_DERIVED`** | Necessary instructional and pedagogical decomposition of an explicitly named syllabus topic. | *Apply the Power Rule to differentiate polynomial, radical, and rational power functions* (`GEN 0102`). |
| **`SYSTEM_PROPOSED`** | Recommended pedagogical extension identified by the software system to bridge foundational gaps, explicitly marked as outside direct syllabus assertion. | *Explain conceptual justification for method selection*. |

---

## 3. Skill Types Taxonomy

The ontology supports 11 standardized skill types to prevent calculation-only bias:

1. **`RECALL`**: Direct retrieval of fundamental definitions, constants, and standard formula forms.
2. **`RECOGNITION`**: Identifying structure, system boundaries, ODE orders, and function types before computation.
3. **`INTERPRETATION`**: Reading graphical curves, reading thermodynamic steam tables, and interpreting physical signs.
4. **`PROCEDURAL`**: Step-by-step symbolic algebraic and calculus execution (e.g. Chain Rule, separation of variables).
5. **`CALCULATION`**: Exact arithmetic and numerical evaluation of physical/mathematical equations.
6. **`REASONING`**: Logical inference, critical point classification, and Second Law feasibility checks.
7. **`APPLICATION`**: Transferring mathematical techniques to physical scenarios (e.g. tangent lines, related rates).
8. **`MODELING`**: Formulating governing equations from word problems, geometry, or conservation laws.
9. **`ERROR_ANALYSIS`**: Diagnosing missing derivative factors, incorrect signs, or invalid algebraic steps.
10. **`COMMUNICATION`**: Explaining why a method applies and interpreting engineering results in context.
11. **`METHOD_RECOGNITION`**: Determining which engineering or calculus theorem applies to a given scenario.

---

## 4. Assessment Evidence Modalities

Each skill declares the evidence modalities it supports, which will later guide the problem generator:

* `DIRECT_CALCULATION`: Direct numerical or symbolic computation.
* `SYMBOLIC_DERIVATION`: Multi-step algebraic/calculus transformation.
* `WORD_PROBLEM`: Applied scenario requiring variable definition and equation formulation.
* `MCQ_RECOGNITION`: Conceptual discrimination and classification.
* `ERROR_ANALYSIS`: Identifying perturbations and misconceptions in student work.
* `EXPLANATION`: Qualitative reasoning and method justification.
* `INTERPRETATION`: Table lookup, phase identification, or diagram reading.
* `MULTI_STEP_SOLUTION`: Comprehensive multi-stage engineering workflow.
* `GRAPHICAL_ANALYSIS`: Curve sketching, sign charts, P-v and T-s cycle diagrams.

---

## 5. Prerequisite Relationship Model

Prerequisite relationships between skills form a **Strictly Acyclic Directed Acyclic Graph (DAG)** verified by graph cycle detection algorithms.

Each prerequisite edge stores:
* `sourceSkillId`: Required prior competency.
* `targetSkillId`: Downstream dependent competency.
* `strength`: `REQUIRED` (hard blocker) vs `RECOMMENDED` (pedagogical benefit).
* `evidence`: `EXPLICIT` (syllabus sequencing) vs `STRONGLY_INFERRED` (mathematical dependency).
* `notes`: Instructional rationale.

---

## 6. Multi-Course Summary Statistics

```text
Total Authoritative Courses  : 6
Total Syllabus Topics        : 67
Total Documented Subtopics   : 181
Total Defined Learning Skills: 71
Total Prerequisite DAG Edges : 64
Total Cross-Course Mappings  : 14 Canonical Dictionaries
Graph Cycle Detection Result : 0 Cycles (100% Valid DAG)
```
