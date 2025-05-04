// ✅ 1. apps/backend/src/controllers/auth/authController.ts
import { Request, Response } from 'express'
import { compare } from 'bcryptjs'
import { prisma } from '../../lib/prisma'

export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { swifinId, password } = req.body

    const user = await prisma.user.findUnique({ where: { swifin_id: swifinId } })

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValid = await compare(password, user.password_hash)

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    res.status(200).json({ success: true, userId: user.id })
  } catch (err) {
    console.error('Error in authenticateUser:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
