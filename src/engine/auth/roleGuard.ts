/**
 * Centralized Role Guard & Client-Side Authorization System
 *
 * [SECURITY ARCHITECTURE NOTICE]
 * This client-side role guard manages UX visibility, navigation routing, and
 * prevents accidental access to internal calibration tools in standalone/evaluation mode.
 *
 * Direct access to instructor and administrative features fails closed for unauthorized learners.
 * In a multi-tenant production environment, all administrative capabilities and database mutations
 * MUST be backed by server-side authentication (e.g. JWT/OAuth2 session tokens) and role-based middleware.
 */

export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type ProtectedResource =
  | 'TEACHER_CALIBRATION'
  | 'PIPELINE_INSPECTOR'
  | 'ADMIN_TOOLS'
  | 'DOMAIN_INVARIANT_FULL_AUDIT';

export interface AccessVerificationResult {
  authorized: boolean;
  currentRole: UserRole;
  requiredRoles: UserRole[];
  reason?: string;
}

const STORAGE_KEY = 'practice_engine_user_role';
const DEFAULT_ROLE: UserRole = 'STUDENT';

export class RoleGuard {
  private static listeners: Set<(role: UserRole) => void> = new Set();
  private static memoryRole: UserRole | null = null;

  /**
   * Retrieves the active user role.
   * Defaults to 'STUDENT' to fail closed for unauthenticated or first-time sessions.
   */
  public static getCurrentRole(): UserRole {
    if (typeof window === 'undefined') {
      return this.memoryRole || DEFAULT_ROLE;
    }

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (stored === 'INSTRUCTOR' || stored === 'ADMIN' || stored === 'STUDENT') {
        return stored;
      }
    } catch {
      // Fallback for sandboxed or private browsing environments
    }

    return this.memoryRole || DEFAULT_ROLE;
  }

  /**
   * Sets the active role and notifies all registered listeners.
   */
  public static setRole(role: UserRole): void {
    const validRole = (role === 'INSTRUCTOR' || role === 'ADMIN' || role === 'STUDENT') ? role : DEFAULT_ROLE;
    this.memoryRole = validRole;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, validRole);
        localStorage.setItem(STORAGE_KEY, validRole);
      } catch {
        // Ignored in restricted environments
      }
    }

    for (const listener of this.listeners) {
      try {
        listener(validRole);
      } catch {
        // Protect other listeners
      }
    }
  }

  /**
   * Checks whether the current user is authorized for instructor or admin tooling.
   */
  public static isAuthorizedForAdmin(): boolean {
    const role = this.getCurrentRole();
    return role === 'INSTRUCTOR' || role === 'ADMIN';
  }

  /**
   * Verifies access for a specific protected resource.
   * Fails closed if the current user role is not authorized.
   */
  public static verifyAccess(resource: ProtectedResource): AccessVerificationResult {
    const role = this.getCurrentRole();
    const requiredRoles: UserRole[] = ['INSTRUCTOR', 'ADMIN'];

    if (requiredRoles.includes(role)) {
      return {
        authorized: true,
        currentRole: role,
        requiredRoles,
      };
    }

    return {
      authorized: false,
      currentRole: role,
      requiredRoles,
      reason: `Access to ${resource} is restricted. Active role '${role}' lacks the required credentials (requires: INSTRUCTOR or ADMIN).`,
    };
  }

  /**
   * Registers a listener to be notified when user role changes.
   */
  public static onRoleChange(listener: (role: UserRole) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Resets role back to default 'STUDENT' (fail-closed state).
   */
  public static reset(): void {
    this.setRole(DEFAULT_ROLE);
  }
}
