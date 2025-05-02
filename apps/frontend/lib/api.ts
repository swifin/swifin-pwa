// apps/frontend/lib/api.ts

export async function post<T>(url: string, data: any): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const message = await res.text()
    throw new Error(`POST ${url} failed: ${message}`)
  }
  return res.json()
}

export async function get<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const message = await res.text()
    throw new Error(`GET ${url} failed: ${message}`)
  }
  return res.json()
}

// --- Swifin Authenticated Calls (one-time actions) ---
export const loginSwifinUser = (data: {
  swifinId: string
  password: string
}) => post('/api/auth/login', data)

export const submitProfile = (data: any) => post('/api/users/submit', data)

export const registerNewUser = (data: any) => post('/api/users/register', data)

export const activateWallet = (data: { swifinId: string }) =>
  post('/api/users/wallet', data)

export const getWalletSummary = () => get('/api/users/wallet')

