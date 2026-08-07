import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Landmark,
  Globe,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const countries = [
  { code: 'NL', name: 'Holanda' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'FR', name: 'França' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'IT', name: 'Itália' },
  { code: 'ES', name: 'Espanha' },
  { code: 'PT', name: 'Portugal' },
  { code: 'SE', name: 'Suécia' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'CH', name: 'Suíça' },
  { code: 'AT', name: 'Áustria' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'CN', name: 'China' },
  { code: 'US', name: 'Estados Unidos' },
]

type FormStep = 'form' | 'submitting' | 'success'

interface FormData {
  legalName: string
  tradeName: string
  taxId: string
  email: string
  street: string
  city: string
  postalCode: string
  country: string
  iban: string
  bic: string
  bankName: string
  currency: string
}

const initialFormData: FormData = {
  legalName: '',
  tradeName: '',
  taxId: '',
  email: '',
  street: '',
  city: '',
  postalCode: '',
  country: '',
  iban: '',
  bic: '',
  bankName: '',
  currency: 'USD',
}

export default function BeneficiaryForm() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [step, setStep] = useState<FormStep>('form')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.legalName.trim()) newErrors.legalName = 'Nome da empresa é obrigatório'
    if (!formData.country) newErrors.country = 'País é obrigatório'
    if (!formData.iban.trim()) newErrors.iban = 'IBAN é obrigatório'
    if (!formData.bic.trim()) newErrors.bic = 'SWIFT/BIC é obrigatório'
    if (!formData.bankName.trim()) newErrors.bankName = 'Nome do banco é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setStep('submitting')

    // Simular envio para API Urban
    await new Promise(resolve => setTimeout(resolve, 2000))

    setStep('success')
  }

  const cardClass = `rounded-xl border ${
    isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
  }`
  const inputClass = `w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none ${
    isLight
      ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-jinbe-primary'
      : 'bg-jinbe-bg border-jinbe-border text-white placeholder:text-jinbe-dim focus:border-jinbe-primary'
  }`
  const labelClass = `text-xs font-medium ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`
  const sectionTitleClass = `text-base font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`

  // Tela de sucesso (T4-B)
  if (step === 'success') {
    const selectedCountry = countries.find(c => c.code === formData.country)

    return (
      <>
        <Header title="Contraparte Enviada" subtitle="Aguardando aprovação da Urban" />

        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <div className={`w-full max-w-md p-8 rounded-2xl border text-center ${cardClass}`}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-jinbe-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-jinbe-success" />
            </div>

            <h2 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Contraparte Enviada para Aprovação
            </h2>
            <p className={`text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
              A Urban Exchange irá validar os dados bancários. Você será notificado quando estiver pronto.
            </p>

            {/* Resumo */}
            <div className={`p-4 rounded-xl mb-6 text-left ${
              isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">Empresa</span>
                  <span className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {formData.legalName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">País</span>
                  <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                    {selectedCountry?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">Banco</span>
                  <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                    {formData.bankName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">IBAN</span>
                  <span className={`text-sm font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                    {formData.iban.slice(0, 10)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Prazo */}
            <div className={`flex items-center gap-3 p-3 rounded-lg mb-6 ${
              isLight ? 'bg-jinbe-warning/5 border border-jinbe-warning/20' : 'bg-jinbe-warning/10'
            }`}>
              <Clock className="w-5 h-5 text-jinbe-warning shrink-0" />
              <p className={`text-sm text-left ${isLight ? 'text-jinbe-warning' : 'text-jinbe-warning'}`}>
                <strong>Prazo:</strong> 1 a 3 dias úteis para aprovação
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/beneficiaries')}
                className="w-full px-4 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Ver Todas as Contrapartes
              </button>
              <button
                onClick={() => {
                  setFormData(initialFormData)
                  setStep('form')
                }}
                className={`w-full px-4 py-3 border text-sm font-medium rounded-lg transition-colors ${
                  isLight
                    ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
                }`}
              >
                Cadastrar Outra Contraparte
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Formulário principal
  return (
    <>
      <Header title="Nova Contraparte" subtitle="Cadastrar fornecedor ou armador internacional" />

      <div className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-6">
          <Link
            to="/beneficiaries"
            className={`flex items-center gap-2 text-sm transition-colors w-fit ${
              isLight ? 'text-slate-600 hover:text-slate-900' : 'text-jinbe-muted hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Contrapartes
          </Link>

          {/* Informações da Empresa */}
          <div className={`flex flex-col gap-5 p-6 ${cardClass}`}>
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                isLight ? 'bg-jinbe-primary/10' : 'bg-jinbe-primary/20'
              }`}>
                <Building2 className="w-4 h-4 text-jinbe-primary" />
              </div>
              <h2 className={sectionTitleClass}>Informações da Empresa</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className={labelClass}>
                  Nome da Empresa <span className="text-jinbe-danger">*</span>
                </label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => handleChange('legalName', e.target.value)}
                  placeholder="Ex: Spliethoff Transport BV"
                  className={`${inputClass} ${errors.legalName ? 'border-jinbe-danger' : ''}`}
                />
                {errors.legalName && (
                  <p className="text-xs text-jinbe-danger flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.legalName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>País <span className="text-jinbe-danger">*</span></label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className={`${inputClass} ${errors.country ? 'border-jinbe-danger' : ''}`}
                >
                  <option value="">Selecione o país</option>
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-xs text-jinbe-danger flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.country}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Moeda de Preferência</label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className={inputClass}
                >
                  <option value="USD">USD - Dólar Americano</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - Libra Esterlina</option>
                </select>
              </div>
            </div>
          </div>

          {/* Conta Bancária */}
          <div className={`flex flex-col gap-5 p-6 ${cardClass}`}>
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                isLight ? 'bg-jinbe-primary/10' : 'bg-jinbe-primary/20'
              }`}>
                <Landmark className="w-4 h-4 text-jinbe-primary" />
              </div>
              <h2 className={sectionTitleClass}>Conta Bancária</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Nome do Banco <span className="text-jinbe-danger">*</span></label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  placeholder="Ex: ING Bank"
                  className={`${inputClass} ${errors.bankName ? 'border-jinbe-danger' : ''}`}
                />
                {errors.bankName && (
                  <p className="text-xs text-jinbe-danger flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.bankName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>SWIFT/BIC <span className="text-jinbe-danger">*</span></label>
                <input
                  type="text"
                  value={formData.bic}
                  onChange={(e) => handleChange('bic', e.target.value.toUpperCase())}
                  placeholder="Ex: INGBNL2A"
                  className={`${inputClass} font-mono ${errors.bic ? 'border-jinbe-danger' : ''}`}
                />
                {errors.bic && (
                  <p className="text-xs text-jinbe-danger flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.bic}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className={labelClass}>IBAN ou Número de Conta <span className="text-jinbe-danger">*</span></label>
                <input
                  type="text"
                  value={formData.iban}
                  onChange={(e) => handleChange('iban', e.target.value.toUpperCase())}
                  placeholder="Ex: NL91ABNA0417164300"
                  className={`${inputClass} font-mono ${errors.iban ? 'border-jinbe-danger' : ''}`}
                />
                {errors.iban && (
                  <p className="text-xs text-jinbe-danger flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.iban}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Aviso */}
          <div className={`flex items-start gap-3 p-4 rounded-xl ${
            isLight ? 'bg-blue-50 border border-blue-100' : 'bg-jinbe-primary/5 border border-jinbe-primary/20'
          }`}>
            <Globe className={`w-5 h-5 shrink-0 mt-0.5 ${isLight ? 'text-blue-600' : 'text-jinbe-primary'}`} />
            <div>
              <p className={`text-sm font-medium ${isLight ? 'text-blue-900' : 'text-jinbe-primary'}`}>
                Aprovação necessária
              </p>
              <p className={`text-xs mt-1 ${isLight ? 'text-blue-700' : 'text-jinbe-primary/70'}`}>
                A contraparte será enviada para validação pela Urban Exchange.
                Você será notificado assim que estiver aprovada para receber pagamentos.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            <Link
              to="/beneficiaries"
              className={`px-5 py-2.5 border text-sm font-medium rounded-lg transition-colors text-center ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white'
              }`}
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={step === 'submitting'}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {step === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Solicitar Aprovação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
