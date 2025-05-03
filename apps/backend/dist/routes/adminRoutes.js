"use strict";
// ✅ 2. Relevant backend files for wallet summary & admin summary
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSummary = void 0;
// File: apps/backend/src/routes/adminRoutes.ts
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.get('/summary', exports.getAdminSummary);
exports.default = router;
const prisma_1 = require("../lib/prisma");
const getAdminSummary = async (_req, res) => {
    try {
        const userCount = await prisma_1.prisma.user.count();
        const walletCount = await prisma_1.prisma.wallet.count();
        const transactionCount = await prisma_1.prisma.transaction.count();
        const totalSFNC = await prisma_1.prisma.wallet.aggregate({
            _sum: { sfnc_balance: true },
        });
        const totalSFNL = await prisma_1.prisma.wallet.aggregate({
            _sum: { sfnl_balance: true },
        });
        return res.json({
            stats: {
                users: userCount,
                wallets: walletCount,
                transactions: transactionCount,
                total_sfnc: totalSFNC._sum.sfnc_balance?.toNumber() || 0,
                total_sfnl: totalSFNL._sum.sfnl_balance?.toNumber() || 0,
            },
        });
    }
    catch (error) {
        console.error('Admin Summary Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
exports.getAdminSummary = getAdminSummary;
