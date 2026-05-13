// Urban VASP As a Service API
// Base URL: https://api.urbancaas.com

const BASE_URL = 'https://api.urbancaas.com'

// Types
export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  refresh_expires_in: number
  workspace: string
  permission_type: string
}

export interface Customer {
  id: string
  email: string
  type: 'individual' | 'business'
  status: 'active' | 'pending' | 'suspended'
  criteria: {
    verification: 'approved' | 'pending' | 'rejected'
    tos: 'signed' | 'not_signed'
    operational: 'enabled' | 'disabled'
  }
  platforms: {
    digital_assets: boolean
    global_payments: boolean
  }
  spread: {
    digital_assets: number
    global_payments: number
  }
  created_at: string
  updated_at: string
}

export interface CreateCustomerRequest {
  email: string
  type: 'individual' | 'business'
  spread: {
    digital_assets: number
    global_payments: number
  }
}

export interface VerificationLinkResponse {
  customer_id: string
  verification_link: string
  created_at: string
  expires_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    page_size: number
    total_items: number
    total_pages: number
  }
}

export interface Webhook {
  id: string
  url: string
  description?: string
  status: 'active' | 'inactive'
  events: WebhookEvent[]
  secret?: string
  created_at: string
}

export type WebhookEvent =
  | 'customer.verification.updated'
  | 'customer.tos.updated'
  | 'customer.status.updated'

export interface CreateWebhookRequest {
  url: string
  description?: string
  events: WebhookEvent[]
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

// Token management
let accessToken: string | null = null
let refreshToken: string | null = null

export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshToken = refresh
  localStorage.setItem('urban_access_token', access)
  localStorage.setItem('urban_refresh_token', refresh)
}

export function getTokens() {
  if (!accessToken) {
    accessToken = localStorage.getItem('urban_access_token')
    refreshToken = localStorage.getItem('urban_refresh_token')
  }
  return { accessToken, refreshToken }
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('urban_access_token')
  localStorage.removeItem('urban_refresh_token')
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { accessToken } = getTokens()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error.message)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// Authentication
export async function authorize(apiKey: string, apiSecret: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/v2/auth/authorize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret }),
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.error.message)
  }

  const data: AuthResponse = await response.json()
  setTokens(data.access_token, data.refresh_token)
  return data
}

export async function refreshAccessToken(): Promise<AuthResponse> {
  const { refreshToken: token } = getTokens()

  if (!token) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${BASE_URL}/v2/auth/refresh_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: token }),
  })

  if (!response.ok) {
    clearTokens()
    const error: ApiError = await response.json()
    throw new Error(error.error.message)
  }

  const data: AuthResponse = await response.json()
  setTokens(data.access_token, data.refresh_token)
  return data
}

// Customers
export async function createCustomer(data: CreateCustomerRequest): Promise<Customer> {
  return fetchWithAuth<Customer>('/v2/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getCustomers(page = 1, pageSize = 20): Promise<PaginatedResponse<Customer>> {
  return fetchWithAuth<PaginatedResponse<Customer>>(
    `/v2/customers?page=${page}&page_size=${pageSize}`
  )
}

export async function getCustomerById(customerId: string): Promise<Customer> {
  return fetchWithAuth<Customer>(`/v2/customers/${customerId}`)
}

export async function generateVerificationLink(customerId: string): Promise<VerificationLinkResponse> {
  return fetchWithAuth<VerificationLinkResponse>(
    `/v2/customers/${customerId}/verification`,
    { method: 'POST' }
  )
}

export async function updateCustomerSpread(
  customerId: string,
  spread: Partial<{ digital_assets: number; global_payments: number }>
): Promise<Customer> {
  return fetchWithAuth<Customer>(`/v2/customers/${customerId}/spread`, {
    method: 'PATCH',
    body: JSON.stringify({ spread }),
  })
}

// Webhooks
export async function listWebhooks(): Promise<{ items: Webhook[] }> {
  return fetchWithAuth<{ items: Webhook[] }>('/v2/webhooks')
}

export async function createWebhook(data: CreateWebhookRequest): Promise<Webhook> {
  return fetchWithAuth<Webhook>('/v2/webhooks', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  await fetchWithAuth<void>(`/v2/webhooks/${webhookId}`, {
    method: 'DELETE',
  })
}

// Webhook signature validation helper
export function parseWebhookSignature(signature: string): { timestamp: string; v1: string } | null {
  const parts = signature.split(',')
  let timestamp = ''
  let v1 = ''

  for (const part of parts) {
    const [key, value] = part.split('=')
    if (key === 't') timestamp = value
    if (key === 'v1') v1 = value
  }

  if (!timestamp || !v1) return null
  return { timestamp, v1 }
}
