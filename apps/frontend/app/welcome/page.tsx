// File: apps/frontend/app/welcome/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to Swifin</h1>
      <p className="text-lg mb-8">Start your journey toward global financial inclusion.</p>
      <div className="space-y-4">
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
