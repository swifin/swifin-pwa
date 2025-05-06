// apps/frontend/app/api/auth/swifin-id-login/route.ts

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    // 1. Parse + validate
    const body = (await req.json()) as {
      email?: string
      swifinId?: string
      password?: string
    } | null
    const email = body?.email
    const swifinId = body?.swifinId
    const password = body?.password

    if (!email || !swifinId || !password) {
      return NextResponse.json(
        { message: 'Missing credentials' },
        { status: 400 }
      )
    }

    // 2. Dynamically import buffer + build Basic auth header
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

    // 3. Verify with Swifin REST
    const resp = await fetch('https://api.swifin.com/rest/members/me', {
      method: 'GET',
      headers: { Authorization: authHeader },
    })
    if (!resp.ok) {
      return NextResponse.json(
        { message: 'Invalid Swifin ID or password' },
        { status: 401 }
      )
    }
    const profile = await resp.json()

    // 4. Dynamically import encryption helper and upsert user
    const { encryptPassword } = await import('@/lib/crypto')
    const encryptedHash = encryptPassword(password)

    await prisma.user.upsert({
      where: { swifin_id: swifinId },
      update: {
        email,
        password_hash: encryptedHash,
        profile_confirmed: false,
        wallet_activated: false,
      },
      create: {
        swifin_id: swifinId,
        email,
        password_hash: encryptedHash,
        profile_confirmed: false,
        wallet_activated: false,
        country: '', // filled later in confirm-profile
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (err) {
    console.error('swifin-id-login error', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

