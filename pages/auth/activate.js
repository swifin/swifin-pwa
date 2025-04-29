import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useProfile } from '@/context/ProfileContext';

// 🛠 FIX import countries properly
import { countries } from '@/utils/countries'; // <- If countries.js exports { countries }

// If countries.js exports DEFAULT, then use:
// import countries from '@/utils/countries';

export default function ActivateWallet() {
  const profileContext = useProfile() || {}; // 🛠 FIX: Safe fallback
  const { profile } = profileContext;
  const router = useRouter();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      const initialForm = {};
      ['birthday', 'mobilePhone', 'gender', 'address', 'postalCode', 'city', 'country'].forEach(field => {
        const valueObj = profile.customValues?.find(v => v.internalName === field);
        initialForm[field] = valueObj?.value || '';
      });
      setForm(initialForm);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/swifin/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('✅ Wallet activated successfully!');
        setTimeout(() => router.push('/dashboard'), 1500);
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
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="NA">Prefer not to say</option>
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

        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded mb-4"
          required
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

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

