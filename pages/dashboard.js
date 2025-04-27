// pages/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [balances, setBalances] = useState({ SFNL: 0, SFNC: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBalances = async () => {
    try {
      const res = await fetch('/api/swifin/get-balances');
      const data = await res.json();
      if (res.ok) {
        setBalances(data);
      } else {
        throw new Error(data.error || 'Failed to load balances');
      }
    } catch (err) {
      console.error('Balance fetch error:', err);
      setError('Error loading balances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const swifinId = localStorage.getItem('swifinId');
    if (!swifinId) {
      router.push('/auth/login');
      return;
    }
    fetchBalances();
  }, []);

  const refreshBalances = () => {
    setLoading(true);
    fetchBalances();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Swifin Wallet Dashboard</h1>

        {loading ? (
          <div className="text-lg text-gray-500 text-center">Loading balances...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-100 p-6 rounded-md shadow text-center">
              <h2 className="text-xl font-semibold text-green-700 mb-2">SFNL Balance</h2>
              <p className="text-2xl font-bold">{balances.SFNL ?? 0} SFNL</p>
            </div>

            <div className="bg-indigo-100 p-6 rounded-md shadow text-center">
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">SFNC Balance</h2>
              <p className="text-2xl font-bold">{balances.SFNC ?? 0} SFNC</p>
            </div>
          </div>
        )}

        <button
          onClick={refreshBalances}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
        >
          🔄 Refresh Balances
        </button>
      </div>
    </div>
  );
}

