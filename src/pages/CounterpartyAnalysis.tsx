import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import {
  ArrowLeft,
  Building2,
  Globe,
  TrendingUp,
  DollarSign,
  Hash,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Download,
  ChevronRight,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// Mock data - seria carregado via API
const mockContraparte = {
  id: 'CP-001',
  nome: 'Spliethoff Transport BV',
  pais: 'Holanda',
  codigoPais: 'NL',
  banco: 'ING Bank',
  iban: 'NL91ABNA0417164300',
  swift: 'INGBNL2A',
  moeda: 'USD',
  status: 'approved' as const,
  dataCadastro: '2026-01-15',

  // Métricas agregadas
  metricas: {
    volumeTotal: 302450.00,
    numeroOperacoes: 12,
    cotacaoMedia: 5.68,
    custoTotal: 8562.34,
    valorLiquidoTotal: 1709876.54,
  },

  // Histórico de operações
  operacoes: [
    { id: 'JNB-2026-0019', data: '2026-08-02', tipo: 'recebimento', valor: 50760.00, cotacao: 5.72, liquido: 284888.67, status: 'liquidado' },
    { id: 'JNB-2026-0015', data: '2026-07-22', tipo: 'recebimento', valor: 45300.00, cotacao: 5.75, liquido: 255234.50, status: 'liquidado' },
    { id: 'JNB-2026-0012', data: '2026-07-05', tipo: 'recebimento', valor: 38200.00, cotacao: 5.68, liquido: 212456.32, status: 'liquidado' },
    { id: 'JNB-2026-0008', data: '2026-06-18', tipo: 'recebimento', valor: 52100.00, cotacao: 5.65, liquido: 288123.45, status: 'liquidado' },
    { id: 'JNB-2026-0005', data: '2026-06-02', tipo: 'recebimento', valor: 41500.00, cotacao: 5.70, liquido: 231654.78, status: 'liquidado' },
    { id: 'JNB-2026-0003', data: '2026-05-15', tipo: 'recebimento', valor: 35800.00, cotacao: 5.62, liquido: 196543.21, status: 'liquidado' },
  ],

  // Volume mensal (últimos 6 meses)
  volumeMensal: [
    { mes: 'Mar', valor: 28500 },
    { mes: 'Abr', valor: 42300 },
    { mes: 'Mai', valor: 35800 },
    { mes: 'Jun', valor: 93600 },
    { mes: 'Jul', valor: 83500 },
    { mes: 'Ago', valor: 50760 },
  ],
}

const statusConfig = {
  approved: { label: 'Aprovado', className: 'bg-jinbe-success/10 text-jinbe-success' },
  pending: { label: 'Em análise', className: 'bg-jinbe-warning/10 text-jinbe-warning' },
  expired: { label: 'Expirado', className: 'bg-jinbe-danger/10 text-jinbe-danger' },
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}

export default function CounterpartyAnalysis() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const contraparte = mockContraparte
  const maxVolume = Math.max(...contraparte.volumeMensal.map(v => v.valor))

  return (
    <>
      <Header title="Análise de Contraparte" subtitle={contraparte.nome} />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-jinbe-muted hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar</span>
        </button>

        {/* Header Card */}
        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  isLight ? 'bg-slate-100' : 'bg-jinbe-bg'
                }`}>
                  <Building2 className="w-7 h-7 text-jinbe-primary" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {contraparte.nome}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe className="w-4 h-4 text-jinbe-dim" />
                    <span className={`text-sm ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                      {contraparte.pais}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusConfig[contraparte.status].className
                    }`}>
                      {statusConfig[contraparte.status].label}
                    </span>
                  </div>
                </div>
              </div>

              <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
              }`}>
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>

            {/* Dados bancários */}
            <div className={`mt-6 p-4 rounded-xl grid sm:grid-cols-3 gap-4 ${
              isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
            }`}>
              <div>
                <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Banco</p>
                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {contraparte.banco}
                </p>
              </div>
              <div>
                <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">IBAN</p>
                <p className={`text-sm font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                  {contraparte.iban}
                </p>
              </div>
              <div>
                <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">SWIFT</p>
                <p className={`text-sm font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                  {contraparte.swift}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Volume Total', value: formatCurrency(contraparte.metricas.volumeTotal, 'USD'), icon: DollarSign, color: 'text-jinbe-primary' },
            { label: 'Operações', value: contraparte.metricas.numeroOperacoes.toString(), icon: Hash, color: 'text-jinbe-success' },
            { label: 'Cotação Média', value: `R$ ${contraparte.metricas.cotacaoMedia.toFixed(2)}`, icon: TrendingUp, color: 'text-jinbe-warning' },
            { label: 'Custos Totais', value: formatCurrency(contraparte.metricas.custoTotal), icon: ArrowUpRight, color: 'text-jinbe-danger' },
            { label: 'Valor Líquido', value: formatCurrency(contraparte.metricas.valorLiquidoTotal), icon: ArrowDownLeft, color: 'text-jinbe-success' },
          ].map((kpi, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                <span className="text-xs text-jinbe-dim uppercase tracking-wider">{kpi.label}</span>
              </div>
              <p className={`text-lg font-bold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Gráfico de Volume Mensal */}
          <div className={`rounded-2xl border p-6 ${
            isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
          }`}>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-jinbe-primary" />
              <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Volume Mensal
              </h3>
            </div>

            <div className="space-y-3">
              {contraparte.volumeMensal.map((item, i) => {
                const percent = (item.valor / maxVolume) * 100
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`w-8 text-xs font-medium ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                      {item.mes}
                    </span>
                    <div className="flex-1 h-6 rounded-full overflow-hidden bg-jinbe-primary/10">
                      <div
                        className="h-full bg-jinbe-primary rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className={`w-24 text-right text-xs font-mono font-medium ${
                      isLight ? 'text-slate-700' : 'text-jinbe-muted'
                    }`}>
                      {formatCurrency(item.valor, 'USD')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Histórico de Operações */}
          <div className={`rounded-2xl border overflow-hidden ${
            isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
          }`}>
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-jinbe-primary" />
                  <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Histórico de Operações
                  </h3>
                </div>
                <Link
                  to={`/operations?contraparte=${id}`}
                  className="text-xs text-jinbe-primary hover:underline flex items-center gap-1"
                >
                  Ver todas
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-jinbe-dim uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-jinbe-dim uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-jinbe-dim uppercase tracking-wider">
                      Valor USD
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-jinbe-dim uppercase tracking-wider">
                      Cotação
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-jinbe-dim uppercase tracking-wider">
                      Líquido BRL
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-jinbe-border">
                  {contraparte.operacoes.map((op, i) => (
                    <tr
                      key={op.id}
                      className={`hover:${isLight ? 'bg-slate-50' : 'bg-jinbe-bg'} cursor-pointer transition-colors`}
                      onClick={() => navigate(`/operations/${op.id}/receipt`)}
                    >
                      <td className={`px-6 py-3 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                        {formatDate(op.data)}
                      </td>
                      <td className="px-6 py-3">
                        <span className="font-mono text-jinbe-primary">{op.id}</span>
                      </td>
                      <td className={`px-6 py-3 text-right font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formatCurrency(op.valor, 'USD')}
                      </td>
                      <td className={`px-6 py-3 text-right font-mono ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                        {op.cotacao.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-right font-mono font-medium text-jinbe-success">
                        {formatCurrency(op.liquido)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}>
                    <td colSpan={2} className={`px-6 py-3 text-xs font-semibold uppercase ${
                      isLight ? 'text-slate-700' : 'text-jinbe-text'
                    }`}>
                      Total ({contraparte.operacoes.length} operações)
                    </td>
                    <td className={`px-6 py-3 text-right font-mono font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      {formatCurrency(contraparte.metricas.volumeTotal, 'USD')}
                    </td>
                    <td className={`px-6 py-3 text-right font-mono ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                      {contraparte.metricas.cotacaoMedia.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-jinbe-success">
                      {formatCurrency(contraparte.metricas.valorLiquidoTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
