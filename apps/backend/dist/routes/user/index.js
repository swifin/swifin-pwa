"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ✅ src/routes/user/index.ts
const express_1 = require("express");
const activateController_1 = require("@/controllers/user/activateController");
const registerController_1 = require("@/controllers/user/registerController");
const profileController_1 = require("@/controllers/user/profileController");
const userController_1 = require("@/controllers/user/userController");
const router = (0, express_1.Router)();
router.post('/register', registerController_1.registerNewUser);
router.post('/profile', profileController_1.updateProfile);
router.post('/wallet/activate', activateController_1.activateWallet);
router.post('/login', userController_1.loginUser);
exports.default = router;
