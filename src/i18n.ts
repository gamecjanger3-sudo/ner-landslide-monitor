// src/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation';
import hi from './locales/hi/translation';

import { translateText } from './services/translationService';

// Read previously saved language
const savedLanguage = localStorage.getItem('appLanguage');

// Only allow English and Hindi
const initialLanguage =
  savedLanguage === 'hi' || savedLanguage === 'en'
    ? savedLanguage
    : 'en';

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// 1. Automatically save selected language to localStorage when changed
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('appLanguage', lng);
});

// 2. Helper function to translate dynamic strings (like Weather or Alerts API data) on demand
export async function translateDynamicText(text: string): Promise<string> {
  const currentLang = i18n.language;
  
  // Skip translation if target language is English or text is empty
  if (currentLang === 'en' || !text.trim()) {
    return text;
  }

  try {
    const translated = await translateText(text, currentLang);
    return translated || text;
  } catch (err) {
    console.error("LibreTranslate failed, returning original text:", err);
    return text;
  }
}

export default i18n;