import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '@/engine/content/generator';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { MathNormalizer } from '@/lib/math/mathNormalizer';
import katex from 'katex';

describe('MFE Midterm (COURSE-GEN0101 Unit 2) Quality and Fallback Integrity', () => {
  const midtermSkills = [
    'SKILL-GEN0101-008', // Quadratic and polynomial equations
    'SKILL-GEN0101-009', // Systems of equations
    'SKILL-GEN0101-010', // Functions: domain, range, composition, inverse
    'SKILL-GEN0101-011', // Exponential and logarithmic equations
  ];

  it('generates authentic mathematical problems without placeholder wording for all MFE Midterm skills', () => {
    for (const skillId of midtermSkills) {
      const skill = curriculumRegistry.getSkillById(skillId);
      expect(skill).toBeDefined();

      for (let diff = 1; diff <= 4; diff++) {
        const res = ContentGenerator.generateForSkill({
          courseId: 'COURSE-GEN0101',
          skillId,
          difficulty: diff,
        });

        expect(res.success).toBe(true);
        expect(res.problem).toBeDefined();
        const p = res.problem!;

        // Must NOT contain placeholder wording
        expect(p.statement.promptText).not.toContain('Complete a representative calculation');
        expect(p.statement.promptText).not.toContain('add ');
        expect(p.statement.expressionLatex).not.toContain('A+B+C=');
        expect(p.statement.expressionLatex).not.toContain('A + B + C');

        // Canonical answer must be defined and valid
        expect(p.solution.canonicalAnswerLatex).toBeDefined();
        expect(p.statement.promptText.length).toBeGreaterThan(10);
      }
    }
  });

  it('generates genuine domain, composition, and inverse problems for SKILL-GEN0101-010', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-010',
      difficulty: 4,
    });

    expect(res.success).toBe(true);
    const p = res.problem!;
    expect(p.statement.promptText).toMatch(/domain|composite|inverse|function/i);
    expect(p.solution.canonicalAnswerLatex).toBeDefined();
  });

  it('recognizes \\begin{cases} system of equations as pure math and renders via KaTeX', () => {
    const expr = '\\begin{cases} x + y = 5 \\\\ x - y = -1 \\end{cases}';
    expect(MathNormalizer.hasProseWords(expr)).toBe(false);
    expect(MathNormalizer.isPureMath(expr)).toBe(true);
    const norm = MathNormalizer.normalizePureMath(expr);
    expect(norm).toContain('\\begin{cases}');
    expect(norm).toContain('\\end{cases}');
    const html = katex.renderToString(norm, { displayMode: true });
    expect(html).toContain('katex');
  });
});
