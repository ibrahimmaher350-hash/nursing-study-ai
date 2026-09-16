// ==============================================================================
// SECURE API ROUTE: /api/ai/summary
// مسار خادم آمن لتوليد مستويات الملخص الأكاديمي الثلاثة
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { callGeminiStructured, GeminiError } from '@/lib/ai/geminiClient';
import { SUMMARY_SYSTEM_PROMPT, buildSummaryPrompt } from '@/prompts/summary';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lectureTitle, slidesText } = body;

    if (!slidesText) {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة. يرجى توفير نصوص الشرائح.' },
        { status: 400 }
      );
    }

    const prompt = buildSummaryPrompt(lectureTitle || 'Nursing Lecture', slidesText);
    const result = await callGeminiStructured(prompt, {
      systemInstruction: SUMMARY_SYSTEM_PROMPT,
      temperature: 0.2,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('API /api/ai/summary error:', error);
    if (error instanceof GeminiError) {
      return NextResponse.json(
        { error: error.message, isQuotaError: error.isQuotaError },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'تعذر توليد الملخص الأكاديمي.' },
      { status: 500 }
    );
  }
}
