import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function WalletActivatePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile'); // you will create this API next
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        router.push('/auth/login');
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold text-blue-600">Loading your wallet...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return null; // already redirected
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Activate Your Wallet</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name || ''}
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Swifin ID</label>
            <input
              type="text"
              value={profile.username || ''}
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              value={profile.email || ''}
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-md transition"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}
