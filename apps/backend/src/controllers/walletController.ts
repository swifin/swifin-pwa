// ✅ File: apps/backend/src/controllers/walletController.ts
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getWalletSummary = async (req: Request, res: Response) => {
  const { swifinId } = req.query;

  if (!swifinId || typeof swifinId !== 'string') {
    return res.status(400).json({ error: 'Swifin ID is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { swifin_id: swifinId },
      include: {
        wallet: true,
        transactions: true,
      },
    });

    if (!user || !user.wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const summary = {
      balances: {
        sfnc: user.wallet.sfnc_balance.toNumber(),
        sfnl: user.wallet.sfnl_balance.toNumber(),
      },
      transactionSummary: {
        deposit: 0,
        withdraw: 0,
        purchase: 0,
        reward: 0,
      },
    };

    const totals = await prisma.transaction.groupBy({
      by: ['type'],
      where: { user_id: user.id },
      _sum: { amount_sfnc: true },
    });

    for (const tx of totals) {
      summary.transactionSummary[tx.type] = tx._sum.amount_sfnc?.toNumber() || 0;
    }

    return res.status(200).json(summary);
  } catch (err) {
    console.error('[Wallet Summary Error]', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

