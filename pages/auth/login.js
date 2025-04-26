import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e) => {
    e.preventDefault(); // 👈 prevent form reload!
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ swifinId, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        // Redirect to wallet activation page or dashboard
        router.push('/wallet/activate');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('Unexpected error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Login to Swifin</h1>

        <form onSubmit={login} className="space-y-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Swifin ID"
              value={swifinId}
              onChange={(e) => setSwifinId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}

          <button
            type="submit" // 👈 important!
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          New to Swifin?{' '}
          <a href="/auth/register" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}

