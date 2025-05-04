'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterNewUserPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    birthday: '',
    phone: '',
    address: '',
    postal_code: '',
    city: '',
    country: '',
    password: '',
  })

  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data?.error || 'Registration failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register New Account</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" className="w-full mb-2 p-2 border rounded" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" className="w-full mb-2 p-2 border rounded" placeholder="Email" value={form.email} onChange={handleChange} required />
        <select name="gender" className="w-full mb-2 p-2 border rounded" value={form.gender} onChange={handleChange} required>
          <option value="">Gender</option>
          <option value="1">Male</option>
          <option value="2">Female</option>
        </select>
        <input name="birthday" type="date" className="w-full mb-2 p-2 border rounded" placeholder="Birthday" value={form.birthday} onChange={handleChange} required />
        <input name="phone" className="w-full mb-2 p-2 border rounded" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <input name="address" className="w-full mb-2 p-2 border rounded" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="postal_code" className="w-full mb-2 p-2 border rounded" placeholder="Postal Code" value={form.postal_code} onChange={handleChange} />
        <input name="city" className="w-full mb-2 p-2 border rounded" placeholder="City" value={form.city} onChange={handleChange} />
        <input name="country" className="w-full mb-2 p-2 border rounded" placeholder="Country" value={form.country} onChange={handleChange} />
        <input name="password" type="password" className="w-full mb-4 p-2 border rounded" placeholder="Password" value={form.password} onChange={handleChange} required />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register & Activate
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  )
}

