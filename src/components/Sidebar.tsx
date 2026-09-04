import { useState } from 'react'
import {
  LayoutDashboard,
  Map,
  Bell,
  FileText,
  Settings,
  CloudSun,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Risk Map', path: '/risk-map', icon: Map },
    { name: 'Weather', path: '/weather', icon: CloudSun },
    { name: 'Alerts', path: '/alerts', icon: Bell },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <aside
      className={`relative min-h-screen bg-slate-900 text-white border-r border-slate-800 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-7 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-1.5 rounded-full shadow-md transition"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800 overflow-hidden">
        <div>
          <h1 className="text-xl font-bold whitespace-nowrap">
            {isCollapsed ? 'NER' : 'NER-SAFE'}
          </h1>
          {!isCollapsed && (
            <p className="text-xs text-slate-400 whitespace-nowrap">
              Landslide Monitoring
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.name : ''}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition overflow-hidden ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
            >
              <Icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <span className="whitespace-nowrap">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  )
}

export default Sidebar