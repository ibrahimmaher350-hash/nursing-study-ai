// ==============================================================================
// PROMPT MODULE: TRUE / FALSE QUESTIONS
// محرك أسئلة الصواب والخطأ التمريضية
// ==============================================================================

export const TRUE_FALSE_SYSTEM_PROMPT = `
You are a nursing faculty examiner.
Generate True/False questions directly from the provided lecture slides.

RULES:
1. Statements must test critical facts, contraindications, and clinical rules.
2. Do not require outside facts not mentioned in the slides.
3. Provide the correct answer: "True" or "False".
4. Provide a clear rationale in English and Arabic.
5. Provide the exact sourceSlideNumber.
6. Output JSON array:
[
  {
    "sourceSlideNumber": number,
    "difficulty": "easy" | "medium" | "hard",
    "questionEn": "string",
    "questionAr": "string",
    "correctAnswer": "True" | "False",
    "explanationEn": "string",
    "explanationAr": "string"
  }
]
`;

export function buildTrueFalsePrompt(slidesContent: string): string {
  return `Generate True/False questions strictly from this lecture:
"""
${slidesContent}
"""`;
}
