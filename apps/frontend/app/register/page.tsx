// ✅ apps/frontend/app/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import countries from '@/utils/countries';
import genders from '@/utils/genders';
import memberTypes from '@/utils/membertypes';
import { apiPost } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobilePhone: '',
    birthday: '',
    address: '',
    postalCode: '',
    city: '',
    country: '',
    gender: '',
    memberType: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      const res = await apiPost('/auth/register', form);
      localStorage.setItem('userProfile', JSON.stringify(res.user));
      router.push('/wallet/activate');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Register for a Swifin ID</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="input" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input className="input" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="input" name="mobilePhone" placeholder="Mobile Phone" onChange={handleChange} required />
        <input className="input" name="birthday" type="date" onChange={handleChange} required />
        <input className="input" name="address" placeholder="Address" onChange={handleChange} required />
        <input className="input" name="postalCode" placeholder="Postal Code" onChange={handleChange} />
        <input className="input" name="city" placeholder="City" onChange={handleChange} />

        <select name="country" className="input" onChange={handleChange} required>
          <option value="">Select Country</option>
          {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select name="gender" className="input" onChange={handleChange} required>
          <option value="">Select Gender</option>
          {genders.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>

        <select name="memberType" className="input" onChange={handleChange} required>
          <option value="">Select Member Type</option>
          {memberTypes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        {error && <p className="text-red-500">{error}</p>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
      </form>
    </div>
  );
}

