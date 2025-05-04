'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { countries } from '@/utils/countries'
import { genders } from '@/utils/genders'
import { memberTypes } from '@/utils/membertypes'

interface CustomValue {
  internalName: string
  value?: string
  possibleValueId?: string
}

interface ParsedProfile {
  name?: string
  email?: string
  customValues?: CustomValue[]
}

export default function ConfirmProfilePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobilePhone: '',
    birthday: '',
    gender: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    memberType: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedProfile = sessionStorage.getItem('swifin_profile')
    if (storedProfile) {
      const parsed: ParsedProfile = JSON.parse(storedProfile)
      const getValue = (key: string) => parsed.customValues?.find((v: CustomValue) => v.internalName === key)

      setForm({
        name: parsed.name || '',
        email: parsed.email || '',
        mobilePhone: getValue('mobilePhone')?.value || '',
        birthday: getValue('birthday')?.value || '',
        gender: getValue('gender')?.possibleValueId || '',
        address: getValue('address')?.value || '',
        postalCode: getValue('postalCode')?.value || '',
        city: getValue('city')?.value || '',
        country: getValue('country')?.possibleValueId || '',
        memberType: getValue('memberType')?.possibleValueId || '',
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const swifinId = sessionStorage.getItem('swifin_id')
      const password = sessionStorage.getItem('swifin_password')

      const res = await fetch('/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swifinId,
          password,
          ...form,
          gender: Number(form.gender),
          country: Number(form.country),
          memberType: Number(form.memberType),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Profile update failed')

      router.push('/(auth)/verify-otp')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Confirm Your Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="p-2 border rounded" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" required />
        <input name="mobilePhone" value={form.mobilePhone} onChange={handleChange} placeholder="Mobile Phone" className="p-2 border rounded" required />
        <input name="birthday" type="date" value={form.birthday} onChange={handleChange} className="p-2 border rounded" required />

        <select name="gender" value={form.gender} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Select Gender</option>
          {genders.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="p-2 border rounded" required />
        <input name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="Postal Code" className="p-2 border rounded" required />
        <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" required />

        <select name="country" value={form.country} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Select Country</option>
          {countries.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select name="memberType" value={form.memberType} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Select Member Type</option>
          {memberTypes.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {error && <p className="text-red-600 col-span-2">{error}</p>}

        <button type="submit" disabled={loading} className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? 'Submitting...' : 'Confirm and Continue'}
        </button>
      </form>
    </div>
  )
}

