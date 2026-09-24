import { describe, it, expect } from 'vitest';
import { DomainValidatorRegistry } from '../../src/engine/content/domainValidators';
import { ContentValidator } from '../../src/engine/content/validator';
import { ContentGenerator } from '../../src/engine/content/generator';

describe('Cross-Domain Validator Isolation & Specialized Error Boundary Tests', () => {
  it('correctly maps each domain validator type without interference', () => {
    // Pure Math problem should not fail Physics unit checks
    const mathProblem: any = {
      rawExpression: { type: 'CONSTANT', value: 42 },
      statement: {
        promptText: 'Evaluate the algebraic expression:',
        expressionLatex: '3x + 5',
        targetVariable: 'x'
      },
      solution: { canonicalAnswerLatex: '42' },
      hints: [{ level: 1, text: 'hint' }],
      dna: { domainValidatorType: 'PURE_MATH' }
    };

    const mathResult = DomainValidatorRegistry.validateMath(mathProblem);
    expect(mathResult.valid).toBe(true);
    expect(mathResult.status).toBe('PASS');

    // Physics problem without units fails physics validator but passes pure math if checked as math
    const physProblemNoUnits: any = {
      rawExpression: { type: 'CONSTANT', value: 10 },
      statement: {
        promptText: 'Calculate the velocity of a particle:',
        expressionLatex: 'v = 10',
        targetVariable: 'v'
      },
      solution: { canonicalAnswerLatex: '10' },
      hints: [],
      dna: { domainValidatorType: 'PHYSICS_UNITS' }
    };

    const physResult = DomainValidatorRegistry.validatePhysics(physProblemNoUnits);
    expect(physResult.valid).toBe(false);
    expect(physResult.status).toBe('FAIL');
    expect(physResult.errors.some(e => e.code === 'MISSING_PHYSICAL_UNITS')).toBe(true);
  });

  it('verifies ContentValidator delegates cleanly according to problem DNA validator type', () => {
    const thermoGen = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0161',
      skillId: 'SKILL-GEN0161-002',
      familyId: 'FAM-GEN0161-1ST-LAW-CLOSED',
      evidenceType: 'DIRECT_CALCULATION'
    });

    expect(thermoGen.success).toBe(true);
    if (thermoGen.problem) {
      expect(thermoGen.problem.dna.domainValidatorType).toBe('THERMODYNAMICS');
      const rep = ContentValidator.validateProblemCandidate(thermoGen.problem);
      expect(rep.domainValidation?.domainValidatorType).toBe('THERMODYNAMICS');
      expect(rep.domainValidation?.valid).toBe(true);
    }
  });
});
