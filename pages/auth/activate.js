// FILE: /pages/auth/activate.js

import { useState } from 'react';

export default function ActivateWallet() {
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/swifin/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ swifinId, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || 'Something went wrong');
      return;
    }

    setProfile(data);
  };

  if (profile) {
    const mobile = profile.customValues.find(v => v.internalName === 'mobilePhone')?.value || '';
    const memberType = profile.customValues.find(v => v.internalName === 'memberType')?.value || '';

    return (
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Welcome, {profile.name}</h1>
        <p className="mb-2">Swifin ID: {profile.username}</p>
        <p className="mb-2">Email: {profile.email}</p>
        <p className="mb-2">Mobile Phone: {mobile}</p>
        <p className="mb-4">Member Type: {memberType}</p>
        <button
          onClick={() => setProfile(null)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Activate Swifin Wallet</h1>

        <label className="block mb-2 text-sm font-medium">Swifin ID</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4"
          value={swifinId}
          onChange={e => setSwifinId(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-4"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Activating...' : 'Activate Wallet'}
        </button>
      </form>
    </div>
  );
}
