// ✅ Phase 1: Email Entry and Routing
// File: apps/frontend/app/(auth)/email-entry/page.tsx

'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function EmailEntryPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function checkEmail(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/email-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (data.redirect) router.push(data.redirect)
      else alert(data.error || 'Unexpected response')
    } catch (err) {
      alert('Failed to check email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={checkEmail} className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Enter your Email</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded"
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Continue'}
      </button>
    </form>
  )
}
