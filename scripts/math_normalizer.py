"""
Mathematical Content Normalizer for 780 Master Bank Import
Converts extracted plain-text mathematics into canonical LaTeX with MathML compatibility.
Preserves raw source fidelity while producing standard LaTeX representations.
"""

import re

UNIT_TOKENS = [
    'kJ/kg-K', 'J/kg-K', 'kJ/(kg*K)', 'J/(kg*K)', 'kJ/kg.K',
    'kJ/kg', 'J/kg', 'kW/m^2', 'kW/m²', 'W/m^2', 'W/m²', 'W/m-K',
    'm/s^2', 'm/s²', 'm/s', 'km/h', 'kg/s', 'g/s', 'L/s', 'mL/s',
    'm^3/s', 'm³/s', 'kN/m', 'N/m', 'N/C', 'kg/m^3', 'g/cm^3',
    'rad/s', 'kPa', 'MPa', 'GPa', 'bar', 'kN', 'MN', 'kJ', 'MJ',
    'kW', 'MW', 'deg C', '°C', 'deg F', '°F', 'deg/min', 'deg',
    'kg', 'mg', 'm^3', 'm³', 'cm^3', 'cm³', 'mm^3', 'mm³',
    'm^2', 'm²', 'cm^2', 'mm^2', 'mA', 'kA', 'mV', 'kV',
    'kHz', 'MHz', 'GHz', 'Hz', 'mol', 'kmol', 'ohm', 'cm', 'mm', 'km',
    'Pa', 'K', 'N', 'J', 'W', 'V', 'A', 'L', 'g', 's', 'm',
    'knots', 'hours', 'minutes', 'seconds', 'days', 'years', 'ways', 'units'
]

UNIT_REGEX = re.compile(
    r'(?<=\d|\))\s*(' + '|'.join(re.escape(u) for u in UNIT_TOKENS) + r')(?=\b|[^a-zA-Z0-9]|$)',
    re.IGNORECASE
)

CURRENCY_REGEX = re.compile(r'\$([0-9,]+(?:\.[0-9]{2})?[kKmMbB]?)')

ALLOWED_MATH_TOKENS = set([
    'sin', 'cos', 'tan', 'sec', 'csc', 'cot',
    'sinh', 'cosh', 'tanh', 'sech', 'csch', 'coth',
    'arcsin', 'arccos', 'arctan', 'arcsec', 'arccsc', 'arccot',
    'arsinh', 'arcosh', 'artanh',
    'ln', 'log', 'exp', 'sqrt', 'cbrt', 'lim', 'max', 'min',
    'det', 'gcd', 'lcm', 'deg', 'dim', 'ker', 'mod', 'erf', 'erfc',
    'dx', 'dy', 'dz', 'dt', 'dr', 'du', 'dv', 'dw', 'ds', 'dp', 'dq',
    'dydx', 'del', 'inf', 'infinity',
    'cp', 'cv', 'pr', 'cop', 're', 'nu', 'eq', 'avg', 'net', 'tot', 'sat', 'crit', 'atm',
    'in', 'out',
    'kpa', 'mpa', 'gpa', 'pa', 'bar', 'kj', 'mj', 'gj', 'j',
    'kw', 'mw', 'gw', 'w', 'kn', 'mn', 'n', 'kg', 'mg', 'g',
    'mol', 'kmol', 'hz', 'khz', 'mhz', 'ghz', 'ohm', 'rad',
    'rev', 'rpm', 'cfm', 'kelvin', 'celsius', 'degc', 'degf',
    'mv', 'kv', 'ma', 'ka', 'ms', 'ns', 'us', 'ps',
    'cm', 'mm', 'km', 'ft', 'yd', 'mi',
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta',
    'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi',
    'pi', 'rho', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega',
    'frac', 'cdot', 'times', 'div', 'pm', 'mp', 'le', 'ge', 'ne', 'approx',
    'to', 'infty', 'partial', 'sum', 'prod', 'int', 'iint', 'iiint', 'oint',
    'left', 'right', 'mathbf', 'mathrm', 'mathit', 'text', 'quad', 'qquad',
    'circ', 'dot', 'hat', 'bar', 'vec', 'over', 'prime'
])

def has_prose_words(text):
    if not text or not isinstance(text, str):
        return False
    stripped = re.sub(r'\\[a-zA-Z]+', ' ', text)
    stripped = re.sub(r'[{}\[\]\(\)\^_\+\-\*\/\=\<\>\,\;\:\.\$]', ' ', stripped)
    words = re.findall(r'[a-zA-Z]+', stripped)
    for w in words:
        if len(w) < 2:
            continue
        if w.lower() not in ALLOWED_MATH_TOKENS:
            return True
    return False

def find_matching_paren(s, open_idx):
    open_char = s[open_idx]
    close_char = ')' if open_char == '(' else ']' if open_char == '[' else '}'
    depth = 1
    i = open_idx + 1
    while i < len(s):
        if s[i] == open_char:
            depth += 1
        elif s[i] == close_char:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1

def find_matching_paren_backward(s, close_idx):
    close_char = s[close_idx]
    open_char = '(' if close_char == ')' else '[' if close_char == ']' else '{'
    depth = 1
    i = close_idx - 1
    while i >= 0:
        if s[i] == close_char:
            depth += 1
        elif s[i] == open_char:
            depth -= 1
            if depth == 0:
                return i
        i -= 1
    return -1

def protect_units_and_currency(text):
    protected = {}
    counter = [0]

    def repl_curr(m):
        key = f"__CURR_{counter[0]}__"
        counter[0] += 1
        protected[key] = f"\\${m.group(1)}"
        return key

    text = CURRENCY_REGEX.sub(repl_curr, text)

    def repl_unit(m):
        key = f"__UNIT_{counter[0]}__"
        counter[0] += 1
        unit_str = m.group(1)
        if unit_str in ['deg C', '°C']:
            formatted = r'^\circ\text{C}'
        elif unit_str in ['deg F', '°F']:
            formatted = r'^\circ\text{F}'
        elif '²' in unit_str or '^2' in unit_str:
            base = unit_str.replace('²', '').replace('^2', '')
            formatted = f"\\text{{ {base} }}^2"
        elif '³' in unit_str or '^3' in unit_str:
            if unit_str.endswith('/s'):
                base = unit_str.replace('³/s', '').replace('^3/s', '')
                formatted = f"\\text{{ {base} }}^3\\text{{/s}}"
            else:
                base = unit_str.replace('³', '').replace('^3', '')
                formatted = f"\\text{{ {base} }}^3"
        else:
            formatted = f"\\text{{ {unit_str} }}"
        protected[key] = formatted
        return key

    text = UNIT_REGEX.sub(repl_unit, text)
    return text, protected

def restore_protected(text, protected):
    for k, v in protected.items():
        text = text.replace(k, v)
    return text

def normalize_powers(s):
    res = []
    i = 0
    while i < len(s):
        if s[i] == '^':
            if i + 1 < len(s) and s[i+1] in '({[':
                open_idx = i + 1
                close_idx = find_matching_paren(s, open_idx)
                if close_idx != -1:
                    inner = s[open_idx + 1:close_idx]
                    inner_norm = normalize_powers(inner)
                    res.append('^{' + inner_norm + '}')
                    i = close_idx + 1
                    continue
            elif i + 1 < len(s):
                m = re.match(r'^(-?[0-9]+(?:\.[0-9]+)?|[a-zA-Z0-9]+)', s[i+1:])
                if m:
                    res.append('^{' + m.group(1) + '}')
                    i += 1 + len(m.group(1))
                    continue
        res.append(s[i])
        i += 1
    return ''.join(res)

def normalize_roots(s):
    res = []
    i = 0
    while i < len(s):
        if s.startswith('sqrt(', i):
            open_idx = i + 4
            close_idx = find_matching_paren(s, open_idx)
            if close_idx != -1:
                inner = s[open_idx + 1:close_idx]
                inner_norm = normalize_roots(inner)
                res.append('\\sqrt{' + inner_norm + '}')
                i = close_idx + 1
                continue
        res.append(s[i])
        i += 1
    return ''.join(res)

def normalize_fractions(s):
    i = 0
    while i < len(s):
        if s[i] == '/':
            left_str = s[:i].rstrip()
            right_str = s[i+1:].lstrip()

            def extract_denom():
                if right_str.startswith('(') or right_str.startswith('['):
                    right_open = 0
                    right_close = find_matching_paren(right_str, right_open)
                    if right_close != -1:
                        return right_str[right_open + 1:right_close].strip(), right_str[right_close + 1:]
                elif right_str.startswith(r'\sqrt{'):
                    right_close = find_matching_paren(right_str, 5)
                    if right_close != -1:
                        return right_str[:right_close + 1].strip(), right_str[right_close + 1:]
                else:
                    m_denom = re.match(r'^([a-zA-Z0-9_\\]+)', right_str)
                    if m_denom:
                        denom = m_denom.group(1)
                        return denom, right_str[len(denom):]
                return None, None

            if left_str.endswith((')', ']')):
                close_paren_idx = len(left_str) - 1
                open_paren_idx = find_matching_paren_backward(left_str, close_paren_idx)
                if open_paren_idx != -1:
                    num = left_str[open_paren_idx + 1:close_paren_idx].strip()
                    prefix = left_str[:open_paren_idx]
                    denom, suffix = extract_denom()
                    if denom is not None:
                        s = prefix + f"\\frac{{{num}}}{{{denom}}}" + suffix
                        i = len(prefix) + len(f"\\frac{{{num}}}{{{denom}}}")
                        continue
            else:
                m_num = re.search(
                    r'((?:[a-zA-Z0-9_\\!]+(?:\^\{[^}]+\})?(?:\s*(?:\*|\\cdot)\s*)?)?(?:\\sqrt\{[^}]+\}|[a-zA-Z0-9_\\!]+(?:\^\{[^}]+\})?))$',
                    left_str
                )
                if m_num and not left_str.endswith('\\'):
                    num = m_num.group(1).strip()
                    prefix = left_str[:-len(num)]
                    denom, suffix = extract_denom()
                    if denom is not None:
                        s = prefix + f"\\frac{{{num}}}{{{denom}}}" + suffix
                        i = len(prefix) + len(f"\\frac{{{num}}}{{{denom}}}")
                        continue
        i += 1
    return s

def normalize_pure_math(expr):
    if not expr or not expr.strip():
        return ""
    s = expr.strip()

    # Escape unescaped %
    s = re.sub(r'(?<!\\)%', r'\%', s)

    # Unicode replacements
    subs = {
        '²': '^2', '³': '^3', '⁴': '^4', '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9', '⁰': '^0', '⁻': '^-',
        '±': r'\pm ', '×': r'\times ', '÷': r'\div ', '≠': r'\ne ',
        '≤': r'\le ', '≥': r'\ge ', '≈': r'\approx ', '→': r'\to ',
        '·': r'\cdot ', 'π': r'\pi ', 'α': r'\alpha ', 'β': r'\beta ',
        'γ': r'\gamma ', 'Δ': r'\Delta ', 'θ': r'\theta ', 'λ': r'\lambda ',
        'μ': r'\mu ', 'ρ': r'\rho ', 'σ': r'\sigma ', 'τ': r'\tau ',
        'ω': r'\omega ', 'Ω': r'\Omega ', 'η': r'\eta ', 'ε': r'\epsilon ',
        'ν': r'\nu ', 'Q̇': r'\dot{Q}', 'Ẇ': r'\dot{W}', 'ṁ': r'\dot{m}', 'V̇': r'\dot{V}',
        'é': r'\text{é}', 'è': r'\text{è}', 'á': r'\text{á}', 'à': r'\text{à}'
    }
    for k, v in subs.items():
        s = s.replace(k, v)

    # Protect units and currency
    s, protected = protect_units_and_currency(s)

    # Limits
    def repl_lim(m):
        var = m.group(1) or m.group(3)
        val = (m.group(2) or m.group(4)).strip()
        val = re.sub(r'(\d+)\s*-\s*$', r'\1^-', val)
        val = re.sub(r'(\d+)\s*\+\s*$', r'\1^+', val)
        val = re.sub(r'\binf\b|\binfinity\b', lambda _: r'\infty', val, flags=re.IGNORECASE)
        return f'\\lim_{{{var} \\to {val}}} '

    s = re.sub(r'lim\s*(?:\(\s*([a-zA-Z])\s*(?:->|→)\s*([^)]+)\)|([a-zA-Z])\s*(?:->|→)\s*([^\s,;()]+))', repl_lim, s)

    # Derivatives
    s = re.sub(r'\bd\^?2([a-zA-Z])\/d([a-zA-Z])\^?2\b', lambda m: f'\\frac{{d^2 {m.group(1)}}}{{d {m.group(2)}^2}}', s)
    s = re.sub(r'\bd([a-zA-Z])\/d([a-zA-Z])\b', lambda m: f'\\frac{{d{m.group(1)}}}{{d{m.group(2)}}}', s)
    s = re.sub(r'\bdel\s+([a-zA-Z])\/del\s+([a-zA-Z])\b', lambda m: f'\\frac{{\\partial {m.group(1)}}}{{\\partial {m.group(2)}}}', s)

    # Roots
    s = normalize_roots(s)

    # Powers
    s = normalize_powers(s)

    # Fractions
    s = normalize_fractions(s)

    # Subscripts
    def repl_sub(m):
        base = m.group(1)
        sub = m.group(2)
        if sub.isdigit() or len(sub) == 1:
            return f'{base}_{{{sub}}}'
        else:
            return f'{base}_{{\\text{{{sub}}}}}'
    s = re.sub(r'\b([a-zA-Z])_([a-zA-Z0-9]+)\b', repl_sub, s)

    # Variables with digits e.g. P1, P2, T1, T2
    s = re.sub(r'\b([PTVDm])([1234])\b', r'\1_{\2}', s)

    # Functions
    for fn in ['sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'sinh', 'cosh', 'tanh', 'ln', 'log', 'arcsin', 'arccos', 'arctan', 'arcosh', 'arsinh']:
        s = re.sub(r'(?<!\\)\b' + fn + r'\b(?!\s*_\w+)', r'\\' + fn + ' ', s)

    # Multiplication and operators
    s = re.sub(r'\s*\*\s*', r' \\cdot ', s)
    s = s.replace('+-', r'\pm ')
    s = re.sub(r'(?<![=<>!])!=\s*', r'\\ne ', s)
    s = re.sub(r'(?<![=<>!])<=\s*', r'\\le ', s)
    s = re.sub(r'(?<![=<>!])>=\s*', r'\\ge ', s)

    # Restore protected
    s = restore_protected(s, protected)

    s = re.sub(r'\s+', ' ', s).strip()
    return s

def normalize_text_with_inline_math(text):
    if not text or not text.strip():
        return ""

    s = text.strip()

    # Protect list item markers e.g. "1) ", "2) " only when preceded by start of line, period, colon, or newline
    markers = {}
    def repl_marker(m):
        k = f"__MARKER_{len(markers)}__"
        markers[k] = m.group(1)
        return f"{m.group(0)[:-len(m.group(1)) - 1]} {k} "
    s = re.sub(r'(?:^|(?<=[\.\:\n\r]))\s*(\d+\))\s+', repl_marker, s)

    # Detect higher-order and first-order derivatives: d^2y/dx^2, dy/dx, df/dx, du/dt, etc.
    s = re.sub(r'(?<=\b|\s|\()d\^?2([a-zA-Z])\/d([a-zA-Z])\^?2(?=\b|\s|[,;.:\?!]|\))', lambda m: f"\\({normalize_pure_math(m.group(0))}\\)", s)
    s = re.sub(r'(?<=\b|\s|\()d([a-zA-Z])\/d([a-zA-Z])(?=\b|\s|[,;.:\?!]|\))', lambda m: f"\\({normalize_pure_math(m.group(0))}\\)", s)
    s = re.sub(r'(?<=\b|\s|\()del\s+([a-zA-Z])\/del\s+([a-zA-Z])(?=\b|\s|[,;.:\?!]|\))', lambda m: f"\\({normalize_pure_math(m.group(0))}\\)", s, flags=re.IGNORECASE)

    # Detect un-delimited LaTeX macros in prose: \frac{...}{...}, \sqrt{...}, etc.
    s = re.sub(r'(?<![\$\\\(])(\\(?:frac|sqrt|lim|sum|int|iint|iiint|oint|prod|partial|pm|mp|cdot|times)(?:\{[^{}]*\}|\[[^\[\]]*\])*(?:\{[^{}]*\})*)(?![\$\\\)])', lambda m: f"\\({m.group(1)}\\)", s)

    # Standalone numerical fractions (e.g. 1/6, 3/4)
    s = re.sub(r'(?<=\s|^)(\d+)\s*\/\s*(\d+)(?=[,;.\?!]|\s|$)', r'\\(\\frac{\1}{\2}\\)', s)

    # Detect limits: lim (x -> 3) ...
    def repl_lim_phrase(m):
        return f"\\({normalize_pure_math(m.group(0))}\\)"
    s = re.sub(r'\blim\s*(?:\([^)]+\)|[a-zA-Z]\s*->\s*[^\s,;()]+)\s*[^,;.\n]+', repl_lim_phrase, s)

    # Detect equations with =: [left] = [right]
    # Stop before trailing English words that are not units
    eq_pat = re.compile(
        r'\b([a-zA-Z][a-zA-Z0-9_\'\(\)]*)\s*=\s*([a-zA-Z0-9_\^\/\+\-\*\(\)\s\.\{\}\\\|\:\~]+?)(?=\s+(?:in|at|on|by|to|as|or|if|an|is|we|of|so|for|and|with|then|when|where|from|into|over|such|that|[a-zA-Z]{3,})|[,;.\n]|$)'
    )
    def repl_eq(m):
        full = m.group(0).strip()
        right = m.group(2).strip()
        # Skip if pure English text
        if has_prose_words(right) or re.search(r'[a-zA-Z]{4,}\s+[a-zA-Z]{4,}', right):
            return full
        return f"\\({normalize_pure_math(full)}\\)"
    s = eq_pat.sub(repl_eq, s)

    # Restore markers
    for k, v in markers.items():
        s = s.replace(k, v)

    return s

def normalize_step_text(step_text):
    if not step_text or not step_text.strip():
        return ""
    st = step_text.strip()

    # Check for Intro: Equation structure
    m = re.match(r'^(.*?:\s*)(.*)$', st)
    if m:
        intro = m.group(1)
        rest = m.group(2).strip()

        # Check for trailing note in parentheses e.g. (Indeterminate Form).
        note_m = re.search(r'(\s*\([A-Za-z\s]+\)\.?)$', rest)
        note = ''
        formula = rest
        if note_m:
            note = note_m.group(1)
            formula = rest[:-len(note)].strip()

        # If formula has math indicators
        if any(c in formula for c in '=^/*') or 'lim' in formula or 'sqrt' in formula:
            norm_intro = normalize_text_with_inline_math(intro.rstrip(': ')) + ':'
            norm_formula = normalize_pure_math(formula)
            return f"{norm_intro}\n\\[ {norm_formula} \\]{note}"

    return normalize_text_with_inline_math(st)

def extract_canonical_expression(statement):
    """
    Extracts display LaTeX expression if statement matches 'Intro: MathExpression'.
    Returns (clean_prompt, display_latex)
    """
    m = re.match(r'^(.*?:\s*)([a-zA-Z0-9_\^\/\+\-\*\(\)\s=\<\>\.\,\{\}\\\|]+)$', statement.strip())
    if m and not has_prose_words(m.group(2)) and len(m.group(2).strip()) > 3 and any(c in m.group(2) for c in '^/+-*='):
        intro = m.group(1).strip()
        expr = normalize_pure_math(m.group(2))
        return intro, expr
    return statement, ""

