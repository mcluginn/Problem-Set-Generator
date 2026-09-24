/**
 * Role Guard & Authorization System Unit Tests
 * Verifies default fail-closed behavior, role checks, and protection boundaries.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { RoleGuard } from '../../src/engine/auth/roleGuard';

describe('Unit: RoleGuard & Access Control', () => {
  beforeEach(() => {
    RoleGuard.reset();
  });

  it('defaults to STUDENT role and fails closed for administrative access', () => {
    expect(RoleGuard.getCurrentRole()).toBe('STUDENT');
    expect(RoleGuard.isAuthorizedForAdmin()).toBe(false);

    const verification = RoleGuard.verifyAccess('TEACHER_CALIBRATION');
    expect(verification.authorized).toBe(false);
    expect(verification.currentRole).toBe('STUDENT');
    expect(verification.reason).toContain('restricted');
  });

  it('authorizes INSTRUCTOR role for admin tools', () => {
    RoleGuard.setRole('INSTRUCTOR');
    expect(RoleGuard.getCurrentRole()).toBe('INSTRUCTOR');
    expect(RoleGuard.isAuthorizedForAdmin()).toBe(true);

    const verification = RoleGuard.verifyAccess('TEACHER_CALIBRATION');
    expect(verification.authorized).toBe(true);
  });

  it('authorizes ADMIN role for admin tools and pipeline inspector', () => {
    RoleGuard.setRole('ADMIN');
    expect(RoleGuard.getCurrentRole()).toBe('ADMIN');
    expect(RoleGuard.isAuthorizedForAdmin()).toBe(true);

    const verification = RoleGuard.verifyAccess('PIPELINE_INSPECTOR');
    expect(verification.authorized).toBe(true);
  });

  it('notifies listeners when role changes', () => {
    const rolesObserved: string[] = [];
    const unsubscribe = RoleGuard.onRoleChange((role) => {
      rolesObserved.push(role);
    });

    RoleGuard.setRole('INSTRUCTOR');
    RoleGuard.setRole('STUDENT');
    unsubscribe();
    RoleGuard.setRole('ADMIN');

    expect(rolesObserved).toEqual(['INSTRUCTOR', 'STUDENT']);
  });

  it('resets cleanly back to STUDENT', () => {
    RoleGuard.setRole('ADMIN');
    expect(RoleGuard.isAuthorizedForAdmin()).toBe(true);

    RoleGuard.reset();
    expect(RoleGuard.getCurrentRole()).toBe('STUDENT');
    expect(RoleGuard.isAuthorizedForAdmin()).toBe(false);
  });
});
