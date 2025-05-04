'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/email-entry')
      }
    }, [router])

    return <WrappedComponent {...props as P} />
  }
}

