import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { Weather } from './components/Weather.tsx'
import { LocationAlertModal } from './components/LocationAlertModal'

// Pages
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import RiskMap from './pages/RiskMap'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export function App() {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
  const [, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  const handleAccessGranted = (coords: { lat: number; lon: number }) => {
    setUserLocation(coords)
    setIsAuthorized(true)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 relative">
        {!isAuthorized && <LocationAlertModal onAccessGranted={handleAccessGranted} />}

        <div className={`flex min-h-screen ${!isAuthorized ? 'blur-sm pointer-events-none select-none' : ''}`}>
          <Sidebar />

          {/* Added pt-20 pl-16 so page headers and buttons like "Sync NASA Feed" sit safely below floating top elements */}
          <main className="flex-1 p-8 pt-20 pl-16 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/risk-map" element={<RiskMap />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />

              {/* Catch-all route to display 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App