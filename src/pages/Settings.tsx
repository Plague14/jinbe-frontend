import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import {
  Building2,
  Bell,
  TrendingUp,
  Shield,
  Palette,
  Link2,
  Save,
  Check,
  ChevronRight,
  Mail,
  Smartphone,
  Globe,
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// ─── Types ───────────────────────────────────────────────────────
type SettingsSection = 'company' | 'notifications' | 'alerts' | 'security' | 'appearance' | 'integrations'

interface NotificationSetting {
  id: string
  label: string
  description: string
  email: boolean
  push: boolean
  whatsapp: boolean
}

interface AlertSetting {
  id: string
  currency: string
  targetRate: string
  direction: 'above' | 'below'
  active: boolean
}

// ─── Mock Data ───────────────────────────────────────────────────
const mockCompanyData = {
  name: 'Pescados Atlântico Ltda.',
  cnpj: '12.345.678/0001-99',
  email: 'financeiro@pescados.com.br',
  phone: '(21) 99999-9999',
  address: 'Av. Brasil, 1234 - Rio de Janeiro, RJ',
  responsavel: 'Carlos Ferreira',
}

const defaultNotifications: NotificationSetting[] = [
  { id: 'operation_created', label: 'Nova operação criada', description: 'Quando uma operação de câmbio é iniciada', email: true, push: true, whatsapp: false },
  { id: 'operation_completed', label: 'Operação concluída', description: 'Quando uma operação é finalizada com sucesso', email: true, push: true, whatsapp: true },
  { id: 'pix_received', label: 'PIX recebido', description: 'Quando um PIX é creditado na conta', email: true, push: true, whatsapp: false },
  { id: 'receivable_arrived', label: 'Recebível identificado', description: 'Quando uma remessa do exterior é detectada', email: true, push: true, whatsapp: true },
  { id: 'rate_alert', label: 'Alerta de cotação', description: 'Quando a cotação atinge seu valor alvo', email: true, push: true, whatsapp: true },
  { id: 'weekly_report', label: 'Relatório semanal', description: 'Resumo das operações da semana', email: true, push: false, whatsapp: false },
]

const defaultAlerts: AlertSetting[] = [
  { id: '1', currency: 'EUR', targetRate: '5.50', direction: 'below', active: true },
  { id: '2', currency: 'USD', targetRate: '5.00', direction: 'below', active: false },
]

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const isLight = theme === 'light'

  const [activeSection, setActiveSection] = useState<SettingsSection>('company')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Company state
  const [company, setCompany] = useState(mockCompanyData)

  // Notifications state
  const [notifications, setNotifications] = useState(defaultNotifications)

  // Alerts state
  const [alerts, setAlerts] = useState(defaultAlerts)
  const [newAlertCurrency, setNewAlertCurrency] = useState('EUR')
  const [newAlertRate, setNewAlertRate] = useState('')
  const [newAlertDirection, setNewAlertDirection] = useState<'above' | 'below'>('below')

  // Security state
  const [showApiKey, setShowApiKey] = useState(false)
  const [copiedApiKey, setCopiedApiKey] = useState(false)
  const apiKey = 'jnb_live_k8Xj2m9pL4nQ7wR5tY6u'

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopyApiKey = async () => {
    await navigator.clipboard.writeText(apiKey)
    setCopiedApiKey(true)
    setTimeout(() => setCopiedApiKey(false), 2000)
  }

  const toggleNotification = (id: string, channel: 'email' | 'push' | 'whatsapp') => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, [channel]: !n[channel] } : n)
    )
  }

  const toggleAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a => a.id === id ? { ...a, active: !a.active } : a)
    )
  }

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const addAlert = () => {
    if (!newAlertRate) return
    setAlerts(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        currency: newAlertCurrency,
        targetRate: newAlertRate,
        direction: newAlertDirection,
        active: true,
      }
    ])
    setNewAlertRate('')
  }

  const sections: { id: SettingsSection; label: string; icon: typeof Building2 }[] = [
    { id: 'company', label: 'Dados da Empresa', icon: Building2 },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'alerts', label: 'Alertas de Câmbio', icon: TrendingUp },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'integrations', label: 'Integrações', icon: Link2 },
  ]

  const renderCompanySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Dados da Empresa
        </h3>
        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
          Informações cadastrais da sua empresa
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
            Razão Social
          </label>
          <input
            type="text"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-jinbe-primary transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-jinbe-bg border-jinbe-border text-white'
            }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
            CNPJ
          </label>
          <input
            type="text"
            value={company.cnpj}
            disabled
            className={`w-full px-4 py-3 rounded-lg border cursor-not-allowed ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-500'
                : 'bg-jinbe-border/30 border-jinbe-border text-jinbe-dim'
            }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
            E-mail de contato
          </label>
          <input
            type="email"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-jinbe-primary transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-jinbe-bg border-jinbe-border text-white'
            }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
            Telefone
          </label>
          <input
            type="tel"
            value={company.phone}
            onChange={(e) => setCompany({ ...company, phone: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-jinbe-primary transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-jinbe-bg border-jinbe-border text-white'
            }`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
            Endereço
          </label>
          <input
            type="text"
            value={company.address}
            onChange={(e) => setCompany({ ...company, address: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-jinbe-primary transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-jinbe-bg border-jinbe-border text-white'
            }`}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={`block text-sm font-medium mb-2 ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
            Responsável legal
          </label>
          <input
            type="text"
            value={company.responsavel}
            onChange={(e) => setCompany({ ...company, responsavel: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-jinbe-primary transition-colors ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-jinbe-bg border-jinbe-border text-white'
            }`}
          />
        </div>
      </div>
    </div>
  )

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Preferências de Notificação
        </h3>
        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
          Escolha como deseja receber alertas e atualizações
        </p>
      </div>

      {/* Channel headers */}
      <div className="flex items-center gap-4 pb-2 border-b border-jinbe-border">
        <div className="flex-1" />
        <div className="w-16 text-center">
          <Mail className={`w-4 h-4 mx-auto mb-1 ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`} />
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>E-mail</span>
        </div>
        <div className="w-16 text-center">
          <Smartphone className={`w-4 h-4 mx-auto mb-1 ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`} />
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Push</span>
        </div>
        <div className="w-16 text-center">
          <Globe className={`w-4 h-4 mx-auto mb-1 ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`} />
          <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>WhatsApp</span>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="flex items-center gap-4">
            <div className="flex-1">
              <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {notif.label}
              </p>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
                {notif.description}
              </p>
            </div>
            {(['email', 'push', 'whatsapp'] as const).map((channel) => (
              <div key={channel} className="w-16 flex justify-center">
                <button
                  onClick={() => toggleNotification(notif.id, channel)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    notif[channel]
                      ? 'bg-jinbe-success'
                      : isLight ? 'bg-slate-200' : 'bg-jinbe-border'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    notif[channel] ? 'left-5' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  const renderAlertsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Alertas de Câmbio
        </h3>
        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
          Receba notificações quando a cotação atingir seus valores alvo
        </p>
      </div>

      {/* Existing alerts */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                alert.active ? 'bg-jinbe-success/20' : isLight ? 'bg-slate-100' : 'bg-jinbe-border'
              }`}>
                <TrendingUp className={`w-5 h-5 ${alert.active ? 'text-jinbe-success' : 'text-jinbe-dim'}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {alert.currency}/BRL {alert.direction === 'below' ? 'abaixo de' : 'acima de'} R$ {alert.targetRate}
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
                  {alert.active ? 'Alerta ativo' : 'Alerta pausado'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAlert(alert.id)}
                className={`w-10 h-6 rounded-full relative transition-colors ${
                  alert.active
                    ? 'bg-jinbe-success'
                    : isLight ? 'bg-slate-200' : 'bg-jinbe-border'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  alert.active ? 'left-5' : 'left-1'
                }`} />
              </button>
              <button
                onClick={() => deleteAlert(alert.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isLight
                    ? 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                    : 'text-jinbe-dim hover:text-jinbe-danger hover:bg-jinbe-danger/10'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add new alert */}
      <div className={`p-4 rounded-xl border ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-jinbe-card border-jinbe-border'
      }`}>
        <p className={`text-sm font-medium mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Criar novo alerta
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={newAlertCurrency}
            onChange={(e) => setNewAlertCurrency(e.target.value)}
            className={`px-3 py-2 rounded-lg border text-sm ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-jinbe-bg border-jinbe-border text-white'
            }`}
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
          <select
            value={newAlertDirection}
            onChange={(e) => setNewAlertDirection(e.target.value as 'above' | 'below')}
            className={`px-3 py-2 rounded-lg border text-sm ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900'
                : 'bg-jinbe-bg border-jinbe-border text-white'
            }`}
          >
            <option value="below">Abaixo de</option>
            <option value="above">Acima de</option>
          </select>
          <div className="flex items-center gap-1">
            <span className={`text-sm ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>R$</span>
            <input
              type="text"
              value={newAlertRate}
              onChange={(e) => setNewAlertRate(e.target.value)}
              placeholder="5.50"
              className={`w-24 px-3 py-2 rounded-lg border text-sm ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-900'
                  : 'bg-jinbe-bg border-jinbe-border text-white'
              }`}
            />
          </div>
          <button
            onClick={addAlert}
            disabled={!newAlertRate}
            className="px-4 py-2 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Segurança
        </h3>
        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
          Configurações de segurança e acesso
        </p>
      </div>

      {/* Password change */}
      <div className={`p-4 rounded-xl border ${
        isLight ? 'bg-white border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isLight ? 'bg-slate-100' : 'bg-jinbe-border'
            }`}>
              <Lock className={`w-5 h-5 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Alterar senha
              </p>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
                Última alteração: há 30 dias
              </p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            isLight
              ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
              : 'border-jinbe-border text-jinbe-muted hover:text-white hover:bg-jinbe-hover'
          }`}>
            Alterar
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className={`p-4 rounded-xl border ${
        isLight ? 'bg-white border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isLight ? 'bg-slate-100' : 'bg-jinbe-border'
          }`}>
            <Key className={`w-5 h-5 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`} />
          </div>
          <div>
            <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Chave de API
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
              Use para integrar com seu sistema
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <code className={`flex-1 px-3 py-2 rounded-lg text-sm font-mono ${
            isLight ? 'bg-slate-50 text-slate-700' : 'bg-jinbe-card text-jinbe-muted'
          }`}>
            {showApiKey ? apiKey : '•'.repeat(apiKey.length)}
          </code>
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className={`p-2 rounded-lg transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border'
            }`}
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopyApiKey}
            className={`p-2 rounded-lg transition-colors ${
              copiedApiKey
                ? 'bg-jinbe-success/20 text-jinbe-success'
                : isLight
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border'
            }`}
          >
            {copiedApiKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button className={`p-2 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border'
          }`}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Two-factor auth */}
      <div className={`p-4 rounded-xl border ${
        isLight ? 'bg-white border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-jinbe-success/20`}>
              <Shield className="w-5 h-5 text-jinbe-success" />
            </div>
            <div>
              <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Autenticação em dois fatores
              </p>
              <p className={`text-xs text-jinbe-success`}>
                Ativo via SMS
              </p>
            </div>
          </div>
          <button className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            isLight
              ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
              : 'border-jinbe-border text-jinbe-muted hover:text-white hover:bg-jinbe-hover'
          }`}>
            Configurar
          </button>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Aparência
        </h3>
        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
          Personalize a aparência da plataforma
        </p>
      </div>

      <div>
        <p className={`text-sm font-medium mb-3 ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
          Tema
        </p>
        <div className="flex gap-3">
          {[
            { id: 'light' as const, label: 'Claro', icon: Sun },
            { id: 'dark' as const, label: 'Escuro', icon: Moon },
          ].map((option) => {
            const Icon = option.icon
            const isSelected = theme === option.id
            return (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={`flex-1 p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-jinbe-primary/10 border-jinbe-primary'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300'
                    : 'bg-jinbe-bg border-jinbe-border hover:border-jinbe-hover'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  isSelected ? 'text-jinbe-primary' : isLight ? 'text-slate-400' : 'text-jinbe-dim'
                }`} />
                <p className={`text-sm font-medium ${
                  isSelected
                    ? 'text-jinbe-primary'
                    : isLight ? 'text-slate-700' : 'text-jinbe-muted'
                }`}>
                  {option.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderIntegrationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Integrações
        </h3>
        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
          Conecte a Jinbe com outros sistemas
        </p>
      </div>

      <div className="space-y-3">
        {[
          { name: 'TOTVS Protheus', description: 'ERP integrado via API', status: 'connected', logo: '🔗' },
          { name: 'SAP Business One', description: 'Sincronização de invoices', status: 'available', logo: '📊' },
          { name: 'Slack', description: 'Notificações em tempo real', status: 'available', logo: '💬' },
          { name: 'Webhooks', description: 'Integrações customizadas', status: 'connected', logo: '🔌' },
        ].map((integration) => (
          <div
            key={integration.name}
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-white border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                isLight ? 'bg-slate-100' : 'bg-jinbe-border'
              }`}>
                {integration.logo}
              </div>
              <div>
                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {integration.name}
                </p>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>
                  {integration.description}
                </p>
              </div>
            </div>
            {integration.status === 'connected' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-jinbe-success/10 text-jinbe-success">
                <Check className="w-3 h-3" />
                Conectado
              </span>
            ) : (
              <button className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white hover:bg-jinbe-hover'
              }`}>
                Conectar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'company': return renderCompanySection()
      case 'notifications': return renderNotificationsSection()
      case 'alerts': return renderAlertsSection()
      case 'security': return renderSecuritySection()
      case 'appearance': return renderAppearanceSection()
      case 'integrations': return renderIntegrationsSection()
    }
  }

  return (
    <>
      <Header title="Configurações" subtitle="Preferências da plataforma" />

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 lg:p-8">
        {/* Sidebar Navigation */}
        <aside className={`lg:w-64 shrink-0 rounded-xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          <nav className="p-2">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-jinbe-primary/10 text-jinbe-primary'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-50'
                      : 'text-jinbe-muted hover:bg-jinbe-hover'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 rounded-xl border p-6 ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          {renderSection()}

          {/* Save Button */}
          <div className="flex justify-end mt-8 pt-6 border-t border-jinbe-border">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Salvo!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar alterações
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </>
  )
}
