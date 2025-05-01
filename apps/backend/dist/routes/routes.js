"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// User Routes
router.post('/login', userController_1.loginUser); // POST /auth/login
router.post('/register', userController_1.registerProfile); // POST /auth/register
router.put('/update', userController_1.updateProfile); // PUT /auth/update
router.get('/user/:swifinId', userController_1.getUser); // GET /auth/user/:swifinId
// Auth Route
router.post('/auth', authController_1.authenticateUser); // POST /auth (SOAP-based login)
exports.default = router;
