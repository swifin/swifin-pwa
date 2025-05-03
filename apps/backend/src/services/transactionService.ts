// apps/backend/src/services/transactionService.ts
import { prisma } from '../lib/prisma';

export async function getTransactionSummary(userId: string) {
  const [summary, transactions] = await Promise.all([
    prisma.transaction.groupBy({
      by: ['type'],
      where: { user_id: userId },
      _sum: { amount_sfnc: true },
    }),
    prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: 10,
    }),
  ]);

  const summaryMap: Record<string, number> = {
    deposit: 0,
    withdraw: 0,
    purchase: 0,
    reward: 0,
  };

  for (const tx of summary) {
    summaryMap[tx.type] = tx._sum.amount_sfnc?.toNumber() || 0;
  }

  return {
    summary: summaryMap,
    recent: transactions.map((tx) => ({
      id: tx.id,
      type: tx.type,
      amount: tx.amount_sfnc.toNumber(),
      status: tx.status,
      created_at: tx.created_at,
    })),
  };
}

