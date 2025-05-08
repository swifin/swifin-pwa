// apps/frontend/components/Footer.tsx
"use client"

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <span>© 2025 Swifin. All rights reserved.</span>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}

