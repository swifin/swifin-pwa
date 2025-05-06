// apps/frontend/app/api/auth/profile/route.ts

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // 1. Parse + validate
    const body = (await req.json()) as { swifinId?: string } | null
    const swifinId = body?.swifinId

    if (!swifinId) {
      return NextResponse.json(
        { message: 'Missing Swifin ID' },
        { status: 400 }
      )
    }

    // 2. Fetch stored password hash
    const user = await prisma.user.findUnique({
      where: { swifin_id: swifinId },
      select: { password_hash: true },
    })
    if (!user?.password_hash) {
      return NextResponse.json(
        { message: 'No stored credentials' },
        { status: 404 }
      )
    }

    // 3. Dynamically import decryption helper
    const { decryptPassword } = await import('@/lib/crypto')
    const password = decryptPassword(user.password_hash)

    // 4. Dynamically import buffer + build Basic auth header
    let authHeader: string
    try {
      const { Buffer } = await import('buffer')
      authHeader =
        'Basic ' +
        Buffer.from(`${swifinId}:${password}`, 'utf8').toString('base64')
    } catch (bufErr) {
      console.error('Buffer import/encode error', bufErr)
      authHeader = ''
    }

    // 5. Fetch profile from Swifin REST
    const resp = await fetch('https://api.swifin.com/rest/members/me', {
      method: 'GET',
      headers: { Authorization: authHeader },
    })
    if (!resp.ok) {
      console.error('Swifin REST error:', await resp.text())
      return NextResponse.json(
        { message: 'Failed to fetch profile' },
        { status: resp.status }
      )
    }

    const data = await resp.json()
    return NextResponse.json(data)
  } catch (err) {
    console.error('profile error', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

