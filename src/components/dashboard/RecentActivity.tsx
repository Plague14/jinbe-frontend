import { ArrowUpRight, RefreshCw, AlertTriangle, Zap } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'pix_transfer' | 'rate_fix' | 'sepa_payout' | 'compliance' | 'settlement'
  title: string
  amount: string
  description: string
  status: string
  time: string
}

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'pix_transfer',
    title: 'Transferência PIX',
    amount: '€1.450,00',
    description: 'Santos & Co → Gmbh Berlin',
    status: 'Sucesso',
    time: 'há 2m',
  },
  {
    id: '2',
    type: 'rate_fix',
    title: 'Fixação de Taxa',
    amount: '1.0822',
    description: 'Hedge automático executado',
    status: 'Processando',
    time: 'há 15m',
  },
  {
    id: '3',
    type: 'sepa_payout',
    title: 'Pagamento SEPA',
    amount: '€12.000,00',
    description: 'AgroTech SA → European Ag',
    status: 'Sucesso',
    time: 'há 1h',
  },
  {
    id: '4',
    type: 'compliance',
    title: 'Verificação Compliance',
    amount: '€85.000,00',
    description: 'Alerta de alto volume: Rio Import',
    status: 'Ação Necessária',
    time: 'há 2h',
  },
  {
    id: '5',
    type: 'settlement',
    title: 'Liquidação PIX',
    amount: '€3.200,00',
    description: 'Global Logistics → Marine Ltd',
    status: 'Sucesso',
    time: 'há 3h',
  },
]

const iconMap = {
  pix_transfer: { icon: ArrowUpRight, bg: 'bg-jinbe-success/10 text-jinbe-success' },
  rate_fix: { icon: RefreshCw, bg: 'bg-jinbe-info/10 text-jinbe-info' },
  sepa_payout: { icon: ArrowUpRight, bg: 'bg-jinbe-success/10 text-jinbe-success' },
  compliance: { icon: AlertTriangle, bg: 'bg-jinbe-warning/10 text-jinbe-warning' },
  settlement: { icon: Zap, bg: 'bg-jinbe-success/10 text-jinbe-success' },
}

export function RecentActivity() {
  return (
    <div className="w-full lg:w-[300px] lg:shrink-0 flex flex-col p-4 sm:p-6 rounded-xl border border-jinbe-border bg-jinbe-card shadow-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-jinbe-text">Atividade Recente</h3>
        <button className="text-xs sm:text-sm font-medium text-jinbe-primary hover:underline">
          Ver tudo
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none">
        {activities.map((item, i) => {
          const { icon: Icon, bg } = iconMap[item.type]
          const isLast = i === activities.length - 1
          return (
            <div key={item.id} className="flex gap-3">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 ${bg}`}>
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <div className={`flex-1 pb-3 sm:pb-4 ${!isLast ? 'border-b border-jinbe-border' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-jinbe-text">{item.title}</span>
                  <span className="text-xs sm:text-sm font-bold text-jinbe-text whitespace-nowrap">{item.amount}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-jinbe-dim mt-1 truncate">{item.description}</p>
                <p className="text-[10px] text-jinbe-muted uppercase mt-1">
                  {item.status} • {item.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
