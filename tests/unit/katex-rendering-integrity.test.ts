import { describe, it, expect } from 'vitest';
import { problemBank } from '@/engine/content/problemBank';
import { MathNormalizer } from '@/lib/math/mathNormalizer';
import { DistractorGenerator } from '@/engine/quiz/distractorGenerator';
import katex from 'katex';

describe('KaTeX Rendering Integrity across 780 Problem Bank', () => {

  it('should verify GEN0110-U1-WAV-L1-001 renders without KaTeX errors or red text', () => {
    const problem = problemBank.getProblemById('GEN0110-U1-WAV-L1-001') || problemBank.getMasterProblems().find(x => x.id === 'GEN0110-U1-WAV-L1-001' || x.dna?.masterProblemId === 'GEN0110-U1-WAV-L1-001');
    expect(problem).toBeDefined();

    const canonicalAnswer = problem!.solution?.canonicalAnswerLatex || (problem as any).canonicalAnswerLatex;
    console.log('Canonical Answer:', canonicalAnswer);

    // Check canonical answer
    if (canonicalAnswer) {
      const cleanAns = MathNormalizer.normalizePureMath(canonicalAnswer);
      const ansHtml = katex.renderToString(cleanAns, { throwOnError: false });
      expect(ansHtml).not.toContain('katex-error');
      expect(ansHtml).not.toContain('#cc0000');
    }

    // Check options
    const options = DistractorGenerator.generateOptions(problem!, 42);
    expect(options.length).toBe(4);
    for (const opt of options) {
      console.log('Option textLatex:', opt.textLatex);
      const cleanOpt = MathNormalizer.normalizePureMath(opt.textLatex);
      const optHtml = katex.renderToString(cleanOpt, { throwOnError: false });
      expect(optHtml).not.toContain('katex-error');
      expect(optHtml).not.toContain('#cc0000');
    }

    // Check derivation steps
    const steps = problem!.solution?.solutionSteps || [];
    for (const step of steps) {
      const stepText = step.expressionLatex || step.explanation || '';
      const cleanStep = MathNormalizer.normalizeText(stepText);
      // Math blocks
      const mathRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\n]+?\$)/g;
      let match;
      while ((match = mathRegex.exec(cleanStep)) !== null) {
        let m = match[0];
        if (m.startsWith('$$') || m.startsWith('\\[')) m = m.slice(2, -2);
        else if (m.startsWith('\\(')) m = m.slice(2, -2);
        else if (m.startsWith('$')) m = m.slice(1, -1);
        const sHtml = katex.renderToString(MathNormalizer.normalizePureMath(m.trim()), { throwOnError: false });
        expect(sHtml).not.toContain('katex-error');
        expect(sHtml).not.toContain('#cc0000');
      }
    }
  });

  it('scans all 780 problems for KaTeX errors in statement, answer, hints, steps, and options', () => {
    const all780 = problemBank.getMasterProblems().filter(
      p => p.source === 'MASTER_BANK_780' || p.dna?.source === 'MASTER_BANK_780'
    );
    expect(all780.length).toBe(780);

    const errors: Array<{ id: string; field: string; text: string; errorSnippet: string }> = [];

    function testMath(id: string, field: string, text: string, isPure: boolean = false) {
      if (!text || typeof text !== 'string') return;
      if (isPure) {
        const clean = MathNormalizer.normalizePureMath(text);
        const html = katex.renderToString(clean, { throwOnError: false });
        if (html.includes('katex-error') || html.includes('#cc0000')) {
          const errMatch = html.match(/title="([^"]+)"/);
          errors.push({ id, field, text: clean, errorSnippet: errMatch ? errMatch[1] : 'katex-error' });
        }
      } else {
        const norm = MathNormalizer.normalizeText(text);
        const mathRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$[^\$\n]+?\$)/g;
        let match;
        while ((match = mathRegex.exec(norm)) !== null) {
          let m = match[0];
          if (m.startsWith('$$') || m.startsWith('\\[')) m = m.slice(2, -2);
          else if (m.startsWith('\\(')) m = m.slice(2, -2);
          else if (m.startsWith('$')) m = m.slice(1, -1);
          const clean = MathNormalizer.normalizePureMath(m.trim());
          const html = katex.renderToString(clean, { throwOnError: false });
          if (html.includes('katex-error') || html.includes('#cc0000')) {
            const errMatch = html.match(/title="([^"]+)"/);
            errors.push({ id, field, text: clean, errorSnippet: errMatch ? errMatch[1] : 'katex-error' });
          }
        }
      }
    }

    for (const p of all780) {
      const pid = p.dna?.problemId || p.id;
      testMath(pid, 'statement.promptText', p.statement?.promptText);
      testMath(pid, 'statement.expressionLatex', p.statement?.expressionLatex);
      testMath(pid, 'canonicalAnswerLatex', p.solution?.canonicalAnswerLatex, true);
      p.solution?.solutionSteps?.forEach((s, idx) => {
        testMath(pid, `solutionStep[${idx}].expression`, s.expressionLatex);
        testMath(pid, `solutionStep[${idx}].explanation`, s.explanation);
      });
      p.hints?.forEach((h, idx) => testMath(pid, `hint[${idx}]`, h.text));
      if (p.commonMistake) testMath(pid, 'commonMistake', p.commonMistake);

      try {
        const options = DistractorGenerator.generateOptions(p, 42);
        options.forEach((opt, idx) => {
          testMath(pid, `option[${idx}]`, opt.textLatex, true);
        });
      } catch (e) {
        // ignore option generation if unsupported
      }
    }

    if (errors.length > 0) {
      console.log(`\nTotal KaTeX errors found across all 780 problems: ${errors.length}`);
      const patternCounts = new Map<string, number>();
      for (const e of errors) {
        const key = e.errorSnippet.split(' at position')[0];
        patternCounts.set(key, (patternCounts.get(key) || 0) + 1);
      }
      console.log('\nError patterns summary:');
      for (const [pat, count] of patternCounts.entries()) {
        console.log(`  [${count}x] ${pat}`);
      }

      console.log('\nSample errors for each pattern:');
      for (const pat of patternCounts.keys()) {
        const sample = errors.find(e => e.errorSnippet.startsWith(pat));
        if (sample) {
          console.log(`Pattern: ${pat}`);
          console.log(`  Problem: [${sample.id}] field: ${sample.field}`);
          console.log(`  Raw Text: ${sample.text}`);
        }
      }
    }

    expect(errors.map(e => `${e.id} [${e.field}]: ${e.errorSnippet}`)).toEqual([]);
  });
});
