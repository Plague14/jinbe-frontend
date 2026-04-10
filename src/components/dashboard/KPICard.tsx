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
    <div className="flex-1 flex flex-col gap-4 p-6 rounded-xl border border-jinbe-border bg-jinbe-card shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-jinbe-muted">{label}</span>
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${iconBg}`}>
          <Icon className="w-[16px] h-[16px]" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-jinbe-text">{value}</p>
        <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
          <TrendIcon className="w-3 h-3" />
          <span className="text-xs font-semibold">{change}</span>
        </div>
      </div>
    </div>
  )
}
