"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/auth/loginRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controllers/user/userController");
const router = express_1.default.Router();
// ✔️ Login with Swifin ID and password
router.post('/login-swifin-id', userController_1.loginUser);
exports.default = router;
