// apps/frontend/app/(public)/layout.tsx
import { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="bg-white border-b p-4 shadow-sm">
        <div className="max-w-5xl mx-auto text-blue-600 font-semibold text-xl">
          Swifin Public Portal
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4">{children}</main>

      <footer className="bg-gray-100 text-center py-4 mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Swifin. All rights reserved.
      </footer>
    </>
  )
}

