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

const getApiKey = (): string => {
  return import.meta.env.VITE_WEATHER_API_KEY || "";
};

export const fetchWeatherByCity = async (
  city: string
): Promise<WeatherData> => {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    throw new Error(
      "Weather API key is missing. Check VITE_WEATHER_API_KEY in .env"
    );
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city.trim()
    )}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    let message = `Weather API request failed (${response.status})`;

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        message += `: ${errorData.message}`;
      }
    } catch {
      // Keep the original error message.
    }

    throw new Error(message);
  }

  const data = await response.json();

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
  const API_KEY = getApiKey();

  if (!API_KEY) {
    throw new Error(
      "Weather API key is missing. Check VITE_WEATHER_API_KEY in .env"
    );
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  if (!response.ok) {
    let message = `Weather API request failed (${response.status})`;

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        message += `: ${errorData.message}`;
      }
    } catch {
      // Keep the original error message.
    }

    throw new Error(message);
  }

  const data = await response.json();

  return {
    name: data.name,
    main: {
      temp: data.main.temp,
      humidity: data.main.humidity,
    },
    weather: data.weather,
  };
};