// ✅ src/routes/wallet/index.ts
import { Router } from 'express'
import { getWalletOverview } from '@/controllers/wallet/walletController'
import { requireAuth } from '@/middleware/authMiddleware'

const router = Router()

router.get('/overview', requireAuth, getWalletOverview)

export default router
