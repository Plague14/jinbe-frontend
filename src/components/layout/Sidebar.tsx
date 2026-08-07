import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  BarChart3,
  Settings,
  X,
  Sparkles,
  Crown,
  FileBarChart,
} from 'lucide-react'
import logoJinbe from '@/assets/logo-jinbe.png'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Painel' },
  { to: '/operations', icon: ArrowLeftRight, label: 'Operações' },
  { to: '/clients', icon: Users, label: 'Clientes' },
  { to: '/reports', icon: FileBarChart, label: 'Relatórios' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-[260px] min-h-screen bg-jinbe-sidebar border-r border-jinbe-border
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Logo + Close button */}
      <div className="flex items-center justify-between px-6 py-6">
        <img src={logoJinbe} alt="Jinbe" style={{ height: '56px' }} />
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg text-jinbe-muted hover:text-white hover:bg-jinbe-border/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-4 pt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-jinbe-primary text-white'
                  : 'text-jinbe-muted hover:bg-jinbe-border/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Admin & Onboarding */}
      <div className="border-t border-jinbe-border px-4 py-4 space-y-1">
        <NavLink
          to="/admin"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gradient-to-r from-jinbe-warning to-jinbe-danger text-white'
                : 'text-jinbe-warning hover:bg-jinbe-warning/10'
            }`
          }
        >
          <Crown className="w-[18px] h-[18px]" />
          Painel do Fundador
        </NavLink>
        <NavLink
          to="/onboarding/login"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gradient-to-r from-jinbe-primary to-jinbe-info text-white'
                : 'text-jinbe-primary hover:bg-jinbe-primary/10'
            }`
          }
        >
          <Sparkles className="w-[18px] h-[18px]" />
          Fluxo Onboarding
        </NavLink>
      </div>

      {/* Settings */}
      <div className="border-t border-jinbe-border px-4 py-4">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-jinbe-primary text-white'
                : 'text-jinbe-muted hover:bg-jinbe-border/50 hover:text-white'
            }`
          }
        >
          <Settings className="w-[18px] h-[18px]" />
          Configurações
        </NavLink>
      </div>
    </aside>
  )
}
