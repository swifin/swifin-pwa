// ✅ 2. Swifin ID Check Screen
// Full Path: apps/frontend/app/(auth)/swifin-id-check/page.tsx

'use client'

import { useRouter } from 'next/navigation'

export default function SwifinIdCheckPage() {
  const router = useRouter()

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Do you already have a Swifin ID?</h2>
      <div className="space-y-4">
        <button
          onClick={() => router.push('/auth/has-swifin-id')}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          ✅ Yes, I have a Swifin ID
        </button>

        <button
          onClick={() => router.push('/auth/register-new')}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          ✨ No, I need to register
        </button>
      </div>
    </div>
  )
}

