import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import {
  ArrowLeft,
  Building2,
  DollarSign,
  FileText,
  Calendar,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// Mock de armadores/contrapartes cadastrados
const mockContrapartes = [
  { id: '1', nome: 'Spliethoff Transport BV', pais: 'Holanda', moeda: 'USD' },
  { id: '2', nome: 'Intermarine Carriers', pais: 'Alemanha', moeda: 'USD' },
  { id: '3', nome: 'Forestwave Chartering', pais: 'Holanda', moeda: 'EUR' },
  { id: '4', nome: 'Universal Africa Lines', pais: 'Bélgica', moeda: 'USD' },
  { id: '5', nome: 'BOTS NV', pais: 'Holanda', moeda: 'EUR' },
]

type FormStep = 'form' | 'success'

interface FormData {
  contraparteId: string
  valor: string
  moeda: 'USD' | 'EUR'
  invoiceRef: string
  dataPrevista: string
  arquivo: File | null
  observacoes: string
}

const initialFormData: FormData = {
  contraparteId: '',
  valor: '',
  moeda: 'USD',
  invoiceRef: '',
  dataPrevista: '',
  arquivo: null,
  observacoes: '',
}

export default function NewReceivable() {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [step, setStep] = useState<FormStep>('form')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedContraparte = mockContrapartes.find(c => c.id === formData.contraparteId)

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.contraparteId) {
      newErrors.contraparteId = 'Selecione o armador/empresa pagadora'
    }
    if (!formData.valor || parseFloat(formData.valor.replace(/\./g, '').replace(',', '.')) <= 0) {
      newErrors.valor = 'Informe o valor esperado'
    }
    if (!formData.invoiceRef.trim()) {
      newErrors.invoiceRef = 'Informe a referência da invoice'
    }
    if (!formData.dataPrevista) {
      newErrors.dataPrevista = 'Informe a data prevista de pagamento'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setStep('success')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, arquivo: file }))
    }
  }

  const removeFile = () => {
    setFormData(prev => ({ ...prev, arquivo: null }))
  }

  const formatCurrency = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return ''

    // Converte para número e formata
    const amount = parseInt(numbers, 10) / 100
    return amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value)
    setFormData(prev => ({ ...prev, valor: formatted }))
    if (errors.valor) setErrors(prev => ({ ...prev, valor: undefined }))
  }

  // Tela de sucesso
  if (step === 'success') {
    return (
      <>
        <Header title="Recebimento Registrado" subtitle="Invoice cadastrada com sucesso" />

        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
          <div className={`w-full max-w-md p-8 rounded-2xl border text-center ${
            isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
          }`}>
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-jinbe-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-jinbe-success" />
            </div>

            <h2 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Recebimento Registrado
            </h2>
            <p className={`text-sm mb-6 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
              A invoice foi cadastrada e aparecerá no seu painel como "Aguardando pagamento".
              Você será notificado assim que o pagamento for identificado.
            </p>

            <div className={`p-4 rounded-xl mb-6 text-left ${
              isLight ? 'bg-slate-50' : 'bg-jinbe-bg'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">Contraparte</span>
                  <span className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {selectedContraparte?.nome}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">Valor</span>
                  <span className={`text-sm font-mono font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {formData.moeda} {formData.valor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">Invoice</span>
                  <span className={`text-sm font-mono ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                    {formData.invoiceRef}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-jinbe-dim">Previsão</span>
                  <span className={`text-sm ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                    {new Date(formData.dataPrevista).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/')}
                className="w-full px-4 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Voltar ao Painel
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
                Registrar Outro Recebimento
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
      <Header title="Registrar Recebimento" subtitle="Cadastre uma invoice emitida aguardando pagamento" />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-jinbe-muted hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar</span>
        </button>

        {/* Card do formulário */}
        <div className={`rounded-2xl border overflow-hidden ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          <div className="p-6 space-y-6">
            {/* Contraparte */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isLight ? 'text-slate-700' : 'text-jinbe-text'
              }`}>
                <Building2 className="w-4 h-4 inline mr-2 text-jinbe-primary" />
                Armador / Empresa Pagadora
              </label>
              <select
                value={formData.contraparteId}
                onChange={(e) => {
                  const contraparte = mockContrapartes.find(c => c.id === e.target.value)
                  setFormData(prev => ({
                    ...prev,
                    contraparteId: e.target.value,
                    moeda: contraparte?.moeda as 'USD' | 'EUR' || 'USD',
                  }))
                  if (errors.contraparteId) setErrors(prev => ({ ...prev, contraparteId: undefined }))
                }}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors ${
                  errors.contraparteId
                    ? 'border-jinbe-danger focus:border-jinbe-danger'
                    : isLight
                      ? 'border-slate-200 focus:border-jinbe-primary bg-white text-slate-900'
                      : 'border-jinbe-border focus:border-jinbe-primary bg-jinbe-bg text-white'
                } focus:outline-none`}
              >
                <option value="">Selecione o armador...</option>
                {mockContrapartes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.pais})
                  </option>
                ))}
              </select>
              {errors.contraparteId && (
                <p className="mt-1.5 text-xs text-jinbe-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.contraparteId}
                </p>
              )}
              <button className="mt-2 text-xs text-jinbe-primary hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Adicionar novo armador
              </button>
            </div>

            {/* Valor e Moeda */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isLight ? 'text-slate-700' : 'text-jinbe-text'
              }`}>
                <DollarSign className="w-4 h-4 inline mr-2 text-jinbe-primary" />
                Valor Esperado
              </label>
              <div className="flex gap-3">
                <select
                  value={formData.moeda}
                  onChange={(e) => setFormData(prev => ({ ...prev, moeda: e.target.value as 'USD' | 'EUR' }))}
                  className={`w-24 px-3 py-3 rounded-lg border text-sm font-medium transition-colors ${
                    isLight
                      ? 'border-slate-200 focus:border-jinbe-primary bg-white text-slate-900'
                      : 'border-jinbe-border focus:border-jinbe-primary bg-jinbe-bg text-white'
                  } focus:outline-none`}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0,00"
                    value={formData.valor}
                    onChange={handleValorChange}
                    className={`w-full px-4 py-3 rounded-lg border text-sm font-mono transition-colors ${
                      errors.valor
                        ? 'border-jinbe-danger focus:border-jinbe-danger'
                        : isLight
                          ? 'border-slate-200 focus:border-jinbe-primary bg-white text-slate-900'
                          : 'border-jinbe-border focus:border-jinbe-primary bg-jinbe-bg text-white'
                    } focus:outline-none placeholder:text-jinbe-dim`}
                  />
                </div>
              </div>
              {errors.valor && (
                <p className="mt-1.5 text-xs text-jinbe-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.valor}
                </p>
              )}
            </div>

            {/* Referência da Invoice */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isLight ? 'text-slate-700' : 'text-jinbe-text'
              }`}>
                <FileText className="w-4 h-4 inline mr-2 text-jinbe-primary" />
                Referência da Invoice
              </label>
              <input
                type="text"
                placeholder="Ex: INV-2026-0847"
                value={formData.invoiceRef}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, invoiceRef: e.target.value }))
                  if (errors.invoiceRef) setErrors(prev => ({ ...prev, invoiceRef: undefined }))
                }}
                className={`w-full px-4 py-3 rounded-lg border text-sm font-mono transition-colors ${
                  errors.invoiceRef
                    ? 'border-jinbe-danger focus:border-jinbe-danger'
                    : isLight
                      ? 'border-slate-200 focus:border-jinbe-primary bg-white text-slate-900'
                      : 'border-jinbe-border focus:border-jinbe-primary bg-jinbe-bg text-white'
                } focus:outline-none placeholder:text-jinbe-dim`}
              />
              {errors.invoiceRef && (
                <p className="mt-1.5 text-xs text-jinbe-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.invoiceRef}
                </p>
              )}
            </div>

            {/* Data Prevista */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isLight ? 'text-slate-700' : 'text-jinbe-text'
              }`}>
                <Calendar className="w-4 h-4 inline mr-2 text-jinbe-primary" />
                Data Prevista de Pagamento
              </label>
              <input
                type="date"
                value={formData.dataPrevista}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, dataPrevista: e.target.value }))
                  if (errors.dataPrevista) setErrors(prev => ({ ...prev, dataPrevista: undefined }))
                }}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors ${
                  errors.dataPrevista
                    ? 'border-jinbe-danger focus:border-jinbe-danger'
                    : isLight
                      ? 'border-slate-200 focus:border-jinbe-primary bg-white text-slate-900'
                      : 'border-jinbe-border focus:border-jinbe-primary bg-jinbe-bg text-white'
                } focus:outline-none`}
              />
              {errors.dataPrevista && (
                <p className="mt-1.5 text-xs text-jinbe-danger flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.dataPrevista}
                </p>
              )}
            </div>

            {/* Upload da Invoice */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isLight ? 'text-slate-700' : 'text-jinbe-text'
              }`}>
                <Upload className="w-4 h-4 inline mr-2 text-jinbe-primary" />
                Upload da Invoice
                <span className="text-jinbe-dim font-normal ml-1">(opcional)</span>
              </label>

              {formData.arquivo ? (
                <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
                }`}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-jinbe-primary" />
                    <div>
                      <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {formData.arquivo.name}
                      </p>
                      <p className="text-xs text-jinbe-dim">
                        {(formData.arquivo.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1 rounded text-jinbe-dim hover:text-jinbe-danger transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                  isLight
                    ? 'border-slate-200 hover:border-jinbe-primary/50 bg-slate-50'
                    : 'border-jinbe-border hover:border-jinbe-primary/50 bg-jinbe-bg'
                }`}>
                  <Upload className="w-8 h-8 text-jinbe-dim mb-2" />
                  <p className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-jinbe-muted'}`}>
                    Clique para fazer upload
                  </p>
                  <p className="text-xs text-jinbe-dim mt-1">
                    PDF, PNG ou JPG até 10MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Observações */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isLight ? 'text-slate-700' : 'text-jinbe-text'
              }`}>
                Observações
                <span className="text-jinbe-dim font-normal ml-1">(opcional)</span>
              </label>
              <textarea
                placeholder="Informações adicionais sobre este recebimento..."
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border text-sm transition-colors resize-none ${
                  isLight
                    ? 'border-slate-200 focus:border-jinbe-primary bg-white text-slate-900'
                    : 'border-jinbe-border focus:border-jinbe-primary bg-jinbe-bg text-white'
                } focus:outline-none placeholder:text-jinbe-dim`}
              />
            </div>
          </div>

          {/* Footer com botões */}
          <div className={`px-6 py-4 border-t flex flex-col sm:flex-row gap-3 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-jinbe-bg border-jinbe-border'
          }`}>
            <button
              onClick={() => navigate(-1)}
              className={`flex-1 sm:flex-none px-6 py-3 border text-sm font-medium rounded-lg transition-colors ${
                isLight
                  ? 'border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'border-jinbe-border text-jinbe-muted hover:text-white hover:border-jinbe-hover'
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Registrar Recebimento
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
