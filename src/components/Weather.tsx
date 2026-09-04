import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Droplets, CloudRain, Thermometer, Activity } from 'lucide-react'

export default function Weather() {
  const { t } = useTranslation()
  const [searchCity, setSearchCity] = useState('')
  const [selectedCity, setSelectedCity] = useState('Shillong')

  const cities = ['Shillong', 'Aizawl', 'Gangtok', 'Guwahati', 'Imphal', 'Kohima']

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t('weatherMonitoring')}</h1>
        <p className="text-slate-500 mt-1">{t('weatherSubtitle')}</p>
      </div>

      {/* Search & Quick Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-md">
            <Search size={16} />
            <span>{t('searchBtn')}</span>
          </button>
        </div>

        {/* Quick Monitoring Chips */}
        <div className="flex items-center gap-2 text-xs pt-2 border-t border-slate-100 overflow-x-auto">
          <span className="text-slate-400 font-medium shrink-0">{t('quickMonitoring')}</span>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-lg transition-all shrink-0 ${
                selectedCity === city
                  ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Blue Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-80">
              {t('currentConditions')}
            </span>
            <span className="text-[10px] px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full font-medium">
              {t('liveApi')}
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-bold">{selectedCity}</h2>
            <p className="text-sm opacity-90 mt-0.5">{t('moderateRain')}</p>
          </div>

          <div className="text-5xl font-black tracking-tight">18°C</div>
        </div>

        {/* Metric Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Humidity Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-cyan-50 rounded-xl text-cyan-600">
              <Droplets size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{t('humidity')}</p>
              <p className="text-2xl font-bold text-slate-800">88%</p>
            </div>
          </div>

          {/* Condition Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <CloudRain size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{t('condition')}</p>
              <p className="text-2xl font-bold text-slate-800">{t('rain')}</p>
            </div>
          </div>

          {/* Thermal Readout Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <Thermometer size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{t('thermalReadout')}</p>
              <p className="text-2xl font-bold text-slate-800">18°C</p>
            </div>
          </div>

          {/* Station Data Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">{t('stationData')}</p>
              <p className="text-2xl font-bold text-slate-800">{t('active')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}