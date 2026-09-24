/**
 * Google Gemini AI Provider Implementation
 * Encapsulates Gemini SDK with strict timeout handling, structured prompts, and anti-leakage guards.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIContext, IAIProvider, TutorContext } from './types';
import { DeterministicFallbackProvider } from './fallback';

export class GeminiProvider implements IAIProvider {
  public readonly name = 'Google Gemini (Contextual Tutor)';
  private client: GoogleGenerativeAI | null = null;
  private fallback = new DeterministicFallbackProvider();
  private workingModel: string = 'gemini-3-flash-preview';

  constructor(apiKey?: string) {
    const key = apiKey || (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined);
    if (key) {
      this.client = new GoogleGenerativeAI(key);
    }
  }

  public async isAvailable(): Promise<boolean> {
    return !!this.client;
  }

  private async callWithModelFallback<T>(
    operation: (model: any) => Promise<T>,
    timeoutMs: number = 30000
  ): Promise<T> {
    if (!this.client) throw new Error('No Gemini client initialized');

    const candidatePool = [
      this.workingModel,
      'gemini-3-flash-preview',
      'gemini-3.5-flash',
      'gemini-flash-latest',
    ];
    const uniqueCandidates = Array.from(new Set(candidatePool));

    let lastError: any = null;
    for (const modelName of uniqueCandidates) {
      try {
        const model = this.client.getGenerativeModel({ model: modelName });
        const result = await Promise.race([
          operation(model),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timeout with model ${modelName}`)), timeoutMs)
          ),
        ]);
        this.workingModel = modelName;
        return result;
      } catch (err: any) {
        lastError = err;
        console.warn(`[GeminiProvider] Model ${modelName} failed:`, err?.message || err);
      }
    }
    throw lastError || new Error('All Gemini candidate models failed');
  }

  public async generateExplanation(context: AIContext): Promise<string> {
    if (!this.client) return this.fallback.generateExplanation(context);

    try {
      const prompt = `
You are an expert STEM professor specializing in ${context.subject || 'Engineering'}.
Subject: ${context.subject}
Topic: ${context.topic}
Concept: ${context.concept}
${context.problemPrompt ? `Problem Statement: ${context.problemPrompt}` : ''}
Verified Mathematical Expression: ${context.expressionLatex}
Verified Authoritative Solution: ${context.verifiedAnswerLatex}
${context.physicalUnits ? `Physical Units: ${context.physicalUnits}` : ''}
${context.whyMethodRequired ? `Underlying Principle: ${context.whyMethodRequired}` : ''}
${context.engineeringInterpretation ? `Engineering Context: ${context.engineeringInterpretation}` : ''}

Provide a clear, engaging, conceptually rich pedagogical explanation of how to solve this problem step-by-step.
Explain the physical/mathematical intuition behind why this method works.
Use KaTeX notation ($...$ for inline equations, $$...$$ for display equations).
`;
      const result = await this.callWithModelFallback(async (model) => {
        const res = await model.generateContent(prompt);
        return res.response.text();
      }, 30000);

      return result || this.fallback.generateExplanation(context);
    } catch {
      return this.fallback.generateExplanation(context);
    }
  }

  public async generateContextualHint(context: AIContext, level: number): Promise<string> {
    if (!this.client) return this.fallback.generateContextualHint(context, level);

    try {
      const prompt = `
You are a pedagogical Socratic STEM tutor specializing in ${context.subject || 'Engineering'}.
Subject: ${context.subject}
Topic: ${context.topic}
Concept: ${context.concept}
Problem / Expression: ${context.expressionLatex}
Requested Hint Level: ${level} (1=Recognition, 2=Direction, 3=Formula, 4=Setup, 5=Calculation)
Verified Final Answer: ${context.verifiedAnswerLatex}

CRITICAL RULE: DO NOT reveal the final answer ${context.verifiedAnswerLatex} in this hint.
Provide a concise, encouraging hint (1-3 sentences) tailored to Level ${level}.
Use LaTeX notation where appropriate ($...$).
`;
      const hintText = await this.callWithModelFallback(async (model) => {
        const res = await model.generateContent(prompt);
        return res.response.text();
      }, 25000);

      // Solution leakage filter
      if (level < 5 && hintText.includes(context.verifiedAnswerLatex)) {
        return this.fallback.generateContextualHint(context, level);
      }
      return hintText || this.fallback.generateContextualHint(context, level);
    } catch {
      return this.fallback.generateContextualHint(context, level);
    }
  }

  public async diagnoseMistake(
    context: AIContext,
    studentAnswer: string
  ): Promise<{ diagnosis: string; guidanceTip: string }> {
    if (!this.client) return this.fallback.diagnoseMistake(context, studentAnswer);

    try {
      const prompt = `
You are an expert STEM tutor in ${context.subject || 'Engineering'} diagnosing a student's error.
Verified Problem: ${context.expressionLatex}
Verified Correct Answer: ${context.verifiedAnswerLatex}
Student Submitted: ${studentAnswer}
Deterministic Classification: ${context.mistakeClassification || 'Computational or algebraic error'}
${context.commonMistake ? `Common Pitfall: ${context.commonMistake}` : ''}

Explain constructively why the student's answer is incorrect without simply giving away the final answer.
Return valid JSON with keys "diagnosis" and "guidanceTip":
{"diagnosis": "...", "guidanceTip": "..."}
`;
      const jsonStr = await this.callWithModelFallback(async (model) => {
        const res = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        });
        return res.response.text();
      }, 25000);

      const parsed = JSON.parse(jsonStr);
      return {
        diagnosis: parsed.diagnosis || 'Incorrect derivation.',
        guidanceTip: parsed.guidanceTip || 'Review the relevant governing equations and principles.',
      };
    } catch {
      return this.fallback.diagnoseMistake(context, studentAnswer);
    }
  }

  public async answerTutorQuestion(
    context: TutorContext | AIContext,
    userQuestion: string,
    history: Array<{ role: 'user' | 'assistant'; text: string }> = []
  ): Promise<string> {
    if (!this.client) return this.fallback.answerTutorQuestion(context, userQuestion, history);

    try {
      const historyFormatted = history.map((h) => `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.text}`).join('\n\n');

      const stepsSummary = context.solutionSteps
        ? context.solutionSteps.map((s) => `Step ${s.stepNumber} (${s.title}): ${s.expressionLatex} -> ${s.explanation}`).join('\n')
        : '';

      const prompt = `
You are an expert Socratic tutor in ${context.subject || 'STEM'} helping a student understand ${context.concept || 'the problem'}.

=== AUTHORITATIVE MATHEMATICAL CONTEXT ===
Subject: ${context.subject}
Topic: ${context.topic}
Concept: ${context.concept}
${context.problemPrompt ? `Problem Statement: ${context.problemPrompt}` : ''}
Verified Problem / Expression: $${context.expressionLatex}$
Verified Authoritative Solution: $${context.verifiedAnswerLatex}$
${context.physicalUnits ? `Physical Units: ${context.physicalUnits}` : ''}
${context.whyMethodRequired ? `Conceptual Reason Method is Required: ${context.whyMethodRequired}` : ''}
${context.engineeringInterpretation ? `Engineering Meaning: ${context.engineeringInterpretation}` : ''}
${context.commonMistake ? `Common Pitfall: ${context.commonMistake}` : ''}
${stepsSummary ? `Authoritative Solution Steps:\n${stepsSummary}` : ''}
${context.studentAnswerRaw ? `Student's Recent Submitted Answer: $${context.studentAnswerRaw}$` : ''}
${context.mistakeClassification ? `Diagnosed Misconception: ${context.mistakeClassification}` : ''}
${context.mistakeDiagnosis ? `Diagnostic Detail: ${context.mistakeDiagnosis}` : ''}

=== CONVERSATION HISTORY ===
${historyFormatted || '(First question in this session)'}

=== CURRENT STUDENT QUESTION ===
"${userQuestion}"

=== TUTOR INSTRUCTIONS ===
1. MULTILINGUAL & FILIPINO / TAGALOG INSTRUCTION:
Check the language used in the student's question. If the student writes or asks in Tagalog, Filipino, or Taglish (e.g. "ano ang formula", "paano simulan", "bakit mali", "ipaliwanag mo naman sa tagalog", "tulong", or any Tagalog phrasing), YOU MUST ANSWER ENTIRELY IN NATURAL, CLEAR TAGALOG / TAGLISH! Explain the concepts and steps clearly in Tagalog/Taglish, keeping mathematical equations in KaTeX ($...$).
2. Answer the student's question directly, pedagogically, and concisely (2-4 paragraphs max).
3. NEVER contradict the verified authoritative solution $${context.verifiedAnswerLatex}$.
4. Format math using standard $...$ for inline math and $$...$$ for display equations.
5. If the student asks about a mistake, refer constructively to their submitted answer without condescension.
6. If the student asks why a method or formula is required, explain the underlying physical or mathematical necessity.
7. Provide clear, encouraging guidance that prompts the student to think critically rather than passively copying.
`;
      const aiText = await this.callWithModelFallback(async (model) => {
        const res = await model.generateContent(prompt);
        return res.response.text();
      }, 30000);

      return aiText || this.fallback.answerTutorQuestion(context, userQuestion, history);
    } catch {
      return this.fallback.answerTutorQuestion(context, userQuestion, history);
    }
  }
}
