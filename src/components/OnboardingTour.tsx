import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export const OnboardingTour = () => {
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');

    if (!hasSeenTour) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: '#advisory-bulletin',
            popover: {
              title: 'Landslide Advisories',
              description: 'Check active regional alerts and high-risk highway zones immediately.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#location-detector',
            popover: {
              title: 'GPS & Location Detection',
              description: 'Allow location access to get real-time soil and weather updates.',
              side: 'bottom',
            },
          },
          {
            element: '#language-selector',
            popover: {
              title: 'Language & Emergency Desk',
              description: 'Switch between Hindi/English or access emergency helpline numbers.',
              side: 'left',
            },
          },
        ],
        onDestroyed: () => {
          localStorage.setItem('hasSeenTour', 'true');
        },
      });

      driverObj.drive();
    }
  }, []);

  return null;
};