import type { LucideIcon } from 'lucide-react'

interface RiskCardProps {
  title: string
  value: number
  icon: LucideIcon
  description: string
  iconBg: string
}

function RiskCard({
  title,
  value,
  icon: Icon,
  description,
  iconBg,
}: RiskCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h3>

          <p className="text-xs text-slate-500 mt-2">
            {description}
          </p>
        </div>

        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon size={22} />
        </div>

      </div>
    </div>
  )
}

export default RiskCard