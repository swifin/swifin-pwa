import { useState, useEffect } from 'react';
import countries from '@/lib/countries';

export default function CompleteWallet() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch('/api/swifin/load-profile')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMessage({ type: 'error', text: data.error });
        } else {
          setProfile(data);
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch('/api/swifin/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });

    const data = await res.json();
    setSaving(false);

    if (data.success) {
      setMessage({ type: 'success', text: 'Profile updated and wallet activated successfully!' });
    } else {
      setMessage({ type: 'error', text: data.error || 'Something went wrong.' });
      console.error('[Update Error]', data.raw || data.details);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading your profile...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Activate Your Swifin Wallet</h1>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="id" type="hidden" value={profile.id} />
        <input name="principal" type="hidden" value={profile.username} />

        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input name="name" type="text" value={profile.name || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" value={profile.email || ''} onChange={handleChange} required className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Birthday</label>
          <input name="birthday" type="date" value={profile.birthday || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select name="gender" value={profile.gender || ''} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="1">Male</option>
            <option value="2">Female</option>
            <option value="3">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Mobile Phone</label>
          <input name="mobilePhone" type="text" value={profile.mobilePhone || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input name="address" type="text" value={profile.address || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Postal Code</label>
          <input name="postalCode" type="text" value={profile.postalCode || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input name="city" type="text" value={profile.city || ''} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Country</label>
          <select name="country" value={profile.country || ''} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Country</option>
            {countries.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          {saving ? 'Saving...' : 'Activate Wallet'}
        </button>
      </form>
    </div>
  );
}

