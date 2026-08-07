import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
  Search,
  Filter,
  Plus,
  ChevronDown,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Receipt,
} from 'lucide-react'
import { OperationDetailsModal } from '@/components/operations/OperationDetailsModal'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { exportData, type ExportFormat } from '@/utils/export'

type OperationStatus = 'completed' | 'processing' | 'pending' | 'failed' | 'cancelled'
type ReceivableStatus = 'awaiting' | 'received' | 'overdue' | 'cancelled'
type TabType = 'envios' | 'recebimentos'

interface Operation {
  [key: string]: string | OperationStatus
  id: string
  client: string
  beneficiary: string
  amountBRL: string
  amountEUR: string
  rate: string
  status: OperationStatus
  date: string
  type: string
}

interface Receivable {
  id: string
  invoiceNumber: string
  payer: string
  payerCountry: string
  amount: string
  currency: string
  dueDate: string
  status: ReceivableStatus
  createdAt: string
  description: string
}

const statusConfig: Record<OperationStatus, { label: string; className: string }> = {
  completed: { label: 'Concluída', className: 'bg-jinbe-success/10 text-jinbe-success' },
  processing: { label: 'Processando', className: 'bg-jinbe-primary/10 text-jinbe-primary' },
  pending: { label: 'Pendente', className: 'bg-jinbe-warning/10 text-jinbe-warning' },
  failed: { label: 'Falhou', className: 'bg-jinbe-danger/10 text-jinbe-danger' },
  cancelled: { label: 'Cancelada', className: 'bg-jinbe-dim/10 text-jinbe-dim' },
}

const receivableStatusConfig: Record<ReceivableStatus, { label: string; className: string; icon: typeof Clock }> = {
  awaiting: { label: 'Aguardando', className: 'bg-jinbe-warning/10 text-jinbe-warning', icon: Clock },
  received: { label: 'Recebido', className: 'bg-jinbe-success/10 text-jinbe-success', icon: CheckCircle2 },
  overdue: { label: 'Vencido', className: 'bg-jinbe-danger/10 text-jinbe-danger', icon: AlertCircle },
  cancelled: { label: 'Cancelado', className: 'bg-jinbe-dim/10 text-jinbe-dim', icon: AlertCircle },
}

const mockOperations: Operation[] = [
  { id: 'OP-2024-001', client: 'TechCorp Brasil', beneficiary: 'Schmidt GmbH', amountBRL: 'R$ 52.400,00', amountEUR: '€ 9.650,00', rate: '5.4300', status: 'completed', date: '2024-03-28 14:32', type: 'PIX → Conta' },
  { id: 'OP-2024-002', client: 'Exporta Sul LTDA', beneficiary: 'Apex Trading LLC', amountBRL: 'R$ 128.750,00', amountEUR: '$ 25.420,00', rate: '5.0650', status: 'processing', date: '2024-03-28 13:15', type: 'PIX → SWIFT' },
  { id: 'OP-2024-003', client: 'Agro Norte SA', beneficiary: 'Van der Berg BV', amountBRL: 'R$ 87.200,00', amountEUR: '€ 16.050,00', rate: '5.4330', status: 'completed', date: '2024-03-28 11:45', type: 'PIX → Conta' },
  { id: 'OP-2024-004', client: 'Digital Pay ME', beneficiary: 'Crown Logistics UK', amountBRL: 'R$ 34.100,00', amountEUR: '£ 5.280,00', rate: '6.4583', status: 'pending', date: '2024-03-28 10:20', type: 'PIX → SWIFT' },
  { id: 'OP-2024-005', client: 'Comex Partners', beneficiary: 'García Hermanos SL', amountBRL: 'R$ 215.000,00', amountEUR: '€ 39.560,00', rate: '5.4350', status: 'failed', date: '2024-03-27 16:48', type: 'PIX → Conta' },
  { id: 'OP-2024-006', client: 'Banco Flex', beneficiary: 'Global Tech Inc', amountBRL: 'R$ 67.800,00', amountEUR: '$ 13.390,00', rate: '5.0635', status: 'completed', date: '2024-03-27 15:30', type: 'PIX → SWIFT' },
]

const mockReceivables: Receivable[] = [
  { id: 'RCV-2024-001', invoiceNumber: 'INV-2024-0892', payer: 'European Fish Import GmbH', payerCountry: 'Alemanha', amount: '€ 45.000,00', currency: 'EUR', dueDate: '2024-04-15', status: 'awaiting', createdAt: '2024-03-20', description: 'Exportação de pescados - Lote #4521' },
  { id: 'RCV-2024-002', invoiceNumber: 'INV-2024-0893', payer: 'Atlantic Seafood Ltd', payerCountry: 'Reino Unido', amount: '£ 28.500,00', currency: 'GBP', dueDate: '2024-04-10', status: 'awaiting', createdAt: '2024-03-18', description: 'Camarões congelados - Container #78' },
  { id: 'RCV-2024-003', invoiceNumber: 'INV-2024-0875', payer: 'Nordic Trading AS', payerCountry: 'Noruega', amount: '€ 62.300,00', currency: 'EUR', dueDate: '2024-03-25', status: 'received', createdAt: '2024-03-01', description: 'Tilápia fresca - Embarque março' },
  { id: 'RCV-2024-004', invoiceNumber: 'INV-2024-0850', payer: 'US Gourmet Foods Inc', payerCountry: 'EUA', amount: '$ 38.750,00', currency: 'USD', dueDate: '2024-03-20', status: 'overdue', createdAt: '2024-02-20', description: 'Produtos agrícolas premium' },
  { id: 'RCV-2024-005', invoiceNumber: 'INV-2024-0901', payer: 'Mediterranean Fresh SL', payerCountry: 'Espanha', amount: '€ 19.800,00', currency: 'EUR', dueDate: '2024-04-20', status: 'awaiting', createdAt: '2024-03-25', description: 'Frutas tropicais - Lote semanal' },
]

const filterStatuses: OperationStatus[] = ['completed', 'processing', 'pending', 'failed', 'cancelled']

export default function Operations() {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [activeTab, setActiveTab] = useState<TabType>('envios')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OperationStatus | 'all'>('all')
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false)

  const handleExport = (format: ExportFormat) => {
    const columns = [
      { key: 'id', header: 'ID Operação' },
      { key: 'client', header: 'Cliente' },
      { key: 'beneficiary', header: 'Beneficiário' },
      { key: 'amountBRL', header: 'Valor (BRL)' },
      { key: 'amountEUR', header: 'Valor Destino' },
      { key: 'rate', header: 'Câmbio' },
      { key: 'status', header: 'Status', formatter: (v: unknown) => statusConfig[v as OperationStatus]?.label || String(v) },
      { key: 'date', header: 'Data' },
      { key: 'type', header: 'Tipo' },
    ]
    exportData(format, filtered, columns, 'operacoes', 'Operações Jinbe')
    setShowExportMenu(false)
  }

  const filtered = mockOperations.filter((op) => {
    const matchesSearch = search === '' ||
      op.id.toLowerCase().includes(search.toLowerCase()) ||
      op.client.toLowerCase().includes(search.toLowerCase()) ||
      op.beneficiary.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredReceivables = mockReceivables.filter((r) => {
    return search === '' ||
      r.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.payer.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <>
      <Header title="Operações" subtitle="Gerencie envios e recebimentos internacionais" />

      <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
        {/* Tabs */}
        <div className={`flex items-center gap-1 p-1 rounded-xl w-fit ${isLight ? 'bg-slate-100' : 'bg-jinbe-card border border-jinbe-border'}`}>
          <button
            onClick={() => setActiveTab('envios')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'envios'
                ? 'bg-jinbe-primary text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-jinbe-muted hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Envios
          </button>
          <button
            onClick={() => setActiveTab('recebimentos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'recebimentos'
                ? 'bg-jinbe-success text-white shadow-sm'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-jinbe-muted hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Recebimentos
            {mockReceivables.filter(r => r.status === 'awaiting').length > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === 'recebimentos' ? 'bg-white/20' : 'bg-jinbe-warning text-white'
              }`}>
                {mockReceivables.filter(r => r.status === 'awaiting').length}
              </span>
            )}
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jinbe-dim" />
              <input
                type="text"
                placeholder={activeTab === 'envios' ? 'Buscar operações...' : 'Buscar invoices...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full sm:w-[240px] lg:w-[280px] pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-jinbe-primary ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                    : 'bg-jinbe-card border-jinbe-border text-white placeholder:text-jinbe-dim'
                }`}
              />
            </div>
            {activeTab === 'envios' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  showFilters || statusFilter !== 'all'
                    ? 'border-jinbe-primary text-jinbe-primary bg-jinbe-primary/5'
                    : isLight
                      ? 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                      : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="sm:inline">Filtros</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'envios' && (
              <>
                {/* Export Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
                      isLight
                        ? 'border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                        : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Exportar</span>
                  </button>

                  {showExportMenu && (
                    <div className={`absolute right-0 mt-2 w-44 rounded-lg border shadow-lg z-50 ${
                      isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
                    }`}>
                      <button
                        onClick={() => handleExport('csv')}
                        className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-jinbe-primary/10 ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-jinbe-muted" />
                        CSV
                      </button>
                      <button
                        onClick={() => handleExport('excel')}
                        className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-jinbe-primary/10 ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        <FileSpreadsheet className="w-4 h-4 text-jinbe-success" />
                        Excel
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to="/operations/new"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Novo Envio</span>
                  <span className="sm:hidden">Novo</span>
                </Link>
              </>
            )}

            {activeTab === 'recebimentos' && (
              <button
                onClick={() => setShowNewInvoiceModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-jinbe-success hover:bg-jinbe-success/90 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Receipt className="w-4 h-4" />
                <span className="hidden sm:inline">Nova Invoice</span>
                <span className="sm:hidden">Nova</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter chips - only for Envios */}
        {activeTab === 'envios' && showFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-jinbe-dim font-medium uppercase tracking-wider">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-jinbe-primary text-white' : 'bg-jinbe-card border border-jinbe-border text-jinbe-muted hover:text-white'
              }`}
            >
              Todos
            </button>
            {filterStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s ? statusConfig[s].className + ' ring-1 ring-current' : 'bg-jinbe-card border border-jinbe-border text-jinbe-muted hover:text-white'
                }`}
              >
                {statusConfig[s].label}
              </button>
            ))}
          </div>
        )}

        {/* ENVIOS TAB CONTENT */}
        {activeTab === 'envios' && (
          <>
            {/* Mobile Cards */}
            <div className="flex flex-col gap-3 lg:hidden">
              {filtered.map((op) => (
                <div
                  key={op.id}
                  onClick={() => setSelectedOp(op)}
                  className={`p-4 rounded-xl border cursor-pointer active:opacity-80 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-mono font-semibold text-jinbe-primary">{op.id}</p>
                      <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>{op.date}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[op.status].className}`}>
                      {statusConfig[op.status].label}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <p className={`text-sm ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>{op.client}</p>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>→ {op.beneficiary}</p>
                  </div>
                  <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-jinbe-border'}`}>
                    <div>
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Valor</p>
                      <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>{op.amountEUR}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Câmbio</p>
                      <p className={`text-sm font-mono ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>{op.rate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className={`hidden lg:block rounded-xl border overflow-hidden ${
              isLight ? 'border-slate-200' : 'border-jinbe-border'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isLight ? 'bg-slate-50 border-b border-slate-200' : 'bg-jinbe-sidebar border-b border-jinbe-border'}>
                      {['ID Operação', 'Cliente', 'Beneficiário', 'Valor (BRL)', 'Valor Destino', 'Câmbio', 'Status', 'Data', ''].map((col) => (
                        <th key={col} className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${
                          isLight ? 'text-slate-500' : 'text-jinbe-dim'
                        }`}>
                          {col && (
                            <span className="flex items-center gap-1.5 cursor-pointer hover:text-jinbe-muted">
                              {col}
                              <ArrowUpDown className="w-3 h-3" />
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((op, i) => (
                      <tr
                        key={op.id}
                        className={`border-b transition-colors cursor-pointer ${
                          isLight
                            ? `${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} border-slate-100 hover:bg-slate-50`
                            : `${i % 2 === 0 ? 'bg-jinbe-bg' : 'bg-jinbe-card/30'} border-jinbe-border hover:bg-jinbe-hover/30`
                        }`}
                        onClick={() => setSelectedOp(op)}
                      >
                        <td className="px-5 py-4 text-sm font-mono font-semibold text-jinbe-primary whitespace-nowrap">{op.id}</td>
                        <td className={`px-5 py-4 text-sm whitespace-nowrap ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>{op.client}</td>
                        <td className={`px-5 py-4 text-sm whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>{op.beneficiary}</td>
                        <td className={`px-5 py-4 text-sm font-medium whitespace-nowrap ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>{op.amountBRL}</td>
                        <td className={`px-5 py-4 text-sm font-medium whitespace-nowrap ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>{op.amountEUR}</td>
                        <td className={`px-5 py-4 text-sm font-mono whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>{op.rate}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[op.status].className}`}>
                            {statusConfig[op.status].label}
                          </span>
                        </td>
                        <td className={`px-5 py-4 text-sm whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>{op.date}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedOp(op) }}
                              className={`p-1.5 rounded-md transition-colors ${
                                isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className={`p-1.5 rounded-md transition-colors ${
                              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                            }`}>
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className={`text-xs sm:text-sm order-2 sm:order-1 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
                Exibindo <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>{filtered.length}</span> de <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>{mockOperations.length}</span> operações
              </p>
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button className={`p-2 rounded-lg transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                }`}>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-medium transition-colors ${
                      page === 1 ? 'bg-jinbe-primary text-white' : isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className={`p-2 rounded-lg transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* RECEBIMENTOS TAB CONTENT */}
        {activeTab === 'recebimentos' && (
          <>
            {/* Stats summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Aguardando', value: mockReceivables.filter(r => r.status === 'awaiting').length, amount: '€ 93.300', color: 'text-jinbe-warning', bg: 'bg-jinbe-warning/10' },
                { label: 'Recebidos (mês)', value: mockReceivables.filter(r => r.status === 'received').length, amount: '€ 62.300', color: 'text-jinbe-success', bg: 'bg-jinbe-success/10' },
                { label: 'Vencidos', value: mockReceivables.filter(r => r.status === 'overdue').length, amount: '$ 38.750', color: 'text-jinbe-danger', bg: 'bg-jinbe-danger/10' },
                { label: 'Total Pendente', value: mockReceivables.filter(r => r.status !== 'received' && r.status !== 'cancelled').length, amount: '€ 132.050', color: 'text-jinbe-primary', bg: 'bg-jinbe-primary/10' },
              ].map((stat) => (
                <div key={stat.label} className={`p-4 rounded-xl border ${
                  isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>{stat.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${stat.bg} ${stat.color}`}>
                      {stat.value}
                    </span>
                  </div>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.amount}</p>
                </div>
              ))}
            </div>

            {/* Receivables list */}
            <div className="flex flex-col gap-3">
              {filteredReceivables.map((receivable) => {
                const StatusIcon = receivableStatusConfig[receivable.status].icon
                return (
                  <div
                    key={receivable.id}
                    className={`p-5 rounded-xl border transition-colors ${
                      isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-jinbe-card border-jinbe-border hover:border-jinbe-hover'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          isLight ? 'bg-slate-100' : 'bg-jinbe-border'
                        }`}>
                          <Receipt className={`w-6 h-6 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {receivable.invoiceNumber}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${receivableStatusConfig[receivable.status].className}`}>
                              <StatusIcon className="w-3 h-3" />
                              {receivableStatusConfig[receivable.status].label}
                            </span>
                          </div>
                          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>{receivable.payer}</p>
                          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>{receivable.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 lg:gap-8">
                        <div className="text-right">
                          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Valor</p>
                          <p className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{receivable.amount}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Vencimento</p>
                          <p className={`text-sm font-medium flex items-center gap-1 justify-end ${
                            receivable.status === 'overdue' ? 'text-jinbe-danger' : isLight ? 'text-slate-700' : 'text-jinbe-muted'
                          }`}>
                            <Calendar className="w-3.5 h-3.5" />
                            {receivable.dueDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className={`p-2 rounded-lg transition-colors ${
                            isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                          }`}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg transition-colors ${
                            isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                          }`}>
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedOp && (
        <OperationDetailsModal
          operation={selectedOp}
          onClose={() => setSelectedOp(null)}
        />
      )}

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewInvoiceModal(false)} />
          <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-jinbe-sidebar border-jinbe-border'
          }`}>
            <div className={`px-6 py-5 border-b ${isLight ? 'border-slate-100' : 'border-jinbe-border'}`}>
              <h2 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Nova Invoice / Recebível</h2>
              <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Cadastre uma fatura para acompanhar o recebimento</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>Número da Invoice *</label>
                <input
                  type="text"
                  placeholder="Ex: INV-2024-0905"
                  className={`w-full mt-1.5 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-jinbe-primary ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-jinbe-bg border-jinbe-border text-white'
                  }`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>Cliente Pagador *</label>
                <input
                  type="text"
                  placeholder="Nome da empresa pagadora"
                  className={`w-full mt-1.5 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-jinbe-primary ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-jinbe-bg border-jinbe-border text-white'
                  }`}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>Valor *</label>
                  <input
                    type="text"
                    placeholder="0,00"
                    className={`w-full mt-1.5 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-jinbe-primary ${
                      isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-jinbe-bg border-jinbe-border text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>Moeda *</label>
                  <select className={`w-full mt-1.5 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-jinbe-primary ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-jinbe-bg border-jinbe-border text-white'
                  }`}>
                    <option value="EUR">EUR - Euro</option>
                    <option value="USD">USD - Dólar</option>
                    <option value="GBP">GBP - Libra</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>Data de Vencimento *</label>
                <input
                  type="date"
                  className={`w-full mt-1.5 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-jinbe-primary ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-jinbe-bg border-jinbe-border text-white'
                  }`}
                />
              </div>
              <div>
                <label className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Descrição do serviço ou produto"
                  className={`w-full mt-1.5 px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-jinbe-primary resize-none ${
                    isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-jinbe-bg border-jinbe-border text-white'
                  }`}
                />
              </div>
            </div>
            <div className={`px-6 py-4 border-t flex gap-3 ${isLight ? 'border-slate-100' : 'border-jinbe-border'}`}>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-jinbe-border text-white hover:bg-jinbe-hover'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowNewInvoiceModal(false)}
                className="flex-1 py-2.5 bg-jinbe-success hover:bg-jinbe-success/90 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Cadastrar Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
