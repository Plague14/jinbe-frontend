import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  authorize,
  refreshAccessToken,
  getTokens,
  clearTokens,
  type AuthResponse,
} from '@/services/urbanApi'

interface User {
  workspace: string
  permission_type: string
  isAuthenticated: boolean
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isOnboardingComplete: boolean
  login: (apiKey: string, apiSecret: string) => Promise<void>
  logout: () => void
  completeOnboarding: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  isOnboardingComplete: false,
  login: async () => {},
  logout: () => {},
  completeOnboarding: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)

  useEffect(() => {
    // Check for existing tokens on mount
    const { accessToken } = getTokens()
    const onboardingComplete = localStorage.getItem('onboarding_complete') === 'true'
    setIsOnboardingComplete(onboardingComplete)

    if (accessToken) {
      // Try to refresh the token to validate it
      refreshAccessToken()
        .then((response) => {
          setUser({
            workspace: response.workspace,
            permission_type: response.permission_type,
            isAuthenticated: true,
          })
        })
        .catch(() => {
          clearTokens()
          setUser(null)
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (apiKey: string, apiSecret: string) => {
    const response: AuthResponse = await authorize(apiKey, apiSecret)
    setUser({
      workspace: response.workspace,
      permission_type: response.permission_type,
      isAuthenticated: true,
    })
  }

  const logout = () => {
    clearTokens()
    setUser(null)
    localStorage.removeItem('onboarding_complete')
    setIsOnboardingComplete(false)
  }

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true')
    setIsOnboardingComplete(true)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isOnboardingComplete,
        login,
        logout,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
