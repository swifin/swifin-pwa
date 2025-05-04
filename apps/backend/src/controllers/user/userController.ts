import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';

import { compare } from 'bcryptjs';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { swifinId, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { swifin_id: swifinId },
      include: { wallet: true },
    });

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    return res.status(200).json({
      redirect: '/wallet/activate',
      profile: {
        name: user.name,
        email: user.email,
        swifinId: user.swifin_id,
        memberType: user.member_type,
        wallet: {
          sfnc: user.wallet?.sfnc_balance.toNumber() || 0,
          sfnl: user.wallet?.sfnl_balance.toNumber() || 0,
        },
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

