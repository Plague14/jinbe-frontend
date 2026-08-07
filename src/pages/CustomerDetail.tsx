import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  Edit2,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import type { Customer } from '@/services/urbanApi'

// Mock data - same as in Customers.tsx
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
  approved: { label: 'Aprovado', color: 'text-jinbe-success', bg: 'bg-jinbe-success/10' },
  pending: { label: 'Pendente', color: 'text-jinbe-warning', bg: 'bg-jinbe-warning/10' },
  rejected: { label: 'Rejeitado', color: 'text-jinbe-danger', bg: 'bg-jinbe-danger/10' },
}

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(false)
  const [generatingLink, setGeneratingLink] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const found = mockCustomers.find((c) => c.id === id)
      setCustomer(found || null)
      setIsLoading(false)
    }, 300)
  }, [id])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleGenerateVerificationLink = async () => {
    setGeneratingLink(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    alert(`Link de verificação gerado para ${customer?.id}`)
    setGeneratingLink(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jinbe-bg">
        <Header title="Detalhes do Cliente" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-jinbe-primary animate-spin" />
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-jinbe-bg">
        <Header title="Cliente não encontrado" />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <AlertCircle className="w-16 h-16 text-jinbe-dim mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Cliente não encontrado</h2>
          <p className="text-jinbe-muted mb-6">O cliente com ID "{id}" não existe.</p>
          <Link
            to="/customers"
            className="flex items-center gap-2 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Clientes
          </Link>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[customer.status].icon

  return (
    <div className="min-h-screen bg-jinbe-bg">
      <Header title="Detalhes do Cliente" subtitle={customer.id} />

      <div className="px-4 sm:px-6 py-6 max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-jinbe-muted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Clientes
        </button>

        {/* Main card */}
        <div className="bg-jinbe-card border border-jinbe-border rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-jinbe-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-jinbe-border flex items-center justify-center">
                  {customer.type === 'business' ? (
                    <Building2 className="w-8 h-8 text-jinbe-muted" />
                  ) : (
                    <User className="w-8 h-8 text-jinbe-muted" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-mono font-semibold text-white">{customer.id}</span>
                    <button
                      onClick={() => copyToClipboard(customer.id)}
                      className="p-1 hover:bg-jinbe-border rounded transition-colors"
                    >
                      {copiedId ? (
                        <CheckCircle2 className="w-4 h-4 text-jinbe-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-jinbe-dim" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-jinbe-muted">
                    <Mail className="w-4 h-4" />
                    {customer.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                    statusConfig[customer.status].color
                  }`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig[customer.status].label}
                </span>
                <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-jinbe-border text-jinbe-muted capitalize">
                  {customer.type === 'business' ? 'Empresa' : 'Pessoa Física'}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Criteria */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Critérios de Verificação</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-jinbe-bg/50 rounded-lg">
                  <p className="text-xs text-jinbe-dim mb-2">Verificação KYC</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      verificationConfig[customer.criteria.verification].color
                    } ${verificationConfig[customer.criteria.verification].bg}`}
                  >
                    {verificationConfig[customer.criteria.verification].label}
                  </span>
                </div>
                <div className="p-4 bg-jinbe-bg/50 rounded-lg">
                  <p className="text-xs text-jinbe-dim mb-2">Termos de Uso</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      customer.criteria.tos === 'signed'
                        ? 'text-jinbe-success bg-jinbe-success/10'
                        : 'text-jinbe-warning bg-jinbe-warning/10'
                    }`}
                  >
                    {customer.criteria.tos === 'signed' ? 'Assinado' : 'Não Assinado'}
                  </span>
                </div>
                <div className="p-4 bg-jinbe-bg/50 rounded-lg">
                  <p className="text-xs text-jinbe-dim mb-2">Status Operacional</p>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      customer.criteria.operational === 'enabled'
                        ? 'text-jinbe-success bg-jinbe-success/10'
                        : 'text-jinbe-muted bg-jinbe-border'
                    }`}
                  >
                    {customer.criteria.operational === 'enabled' ? 'Habilitado' : 'Desabilitado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Platforms & Spread */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Plataformas Habilitadas</h3>
                <div className="p-4 bg-jinbe-bg/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-jinbe-muted">Ativos Digitais</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        customer.platforms.digital_assets
                          ? 'bg-jinbe-success/20 text-jinbe-success'
                          : 'bg-jinbe-border text-jinbe-dim'
                      }`}
                    >
                      {customer.platforms.digital_assets ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-jinbe-muted">Pagamentos Globais</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        customer.platforms.global_payments
                          ? 'bg-jinbe-success/20 text-jinbe-success'
                          : 'bg-jinbe-border text-jinbe-dim'
                      }`}
                    >
                      {customer.platforms.global_payments ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Configuração de Spread</h3>
                <div className="p-4 bg-jinbe-bg/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-jinbe-muted">Ativos Digitais</span>
                    <span className="text-sm font-mono font-medium text-white">
                      {customer.spread.digital_assets}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-jinbe-muted">Pagamentos Globais</span>
                    <span className="text-sm font-mono font-medium text-white">
                      {customer.spread.global_payments}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-jinbe-border">
              <div>
                <p className="text-xs text-jinbe-dim mb-1">Criado em</p>
                <p className="text-sm text-white">{formatDate(customer.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-jinbe-dim mb-1">Última atualização</p>
                <p className="text-sm text-white">{formatDate(customer.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-jinbe-bg/30 border-t border-jinbe-border flex flex-col sm:flex-row gap-3">
            {customer.criteria.verification !== 'approved' && (
              <button
                onClick={handleGenerateVerificationLink}
                disabled={generatingLink}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-jinbe-border hover:bg-jinbe-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {generatingLink ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                Gerar Link de Verificação
              </button>
            )}
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-medium rounded-lg transition-colors">
              <Edit2 className="w-4 h-4" />
              Editar Cliente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
