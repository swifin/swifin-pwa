// apps/frontend/app/layout.tsx
import '../styles/globals.css'  // ✅ Explicit relative path

import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Swifin',
  description: 'Empowering Global Financial and Economic Inclusion',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white text-gray-800`}>
        {/* Place imported NavBar here */}
        <NavBar />
        {/* Place main content here */}
        <main className="max-w-3xl mx-auto p-6">{children}</main>
        {/* Place imported Footer here */}
        <Footer />
      </body>
    </html>
  )
}

