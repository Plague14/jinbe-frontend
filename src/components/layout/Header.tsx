import { Search, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <header className={`sticky top-0 z-20 flex items-center justify-between px-8 py-5 backdrop-blur-md border-b ${
      isLight
        ? 'bg-white/80 border-jinbe-border'
        : 'bg-jinbe-bg/80 border-jinbe-border'
    }`}>
      <div>
        <h1 className={`text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h1>
        {subtitle && (
          <p className="text-sm text-jinbe-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              : 'text-jinbe-muted hover:text-white'
          }`}
          title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {isLight ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
        </button>
        <button className={`p-2 rounded-full transition-colors ${
          isLight ? 'text-slate-500 hover:text-slate-900' : 'text-jinbe-muted hover:text-white'
        }`}>
          <Search className="w-[18px] h-[18px]" />
        </button>
        <button className={`relative p-2 rounded-full transition-colors ${
          isLight ? 'text-slate-500 hover:text-slate-900' : 'text-jinbe-muted hover:text-white'
        }`}>
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-jinbe-bg" />
        </button>

        <div className={`flex items-center gap-3 pl-4 border-l ${isLight ? 'border-slate-200' : 'border-jinbe-border'}`}>
          <div className="text-right">
            <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Admin User</p>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'}`}>Managing Director</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-jinbe-primary/20 flex items-center justify-center text-sm font-semibold text-jinbe-primary">
            AU
          </div>
        </div>
      </div>
    </header>
  )
}
