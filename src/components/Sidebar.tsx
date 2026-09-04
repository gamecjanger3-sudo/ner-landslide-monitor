import { useState } from 'react'
import {
  LayoutDashboard,
  Map,
  Bell,
  FileText,
  Settings,
  CloudSun,
  MoreVertical,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Risk Map', path: '/risk-map', icon: Map },
    { name: 'Weather', path: '/weather', icon: CloudSun },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <>
      {/* 1. Three-Dot Button: z-[9990] puts it above map tiles */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-[9990] p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl transition-all"
          title="Open menu"
        >
          <MoreVertical size={22} />
        </button>
      )}

      {/* 2. Backdrop Blur Overlay: z-[9998] dims the map underneath */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity"
        />
      )}

      {/* 3. Sidebar Drawer: z-[9999] forces it on TOP of all map elements */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-slate-900 text-white border-r border-slate-800 z-[9999] transition-transform duration-300 ease-in-out w-64 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div>
            <h1 className="text-xl font-bold whitespace-nowrap">NER-SAFE</h1>
            <p className="text-xs text-slate-400 whitespace-nowrap">
              Landslide Monitoring
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
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