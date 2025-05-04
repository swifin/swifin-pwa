"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendOtp = void 0;
const prisma_1 = require("@/lib/prisma");
const sendEmail_1 = require("@/utils/sendEmail");
const otp_1 = require("@/utils/otp");
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const code = (0, otp_1.generateOtp)();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await prisma_1.prisma.otp.upsert({
            where: { email },
            update: { code, expiresAt },
            create: { email, code, expiresAt },
        });
        await (0, sendEmail_1.sendEmail)(email, 'Your OTP', `is: ${code}`);
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Error sending OTP:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res) => {
    try {
        const { email, code } = req.body;
        const record = await prisma_1.prisma.otp.findUnique({ where: { email } });
        if (!record || record.code !== code || new Date(record.expiresAt) < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Error verifying OTP:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.verifyOtp = verifyOtp;
