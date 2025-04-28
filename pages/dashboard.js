// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const router = useRouter();
  const [balances, setBalances] = useState({ SFNL: 0, SFNC: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

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
    const profileStr = localStorage.getItem('profile');
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      setUserName(profile.name || '');
    }
  }, []);

  const handleGoMarket = () => {
    toast.success('Opening Market...');
    setTimeout(() => {
      router.push('/market'); // Replace with your actual Market URL
    }, 1000);
  };

  const handleTopUp = () => {
    toast.success('Opening Top Up...');
    setTimeout(() => {
      router.push('/wallet/topup'); // Replace with your actual Top Up page
    }, 1000);
  };

  const handleSendMoney = () => {
    toast.success('Opening Send Money...');
    setTimeout(() => {
      router.push('/wallet/send'); // Replace with your actual Send Money page
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md text-center">
          <h1 className="text-3xl font-bold">🎉 Welcome {userName || 'Swifin User'}!</h1>
          <p className="text-lg mt-2">Your Wallet is Active. Let's grow prosperity together 🌍✨</p>
        </div>

        {loading ? (
          <div className="text-center text-blue-700 font-semibold">Loading balances...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              <h2 className="text-xl font-semibold mb-2">SFNL Balance</h2>
              <p className="text-3xl">{balances.SFNL} SFNL</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              <h2 className="text-xl font-semibold mb-2">SFNC Balance</h2>
              <p className="text-3xl">{balances.SFNC} SFNC</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <button
            onClick={handleGoMarket}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition"
          >
            🛍️ Explore Market
          </button>
          <button
            onClick={handleTopUp}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-4 rounded-xl transition"
          >
            💳 Top Up Wallet
          </button>
          <button
            onClick={handleSendMoney}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl transition"
          >
            💸 Send Money
          </button>
        </div>
      </div>
    </div>
  );
}

