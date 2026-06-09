import { Header } from '@/components/layout/Header'
import { KPICard } from '@/components/dashboard/KPICard'
import { useTheme } from '@/contexts/ThemeContext'
import {
  DollarSign,
  Hash,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const kpis = [
  { label: 'Volume Total', value: '€ 8.74M', change: '+18.3%', trend: 'up' as const, icon: DollarSign, iconBg: 'bg-jinbe-primary/10 text-jinbe-primary' },
  { label: 'Operações', value: '1,247', change: '+8.5%', trend: 'up' as const, icon: Hash, iconBg: 'bg-jinbe-info/10 text-jinbe-info' },
  { label: 'Taxa Média', value: '5.4325', change: '-0.2%', trend: 'down' as const, icon: TrendingUp, iconBg: 'bg-jinbe-success/10 text-jinbe-success' },
  { label: 'Tempo Médio', value: '12m 45s', change: '-12%', trend: 'up' as const, icon: Clock, iconBg: 'bg-jinbe-warning/10 text-jinbe-warning' },
]

const volumeData = [
  { month: 'Oct', volume: 4200000, ops: 890 },
  { month: 'Nov', volume: 5100000, ops: 1020 },
  { month: 'Dec', volume: 4800000, ops: 960 },
  { month: 'Jan', volume: 6200000, ops: 1100 },
  { month: 'Feb', volume: 7400000, ops: 1180 },
  { month: 'Mar', volume: 8740000, ops: 1247 },
]

const rateData = [
  { day: '01', rate: 5.42 },
  { day: '05', rate: 5.44 },
  { day: '10', rate: 5.41 },
  { day: '15', rate: 5.45 },
  { day: '20', rate: 5.43 },
  { day: '25', rate: 5.44 },
  { day: '30', rate: 5.43 },
]

const statusDistribution = [
  { name: 'Concluídas', value: 1089, color: '#10b981' },
  { name: 'Processando', value: 87, color: '#0d7ff2' },
  { name: 'Pendentes', value: 42, color: '#f59e0b' },
  { name: 'Falhas', value: 29, color: '#f43f5e' },
]

const topClients = [
  { name: 'Banco Flex', volume: '€ 3.87M', ops: 256, share: 44 },
  { name: 'Agro Norte SA', volume: '€ 2.13M', ops: 142, share: 24 },
  { name: 'TechCorp Brasil', volume: '€ 1.24M', ops: 87, share: 14 },
  { name: 'Exporta Sul', volume: '€ 892K', ops: 64, share: 10 },
  { name: 'Comex Partners', volume: '€ 430K', ops: 31, share: 5 },
]

const corridors = [
  { route: 'BRL → EUR (Alemanha)', volume: '€ 2.89M', change: '+22%', up: true },
  { route: 'BRL → EUR (França)', volume: '€ 1.92M', change: '+15%', up: true },
  { route: 'BRL → EUR (Holanda)', volume: '€ 1.34M', change: '+8%', up: true },
  { route: 'BRL → EUR (Espanha)', volume: '€ 980K', change: '-3%', up: false },
  { route: 'BRL → CHF (Suíça)', volume: '€ 670K', change: '+31%', up: true },
]

export default function Metrics() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const tooltipStyle = {
    background: isLight ? '#ffffff' : '#1a202c',
    border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
    borderRadius: 8,
    fontSize: 11,
    color: isLight ? '#0f172a' : '#ffffff',
  }
  const gridColor = isLight ? '#e2e8f0' : '#1e293b'
  const tickColor = '#64748b'

  return (
    <>
      <Header title="Métricas & KPIs" subtitle="Visão geral de desempenho da plataforma" />

      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {kpis.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Volume chart */}
          <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-jinbe-text">Volume Mensal (EUR)</h3>
              <div className="flex items-center gap-3 sm:gap-4 text-xs text-jinbe-dim">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm bg-jinbe-primary" /> Volume</span>
              </div>
            </div>
            <div className="h-[180px] sm:h-[220px] lg:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000000).toFixed(0)}M`} width={40} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [name === 'volume' ? `€ ${(Number(value) / 1000000).toFixed(2)}M` : value, name === 'volume' ? 'Volume' : 'Operations']}
                  />
                  <Bar dataKey="volume" fill="#0d7ff2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status distribution pie */}
          <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <h3 className="text-sm font-semibold text-jinbe-text">Distribuição de Status</h3>
            <div className="h-[140px] sm:h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {statusDistribution.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-jinbe-muted">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-xs font-semibold text-jinbe-text">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rate chart + corridors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Rate trend */}
          <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <h3 className="text-sm font-semibold text-jinbe-text">Taxa de Câmbio BRL/EUR (30d)</h3>
            <div className="h-[160px] sm:h-[180px] lg:h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[5.38, 5.48]} tick={{ fill: tickColor, fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="rate" stroke="#0d7ff2" strokeWidth={2} dot={{ fill: '#0d7ff2', r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top corridors */}
          <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <h3 className="text-sm font-semibold text-jinbe-text">Principais Corredores</h3>
            <div className="flex flex-col gap-2 sm:gap-3">
              {corridors.map((c, i) => (
                <div key={c.route} className="flex items-center justify-between py-2 sm:py-2.5 border-b border-jinbe-border last:border-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-jinbe-card text-[10px] sm:text-xs font-semibold text-jinbe-dim border border-jinbe-border">
                      {i + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-jinbe-text">{c.route}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm font-semibold text-jinbe-text">{c.volume}</span>
                    <span className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold ${c.up ? 'text-jinbe-success' : 'text-jinbe-danger'}`}>
                      {c.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {c.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top clients - Mobile cards, Desktop table */}
        <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
          <h3 className="text-sm font-semibold text-jinbe-text">Principais Clientes por Volume</h3>

          {/* Mobile view */}
          <div className="flex flex-col gap-3 sm:hidden">
            {topClients.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between py-2 border-b border-jinbe-border last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-jinbe-primary/10 text-[10px] font-semibold text-jinbe-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-jinbe-text">{c.name}</p>
                    <p className="text-[10px] text-jinbe-dim">{c.ops} ops</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-jinbe-text">{c.volume}</p>
                  <div className="w-16 h-1.5 rounded-full bg-jinbe-border overflow-hidden mt-1">
                    <div className="h-full rounded-full bg-jinbe-primary" style={{ width: `${c.share}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jinbe-border">
                  {['#', 'Cliente', 'Volume', 'Operações', 'Participação'].map((col) => (
                    <th key={col} className="px-3 lg:px-4 py-2.5 text-left text-xs font-semibold text-jinbe-dim uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topClients.map((c, i) => (
                  <tr key={c.name} className="border-b border-jinbe-border last:border-0">
                    <td className="px-3 lg:px-4 py-3 text-sm text-jinbe-dim">{i + 1}</td>
                    <td className="px-3 lg:px-4 py-3 text-sm font-semibold text-jinbe-text">{c.name}</td>
                    <td className="px-3 lg:px-4 py-3 text-sm font-medium text-jinbe-text">{c.volume}</td>
                    <td className="px-3 lg:px-4 py-3 text-sm text-jinbe-muted">{c.ops}</td>
                    <td className="px-3 lg:px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-jinbe-border overflow-hidden max-w-[100px]">
                          <div className="h-full rounded-full bg-jinbe-primary" style={{ width: `${c.share}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-jinbe-muted w-8">{c.share}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance metrics */}
        <div className="flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
          <h3 className="text-sm font-semibold text-jinbe-text">Métricas de Sucesso</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Taxa de Sucesso', value: '97.2%', icon: CheckCircle2, color: 'text-jinbe-success' },
              { label: 'Taxa de Falha', value: '2.3%', icon: AlertTriangle, color: 'text-jinbe-danger' },
              { label: 'Processamento Médio', value: '3m 12s', icon: Clock, color: 'text-jinbe-primary' },
              { label: 'Compliance', value: '99.8%', icon: CheckCircle2, color: 'text-jinbe-success' },
            ].map((m) => {
              const MIcon = m.icon
              return (
                <div key={m.label} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-jinbe-bg border border-jinbe-border">
                  <MIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${m.color}`} />
                  <div>
                    <p className="text-[10px] sm:text-xs text-jinbe-dim">{m.label}</p>
                    <p className="text-sm sm:text-lg font-bold text-jinbe-text">{m.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
