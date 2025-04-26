// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ swifinID: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/swifin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Login successful!');
        localStorage.setItem('swifinUser', JSON.stringify(data)); // Save session locally
        router.push('/dashboard');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">Sign In to Swifin Wallet</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="swifinID"
            value={credentials.swifinID}
            onChange={handleChange}
            placeholder="Swifin ID"
            className="input"
            required
          />
          <input
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            className="input"
            required
          />

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
