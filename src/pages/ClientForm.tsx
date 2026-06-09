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
    title: 'Informações da Empresa',
    icon: Building2,
    fields: [
      { label: 'Razão Social', name: 'companyName', type: 'text', placeholder: 'ex: TechCorp Brasil LTDA', required: true },
      { label: 'Nome Fantasia', name: 'tradeName', type: 'text', placeholder: 'ex: TechCorp' },
      { label: 'CNPJ', name: 'cnpj', type: 'text', placeholder: '00.000.000/0000-00', required: true },
      { label: 'Inscrição Estadual', name: 'stateReg', type: 'text', placeholder: 'Inscrição Estadual' },
      { label: 'Setor', name: 'industry', type: 'select', placeholder: 'Selecione o setor', options: ['Tecnologia', 'Agronegócio', 'Indústria', 'Serviços Financeiros', 'Importação/Exportação', 'Outros'] },
      { label: 'Porte da Empresa', name: 'companySize', type: 'select', placeholder: 'Selecione o porte', options: ['Micro', 'Pequena', 'Média', 'Grande', 'Enterprise'] },
    ],
  },
  {
    title: 'Informações de Contato',
    icon: User,
    fields: [
      { label: 'Nome do Contato', name: 'contactName', type: 'text', placeholder: 'Nome completo', required: true },
      { label: 'Cargo', name: 'position', type: 'text', placeholder: 'ex: CFO' },
      { label: 'E-mail', name: 'email', type: 'email', placeholder: 'email@empresa.com.br', required: true },
      { label: 'Telefone', name: 'phone', type: 'tel', placeholder: '+55 11 0000-0000', required: true },
      { label: 'Endereço', name: 'address', type: 'text', placeholder: 'Rua e número', colSpan: 2 },
      { label: 'Cidade', name: 'city', type: 'text', placeholder: 'Cidade', required: true },
      { label: 'Estado', name: 'state', type: 'text', placeholder: 'UF' },
      { label: 'CEP', name: 'zip', type: 'text', placeholder: '00000-000' },
    ],
  },
  {
    title: 'Compliance e Documentos',
    icon: FileText,
    fields: [
      { label: 'Volume Mensal Esperado (BRL)', name: 'monthlyVolume', type: 'text', placeholder: 'R$ 0,00', required: true },
      { label: 'Operações/Mês Esperadas', name: 'monthlyOps', type: 'number', placeholder: '0' },
      { label: 'Finalidade das Transferências', name: 'purpose', type: 'select', placeholder: 'Selecione a finalidade', options: ['Pagamento a Fornecedores', 'Taxas de Serviço', 'Royalties', 'Dividendos', 'Financiamento Comercial', 'Outros'], required: true },
      { label: 'Categoria de Risco', name: 'riskCategory', type: 'select', placeholder: 'Atribuir nível de risco', options: ['Baixo', 'Médio', 'Alto'] },
    ],
  },
  {
    title: 'Conta Bancária (PIX)',
    icon: CreditCard,
    fields: [
      { label: 'Nome do Banco', name: 'bankName', type: 'text', placeholder: 'ex: Banco do Brasil', required: true },
      { label: 'Código do Banco', name: 'bankCode', type: 'text', placeholder: '001' },
      { label: 'Agência', name: 'agency', type: 'text', placeholder: '0000', required: true },
      { label: 'Número da Conta', name: 'accountNumber', type: 'text', placeholder: '00000-0', required: true },
      { label: 'Chave PIX', name: 'pixKey', type: 'text', placeholder: 'CNPJ, e-mail ou telefone', required: true },
      { label: 'Tipo da Chave PIX', name: 'pixKeyType', type: 'select', placeholder: 'Selecione o tipo', options: ['CNPJ', 'E-mail', 'Telefone', 'Chave Aleatória'], required: true },
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
      <Header title="Cadastrar Cliente" subtitle="Adicionar um novo cliente à plataforma" />

      <div className="p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl flex flex-col gap-8">
          {/* Back link */}
          <Link
            to="/clients"
            className="flex items-center gap-2 text-sm text-jinbe-muted hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Clientes
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
              Cancelar
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Cadastrar Cliente
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
