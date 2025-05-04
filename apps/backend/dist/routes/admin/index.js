"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// apps/backend/src/routes/admin/index.ts
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/dashboard', (req, res) => {
    res.status(200).json({ message: 'Welcome to the Admin Dashboard!' });
});
// Add more routes directly here
exports.default = router;
