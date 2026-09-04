import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Map,
  Bell,
  FileText,
  Settings,
  CloudSun,
  Menu,
  X,
  HelpCircle,
  Globe,
  ChevronDown,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'as', name: 'Assamese (অসমীয়া)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
]

function Sidebar() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  // Get active display name from current i18n language
  const currentLangObj = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]
  const selectedLang = currentLangObj.name.split(' ')[0]

  // Close language dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('appLanguage', code) // Persist selection to LocalStorage
    setIsLangOpen(false)
  }

  const navItems = [
    { name: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('riskMap'), path: '/risk-map', icon: Map },
    { name: t('weather'), path: '/weather', icon: CloudSun },
    { name: t('alerts'), path: '/alerts', icon: Bell },
    { name: t('reports'), path: '/reports', icon: FileText },
    { name: t('settings'), path: '/settings', icon: Settings },
  ]

  return (
    <>
      {/* 1. Hamburger Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-[9990] p-2.5 rounded-xl bg-sky-500 border border-sky-400 text-white hover:bg-sky-600 shadow-xl transition-all"
          title="Open menu"
        >
          <Menu size={22} />
        </button>
      )}

      {/* 2. Top Right Control Bar */}
      <div className="fixed top-4 right-4 z-[9990] flex items-start gap-3 pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-slate-200 text-xs font-medium text-slate-700 shadow-md backdrop-blur-sm shrink-0">
          <span>📍</span>
          <span>
            {t('verifiedLocation')}: 26.4860, 80.3356
          </span>
        </div>

        <div className="flex flex-col gap-2 items-end relative" ref={langDropdownRef}>
          <button
            onClick={() => alert('Opening Help Desk support...')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 border border-blue-500 text-white text-xs font-medium hover:bg-blue-700 shadow-md transition-all shrink-0 w-36 justify-center"
          >
            <HelpCircle size={15} />
            <span>{t('helpDesk')}</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 shadow-md transition-all w-36"
            >
              <div className="flex items-center gap-1.5 truncate">
                <Globe size={14} className="text-blue-600 shrink-0" />
                <span className="truncate">{selectedLang}</span>
              </div>
              <ChevronDown
                size={14}
                className={`shrink-0 transition-transform ${
                  isLangOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1 w-52 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999] py-1 text-xs">
                <div className="px-3 py-1.5 font-semibold text-slate-400 border-b border-slate-100 text-[10px] uppercase tracking-wider">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-100 transition flex items-center justify-between ${
                      i18n.language === lang.code
                        ? 'font-bold text-blue-600 bg-blue-50'
                        : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Backdrop Blur */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity"
        />
      )}

      {/* 4. Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-slate-900 text-white border-r border-slate-800 z-[9999] transition-transform duration-300 ease-in-out w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-bold whitespace-nowrap">NER-SAFE</h1>
            <p className="text-xs text-slate-400 whitespace-nowrap">
              {t('landslideMonitoring')}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-blue-400 font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={20} className="shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar