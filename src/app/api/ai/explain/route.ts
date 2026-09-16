// ==============================================================================
// SECURE API ROUTE: /api/ai/explain
// مسار خادم آمن لتوليد الشروحات المبسطة (بالمصري، أكاديمي، إنجليزي مبسط)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { callGeminiStructured, GeminiError } from '@/lib/ai/geminiClient';
import { EXPLANATION_SYSTEM_PROMPT, buildExplanationPrompt } from '@/prompts/explanation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slideText, slideTitle } = body;

    if (!slideText) {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة. يرجى توفير نص الشريحة.' },
        { status: 400 }
      );
    }

    const prompt = buildExplanationPrompt(slideText, slideTitle || 'Lecture Slide');
    const result = await callGeminiStructured(prompt, {
      systemInstruction: EXPLANATION_SYSTEM_PROMPT,
      temperature: 0.3,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('API /api/ai/explain error:', error);
    if (error instanceof GeminiError) {
      return NextResponse.json(
        { error: error.message, isQuotaError: error.isQuotaError },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'تعذر توليد الشرح التوضيحي.' },
      { status: 500 }
    );
  }
}
