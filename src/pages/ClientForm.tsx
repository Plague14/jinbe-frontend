import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Building2, User, FileText, CreditCard } from 'lucide-react'

interface FormSection {
  title: string
  icon: typeof Building2
  fields: { label: string; name: string; type: string; placeholder: string; required?: boolean; colSpan?: number; options?: string[] }[]
}

const sections: FormSection[] = [
  {
    title: 'Company Information',
    icon: Building2,
    fields: [
      { label: 'Company Name', name: 'companyName', type: 'text', placeholder: 'e.g. TechCorp Brasil LTDA', required: true },
      { label: 'Trade Name', name: 'tradeName', type: 'text', placeholder: 'e.g. TechCorp' },
      { label: 'CNPJ', name: 'cnpj', type: 'text', placeholder: '00.000.000/0000-00', required: true },
      { label: 'State Registration', name: 'stateReg', type: 'text', placeholder: 'Inscrição Estadual' },
      { label: 'Industry', name: 'industry', type: 'select', placeholder: 'Select industry', options: ['Technology', 'Agriculture', 'Manufacturing', 'Financial Services', 'Import/Export', 'Other'] },
      { label: 'Company Size', name: 'companySize', type: 'select', placeholder: 'Select size', options: ['Micro', 'Small', 'Medium', 'Large', 'Enterprise'] },
    ],
  },
  {
    title: 'Contact Information',
    icon: User,
    fields: [
      { label: 'Contact Name', name: 'contactName', type: 'text', placeholder: 'Full name', required: true },
      { label: 'Position/Role', name: 'position', type: 'text', placeholder: 'e.g. CFO' },
      { label: 'Email', name: 'email', type: 'email', placeholder: 'email@company.com.br', required: true },
      { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+55 11 0000-0000', required: true },
      { label: 'Address', name: 'address', type: 'text', placeholder: 'Street address', colSpan: 2 },
      { label: 'City', name: 'city', type: 'text', placeholder: 'City', required: true },
      { label: 'State', name: 'state', type: 'text', placeholder: 'UF' },
      { label: 'ZIP Code', name: 'zip', type: 'text', placeholder: '00000-000' },
    ],
  },
  {
    title: 'Compliance & Documents',
    icon: FileText,
    fields: [
      { label: 'Expected Monthly Volume (BRL)', name: 'monthlyVolume', type: 'text', placeholder: 'R$ 0.00', required: true },
      { label: 'Expected Operations/Month', name: 'monthlyOps', type: 'number', placeholder: '0' },
      { label: 'Purpose of Transfers', name: 'purpose', type: 'select', placeholder: 'Select purpose', options: ['Supplier Payments', 'Service Fees', 'Royalties', 'Dividends', 'Trade Finance', 'Other'], required: true },
      { label: 'Risk Category', name: 'riskCategory', type: 'select', placeholder: 'Assign risk level', options: ['Low', 'Medium', 'High'] },
    ],
  },
  {
    title: 'Bank Account (PIX)',
    icon: CreditCard,
    fields: [
      { label: 'Bank Name', name: 'bankName', type: 'text', placeholder: 'e.g. Banco do Brasil', required: true },
      { label: 'Bank Code', name: 'bankCode', type: 'text', placeholder: '001' },
      { label: 'Agency', name: 'agency', type: 'text', placeholder: '0000', required: true },
      { label: 'Account Number', name: 'accountNumber', type: 'text', placeholder: '00000-0', required: true },
      { label: 'PIX Key', name: 'pixKey', type: 'text', placeholder: 'CNPJ, email or phone', required: true },
      { label: 'PIX Key Type', name: 'pixKeyType', type: 'select', placeholder: 'Select type', options: ['CNPJ', 'Email', 'Phone', 'Random Key'], required: true },
    ],
  },
]

export default function ClientForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/clients')
  }

  return (
    <>
      <Header title="Register Client" subtitle="Add a new client to the platform" />

      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl flex flex-col gap-8">
          {/* Back link */}
          <Link
            to="/clients"
            className="flex items-center gap-2 text-sm text-jinbe-muted hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Clients
          </Link>

          {/* Sections */}
          {sections.map((section) => {
            const SectionIcon = section.icon
            return (
              <div key={section.title} className="flex flex-col gap-5 p-6 rounded-xl border border-jinbe-border bg-jinbe-card">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-jinbe-primary/10">
                    <SectionIcon className="w-4 h-4 text-jinbe-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-white">{section.title}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.name} className={`flex flex-col gap-1.5 ${field.colSpan === 2 ? 'col-span-2' : ''}`}>
                      <label className="text-xs font-medium text-jinbe-muted">
                        {field.label}
                        {field.required && <span className="text-jinbe-danger ml-0.5">*</span>}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={formData[field.name] || ''}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white focus:outline-none focus:border-jinbe-primary appearance-none"
                        >
                          <option value="" className="text-jinbe-dim">{field.placeholder}</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="px-4 py-2.5 bg-jinbe-bg border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/clients"
              className="px-5 py-2.5 border border-jinbe-border text-jinbe-muted hover:text-white text-sm font-medium rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Register Client
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
