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
router.post('/login', authController_1.authenticateUser); // ✅ /auth/login
router.post('/submit-profile', userController_1.submitProfile); // ✅ /auth/submit-profile
router.post('/register', userController_1.registerNewUser); // ✅ /auth/register
exports.default = router;
