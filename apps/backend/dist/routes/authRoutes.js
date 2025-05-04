"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/authRoutes.ts
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// 🔐 Swifin ID + Password login via REST API
router.post('/login-swifin-id', authController_1.authenticateUser);
// 📧 Email check + OTP flow
router.post('/email-check', authController_1.emailCheck);
// 📝 Submit user profile (for existing or new users)
router.post('/submit-profile', userController_1.submitProfile);
// 🆕 Register new user (generates Swifin ID via SOAP)
router.post('/register', userController_1.registerNewUser);
exports.default = router;
