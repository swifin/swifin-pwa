import { Request, Response } from 'express';
import { prisma } from '@/lib/prisma';

export const getWalletOverview = async (req: Request, res: Response) => {
  try {
    const { swifinId } = req.params;

    const user = await prisma.user.findUnique({
      where: { swifin_id: swifinId },
      include: { transactions: true },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const transactions = user.transactions.reduce<Record<string, number>>((acc, tx) => {
      const type = tx.type;
      const amount = tx.amount_sfnc.toNumber();
      acc[type] = (acc[type] || 0) + amount;
      return acc;
    }, {});

    res.status(200).json({ wallet: transactions });
  } catch (err) {
    console.error('Wallet overview error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

