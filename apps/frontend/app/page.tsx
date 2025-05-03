// apps/frontend/app/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">🌍 Welcome to Swifin Wallet Portal</h1>
      <p className="text-center mb-10 max-w-xl text-lg">
        The unified digital system for global financial and economic inclusion.
      </p>
      <div className="flex gap-4">
        <Button className="w-64" onClick={() => router.push('/login')}>
          🔐 I already have a Swifin ID
        </Button>
        <Button className="w-64" variant="outline" onClick={() => router.push('/register')}>
          ✨ I’m new, register me
        </Button>
      </div>
    </div>
  )
}
