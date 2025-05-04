"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ apps/backend/src/routes/auth/index.ts
const express_1 = require("express");
const loginRoutes_1 = __importDefault(require("./loginRoutes"));
const otpRoutes_1 = __importDefault(require("./otpRoutes"));
const flowRoutes_1 = __importDefault(require("./flowRoutes"));
const emailRoutes_1 = __importDefault(require("./emailRoutes"));
const router = (0, express_1.Router)();
router.use('/login', loginRoutes_1.default); // POST /auth/login/...
router.use('/otp', otpRoutes_1.default); // POST /auth/otp/verify-otp
router.use('/flow', flowRoutes_1.default); // POST /auth/flow/...
router.use('/email', emailRoutes_1.default); // POST /auth/email/...
exports.default = router;
