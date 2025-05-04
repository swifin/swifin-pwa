"use strict";
//✅apps/backend/src/controllers/user/userController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const prisma_1 = require("@/lib/prisma");
const bcryptjs_1 = require("bcryptjs");
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
        const valid = await (0, bcryptjs_1.compare)(password, user.password_hash);
        if (!valid)
            return res.status(401).json({ error: 'Invalid credentials' });
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
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.loginUser = loginUser;
