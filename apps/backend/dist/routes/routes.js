"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/routes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/submit', userController_1.submitProfile);
router.post('/register', userController_1.registerNewUser);
router.post('/wallet', userController_1.activateWallet); // 🆕 Added
exports.default = router;
