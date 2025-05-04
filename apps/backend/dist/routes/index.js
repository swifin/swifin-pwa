"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/index.ts
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const wallet_1 = __importDefault(require("./wallet"));
const admin_1 = __importDefault(require("./admin"));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/user', user_1.default);
router.use('/wallet', wallet_1.default);
router.use('/admin', admin_1.default);
exports.default = router;
