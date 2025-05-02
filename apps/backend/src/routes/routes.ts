// apps/backend/src/routes/routes.ts
import express from 'express';
import {
  submitProfile,
  registerNewUser,
  activateWallet,
} from '../controllers/userController';

const router = express.Router();

router.post('/submit', submitProfile);
router.post('/register', registerNewUser);
router.post('/wallet', activateWallet); // 🆕 Added

export default router;

