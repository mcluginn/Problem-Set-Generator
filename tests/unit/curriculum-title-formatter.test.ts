import { describe, it, expect } from 'vitest';
import {
  formatCurriculumTitle,
  stripLeadingSequenceNumber,
  formatUnitPeriodName
} from '@/components/dashboard/CurriculumTitleFormatter';

describe('CurriculumTitleFormatter', () => {
  it('strips leading sequence numbers correctly', () => {
    expect(stripLeadingSequenceNumber('01. Introduction')).toBe('Introduction');
    expect(stripLeadingSequenceNumber('1. Limits')).toBe('Limits');
    expect(stripLeadingSequenceNumber('12) Integration')).toBe('Integration');
    expect(stripLeadingSequenceNumber('No number')).toBe('No number');
    expect(stripLeadingSequenceNumber('')).toBe('');
  });

  it('maps unit sequence and assessment periods to Prelim, Midterm, Finals', () => {
    // Sequence mappings
    expect(formatUnitPeriodName({ sequence: 1 })).toBe('Prelim');
    expect(formatUnitPeriodName({ sequence: 2 })).toBe('Midterm');
    expect(formatUnitPeriodName({ sequence: 3 })).toBe('Finals');

    // Period mappings
    expect(formatUnitPeriodName({ period: 'PRELIM' })).toBe('Prelim');
    expect(formatUnitPeriodName({ period: 'MIDTERM' })).toBe('Midterm');
    expect(formatUnitPeriodName({ period: 'FINAL' })).toBe('Finals');

    // Combined objects
    expect(formatUnitPeriodName({ sequence: 1, period: 'PRELIM' })).toBe('Prelim');
    expect(formatUnitPeriodName({ sequence: 2, period: 'MIDTERM' })).toBe('Midterm');
    expect(formatUnitPeriodName({ sequence: 3, period: 'FINAL' })).toBe('Finals');

    // Fallback for sequence > 3
    expect(formatUnitPeriodName({ sequence: 4 })).toBe('Unit 04');
  });

  it('normalizes syllabus titles to proper title casing', () => {
    expect(formatCurriculumTitle('introduction to calculus')).toBe('Introduction to Calculus');
    expect(formatCurriculumTitle('limits, continuity & differentiation methods')).toBe('Limits, Continuity & Differentiation Methods');
    expect(formatCurriculumTitle('applications of the derivative(maxima, minima, related rates)')).toBe('Applications of Derivatives: Maxima, Minima, and Related Rates');
  });

  it('preserves known engineering acronyms in uppercase', () => {
    expect(formatCurriculumTitle('first-order ode solutions')).toBe('First-Order ODE Solutions');
    expect(formatCurriculumTitle('solving ivp problems')).toBe('Solving IVP Problems');
  });

  it('preserves mathematical notation and does not mangle casing', () => {
    expect(formatCurriculumTitle('derivatives of exponential functions (e^x, a^x)')).toBe('Derivatives of Exponential Functions (e^x, a^x)');
    expect(formatCurriculumTitle('implicit differentiation with dy/dx and y\'')).toBe('Implicit Differentiation with dy/dx and y\'');
    expect(formatCurriculumTitle('second derivative d^2y/dx^2')).toBe('Second Derivative d^2y/dx^2');
    expect(formatCurriculumTitle('trigonometric identities with sin and cos')).toBe('Trigonometric Identities with sin and cos');
  });

  it('handles null, undefined, and empty string safely', () => {
    expect(formatCurriculumTitle('')).toBe('');
    expect(formatCurriculumTitle(undefined as any)).toBe('');
    expect(formatCurriculumTitle(null as any)).toBe('');
  });
});
