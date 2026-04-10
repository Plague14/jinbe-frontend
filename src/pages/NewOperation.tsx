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

/* ─── Mock data ─── */

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

/* ─── Component ─── */

export default function NewOperation() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const dk = theme === 'dark'
  const [step, setStep] = useState(0)

  // Step 1 state
  const [selectedAccount, setSelectedAccount] = useState('')
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('')
  const [accountSearch, setAccountSearch] = useState('')
  const [beneficiarySearch, setBeneficiarySearch] = useState('')

  // Step 2 state
  const [amountBRL, setAmountBRL] = useState('10.000,00')
  const [feePayer, setFeePayer] = useState<'platform' | 'client'>('platform')

  // Step 3 state
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Rate countdown
  const [countdown, setCountdown] = useState(292)
  useEffect(() => {
    if (step !== 1) return
    const interval = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(interval)
  }, [step])
  const countdownStr = `${String(Math.floor(countdown / 60)).padStart(2, '0')}:${String(countdown % 60).padStart(2, '0')}`

  // Calculations
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

  // ─── Theme helpers ───
  const pageBg = dk ? 'bg-jinbe-bg' : 'bg-[#f8fafc]'
  const cardBg = dk ? 'bg-jinbe-card border-jinbe-border' : 'bg-white border-slate-200'
  const cardBgRound = `rounded-2xl border ${cardBg}`
  const textPrimary = dk ? 'text-white' : 'text-slate-900'
  const textSecondary = dk ? 'text-jinbe-muted' : 'text-slate-500'
  const textDim = dk ? 'text-jinbe-dim' : 'text-slate-400'
  const inputCls = dk
    ? 'bg-jinbe-bg border-jinbe-border text-white placeholder:text-jinbe-dim focus:border-jinbe-primary'
    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-jinbe-primary focus:ring-1 focus:ring-jinbe-primary/20'
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
      {/* ─── Header ─── */}
      <div className={`sticky top-0 z-20 border-b ${headerBg}`}>
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <Link to="/operations" className={`${textDim} hover:${textPrimary} transition-colors`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className={`text-lg font-bold ${textPrimary}`}>Nova Operação</h1>
            {step === 2 && (
              <div className={`flex items-center gap-1.5 text-xs ${textDim} ml-2`}>
                <span>Operações</span><span>›</span><span>Nova Operação</span><span>›</span>
                <span className="text-jinbe-primary font-medium">Revisão</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {step === 1 && (
              <>
                <button className="text-sm text-jinbe-primary font-medium hover:underline">Wizard</button>
                <button className={`text-sm ${textDim} hover:${textSecondary}`}>Histórico</button>
                <div className={`flex items-center gap-2 ml-4 pl-4 border-l ${dk ? 'border-jinbe-border' : 'border-slate-200'}`}>
                  <span className={`text-sm font-semibold ${textPrimary}`}>BRL/EUR {RATE.toFixed(2)}</span>
                  <span className="w-2 h-2 rounded-full bg-jinbe-success" />
                </div>
              </>
            )}
            {step === 2 && (
              <button className={`px-4 py-2 border rounded-lg text-sm font-medium ${btnOutline}`}>Suporte</button>
            )}
          </div>
        </div>

        {step < 2 && (
          <div className="px-8 pb-4">
            {step === 0 && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-jinbe-primary uppercase tracking-wider">PASSO 1 DE 3</span>
                  <span className="text-xs font-semibold text-jinbe-primary">{Math.round(progressPct)}% Concluído</span>
                </div>
                <div className={`h-1 ${barBg} rounded-full overflow-hidden mb-4`}>
                  <div className="h-full bg-jinbe-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                </div>
              </>
            )}
            <div className="flex items-center">
              {stepLabels.map((s, i) => {
                const isActive = i === step
                const isCompleted = i < step
                return (
                  <div key={s.num} className="flex items-center flex-1">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all ${
                        isCompleted || isActive ? 'bg-jinbe-primary text-white' : stepInactive
                      }`}>
                        {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                      </div>
                      <span className={`text-sm font-medium ${isActive ? textPrimary : isCompleted ? textSecondary : textDim}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className={`flex-1 h-px mx-6 ${isCompleted ? 'bg-jinbe-primary' : dk ? 'bg-jinbe-border' : 'bg-slate-200'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ═══════ STEP 1: Seleção ═══════ */}
      {step === 0 && !submitted && (
        <div className={`${pageBg} min-h-[calc(100vh-180px)]`}>
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="mb-8">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Selecionar Conta Bancária e Beneficiário</h2>
              <p className={`text-sm ${textSecondary} mt-1`}>Identifique as partes responsáveis pela remessa internacional.</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Bank accounts */}
              <div>
                <h3 className={`text-sm font-bold ${textPrimary} mb-3`}>Minhas Contas Bancárias</h3>
                <div className="relative mb-4">
                  <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${textDim}`} />
                  <input type="text" value={accountSearch} onChange={(e) => setAccountSearch(e.target.value)}
                    placeholder="Buscar por CNPJ ou Nome Fantasia"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none ${inputCls}`} />
                </div>
                <p className={`text-[10px] font-bold ${textDim} uppercase tracking-widest mb-2`}>Selecionados Recentemente</p>
                <div className="flex flex-col gap-2">
                  {filteredAccounts.map((a) => (
                    <button key={a.id} type="button" onClick={() => setSelectedAccount(a.id)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                        selectedAccount === a.id ? cardSelActive : cardSelNormal
                      }`}>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBg}`}>
                        <Building2 className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${textPrimary}`}>{a.name}</p>
                        <p className={`text-xs ${textDim}`}>{a.cnpj}</p>
                      </div>
                      {selectedAccount === a.id && <CheckCircle2 className="w-5 h-5 text-jinbe-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Beneficiaries */}
              <div>
                <h3 className={`text-sm font-bold ${textPrimary} mb-3`}>Beneficiário (Fornecedor Estrangeiro)</h3>
                <div className="relative mb-4">
                  <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${textDim}`} />
                  <input type="text" value={beneficiarySearch} onChange={(e) => setBeneficiarySearch(e.target.value)}
                    placeholder="Buscar por Nome ou SWIFT/BIC"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none ${inputCls}`} />
                </div>
                <p className={`text-[10px] font-bold ${textDim} uppercase tracking-widest mb-2`}>Contatos Salvos</p>
                <div className="flex flex-col gap-2">
                  {filteredBeneficiaries.map((b) => (
                    <button key={b.id} type="button" onClick={() => setSelectedBeneficiary(b.id)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                        selectedBeneficiary === b.id ? cardSelActive : cardSelNormal
                      }`}>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconBg}`}>
                        <Globe className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${textPrimary}`}>{b.name}</p>
                        <p className={`text-xs ${textDim}`}>{b.country} • Swift: {b.swift}</p>
                      </div>
                      {selectedBeneficiary === b.id && <CheckCircle2 className="w-5 h-5 text-jinbe-primary" />}
                    </button>
                  ))}
                  <Link to="/beneficiaries/new"
                    className={`flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-dashed ${dk ? 'border-jinbe-border text-jinbe-dim' : 'border-slate-200 text-slate-400'} hover:border-jinbe-primary hover:text-jinbe-primary transition-colors`}>
                    <Plus className="w-4 h-4" /><span className="text-sm font-medium">Novo Beneficiário</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={`sticky bottom-0 border-t px-8 py-4 ${bottomBar}`}>
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button onClick={() => navigate('/operations')} className={`text-sm font-semibold ${textSecondary} hover:${textPrimary} transition-colors`}>Cancelar</button>
              <button onClick={() => setStep(1)} disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors">
                Próximo Passo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ STEP 2: Valores e Conversão ═══════ */}
      {step === 1 && !submitted && (
        <div className={`${pageBg} min-h-[calc(100vh-200px)]`}>
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="mb-8">
              <h2 className={`text-2xl font-bold ${textPrimary}`}>Valores e Conversão</h2>
              <p className={`text-sm ${textSecondary} mt-1`}>Configure os valores da remessa e visualize as taxas aplicadas em tempo real.</p>
            </div>

            <div className="flex gap-6">
              {/* Left: Conversion inputs */}
              <div className="flex-1 flex flex-col gap-4">
                <div className={`${cardBgRound} p-6`}>
                  <p className={`text-sm font-semibold ${dk ? 'text-jinbe-muted' : 'text-slate-700'} mb-3`}>Você envia (BRL)</p>
                  <div className="relative">
                    <input type="text" value={amountBRL} onChange={(e) => setAmountBRL(e.target.value)}
                      className={`w-full text-3xl font-bold bg-transparent border-none focus:outline-none placeholder:opacity-30 py-2 ${textPrimary}`}
                      placeholder="0,00" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className={`text-sm ${textDim} font-medium`}>BRL</span>
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-jinbe-success text-white text-xs font-bold">R$</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center -my-1">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-sm ${dk ? 'bg-jinbe-card border-jinbe-border' : 'bg-white border-slate-200'}`}>
                    <ArrowUpDown className="w-4 h-4 text-jinbe-primary" />
                  </div>
                </div>

                <div className={`${cardBgRound} p-6`}>
                  <p className={`text-sm font-semibold ${dk ? 'text-jinbe-muted' : 'text-slate-700'} mb-3`}>Beneficiário recebe (EUR)</p>
                  <div className="relative">
                    <p className={`text-3xl font-bold ${textPrimary} py-2`}>{fmtEUR(amountEUR)}</p>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className={`text-sm ${textDim} font-medium`}>EUR</span>
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-jinbe-primary text-white text-xs font-bold">€</span>
                    </div>
                  </div>
                </div>

                <div className={`${cardBgRound} p-5 flex items-center justify-between`}>
                  <div>
                    <p className={`text-sm font-semibold ${textPrimary}`}>Quem paga as taxas?</p>
                    <p className={`text-xs ${textDim} mt-0.5`}>Defina se as taxas serão descontadas do envio ou pagas a parte.</p>
                  </div>
                  <div className={`flex items-center ${toggleBg} rounded-lg p-0.5`}>
                    <button onClick={() => setFeePayer('platform')}
                      className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${feePayer === 'platform' ? toggleActive : toggleInactive}`}>Plataforma</button>
                    <button onClick={() => setFeePayer('client')}
                      className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${feePayer === 'client' ? toggleActive : toggleInactive}`}>Cliente</button>
                  </div>
                </div>
              </div>

              {/* Right: Detalhamento sidebar (always dark) */}
              <div className="w-[300px]">
                <div className={`rounded-2xl p-6 text-white ${dk ? 'bg-jinbe-border/80' : 'bg-jinbe-sidebar'}`}>
                  <div className="flex items-center gap-2 mb-5">
                    <FileText className="w-4 h-4 text-jinbe-primary" />
                    <h3 className="text-base font-bold">Detalhamento</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Valor enviado</span>
                      <span className="text-sm font-semibold text-white">R$ {fmtBRL(rawBRL)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Cotação OTC (EUR)</span>
                      <span className="text-sm font-semibold text-white">R$ {RATE.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400 flex items-center gap-1">Spread (0.25%) <Info className="w-3 h-3 text-slate-500" /></span>
                      <span className="text-sm font-semibold text-jinbe-danger">- R$ {fmtBRL(spreadBRL)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Taxa fixa Swift</span>
                      <span className="text-sm font-semibold text-jinbe-danger">- R$ {fmtBRL(SWIFT_FEE)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">IOF (0.38%)</span>
                      <span className="text-sm font-semibold text-jinbe-danger">- R$ {fmtBRL(iofBRL)}</span>
                    </div>
                  </div>
                  <div className="border-t border-slate-600/30 mt-5 pt-5">
                    <p className="text-xs font-bold text-jinbe-primary uppercase tracking-wider mb-1">Total Convertido</p>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-white">€ {fmtEUR(amountEUR)}</span>
                      <span className="text-xs text-slate-500">VAT incl.</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} disabled={!canProceed()}
                    className="w-full flex items-center justify-center gap-2 mt-5 px-5 py-3.5 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors">
                    Revisar Operação <ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="w-full text-center text-sm text-slate-400 hover:text-white mt-3 py-2 transition-colors">Salvar como Rascunho</button>
                </div>
              </div>
            </div>

            {/* Guaranteed rate banner */}
            <div className={`flex items-center gap-3 mt-6 p-4 ${cardBgRound}`}>
              <Clock className="w-5 h-5 text-jinbe-primary shrink-0" />
              <div>
                <p className={`text-sm font-semibold ${textPrimary}`}>Cotação Garantida</p>
                <p className={`text-xs ${textSecondary}`}>
                  Esta taxa de câmbio está garantida pelos próximos{' '}
                  <span className="text-jinbe-primary font-semibold">{countdownStr}</span>.
                  {' '}Após este período, os valores serão atualizados conforme o mercado.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar limit badge */}
          <div className="fixed bottom-20 left-[16px] w-[228px] z-10">
            <div className="bg-jinbe-sidebar rounded-xl px-4 py-3">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Limite Disponível</p>
              <p className="text-lg font-bold text-white mt-0.5">R$ 1.250.000,00</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ STEP 3: Revisão ═══════ */}
      {step === 2 && !submitted && (
        <div className={`${pageBg} min-h-[calc(100vh-80px)]`}>
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className={`text-2xl font-bold ${textPrimary}`}>Revisar e Confirmar</h2>
                <p className={`text-sm ${textSecondary} mt-1`}>Confira os detalhes da sua operação antes de gerar o PIX para pagamento.</p>
              </div>
              <span className="px-3 py-1.5 border border-jinbe-primary text-jinbe-primary text-xs font-semibold rounded-full">Etapa 3 de 3</span>
            </div>

            <div className={`h-1.5 ${barBg} rounded-full overflow-hidden mb-8`}>
              <div className="h-full bg-jinbe-primary rounded-full w-full" />
            </div>

            <div className="flex gap-6">
              <div className="flex-1 flex flex-col gap-5">
                <div className={`${cardBgRound} p-6`}>
                  <div className="flex items-center gap-2 mb-5">
                    <FileText className="w-4 h-4 text-jinbe-primary" />
                    <h3 className={`text-base font-bold ${textPrimary}`}>Resumo do Contrato de Câmbio</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-jinbe-primary uppercase tracking-widest mb-1.5">Origem</p>
                      <p className={`text-base font-bold ${textPrimary}`}>{account?.name || 'Importadora XYZ Ltda.'}</p>
                      <p className={`text-xs ${textDim}`}>CNPJ: {account?.cnpj || '12.345.678/0001-90'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-jinbe-primary uppercase tracking-widest mb-1.5">Destino (Beneficiário)</p>
                      <p className={`text-base font-bold ${textPrimary}`}>{beneficiary?.name || 'Euro-Components GMBH'}</p>
                      <p className={`text-xs ${textDim}`}>{beneficiary?.country || 'Alemanha'} • IBAN: DE12 3456...</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-jinbe-primary uppercase tracking-widest mb-1.5">VET (Valor Efetivo Total)</p>
                      <p className="text-2xl font-bold text-jinbe-primary">R$ {fmtBRL(rawBRL)}</p>
                    </div>
                    <div>
                      <p className={`text-[10px] font-bold ${textDim} uppercase tracking-widest mb-1.5`}>Valor em Divisa</p>
                      <p className={`text-2xl font-bold ${textPrimary}`}>€ {fmtEUR(amountEUR)}</p>
                    </div>
                  </div>

                  <div className={`border-t ${dk ? 'border-jinbe-border' : 'border-slate-100'} pt-4 flex flex-col gap-3`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${textSecondary}`}>Taxa Comercial (EUR/BRL)</span>
                      <span className={`text-sm font-semibold ${textPrimary}`}>R$ {RATE.toFixed(4).replace('.', ',')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-jinbe-primary">IOF (0,38%)</span>
                      <span className={`text-sm font-semibold ${textPrimary}`}>R$ {fmtBRL(iofBRL)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${textSecondary}`}>Tarifa Bancária</span>
                      <span className={`text-sm font-semibold ${textPrimary}`}>R$ 0,00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-jinbe-warning/5 border border-jinbe-warning/20 rounded-2xl p-5 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-jinbe-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-jinbe-warning">Verificação KYB em andamento</p>
                    <p className="text-xs text-jinbe-warning/70 mt-1">O beneficiário ainda está em processo de validação de compliance. O pagamento será processado assim que a aprovação for concluída.</p>
                  </div>
                </div>
              </div>

              <div className="w-[280px] flex flex-col gap-5">
                <div className={`${cardBgRound} p-6 text-center`}>
                  <p className={`text-xs ${textSecondary} leading-relaxed mb-5`}>Ao confirmar, você concorda com os Termos de Uso e a cotação atual fixada por 15 minutos.</p>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors">
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" /></svg>
                        Processando...
                      </span>
                    ) : (<><QrCode className="w-4 h-4" /> Confirmar e Gerar PIX</>)}
                  </button>
                  <button onClick={() => setStep(1)} className={`w-full text-sm ${textSecondary} hover:${textPrimary} mt-3 py-2 font-medium transition-colors`}>Voltar</button>
                </div>

                <div className={`${cardBgRound} p-6`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-jinbe-primary" />
                    <h3 className={`text-sm font-bold ${textPrimary}`}>Próximos Passos</h3>
                  </div>
                  <ol className="flex flex-col gap-3">
                    {['Gere o QR Code PIX Copia e Cola.', 'Efetue o pagamento em até 15 min.', 'Enviamos os Euros automaticamente.'].map((text, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-jinbe-primary/10 text-jinbe-primary text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                        <span className={`text-xs ${dk ? 'text-jinbe-muted' : 'text-slate-600'} leading-relaxed`}>{text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className={`mt-6 ${cardBgRound} p-8 flex items-center justify-center`}>
              <div className="flex flex-col items-center gap-4">
                <div className={`w-40 h-40 rounded-xl border flex items-center justify-center ${dk ? 'bg-jinbe-bg border-jinbe-border' : 'bg-slate-50 border-slate-200'}`}>
                  <QrCode className={`w-20 h-20 ${dk ? 'text-jinbe-dim' : 'text-slate-300'}`} />
                </div>
                <p className={`text-xs ${textDim}`}>QR Code será gerado após confirmação</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Success ═══════ */}
      {submitted && (
        <div className={`${pageBg} min-h-[calc(100vh-80px)] flex items-center justify-center`}>
          <div className="flex flex-col items-center gap-6 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-jinbe-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-jinbe-success" />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${textPrimary} mb-2`}>Operação Criada!</h2>
              <p className={`text-sm ${textSecondary}`}>Sua operação foi criada com sucesso. Efetue o pagamento do PIX para iniciar a conversão.</p>
            </div>
            <div className={`w-full p-5 ${cardBgRound}`}>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div><p className={`text-[10px] ${textDim} uppercase tracking-wider`}>Operação</p><p className="text-sm font-mono font-bold text-jinbe-primary mt-0.5">OP-2024-011</p></div>
                <div><p className={`text-[10px] ${textDim} uppercase tracking-wider`}>Status</p><p className="text-sm font-semibold text-jinbe-warning mt-0.5">Aguardando PIX</p></div>
                <div><p className={`text-[10px] ${textDim} uppercase tracking-wider`}>Valor</p><p className={`text-sm font-semibold ${textPrimary} mt-0.5`}>R$ {fmtBRL(rawBRL)}</p></div>
                <div><p className={`text-[10px] ${textDim} uppercase tracking-wider`}>Destino</p><p className={`text-sm font-semibold ${textPrimary} mt-0.5`}>€ {fmtEUR(amountEUR)}</p></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/operations" className="px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-xl transition-colors">Ver Operações</Link>
              <button onClick={() => { setSubmitted(false); setStep(0); setSelectedAccount(''); setSelectedBeneficiary(''); setAmountBRL('10.000,00'); setFeePayer('platform') }}
                className={`px-6 py-3 border rounded-xl text-sm font-medium ${btnOutline}`}>Nova Operação</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
