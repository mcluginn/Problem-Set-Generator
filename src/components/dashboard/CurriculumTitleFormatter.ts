/**
 * Academic Curriculum Title Normalizer
 * Normalizes syllabus strings into professional Title Case without altering
 * underlying database definitions.
 */

const KNOWN_TITLE_OVERRIDES: Record<string, string> = {
  'Higher order derivatives': 'Higher-Order Derivatives',
  'Higher-order derivatives': 'Higher-Order Derivatives',
  'Applications of the Derivative(Maxima, minima, related rates)':
    'Applications of Derivatives: Maxima, Minima, and Related Rates',
  'Applications of the Derivative (Maxima, Minima, Related Rates)':
    'Applications of Derivatives: Maxima, Minima, and Related Rates',
  'The slope': 'The Slope',
  'Polynomial curves': 'Polynomial Curves',
  'Analysis of Calculus Methods': 'Analysis of Calculus Methods',
  'Evaluating Limits': 'Evaluating Limits',
  'Limits & Continuity Concepts': 'Limits & Continuity Concepts',
  'Introduction to Calculus': 'Introduction to Calculus',
  'Implicit Differentiation': 'Implicit Differentiation',
  'Partial Differentiation': 'Partial Differentiation',
  'Derivatives of Inverse Trigonometric Functions': 'Derivatives of Inverse Trigonometric Functions',
  'Derivatives of Hyperbolic Functions': 'Derivatives of Hyperbolic Functions',
  'Derivatives of Logarithmic and Exponential Functions': 'Derivatives of Logarithmic & Exponential Functions'
};

const LOWERCASE_OVERRIDES = new Map<string, string>();
for (const [key, val] of Object.entries(KNOWN_TITLE_OVERRIDES)) {
  LOWERCASE_OVERRIDES.set(key.toLowerCase(), val);
  // Also normalize spaces around parentheses
  const spaced = key.replace(/([a-zA-Z])\(/g, '$1 (').toLowerCase();
  LOWERCASE_OVERRIDES.set(spaced, val);
}

const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'with'
]);

const ACRONYMS = new Set(['ODE', 'IVP', 'LLO', 'CLO', 'SO', 'PI', 'ME', 'IE', 'CE', 'EE', 'ECE']);

// Math expressions and notations that should never be transformed to Title Case
const MATH_EXPRESSIONS = new Set([
  'e^x', 'a^x', 'x^x', 'x^n', 'u^n', 'v^n', 'y\'', 'y\'\'', 'y\'\'\'', 'f\'', 'f\'\'',
  'df/dx', 'dy/dx', 'd^2y/dx^2', 'dx', 'dy', 'dz', 'dt', 'du', 'dv',
  'sin', 'cos', 'tan', 'csc', 'sec', 'cot', 'sinh', 'cosh', 'tanh', 'csch', 'sech', 'coth',
  'arcsin', 'arccos', 'arctan', 'ln', 'log', 'exp'
]);

function isMathToken(token: string): boolean {
  const lower = token.toLowerCase();
  if (MATH_EXPRESSIONS.has(lower)) return true;
  // Patterns like e^x, a^x, x^2, x^sin, dx^2, dt^2
  if (/^(d)?[a-zA-Z]\^[a-zA-Z0-9_]+$/.test(token)) return true;
  // Differentials: dx, dy, dt, du, dv, dz, df, dg, etc.
  if (/^d[a-z]$/i.test(token)) return true;
  // Second/nth differentials: d^2y, d^2x, etc.
  if (/^d\^\d+[a-zA-Z]$/i.test(token)) return true;
  // Derivatives like dy/dx, df/dx, d^2y/dx^2
  if (/^d\^?\d*[a-zA-Z]\/d[a-zA-Z](\^\d+)?$/i.test(token)) return true;
  // Primed notation like y', y'', f'
  if (/^[a-zA-Z]['"]+$/.test(token)) return true;
  return false;
}

/**
 * Strips leading sequence numbers like "01. ", "1. ", "12) " from raw syllabus titles
 * so they can be rendered uniformly with dedicated sequence badges.
 */
export function stripLeadingSequenceNumber(title: string): string {
  if (!title) return '';
  return title.replace(/^\d+[\.\)]\s*/, '').trim();
}

/**
 * Maps a unit sequence number or assessment period to academic term names:
 * Unit 01 / PRELIM -> "Prelim"
 * Unit 02 / MIDTERM -> "Midterm"
 * Unit 03 / FINAL -> "Finals"
 */
export function formatUnitPeriodName(unit: { sequence?: number; period?: string }): string {
  if (unit.period === 'PRELIM' || unit.sequence === 1) return 'Prelim';
  if (unit.period === 'MIDTERM' || unit.sequence === 2) return 'Midterm';
  if (unit.period === 'FINAL' || unit.sequence === 3) return 'Finals';
  return unit.sequence ? `Unit ${String(unit.sequence).padStart(2, '0')}` : 'Unit';
}

/**
 * Formats a curriculum title (course, unit, topic, or skill) into standardized Title Case.
 */
export function formatCurriculumTitle(rawTitle: string, options?: { stripNumber?: boolean }): string {
  if (!rawTitle) return '';
  let trimmed = rawTitle.trim();

  // Strip leading number if requested (default: true)
  if (options?.stripNumber !== false) {
    trimmed = stripLeadingSequenceNumber(trimmed);
  }

  // Check direct overrides first (case-insensitive)
  const directMatch = LOWERCASE_OVERRIDES.get(trimmed.toLowerCase());
  if (directMatch) {
    return directMatch;
  }

  // Fix missing spaces before opening parentheses (e.g. "Derivative(Maxima..." -> "Derivative (Maxima...")
  let normalized = trimmed.replace(/([a-zA-Z])\(/g, '$1 (');

  // Check if transformed matches an override
  const normalizedMatch = LOWERCASE_OVERRIDES.get(normalized.toLowerCase());
  if (normalizedMatch) {
    return normalizedMatch;
  }

  // Split tokens preserving delimiters (whitespace, hyphens, colons, parentheses, slashes)
  const tokens = normalized.split(/(\s+|[-:()&,/])/);

  let isFirstWord = true;
  const result: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;

    // Punctuation and whitespace
    if (/^[\s-:()&,/]+$/.test(token)) {
      result.push(token);
      if (token.includes(':') || token.includes('-') || token.includes('/')) {
        isFirstWord = true; // Capitalize immediately following hyphen, colon, slash
      }
      continue;
    }

    // Preserve math notation exactly
    if (isMathToken(token)) {
      result.push(token);
      isFirstWord = false;
      continue;
    }

    const lower = token.toLowerCase();

    // Known acronyms
    if (ACRONYMS.has(token.toUpperCase())) {
      result.push(token.toUpperCase());
      isFirstWord = false;
      continue;
    }

    // Capitalize if first word, or not a minor word
    if (isFirstWord || !MINOR_WORDS.has(lower)) {
      result.push(lower.charAt(0).toUpperCase() + lower.slice(1));
    } else {
      result.push(lower);
    }

    isFirstWord = false;
  }

  return result.join('');
}
