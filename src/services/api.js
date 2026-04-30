const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || `Request failed (${response.status})`)
  }

  return response.json()
}

export const appApi = {
  health: () => request('/api/health'),
  getProfile: () => request('/api/profile'),
  updateProfile: (payload) => request('/api/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  getSettings: () => request('/api/settings'),
  updateSettings: (payload) => request('/api/settings', { method: 'PUT', body: JSON.stringify(payload) }),
  getTemplates: () => request('/api/templates'),
  getWorkflows: () => request('/api/automation-hub/workflows'),
  clinicIntakeTriage: (payload) => request('/api/clinic-intake/triage', { method: 'POST', body: JSON.stringify(payload) }),
  getFigmaConnection: () => request('/api/integrations/figma'),
  connectFigma: (payload) => request('/api/integrations/figma/connect', { method: 'POST', body: JSON.stringify(payload) }),
}
