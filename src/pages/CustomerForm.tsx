import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mail,
  Building2,
  User,
  Percent,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'

type CustomerType = 'individual' | 'business'

interface FormData {
  email: string
  type: CustomerType
  digitalAssetsSpread: string
  globalPaymentsSpread: string
}

const initialFormData: FormData = {
  email: '',
  type: 'individual',
  digitalAssetsSpread: '0.20',
  globalPaymentsSpread: '0.10',
}

export default function CustomerForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateSpread = (value: string): boolean => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= 0 && num <= 5
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate spreads
    if (!validateSpread(formData.digitalAssetsSpread)) {
      setError('Digital Assets spread must be between 0.00 and 5.00')
      return
    }
    if (!validateSpread(formData.globalPaymentsSpread)) {
      setError('Global Payments spread must be between 0.00 and 5.00')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      // In real implementation: await createCustomer({
      //   email: formData.email,
      //   type: formData.type,
      //   spread: {
      //     digital_assets: parseFloat(formData.digitalAssetsSpread),
      //     global_payments: parseFloat(formData.globalPaymentsSpread),
      //   },
      // })

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)

      // Redirect after showing success
      setTimeout(() => {
        navigate('/customers')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-jinbe-bg">
        <Header title="New Customer" />
        <div className="flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-jinbe-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-jinbe-success" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Customer Created!</h2>
            <p className="text-jinbe-muted">Redirecting to customers list...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-jinbe-bg">
      <Header title="New Customer" />

      <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-2 text-jinbe-muted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Customers
        </button>

        {/* Form card */}
        <div className="bg-jinbe-card border border-jinbe-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Create New Customer</h2>

          {error && (
            <div className="mb-6 p-4 bg-jinbe-danger/10 border border-jinbe-danger/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-jinbe-danger flex-shrink-0 mt-0.5" />
              <p className="text-jinbe-danger text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-jinbe-muted mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-jinbe-dim" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="customer@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                />
              </div>
            </div>

            {/* Customer Type */}
            <div>
              <label className="block text-sm font-medium text-jinbe-muted mb-2">
                Customer Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateField('type', 'individual')}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    formData.type === 'individual'
                      ? 'bg-jinbe-primary/10 border-jinbe-primary'
                      : 'bg-jinbe-bg border-jinbe-border hover:border-jinbe-muted'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.type === 'individual' ? 'bg-jinbe-primary/20' : 'bg-jinbe-border'
                    }`}
                  >
                    <User
                      className={`w-5 h-5 ${
                        formData.type === 'individual' ? 'text-jinbe-primary' : 'text-jinbe-dim'
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">Individual</p>
                    <p className="text-xs text-jinbe-muted">Person</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('type', 'business')}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                    formData.type === 'business'
                      ? 'bg-jinbe-primary/10 border-jinbe-primary'
                      : 'bg-jinbe-bg border-jinbe-border hover:border-jinbe-muted'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.type === 'business' ? 'bg-jinbe-primary/20' : 'bg-jinbe-border'
                    }`}
                  >
                    <Building2
                      className={`w-5 h-5 ${
                        formData.type === 'business' ? 'text-jinbe-primary' : 'text-jinbe-dim'
                      }`}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white">Business</p>
                    <p className="text-xs text-jinbe-muted">Company</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Spread Configuration */}
            <div className="p-4 bg-jinbe-bg/50 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                <Percent className="w-4 h-4 text-jinbe-primary" />
                Spread Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-jinbe-muted mb-2">
                    Digital Assets Spread *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={formData.digitalAssetsSpread}
                      onChange={(e) => updateField('digitalAssetsSpread', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-jinbe-dim">%</span>
                  </div>
                  <p className="text-xs text-jinbe-dim mt-1">Range: 0.00 - 5.00</p>
                </div>

                <div>
                  <label className="block text-sm text-jinbe-muted mb-2">
                    Global Payments Spread *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={formData.globalPaymentsSpread}
                      onChange={(e) => updateField('globalPaymentsSpread', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-jinbe-dim">%</span>
                  </div>
                  <p className="text-xs text-jinbe-dim mt-1">Range: 0.00 - 5.00</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/customers')}
                className="flex-1 py-3 bg-jinbe-border hover:bg-jinbe-hover text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:bg-jinbe-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Customer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
