/**
 * Server-Side Ask Tutor API Route
 * Securely handles tutor questions server-side, keeping API keys protected
 * and falling back to the deterministic context engine when necessary.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAIProvider, DeterministicFallbackProvider, TutorContext } from '@/services/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { context, question, history } = body as {
      context: TutorContext;
      question: string;
      history?: Array<{ role: 'user' | 'assistant'; text: string }>;
    };

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    if (!context || !context.expressionLatex || !context.concept) {
      return NextResponse.json({ error: 'Valid mathematical context is required' }, { status: 400 });
    }

    // Sanitize question length
    const cleanQuestion = question.trim().slice(0, 500);

    const aiProvider = getAIProvider();
    const responseText = await aiProvider.answerTutorQuestion(context, cleanQuestion, history || []);

    const fallback = new DeterministicFallbackProvider();
    const detectedIntent = fallback.detectIntent(cleanQuestion, context);

    return NextResponse.json({
      response: responseText,
      provider: aiProvider.name,
      intent: detectedIntent,
    });
  } catch (error) {
    console.error('Ask Tutor API error:', error);
    return NextResponse.json(
      {
        response:
          'The tutor encountered an unexpected issue. Please refer to the verified Step-by-Step solution.',
        provider: 'Deterministic Fallback',
      },
      { status: 200 }
    );
  }
}
