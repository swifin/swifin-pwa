'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swifinId, password }),
      });

      if (res.status === 200) {
        const { redirect, profile } = await res.json();
        localStorage.setItem('userProfile', JSON.stringify(profile));
        router.push(redirect);
      } else if (res.status === 401) {
        setError('Invalid credentials. Please check your Swifin ID and password.');
      } else {
        const body = await res.json();
        setError(body.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 shadow-md bg-white rounded-md">
      <h1 className="text-xl font-semibold mb-4">Login to Swifin</h1>
      <form onSubmit={handleLogin}>
        <label className="block mb-2">Swifin ID</label>
        <input
          type="text"
          value={swifinId}
          onChange={(e) => setSwifinId(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-4 rounded"
          required
        />
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

