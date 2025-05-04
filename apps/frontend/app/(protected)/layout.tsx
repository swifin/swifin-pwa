// ✅ apps/frontend/app/(protected)/layout.tsx

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/auth/email-entry')
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Wallet', path: '/wallet' },
    { name: 'Orders', path: '/orders' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="text-lg font-bold">Swifin</div>
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`hover:underline ${pathname === item.path ? 'font-bold underline' : ''}`}
            >
              {item.name}
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={handleLogout} className="hover:underline text-sm">
              Logout
            </button>
          )}
        </nav>
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700 text-white p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`block ${pathname === item.path ? 'font-bold underline' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={handleLogout} className="block text-left w-full">
              Logout
            </button>
          )}
        </div>
      )}

      <main className="flex-1 p-4 bg-gray-50">{children}</main>

      <footer className="bg-blue-600 text-white p-4 text-center text-sm">
        © {new Date().getFullYear()} Swifin. All rights reserved.
      </footer>
    </div>
  )
}

