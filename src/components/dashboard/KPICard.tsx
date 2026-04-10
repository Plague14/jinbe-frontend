import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'

interface KPICardProps {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  iconBg: string
}

export function KPICard({ label, value, change, trend, icon: Icon, iconBg }: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
  const trendColor = trend === 'up' ? 'text-jinbe-success' : 'text-jinbe-danger'

  return (
    <div className="flex flex-col gap-2 sm:gap-4 p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-base font-medium text-jinbe-muted">{label}</span>
        <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg ${iconBg}`}>
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
      </div>
      <div>
        <p className="text-lg sm:text-2xl font-bold text-jinbe-text">{value}</p>
        <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="text-[10px] sm:text-xs font-semibold truncate">{change}</span>
        </div>
      </div>
    </div>
  )
}
