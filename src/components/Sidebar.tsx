import {
  LayoutDashboard,
  Map,
  Bell,
  FileText,
  Settings,
  CloudSun,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

function Sidebar() {
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Risk Map',
      path: '/risk-map',
      icon: Map,
    },
    {
      name: 'Weather',
      path: '/weather',
      icon: CloudSun,
    },
    {
      name: 'Alerts',
      path: '/alerts',
      icon: Bell,
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: FileText,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ]

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white border-r border-slate-800">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold">NER-SAFE</h1>
          <p className="text-xs text-slate-400">Landslide Monitoring</p>
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
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar