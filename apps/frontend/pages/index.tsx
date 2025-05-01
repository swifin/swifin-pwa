
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Swifin</h1>
        <Link href="/auth/login" className="text-blue-500 underline">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
