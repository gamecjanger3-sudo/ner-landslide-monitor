export interface WeatherItem {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: WeatherItem[];
}

// Fallback mock data for North-East cities when API key is missing or fails
const mockWeatherData: Record<string, WeatherData> = {
  shillong: {
    name: 'Shillong',
    main: { temp: 18, humidity: 88 },
    weather: [{ id: 500, main: 'Rain', description: 'moderate rain', icon: '10d' }],
  },
  aizawl: {
    name: 'Aizawl',
    main: { temp: 22, humidity: 82 },
    weather: [{ id: 501, main: 'Rain', description: 'heavy intensity rain', icon: '10d' }],
  },
  gangtok: {
    name: 'Gangtok',
    main: { temp: 15, humidity: 90 },
    weather: [{ id: 701, main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
  },
  guwahati: {
    name: 'Guwahati',
    main: { temp: 28, humidity: 75 },
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  },
  imphal: {
    name: 'Imphal',
    main: { temp: 24, humidity: 79 },
    weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
  },
  kohima: {
    name: 'Kohima',
    main: { temp: 19, humidity: 85 },
    weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
  },
};

export const fetchWeatherByCity = async (city: string): Promise<WeatherData> => {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

  // 1. Try fetching from OpenWeather API if API key exists
  if (API_KEY) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&units=metric&appid=${API_KEY}`
      );

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('API fetch failed, switching to mock data fallback.', error);
    }
  }

  // 2. Fallback to local mock data if API key is missing or request fails
  const normalizedCity = city.toLowerCase().trim();
  if (mockWeatherData[normalizedCity]) {
    return mockWeatherData[normalizedCity];
  }

  // Generic fallback if user searches a city outside the pre-configured mock list
  return {
    name: city.charAt(0).toUpperCase() + city.slice(1),
    main: { temp: 21, humidity: 80 },
    weather: [{ id: 800, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
  };
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';

  if (API_KEY) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Coordinate weather fetch failed, returning fallback.', err);
    }
  }

  // Fallback if key missing or failed
  return {
    name: 'Your Current Region',
    main: { temp: 20, humidity: 85 },
    weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
  };
};