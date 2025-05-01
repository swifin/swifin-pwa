// apps/frontend/components/Login.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://75.119.136.87:3001/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swifinId, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Login failed.');
        return;
      }

      // Redirect logic
      if (result.profileComplete) {
        router.push('/dashboard');
      } else {
        router.push(`/register?swifinId=${result.swifinId}`);
      }
    } catch (err) {
      console.error('Login request error:', err);
      setError('Unable to connect to server.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto mt-12 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Swifin ID"
        value={swifinId}
        onChange={(e) => setSwifinId(e.target.value)}
        className="w-full mb-4 p-2 border"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-4 p-2 border"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2">
        Login
      </button>
    </form>
  );
}

