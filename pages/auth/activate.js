/* Updated: /pages/auth/activate.js */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const GENDER_OPTIONS = [
  { id: 1, label: 'Male' },
  { id: 2, label: 'Female' },
  { id: 214, label: 'NA' },
];

export default function ActivateWallet() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('profile');
    if (stored) {
      const p = JSON.parse(stored);
      if (p.activated) {
        router.push('/dashboard');
      } else {
        setProfile(p);
        const initialForm = {};
        ['birthday', 'mobilePhone', 'gender', 'address', 'postalCode', 'city', 'country'].forEach(field => {
          const valueObj = p.customValues?.find(v => v.internalName === field);
          initialForm[field] = valueObj?.value || '';
        });
        setForm(initialForm);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/swifin/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('profile', JSON.stringify({ ...profile, activated: true }));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Activation failed');
      }
    } catch (err) {
      console.error('Activation error', err);
      setError('Unexpected error.');
    }
    setLoading(false);
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Complete Profile</h1>

        <input
          type="date"
          name="birthday"
          value={form.birthday}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        <input
          type="text"
          name="mobilePhone"
          value={form.mobilePhone}
          onChange={handleChange}
          placeholder="Mobile Phone"
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-4"
          required
        >
          <option value="">Select Gender</option>
          {GENDER_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.label}>{opt.label}</option>
          ))}
        </select>

        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        <input
          type="text"
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        <input
          type="text"
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full border px-3 py-2 rounded mb-4"
          required
        />

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {loading ? 'Activating...' : 'Activate Wallet'}
        </button>
      </form>
    </div>
  );
}
