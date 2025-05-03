'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { submitProfile } from '@/lib/api'
import { countries } from '@/utils/countries'
import { genders } from '@/utils/genders'
import { memberTypes } from '@/utils/membertypes'

export default function ConfirmProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    birthday: '',
    gender: '',
    memberType: '',
    country: '',
    swifinId: '', // Will be shown but not required for new users
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If profile data is already available (e.g., from session/localStorage), prefill it here
  useEffect(() => {
    const existing = localStorage.getItem('swifinUserProfile')
    if (existing) {
      const parsed = JSON.parse(existing)
      setForm({
        name: parsed.name || '',
        birthday: parsed.birthday || '',
        gender: String(parsed.gender || ''),
        memberType: String(parsed.memberType || ''),
        country: String(parsed.country || ''),
        swifinId: parsed.swifinId || '',
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        birthday: form.birthday,
        gender: parseInt(form.gender),
        memberType: parseInt(form.memberType),
        country: parseInt(form.country),
        ...(form.swifinId ? { swifinId: form.swifinId } : {}),
      }
      await submitProfile(payload)
      router.push('/wallet/activate')
    } catch (err) {
      setError('Failed to confirm profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded mt-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Confirm Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {form.swifinId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Swifin ID</label>
            <input
              type="text"
              name="swifinId"
              value={form.swifinId}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option value="">Select Gender</option>
            {genders.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Member Type</label>
          <select
            name="memberType"
            value={form.memberType}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option value="">Select Member Type</option>
            {memberTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Submitting...' : 'Confirm Profile'}
        </button>
      </form>
    </div>
  )
}

