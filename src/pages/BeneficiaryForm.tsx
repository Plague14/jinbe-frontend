import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Landmark, Globe, Building2 } from 'lucide-react'

const countries = [
  'Germany', 'France', 'Netherlands', 'Italy', 'Spain', 'Portugal',
  'Sweden', 'Ireland', 'Switzerland', 'Belgium', 'Austria', 'Luxembourg',
]

export default function BeneficiaryForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/beneficiaries')
  }

  return (
    <>
      <Header title="Novo Beneficiário" subtitle="Cadastrar um beneficiário SEPA europeu" />

      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl flex flex-col gap-8">
          <Link
            to="/beneficiaries"
            className="flex items-center gap-2 text-sm text-jinbe-muted hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Beneficiários
          </Link>

          {/* Beneficiary Info */}
          <div className="flex flex-col gap-5 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-jinbe-primary/10">
                <Building2 className="w-4 h-4 text-jinbe-primary" />
              </div>
              <h2 className="text-base font-semibold text-white">Informações do Beneficiário</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">Razão Social <span className="text-jinbe-danger">*</span></label>
                <input type="text" value={formData.legalName || ''} onChange={(e) => handleChange('legalName', e.target.value)} placeholder="e.g. Schmidt GmbH" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">Nome Fantasia</label>
                <input type="text" value={formData.tradeName || ''} onChange={(e) => handleChange('tradeName', e.target.value)} placeholder="Trading as..." className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">ID Fiscal / VAT <span className="text-jinbe-danger">*</span></label>
                <input type="text" value={formData.taxId || ''} onChange={(e) => handleChange('taxId', e.target.value)} placeholder="e.g. DE123456789" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">Email <span className="text-jinbe-danger">*</span></label>
                <input type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} placeholder="contact@company.eu" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-5 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-jinbe-primary/10">
                <Globe className="w-4 h-4 text-jinbe-primary" />
              </div>
              <h2 className="text-base font-semibold text-white">Endereço</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">Rua e Número <span className="text-jinbe-danger">*</span></label>
                <input type="text" value={formData.street || ''} onChange={(e) => handleChange('street', e.target.value)} placeholder="Street name and number" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">Cidade <span className="text-jinbe-danger">*</span></label>
                <input type="text" value={formData.city || ''} onChange={(e) => handleChange('city', e.target.value)} placeholder="City" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">Código Postal <span className="text-jinbe-danger">*</span></label>
                <input type="text" value={formData.postalCode || ''} onChange={(e) => handleChange('postalCode', e.target.value)} placeholder="e.g. 10115" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">País <span className="text-jinbe-danger">*</span></label>
                <select value={formData.country || ''} onChange={(e) => handleChange('country', e.target.value)} required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white focus:outline-none focus:border-jinbe-primary appearance-none">
                  <option value="">Selecione o país</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Bank Account */}
          <div className="flex flex-col gap-5 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-jinbe-primary/10">
                <Landmark className="w-4 h-4 text-jinbe-primary" />
              </div>
              <h2 className="text-base font-semibold text-white">Conta Bancária SEPA</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">IBAN <span className="text-jinbe-danger">*</span></label>
                <input type="text" value={formData.iban || ''} onChange={(e) => handleChange('iban', e.target.value)} placeholder="e.g. DE89 3704 0044 0532 0130 00" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm font-mono text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">BIC / SWIFT <span className="text-jinbe-danger">*</span></label>
                <input type="text" value={formData.bic || ''} onChange={(e) => handleChange('bic', e.target.value)} placeholder="e.g. COBADEFFXXX" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm font-mono text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">Nome do Banco <span className="text-jinbe-danger">*</span></label>
                <input type="text" value={formData.bankName || ''} onChange={(e) => handleChange('bankName', e.target.value)} placeholder="e.g. Commerzbank" required className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-jinbe-muted">Moeda</label>
                <select value={formData.currency || 'EUR'} onChange={(e) => handleChange('currency', e.target.value)} className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white focus:outline-none focus:border-jinbe-primary appearance-none">
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CHF">CHF - Swiss Franc</option>
                  <option value="SEK">SEK - Swedish Krona</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/beneficiaries"
              className="px-5 py-2.5 border border-jinbe-border text-jinbe-muted hover:text-white text-sm font-medium rounded-lg transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Cadastrar Beneficiário
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
