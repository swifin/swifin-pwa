// apps/backend/src/controllers/auth/emailController.ts

import { Request, Response } from 'express'
import { prisma } from '../../lib/prisma' // ✅ adjust relative path


export const emailCheck = async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) return res.status(400).json({ error: 'Email is required' })

  try {
    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing && existing.wallet_activated) {
      return res.status(200).json({ status: 'activated' })
    }

    return res.status(200).json({ status: 'not_activated' })
  } catch (err) {
    console.error('[Email Check Error]', err)
    return res.status(500).json({ error: 'Server error checking email' })
  }
}
