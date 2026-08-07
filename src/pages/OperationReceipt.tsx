import { useParams, useNavigate, Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  CheckCircle2,
  Clock,
  FileText,
  Building2,
  Globe,
  Receipt,
  Shield,
  ExternalLink,
  Printer,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useState } from 'react'

// Mock data - será substituído por dados reais da API
const mockOperation = {
  id: 'JNB-2026-0019',
  type: 'recebimento' as const,
  status: 'liquidado' as const,

  // Timestamps
  timestamps: {
    solicitado: '2026-08-02T13:49:00Z',
    pix_recebido: '2026-08-02T13:52:00Z',
    conversao: '2026-08-02T14:28:00Z',
    liquidado: '2026-08-02T14:32:00Z',
  },
  tempoTotalMinutos: 43,

  // Partes
  cliente: {
    razaoSocial: 'Triunfo Agenciamentos Marítimos Ltda',
    cnpj: '12.345.678/0001-90',
  },
  contraparte: {
    nome: 'Spliethoff Transport BV',
    pais: 'Holanda',
    codigoPais: 'NL',
  },
  invoiceRef: 'INV-2026-0847',

  // Valores
  moeda: 'USD',
  valorMoedaEstrangeira: 50760.00,
  cotacao: 5.72,
  valorBrutoBRL: 290347.20,
  taxaJinbe: 4355.21,
  taxaJinbePercent: 1.5,
  iof: 1103.32,
  iofPercent: 0.38,
  valorLiquidoBRL: 284888.67,

  // Rastreabilidade
  hashBlockchain: '0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
  instituicao: 'Urban Exchange',
  instituicaoDetalhe: 'PSAV autorizado pelo Banco Central do Brasil',
}

const statusConfig = {
  liquidado: { label: 'Liquidado', className: 'bg-jinbe-success/10 text-jinbe-success', icon: CheckCircle2 },
  processando: { label: 'Processando', className: 'bg-jinbe-primary/10 text-jinbe-primary', icon: Clock },
  pendente: { label: 'Pendente', className: 'bg-jinbe-warning/10 text-jinbe-warning', icon: Clock },
}

const typeConfig = {
  recebimento: { label: 'Recebimento', color: 'text-jinbe-success' },
  envio: { label: 'Envio', color: 'text-jinbe-primary' },
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

function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function OperationReceipt() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const [copied, setCopied] = useState<string | null>(null)

  // Em produção, buscar operação pela API usando o id
  const operation = mockOperation

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const shareData = {
      title: `Comprovante ${operation.id}`,
      text: `Comprovante de operação cambial - ${operation.id}\nValor: ${formatCurrency(operation.valorLiquidoBRL)}\nStatus: ${statusConfig[operation.status].label}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy link
      handleCopy(window.location.href, 'link')
    }
  }

  const StatusIcon = statusConfig[operation.status].icon

  return (
    <>
      <Header title="Comprovante de Operação" subtitle={operation.id} />

      <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-jinbe-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar ao histórico</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 border border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover rounded-lg text-sm font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 border border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover rounded-lg text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>

        {/* Receipt Card */}
        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        } print:border-slate-300 print:shadow-none`}>

          {/* Header com branding */}
          <div className="bg-jinbe-primary px-6 py-5 print:py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white print:text-lg">JINBE PAGAMENTOS</h1>
                <p className="text-jinbe-primary-light text-sm mt-0.5">Comprovante de Operação Cambial</p>
              </div>
              <div className="text-right">
                <p className="text-white font-mono font-semibold">{operation.id}</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 rounded-full text-xs font-semibold ${statusConfig[operation.status].className}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig[operation.status].label}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6 print:gap-4 print:p-4">
            {/* Seção 1 - Identificação */}
            <section>
              <div className="flex items-center gap-2 mb-4 print:mb-3">
                <Receipt className="w-5 h-5 text-jinbe-primary print:w-4 print:h-4" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${
                  isLight ? 'text-slate-700' : 'text-jinbe-text'
                }`}>Operação</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:gap-3">
                <div>
                  <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">ID</p>
                  <p className={`text-sm font-mono font-semibold ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                    {operation.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Tipo</p>
                  <p className={`text-sm font-semibold ${typeConfig[operation.type].color}`}>
                    {typeConfig[operation.type].label}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Data/Hora</p>
                  <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                    {formatDateTime(operation.timestamps.liquidado)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Tempo Total</p>
                  <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                    {operation.tempoTotalMinutos} minutos
                  </p>
                </div>
              </div>

              {/* Timeline compacta */}
              <div className={`mt-4 p-3 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-jinbe-bg'} print:bg-slate-50`}>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-jinbe-success" />
                    <span className="text-jinbe-dim">Solicitado:</span>
                    <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                      {formatTime(operation.timestamps.solicitado)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-jinbe-success" />
                    <span className="text-jinbe-dim">Conversão:</span>
                    <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                      {formatTime(operation.timestamps.conversao)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-jinbe-success" />
                    <span className="text-jinbe-dim">Liquidado:</span>
                    <span className={`font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                      {formatTime(operation.timestamps.liquidado)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <hr className={isLight ? 'border-slate-200' : 'border-jinbe-border'} />

            {/* Seção 2 - Partes Envolvidas */}
            <section>
              <div className="flex items-center gap-2 mb-4 print:mb-3">
                <Building2 className="w-5 h-5 text-jinbe-primary print:w-4 print:h-4" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${
                  isLight ? 'text-slate-700' : 'text-jinbe-text'
                }`}>Partes Envolvidas</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 print:gap-4">
                <div>
                  <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-2">Cliente</p>
                  <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                    {operation.cliente.razaoSocial}
                  </p>
                  <p className={`text-sm font-mono mt-1 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                    CNPJ: {operation.cliente.cnpj}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-2">Contraparte</p>
                  <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                    {operation.contraparte.nome}
                  </p>
                  <p className={`text-sm mt-1 flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                    <Globe className="w-3.5 h-3.5" />
                    {operation.contraparte.pais}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-2">Referência da Invoice</p>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-mono font-semibold ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                    {operation.invoiceRef}
                  </p>
                  <button
                    onClick={() => handleCopy(operation.invoiceRef, 'invoice')}
                    className="p-1 rounded text-jinbe-dim hover:text-jinbe-primary transition-colors print:hidden"
                  >
                    {copied === 'invoice' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-jinbe-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </section>

            <hr className={isLight ? 'border-slate-200' : 'border-jinbe-border'} />

            {/* Seção 3 - Valores */}
            <section>
              <div className="flex items-center gap-2 mb-4 print:mb-3">
                <FileText className="w-5 h-5 text-jinbe-primary print:w-4 print:h-4" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${
                  isLight ? 'text-slate-700' : 'text-jinbe-text'
                }`}>Valores da Operação</h2>
              </div>

              <div className={`rounded-xl border overflow-hidden ${
                isLight ? 'border-slate-200' : 'border-jinbe-border'
              }`}>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className={isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}>
                      <td className="px-4 py-3 text-jinbe-dim">Valor Original</td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                        {formatCurrency(operation.valorMoedaEstrangeira, operation.moeda)}
                      </td>
                    </tr>
                    <tr className={isLight ? 'bg-white' : 'bg-jinbe-card'}>
                      <td className="px-4 py-3 text-jinbe-dim">Cotação Aplicada</td>
                      <td className={`px-4 py-3 text-right font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                        R$ {operation.cotacao.toFixed(4)} por {operation.moeda}
                      </td>
                    </tr>
                    <tr className={isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}>
                      <td className="px-4 py-3 text-jinbe-dim">Valor Bruto</td>
                      <td className={`px-4 py-3 text-right font-mono font-medium ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                        {formatCurrency(operation.valorBrutoBRL)}
                      </td>
                    </tr>
                    <tr className={isLight ? 'bg-white' : 'bg-jinbe-card'}>
                      <td className="px-4 py-3 text-jinbe-dim">
                        <span className="text-jinbe-danger">(-)</span> Taxa Jinbe ({operation.taxaJinbePercent}%)
                      </td>
                      <td className={`px-4 py-3 text-right font-mono ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                        {formatCurrency(operation.taxaJinbe)}
                      </td>
                    </tr>
                    <tr className={isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}>
                      <td className="px-4 py-3 text-jinbe-dim">
                        <span className="text-jinbe-danger">(-)</span> IOF ({operation.iofPercent}%)
                      </td>
                      <td className={`px-4 py-3 text-right font-mono ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                        {formatCurrency(operation.iof)}
                      </td>
                    </tr>
                    <tr className="bg-jinbe-success/10">
                      <td className="px-4 py-4 font-semibold text-jinbe-success">
                        Valor Líquido Creditado
                      </td>
                      <td className="px-4 py-4 text-right font-mono font-bold text-lg text-jinbe-success">
                        {formatCurrency(operation.valorLiquidoBRL)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <hr className={isLight ? 'border-slate-200' : 'border-jinbe-border'} />

            {/* Seção 4 - Rastreabilidade */}
            <section>
              <div className="flex items-center gap-2 mb-4 print:mb-3">
                <Shield className="w-5 h-5 text-jinbe-primary print:w-4 print:h-4" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${
                  isLight ? 'text-slate-700' : 'text-jinbe-text'
                }`}>Comprovação</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-2">Hash da Transação Blockchain</p>
                  <div className="flex items-center gap-2">
                    <code className={`text-xs font-mono break-all ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                      {operation.hashBlockchain}
                    </code>
                    <button
                      onClick={() => handleCopy(operation.hashBlockchain, 'hash')}
                      className="p-1 rounded text-jinbe-dim hover:text-jinbe-primary transition-colors shrink-0 print:hidden"
                    >
                      {copied === 'hash' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-jinbe-success" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-2">Instituição Cambial</p>
                  <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-jinbe-text'}`}>
                    {operation.instituicao}
                  </p>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                    {operation.instituicaoDetalhe}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 text-center text-xs border-t ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-jinbe-bg border-jinbe-border text-jinbe-dim'
          } print:bg-slate-50 print:border-slate-300`}>
            <p>
              Gerado em {new Date().toLocaleString('pt-BR')} | Comprovante ID: COMP-{operation.id.replace('JNB-', '')}
            </p>
            <p className="mt-1">
              Jinbe Pagamentos Ltda - CNPJ: 00.000.000/0001-00
            </p>
          </div>
        </div>

        {/* Actions mobile */}
        <div className="flex flex-col sm:hidden gap-2 print:hidden">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar Comprovante
          </button>
          <Link
            to="/operations"
            className="flex items-center justify-center gap-2 px-4 py-3 border border-jinbe-border text-jinbe-muted hover:text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Histórico
          </Link>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </>
  )
}
