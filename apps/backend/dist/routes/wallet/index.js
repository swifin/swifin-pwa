"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ src/routes/wallet/index.ts
const express_1 = require("express");
const walletController_1 = require("@/controllers/wallet/walletController");
const authMiddleware_1 = require("@/middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/overview', authMiddleware_1.requireAuth, walletController_1.getWalletOverview);
exports.default = router;
