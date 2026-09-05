import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  TriangleAlert,
  ShieldCheck,
  CloudRain,
  Droplets,
  Search,
  Loader2,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import RiskCard from "../components/RiskCard";
import { fetchWeatherByCity } from "../services/weatherService";
import type { WeatherData } from "../services/weatherService";

export default function Dashboard() {
  const { t } = useTranslation();
  const [city, setCity] = useState("Shillong");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const handleFetchWeather = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(cityName);
      setWeather(data);
    } catch {
      setError("Failed to load weather data.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []); // Empty array because setStates are stable
  
  // ✅ Fixed version:
  useEffect(() => {
    let isMounted = true;

    const initWeather = async () => {
      if (isMounted) {
        await handleFetchWeather("Shillong");
      }
    };

    initWeather();

    return () => {
      isMounted = false;
    };
  }, [handleFetchWeather]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchWeather(city);
  };

  const riskData = [
    { day: "Mon", risk: 42 },
    { day: "Tue", risk: 48 },
    { day: "Wed", risk: 55 },
    { day: "Thu", risk: 51 },
    { day: "Fri", risk: 68 },
    { day: "Sat", risk: 74 },
    { day: "Sun", risk: 82 },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t("dashboard")}</h1>

        <p className="mt-1 text-slate-500">
          Real-time overview of landslide risk across the North Eastern Region.
        </p>
      </div>

      {/* Risk summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <RiskCard
          title="Critical Risk"
          value={12}
          description="Immediate attention required"
          icon={AlertTriangle}
          iconBg="bg-red-100 text-red-600"
        />

        <RiskCard
          title="High Risk"
          value={24}
          description="Requires close monitoring"
          icon={TriangleAlert}
          iconBg="bg-orange-100 text-orange-600"
        />

        <RiskCard
          title="Moderate Risk"
          value={38}
          description="Continue monitoring"
          icon={CloudRain}
          iconBg="bg-yellow-100 text-yellow-600"
        />

        <RiskCard
          title="Low Risk"
          value={156}
          description="Currently stable"
          icon={ShieldCheck}
          iconBg="bg-green-100 text-green-600"
        />
      </div>

      {/* Risk chart + Live Weather widget */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Risk Trend Chart */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Risk Trend
              </h2>

              <p className="text-sm text-slate-500">
                Landslide risk over the last 7 days
              </p>
            </div>

            <span className="text-sm text-slate-500">Last 7 days</span>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={riskData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" tick={{ fontSize: 12 }} />

                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="risk"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LIVE WEATHER WIDGET */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {t("weather")}
                </h2>
                <p className="text-sm text-slate-500">
                  Real-time API monitoring
                </p>
              </div>

              {weather && (
                <span className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                  Live
                </span>
              )}
            </div>

            {/* City search bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Search city (e.g. Aizawl)"
                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </form>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 mb-2">
                {error}
              </p>
            )}

            {/* Weather Metrics Display */}
            {weather && (
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {weather.name}
                    </h3>
                    <p className="text-xs text-slate-500 capitalize">
                      {weather.weather[0]?.description}
                    </p>
                  </div>
                  <span className="text-3xl font-black text-blue-600">
                    {Math.round(weather.main.temp)}°C
                  </span>
                </div>

                {/* Humidity readout */}
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-600">
                      <Droplets size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Humidity
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {weather.main.humidity}%
                  </span>
                </div>

                {/* Rain Condition Indicator */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                      <CloudRain size={16} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      Precipitation Status
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {weather.weather && weather.weather[0]
                      ? weather.weather[0].main
                      : "N/A"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 text-center">
            <span className="text-xs text-slate-400">
              Data synchronized via OpenWeather API
            </span>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Alerts
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Latest high-risk locations detected by the monitoring system.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Alert 1 */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />

              <div>
                <p className="font-medium text-slate-900">East Khasi Hills</p>

                <p className="text-sm text-slate-500">
                  Heavy rainfall and high soil moisture detected
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-red-600">92%</p>

              <p className="text-xs text-red-500">Critical</p>
            </div>
          </div>

          {/* Alert 2 */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-orange-500" />

              <div>
                <p className="font-medium text-slate-900">Aizawl</p>

                <p className="text-sm text-slate-500">
                  Increased rainfall detected in vulnerable zone
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-orange-600">78%</p>

              <p className="text-xs text-orange-500">High</p>
            </div>
          </div>

          {/* Alert 3 */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />

              <div>
                <p className="font-medium text-slate-900">Gangtok</p>

                <p className="text-sm text-slate-500">
                  Moderate environmental risk detected
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-yellow-600">54%</p>

              <p className="text-xs text-yellow-600">Moderate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}