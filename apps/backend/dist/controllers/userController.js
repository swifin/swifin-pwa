"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.activateWallet = exports.registerNewUser = exports.submitProfile = void 0;
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = require("../lib/prisma");
// ✅ 1. Submit or update user profile
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
// ✅ 2. Register new user (when Swifin ID is not provided)
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
// ✅ 3. Activate user wallet
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
// ✅ 4. Login user with Swifin ID + password
const loginUser = async (req, res) => {
    try {
        const { swifinId, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { swifin_id: swifinId },
            include: { wallet: true },
        });
        if (!user || !user.password_hash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValid = await (0, bcryptjs_1.compare)(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        return res.status(200).json({
            redirect: '/wallet/activate',
            profile: {
                name: user.name,
                email: user.email,
                swifinId: user.swifin_id,
                memberType: user.member_type,
                wallet: {
                    sfnc: user.wallet?.sfnc_balance.toNumber() || 0,
                    sfnl: user.wallet?.sfnl_balance.toNumber() || 0,
                },
            },
        });
    }
    catch (err) {
        console.error('Error in loginUser:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.loginUser = loginUser;
