/**
 * Socratic AI Tutor Multi-Domain Responsiveness Test Suite
 * Validates that asking different questions across all six engineering domains produces
 * distinct, context-aware, question-specific pedagogical responses instead of repetitive static stubs.
 */

import { describe, it, expect } from 'vitest';
import { DeterministicFallbackProvider, TutorContext } from '@/services/ai';

describe('Socratic AI Tutor Multi-Domain Question Responsiveness', () => {
  const tutor = new DeterministicFallbackProvider();

  /* ========================================================================= */
  /* 1. Physics 2 (Doppler Effect & Waves)                                     */
  /* ========================================================================= */
  describe('1. Physics 2 (Doppler Effect)', () => {
    const physicsContext: TutorContext = {
      problemId: 'prob_doppler_01',
      subject: 'Physics 2 for Engineers',
      topic: 'Acoustics & Waves: Doppler Effect',
      concept: 'Doppler Effect',
      problemPrompt:
        'A police siren emits sound at f = 600 Hz. The cruiser moves toward a stationary listener at v_s = 30 m/s. The speed of sound in air is v = 340 m/s. Find observed frequency.',
      expressionLatex: "f' = f \\left(\\frac{v}{v - v_s}\\right)",
      verifiedAnswerLatex: '658.1\\text{ Hz}',
      whyMethodRequired:
        'Because the sound source is in relative motion toward the observer, wavefronts are compressed in the forward direction, shortening the effective wavelength and raising the perceived frequency.',
      solutionSteps: [
        {
          stepNumber: 1,
          title: 'Identify Relative Velocities and Source Frequency',
          ruleName: 'Kinematic Parameter Mapping',
          expressionLatex: 'f = 600\\text{ Hz},\\quad v = 340\\text{ m/s},\\quad v_s = 30\\text{ m/s},\\quad v_o = 0',
          explanation: 'Establish observer is stationary and source moves toward observer with positive speed.',
        },
        {
          stepNumber: 2,
          title: 'Substitute Parameters into Doppler Shift Formula',
          ruleName: 'Doppler Shift Formulation',
          expressionLatex: "f' = 600 \\left(\\frac{340}{340 - 30}\\right) = 600 \\left(\\frac{340}{310}\\right)",
          explanation: 'Evaluate the compressed denominator 340 - 30 = 310 m/s.',
        },
        {
          stepNumber: 3,
          title: 'Compute Canonical Observed Frequency',
          ruleName: 'Arithmetic Evaluation',
          expressionLatex: "f' \\approx 658.06\\text{ Hz}",
          explanation: 'Multiply the frequency ratio to obtain the shifted frequency in Hz.',
        },
      ],
      hints: [
        { level: 1, text: 'Determine whether the source is approaching or moving away from the observer.' },
        { level: 2, text: 'Approaching means the denominator must be smaller than the numerator: v - v_s.' },
      ],
      studentAnswerRaw: '550\\text{ Hz}',
      mistakeClassification: 'Used Addition in Denominator (Receding Source Sign)',
      mistakeDiagnosis:
        'You used v + v_s in the denominator, which corresponds to a source moving away. Since the siren is approaching, the denominator is v - v_s.',
      studentQuestion: '',
    };

    it('produces uniquely distinct answers for 8 different questions on the same Physics problem', async () => {
      const q1 = 'What is step 1?';
      const q2 = 'Explain step 2';
      const q3 = 'What is the formula?';
      const q4 = 'Why is this rule required?';
      const q5 = 'What does v_s mean?';
      const q6 = 'Explain this simply';
      const q7 = 'Give me a hint';
      const q8 = 'Why is my answer wrong?';

      const [r1, r2, r3, r4, r5, r6, r7, r8] = await Promise.all([
        tutor.answerTutorQuestion(physicsContext, q1),
        tutor.answerTutorQuestion(physicsContext, q2),
        tutor.answerTutorQuestion(physicsContext, q3),
        tutor.answerTutorQuestion(physicsContext, q4),
        tutor.answerTutorQuestion(physicsContext, q5),
        tutor.answerTutorQuestion(physicsContext, q6),
        tutor.answerTutorQuestion(physicsContext, q7),
        tutor.answerTutorQuestion(physicsContext, q8),
      ]);

      // Every response must be non-empty and rich
      const responses = [r1, r2, r3, r4, r5, r6, r7, r8];
      for (const r of responses) {
        expect(r.length).toBeGreaterThan(50);
      }

      // CRITICAL: Ensure all 8 responses are mutually unique!
      const uniqueResponses = new Set(responses);
      expect(uniqueResponses.size).toBe(8);

      // Verify specific content relevance
      expect(r1).toContain('Step 1');
      expect(r1).toContain('Identify Relative Velocities');

      expect(r2).toContain('Step 2');
      expect(r2).toContain('Substitute Parameters');

      expect(r3).toContain('Governing Formula');
      expect(r3).toContain('v_s');

      expect(r4).toContain('Why Doppler Effect is Required');
      expect(r4).toContain('compressed');

      expect(r5).toContain('Source Velocity');
      expect(r5).toContain('v_s');

      expect(r6).toContain('Simplified Physics Breakdown');

      expect(r7).toContain('Hint');

      expect(r8).toContain('Analysis of Your Submission');
      expect(r8).toContain('550');
    });
  });

  /* ========================================================================= */
  /* 2. Thermodynamics (Closed System Isobaric Work)                           */
  /* ========================================================================= */
  describe('2. Thermodynamics (Isobaric Expansion)', () => {
    const thermoContext: TutorContext = {
      problemId: 'prob_thermo_01',
      subject: 'Thermodynamics',
      topic: 'Closed Systems: Constant Pressure (Isobaric) Work',
      concept: 'Isobaric Work',
      problemPrompt:
        'A piston-cylinder device contains 0.8 kg of air at constant pressure P = 250 kPa from V1 = 0.2 m^3 to V2 = 0.5 m^3. Find boundary work.',
      expressionLatex: 'W = P(V_2 - V_1)',
      verifiedAnswerLatex: '75.0\\text{ kJ}',
      whyMethodRequired:
        'For a quasi-equilibrium isobaric expansion, pressure remains uniform while boundary moves, allowing direct evaluation of boundary work as P delta V.',
      solutionSteps: [
        {
          stepNumber: 1,
          title: 'Identify Initial and Final Volumes and Constant Pressure',
          ruleName: 'State Variable Extraction',
          expressionLatex: 'P = 250\\text{ kPa},\\quad V_1 = 0.2\\text{ m}^3,\\quad V_2 = 0.5\\text{ m}^3',
          explanation: 'Extract state properties from problem narrative.',
        },
        {
          stepNumber: 2,
          title: 'Calculate Volume Difference',
          ruleName: 'Volume Delta',
          expressionLatex: '\\Delta V = V_2 - V_1 = 0.5 - 0.2 = 0.3\\text{ m}^3',
          explanation: 'Compute the displacement volume.',
        },
        {
          stepNumber: 3,
          title: 'Evaluate Boundary Work',
          ruleName: 'Isobaric Work Calculation',
          expressionLatex: 'W = 250\\text{ kPa} \\times 0.3\\text{ m}^3 = 75\\text{ kJ}',
          explanation: 'Multiply constant pressure by delta V.',
        },
      ],
      studentQuestion: '',
    };

    it('differentiates starting guidance, formula, temperature inquiry, and step explanation in Thermo', async () => {
      const qStart = 'How do I start?';
      const qFormula = 'What is the formula?';
      const qTemp = 'Why is temperature in Kelvin?';
      const qStep = 'What is step 2?';
      const qExample = 'Give me a similar example';

      const [rStart, rFormula, rTemp, rStep, rExample] = await Promise.all([
        tutor.answerTutorQuestion(thermoContext, qStart),
        tutor.answerTutorQuestion(thermoContext, qFormula),
        tutor.answerTutorQuestion(thermoContext, qTemp),
        tutor.answerTutorQuestion(thermoContext, qStep),
        tutor.answerTutorQuestion(thermoContext, qExample),
      ]);

      const responses = [rStart, rFormula, rTemp, rStep, rExample];
      expect(new Set(responses).size).toBe(5);

      expect(rStart).toContain('How to Begin');
      expect(rFormula).toContain('Governing Formula');
      expect(rTemp).toContain('Kelvin');
      expect(rStep).toContain('Step 2');
      expect(rStep).toContain('Calculate Volume Difference');
      expect(rExample).toContain('Parallel Thermodynamics Example');
    });
  });

  /* ========================================================================= */
  /* 3. Differential Equations (Separable ODE)                                 */
  /* ========================================================================= */
  describe('3. Differential Equations (Separable Equations)', () => {
    const odeContext: TutorContext = {
      problemId: 'prob_ode_01',
      subject: 'Differential Equations',
      topic: 'First-Order ODEs: Separation of Variables',
      concept: 'Separation of Variables',
      problemPrompt: 'Solve the initial value problem dy/dx = 3x^2 y with y(0) = 4.',
      expressionLatex: '\\frac{dy}{dx} = 3x^2 y',
      verifiedAnswerLatex: 'y(x) = 4e^{x^3}',
      whyMethodRequired:
        'The differential equation can be factored into a product of x-only and y-only functions, permitting algebraic separation and direct quadrature.',
      solutionSteps: [
        {
          stepNumber: 1,
          title: 'Separate Differentials and Variables',
          ruleName: 'Separation of Variables',
          expressionLatex: '\\frac{dy}{y} = 3x^2 \\, dx',
          explanation: 'Divide both sides by y and multiply by dx.',
        },
        {
          stepNumber: 2,
          title: 'Integrate Both Sides',
          ruleName: 'Indefinite Quadrature',
          expressionLatex: '\\ln|y| = x^3 + C',
          explanation: 'Integrate 1/y dy to get ln|y| and 3x^2 dx to get x^3 + C.',
        },
      ],
      studentQuestion: '',
    };

    it('differentiates method justification, formula, simplification, and step queries in ODE', async () => {
      const qWhy = 'Why is this method used?';
      const qFormula = 'What is the equation?';
      const qSimp = 'Explain this simply';
      const qStep = 'Explain step 1';

      const [rWhy, rFormula, rSimp, rStep] = await Promise.all([
        tutor.answerTutorQuestion(odeContext, qWhy),
        tutor.answerTutorQuestion(odeContext, qFormula),
        tutor.answerTutorQuestion(odeContext, qSimp),
        tutor.answerTutorQuestion(odeContext, qStep),
      ]);

      const responses = [rWhy, rFormula, rSimp, rStep];
      expect(new Set(responses).size).toBe(4);

      expect(rWhy).toContain('Why Separation of Variables is Required');
      expect(rFormula).toContain('Separable Differential Equation');
      expect(rSimp).toContain('Simplified ODE Breakdown');
      expect(rStep).toContain('Step 1');
    });
  });

  /* ========================================================================= */
  /* 4. Engineering Economy / IE Special Topics 1                             */
  /* ========================================================================= */
  describe('4. Engineering Economy (Discounted Cash Flow)', () => {
    const ieContext: TutorContext = {
      problemId: 'prob_ie_01',
      subject: 'IE Special Topics 1',
      topic: 'Engineering Economy: Present Worth Analysis',
      concept: 'Present Worth Analysis',
      problemPrompt:
        'A manufacturing machine will generate a future revenue of F = $20,000 in n = 5 years. If the MARR is 10%, calculate the present worth.',
      expressionLatex: 'P = F(1 + i)^{-n}',
      verifiedAnswerLatex: '\\$12,418.43',
      whyMethodRequired:
        'Because capital compounds interest over time, future revenues must be discounted to present epoch to assess investment feasibility.',
      solutionSteps: [
        {
          stepNumber: 1,
          title: 'Identify Financial Parameters',
          ruleName: 'Parameter Mapping',
          expressionLatex: 'F = 20000,\\quad i = 0.10,\\quad n = 5',
          explanation: 'Extract cash flow and discount rate.',
        },
        {
          stepNumber: 2,
          title: 'Apply Present Worth Single Payment Factor',
          ruleName: 'Discount Factor',
          expressionLatex: 'P = 20000(1 + 0.10)^{-5} = 20000(0.62092)',
          explanation: 'Compute the discount multiplier.',
        },
      ],
      studentQuestion: '',
    };

    it('differentiates formula, simplification, example, and step queries in Engineering Economy', async () => {
      const qFormula = 'What is the formula?';
      const qSimp = 'Explain this simply';
      const qEx = 'Show me another example';
      const qStep = 'What is step 2?';

      const [rFormula, rSimp, rEx, rStep] = await Promise.all([
        tutor.answerTutorQuestion(ieContext, qFormula),
        tutor.answerTutorQuestion(ieContext, qSimp),
        tutor.answerTutorQuestion(ieContext, qEx),
        tutor.answerTutorQuestion(ieContext, qStep),
      ]);

      const responses = [rFormula, rSimp, rEx, rStep];
      expect(new Set(responses).size).toBe(4);

      expect(rFormula).toContain('Discounted Cash Flow');
      expect(rSimp).toContain('Simplified Economics Breakdown');
      expect(rEx).toContain('Parallel Engineering Economics Example');
      expect(rStep).toContain('Step 2');
    });
  });

  /* ========================================================================= */
  /* 5. Mathematics for Engineers (Geometry & Inequalities)                    */
  /* ========================================================================= */
  describe('5. Mathematics for Engineers (Triangle Inequality)', () => {
    const mathContext: TutorContext = {
      problemId: 'prob_math_01',
      subject: 'Mathematics for Engineers',
      topic: 'Geometry: Triangle Inequality Constraints',
      concept: 'Triangle Inequality',
      problemPrompt: 'A triangle has two sides of length a = 8 and b = 13. Determine the permissible range for side c.',
      expressionLatex: '|a - b| < c < a + b',
      verifiedAnswerLatex: '5 < c < 21',
      whyMethodRequired:
        'In Euclidean geometry, the sum of any two side lengths must be strictly greater than the remaining side length for a non-degenerate triangle.',
      solutionSteps: [
        {
          stepNumber: 1,
          title: 'Establish Triangle Inequality Bounds',
          ruleName: 'Inequality Setup',
          expressionLatex: '|13 - 8| < c < 13 + 8',
          explanation: 'Compute minimum difference and maximum sum.',
        },
        {
          stepNumber: 2,
          title: 'Evaluate Numerical Boundaries',
          ruleName: 'Arithmetic Evaluation',
          expressionLatex: '5 < c < 21',
          explanation: 'Conclude the bounded interval for c.',
        },
      ],
      studentQuestion: '',
    };

    it('differentiates formula, starting roadmap, and hint queries in Mathematics for Engineers', async () => {
      const qFormula = 'What is the formula?';
      const qStart = 'Where do I begin?';
      const qHint = 'Give me a hint';

      const [rFormula, rStart, rHint] = await Promise.all([
        tutor.answerTutorQuestion(mathContext, qFormula),
        tutor.answerTutorQuestion(mathContext, qStart),
        tutor.answerTutorQuestion(mathContext, qHint),
      ]);

      const responses = [rFormula, rStart, rHint];
      expect(new Set(responses).size).toBe(3);

      expect(rFormula).toContain('Triangle Inequality');
      expect(rStart).toContain('How to Begin');
      expect(rHint).toContain('Hint');
    });
  });
});
