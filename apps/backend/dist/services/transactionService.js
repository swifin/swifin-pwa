"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionSummary = getTransactionSummary;
// apps/backend/src/services/transactionService.ts
const prisma_1 = require("../lib/prisma");
async function getTransactionSummary(userId) {
    const [summary, transactions] = await Promise.all([
        prisma_1.prisma.transaction.groupBy({
            by: ['type'],
            where: { user_id: userId },
            _sum: { amount_sfnc: true },
        }),
        prisma_1.prisma.transaction.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            take: 10,
        }),
    ]);
    const summaryMap = {
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
