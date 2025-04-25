// pages/activate-wallet.js

import { useState } from 'react';

export default function ActivateWallet() {
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const handleActivate = async () => {
    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const res = await fetch('/api/swifin/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swifinId, swifinPassword: password })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Activation failed');

      setProfile(data.profile);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Activate Your Swifin Wallet</h1>

      <div className="mb-4">
        <label className="block mb-1">Swifin ID</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={swifinId}
          onChange={(e) => setSwifinId(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleActivate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Activating...' : 'Activate Wallet'}
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {profile && (
        <div className="mt-8 bg-white shadow p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Profile Retrieved ✅</h2>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>

          <div className="mt-4">
            <h3 className="font-semibold">Custom Fields</h3>
            <ul className="list-disc list-inside">
              {profile.customValues.map((item, idx) => (
                <li key={idx}><strong>{item.displayName}:</strong> {item.value}</li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-green-600">You can now continue to complete your wallet setup.</p>
        </div>
      )}
    </div>
  );
}
