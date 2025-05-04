"use strict";
// src/controllers/otpController.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendOtp = void 0;
const prisma_1 = require("../lib/prisma");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../utils/sendEmail");
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const hash = (val) => crypto_1.default.createHash('sha256').update(val).digest('hex');
const sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: 'Email is required' });
    const otp = generateOtp();
    const hashedOtp = hash(otp);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 mins
    try {
        await prisma_1.prisma.otp.upsert({
            where: { email },
            update: { code: hashedOtp, expiresAt, verified: false },
            create: { email, code: hashedOtp, expiresAt },
        });
        await (0, sendEmail_1.sendEmail)(email, 'Your Swifin OTP Code', `
      <p>Hello,</p>
      <p>Your Swifin login code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
    `);
        console.log(`📧 OTP sent to ${email}: ${otp}`);
        return res.json({ success: true, message: 'OTP sent to email' });
    }
    catch (err) {
        console.error('OTP Send Error:', err);
        return res.status(500).json({ error: 'Failed to send OTP' });
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        return res.status(400).json({ error: 'Email and OTP are required' });
    try {
        const record = await prisma_1.prisma.otp.findUnique({ where: { email } });
        if (!record || record.verified)
            return res.status(400).json({ error: 'OTP not found or already used' });
        if (record.expiresAt < new Date())
            return res.status(400).json({ error: 'OTP expired' });
        if (record.code !== hash(otp))
            return res.status(400).json({ error: 'Invalid OTP' });
        await prisma_1.prisma.otp.update({ where: { email }, data: { verified: true } });
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });
        return res.json({ success: true, token });
    }
    catch (err) {
        console.error('OTP Verify Error:', err);
        return res.status(500).json({ error: 'Failed to verify OTP' });
    }
};
exports.verifyOtp = verifyOtp;
