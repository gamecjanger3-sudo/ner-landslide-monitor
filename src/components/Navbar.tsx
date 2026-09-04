import { Bell, Search } from 'lucide-react'

function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      {/* Page title */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Disaster Monitoring Dashboard
        </h2>

        <p className="text-sm text-slate-500">
          North Eastern Region
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
          <Search size={18} className="text-slate-500" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-40"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-slate-100">
          <Bell size={21} className="text-slate-700" />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-semibold">
            S
          </div>

          <div>
            <p className="text-sm font-medium text-slate-900">
              SP
            </p>

            <p className="text-xs text-slate-500">
              Disaster Management
            </p>
          </div>

        </div>

      </div>
    </header>
  )
}

export default Navbar