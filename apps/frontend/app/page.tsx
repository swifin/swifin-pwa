// apps/frontend/app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold">🌍 Swifin</h1>
        <nav className="space-x-6">
          <Link href="/about">About</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/auth/email-entry" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-grow px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">Empowering Global Financial Inclusion</h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Swifin connects individuals, businesses, and governments to a unified digital platform for seamless value exchange and inclusive prosperity.
        </p>
        <div className="mt-10">
          <Link href="/marketplace">
            <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              🌐 Explore Marketplace
            </button>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-100 p-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Swifin Global. All rights reserved. | <Link href="/privacy">Privacy</Link> | <Link href="/terms">Terms</Link>
      </footer>
    </div>
  )
}

