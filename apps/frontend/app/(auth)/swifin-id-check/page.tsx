//apps/frontend/app/(auth)/swifin-id-check/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SwifinIdCheckPage() {
  const [swifinId, setSwifinId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/auth/login-swifin-id', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ swifinId, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data?.error || 'Invalid credentials')
    } else {
      sessionStorage.setItem('swifin_profile', JSON.stringify(data.profile))
      router.push('/confirm-profile')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Enter Your Swifin ID</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full mb-2 p-2 border rounded"
          placeholder="Swifin ID"
          value={swifinId}
          onChange={(e) => setSwifinId(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Confirm Profile
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  )
}
