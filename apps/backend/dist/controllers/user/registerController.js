"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNewUser = void 0;
const prisma_1 = require("@/lib/prisma");
// import { registerMember } from '../../../services/swifinSoapService';
const registerNewUser = async (req, res) => {
    try {
        const { swifinId, password, ...rest } = req.body;
        const user = await prisma_1.prisma.user.create({
            data: {
                swifin_id: swifinId,
                password_hash: password,
                profile_confirmed: true,
                ...rest,
            },
        });
        res.status(201).json({ success: true, userId: user.id });
    }
    catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.registerNewUser = registerNewUser;
