import { Router } from 'express'
import { requireAuth, AuthRequest } from '../../middleware/authMiddleware'

const router = Router()

router.get('/dashboard', requireAuth, (req: AuthRequest, res) => {
  // You can now access: req.user.email
  res.json({ message: `Welcome to the dashboard, ${req.user?.email}!` })
})

export default router
