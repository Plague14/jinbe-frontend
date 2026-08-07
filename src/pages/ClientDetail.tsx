import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  Edit2,
  Plus,
  Landmark,
  Trash2,
  Globe,
  MoreHorizontal,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { useTheme } from '@/contexts/ThemeContext'

type ClientStatus = 'active' | 'pending' | 'suspended'
type BeneficiaryStatus = 'verified' | 'pending_verification'

interface Client {
  id: string
  name: string
  cnpj: string
  email: string
  phone: string
  city: string
  country: string
  status: ClientStatus
  totalVolume: string
  opsCount: number
  lastOp: string
  createdAt: string
}

interface Beneficiary {
  id: string
  name: string
  iban: string
  bic: string
  bank: string
  country: string
  currency: string
  status: BeneficiaryStatus
  totalReceived: string
}

const mockClients: Client[] = [
  { id: 'CL-001', name: 'TechCorp Brasil', cnpj: '12.345.678/0001-90', email: 'finance@techcorp.com.br', phone: '+55 11 3456-7890', city: 'São Paulo', country: 'BR', status: 'active', totalVolume: '€ 1,245,000', opsCount: 87, lastOp: '2024-03-28', createdAt: '2023-06-15' },
  { id: 'CL-002', name: 'Exporta Sul LTDA', cnpj: '23.456.789/0001-01', email: 'ops@exportasul.com.br', phone: '+55 51 2345-6789', city: 'Porto Alegre', country: 'BR', status: 'active', totalVolume: '€ 892,500', opsCount: 64, lastOp: '2024-03-28', createdAt: '2023-08-22' },
  { id: 'CL-003', name: 'Agro Norte SA', cnpj: '34.567.890/0001-12', email: 'financeiro@agronorte.com.br', phone: '+55 92 3456-7890', city: 'Manaus', country: 'BR', status: 'active', totalVolume: '€ 2,130,000', opsCount: 142, lastOp: '2024-03-27', createdAt: '2023-04-10' },
  { id: 'CL-004', name: 'Digital Pay ME', cnpj: '45.678.901/0001-23', email: 'treasury@digitalpay.com.br', phone: '+55 21 4567-8901', city: 'Rio de Janeiro', country: 'BR', status: 'pending', totalVolume: '€ 156,800', opsCount: 12, lastOp: '2024-03-26', createdAt: '2024-02-01' },
  { id: 'CL-005', name: 'Comex Partners', cnpj: '56.789.012/0001-34', email: 'comex@partners.com.br', phone: '+55 11 5678-9012', city: 'São Paulo', country: 'BR', status: 'suspended', totalVolume: '€ 430,200', opsCount: 31, lastOp: '2024-03-20', createdAt: '2023-11-05' },
  { id: 'CL-006', name: 'Banco Flex', cnpj: '67.890.123/0001-45', email: 'international@bancoflex.com.br', phone: '+55 11 6789-0123', city: 'São Paulo', country: 'BR', status: 'active', totalVolume: '€ 3,870,000', opsCount: 256, lastOp: '2024-03-28', createdAt: '2023-01-20' },
]

const mockBeneficiaries: Record<string, Beneficiary[]> = {
  'CL-001': [
    { id: 'BN-001', name: 'Schmidt GmbH', iban: 'DE89 3704 0044 0532 0130 00', bic: 'COBADEFFXXX', bank: 'Commerzbank', country: 'Alemanha', currency: 'EUR', status: 'verified', totalReceived: '€ 245,600' },
    { id: 'BN-002', name: 'Pierre Dupont SA', iban: 'FR76 3000 6000 0112 3456 7890 189', bic: 'BNPAFRPPXXX', bank: 'BNP Paribas', country: 'França', currency: 'EUR', status: 'verified', totalReceived: '€ 189,300' },
  ],
  'CL-002': [
    { id: 'BN-003', name: 'Van der Berg BV', iban: 'NL91 ABNA 0417 1643 00', bic: 'ABNANL2AXXX', bank: 'ABN AMRO', country: 'Holanda', currency: 'EUR', status: 'verified', totalReceived: '€ 132,050' },
  ],
  'CL-003': [
    { id: 'BN-004', name: 'Rossi SpA', iban: 'IT60 X054 2811 1010 0000 0123 456', bic: 'BPMOIT22XXX', bank: 'Banco BPM', country: 'Itália', currency: 'EUR', status: 'pending_verification', totalReceived: '€ 6,280' },
    { id: 'BN-005', name: 'García Hermanos SL', iban: 'ES91 2100 0418 4502 0005 1332', bic: 'CABORABBXXX', bank: 'CaixaBank', country: 'Espanha', currency: 'EUR', status: 'verified', totalReceived: '€ 78,900' },
    { id: 'BN-006', name: 'Nordic Solutions AB', iban: 'SE45 5000 0000 0583 9825 7466', bic: 'ESSESESSXXX', bank: 'SEB', country: 'Suécia', currency: 'EUR', status: 'verified', totalReceived: '€ 56,480' },
  ],
  'CL-004': [
    { id: 'BN-007', name: 'Crown Logistics UK', iban: 'GB29 NWBK 6016 1331 9268 19', bic: 'NWBKGB2L', bank: 'NatWest', country: 'Reino Unido', currency: 'GBP', status: 'verified', totalReceived: '£ 26,410' },
  ],
  'CL-005': [],
  'CL-006': [
    { id: 'BN-008', name: 'Müller AG', iban: 'CH93 0076 2011 6238 5295 7', bic: 'UBSWCHZH80A', bank: 'UBS', country: 'Suíça', currency: 'CHF', status: 'verified', totalReceived: 'CHF 98,395' },
    { id: 'BN-009', name: 'Apex Trading LLC', iban: '021000021 / 123456789', bic: 'CHASUS33', bank: 'JPMorgan Chase', country: 'EUA', currency: 'USD', status: 'verified', totalReceived: '$ 412,000' },
  ],
}

const statusConfig = {
  active: { label: 'Ativo', color: 'bg-jinbe-success/20 text-jinbe-success', icon: CheckCircle2 },
  pending: { label: 'Pendente', color: 'bg-jinbe-warning/20 text-jinbe-warning', icon: Clock },
  suspended: { label: 'Suspenso', color: 'bg-jinbe-danger/20 text-jinbe-danger', icon: XCircle },
}

const beneficiaryStatusConfig: Record<BeneficiaryStatus, { label: string; className: string }> = {
  verified: { label: 'Verificado', className: 'bg-jinbe-success/10 text-jinbe-success' },
  pending_verification: { label: 'Pendente', className: 'bg-jinbe-warning/10 text-jinbe-warning' },
}

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const [client, setClient] = useState<Client | null>(null)
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      const found = mockClients.find((c) => c.id === id)
      setClient(found || null)
      setBeneficiaries(mockBeneficiaries[id || ''] || [])
      setIsLoading(false)
    }, 300)
  }, [id])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-jinbe-bg">
        <Header title="Detalhes do Cliente" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-jinbe-primary animate-spin" />
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-jinbe-bg">
        <Header title="Cliente não encontrado" />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <AlertCircle className="w-16 h-16 text-jinbe-dim mb-4" />
          <h2 className={`text-xl font-semibold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Cliente não encontrado</h2>
          <p className="text-jinbe-muted mb-6">O cliente com ID "{id}" não existe.</p>
          <Link
            to="/clients"
            className="flex items-center gap-2 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Clientes
          </Link>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[client.status].icon

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50' : 'bg-jinbe-bg'}`}>
      <Header title="Detalhes do Cliente" subtitle={client.name} />

      <div className="px-4 sm:px-6 py-6 max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/clients')}
          className={`flex items-center gap-2 mb-6 transition-colors ${
            isLight ? 'text-slate-600 hover:text-slate-900' : 'text-jinbe-muted hover:text-white'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Clientes
        </button>

        {/* Client Info Card */}
        <div className={`rounded-xl border overflow-hidden mb-6 ${
          isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
        }`}>
          {/* Header */}
          <div className={`p-6 border-b ${isLight ? 'border-slate-100' : 'border-jinbe-border'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-jinbe-primary/10 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-jinbe-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{client.name}</h1>
                    <button
                      onClick={() => copyToClipboard(client.id)}
                      className={`p-1 rounded transition-colors ${
                        isLight ? 'hover:bg-slate-100' : 'hover:bg-jinbe-border'
                      }`}
                    >
                      {copiedId ? (
                        <CheckCircle2 className="w-4 h-4 text-jinbe-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-jinbe-dim" />
                      )}
                    </button>
                  </div>
                  <p className={`text-sm font-mono ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>{client.cnpj}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig[client.status].color}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig[client.status].label}
                </span>
                <button className="flex items-center gap-2 px-4 py-2 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-medium rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                  Editar
                </button>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className={`text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>E-mail</p>
                <p className={`text-sm font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Mail className="w-4 h-4 text-jinbe-dim" />
                  {client.email}
                </p>
              </div>
              <div>
                <p className={`text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Telefone</p>
                <p className={`text-sm font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Phone className="w-4 h-4 text-jinbe-dim" />
                  {client.phone}
                </p>
              </div>
              <div>
                <p className={`text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Localização</p>
                <p className={`text-sm font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <MapPin className="w-4 h-4 text-jinbe-dim" />
                  {client.city}, {client.country}
                </p>
              </div>
              <div>
                <p className={`text-xs mb-1 ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Cliente desde</p>
                <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>{client.createdAt}</p>
              </div>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-4 mt-6 pt-6 border-t ${isLight ? 'border-slate-100' : 'border-jinbe-border'}`}>
              <div className={`p-4 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-jinbe-bg/50'}`}>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Volume Total</p>
                <p className={`text-xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{client.totalVolume}</p>
              </div>
              <div className={`p-4 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-jinbe-bg/50'}`}>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Operações</p>
                <p className={`text-xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{client.opsCount}</p>
              </div>
              <div className={`p-4 rounded-lg ${isLight ? 'bg-slate-50' : 'bg-jinbe-bg/50'}`}>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Última Operação</p>
                <p className={`text-xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{client.lastOp}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiaries / Bank Accounts Section */}
        <div className={`rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'}`}>
          <div className={`flex items-center justify-between p-5 border-b ${isLight ? 'border-slate-100' : 'border-jinbe-border'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-jinbe-primary/10 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-jinbe-primary" />
              </div>
              <div>
                <h2 className={`text-base font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Contas Bancárias</h2>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Destinatários cadastrados para pagamentos</p>
              </div>
            </div>
            <Link
              to="/beneficiaries/new"
              className="flex items-center gap-2 px-4 py-2 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Conta</span>
            </Link>
          </div>

          {beneficiaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isLight ? 'bg-slate-100' : 'bg-jinbe-border'}`}>
                <Landmark className={`w-8 h-8 ${isLight ? 'text-slate-400' : 'text-jinbe-dim'}`} />
              </div>
              <h3 className={`text-base font-medium mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>Nenhuma conta cadastrada</h3>
              <p className={`text-sm mb-4 text-center ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>
                Cadastre contas bancárias para enviar pagamentos
              </p>
              <Link
                to="/beneficiaries/new"
                className="flex items-center gap-2 px-5 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Conta
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-jinbe-border">
              {beneficiaries.map((ben) => (
                <div key={ben.id} className={`p-5 transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-jinbe-hover/20'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100' : 'bg-jinbe-border'}`}>
                        <Globe className={`w-5 h-5 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ben.name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${beneficiaryStatusConfig[ben.status].className}`}>
                            {ben.status === 'verified' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {beneficiaryStatusConfig[ben.status].label}
                          </span>
                        </div>
                        <p className={`text-xs font-mono truncate ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>{ben.iban}</p>
                        <div className={`flex items-center gap-3 mt-1 text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-muted'}`}>
                          <span>{ben.bank}</span>
                          <span>•</span>
                          <span>{ben.country}</span>
                          <span>•</span>
                          <span>{ben.currency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Total Recebido</p>
                        <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ben.totalReceived}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className={`p-2 rounded-lg transition-colors ${
                          isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-jinbe-dim hover:text-white hover:bg-jinbe-border/50'
                        }`}>
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                          isLight ? 'text-slate-400 hover:text-jinbe-danger hover:bg-red-50' : 'text-jinbe-dim hover:text-jinbe-danger hover:bg-jinbe-danger/10'
                        }`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
