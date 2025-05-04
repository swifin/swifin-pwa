"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletSummary = exports.activateWallet = void 0;
const prisma_1 = require("../lib/prisma");
const uuid_1 = require("uuid");
const activateWallet = async (req, res) => {
    try {
        const { swifinId } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { swifin_id: swifinId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!user.profile_confirmed) {
            return res.status(400).json({ error: 'Profile must be confirmed first' });
        }
        const existingWallet = await prisma_1.prisma.wallet.findUnique({
            where: { user_id: user.id },
        });
        if (existingWallet) {
            return res.status(400).json({ error: 'Wallet already activated' });
        }
        await prisma_1.prisma.wallet.create({
            data: {
                user_id: user.id,
                sfnc_balance: 0,
                sfnl_balance: 0,
                polygon_wallet_address: (0, uuid_1.v4)(),
            },
        });
        await prisma_1.prisma.user.update({
            where: { swifin_id: swifinId },
            data: { wallet_activated: true },
        });
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Activate Wallet Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.activateWallet = activateWallet;
const getWalletSummary = async (req, res) => {
    try {
        const { swifinId } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { swifin_id: swifinId },
            include: {
                wallet: true,
                transactions: true,
            },
        });
        if (!user || !user.wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }
        const balances = {
            sfnc: user.wallet.sfnc_balance.toNumber(),
            sfnl: user.wallet.sfnl_balance.toNumber(),
        };
        const transactions = user.transactions.reduce((acc, tx) => {
            acc[tx.type] = (acc[tx.type] || 0) + tx.amount_sfnc.toNumber();
            return acc;
        }, {});
        return res.json({ balances, transactions });
    }
    catch (err) {
        console.error('Get Wallet Summary Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getWalletSummary = getWalletSummary;
