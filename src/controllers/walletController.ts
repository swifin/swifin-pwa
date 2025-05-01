import { Request, Response } from 'express';

export const getWallet = async (req: Request, res: Response) => {
  const walletId = req.params.id;
  return res.json({
    walletId,
    balance: 1234.56,
    currency: 'SFNC',
    recentTransactions: [],
  });
};
