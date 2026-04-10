import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Landmark,
  BarChart3,
  Settings,
} from 'lucide-react'
import logoJinbe from '@/assets/logo jinbe.png'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/operations', icon: ArrowLeftRight, label: 'Operations' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/beneficiaries', icon: Landmark, label: 'Beneficiaries' },
  { to: '/metrics', icon: BarChart3, label: 'Metrics' },
]

export function Sidebar() {
  return (
    <aside className="flex flex-col w-[260px] min-h-screen bg-jinbe-sidebar border-r border-jinbe-border">
      {/* Logo */}
      <div className="flex items-center px-6 py-6">
        <img src={logoJinbe} alt="Jinbe" className="h-9" />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-4 pt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
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

      {/* Settings */}
      <div className="border-t border-jinbe-border px-4 py-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-jinbe-primary text-white'
                : 'text-jinbe-muted hover:bg-jinbe-border/50 hover:text-white'
            }`
          }
        >
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
