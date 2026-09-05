import { useEffect } from 'react';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

// Type the step mapping explicitly using DriveStep[]
const TOUR_STEPS: Record<string, DriveStep[]> = {
  en: [
    {
      element: '#advisory-bulletin',
      popover: { title: 'Landslide Advisories', description: 'View immediate high-risk alerts and regional safety warnings.', side: 'bottom', align: 'start' },
    },
    {
      element: '#location-detector',
      popover: { title: 'GPS Location', description: 'Detects your exact coordinates to deliver localized risk warnings.', side: 'bottom' },
    },
    {
      element: '#language-selector',
      popover: { title: 'Language & Support', description: 'Switch between English/Hindi or trigger this tour anytime.', side: 'left' },
    },
    {
      element: '#nav-dashboard',
      popover: { title: 'Dashboard', description: 'Your primary overview for active regional bulletins and satellite status.', side: 'right' },
    },
    {
      element: '#nav-risk-map',
      popover: { title: 'Risk Map', description: 'Interactive GIS map highlighting high-risk slope zones in North-East India.', side: 'right' },
    },
    {
      element: '#nav-weather',
      popover: { title: 'Weather', description: 'Track real-time rainfall and soil saturation levels triggering slide alerts.', side: 'right' },
    },
    {
      element: '#nav-alerts',
      popover: { title: 'Alerts', description: 'Filter critical safety warnings by severity and specific regions.', side: 'right' },
    },
    {
      element: '#nav-reports',
      popover: { title: 'Reports', description: 'Submit incident reports or review historical landslide data.', side: 'right' },
    },
    {
      element: '#nav-settings',
      popover: { title: 'Settings', description: 'Customize notifications, system preferences, and language options.', side: 'right' },
    },
  ],
  hi: [
    {
      element: '#advisory-bulletin',
      popover: { title: 'भूस्खलन परामर्श', description: 'तत्काल उच्च-जोखिम अलर्ट और क्षेत्रीय सुरक्षा चेतावनियां देखें।', side: 'bottom', align: 'start' },
    },
    {
      element: '#location-detector',
      popover: { title: 'जीपीएस स्थान', description: 'स्थानीयकृत जोखिम चेतावनियाँ प्रदान करने के लिए आपके सटीक निर्देशांकों का पता लगाता है।', side: 'bottom' },
    },
    {
      element: '#language-selector',
      popover: { title: 'भाषा एवं सहायता', description: 'अंग्रेजी/हिंदी के बीच स्विच करें या किसी भी समय इस टूर को शुरू करें।', side: 'left' },
    },
    {
      element: '#nav-dashboard',
      popover: { title: 'डैशबोर्ड', description: 'सक्रिय क्षेत्रीय बुलेटिन और उपग्रह स्थिति का आपका प्राथमिक अवलोकन।', side: 'right' },
    },
    {
      element: '#nav-risk-map',
      popover: { title: 'जोखिम मानचित्र', description: 'उत्तर-पूर्व भारत में उच्च जोखिम वाले ढलान क्षेत्रों को दर्शाने वाला इंटरैक्टिव जीआईएस मानचित्र।', side: 'right' },
    },
    {
      element: '#nav-weather',
      popover: { title: 'मौसम', description: 'भूस्खलन अलर्ट ट्रिगर करने वाली वास्तविक समय की वर्षा और मिट्टी की संतृप्ति दरों पर नज़र रखें।', side: 'right' },
    },
    {
      element: '#nav-alerts',
      popover: { title: 'अलर्ट', description: 'गंभीरता और विशिष्ट क्षेत्रों के आधार पर महत्वपूर्ण सुरक्षा चेतावनियों को फ़िल्टर करें।', side: 'right' },
    },
    {
      element: '#nav-reports',
      popover: { title: 'रिपोर्ट्स', description: 'घटना रिपोर्ट दर्ज करें या ऐतिहासिक भूस्खलन डेटा की समीक्षा करें।', side: 'right' },
    },
    {
      element: '#nav-settings',
      popover: { title: 'सेटिंग्स', description: 'सूचनाएं, सिस्टम प्राथमिकताएं और भाषा विकल्प अनुकूलित करें।', side: 'right' },
    },
  ],
};

export const startTour = (lang: string = 'en') => {
  const steps: DriveStep[] = TOUR_STEPS[lang] || TOUR_STEPS.en;

  const driverObj = driver({
    showProgress: true,
    nextBtnText: lang === 'hi' ? 'अगला' : 'Next',
    prevBtnText: lang === 'hi' ? 'पिछला' : 'Previous',
    doneBtnText: lang === 'hi' ? 'समाप्त' : 'Done',
    steps,
    onDestroyed: () => {
      localStorage.setItem('hasSeenTour', 'true');
    },
  });

  driverObj.drive();
};

export const OnboardingTour = ({ currentLang }: { currentLang: string }) => {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      startTour(currentLang);
    }
  }, [currentLang]);

  return null;
};