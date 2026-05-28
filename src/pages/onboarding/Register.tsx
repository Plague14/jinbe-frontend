import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Mail,
  Building2,
  User,
  Key,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import logoJinbe from '@/assets/logo jinbe.png'

type Step = 'info' | 'credentials' | 'success'

export default function Register() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('info')
  const [isLoading, setIsLoading] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    fullName: '',
    apiKey: '',
    apiSecret: '',
  })

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('credentials')
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setStep('success')
  }

  const handleGoToLogin = () => {
    navigate('/onboarding/login')
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-jinbe-bg flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-jinbe-success/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-jinbe-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-jinbe-success" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-white mb-3">
            Registration Successful!
          </h1>
          <p className="text-jinbe-muted mb-8">
            Your account has been created. You can now sign in with your API credentials.
          </p>

          <button
            onClick={handleGoToLogin}
            className="inline-flex items-center gap-2 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            Go to Login
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-jinbe-bg flex flex-col items-center justify-center px-4 py-8">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-jinbe-primary/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logoJinbe} alt="Jinbe" style={{ height: '64px' }} />
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              step === 'info' ? 'bg-jinbe-primary' : 'bg-jinbe-primary/50'
            }`}
          />
          <div className="w-8 h-0.5 bg-jinbe-border" />
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              step === 'credentials' ? 'bg-jinbe-primary' : 'bg-jinbe-border'
            }`}
          />
        </div>

        {/* Card */}
        <div className="bg-jinbe-card border border-jinbe-border rounded-2xl p-8">
          {step === 'info' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-white mb-2">
                  Create your account
                </h1>
                <p className="text-jinbe-muted">
                  Enter your company information to get started
                </p>
              </div>

              <form onSubmit={handleInfoSubmit} className="space-y-5">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-jinbe-muted mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => updateField('companyName', e.target.value)}
                      placeholder="Acme Corp"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-jinbe-muted mb-2">
                    Business Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="contact@company.com"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-jinbe-muted mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

          {step === 'credentials' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold text-white mb-2">
                  API Credentials
                </h1>
                <p className="text-jinbe-muted">
                  Enter the API credentials provided by Urban
                </p>
              </div>

              <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-jinbe-muted mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                    <input
                      type="text"
                      value={formData.apiKey}
                      onChange={(e) => updateField('apiKey', e.target.value)}
                      placeholder="your_api_key"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                  </div>
                </div>

                {/* API Secret */}
                <div>
                  <label className="block text-sm font-medium text-jinbe-muted mb-2">
                    API Secret
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={formData.apiSecret}
                      onChange={(e) => updateField('apiSecret', e.target.value)}
                      placeholder="your_api_secret"
                      required
                      className="w-full pl-12 pr-12 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-jinbe-dim hover:text-jinbe-muted transition-colors"
                    >
                      {showSecret ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('info')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-jinbe-border hover:bg-jinbe-hover text-white font-medium rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:bg-jinbe-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-jinbe-muted text-sm">
              Already have an account?{' '}
              <Link
                to="/onboarding/login"
                className="text-jinbe-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
