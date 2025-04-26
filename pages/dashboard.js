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
    fetchBalances();
  }, []);

  const refreshBalances = () => {
    setLoading(true);
    fetchBalances();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8">
      <h1 className="text-3xl font-bold mb-8">Swifin Wallet Dashboard</h1>

      {loading ? (
        <div>Loading balances...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <div className="card">
            <h2 className="text-xl font-semibold">SFNL Balance</h2>
            <p className="text-2xl">{balances.SFNL} SFNL</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold">SFNC Balance</h2>
            <p className="text-2xl">{balances.SFNC} SFNC</p>
          </div>
        </div>
      )}

      <button
        onClick={refreshBalances}
        className="mt-8 btn"
      >
        🔄 Refresh Balances
      </button>
    </div>
  );
}

