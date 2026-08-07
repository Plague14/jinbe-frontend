import { Link } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import {
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Ship,
  ArrowRight,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function NewOperationSelect() {
  const { theme } = useTheme()
  const isLight = theme === 'light'

  return (
    <>
      <Header title="Nova Operação" subtitle="Escolha o tipo de operação que deseja realizar" />

      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Pagar Fornecedor (Envio) */}
          <Link
            to="/operations/new/send"
            className={`group relative p-6 rounded-2xl border transition-all hover:shadow-lg ${
              isLight
                ? 'bg-white border-slate-200 hover:border-jinbe-primary'
                : 'bg-jinbe-card border-jinbe-border hover:border-jinbe-primary'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                isLight ? 'bg-jinbe-primary/10' : 'bg-jinbe-primary/20'
              }`}>
                <ArrowUpRight className="w-6 h-6 text-jinbe-primary" />
              </div>
              <ArrowRight className="w-5 h-5 text-jinbe-dim group-hover:text-jinbe-primary group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className={`text-lg font-bold mb-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Pagar Fornecedor
            </h3>
            <p className={`text-sm mb-4 ${
              isLight ? 'text-slate-600' : 'text-jinbe-muted'
            }`}>
              Envie pagamentos internacionais para seus fornecedores no exterior.
            </p>

            <div className={`flex items-center gap-2 text-xs ${
              isLight ? 'text-slate-500' : 'text-jinbe-dim'
            }`}>
              <Building2 className="w-4 h-4" />
              <span>Importadores</span>
              <span className="mx-1">•</span>
              <span>BRL → USD/EUR</span>
            </div>

            {/* Tag */}
            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-jinbe-primary/10 text-jinbe-primary text-xs font-medium hidden group-hover:block">
              Envio
            </div>
          </Link>

          {/* Registrar Recebimento (Exportador) */}
          <Link
            to="/operations/new/receivable"
            className={`group relative p-6 rounded-2xl border transition-all hover:shadow-lg ${
              isLight
                ? 'bg-white border-slate-200 hover:border-jinbe-success'
                : 'bg-jinbe-card border-jinbe-border hover:border-jinbe-success'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${
                isLight ? 'bg-jinbe-success/10' : 'bg-jinbe-success/20'
              }`}>
                <ArrowDownLeft className="w-6 h-6 text-jinbe-success" />
              </div>
              <ArrowRight className="w-5 h-5 text-jinbe-dim group-hover:text-jinbe-success group-hover:translate-x-1 transition-all" />
            </div>

            <h3 className={`text-lg font-bold mb-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Registrar Recebimento
            </h3>
            <p className={`text-sm mb-4 ${
              isLight ? 'text-slate-600' : 'text-jinbe-muted'
            }`}>
              Cadastre invoices emitidas e acompanhe pagamentos de clientes internacionais.
            </p>

            <div className={`flex items-center gap-2 text-xs ${
              isLight ? 'text-slate-500' : 'text-jinbe-dim'
            }`}>
              <Ship className="w-4 h-4" />
              <span>Exportadores</span>
              <span className="mx-1">•</span>
              <span>USD/EUR → BRL</span>
            </div>

            {/* Tag */}
            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-jinbe-success/10 text-jinbe-success text-xs font-medium hidden group-hover:block">
              Recebimento
            </div>
          </Link>
        </div>

        {/* Info box */}
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-blue-50 border-blue-100' : 'bg-jinbe-primary/5 border-jinbe-primary/20'
        }`}>
          <p className={`text-sm ${isLight ? 'text-blue-800' : 'text-jinbe-primary'}`}>
            <strong>Dica:</strong> Para exportadores que emitem invoices para armadores internacionais,
            use "Registrar Recebimento" para cadastrar a invoice e ser notificado automaticamente
            quando o pagamento for identificado.
          </p>
        </div>
      </div>
    </>
  )
}
