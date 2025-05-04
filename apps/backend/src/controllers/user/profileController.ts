// ✅ src/controllers/user/profileController.ts
import { Request, Response } from 'express'
import { prisma } from '@/lib/prisma';


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { swifinId, name, email, phone, country, gender, birthday } = req.body

    const user = await prisma.user.update({
      where: { swifin_id: swifinId },
      data: { name, email, phone, country, gender, birthday },
    })

    res.status(200).json({ success: true, userId: user.id })
  } catch (err) {
    console.error('Error in updateProfile:', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
