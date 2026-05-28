import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import logoJinbe from '@/assets/logo jinbe.png'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email.includes('@') && password.length >= 6) {
      localStorage.setItem('user_email', email)
      localStorage.setItem('onboarding_complete', 'true')
      navigate('/')
    } else {
      setError('E-mail ou senha invalidos. Verifique e tente novamente.')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-jinbe-bg flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-jinbe-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={logoJinbe} alt="Jinbe" style={{ height: '64px' }} />
        </div>

        <div className="bg-jinbe-card border border-jinbe-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Entrar na sua conta</h1>
            <p className="text-jinbe-muted">Acesse seu painel Jinbe</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-jinbe-danger/10 border border-jinbe-danger/20 rounded-lg">
              <p className="text-jinbe-danger text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-jinbe-muted mb-2">E-mail corporativo</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com.br"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-jinbe-muted mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-jinbe-dim hover:text-jinbe-muted transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3 bg-jinbe-success hover:bg-jinbe-success/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-jinbe-muted text-sm">
              Ainda nao tem conta?{' '}
              <Link to="/onboarding/register" className="text-jinbe-primary hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-6">
          {['Autorizado pelo Banco Central', 'Sem mensalidade', 'Taxa a partir de 1,7%'].map((text) => (
            <div key={text} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-jinbe-success" />
              <span className="text-xs text-jinbe-dim">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
