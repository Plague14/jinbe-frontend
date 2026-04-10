import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useTheme } from '@/contexts/ThemeContext'

export function AppLayout() {
  const { theme } = useTheme()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className={`flex-1 overflow-y-auto ${theme === 'light' ? 'theme-light bg-[#f8fafc]' : 'bg-jinbe-bg'}`}>
        <Outlet />
      </main>
    </div>
  )
}
