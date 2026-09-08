import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  AlertTriangle,
  TriangleAlert,
  CloudRain,
  ShieldCheck,
  Loader2,
  Search,
  Droplets,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import RiskCard from "../components/RiskCard";
import { fetchWeatherByCity } from "../services/weatherService";
import type { WeatherData } from "../services/weatherService";

// Import API services for real landslide metrics & alerts
import {
  fetchLandslideRiskSummary,
  fetchLandslideRiskTrend,
  fetchRecentLandslideAlerts,
} from "../services/landslideService";
import type {
  RiskSummary,
  RiskTrendPoint,
  LandslideAlert,
} from "../services/landslideService";

export default function Dashboard() {
  const { t } = useTranslation();
  
  // Weather State
  const [city, setCity] = useState("Shillong");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  // Dynamic Landslide Data States
  const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
  const [riskTrend, setRiskTrend] = useState<RiskTrendPoint[]>([]);
  const [alerts, setAlerts] = useState<LandslideAlert[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);

  // Fetch Weather Callback
  const handleFetchWeather = useCallback(async (cityName: string) => {
    if (!cityName.trim()) return;
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const data = await fetchWeatherByCity(cityName);
      setWeather(data);
    } catch {
      setWeatherError("Failed to load weather data.");
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  // Initialize Real-time Landslide Data & Initial Weather
  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setDashboardLoading(true);
      try {
        // Fetch all dynamic metrics concurrently
        const [summaryData, trendData, alertsData] = await Promise.all([
          fetchLandslideRiskSummary(),
          fetchLandslideRiskTrend(),
          fetchRecentLandslideAlerts(),
        ]);

        if (isMounted) {
          setRiskSummary(summaryData);
          setRiskTrend(trendData);
          setAlerts(alertsData);
        }
      } catch (err) {
        console.error("Failed to fetch real-time dashboard metrics", err);
      } finally {
        if (isMounted) {
          setDashboardLoading(false);
        }
      }
    };

    loadDashboardData();
    handleFetchWeather("Shillong");

    return () => {
      isMounted = false;
    };
  }, [handleFetchWeather]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchWeather(city);
  };

  // Helper function to map dynamic severity to UI badge colors
  const getAlertBadgeStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return { dot: "bg-red-500", text: "text-red-600", subText: "text-red-500" };
      case "high":
        return { dot: "bg-orange-500", text: "text-orange-600", subText: "text-orange-500" };
      case "moderate":
        return { dot: "bg-yellow-500", text: "text-yellow-600", subText: "text-yellow-600" };
      default:
        return { dot: "bg-green-500", text: "text-green-600", subText: "text-green-500" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t("Dashboard")}</h1>
        <p className="mt-1 text-slate-500">
          Real-time overview of landslide risk across the North Eastern Region.
        </p>
      </div>

      {/* Risk summary cards - Dynamically Populated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <RiskCard
          title="Critical Risk"
          value={dashboardLoading ? "..." : riskSummary?.critical ?? 0}
          description="Immediate attention required"
          icon={AlertTriangle}
          iconBg="bg-red-100 text-red-600"
        />

        <RiskCard
          title="High Risk"
          value={dashboardLoading ? "..." : riskSummary?.high ?? 0}
          description="Requires close monitoring"
          icon={TriangleAlert}
          iconBg="bg-orange-100 text-orange-600"
        />

        <RiskCard
          title="Moderate Risk"
          value={dashboardLoading ? "..." : riskSummary?.moderate ?? 0}
          description="Continue monitoring"
          icon={CloudRain}
          iconBg="bg-yellow-100 text-yellow-600"
        />

        <RiskCard
          title="Low Risk"
          value={dashboardLoading ? "..." : riskSummary?.low ?? 0}
          description="Currently stable"
          icon={ShieldCheck}
          iconBg="bg-green-100 text-green-600"
        />
      </div>

      {/* Risk chart + Live Weather widget */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Risk Trend Chart - Dynamically Populated */}
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
            {dashboardLoading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={riskTrend}
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
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* LIVE WEATHER WIDGET */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {t("Weather")}
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
                disabled={weatherLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {weatherLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Search size={16} />
                )}
              </button>
            </form>

            {weatherError && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 mb-2">
                {weatherError}
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

      {/* Recent Alerts - Dynamically Populated */}
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
          {dashboardLoading ? (
            <div className="p-5 flex items-center justify-center text-slate-400">
              <Loader2 className="animate-spin" size={20} />
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-5 text-center text-slate-500 text-sm">
              No recent alerts detected.
            </div>
          ) : (
            alerts.map((alert) => {
              const styles = getAlertBadgeStyle(alert.severity);
              return (
                <div
                  key={alert.id}
                  className="p-5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${styles.dot}`} />
                    <div>
                      <p className="font-medium text-slate-900">
                        {alert.location}
                      </p>
                      <p className="text-sm text-slate-500">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${styles.text}`}>
                      {alert.riskPercentage}%
                    </p>
                    <p className={`text-xs ${styles.subText}`}>
                      {alert.severity}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}