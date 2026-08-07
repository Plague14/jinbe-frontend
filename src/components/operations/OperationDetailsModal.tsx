import {
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Copy,
  FileText,
  XCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'

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
  completed: <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-success" />,
  processing: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-primary animate-pulse" />,
  pending: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-dim" />,
  failed: <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-jinbe-danger" />,
}

export function OperationDetailsModal({ operation, onClose }: OperationDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto bg-jinbe-sidebar border border-jinbe-border rounded-t-2xl sm:rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 bg-jinbe-sidebar border-b border-jinbe-border rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-jinbe-text">{operation.id}</h2>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-jinbe-primary/10 text-jinbe-primary">
                {operation.type}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-jinbe-dim mt-0.5">{operation.date}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-jinbe-dim hover:text-white hover:bg-jinbe-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
          {/* Flow summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-jinbe-bg rounded-xl border border-jinbe-border">
            <div className="text-center sm:text-left">
              <p className="text-[10px] sm:text-xs text-jinbe-dim uppercase tracking-wider mb-1">Origin</p>
              <p className="text-xs sm:text-sm font-semibold text-jinbe-text">{operation.client}</p>
              <p className="text-base sm:text-lg font-bold text-jinbe-text mt-1">{operation.amountBRL}</p>
            </div>
            <div className="flex sm:flex-col items-center gap-1">
              <ArrowRight className="w-5 h-5 text-jinbe-primary rotate-90 sm:rotate-0" />
              <span className="text-xs font-mono text-jinbe-muted">@ {operation.rate}</span>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[10px] sm:text-xs text-jinbe-dim uppercase tracking-wider mb-1">Destination</p>
              <p className="text-xs sm:text-sm font-semibold text-jinbe-text">{operation.beneficiary}</p>
              <p className="text-base sm:text-lg font-bold text-jinbe-success mt-1">{operation.amountEUR}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { label: 'Operation ID', value: operation.id, mono: true },
              { label: 'Exchange Rate', value: operation.rate, mono: true },
              { label: 'Client', value: operation.client },
              { label: 'Beneficiary', value: operation.beneficiary },
              { label: 'Created', value: operation.date },
              { label: 'Status', value: operation.status, badge: true },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs text-jinbe-dim uppercase tracking-wider">{item.label}</span>
                {item.badge ? (
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-jinbe-primary capitalize">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current" />
                    {item.value}
                  </span>
                ) : (
                  <span className={`text-xs sm:text-sm font-medium text-jinbe-text flex items-center gap-2 truncate ${item.mono ? 'font-mono' : ''}`}>
                    <span className="truncate">{item.value}</span>
                    {item.mono && (
                      <button className="text-jinbe-dim hover:text-white transition-colors shrink-0">
                        <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-jinbe-text mb-3 sm:mb-4">Operation Timeline</h3>
            <div className="flex flex-col">
              {timelineSteps.map((step, i) => (
                <div key={step.label} className="flex gap-3 sm:gap-4">
                  {/* Line + icon */}
                  <div className="flex flex-col items-center">
                    {stepIcon[step.status]}
                    {i < timelineSteps.length - 1 && (
                      <div className={`w-px flex-1 min-h-[24px] sm:min-h-[32px] ${
                        step.status === 'completed' ? 'bg-jinbe-success/30' : 'bg-jinbe-border'
                      }`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-4 sm:pb-5">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-jinbe-text">{step.label}</p>
                      <span className="text-[10px] sm:text-xs font-mono text-jinbe-dim">{step.time}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-jinbe-muted mt-0.5">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2 border-t border-jinbe-border">
            <Link
              to={`/operations/${operation.id}/receipt`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              Ver Comprovante
            </Link>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-jinbe-border text-jinbe-muted hover:text-white text-sm font-medium rounded-lg transition-colors">
              <Copy className="w-4 h-4" />
              Copiar ID
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
