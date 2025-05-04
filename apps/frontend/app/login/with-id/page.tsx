'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginWithSwifinID() {
  const router = useRouter()
  const [swifinId, setSwifinId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swifinId, password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Login with Swifin ID
        </h2>

        <form onSubmit={handleLogin}>
          <label className="mb-2 block text-sm font-medium text-gray-700">Swifin ID</label>
          <input
            type="text"
            value={swifinId}
            onChange={(e) => setSwifinId(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />

          <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />

          {error && (
            <p className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  )
}
