import '../styles/globals.css'
import { ReactNode } from 'react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from './components/NavBar'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Swifin',
  description: 'Empowering Global Financial and Economic Inclusion',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-white text-gray-800`}
      >
        <NavBar />

        <main className="flex-grow max-w-3xl mx-auto p-6">{children}</main>

        <footer className="border-t py-4 text-center text-sm text-gray-600">
          © 2025 Swifin. All rights reserved.{' '}
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>{' '}
          |{' '}
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </footer>
      </body>
    </html>
  )
}

