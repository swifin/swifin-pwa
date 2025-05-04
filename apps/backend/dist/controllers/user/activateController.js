"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateWallet = void 0;
const prisma_1 = require("@/lib/prisma");
const activateWallet = async (req, res) => {
    try {
        const { swifinId } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { swifin_id: swifinId } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        if (!user.profile_confirmed)
            return res.status(400).json({ error: 'Profile must be confirmed first' });
        if (user.wallet_activated)
            return res.status(400).json({ error: 'Wallet already activated' });
        await prisma_1.prisma.user.update({ where: { swifin_id: swifinId }, data: { wallet_activated: true } });
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Error in activateWallet:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.activateWallet = activateWallet;
