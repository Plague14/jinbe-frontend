import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Copy,
  ExternalLink,
  XCircle,
} from 'lucide-react'

interface Operation {
  id: string
  client: string
  beneficiary: string
  amountBRL: string
  amountEUR: string
  rate: string
  status: string
  date: string
  type: string
}

interface OperationDetailsModalProps {
  operation: Operation
  onClose: () => void
}

const timelineSteps = [
  { label: 'PIX Received', time: '14:32:05', status: 'completed' as const, detail: 'R$ 52,400.00 received via PIX' },
  { label: 'Compliance Check', time: '14:32:12', status: 'completed' as const, detail: 'AML/KYC verification passed' },
  { label: 'BRL → USDC Swap', time: '14:32:45', status: 'completed' as const, detail: 'Converted at rate 5.4300' },
  { label: 'USDC → EUR Swap', time: '14:33:10', status: 'completed' as const, detail: '9,650 USDC → € 9,650.00' },
  { label: 'SEPA Transfer', time: '14:33:30', status: 'processing' as const, detail: 'Initiating bank transfer' },
  { label: 'Settlement', time: '—', status: 'pending' as const, detail: 'Awaiting confirmation' },
]

const stepIcon = {
  completed: <CheckCircle2 className="w-5 h-5 text-jinbe-success" />,
  processing: <Clock className="w-5 h-5 text-jinbe-primary animate-pulse" />,
  pending: <AlertCircle className="w-5 h-5 text-jinbe-dim" />,
  failed: <XCircle className="w-5 h-5 text-jinbe-danger" />,
}

export function OperationDetailsModal({ operation, onClose }: OperationDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-jinbe-sidebar border border-jinbe-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-jinbe-sidebar border-b border-jinbe-border rounded-t-2xl">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-jinbe-text">{operation.id}</h2>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-jinbe-primary/10 text-jinbe-primary">
                {operation.type}
              </span>
            </div>
            <p className="text-sm text-jinbe-dim mt-0.5">{operation.date}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Flow summary */}
          <div className="flex items-center justify-between p-4 bg-jinbe-bg rounded-xl border border-jinbe-border">
            <div className="text-center">
              <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Origin</p>
              <p className="text-sm font-semibold text-jinbe-text">{operation.client}</p>
              <p className="text-lg font-bold text-jinbe-text mt-1">{operation.amountBRL}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ArrowRight className="w-5 h-5 text-jinbe-primary" />
              <span className="text-xs font-mono text-jinbe-muted">@ {operation.rate}</span>
            </div>
            <div className="text-center">
              <p className="text-xs text-jinbe-dim uppercase tracking-wider mb-1">Destination</p>
              <p className="text-sm font-semibold text-jinbe-text">{operation.beneficiary}</p>
              <p className="text-lg font-bold text-jinbe-success mt-1">{operation.amountEUR}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Operation ID', value: operation.id, mono: true },
              { label: 'Exchange Rate', value: operation.rate, mono: true },
              { label: 'Client', value: operation.client },
              { label: 'Beneficiary', value: operation.beneficiary },
              { label: 'Created', value: operation.date },
              { label: 'Status', value: operation.status, badge: true },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <span className="text-xs text-jinbe-dim uppercase tracking-wider">{item.label}</span>
                {item.badge ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-jinbe-primary capitalize">
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {item.value}
                  </span>
                ) : (
                  <span className={`text-sm font-medium text-jinbe-text flex items-center gap-2 ${item.mono ? 'font-mono' : ''}`}>
                    {item.value}
                    {item.mono && (
                      <button className="text-jinbe-dim hover:text-white transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-jinbe-text mb-4">Operation Timeline</h3>
            <div className="flex flex-col">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex gap-4">
                  {/* Line + icon */}
                  <div className="flex flex-col items-center">
                    {stepIcon[step.status]}
                    {i < timelineSteps.length - 1 && (
                      <div className={`w-px flex-1 min-h-[32px] ${
                        step.status === 'completed' ? 'bg-jinbe-success/30' : 'bg-jinbe-border'
                      }`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-5">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-jinbe-text">{step.label}</p>
                      <span className="text-xs font-mono text-jinbe-dim">{step.time}</span>
                    </div>
                    <p className="text-xs text-jinbe-muted mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-jinbe-border">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
              View Full Details
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-jinbe-border text-jinbe-muted hover:text-white text-sm font-medium rounded-lg transition-colors">
              <Copy className="w-4 h-4" />
              Copy ID
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
