// apps/frontend/app/api/auth/email-check/route.ts

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // 1. Check if wallet is activated
    const user = await prisma.user.findUnique({
      where: { email },
      select: { wallet_activated: true },
    })
    const walletActivated = Boolean(user?.wallet_activated)

    // 2. If activated, generate & send OTP
    if (walletActivated) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      await prisma.otp.create({
        data: {
          email,
          code: otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      })
      await sendEmail({
        to: email,
        subject: 'Your Swifin OTP Code',
        text: `Your one-time login code is ${otp}`,
      })
    }

    return NextResponse.json({ walletActivated })
  } catch (err) {
    console.error('email-check error', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

