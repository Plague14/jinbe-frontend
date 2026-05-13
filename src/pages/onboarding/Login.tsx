import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import logoJinbe from '@/assets/logo jinbe.png'

// Demo account for testing the onboarding flow
const DEMO_ACCOUNT = {
  email: 'demo@jinbe.com',
  password: 'demo123',
}

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check demo credentials or allow any valid email/password
    if (
      (email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) ||
      (email.includes('@') && password.length >= 6)
    ) {
      localStorage.setItem('user_email', email)
      navigate('/onboarding/questions')
    } else {
      setError('Invalid credentials. Use demo@jinbe.com / demo123 or any valid email with 6+ char password')
    }

    setIsLoading(false)
  }

  const handleDemoLogin = async () => {
    setEmail(DEMO_ACCOUNT.email)
    setPassword(DEMO_ACCOUNT.password)
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 800))
    localStorage.setItem('user_email', DEMO_ACCOUNT.email)
    navigate('/onboarding/questions')
  }

  return (
    <div className="min-h-screen bg-jinbe-bg flex flex-col items-center justify-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-jinbe-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logoJinbe} alt="Jinbe" className="h-12" />
        </div>

        {/* Card */}
        <div className="bg-jinbe-card border border-jinbe-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Welcome back</h1>
            <p className="text-jinbe-muted">
              Sign in to access your account
            </p>
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 mb-6 bg-gradient-to-r from-jinbe-primary to-jinbe-info hover:opacity-90 disabled:opacity-50 text-white font-medium rounded-lg transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Try Demo Account
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-jinbe-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-jinbe-card text-jinbe-muted">or sign in with email</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-jinbe-danger/10 border border-jinbe-danger/20 rounded-lg">
              <p className="text-jinbe-danger text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-jinbe-muted mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-jinbe-muted mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3 bg-jinbe-border hover:bg-jinbe-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-jinbe-muted text-sm">
              Don't have an account?{' '}
              <Link
                to="/onboarding/register"
                className="text-jinbe-primary hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-jinbe-dim text-sm mt-6">
          Demo credentials: <span className="text-jinbe-muted">demo@jinbe.com</span> / <span className="text-jinbe-muted">demo123</span>
        </p>
      </div>
    </div>
  )
}
