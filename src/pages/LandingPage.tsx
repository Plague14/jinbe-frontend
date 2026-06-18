import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Clock,
  DollarSign,
  Building2,
  CheckCircle2,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import logoJinbe from '@/assets/logo-jinbe.png'

// ─── Payment Methods ─────────────────────────────────────────────
const paymentMethods = [
  {
    name: 'PIX',
    description: 'Pagamentos instantâneos 24/7 no Brasil',
    countries: '1 país',
    settlement: 'Instantâneo',
    flag: '🇧🇷',
    color: 'bg-emerald-500',
  },
  {
    name: 'SWIFT',
    description: 'Transferências globais para qualquer banco',
    countries: '200+ países',
    settlement: 'D+1 a D+3',
    flag: '🌍',
    color: 'bg-blue-500',
  },
  {
    name: 'SEPA',
    description: 'Europa com liquidação no mesmo dia',
    countries: '36 países',
    settlement: 'D+0',
    flag: '🇪🇺',
    color: 'bg-indigo-500',
  },
  {
    name: 'ACH / Fedwire',
    description: 'Pagamentos domésticos nos EUA',
    countries: '1 país',
    settlement: 'D+0 a D+1',
    flag: '🇺🇸',
    color: 'bg-red-500',
  },
  {
    name: 'RMB',
    description: 'Pagamentos diretos para a China',
    countries: '1 país',
    settlement: 'D+1',
    flag: '🇨🇳',
    color: 'bg-yellow-500',
  },
]

// ─── Features ────────────────────────────────────────────────────
const features = [
  {
    icon: Zap,
    title: 'Liquidação em tempo real',
    description: 'Pagamentos confirmados em menos de 1 hora — não em 3 a 7 dias úteis como nos bancos tradicionais.',
  },
  {
    icon: DollarSign,
    title: 'Até 60% mais barato',
    description: 'Taxa fixa de 1,7% contra até 4,1% dos bancos. Sem surpresas, sem taxas ocultas.',
  },
  {
    icon: Shield,
    title: 'Segurança regulamentada',
    description: 'Parceiro autorizado pelo Banco Central do Brasil. Seus dados protegidos com criptografia de ponta.',
  },
  {
    icon: Globe,
    title: 'Cobertura global',
    description: 'Envie e receba de mais de 200 países com múltiplas rotas de pagamento.',
  },
  {
    icon: Clock,
    title: 'Suporte especializado',
    description: 'Equipe de especialistas em comércio exterior disponível para ajudar sua operação.',
  },
  {
    icon: Building2,
    title: 'Integração com ERP',
    description: 'API robusta para integração com TOTVS, SAP e outros sistemas de gestão.',
  },
]

// ─── How It Works ────────────────────────────────────────────────
const steps = [
  {
    step: 1,
    title: 'Crie sua conta',
    description: 'Cadastro 100% digital em menos de 10 minutos. Verificação KYB/KYC automatizada.',
  },
  {
    step: 2,
    title: 'Adicione beneficiários',
    description: 'Cadastre seus fornecedores ou clientes internacionais com dados bancários.',
  },
  {
    step: 3,
    title: 'Envie ou receba',
    description: 'Faça transferências com a melhor taxa e acompanhe em tempo real.',
  },
]

// ─── Testimonials ────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Carlos Ferreira',
    role: 'Diretor Financeiro',
    company: 'Pescados Atlântico',
    text: 'Reduzimos nossos custos com câmbio em 45% no primeiro mês. A liquidação rápida mudou completamente nossa operação.',
    avatar: 'CF',
  },
  {
    name: 'Marina Santos',
    role: 'CEO',
    company: 'TechBR Solutions',
    text: 'A transparência nas taxas e o suporte especializado fazem toda a diferença. Recomendo para qualquer empresa que opera no exterior.',
    avatar: 'MS',
  },
  {
    name: 'Roberto Almeida',
    role: 'Gerente de Operações',
    company: 'Agro Norte SA',
    text: 'Processo simples, rápido e seguro. Nossos pagamentos para fornecedores europeus nunca foram tão eficientes.',
    avatar: 'RA',
  },
]

// ─── FAQ ─────────────────────────────────────────────────────────
const faqs = [
  {
    question: 'Quanto tempo leva para minha conta ser aprovada?',
    answer: 'O processo de verificação KYB/KYC é automatizado e geralmente leva menos de 24 horas. Em casos mais complexos, pode levar até 48 horas.',
  },
  {
    question: 'Quais documentos são necessários?',
    answer: 'CNPJ ativo, documentos dos sócios administradores (RG/CPF) e comprovante de endereço da empresa. Todo o processo é feito digitalmente.',
  },
  {
    question: 'Existe valor mínimo para transferências?',
    answer: 'Não há valor mínimo. Você pode enviar a partir de qualquer valor, mas recomendamos operações acima de €1.000 para melhor custo-benefício.',
  },
  {
    question: 'Como funciona a taxa de câmbio?',
    answer: 'Trabalhamos com taxa comercial em tempo real. Nossa taxa fixa de 1,7% é aplicada sobre o valor da operação, sem surpresas.',
  },
  {
    question: 'A Jinbe é regulamentada?',
    answer: 'Sim. Somos parceiros de instituições autorizadas pelo Banco Central do Brasil para operações de câmbio.',
  },
]

// ─── Currencies for simulator ────────────────────────────────────
const currencies = [
  { value: 'EUR', label: 'Euro (EUR)', flag: '🇪🇺', rate: 6.15 },
  { value: 'USD', label: 'Dólar (USD)', flag: '🇺🇸', rate: 5.50 },
  { value: 'GBP', label: 'Libra (GBP)', flag: '🇬🇧', rate: 7.20 },
]

// ─── Volume options ──────────────────────────────────────────────
const volumeOptions = [
  { value: 'ate500k', label: 'Até R$ 500 mil/mês' },
  { value: '500k_2m', label: 'R$ 500 mil a R$ 2 milhões/mês' },
  { value: '2m_10m', label: 'R$ 2 milhões a R$ 10 milhões/mês' },
  { value: 'acima_10m', label: 'Acima de R$ 10 milhões/mês' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Simulator state
  const [simVolume, setSimVolume] = useState('150000')
  const [simCurrency, setSimCurrency] = useState('EUR')

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    volume: '500k_2m',
    message: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Savings calculator
  const savings = useMemo(() => {
    const vol = parseFloat(simVolume) || 0
    const currency = currencies.find(c => c.value === simCurrency)
    const rate = currency?.rate || 6.15
    const brlVolume = vol * rate
    const bankCost = brlVolume * 0.041
    const jinbeCost = brlVolume * 0.017
    const monthlySaving = bankCost - jinbeCost
    const percentSaving = bankCost > 0 ? ((bankCost - jinbeCost) / bankCost * 100) : 0
    return {
      bankCost: bankCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      jinbeCost: jinbeCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      monthly: monthlySaving.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      yearly: (monthlySaving * 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      percent: percentSaving.toFixed(0),
    }
  }, [simVolume, simCurrency])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f14]/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/landing" className="flex items-center">
              <img src={logoJinbe} alt="Jinbe" className="h-8 sm:h-10" />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm text-gray-300 hover:text-white transition-colors">
                Soluções
              </button>
              <button onClick={() => scrollToSection('simulator')} className="text-sm text-gray-300 hover:text-white transition-colors">
                Simulador
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm text-gray-300 hover:text-white transition-colors">
                Como funciona
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-sm text-gray-300 hover:text-white transition-colors">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-sm text-gray-300 hover:text-white transition-colors">
                Contato
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/onboarding/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                Entrar
              </Link>
              <Link
                to="/onboarding/register"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Criar conta grátis
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0f14] border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left py-2 text-gray-300 hover:text-white">
                Soluções
              </button>
              <button onClick={() => scrollToSection('simulator')} className="block w-full text-left py-2 text-gray-300 hover:text-white">
                Simulador
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left py-2 text-gray-300 hover:text-white">
                Como funciona
              </button>
              <button onClick={() => scrollToSection('faq')} className="block w-full text-left py-2 text-gray-300 hover:text-white">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 text-gray-300 hover:text-white">
                Contato
              </button>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link to="/onboarding/login" className="block py-2 text-gray-300 hover:text-white">
                  Entrar
                </Link>
                <Link
                  to="/onboarding/register"
                  className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-semibold rounded-lg"
                >
                  Criar conta grátis
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[120px] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 sm:mb-8">
            <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="text-xs sm:text-sm text-emerald-500 font-medium text-center">Pagamentos internacionais em menos de 1 hora</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Infraestrutura financeira para o{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500">
              comércio exterior
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10">
            Envie e receba pagamentos internacionais com até 60% de economia.
            Sem burocracia, sem taxas ocultas, sem espera.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/onboarding/register"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Começar agora <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => scrollToSection('simulator')}
              className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:border-white/40 text-white font-medium rounded-xl transition-colors"
            >
              Simular economia
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-12 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Banco Central</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sem mensalidade</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>200+ países</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Payment Methods ────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Múltiplas rotas de pagamento
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Escolha a melhor rota para cada operação. Suportamos as principais redes de pagamento do mundo.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="p-4 sm:p-6 bg-[#161b22] border border-white/10 rounded-xl sm:rounded-2xl hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">{method.flag}</span>
                  <div className={`px-2 py-1 ${method.color} rounded text-white text-[10px] sm:text-xs font-semibold`}>
                    {method.name}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2">{method.description}</p>
                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cobertura</span>
                    <span className="text-white">{method.countries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Liquidação</span>
                    <span className="text-emerald-500">{method.settlement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Simulator Section ──────────────────────────────────── */}
      <section id="simulator" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full mb-6">
                <DollarSign className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-500 font-medium">Calculadora de economia</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Descubra quanto você está perdendo hoje
              </h2>
              <p className="text-gray-400 mb-8">
                Compare o custo do seu banco tradicional com a Jinbe.
                Coloque seu volume mensal e veja a economia em tempo real.
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="p-3 sm:p-4 bg-[#161b22] border border-white/10 rounded-xl text-center">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-500">1,7%</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Taxa Jinbe</p>
                </div>
                <div className="p-3 sm:p-4 bg-[#161b22] border border-white/10 rounded-xl text-center">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-500">&lt; 1h</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Liquidação</p>
                </div>
                <div className="p-3 sm:p-4 bg-[#161b22] border border-white/10 rounded-xl text-center">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-500">0</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Intermediários</p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-[#161b22] border border-white/10 rounded-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Volume mensal estimado</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      {currencies.find(c => c.value === simCurrency)?.flag}
                    </span>
                    <input
                      type="text"
                      value={parseInt(simVolume || '0').toLocaleString('pt-BR')}
                      onChange={(e) => setSimVolume(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl text-white text-lg font-semibold focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Moeda</label>
                  <div className="grid grid-cols-3 gap-3">
                    {currencies.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setSimCurrency(c.value)}
                        className={`py-3 rounded-xl text-sm font-medium transition-colors ${
                          simCurrency === c.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-[#0d1117] border border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {c.flag} {c.value}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-[#0d1117] rounded-xl space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="text-sm text-gray-400">Banco tradicional (~4,1%)</span>
                    <span className="text-red-400 font-semibold line-through text-sm sm:text-base">{savings.bankCost}/mês</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                    <span className="text-sm text-gray-400">Jinbe (1,7%)</span>
                    <span className="text-white font-semibold text-sm sm:text-base">{savings.jinbeCost}/mês</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 sm:pt-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-emerald-500 font-medium text-sm sm:text-base">Sua economia mensal</span>
                      <span className="text-xl sm:text-2xl font-bold text-white">{savings.monthly}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500 text-xs sm:text-sm">Economia anual</span>
                      <span className="text-emerald-500 font-semibold text-sm sm:text-base">{savings.yearly}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/onboarding/register"
                  className="block w-full py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-semibold rounded-xl transition-colors text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Quero economizar {savings.monthly}/mês</span>
                  <span className="sm:hidden">Economizar {savings.monthly}/mês</span>
                </Link>

                <p className="text-center text-xs text-gray-500">
                  Estimativa baseada em custo médio bancário. Resultado real pode variar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Section ───────────────────────────────────── */}
      <section id="features" className="py-20 sm:py-24 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Por que escolher a Jinbe?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Tecnologia moderna e suporte especializado para empresas que movem o mundo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="p-6 bg-[#161b22] border border-white/10 rounded-2xl hover:border-blue-500/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simples assim
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comece a economizar em 3 passos simples. Sem burocracia, sem complicação.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-blue-500/50 to-blue-500/10" />
                )}
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/10 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-blue-500">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/onboarding/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
            >
              Criar minha conta grátis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Empresas que confiam na Jinbe
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Mais de 600 empresas já economizaram milhões em transferências internacionais.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-5 sm:p-6 bg-[#161b22] border border-white/10 rounded-xl sm:rounded-2xl"
              >
                <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-blue-500">{testimonial.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm sm:text-base truncate">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm truncate">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ────────────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Perguntas frequentes
            </h2>
            <p className="text-gray-400">
              Tire suas dúvidas sobre a Jinbe.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 bg-[#161b22] hover:bg-[#1c2128] transition-colors text-left gap-4"
                >
                  <span className="font-medium text-white text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="p-4 sm:p-5 bg-[#0d1117] border-t border-white/10">
                    <p className="text-gray-400 text-sm sm:text-base">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact Section ────────────────────────────────────── */}
      <section id="contact" className="py-20 sm:py-24 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Fale com um especialista
              </h2>
              <p className="text-gray-400 mb-8">
                Nossa equipe está pronta para entender sua operação e mostrar como a Jinbe pode ajudar sua empresa.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">E-mail</p>
                    <a href="mailto:contato@jinbe.com.br" className="text-gray-400 hover:text-blue-500 transition-colors">
                      contato@jinbe.com.br
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">WhatsApp</p>
                    <a href="https://wa.me/5511999999999" className="text-gray-400 hover:text-blue-500 transition-colors">
                      +55 11 99999-9999
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Localização</p>
                    <p className="text-gray-400">Rio de Janeiro, RJ - Brasil</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-[#161b22] border border-white/10 rounded-2xl">
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Recebemos sua mensagem!</h3>
                  <p className="text-gray-400">
                    Um especialista Jinbe entrará em contato em até 24 horas.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nome completo</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">E-mail corporativo</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="voce@empresa.com.br"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Empresa</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Nome da empresa"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Volume mensal estimado</label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    >
                      {volumeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mensagem (opcional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0d1117] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="Conte-nos sobre sua operação..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
                  >
                    Enviar mensagem
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="py-8 sm:py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="col-span-2">
              <img src={logoJinbe} alt="Jinbe" className="h-8 mb-4" />
              <p className="text-gray-400 text-sm max-w-md">
                Infraestrutura financeira para empresas que movem o mundo.
                Pagamentos internacionais rápidos, seguros e até 60% mais baratos.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                  <Globe className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Soluções</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pagamentos internacionais</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Recebimentos do exterior</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Conta multi-moeda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API para empresas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Jinbe. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/termos" className="text-gray-500 hover:text-white transition-colors">Termos de uso</Link>
              <Link to="/privacidade" className="text-gray-500 hover:text-white transition-colors">Política de privacidade</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
