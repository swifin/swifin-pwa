"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// These routes are hit by frontend API calls through lib/api.ts
router.post('/profile/submit', userController_1.submitProfile); // Matches POST /users/profile/submit
router.post('/register', userController_1.registerNewUser); // Matches POST /users/register
router.post('/wallet/activate', userController_1.activateWallet); // Matches POST /users/wallet/activate
exports.default = router;
