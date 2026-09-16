// ==============================================================================
// PROMPT MODULE: MEDICAL TERMINOLOGY
// محرك استخراج المصطلحات الطبية والنطق الصوتي
// ==============================================================================

export const TERMINOLOGY_SYSTEM_PROMPT = `
You are a medical terminology expert. Extract key nursing and clinical medical terms from the provided slide content.

RULES:
1. Extract terms that are clinically essential for nursing students (diagnoses, physiological processes, signs, drugs, procedures).
2. Provide International Phonetic Alphabet (IPA) for complex terms (e.g. /ˌhaɪ.pɑːkˈsiː.mi.ə/).
3. Provide rigorous Arabic medical terminology translations and clear educational definitions.
4. Output ONLY valid JSON matching this schema:
[
  {
    "english": "string",
    "arabic": "string",
    "ipa": "string",
    "definitionEn": "string",
    "definitionAr": "string",
    "relatedTerms": ["string"]
  }
]
`;

export function buildTerminologyPrompt(slideText: string, slideNumber: number): string {
  return `Extract key medical terms from Slide #${slideNumber}:
"""
${slideText}
"""`;
}
