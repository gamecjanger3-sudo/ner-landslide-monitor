import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { Weather } from './components/Weather.tsx'
import { LocationAlertModal } from './components/LocationAlertModal'

// Import all your actual page components from src/pages
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import RiskMap from './pages/RiskMap'
import Settings from './pages/Settings'

export function App() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  const handleAccessGranted = (coords: { lat: number; lon: number }) => {
    setUserLocation(coords)
    setIsAuthorized(true)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 relative">
        {/* 1. Location & Landslide Advisory Modal */}
        {!isAuthorized && <LocationAlertModal onAccessGranted={handleAccessGranted} />}

        {/* 2. Main App Content */}
        <div className={`flex min-h-screen ${!isAuthorized ? 'blur-sm pointer-events-none select-none' : ''}`}>
          <Sidebar />

          <main className="flex-1 p-8 overflow-y-auto">
            {userLocation && (
              <div className="mb-6 flex justify-end">
                <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full border border-slate-300 font-mono">
                  📍 Verified Location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                </span>
              </div>
            )}

            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/risk-map" element={<RiskMap />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App