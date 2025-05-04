'use client'

import {
  LogOut,
  LayoutDashboard,
  WalletCards,
  ShoppingCart,
  Menu,
  X,
  Settings,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/wallet', label: 'Wallet', icon: WalletCards },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
]

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    if (!storedToken) {
      router.push('/auth/email-entry')
    } else {
      setToken(storedToken)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/dashboard" className="text-lg font-semibold flex items-center space-x-2">
            <img src="/logo.svg" alt="Swifin Logo" className="h-6" />
            <span>Swifin Portal</span>
          </Link>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded"
          >
            <User className="h-4 w-4" />
            <span>My Account</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 shadow rounded z-50">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 relative">
        {/* Sidebar for Desktop */}
        <aside className="w-64 bg-gray-100 border-r hidden md:block">
          <nav className="p-4 space-y-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center p-2 rounded hover:bg-gray-200 ${
                  pathname === href ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden`}
        >
          <nav className="p-4 space-y-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center p-2 rounded hover:bg-gray-200 ${
                  pathname === href ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

