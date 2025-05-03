"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletSummary = void 0;
const transactionService_1 = require("../services/transactionService");
const prisma_1 = require("../lib/prisma");
const getWalletSummary = async (req, res) => {
    const { swifinId } = req.body;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { swifin_id: swifinId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const wallet = await prisma_1.prisma.wallet.findUnique({
            where: { user_id: user.id },
        });
        const transactions = await (0, transactionService_1.getTransactionSummary)(user.id);
        return res.json({
            balances: {
                sfnc: wallet?.sfnc_balance.toNumber() || 0,
                sfnl: wallet?.sfnl_balance.toNumber() || 0,
            },
            transactions,
        });
    }
    catch (err) {
        console.error('Wallet Summary Error:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
exports.getWalletSummary = getWalletSummary;
