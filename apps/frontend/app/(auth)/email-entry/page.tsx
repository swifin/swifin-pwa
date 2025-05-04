// ✅ File: apps/frontend/app/(auth)/email-entry/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmailEntryPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    sessionStorage.setItem('otp_email', email)

    const res = await fetch('/auth/email-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)

    if (data.redirect === 'otp') {
      router.push('/verify-otp')
    } else {
      router.push('/swifin-id-check')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Enter your Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? 'Checking...' : 'Continue'}
        </button>
      </form>
    </div>
  )
}

