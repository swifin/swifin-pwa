"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/auth/flowRoutes.ts
const express_1 = __importDefault(require("express"));
const emailController_1 = require("@/controllers/auth/emailController");
const profileController_1 = require("@/controllers/user/profileController");
const registerController_1 = require("@/controllers/user/registerController");
const router = express_1.default.Router();
// ✔️ Check if email is already in use
router.post('/email-check', emailController_1.emailCheck);
// ✔️ Register a new user (no Swifin ID)
router.post('/register-new', registerController_1.registerNewUser);
// ✔️ Submit or update Swifin user profile
router.post('/submit-profile', profileController_1.updateProfile);
exports.default = router;
