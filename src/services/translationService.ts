// src/services/translationService.ts

const LIBRETRANSLATE_URL = "/api-translate/translate";

export interface TranslationResponse {
  translatedText: string;
}

/**
 * Translates a given string using the local LibreTranslate server.
 * @param text The text to translate
 * @param targetLang The language code to translate into (e.g., "hi", "es", "fr")
 * @param sourceLang The source language code (default: "auto")
 */
export async function translateText(
  text: string,
  targetLang: string = "hi",
  sourceLang: string = "auto"
): Promise<string> {
  try {
    const response = await fetch(LIBRETRANSLATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed with status: ${response.status}`);
    }

    const data: TranslationResponse = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("LibreTranslate API Error:", error);
    return text; // Fallback to original text if local server is unreachable
  }
}