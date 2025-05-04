"use strict";
// apps/backend/src/controllers/auth/emailController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailCheck = void 0;
const prisma_1 = require("../../lib/prisma"); // ✅ adjust relative path
const emailCheck = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: 'Email is required' });
    try {
        const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existing && existing.wallet_activated) {
            return res.status(200).json({ status: 'activated' });
        }
        return res.status(200).json({ status: 'not_activated' });
    }
    catch (err) {
        console.error('[Email Check Error]', err);
        return res.status(500).json({ error: 'Server error checking email' });
    }
};
exports.emailCheck = emailCheck;
