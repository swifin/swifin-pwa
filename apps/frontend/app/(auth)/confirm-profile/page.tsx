'use client'
//apps/frontend/app/(auth)/confirm-profile/page.tsx

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConfirmProfilePage() {
  const [form, setForm] = useState<any>(null)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem('swifin_profile')
    if (!data) {
      router.push('/swifin-id-check')
    } else {
      setForm(JSON.parse(data))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/auth/submit-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data?.error || 'Something went wrong')
    }
  }

  if (!form) return null

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Profile</h1>
      <form onSubmit={handleSubmit}>
        {['name', 'email', 'birthday', 'phone', 'address', 'postal_code', 'city', 'country'].map((field) => (
          <input
            key={field}
            className="w-full mb-3 p-2 border rounded"
            name={field}
            placeholder={field.replace('_', ' ')}
            value={form[field] || ''}
            onChange={handleChange}
          />
        ))}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Activate Account</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  )
}
