"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/auth/emailRoutes.ts
const express_1 = __importDefault(require("express"));
const prisma_1 = require("@/lib/prisma");
const sendEmail_1 = require("@/utils/sendEmail");
const otp_1 = require("@/utils/otp");
const router = express_1.default.Router();
router.post('/email-check', async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: 'Email is required' });
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (user?.wallet_activated) {
            // Generate and send OTP
            const code = (0, otp_1.generateOtp)();
            await prisma_1.prisma.otp.create({
                data: {
                    email,
                    code,
                    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 min
                },
            });
            await (0, sendEmail_1.sendOtpToEmail)(email, code);
            return res.json({ redirect: 'otp' });
        }
        return res.json({ redirect: 'swifin-id-check' });
    }
    catch (err) {
        console.error('email-check error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
