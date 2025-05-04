import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';
// import { registerMember } from '../../../services/swifinSoapService';

export const registerNewUser = async (req: Request, res: Response) => {
  try {
    const { swifinId, password, ...rest } = req.body;

    const user = await prisma.user.create({
      data: {
        swifin_id: swifinId,
        password_hash: password,
        profile_confirmed: true,
        ...rest,
      },
    });

    res.status(201).json({ success: true, userId: user.id });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

