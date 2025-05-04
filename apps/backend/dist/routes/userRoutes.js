"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/submit', userController_1.submitProfile);
router.post('/register', userController_1.registerNewUser);
router.post('/activate', userController_1.activateWallet);
router.post('/login', userController_1.loginUser);
exports.default = router;
