import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  Building2,
  Globe,
  ArrowUpDown,
  Plus,
  FileText,
  AlertTriangle,
  Clock,
  Info,
  QrCode,
  CheckCircle2,
} from 'lucide-react'

const bankAccounts = [
  { id: 'BA-001', name: 'Tech Import Brasil LTDA', cnpj: '12.345.678/0001-90', recent: true },
  { id: 'BA-002', name: 'Global Logistics S.A.', cnpj: '98.765.432/0001-11', recent: true },
  { id: 'BA-003', name: 'Importadora Silva', cnpj: '34.567.890/0001-12', recent: false },
]

const savedBeneficiaries = [
  { id: 'BN-001', name: 'Shenzhen Electronics Co.', country: 'China', swift: 'CHNASZXXXX' },
  { id: 'BN-002', name: 'Euro Parts Germany GmbH', country: 'Germany', swift: 'DEUTDEBBXXX' },
  { id: 'BN-003', name: 'Nordic Solutions AB', country: 'Sweden', swift: 'ESSESESSXXX' },
]

const RATE = 6.12
const SPREAD_PCT = 0.0025
const SWIFT_FEE = 10.0
const IOF_PCT = 0.0038

export default function NewOperation() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const dk = theme === 'dark'
  const [step, setStep] = useState(0)

  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('')
  const [accountSearch, setAccountSearch] = useState('')
  const [beneficiarySearch, setBeneficiarySearch] = useState('')
  const [amountBRL, setAmountBRL] = useState('10.000,00')
  const [feePayer, setFeePayer] = useState<'platform' | 'client'>('platform')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [countdown, setCountdown] = useState(292)
  useEffect(() => {
    if (step !== 1) return
    const interval = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(interval)
  }, [step])
  const countdownStr = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`

  const rawBRL = parseFloat(amountBRL.replace(/\./g, '').replace(',', '.')) || 0
  const spreadBRL = rawBRL * SPREAD_PCT
  const iofBRL = rawBRL * IOF_PCT
  const totalDeductions = spreadBRL + SWIFT_FEE + iofBRL
  const netBRL = feePayer === 'platform' ? rawBRL : rawBRL - totalDeductions
  const amountEUR = netBRL > 0 ? (netBRL / RATE) : 0

  const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtEUR = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const account = bankAccounts.find((a) => a.id === selectedAccount)
  const beneficiary = savedBeneficiaries.find((b) => b.id === selectedBeneficiary)

  const filteredAccounts = bankAccounts.filter((a) =>
    accountSearch === '' || a.name.toLowerCase().includes(accountSearch.toLowerCase()) || a.cnpj.includes(accountSearch)
  )
  const filteredBeneficiaries = savedBeneficiaries.filter((b) =>
    beneficiarySearch === '' || b.name.toLowerCase().includes(beneficiarySearch.toLowerCase()) || b.swift.toLowerCase().includes(beneficiarySearch.toLowerCase())
  )

  const canProceed = () => {
    if (step === 0) return !!selectedAccount && !!selectedBeneficiary
    if (step === 1) return rawBRL > 0
    return true
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 1500)
  }

  const stepLabels = [{ num: 1, label: 'Seleção' }, { num: 2, label: 'Valores' }, { num: 3, label: 'Revisão' }]
  const progressPct = ((step + 1) / 3) * 100

  const pageBg = dk ? 'bg-jinbe-bg' : 'bg-[#f8fafc]'
  const cardBg = dk ? 'bg-jinbe-card border-jinbe-border' : 'bg-white border-slate-200'
  const cardBgRound = `rounded-xl sm:rounded-2xl border ${cardBg}`
  const textPrimary = dk ? 'text-white' : 'text-slate-900'
  const textSecondary = dk ? 'text-jinbe-muted' : 'text-slate-500'
  const textDim = dk ? 'text-jinbe-dim' : 'text-slate-400'
  const inputCls = dk
    ? 'bg-jinbe-bg border-jinbe-border text-white placeholder:text-jinbe-dim focus:border-jinbe-primary'
    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-jinbe-primary'
  const headerBg = dk ? 'bg-jinbe-bg border-jinbe-border' : 'bg-white border-slate-200'
  const barBg = dk ? 'bg-jinbe-border' : 'bg-slate-100'
  const stepInactive = dk ? 'bg-jinbe-border text-jinbe-dim' : 'bg-slate-100 text-slate-400'
  const cardSelNormal = dk ? 'border-jinbe-border bg-jinbe-card hover:border-jinbe-hover' : 'border-slate-200 bg-white hover:border-slate-300'
  const cardSelActive = 'border-jinbe-primary bg-jinbe-primary/[0.03]'
  const iconBg = dk ? 'bg-jinbe-border' : 'bg-slate-100'
  const iconColor = dk ? 'text-jinbe-muted' : 'text-slate-500'
  const toggleBg = dk ? 'bg-jinbe-border' : 'bg-slate-100'
  const toggleActive = dk ? 'bg-jinbe-sidebar text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm'
  const toggleInactive = dk ? 'text-jinbe-muted hover:text-white' : 'text-slate-500 hover:text-slate-700'
  const bottomBar = dk ? 'bg-jinbe-sidebar border-jinbe-border' : 'bg-white border-slate-200'
  const btnOutline = dk ? 'border-jinbe-border text-jinbe-muted hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'

  return (
    <>
      {/* Header */}
      <div className={`sticky top-0 z-20 border-b ${headerBg}`}>
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/operations" className={`${textDim} hover:${textPrimary} transition-colors`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className={`text-base sm:text-lg font-bold ${textPrimary}`}>Nova Operação</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {step === 1 && (
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg ${dk ? 'bg-jinbe-border' : 'bg-slate-100'}`}>
                <span className={`text-xs sm:text-sm font-semibold ${textPrimary}`}>BRL/EUR {RATE.toFixed(2)}</span>
                <span className="w-2 h-2 rounded-full bg-jinbe-success" />
              </div>
            )}
          </div>
        </div>

        {step < 2 && (
          <div className="px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4">
            {step === 0 && (
              <div className="mb-3 sm:mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs font-semibold text-jinbe-primary uppercase tracking-wider">PASSO 1 DE 3</span>
                  <span className="text-[10px] sm:text-xs font-semibold text-jinbe-primary">{Math.round(progressPct)}%</span>
                </div>
                <div className={`h-1 ${barBg} rounded-full overflow-hidden`}>
                  <div className="h-full bg-jinbe-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            )}
            <div className="flex items-center overflow-x-auto">
              {stepLabels.map((s, i) => {
                const isActive = i === step
                const isCompleted = i < step
                return (
                  <div key={s.num} className="flex items-center shrink-0">
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <div className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full text-xs sm:text-sm font-bold transition-all ${
                        isCompleted || isActive ? 'bg-jinbe-primary text-white' : stepInactive
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : s.num}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium ${isActive ? textPrimary : isCompleted ? textSecondary : textDim}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`w-8 sm:w-12 lg:flex-1 lg:mx-4 h-px mx-2 sm:mx-4 ${isCompleted ? 'bg-jinbe-primary' : dk ? 'bg-jinbe-border' : 'bg-slate-200'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* STEP 1 */}
      {step === 0 && !submitted && (
        <div className={`${pageBg} min-h-[calc(100vh-180px)]`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="mb-4 sm:mb-8">
              <h2 className={`text-lg sm:text-2xl font-bold ${textPrimary}`}>Selecionar Conta e Beneficiário</h2>
              <p className={`text-xs sm:text-sm ${textSecondary} mt-1`}>Identifique as partes da remessa.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Bank accounts */}
              <div>
                <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} mb-2 sm:mb-3`}>Minhas Contas Bancárias</h3>
                <div className="relative mb-3 sm:mb-4">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textDim}`} />
                  <input type="text" value={accountSearch} onChange={(e) => setAccountSearch(e.target.value)}
                    placeholder="Buscar por CNPJ ou Nome"
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-xl text-sm focus:outline-none ${inputCls}`} />
                </div>
                <div className="flex flex-col gap-2">
                  {filteredAccounts.map((a) => (
                    <button key={a.id} type="button" onClick={() => setSelectedAccount(a.id)}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border-2 text-left transition-all ${
                        selectedAccount === a.id ? cardSelActive : cardSelNormal
                      }`}>
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${iconBg}`}>
                        <Building2 className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-semibold ${textPrimary} truncate`}>{a.name}</p>
                        <p className={`text-[10px] sm:text-xs ${textDim}`}>{a.cnpj}</p>
                      </div>
                      {selectedAccount === a.id && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Beneficiaries */}
              <div>
                <h3 className={`text-xs sm:text-sm font-bold ${textPrimary} mb-2 sm:mb-3`}>Beneficiário</h3>
                <div className="relative mb-3 sm:mb-4">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textDim}`} />
                  <input type="text" value={beneficiarySearch} onChange={(e) => setBeneficiarySearch(e.target.value)}
                    placeholder="Buscar por Nome ou SWIFT"
                    className={`w-full pl-10 pr-4 py-2.5 sm:py-3 border rounded-xl text-sm focus:outline-none ${inputCls}`} />
                </div>
                <div className="flex flex-col gap-2">
                  {filteredBeneficiaries.map((b) => (
                    <button key={b.id} type="button" onClick={() => setSelectedBeneficiary(b.id)}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl border-2 text-left transition-all ${
                        selectedBeneficiary === b.id ? cardSelActive : cardSelNormal
                      }`}>
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${iconBg}`}>
                        <Globe className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs sm:text-sm font-semibold ${textPrimary} truncate`}>{b.name}</p>
                        <p className={`text-[10px] sm:text-xs ${textDim}`}>{b.country} • {b.swift}</p>
                      </div>
                      {selectedBeneficiary === b.id && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-primary shrink-0" />}
                    </button>
                  ))}
                  <Link to="/beneficiaries/new"
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed ${dk ? 'border-jinbe-border text-jinbe-dim' : 'border-slate-200 text-slate-400'} hover:border-jinbe-primary hover:text-jinbe-primary transition-colors`}>
                    <Plus className="w-4 h-4" /><span className="text-xs sm:text-sm font-medium">Novo</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={`sticky bottom-0 border-t px-4 sm:px-6 lg:px-8 py-3 sm:py-4 ${bottomBar}`}>
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button onClick={() => navigate('/operations')} className={`text-xs sm:text-sm font-semibold ${textSecondary}`}>Cancelar</button>
              <button onClick={() => setStep(1)} disabled={!canProceed()}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors">
                Próximo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 1 && !submitted && (
        <div className={`${pageBg} min-h-[calc(100vh-200px)]`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="mb-4 sm:mb-8">
              <h2 className={`text-lg sm:text-2xl font-bold ${textPrimary}`}>Valores e Conversão</h2>
              <p className={`text-xs sm:text-sm ${textSecondary} mt-1`}>Configure os valores da remessa.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="flex-1 flex flex-col gap-3 sm:gap-4">
                <div className={`${cardBgRound} p-4 sm:p-6`}>
                  <p className={`text-xs sm:text-sm font-semibold ${dk ? 'text-jinbe-muted' : 'text-slate-700'} mb-2 sm:mb-3`}>Você envia (BRL)</p>
                  <div className="relative">
                    <input type="text" value={amountBRL} onChange={(e) => setAmountBRL(e.target.value)}
                      className={`w-full text-xl sm:text-3xl font-bold bg-transparent border-none focus:outline-none py-2 pr-20 ${textPrimary}`}
                      placeholder="0,00" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className={`text-xs sm:text-sm ${textDim} font-medium`}>BRL</span>
                      <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-jinbe-success text-white text-[10px] sm:text-xs font-bold">R$</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center ${dk ? 'bg-jinbe-card border-jinbe-border' : 'bg-white border-slate-200'}`}>
                    <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4 text-jinbe-primary" />
                  </div>
                </div>

                <div className={`${cardBgRound} p-4 sm:p-6`}>
                  <p className={`text-xs sm:text-sm font-semibold ${dk ? 'text-jinbe-muted' : 'text-slate-700'} mb-2 sm:mb-3`}>Beneficiário recebe (EUR)</p>
                  <div className="relative">
                    <p className={`text-xl sm:text-3xl font-bold ${textPrimary} py-2`}>{fmtEUR(amountEUR)}</p>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className={`text-xs sm:text-sm ${textDim} font-medium`}>EUR</span>
                      <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-jinbe-primary text-white text-[10px] sm:text-xs font-bold">€</span>
                    </div>
                  </div>
                </div>

                <div className={`${cardBgRound} p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                  <div>
                    <p className={`text-xs sm:text-sm font-semibold ${textPrimary}`}>Quem paga as taxas?</p>
                    <p className={`text-[10px] sm:text-xs ${textDim} mt-0.5`}>Defina se as taxas serão descontadas.</p>
                  </div>
                  <div className={`flex items-center ${toggleBg} rounded-lg p-0.5`}>
                    <button onClick={() => setFeePayer('platform')}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-semibold transition-all ${feePayer === 'platform' ? toggleActive : toggleInactive}`}>Plataforma</button>
                    <button onClick={() => setFeePayer('client')}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-semibold transition-all ${feePayer === 'client' ? toggleActive : toggleInactive}`}>Cliente</button>
                  </div>
                </div>
              </div>

              {/* Detalhamento sidebar */}
              <div className="w-full lg:w-[280px]">
                <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white ${dk ? 'bg-jinbe-border/80' : 'bg-jinbe-sidebar'}`}>
                  <div className="flex items-center gap-2 mb-4 sm:mb-5">
                    <FileText className="w-4 h-4 text-jinbe-primary" />
                    <h3 className="text-sm sm:text-base font-bold">Detalhamento</h3>
                  </div>
                  <div className="flex flex-col gap-3 sm:gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-slate-400">Valor enviado</span>
                      <span className="text-xs sm:text-sm font-semibold text-white">R$ {fmtBRL(rawBRL)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-slate-400">Cotação (EUR)</span>
                      <span className="text-xs sm:text-sm font-semibold text-white">R$ {RATE.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-slate-400">Spread (0.25%)</span>
                      <span className="text-xs sm:text-sm font-semibold text-jinbe-danger">- R$ {fmtBRL(spreadBRL)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-slate-400">Taxa Swift</span>
                      <span className="text-xs sm:text-sm font-semibold text-jinbe-danger">- R$ {fmtBRL(SWIFT_FEE)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-slate-400">IOF (0.38%)</span>
                      <span className="text-xs sm:text-sm font-semibold text-jinbe-danger">- R$ {fmtBRL(iofBRL)}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-600/30 mt-4 sm:mt-5 pt-4 sm:pt-5">
                    <p className="text-[10px] sm:text-xs font-bold text-jinbe-primary uppercase tracking-wider mb-1">Total Convertido</p>
                    <span className="text-xl sm:text-2xl font-bold text-white">€ {fmtEUR(amountEUR)}</span>
                  </div>
                  <button onClick={() => setStep(2)} disabled={!canProceed()}
                    className="w-full flex items-center justify-center gap-2 mt-4 sm:mt-5 px-5 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-40 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors">
                    Revisar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-3 mt-4 sm:mt-6 p-3 sm:p-4 ${cardBgRound}`}>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-primary shrink-0" />
              <div>
                <p className={`text-xs sm:text-sm font-semibold ${textPrimary}`}>Cotação Garantida</p>
                <p className={`text-[10px] sm:text-xs ${textSecondary}`}>
                  Garantida por <span className="text-jinbe-primary font-semibold">{countdownStr}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 2 && !submitted && (
        <div className={`${pageBg} min-h-[calc(100vh-80px)]`}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4">
              <div>
                <h2 className={`text-lg sm:text-2xl font-bold ${textPrimary}`}>Revisar e Confirmar</h2>
                <p className={`text-xs sm:text-sm ${textSecondary} mt-1`}>Confira os detalhes antes de gerar o PIX.</p>
              </div>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 border border-jinbe-primary text-jinbe-primary text-[10px] sm:text-xs font-semibold rounded-full self-start">Etapa 3/3</span>
            </div>

            <div className={`h-1 sm:h-1.5 ${barBg} rounded-full overflow-hidden mb-4 sm:mb-8`}>
              <div className="h-full bg-jinbe-primary rounded-full w-full" />
            </div>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="flex-1 flex flex-col gap-4 sm:gap-5">
                <div className={`${cardBgRound} p-4 sm:p-6`}>
                  <div className="flex items-center gap-2 mb-4 sm:mb-5">
                    <FileText className="w-4 h-4 text-jinbe-primary" />
                    <h3 className={`text-sm sm:text-base font-bold ${textPrimary}`}>Resumo</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-jinbe-primary uppercase tracking-widest mb-1">Origem</p>
                      <p className={`text-sm sm:text-base font-bold ${textPrimary}`}>{account?.name || 'Importadora XYZ'}</p>
                      <p className={`text-[10px] sm:text-xs ${textDim}`}>CNPJ: {account?.cnpj || '12.345.678/0001-90'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-jinbe-primary uppercase tracking-widest mb-1">Destino</p>
                      <p className={`text-sm sm:text-base font-bold ${textPrimary}`}>{beneficiary?.name || 'Euro-Components'}</p>
                      <p className={`text-[10px] sm:text-xs ${textDim}`}>{beneficiary?.country || 'Alemanha'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-jinbe-primary uppercase tracking-widest mb-1">VET</p>
                      <p className="text-lg sm:text-2xl font-bold text-jinbe-primary">R$ {fmtBRL(rawBRL)}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold ${textDim} uppercase tracking-widest mb-1`}>Valor em Divisa</p>
                      <p className={`text-lg sm:text-2xl font-bold ${textPrimary}`}>€ {fmtEUR(amountEUR)}</p>
                    </div>
                  </div>

                  <div className={`border-t ${dk ? 'border-jinbe-border' : 'border-slate-100'} pt-3 sm:pt-4 flex flex-col gap-2 sm:gap-3`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm ${textSecondary}`}>Taxa (EUR/BRL)</span>
                      <span className={`text-xs sm:text-sm font-semibold ${textPrimary}`}>R$ {RATE.toFixed(4).replace('.', ',')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-jinbe-primary">IOF (0,38%)</span>
                      <span className={`text-xs sm:text-sm font-semibold ${textPrimary}`}>R$ {fmtBRL(iofBRL)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-jinbe-warning/5 border border-jinbe-warning/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-jinbe-warning">Verificação KYB</p>
                    <p className="text-[10px] sm:text-xs text-jinbe-warning/70 mt-1">Beneficiário em validação.</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[280px] flex flex-col gap-4 sm:gap-5">
                <div className={`${cardBgRound} p-4 sm:p-6 text-center`}>
                  <p className={`text-[10px] sm:text-xs ${textSecondary} leading-relaxed mb-4 sm:mb-5`}>Ao confirmar, você concorda com os Termos de Uso.</p>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-60 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors">
                    {submitting ? 'Processando...' : <><QrCode className="w-4 h-4" /> Gerar PIX</>}
                  </button>
                  <button onClick={() => setStep(1)} className={`w-full text-xs sm:text-sm ${textSecondary} mt-3 py-2 font-medium`}>Voltar</button>
                </div>

                <div className={`${cardBgRound} p-4 sm:p-6`}>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Info className="w-4 h-4 text-jinbe-primary" />
                    <h3 className={`text-xs sm:text-sm font-bold ${textPrimary}`}>Próximos Passos</h3>
                  </div>
                  <ol className="flex flex-col gap-2 sm:gap-3">
                    {['Gere o QR Code PIX.', 'Pague em até 15 min.', 'Euros enviados.'].map((text, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-jinbe-primary/10 text-jinbe-primary text-[8px] sm:text-[10px] font-bold shrink-0">{i + 1}</span>
                        <span className={`text-[10px] sm:text-xs ${dk ? 'text-jinbe-muted' : 'text-slate-600'}`}>{text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className={`mt-4 sm:mt-6 ${cardBgRound} p-6 sm:p-8 flex items-center justify-center`}>
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className={`w-28 h-28 sm:w-40 sm:h-40 rounded-xl border flex items-center justify-center ${dk ? 'bg-jinbe-bg border-jinbe-border' : 'bg-slate-50 border-slate-200'}`}>
                  <QrCode className={`w-14 h-14 sm:w-20 sm:h-20 ${dk ? 'text-jinbe-dim' : 'text-slate-300'}`} />
                </div>
                <p className={`text-[10px] sm:text-xs ${textDim}`}>QR Code após confirmação</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div className={`${pageBg} min-h-[calc(100vh-80px)] flex items-center justify-center p-4`}>
          <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-md text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-jinbe-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-jinbe-success" />
            </div>
            <div>
              <h2 className={`text-lg sm:text-xl font-bold ${textPrimary} mb-2`}>Operação Criada!</h2>
              <p className={`text-xs sm:text-sm ${textSecondary}`}>Efetue o pagamento do PIX para iniciar.</p>
            </div>
            <div className={`w-full p-4 sm:p-5 ${cardBgRound}`}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left">
                <div><p className={`text-[10px] ${textDim} uppercase`}>Operação</p><p className="text-xs sm:text-sm font-mono font-bold text-jinbe-primary mt-0.5">OP-2024-011</p></div>
                <div><p className={`text-[10px] ${textDim} uppercase`}>Status</p><p className="text-xs sm:text-sm font-semibold text-jinbe-warning mt-0.5">Aguardando PIX</p></div>
                <div><p className={`text-[10px] ${textDim} uppercase`}>Valor</p><p className={`text-xs sm:text-sm font-semibold ${textPrimary} mt-0.5`}>R$ {fmtBRL(rawBRL)}</p></div>
                <div><p className={`text-[10px] ${textDim} uppercase`}>Destino</p><p className={`text-xs sm:text-sm font-semibold ${textPrimary} mt-0.5`}>€ {fmtEUR(amountEUR)}</p></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Link to="/operations" className="px-5 py-2.5 sm:py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors text-center">Ver Operações</Link>
              <button onClick={() => { setSubmitted(false); setStep(0); setSelectedAccount(''); setSelectedBeneficiary(''); setAmountBRL('10.000,00'); setFeePayer('platform') }}
                className={`px-5 py-2.5 sm:py-3 border rounded-xl text-xs sm:text-sm font-medium ${btnOutline} text-center`}>Nova</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
