// apps/frontend/components/Navigation.tsx
'use client'
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="flex justify-between items-center p-6 border-b bg-white shadow-sm">
      <h1 className="text-2xl font-bold">🌍 Swifin</h1>
      <div className="space-x-6">
        <Link href="/about">About</Link>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/auth/email-entry" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Login</Link>
      </div>
    </nav>
  )
}
