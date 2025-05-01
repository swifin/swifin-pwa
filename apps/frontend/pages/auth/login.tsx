
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [swifinId, setSwifinId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 bg-gray-50 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <input type="text" placeholder="Swifin ID" className="w-full p-2 mb-4 border rounded"
          value={swifinId} onChange={(e) => setSwifinId(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
}
