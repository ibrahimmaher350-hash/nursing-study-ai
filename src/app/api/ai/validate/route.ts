// ==============================================================================
// SECURE API ROUTE: /api/ai/validate
// مسار خادم آمن لتدقيق وفحص الأسئلة مقابل الشريحة المصدرية
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { callGeminiStructured, GeminiError } from '@/lib/ai/geminiClient';
import { VALIDATION_SYSTEM_PROMPT, buildValidationPrompt } from '@/prompts/validation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, slideNumber, slideText } = body;

    if (!question || !slideText || typeof slideNumber !== 'number') {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة للتدقيق والتحقق.' },
        { status: 400 }
      );
    }

    const prompt = buildValidationPrompt(
      JSON.stringify(question),
      slideNumber,
      slideText
    );

    const result = await callGeminiStructured<{
      isValid: boolean;
      rejectionReason: string | null;
      verifiedSourceQuote: string | null;
      confidenceScore: number;
    }>(prompt, {
      systemInstruction: VALIDATION_SYSTEM_PROMPT,
      temperature: 0.1,
    });

    return NextResponse.json({ success: true, validation: result });
  } catch (error: unknown) {
    console.error('API /api/ai/validate error:', error);
    if (error instanceof GeminiError) {
      return NextResponse.json(
        { error: error.message, isQuotaError: error.isQuotaError },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'تعذر تدقيق السؤال.' },
      { status: 500 }
    );
  }
}
