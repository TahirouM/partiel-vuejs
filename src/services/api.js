// Couche d'accès à l'API EventHub.
// Toutes les requêtes passent par /api (proxifié vers l'API Node par Vite).
const BASE_URL = '/api'

// Petit helper qui centralise le fetch, le parsing JSON et la gestion d'erreur.
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.error || data?.errors?.[0]?.msg || 'Une erreur est survenue'
    throw new Error(message)
  }

  return data
}

export function fetchEvents() {
  return request('/events')
}

export function fetchEventById(id) {
  return request(`/events/${id}`)
}

export function createEvent(payload) {
  return request('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
