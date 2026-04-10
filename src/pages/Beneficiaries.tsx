import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Landmark,
  Globe,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'

type BeneficiaryStatus = 'verified' | 'pending_verification'

interface Beneficiary {
  id: string
  name: string
  iban: string
  bic: string
  bank: string
  country: string
  currency: string
  status: BeneficiaryStatus
  linkedClients: number
  totalReceived: string
}

const statusConfig: Record<BeneficiaryStatus, { label: string; className: string }> = {
  verified: { label: 'Verified', className: 'bg-jinbe-success/10 text-jinbe-success' },
  pending_verification: { label: 'Pending', className: 'bg-jinbe-warning/10 text-jinbe-warning' },
}

const mockBeneficiaries: Beneficiary[] = [
  { id: 'BN-001', name: 'Schmidt GmbH', iban: 'DE89 3704 0044 0532 0130 00', bic: 'COBADEFFXXX', bank: 'Commerzbank', country: 'Germany', currency: 'EUR', status: 'verified', linkedClients: 3, totalReceived: '€ 245,600' },
  { id: 'BN-002', name: 'Pierre Dupont SA', iban: 'FR76 3000 6000 0112 3456 7890 189', bic: 'BNPAFRPPXXX', bank: 'BNP Paribas', country: 'France', currency: 'EUR', status: 'verified', linkedClients: 2, totalReceived: '€ 189,300' },
  { id: 'BN-003', name: 'Van der Berg BV', iban: 'NL91 ABNA 0417 1643 00', bic: 'ABNANL2AXXX', bank: 'ABN AMRO', country: 'Netherlands', currency: 'EUR', status: 'verified', linkedClients: 1, totalReceived: '€ 132,050' },
  { id: 'BN-004', name: 'Rossi SpA', iban: 'IT60 X054 2811 1010 0000 0123 456', bic: 'BPMOIT22XXX', bank: 'Banco BPM', country: 'Italy', currency: 'EUR', status: 'pending_verification', linkedClients: 1, totalReceived: '€ 6,280' },
  { id: 'BN-005', name: 'García Hermanos SL', iban: 'ES91 2100 0418 4502 0005 1332', bic: 'CABORABBXXX', bank: 'CaixaBank', country: 'Spain', currency: 'EUR', status: 'verified', linkedClients: 2, totalReceived: '€ 78,900' },
  { id: 'BN-006', name: 'Nordic Solutions AB', iban: 'SE45 5000 0000 0583 9825 7466', bic: 'ESSESESSXXX', bank: 'SEB', country: 'Sweden', currency: 'EUR', status: 'verified', linkedClients: 1, totalReceived: '€ 56,480' },
  { id: 'BN-007', name: 'O\'Brien Ltd', iban: 'IE29 AIBK 9311 5212 3456 78', bic: 'AABORABBXXX', bank: 'AIB', country: 'Ireland', currency: 'EUR', status: 'verified', linkedClients: 1, totalReceived: '€ 26,410' },
  { id: 'BN-008', name: 'Müller AG', iban: 'CH93 0076 2011 6238 5295 7', bic: 'UBSWCHZH80A', bank: 'UBS', country: 'Switzerland', currency: 'CHF', status: 'pending_verification', linkedClients: 1, totalReceived: '€ 8,395' },
]

const countryFlags: Record<string, string> = {
  Germany: '🇩🇪', France: '🇫🇷', Netherlands: '🇳🇱', Italy: '🇮🇹',
  Spain: '🇪🇸', Sweden: '🇸🇪', Ireland: '🇮🇪', Switzerland: '🇨🇭',
}

export default function Beneficiaries() {
  const [search, setSearch] = useState('')

  const filtered = mockBeneficiaries.filter((b) =>
    search === '' ||
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.iban.toLowerCase().includes(search.toLowerCase()) ||
    b.bank.toLowerCase().includes(search.toLowerCase()) ||
    b.country.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header title="Beneficiaries" subtitle="European SEPA beneficiary directory" />

      <div className="flex flex-col gap-6 p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jinbe-dim" />
            <input
              type="text"
              placeholder="Search by name, IBAN, bank or country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-jinbe-card border border-jinbe-border rounded-lg text-sm text-white placeholder:text-jinbe-dim focus:outline-none focus:border-jinbe-primary w-[340px]"
            />
          </div>
          <Link
            to="/beneficiaries/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Beneficiary
          </Link>
        </div>

        {/* Table */}
        <div className="border border-jinbe-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-jinbe-sidebar border-b border-jinbe-border">
                {['Beneficiary', 'IBAN', 'BIC / Bank', 'Country', 'Status', 'Clients', 'Total Received', ''].map((col) => (
                  <th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-jinbe-dim uppercase tracking-wider">
                    {col && (
                      <span className="flex items-center gap-1.5 cursor-pointer hover:text-jinbe-muted">
                        {col}
                        <ArrowUpDown className="w-3 h-3" />
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr
                  key={b.id}
                  className={`border-b border-jinbe-border hover:bg-jinbe-hover/30 transition-colors ${
                    i % 2 === 0 ? 'bg-jinbe-bg' : 'bg-jinbe-card/30'
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-jinbe-primary/10">
                        <Landmark className="w-4 h-4 text-jinbe-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-jinbe-text">{b.name}</p>
                        <p className="text-xs text-jinbe-dim">{b.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-mono text-jinbe-muted">{b.iban}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-mono text-jinbe-muted">{b.bic}</p>
                    <p className="text-xs text-jinbe-dim">{b.bank}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-jinbe-muted">
                      <Globe className="w-3.5 h-3.5 text-jinbe-dim" />
                      {countryFlags[b.country]} {b.country}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[b.status].className}`}>
                      {b.status === 'verified' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {statusConfig[b.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-jinbe-text text-center">{b.linkedClients}</td>
                  <td className="px-5 py-4 text-sm font-medium text-jinbe-text">{b.totalReceived}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-md text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-jinbe-dim">
            Showing <span className="text-jinbe-text font-medium">{filtered.length}</span> beneficiaries
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-lg text-sm font-medium bg-jinbe-primary text-white">1</button>
            <button className="p-2 rounded-lg text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
