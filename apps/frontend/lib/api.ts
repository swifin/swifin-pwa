// apps/frontend/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://75.119.136.87:3002'

export async function apiPost<T>(url: string, data: any): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`❌ API request failed: ${res.status} ${res.statusText}\n${errText}`)
      throw new Error('API request failed')
    }

    return await res.json()
  } catch (err) {
    console.error('❌ apiPost error:', err)
    throw err
  }
}



// activateWallet
export async function activateWallet(swifinId: string):Promise<{ success: boolean }>  {
  return apiPost('/wallet/activate', { swifinId })
}
//getWalletSummary
export async function getWalletSummary(
  swifinId: string
): Promise<{ balances: { sfnc: number; sfnl: number }; transactions: Record<string, number> }> {
  return apiPost('/wallet/summary', { swifinId })
}



// Users
export async function submitProfile(data: {
  swifinId?: string
  name: string
  gender: number
  birthday: string
  memberType: number
  country: number
}) {
  return apiPost('/users/submit', data)
}

export async function registerUser(data: {
  swifinId: string
  password: string
  confirmPassword: string
}) {
  return apiPost('/users/register', data)
}

// Admin Summary & Activity
export async function getAdminSummary(): Promise<{
  users: number
  wallets: number
  transactions: number
  sfncTotal: number
  sfnlTotal: number
}> {
  return apiPost('/admin/summary', {})
}

export async function getTopContributors(): Promise<
  { name: string; swifinId: string; sfnl: number }[]
> {
  return apiPost('/admin/contributors', {})
}

export async function getActivityLogs(): Promise<
  { id: number; type: string; amount: number; time: string; user: string; swifinId: string }[]
> {
  return apiPost('/admin/logs', {})
}

// ✅ Vendor Panel Functions
export async function getVendors(): Promise<
  {
    id: string
    type: string
    active: boolean
    name: string
    email: string
    swifinId: string
    revenue: number
  }[]
> {
  return apiPost('/admin/vendors', {})
}

export async function toggleVendorStatus(id: string, active: boolean) {
  return apiPost('/admin/toggle-vendor', { id, active })
}

export async function sendVendorMessage(email: string, message: string) {
  return apiPost('/admin/message', { email, message })
}

// ✅ Referral Tree
export async function getReferralTree(): Promise<any> {
  return apiPost('/admin/referrals', {})
}

