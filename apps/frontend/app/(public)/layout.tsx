// apps/frontend/app/(public)/layout.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/contact', label: 'Contact' },
]

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Swifin
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium hover:text-blue-600 transition-colors ${
                  pathname === link.href ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => router.push('/auth/email-entry')}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Drawer */}
        {open && (
          <div className="md:hidden bg-white border-t shadow px-4 pb-4 space-y-3">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium hover:text-blue-600 transition-colors ${
                  pathname === link.href ? 'text-blue-600' : 'text-gray-700'
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                router.push('/auth/email-entry')
                setOpen(false)
              }}
              className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-100 py-6 mt-12 border-t text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Swifin. All rights reserved.</p>
        <p className="mt-1">
          <Link href="/terms" className="hover:underline">Terms</Link> ·{' '}
          <Link href="/privacy" className="hover:underline">Privacy</Link>
        </p>
      </footer>
    </div>
  )
}

