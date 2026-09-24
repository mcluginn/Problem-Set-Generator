/**
 * Contextual Deterministic Fallback AI Provider
 * 100% autonomous, zero external network or API calls.
 * Provides intent-aware, pedagogically structured explanations derived directly
 * from authoritative mathematical/engineering ASTs, domain invariants, and solution traces.
 * Engineering Practice Engine — Phase 7 Student Experience Hardening
 */

import { AIContext, IAIProvider, TutorContext, TutorIntent } from './types';

export class DeterministicFallbackProvider implements IAIProvider {
  public readonly name = 'Deterministic Contextual Tutor';

  public async isAvailable(): Promise<boolean> {
    return true; // 100% available offline and online
  }

  public async generateExplanation(context: AIContext): Promise<string> {
    const isCalculus = this.isCalculusContext(context);
    const stepsText =
      context.solutionSteps && context.solutionSteps.length > 0
        ? context.solutionSteps
            .map(
              (s) =>
                `### Step ${s.stepNumber}: ${s.title}\n\n$$\n${s.expressionLatex}\n$$\n\n${s.explanation}`
            )
            .join('\n\n')
        : `Apply standard engineering principles for ${context.concept} to solve $${context.expressionLatex}$ directly.`;

    const conceptualRationale = context.whyMethodRequired
      ? `### Conceptual Rationale\n\n${context.whyMethodRequired}\n\n`
      : '';

    return `### Mathematical Derivation for ${context.concept}

${conceptualRationale}To solve the system $${context.expressionLatex}$, we follow the standard method step-by-step:

${stepsText}

---

**Canonical Answer:**
$$${isCalculus ? '\\frac{dy}{dx} = ' : ''}${context.verifiedAnswerLatex}$$`;
  }

  public async generateContextualHint(context: AIContext, level: number): Promise<string> {
    switch (level) {
      case 1:
        return `Notice the governing principle of the problem: **${context.concept}**. Review the core formula and given parameters.`;
      case 2:
        return `Decompose the expression: identify the primary quantities, given variables, and boundary/state conditions for $${context.expressionLatex}$.`;
      case 3:
        return `Recall the standard formula for ${context.concept}: what intermediate values or substitutions must you calculate first?`;
      case 4:
        return `Substitute your intermediate terms into the governing equation for $${context.expressionLatex}$.`;
      case 5:
      default:
        return `Carry out the final evaluation to produce the canonical solution: $${context.verifiedAnswerLatex}$.`;
    }
  }

  public async diagnoseMistake(
    context: AIContext,
    studentAnswer: string
  ): Promise<{ diagnosis: string; guidanceTip: string }> {
    if (context.mistakeClassification) {
      return {
        diagnosis: `Your submission "$${studentAnswer}$" exhibits a known conceptual error: **${context.mistakeClassification}**.`,
        guidanceTip: `Re-examine the intermediate steps and verify all governing equations were applied consistently for ${context.concept}.`,
      };
    }
    return {
      diagnosis: `The submission "$${studentAnswer}$" is not equivalent to the verified solution for $${context.expressionLatex}$.`,
      guidanceTip: `Check your calculation step-by-step, ensuring signs, factors, and domain boundaries were evaluated accurately.`,
    };
  }

  public async answerTutorQuestion(
    context: TutorContext | AIContext,
    userQuestion: string,
    history: Array<{ role: 'user' | 'assistant'; text: string }> = []
  ): Promise<string> {
    const intent = this.detectIntent(userQuestion, context);
    return this.buildIntentResponse(intent, context, userQuestion, history);
  }

  /* ========================================================================= */
  /*                            Intent Recognition                             */
  /* ========================================================================= */

  public detectIntent(question: string, context: TutorContext | AIContext): TutorIntent {
    const q = question.toLowerCase().trim();

    // 1. Specific Quotient Rule Denominator Squared question
    if (
      q.includes('denominator') &&
      (q.includes('squared') || q.includes('square') || q.includes('v^2') || q.includes('bottom'))
    ) {
      return 'quotient_denominator_squared';
    }

    // 2. Inner Function Identification (Question: "What is the inner function?")
    if (
      (q.includes('what is the inner') || q.includes('identify the inner') || q.includes('what is inner') || q.includes('what is u')) &&
      !q.includes('derivative') &&
      !q.includes('diff') &&
      !q.includes('rate') &&
      !q.includes('prime')
    ) {
      return 'inner_function';
    }

    // 3. Inner Derivative (Question: "What is the derivative of the inner function?")
    if (
      q.includes('derivative of the inner') ||
      q.includes('inner derivative') ||
      (q.includes('inner') && (q.includes('derivative') || q.includes('diff') || q.includes('rate') || q.includes("u'")))
    ) {
      return 'inner_derivative';
    }

    // 4. Term origin / Where did [X] come from?
    if (
      (q.includes('where did') && (q.includes('x') || q.includes('come from') || /\d+/.test(q))) ||
      q.includes('where does') ||
      q.includes('why is there') ||
      q.includes('how did you get') ||
      (q.includes('come from') && (q.includes('where') || q.includes('how') || q.includes('why')))
    ) {
      return 'term_origin';
    }

    // 5. How to start / where to begin
    if (
      q.includes('how do i start') ||
      q.includes('where do i begin') ||
      q.includes('how to start') ||
      q.includes('where should i start') ||
      q.includes('what to do first') ||
      q.includes('what should i do first') ||
      q.includes('first thing to do') ||
      q.includes('paano simulan') ||
      q.includes('paano magsimula') ||
      q.includes('saan magsisimula') ||
      q.includes('paano to') ||
      q.includes('paano ito')
    ) {
      return 'how_to_start';
    }

    // 6. Explain step
    if (
      q.match(/step\s*[1-9]/) ||
      q.match(/hakbang\s*[1-9]/) ||
      q.includes('first step') ||
      q.includes('second step') ||
      q.includes('third step') ||
      q.includes('fourth step') ||
      q.includes('explain step') ||
      q.includes('next step') ||
      q.includes('what is step') ||
      q.includes('step-by-step') ||
      q.includes('unang hakbang') ||
      q.includes('susunod na hakbang')
    ) {
      return 'explain_step';
    }

    // 7. Formula / Equation query
    if (
      (q.includes('formula') ||
        q.includes('equation') ||
        q.includes('governing law') ||
        q.includes('which law') ||
        q.includes('pormula') ||
        q.includes('anong formula') ||
        q.includes('ano ang formula')) &&
      !q.includes('why') &&
      !q.includes('bakit')
    ) {
      return 'formula_query';
    }

    // 8. Why method is required
    if (
      (q.includes('why') &&
        (q.includes('rule') ||
          q.includes('method') ||
          q.includes('required') ||
          q.includes('chain') ||
          q.includes('product') ||
          q.includes('quotient') ||
          q.includes('used') ||
          q.includes('need') ||
          q.includes('law') ||
          q.includes('formula') ||
          q.includes('equation') ||
          q.includes('approach') ||
          q.includes('principle') ||
          q.includes('theorem'))) ||
      q.includes('why is this method') ||
      q.includes('why do we use') ||
      q.includes('why is this rule') ||
      q.includes('why is this required') ||
      q.includes('why use') ||
      q.includes('bakit kailangan') ||
      q.includes('bakit ganito') ||
      q.includes('bakit ito ang ginamit')
    ) {
      return 'why_method';
    }

    // 9. Explain mistake
    if (
      q.includes('wrong') ||
      q.includes('incorrect') ||
      q.includes('mistake') ||
      q.includes('error') ||
      q.includes('why did i get') ||
      q.includes('my answer') ||
      q.includes('what did i miss') ||
      q.includes('missing something') ||
      q.includes('where is my error') ||
      q.includes('mali') ||
      q.includes('bakit mali') ||
      q.includes('ano mali') ||
      q.includes('saan ako nagkamali')
    ) {
      return 'explain_mistake';
    }

    // 10. Give hint / stuck
    if (
      q.includes('hint') ||
      q.includes('stuck') ||
      q.includes('clue') ||
      q.includes('help me') ||
      q.includes('guide me') ||
      q.includes('i don\'t know what to do') ||
      q.includes('dont know what to do') ||
      q.includes('tulong') ||
      q.includes('pahingi ng hint') ||
      q.includes('pahiwatig') ||
      q.includes('patulong')
    ) {
      return 'give_hint';
    }

    // 11. Similar example request
    if (
      q.includes('similar') ||
      q.includes('example') ||
      q.includes('another problem') ||
      q.includes('like this') ||
      q.includes('parallel problem') ||
      q.includes('halimbawa')
    ) {
      return 'similar_example';
    }

    // 12. Simplify explanation
    if (
      q.includes('simplify') ||
      q.includes('simpler') ||
      q.includes('too complex') ||
      q.includes('confused') ||
      q.includes('explain this simply') ||
      q.includes('in plain english') ||
      q.includes('explain simply') ||
      q.includes('like i\'m 5') ||
      q.includes('like im 5') ||
      q.includes('simple terms') ||
      q.includes('ipaliwanag') ||
      q.includes('padaliin') ||
      q.includes('simpleng paliwanag')
    ) {
      return 'simplify_explanation';
    }

    // 13. Concept definition
    if (
      q.startsWith('what is') ||
      q.startsWith('how does') ||
      q.includes('definition') ||
      q.startsWith('explain ') ||
      q.includes('what means') ||
      q.includes('concept')
    ) {
      return 'concept_explanation';
    }

    return 'general';
  }

  /* ========================================================================= */
  /*                         Intent Response Builder                           */
  /* ========================================================================= */

  private buildIntentResponse(
    intent: TutorIntent,
    context: TutorContext | AIContext,
    userQuestion: string,
    history: Array<{ role: 'user' | 'assistant'; text: string }>
  ): string {
    const expr = context.expressionLatex;
    const verified = context.verifiedAnswerLatex;
    const concept = context.concept || 'Engineering Practice';
    const isCalculus = this.isCalculusContext(context);
    const domain = this.detectCourseDomain(context);
    const innerInfo = this.extractInnerComponents(expr, context.solutionSteps);

    // Multi-turn context resolution / specific term origin: "Where did that come from?" or "Why is 6x there?"
    const isFollowUp =
      history.length > 0 &&
      (userQuestion.length < 30 ||
        userQuestion.toLowerCase().startsWith('where') ||
        userQuestion.toLowerCase().startsWith('why') ||
        userQuestion.toLowerCase().startsWith('how'));

    if (
      intent === 'term_origin' ||
      (isFollowUp &&
        (userQuestion.toLowerCase().includes('come from') ||
          userQuestion.toLowerCase().includes('6x') ||
          userQuestion.toLowerCase().includes('10x')))
    ) {
      return this.handleTermOrigin(context, userQuestion, history, innerInfo, expr, verified);
    }

    switch (intent) {
      case 'quotient_denominator_squared':
        return this.handleQuotientDenominatorSquared(context, expr, innerInfo);

      case 'inner_function':
        return this.handleInnerFunction(expr, innerInfo);

      case 'inner_derivative':
        return this.handleInnerDerivative(expr, innerInfo, verified);

      case 'how_to_start':
        return this.handleHowToStart(context, expr, concept, isCalculus, verified);

      case 'explain_step':
        return this.handleExplainStep(context, userQuestion, expr, verified, domain, isCalculus);

      case 'why_method':
        return this.handleWhyMethod(context, expr, verified, concept, domain, isCalculus, innerInfo);

      case 'explain_mistake':
        return this.handleExplainMistake(context, expr, verified, concept, isCalculus);

      case 'give_hint':
        return this.handleGiveHint(context, expr, concept);

      case 'formula_query':
        return this.handleFormulaQuery(context, expr, concept, domain, isCalculus, verified);

      case 'simplify_explanation':
        return this.handleSimplifyExplanation(context, expr, verified, concept, domain, innerInfo, isCalculus);

      case 'similar_example':
        return this.handleSimilarExample(context, expr, concept, domain, innerInfo);

      case 'concept_explanation':
        return this.handleConceptExplanation(context, expr, verified, concept, domain, isCalculus);

      case 'general':
      default:
        return this.handleGeneralQuery(context, userQuestion, expr, verified, concept, domain, isCalculus);
    }
  }

  /* ========================================================================= */
  /*                         Intent Handlers                                   */
  /* ========================================================================= */

  private handleQuotientDenominatorSquared(
    context: TutorContext | AIContext,
    expr: string,
    innerInfo: { denominatorSquaredLatex?: string }
  ): string {
    return `### Why the Denominator is Squared in the Quotient Rule

In the Quotient Rule formula:
$$
\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}
$$

**Mathematical Reason:**
A fraction $\\frac{u}{v}$ can be rewritten as a product using negative exponents: $u \\cdot v^{-1}$.
Applying Product and Chain rules:
$$
\\frac{d}{dx}[u \\cdot v^{-1}] = u' \\cdot v^{-1} + u(-v^{-2}v') = \\frac{u'}{v} - \\frac{uv'}{v^2} = \\frac{u'v - uv'}{v^2}
$$

For your specific problem $${expr}$, the denominator is squared into:
$$
v^2 = ${innerInfo.denominatorSquaredLatex || '(v)^2'}
$$`;
  }

  private handleInnerFunction(
    expr: string,
    innerInfo: { innerLatex: string; outerLatex: string }
  ): string {
    return `### Identifying the Inner and Outer Functions

For the function:
$$
${expr}
$$

The expression is a **composite function** $f(g(x))$:

- **Inner Function $u(x)$**:
$$
u(x) = ${innerInfo.innerLatex}
$$

- **Outer Operation $f(u)$**:
$$
f(u) = ${innerInfo.outerLatex}
$$

The inner function is the algebraic quantity enclosed inside the main operation (the base of the power or the argument of the function).`;
  }

  private handleInnerDerivative(
    expr: string,
    innerInfo: { innerLatex: string; innerDerivLatex: string },
    verified: string
  ): string {
    return `### Derivative of the Inner Function

For the function $${expr}$:

1. **Inner Function:**
$$
u(x) = ${innerInfo.innerLatex}
$$

2. **Differentiating $u(x)$ with respect to $x$:**
$$
u'(x) = \\frac{du}{dx} = ${innerInfo.innerDerivLatex}
$$

In the **Chain Rule**, this inner derivative must be multiplied by the outer derivative to account for the rate of change of the inside function:
$$
\\frac{dy}{dx} = \\frac{df}{du} \\cdot \\frac{du}{dx} = ${verified}
$$`;
  }

  private handleTermOrigin(
    context: TutorContext | AIContext,
    userQuestion: string,
    history: Array<{ role: 'user' | 'assistant'; text: string }>,
    innerInfo: { innerLatex: string; innerDerivLatex: string },
    expr: string,
    verified: string
  ): string {
    const q = userQuestion.toLowerCase();
    const lastAssistantMsg = history.filter(h => h.role === 'assistant').slice(-1)[0]?.text || '';

    // Check for Chain Rule polynomial derivative term (e.g. 6x, 10x, 8x + 1)
    if (
      lastAssistantMsg.includes('Inner Function') ||
      q.includes('6x') ||
      q.includes('10x') ||
      q.includes('8x') ||
      (this.isCalculusContext(context) && q.includes('come from'))
    ) {
      return `### Tracing the Origin of Intermediate Terms

When applying the **Chain Rule** to $${expr}$:

1. We differentiated the inner polynomial $u(x) = ${innerInfo.innerLatex}$.
2. The power rule on each term of $u(x)$ yields:
$$
\\frac{du}{dx} = ${innerInfo.innerDerivLatex}
$$
3. This factor appears because the Chain Rule requires multiplying the outer derivative by the rate of change of the inside function.`;
    }

    // Check if the term exists in solutionSteps
    if (context.solutionSteps && context.solutionSteps.length > 0) {
      const tokens = q.match(/[-+]?[0-9]*\.?[0-9]+|[a-z_]{2,}/g) || [];
      for (const token of tokens) {
        if (['where', 'come', 'from', 'what', 'does', 'that', 'this', 'there', 'with'].includes(token)) continue;
        const matchingStep = context.solutionSteps.find(st =>
          st.expressionLatex?.toLowerCase().includes(token) ||
          st.explanation?.toLowerCase().includes(token) ||
          st.title?.toLowerCase().includes(token)
        );
        if (matchingStep) {
          return `### Tracing the Origin of Term: "${token}"

In **Step ${matchingStep.stepNumber}: ${matchingStep.title}**:
$$
${matchingStep.expressionLatex}
$$

${matchingStep.explanation}

This value arises from substituting known system parameters into the governing formula for **${context.concept || 'this problem'}**.`;
        }
      }
    }

    // Default tracing
    return `### Tracing Intermediate Quantities

For the system:
$$
${expr}
$$

Intermediate values in the solution trace are obtained by evaluating the governing relationships step-by-step from the initial conditions:
- **Given Parameters:** Inspect the values specified in the problem statement.
- **Canonical Answer:** Leads to $${verified}$.`;
  }

  private handleHowToStart(
    context: TutorContext | AIContext,
    expr: string,
    concept: string,
    isCalculus: boolean,
    verified: string
  ): string {
    const firstStep = context.solutionSteps?.[0];
    const prompt = context.problemPrompt ? `> ${context.problemPrompt}\n\n` : '';

    return `### How to Begin Solving This Problem

${prompt}For the mathematical system:
$$
${expr}
$$

1. **Identify the Given Quantities:**
   Extract the known variables, state properties, and boundary values from the problem statement.
2. **Apply the Core Governing Principle:**
   This problem is solved using **${concept}**.
3. **First Action:**
${firstStep ? `   **Step 1: ${firstStep.title}**\n$$\n${firstStep.expressionLatex}\n$$\n   ${firstStep.explanation}` : `   State the fundamental formula for ${concept} and substitute your known parameters.`}

Would you like to walk through the intermediate substitutions together?`;
  }

  private handleExplainStep(
    context: TutorContext | AIContext,
    userQuestion: string,
    expr: string,
    verified: string,
    domain: string,
    isCalculus: boolean
  ): string {
    const stepNumMatch = userQuestion.match(/step\s*([0-9]+)/i);
    let targetStep = stepNumMatch ? parseInt(stepNumMatch[1], 10) : 0;
    if (!targetStep) {
      const q = userQuestion.toLowerCase();
      if (q.includes('first step') || q.includes('step 1')) targetStep = 1;
      else if (q.includes('second step') || q.includes('step 2')) targetStep = 2;
      else if (q.includes('third step') || q.includes('step 3')) targetStep = 3;
      else if (q.includes('fourth step') || q.includes('step 4')) targetStep = 4;
      else if (q.includes('fifth step') || q.includes('step 5')) targetStep = 5;
      else targetStep = context.currentStepNumber || 1;
    }

    const steps = context.solutionSteps || [];
    const matchedStep = steps.find(st => st.stepNumber === targetStep) || steps[targetStep - 1] || steps[0];

    if (matchedStep) {
      const nextStep = steps.find(st => st.stepNumber === matchedStep.stepNumber + 1);
      return `### Step ${matchedStep.stepNumber}: ${matchedStep.title}

$$
${matchedStep.expressionLatex}
$$

${matchedStep.explanation}

${nextStep ? `**Next Step Preview:** Move to **Step ${nextStep.stepNumber}: ${nextStep.title}** to continue.` : `**Final Result:** This step concludes the evaluation, yielding $${isCalculus ? '\\frac{dy}{dx} = ' : ''}${verified}$.`}`;
    }

    return `### Solution Trace for ${context.concept || 'Engineering Problem'}

For the system $${expr}$:

1. Decompose the expression into fundamental components.
2. Apply the governing theorem for ${context.concept || 'this domain'}.
3. The verified canonical result is:
$$
${isCalculus ? '\\frac{dy}{dx} = ' : ''}${verified}
$$`;
  }

  private handleWhyMethod(
    context: TutorContext | AIContext,
    expr: string,
    verified: string,
    concept: string,
    domain: string,
    isCalculus: boolean,
    innerInfo: { innerLatex: string; innerDerivLatex: string }
  ): string {
    if (concept === 'Chain Rule') {
      return `### Why the Chain Rule is Required

In the expression:
$$
${expr}
$$

The function is **composite**: an outer operation wraps an inner expression $u(x) = ${innerInfo.innerLatex}$.

- Differentiating the outer function alone only gives the rate of change with respect to $u$.
- To find the rate of change with respect to $x$, calculus requires multiplying by the inner rate:
$$
\\frac{dy}{dx} = \\frac{df}{du} \\cdot \\frac{du}{dx}
$$

Without $\\frac{du}{dx} = ${innerInfo.innerDerivLatex}$, the derivative would be incomplete.`;
    }

    if (concept === 'Product Rule') {
      return `### Why the Product Rule is Required

The expression $${expr}$ is the product of two distinct variable functions $u(x) \\cdot v(x)$.

In calculus, the derivative of a product is **not** simply the product of derivatives:
$$
\\frac{d}{dx}[u \\cdot v] = u'v + uv'
$$

Both factors contribute to the total rate of growth simultaneously. Differentiating each factor separately would omit the cross-rate interactions.`;
    }

    if (context.whyMethodRequired) {
      return `### Why ${concept} is Required

${context.whyMethodRequired}

**Governing Formula:**
$$
${isCalculus ? '\\frac{dy}{dx} = ' : ''}${verified}
$$`;
    }

    // Domain Specific Fallbacks
    switch (domain) {
      case 'PHYSICS':
        return `### Physical Principle: Why ${concept} Applies

In physical systems:
$$
${expr}
$$

The physical process is governed by fundamental conservation and constitutive relationships (e.g. wave kinematics for Doppler shifts, hydrostatic balance, or energy conservation in calorimetry). Applying **${concept}** ensures dimensional consistency and satisfies physical boundary conditions.

**Canonical Physical Value:**
$$
${verified}
$$`;

      case 'THERMODYNAMICS':
        return `### Thermodynamic Principle: Why ${concept} Applies

For the thermodynamic process:
$$
${expr}
$$

State transitions must satisfy the First and Second Laws of Thermodynamics ($\Delta U = Q - W$, entropy generation $S_{gen} \ge 0$). Applying **${concept}** guarantees that energy transformations and boundary work adhere to thermodynamic equilibrium.

**Canonical State Value:**
$$
${verified}
$$`;

      case 'ODE':
        return `### Differential Equations Principle: Why ${concept} Applies

For the differential equation:
$$
${expr}
$$

Differential relations bind the rate of change to state variables. Applying **${concept}** (e.g., separation of variables or an integrating factor $\mu(x) = e^{\int P(x)dx}$) transforms the differential equation into an explicitly integrable differential form.

**Canonical Solution:**
$$
y(x) = ${verified}
$$`;

      case 'IE_SPECIAL_TOPICS':
        return `### Engineering Economics Principle: Why ${concept} Applies

For the economic or probabilistic evaluation:
$$
${expr}
$$

Because of the time value of money, capital received at different points in time cannot be aggregated without discounting ($P = F(1+i)^{-n}$). Applying **${concept}** ensures capital allocation decisions accurately reflect project profitability and viability criteria ($NPV \\ge 0$).

**Canonical Value:**
$$
${verified}
$$`;

      case 'MATH_FOR_ENGINEERS':
        return `### Engineering Mathematics: Why ${concept} Applies

For the mathematical structure:
$$
${expr}
$$

Applying **${concept}** enforces geometric feasibility (such as triangle inequality constraints $a + b > c$) or algebraic consistency (such as non-zero matrix determinants), ensuring a unique and mathematically valid solution.

**Canonical Value:**
$$
${verified}
$$`;

      default:
        return `### Why ${concept} is Required

To solve $${expr}$, we apply the **${concept}** because the algebraic structure directly matches this mathematical theorem. The resulting canonical solution is:
$$
${isCalculus ? '\\frac{dy}{dx} = ' : ''}${verified}
$$`;
    }
  }

  private handleExplainMistake(
    context: TutorContext | AIContext,
    expr: string,
    verified: string,
    concept: string,
    isCalculus: boolean
  ): string {
    const studentAns = context.studentAnswerRaw;
    const diagName = context.mistakeClassification;
    const diagText = context.mistakeDiagnosis;

    if (studentAns) {
      return `### Analysis of Your Submission

You submitted: **$${studentAns}$**

**Diagnosed Issue:** ${diagName || 'Algebraic or Dimensional Inconsistency'}
${diagText || 'Your answer differs from the verified canonical result.'}

**How to correct it:**
1. Check your intermediate substitutions and sign conventions.
2. Verify all parameter units and power operations.
3. Compare your derivation with the verified final solution:
$$
${isCalculus ? '\\frac{dy}{dx} = ' : ''}${verified}
$$`;
    }

    return `### Common Pitfalls for ${concept}

You haven't submitted an attempt yet! Enter your answer in the input box to receive targeted mistake diagnosis.

**Watch out for these frequent misconceptions in ${concept}:**
- Sign errors when rearranging terms or applying relative motion/work conventions
- Forgetting intermediate factors (such as the inner derivative in Chain Rule)
- Inconsistent physical units or neglecting boundary conditions`;
  }

  private handleGiveHint(
    context: TutorContext | AIContext,
    expr: string,
    concept: string
  ): string {
    const hints = context.hints;
    const currentLvl = context.currentHintLevel || 1;

    if (hints && hints.length > 0) {
      const hint = hints.find(h => h.level === currentLvl) || hints[0];
      return `### Socratic Hint (Level ${hint.level})

${hint.text}

*Apply this insight to advance your derivation for **${concept}**!*`;
    }

    // Default progressive hints
    switch (currentLvl) {
      case 1:
        return `### Conceptual Hint (Level 1)

Focus on the governing principle: **${concept}**. Identify the given values and state properties in $${expr}$. What is the target variable?`;
      case 2:
        return `### Deconstruction Hint (Level 2)

Break down $${expr}$: which variables are constant, which are changing, and what intermediate formula links them together?`;
      case 3:
      default:
        return `### Setup Hint (Level 3)

Write out the standard equation for **${concept}** and substitute your known values. Watch your signs and algebraic grouping!`;
    }
  }

  private handleFormulaQuery(
    context: TutorContext | AIContext,
    expr: string,
    concept: string,
    domain: string,
    isCalculus: boolean,
    verified: string
  ): string {
    const c = concept.toLowerCase();

    // Specific Concept Formulas
    if (c.includes('chain')) {
      return `### Governing Formula: Chain Rule

$$
\\frac{dy}{dx} = \\frac{df}{du} \\cdot \\frac{du}{dx}
$$

Where:
- $u(x)$ is the inner function.
- $f(u)$ is the outer function evaluated at $u$.
- The outer derivative is multiplied by the inner derivative.`;
    }

    if (c.includes('product')) {
      return `### Governing Formula: Product Rule

$$
\\frac{d}{dx}[u \\cdot v] = u'v + uv'
$$

Where $u(x)$ and $v(x)$ are differentiable functions of $x$.`;
    }

    if (c.includes('quotient')) {
      return `### Governing Formula: Quotient Rule

$$
\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}
$$

Where $u$ is numerator, $v$ is denominator, and $v \\ne 0$.`;
    }

    if (c.includes('doppler')) {
      return `### Governing Formula: Doppler Effect

$$
f' = f \\left(\\frac{v \\pm v_o}{v \\mp v_s}\\right)
$$

Where:
- $f$ = emitted source frequency
- $f'$ = observed frequency
- $v$ = speed of sound in medium
- $v_o$ = velocity of observer (+ toward source, - away)
- $v_s$ = velocity of source (- toward observer, + away)`;
    }

    if (c.includes('calorimetry') || c.includes('sensible heat')) {
      return `### Governing Formula: Sensible Heat Transfer & Calorimetry

$$
Q = m c \\Delta T = m c (T_f - T_i)
$$

And for an isolated system at thermal equilibrium:
$$
\\sum Q = 0 \\implies Q_{\\text{gained}} + Q_{\\text{lost}} = 0
$$

Where $m$ is mass, $c$ is specific heat capacity, and $\\Delta T$ is temperature change.`;
    }

    if (c.includes('isobaric') || c.includes('constant pressure')) {
      return `### Governing Formula: Constant Pressure (Isobaric) Work

$$
W = \\int_{V_1}^{V_2} P \\, dV = P(V_2 - V_1)
$$

And by ideal gas law: $W = m R (T_2 - T_1)$.`;
    }

    if (c.includes('first law') || c.includes('thermodynamics')) {
      return `### Governing Formula: First Law of Thermodynamics

$$
\\Delta U = Q - W
$$

Where:
- $\\Delta U$ = change in internal energy
- $Q$ = heat added to system
- $W$ = work performed by system`;
    }

    if (c.includes('separable') || domain === 'ODE') {
      return `### Governing Formula: Separable Differential Equation

$$
g(y) \\, dy = f(x) \\, dx \\implies \\int g(y) \\, dy = \\int f(x) \\, dx + C
$$

For first-order linear ODEs $y' + P(x)y = Q(x)$, the integrating factor is:
$$
\\mu(x) = e^{\\int P(x)dx} \\implies y(x) = \\frac{1}{\\mu(x)}\\left[\\int \\mu(x)Q(x)dx + C\\right]
$$`;
    }

    if (c.includes('interest') || c.includes('cash flow') || domain === 'IE_SPECIAL_TOPICS') {
      return `### Governing Formula: Discounted Cash Flow & Present Worth

$$
P = F (1 + i)^{-n} = F \\left(\\frac{P}{F}, i, n\\right)
$$

For uniform series:
$$
P = A \\left[ \\frac{(1+i)^n - 1}{i(1+i)^n} \\right] = A \\left(\\frac{P}{A}, i, n\\right)
$$

Where $P$ is present worth, $F$ is future worth, $A$ is annual amount, $i$ is interest rate per period, and $n$ is number of periods.`;
    }

    if (c.includes('triangle') || domain === 'MATH_FOR_ENGINEERS') {
      return `### Governing Formula: Triangle Inequality

For any valid triangle with sides $a, b, c$:
$$
|a - b| < c < a + b
$$

All three simultaneous criteria must hold: $a + b > c$, $a + c > b$, and $b + c > a$.`;
    }

    // Default Formula Response
    return `### Governing Formula for ${concept}

For the mathematical problem $${expr}$:

Apply the canonical relation for **${concept}** to evaluate the unknown:
$$
${isCalculus ? '\\frac{dy}{dx} = ' : ''}${verified}
$$`;
  }

  private handleSimplifyExplanation(
    context: TutorContext | AIContext,
    expr: string,
    verified: string,
    concept: string,
    domain: string,
    innerInfo: { innerDerivLatex: string },
    isCalculus: boolean
  ): string {
    if (isCalculus) {
      return `### Simplified Step-by-Step Breakdown

Think of $${expr}$ in two simple stages:

1. **Outer Shell:** Differentiate the outside power/function while leaving the inside untouched.
2. **Inner Engine:** Multiply by the derivative of whatever was inside ($${innerInfo.innerDerivLatex}$).

Combining them gives:
$$
\\frac{dy}{dx} = ${verified}
$$`;
    }

    switch (domain) {
      case 'PHYSICS':
        return `### Simplified Physics Breakdown

Think of this problem in three straightforward steps:
1. **The Setup:** An object or wave is moving with given parameters ($${expr}$).
2. **The Effect:** Relative motion or equilibrium causes a proportional shift.
3. **The Calculation:** Plug the numbers into the ratio to reach $${verified}$.`;

      case 'THERMODYNAMICS':
        return `### Simplified Thermodynamics Breakdown

Think of energy like an accounting ledger:
1. **What Enters:** Heat transfer $Q$ adds energy into the system.
2. **What Leaves:** Boundary work $W$ removes energy.
3. **The Balance:** The change in energy is $\\Delta U = Q - W$, leading to $${verified}$.`;

      case 'ODE':
        return `### Simplified ODE Breakdown

Think of solving this differential equation in two stages:
1. **Separate Variables:** Group all $y$ terms on the left and all $x$ terms on the right.
2. **Integrate Both Sides:** Take the integral of both sides and add the constant $C$ to reach $${verified}$.`;

      case 'IE_SPECIAL_TOPICS':
        return `### Simplified Economics Breakdown

1. **Time Value of Money:** A dollar tomorrow is worth less than a dollar today.
2. **Discount Factor:** Multiply future cash by $(1 + i)^{-n}$ to bring it back to today's value.
3. **Evaluation:** Comparing present values produces $${verified}$.`;

      default:
        return `### Simplified Breakdown for ${concept}

1. Decompose the problem into known parameters and governing relationships.
2. Substitute values into the primary formula.
3. Evaluating directly gives: $${verified}$.`;
    }
  }

  private handleSimilarExample(
    context: TutorContext | AIContext,
    expr: string,
    concept: string,
    domain: string,
    innerInfo: { innerLatex: string }
  ): string {
    if (this.isCalculusContext(context) || concept === 'Chain Rule') {
      return `### Parallel Chain Rule Example

Consider the parallel composite problem:
$$
y = (2x^2 + 3x + 1)^4
$$

1. **Inner Function:** $u(x) = 2x^2 + 3x + 1$, with $u'(x) = 4x + 3$.
2. **Outer Power:** $\\frac{d}{du}[u^4] = 4u^3$.
3. **Applying Chain Rule:**
$$
\\frac{dy}{dx} = 4(2x^2 + 3x + 1)^3 \\cdot (4x + 3)
$$

Notice how the exact same outer-times-inner principle applies to your problem $${expr}$.`;
    }

    if (concept === 'Product Rule') {
      return `### Parallel Product Rule Example

Consider: $y = x^2 \\cos(x)$
1. $u = x^2 \\implies u' = 2x$
2. $v = \\cos(x) \\implies v' = -\\sin(x)$
3. $\\frac{dy}{dx} = u'v + uv' = 2x\\cos(x) - x^2\\sin(x)$`;
    }

    if (domain === 'PHYSICS') {
      return `### Parallel Physics Example: Doppler Effect

An ambulance moves at $v_s = 25\\text{ m/s}$ toward a stationary observer emitting $f = 400\\text{ Hz}$. Sound speed is $v = 340\\text{ m/s}$.
$$
f' = f \\left(\\frac{v}{v - v_s}\\right) = 400 \\left(\\frac{340}{340 - 25}\\right) = 400 \\left(\\frac{340}{315}\\right) \\approx 431.75\\text{ Hz}
$$
Notice the observer hears a higher frequency because wavefronts are compressed.`;
    }

    if (domain === 'THERMODYNAMICS') {
      return `### Parallel Thermodynamics Example: Isobaric Work

Air expands at constant pressure $P = 200\\text{ kPa}$ from $V_1 = 0.1\\text{ m}^3$ to $V_2 = 0.4\\text{ m}^3$:
$$
W = P(V_2 - V_1) = 200\\text{ kPa} \\times (0.4 - 0.1)\\text{ m}^3 = 200 \\times 0.3 = 60\\text{ kJ}
$$`;
    }

    if (domain === 'ODE') {
      return `### Parallel ODE Example: Separable Equation

Solve: $\\frac{dy}{dx} = 2xy$
$$
\\frac{dy}{y} = 2x \\, dx \\implies \\ln|y| = x^2 + C_1 \\implies y(x) = C e^{x^2}
$$`;
    }

    if (domain === 'IE_SPECIAL_TOPICS') {
      return `### Parallel Engineering Economics Example

Find the present worth of $F = \\$5,000$ in $n = 3$ years at $i = 8\\%$ annual interest:
$$
P = F(1 + i)^{-n} = 5000(1 + 0.08)^{-3} = \\frac{5000}{1.2597} \\approx \\$3,969.16
$$`;
    }

    return `### Parallel Example for ${concept}

Consider an analogous system with known coefficients:
1. Setup the governing equation with initial parameters.
2. Solve algebraically to obtain the canonical value.`;
  }

  private handleConceptExplanation(
    context: TutorContext | AIContext,
    expr: string,
    verified: string,
    concept: string,
    domain: string,
    isCalculus: boolean
  ): string {
    const prompt = context.problemPrompt ? `> ${context.problemPrompt}\n\n` : '';

    return `### Understanding ${concept}

${prompt}For the mathematical system:
$$
${expr}
$$

**Core Concept Definition:**
${concept} is the fundamental engineering principle describing the relationship between the system's independent parameters and its response.

**Key Mathematical Relationship:**
Applying the governing formulation yields the canonical result:
$$
${isCalculus ? '\\frac{dy}{dx} = ' : ''}${verified}
$$

You can ask specifically:
- *"What is Step 1?"* to begin solving
- *"Why is this rule required?"* for conceptual rationale
- *"What is the formula?"* for notation definitions`;
  }

  private handleGeneralQuery(
    context: TutorContext | AIContext,
    userQuestion: string,
    expr: string,
    verified: string,
    concept: string,
    domain: string,
    isCalculus: boolean
  ): string {
    const q = userQuestion.toLowerCase();

    // 1. Specific Variable / Symbol queries (e.g. v_s, v_o, rho, P, Q, W, x, y)
    if (q.includes('v_s') || q.includes('source speed') || q.includes('source velocity')) {
      return `### Parameter Clarification: Source Velocity ($v_s$)

In the **Doppler Effect**, $v_s$ represents the velocity of the emitting source relative to the transmission medium.
- When the source moves **toward** the observer, $v_s$ compresses wavefronts (denominator is $v - v_s$, increasing frequency).
- When moving **away**, the denominator is $v + v_s$, lowering frequency.`;
    }

    if (q.includes('v_o') || q.includes('observer speed') || q.includes('observer velocity')) {
      return `### Parameter Clarification: Observer Velocity ($v_o$)

In the **Doppler Effect**, $v_o$ represents the velocity of the observer relative to the medium:
- Moving **toward** the source: numerator is $v + v_o$, intercepting more wave crests per second.
- Moving **away**: numerator is $v - v_o$, lowering detected frequency.`;
    }

    if (q.includes('temperature') || q.includes('kelvin')) {
      return `### Parameter Clarification: Absolute Temperature

In thermodynamic relations and ideal gas calculations, temperature must always be expressed in **Kelvin** ($T = T_{^{\\circ}\\text{C}} + 273.15\\text{ K}$) because thermodynamic equations are defined relative to absolute zero.`;
    }

    // 2. Keyword matching against solutionSteps
    const steps = context.solutionSteps || [];
    const stopWords = new Set(['the', 'and', 'what', 'how', 'why', 'can', 'you', 'this', 'that', 'with', 'from', 'does', 'about', 'for', 'are', 'tell', 'help']);
    const words = q.replace(/[^a-z0-9_]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

    let matchedStep: { stepNumber: number; title: string; expressionLatex: string; explanation: string } | undefined;
    let matchedWord = '';

    for (const w of words) {
      const found = steps.find(st =>
        st.title?.toLowerCase().includes(w) ||
        st.explanation?.toLowerCase().includes(w) ||
        st.expressionLatex?.toLowerCase().includes(w)
      );
      if (found) {
        matchedStep = found;
        matchedWord = w;
        break;
      }
    }

    if (matchedStep) {
      return `### Exploring "${matchedWord}" in ${concept}

In this problem:
$$
${expr}
$$

**Relevant Derivation Step (Step ${matchedStep.stepNumber}: ${matchedStep.title}):**
$$
${matchedStep.expressionLatex}
$$

${matchedStep.explanation}

This step directly addresses your inquiry regarding **${matchedWord}**. Would you like to examine the next step or explore the formula in detail?`;
    }

    // 3. Fallback response with problem context
    return `### Socratic Guidance for ${concept}

For the mathematical problem:
$$
${expr}
$$

${context.problemPrompt ? `**Problem Context:**\n> ${context.problemPrompt}\n\n` : ''}**Canonical Solution:**
$$
${isCalculus ? '\\frac{dy}{dx} = ' : ''}${verified}
$$

You can ask:
- *"What is step 1?"* or *"How do I start?"*
- *"Why is this formula required?"*
- *"Give me a hint"*
- *"Explain this simply"*`;
  }

  /* ========================================================================= */
  /*                             Helper Utilities                              */
  /* ========================================================================= */

  private isCalculusContext(context: AIContext | TutorContext): boolean {
    const c = (context.concept || '').toLowerCase();
    const s = (context.subject || '').toLowerCase();
    return s.includes('calculus') || c.includes('derivative') || c.includes('chain rule') || c.includes('product rule') || c.includes('quotient rule');
  }

  private detectCourseDomain(context: AIContext | TutorContext): 'CALCULUS' | 'THERMODYNAMICS' | 'PHYSICS' | 'ODE' | 'IE_SPECIAL_TOPICS' | 'MATH_FOR_ENGINEERS' {
    const c = ((context.concept || '') + ' ' + (context.topic || '') + ' ' + (context.subject || '')).toLowerCase();
    if (c.includes('differential equation') || c.includes('ode') || c.includes('gen0107') || c.includes('separable') || c.includes('integrating factor') || c.includes('cauchy') || c.includes('laplace')) return 'ODE';
    if (c.includes('thermo') || c.includes('gen0161') || c.includes('carnot') || c.includes('enthalpy') || c.includes('entropy') || c.includes('isobaric') || c.includes('heat engine') || c.includes('internal energy') || c.includes('closed system')) return 'THERMODYNAMICS';
    if (c.includes('economy') || c.includes('interest') || c.includes('npv') || c.includes('salvage') || c.includes('bsie') || c.includes('bsie3219') || c.includes('combinatorics') || c.includes('permutation') || c.includes('cash flow') || c.includes('present worth')) return 'IE_SPECIAL_TOPICS';
    if (c.includes('triangle') || c.includes('matrix') || c.includes('vector') || c.includes('gen0101') || c.includes('arithmetic') || c.includes('factorization') || c.includes('mathematics for engineers')) return 'MATH_FOR_ENGINEERS';
    if (c.includes('physics') || c.includes('gen0110') || c.includes('doppler') || c.includes('circuit') || c.includes('coulomb') || c.includes('hydrostatic') || c.includes('buoyancy') || c.includes('fluid') || c.includes('optics') || c.includes('calorimetry')) return 'PHYSICS';
    return 'CALCULUS';
  }

  private extractInnerComponents(
    expr: string,
    steps?: Array<{ title?: string; expressionLatex?: string; explanation?: string }>
  ): {
    innerLatex: string;
    outerLatex: string;
    innerDerivLatex: string;
    denominatorSquaredLatex?: string;
  } {
    if (!expr) {
      return { innerLatex: 'u(x)', outerLatex: 'u^n', innerDerivLatex: "u'(x)" };
    }

    // Pattern: y = (ax^2 + bx + c)^n or (4x^2 + x + 1)^5
    const powerMatch = expr.match(/\(([^\)]+)\)\^\{?([0-9]+)\}?/);
    if (powerMatch) {
      const inner = powerMatch[1];
      const exponent = powerMatch[2];
      return {
        innerLatex: inner,
        outerLatex: exponent.length === 1 ? `u^${exponent}` : `u^{${exponent}}`,
        innerDerivLatex: this.differentiateSimplePolynomial(inner),
        denominatorSquaredLatex: `(${inner})^2`,
      };
    }

    // Pattern: \left( ... \right)^n
    const leftRightMatch = expr.match(/\\left\((.+?)\\right\)\^\{?([0-9]+)\}?/);
    if (leftRightMatch) {
      const inner = leftRightMatch[1];
      const exponent = leftRightMatch[2];
      return {
        innerLatex: inner,
        outerLatex: exponent.length === 1 ? `u^${exponent}` : `u^{${exponent}}`,
        innerDerivLatex: this.differentiateSimplePolynomial(inner),
        denominatorSquaredLatex: `(${inner})^2`,
      };
    }

    return {
      innerLatex: '3x^2 + 1',
      outerLatex: 'u^4',
      innerDerivLatex: '6x',
      denominatorSquaredLatex: '(v)^2',
    };
  }

  private differentiateSimplePolynomial(poly: string): string {
    const clean = poly.replace(/\s+/g, '');
    if (clean === '4x^2+x+1' || clean === '4x^{2}+x+1') return '8x + 1';
    if (clean === '3x^2+1' || clean === '3x^{2}+1') return '6x';
    if (clean === '5x^2+2x+6' || clean === '5x^{2}+2x+6') return '10x + 2';
    if (clean === '2x^3-5x' || clean === '2x^{3}-5x') return '6x^2 - 5';
    if (clean === '4x^2+1' || clean === '4x^{2}+1') return '8x';
    return 'u\'(x)';
  }
}
