import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // General Navigation
      dashboard: 'Dashboard',
      riskMap: 'Risk Map',
      weather: 'Weather',
      alerts: 'Alerts',
      reports: 'Reports',
      settings: 'Settings',
      helpDesk: 'Help Desk',

      // Alerts Page Strings
      alertsTitle: 'Alerts',
      alertsSubtitle: 'Monitor active landslide warnings and real-time environmental alerts.',
      syncNasaFeed: 'Sync NASA Feed',
      criticalAlerts: 'Critical Alerts',
      highAlerts: 'High Alerts',
      moderateAlerts: 'Moderate Alerts',
      activeRiskFeed: 'Active Risk Feed',
      activeRiskSubtitle: 'Live hazard telemetries fetched from active monitoring stations.',
      liveUpdates: 'Live Updates',
      activeAlert: 'Active Alert',
      monsoonWatch: 'Monsoon Watch',
      riskProbability: 'Risk probability',
      critical: 'Critical',
      high: 'High',
      moderate: 'Moderate',

      // Alert descriptions
      shillongTitle: 'Shillong-Jowai Stretch, Meghalaya',
      shillongDesc: 'NH-6 Active Slope Failure recorded in vulnerability sector. (Mudslide)',
      gangtokTitle: 'Gangtok-Nathula Pass Corridor, Sikkim',
      gangtokDesc: 'Nathula Highway Debris Flow recorded in vulnerability sector. (Rockfall)',
      aizawlTitle: 'Aizawl Bypass Road, Mizoram',
      aizawlDesc: 'Aizawl Steep Terrain Subsidence recorded in vulnerability sector. (Soil Creep)',
    },
  },
  hi: {
    translation: {
      // General Navigation
      dashboard: 'डैशबोर्ड',
      riskMap: 'जोखिम मानचित्र',
      weather: 'मौसम',
      alerts: 'चेतावनी',
      reports: 'रिपोर्ट',
      settings: 'सेटिंग्स',
      helpDesk: 'हेल्प डेस्क',

      // Alerts Page Strings
      alertsTitle: 'चेतावनी',
      alertsSubtitle: 'सक्रिय भूस्खलन चेतावनियों और वास्तविक समय के पर्यावरणीय अलर्ट की निगरानी करें।',
      syncNasaFeed: 'नासा फ़ीड सिंक करें',
      criticalAlerts: 'गंभीर चेतावनी',
      highAlerts: 'उच्च चेतावनी',
      moderateAlerts: 'मध्यम चेतावनी',
      activeRiskFeed: 'सक्रिय जोखिम फ़ीड',
      activeRiskSubtitle: 'सक्रिय निगरानी स्टेशनों से प्राप्त लाइव खतरा टेलीमेट्री।',
      liveUpdates: 'लाइव अपडेट',
      activeAlert: 'सक्रिय अलर्ट',
      monsoonWatch: 'मानसून निगरानी',
      riskProbability: 'जोखिम की संभावना',
      critical: 'गंभीर',
      high: 'उच्च',
      moderate: 'मध्यम',

      // Alert descriptions
      shillongTitle: 'शिलांग-जोवई मार्ग, मेघालय',
      shillongDesc: 'एनएच-6 संवेदनशील क्षेत्र में ढलान विफलता दर्ज की गई। (कीचड़ धंसना)',
      gangtokTitle: 'गंगटोक-नाथुला पास कॉरिडोर, सिक्किम',
      gangtokDesc: 'नाथुला राजमार्ग संवेदनशील क्षेत्र में मलबे का बहाव दर्ज किया गया। (चट्टान गिरना)',
      aizawlTitle: 'आइजोल बाईपास रोड, मिजोरम',
      aizawlDesc: 'आइजोल खड़ी इलाके में भू-धंसाव संवेदनशील क्षेत्र में दर्ज किया गया। (मिट्टी का खिसकना)',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n