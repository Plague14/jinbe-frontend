import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import {
  ArrowLeft,
  ArrowDownLeft,
  Clock,
  Bell,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Building2,
  RefreshCw,
  FileText,
  Loader2,
  Share2,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// Mock data - seria carregado via API
const mockRecebimento = {
  id: 'REC-2026-0023',
  contraparte: {
    nome: 'Spliethoff Transport BV',
    pais: 'Holanda',
  },
  invoiceRef: 'INV-2026-0847',
  valorRecebido: 50760.00,
  moeda: 'USD',
  dataRecebimento: '2026-08-06T10:32:00Z',
  contaBradesco: {
    banco: 'Bradesco',
    agencia: '1234',
    conta: '56789-0',
  },
}

type FlowStep = 'cotacao' | 'processando' | 'concluido'

interface Cotacao {
  taxa: number
  timestamp: Date
  validadeSegundos: number
  tendencia: 'up' | 'down' | 'stable'
}

function formatCurrency(value: number, currency: string = 'BRL'): string {
  if (currency === 'BRL') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)
}

export default function ReceivableConversion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [step, setStep] = useState<FlowStep>('cotacao')
  const [cotacao, setCotacao] = useState<Cotacao>({
    taxa: 5.72,
    timestamp: new Date(),
    validadeSegundos: 300, // 5 minutos
    tendencia: 'up',
  })
  const [countdown, setCountdown] = useState(cotacao.validadeSegundos)
  const [showAlertModal, setShowAlertModal] = useState(false)

  const recebimento = mockRecebimento

  // Cálculos
  const valorBruto = recebimento.valorRecebido * cotacao.taxa
  const taxaJinbePercent = 1.5
  const iofPercent = 0.38
  const taxaJinbe = valorBruto * (taxaJinbePercent / 100)
  const iof = valorBruto * (iofPercent / 100)
  const valorLiquido = valorBruto - taxaJinbe - iof

  // Countdown timer
  useEffect(() => {
    if (step !== 'cotacao') return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Renovar cotação automaticamente
          setCotacao(prev => ({
            ...prev,
            taxa: prev.taxa + (Math.random() - 0.5) * 0.05,
            timestamp: new Date(),
            validadeSegundos: 300,
            tendencia: Math.random() > 0.5 ? 'up' : 'down',
          }))
          return 300
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [step])

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleConfirmar = async () => {
    setStep('processando')

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 3000))

    setStep('concluido')
  }

  const refreshCotacao = () => {
    setCotacao(prev => ({
      ...prev,
      taxa: prev.taxa + (Math.random() - 0.5) * 0.03,
      timestamp: new Date(),
      validadeSegundos: 300,
      tendencia: Math.random() > 0.5 ? 'up' : 'down',
    }))
    setCountdown(300)
  }

  // Tela de processamento
  if (step === 'processando') {
    return (
      <>
        <Header title="Processando Conversão" subtitle={recebimento.id} />

        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <div className={`w-full max-w-md p-8 rounded-2xl border text-center ${
            isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
          }`}>
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-jinbe-primary/10 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-jinbe-primary animate-spin" />
              </div>

              <h2 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Conversão em andamento
              </h2>
              <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                Estamos processando sua conversão. Isso leva apenas alguns instantes.
              </p>
            </div>

            {/* Progress steps */}
            <div className="space-y-4">
              {[
                { label: 'Confirmação recebida', done: true },
                { label: 'Conversão em andamento', done: false, active: true },
                { label: 'BRL a caminho', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    item.done
                      ? 'bg-jinbe-success'
                      : item.active
                        ? 'bg-jinbe-primary'
                        : isLight ? 'bg-slate-200' : 'bg-jinbe-border'
                  }`}>
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : item.active ? (
                      <Loader2 className="w-3 h-3 text-white animate-spin" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-jinbe-dim" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    item.done || item.active
                      ? isLight ? 'text-slate-900' : 'text-white'
                      : 'text-jinbe-dim'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className={`mt-8 text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
              Crédito na conta Bradesco em até 1 hora
            </p>
          </div>
        </div>
      </>
    )
  }

  // Tela de conclusão
  if (step === 'concluido') {
    return (
      <>
        <Header title="Conversão Concluída" subtitle={recebimento.id} />

        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <div className={`w-full max-w-md p-8 rounded-2xl border text-center ${
            isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
          }`}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-jinbe-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-jinbe-success" />
            </div>

            <h2 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              BRL creditado na conta Bradesco
            </h2>
            <p className={`text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
              A conversão foi concluída com sucesso.
            </p>

            <div className={`p-4 rounded-xl mb-6 ${
              isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
            }`}>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">Valor recebido</span>
                  <span className={`text-sm font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                    {formatCurrency(recebimento.valorRecebido, recebimento.moeda)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">Cotação aplicada</span>
                  <span className={`text-sm font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                    R$ {cotacao.taxa.toFixed(4)}
                  </span>
                </div>
                <div className={`flex justify-between pt-2 border-t ${
                  isLight ? 'border-slate-200' : 'border-jinbe-border'
                }`}>
                  <span className="text-sm font-semibold text-jinbe-success">Valor creditado</span>
                  <span className="text-sm font-mono font-bold text-jinbe-success">
                    {formatCurrency(valorLiquido)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(`/operations/${recebimento.id}/receipt`)}
                className="w-full px-4 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Ver Comprovante
              </button>
              <button
                onClick={() => {}}
                className={`w-full px-4 py-3 border text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isLight
                    ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
                }`}
              >
                <Share2 className="w-4 h-4" />
                Compartilhar com contador
              </button>
              <button
                onClick={() => navigate('/')}
                className="text-sm text-jinbe-dim hover:text-jinbe-primary transition-colors"
              >
                Voltar ao painel
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Tela principal - Cotação (T7-A)
  return (
    <>
      <Header title="Recebimento Disponível" subtitle="Confirme a conversão para BRL" />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-jinbe-muted hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar</span>
        </button>

        {/* Card de recebimento */}
        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          {/* Header verde */}
          <div className="bg-jinbe-success px-6 py-5">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownLeft className="w-6 h-6 text-white" />
              <span className="text-white/80 text-sm font-medium">Recebimento confirmado</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(recebimento.valorRecebido, recebimento.moeda)}
            </p>
            <p className="text-white/80 text-sm mt-1">
              de {recebimento.contraparte.nome}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Invoice associada */}
            <div className={`flex items-center justify-between p-3 rounded-lg ${
              isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
            }`}>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-jinbe-primary" />
                <div>
                  <p className="text-xs text-jinbe-dim">Invoice associada</p>
                  <p className={`text-sm font-mono font-medium ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {recebimento.invoiceRef}
                  </p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-jinbe-success" />
            </div>

            {/* Cotação atual */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-text'}`}>
                  Cotação USD/BRL
                </span>
                <button
                  onClick={refreshCotacao}
                  className="flex items-center gap-1 text-xs text-jinbe-primary hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  Atualizar
                </button>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold font-mono text-jinbe-primary">
                    R$ {cotacao.taxa.toFixed(4)}
                  </span>
                  {cotacao.tendencia === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-jinbe-success" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-jinbe-danger" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-jinbe-dim">Válida por</p>
                  <p className={`text-lg font-mono font-semibold ${
                    countdown < 60 ? 'text-jinbe-danger' : 'text-jinbe-warning'
                  }`}>
                    {formatCountdown(countdown)}
                  </p>
                </div>
              </div>
            </div>

            {/* Decomposição de valores */}
            <div className={`rounded-xl border overflow-hidden ${
              isLight ? 'border-slate-200' : 'border-jinbe-border'
            }`}>
              <table className="w-full text-sm">
                <tbody>
                  <tr className={isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}>
                    <td className="px-4 py-3 text-jinbe-dim">Valor bruto</td>
                    <td className={`px-4 py-3 text-right font-mono font-medium ${
                      isLight ? 'text-slate-900' : 'text-jinbe-text'
                    }`}>
                      {formatCurrency(valorBruto)}
                    </td>
                  </tr>
                  <tr className={isLight ? 'bg-white' : 'bg-jinbe-card'}>
                    <td className="px-4 py-3 text-jinbe-dim">
                      <span className="text-jinbe-danger">(-)</span> Taxa Jinbe ({taxaJinbePercent}%)
                    </td>
                    <td className={`px-4 py-3 text-right font-mono ${
                      isLight ? 'text-slate-600' : 'text-jinbe-muted'
                    }`}>
                      {formatCurrency(taxaJinbe)}
                    </td>
                  </tr>
                  <tr className={isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}>
                    <td className="px-4 py-3 text-jinbe-dim">
                      <span className="text-jinbe-danger">(-)</span> IOF ({iofPercent}%)
                    </td>
                    <td className={`px-4 py-3 text-right font-mono ${
                      isLight ? 'text-slate-600' : 'text-jinbe-muted'
                    }`}>
                      {formatCurrency(iof)}
                    </td>
                  </tr>
                  <tr className="bg-jinbe-success/10">
                    <td className="px-4 py-4 font-semibold text-jinbe-success">
                      Valor a receber
                    </td>
                    <td className="px-4 py-4 text-right font-mono font-bold text-lg text-jinbe-success">
                      {formatCurrency(valorLiquido)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Conta destino */}
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
            }`}>
              <Building2 className="w-5 h-5 text-jinbe-dim" />
              <div>
                <p className="text-xs text-jinbe-dim">Crédito na conta</p>
                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {recebimento.contaBradesco.banco} • Ag {recebimento.contaBradesco.agencia} • CC {recebimento.contaBradesco.conta}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={`px-6 py-4 border-t space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
          }`}>
            <button
              onClick={handleConfirmar}
              className="w-full px-6 py-3.5 bg-jinbe-success hover:bg-jinbe-success/90 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirmar conversão agora
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className={`flex-1 px-4 py-2.5 border text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isLight
                    ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
                }`}
              >
                <Clock className="w-4 h-4" />
                Aguardar melhor cotação
              </button>
              <button
                onClick={() => setShowAlertModal(true)}
                className={`flex-1 px-4 py-2.5 border text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isLight
                    ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
                }`}
              >
                <Bell className="w-4 h-4" />
                Criar alerta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Alerta (T3-A simplificado) */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAlertModal(false)} />
          <div className={`relative w-full max-w-sm p-6 rounded-2xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Configurar Alerta
            </h3>

            <p className={`text-sm mb-4 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
              Me avise quando USD/BRL atingir:
            </p>

            <div className="flex gap-2 mb-4">
              <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                isLight ? 'bg-slate-100 text-slate-700' : 'bg-jinbe-bg text-jinbe-muted'
              }`}>
                R$
              </span>
              <input
                type="text"
                defaultValue="5.80"
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-mono ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-900'
                    : 'border-jinbe-border bg-jinbe-bg text-white'
                } focus:outline-none focus:border-jinbe-primary`}
              />
            </div>

            <div className="space-y-2 mb-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                  Notificação push
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                  E-mail
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                  WhatsApp
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAlertModal(false)}
                className={`flex-1 px-4 py-2.5 border text-sm font-medium rounded-lg ${
                  isLight
                    ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'border-jinbe-border text-jinbe-muted hover:text-white'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowAlertModal(false)}
                className="flex-1 px-4 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg"
              >
                Criar alerta
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
