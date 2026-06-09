import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Calendar,
  Building2,
  Globe,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Legend,
  Line,
} from 'recharts'
import { exportData, type ExportFormat } from '@/utils/export'

// Dados mockados - P&L por cliente
const clientPnLData = [
  { id: 1, name: 'Importadora Silva & Cia', sector: 'Pescados', volume: 4250000, spread: 1.85, revenue: 78625, costs: 12500, profit: 66125, margin: 84.1, ops: 127, avgTicket: 33465 },
  { id: 2, name: 'Agro Norte LTDA', sector: 'Agronegócio', volume: 3180000, spread: 1.72, revenue: 54696, costs: 9800, profit: 44896, margin: 82.1, ops: 89, avgTicket: 35730 },
  { id: 3, name: 'TechBR Solutions', sector: 'Tecnologia', volume: 2890000, spread: 1.65, revenue: 47685, costs: 8200, profit: 39485, margin: 82.8, ops: 156, avgTicket: 18526 },
  { id: 4, name: 'Metal Export SA', sector: 'Indústria', volume: 2450000, spread: 1.78, revenue: 43610, costs: 7500, profit: 36110, margin: 82.8, ops: 67, avgTicket: 36567 },
  { id: 5, name: 'Distribuidora Global', sector: 'Comércio', volume: 1980000, spread: 1.55, revenue: 30690, costs: 5800, profit: 24890, margin: 81.1, ops: 112, avgTicket: 17679 },
  { id: 6, name: 'Pescados do Sul', sector: 'Pescados', volume: 1750000, spread: 1.90, revenue: 33250, costs: 5200, profit: 28050, margin: 84.4, ops: 78, avgTicket: 22436 },
  { id: 7, name: 'AgroTech Brasil', sector: 'Agronegócio', volume: 1420000, spread: 1.68, revenue: 23856, costs: 4100, profit: 19756, margin: 82.8, ops: 45, avgTicket: 31556 },
  { id: 8, name: 'Indústria Paulista', sector: 'Indústria', volume: 1180000, spread: 1.75, revenue: 20650, costs: 3500, profit: 17150, margin: 83.1, ops: 34, avgTicket: 34706 },
]

// Volume acumulado por mês
const volumeAccumulatedData = [
  { month: 'Jan', volume: 12400000, accumulated: 12400000, ops: 245 },
  { month: 'Fev', volume: 15800000, accumulated: 28200000, ops: 312 },
  { month: 'Mar', volume: 21300000, accumulated: 49500000, ops: 398 },
  { month: 'Abr', volume: 28700000, accumulated: 78200000, ops: 487 },
  { month: 'Mai', volume: 36200000, accumulated: 114400000, ops: 612 },
  { month: 'Jun', volume: 43100000, accumulated: 157500000, ops: 756 },
  { month: 'Jul', volume: 47800000, accumulated: 205300000, ops: 847 },
]

// Histórico de taxas EUR/BRL
const rateHistoryData = [
  { date: '01/07', rate: 6.12, spread: 1.72, applied: 6.225 },
  { date: '02/07', rate: 6.08, spread: 1.72, applied: 6.185 },
  { date: '03/07', rate: 6.15, spread: 1.72, applied: 6.256 },
  { date: '04/07', rate: 6.22, spread: 1.72, applied: 6.327 },
  { date: '05/07', rate: 6.18, spread: 1.72, applied: 6.286 },
  { date: '06/07', rate: 6.25, spread: 1.72, applied: 6.357 },
  { date: '07/07', rate: 6.20, spread: 1.72, applied: 6.307 },
  { date: '08/07', rate: 6.28, spread: 1.72, applied: 6.388 },
  { date: '09/07', rate: 6.32, spread: 1.72, applied: 6.429 },
  { date: '10/07', rate: 6.29, spread: 1.72, applied: 6.398 },
  { date: '11/07', rate: 6.35, spread: 1.72, applied: 6.459 },
  { date: '12/07', rate: 6.38, spread: 1.72, applied: 6.490 },
  { date: '13/07', rate: 6.42, spread: 1.72, applied: 6.531 },
  { date: '14/07', rate: 6.40, spread: 1.72, applied: 6.510 },
]

// Volume por país destino
const volumeByCountryData = [
  { country: 'Alemanha', flag: '🇩🇪', volume: 53380000, percent: 26 },
  { country: 'França', flag: '🇫🇷', volume: 36954000, percent: 18 },
  { country: 'Holanda', flag: '🇳🇱', volume: 26689000, percent: 13 },
  { country: 'Espanha', flag: '🇪🇸', volume: 24636000, percent: 12 },
  { country: 'Itália', flag: '🇮🇹', volume: 20530000, percent: 10 },
  { country: 'Portugal', flag: '🇵🇹', volume: 16424000, percent: 8 },
  { country: 'Bélgica', flag: '🇧🇪', volume: 14371000, percent: 7 },
  { country: 'Outros', flag: '🌍', volume: 12316000, percent: 6 },
]

// Receita por setor
const revenueBySectoData = [
  { name: 'Pescados', value: 111875, color: '#0d7ff2' },
  { name: 'Agronegócio', value: 78552, color: '#10b981' },
  { name: 'Tecnologia', value: 47685, color: '#f59e0b' },
  { name: 'Indústria', value: 64260, color: '#f43f5e' },
  { name: 'Comércio', value: 30690, color: '#8b5cf6' },
]

const formatCurrency = (value: number, currency = 'EUR') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPercent = (value: number) => `${value.toFixed(1)}%`

export default function Reports() {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [period, setPeriod] = useState('7d')
  const [selectedClient, setSelectedClient] = useState('all')
  const [showExportMenu, setShowExportMenu] = useState(false)

  // KPIs de resumo
  const summaryKpis = [
    {
      label: 'Receita Total (Spread)',
      value: 'R$ 333.062',
      change: '+18.5%',
      trend: 'up' as const,
      icon: DollarSign,
      iconBg: 'bg-jinbe-success/10 text-jinbe-success'
    },
    {
      label: 'Volume Total',
      value: '€ 19.1M',
      change: '+23.2%',
      trend: 'up' as const,
      icon: TrendingUp,
      iconBg: 'bg-jinbe-primary/10 text-jinbe-primary'
    },
    {
      label: 'Spread Médio',
      value: '1.74%',
      change: '+0.02%',
      trend: 'up' as const,
      icon: BarChart3,
      iconBg: 'bg-jinbe-warning/10 text-jinbe-warning'
    },
    {
      label: 'Margem Líquida',
      value: '82.8%',
      change: '-0.3%',
      trend: 'down' as const,
      icon: PieChart,
      iconBg: 'bg-jinbe-info/10 text-jinbe-info'
    },
  ]

  const handleExport = (format: ExportFormat) => {
    const columns = [
      { key: 'name', header: 'Cliente' },
      { key: 'sector', header: 'Setor' },
      { key: 'volume', header: 'Volume (EUR)', formatter: (v: unknown) => formatCurrency(v as number) },
      { key: 'spread', header: 'Spread (%)', formatter: (v: unknown) => `${v}%` },
      { key: 'revenue', header: 'Receita (BRL)', formatter: (v: unknown) => formatCurrency(v as number, 'BRL') },
      { key: 'costs', header: 'Custos (BRL)', formatter: (v: unknown) => formatCurrency(v as number, 'BRL') },
      { key: 'profit', header: 'Lucro (BRL)', formatter: (v: unknown) => formatCurrency(v as number, 'BRL') },
      { key: 'margin', header: 'Margem (%)', formatter: (v: unknown) => formatPercent(v as number) },
      { key: 'ops', header: 'Operações' },
    ]
    exportData(format, clientPnLData, columns, 'relatorio-pnl', 'Relatório P&L por Cliente - Jinbe')
    setShowExportMenu(false)
  }

  return (
    <>
      <Header title="Relatórios Avançados" subtitle="P&L, Volume e Análise de Taxas" />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Filtros e Exportação */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro de Período */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-jinbe-muted" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className={`px-3 py-2 rounded-lg border border-jinbe-border text-sm ${
                  isLight ? 'bg-white text-slate-900' : 'bg-jinbe-card text-white'
                }`}
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="ytd">Ano até agora</option>
                <option value="all">Todo período</option>
              </select>
            </div>

            {/* Filtro de Cliente */}
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-jinbe-muted" />
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className={`px-3 py-2 rounded-lg border border-jinbe-border text-sm ${
                  isLight ? 'bg-white text-slate-900' : 'bg-jinbe-card text-white'
                }`}
              >
                <option value="all">Todos os clientes</option>
                {clientPnLData.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botão de Exportação */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-jinbe-primary text-white rounded-lg text-sm font-medium hover:bg-jinbe-primary/90 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg border border-jinbe-border shadow-lg z-50 ${
                isLight ? 'bg-white' : 'bg-jinbe-card'
              }`}>
                <button
                  onClick={() => handleExport('csv')}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-jinbe-primary/10 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-jinbe-muted" />
                  Exportar CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-jinbe-primary/10 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-jinbe-success" />
                  Exportar Excel
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-jinbe-primary/10 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-jinbe-danger" />
                  Exportar PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* KPIs de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryKpis.map((kpi) => {
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
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    kpi.trend === 'up' ? 'text-jinbe-success' : 'text-jinbe-danger'
                  }`}>
                    {kpi.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className={`text-2xl font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{kpi.value}</p>
                <p className="text-sm text-jinbe-muted">{kpi.label}</p>
              </div>
            )
          })}
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Volume Acumulado */}
          <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-jinbe-primary" />
                <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Volume Acumulado
                </h3>
              </div>
              <span className="text-xs text-jinbe-dim">2024</span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={volumeAccumulatedData}>
                  <defs>
                    <linearGradient id="colorAccumulated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d7ff2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d7ff2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis
                    yAxisId="left"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(v) => `€${(v / 1000000).toFixed(0)}M`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#64748b"
                    fontSize={12}
                    tickFormatter={(v) => `€${(v / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#1a202c',
                      border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
                      borderRadius: '8px',
                      color: isLight ? '#1e293b' : '#fff'
                    }}
                    formatter={(value: number, name: string) => [
                      `€ ${(value / 1000000).toFixed(2)}M`,
                      name === 'accumulated' ? 'Acumulado' : 'Volume Mensal'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="volume" fill="#10b981" name="Volume Mensal" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="accumulated" stroke="#0d7ff2" strokeWidth={2} name="Acumulado" dot={{ fill: '#0d7ff2' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Histórico de Taxas */}
          <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LineChart className="w-5 h-5 text-jinbe-primary" />
                <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Histórico de Taxas EUR/BRL
                </h3>
              </div>
              <span className="text-xs text-jinbe-dim">Últimos 14 dias</span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={rateHistoryData}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d7ff2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d7ff2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#1a202c',
                      border: `1px solid ${isLight ? '#e2e8f0' : '#1e293b'}`,
                      borderRadius: '8px',
                      color: isLight ? '#1e293b' : '#fff'
                    }}
                    formatter={(value: number, name: string) => [
                      `R$ ${value.toFixed(3)}`,
                      name === 'rate' ? 'Taxa Mercado' : 'Taxa Aplicada'
                    ]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="rate" stroke="#10b981" fill="url(#colorRate)" name="Taxa Mercado" />
                  <Area type="monotone" dataKey="applied" stroke="#0d7ff2" fill="url(#colorApplied)" name="Taxa Aplicada" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-jinbe-border">
              <div className="text-center">
                <p className="text-xs text-jinbe-dim">Spread Médio</p>
                <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>1.72%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-jinbe-dim">Variação</p>
                <p className="text-sm font-semibold text-jinbe-success">+4.9%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-jinbe-dim">Taxa Atual</p>
                <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>R$ 6.40</p>
              </div>
            </div>
          </div>
        </div>

        {/* P&L por Cliente - Tabela */}
        <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                P&L por Cliente
              </h3>
            </div>
            <span className="text-xs text-jinbe-dim">Ordenado por volume</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-jinbe-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-jinbe-muted">Cliente</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-jinbe-muted">Setor</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-jinbe-muted">Volume</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-jinbe-muted">Spread</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-jinbe-muted">Receita</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-jinbe-muted">Custos</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-jinbe-muted">Lucro</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-jinbe-muted">Margem</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-jinbe-muted">Ops</th>
                </tr>
              </thead>
              <tbody>
                {clientPnLData.map((client) => (
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
                    <td className={`py-3 px-4 text-right text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {formatCurrency(client.volume)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-jinbe-warning font-medium">
                      {client.spread}%
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-jinbe-success font-medium">
                      {formatCurrency(client.revenue, 'BRL')}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-jinbe-danger">
                      {formatCurrency(client.costs, 'BRL')}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-jinbe-success font-semibold">
                      {formatCurrency(client.profit, 'BRL')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-sm font-medium ${
                        client.margin >= 83 ? 'text-jinbe-success' : 'text-jinbe-warning'
                      }`}>
                        {formatPercent(client.margin)}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right text-sm ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                      {client.ops}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-jinbe-primary/5">
                  <td className="py-3 px-4">
                    <p className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      TOTAL
                    </p>
                  </td>
                  <td className="py-3 px-4"></td>
                  <td className={`py-3 px-4 text-right text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {formatCurrency(clientPnLData.reduce((sum, c) => sum + c.volume, 0))}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-warning">
                    1.74%
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-success">
                    {formatCurrency(clientPnLData.reduce((sum, c) => sum + c.revenue, 0), 'BRL')}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-danger">
                    {formatCurrency(clientPnLData.reduce((sum, c) => sum + c.costs, 0), 'BRL')}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-success">
                    {formatCurrency(clientPnLData.reduce((sum, c) => sum + c.profit, 0), 'BRL')}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-success">
                    82.8%
                  </td>
                  <td className={`py-3 px-4 text-right text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {clientPnLData.reduce((sum, c) => sum + c.ops, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Volume por País e Receita por Setor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Volume por País */}
          <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Volume por País de Destino
              </h3>
            </div>
            <div className="space-y-3">
              {volumeByCountryData.map((c) => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-xl">{c.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {c.country}
                      </span>
                      <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatCurrency(c.volume)}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-jinbe-border overflow-hidden">
                      <div
                        className="h-full bg-jinbe-primary rounded-full transition-all"
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-jinbe-muted w-10 text-right">{c.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Receita por Setor */}
          <div className="p-5 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Receita por Setor
              </h3>
            </div>
            <div className="space-y-3">
              {revenueBySectoData.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {s.name}
                      </span>
                      <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatCurrency(s.value, 'BRL')}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-jinbe-muted w-10 text-right">
                    {((s.value / revenueBySectoData.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-jinbe-border">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Total
                </span>
                <span className="text-lg font-bold text-jinbe-success">
                  {formatCurrency(revenueBySectoData.reduce((sum, i) => sum + i.value, 0), 'BRL')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
