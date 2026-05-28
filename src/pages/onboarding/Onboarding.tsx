import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Send,
  Package,
  ArrowLeftRight,
  Fish,
  Factory,
  Anchor,
  Home,
  Wheat,
  Wrench,
  Monitor,
  HelpCircle,
  Zap,
  BarChart3,
  Bell,
  FileText,
  Building2,
  Settings,
  Rocket,
  DollarSign,
  Clock,
  Users,
  Check,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import logoJinbe from '@/assets/logo jinbe.png'

// ─── Types ───────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7

interface StepConfig {
  label: string
  sublabel: string
}

const STEPS: Record<Step, StepConfig> = {
  1: { label: 'Criar conta', sublabel: 'E-mail e senha' },
  2: { label: 'Tipo de operação', sublabel: 'Envio, recebimento ou ambos' },
  3: { label: 'Simulador de economia', sublabel: 'Veja o impacto antes de continuar' },
  4: { label: 'Dados da empresa', sublabel: 'CNPJ e KYB via Urban' },
  5: { label: 'Responsável legal', sublabel: 'Verificação de identidade' },
  6: { label: 'Conta criada', sublabel: 'Próximos passos' },
  7: { label: 'Funcionalidades', sublabel: 'Tour da plataforma' },
}

// ─── Operation types ─────────────────────────────────────────────
type OperationType = 'envio' | 'recebimento' | 'ambos'

const operationOptions: { value: OperationType; icon: typeof Send; label: string; description: string }[] = [
  { value: 'envio', icon: Send, label: 'Envio — pago para o exterior', description: 'Importadores que pagam fornecedores europeus, americanos ou asiáticos' },
  { value: 'recebimento', icon: Package, label: 'Recebimento — recebo do exterior', description: 'Exportadores, operações portuárias e prestadores de serviço internacionais' },
  { value: 'ambos', icon: ArrowLeftRight, label: 'Ambos — envio e recebo', description: 'Empresas com os dois fluxos financeiros internacionais' },
]

const sectors = [
  { id: 'pescados', label: 'Pescados e frutos do mar', icon: Fish, color: 'bg-emerald-500' },
  { id: 'insumos', label: 'Insumos industriais', icon: Factory, color: 'bg-rose-500' },
  { id: 'nautico', label: 'Náutico e portuário', icon: Anchor, color: 'bg-orange-500' },
  { id: 'imoveis', label: 'Imóveis na Europa', icon: Home, color: 'bg-indigo-500' },
  { id: 'agronegocio', label: 'Agronegócio', icon: Wheat, color: 'bg-green-500' },
  { id: 'pecas', label: 'Peças e equipamentos', icon: Wrench, color: 'bg-purple-500' },
  { id: 'tecnologia', label: 'Tecnologia', icon: Monitor, color: 'bg-blue-500' },
  { id: 'outros', label: 'Outros', icon: HelpCircle, color: 'bg-yellow-500' },
]

const volumes = [
  { id: 'ate500k', label: 'Até €500k', sublabel: '< R$ 3M/mês' },
  { id: '500k_2m', label: '€500k – €2M', sublabel: 'R$ 3M – R$ 12M' },
  { id: '2m_8m', label: '€2M – €8M', sublabel: 'R$ 12M – R$ 49M' },
  { id: 'acima_8m', label: 'Acima de €8M', sublabel: '> R$ 49M/mês' },
]

const currencies = [
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'GBP', label: 'Libra (GBP)' },
]

const cargos = [
  { value: 'socio_administrador', label: 'Sócio administrador' },
  { value: 'diretor', label: 'Diretor' },
  { value: 'procurador', label: 'Procurador' },
  { value: 'representante_legal', label: 'Representante legal' },
]

const features = [
  { icon: Zap, label: 'Liquidação em tempo real', description: 'Pagamentos confirmados em menos de 1 hora — não em 3 a 7 dias úteis', badge: 'Novo' },
  { icon: BarChart3, label: 'Custo por parceiro', description: 'Veja a taxa efetiva real de cada fornecedor ou cliente ao longo do tempo' },
  { icon: Bell, label: 'Alerta de câmbio', description: 'Seja avisado quando o câmbio atingir sua meta — converta no momento certo' },
  { icon: FileText, label: 'Conciliação automática', description: 'Invoices vinculadas a pagamentos automaticamente — fim do Excel manual' },
  { icon: Building2, label: 'Saldo USDC sob controle', description: 'O valor chega em USDC — você escolhe quando converter para reais' },
  { icon: DollarSign, label: 'Exportação para contador', description: 'PDF + CSV com taxas, IOF e spread prontos para fechamento fiscal' },
  { icon: Settings, label: 'Integração com ERP', description: 'Atualização automática de status de invoices no TOTVS e outros ERPs via API — eliminando divergências e retrabalho manual', badge: 'Roadmap' },
]

// ─── Main Component ──────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate()
  const { completeOnboarding } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)

  // Step 1 - Criar conta
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Step 2 - Tipo de operação
  const [operationType, setOperationType] = useState<OperationType>('envio')
  const [selectedSector, setSelectedSector] = useState('pescados')
  const [selectedVolume, setSelectedVolume] = useState('500k_2m')

  // Step 3 - Simulador
  const [simVolume, setSimVolume] = useState('150000')
  const [simCurrency, setSimCurrency] = useState('EUR')

  // Step 4 - Dados da empresa
  const [cnpj, setCnpj] = useState('')
  const [razaoSocial, setRazaoSocial] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')
  const [moedaOperacao, setMoedaOperacao] = useState('EUR')
  const [cnpjVerified, setCnpjVerified] = useState(false)
  const [cnpjCompanyName, setCnpjCompanyName] = useState('')

  // Step 5 - Responsável legal
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [cpf, setCpf] = useState('')
  const [cargo, setCargo] = useState('socio_administrador')
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Savings calculator
  const savings = useMemo(() => {
    const vol = parseFloat(simVolume) || 0
    const rate = simCurrency === 'EUR' ? 6.15 : simCurrency === 'USD' ? 5.50 : 7.20
    const brlVolume = vol * rate
    const bankCost = brlVolume * 0.041
    const jinbeCost = brlVolume * 0.017
    const monthlySaving = bankCost - jinbeCost
    return {
      bankCost: bankCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      jinbeCost: jinbeCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      monthly: monthlySaving.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      yearly: (monthlySaving * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      monthlyRaw: monthlySaving,
    }
  }, [simVolume, simCurrency])

  // CNPJ formatting
  const formatCnpj = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14)
    return digits.replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, (_, a, b, c, d, e) => {
      let result = a
      if (b) result += `.${b}`
      if (c) result += `.${c}`
      if (d) result += `/${d}`
      if (e) result += `-${e}`
      return result
    })
  }

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits.replace(/^(\d{3})(\d{3})?(\d{3})?(\d{2})?/, (_, a, b, c, d) => {
      let result = a
      if (b) result += `.${b}`
      if (c) result += `.${c}`
      if (d) result += `-${d}`
      return result
    })
  }

  const handleCnpjChange = (value: string) => {
    const formatted = formatCnpj(value)
    setCnpj(formatted)
    // Simulate CNPJ lookup when complete (14 digits)
    const digits = value.replace(/\D/g, '')
    if (digits.length === 14) {
      setCnpjVerified(true)
      setCnpjCompanyName('Pescados Atlântico Ltda.')
      setRazaoSocial('Pescados Atlântico Ltda.')
      setEstado('Rio de Janeiro')
      setCidade('Rio de Janeiro')
    } else {
      setCnpjVerified(false)
      setCnpjCompanyName('')
    }
  }

  const goNext = () => {
    if (currentStep < 7) setCurrentStep((currentStep + 1) as Step)
  }

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step)
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    localStorage.setItem('user_email', email)
    setIsLoading(false)
    goNext()
  }

  const handleFinalizarCadastro = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setIsLoading(false)
    goNext()
  }

  const handleAcessarPainel = () => {
    completeOnboarding()
    navigate('/')
  }

  // ─── Progress sidebar ────────────────────────────────────────
  const renderSidebar = () => (
    <aside className="w-72 min-h-screen bg-[#0c1219] border-r border-jinbe-border flex flex-col p-6 shrink-0">
      <img src={logoJinbe} alt="Jinbe" className="h-8 w-fit mb-8" />

      <p className="text-[11px] font-semibold text-jinbe-dim uppercase tracking-wider mb-4">
        Progresso do cadastro
      </p>

      <nav className="flex-1 space-y-1">
        {([1, 2, 3, 4, 5, 6, 7] as Step[]).map((step) => {
          const config = STEPS[step]
          const isActive = step === currentStep
          const isDone = step < currentStep

          return (
            <div
              key={step}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? 'bg-jinbe-primary/15' : ''
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  isDone
                    ? 'bg-jinbe-success/20 text-jinbe-success'
                    : isActive
                    ? 'bg-jinbe-primary text-white'
                    : 'bg-jinbe-border text-jinbe-dim'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : step}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : isDone ? 'text-jinbe-muted' : 'text-jinbe-dim'}`}>
                  {config.label}
                </p>
                <p className="text-[11px] text-jinbe-dim truncate">{config.sublabel}</p>
              </div>
            </div>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-jinbe-border">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-5 h-5 text-jinbe-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-jinbe-muted">Operação regulamentada</p>
            <p className="text-[11px] text-jinbe-dim mt-0.5">
              Parceiro autorizado pelo Banco Central do Brasil. Dados protegidos com criptografia.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )

  // ─── Step 1: Criar conta ─────────────────────────────────────
  const renderStep1 = () => (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-jinbe-warning/20 flex items-center justify-center">
          <Lock className="w-5 h-5 text-jinbe-warning" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Bem-vindo à Jinbe</h1>
        </div>
      </div>
      <p className="text-jinbe-muted mb-8 ml-[52px]">
        Pague ou receba do exterior com até 50% de economia. Sem mensalidade — você paga só quando usar.
      </p>

      <form onSubmit={handleCreateAccount} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-jinbe-muted mb-2">E-mail corporativo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@empresa.com.br"
            required
            className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-jinbe-muted mb-2">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
              className="w-full px-4 py-3 pr-12 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-jinbe-dim hover:text-jinbe-muted"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <div className="space-y-2 pt-2">
          {[
            'Autorizado pelo Banco Central do Brasil',
            'Sem mensalidade — pague só quando usar',
            'Funciona junto ao seu banco atual',
          ].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-jinbe-success" />
              <span className="text-sm text-jinbe-muted">{text}</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading || !email || password.length < 8}
          className="w-full py-3.5 bg-jinbe-success hover:bg-jinbe-success/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Criar minha conta <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <div className="mt-6 text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-jinbe-border" /></div>
          <div className="relative flex justify-center text-sm"><span className="px-3 bg-jinbe-bg text-jinbe-dim">Já tem conta?</span></div>
        </div>
        <Link
          to="/onboarding/login"
          className="block w-full py-3 border border-jinbe-border hover:bg-jinbe-hover text-white font-medium rounded-lg transition-colors text-center"
        >
          Entrar na minha conta
        </Link>
      </div>

      <p className="text-center text-[11px] text-jinbe-dim mt-4">
        Ao continuar, você aceita os <a href="#" className="text-jinbe-primary hover:underline">Termos de uso</a> e a <a href="#" className="text-jinbe-primary hover:underline">Política de privacidade</a>
      </p>
    </div>
  )

  // ─── Step 2: Tipo de operação ────────────────────────────────
  const renderStep2 = () => (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-jinbe-primary/20 flex items-center justify-center">
          <ArrowLeftRight className="w-5 h-5 text-jinbe-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Como sua empresa opera no exterior?</h1>
        </div>
      </div>
      <p className="text-jinbe-muted mb-8 ml-[52px]">Isso personaliza seu painel e define sua experiência na plataforma.</p>

      {/* Tipo de operação */}
      <p className="text-[11px] font-semibold text-jinbe-dim uppercase tracking-wider mb-3">Tipo de operação</p>
      <div className="space-y-2 mb-8">
        {operationOptions.map((opt) => {
          const Icon = opt.icon
          const selected = operationType === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setOperationType(opt.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                selected ? 'bg-jinbe-success/10 border-jinbe-success' : 'bg-jinbe-card border-jinbe-border hover:border-jinbe-muted'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-jinbe-success/20' : 'bg-jinbe-border'}`}>
                <Icon className={`w-5 h-5 ${selected ? 'text-jinbe-success' : 'text-jinbe-dim'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white">{opt.label}</p>
                <p className="text-sm text-jinbe-muted">{opt.description}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                selected ? 'border-jinbe-success bg-jinbe-success' : 'border-jinbe-border'
              }`}>
                {selected && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Setor */}
      <p className="text-[11px] font-semibold text-jinbe-dim uppercase tracking-wider mb-3">
        Setor da empresa <span className="font-normal">(personalize seu painel)</span>
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        {sectors.map((s) => {
          const Icon = s.icon
          const selected = selectedSector === s.id
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSector(s.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                selected ? 'bg-jinbe-success text-white' : 'bg-jinbe-card border border-jinbe-border text-jinbe-muted hover:border-jinbe-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Volume */}
      <p className="text-[11px] font-semibold text-jinbe-dim uppercase tracking-wider mb-3">Volume financeiro mensal esperado</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {volumes.map((v) => {
          const selected = selectedVolume === v.id
          return (
            <button
              key={v.id}
              onClick={() => setSelectedVolume(v.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selected ? 'bg-jinbe-primary/10 border-jinbe-primary' : 'bg-jinbe-card border-jinbe-border hover:border-jinbe-muted'
              }`}
            >
              <p className="font-semibold text-white">{v.label}</p>
              <p className="text-sm text-jinbe-muted">{v.sublabel}</p>
            </button>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={goBack} className="flex items-center gap-2 px-6 py-3 border border-jinbe-border hover:bg-jinbe-hover text-white rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <button onClick={goNext} className="flex-1 py-3 bg-jinbe-success hover:bg-jinbe-success/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  // ─── Step 3: Simulador de economia ───────────────────────────
  const renderStep3 = () => (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-jinbe-warning/20 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-jinbe-warning" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Veja sua economia antes de qualquer documento</h1>
        </div>
      </div>
      <p className="text-jinbe-muted mb-8 ml-[52px]">Coloque seu volume mensal e descubra quanto você está perdendo hoje.</p>

      <div className="border border-jinbe-border rounded-xl p-6 mb-6">
        <p className="text-[11px] font-semibold text-jinbe-dim uppercase tracking-wider mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Calculadora de economia
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm text-jinbe-muted w-32 shrink-0">Volume mensal</label>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-jinbe-dim text-sm">€</span>
              <input
                type="text"
                value={simVolume}
                onChange={(e) => setSimVolume(e.target.value.replace(/[^\d]/g, ''))}
                className="w-full pl-8 pr-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-white focus:outline-none focus:border-jinbe-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-sm text-jinbe-muted w-32 shrink-0">Moeda</label>
            <select
              value={simCurrency}
              onChange={(e) => setSimCurrency(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-white focus:outline-none focus:border-jinbe-primary transition-colors appearance-none cursor-pointer"
            >
              {currencies.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-jinbe-bg rounded-lg p-4 space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-jinbe-muted">Banco tradicional (~4,1%)</span>
            <span className="text-sm font-semibold text-jinbe-danger">{savings.bankCost}/mês</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-jinbe-muted">Jinbe (1,7%)</span>
            <span className="text-sm font-semibold text-white">{savings.jinbeCost}/mês</span>
          </div>
          <div className="border-t border-jinbe-border my-2" />
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-jinbe-success">Economia mensal estimada</span>
            <span className="text-sm font-bold text-white">{savings.monthly}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-jinbe-dim">Projeção anual</span>
            <span className="text-sm font-semibold text-jinbe-success">{savings.yearly}/ano</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="text-center p-4 bg-jinbe-card border border-jinbe-border rounded-xl">
          <p className="text-xl font-bold text-jinbe-success">1,7%</p>
          <p className="text-xs text-jinbe-muted mt-1">Taxa Jinbe</p>
        </div>
        <div className="text-center p-4 bg-jinbe-card border border-jinbe-border rounded-xl">
          <p className="text-xl font-bold text-jinbe-success">{'< 1h'}</p>
          <p className="text-xs text-jinbe-muted mt-1">Liquidação</p>
        </div>
        <div className="text-center p-4 bg-jinbe-card border border-jinbe-border rounded-xl">
          <p className="text-xl font-bold text-jinbe-success">0</p>
          <p className="text-xs text-jinbe-muted mt-1">Intermediários</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={goBack} className="flex items-center gap-2 px-6 py-3 border border-jinbe-border hover:bg-jinbe-hover text-white rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <button onClick={goNext} className="flex-1 py-3 bg-jinbe-success hover:bg-jinbe-success/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
          Quero economizar {savings.monthly}/mês <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-[11px] text-jinbe-dim mt-4">
        Estimativa baseada em custo médio bancário. Resultado real pode variar conforme a operação.
      </p>
    </div>
  )

  // ─── Step 4: Dados da empresa ────────────────────────────────
  const renderStep4 = () => (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-jinbe-primary/20 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-jinbe-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Dados da empresa</h1>
        </div>
      </div>
      <p className="text-jinbe-muted mb-6 ml-[52px]">Buscamos automaticamente na Receita Federal pelo CNPJ. Verificação KYB via Urban Exchange.</p>

      {/* KYB notice */}
      <div className="flex items-start gap-3 p-4 bg-jinbe-info/10 border border-jinbe-info/20 rounded-xl mb-6">
        <div className="w-5 h-5 rounded bg-jinbe-info flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <p className="text-sm text-jinbe-muted">
          Esta é a verificação <strong className="text-white">KYB (Know Your Business)</strong> exigida pelo Banco Central para operações de câmbio, realizada pela Urban Exchange.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-jinbe-muted mb-2">CNPJ</label>
          <input
            type="text"
            value={cnpj}
            onChange={(e) => handleCnpjChange(e.target.value)}
            placeholder="12.345.678/0001-99"
            className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
          />
        </div>

        {cnpjVerified && (
          <div className="flex items-center gap-3 p-3 bg-jinbe-card border border-jinbe-border rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-jinbe-primary/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-jinbe-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{cnpjCompanyName}</p>
              <p className="text-xs text-jinbe-muted">CNPJ ativo · Empresa de Pequeno Porte · Importação e comércio de pescados</p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-jinbe-muted mb-2">Razão social</label>
          <input
            type="text"
            value={razaoSocial}
            onChange={(e) => setRazaoSocial(e.target.value)}
            placeholder="Nome da empresa"
            className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-jinbe-muted mb-2">Estado</label>
            <input
              type="text"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              placeholder="Estado"
              className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-jinbe-muted mb-2">Cidade</label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              placeholder="Cidade"
              className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-jinbe-muted mb-2">Moeda principal de operação</label>
          <select
            value={moedaOperacao}
            onChange={(e) => setMoedaOperacao(e.target.value)}
            className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white focus:outline-none focus:border-jinbe-primary transition-colors appearance-none cursor-pointer"
          >
            <option value="EUR">Euro (EUR) — Europa</option>
            <option value="USD">Dólar (USD) — Estados Unidos</option>
            <option value="GBP">Libra (GBP) — Reino Unido</option>
          </select>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <button onClick={goBack} className="flex items-center gap-2 px-6 py-3 border border-jinbe-border hover:bg-jinbe-hover text-white rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <button
          onClick={goNext}
          disabled={!cnpjVerified || !razaoSocial}
          className="flex-1 py-3 bg-jinbe-success hover:bg-jinbe-success/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          Continuar <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  // ─── Step 5: Responsável legal ───────────────────────────────
  const renderStep5 = () => (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-jinbe-primary/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-jinbe-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Responsável legal</h1>
        </div>
      </div>
      <p className="text-jinbe-muted mb-8 ml-[52px]">Verificação de identidade exigida pelo Banco Central — feita em menos de 2 minutos pelo celular.</p>

      {/* Verification steps */}
      <p className="text-[11px] font-semibold text-jinbe-dim uppercase tracking-wider mb-4">Etapas de verificação</p>
      <div className="space-y-3 mb-8">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-jinbe-success/20 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 text-jinbe-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Empresa verificada (KYB)</p>
            <p className="text-xs text-jinbe-muted">{cnpjCompanyName || 'Empresa'} · CNPJ validado pela Receita Federal</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-jinbe-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-xs font-semibold">2</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Verificação de identidade (KYC)</p>
            <p className="text-xs text-jinbe-muted">Preencha os dados abaixo. Você receberá um link seguro por e-mail para selfie + foto do documento — sem precisar ir a lugar nenhum.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-jinbe-border flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-jinbe-dim text-xs font-semibold">3</span>
          </div>
          <div>
            <p className="text-sm font-medium text-jinbe-dim">Conta aprovada</p>
            <p className="text-xs text-jinbe-dim">Aprovação em até 24h. Suporte disponível para acompanhar.</p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-jinbe-muted mb-2">Nome completo</label>
            <input
              type="text"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              placeholder="Carlos Ferreira"
              className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-jinbe-muted mb-2">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              placeholder="123.456.789-00"
              className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-jinbe-muted mb-2">Cargo na empresa</label>
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white focus:outline-none focus:border-jinbe-primary transition-colors appearance-none cursor-pointer"
          >
            {cargos.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sumsub notice */}
      <div className="flex items-start gap-3 p-4 bg-jinbe-warning/10 border border-jinbe-warning/20 rounded-xl mt-6">
        <ShieldCheck className="w-5 h-5 text-jinbe-warning shrink-0 mt-0.5" />
        <p className="text-sm text-jinbe-muted">
          A verificação é feita pelo <strong className="text-white">Sumsub</strong>, parceiro autorizado da Urban Exchange. Um link seguro será enviado para <strong className="text-white">seu e-mail</strong>. Seus dados não ficam armazenados na Jinbe.
        </p>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 mt-4 cursor-pointer">
        <div
          onClick={() => setAcceptTerms(!acceptTerms)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            acceptTerms ? 'bg-jinbe-success border-jinbe-success' : 'border-jinbe-border'
          }`}
        >
          {acceptTerms && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className="text-sm text-jinbe-muted">
          Confirmo que sou o responsável legal pela empresa e autorizo o tratamento dos dados conforme a{' '}
          <a href="#" className="text-jinbe-primary hover:underline">Política de privacidade</a>
        </span>
      </label>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        <button onClick={goBack} className="flex items-center gap-2 px-6 py-3 border border-jinbe-border hover:bg-jinbe-hover text-white rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <button
          onClick={handleFinalizarCadastro}
          disabled={isLoading || !nomeCompleto || !cpf || !acceptTerms}
          className="flex-1 py-3 bg-jinbe-success hover:bg-jinbe-success/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Finalizar cadastro <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  )

  // ─── Step 6: Conta criada ────────────────────────────────────
  const renderStep6 = () => (
    <div className="w-full max-w-lg mx-auto text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-jinbe-success/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-jinbe-success" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-white mb-2">Conta criada com sucesso!</h1>
      <p className="text-jinbe-muted mb-2">
        Um e-mail de confirmação foi enviado para<br />
        <span className="text-white">{email || 'carlos@pescados.com.br'}</span>.
      </p>
      <p className="text-jinbe-muted mb-8">
        Assim que a verificação for concluída, você já pode fazer sua primeira operação.
      </p>

      {/* Next steps */}
      <p className="text-[11px] font-semibold text-jinbe-dim uppercase tracking-wider mb-4">O que acontece agora</p>
      <div className="space-y-3 mb-8 text-left">
        <div className="flex items-start gap-3 p-4 bg-jinbe-card border border-jinbe-border rounded-xl">
          <div className="w-7 h-7 rounded-full bg-jinbe-success flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">1</span>
          </div>
          <div>
            <span className="text-sm font-medium text-white">Confirmar e-mail</span>
            <span className="text-sm text-jinbe-muted"> · Clique no link enviado para {email || 'carlos@pescados.com.br'}</span>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-jinbe-card border border-jinbe-border rounded-xl">
          <div className="w-7 h-7 rounded-full bg-jinbe-success flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">2</span>
          </div>
          <div>
            <span className="text-sm font-medium text-white">Verificação de identidade</span>
            <span className="text-sm text-jinbe-muted"> · Um link Sumsub chegará para selfie + documento — 2 min pelo celular</span>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-jinbe-card border border-jinbe-border rounded-xl">
          <div className="w-7 h-7 rounded-full bg-jinbe-success flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-semibold">3</span>
          </div>
          <div>
            <span className="text-sm font-medium text-white">Primeira operação</span>
            <span className="text-sm text-jinbe-muted"> · Aprovação em até 24h · Suporte no WhatsApp disponível</span>
          </div>
        </div>
      </div>

      {/* Savings recap */}
      <div className="border border-jinbe-border rounded-xl p-4 mb-8">
        <p className="text-[11px] font-semibold text-jinbe-dim uppercase tracking-wider mb-3 flex items-center justify-center gap-2">
          <DollarSign className="w-4 h-4" /> Sua economia estimada com a Jinbe
        </p>
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-sm font-semibold text-jinbe-success">Economia mensal</p>
            <p className="text-xs text-jinbe-dim">Projeção anual</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-white">{savings.monthly}</p>
            <p className="text-sm font-semibold text-jinbe-success">{savings.yearly}/ano</p>
          </div>
        </div>
      </div>

      <button
        onClick={goNext}
        className="w-full py-3.5 bg-jinbe-success hover:bg-jinbe-success/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        Conhecer a plataforma <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )

  // ─── Step 7: Funcionalidades ─────────────────────────────────
  const renderStep7 = () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-jinbe-success/20 flex items-center justify-center">
          <Rocket className="w-5 h-5 text-jinbe-success" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">Tudo na palma da sua mão</h1>
        </div>
      </div>
      <p className="text-jinbe-muted mb-8 ml-[52px]">Confira o que a Jinbe coloca à disposição da sua empresa — construído para o seu negócio.</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {features.map((f, i) => {
          const Icon = f.icon
          const isHighlight = i === 0
          return (
            <div
              key={f.label}
              className={`p-4 rounded-xl border transition-all ${
                isHighlight ? 'bg-jinbe-success/10 border-jinbe-success/30' : i === features.length - 1 ? 'col-span-2 bg-jinbe-card border-jinbe-border' : 'bg-jinbe-card border-jinbe-border'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className={`w-6 h-6 ${isHighlight ? 'text-jinbe-success' : 'text-jinbe-primary'}`} />
                {f.badge && (
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    f.badge === 'Novo' ? 'bg-jinbe-success/20 text-jinbe-success' : 'bg-jinbe-border text-jinbe-dim'
                  }`}>
                    {f.badge}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-white mb-1">{f.label}</p>
              <p className="text-xs text-jinbe-muted">{f.description}</p>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleAcessarPainel}
        className="w-full py-3.5 bg-jinbe-success hover:bg-jinbe-success/90 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        Acessar meu painel <ArrowRight className="w-4 h-4" />
      </button>

      <p className="text-center text-[11px] text-jinbe-dim mt-4">
        Você pode revisitar este tour a qualquer momento pelo menu de Ajuda.
      </p>
    </div>
  )

  // ─── Render ──────────────────────────────────────────────────
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      case 6: return renderStep6()
      case 7: return renderStep7()
    }
  }

  return (
    <div className="flex min-h-screen bg-jinbe-bg">
      {renderSidebar()}
      <main className="flex-1 flex items-start justify-center overflow-y-auto py-12 px-8">
        <div className="w-full max-w-2xl">
          {/* Step indicator top-right */}
          <div className="flex justify-end mb-6">
            <span className="text-sm text-jinbe-dim">Etapa {currentStep} de 7</span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-jinbe-border rounded-full mb-8">
            <div
              className="h-full bg-jinbe-primary rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>

          {renderCurrentStep()}
        </div>
      </main>
    </div>
  )
}
