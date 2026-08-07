import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import {
  ArrowLeft,
  AlertTriangle,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// Mock data
const mockDivergencia = {
  id: 'REC-2026-0024',
  contraparte: {
    nome: 'Spliethoff Transport BV',
    pais: 'Holanda',
  },
  invoiceRef: 'INV-2026-0852',
  valorEsperado: 50000.00,
  valorRecebido: 48500.00,
  moeda: 'USD',
  diferenca: 1500.00,
  dataRecebimento: '2026-08-06T14:22:00Z',
}

function formatCurrency(value: number, currency: string = 'USD'): string {
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

export default function ReceivableDivergence() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [observacao, setObservacao] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const divergencia = mockDivergencia
  const percentDiferenca = ((divergencia.diferenca / divergencia.valorEsperado) * 100).toFixed(1)

  const handleConverterRecebido = async () => {
    setIsSubmitting(true)
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Redirecionar para a tela de cotação
    navigate(`/receivables/${divergencia.id}/convert`)
  }

  const handleAguardarComplemento = () => {
    // Salvar observação e marcar como aguardando
    navigate('/')
  }

  return (
    <>
      <Header title="Divergência de Valor" subtitle="Ação necessária" />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-jinbe-muted hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar</span>
        </button>

        {/* Card principal */}
        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          {/* Header de alerta */}
          <div className="bg-jinbe-warning px-6 py-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6 text-white" />
              <span className="text-white font-semibold">Atenção — Valor recebido diferente da invoice</span>
            </div>
            <p className="text-white/80 text-sm">
              O pagamento recebido de {divergencia.contraparte.nome} não corresponde ao valor esperado.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Comparativo de valores */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl text-center ${
                isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
              }`}>
                <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Invoice</p>
                <p className={`text-lg font-mono font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  {formatCurrency(divergencia.valorEsperado, divergencia.moeda)}
                </p>
              </div>

              <div className={`p-4 rounded-xl text-center ${
                isLight ? 'bg-jinbe-success/5' : 'bg-jinbe-success/10'
              }`}>
                <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Recebido</p>
                <p className="text-lg font-mono font-bold text-jinbe-success">
                  {formatCurrency(divergencia.valorRecebido, divergencia.moeda)}
                </p>
              </div>

              <div className={`p-4 rounded-xl text-center ${
                isLight ? 'bg-jinbe-danger/5' : 'bg-jinbe-danger/10'
              }`}>
                <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Diferença</p>
                <p className="text-lg font-mono font-bold text-jinbe-danger">
                  -{formatCurrency(divergencia.diferenca, divergencia.moeda)}
                </p>
                <p className="text-xs text-jinbe-danger mt-0.5">
                  -{percentDiferenca}%
                </p>
              </div>
            </div>

            {/* Detalhes */}
            <div className={`p-4 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}`}>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-jinbe-dim" />
                  <div>
                    <p className="text-xs text-jinbe-dim">Invoice</p>
                    <p className={`text-sm font-mono font-medium ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {divergencia.invoiceRef}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ArrowDownLeft className="w-4 h-4 text-jinbe-dim" />
                  <div>
                    <p className="text-xs text-jinbe-dim">Pagador</p>
                    <p className={`text-sm font-medium ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {divergencia.contraparte.nome} ({divergencia.contraparte.pais})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-jinbe-dim" />
                  <div>
                    <p className="text-xs text-jinbe-dim">Recebido em</p>
                    <p className={`text-sm ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                      {new Date(divergencia.dataRecebimento).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campo de observação */}
            <div>
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                isLight ? 'text-slate-700' : 'text-jinbe-text'
              }`}>
                <MessageSquare className="w-4 h-4 text-jinbe-primary" />
                Observação
                <span className="text-jinbe-dim font-normal">(opcional)</span>
              </label>
              <textarea
                placeholder="Registre o motivo da divergência para referência futura..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border text-sm resize-none transition-colors ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-900 focus:border-jinbe-primary'
                    : 'border-jinbe-border bg-jinbe-bg text-white focus:border-jinbe-primary'
                } focus:outline-none placeholder:text-jinbe-dim`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className={`px-6 py-4 border-t space-y-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
          }`}>
            <p className={`text-sm font-medium mb-3 ${isLight ? 'text-slate-700' : 'text-jinbe-text'}`}>
              O que você deseja fazer?
            </p>

            <button
              onClick={handleConverterRecebido}
              disabled={isSubmitting}
              className="w-full px-6 py-3.5 bg-jinbe-success hover:bg-jinbe-success/90 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              Converter o valor recebido ({formatCurrency(divergencia.valorRecebido, divergencia.moeda)})
            </button>

            <button
              onClick={handleAguardarComplemento}
              className={`w-full px-6 py-3 border text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
              }`}
            >
              <Clock className="w-5 h-5" />
              Aguardar complemento ({formatCurrency(divergencia.diferenca, divergencia.moeda)} faltantes)
            </button>

            <p className={`text-xs text-center ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
              Se escolher aguardar, você será notificado quando um novo pagamento for identificado.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
