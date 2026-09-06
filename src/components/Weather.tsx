import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  Droplets,
  CloudRain,
  Thermometer,
  Activity,
  Loader2,
} from 'lucide-react'

import {
  fetchWeatherByCity,
  type WeatherData,
} from '../services/weatherService'

export default function Weather() {
  const { t } = useTranslation()

  const [searchCity, setSearchCity] = useState('')
  const [selectedCity, setSelectedCity] = useState('Shillong')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cities = [
    'Shillong',
    'Aizawl',
    'Gangtok',
    'Guwahati',
    'Imphal',
    'Kohima',
  ]

  const loadWeather = async (city: string) => {
    const trimmedCity = city.trim()

    if (!trimmedCity) return

    setLoading(true)
    setError(null)

    try {
      const data = await fetchWeatherByCity(trimmedCity)

      setWeather(data)
      setSelectedCity(data.name)
    } catch (err) {
      console.error('Weather API error:', err)

      setWeather(null)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load weather data.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeather('Shillong')
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadWeather(searchCity)
  }

  const handleCitySelect = (city: string) => {
    setSearchCity('')
    loadWeather(city)
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {t('Weather Monitoring')}
        </h1>

        <p className="text-slate-500 mt-1">
          {t('Weather Subtitle')}
        </p>
      </div>

      {/* Search & Quick Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <form
          onSubmit={handleSearch}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder={t('Search Placeholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Search
              className="absolute left-3.5 top-3 text-slate-400"
              size={18}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !searchCity.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Search size={16} />
            )}

            <span>{t('Search')}</span>
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Quick Monitoring Chips */}
        <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-slate-400 font-medium shrink-0">
            {t('Quick Monitoring')}
          </span>

          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySelect(city)}
              disabled={loading}
              className={`px-3 py-1 rounded-lg transition-all shrink-0 ${
                selectedCity === city
                  ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              } disabled:opacity-50`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8 text-slate-500">
          <Loader2
            size={24}
            className="animate-spin mr-2"
          />
          Loading live weather data...
        </div>
      )}

      {/* Main Weather Overview */}
      {weather && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Main Blue Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[220px]">

            <div className="flex justify-between items-start">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
                {t('Current Conditions')}
              </span>

              <span className="text-[10px] px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full font-medium">
                Live API
              </span>
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {weather.name}
              </h2>

              <p className="text-sm opacity-90 mt-0.5 capitalize">
                {weather.weather[0]?.description || 'N/A'}
              </p>
            </div>

            <div className="text-5xl font-black tracking-tight">
              {Math.round(weather.main.temp)}°C
            </div>
          </div>

          {/* Metric Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Humidity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600">
                <Droplets size={24} />
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {t('Humidity')}
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {weather.main.humidity}%
                </p>
              </div>
            </div>

            {/* Condition */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <CloudRain size={24} />
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {t('Condition')}
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {weather.weather[0]?.main || 'N/A'}
                </p>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <Thermometer size={24} />
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {t('Thermal Readout')}
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {Math.round(weather.main.temp)}°C
                </p>
              </div>
            </div>

            {/* Station Data */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Activity size={24} />
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">
                  {t('Station Data')}
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {t('Active')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}