// apps/backend/src/routes/walletRoutes.ts
import express from 'express'
import {
  activateWallet,
  getWalletSummary,
} from '../controllers/walletController'

const router = express.Router()

router.post('/activate', activateWallet)
router.post('/summary', getWalletSummary)

export default router

