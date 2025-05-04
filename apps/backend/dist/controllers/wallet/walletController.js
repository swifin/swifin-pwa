"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletOverview = void 0;
const prisma_1 = require("@/lib/prisma");
const getWalletOverview = async (req, res) => {
    try {
        const { swifinId } = req.params;
        const user = await prisma_1.prisma.user.findUnique({
            where: { swifin_id: swifinId },
            include: { transactions: true },
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const transactions = user.transactions.reduce((acc, tx) => {
            const type = tx.type;
            const amount = tx.amount_sfnc.toNumber();
            acc[type] = (acc[type] || 0) + amount;
            return acc;
        }, {});
        res.status(200).json({ wallet: transactions });
    }
    catch (err) {
        console.error('Wallet overview error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getWalletOverview = getWalletOverview;
