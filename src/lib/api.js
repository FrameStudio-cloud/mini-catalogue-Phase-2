const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function api(path, options = {}) {
  const url = options.method ? `${API}${path}` : `${API}${path}`
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : {},
    body: options.body || undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error')
    throw new Error(text)
  }
  return res.json()
}
