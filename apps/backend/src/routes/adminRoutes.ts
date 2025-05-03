// ✅ 2. Relevant backend files for wallet summary & admin summary

// File: apps/backend/src/routes/adminRoutes.ts
import express from 'express'
import {
  getAdminSummary,
  getTopContributors,
  getActivityLogs,
  getVendors,
  toggleVendorStatus, // ✅ Add this
} from '../controllers/adminController'


const router = express.Router()

router.get('/summary', getAdminSummary)
router.get('/contributors', getTopContributors)
router.get('/logs', getActivityLogs)
router.get('/vendors', getVendors)
router.post('/vendors/toggle', toggleVendorStatus) // ✅ Add this


export default router


