import { DollarSign, Hash, TrendingUp, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { KPICard } from '@/components/dashboard/KPICard'
import { VolumeChart } from '@/components/dashboard/VolumeChart'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

const kpis = [
  {
    label: 'Volume',
    value: '€1.250.400',
    change: '+12% vs mês anterior',
    trend: 'up' as const,
    icon: DollarSign,
    iconBg: 'bg-jinbe-primary/10 text-jinbe-primary',
  },
  {
    label: 'Operações',
    value: '450',
    change: '-2% vs mês anterior',
    trend: 'down' as const,
    icon: Hash,
    iconBg: 'bg-jinbe-info/10 text-jinbe-info',
  },
  {
    label: 'Taxa Média',
    value: '1.0825',
    change: '+0.5% vs média',
    trend: 'up' as const,
    icon: TrendingUp,
    iconBg: 'bg-jinbe-success/10 text-jinbe-success',
  },
  {
    label: 'Tempo Médio',
    value: '14m 20s',
    change: '-5% mais rápido',
    trend: 'up' as const,
    icon: Clock,
    iconBg: 'bg-jinbe-warning/10 text-jinbe-warning',
  },
]

export default function Dashboard() {
  return (
    <>
      <Header title="Painel" subtitle="Visão geral das suas operações internacionais" />
      
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
