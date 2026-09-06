import { useTranslation } from 'react-i18next'
import { RefreshCw, AlertTriangle } from 'lucide-react'

export default function Alerts() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Header with Sync Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t('Alerts Title')}</h1>
          <p className="mt-1 text-slate-500">{t('Alerts Subtitle')}</p>
        </div>

        <button className="relative top-12 flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <RefreshCw size={16} />
          <span>{t('Sync Nasa Feed')}</span>
        </button>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 bg-red-50/50 border border-red-200/60 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wide">
            {t('Critical Alerts')}
          </p>
          <p className="text-3xl font-bold text-red-700">1</p>
        </div>

        <div className="p-5 bg-orange-50/50 border border-orange-200/60 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
            {t('High Alerts')}
          </p>
          <p className="text-3xl font-bold text-orange-700">1</p>
        </div>

        <div className="p-5 bg-yellow-50/50 border border-yellow-200/60 rounded-xl space-y-2">
          <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
            {t('Moderate Alerts')}
          </p>
          <p className="text-3xl font-bold text-yellow-800">1</p>
        </div>
      </div>

      {/* Active Risk Feed Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{t('Active Risk Feed')}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t('Active Risk Subtitle')}</p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
            {t('Live Updates')}
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
                  <h3 className="font-semibold text-slate-900">{t('Shillong Title')}</h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-md">
                    {t('Critical')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{t('Shillong Desc')}</p>
                <span className="text-xs text-slate-400 mt-2 block">
                  ⏱ {t('Active Alert')}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-bold text-red-600">90%</p>
              <p className="text-xs text-slate-400">{t('Risk Probability')}</p>
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
                  <h3 className="font-semibold text-slate-900">{t('Gangtok Title')}</h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-md">
                    {t('High')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{t('Gangtok Desc')}</p>
                <span className="text-xs text-slate-400 mt-2 block">
                  ⏱ {t('Active Alert')}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-bold text-orange-600">78%</p>
              <p className="text-xs text-slate-400">{t('Risk Probability')}</p>
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
                  <h3 className="font-semibold text-slate-900">{t('Aizawl Title')}</h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-md">
                    {t('Moderate')}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{t('Aizawl Desc')}</p>
                <span className="text-xs text-slate-400 mt-2 block">
                  ⏱ {t('Monsoon Watch')}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl font-bold text-yellow-600">66%</p>
              <p className="text-xs text-slate-400">{t('Risk Probability')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}