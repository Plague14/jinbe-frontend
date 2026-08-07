import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User,
  FileText,
  Shield,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import logoJinbe from '@/assets/logo-jinbe.png'

// ─── Types ───────────────────────────────────────────────────────
type VerificationStatus = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'action_required'

interface VerificationStep {
  id: string
  label: string
  description: string
  status: VerificationStatus
  icon: typeof Building2
  actionLabel?: string
  actionUrl?: string
  estimatedTime?: string
  completedAt?: string
}

// ─── Status Config ───────────────────────────────────────────────
const statusConfig: Record<VerificationStatus, { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }> = {
  pending: { label: 'Pendente', color: 'text-jinbe-dim', bgColor: 'bg-jinbe-border', icon: Clock },
  in_progress: { label: 'Em análise', color: 'text-jinbe-warning', bgColor: 'bg-jinbe-warning/20', icon: Clock },
  approved: { label: 'Aprovado', color: 'text-jinbe-success', bgColor: 'bg-jinbe-success/20', icon: CheckCircle2 },
  rejected: { label: 'Rejeitado', color: 'text-jinbe-danger', bgColor: 'bg-jinbe-danger/20', icon: AlertCircle },
  action_required: { label: 'Ação necessária', color: 'text-jinbe-warning', bgColor: 'bg-jinbe-warning/20', icon: AlertCircle },
}

// ─── Mock Data (seria carregado via API) ─────────────────────────
const mockVerificationData = {
  companyName: 'Pescados Atlântico Ltda.',
  cnpj: '12.345.678/0001-99',
  email: 'carlos@pescados.com.br',
  createdAt: '2026-08-04T14:30:00Z',
  overallProgress: 66, // percentage
  steps: [
    {
      id: 'email',
      label: 'Confirmação de e-mail',
      description: 'Clique no link enviado para seu e-mail',
      status: 'approved' as VerificationStatus,
      icon: Mail,
      completedAt: '2026-08-04T14:32:00Z',
    },
    {
      id: 'kyb',
      label: 'Verificação da empresa (KYB)',
      description: 'Validação do CNPJ e dados cadastrais junto à Receita Federal',
      status: 'approved' as VerificationStatus,
      icon: Building2,
      completedAt: '2026-08-04T14:35:00Z',
    },
    {
      id: 'kyc',
      label: 'Verificação de identidade (KYC)',
      description: 'Selfie e documento do responsável legal via Sumsub',
      status: 'in_progress' as VerificationStatus,
      icon: User,
      actionLabel: 'Continuar verificação',
      actionUrl: 'https://sumsub.com/verify/abc123',
      estimatedTime: 'Aprovação em até 24h',
    },
    {
      id: 'docs',
      label: 'Documentação complementar',
      description: 'Contrato social e documentos adicionais se necessário',
      status: 'pending' as VerificationStatus,
      icon: FileText,
    },
    {
      id: 'compliance',
      label: 'Aprovação final',
      description: 'Revisão de compliance pela equipe Urban Exchange',
      status: 'pending' as VerificationStatus,
      icon: Shield,
      estimatedTime: 'Após conclusão das etapas anteriores',
    },
  ] as VerificationStep[],
}

export default function OnboardingStatus() {
  const navigate = useNavigate()
  const { completeOnboarding } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [data, setData] = useState(mockVerificationData)

  // Calculate progress based on completed steps
  const completedSteps = data.steps.filter(s => s.status === 'approved').length
  const totalSteps = data.steps.length
  const progress = Math.round((completedSteps / totalSteps) * 100)

  // Check if all steps are approved
  const isFullyApproved = data.steps.every(s => s.status === 'approved')

  // Check if there's any action required
  const hasActionRequired = data.steps.some(s => s.status === 'action_required' || s.status === 'rejected')

  // Get the current active step (first non-approved)
  const currentStep = data.steps.find(s => s.status !== 'approved')

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500))
    setIsRefreshing(false)
  }

  const handleContinue = () => {
    completeOnboarding()
    navigate('/')
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-jinbe-bg">
      {/* Header */}
      <header className="border-b border-jinbe-border bg-[#0c1219]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <img src={logoJinbe} alt="Jinbe" className="h-8 sm:h-10" />
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-jinbe-muted hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Progress Card */}
        <div className="bg-jinbe-card border border-jinbe-border rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {isFullyApproved ? 'Conta aprovada!' : 'Verificação em andamento'}
              </h1>
              <p className="text-jinbe-muted">
                {data.companyName} · {data.cnpj}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{progress}%</p>
                <p className="text-xs text-jinbe-dim">concluído</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-jinbe-border rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFullyApproved ? 'bg-jinbe-success' : hasActionRequired ? 'bg-jinbe-warning' : 'bg-jinbe-primary'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Status Message */}
          {isFullyApproved ? (
            <div className="mt-6 flex items-start gap-3 p-4 bg-jinbe-success/10 border border-jinbe-success/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-jinbe-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Parabéns! Sua conta foi aprovada.</p>
                <p className="text-sm text-jinbe-muted mt-1">
                  Você já pode fazer sua primeira operação de câmbio na plataforma.
                </p>
              </div>
            </div>
          ) : currentStep?.status === 'in_progress' ? (
            <div className="mt-6 flex items-start gap-3 p-4 bg-jinbe-info/10 border border-jinbe-info/20 rounded-xl">
              <Clock className="w-5 h-5 text-jinbe-info shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">
                  Etapa em análise: {currentStep.label}
                </p>
                <p className="text-sm text-jinbe-muted mt-1">
                  {currentStep.estimatedTime || 'Você receberá uma notificação quando a análise for concluída.'}
                </p>
              </div>
            </div>
          ) : hasActionRequired ? (
            <div className="mt-6 flex items-start gap-3 p-4 bg-jinbe-warning/10 border border-jinbe-warning/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-jinbe-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Ação necessária</p>
                <p className="text-sm text-jinbe-muted mt-1">
                  Uma ou mais etapas precisam da sua atenção. Verifique os itens abaixo.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Verification Steps - Checklist (T0-C) */}
        <div className="bg-jinbe-card border border-jinbe-border rounded-2xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-jinbe-border">
            <h2 className="text-sm font-semibold text-white">Etapas de verificação</h2>
          </div>

          <div className="divide-y divide-jinbe-border">
            {data.steps.map((step, index) => {
              const StatusIcon = statusConfig[step.status].icon
              const StepIcon = step.icon
              const isLast = index === data.steps.length - 1

              return (
                <div
                  key={step.id}
                  className={`px-6 py-4 ${
                    step.status === 'approved' ? 'bg-jinbe-bg/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      step.status === 'approved'
                        ? 'bg-jinbe-success/20'
                        : step.status === 'in_progress'
                        ? 'bg-jinbe-warning/20'
                        : step.status === 'action_required' || step.status === 'rejected'
                        ? 'bg-jinbe-danger/20'
                        : 'bg-jinbe-border'
                    }`}>
                      <StepIcon className={`w-5 h-5 ${
                        step.status === 'approved'
                          ? 'text-jinbe-success'
                          : step.status === 'in_progress'
                          ? 'text-jinbe-warning'
                          : step.status === 'action_required' || step.status === 'rejected'
                          ? 'text-jinbe-danger'
                          : 'text-jinbe-dim'
                      }`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm font-medium ${
                            step.status === 'approved' ? 'text-jinbe-muted' : 'text-white'
                          }`}>
                            {step.label}
                          </p>
                          <p className="text-xs text-jinbe-dim mt-0.5">{step.description}</p>
                        </div>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                          statusConfig[step.status].bgColor
                        } ${statusConfig[step.status].color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig[step.status].label}
                        </span>
                      </div>

                      {/* Completed timestamp */}
                      {step.completedAt && (
                        <p className="text-xs text-jinbe-dim mt-2">
                          Concluído em {formatDate(step.completedAt)}
                        </p>
                      )}

                      {/* Action button */}
                      {step.actionUrl && step.status !== 'approved' && (
                        <a
                          href={step.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {step.actionLabel}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* Estimated time */}
                      {step.estimatedTime && step.status !== 'approved' && !step.actionUrl && (
                        <p className="text-xs text-jinbe-dim mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.estimatedTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Buttons */}
        {isFullyApproved ? (
          <button
            onClick={handleContinue}
            className="w-full py-3.5 bg-jinbe-success hover:bg-jinbe-success/90 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Acessar meu painel
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 border border-jinbe-border hover:bg-jinbe-hover text-white font-medium rounded-xl transition-colors"
            >
              Explorar plataforma (modo demo)
            </button>
            <button
              onClick={handleRefresh}
              className="flex-1 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Verificar status
            </button>
          </div>
        )}

        {/* Support Section */}
        <div className="mt-8 p-6 bg-jinbe-card border border-jinbe-border rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-jinbe-primary/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-jinbe-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white mb-1">Precisa de ajuda?</h3>
              <p className="text-sm text-jinbe-muted mb-4">
                Nossa equipe está disponível para ajudar com qualquer dúvida sobre o processo de verificação.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/5521999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-jinbe-success/20 hover:bg-jinbe-success/30 text-jinbe-success text-sm font-medium rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </a>
                <a
                  href="mailto:suporte@jinbe.com.br"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-jinbe-border hover:bg-jinbe-hover text-jinbe-muted hover:text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  suporte@jinbe.com.br
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-jinbe-dim mt-6">
          Cadastro iniciado em {formatDate(data.createdAt)} · {data.email}
        </p>
      </main>
    </div>
  )
}
