// ==============================================================================
// SECURE API ROUTE: /api/ai/translate
// مسار خادم آمن لمعالجة وترجمة شرائح المحاضرات الطبية
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { callGeminiStructured, GeminiError } from '@/lib/ai/geminiClient';
import { TRANSLATION_SYSTEM_PROMPT, buildTranslationPrompt } from '@/prompts/translation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slideText, slideNumber } = body;

    if (!slideText || typeof slideNumber !== 'number') {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة. يرجى توفير نص الشريحة ورقمها.' },
        { status: 400 }
      );
    }

    const prompt = buildTranslationPrompt(slideText, slideNumber);
    const result = await callGeminiStructured(prompt, {
      systemInstruction: TRANSLATION_SYSTEM_PROMPT,
      temperature: 0.1, // High medical precision
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('API /api/ai/translate error:', error);
    if (error instanceof GeminiError) {
      return NextResponse.json(
        { error: error.message, isQuotaError: error.isQuotaError },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'تعذر معالجة الترجمة الطبية حالياً.' },
      { status: 500 }
    );
  }
}
