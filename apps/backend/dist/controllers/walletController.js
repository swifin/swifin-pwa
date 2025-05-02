"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateWallet = void 0;
const prisma_1 = require("../lib/prisma");
const activateWallet = async (req, res) => {
    try {
        const { swifinId } = req.body;
        if (!swifinId) {
            return res.status(400).json({ error: 'Swifin ID is required' });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { swifin_id: swifinId },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!user.profile_confirmed) {
            return res.status(400).json({ error: 'Profile must be confirmed first' });
        }
        if (!user.wallet_activated) {
            await prisma_1.prisma.user.update({
                where: { swifin_id: swifinId },
                data: { wallet_activated: true },
            });
            await prisma_1.prisma.wallet.create({
                data: {
                    user_id: user.id,
                    polygon_wallet_address: '', // Placeholder until on-chain address is created
                },
            });
        }
        const wallet = await prisma_1.prisma.wallet.findUnique({
            where: { user_id: user.id },
        });
        // Transaction summary grouped by type
        const transactions = await prisma_1.prisma.transaction.groupBy({
            by: ['type'],
            where: { user_id: user.id },
            _sum: { amount_sfnc: true },
        });
        const transactionSummary = {
            deposit: 0,
            withdraw: 0,
            purchase: 0,
            reward: 0,
        };
        for (const tx of transactions) {
            transactionSummary[tx.type] = tx._sum.amount_sfnc?.toNumber() || 0;
        }
        return res.status(200).json({
            success: true,
            message: 'Wallet activated successfully',
            wallet,
            transactionSummary,
        });
    }
    catch (err) {
        console.error('[Wallet Activation Error]', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.activateWallet = activateWallet;
