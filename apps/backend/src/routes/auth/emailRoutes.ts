// apps/backend/src/routes/auth/emailRoutes.ts
import express from 'express'
import { prisma } from '@/lib/prisma'
import { sendOtpToEmail } from '@/utils/sendEmail'
import { generateOtp } from '@/utils/otp'

const router = express.Router()

router.post('/email-check', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email is required' })

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (user?.wallet_activated) {
      // Generate and send OTP
      const code = generateOtp()
      await prisma.otp.create({
        data: {
          email,
          code,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
        },
      })
      await sendOtpToEmail(email, code)
      return res.json({ redirect: 'otp' })
    }

    return res.json({ redirect: 'swifin-id-check' })
  } catch (err) {
    console.error('email-check error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
