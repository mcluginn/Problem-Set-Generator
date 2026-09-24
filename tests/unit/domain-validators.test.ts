/**
 * Domain-Specific Validators Unit Test Suite
 * Engineering Practice Engine — Phase 4 Six-Course Content Architecture
 */

import { describe, it, expect } from 'vitest';
import { DomainValidatorRegistry } from '@/engine/content/domainValidators';
import { ContentGenerator } from '@/engine/content/generator';

describe('Domain-Specific Validators (Phase 4)', () => {
  it('validates Math & Calculus domain problems', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0102',
      skillId: 'SKILL-GEN0102-005',
      familyId: 'FAM-GEN0102-CHAIN-POLY',
      difficulty: 2
    });

    expect(res.success).toBe(true);
    const domainVal = DomainValidatorRegistry.validate(res.problem!);
    expect(domainVal.isValid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('MATH');
  });

  it('validates Differential Equations ODE problems and catches missing differential terms', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0107',
      skillId: 'SKILL-GEN0107-001',
      familyId: 'FAM-GEN0107-CLASSIFY-ORDER',
      difficulty: 1
    });

    expect(res.success).toBe(true);
    const domainVal = DomainValidatorRegistry.validate(res.problem!);
    expect(domainVal.isValid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('ODE');

    // Tampered ODE without differential notation
    const tampered = {
      ...res.problem!,
      statement: {
        ...res.problem!.statement,
        expressionLatex: '3x + 5 = 10'
      }
    };
    const tamperedVal = DomainValidatorRegistry.validateODE(tampered);
    expect(tamperedVal.isValid).toBe(false);
    expect(tamperedVal.rejectionReason).toBe('INVALID_SYNTAX');
  });

  it('validates Physics 2 problems and rejects negative resistance in linear DC circuits', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0110',
      skillId: 'SKILL-GEN0110-008',
      familyId: 'FAM-GEN0110-DC-CIRCUITS-OHM',
      difficulty: 2
    });

    expect(res.success).toBe(true);
    const domainVal = DomainValidatorRegistry.validate(res.problem!);
    expect(domainVal.isValid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('PHYSICS');

    // Tampered with negative resistance
    const tampered = {
      ...res.problem!,
      statement: {
        ...res.problem!.statement,
        promptText: 'A DC circuit contains a resistance of -10 ohms. Compute current.'
      }
    };
    const tamperedVal = DomainValidatorRegistry.validatePhysics(tampered);
    expect(tamperedVal.isValid).toBe(false);
    expect(tamperedVal.rejectionReason).toBe('PHYSICAL_IMPLAUSIBILITY');
  });

  it('validates Thermodynamics problems and rejects negative Kelvin absolute temperature', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0161',
      skillId: 'SKILL-GEN0161-005',
      familyId: 'FAM-GEN0161-STATE-PROPERTY-TABLE',
      difficulty: 2
    });

    expect(res.success).toBe(true);
    const domainVal = DomainValidatorRegistry.validate(res.problem!);
    expect(domainVal.isValid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('THERMODYNAMICS');

    // Tampered with negative absolute temperature
    const tampered = {
      ...res.problem!,
      statement: {
        ...res.problem!.statement,
        promptText: 'Water at pressure 100 kPa and temperature -50 K. Determine phase.'
      }
    };
    const tamperedVal = DomainValidatorRegistry.validateThermodynamics(tampered);
    expect(tamperedVal.isValid).toBe(false);
    expect(tamperedVal.rejectionReason).toBe('THERMODYNAMIC_INCONSISTENCY');
  });

  it('validates IE Special Topics problems and rejects negative asset lifespan', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-BSIE3219',
      skillId: 'SKILL-BSIE3219-006',
      familyId: 'FAM-BSIE3219-COMPOUND-INTEREST',
      difficulty: 2
    });

    expect(res.success).toBe(true);
    const domainVal = DomainValidatorRegistry.validate(res.problem!);
    expect(domainVal.isValid).toBe(true);
    expect(domainVal.domainValidatorType).toBe('IE_SPECIAL_TOPICS');

    // Tampered with negative years
    const tampered = {
      ...res.problem!,
      statement: {
        ...res.problem!.statement,
        promptText: 'Investment of $5000 compounded over -5 years. Calculate worth.'
      }
    };
    const tamperedVal = DomainValidatorRegistry.validateIESpecialTopics(tampered);
    expect(tamperedVal.isValid).toBe(false);
    expect(tamperedVal.rejectionReason).toBe('PHYSICAL_IMPLAUSIBILITY');
  });
});
