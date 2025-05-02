'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { post } from '@/lib/api';

export default function LoginPage() {
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await post('/api/auth/login', { swifinId, password });

    if (error) {
      setError(error);
    } else if (data?.redirect) {
      localStorage.setItem('userProfile', JSON.stringify(data.profile));
      router.push(data.redirect);
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-semibold mb-4">Login to Swifin Wallet</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Swifin ID</label>
        <input className="input" value={swifinId} onChange={(e) => setSwifinId(e.target.value)} required />

        <label className="block mt-4 mb-2">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="text-red-600 mt-4">{error}</p>}
        <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
}

