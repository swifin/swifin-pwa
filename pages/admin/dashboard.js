// pages/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/swifin/load-profile');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

      {/* Check KYC Status */}
      {user.kycStatus === 'pending' && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-6">
          🚧 Your KYC is pending approval. You will be notified once approved.
        </div>
      )}
      {user.kycStatus === 'rejected' && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
          ❌ Your KYC submission was rejected. Please resubmit your documents.
          <button 
            onClick={() => router.push('/kyc-upload')}
            className="btn mt-4"
          >
            Resubmit KYC
          </button>
        </div>
      )}
      {user.kycStatus === 'approved' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-2">Buy SFNC</h2>
              <button onClick={() => router.push('/buy-sfnc')} className="btn">Buy Now</button>
            </div>
            <div className="card">
              <h2 className="text-xl font-bold mb-2">Swap Tokens</h2>
              <button onClick={() => router.push('/swap')} className="btn">Swap</button>
            </div>
            <div className="card">
              <h2 className="text-xl font-bold mb-2">Update Profile</h2>
              <button onClick={() => router.push('/update-profile')} className="btn">Edit Profile</button>
            </div>
            <div className="card">
              <h2 className="text-xl font-bold mb-2">Transaction History</h2>
              <button onClick={() => router.push('/transactions')} className="btn">View Transactions</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

