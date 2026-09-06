import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Weather from './components/Weather'
import { LocationAlertModal } from './components/LocationAlertModal'
import { useTranslation } from 'react-i18next'
import { OnboardingTour } from './components/OnboardingTour'
import Login from './auth/Login'
import Signup from './auth/Signup'
import { getMe, logout } from './auth/authApi'

// Pages
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import RiskMap from './pages/RiskMap'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export function App() {
  const { i18n } = useTranslation()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  const [showSignup, setShowSignup] = useState(false)

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false)

  const [, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = await getMe()

        localStorage.setItem('ner_user', JSON.stringify(user))
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem('ner_user')
        setIsAuthenticated(false)
      } finally {
        setIsAuthChecking(false)
      }
    }

    checkAuthentication()
  }, [])

  const handleAccessGranted = (coords: { lat: number; lon: number }) => {
    setUserLocation(coords)
    setIsAuthorized(true)
  }

  const handleLoginSuccess = async () => {
    try {
      const user = await getMe()

      localStorage.setItem('ner_user', JSON.stringify(user))
      setIsAuthenticated(true)
    } catch {
      localStorage.removeItem('ner_user')
      setIsAuthenticated(false)
    }
  }

  const handleLogout = async () => {
  	try {
  	  await logout()
  	} catch (error) {
  	  console.error('Logout request failed:', error)
  	} finally {
  	  localStorage.removeItem('ner_user')
  	  setIsAuthenticated(false)
  	  setIsAuthorized(false)
  	}
  }

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">
          Checking authentication...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {showSignup ? (
          <Signup
            onSwitchToLogin={() => setShowSignup(false)}
            onSignupSuccess={handleLoginSuccess}
          />
        ) : (
          <Login
            onSwitchToSignup={() => setShowSignup(true)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900 relative">
        {isAuthorized && <OnboardingTour currentLang={i18n.language} />}

        {!isAuthorized && (
          <LocationAlertModal onAccessGranted={handleAccessGranted} />
        )}

        <div
          className={`flex min-h-screen ${
            !isAuthorized
              ? 'blur-sm pointer-events-none select-none'
              : ''
          }`}
        >
          <Sidebar />

          <main className="flex-1 p-8 pt-20 pl-16 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/risk-map" element={<RiskMap />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route
                path="/settings"
                element={<Settings onLogout={handleLogout} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App