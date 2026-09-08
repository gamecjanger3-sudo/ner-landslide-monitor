
// src/i18n.ts

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en/translation'
import hi from './locales/hi/translation'

// Read previously saved language
const savedLanguage = localStorage.getItem('appLanguage')

// Only allow English and Hindi
const initialLanguage =
  savedLanguage === 'hi' || savedLanguage === 'en'
    ? savedLanguage
    : 'en'

const resources = {
  en: {
    translation: en,
  },

  hi: {
    translation: hi,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,

    lng: initialLanguage,

    // English will be used if a translation is missing
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n

