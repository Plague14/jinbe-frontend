import { DollarSign, Hash, TrendingUp, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { KPICard } from '@/components/dashboard/KPICard'
import { VolumeChart } from '@/components/dashboard/VolumeChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

const kpis = [
  {
    label: 'Volume',
    value: '€1,250,400',
    change: '+12% vs last month',
    trend: 'up' as const,
    icon: DollarSign,
    iconBg: 'bg-jinbe-primary/10 text-jinbe-primary',
  },
  {
    label: 'Ops Count',
    value: '450',
    change: '-2% vs last month',
    trend: 'down' as const,
    icon: Hash,
    iconBg: 'bg-jinbe-info/10 text-jinbe-info',
  },
  {
    label: 'Avg Rate',
    value: '1.0825',
    change: '+0.5% vs avg',
    trend: 'up' as const,
    icon: TrendingUp,
    iconBg: 'bg-jinbe-success/10 text-jinbe-success',
  },
  {
    label: 'Avg Time',
    value: '14m 20s',
    change: '-5% faster',
    trend: 'up' as const,
    icon: Clock,
    iconBg: 'bg-jinbe-warning/10 text-jinbe-warning',
  },
]

export default function Dashboard() {
  return (
    <>
      <Header title="Dashboard" subtitle="PIX to SEPA Cross-border Tracking" />

      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {kpis.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Chart + Activity */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <VolumeChart />
          <RecentActivity />
        </div>
      </div>
    </>
  )
}
