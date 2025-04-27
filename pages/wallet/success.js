import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ActivationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const swifinId = localStorage.getItem('swifinId');
    if (!swifinId) {
      router.push('/auth/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-8">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Activation Successful!</h1>
        <p className="text-gray-700 mb-6 text-lg">
          Your Swifin Wallet is now fully active and ready to use.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
          >
            🚀 Go to Dashboard
          </button>

          <button
            onClick={() => router.push('/market')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
          >
            🛍️ Explore Market
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          Thank you for joining Swifin. Let's grow together. 🌍✨
        </p>
      </div>
    </div>
  );
}
