"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateWallet = exports.registerNewUser = exports.submitProfile = void 0;
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = require("../lib/prisma");
const submitProfile = async (req, res) => {
    try {
        const { swifinId, password, name, email, phone, country, gender, birthday } = req.body;
        const passwordHash = await (0, bcryptjs_1.hash)(password, 10);
        const user = await prisma_1.prisma.user.upsert({
            where: { swifin_id: swifinId },
            update: {
                name,
                email,
                phone,
                country,
                gender,
                birthday,
                password_hash: passwordHash,
                profile_confirmed: true,
            },
            create: {
                swifin_id: swifinId,
                name,
                email,
                phone,
                country,
                gender,
                birthday,
                password_hash: passwordHash,
                profile_confirmed: true,
            },
        });
        res.status(200).json({ success: true, userId: user.id });
    }
    catch (err) {
        console.error('Error in submitProfile:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.submitProfile = submitProfile;
const registerNewUser = async (req, res) => {
    try {
        const { swifinId, password, name, email, phone, country, gender, birthday } = req.body;
        const passwordHash = await (0, bcryptjs_1.hash)(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                swifin_id: swifinId,
                name,
                email,
                phone,
                country,
                gender,
                birthday,
                password_hash: passwordHash,
                profile_confirmed: true,
            },
        });
        res.status(201).json({ success: true, userId: user.id });
    }
    catch (err) {
        console.error('Error in registerNewUser:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.registerNewUser = registerNewUser;
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
        if (user.wallet_activated) {
            return res.status(400).json({ error: 'Wallet already activated' });
        }
        await prisma_1.prisma.user.update({
            where: { swifin_id: swifinId },
            data: { wallet_activated: true },
        });
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Error in activateWallet:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.activateWallet = activateWallet;
