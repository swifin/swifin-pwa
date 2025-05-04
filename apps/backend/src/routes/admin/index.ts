// apps/backend/src/routes/admin/index.ts
import { Router } from 'express'

const router = Router()



router.get('/dashboard', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Admin Dashboard!' });
});

// Add more routes directly here

export default router

