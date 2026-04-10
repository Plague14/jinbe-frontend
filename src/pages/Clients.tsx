import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'

type ClientStatus = 'active' | 'pending' | 'suspended'

interface Client {
  id: string
  name: string
  cnpj: string
  email: string
  phone: string
  city: string
  country: string
  status: ClientStatus
  totalVolume: string
  opsCount: number
  lastOp: string
}

const statusConfig: Record<ClientStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  active: { label: 'Active', icon: CheckCircle2, className: 'text-jinbe-success' },
  pending: { label: 'Pending', icon: Clock, className: 'text-jinbe-warning' },
  suspended: { label: 'Suspended', icon: XCircle, className: 'text-jinbe-danger' },
}

const mockClients: Client[] = [
  { id: 'CL-001', name: 'TechCorp Brasil', cnpj: '12.345.678/0001-90', email: 'finance@techcorp.com.br', phone: '+55 11 3456-7890', city: 'São Paulo', country: 'BR', status: 'active', totalVolume: '€ 1,245,000', opsCount: 87, lastOp: '2024-03-28' },
  { id: 'CL-002', name: 'Exporta Sul LTDA', cnpj: '23.456.789/0001-01', email: 'ops@exportasul.com.br', phone: '+55 51 2345-6789', city: 'Porto Alegre', country: 'BR', status: 'active', totalVolume: '€ 892,500', opsCount: 64, lastOp: '2024-03-28' },
  { id: 'CL-003', name: 'Agro Norte SA', cnpj: '34.567.890/0001-12', email: 'financeiro@agronorte.com.br', phone: '+55 92 3456-7890', city: 'Manaus', country: 'BR', status: 'active', totalVolume: '€ 2,130,000', opsCount: 142, lastOp: '2024-03-27' },
  { id: 'CL-004', name: 'Digital Pay ME', cnpj: '45.678.901/0001-23', email: 'treasury@digitalpay.com.br', phone: '+55 21 4567-8901', city: 'Rio de Janeiro', country: 'BR', status: 'pending', totalVolume: '€ 156,800', opsCount: 12, lastOp: '2024-03-26' },
  { id: 'CL-005', name: 'Comex Partners', cnpj: '56.789.012/0001-34', email: 'comex@partners.com.br', phone: '+55 11 5678-9012', city: 'São Paulo', country: 'BR', status: 'suspended', totalVolume: '€ 430,200', opsCount: 31, lastOp: '2024-03-20' },
  { id: 'CL-006', name: 'Banco Flex', cnpj: '67.890.123/0001-45', email: 'international@bancoflex.com.br', phone: '+55 11 6789-0123', city: 'São Paulo', country: 'BR', status: 'active', totalVolume: '€ 3,870,000', opsCount: 256, lastOp: '2024-03-28' },
]

export default function Clients() {
  const [search, setSearch] = useState('')
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const filtered = mockClients.filter((c) =>
    search === '' ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.cnpj.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header title="Client Directory" subtitle="Manage clients and bank accounts" />

      <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`} />
            <input
              type="text"
              placeholder="Search by name, CNPJ or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full sm:w-[280px] lg:w-[320px] pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-jinbe-primary ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  : 'bg-jinbe-card border-jinbe-border text-white placeholder:text-jinbe-dim'
              }`}
            />
          </div>
          <Link
            to="/clients/new"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Register Client</span>
            <span className="sm:hidden">Register</span>
          </Link>
        </div>

        {/* Client cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((client) => {
            const StatusIcon = statusConfig[client.status].icon
            return (
              <div
                key={client.id}
                className={`flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border transition-colors ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    : 'bg-jinbe-card border-jinbe-border hover:border-jinbe-hover'
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-jinbe-primary/10">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-primary" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{client.name}</h3>
                      <p className={`text-xs font-mono ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`}>{client.cnpj}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 sm:gap-1.5 text-xs font-semibold ${statusConfig[client.status].className}`}>
                      <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">{statusConfig[client.status].label}</span>
                    </span>
                    <button className={`p-1.5 rounded-md transition-colors ${
                      isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                    }`}>
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-x-5 sm:gap-y-1.5">
                  <span className={`flex items-center gap-1.5 text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>
                    <Mail className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`} />
                    <span className="truncate">{client.email}</span>
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>
                    <Phone className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`} />
                    {client.phone}
                  </span>
                  <span className={`flex items-center gap-1.5 text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`} />
                    {client.city}, {client.country}
                  </span>
                </div>

                {/* Stats row */}
                <div className={`flex items-center justify-between pt-3 border-t ${isLight ? 'border-slate-100' : 'border-jinbe-border'}`}>
                  <div className="flex gap-4 sm:gap-6">
                    <div>
                      <p className={`text-[10px] sm:text-xs ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`}>Volume</p>
                      <p className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{client.totalVolume}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] sm:text-xs ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`}>Ops</p>
                      <p className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{client.opsCount}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className={`text-xs ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`}>Last Op</p>
                      <p className={`text-sm font-semibold ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>{client.lastOp}</p>
                    </div>
                  </div>
                  <Link
                    to={`/clients/${client.id}`}
                    className="flex items-center gap-1 text-xs font-medium text-jinbe-primary hover:text-jinbe-primary/80 transition-colors"
                  >
                    View
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
