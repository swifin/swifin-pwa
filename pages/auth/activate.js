// FILE: /pages/auth/activate.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function normalizeProfileFields(customValues = []) {
  const requiredFields = [
    { internalName: 'birthday', displayName: 'Birthday' },
    { internalName: 'mobilePhone', displayName: 'Mobile phone' },
    { internalName: 'gender', displayName: 'Gender' },
    { internalName: 'address', displayName: 'Address' },
    { internalName: 'postalCode', displayName: 'Postal code' },
    { internalName: 'city', displayName: 'City' },
    { internalName: 'country', displayName: 'Country' },
    { internalName: 'memberType', displayName: 'Member Type' },
  ];

  const existingFields = {};
  customValues.forEach((field) => {
    existingFields[field.internalName] = field;
  });

  const normalizedFields = requiredFields.map((requiredField) => {
    if (existingFields[requiredField.internalName]) {
      return existingFields[requiredField.internalName];
    } else {
      return {
        internalName: requiredField.internalName,
        displayName: requiredField.displayName,
        value: '', // blank for user to complete
      };
    }
  });

  return normalizedFields;
}

export default function ActivateWallet() {
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user already activated
    const storedProfile = localStorage.getItem('profile');
    const activated = localStorage.getItem('activated');

    if (storedProfile && activated === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
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

      // Normalize missing fields
      const normalizedCustomValues = normalizeProfileFields(data.customValues || []);

      const normalizedProfile = {
        ...data,
        customValues: normalizedCustomValues,
      };

      // Save to localStorage
      localStorage.setItem('profile', JSON.stringify({ 
        ...normalizedProfile, 
        activated: true 
      }));
      localStorage.setItem('activated', 'true');
      localStorage.setItem('swifinId', data.username);

      // Set profile in state
      setProfile(normalizedProfile);

      // Redirect after successful activation
      router.push('/dashboard');

    } catch (err) {
      console.error('Activation error:', err);
      setError('Unexpected error. Please try again.');
      setLoading(false);
    }
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
          onClick={() => {
            localStorage.removeItem('profile');
            localStorage.removeItem('activated');
            localStorage.removeItem('swifinId');
            setProfile(null);
            router.push('/auth/login');
          }}
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
          onChange={(e) => setSwifinId(e.target.value)}
          required
        />

        <label className="block mb-2 text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

