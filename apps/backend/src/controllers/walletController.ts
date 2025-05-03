// apps/backend/src/controllers/walletController.ts
import { Request, Response } from 'express'
import { getTransactionSummary } from '../services/transactionService'
import { prisma } from '../lib/prisma'

export const activateWallet = async (req: Request, res: Response) => {
  const { swifinId } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { swifin_id: swifinId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const existingWallet = await prisma.wallet.findUnique({
      where: { user_id: user.id },
    })

    if (!existingWallet) {
      await prisma.wallet.create({
        data: {
          user_id: user.id,
          sfnc_balance: 0,
          sfnl_balance: 0,
        },
      })
    }

    return res.json({ success: true })
  } catch (err) {
    console.error('Activate Wallet Error:', err)
    res.status(500).json({ error: 'Failed to activate wallet' })
  }
}

export const getWalletSummary = async (req: Request, res: Response) => {
  const { swifinId } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { swifin_id: swifinId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const wallet = await prisma.wallet.findUnique({
      where: { user_id: user.id },
    })

    const transactions = await getTransactionSummary(user.id)

    return res.json({
      balances: {
        sfnc: wallet?.sfnc_balance.toNumber() || 0,
        sfnl: wallet?.sfnl_balance.toNumber() || 0,
      },
      transactions,
    })
  } catch (err) {
    console.error('Wallet Summary Error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

