// apps/frontend/app/(auth)/verify-otp/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const email = sessionStorage.getItem('otp_email') || ''
    if (!email) {
      setError('Session expired. Please re-enter your email.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed')
      }

      // ✅ Store JWT in localStorage
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }

      // ✅ Clear email session storage
      sessionStorage.removeItem('otp_email')

      // 🚀 Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <p className="mb-4 text-sm text-gray-600">
        Enter the 6-digit OTP sent to your email address.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 border rounded mb-3"
          required
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>
      </form>
    </div>
  )
}

