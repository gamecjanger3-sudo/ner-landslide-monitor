import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const startTour = () => {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: '#advisory-bulletin',
        popover: {
          title: 'Landslide Advisories',
          description: 'View immediate high-risk alerts and regional safety warnings.',
          side: 'bottom',
          align: 'start',
        },
      },
      {
        element: '#location-detector',
        popover: {
          title: 'GPS Location',
          description: 'Detects your exact coordinates to deliver localized risk warnings.',
          side: 'bottom',
        },
      },
      {
        element: '#language-selector',
        popover: {
          title: 'Language & Support',
          description: 'Switch between English/Hindi or trigger this tour anytime.',
          side: 'left',
        },
      },
      {
        element: '#nav-dashboard',
        popover: {
          title: 'Dashboard',
          description: 'Your primary overview for active regional bulletins and satellite status.',
          side: 'right',
        },
      },
      {
        element: '#nav-risk-map',
        popover: {
          title: 'Risk Map',
          description: 'Interactive GIS map highlighting high-risk slope zones in North-East India.',
          side: 'right',
        },
      },
      {
        element: '#nav-weather',
        popover: {
          title: 'Weather',
          description: 'Track real-time rainfall and soil saturation levels triggering slide alerts.',
          side: 'right',
        },
      },
      {
        element: '#nav-alerts',
        popover: {
          title: 'Alerts',
          description: 'Filter critical safety warnings by severity and specific regions.',
          side: 'right',
        },
      },
      {
        element: '#nav-reports',
        popover: {
          title: 'Reports',
          description: 'Submit incident reports or review historical landslide data.',
          side: 'right',
        },
      },
      {
        element: '#nav-settings',
        popover: {
          title: 'Settings',
          description: 'Customize notifications, system preferences, and language options.',
          side: 'right',
        },
      },
    ],
    onDestroyed: () => {
      localStorage.setItem('hasSeenTour', 'true');
    },
  });

  driverObj.drive();
};

export const OnboardingTour = () => {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      startTour();
    }
  }, []);

  return null;
};