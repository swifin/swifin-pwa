// apps/frontend/components/Footer.tsx

'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-6 mt-10 text-sm text-gray-500">
      © {new Date().getFullYear()} Swifin. All rights reserved. |{' '}
      <Link href="/privacy" className="text-blue-600 hover:underline">Privacy</Link> |{' '}
      <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
    </footer>
  )
}
