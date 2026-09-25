import { describe, it, expect } from 'vitest';
import { ContentGenerator } from '@/engine/content/generator';
import { curriculumRegistry } from '@/engine/curriculum/registry';
import { MathNormalizer } from '@/lib/math/mathNormalizer';
import { MathNormalizer as ComponentMathNormalizer } from '@/components/math/normalizer';
import { isPureMathExpression } from '@/components/math/MathRenderer';
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

  it('generates genuine domain, composition, and inverse problems for SKILL-GEN0101-010 across all 4 levels', () => {
    // Level 1: Rational domain exclusion
    const p1 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-010',
      difficulty: 1,
    }).problem!;
    expect(p1.statement.promptText).toContain('excluded from the natural domain');
    expect(p1.statement.expressionLatex).toContain('\\frac');
    expect(p1.distractors.length).toBeGreaterThan(0);

    // Level 2: Composite function evaluation (f \circ g)(2)
    const p2 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-010',
      difficulty: 2,
    }).problem!;
    expect(p2.statement.promptText).toContain('(f \\circ g)(2)');
    expect(p2.statement.promptText).not.toContain('\\quad');
    expect(p2.statement.expressionLatex).toBe('(f \\circ g)(2)');
    expect(p2.distractors.some(d => d.id === 'distractor_reversed_comp')).toBe(true);

    // Level 3: Symbolic composition (f \circ g)(x)
    const p3 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-010',
      difficulty: 3,
    }).problem!;
    expect(p3.statement.promptText).toContain('(f \\circ g)(x)');
    expect(p3.solution.canonicalAnswerLatex).toContain('x^{2}');

    // Level 4: Inverse function f^{-1}(x)
    const p4 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-010',
      difficulty: 4,
    }).problem!;
    expect(p4.statement.promptText).toContain('inverse function');
    expect(p4.solution.canonicalAnswerLatex).toContain('f^{-1}(x)');
    expect(p4.distractors.some(d => d.id === 'distractor_reciprocal')).toBe(true);

    // KaTeX render verification
    for (const p of [p1, p2, p3, p4]) {
      const htmlPrompt = ComponentMathNormalizer.parseInlineSegments(p.statement.promptText);
      for (const seg of htmlPrompt.filter(s => s.type === 'inline_math')) {
        const out = katex.renderToString(seg.latex || '', { displayMode: false, throwOnError: false });
        expect(out).not.toContain('katex-error');
      }
      const htmlExpr = katex.renderToString(p.statement.expressionLatex, { displayMode: true, throwOnError: false });
      expect(htmlExpr).not.toContain('katex-error');
    }
  });

  it('generates genuine structural progression for SKILL-GEN0101-011 across all 4 levels (not just changing coefficients)', () => {
    // Level 1: Basic Exponential
    const p1 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-011',
      difficulty: 1,
    }).problem!;
    expect(p1.statement.promptText).toContain('exponential equation');
    expect(p1.statement.expressionLatex).toMatch(/\d+\^\{x - \d+\} = \d+/);

    // Level 2: Basic Logarithmic
    const p2 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-011',
      difficulty: 2,
    }).problem!;
    expect(p2.statement.promptText).toContain('logarithmic equation');
    expect(p2.statement.expressionLatex).toContain('\\log_');

    // Level 3: Logarithm Product Rule with Extraneous Root Rejection
    const p3 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-011',
      difficulty: 3,
    }).problem!;
    expect(p3.statement.promptText).toMatch(/extraneous/i);
    expect(p3.distractors.some(d => d.id === 'distractor_both_roots')).toBe(true);

    // Level 4: Quadratic-in-Form Exponential Equation (u^2 - 6u + 8 = 0)
    const p4 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-011',
      difficulty: 4,
    }).problem!;
    expect(p4.statement.promptText).toMatch(/quadratic-form/i);
    expect(p4.statement.expressionLatex).toContain('2^{2x}');
    expect(p4.solution.canonicalAnswerLatex).toBe('x = 1, 2');
    expect(p4.distractors.some(d => d.id === 'distractor_forgot_log')).toBe(true);

    // KaTeX render verification
    for (const p of [p1, p2, p3, p4]) {
      const htmlExpr = katex.renderToString(p.statement.expressionLatex, { displayMode: true, throwOnError: false });
      expect(htmlExpr).not.toContain('katex-error');
    }
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

  it('renders Level 4 linear systems expression with KaTeX without error', () => {
    const res = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-009',
      difficulty: 4,
    });
    expect(res.success).toBe(true);
    const p = res.problem!;
    const expr = p.statement.expressionLatex;
    expect(MathNormalizer.isPureMath(expr)).toBe(true);
    const norm = MathNormalizer.normalizePureMath(expr);
    const html = katex.renderToString(norm, { displayMode: true, throwOnError: false });
    expect(html).not.toContain('katex-error');
  });

  it('normalizes and parses LaTeX environments in ComponentMathNormalizer and MathRenderer', () => {
    const expr = '\\begin{cases} 3x + 5y = 14 \\\\ 4x - 3y = 9 \\end{cases}';
    
    // Check MathRenderer pure math detection
    expect(isPureMathExpression(expr, false)).toBe(true);
    expect(isPureMathExpression(expr, true)).toBe(true);

    // Check ComponentMathNormalizer inline segments
    const inlineSegs = ComponentMathNormalizer.parseInlineSegments(`Solve system: ${expr}`);
    const mathSeg = inlineSegs.find((s) => s.type === 'inline_math');
    expect(mathSeg).toBeDefined();
    expect(mathSeg?.latex).toContain('\\begin{cases}');

    // Check ComponentMathNormalizer block parser
    const blocks = ComponentMathNormalizer.parseContentBlocks(expr);
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks[0].type).toBe('display_math');
    expect(blocks[0].latex).toContain('\\begin{cases}');
  });

  it('generates authentic 2x2, 3x3, 4x4, and non-linear systems across templates and difficulties', () => {
    // Level 1: 2x2
    const p1 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-009',
      difficulty: 1,
    }).problem!;
    expect(p1.statement.expressionLatex).toContain('\\begin{cases}');
    expect(p1.solution.canonicalAnswerLatex).toMatch(/x = \d+, y = \d+/);

    // Level 3: 3x3
    const p3 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-009',
      difficulty: 3,
    }).problem!;
    expect(p3.statement.expressionLatex).toContain('\\begin{cases}');
    expect(p3.solution.canonicalAnswerLatex).toMatch(/x = \d+, y = \d+, z = \d+/);

    // Level 4: 4x4
    const p4 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-009',
      difficulty: 4,
    }).problem!;
    expect(p4.statement.expressionLatex).toContain('\\begin{cases}');
    expect(p4.solution.canonicalAnswerLatex).toMatch(/w = \d+, x = \d+, y = \d+, z = \d+/);

    // Dedicated 3x3 Template
    const p3x3 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-009',
      templateId: 'TMPL-GEN0101-SYSTEMS-3X3',
      difficulty: 3,
    }).problem!;
    expect(p3x3.statement.expressionLatex).toContain('\\begin{cases}');
    expect(p3x3.solution.canonicalAnswerLatex).toContain('z =');

    // Dedicated 4x4 Template
    const p4x4 = ContentGenerator.generateForSkill({
      courseId: 'COURSE-GEN0101',
      skillId: 'SKILL-GEN0101-009',
      templateId: 'TMPL-GEN0101-SYSTEMS-4X4',
      difficulty: 4,
    }).problem!;
    expect(p4x4.statement.expressionLatex).toContain('\\begin{cases}');
    expect(p4x4.solution.canonicalAnswerLatex).toContain('w =');

    // Dedicated Non-linear Template (Parabola, Circle, Parabolas)
    for (let diff = 1; diff <= 4; diff++) {
      const pNL = ContentGenerator.generateForSkill({
        courseId: 'COURSE-GEN0101',
        skillId: 'SKILL-GEN0101-009',
        templateId: 'TMPL-GEN0101-SYSTEMS-NONLINEAR',
        difficulty: diff,
      }).problem!;
      expect(pNL.statement.expressionLatex).toContain('\\begin{cases}');
      expect(pNL.statement.promptText).toMatch(/intersection|non-linear/i);
      expect(pNL.solution.canonicalAnswerLatex).toContain('(');
      const html = katex.renderToString(pNL.statement.expressionLatex, { displayMode: true, throwOnError: false });
      expect(html).not.toContain('katex-error');
    }
  });

  it('correctly normalizes and parses composite function statements with \\quad and \\circ', () => {
    const rawPrompt = 'Given f(x)=3x+4, \\quad g(x) = x + 2, evaluate the composite function (f \\circ g)(2).';
    const segs = ComponentMathNormalizer.parseInlineSegments(rawPrompt);
    
    // There must be inline_math segments for functions and composition
    const mathSegs = segs.filter(s => s.type === 'inline_math');
    expect(mathSegs.length).toBeGreaterThanOrEqual(2);

    // None of the text segments should contain raw '\quad' or '\circ'
    const textSegs = segs.filter(s => s.type === 'text');
    for (const t of textSegs) {
      expect(t.text).not.toContain('\\quad');
      expect(t.text).not.toContain('\\circ');
    }

    // All math segments must render through KaTeX without error
    for (const m of mathSegs) {
      const html = katex.renderToString(m.latex || '', { displayMode: false, throwOnError: false });
      expect(html).not.toContain('katex-error');
    }
  });
});

