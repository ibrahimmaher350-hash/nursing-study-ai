// ==============================================================================
// NURSING STUDY AI — SECURE GEMINI AI CLIENT
// استدعاء آمن ومحمي لنماذج Gemini من الخادم فقط مع حماية الكوتا والتكرار
// ==============================================================================

interface GenerateOptions {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export class GeminiError extends Error {
  constructor(message: string, public statusCode: number = 500, public isQuotaError: boolean = false) {
    super(message);
    this.name = 'GeminiError';
  }
}

// In-memory cache to prevent duplicate expensive calls
const requestCache = new Map<string, { timestamp: number; data: unknown }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export async function callGeminiStructured<T>(
  prompt: string,
  options: GenerateOptions = {}
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new GeminiError(
      'لم يتم إدخال مفتاح GEMINI_API_KEY في إعدادات الخادم (.env.local).',
      401,
      false
    );
  }

  // Check cache for identical requests
  const cacheKey = `${options.model || 'gemini-1.5-flash'}_${options.systemInstruction || ''}_${prompt}`;
  const cached = requestCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data as T;
  }

  const model = options.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body: {
    contents: { role: string; parts: { text: string }[] }[];
    systemInstruction?: { parts: { text: string }[] };
    generationConfig: {
      temperature: number;
      maxOutputTokens: number;
      responseMimeType: string;
    };
  } = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.2, // Low temperature for high medical accuracy
      maxOutputTokens: options.maxOutputTokens ?? 4096,
      responseMimeType: 'application/json',
    },
  };

  if (options.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  let retries = 0;
  const maxRetries = 2;
  let delay = 1000;

  while (retries <= maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429 || errorText.toLowerCase().includes('quota')) {
          throw new GeminiError(
            'تم تجاوز حد الاستخدام المجاني المؤقت لمزود الذكاء الاصطناعي. يرجى الانتظار دقيقة.',
            429,
            true
          );
        }
        throw new GeminiError(`خطأ من مزود الذكاء الاصطناعي: ${response.status}`, response.status);
      }

      const result = await response.json();
      const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new GeminiError('استجابة غير مكتملة من النموذج');
      }

      // Parse JSON safely
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(cleaned) as T;

      // Cache successful response
      requestCache.set(cacheKey, { timestamp: Date.now(), data: parsed });

      return parsed;
    } catch (err: unknown) {
      if (err instanceof GeminiError && err.isQuotaError) {
        throw err;
      }

      retries++;
      if (retries > maxRetries) {
        const message = err instanceof Error ? err.message : 'فشل الاتصال بالذكاء الاصطناعي';
        throw new GeminiError(message);
      }

      await new Promise((res) => setTimeout(res, delay));
      delay *= 2; // exponential backoff
    }
  }

  throw new GeminiError('تعذر الحصول على استجابة بعد عدة محاولات');
}
