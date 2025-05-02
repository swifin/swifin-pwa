'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { countries } from '@/utils/countries'
import { genders } from '@/utils/genders'
import { memberTypes } from '@/utils/membertypes'
import { submitProfile } from '@/lib/api'

export default function ConfirmProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobilePhone: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    gender: '',
    memberType: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await submitProfile(form)
      router.push('/wallet/activate')
    } catch (err) {
      setError('Failed to confirm profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4 text-center">Confirm Your Profile</h1>
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
        <input className="input" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input className="input" name="mobilePhone" value={form.mobilePhone} onChange={handleChange} placeholder="Mobile Phone" required />
        <input className="input" name="address" value={form.address} onChange={handleChange} placeholder="Address" />
        <input className="input" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" />
        <input className="input" name="city" value={form.city} onChange={handleChange} placeholder="City" />

        <select className="input" name="country" value={form.country} onChange={handleChange} required>
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select className="input" name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          {genders.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select className="input" name="memberType" value={form.memberType} onChange={handleChange} required>
          <option value="">Select Member Type</option>
          {memberTypes.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
        >
          {loading ? 'Submitting...' : 'Confirm and Continue'}
        </button>
      </form>
    </div>
  )
}


