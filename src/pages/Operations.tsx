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
} from 'lucide-react'
import { OperationDetailsModal } from '@/components/operations/OperationDetailsModal'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import { exportData, type ExportFormat } from '@/utils/export'

type OperationStatus = 'completed' | 'processing' | 'pending' | 'failed' | 'cancelled'

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

const statusConfig: Record<OperationStatus, { label: string; className: string }> = {
  completed: { label: 'Concluída', className: 'bg-jinbe-success/10 text-jinbe-success' },
  processing: { label: 'Processando', className: 'bg-jinbe-primary/10 text-jinbe-primary' },
  pending: { label: 'Pendente', className: 'bg-jinbe-warning/10 text-jinbe-warning' },
  failed: { label: 'Falhou', className: 'bg-jinbe-danger/10 text-jinbe-danger' },
  cancelled: { label: 'Cancelada', className: 'bg-jinbe-dim/10 text-jinbe-dim' },
}

const mockOperations: Operation[] = [
  { id: 'OP-2024-001', client: 'TechCorp Brasil', beneficiary: 'Schmidt GmbH', amountBRL: 'R$ 52,400.00', amountEUR: '€ 9,650.00', rate: '5.4300', status: 'completed', date: '2024-03-28 14:32', type: 'PIX → SEPA' },
  { id: 'OP-2024-002', client: 'Exporta Sul LTDA', beneficiary: 'Pierre Dupont SA', amountBRL: 'R$ 128,750.00', amountEUR: '€ 23,700.00', rate: '5.4325', status: 'processing', date: '2024-03-28 13:15', type: 'PIX → SEPA' },
  { id: 'OP-2024-003', client: 'Agro Norte SA', beneficiary: 'Van der Berg BV', amountBRL: 'R$ 87,200.00', amountEUR: '€ 16,050.00', rate: '5.4330', status: 'completed', date: '2024-03-28 11:45', type: 'PIX → SEPA' },
  { id: 'OP-2024-004', client: 'Digital Pay ME', beneficiary: 'Rossi SpA', amountBRL: 'R$ 34,100.00', amountEUR: '€ 6,280.00', rate: '5.4299', status: 'pending', date: '2024-03-28 10:20', type: 'PIX → SEPA' },
  { id: 'OP-2024-005', client: 'Comex Partners', beneficiary: 'García Hermanos SL', amountBRL: 'R$ 215,000.00', amountEUR: '€ 39,560.00', rate: '5.4350', status: 'failed', date: '2024-03-27 16:48', type: 'PIX → SEPA' },
  { id: 'OP-2024-006', client: 'Banco Flex', beneficiary: 'Nordic Solutions AB', amountBRL: 'R$ 67,800.00', amountEUR: '€ 12,480.00', rate: '5.4328', status: 'completed', date: '2024-03-27 15:30', type: 'PIX → SEPA' },
  { id: 'OP-2024-007', client: 'TechCorp Brasil', beneficiary: 'O\'Brien Ltd', amountBRL: 'R$ 143,500.00', amountEUR: '€ 26,410.00', rate: '5.4335', status: 'completed', date: '2024-03-27 14:10', type: 'PIX → SEPA' },
  { id: 'OP-2024-008', client: 'Exporta Sul LTDA', beneficiary: 'Schmidt GmbH', amountBRL: 'R$ 91,200.00', amountEUR: '€ 16,790.00', rate: '5.4318', status: 'cancelled', date: '2024-03-27 11:55', type: 'PIX → SEPA' },
  { id: 'OP-2024-009', client: 'Agro Norte SA', beneficiary: 'Pierre Dupont SA', amountBRL: 'R$ 76,300.00', amountEUR: '€ 14,040.00', rate: '5.4345', status: 'processing', date: '2024-03-27 09:30', type: 'PIX → SEPA' },
  { id: 'OP-2024-010', client: 'Digital Pay ME', beneficiary: 'Müller AG', amountBRL: 'R$ 45,600.00', amountEUR: '€ 8,395.00', rate: '5.4319', status: 'completed', date: '2024-03-26 17:20', type: 'PIX → SEPA' },
]

const filterStatuses: OperationStatus[] = ['completed', 'processing', 'pending', 'failed', 'cancelled']

export default function Operations() {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OperationStatus | 'all'>('all')
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleExport = (format: ExportFormat) => {
    const columns = [
      { key: 'id', header: 'ID Operação' },
      { key: 'client', header: 'Cliente' },
      { key: 'beneficiary', header: 'Beneficiário' },
      { key: 'amountBRL', header: 'Valor (BRL)' },
      { key: 'amountEUR', header: 'Valor (EUR)' },
      { key: 'rate', header: 'Taxa' },
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

  return (
    <>
      <Header title="Operações" subtitle="Acompanhe suas transferências internacionais" />

      <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jinbe-dim" />
              <input
                type="text"
                placeholder="Buscar operações..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-[240px] lg:w-[280px] pl-10 pr-4 py-2.5 bg-jinbe-card border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                showFilters || statusFilter !== 'all'
                  ? 'border-jinbe-primary text-jinbe-primary bg-jinbe-primary/5'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="sm:inline">Filtros</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2.5 border border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>

              {showExportMenu && (
                <div className={`absolute right-0 mt-2 w-44 rounded-lg border border-jinbe-border shadow-lg z-50 ${
                  isLight ? 'bg-white' : 'bg-jinbe-card'
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
              <span className="hidden sm:inline">Nova Operação</span>
              <span className="sm:hidden">Nova</span>
            </Link>
          </div>
        </div>

        {/* Filter chips */}
        {showFilters && (
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

        {/* Mobile Cards */}
        <div className="flex flex-col gap-3 lg:hidden">
          {filtered.map((op) => (
            <div
              key={op.id}
              onClick={() => setSelectedOp(op)}
              className="p-4 rounded-xl border border-jinbe-border bg-jinbe-card cursor-pointer active:bg-jinbe-hover/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-mono font-semibold text-jinbe-primary">{op.id}</p>
                  <p className="text-xs text-jinbe-dim mt-0.5">{op.date}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[op.status].className}`}>
                  {statusConfig[op.status].label}
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="text-sm text-jinbe-text">{op.client}</p>
                <p className="text-xs text-jinbe-muted">→ {op.beneficiary}</p>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-jinbe-border">
                <div>
                  <p className="text-xs text-jinbe-dim">Amount</p>
                  <p className="text-sm font-semibold text-jinbe-text">{op.amountEUR}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-jinbe-dim">Rate</p>
                  <p className="text-sm font-mono text-jinbe-muted">{op.rate}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedOp(op) }}
                  className="p-2 rounded-lg text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block border border-jinbe-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-jinbe-sidebar border-b border-jinbe-border">
                  {['ID Operação', 'Cliente', 'Beneficiário', 'Valor (BRL)', 'Valor (EUR)', 'Taxa', 'Status', 'Data', ''].map((col) => (
                    <th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-jinbe-dim uppercase tracking-wider whitespace-nowrap">
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
                    className={`border-b border-jinbe-border hover:bg-jinbe-hover/30 transition-colors cursor-pointer ${
                      i % 2 === 0 ? 'bg-jinbe-bg' : 'bg-jinbe-card/30'
                    }`}
                    onClick={() => setSelectedOp(op)}
                  >
                    <td className="px-5 py-4 text-sm font-mono font-semibold text-jinbe-primary whitespace-nowrap">{op.id}</td>
                    <td className="px-5 py-4 text-sm text-jinbe-text whitespace-nowrap">{op.client}</td>
                    <td className="px-5 py-4 text-sm text-jinbe-muted whitespace-nowrap">{op.beneficiary}</td>
                    <td className="px-5 py-4 text-sm text-jinbe-text font-medium whitespace-nowrap">{op.amountBRL}</td>
                    <td className="px-5 py-4 text-sm text-jinbe-text font-medium whitespace-nowrap">{op.amountEUR}</td>
                    <td className="px-5 py-4 text-sm font-mono text-jinbe-muted whitespace-nowrap">{op.rate}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[op.status].className}`}>
                        {statusConfig[op.status].label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-jinbe-dim whitespace-nowrap">{op.date}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOp(op) }}
                          className="p-1.5 rounded-md text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-md text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors">
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
          <p className="text-xs sm:text-sm text-jinbe-dim order-2 sm:order-1">
            Exibindo <span className="text-jinbe-text font-medium">{filtered.length}</span> de <span className="text-jinbe-text font-medium">{mockOperations.length}</span> operações
          </p>
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <button className="p-2 rounded-lg text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm font-medium transition-colors ${
                  page === 1 ? 'bg-jinbe-primary text-white' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="p-2 rounded-lg text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOp && (
        <OperationDetailsModal
          operation={selectedOp}
          onClose={() => setSelectedOp(null)}
        />
      )}
    </>
  )
}
