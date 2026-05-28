import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  Landmark,
  BarChart3,
  Webhook,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import logoJinbe from '@/assets/logo-jinbe.png'

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  tip?: string
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description:
      'Your command center. Get a real-time overview of your operations, KPIs, and recent activity at a glance.',
    icon: LayoutDashboard,
    features: [
      'Real-time volume tracking',
      'Operation status overview',
      'Recent activity feed',
      'Key performance indicators',
    ],
    tip: 'Pro tip: Use the dashboard to quickly identify trends and monitor daily performance.',
  },
  {
    id: 'operations',
    title: 'Operations',
    description:
      'Manage all your cross-border transactions. Create new operations, track status, and view detailed histories.',
    icon: ArrowLeftRight,
    features: [
      'Create new operations (PIX to SEPA)',
      'Track operation status in real-time',
      'View detailed operation timeline',
      'Search and filter operations',
    ],
    tip: 'Pro tip: Use the search to quickly find specific operations by ID or amount.',
  },
  {
    id: 'customers',
    title: 'Customers',
    description:
      'Manage your customer base. Create customers, track verification status, and configure spreads.',
    icon: Users,
    features: [
      'Create individual or business customers',
      'Generate verification links',
      'Track KYC/KYB status',
      'Configure custom spreads',
    ],
    tip: 'Pro tip: Monitor customer status to ensure smooth onboarding.',
  },
  {
    id: 'beneficiaries',
    title: 'Beneficiaries',
    description:
      'Manage SEPA beneficiaries for your customers. Register, verify, and organize payment destinations.',
    icon: Landmark,
    features: [
      'Register SEPA beneficiaries',
      'IBAN and BIC validation',
      'Verification status tracking',
      'Country and bank organization',
    ],
  },
  {
    id: 'metrics',
    title: 'Metrics & Analytics',
    description:
      'Deep dive into your business performance with advanced analytics and detailed reports.',
    icon: BarChart3,
    features: [
      'Volume trend analysis',
      'Success rate monitoring',
      'Top corridors identification',
      'Client performance ranking',
    ],
    tip: 'Pro tip: Review metrics weekly to optimize your operation corridors.',
  },
  {
    id: 'webhooks',
    title: 'Webhooks',
    description:
      'Stay informed with real-time notifications. Configure webhooks to receive events about customer updates.',
    icon: Webhook,
    features: [
      'Customer verification events',
      'Terms of service updates',
      'Status change notifications',
      'Secure signature validation',
    ],
    tip: 'Pro tip: Always store webhook secrets securely and validate signatures.',
  },
]

export default function Tutorial() {
  const navigate = useNavigate()
  const { completeOnboarding } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)

  const step = tutorialSteps[currentStep]
  const totalSteps = tutorialSteps.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  const Icon = step.icon

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    completeOnboarding()
    navigate('/')
  }

  const handleSkip = () => {
    completeOnboarding()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-jinbe-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-jinbe-border">
        <img src={logoJinbe} alt="Jinbe" style={{ height: '48px' }} />
        <button
          onClick={handleSkip}
          className="text-sm text-jinbe-muted hover:text-white transition-colors"
        >
          Skip tutorial
        </button>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-jinbe-border">
        <div
          className="h-full bg-jinbe-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Step navigation dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-jinbe-primary scale-125'
                    : index < currentStep
                    ? 'bg-jinbe-primary/50'
                    : 'bg-jinbe-border'
                }`}
              />
            ))}
          </div>

          {/* Card */}
          <div className="bg-jinbe-card border border-jinbe-border rounded-2xl p-8">
            {/* Icon and title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-jinbe-primary/20 flex items-center justify-center">
                <Icon className="w-8 h-8 text-jinbe-primary" />
              </div>
              <div>
                <span className="text-sm text-jinbe-muted">
                  Feature {currentStep + 1} of {totalSteps}
                </span>
                <h1 className="text-2xl font-semibold text-white">{step.title}</h1>
              </div>
            </div>

            {/* Description */}
            <p className="text-jinbe-muted text-lg mb-6">{step.description}</p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {step.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-jinbe-success mt-0.5 flex-shrink-0" />
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>

            {/* Tip */}
            {step.tip && (
              <div className="flex items-start gap-3 p-4 bg-jinbe-primary/10 border border-jinbe-primary/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-jinbe-primary mt-0.5 flex-shrink-0" />
                <p className="text-jinbe-muted">{step.tip}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-jinbe-border hover:bg-jinbe-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep === totalSteps - 1 ? (
              <button
                onClick={handleComplete}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-jinbe-success hover:bg-jinbe-success/90 text-white font-medium rounded-lg transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Get Started
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
