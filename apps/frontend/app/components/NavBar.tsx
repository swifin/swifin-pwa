'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const MENU = [
  { href: '/about',       label: 'About'       },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/contact',     label: 'Contact'     },
]

export default function NavBar() {
  const path = usePathname() || '/'

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      {/* Logo / Home */}
      <Link href="/" className="flex items-center gap-2 text-xl font-bold">
        <span role="img" aria-label="globe">🌍</span>
        <span>Swifin</span>
      </Link>

      {/* Center menu */}
      <ul className="flex list-none gap-8 m-0 p-0">
        {MENU.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                'hover:underline',
                path === href && 'font-semibold underline'
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Login button */}
      <Link
        href="/login"
        className="rounded border px-4 py-2 hover:bg-gray-100 transition"
      >
        Login
      </Link>
    </nav>
  )
}

