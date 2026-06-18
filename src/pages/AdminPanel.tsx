import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  Globe,
  CreditCard,
  BarChart3,
  PieChart,
  Percent,
  Edit3,
  Save,
  X,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts'

// KPIs do Fundador
const founderKpis = [
  { label: 'Total de Contas', value: '847', change: '+12% este mês', trend: 'up' as const, icon: Users, iconBg: 'bg-jinbe-primary/10 text-jinbe-primary' },
  { label: 'Empresas Ativas', value: '623', change: '+8% este mês', trend: 'up' as const, icon: Building2, iconBg: 'bg-jinbe-success/10 text-jinbe-success' },
  { label: 'Volume Total', value: '€ 47.8M', change: '+23% este mês', trend: 'up' as const, icon: DollarSign, iconBg: 'bg-jinbe-warning/10 text-jinbe-warning' },
  { label: 'Receita (Spread)', value: 'R$ 2.4M', change: '+18% este mês', trend: 'up' as const, icon: TrendingUp, iconBg: 'bg-jinbe-info/10 text-jinbe-info' },
]

// Status das contas
const accountStatusData = [
  { name: 'Ativas', value: 623, color: '#10b981' },
  { name: 'Pendentes KYC', value: 156, color: '#f59e0b' },
  { name: 'Em Análise', value: 42, color: '#0d7ff2' },
  { name: 'Suspensas', value: 26, color: '#f43f5e' },
]

// Crescimento de usuários por mês
const userGrowthData = [
  { month: 'Jan', users: 245, volume: 12.4 },
  { month: 'Fev', users: 312, volume: 15.8 },
  { month: 'Mar', users: 398, volume: 21.3 },
  { month: 'Abr', users: 487, volume: 28.7 },
  { month: 'Mai', users: 612, volume: 36.2 },
  { month: 'Jun', users: 756, volume: 43.1 },
  { month: 'Jul', users: 847, volume: 47.8 },
]

// Setores de clientes
const sectorData = [
  { name: 'Pescados', value: 187, percent: '22%' },
  { name: 'Agronegócio', value: 156, percent: '18%' },
  { name: 'Tecnologia', value: 134, percent: '16%' },
  { name: 'Indústria', value: 112, percent: '13%' },
  { name: 'Comércio', value: 98, percent: '12%' },
  { name: 'Outros', value: 160, percent: '19%' },
]

// Métricas de operações
const operationsMetrics = [
  { label: 'Operações Hoje', value: '127', icon: ArrowUpDown },
  { label: 'Volume Hoje', value: '€ 1.2M', icon: DollarSign },
  { label: 'Tempo Médio', value: '8m 45s', icon: Clock },
  { label: 'Taxa de Sucesso', value: '98.7%', icon: CheckCircle2 },
]

// Principais países de destino
const topCountries = [
  { country: 'Alemanha', flag: '🇩🇪', volume: '€ 12.4M', percent: '26%' },
  { country: 'França', flag: '🇫🇷', volume: '€ 8.7M', percent: '18%' },
  { country: 'Holanda', flag: '🇳🇱', volume: '€ 6.2M', percent: '13%' },
  { country: 'Espanha', flag: '🇪🇸', volume: '€ 5.8M', percent: '12%' },
  { country: 'Itália', flag: '🇮🇹', volume: '€ 4.9M', percent: '10%' },
]

// Últimas contas criadas
const recentAccounts = [
  { id: 'ACC-847', name: 'Importadora Silva & Cia', sector: 'Pescados', status: 'active', date: 'Hoje 14:32' },
  { id: 'ACC-846', name: 'TechBR Solutions', sector: 'Tecnologia', status: 'pending', date: 'Hoje 11:15' },
  { id: 'ACC-845', name: 'Agro Norte LTDA', sector: 'Agronegócio', status: 'active', date: 'Ontem 18:42' },
  { id: 'ACC-844', name: 'Metal Export SA', sector: 'Indústria', status: 'active', date: 'Ontem 09:20' },
  { id: 'ACC-843', name: 'Distribuidora Global', sector: 'Comércio', status: 'review', date: '02/06 16:55' },
]

const statusConfig = {
  active: { label: 'Ativa', icon: CheckCircle2, className: 'text-jinbe-success bg-jinbe-success/10' },
  pending: { label: 'Pendente KYC', icon: Clock, className: 'text-jinbe-warning bg-jinbe-warning/10' },
  review: { label: 'Em Análise', icon: Activity, className: 'text-jinbe-info bg-jinbe-info/10' },
  suspended: { label: 'Suspensa', icon: XCircle, className: 'text-jinbe-danger bg-jinbe-danger/10' },
}

// Configuração de Spread por Cliente
const initialSpreadConfig = [
  { id: 1, name: 'Importadora Silva & Cia', sector: 'Pescados', volume: '€ 4.25M', currentSpread: 1.85, defaultSpread: 1.72, status: 'active' as const, comissionado: 'Israel Oliveira' },
  { id: 2, name: 'Agro Norte LTDA', sector: 'Agronegócio', volume: '€ 3.18M', currentSpread: 1.72, defaultSpread: 1.72, status: 'active' as const, comissionado: 'Maria Santos' },
  { id: 3, name: 'TechBR Solutions', sector: 'Tecnologia', volume: '€ 2.89M', currentSpread: 1.65, defaultSpread: 1.72, status: 'active' as const, comissionado: '' },
  { id: 4, name: 'Metal Export SA', sector: 'Indústria', volume: '€ 2.45M', currentSpread: 1.78, defaultSpread: 1.72, status: 'active' as const, comissionado: 'Israel Oliveira' },
  { id: 5, name: 'Distribuidora Global', sector: 'Comércio', volume: '€ 1.98M', currentSpread: 1.55, defaultSpread: 1.72, status: 'pending' as const, comissionado: 'João Pedro' },
  { id: 6, name: 'Pescados do Sul', sector: 'Pescados', volume: '€ 1.75M', currentSpread: 1.90, defaultSpread: 1.72, status: 'active' as const, comissionado: 'Israel Oliveira' },
  { id: 7, name: 'AgroTech Brasil', sector: 'Agronegócio', volume: '€ 1.42M', currentSpread: 1.68, defaultSpread: 1.72, status: 'active' as const, comissionado: '' },
  { id: 8, name: 'Indústria Paulista', sector: 'Indústria', volume: '€ 1.18M', currentSpread: 1.75, defaultSpread: 1.72, status: 'review' as const, comissionado: 'Maria Santos' },
]

export default function AdminPanel() {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [spreadConfig, setSpreadConfig] = useState(initialSpreadConfig)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  const handleEditSpread = (id: number, currentValue: number) => {
    setEditingId(id)
    setEditValue(currentValue.toString())
  }

  const handleSaveSpread = (id: number) => {
    const newValue = parseFloat(editValue)
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 10) {
      setSpreadConfig(prev =>
        prev.map(item =>
          item.id === id ? { ...item, currentSpread: newValue } : item
        )
      )
    }
    setEditingId(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  return (
    <>
      <Header title="Painel do Fundador" subtitle="Visão macro da plataforma Jinbe" />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {founderKpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className="p-4 sm:p-5 rounded-xl border border-jinbe-border bg-jinbe-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${kpi.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-jinbe-success' : 'text-jinbe-danger'}`}>
                    {kpi.change}
                  </span>
                </div>
                <p className={`text-2xl font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{kpi.value}</p>
                <p className="text-sm text-jinbe-muted">{kpi.label}</p>
              </div>
            )
          })}
        </div>

        {/* Métricas de Operações em Tempo Real */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {operationsMetrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="flex items-center gap-3 p-4 rounded-xl border border-jinbe-border bg-jinbe-card">
                <div className="p-2 rounded-lg bg-jinbe-primary/10">
                  <Icon className="w-4 h-4 text-jinbe-primary" />
                </div>
                <div>
                  <p className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{m.value}</p>
                  <p className="text-xs text-jinbe-muted">{m.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Crescimento */}
          <div className="lg:col-span-2 p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-jinbe-primary" />
                <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Crescimento de Usuários e Volume</h3>
              </div>
              <span className="text-xs text-jinbe-dim">Últimos 7 meses</span>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d7ff2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d7ff2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#1a202c',
                      border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
                      borderRadius: '8px',
                      color: isLight ? '#1e293b' : '#fff'
                    }}
                    labelStyle={{ color: isLight ? '#1e293b' : '#fff' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="users" stroke="#0d7ff2" fill="url(#colorUsers)" name="Usuários" />
                  <Area yAxisId="right" type="monotone" dataKey="volume" stroke="#10b981" fill="url(#colorVolume)" name="Volume (€M)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status das Contas */}
          <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Status das Contas</h3>
            </div>
            <div className="h-[180px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={accountStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {accountStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#1a202c',
                      border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
                      borderRadius: '8px',
                      color: isLight ? '#1e293b' : '#fff'
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {accountStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-jinbe-muted">{item.name}</span>
                  </div>
                  <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Principais Países de Destino */}
          <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Principais Destinos</h3>
            </div>
            <div className="space-y-3">
              {topCountries.map((c, i) => (
                <div key={c.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{c.flag}</span>
                    <div>
                      <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{c.country}</p>
                      <p className="text-xs text-jinbe-dim">{c.percent} do volume</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{c.volume}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Setores */}
          <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Setores de Clientes</h3>
            </div>
            <div className="space-y-3">
              {sectorData.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-sm text-jinbe-muted">{s.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-jinbe-border overflow-hidden">
                      <div
                        className="h-full bg-jinbe-primary rounded-full"
                        style={{ width: s.percent }}
                      />
                    </div>
                    <span className="text-xs text-jinbe-muted w-8">{s.percent}</span>
                    <span className={`text-sm font-semibold w-8 ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Últimas Contas */}
          <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Últimas Contas Criadas</h3>
            </div>
            <div className="space-y-3">
              {recentAccounts.map((acc) => {
                const status = statusConfig[acc.status as keyof typeof statusConfig]
                const StatusIcon = status.icon
                return (
                  <div key={acc.id} className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{acc.name}</p>
                      <p className="text-xs text-jinbe-dim">{acc.sector} · {acc.date}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-jinbe-primary" />
            <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Resumo Financeiro da Plataforma</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-jinbe-card border border-jinbe-border">
              <p className="text-xs text-jinbe-dim mb-1">Volume Total (All Time)</p>
              <p className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>€ 187.4M</p>
            </div>
            <div className="p-4 rounded-lg bg-jinbe-card border border-jinbe-border">
              <p className="text-xs text-jinbe-dim mb-1">Receita Total (Spread)</p>
              <p className="text-xl font-bold text-jinbe-success">R$ 12.8M</p>
            </div>
            <div className="p-4 rounded-lg bg-jinbe-card border border-jinbe-border">
              <p className="text-xs text-jinbe-dim mb-1">Total de Operações</p>
              <p className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>18.742</p>
            </div>
            <div className="p-4 rounded-lg bg-jinbe-card border border-jinbe-border">
              <p className="text-xs text-jinbe-dim mb-1">Ticket Médio</p>
              <p className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>€ 10.000</p>
            </div>
            <div className="p-4 rounded-lg bg-jinbe-card border border-jinbe-border">
              <p className="text-xs text-jinbe-dim mb-1">Spread Médio</p>
              <p className="text-xl font-bold text-jinbe-primary">1.72%</p>
            </div>
          </div>
        </div>

        {/* Configuração de Spread por Cliente */}
        <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-jinbe-warning" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Configuração de Spread por Cliente
              </h3>
            </div>
            <span className="text-xs text-jinbe-dim">Spread padrão: 1.72%</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jinbe-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-jinbe-muted">Cliente</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-jinbe-muted">Setor</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-jinbe-muted">Comissionado(s)</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-jinbe-muted">Volume</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-jinbe-muted">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-jinbe-muted">Spread Padrão</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-jinbe-muted">Spread Atual</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-jinbe-muted">Ações</th>
                </tr>
              </thead>
              <tbody>
                {spreadConfig.map((client) => {
                  const status = statusConfig[client.status]
                  const StatusIcon = status.icon
                  const isEditing = editingId === client.id
                  const spreadDiff = client.currentSpread - client.defaultSpread

                  return (
                    <tr key={client.id} className="border-b border-jinbe-border/50 hover:bg-jinbe-primary/5">
                      <td className="py-3 px-4">
                        <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {client.name}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-jinbe-primary/10 text-jinbe-primary">
                          {client.sector}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {client.comissionado ? (
                          <span className="text-sm text-jinbe-muted">{client.comissionado}</span>
                        ) : (
                          <span className="text-xs text-jinbe-dim italic">—</span>
                        )}
                      </td>
                      <td className={`py-3 px-4 text-right text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {client.volume}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-jinbe-muted">
                        {client.defaultSpread.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              step="0.01"
                              min="0"
                              max="10"
                              className={`w-20 px-2 py-1 text-sm text-center rounded border border-jinbe-primary ${
                                isLight ? 'bg-white text-slate-900' : 'bg-jinbe-bg text-white'
                              }`}
                              autoFocus
                            />
                            <span className="text-sm text-jinbe-muted">%</span>
                          </div>
                        ) : (
                          <span className={`text-sm font-semibold ${
                            spreadDiff > 0 ? 'text-jinbe-success' : spreadDiff < 0 ? 'text-jinbe-danger' : isLight ? 'text-slate-900' : 'text-white'
                          }`}>
                            {client.currentSpread.toFixed(2)}%
                            {spreadDiff !== 0 && (
                              <span className="text-xs ml-1">
                                ({spreadDiff > 0 ? '+' : ''}{spreadDiff.toFixed(2)})
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSaveSpread(client.id)}
                              className="p-1.5 rounded-lg bg-jinbe-success/10 text-jinbe-success hover:bg-jinbe-success/20 transition-colors"
                              title="Salvar"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 rounded-lg bg-jinbe-danger/10 text-jinbe-danger hover:bg-jinbe-danger/20 transition-colors"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditSpread(client.id, client.currentSpread)}
                            className="p-1.5 rounded-lg bg-jinbe-primary/10 text-jinbe-primary hover:bg-jinbe-primary/20 transition-colors"
                            title="Editar spread"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-jinbe-border flex items-center justify-between">
            <p className="text-xs text-jinbe-dim">
              Spread customizado sobrepõe o padrão. Valores entre 0% e 10%.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-jinbe-success" />
                Acima do padrão
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-jinbe-danger" />
                Abaixo do padrão
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
