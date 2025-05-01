// apps/frontend/app/confirm-profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import countries from '../../utils/countries';
import genders from '../../utils/genders';
import memberTypes from '../../utils/membertypes';

export default function ConfirmProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('userProfile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleChange = (field: string, value: string | number) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/profile/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const body = await res.json();
      setError(body.error || 'Profile confirmation failed.');
    }
  };

  if (!profile) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Confirm Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={profile.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Mobile Phone</label>
          <input
            type="text"
            value={profile.mobilePhone || ''}
            onChange={(e) => handleChange('mobilePhone', e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Address</label>
          <input
            type="text"
            value={profile.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Postal Code</label>
          <input
            type="text"
            value={profile.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">City</label>
          <input
            type="text"
            value={profile.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block mb-1">Gender</label>
          <select
            value={profile.genderId || ''}
            onChange={(e) => handleChange('genderId', parseInt(e.target.value))}
            className="w-full border rounded p-2"
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
          <label className="block mb-1">Country</label>
          <select
            value={profile.countryId || ''}
            onChange={(e) => handleChange('countryId', parseInt(e.target.value))}
            className="w-full border rounded p-2"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Member Type</label>
          <select
            value={profile.memberTypeId || ''}
            onChange={(e) => handleChange('memberTypeId', parseInt(e.target.value))}
            className="w-full border rounded p-2"
          >
            <option value="">Select Member Type</option>
            {memberTypes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Confirm and Continue
        </button>
      </form>
    </div>
  );
}

