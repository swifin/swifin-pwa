// apps/frontend/components/NavBar.tsx
'use client'

import Link from 'next/link'

export default function NavBar() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">🌍 Swifin</h1>
        <nav className="space-x-6 text-blue-600">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/marketplace" className="hover:underline">Marketplace</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link
            href="/auth/email-entry"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}

