"use strict";
// ✅ 2. Relevant backend files for wallet summary & admin summary
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// File: apps/backend/src/routes/adminRoutes.ts
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.get('/summary', adminController_1.getAdminSummary);
router.get('/contributors', adminController_1.getTopContributors);
router.get('/logs', adminController_1.getActivityLogs);
router.get('/vendors', adminController_1.getVendors);
router.post('/vendors/toggle', adminController_1.toggleVendorStatus); // ✅ Add this
exports.default = router;
