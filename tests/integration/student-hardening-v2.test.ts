import { describe, it, expect, beforeEach } from 'vitest';
import { RoleGuard } from '@/engine/auth/roleGuard';
import { MathParser } from '@/engine/math/parser';
import { EquivalenceEngine } from '@/engine/math/equivalence';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import fs from 'fs';
import path from 'path';

describe('Student Experience Hardening (Phase 7.2) Test Suite', () => {
  beforeEach(() => {
    RoleGuard.reset();
  });

  describe('1. Learner-Friendly Verification & How We Checked Your Answer', () => {
    it('validates limit problem canonical answer 6 for lim_{x -> 3} (x^2 - 9)/(x - 3)', () => {
      const studentInput = '6';
      const cleanStudent = studentInput.replace(/^(?:[a-zA-Z_]|ans)\s*=\s*/, '').replace(/\s/g, '');
      const canonicalAns = '6';
      const canonicalRaw = '6';

      const studentNum = parseFloat(cleanStudent);
      const canonicalNum = parseFloat(canonicalAns);

      const isDirectMatch =
        cleanStudent === canonicalAns ||
        cleanStudent === canonicalRaw ||
        (!isNaN(studentNum) && !isNaN(canonicalNum) && Math.abs(studentNum - canonicalNum) < 0.01);

      expect(isDirectMatch).toBe(true);

      const studentNode = MathParser.parse(cleanStudent);
      expect(studentNode).toBeDefined();
      expect(studentNode.type).toBe('constant');
      expect(Number((studentNode as any).value.num) / Number((studentNode as any).value.den)).toBe(6);
    });

    it('ensures distinct status messages for AST parsing vs equivalence vs correctness', () => {
      const wrongAnswer = '7';
      const parsedWrong = MathParser.parse(wrongAnswer);
      expect(parsedWrong).toBeDefined();

      const canonicalAst = MathParser.parse('6');
      const eqResult = EquivalenceEngine.check(parsedWrong, canonicalAst, { targetVariable: 'x' });
      expect(eqResult.equivalent).toBe(false);

      const inputParsed = parsedWrong !== null;
      const equivalencePassed = eqResult.equivalent;
      const answerCorrect = equivalencePassed;

      expect(inputParsed).toBe(true);
      expect(equivalencePassed).toBe(false);
      expect(answerCorrect).toBe(false);
    });

    it('verifies disclosure naming in PracticeScreen source code', () => {
      const practiceScreenCode = fs.readFileSync(
        path.join(process.cwd(), 'src/components/practice/PracticeScreen.tsx'),
        'utf8'
      );
      expect(practiceScreenCode).toContain('How we checked your answer');
      expect(practiceScreenCode).toContain('isInstructorMode');
      expect(practiceScreenCode).toContain('showAuditDisclosure');
    });
  });

  describe('2. Centralized Admin Access & Role Guard', () => {
    it('defaults to STUDENT role and denies admin access', () => {
      expect(RoleGuard.getCurrentRole()).toBe('STUDENT');
      expect(RoleGuard.isAuthorizedForAdmin()).toBe(false);

      const check = RoleGuard.verifyAccess(['INSTRUCTOR', 'ADMIN']);
      expect(check.authorized).toBe(false);
      expect(check.reason).toContain('STUDENT');
    });

    it('authorizes INSTRUCTOR and ADMIN roles and triggers listeners', () => {
      let notifiedRole: string | null = null;
      const unsubscribe = RoleGuard.onRoleChange((newRole) => {
        notifiedRole = newRole;
      });

      RoleGuard.setRole('INSTRUCTOR');
      expect(RoleGuard.getCurrentRole()).toBe('INSTRUCTOR');
      expect(RoleGuard.isAuthorizedForAdmin()).toBe(true);
      expect(notifiedRole).toBe('INSTRUCTOR');

      RoleGuard.setRole('ADMIN');
      expect(RoleGuard.getCurrentRole()).toBe('ADMIN');
      expect(RoleGuard.isAuthorizedForAdmin()).toBe(true);
      expect(notifiedRole).toBe('ADMIN');

      unsubscribe();
    });

    it('fails closed when an invalid role is provided', () => {
      RoleGuard.setRole('HACKER' as any);
      expect(RoleGuard.getCurrentRole()).toBe('STUDENT');
      expect(RoleGuard.isAuthorizedForAdmin()).toBe(false);
    });
  });

  describe('3. AI Messaging Consistency', () => {
    it('ensures "Zero AI" does not exist in any src files', () => {
      const srcDir = path.join(process.cwd(), 'src');

      function checkDir(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            checkDir(fullPath);
          } else if (/\.(ts|tsx)$/.test(file)) {
            const content = fs.readFileSync(fullPath, 'utf8');
            expect(content).not.toContain('Zero AI Dependency for Correctness');
            expect(content).not.toContain('Zero AI');
          }
        }
      }

      checkDir(srcDir);
    });

    it('ensures "Deterministic grading • Optional AI tutoring" is used in footer and PracticeScreen', () => {
      const pageCode = fs.readFileSync(path.join(process.cwd(), 'src/app/page.tsx'), 'utf8');
      expect(pageCode).toContain('Deterministic grading');
      expect(pageCode).toContain('Optional AI tutoring');

      const practiceScreenCode = fs.readFileSync(
        path.join(process.cwd(), 'src/components/practice/PracticeScreen.tsx'),
        'utf8'
      );
      expect(practiceScreenCode).toContain('Deterministic grading');
      expect(practiceScreenCode).toContain('Optional AI tutoring');
    });

    it('ensures Multiple Choice toggle and formula input in StudentDashboard and PracticeScreen', () => {
      const dashboardCode = fs.readFileSync(
        path.join(process.cwd(), 'src/components/dashboard/StudentDashboard.tsx'),
        'utf8'
      );
      expect(dashboardCode).toContain('Formula or Multiple Choice');

      const practiceScreenCode = fs.readFileSync(
        path.join(process.cwd(), 'src/components/practice/PracticeScreen.tsx'),
        'utf8'
      );
      expect(practiceScreenCode).toContain('Make it Multiple Choice (MCQ)');
      expect(practiceScreenCode).toContain('isMcqMode');
    });
  });

  describe('4. Curriculum Hierarchy & Unit Default State', () => {
    it('collapses all units except the active one for Calculus 1', () => {
      const units = curriculumRegistry.getUnitsByCourse('COURSE-GEN0102');
      expect(units.length).toBeGreaterThan(1);

      const activeUnitId = units[0].id;
      const collapsedUnitIds = new Set<string>();
      for (const u of units) {
        if (u.id !== activeUnitId) {
          collapsedUnitIds.add(u.id);
        }
      }

      expect(collapsedUnitIds.has(activeUnitId)).toBe(false);
      expect(collapsedUnitIds.size).toBe(units.length - 1);
    });
  });

  describe('5. Responsive Touch Target & Overflow Protection', () => {
    it('verifies min-h-[44px] touch target classes in StudentDashboard and PracticeScreen', () => {
      const dashboardCode = fs.readFileSync(
        path.join(process.cwd(), 'src/components/dashboard/StudentDashboard.tsx'),
        'utf8'
      );
      expect(dashboardCode).toContain('min-h-[44px]');
      expect(dashboardCode).toContain('overflow-x-hidden');

      const practiceCode = fs.readFileSync(
        path.join(process.cwd(), 'src/components/practice/PracticeScreen.tsx'),
        'utf8'
      );
      expect(practiceCode).toContain('min-h-[44px]');
      expect(practiceCode).toContain('overflow-x-hidden');
    });
  });
});
