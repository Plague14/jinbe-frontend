import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Users,
  Globe,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'
import logoJinbe from '@/assets/logo jinbe.png'

interface Question {
  id: string
  question: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  options: { value: string; label: string; description?: string }[]
  multiSelect?: boolean
}

const questions: Question[] = [
  {
    id: 'business_type',
    question: 'What type of business are you?',
    description: 'This helps us customize your experience',
    icon: Building2,
    options: [
      { value: 'exchange', label: 'Exchange', description: 'Currency exchange services' },
      { value: 'fintech', label: 'Fintech', description: 'Financial technology company' },
      { value: 'bank', label: 'Bank', description: 'Banking institution' },
      { value: 'broker', label: 'Broker', description: 'Brokerage services' },
      { value: 'other', label: 'Other', description: 'Other type of business' },
    ],
  },
  {
    id: 'team_size',
    question: 'How big is your team?',
    description: 'Select the size that best describes your organization',
    icon: Users,
    options: [
      { value: '1-5', label: '1-5 employees' },
      { value: '6-20', label: '6-20 employees' },
      { value: '21-50', label: '21-50 employees' },
      { value: '51-200', label: '51-200 employees' },
      { value: '200+', label: '200+ employees' },
    ],
  },
  {
    id: 'corridors',
    question: 'Which corridors are you interested in?',
    description: 'Select all that apply',
    icon: Globe,
    multiSelect: true,
    options: [
      { value: 'brl_eur', label: 'BRL to EUR', description: 'Brazil to Europe' },
      { value: 'brl_usd', label: 'BRL to USD', description: 'Brazil to USA' },
      { value: 'eur_brl', label: 'EUR to BRL', description: 'Europe to Brazil' },
      { value: 'usd_brl', label: 'USD to BRL', description: 'USA to Brazil' },
    ],
  },
  {
    id: 'monthly_volume',
    question: 'What is your expected monthly volume?',
    description: 'Estimated transaction volume per month',
    icon: DollarSign,
    options: [
      { value: 'under_100k', label: 'Under $100K' },
      { value: '100k_500k', label: '$100K - $500K' },
      { value: '500k_1m', label: '$500K - $1M' },
      { value: '1m_5m', label: '$1M - $5M' },
      { value: 'over_5m', label: 'Over $5M' },
    ],
  },
]

export default function Questions() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const question = questions[currentQuestion]
  const totalQuestions = questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const handleSelect = (value: string) => {
    if (question.multiSelect) {
      const currentValues = (answers[question.id] as string[]) || []
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
      setAnswers({ ...answers, [question.id]: newValues })
    } else {
      setAnswers({ ...answers, [question.id]: value })
    }
  }

  const isSelected = (value: string) => {
    if (question.multiSelect) {
      return ((answers[question.id] as string[]) || []).includes(value)
    }
    return answers[question.id] === value
  }

  const canContinue = () => {
    const answer = answers[question.id]
    if (question.multiSelect) {
      return Array.isArray(answer) && answer.length > 0
    }
    return !!answer
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Save answers and go to tutorial
      localStorage.setItem('onboarding_answers', JSON.stringify(answers))
      navigate('/onboarding/tutorial')
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const Icon = question.icon

  return (
    <div className="min-h-screen bg-jinbe-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-jinbe-border">
        <img src={logoJinbe} alt="Jinbe" style={{ height: '48px' }} />
        <span className="text-sm text-jinbe-muted">
          Step {currentQuestion + 1} of {totalQuestions}
        </span>
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
        <div className="w-full max-w-xl">
          {/* Question header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-jinbe-primary/20 flex items-center justify-center">
              <Icon className="w-7 h-7 text-jinbe-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white">{question.question}</h1>
              <p className="text-jinbe-muted mt-1">{question.description}</p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isSelected(option.value)
                    ? 'bg-jinbe-primary/10 border-jinbe-primary'
                    : 'bg-jinbe-card border-jinbe-border hover:border-jinbe-muted'
                }`}
              >
                <div className="text-left">
                  <p className="font-medium text-white">{option.label}</p>
                  {option.description && (
                    <p className="text-sm text-jinbe-muted mt-0.5">{option.description}</p>
                  )}
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected(option.value)
                      ? 'border-jinbe-primary bg-jinbe-primary'
                      : 'border-jinbe-border'
                  }`}
                >
                  {isSelected(option.value) && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-jinbe-border hover:bg-jinbe-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:bg-jinbe-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {currentQuestion === totalQuestions - 1 ? 'Continue to Tutorial' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
