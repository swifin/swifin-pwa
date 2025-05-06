'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailEntryPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/auth/email-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const { walletActivated } = await res.json();
      if (!res.ok) throw new Error('Email check failed');

      if (walletActivated) {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        router.push(`/swifin-id-check?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-6 text-center">Welcome to Swifin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}
          <label className="block">
            <span className="text-gray-700">Email address</span>
            <input
              type="email"
              className="input mt-1"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-medium transition hover:opacity-90 bg-blue-600 text-white"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

