"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/dashboard', authMiddleware_1.requireAuth, (req, res) => {
    // You can now access: req.user.email
    res.json({ message: `Welcome to the dashboard, ${req.user?.email}!` });
});
exports.default = router;
