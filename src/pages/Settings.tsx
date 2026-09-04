import {
  Bell,
  Wifi,
  Languages,
  Save,
} from 'lucide-react'
import { useState } from 'react'

function Settings() {
  const [language, setLanguage] = useState('English')
  const [notifications, setNotifications] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [highAlerts, setHighAlerts] = useState(true)
  const [offlineMode, setOfflineMode] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
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
          Settings
        </h1>

        <p className="mt-1 text-slate-500">
          Manage language, notifications and offline monitoring preferences.
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
              Language
            </h2>

            <p className="text-sm text-slate-500">
              Select your preferred notification language.
            </p>
          </div>

        </div>


        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="w-full md:w-96 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          <option>English</option>
          <option>Hindi</option>
          <option>Assamese</option>
          <option>Bengali</option>
          <option>Manipuri</option>
          <option>Mizo</option>
          <option>Khasi</option>
          <option>Nepali</option>
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
              Notifications
            </h2>

            <p className="text-sm text-slate-500">
              Control which disaster alerts you receive.
            </p>
          </div>

        </div>


        {/* Main notifications */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100">

          <div>
            <p className="font-medium text-slate-800">
              Enable Notifications
            </p>

            <p className="text-sm text-slate-500">
              Receive disaster and landslide warnings.
            </p>
          </div>

          <input
            type="checkbox"
            checked={notifications}
            onChange={(event) =>
              setNotifications(event.target.checked)
            }
            className="w-5 h-5"
          />

        </div>


        {/* Critical alerts */}
        <div className="flex items-center justify-between py-4 border-b border-slate-100">

          <div>
            <p className="font-medium text-slate-800">
              Critical Alerts
            </p>

            <p className="text-sm text-slate-500">
              Receive immediate warnings for critical zones.
            </p>
          </div>

          <input
            type="checkbox"
            checked={criticalAlerts}
            onChange={(event) =>
              setCriticalAlerts(event.target.checked)
            }
            disabled={!notifications}
            className="w-5 h-5"
          />

        </div>


        {/* High alerts */}
        <div className="flex items-center justify-between py-4">

          <div>
            <p className="font-medium text-slate-800">
              High Risk Alerts
            </p>

            <p className="text-sm text-slate-500">
              Receive warnings for high-risk areas.
            </p>
          </div>

          <input
            type="checkbox"
            checked={highAlerts}
            onChange={(event) =>
              setHighAlerts(event.target.checked)
            }
            disabled={!notifications}
            className="w-5 h-5"
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
              Offline Mode
            </h2>

            <p className="text-sm text-slate-500">
              Useful for remote areas with limited network connectivity.
            </p>
          </div>

        </div>


        <div className="flex items-center justify-between">

          <div>
            <p className="font-medium text-slate-800">
              Enable Offline Sync
            </p>

            <p className="text-sm text-slate-500">
              Store reports locally and synchronize when the network returns.
            </p>
          </div>

          <input
            type="checkbox"
            checked={offlineMode}
            onChange={(event) =>
              setOfflineMode(event.target.checked)
            }
            className="w-5 h-5"
          />

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