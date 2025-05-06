// apps/frontend/app/(protected)/layout.tsx
import { ReactNode } from 'react'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-blue-700 text-white p-4">
        <div className="max-w-5xl mx-auto text-lg font-bold">
          Swifin Member Area
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">{children}</main>

      <footer className="bg-gray-800 text-white text-center py-4 mt-10 text-sm">
        © {new Date().getFullYear()} Swifin. All rights reserved.
      </footer>
    </>
  )
}

