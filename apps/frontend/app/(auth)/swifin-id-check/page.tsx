'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SwifinIdCheckPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [swifinId, setSwifinId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // grab ?email=... from URL (client side only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get('email') || '')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/swifin-id-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, swifinId, password }),
    })
    const data = await res.json()
    if (res.ok && data.success) {
      router.push(`/confirm-profile?swifinId=${encodeURIComponent(swifinId)}`)
    } else {
      setError(data.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Enter Your Swifin ID</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Swifin ID"
          value={swifinId}
          onChange={(e) => setSwifinId(e.currentTarget.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          className="w-full border rounded p-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Continue
        </button>
      </form>
    </div>
  )
}

