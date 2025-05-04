'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resent, setResent] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('otp_email') || ''
      if (!storedEmail) {
        setError('Session expired. Please re-enter your email.')
      }
      setEmail(storedEmail)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email) {
      setError('Session expired. Please re-enter your email.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/auth/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: otp }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'OTP verification failed')
      }

      if (typeof window !== 'undefined') {
        if (data.token) {
          localStorage.setItem('session_token', data.token)
        }
        sessionStorage.removeItem('otp_email')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResent(false)
    try {
      const res = await fetch('/auth/email-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed to resend OTP')
      setResent(true)
    } catch (err: any) {
      setError(err.message || 'Could not resend OTP')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
      <p className="mb-4 text-sm text-gray-600">
        Enter the 6-digit OTP sent to your email <strong>{email}</strong>
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          maxLength={6}
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
      <div className="mt-4 text-center">
        <button
          onClick={handleResend}
          className="text-blue-600 text-sm underline"
        >
          Resend OTP
        </button>
        {resent && (
          <p className="text-green-600 text-sm mt-2">
            OTP resent successfully.
          </p>
        )}
      </div>
    </div>
  )
}

