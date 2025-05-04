"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/walletRoutes.ts
const express_1 = __importDefault(require("express"));
const walletController_1 = require("../controllers/walletController");
const walletController_2 = require("../controllers/walletController");
const router = express_1.default.Router();
router.post('/activate', walletController_2.activateWallet);
router.post('/summary', walletController_1.getWalletSummary);
exports.default = router;
