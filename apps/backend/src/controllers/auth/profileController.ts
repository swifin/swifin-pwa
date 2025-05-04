// ✅ src/controllers/auth/profileController.ts
import { Request, Response } from 'express'
import { prisma } from '@/lib/prisma';

export const submitProfile = async (req: Request, res: Response) => {
  try {
    const { swifinId, name, email, phone, country, gender, birthday } = req.body

    const user = await prisma.user.update({
      where: { swifin_id: swifinId },
      data: {
        name,
        email,
        phone,
        country,
        gender,
        birthday,
        profile_confirmed: true,
      },
    })

    res.status(200).json({ success: true, userId: user.id })
  } catch (err) {
    console.error('Error in submitProfile (auth):', err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
