import { Bell, Wifi, Languages, Save, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Language mapping to match i18next language codes
const LANGUAGE_CODES: Record<string, string> = {
  English: 'en',
  Hindi: 'hi',
  Bengali: 'bn',
  Assamese: 'as',
  Nepali: 'ne',
  Manipuri: 'en', // Fallback to 'en' if resource not present
  Mizo: 'en',
  Khasi: 'en',
}

const REVERSE_LANGUAGE_CODES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  bn: 'Bengali',
  as: 'Assamese',
  ne: 'Nepali',
}

interface SettingsProps {
  onLogout: () => void
}

function Settings({ onLogout }: SettingsProps) {
  const { t, i18n } = useTranslation()

  // Derive active language string directly during render
  const selectedLanguage = REVERSE_LANGUAGE_CODES[i18n.language] || 'English'

  const [notifications, setNotifications] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [highAlerts, setHighAlerts] = useState(true)
  const [offlineMode, setOfflineMode] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleLanguageChange = (selectedLang: string) => {
    const langCode = LANGUAGE_CODES[selectedLang] || 'en'

    // Update i18next and persist code to localStorage
    i18n.changeLanguage(langCode)
    localStorage.setItem('appLanguage', langCode)
  }

  const handleSave = () => {
    const langCode = LANGUAGE_CODES[selectedLanguage] || 'en'
    localStorage.setItem('appLanguage', langCode)

    setSaved(true)
    setTimeout(() => {
      setSaved(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          {t('Settings Title')}
        </h1>
        <p className="mt-1 text-slate-500">
          {t('settingsSubtitle')}
        </p>
      </div>

      {/* Success message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4">
          Settings saved successfully.
        </div>
      )}

      {/* Language */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Languages size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {t('language')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('selectPreferredLanguage')}
            </p>
          </div>
        </div>

        <select
          value={selectedLanguage}
          onChange={(event) => handleLanguageChange(event.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi (à¤¹à¤¿à¤‚à¤¦à¥€)</option>
          <option value="Assamese">Assamese (à¦…à¦¸à¦®à§€à¦¯à¦¼à¦¾)</option>
          <option value="Bengali">Bengali (à¦¬à¦¾à¦‚à¦²à¦¾)</option>
          <option value="Nepali">Nepali (à¤¨à¥‡à¤ªà¤¾à¤²à¥€)</option>
          <option value="Manipuri">Manipuri</option>
          <option value="Mizo">Mizo</option>
          <option value="Khasi">Khasi</option>
        </select>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Bell size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {t('Notifications')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('Control Alerts')}
            </p>
          </div>
        </div>

        {/* Main notifications */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div>
            <p className="font-medium text-slate-800">
              {t('Enable Notifications')}
            </p>
            <p className="text-sm text-slate-500">
              {t('Receive Warnings')}
            </p>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(event) => setNotifications(event.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        {/* Critical alerts */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100">
          <div>
            <p className="font-medium text-slate-800">
              {t('Critical Alerts')}
            </p>
            <p className="text-sm text-slate-500">
              {t('Receive Immediate Warnings')}
            </p>
          </div>
          <input
            type="checkbox"
            checked={criticalAlerts}
            onChange={(event) => setCriticalAlerts(event.target.checked)}
            disabled={!notifications}
            className="w-5 h-5 cursor-pointer"
          />
        </div>

        {/* High alerts */}
        <div className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium text-slate-800">
              {t('High Risk Alerts')}
            </p>
            <p className="text-sm text-slate-500">
              {t('Receive High Risk Warnings')}
            </p>
          </div>
          <input
            type="checkbox"
            checked={highAlerts}
            onChange={(event) => setHighAlerts(event.target.checked)}
            disabled={!notifications}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      </div>

      {/* Offline mode */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Wifi size={22} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {t('Offline Mode')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('Useful Remote Areas')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-800">
              {t('Enable Offline Sync')}
            </p>
            <p className="text-sm text-slate-500">
              Store reports locally and synchronize when the network returns.
            </p>
          </div>
          <input
            type="checkbox"
            checked={offlineMode}
            onChange={(event) => setOfflineMode(event.target.checked)}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      </div>

      {/* Account */}
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
        <User size={22} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          My Profile
        </h2>
        <p className="text-sm text-slate-500">
          View your account information and sign out.
        </p>
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-500">Name</p>
        <p className="font-medium text-slate-800">
          {JSON.parse(localStorage.getItem('ner_user') || '{}').full_name || 'User'}
        </p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Email</p>
        <p className="font-medium text-slate-800">
          {JSON.parse(localStorage.getItem('ner_user') || '{}').email || 'Not available'}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  </div>
  {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
        >
          <Save size={18} />
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default Settings

