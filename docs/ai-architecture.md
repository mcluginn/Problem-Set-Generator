# AI Architecture & Integration Specification
## Engineering Practice Engine

### 1. Architectural Philosophy: AI as an Optional Layer

```text
               Deterministic Layer (100% Autonomous)
┌────────────────────────────────────────────────────────────────┐
│  Problem Gen  •  Math Solver  •  Answer Checker  •  Steps     │
│  Standard Hints  •  Mastery Algorithm  •  Adaptive Selector   │
└───────────────────────────────┬────────────────────────────────┘
                                │ Context & Telemetry
                                ▼
               AI Enhancement Gateway (Optional)
┌────────────────────────────────────────────────────────────────┐
│  Personalized Explanations  •  Socratic Hints                  │
│  Natural Language Phrasing  •  Conversational Tutoring        │
└────────────────────────────────────────────────────────────────┘
```

**Golden Rules**:
1. **Never authorize mathematics from an LLM**: The LLM is provided the *already solved and validated* mathematical expression, step-breakdown, and detected misconception. It translates verified facts into natural language explanations.
2. **Never expose credentials to the browser**: All AI calls originate exclusively from server-side route handlers.
3. **Fail-Safe Graceful Fallback**: Any AI timeout, rate-limit, 5xx error, or malformed JSON instantly returns deterministic rule-based output without blocking the student.

---

### 2. Provider Abstraction & Canonical TutorContext Interface

```typescript
export type TutorIntent =
  | 'why_method'
  | 'inner_function'
  | 'inner_derivative'
  | 'quotient_denominator_squared'
  | 'explain_step'
  | 'explain_mistake'
  | 'give_hint'
  | 'simplify_explanation'
  | 'similar_example'
  | 'concept_explanation'
  | 'general';

export interface TutorContext {
  problemId?: string;
  problemPrompt?: string;
  subject: string;
  topic: string;
  concept: string;
  skill?: string;
  expressionLatex: string;
  verifiedAnswerLatex: string;
  whyMethodRequired?: string;
  solutionSteps?: SolutionStep[];
  studentAnswerRaw?: string;
  mistakeClassification?: string;
  mistakeDiagnosis?: string;
  mistakeConfidence?: number;
  currentStepNumber?: number;
  studentQuestion: string;
  intent?: TutorIntent;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; text: string }>;
}

export interface IAIProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  generateExplanation(context: AIContext): Promise<string>;
  generateContextualHint(context: AIContext, level: number): Promise<string>;
  diagnoseMistake(
    context: AIContext,
    studentAnswer: string
  ): Promise<{ diagnosis: string; guidanceTip: string }>;
  answerTutorQuestion(
    context: TutorContext | AIContext,
    userQuestion: string,
    history?: Array<{ role: 'user' | 'assistant'; text: string }>
  ): Promise<string>;
}
```

---

### 3. Implementation: GeminiProvider with Structured Outputs

The application utilizes the Google Gemini API with `response_mime_type: "application/json"` and strict schema validation:

```typescript
export class GeminiProvider implements IAIProvider {
  private client: GoogleGenAI;
  
  async diagnoseMistake(context: AIContext, studentAnswer: string) {
    const prompt = `
You are an expert calculus tutor.
Verified Problem: ${context.expressionLatex}
Target Variable: dy/dx
Verified Correct Answer: ${context.verifiedAnswerLatex}
Student Submitted: ${studentAnswer}
Deterministic Classification: ${context.mistakeClassification || 'Unknown algebraic/procedural error'}

Explain why the student's answer is incorrect without revealing the final answer directly.
Guide them on what rule or sub-step to inspect. Return valid JSON only.
`;
    // Calls model with JSON schema constraint and timeout handling
  }
}
```

---

### 4. Safety, Solution Leakage Guard & Sanitization

Before an AI response reaches the client:
1. **Answer Leakage Filter**: The system scans the generated text for exact matches of the final `verifiedAnswerLatex`. If detected on Hint levels 1–3, the AI response is discarded and replaced with the verified standard deterministic hint.
2. **PII Sanitizer**: All student identifiers, database IDs, and emails are stripped. Only mathematical context is sent to the LLM.
3. **Structured Verification**: If JSON parsing fails or required fields are missing, the deterministic fallback immediately resolves.
