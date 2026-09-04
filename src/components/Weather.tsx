import { useState, useEffect } from 'react';
import { 
  Search, 
  Loader2, 
  CloudRain, 
  Droplets, 
  Wind, 
  Thermometer, 
  MapPin 
} from 'lucide-react';
import { fetchWeatherByCity } from '../services/weatherService';
import type { WeatherData } from '../services/weatherService';

export const Weather = () => {
  const [city, setCity] = useState('Shillong');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // High-risk regional quick links for NER
  const quickCities = ['Shillong', 'Aizawl', 'Gangtok', 'Guwahati', 'Imphal', 'Kohima'];

  const handleSearch = async (cityName: string) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(cityName);
      setWeather(data);
    } catch (err) {
      setError('City not found or request failed. Please check the city name.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Load initial weather for Shillong on mount
  useEffect(() => {
    handleSearch('Shillong');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(city);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Weather Monitoring</h1>
        <p className="mt-1 text-slate-500">
          Real-time weather metrics and precipitation levels for vulnerable risk zones.
        </p>
      </div>

      {/* Search & Quick Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-3 max-w-xl">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city (e.g., Shillong, Aizawl)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </form>

        {/* Quick Select Buttons */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium mr-2">Quick Monitoring:</span>
          {quickCities.map((item) => (
            <button
              key={item}
              onClick={() => {
                setCity(item);
                handleSearch(item);
              }}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                city.toLowerCase() === item.toLowerCase()
                  ? 'bg-blue-50 text-blue-600 border-blue-200 font-semibold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Main Weather Card */}
      {weather && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Temp & Status Card */}
          <div className="md:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  Current Conditions
                </span>
                <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full text-white">
                  Live API
                </span>
              </div>
              <h2 className="text-3xl font-bold mt-4">{weather.name}</h2>
              <p className="text-blue-100 capitalize text-sm mt-1">
                {weather.weather?.[0]?.description ?? 'N/A'}
              </p>
            </div>

            <div className="mt-8">
              <span className="text-6xl font-black">
                {Math.round(weather.main.temp)}°C
              </span>
            </div>
          </div>

          {/* Detailed Metric Cards */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Humidity */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-lg">
                <Droplets size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Humidity</p>
                <p className="text-xl font-bold text-slate-900">{weather.main.humidity}%</p>
              </div>
            </div>

            {/* Weather Category */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <CloudRain size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Condition</p>
                <p className="text-xl font-bold text-slate-900">
                  {weather.weather?.[0]?.main ?? 'N/A'}
                </p>
              </div>
            </div>

            {/* Temperature Range */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Thermometer size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Thermal Readout</p>
                <p className="text-xl font-bold text-slate-900">
                  {Math.round(weather.main.temp)}°C
                </p>
              </div>
            </div>

            {/* Monitoring Status */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                <Wind size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Station Data</p>
                <p className="text-xl font-bold text-slate-900">Active</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};