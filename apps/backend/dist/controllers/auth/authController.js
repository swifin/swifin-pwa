"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = require("../../lib/prisma");
const authenticateUser = async (req, res) => {
    try {
        const { swifinId, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { swifin_id: swifinId } });
        if (!user || !user.password_hash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValid = await (0, bcryptjs_1.compare)(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.status(200).json({ success: true, userId: user.id });
    }
    catch (err) {
        console.error('Error in authenticateUser:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.authenticateUser = authenticateUser;
