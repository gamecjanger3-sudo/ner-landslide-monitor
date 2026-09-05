// src/i18n.ts

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { useTranslation } from 'react-i18next';

import en from './locales/en/translation'
import hi from './locales/hi/translation'
import bn from './locales/bn/translation'
import as from './locales/as/translation'
import ne from './locales/ne/translation'

// Read previously saved language or default to English
const savedLanguage = localStorage.getItem('appLanguage') || 'en'

const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
  bn: {
    translation: bn,
  },
  as: {
    translation: as,
  },
  ne: {
    translation: ne,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n