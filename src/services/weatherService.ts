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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL &&
  !import.meta.env.VITE_API_BASE_URL.includes('your-new-render-app')
    ? import.meta.env.VITE_API_BASE_URL
    : 'https://ner-landslide-monitor-pj1l.onrender.com';

export const fetchWeatherByCity = async (
  city: string
): Promise<WeatherData> => {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    throw new Error('City name is required.');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/weather?city=${encodeURIComponent(trimmedCity)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || `Weather API request failed (${response.status})`
    );
  }

  return {
    name: data.name,
    main: {
      temp: data.main.temp,
      humidity: data.main.humidity,
    },
    weather: data.weather,
  };
};

export const fetchWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error('Valid latitude and longitude are required.');
  }

  // Coordinate-based weather is not currently exposed
  // through the backend weather proxy.
  throw new Error(
    'Coordinate weather fetching is not configured yet.'
  );
};