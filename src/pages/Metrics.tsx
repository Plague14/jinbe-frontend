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
  { label: 'Total Volume', value: '€ 8,740,200', change: '+18.3% vs last month', trend: 'up' as const, icon: DollarSign, iconBg: 'bg-jinbe-primary/10 text-jinbe-primary' },
  { label: 'Operations', value: '1,247', change: '+8.5% vs last month', trend: 'up' as const, icon: Hash, iconBg: 'bg-jinbe-info/10 text-jinbe-info' },
  { label: 'Avg Rate (BRL/EUR)', value: '5.4325', change: '-0.2% vs avg', trend: 'down' as const, icon: TrendingUp, iconBg: 'bg-jinbe-success/10 text-jinbe-success' },
  { label: 'Avg Settlement', value: '12m 45s', change: '-12% faster', trend: 'up' as const, icon: Clock, iconBg: 'bg-jinbe-warning/10 text-jinbe-warning' },
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
  { name: 'Completed', value: 1089, color: '#10b981' },
  { name: 'Processing', value: 87, color: '#0d7ff2' },
  { name: 'Pending', value: 42, color: '#f59e0b' },
  { name: 'Failed', value: 29, color: '#f43f5e' },
]

const topClients = [
  { name: 'Banco Flex', volume: '€ 3,870,000', ops: 256, share: 44 },
  { name: 'Agro Norte SA', volume: '€ 2,130,000', ops: 142, share: 24 },
  { name: 'TechCorp Brasil', volume: '€ 1,245,000', ops: 87, share: 14 },
  { name: 'Exporta Sul LTDA', volume: '€ 892,500', ops: 64, share: 10 },
  { name: 'Comex Partners', volume: '€ 430,200', ops: 31, share: 5 },
]

const corridors = [
  { route: 'BRL → EUR (Germany)', volume: '€ 2,890,000', change: '+22%', up: true },
  { route: 'BRL → EUR (France)', volume: '€ 1,920,000', change: '+15%', up: true },
  { route: 'BRL → EUR (Netherlands)', volume: '€ 1,340,000', change: '+8%', up: true },
  { route: 'BRL → EUR (Spain)', volume: '€ 980,000', change: '-3%', up: false },
  { route: 'BRL → CHF (Switzerland)', volume: '€ 670,000', change: '+31%', up: true },
]

export default function Metrics() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const tooltipStyle = {
    background: isLight ? '#ffffff' : '#1a202c',
    border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
    borderRadius: 8,
    fontSize: 12,
    color: isLight ? '#0f172a' : '#ffffff',
  }
  const gridColor = isLight ? '#e2e8f0' : '#1e293b'
  const tickColor = '#64748b'

  return (
    <>
      <Header title="Metrics & KPIs" subtitle="Platform performance overview" />

      <div className="flex flex-col gap-8 p-8">
        {/* KPI Row */}
        <div className="flex gap-6">
          {kpis.map((kpi) => (
            <KPICard key={kpi.label} {...kpi} />
          ))}
        </div>

        {/* Charts row */}
        <div className="flex gap-6">
          {/* Volume chart */}
          <div className="flex-[2] flex flex-col gap-4 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-jinbe-text">Monthly Volume (EUR)</h3>
              <div className="flex items-center gap-4 text-xs text-jinbe-dim">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-jinbe-primary" /> Volume</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-jinbe-primary/30" /> Operations</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => [name === 'volume' ? `€ ${(Number(value) / 1000000).toFixed(2)}M` : value, name === 'volume' ? 'Volume' : 'Operations']}
                />
                <Bar dataKey="volume" fill="#0d7ff2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status distribution pie */}
          <div className="flex-1 flex flex-col gap-4 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <h3 className="text-sm font-semibold text-jinbe-text">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {statusDistribution.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-jinbe-muted">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-xs font-semibold text-jinbe-text">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rate chart + corridors */}
        <div className="flex gap-6">
          {/* Rate trend */}
          <div className="flex-1 flex flex-col gap-4 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <h3 className="text-sm font-semibold text-jinbe-text">BRL/EUR Exchange Rate (30d)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={rateData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[5.38, 5.48]} tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rate" stroke="#0d7ff2" strokeWidth={2} dot={{ fill: '#0d7ff2', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top corridors */}
          <div className="flex-1 flex flex-col gap-4 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <h3 className="text-sm font-semibold text-jinbe-text">Top Corridors</h3>
            <div className="flex flex-col gap-3">
              {corridors.map((c, i) => (
                <div key={c.route} className="flex items-center justify-between py-2.5 border-b border-jinbe-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-jinbe-card text-xs font-semibold text-jinbe-dim border border-jinbe-border">
                      {i + 1}
                    </span>
                    <p className="text-sm text-jinbe-text">{c.route}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-jinbe-text">{c.volume}</span>
                    <span className={`flex items-center gap-0.5 text-xs font-semibold ${c.up ? 'text-jinbe-success' : 'text-jinbe-danger'}`}>
                      {c.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {c.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top clients table */}
        <div className="flex flex-col gap-4 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
          <h3 className="text-sm font-semibold text-jinbe-text">Top Clients by Volume</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-jinbe-border">
                {['#', 'Client', 'Volume', 'Operations', 'Share'].map((col) => (
                  <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold text-jinbe-dim uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topClients.map((c, i) => (
                <tr key={c.name} className="border-b border-jinbe-border last:border-0">
                  <td className="px-4 py-3 text-sm text-jinbe-dim">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-jinbe-text">{c.name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-jinbe-text">{c.volume}</td>
                  <td className="px-4 py-3 text-sm text-jinbe-muted">{c.ops}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-jinbe-border overflow-hidden">
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

        {/* Performance metrics */}
        <div className="flex gap-6">
          <div className="flex-1 flex flex-col gap-4 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <h3 className="text-sm font-semibold text-jinbe-text">Success Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Success Rate', value: '97.2%', icon: CheckCircle2, color: 'text-jinbe-success' },
                { label: 'Failure Rate', value: '2.3%', icon: AlertTriangle, color: 'text-jinbe-danger' },
                { label: 'Avg Processing', value: '3m 12s', icon: Clock, color: 'text-jinbe-primary' },
                { label: 'Compliance Pass', value: '99.8%', icon: CheckCircle2, color: 'text-jinbe-success' },
              ].map((m) => {
                const MIcon = m.icon
                return (
                  <div key={m.label} className="flex items-center gap-3 p-4 rounded-lg bg-jinbe-bg border border-jinbe-border">
                    <MIcon className={`w-8 h-8 ${m.color}`} />
                    <div>
                      <p className="text-xs text-jinbe-dim">{m.label}</p>
                      <p className="text-lg font-bold text-jinbe-text">{m.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
