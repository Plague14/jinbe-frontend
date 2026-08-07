import { useState, useEffect } from 'react'
import {
  Webhook,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import type { Webhook as WebhookType, WebhookEvent } from '@/services/urbanApi'

// Mock data
const mockWebhooks: WebhookType[] = [
  {
    id: 'WHK00000123',
    url: 'https://partner.example.com/webhooks/urban',
    description: 'Endpoint de produção',
    status: 'active',
    events: ['customer.verification.updated', 'customer.tos.updated', 'customer.status.updated'],
    created_at: '2026-04-04T12:00:00Z',
  },
  {
    id: 'WHK00000124',
    url: 'https://staging.partner.com/webhooks',
    description: 'Ambiente de homologação',
    status: 'active',
    events: ['customer.verification.updated'],
    created_at: '2026-04-05T09:30:00Z',
  },
]

const availableEvents: { value: WebhookEvent; label: string; description: string }[] = [
  {
    value: 'customer.verification.updated',
    label: 'Verificação Atualizada',
    description: 'Quando o status de verificação do customer muda',
  },
  {
    value: 'customer.tos.updated',
    label: 'Termos Atualizados',
    description: 'Quando o customer assina ou precisa assinar os termos',
  },
  {
    value: 'customer.status.updated',
    label: 'Status Atualizado',
    description: 'Quando o status do customer muda (ativo, pendente, etc.)',
  },
]

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    url: '',
    description: '',
    events: [] as WebhookEvent[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [newSecret, setNewSecret] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setWebhooks(mockWebhooks)
      setIsLoading(false)
    }, 500)
  }, [])

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleEvent = (event: WebhookEvent) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter((e) => e !== event)
        : [...prev.events, event],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!formData.url.startsWith('https://')) {
      setFormError('A URL do webhook deve usar HTTPS')
      return
    }

    if (formData.events.length === 0) {
      setFormError('Selecione pelo menos um evento')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newWebhook: WebhookType = {
        id: `WHK${String(Date.now()).slice(-8)}`,
        url: formData.url,
        description: formData.description,
        status: 'active',
        events: formData.events,
        secret: 'whsec_' + Math.random().toString(36).substring(2, 26),
        created_at: new Date().toISOString(),
      }

      setWebhooks((prev) => [...prev, newWebhook])
      setNewSecret(newWebhook.secret!)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create webhook')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (webhookId: string) => {
    if (!confirm('Tem certeza que deseja excluir este webhook?')) return

    setDeletingId(webhookId)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setWebhooks((prev) => prev.filter((w) => w.id !== webhookId))
    } catch (err) {
      alert('Failed to delete webhook')
    } finally {
      setDeletingId(null)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setFormData({ url: '', description: '', events: [] })
    setFormError('')
    setNewSecret(null)
    setShowSecret(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-jinbe-bg">
      <Header title="Webhooks" />

      <div className="px-4 sm:px-6 py-6">
        {/* Info banner */}
        <div className="mb-6 p-4 bg-jinbe-info/10 border border-jinbe-info/20 rounded-xl flex items-start gap-3">
          <Shield className="w-5 h-5 text-jinbe-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium mb-1">Segurança de Webhooks</p>
            <p className="text-sm text-jinbe-muted">
              Todos os webhooks são assinados usando HMAC-SHA256. Valide o header X-Urban-Signature para
              garantir que as requisições são autênticas. Os secrets dos webhooks são mostrados apenas uma vez durante a criação.
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-jinbe-muted">
            {webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} configurado{webhooks.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Webhook
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-jinbe-primary animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && webhooks.length === 0 && (
          <div className="text-center py-12">
            <Webhook className="w-12 h-12 text-jinbe-dim mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhum webhook configurado</h3>
            <p className="text-jinbe-muted mb-6">
              Configure webhooks para receber notificações em tempo real sobre eventos de customers
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Webhook
            </button>
          </div>
        )}

        {/* Webhook list */}
        {!isLoading && webhooks.length > 0 && (
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="bg-jinbe-card border border-jinbe-border rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-jinbe-primary/20 flex items-center justify-center flex-shrink-0">
                      <Webhook className="w-5 h-5 text-jinbe-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-white">{webhook.id}</span>
                        <button
                          onClick={() => copyToClipboard(webhook.id, webhook.id)}
                          className="p-1 hover:bg-jinbe-border rounded transition-colors"
                        >
                          {copiedId === webhook.id ? (
                            <CheckCircle2 className="w-4 h-4 text-jinbe-success" />
                          ) : (
                            <Copy className="w-4 h-4 text-jinbe-dim" />
                          )}
                        </button>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded ${
                            webhook.status === 'active'
                              ? 'bg-jinbe-success/20 text-jinbe-success'
                              : 'bg-jinbe-danger/20 text-jinbe-danger'
                          }`}
                        >
                          {webhook.status}
                        </span>
                      </div>
                      <a
                        href={webhook.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-jinbe-muted hover:text-jinbe-primary transition-colors"
                      >
                        <span className="text-sm truncate max-w-[300px]">{webhook.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      {webhook.description && (
                        <p className="text-sm text-jinbe-dim mt-1">{webhook.description}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(webhook.id)}
                    disabled={deletingId === webhook.id}
                    className="flex items-center gap-2 px-3 py-2 bg-jinbe-danger/10 hover:bg-jinbe-danger/20 text-jinbe-danger text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === webhook.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Excluir
                  </button>
                </div>

                {/* Events */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {webhook.events.map((event) => (
                    <span
                      key={event}
                      className="px-3 py-1 bg-jinbe-bg text-jinbe-muted text-xs font-medium rounded-full"
                    >
                      {event}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-jinbe-dim">Criado em {formatDate(webhook.created_at)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Webhook Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-jinbe-card border border-jinbe-border rounded-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-jinbe-border">
              <h2 className="text-lg font-semibold text-white">
                {newSecret ? 'Webhook Criado' : 'Criar Webhook'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-jinbe-border rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-jinbe-muted" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6">
              {newSecret ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-jinbe-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-jinbe-success" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Webhook criado com sucesso!</p>
                      <p className="text-sm text-jinbe-muted">
                        Salve seu secret do webhook - ele não será mostrado novamente
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-jinbe-warning/10 border border-jinbe-warning/20 rounded-lg">
                    <p className="text-sm text-jinbe-warning font-medium mb-2">
                      Secret do Webhook (salve agora!)
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 bg-jinbe-bg rounded-lg text-white text-sm font-mono break-all">
                        {showSecret ? newSecret : '••••••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="p-2 hover:bg-jinbe-border rounded transition-colors"
                      >
                        {showSecret ? (
                          <EyeOff className="w-5 h-5 text-jinbe-muted" />
                        ) : (
                          <Eye className="w-5 h-5 text-jinbe-muted" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(newSecret, 'secret')}
                        className="p-2 hover:bg-jinbe-border rounded transition-colors"
                      >
                        {copiedId === 'secret' ? (
                          <CheckCircle2 className="w-5 h-5 text-jinbe-success" />
                        ) : (
                          <Copy className="w-5 h-5 text-jinbe-muted" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={closeModal}
                    className="w-full py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 text-white font-medium rounded-lg transition-colors"
                  >
                    Concluído
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {formError && (
                    <div className="p-4 bg-jinbe-danger/10 border border-jinbe-danger/20 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-jinbe-danger flex-shrink-0 mt-0.5" />
                      <p className="text-jinbe-danger text-sm">{formError}</p>
                    </div>
                  )}

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-jinbe-muted mb-2">
                      Webhook URL *
                    </label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://your-domain.com/webhooks/urban"
                      required
                      className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                    <p className="text-xs text-jinbe-dim mt-1">Deve usar HTTPS</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-jinbe-muted mb-2">
                      Descrição (opcional)
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Ex: Endpoint de produção"
                      className="w-full px-4 py-3 bg-jinbe-bg border border-jinbe-border rounded-lg text-white placeholder-jinbe-dim focus:outline-none focus:border-jinbe-primary transition-colors"
                    />
                  </div>

                  {/* Events */}
                  <div>
                    <label className="block text-sm font-medium text-jinbe-muted mb-2">
                      Eventos *
                    </label>
                    <div className="space-y-2">
                      {availableEvents.map((event) => (
                        <button
                          key={event.value}
                          type="button"
                          onClick={() => toggleEvent(event.value)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                            formData.events.includes(event.value)
                              ? 'bg-jinbe-primary/10 border-jinbe-primary'
                              : 'bg-jinbe-bg border-jinbe-border hover:border-jinbe-muted'
                          }`}
                        >
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">{event.label}</p>
                            <p className="text-xs text-jinbe-muted">{event.description}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              formData.events.includes(event.value)
                                ? 'border-jinbe-primary bg-jinbe-primary'
                                : 'border-jinbe-border'
                            }`}
                          >
                            {formData.events.includes(event.value) && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-3 bg-jinbe-border hover:bg-jinbe-hover text-white font-medium rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-jinbe-primary hover:bg-jinbe-primary/90 disabled:bg-jinbe-primary/50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Criando...
                        </>
                      ) : (
                        'Criar Webhook'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
