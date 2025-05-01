import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Swifin Global App</h1>
      <Link href="/login" className="text-blue-600">Login</Link>
    </main>
  );
}
