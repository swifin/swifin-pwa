"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = void 0;
const prisma_1 = require("@/lib/prisma");
const updateProfile = async (req, res) => {
    try {
        const { swifinId, name, email, phone, country, gender, birthday } = req.body;
        const user = await prisma_1.prisma.user.update({
            where: { swifin_id: swifinId },
            data: { name, email, phone, country, gender, birthday },
        });
        res.status(200).json({ success: true, userId: user.id });
    }
    catch (err) {
        console.error('Error in updateProfile:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.updateProfile = updateProfile;
