// ==============================================================================
// SECURE API ROUTE: /api/ai/questions
// مسار خادم آمن لتوليد أسئلة الاختبارات التمريضية (MCQ، صواب/خطأ، مقالي)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { callGeminiStructured, GeminiError } from '@/lib/ai/geminiClient';
import { MCQ_SYSTEM_PROMPT, buildMCQPrompt } from '@/prompts/mcq';
import { TRUE_FALSE_SYSTEM_PROMPT, buildTrueFalsePrompt } from '@/prompts/truefalse';
import { ESSAY_SYSTEM_PROMPT, buildEssayPrompt } from '@/prompts/essay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slidesContent, questionType = 'mcq' } = body;

    if (!slidesContent) {
      return NextResponse.json(
        { error: 'بيانات غير مكتملة. يرجى توفير محتوى الشرائح.' },
        { status: 400 }
      );
    }

    let systemInstruction = MCQ_SYSTEM_PROMPT;
    let prompt = buildMCQPrompt(slidesContent);

    if (questionType === 'true_false') {
      systemInstruction = TRUE_FALSE_SYSTEM_PROMPT;
      prompt = buildTrueFalsePrompt(slidesContent);
    } else if (questionType === 'essay') {
      systemInstruction = ESSAY_SYSTEM_PROMPT;
      prompt = buildEssayPrompt(slidesContent);
    }

    const result = await callGeminiStructured(prompt, {
      systemInstruction,
      temperature: 0.2,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    console.error('API /api/ai/questions error:', error);
    if (error instanceof GeminiError) {
      return NextResponse.json(
        { error: error.message, isQuotaError: error.isQuotaError },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'تعذر توليد الأسئلة.' },
      { status: 500 }
    );
  }
}
