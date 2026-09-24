# Adaptive Next Best Problem Selection Engine
## Phase 6 Decision Policies & Explainability

### 1. Decision Priority Hierarchy

The `AdaptiveSelector` (`src/engine/adaptive/selector.ts`) selects the next best problem using a deterministic, multi-factor decision hierarchy:

1. **Hard Constraints**:
   - Explicit student selection / Teacher assignment / Exam mode lockdown.
2. **Targeted Misconception Remediation**:
   - If an active unresolved misconception is detected, routes to a problem family specifically designed to address that misconception.
3. **Prerequisite Remediation**:
   - If the student has repeated failures ($\ge 2$ attempts) on a target skill and its prerequisite skill is unmastered ($< 50\%$), recommends foundational prerequisite practice within course scope.
4. **Representation & Application Transfer**:
   - Once symbolic mastery reaches $\ge 70\%$, introduces `PHYSICAL` (word problems) or `GRAPHICAL` representations.
5. **Growth Area (Lowest Mastery with Prerequisites Met)**:
   - Identifies the lowest mastery skill ($< 75\%$) with met prerequisites, avoiding repeating recently practiced skills.
6. **Spaced Retrieval**:
   - Re-tests mastered skills ($\ge 75\%$) that have not been practiced recently.
7. **Curriculum Diversity / Default**:
   - Sequences through the foundational course curriculum.

---

### 2. Structured Decision Output

Every recommendation produces an explainable `AdaptiveDecision` object:

```ts
interface AdaptiveDecision {
  selectedProblem?: ValidatedProblem;
  selectedProblemId: string;
  courseId: string;
  targetSkillId: string;
  targetEvidenceType: AssessmentEvidenceTypeId;
  targetDifficulty: number;
  targetRepresentation: ContentRepresentationType;
  reason: 'USER_REQUEST' | 'REMEDIATION' | 'PREREQUISITE' | 'RETRIEVAL' | 'PROGRESSION' | 'TRANSFER' | 'DIVERSITY' | 'TEACHER_ASSIGNMENT';
  explanation: string;
  teacherExplanation?: string;
  supportingFactors: string[];
  confidence: number;
}
```
