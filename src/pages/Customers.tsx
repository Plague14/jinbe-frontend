import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Building2,
  User,
  Mail,
  ExternalLink,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import type { Customer } from '@/services/urbanApi'

// Mock data for demonstration
const mockCustomers: Customer[] = [
  {
    id: 'CUS00000559',
    email: 'acme@example.com',
    type: 'business',
    status: 'active',
    criteria: {
      verification: 'approved',
      tos: 'signed',
      operational: 'enabled',
    },
    platforms: {
      digital_assets: true,
      global_payments: true,
    },
    spread: {
      digital_assets: 0.2,
      global_payments: 0.1,
    },
    created_at: '2026-04-01T22:14:26Z',
    updated_at: '2026-04-01T22:14:26Z',
  },
  {
    id: 'CUS00000560',
    email: 'john@individual.com',
    type: 'individual',
    status: 'pending',
    criteria: {
      verification: 'pending',
      tos: 'not_signed',
      operational: 'disabled',
    },
    platforms: {
      digital_assets: true,
      global_payments: false,
    },
    spread: {
      digital_assets: 0.3,
      global_payments: 0.15,
    },
    created_at: '2026-04-02T10:30:00Z',
    updated_at: '2026-04-02T10:30:00Z',
  },
  {
    id: 'CUS00000561',
    email: 'finance@corp.com',
    type: 'business',
    status: 'active',
    criteria: {
      verification: 'approved',
      tos: 'signed',
      operational: 'enabled',
    },
    platforms: {
      digital_assets: true,
      global_payments: true,
    },
    spread: {
      digital_assets: 0.15,
      global_payments: 0.08,
    },
    created_at: '2026-03-15T14:00:00Z',
    updated_at: '2026-04-01T09:00:00Z',
  },
]

const statusConfig = {
  active: { label: 'Ativo', color: 'bg-jinbe-success/20 text-jinbe-success', icon: CheckCircle2 },
  pending: { label: 'Pendente', color: 'bg-jinbe-warning/20 text-jinbe-warning', icon: Clock },
  suspended: { label: 'Suspenso', color: 'bg-jinbe-danger/20 text-jinbe-danger', icon: XCircle },
}

const verificationConfig = {
  approved: { label: 'Aprovado', color: 'text-jinbe-success' },
  pending: { label: 'Pendente', color: 'text-jinbe-warning' },
  rejected: { label: 'Rejeitado', color: 'text-jinbe-danger' },
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [generatingLink, setGeneratingLink] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCustomers(mockCustomers)
      setIsLoading(false)
    }, 500)
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGenerateVerificationLink = async (customerId: string) => {
    setGeneratingLink(customerId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // In real implementation, this would call generateVerificationLink(customerId)
    alert(`Verification link generated for ${customerId}`)
    setGeneratingLink(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-jinbe-bg">
      <Header title="Customers" />

      <div className="px-4 sm:px-6 py-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
            <input
              type="text"
              placeholder="Buscar por ID ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-jinbe-card border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
            />
          </div>
          <Link
            to="/customers/new"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Customer
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-jinbe-primary animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-jinbe-dim mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum customer encontrado</h3>
            <p className="text-jinbe-muted mb-6">
              {searchQuery
                ? 'Tente ajustar sua busca'
                : 'Comece criando seu primeiro customer'}
            </p>
            {!searchQuery && (
              <Link
                to="/customers/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Criar Customer
              </Link>
            )}
          </div>
        )}

        {/* Customer list */}
        {!isLoading && filteredCustomers.length > 0 && (
          <div className="grid gap-4">
            {filteredCustomers.map((customer) => {
              const StatusIcon = statusConfig[customer.status].icon

              return (
                <div
                  key={customer.id}
                  className="bg-jinbe-card border border-jinbe-border rounded-xl p-5"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-jinbe-border flex items-center justify-center">
                        {customer.type === 'business' ? (
                          <Building2 className="w-6 h-6 text-jinbe-muted" />
                        ) : (
                          <User className="w-6 h-6 text-jinbe-muted" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white">{customer.id}</span>
                          <button
                            onClick={() => copyToClipboard(customer.id, customer.id)}
                            className="p-1 hover:bg-jinbe-border rounded transition-colors"
                          >
                            {copiedId === customer.id ? (
                              <CheckCircle2 className="w-4 h-4 text-jinbe-success" />
                            ) : (
                              <Copy className="w-4 h-4 text-jinbe-dim" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-jinbe-muted">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          statusConfig[customer.status].color
                        }`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig[customer.status].label}
                      </span>
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-jinbe-border text-jinbe-muted capitalize">
                        {customer.type}
                      </span>
                    </div>
                  </div>

                  {/* Criteria */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-jinbe-bg/50 rounded-lg">
                    <div>
                      <p className="text-xs text-jinbe-dim mb-1">Verificação</p>
                      <p className={`text-sm font-medium ${verificationConfig[customer.criteria.verification].color}`}>
                        {verificationConfig[customer.criteria.verification].label}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-jinbe-dim mb-1">Termos</p>
                      <p className={`text-sm font-medium ${
                        customer.criteria.tos === 'signed' ? 'text-jinbe-success' : 'text-jinbe-warning'
                      }`}>
                        {customer.criteria.tos === 'signed' ? 'Assinado' : 'Não Assinado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-jinbe-dim mb-1">Operacional</p>
                      <p className={`text-sm font-medium ${
                        customer.criteria.operational === 'enabled' ? 'text-jinbe-success' : 'text-jinbe-muted'
                      }`}>
                        {customer.criteria.operational === 'enabled' ? 'Habilitado' : 'Desabilitado'}
                      </p>
                    </div>
                  </div>

                  {/* Spread & Platforms */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex-1 p-3 bg-jinbe-bg/50 rounded-lg">
                      <p className="text-xs text-jinbe-dim mb-2">Spread</p>
                      <div className="flex gap-4">
                        <div>
                          <span className="text-xs text-jinbe-muted">Digital Assets: </span>
                          <span className="text-white font-medium">{customer.spread.digital_assets}%</span>
                        </div>
                        <div>
                          <span className="text-xs text-jinbe-muted">Global Payments: </span>
                          <span className="text-white font-medium">{customer.spread.global_payments}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-3 bg-jinbe-bg/50 rounded-lg">
                      <p className="text-xs text-jinbe-dim mb-2">Platforms</p>
                      <div className="flex gap-2">
                        {customer.platforms.digital_assets && (
                          <span className="px-2 py-1 bg-jinbe-info/20 text-jinbe-info text-xs rounded">
                            Digital Assets
                          </span>
                        )}
                        {customer.platforms.global_payments && (
                          <span className="px-2 py-1 bg-jinbe-success/20 text-jinbe-success text-xs rounded">
                            Global Payments
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-jinbe-border">
                    <p className="text-sm text-jinbe-dim">
                      Criado em {formatDate(customer.created_at)}
                    </p>
                    <div className="flex gap-2">
                      {customer.criteria.verification !== 'approved' && (
                        <button
                          onClick={() => handleGenerateVerificationLink(customer.id)}
                          disabled={generatingLink === customer.id}
                          className="flex items-center gap-2 px-4 py-2 bg-jinbe-border hover:bg-jinbe-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {generatingLink === customer.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
                          )}
                          Gerar Link de Verificação
                        </button>
                      )}
                      <Link
                        to={`/customers/${customer.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
