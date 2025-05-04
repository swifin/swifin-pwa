"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitProfile = void 0;
const prisma_1 = require("@/lib/prisma");
const submitProfile = async (req, res) => {
    try {
        const { swifinId, name, email, phone, country, gender, birthday } = req.body;
        const user = await prisma_1.prisma.user.update({
            where: { swifin_id: swifinId },
            data: {
                name,
                email,
                phone,
                country,
                gender,
                birthday,
                profile_confirmed: true,
            },
        });
        res.status(200).json({ success: true, userId: user.id });
    }
    catch (err) {
        console.error('Error in submitProfile (auth):', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.submitProfile = submitProfile;
