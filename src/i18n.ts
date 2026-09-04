import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation dictionaries
const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      riskMap: 'Risk Map',
      weather: 'Weather',
      alerts: 'Alerts',
      reports: 'Reports',
      settings: 'Settings',
      helpDesk: 'Help Desk',
      verifiedLocation: 'Verified Location',
      landslideMonitoring: 'Landslide Monitoring',
    },
  },
  hi: {
    translation: {
      dashboard: 'डैशबोर्ड',
      riskMap: 'जोखिम मानचित्र',
      weather: 'मौसम',
      alerts: 'चेतावनी',
      reports: 'रिपोर्ट',
      settings: 'सेटिंग्स',
      helpDesk: 'हेल्प डेस्क',
      verifiedLocation: 'सत्यापित स्थान',
      landslideMonitoring: 'भूस्खलन निगरानी',
    },
  },
  bn: {
    translation: {
      dashboard: 'ড্যাশবোর্ড',
      riskMap: 'ঝুঁকি মানচিত্র',
      weather: 'আবহাওয়া',
      alerts: 'সতর্কতা',
      reports: 'রিপোর্ট',
      settings: 'সেটিংস',
      helpDesk: 'হেল্প ডেস্ক',
      verifiedLocation: 'যাচাইকৃত অবস্থান',
      landslideMonitoring: 'ভূমিধস পর্যবেক্ষণ',
    },
  },
  // Add other language translations here as needed...
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n