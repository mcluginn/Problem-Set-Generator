# Curriculum Coverage Gaps & Extraction Limitations

**Engineering Practice Engine — Master Curriculum Ingestion**  
**Document Revision**: 1.0.0  
**Date**: August 28, 2026  
**Status**: AUDIT OF GAPS, DISCREPANCIES & AMBIGUITIES  

---

## 1. Executive Summary

In strict compliance with the **No Hallucination Rule**, this document catalogs all formatting anomalies, template copy-paste artifacts, unstated prerequisites, and unexpanded topic boundaries discovered during the extraction of the six syllabus documents. Rather than inventing missing data, every gap is documented for transparency and human review.

---

## 2. Document-Specific Gaps & Anomalies

### 2.1 `Physics 2.docx` (`SYL-004`): Template Header Artifact
- **Observed Anomaly**: At the very beginning of the document (paragraphs `[P-0]` through `[P-2]`), the header reads:
  ```text
  [P-0] Differential Equation
  [P-1] Course Title
  [P-2] GEN 0107
  ```
- **Authoritative Resolution**: In the official course specification section (`[P-29]` through `[P-31]`), the document explicitly states:
  ```text
  [P-30] Course Code : GEN 0110/ 0110L
  [P-31] Course Title : Physics 2 for Engineers - Lec/ Lab
  ```
  The course outcomes, lesson outcomes, topics (Fluids, Thermal Expansion, Sound Waves, Electrostatics, Optics, Relativity), and laboratory activities confirm that the initial header is an unedited Word document template artifact from `GEN 0107`.
- **Classification**: `TEMPLATE_COPY_PASTE_ARTIFACT`
- **Action Taken**: Tagged in manifest with confidence note; body course definition (`GEN 0110/0110L`) adopted as authoritative.

### 2.2 `Calculus 1.docx` (`SYL-001`): Unstated Prerequisites
- **Observed Anomaly**: Line `[P-32] Prerequisite(s) :` is left blank in the source document.
- **Authoritative Resolution**: Recorded as `NOT STATED IN SOURCE` rather than assuming high school algebra or pre-calculus.
- **Classification**: `UNSTATED_METADATA`

### 2.3 `Calculus 1.docx` (`SYL-001`): Topic 1 Subtopics Not Enumerated
- **Observed Anomaly**: `Topic 1. Introduction to Calculus` contains no explicit sub-bullets in the Course Coverage table.
- **Authoritative Resolution**: Retained as a generic 3-hour orientation topic without inventing detailed subtopics.
- **Classification**: `UNEXPANDED_TOPIC`

### 2.4 `Differential Equations.docx` (`SYL-002`): Duplicated Final Assessment Topic Titles
- **Observed Anomaly**: In Table-35, Row 5, the topic name `Solution of Systems of Linear Differential Equation with Initial Values/Simultaneous Solution to DE (Laplace Transform Method)` appears twice in succession for 5 hours each.
- **Authoritative Resolution**: Preserved as two sequential topics (`CURR-GEN0107-U3-T09` and `CURR-GEN0107-U3-T10`) reflecting Part 1 (Single IVP transformations) and Part 2 (Coupled simultaneous systems) as supported by LLO 9 and LLO 10.
- **Classification**: `SEQUENTIAL_SPLIT_TOPIC`

### 2.5 `Physics 2.docx` (`SYL-004`): Typographical Errors in Source
- **Observed Anomaly**: Topic 7 is spelled `Eletrostartics` in Table-36, Row 3.
- **Authoritative Resolution**: Exact source spelling preserved in `officialName`, corrected in `normalizedName` (`Electrostatics`).
- **Classification**: `SOURCE_TYPO_NORMALIZATION`

### 2.6 `1Thermodynamics.docx` (`SYL-003`) & `Topics.docx` (`SYL-006`): Identical Library / Bibliography Section
- **Observed Anomaly**: The textbook references and EBSCOHOST citations in `1Thermodynamics.docx`, `Physics 2.docx`, `Calculus 1.docx`, and `Topics.docx` share nearly identical bibliographies (including identical paper DOIs regarding line integrals and functional differential equations).
- **Authoritative Resolution**: Document metadata and course descriptions are verified separately; shared library attestations are recognized as institutional boilerplate.
- **Classification**: `BOILERPLATE_REPETITION`

### 2.7 Cross-Syllabus Calculus 2 Prerequisites
- **Observed Anomaly**: Both `GEN 0107` (Differential Equations) and `GEN 0161` (Thermodynamics) list `Calculus 2` as a prerequisite, but `Calculus 2` is not among the six uploaded syllabus documents (only `Calculus 1` and `IE Special Topics 1` were uploaded).
- **Authoritative Resolution**: Noted as an external curriculum dependency.
- **Classification**: `EXTERNAL_PREREQUISITE_DEPENDENCY`
