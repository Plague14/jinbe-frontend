import { useState, useRef, useEffect } from 'react'
import { Search, Bell, Sun, Moon, Menu, Check, CheckCheck, X, Settings } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useOutletContext, Link } from 'react-router-dom'

interface HeaderProps {
  title: string
  subtitle?: string
}

interface OutletContext {
  onMenuClick: () => void
}

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'success', title: 'Operação Concluída', message: 'Transferência OP-2024-001 foi processada com sucesso.', time: '2 min', read: false },
  { id: '2', type: 'warning', title: 'KYC Pendente', message: 'Cliente TechBR Solutions aguardando verificação de documentos.', time: '15 min', read: false },
  { id: '3', type: 'info', title: 'Novo Beneficiário', message: 'Schmidt GmbH foi adicionado como beneficiário.', time: '1h', read: false },
  { id: '4', type: 'error', title: 'Falha na Operação', message: 'Operação OP-2024-005 falhou. Verifique os dados do beneficiário.', time: '2h', read: true },
  { id: '5', type: 'success', title: 'Webhook Ativo', message: 'Webhook customer.verification.updated configurado.', time: '3h', read: true },
  { id: '6', type: 'info', title: 'Taxa Atualizada', message: 'Nova taxa EUR/BRL: 6.42 (+0.8%)', time: '4h', read: true },
]

const typeConfig = {
  success: { bg: 'bg-jinbe-success/10', text: 'text-jinbe-success', dot: 'bg-jinbe-success' },
  warning: { bg: 'bg-jinbe-warning/10', text: 'text-jinbe-warning', dot: 'bg-jinbe-warning' },
  info: { bg: 'bg-jinbe-info/10', text: 'text-jinbe-info', dot: 'bg-jinbe-info' },
  error: { bg: 'bg-jinbe-danger/10', text: 'text-jinbe-danger', dot: 'bg-jinbe-danger' },
}

export function Header({ title, subtitle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'
  const { onMenuClick } = useOutletContext<OutletContext>()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const notificationRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <header className={`sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-5 backdrop-blur-md border-b ${
      isLight
        ? 'bg-white/80 border-jinbe-border'
        : 'bg-jinbe-bg/80 border-jinbe-border'
    }`}>
      <div className="flex items-center gap-3">
        {/* Hamburger menu - mobile only */}
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 -ml-2 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              : 'text-jinbe-muted hover:text-white hover:bg-jinbe-border/50'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-jinbe-muted mt-0.5 hidden sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              : 'text-jinbe-muted hover:text-white'
          }`}
          title={isLight ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
        >
          {isLight ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
        </button>

        {/* Search - hidden on small mobile */}
        <button className={`hidden sm:flex p-2 rounded-full transition-colors ${
          isLight ? 'text-slate-500 hover:text-slate-900' : 'text-jinbe-muted hover:text-white'
        }`}>
          <Search className="w-[18px] h-[18px]" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-colors ${
              showNotifications
                ? 'bg-jinbe-primary/10 text-jinbe-primary'
                : isLight
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-jinbe-muted hover:text-white'
            }`}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-jinbe-danger rounded-full ${
                isLight ? 'border-2 border-white' : 'border-2 border-jinbe-bg'
              }`}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-xl z-50 ${
              isLight ? 'bg-white border-slate-200' : 'bg-jinbe-card border-jinbe-border'
            }`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b ${
                isLight ? 'border-slate-200' : 'border-jinbe-border'
              }`}>
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Notificações
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-jinbe-primary/10 text-jinbe-primary rounded-full">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        isLight ? 'text-slate-500 hover:bg-slate-100' : 'text-jinbe-muted hover:bg-jinbe-border/50'
                      }`}
                      title="Marcar todas como lidas"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <Link
                    to="/settings"
                    onClick={() => setShowNotifications(false)}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      isLight ? 'text-slate-500 hover:bg-slate-100' : 'text-jinbe-muted hover:bg-jinbe-border/50'
                    }`}
                    title="Configurações de notificações"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-8 h-8 mx-auto text-jinbe-dim mb-2" />
                    <p className="text-sm text-jinbe-muted">Nenhuma notificação</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const config = typeConfig[notification.type]
                    return (
                      <div
                        key={notification.id}
                        className={`relative px-4 py-3 border-b last:border-b-0 transition-colors ${
                          isLight ? 'border-slate-100' : 'border-jinbe-border/50'
                        } ${!notification.read ? (isLight ? 'bg-blue-50/50' : 'bg-jinbe-primary/5') : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${config.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                {notification.title}
                              </p>
                              <span className="text-xs text-jinbe-dim flex-shrink-0">{notification.time}</span>
                            </div>
                            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-jinbe-muted'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="flex items-center gap-1 text-xs text-jinbe-primary hover:underline"
                                >
                                  <Check className="w-3 h-3" />
                                  Marcar como lida
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="flex items-center gap-1 text-xs text-jinbe-dim hover:text-jinbe-danger"
                              >
                                <X className="w-3 h-3" />
                                Remover
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className={`px-4 py-2 border-t ${isLight ? 'border-slate-200' : 'border-jinbe-border'}`}>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center text-xs text-jinbe-primary hover:underline py-1"
                  >
                    Ver todas as notificações
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User profile - compact on mobile */}
        <div className={`flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l ${isLight ? 'border-slate-200' : 'border-jinbe-border'}`}>
          <div className="text-right hidden sm:block">
            <p className={`text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>Usuário Admin</p>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-jinbe-dim'} hidden md:block`}>Diretor Executivo</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-jinbe-primary/20 flex items-center justify-center text-xs sm:text-sm font-semibold text-jinbe-primary">
            AU
          </div>
        </div>
      </div>
    </header>
  )
}
