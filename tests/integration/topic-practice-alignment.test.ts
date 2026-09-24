import { describe, it, expect } from 'vitest';
import { curriculumRegistry } from '../../src/engine/curriculum/registry';
import { AdaptiveSelector } from '../../src/engine/adaptive/selector';
import { PracticeScope } from '../../src/engine/adaptive/types';
import { ContentGenerator } from '../../src/engine/content/generator';

describe('Topic Practice Strict Content & Pedagogical Alignment Test Suite', () => {
  it('guarantees GEN 0107 Topic 6 (Linear Differential Equation of Order One) serves 1st-order integrating factor problems, never 2nd-order ODEs', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0107',
      topicId: 'CURR-GEN0107-U2-T06',
      mode: 'TOPIC_PRACTICE'
    };

    for (let i = 0; i < 5; i++) {
      const decision = AdaptiveSelector.selectNextBestProblem(`student_linear_ode_${i}`, scope);
      expect(decision.selectedProblem).toBeDefined();
      const problem = decision.selectedProblem!;

      expect(problem.dna.courseId).toBe('COURSE-GEN0107');
      expect(problem.dna.primarySkillId).toBe('SKILL-GEN0107-006');
      expect(problem.dna.templateId).toBe('TMPL-GEN0107-LINEAR-1ST-IF');

      const statement = problem.statement.expressionLatex || problem.statement.promptText;
      expect(statement).not.toContain("y''");
      expect(statement).not.toContain("second-order");
      expect(statement).toContain("\\frac{dy}{dx}");
    }
  });

  it('guarantees GEN 0107 Topic 4 (Homogeneous 1st-Order Substitution y=vx) serves 1st-order homogeneous ODEs', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0107',
      topicId: 'CURR-GEN0107-U2-T04',
      skillId: 'SKILL-GEN0107-004',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_homo_ode', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-GEN0107');
    expect(problem.dna.primarySkillId).toBe('SKILL-GEN0107-004');
    expect(problem.dna.templateId).toBe('TMPL-GEN0107-HOMOGENEOUS-VX');
    expect(problem.statement.expressionLatex).not.toContain("y''");
    expect(problem.statement.expressionLatex).toContain("\\frac{dy}{dx}");
    expect(problem.hints.some(h => h.text.includes('y = vx') || h.text.includes('homogeneous'))).toBe(true);
  });

  it('guarantees GEN 0107 Topic 4 Subtopic 2 serves 2nd-order homogeneous constant-coefficient ODEs', () => {
    const genResult = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: 'SKILL-GEN0107-004',
      subtopicId: 'SUB-GEN0107-U2-T04-S2',
      conceptId: 'de_second_order_linear_homogeneous_constant_coeff'
    });

    expect(genResult.success).toBe(true);
    expect(genResult.problem).toBeDefined();
    const problem = genResult.problem!;

    expect(problem.dna.templateId).toBe('TMPL-GEN0107-2ND-ORDER-HOMO');
    expect(problem.statement.expressionLatex).toContain("y''");
    expect(problem.hints.some(h => h.text.toLowerCase().includes('characteristic') || h.text.toLowerCase().includes('auxiliary'))).toBe(true);
  });

  it('guarantees GEN 0107 Topic 3 (Variable Separable) serves separation of variables ODEs', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0107',
      topicId: 'CURR-GEN0107-U1-T03',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_separable_ode', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-GEN0107');
    expect(problem.dna.primarySkillId).toBe('SKILL-GEN0107-003');
    expect(problem.dna.templateId).toBe('TMPL-GEN0107-SEPARABLE-STD');
  });

  it('guarantees GEN 0110 Topic 2 (Heat Transfer) serves heat conduction problems, not acoustic Doppler shift', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0110',
      topicId: 'CURR-GEN0110-U1-T02',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_heat', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-GEN0110');
    expect(problem.dna.primarySkillId).toBe('SKILL-GEN0110-002');
    expect(problem.dna.templateId === 'TMPL-GEN0110-HEAT-CONDUCTION' || problem.source === 'MASTER_BANK_780').toBe(true);
  });

  it('guarantees GEN 0110 Topic 8 (Electricity) serves DC circuit analysis problems', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0110',
      topicId: 'CURR-GEN0110-U3-T08',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_circuits', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-GEN0110');
    expect(problem.dna.primarySkillId).toBe('SKILL-GEN0110-008');
    expect(problem.dna.templateId === 'TMPL-GEN0110-DC-CIRCUITS-OHM' || problem.source === 'MASTER_BANK_780').toBe(true);
  });

  it('guarantees GEN 0161 Topic 3 (First Law of Thermodynamics) serves First Law closed system problems', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0161',
      topicId: 'CURR-GEN0161-U1-T03',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_thermo_first_law', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-GEN0161');
    expect(problem.dna.primarySkillId).toBe('SKILL-GEN0161-002');
    expect(problem.dna.templateId === 'TMPL-GEN0161-1ST-LAW-CLOSED' || problem.source === 'MASTER_BANK_780').toBe(true);
  });

  it('guarantees BSIE 3219 Topic 7 (Introductory Engineering Economy) serves in-scope Topic 7 problems', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-BSIE3219',
      topicId: 'CURR-BSIE3219-U3-T07',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_ie_topic', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-BSIE3219');
    expect(['SKILL-BSIE3219-005', 'SKILL-BSIE3219-006']).toContain(problem.dna.primarySkillId);
  });

  it('guarantees BSIE 3219 Skill 6 (Interest Rates) generates compound interest problems', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-BSIE3219',
      topicId: 'CURR-BSIE3219-U3-T07',
      skillId: 'SKILL-BSIE3219-006',
      mode: 'SKILL_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_ie_interest', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-BSIE3219');
    expect(problem.dna.primarySkillId).toBe('SKILL-BSIE3219-006');
    expect(problem.dna.templateId === 'TMPL-BSIE3219-COMPOUND-INTEREST' || problem.source === 'MASTER_BANK_780').toBe(true);
  });

  it('guarantees GEN 0101 Topic 7 (Quadratic Equations) serves quadratic equation factoring problems', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0101',
      topicId: 'CURR-GEN0101-U2-T07',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_quadratics', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-GEN0101');
    expect(problem.dna.primarySkillId).toBe('SKILL-GEN0101-008');
    expect(problem.dna.templateId === 'TMPL-GEN0101-QUADRATIC-ROOTS' || problem.source === 'MASTER_BANK_780').toBe(true);
  });

  it('guarantees GEN 0102 Topic 8 (Implicit Differentiation) serves implicit differentiation problems', () => {
    const scope: PracticeScope = {
      courseId: 'COURSE-GEN0102',
      topicId: 'CURR-GEN0102-U2-T08',
      mode: 'TOPIC_PRACTICE'
    };

    const decision = AdaptiveSelector.selectNextBestProblem('student_implicit', scope);
    expect(decision.selectedProblem).toBeDefined();
    const problem = decision.selectedProblem!;

    expect(problem.dna.courseId).toBe('COURSE-GEN0102');
    expect(problem.dna.primarySkillId).toBe('SKILL-GEN0102-009');
    expect(problem.dna.templateId === 'TMPL-GEN0102-IMPLICIT-DIFF' || problem.source === 'MASTER_BANK_780').toBe(true);
  });
});
