import { useState, useMemo } from 'react'
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
  Filter,
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

type PeriodFilter = '7d' | '30d' | '90d' | '6m' | '12m' | 'all'

interface ClientData {
  id: number
  name: string
  sector: string
  volume: number
  spread: number
  revenue: number
  costs: number
  profit: number
  margin: number
  ops: number
  avgTicket: number
  createdAt: string
}

// Dados mockados - P&L por cliente com datas
const allClientData: ClientData[] = [
  { id: 1, name: 'Importadora Silva & Cia', sector: 'Pescados', volume: 4250000, spread: 1.85, revenue: 78625, costs: 12500, profit: 66125, margin: 84.1, ops: 127, avgTicket: 33465, createdAt: '2024-01-15' },
  { id: 2, name: 'Agro Norte LTDA', sector: 'Agronegócio', volume: 3180000, spread: 1.72, revenue: 54696, costs: 9800, profit: 44896, margin: 82.1, ops: 89, avgTicket: 35730, createdAt: '2024-02-20' },
  { id: 3, name: 'TechBR Solutions', sector: 'Tecnologia', volume: 2890000, spread: 1.65, revenue: 47685, costs: 8200, profit: 39485, margin: 82.8, ops: 156, avgTicket: 18526, createdAt: '2024-03-10' },
  { id: 4, name: 'Metal Export SA', sector: 'Indústria', volume: 2450000, spread: 1.78, revenue: 43610, costs: 7500, profit: 36110, margin: 82.8, ops: 67, avgTicket: 36567, createdAt: '2024-04-05' },
  { id: 5, name: 'Distribuidora Global', sector: 'Comércio', volume: 1980000, spread: 1.55, revenue: 30690, costs: 5800, profit: 24890, margin: 81.1, ops: 112, avgTicket: 17679, createdAt: '2024-05-12' },
  { id: 6, name: 'Pescados do Sul', sector: 'Pescados', volume: 1750000, spread: 1.90, revenue: 33250, costs: 5200, profit: 28050, margin: 84.4, ops: 78, avgTicket: 22436, createdAt: '2024-06-01' },
  { id: 7, name: 'AgroTech Brasil', sector: 'Agronegócio', volume: 1420000, spread: 1.68, revenue: 23856, costs: 4100, profit: 19756, margin: 82.8, ops: 45, avgTicket: 31556, createdAt: '2024-07-08' },
  { id: 8, name: 'Indústria Paulista', sector: 'Indústria', volume: 1180000, spread: 1.75, revenue: 20650, costs: 3500, profit: 17150, margin: 83.1, ops: 34, avgTicket: 34706, createdAt: '2024-07-20' },
]

// Volume acumulado por mês
const volumeAccumulatedData = [
  { month: 'Jan', volume: 4250000, accumulated: 4250000, ops: 127 },
  { month: 'Fev', volume: 3180000, accumulated: 7430000, ops: 89 },
  { month: 'Mar', volume: 2890000, accumulated: 10320000, ops: 156 },
  { month: 'Abr', volume: 2450000, accumulated: 12770000, ops: 67 },
  { month: 'Mai', volume: 1980000, accumulated: 14750000, ops: 112 },
  { month: 'Jun', volume: 1750000, accumulated: 16500000, ops: 78 },
  { month: 'Jul', volume: 2600000, accumulated: 19100000, ops: 79 },
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
  { country: 'Alemanha', flag: '🇩🇪', volume: 5338000, percent: 28 },
  { country: 'França', flag: '🇫🇷', volume: 3432000, percent: 18 },
  { country: 'Holanda', flag: '🇳🇱', volume: 2479000, percent: 13 },
  { country: 'Espanha', flag: '🇪🇸', volume: 2288000, percent: 12 },
  { country: 'Itália', flag: '🇮🇹', volume: 1910000, percent: 10 },
  { country: 'Portugal', flag: '🇵🇹', volume: 1528000, percent: 8 },
  { country: 'Bélgica', flag: '🇧🇪', volume: 1337000, percent: 7 },
  { country: 'Outros', flag: '🌍', volume: 788000, percent: 4 },
]

const periodLabels: Record<PeriodFilter, string> = {
  '7d': 'Últimos 7 dias',
  '30d': 'Últimos 30 dias',
  '90d': 'Últimos 90 dias',
  '6m': 'Últimos 6 meses',
  '12m': 'Últimos 12 meses',
  'all': 'Todo período',
}

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
  const [period, setPeriod] = useState<PeriodFilter>('all')
  const [selectedClient, setSelectedClient] = useState<string>('all')
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Filtrar dados baseado no período e cliente
  const filteredData = useMemo(() => {
    let data = [...allClientData]

    // Filtro por cliente
    if (selectedClient !== 'all') {
      data = data.filter(c => c.id === Number(selectedClient))
    }

    // Filtro por período (simulado - em produção usaria datas reais)
    if (period !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()

      switch (period) {
        case '7d':
          cutoffDate.setDate(now.getDate() - 7)
          // Simula mostrando últimos 2 clientes
          data = data.slice(-2)
          break
        case '30d':
          cutoffDate.setDate(now.getDate() - 30)
          data = data.slice(-4)
          break
        case '90d':
          cutoffDate.setDate(now.getDate() - 90)
          data = data.slice(-6)
          break
        case '6m':
          cutoffDate.setMonth(now.getMonth() - 6)
          data = data.slice(-7)
          break
        case '12m':
          cutoffDate.setMonth(now.getMonth() - 12)
          break
      }
    }

    return data
  }, [period, selectedClient])

  // Calcular KPIs baseados nos dados filtrados
  const kpis = useMemo(() => {
    const totalVolume = filteredData.reduce((sum, c) => sum + c.volume, 0)
    const totalRevenue = filteredData.reduce((sum, c) => sum + c.revenue, 0)
    const totalCosts = filteredData.reduce((sum, c) => sum + c.costs, 0)
    const totalProfit = filteredData.reduce((sum, c) => sum + c.profit, 0)
    const totalOps = filteredData.reduce((sum, c) => sum + c.ops, 0)
    const avgSpread = filteredData.length > 0
      ? filteredData.reduce((sum, c) => sum + c.spread, 0) / filteredData.length
      : 0
    const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    return {
      totalVolume,
      totalRevenue,
      totalCosts,
      totalProfit,
      totalOps,
      avgSpread,
      avgMargin,
    }
  }, [filteredData])

  // Calcular receita por setor dos dados filtrados
  const revenueBySectoData = useMemo(() => {
    const sectorMap: Record<string, number> = {}
    const colors: Record<string, string> = {
      'Pescados': '#0d7ff2',
      'Agronegócio': '#10b981',
      'Tecnologia': '#f59e0b',
      'Indústria': '#f43f5e',
      'Comércio': '#8b5cf6',
    }

    filteredData.forEach(client => {
      sectorMap[client.sector] = (sectorMap[client.sector] || 0) + client.revenue
    })

    return Object.entries(sectorMap).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#64748b',
    }))
  }, [filteredData])

  // Volume acumulado filtrado por período
  const filteredVolumeData = useMemo(() => {
    if (period === 'all' || period === '12m') return volumeAccumulatedData
    if (period === '6m') return volumeAccumulatedData.slice(-6)
    if (period === '90d') return volumeAccumulatedData.slice(-3)
    if (period === '30d') return volumeAccumulatedData.slice(-1)
    return volumeAccumulatedData.slice(-1)
  }, [period])

  // Volume por país filtrado
  const filteredCountryData = useMemo(() => {
    // Se tem cliente selecionado, ajusta proporcionalmente
    if (selectedClient !== 'all') {
      const clientData = allClientData.find(c => c.id === Number(selectedClient))
      if (clientData) {
        const ratio = clientData.volume / allClientData.reduce((sum, c) => sum + c.volume, 0)
        return volumeByCountryData.map(c => ({
          ...c,
          volume: Math.round(c.volume * ratio * 5), // Ajuste proporcional
        }))
      }
    }
    return volumeByCountryData
  }, [selectedClient])

  const handleExport = (format: ExportFormat) => {
    // Nome do arquivo inclui filtros aplicados
    const clientName = selectedClient !== 'all'
      ? allClientData.find(c => c.id === Number(selectedClient))?.name.replace(/\s+/g, '_') || 'cliente'
      : 'todos_clientes'
    const periodName = periodLabels[period].replace(/\s+/g, '_').toLowerCase()
    const fileName = `relatorio_${clientName}_${periodName}`
    const title = `Relatório P&L - ${selectedClient !== 'all' ? allClientData.find(c => c.id === Number(selectedClient))?.name : 'Todos os Clientes'} - ${periodLabels[period]}`

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

    // Resumo de KPIs para o PDF
    const summary = [
      { label: 'Volume Total', value: formatCurrency(kpis.totalVolume) },
      { label: 'Receita', value: formatCurrency(kpis.totalRevenue, 'BRL') },
      { label: 'Lucro', value: formatCurrency(kpis.totalProfit, 'BRL') },
      { label: 'Spread Médio', value: `${kpis.avgSpread.toFixed(2)}%` },
      { label: 'Margem', value: `${kpis.avgMargin.toFixed(1)}%` },
      { label: 'Operações', value: String(kpis.totalOps) },
    ]

    // Exporta apenas os dados filtrados
    exportData(format, filteredData, columns, fileName, title, summary)
    setShowExportMenu(false)
  }

  // KPIs de resumo dinâmicos
  const summaryKpis = [
    {
      label: 'Receita Total (Spread)',
      value: formatCurrency(kpis.totalRevenue, 'BRL'),
      change: '+18.5%',
      trend: 'up' as const,
      icon: DollarSign,
      iconBg: 'bg-jinbe-success/10 text-jinbe-success'
    },
    {
      label: 'Volume Total',
      value: `€ ${(kpis.totalVolume / 1000000).toFixed(1)}M`,
      change: '+23.2%',
      trend: 'up' as const,
      icon: TrendingUp,
      iconBg: 'bg-jinbe-primary/10 text-jinbe-primary'
    },
    {
      label: 'Spread Médio',
      value: `${kpis.avgSpread.toFixed(2)}%`,
      change: '+0.02%',
      trend: 'up' as const,
      icon: BarChart3,
      iconBg: 'bg-jinbe-warning/10 text-jinbe-warning'
    },
    {
      label: 'Margem Líquida',
      value: `${kpis.avgMargin.toFixed(1)}%`,
      change: '-0.3%',
      trend: 'down' as const,
      icon: PieChart,
      iconBg: 'bg-jinbe-info/10 text-jinbe-info'
    },
  ]

  return (
    <>
      <Header title="Relatórios" subtitle="Análise de P&L, Volume e Taxas" />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Filtros e Exportação */}
        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-jinbe-primary" />
            <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Filtros do Relatório</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Filtro de Período */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-jinbe-muted">Período</label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-jinbe-muted" />
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900'
                        : 'bg-jinbe-bg border-jinbe-border text-white'
                    }`}
                  >
                    <option value="7d">Últimos 7 dias</option>
                    <option value="30d">Últimos 30 dias</option>
                    <option value="90d">Últimos 90 dias</option>
                    <option value="6m">Últimos 6 meses</option>
                    <option value="12m">Últimos 12 meses</option>
                    <option value="all">Todo período</option>
                  </select>
                </div>
              </div>

              {/* Filtro de Cliente */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-jinbe-muted">Cliente</label>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-jinbe-muted" />
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium min-w-[200px] ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-900'
                        : 'bg-jinbe-bg border-jinbe-border text-white'
                    }`}
                  >
                    <option value="all">Todos os clientes</option>
                    {allClientData.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Botão de Exportação */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-jinbe-primary text-white rounded-lg text-sm font-medium hover:bg-jinbe-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar Relatório
                <ChevronDown className="w-4 h-4" />
              </button>

              {showExportMenu && (
                <div className={`absolute right-0 mt-2 w-52 rounded-lg border shadow-lg z-50 ${
                  isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
                }`}>
                  <div className="px-3 py-2 border-b border-jinbe-border">
                    <p className="text-xs text-jinbe-muted">Exportar com filtros aplicados:</p>
                    <p className={`text-xs font-medium mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {periodLabels[period]} • {selectedClient === 'all' ? 'Todos' : allClientData.find(c => c.id === Number(selectedClient))?.name}
                    </p>
                  </div>
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
                    className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-jinbe-primary/10 border-t border-jinbe-border ${
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

          {/* Indicador de filtros ativos */}
          {(period !== 'all' || selectedClient !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-jinbe-border">
              <span className="text-xs text-jinbe-muted">Filtros ativos:</span>
              {period !== 'all' && (
                <span className="px-2 py-1 bg-jinbe-primary/10 text-jinbe-primary text-xs rounded-full font-medium">
                  {periodLabels[period]}
                </span>
              )}
              {selectedClient !== 'all' && (
                <span className="px-2 py-1 bg-jinbe-success/10 text-jinbe-success text-xs rounded-full font-medium">
                  {allClientData.find(c => c.id === Number(selectedClient))?.name}
                </span>
              )}
              <button
                onClick={() => { setPeriod('all'); setSelectedClient('all') }}
                className="text-xs text-jinbe-muted hover:text-jinbe-primary ml-2"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        {/* KPIs de Resumo - Agora dinâmicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryKpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div
                key={kpi.label}
                className={`p-4 sm:p-5 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
                }`}
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
          <div className={`p-5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-jinbe-primary" />
                <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Volume Acumulado
                </h3>
              </div>
              <span className="text-xs text-jinbe-dim">{periodLabels[period]}</span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredVolumeData}>
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
                    formatter={(value, name) => [
                      `€ ${(Number(value) / 1000000).toFixed(2)}M`,
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
          <div className={`p-5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'}`}>
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
                    formatter={(value, name) => [
                      `R$ ${Number(value).toFixed(3)}`,
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

        {/* P&L por Cliente - Tabela Filtrada */}
        <div className={`p-5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                P&L por Cliente
              </h3>
              <span className="px-2 py-0.5 bg-jinbe-primary/10 text-jinbe-primary text-xs rounded-full font-medium">
                {filteredData.length} {filteredData.length === 1 ? 'cliente' : 'clientes'}
              </span>
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
                {filteredData.map((client) => (
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
                    {formatCurrency(kpis.totalVolume)}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-warning">
                    {kpis.avgSpread.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-success">
                    {formatCurrency(kpis.totalRevenue, 'BRL')}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-danger">
                    {formatCurrency(kpis.totalCosts, 'BRL')}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-success">
                    {formatCurrency(kpis.totalProfit, 'BRL')}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-jinbe-success">
                    {kpis.avgMargin.toFixed(1)}%
                  </td>
                  <td className={`py-3 px-4 text-right text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {kpis.totalOps}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Volume por País e Receita por Setor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Volume por País */}
          <div className={`p-5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Volume por País de Destino
              </h3>
            </div>
            <div className="space-y-3">
              {filteredCountryData.map((c) => (
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

          {/* Receita por Setor - Agora dinâmico */}
          <div className={`p-5 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'}`}>
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
                    {revenueBySectoData.length > 0
                      ? ((s.value / revenueBySectoData.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(0)
                      : 0}%
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
