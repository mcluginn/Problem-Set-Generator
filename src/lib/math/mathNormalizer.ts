/**
 * Unified Mathematical Normalizer & Content Segment Parser
 * Engineering Practice Engine — Professional Mathematical Rendering System
 *
 * Converts plain-text math notation (from DOCX extractions, procedural generators,
 * student inputs, derivations, hints) into standard, accessible KaTeX LaTeX
 * with MathML support, while strictly protecting engineering units and natural prose.
 */

export interface ContentSegment {
  type: 'text' | 'math';
  value?: string;
  source?: string;
  displayMode?: boolean;
}

export class MathNormalizer {
  private static cache: Map<string, string> = new Map();

  // Engineering units to protect from accidental math fraction / variable conversion
  private static readonly UNIT_TOKENS = [
    'kJ/kg-K', 'J/kg-K', 'kJ/(kg*K)', 'J/(kg*K)', 'kJ/kg.K',
    'kJ/kg', 'J/kg', 'kW/m^2', 'kW/m²', 'W/m^2', 'W/m²', 'W/m-K', 'W/m-degC', 'W/m-°C',
    'm/s^2', 'm/s²', 'm/s', 'km/h', 'kg/s', 'g/s', 'L/s', 'mL/s',
    'm^3/s', 'm³/s', 'kN/m', 'N/m', 'N/C', 'kg/m^3', 'kg/m^2', 'kg/m', 'g/cm^3', 'g/m',
    'rad/s^2', 'rad/s', 'kPa', 'MPa', 'GPa', 'bar', 'kN-m', 'N-m', 'kN*m', 'N*m',
    'kN', 'MN', 'kJ', 'MJ', 'kW', 'MW', 'deg C/W', '°C/W', 'K/W', 'BTU/h', 'Pa-s', 'mPa-s',
    'deg C', '°C', 'deg F', '°F', 'deg/min', 'deg', 'rev/min', 'RPM',
    'kg', 'mg', 'm^3', 'm³', 'cm^3', 'cm³', 'mm^3', 'mm³',
    'm^2', 'm²', 'cm^2', 'mm^2', 'mA', 'kA', 'mV', 'kV',
    'kHz', 'MHz', 'GHz', 'Hz', 'mol', 'kmol', 'ohm', 'cm', 'mm', 'km',
    'Pa', 'K', 'N', 'J', 'W', 'V', 'A', 'L', 'g', 's', 'm',
    'knots', 'hours', 'minutes', 'seconds', 'days', 'years', 'ways', 'units'
  ];

  // Regex to detect engineering units following numbers or closing parentheses
  private static readonly UNIT_REGEX = new RegExp(
    '(?<=\\d|\\))\\s*(' +
      MathNormalizer.UNIT_TOKENS.map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') +
      ')(?=\\b|[^a-zA-Z0-9]|$)',
    'gi'
  );

  // Currency pattern (supports $, \$, \\$ and arbitrary decimal currency amounts)
  private static readonly CURRENCY_REGEX = /(?:\\\\|\\)?\$([0-9,]+(?:\.[0-9]+)?[kKmMbB]?)/g;

  /**
   * Allowed tokens that may appear in pure mathematical expressions without denoting English prose.
   */
  public static readonly ALLOWED_MATH_TOKENS = new Set([
    // Standard functions
    'sin', 'cos', 'tan', 'sec', 'csc', 'cot',
    'sinh', 'cosh', 'tanh', 'sech', 'csch', 'coth',
    'arcsin', 'arccos', 'arctan', 'arcsec', 'arccsc', 'arccot',
    'arsinh', 'arcosh', 'artanh',
    'ln', 'log', 'exp', 'sqrt', 'cbrt', 'lim', 'max', 'min',
    'det', 'gcd', 'lcm', 'deg', 'dim', 'ker', 'mod', 'erf', 'erfc',

    // Differentials, variables, constants
    'dx', 'dy', 'dz', 'dt', 'dr', 'du', 'dv', 'dw', 'ds', 'dp', 'dq',
    'dydx', 'del', 'inf', 'infinity',

    // Thermodynamics & Engineering terms / subscripts
    'cp', 'cv', 'pr', 'cop', 're', 'nu', 'eq', 'avg', 'net', 'tot', 'sat', 'crit', 'atm',
    'in', 'out', 'obs', 'src', 'rec', 'app', 'initial', 'final', 'eff', 'ref',
    'cell', 'flow', 'parallel', 'sound', 'fluid', 'beam', 'transducer', 'blood', 'pipe', 'wave', 'echo', 'beat', 'radar', 'sim', 'll', 'gg',

    // Common engineering and scientific units
    'kpa', 'mpa', 'gpa', 'pa', 'bar', 'kj', 'mj', 'gj', 'j',
    'kw', 'mw', 'gw', 'w', 'kn', 'mn', 'n', 'kg', 'mg', 'g',
    'mol', 'kmol', 'hz', 'khz', 'mhz', 'ghz', 'ohm', 'rad',
    'rev', 'rpm', 'cfm', 'kelvin', 'celsius', 'degc', 'degf',
    'mv', 'kv', 'ma', 'ka', 'ms', 'ns', 'us', 'ps',
    'cm', 'mm', 'km', 'ft', 'yd', 'mi',

    // Greek letter names
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta',
    'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi',
    'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',

    // Common LaTeX command words
    'frac', 'cdot', 'times', 'div', 'pm', 'mp', 'le', 'ge', 'ne', 'approx',
    'to', 'infty', 'partial', 'sum', 'prod', 'int', 'iint', 'iiint', 'oint',
    'left', 'right', 'mathbf', 'mathrm', 'mathit', 'text', 'quad', 'qquad',
    'circ', 'dot', 'hat', 'bar', 'vec', 'over', 'prime',

    // Multi-variable products & single-letter variable combinations
    'xy', 'yx', 'xz', 'zx', 'yz', 'zy', 'ye', 'ey', 'xe', 'ex', 'ze', 'ez',
    'uv', 'vu', 'uw', 'wu', 'vw', 'wv', 'ab', 'ba', 'bc', 'cb', 'cd', 'dc',
    'ac', 'ca', 'kt', 'rt', 'st', 'ts', 'pt', 'wt', 'cx', 'cy', 'cz',
    'xyz', 'abc', 'uvw', 'rst', 'ijk'
  ]);

  /**
   * Common English words that characterize instructional and descriptive prose.
   */
  public static readonly COMMON_ENGLISH_WORDS = new Set([
    // 2-letter English words
    'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'hi', 'if', 'in', 'is', 'it',
    'me', 'my', 'no', 'of', 'oh', 'ok', 'on', 'or', 'so', 'to', 'up', 'us', 'we',
    // 3-letter English words
    'and', 'the', 'for', 'are', 'but', 'not', 'you', 'all', 'any', 'can', 'had', 'her',
    'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new',
    'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say',
    'she', 'too', 'use',
    // Instructional, grammatical & conceptual English words
    'find', 'solve', 'evaluate', 'calculate', 'differentiate', 'integrate', 'determine',
    'compute', 'consider', 'where', 'note', 'assume', 'suppose', 'answer', 'question',
    'problem', 'step', 'solution', 'steps', 'using', 'rule', 'formula', 'expression',
    'equation', 'value', 'given', 'write', 'show', 'state', 'verify', 'check', 'graph',
    'sketch', 'rate', 'slope', 'curve', 'tangent', 'normal', 'area', 'volume', 'between',
    'along', 'through', 'across', 'respect', 'constant', 'arbitrary', 'general', 'particular',
    'initial', 'condition', 'boundary', 'degree', 'order', 'linear', 'matrix', 'vector',
    'scalar', 'system', 'method', 'series', 'convergence', 'divergence', 'test', 'ratio',
    'root', 'radius', 'interval', 'domain', 'range', 'function', 'derivative', 'integral',
    'partial', 'exact', 'separable', 'homogeneous', 'nonhomogeneous', 'differential',
    'variable', 'substitution', 'integration', 'parts', 'fractions', 'chain', 'product',
    'quotient', 'power', 'table', 'figure', 'following', 'below', 'above', 'each', 'every',
    'both', 'neither', 'either', 'true', 'false', 'correct', 'incorrect', 'choose', 'select',
    'option', 'options', 'level', 'hint', 'hints', 'that', 'with', 'from', 'this', 'then',
    'than', 'them', 'these', 'those', 'what', 'which', 'when', 'while', 'because', 'first',
    'second', 'third', 'last', 'into', 'over', 'under', 'about', 'such', 'would', 'could',
    'should', 'remember', 'student', 'work', 'done', 'form', 'forms', 'implicit', 'differentiation'
  ]);

  /**
   * Inspects a string for natural language English prose words.
   * Distinguishes prose words from mathematical tokens and single/multi-variable products.
   */
  public static hasProseWords(text: string): boolean {
    if (!text || typeof text !== 'string') return false;

    // Strip out LaTeX macros with bracketed arguments first (e.g. \text{approach}, \mathrm{obs}, \text{ Hz })
    const stripped = text
      .replace(/\\(?:text|mathrm|mathbf|mathit|operatorname|textnormal|textbf|textit)\{[^}]*\}/g, ' ')
      .replace(/_[a-zA-Z0-9]+/g, ' ')
      .replace(/_\{[^}]*\}/g, ' ')
      .replace(/\\[a-zA-Z]+/g, ' ')
      .replace(/[{}\[\]\(\)\^_\+\-\*\/\=\<\>\,\;\:\.\$\~]/g, ' ');

    const words = stripped.match(/[a-zA-Z]+/g);
    if (!words) return false;

    for (const rawWord of words) {
      // Single letters in math are variables/constants (x, y, P, T, etc.)
      if (rawWord.length < 2) continue;

      const lower = rawWord.toLowerCase();
      if (MathNormalizer.ALLOWED_MATH_TOKENS.has(lower)) {
        continue;
      }

      // If it's a known common English prose word, it is definitely prose
      if (MathNormalizer.COMMON_ENGLISH_WORDS.has(lower)) {
        return true;
      }

      // If it's a short sequence (2-4 chars) made purely of algebraic variable letters:
      // (x, y, z, u, v, w, t, s, r, p, q, a, b, c, d, e, k, m, n)
      // e.g. "xy", "ye", "xyz", "uv", "ab" -> treat as algebraic product of variables
      if (lower.length <= 4 && /^[xyzuvwtsrpqabcdenmk]+$/.test(lower)) {
        continue;
      }

      return true;
    }

    return false;
  }

  /**
   * Finds matching closing parenthesis/bracket/brace starting from openIdx.
   */
  public static findMatchingParen(s: string, openIdx: number): number {
    const openChar = s[openIdx];
    const closeChar = openChar === '(' ? ')' : openChar === '[' ? ']' : '}';
    let depth = 1;
    let i = openIdx + 1;
    while (i < s.length) {
      if (s[i] === openChar) {
        depth++;
      } else if (s[i] === closeChar) {
        depth--;
        if (depth === 0) return i;
      }
      i++;
    }
    return -1;
  }

  /**
   * Finds matching opening parenthesis backward from closeIdx.
   */
  public static findMatchingParenBackward(s: string, closeIdx: number): number {
    const closeChar = s[closeIdx];
    const openChar = closeChar === ')' ? '(' : closeChar === ']' ? '[' : '{';
    let depth = 1;
    let i = closeIdx - 1;
    while (i >= 0) {
      if (s[i] === closeChar) {
        depth++;
      } else if (s[i] === openChar) {
        depth--;
        if (depth === 0) return i;
      }
      i--;
    }
    return -1;
  }

  /**
   * Protects engineering units and currencies with placeholder tokens.
   */
  private static protectUnitsAndCurrency(text: string): {
    text: string;
    protectedMap: Map<string, string>;
  } {
    const protectedMap = new Map<string, string>();
    let counter = 0;

    // 1. Protect currency e.g. $80k -> \text{\$80k}
    let res = text.replace(MathNormalizer.CURRENCY_REGEX, (_, amt) => {
      const key = `__CURR_${counter++}__`;
      protectedMap.set(key, `\\text{\\\$${amt}}`);
      return key;
    });

    // 2. Protect units
    res = res.replace(MathNormalizer.UNIT_REGEX, (_, unitStr) => {
      const key = `__UNIT_${counter++}__`;
      let formatted = unitStr;
      if (formatted === 'deg C' || formatted === '°C') {
        formatted = '^\\circ\\text{C}';
      } else if (formatted === 'deg F' || formatted === '°F') {
        formatted = '^\\circ\\text{F}';
      } else if (formatted.includes('²') || formatted.includes('^2')) {
        const base = formatted.replace('²', '').replace('^2', '');
        formatted = `\\text{ ${base} }^2`;
      } else if (formatted.includes('³') || formatted.includes('^3')) {
        if (formatted.endsWith('/s')) {
          const base = formatted.replace('³/s', '').replace('^3/s', '');
          formatted = `\\text{ ${base} }^3\\text{/s}`;
        } else {
          const base = formatted.replace('³', '').replace('^3', '');
          formatted = `\\text{ ${base} }^3`;
        }
      } else {
        formatted = `\\text{ ${formatted} }`;
      }
      protectedMap.set(key, formatted);
      return key;
    });

    return { text: res, protectedMap };
  }

  /**
   * Restores protected placeholders.
   */
  private static restoreProtected(text: string, protectedMap: Map<string, string>): string {
    let res = text;
    for (const [k, v] of protectedMap.entries()) {
      res = res.split(k).join(v);
    }
    return res;
  }

  /**
   * Normalizes balanced exponents: base^(...) -> base^{...}
   */
  public static normalizePowers(s: string): string {
    const res: string[] = [];
    let i = 0;
    while (i < s.length) {
      if (s[i] === '^') {
        if (i + 1 < s.length && (s[i + 1] === '(' || s[i + 1] === '{' || s[i + 1] === '[')) {
          const openIdx = i + 1;
          const closeIdx = MathNormalizer.findMatchingParen(s, openIdx);
          if (closeIdx !== -1) {
            const inner = s.substring(openIdx + 1, closeIdx);
            const innerNorm = MathNormalizer.normalizePowers(inner);
            res.push('^{' + innerNorm + '}');
            i = closeIdx + 1;
            continue;
          }
        } else if (i + 1 < s.length) {
          const match = s.substring(i + 1).match(/^(-?[0-9]+(?:\.[0-9]+)?|[a-zA-Z0-9]+)/);
          if (match) {
            res.push('^{' + match[1] + '}');
            i += 1 + match[1].length;
            continue;
          }
        }
      }
      res.push(s[i]);
      i++;
    }
    return res.join('');
  }

  /**
   * Normalizes nested square roots: sqrt(...) -> \sqrt{...}
   */
  public static normalizeRoots(s: string): string {
    const res: string[] = [];
    let i = 0;
    while (i < s.length) {
      if (s.startsWith('sqrt(', i)) {
        const openIdx = i + 4;
        const closeIdx = MathNormalizer.findMatchingParen(s, openIdx);
        if (closeIdx !== -1) {
          const inner = s.substring(openIdx + 1, closeIdx);
          const innerNorm = MathNormalizer.normalizeRoots(inner);
          res.push('\\sqrt{' + innerNorm + '}');
          i = closeIdx + 1;
          continue;
        }
      }
      res.push(s[i]);
      i++;
    }
    return res.join('');
  }

  /**
   * Normalizes algebraic fractions with balanced parentheses.
   */
  public static normalizeFractions(input: string): string {
    // Pre-sanitize any damaged \text{\frac{a}{b}} into \text{ a/b } before text macro matching
    let sanitized = input.replace(/\\text\{\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\}/g, '\\text{ $1/$2 }');
    sanitized = sanitized.replace(/\\text\{\s*\\frac\{([^}]+)\}\s*\}/g, '\\text{ $1 }');

    // Protect any existing \text{...} or other text macros so units with slashes (e.g. \text{ m/s }) are NEVER converted to \frac
    const textMap = new Map<string, string>();
    let textCounter = 0;
    let s = sanitized.replace(/\\(?:text|mathrm|mathbf|mathit|operatorname|textnormal|textbf|textit)\{[^}]*\}/g, (m) => {
      const key = `__TEXT_MACRO_${textCounter++}__`;
      textMap.set(key, m);
      return key;
    });

    let i = 0;
    while (i < s.length) {
      if (s[i] === '/') {
        const leftStr = s.substring(0, i).trimEnd();
        const rightStr = s.substring(i + 1).trimStart();

        const extractDenom = (): { denom: string; suffix: string } | null => {
          if (rightStr.startsWith('(') || rightStr.startsWith('[')) {
            const rightClose = MathNormalizer.findMatchingParen(rightStr, 0);
            if (rightClose !== -1) {
              return {
                denom: rightStr.substring(1, rightClose).trim(),
                suffix: rightStr.substring(rightClose + 1),
              };
            }
          } else if (rightStr.startsWith('\\sqrt{')) {
            const rightClose = MathNormalizer.findMatchingParen(rightStr, 5);
            if (rightClose !== -1) {
              return {
                denom: rightStr.substring(0, rightClose + 1).trim(),
                suffix: rightStr.substring(rightClose + 1),
              };
            }
          } else {
            let denomEnd = 0;
            const mBase = rightStr.match(/^[a-zA-Z0-9\\]+(?:\.[0-9]+)?/);
            if (mBase) {
              denomEnd = mBase[0].length;
              if (rightStr.startsWith('_{', denomEnd)) {
                const subClose = MathNormalizer.findMatchingParen(rightStr, denomEnd + 1);
                if (subClose !== -1) {
                  denomEnd = subClose + 1;
                }
              } else if (/^_[a-zA-Z0-9]+/.test(rightStr.substring(denomEnd))) {
                const mSub = rightStr.substring(denomEnd).match(/^_[a-zA-Z0-9]+/);
                denomEnd += mSub![0].length;
              }
              if (rightStr.startsWith('^{', denomEnd)) {
                const powClose = MathNormalizer.findMatchingParen(rightStr, denomEnd + 1);
                if (powClose !== -1) {
                  denomEnd = powClose + 1;
                }
              } else if (/^\^[a-zA-Z0-9]+/.test(rightStr.substring(denomEnd))) {
                const mPow = rightStr.substring(denomEnd).match(/^\^[a-zA-Z0-9]+/);
                denomEnd += mPow![0].length;
              }
              return {
                denom: rightStr.substring(0, denomEnd),
                suffix: rightStr.substring(denomEnd),
              };
            }
          }
          return null;
        };

        const extractNumerator = (lStr: string): { prefix: string; num: string } | null => {
          if (!lStr || lStr.endsWith('\\')) return null;

          // Case A: Ends with closing paren or bracket
          if (lStr.endsWith(')') || lStr.endsWith(']')) {
            const closeParenIdx = lStr.length - 1;
            const openParenIdx = MathNormalizer.findMatchingParenBackward(lStr, closeParenIdx);
            if (openParenIdx !== -1) {
              return {
                prefix: lStr.substring(0, openParenIdx),
                num: lStr.substring(openParenIdx + 1, closeParenIdx).trim(),
              };
            }
            return null;
          }

          // Case B: Ends with brace '}' (e.g. exponent ^{...}, subscript _{...}, or \sqrt{...})
          let termStart = lStr.length;

          if (lStr.endsWith('}')) {
            const openBrace = MathNormalizer.findMatchingParenBackward(lStr, lStr.length - 1);
            if (openBrace !== -1) {
              const beforeBrace = lStr.substring(0, openBrace);
              if (beforeBrace.endsWith('\\sqrt')) {
                termStart = openBrace - 5;
              } else if (beforeBrace.endsWith('}')) {
                const firstOpen = MathNormalizer.findMatchingParenBackward(beforeBrace, beforeBrace.length - 1);
                if (firstOpen !== -1 && beforeBrace.substring(0, firstOpen).trimEnd().endsWith('\\frac')) {
                  const fracPrefix = beforeBrace.substring(0, firstOpen).trimEnd();
                  termStart = fracPrefix.length - 5;
                } else {
                  termStart = openBrace;
                }
              } else if (beforeBrace.endsWith('^') || beforeBrace.endsWith('_')) {
                const opIdx = openBrace - 1;
                const beforeOp = beforeBrace.substring(0, opIdx).trimEnd();
                if (beforeOp.endsWith(')') || beforeOp.endsWith(']')) {
                  const openP = MathNormalizer.findMatchingParenBackward(beforeOp, beforeOp.length - 1);
                  termStart = openP !== -1 ? openP : opIdx;
                } else {
                  const mBase = beforeOp.match(/[a-zA-Z0-9_\\]+$/);
                  termStart = mBase ? beforeOp.length - mBase[0].length : opIdx;
                }
              } else {
                termStart = openBrace;
              }
            } else {
              return null;
            }
          } else {
            // Simple term: alphanumeric, decimal, factorial, or exponent e.g. v^2, 100.0, 12!
            const m = lStr.match(/(?:[a-zA-Z0-9_\\!]+(?:\.[0-9]+)?|\d+\.\d+)(?:\^[0-9a-zA-Z]+)?$/);
            if (m) {
              termStart = lStr.length - m[0].length;
            } else {
              return null;
            }
          }

          // Check if there is a multiplicative prefix like "2 * " or "0.5 * " or "\cdot "
          const prefixStr = lStr.substring(0, termStart).trimEnd();
          const mMult = prefixStr.match(/(?:(?<=[=+\-<>,;:({[]\s*)|(?<=^\s*))([0-9a-zA-Z_\\]+(?:\.[0-9]+)?\s*(?:\*|\\cdot)\s*)$/);
          if (mMult) {
            termStart = prefixStr.length - mMult[1].length;
          }

          const num = lStr.substring(termStart).trim();
          if (!num) return null;
          return {
            prefix: lStr.substring(0, termStart),
            num,
          };
        };

        const parsedDenom = extractDenom();
        if (parsedDenom) {
          const parsedNum = extractNumerator(leftStr);
          if (parsedNum) {
            s = `${parsedNum.prefix}\\frac{${parsedNum.num}}{${parsedDenom.denom}}${parsedDenom.suffix}`;
            i = parsedNum.prefix.length + `\\frac{${parsedNum.num}}{${parsedDenom.denom}}`.length;
            continue;
          }
        }
      }
      i++;
    }

    // Restore protected text macros
    for (const [k, v] of textMap.entries()) {
      s = s.split(k).join(v);
    }

    return s;
  }

  /**
   * Normalizes a pure mathematical formula into canonical KaTeX LaTeX.
   */
  public static normalizePureMath(expr: string): string {
    if (!expr || !expr.trim()) return '';
    const trimmed = expr.trim();
    if (MathNormalizer.cache.has(trimmed)) {
      return MathNormalizer.cache.get(trimmed)!;
    }

    let s = trimmed;

    // Strip redundant outer delimiters if already wrapped
    if (
      (s.startsWith('$$') && s.endsWith('$$') && s.length >= 4) ||
      (s.startsWith('\\[') && s.endsWith('\\]') && s.length >= 4) ||
      (s.startsWith('\\(') && s.endsWith('\\)') && s.length >= 4)
    ) {
      s = s.slice(2, -2).trim();
    } else if (s.startsWith('$') && s.endsWith('$') && s.length >= 2) {
      s = s.slice(1, -1).trim();
    }

    // Pre-sanitize any damaged \text{\frac{a}{b}} into \text{ a/b }
    s = s.replace(/\\text\{\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\}/g, '\\text{ $1/$2 }');
    s = s.replace(/\\text\{\s*\\frac\{([^}]+)\}\s*\}/g, '\\text{ $1 }');

    // Pre-sanitize stray parenthesis inside derivative fractions e.g. \frac{(dx}{dt}) -> \frac{dx}{dt}
    s = s.replace(/\\frac\{\(([a-zA-Z0-9_]+)\}\{([a-zA-Z0-9_]+)\}\)/g, '\\frac{$1}{$2}');
    s = s.replace(/\\frac\{\(([a-zA-Z0-9_]+)\}/g, '\\frac{$1}');

    // Strip leaked math mode delimiters \(...\) and stray \( or \) inside math mode
    s = s.replace(/\\\(([\s\S]+?)\\\)/g, '$1');
    s = s.replace(/\\\((?=\s*\\[a-zA-Z]+)/g, '');
    s = s.replace(/\\\(/g, '(');
    s = s.replace(/\\\)/g, ')');

    // Pre-convert phasor polar angle notation: e.g. 20.0 /_ -53.13 deg -> 20.0 \angle -53.13 deg
    s = s.replace(/(\d+(?:\.\d+)?)\s*\/_\s*/g, '$1 \\angle ');
    s = s.replace(/\b(\d+)\.\s*\\frac\{(\d+)\}\{_\}\s*/g, '$1.$2 \\angle ');
    s = s.replace(/\\frac\{([^}]+)\}\{_\}\s*/g, '$1 \\angle ');

    // Escape unescaped % comments
    s = s.replace(/(?<!\\)%/g, '\\%');

    // 1. Unicode replacements
    const unicodeMap: Record<string, string> = {
      '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9', '⁰': '^0', '⁻': '^-',
      '±': '\\pm ', '×': '\\times ', '÷': '\\div ', '≠': '\\ne ',
      '≤': '\\le ', '≥': '\\ge ', '≈': '\\approx ', '→': '\\to ',
      '·': '\\cdot ', '•': '\\cdot ', '●': '\\cdot ', 'π': '\\pi ', 'α': '\\alpha ', 'β': '\\beta ',
      'γ': '\\gamma ', 'Δ': '\\Delta ', 'θ': '\\theta ', 'λ': '\\lambda ',
      'μ': '\\mu ', 'ρ': '\\rho ', 'σ': '\\sigma ', 'τ': '\\tau ',
      'ω': '\\omega ', 'Ω': '\\Omega ', 'η': '\\eta ', 'ε': '\\epsilon ',
      'ν': '\\nu ', 'Q̇': '\\dot{Q}', 'Ẇ': '\\dot{W}', 'ṁ': '\\dot{m}', 'V̇': '\\dot{V}',
      'é': '\\text{é}', 'è': '\\text{è}', 'á': '\\text{á}', 'à': '\\text{à}'
    };

    for (const [k, v] of Object.entries(unicodeMap)) {
      s = s.split(k).join(v);
    }

    // 2. Protect units and currency
    const { text: protectedText, protectedMap } = MathNormalizer.protectUnitsAndCurrency(s);
    s = protectedText;

    // 1b. Remove commas between digits e.g. 2,002,000 -> 2002000
    s = s.replace(/(?<=\d),(?=\d{3}\b)/g, '');

    // 3. Limits
    s = s.replace(
      /lim\s*(?:\(\s*([a-zA-Z])\s*(?:->|→)\s*([^)]+)\)|([a-zA-Z])\s*(?:->|→)\s*([^\s,;()]+))/g,
      (_, v1, val1, v2, val2) => {
        const varName = v1 || v2;
        let val = (val1 || val2).trim();
        val = val.replace(/(\d+)\s*-\s*$/, '$1^-');
        val = val.replace(/(\d+)\s*\+\s*$/, '$1^+');
        val = val.replace(/\binf\b|\binfinity\b/gi, '\\infty');
        return `\\lim_{${varName} \\to ${val}} `;
      }
    );

    // 4. Derivatives & Differentials
    s = s.replace(/\bd\^?2([a-zA-Z])\/d([a-zA-Z])\^?2\b/g, '\\frac{d^2 $1}{d $2^2}');
    s = s.replace(/\bd([a-zA-Z])\/d([a-zA-Z])\b/g, '\\frac{d$1}{d$2}');
    s = s.replace(/\bdel\s+([a-zA-Z])\/del\s+([a-zA-Z])\b/g, '\\frac{\\partial $1}{\\partial $2}');

    // 5. Square Roots
    s = MathNormalizer.normalizeRoots(s);

    // 6. Exponents
    s = MathNormalizer.normalizePowers(s);

    // 7. Fractions
    s = MathNormalizer.normalizeFractions(s);

    // 7b. Summations, Products, and Integrals in plain text notation
    s = s.replace(/\bsum\s+([a-zA-Z]\s*=\s*[0-9a-zA-Z]+)\s+to\s+([a-zA-Z0-9]+)(?:\s+of)?\s*/gi, '\\sum_{$1}^{$2} ');
    s = s.replace(/\bprod\s+([a-zA-Z]\s*=\s*[0-9a-zA-Z]+)\s+to\s+([a-zA-Z0-9]+)(?:\s+of)?\s*/gi, '\\prod_{$1}^{$2} ');
    s = s.replace(/\bint\s+([a-zA-Z0-9]+)\s+to\s+([a-zA-Z0-9]+)(?:\s+of)?\s*/gi, '\\int_{$1}^{$2} ');

    // Pre-sanitize any illegal \text{..._...} e.g. \text{y_{0}} or \text{y_0} -> y0, \text{o_{2}} -> o2
    s = s.replace(/\\text\{\s*([a-zA-Z]+)_\{?([0-9a-zA-Z]+)\}?\s*\}/g, '$1$2');
    s = s.replace(/\\text\{\s*([a-zA-Z]+[0-9]+)\s*\}/g, '$1');

    // 8. Subscripts
    // Subscripts in thermodynamics / physics variable-digit pairs e.g. P1, P2, T1, T2, s2, f0
    // Must NOT match inside \text{...}, and must NOT match if already part of a subscript or followed by underscore (e.g. v2_act)
    s = s.replace(/(?<![\\_a-zA-Z{])([a-zA-Z])([0-9])(?![a-zA-Z0-9_}])/g, '$1_{$2}');

    const greekNames = new Set([
      'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta',
      'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma',
      'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'
    ]);
    s = s.replace(/\b([a-zA-Z][0-9]?)_([a-zA-Z0-9]+)\b/g, (_, base, sub) => {
      let bVar = base[0];
      let bIdx = base.length > 1 ? base.slice(1) : '';
      if (bIdx) {
        if (/^\d+$/.test(sub) || sub.length === 1 || /\d/.test(sub)) {
          return `${bVar}_{${bIdx},${sub}}`;
        }
        if (greekNames.has(sub.toLowerCase())) {
          return `${bVar}_{${bIdx},\\${sub.toLowerCase()}}`;
        }
        return `${bVar}_{${bIdx},\\text{${sub}}}`;
      }
      if (/^\d+$/.test(sub) || sub.length === 1 || /\d/.test(sub)) {
        return `${base}_{${sub}}`;
      }
      if (greekNames.has(sub.toLowerCase())) {
        return `${base}_{\\${sub.toLowerCase()}}`;
      }
      return `${base}_{{\\text{${sub}}}}`;
    });

    // 9. Standard mathematical functions
    const funcs = [
      'sin', 'cos', 'tan', 'sec', 'csc', 'cot',
      'sinh', 'cosh', 'tanh', 'ln', 'log',
      'arcsin', 'arccos', 'arctan'
    ];
    for (const fn of funcs) {
      const reg = new RegExp(`(?<!\\\\)\\b${fn}\\b(?!\\s*_\\w+)`, 'g');
      s = s.replace(reg, `\\${fn} `);
    }

    // Inverse hyperbolic and specialized functions for KaTeX operatorname support
    s = s.replace(/(?:\\)?\b(arcosh|arsinh|artanh|arcsec|arccsc|arccot)\b/g, '\\operatorname{$1}');

    // 9b. Greek symbols (when not already escaped with \)
    const greekLetters = [
      'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta',
      'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma',
      'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
      'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Upsilon', 'Phi', 'Psi', 'Omega'
    ];
    for (const gk of greekLetters) {
      const reg = new RegExp(`(?<!\\\\)\\b${gk}\\b`, 'g');
      s = s.replace(reg, `\\${gk} `);
    }

    // 10. Operators and multiplication
    s = s.replace(/(?<![=<>!~])~=\s*/g, ' \\approx ');
    s = s.replace(/(?<![=<>!])<<\s*/g, ' \\ll ');
    s = s.replace(/(?<![=<>!])>>\s*/g, ' \\gg ');
    s = s.replace(/\s*\*\s*/g, ' \\cdot ');
    s = s.replace(/\+-/g, '\\pm ');
    s = s.replace(/(?<![=<>!])!=\s*/g, '\\ne ');
    s = s.replace(/(?<![=<>!])<=\s*/g, '\\le ');
    s = s.replace(/(?<![=<>!])>=\s*/g, '\\ge ');
    s = s.replace(/\b(\d+(?:\.\d+)?)\s*[x×]\s*10\^/g, '$1 \\times 10^');
    s = s.replace(/(?<=\d),(?=\d{3}\b)/g, '');
    s = s.replace(/\.\s*$/, '');

    // 11. Restore protected units and currency
    s = MathNormalizer.restoreProtected(s, protectedMap);

    // 12. Sanitize any illegal \frac inside \text{...} or damaged decimal fractions
    s = s.replace(/\\text\{\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\}/g, '\\text{ $1/$2 }');
    s = s.replace(/(\d+)\.\s*\\frac\{(\d+)(?:\\text\{\s*([^}]+)\s*\})?\}\{([a-zA-Z]+)\}/g, (_, intPart, decPart, unit, denom) => {
      const u = unit ? `${unit.replace(/\s+/g, '')}/${denom}` : denom;
      return `${intPart}.${decPart}\\text{ ${u} }`;
    });
    s = s.replace(/(\d+)\.\s*\\frac\{0\}\{([^\}]+)\}/g, '$1.0 / $2');
    s = s.replace(/\\text\{\s*([a-zA-Z]+)\s*\}\s*\/\s*([a-zA-Z]+)/g, '\\text{ $1/$2 }');

    // 12b. Heal math functions and commands accidentally placed inside \text{...} e.g. \text{\tan } -> \text{tan }, \text{\theta } -> \theta
    s = s.replace(/\\text\{\s*\\([a-zA-Z]+)\s*\}/g, '\\$1');
    s = s.replace(/\\text\{([^\}]*)\\(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|ln|log)([^\}]*)\}/g, '\\text{$1$2$3}');

    // 12c. Heal any remaining stray $ or \$ or \\$ or # in math mode
    s = s.replace(/(?<!\\text\{[^\}]*)(?:\\\\|\\)?\$([0-9,]+(?:\.[0-9]+)?)/g, '\\text{\\$$1}');
    s = s.replace(/(?<!\\text\{[^\}]*)(?:\\\\|\\)?\$/g, '\\text{\\$}');
    s = s.replace(/(?<!\\)#/g, '\\#');
    s = s.replace(/\\text\{\s*\\text\{([^}]+)\}\s*\}/g, '\\text{$1}');

    // 12d. Clean up trailing incomplete macros and auto-balance curly braces
    s = s.replace(/\\text\{\s*$/g, '');
    s = s.replace(/\\text\{([a-zA-Z0-9\s.,-]+)$/g, '\\text{$1}');
    s = s.replace(/\\frac\{([^}]+)\}\s*$/g, '$1');
    s = s.replace(/\\frac\{([^}]+)$/g, '$1');
    s = s.replace(/\\frac\s*$/g, '');
    s = s.replace(/\\sqrt\s*$/g, '');
    s = s.replace(/_(?:\s+|$)/g, ' ');
    s = s.replace(/_([a-zA-Z0-9]+)/g, '_{$1}');

    // Merge any double subscripts e.g. _{2}_{a}ct or _{2}_{act} or _{2}_{total} -> _{2,\text{act}}
    s = s.replace(/_\{([^}]+)\}_\{([a-zA-Z])\}([a-zA-Z0-9]+)/g, '_{$1,\\text{$2$3}}');
    s = s.replace(/_\{([^}]+)\}_\{([^}]+)\}/g, '_{$1,$2}');
    s = s.replace(/_\{([^}]+)\}_([a-zA-Z0-9]+)/g, '_{$1,$2}');

    // Heal unclosed parentheses in \frac arguments: \frac{(u}{u} or \frac{6x}{(x}
    s = s.replace(/\\frac\{\s*\(([^)]+)\s*\}\{([^}]+)\}/g, '\\frac{$1}{$2}');
    s = s.replace(/\\frac\{([^}]+)\}\{\s*\(([^)]+)\s*\}/g, '\\frac{$1}{$2}');

    // Heal corrupted consecutive fractions \frac{A}\frac{B}{C} -> \frac{\frac{A}{B}}{C}
    s = s.replace(/\\frac\{([^{}]+)\}\s*\\frac\{\{?([^{}]*?)\}?\}\{([^{}]+)\}/g, (_, a, b, c) => `\\frac{\\frac{${a}}{${b}}}{${c}}`);

    // Clean stray trailing backslashes
    s = s.replace(/\\+\s*$/g, '');
    s = s.replace(/\\+\s*(?=[,;:\.\)\]\}]|$)/g, '');

    // 12e. Heal illegal underscores or subscripts inside \text{...} macros
    s = s.replace(/\\text\{\s*([a-zA-Z]+)_\{?([0-9a-zA-Z]+)\}?\s*\}/g, '$1$2');
    s = s.replace(/\\text\{\s*([a-zA-Z]+[0-9]+)\s*\}/g, '$1');
    s = s.replace(/\{\{([a-zA-Z0-9]+)\}\}/g, '{$1}');

    // Heal any broken subscripts in denominators: \frac{1}{R_}{1} -> \frac{1}{R_{1}}
    s = s.replace(/\\frac\{([^}]+)\}\{([a-zA-Z0-9_\\]+)_\}\{([^}]+)\}/g, '\\frac{$1}{$2_{$3}}');
    // Heal any remaining phasor angle fractions: \frac{120}{_} -> 120 \angle
    s = s.replace(/\b(\d+)\.\s*\\frac\{(\d+)\}\{_\}\s*/g, '$1.$2 \\angle ');
    s = s.replace(/\\frac\{([^}]+)\}\{_\}\s*/g, '$1 \\angle ');

    let openCount = 0;
    for (let ci = 0; ci < s.length; ci++) {
      if (s[ci] === '{' && (ci === 0 || s[ci - 1] !== '\\')) openCount++;
      else if (s[ci] === '}' && (ci === 0 || s[ci - 1] !== '\\')) openCount--;
    }
    if (openCount > 0) {
      s += '}'.repeat(openCount);
    } else if (openCount < 0) {
      while (openCount < 0 && s.endsWith('}')) {
        s = s.slice(0, -1);
        openCount++;
      }
    }

    // 13. Wrap descriptive English title labels preceding variable equations in \text{...}
    s = s.replace(/(?<=(?:^|,\s*))([A-Z][a-zA-Z\s]+(?:\([^\)]+\))?)\s+([a-zA-Z](?:_[a-zA-Z0-9]+|\{[^}]+\})?\s*=)/g, (_, label, eq) => {
      return `\\text{${label.trim()} } ${eq}`;
    });

    // Clean whitespace
    s = s.replace(/\s+/g, ' ').trim();

    MathNormalizer.cache.set(trimmed, s);
    return s;
  }

  /**
   * Checks if an entire string is purely an algebraic or mathematical expression.
   */
  public static isPureMath(text: string): boolean {
    if (!text || !text.trim()) return false;
    let trimmed = text.trim();
    if (trimmed.endsWith('.') && !trimmed.endsWith('..')) {
      trimmed = trimmed.slice(0, -1).trim();
    }

    // If it contains natural prose words, it is NEVER pure math
    if (MathNormalizer.hasProseWords(trimmed)) {
      return false;
    }

    // Already delimited
    if (
      (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length >= 4) ||
      (trimmed.startsWith('\\[') && trimmed.endsWith('\\]') && trimmed.length >= 4) ||
      (trimmed.startsWith('\\(') && trimmed.endsWith('\\)') && trimmed.length >= 4) ||
      (trimmed.startsWith('$') && trimmed.endsWith('$') && trimmed.length >= 2)
    ) {
      return true;
    }

    // Contains typical formula indicators without prose words
    const hasMathIndicators =
      /^(?:lim\s*\(|d\^?[0-9]*[a-zA-Z]\/d[a-zA-Z]|sqrt\(|[a-zA-Z](?:_[a-zA-Z0-9]+|_\{[^}]+\})?\s*(?:=|~=|<=|>=|<|>)|f\(|y\(|[0-9a-zA-Z_\^\/\+\-\*\(\)\[\]\s=\<\>\.\,\{\}\\\|\:\~]+)$/.test(
        trimmed
      ) &&
      /[\^=\/\\_+\-*\~\[\]]/.test(trimmed);

    return hasMathIndicators;
  }

  /**
   * Parses mixed text into ContentSegment array.
   */
  public static parseContentSegments(rawContent: string): ContentSegment[] {
    return MathNormalizer.parseToContentSegments(rawContent);
  }

  public static parseToContentSegments(rawContent: string): ContentSegment[] {
    if (!rawContent || !rawContent.trim()) return [];

    const segments: ContentSegment[] = [];

    // Delimiters supported: $$, \[, \], \(, \), $
    const tokenRegex =
      /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\([\s\S]*?\\\))/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(rawContent)) !== null) {
      const matchStart = match.index;
      const matchEnd = tokenRegex.lastIndex;
      const fullMatch = match[0];

      if (matchStart > lastIndex) {
        segments.push({
          type: 'text',
          value: rawContent.substring(lastIndex, matchStart),
        });
      }

      let mathSource = '';
      let displayMode = false;

      if (fullMatch.startsWith('$$') && fullMatch.endsWith('$$')) {
        mathSource = fullMatch.slice(2, -2).trim();
        displayMode = true;
      } else if (fullMatch.startsWith('\\[') && fullMatch.endsWith('\\]')) {
        mathSource = fullMatch.slice(2, -2).trim();
        displayMode = true;
      } else if (fullMatch.startsWith('\\(') && fullMatch.endsWith('\\)')) {
        mathSource = fullMatch.slice(2, -2).trim();
        displayMode = false;
      } else if (fullMatch.startsWith('$') && fullMatch.endsWith('$')) {
        mathSource = fullMatch.slice(1, -1).trim();
        displayMode = false;
      }

      segments.push({
        type: 'math',
        source: MathNormalizer.normalizePureMath(mathSource),
        displayMode,
      });

      lastIndex = matchEnd;
    }

    if (lastIndex < rawContent.length) {
      segments.push({
        type: 'text',
        value: rawContent.substring(lastIndex),
      });
    }

    return segments;
  }

  /**
   * Normalizes mixed prose by identifying mathematical expressions and wrapping them with \(...\).
   */
  public static normalizeText(text: string): string {
    if (!text || !text.trim()) return '';

    let s = text;
    // Sanitize any illegal \frac inside \text{...}
    s = s.replace(/\\text\{\s*\\frac\{([^}]+)\}\{([^}]+)\}\s*\}/g, '\\text{ $1/$2 }');
    // Sanitize commands inside \text{...}
    s = s.replace(/\\text\{\s*\\([a-zA-Z]+)\s*\}/g, '\\$1');
    s = s.replace(/\\text\{([^\}]*)\\(sin|cos|tan|sec|csc|cot|sinh|cosh|tanh|ln|log)([^\}]*)\}/g, '\\text{$1$2$3}');
    // Escape unescaped #
    s = s.replace(/(?<!\\)#/g, '\\#');

    // If text already has explicit delimiters, return it normalized
    if (/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\([\s\S]*?\\\))/.test(s)) {
      return s;
    }

    // Check if entire text is pure math
    if (MathNormalizer.isPureMath(text)) {
      return `\\(${MathNormalizer.normalizePureMath(text)}\\)`;
    }

    // Check for "Intro: Equation" structure
    const lastColon = text.lastIndexOf(':');
    if (lastColon !== -1 && lastColon < text.length - 2) {
      const candidateIntro = text.substring(0, lastColon + 1);
      let candidateFormula = text.substring(lastColon + 1).trim();
      let trailingPeriod = false;
      if (candidateFormula.endsWith('.') && !candidateFormula.endsWith('..')) {
        candidateFormula = candidateFormula.slice(0, -1).trim();
        trailingPeriod = true;
      }
      if (
        candidateFormula.length > 2 &&
        (/[=~^/*<>]/.test(candidateFormula) || candidateFormula.includes('\\') || candidateFormula.includes('lim') || candidateFormula.includes('sqrt')) &&
        !MathNormalizer.hasProseWords(candidateFormula)
      ) {
        const normIntro = candidateIntro;
        const normExpr = MathNormalizer.normalizePureMath(candidateFormula);
        return `${normIntro}\\[${normExpr}\\]${trailingPeriod ? '.' : ''}`;
      }
    }

    // Normalize inline equations like P = 250 kPa, T1 = 300 K, lim (x -> 3) ..., etc.
    let res = text;

    // Protect list item markers e.g. "1) ", "2) " only at start of line or after period/colon/newline
    const markerMap = new Map<string, string>();
    let markerCount = 0;
    res = res.replace(/(?:^|(?<=[\.\:\n\r]))\s*(\d+\))\s+/g, (full, m) => {
      const key = `@@LISTMARKER${markerCount++}@@`;
      markerMap.set(key, ` ${m} `);
      return ` ${key} `;
    });

    // Detect higher-order and first-order derivatives: d^2y/dx^2, dy/dx, df/dx, du/dt, etc. (when not part of equation)
    res = res.replace(
      /(?<=\b|\s|\()d\^?2([a-zA-Z])\/d([a-zA-Z])\^?2(?!\s*=)(?=\b|\s|[,;.:\?!]|\))/g,
      (match) => `\\(${MathNormalizer.normalizePureMath(match)}\\)`
    );
    res = res.replace(
      /(?<=\b|\s|\()d([a-zA-Z])\/d([a-zA-Z])(?!\s*=)(?=\b|\s|[,;.:\?!]|\))/g,
      (match) => `\\(${MathNormalizer.normalizePureMath(match)}\\)`
    );
    res = res.replace(
      /(?<=\b|\s|\()del\s+([a-zA-Z])\/del\s+([a-zA-Z])(?!\s*=)(?=\b|\s|[,;.:\?!]|\))/gi,
      (match) => `\\(${MathNormalizer.normalizePureMath(match)}\\)`
    );

    // Detect un-delimited LaTeX macros in prose: \frac{...}{...}, \sqrt{...}, \cos, \sin, \theta, etc.
    res = res.replace(
      /(?<![\$\\\(])(\\(?:frac|sqrt|lim|sum|int|iint|iiint|oint|prod|partial|pm|mp|cdot|times|cos|sin|tan|sec|csc|cot|sinh|cosh|tanh|ln|log|exp|theta|alpha|beta|gamma|delta|lambda|mu|nu|pi|rho|sigma|tau|phi|psi|omega|Delta|Theta|Lambda|Xi|Pi|Sigma|Phi|Psi|Omega|approx|ll|gg|le|ge|ne|to|infty)(?:\{[^{}]*\}|\[[^\[\]]*\])*(?:\{[^{}]*\})*)(?![\$\\\)])/g,
      (match) => `\\(${match}\\)`
    );

    // Detect un-delimited variables with subscripts: v_{\text{flow}}, v_{flow}, x_{1}, etc.
    res = res.replace(
      /(?<![\$\\\(a-zA-Z0-9])\b([a-zA-Z])_\{([^}]+)\}(?![\$\\\)a-zA-Z0-9])/g,
      (match) => `\\(${match}\\)`
    );

    // Detect standalone numerical fractions (e.g. 1/6, 3/4) not part of engineering units
    res = res.replace(
      /(?<=\s|^)(\d+)\s*\/\s*(\d+)(?=[,;.\?!]|\s|$)/g,
      (_, num, den) => `\\(\\frac{${num}}{${den}}\\)`
    );

    // Detect limits: lim (x -> 3) ...
    res = res.replace(
      /\blim\s*(?:\([^)]+\)|[a-zA-Z]\s*->\s*[^\s,;()]+)\s*[^,;.\n]+/g,
      (match) => `\\(${MathNormalizer.normalizePureMath(match)}\\)`
    );

    // Detect equations with = or ~=: [var|derivative] = [expr]
    // Scan with balanced parentheses and brackets so expressions like (2 * f0 * v_flow * cos theta) / c are never cut in half
    res = res.replace(
      /(?<![\$\\\(])\b(d\^?[0-9]*[a-zA-Z]\/d[a-zA-Z]|(?:Delta\s+)?[a-zA-Z](?:_\{[^}]+\}|_[a-zA-Z0-9]+|\'[a-zA-Z0-9]*)?|[a-zA-Z][a-zA-Z0-9_\'\\\{\}\(\)]*)\s*(=|~=)\s*([a-zA-Z0-9_\^\/\+\-\*\(\)\[\]\s\,\{\}\\\|\:\~\=]+?(?:\.\d+[a-zA-Z0-9_\^\/\+\-\*\(\)\[\]\s\,\{\}\\\|\:\~\=]*)*)(?=\.(?!\d)|;|\n|$)/g,
      (match, left, op, fullRight) => {
        // Skip if left is an English prose word
        if (MathNormalizer.hasProseWords(left)) return match;

        // Parse right until balanced depth 0 before prose or end of clause
        let depth = 0;
        let cutIdx = 0;
        while (cutIdx < fullRight.length) {
          const ch = fullRight[cutIdx];
          if (ch === '(' || ch === '[' || ch === '{') {
            depth++;
          } else if (ch === ')' || ch === ']' || ch === '}') {
            if (depth === 0) break;
            depth--;
          } else if (depth === 0) {
            // Stop at punctuation: semicolon, newline, colon
            if (ch === ';' || ch === ':' || ch === '\n') {
              break;
            }
            // Stop at comma if not between digits
            if (ch === ',' && (cutIdx === 0 || !/\d/.test(fullRight[cutIdx - 1]) || cutIdx + 1 >= fullRight.length || !/\d/.test(fullRight[cutIdx + 1]))) {
              break;
            }
            // Stop at period if not followed by a digit
            if (ch === '.' && (cutIdx + 1 >= fullRight.length || !/\d/.test(fullRight[cutIdx + 1]))) {
              break;
            }
            // Check for words starting after space
            if (/\s/.test(ch)) {
              const remainder = fullRight.substring(cutIdx).trimStart();
              const nextWordM = remainder.match(/^([a-zA-Z]+)/);
              if (nextWordM) {
                const w = nextWordM[1].toLowerCase();
                // If it is a known prose word and NOT an allowed math token
                if (MathNormalizer.COMMON_ENGLISH_WORDS.has(w) || (w.length >= 4 && !MathNormalizer.ALLOWED_MATH_TOKENS.has(w))) {
                  break;
                }
              }
            }
          }
          cutIdx++;
        }

        const validRight = fullRight.substring(0, cutIdx).trim();
        if (!validRight || MathNormalizer.hasProseWords(validRight)) return match;

        const remainder = fullRight.substring(cutIdx);
        return `\\(${MathNormalizer.normalizePureMath(`${left} ${op} ${validRight}`)}\\)${remainder}`;
      }
    );

    // Detect standalone calculation expressions in hints e.g. Approach: 800 * (340 + 20)/(340 - 30)
    res = res.replace(
      /(?<![\$\\\(])(?<=\b(?:Approach|Recede|Calculate|Compute|Evaluate|Substitute|Formula|Given):\s*)([0-9a-zA-Z_\^\/\+\-\*\(\)\[\]\s\.\{\}\\\|\:\~]+?)(?=(?:\s+[a-zA-Z]{4,}|\.(?!\d)|[,;:\n]|$))/gi,
      (match, formula) => {
        if (MathNormalizer.hasProseWords(formula) || !/[=^/*]/.test(formula)) return match;
        return `\\(${MathNormalizer.normalizePureMath(formula)}\\)`;
      }
    );

    // Detect inequalities: v_flow << c, x >= 2, P <= 300 kPa (must run before standalone subscripts)
    res = res.replace(
      /(?<![\$\\\(a-zA-Z0-9])([a-zA-Z](?:_[a-zA-Z0-9]+|_\{[^}]+\})?)\s*(<<|>>|<=|>=|<|>|!=)\s*([a-zA-Z0-9_\.\^]+(?:\s*[a-zA-Z/]+)?)(?![\$\\\)a-zA-Z0-9])/g,
      (match, left, op, right) => {
        if (MathNormalizer.hasProseWords(left) || MathNormalizer.hasProseWords(right)) return match;
        return `\\(${MathNormalizer.normalizePureMath(`${left} ${op} ${right}`)}\\)`;
      }
    );

    // Detect parenthetical inequality conditions e.g. (< 2 m/s vs 1540 m/s)
    res = res.replace(
      /(?<=\()\s*(<|>|<=|>=|<<|>>)\s*(\d+(?:\.\d+)?\s*(?:[a-zA-Z/]+)?)(?=\s+vs|\s*\))/g,
      (_, op, val) => `\\(${op} ${MathNormalizer.normalizePureMath(val)}\\)`
    );

    // Detect standalone subscript variables in prose: f_approach, f_recede, v_obs, v_flow, etc.
    res = res.replace(
      /(?<![\$\\\(a-zA-Z0-9])\b([a-zA-Z])_([a-zA-Z0-9]+)\b(?![\$\\\)a-zA-Z0-9])/g,
      (match, v, sub) => {
        const greekNames = new Set([
          'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta',
          'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi', 'rho', 'sigma',
          'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega'
        ]);
        if (/^\d+$/.test(sub) || sub.length === 1 || /\d/.test(sub)) return `\\(${v}_{${sub}}\\)`;
        if (greekNames.has(sub.toLowerCase())) return `\\(${v}_{\\${sub.toLowerCase()}}\\)`;
        return `\\(${v}_{{\\text{${sub}}}}\\)`;
      }
    );

    // Restore markers
    for (const [k, v] of markerMap.entries()) {
      res = res.split(k).join(v);
    }

    return res;
  }

  /**
   * Normalizes step text in derivation steps: Intro: DisplayEquation [Note]
   */
  public static normalizeStepText(stepText: string): string {
    if (!stepText || !stepText.trim()) return '';
    const st = stepText.trim();

    // 1. If entire step is pure math:
    if (MathNormalizer.isPureMath(st)) {
      let mathExpr = st;
      let trailingDot = false;
      if (mathExpr.endsWith('.') && !mathExpr.endsWith('..')) {
        mathExpr = mathExpr.slice(0, -1).trim();
        trailingDot = true;
      }
      return `\\[ ${MathNormalizer.normalizePureMath(mathExpr)} \\]${trailingDot ? '.' : ''}`;
    }

    // 2. Find the split point between descriptive prose and mathematical formula.
    // Format: "Intro: formula"
    let searchSt = st;
    if (searchSt.endsWith(':')) {
      searchSt = searchSt.slice(0, -1).trim();
    }

    const colonIndices = [searchSt.lastIndexOf(':'), searchSt.indexOf(':')].filter((idx) => idx !== -1);
    const seenIndices = new Set<number>();
    for (const cIdx of colonIndices) {
      if (seenIndices.has(cIdx)) continue;
      seenIndices.add(cIdx);
      if (cIdx < searchSt.length - 1) {
        const candidateIntro = searchSt.substring(0, cIdx + 1);
        let candidateFormula = searchSt.substring(cIdx + 1).trim();
        let note = '';
        const noteM = candidateFormula.match(/(\s*\([A-Za-z\s]+\)\.?)$/);
        if (noteM) {
          note = noteM[1];
          candidateFormula = candidateFormula.substring(0, candidateFormula.length - note.length).trim();
        }
        let trailingPeriod = false;
        if (candidateFormula.endsWith('.') && !candidateFormula.endsWith('..')) {
          candidateFormula = candidateFormula.slice(0, -1).trim();
          trailingPeriod = true;
        }
        if (
          candidateFormula.length > 1 &&
          (/[=~^/*<>]/.test(candidateFormula) || candidateFormula.includes('\\') || candidateFormula.includes('lim') || candidateFormula.includes('sqrt')) &&
          !MathNormalizer.hasProseWords(candidateFormula)
        ) {
          const normIntro = MathNormalizer.normalizeText(candidateIntro.replace(/:\s*$/, '').trim()).replace(/^\\\((.*)\\\)$/, '$1') + ':';
          const normFormula = MathNormalizer.normalizePureMath(candidateFormula);
          return `${normIntro}\n\\[ ${normFormula} \\]${note}${trailingPeriod && !note ? '.' : ''}`;
        }
      }
    }

    return MathNormalizer.normalizeText(st);
  }
}
