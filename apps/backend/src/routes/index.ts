// apps/backend/src/routes/index.ts
import express from 'express'

import authRoutes from './auth'
import userRoutes from './user'
import walletRoutes from './wallet'
import adminRoutes from './admin'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/wallet', walletRoutes)
router.use('/admin', adminRoutes)

export default router

