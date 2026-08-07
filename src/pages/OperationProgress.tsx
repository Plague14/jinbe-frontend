import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Loader2,
  Building2,
  ArrowUpRight,
  FileText,
  Share2,
  Download,
  RefreshCw,
  AlertCircle,
  Wallet,
  Landmark,
  Globe,
  DollarSign,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// ─── Types ───────────────────────────────────────────────────────
type OperationStatus =
  | 'awaiting_pix'        // T2-E: Aguardando PIX do cliente
  | 'pix_received'        // T2-E: PIX recebido, processando
  | 'converting'          // Convertendo moeda
  | 'sending'             // Enviando para beneficiário
  | 'completed'           // T2-F: Operação concluída
  | 'failed'              // Erro na operação

interface OperationStep {
  id: string
  label: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  timestamp?: string
}

// ─── Mock Data ───────────────────────────────────────────────────
const mockOperation = {
  id: 'JNB-2026-0023',
  status: 'completed' as OperationStatus,
  createdAt: '2026-08-06T10:30:00Z',
  beneficiary: {
    name: 'Schmidt GmbH',
    bank: 'Commerzbank',
    iban: 'DE89 3704 0044 0532 0130 00',
    country: 'Germany',
  },
  values: {
    brl: 57245.80,
    eur: 10000.00,
    rate: 5.7246,
    taxaJinbe: 858.69,
    iof: 217.53,
    totalBrl: 58321.02,
  },
  pixKey: 'jinbe-op-jnb20260023@urban.exchange',
  pixQRCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX-JINBE',
  steps: [
    {
      id: 'created',
      label: 'Operação criada',
      description: 'Cotação fixada por 3 minutos',
      status: 'completed' as const,
      timestamp: '2026-08-06T10:30:00Z',
    },
    {
      id: 'pix_received',
      label: 'PIX recebido',
      description: 'R$ 58.321,02 creditado',
      status: 'completed' as const,
      timestamp: '2026-08-06T10:32:15Z',
    },
    {
      id: 'converted',
      label: 'Conversão realizada',
      description: 'BRL convertido para EUR',
      status: 'completed' as const,
      timestamp: '2026-08-06T10:32:45Z',
    },
    {
      id: 'sent',
      label: 'Enviado ao beneficiário',
      description: 'Transferência bancária iniciada',
      status: 'completed' as const,
      timestamp: '2026-08-06T10:33:12Z',
    },
    {
      id: 'completed',
      label: 'Concluído',
      description: 'Crédito confirmado em 1 dia útil',
      status: 'completed' as const,
      timestamp: '2026-08-06T10:33:12Z',
    },
  ] as OperationStep[],
}

// Status for demo - can be controlled
const statusMessages: Record<OperationStatus, { title: string; subtitle: string; color: string }> = {
  awaiting_pix: {
    title: 'Aguardando seu PIX',
    subtitle: 'Escaneie o QR Code ou copie a chave PIX para enviar o pagamento',
    color: 'text-jinbe-warning',
  },
  pix_received: {
    title: 'PIX recebido!',
    subtitle: 'Estamos processando sua operação',
    color: 'text-jinbe-success',
  },
  converting: {
    title: 'Convertendo moeda',
    subtitle: 'Realizando a conversão de BRL para EUR',
    color: 'text-jinbe-primary',
  },
  sending: {
    title: 'Enviando para o beneficiário',
    subtitle: 'Transferência bancária em processamento',
    color: 'text-jinbe-primary',
  },
  completed: {
    title: 'Operação concluída!',
    subtitle: 'O pagamento foi enviado com sucesso',
    color: 'text-jinbe-success',
  },
  failed: {
    title: 'Erro na operação',
    subtitle: 'Ocorreu um problema. Entre em contato com o suporte.',
    color: 'text-jinbe-danger',
  },
}

function formatCurrency(value: number, currency: string = 'BRL'): string {
  if (currency === 'BRL') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(value)
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function OperationProgress() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [operation, setOperation] = useState(mockOperation)
  const [copiedPix, setCopiedPix] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate status progression for demo
  const [demoStatus, setDemoStatus] = useState<OperationStatus>('awaiting_pix')

  useEffect(() => {
    // Demo: auto-progress through statuses
    const timers: ReturnType<typeof setTimeout>[] = []

    if (demoStatus === 'awaiting_pix') {
      timers.push(setTimeout(() => setDemoStatus('pix_received'), 5000))
    } else if (demoStatus === 'pix_received') {
      timers.push(setTimeout(() => setDemoStatus('converting'), 2000))
    } else if (demoStatus === 'converting') {
      timers.push(setTimeout(() => setDemoStatus('sending'), 2000))
    } else if (demoStatus === 'sending') {
      timers.push(setTimeout(() => setDemoStatus('completed'), 3000))
    }

    return () => timers.forEach(clearTimeout)
  }, [demoStatus])

  const handleCopyPix = async () => {
    await navigator.clipboard.writeText(operation.pixKey)
    setCopiedPix(true)
    setTimeout(() => setCopiedPix(false), 2000)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setIsRefreshing(false)
  }

  const currentStatus = statusMessages[demoStatus]
  const isProcessing = ['pix_received', 'converting', 'sending'].includes(demoStatus)
  const isCompleted = demoStatus === 'completed'
  const isAwaitingPix = demoStatus === 'awaiting_pix'

  // Update steps based on demo status
  const getStepStatus = (stepId: string): OperationStep['status'] => {
    const statusOrder = ['created', 'pix_received', 'converted', 'sent', 'completed']
    const currentIndex = {
      awaiting_pix: 0,
      pix_received: 1,
      converting: 2,
      sending: 3,
      completed: 4,
      failed: -1,
    }[demoStatus]

    const stepIndex = statusOrder.indexOf(stepId)
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'in_progress'
    return 'pending'
  }

  return (
    <>
      <Header title="Acompanhamento" subtitle={`Operação ${operation.id}`} />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Status Card */}
        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          <div className="p-6">
            {/* Status Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                isCompleted ? 'bg-jinbe-success/20' :
                isAwaitingPix ? 'bg-jinbe-warning/20' :
                'bg-jinbe-primary/20'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-7 h-7 text-jinbe-success" />
                ) : isProcessing ? (
                  <Loader2 className="w-7 h-7 text-jinbe-primary animate-spin" />
                ) : (
                  <Clock className="w-7 h-7 text-jinbe-warning" />
                )}
              </div>
              <div>
                <h1 className={`text-xl font-bold ${currentStatus.color}`}>
                  {currentStatus.title}
                </h1>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                  {currentStatus.subtitle}
                </p>
              </div>
            </div>

            {/* PIX Section - T2-E: Awaiting PIX */}
            {isAwaitingPix && (
              <div className={`p-6 rounded-xl mb-6 ${
                isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
              }`}>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* QR Code */}
                  <div className={`p-4 rounded-xl ${isLight ? 'bg-white' : 'bg-jinbe-card'}`}>
                    <img
                      src={operation.pixQRCode}
                      alt="QR Code PIX"
                      className="w-40 h-40"
                    />
                  </div>

                  {/* PIX Details */}
                  <div className="flex-1 text-center sm:text-left">
                    <p className={`text-sm font-medium mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Valor a pagar via PIX:
                    </p>
                    <p className="text-3xl font-bold text-jinbe-primary mb-4">
                      {formatCurrency(operation.values.totalBrl)}
                    </p>

                    <p className={`text-xs mb-2 ${isLight ? 'text-slate-600' : 'text-jinbe-dim'}`}>
                      Chave PIX (copia e cola):
                    </p>
                    <div className="flex items-center gap-2">
                      <code className={`flex-1 px-3 py-2 rounded-lg text-sm font-mono truncate ${
                        isLight ? 'bg-white border border-slate-200' : 'bg-jinbe-card border border-jinbe-border'
                      } ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                        {operation.pixKey}
                      </code>
                      <button
                        onClick={handleCopyPix}
                        className={`p-2 rounded-lg transition-colors ${
                          copiedPix
                            ? 'bg-jinbe-success/20 text-jinbe-success'
                            : 'bg-jinbe-primary/20 text-jinbe-primary hover:bg-jinbe-primary/30'
                        }`}
                      >
                        {copiedPix ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>

                    <p className={`text-xs mt-3 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
                      A cotação é válida por 3 minutos. Após o pagamento, a operação será processada automaticamente.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Processing Animation */}
            {isProcessing && (
              <div className={`p-6 rounded-xl mb-6 text-center ${
                isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
              }`}>
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-jinbe-primary/20" />
                    <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-jinbe-primary border-t-transparent animate-spin" />
                  </div>
                </div>
                <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                  {demoStatus === 'pix_received' && 'Verificando pagamento...'}
                  {demoStatus === 'converting' && 'Convertendo BRL para EUR...'}
                  {demoStatus === 'sending' && 'Iniciando transferência bancária...'}
                </p>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className={`text-xs font-semibold uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-jinbe-dim'
                }`}>
                  Linha do tempo
                </p>
                <button
                  onClick={handleRefresh}
                  className={`flex items-center gap-1 text-xs ${
                    isLight ? 'text-slate-500 hover:text-slate-700' : 'text-jinbe-dim hover:text-jinbe-muted'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>

              <div className="space-y-0">
                {operation.steps.map((step, index) => {
                  const status = getStepStatus(step.id)
                  const isFirst = index === 0
                  const isLast = index === operation.steps.length - 1

                  return (
                    <div key={step.id} className="flex gap-4">
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          status === 'completed' ? 'bg-jinbe-success/20' :
                          status === 'in_progress' ? 'bg-jinbe-primary/20' :
                          isLight ? 'bg-slate-100' : 'bg-jinbe-border'
                        }`}>
                          {status === 'completed' ? (
                            <Check className="w-4 h-4 text-jinbe-success" />
                          ) : status === 'in_progress' ? (
                            <Loader2 className="w-4 h-4 text-jinbe-primary animate-spin" />
                          ) : (
                            <Clock className="w-4 h-4 text-jinbe-dim" />
                          )}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-8 ${
                            status === 'completed' ? 'bg-jinbe-success/30' :
                            isLight ? 'bg-slate-200' : 'bg-jinbe-border'
                          }`} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="pb-4">
                        <p className={`text-sm font-medium ${
                          status === 'completed'
                            ? isLight ? 'text-slate-900' : 'text-white'
                            : status === 'in_progress'
                            ? 'text-jinbe-primary'
                            : isLight ? 'text-slate-400' : 'text-jinbe-dim'
                        }`}>
                          {step.label}
                        </p>
                        <p className={`text-xs ${
                          isLight ? 'text-slate-500' : 'text-jinbe-dim'
                        }`}>
                          {step.description}
                        </p>
                        {step.timestamp && status === 'completed' && (
                          <p className={`text-xs mt-1 ${
                            isLight ? 'text-slate-400' : 'text-jinbe-dim'
                          }`}>
                            {formatDateTime(step.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Operation Details */}
        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          <div className="p-6">
            <h2 className={`text-sm font-semibold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Detalhes da operação
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Beneficiary */}
              <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Landmark className="w-4 h-4 text-jinbe-primary" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-slate-500' : 'text-jinbe-dim'
                  }`}>
                    Beneficiário
                  </span>
                </div>
                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {operation.beneficiary.name}
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
                  {operation.beneficiary.bank}
                </p>
                <p className={`text-xs font-mono mt-1 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                  {operation.beneficiary.iban}
                </p>
                <p className={`text-xs flex items-center gap-1 mt-1 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
                  <Globe className="w-3 h-3" />
                  {operation.beneficiary.country}
                </p>
              </div>

              {/* Values */}
              <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-jinbe-primary" />
                  <span className={`text-xs font-semibold uppercase tracking-wider ${
                    isLight ? 'text-slate-500' : 'text-jinbe-dim'
                  }`}>
                    Valores
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Valor enviado</span>
                    <span className={`text-sm font-mono font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {formatCurrency(operation.values.eur, 'EUR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Cotação</span>
                    <span className={`text-sm font-mono ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                      {operation.values.rate.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Taxa Jinbe (1.5%)</span>
                    <span className={`text-sm font-mono ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                      {formatCurrency(operation.values.taxaJinbe)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>IOF (0.38%)</span>
                    <span className={`text-sm font-mono ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                      {formatCurrency(operation.values.iof)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-jinbe-border flex justify-between">
                    <span className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-text'}`}>Total pago</span>
                    <span className="text-sm font-mono font-bold text-jinbe-primary">
                      {formatCurrency(operation.values.totalBrl)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions - T2-F: Completed */}
        {isCompleted && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/operations/${operation.id}/receipt`}
              className="flex-1 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Ver comprovante
            </Link>
            <button className={`flex-1 py-3 border rounded-xl transition-colors flex items-center justify-center gap-2 ${
              isLight
                ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'border-jinbe-border text-jinbe-muted hover:text-white hover:bg-jinbe-hover'
            }`}>
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
            <Link
              to="/operations/new"
              className={`flex-1 py-3 border rounded-xl transition-colors flex items-center justify-center gap-2 ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white hover:bg-jinbe-hover'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              Nova operação
            </Link>
          </div>
        )}

        {/* Awaiting PIX actions */}
        {isAwaitingPix && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyPix}
              className="flex-1 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedPix ? 'Copiado!' : 'Copiar chave PIX'}
            </button>
            <button
              onClick={() => navigate('/operations')}
              className={`flex-1 py-3 border rounded-xl transition-colors flex items-center justify-center gap-2 ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white hover:bg-jinbe-hover'
              }`}
            >
              Voltar às operações
            </button>
          </div>
        )}
      </div>
    </>
  )
}
