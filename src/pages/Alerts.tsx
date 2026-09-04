import { useTranslation } from 'react-i18next'
import { RefreshCw, AlertTriangle } from 'lucide-react'

export default function Alerts() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Header with Sync Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('alertsTitle')}</h1>
          <p className="mt-1 text-slate-500">{t('alertsSubtitle')}</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <RefreshCw size={16} />
          <span>{t('syncNasaFeed')}</span>
        </button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-red-50/50 border border-red-200/60 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
            {t('criticalAlerts')}
          </p>
          <p className="text-3xl font-bold text-red-700">1</p>
        </div>

        <div className="p-5 bg-orange-50/50 border border-orange-200/60 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
            {t('highAlerts')}
          </p>
          <p className="text-3xl font-bold text-orange-700">1</p>
        </div>

        <div className="p-5 bg-yellow-50/50 border border-yellow-200/60 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
            {t('moderateAlerts')}
          </p>
          <p className="text-3xl font-bold text-yellow-800">1</p>
        </div>
      </div>

      {/* Active Risk Feed Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t('activeRiskFeed')}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t('activeRiskSubtitle')}</p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
            {t('liveUpdates')}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Critical Alert Item */}
          <div className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-xl mt-1">
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{t('shillongTitle')}</h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-md">
                    {t('critical')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{t('shillongDesc')}</p>
                <span className="text-xs text-slate-400 mt-2 block">
                  ⏱ {t('activeAlert')}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-bold text-red-600">90%</p>
              <p className="text-xs text-slate-400">{t('riskProbability')}</p>
            </div>
          </div>

          {/* High Alert Item */}
          <div className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl mt-1">
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{t('gangtokTitle')}</h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-md">
                    {t('high')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{t('gangtokDesc')}</p>
                <span className="text-xs text-slate-400 mt-2 block">
                  ⏱ {t('activeAlert')}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-bold text-orange-600">78%</p>
              <p className="text-xs text-slate-400">{t('riskProbability')}</p>
            </div>
          </div>

          {/* Moderate Alert Item */}
          <div className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-yellow-100 text-yellow-600 rounded-xl mt-1">
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{t('aizawlTitle')}</h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-md">
                    {t('moderate')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{t('aizawlDesc')}</p>
                <span className="text-xs text-slate-400 mt-2 block">
                  ⏱ {t('monsoonWatch')}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-bold text-yellow-600">66%</p>
              <p className="text-xs text-slate-400">{t('riskProbability')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}