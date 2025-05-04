// apps/frontend/app/(public)/layout.tsx

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Contact', href: '/contact' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    setAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-xl font-bold text-blue-700">
            Swifin
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                className={`hover:text-blue-600 transition ${
                  pathname === href ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}
              >
                {name}
              </Link>
            ))}
            {authenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/email-entry"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Nav Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-md border-t">
            {navLinks.map(({ name, href }) => (
              <Link
                key={name}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block px-6 py-3 border-b ${
                  pathname === href ? 'text-blue-600 font-semibold' : 'text-gray-700'
                }`}
              >
                {name}
              </Link>
            ))}
            {authenticated ? (
              <button
                onClick={() => {
                  setMobileOpen(false)
                  handleLogout()
                }}
                className="block w-full text-left px-6 py-3 text-red-600 border-t"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/email-entry"
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-3 text-blue-600 border-t"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="pt-20 flex-grow bg-gray-50">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8 text-center text-sm text-gray-500">
        <div className="max-w-4xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Swifin. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/terms" className="mr-4 hover:underline">Terms of Service</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
