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
} from 'lucide-react'
import { OperationDetailsModal } from '@/components/operations/OperationDetailsModal'
import { Link } from 'react-router-dom'

type OperationStatus = 'completed' | 'processing' | 'pending' | 'failed' | 'cancelled'

interface Operation {
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
  completed: { label: 'Completed', className: 'bg-jinbe-success/10 text-jinbe-success' },
  processing: { label: 'Processing', className: 'bg-jinbe-primary/10 text-jinbe-primary' },
  pending: { label: 'Pending', className: 'bg-jinbe-warning/10 text-jinbe-warning' },
  failed: { label: 'Failed', className: 'bg-jinbe-danger/10 text-jinbe-danger' },
  cancelled: { label: 'Cancelled', className: 'bg-jinbe-dim/10 text-jinbe-dim' },
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
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OperationStatus | 'all'>('all')
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null)
  const [showFilters, setShowFilters] = useState(false)

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
      <Header title="Operations" subtitle="PIX → USDC → SEPA payment pipeline" />

      <div className="flex flex-col gap-6 p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jinbe-dim" />
              <input
                type="text"
                placeholder="Search operations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-jinbe-card border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary w-[280px]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                showFilters || statusFilter !== 'all'
                  ? 'border-jinbe-primary text-jinbe-primary bg-jinbe-primary/5'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link
            to="/operations/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Operation
          </Link>
        </div>

        {/* Filter chips */}
        {showFilters && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-jinbe-dim font-medium uppercase tracking-wider">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === 'all' ? 'bg-jinbe-primary text-white' : 'bg-jinbe-card border border-jinbe-border text-jinbe-muted hover:text-white'
              }`}
            >
              All
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

        {/* Table */}
        <div className="border border-jinbe-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-jinbe-sidebar border-b border-jinbe-border">
                {['Operation ID', 'Client', 'Beneficiary', 'Amount (BRL)', 'Amount (EUR)', 'Rate', 'Status', 'Date', ''].map((col) => (
                  <th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-jinbe-dim uppercase tracking-wider">
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
                  <td className="px-5 py-4 text-sm font-mono font-semibold text-jinbe-primary">{op.id}</td>
                  <td className="px-5 py-4 text-sm text-jinbe-text">{op.client}</td>
                  <td className="px-5 py-4 text-sm text-jinbe-muted">{op.beneficiary}</td>
                  <td className="px-5 py-4 text-sm text-jinbe-text font-medium">{op.amountBRL}</td>
                  <td className="px-5 py-4 text-sm text-jinbe-text font-medium">{op.amountEUR}</td>
                  <td className="px-5 py-4 text-sm font-mono text-jinbe-muted">{op.rate}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[op.status].className}`}>
                      {statusConfig[op.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-jinbe-dim">{op.date}</td>
                  <td className="px-5 py-4">
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

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-jinbe-dim">
            Showing <span className="text-jinbe-text font-medium">{filtered.length}</span> of <span className="text-jinbe-text font-medium">{mockOperations.length}</span> operations
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
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
