'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiPost } from '@/lib/api'

type LoginResponse = {
  profile: {
    swifin_id: string
    password_hash: string
    name: string
    email?: string
    [key: string]: any
  }
  redirect?: string
}

export default function HasSwifinIdPage() {
  const router = useRouter()
  const [swifinId, setSwifinId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await apiPost('/auth/login-swifin-id', { swifinId, password }) as LoginResponse

      if (!res?.profile) throw new Error('Invalid response from server.')

      localStorage.setItem('userProfile', JSON.stringify(res.profile))
      localStorage.setItem('swifin_id', res.profile.swifin_id)
      localStorage.setItem('swifin_password', res.profile.password_hash)

      router.push(res.redirect || '/confirm-profile')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white">
      <h1 className="text-2xl font-bold mb-4">Login with Swifin ID</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="swifinId"
          placeholder="Swifin ID"
          className="w-full p-2 mb-3 border rounded"
          value={swifinId}
          onChange={(e) => setSwifinId(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

