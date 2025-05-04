'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Wallet,
  ShoppingCart,
  LogOut,
  Menu as MenuIcon,
  X,
} from 'lucide-react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name?: string } | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.replace('/auth/email-entry')
    } else {
      const storedName = localStorage.getItem('user_name') || 'Swifin Member'
      setUser({ name: storedName })
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_name')
    router.push('/auth/email-entry')
  }

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-2" /> },
    { name: 'Wallet', href: '/wallet', icon: <Wallet className="w-5 h-5 mr-2" /> },
    { name: 'Orders', href: '/orders', icon: <ShoppingCart className="w-5 h-5 mr-2" /> },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar (desktop) */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-blue-600">Swifin Member</h2>
          <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
        </div>
        <nav className="mt-4 space-y-1 px-4 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'flex items-center px-4 py-2 rounded text-sm font-medium hover:bg-blue-50',
                pathname.startsWith(link.href) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              )}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center text-sm bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-blue-600 bg-white p-2 rounded-full shadow-md"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar drawer (mobile) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setMenuOpen(false)}>
          <aside
            className="fixed top-0 left-0 w-64 h-full bg-white p-4 z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h2 className="text-lg font-bold text-blue-600">Swifin Member</h2>
              <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
            </div>
            <nav className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'flex items-center px-3 py-2 rounded text-sm font-medium hover:bg-blue-50',
                    pathname.startsWith(link.href) ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => {
                setMenuOpen(false)
                handleLogout()
              }}
              className="mt-6 w-full flex items-center justify-center text-sm bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1">
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
        <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4">
          &copy; {new Date().getFullYear()} Swifin. All rights reserved.
        </footer>
      </div>
    </div>
  )
}

