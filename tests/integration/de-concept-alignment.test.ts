/**
 * Differential Equations (GEN 0107) Concept & Method Alignment Regression Suite
 *
 * Verifies that the engine rejects mathematically valid problems when they
 * are pedagogically misaligned with the intended concept, order, and solution method.
 */

import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '../../src/engine/content/generator';
import { ContentValidator } from '../../src/engine/content/validator';
import { ConceptAlignmentValidator } from '../../src/engine/content/conceptValidator';
import { conceptRegistry } from '../../src/engine/content/conceptRegistry';
import { curriculumRegistry } from '../../src/engine/curriculum/registry';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';
import { PracticeScope } from '../../src/engine/adaptive/types';
import { ValidatedProblem } from '../../src/engine/content/types';
import { PROBLEM_FAMILIES_REGISTRY } from '../../src/engine/content/problemFamilies';

describe('GEN 0107 Differential Equations Concept & Method Alignment Suite', () => {

  // =========================================================================
  // TEST 1 — Requested: First-Order Homogeneous Substitution y = vx
  // =========================================================================
  it("TEST 1: Requesting first-order homogeneous ODE (y = vx) strictly produces order 1 without y'' and aligns with substitution method", () => {
    // 1. Direct generation for skill
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: 'SKILL-GEN0107-004',
      conceptId: 'de_first_order_homogeneous_y_vx'
    });

    expect(res.success).toBe(true);
    expect(res.problem).toBeDefined();
    const problem = res.problem!;

    // Assert order = 1
    expect(problem.dna.order).toBe(1);
    expect(problem.dna.expectedMethod).toBe('SUBSTITUTION_Y_EQUALS_VX');
    expect(problem.dna.templateId).toBe('TMPL-GEN0107-HOMOGENEOUS-VX');

    // Assert no y'' or higher order derivatives
    const expr = problem.statement.expressionLatex;
    expect(expr).not.toContain("y''");
    expect(expr).not.toContain("y'''");
    expect(expr).not.toContain("\\frac{d^2y}{dx^2}");
    expect(expr).not.toContain("d^2y/dx^2");
    expect(expr).toContain("\\frac{dy}{dx}");

    // Assert method aligns with substitution y = vx
    const allHints = problem.hints.map(h => h.text).join(' ');
    expect(allHints).toMatch(/y\\s*=\\s*vx|substitution|homogeneous/i);
    expect(allHints).not.toMatch(/characteristic equation|auxiliary equation|r\\^2/i);

    // 2. Via AdaptiveSelector scope
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0107',
      topicId: 'CURR-GEN0107-U2-T04',
      skillId: 'SKILL-GEN0107-004',
      mode: 'SKILL_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_test1', scope);
    expect(decision.selectedProblem).toBeDefined();
    const selectedProblem = decision.selectedProblem!;
    expect(selectedProblem.dna.order).toBe(1);
    expect(selectedProblem.statement.expressionLatex).not.toContain("y''");
  });

  // =========================================================================
  // TEST 2 — Requested: Second-Order Linear Homogeneous Constant Coefficients
  // =========================================================================
  it('TEST 2: Requesting second-order linear homogeneous constant coefficients strictly produces order 2 with characteristic equation method', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: 'SKILL-GEN0107-004',
      subtopicId: 'SUB-GEN0107-U2-T04-S2',
      conceptId: 'de_second_order_linear_homogeneous_constant_coeff'
    });

    expect(res.success).toBe(true);
    expect(res.problem).toBeDefined();
    const problem = res.problem!;

    // Assert order = 2
    expect(problem.dna.order).toBe(2);
    expect(problem.dna.expectedMethod).toBe('CHARACTERISTIC_EQUATION');
    expect(problem.dna.templateId).toBe('TMPL-GEN0107-2ND-ORDER-HOMO');

    // Assert presence of second derivative and homogeneous RHS = 0
    const expr = problem.statement.expressionLatex;
    expect(expr).toContain("y''");
    expect(expr).toMatch(/=\s*0/);

    // Assert characteristic equation is used in trace and hints
    const allHints = problem.hints.map(h => h.text).join(' ');
    expect(allHints.toLowerCase()).toMatch(/characteristic|auxiliary|root/);
    expect(allHints).not.toContain("y = vx");
  });

  // =========================================================================
  // TEST 3 — Regression: Candidate y'' - 4y' + 4y = 0 MUST BE REJECTED for y = vx
  // =========================================================================
  it("TEST 3 (Regression): Mathematically valid candidate y'' - 4y' + 4y = 0 is strictly REJECTED when concept requires y = vx", () => {
    // Construct the exact candidate that previously leaked
    const candidateMisaligned: ValidatedProblem = {
      dna: {
        problemId: 'PROB-REGRESSION-MISALIGNED-001',
        courseId: 'COURSE-GEN0107',
        topicId: 'CURR-GEN0107-U2-T04',
        subtopicId: 'SUB-GEN0107-U2-T04-S1',
        primarySkillId: 'SKILL-GEN0107-004',
        supportingSkillIds: ['SKILL-GEN0101-006'],
        evidenceType: 'DIRECT_CALCULATION',
        familyId: 'FAM-GEN0107-2ND-ORDER-HOMO',
        templateId: 'TMPL-GEN0107-2ND-ORDER-HOMO',
        representationType: 'SYMBOLIC',
        contextType: 'PURE_MATHEMATICS',
        guidedness: 'STANDARD',
        difficultyVector: { overall: 3, conceptual: 3, procedural: 3, computational: 2, reasoning: 3, representation: 1, context: 1, multiStep: 3 },
        structureSignature: 'SIG-REGRESSION-HOMO-2ND',
        domainValidatorType: 'ODE',
        order: 2, // actual order of problem
        expectedMethod: 'CHARACTERISTIC_EQUATION',
        conceptId: 'de_second_order_linear_homogeneous_constant_coeff',
        curriculumVersion: '1.0.0',
        skillOntologyVersion: '2.5.0',
        generatorVersion: '4.0.0',
        templateVersion: '4.0.0',
        validatorVersion: '5.0.0'
      },
      statement: {
        promptText: 'Find the general solution to the second-order homogeneous differential equation:',
        expressionLatex: "y'' - 4y' + 4y = 0",
        targetVariable: 'y',
        independentVariable: 'x'
      },
      rawExpression: { type: 'CONSTANT', value: 1 } as any,
      solution: {
        canonicalAnswerLatex: 'y(x) = (C_{1} + C_{2}x)e^{2x}',
        canonicalAnswerRaw: '(C_1 + C_2 x)e^(2x)',
        reasoningTrace: [
          { stepIndex: 1, phase: 'RECOGNITION', actionDescription: 'Characteristic equation: r^2 - 4r + 4 = 0.', pedagogicalRationale: 'Auxiliary equation.' }
        ],
        solutionSteps: [],
        whyMethodRequired: 'Characteristic equation'
      },
      hints: [
        { level: 1, category: 'RECOGNITION', text: 'Write the auxiliary equation: r^2 - 4r + 4 = 0.', revealsFinalAnswer: false }
      ],
      qualityScore: { mathematicalValidity: 1, skillAlignment: 1, evidenceAlignment: 1, hintIntegrity: 1, overallQuality: 1 },
      lifecycleStatus: 'VALID',
      createdAt: new Date().toISOString()
    };

    // 1. Validate specifically against the first-order homogeneous concept
    const conceptCheck = ConceptAlignmentValidator.validate(
      candidateMisaligned,
      'de_first_order_homogeneous_y_vx',
      'SUBSTITUTION_Y_EQUALS_VX'
    );

    expect(conceptCheck.isValid).toBe(false);
    expect(conceptCheck.rejectionReason).toMatch(/CONCEPT_MISMATCH|METHOD_MISMATCH/);
    expect(conceptCheck.rejectionDetails).toContain('strictly requires a 1st-order differential equation');

    // 2. Validate through master ContentValidator pipeline
    // Mutate DNA to simulate an engine attempting to serve this under SKILL-GEN0107-004
    const simulatedLeakedCandidate: ValidatedProblem = {
      ...candidateMisaligned,
      dna: {
        ...candidateMisaligned.dna,
        conceptId: 'de_first_order_homogeneous_y_vx',
        order: 1,
        expectedMethod: 'SUBSTITUTION_Y_EQUALS_VX'
      }
    };

    const fullReport = ContentValidator.validateProblemCandidate(simulatedLeakedCandidate);
    expect(fullReport.isValid).toBe(false);
    expect(fullReport.rejectionReason).toMatch(/CONCEPT_MISMATCH|METHOD_MISMATCH/);
  });

  // =========================================================================
  // TEST 4 — Solution & Hint Trace Method Alignment
  // =========================================================================
  it('TEST 4: Progressive hints and solution traces strictly teach the pedagogical method of their respective concept', () => {
    // A. For y = vx concept
    const resVx = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: 'SKILL-GEN0107-004',
      conceptId: 'de_first_order_homogeneous_y_vx',
      difficulty: 1
    });
    expect(resVx.success).toBe(true);
    const probVx = resVx.problem!;

    const vxHints = probVx.hints.map(h => h.text).join(' ');
    expect(vxHints).toContain('y = vx');
    expect(vxHints).toContain('v(x)');
    expect(vxHints).not.toContain('r^2');

    const vxTrace = probVx.solution.reasoningTrace.map(t => t.actionDescription).join(' ');
    expect(vxTrace).toContain('substitution y = vx');
    expect(vxTrace).toContain('Back-substitute v = y/x');

    // B. For characteristic equation concept
    const resChar = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: 'SKILL-GEN0107-004',
      subtopicId: 'SUB-GEN0107-U2-T04-S2',
      conceptId: 'de_second_order_linear_homogeneous_constant_coeff',
      difficulty: 1
    });
    expect(resChar.success).toBe(true);
    const probChar = resChar.problem!;

    const charHints = probChar.hints.map(h => h.text).join(' ');
    expect(charHints.toLowerCase()).toMatch(/characteristic|auxiliary|root/);
    expect(charHints).not.toContain('y = vx');

    const charTrace = probChar.solution.reasoningTrace.map(t => t.actionDescription).join(' ');
    expect(charTrace.toLowerCase()).toMatch(/characteristic|auxiliary|roots/);
    expect(charTrace).not.toContain('y = vx');
  });

  // =========================================================================
  // TEST 5 — Full GEN 0107 Curriculum Integrity Across Course -> Unit -> Topic -> Concept -> Method -> Generator
  // =========================================================================
  it('TEST 5: Full GEN 0107 curriculum integrity from Course to Unit to Topic to Concept to Objective to Method to Generator', () => {
    const courseId = 'COURSE-GEN0107';
    const topics = curriculumRegistry.getTopicsByCourse(courseId);
    expect(topics.length).toBe(11);

    const skills = curriculumRegistry.getSkillsByCourse(courseId);
    expect(skills.length).toBe(11);

    for (const skill of skills) {
      // 1. Each skill has an authoritative concept in ConceptRegistry
      const concept = conceptRegistry.getConceptForSkill(skill.id);
      expect(concept).toBeDefined();
      expect(concept!.courseId).toBe(courseId);
      expect(concept!.topicId).toBe(skill.parentTopicId);
      expect(concept!.primaryMethod).toBeDefined();

      // 2. For skills with implemented families, generation succeeds
      const hasFamily = Object.values(PROBLEM_FAMILIES_REGISTRY).some(f => f.primarySkillId === skill.id);
      if (hasFamily) {
        const res = ContentGenerator.generateForSkill({
          courseId: 'COURSE-GEN0107',
          skillId: skill.id
        });

        expect(res.success).toBe(true);
        expect(res.problem).toBeDefined();
        const problem = res.problem!;

        // 3. Problem DNA matches skill and concept invariants
        expect(problem.dna.courseId).toBe(courseId);
        expect(problem.dna.topicId).toBe(skill.parentTopicId);
        expect(problem.dna.primarySkillId).toBe(skill.id);

        // 4. Problem candidate passes full multi-stage validation
        const validation = ContentValidator.validateProblemCandidate(problem);
        expect(validation.isValid).toBe(true);
      }
    }
  });

  // =========================================================================
  // ADDITIONAL: "Another Like This" preserves the exact concept and method
  // =========================================================================
  it('verifies "Another Like This" preserves the exact concept and method while varying the problem structure', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0107',
      topicId: 'CURR-GEN0107-U2-T04',
      skillId: 'SKILL-GEN0107-004',
      mode: 'SKILL_PRACTICE'
    };

    const seenSignatures = new Set<string>();

    for (let i = 0; i < 3; i++) {
      const decision = AdaptiveSelector.selectNextBestProblem(
        `student_another_${i}`,
        { ...scope, excludeSignatures: Array.from(seenSignatures) },
        Array.from(seenSignatures).map(s => ({ skillId: 'SKILL-GEN0107-004', problemId: s }))
      );

      expect(decision.selectedProblem).toBeDefined();
      const prob = decision.selectedProblem!;

      // Every single repetition must stay on 1st order y = vx
      expect(prob.dna.order).toBe(1);
      expect(prob.dna.expectedMethod).toBe('SUBSTITUTION_Y_EQUALS_VX');
      expect(prob.statement.expressionLatex).not.toContain("y''");
      expect(prob.statement.expressionLatex).toContain("\\frac{dy}{dx}");

      seenSignatures.add(prob.dna.structureSignature);
    }
  });
});
