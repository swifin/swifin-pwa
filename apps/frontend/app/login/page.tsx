'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiPost } from '@/lib/api'

type LoginResponse = {
  redirect: string
  profile: any
}

export default function LoginPage() {
  const [swifinId, setSwifinId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res: LoginResponse = await apiPost('/users/login', { swifinId, password })

      if (res.redirect) {
        localStorage.setItem('userProfile', JSON.stringify(res.profile))
        router.push(res.redirect)
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Login to Swifin Wallet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Swifin ID</label>
          <input
            className="w-full border px-3 py-2 rounded mt-1"
            value={swifinId}
            onChange={(e) => setSwifinId(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  )
}

