// ✅ apps/backend/src/routes/auth/otpRoutes.ts
import express from 'express'
import { prisma } from '@/lib/prisma'

const router = express.Router()

router.post('/verify-otp', async (req, res) => {
  const { email, code } = req.body

  if (!email || !code) {
    return res.status(400).json({ error: 'Email and OTP code are required' })
  }

  try {
    const record = await prisma.otp.findFirst({
      where: {
        email,
        code,
        expiresAt: { gte: new Date() },
      },
    })

    if (!record) {
      return res.status(401).json({ error: 'Invalid or expired OTP' })
    }

    // Optional: delete OTP after use
    await prisma.otp.deleteMany({ where: { email } })

    // Optional: return basic user profile
    const user = await prisma.user.findUnique({ where: { email } })

    return res.json({
      success: true,
      user: user
        ? {
            id: user.id,
            swifinId: user.swifin_id,
            name: user.name,
            email: user.email,
            walletActivated: user.wallet_activated,
          }
        : null,
    })
  } catch (err) {
    console.error('OTP verification error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

