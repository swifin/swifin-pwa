"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/auth/otpRoutes.ts
const express_1 = __importDefault(require("express"));
const otpController_1 = require("../../controllers/auth/otpController");
const router = express_1.default.Router();
// ✔️ Send OTP to email
router.post('/send-otp', otpController_1.sendOtp);
// ✔️ Verify submitted OTP
router.post('/verify-otp', otpController_1.verifyOtp);
exports.default = router;
