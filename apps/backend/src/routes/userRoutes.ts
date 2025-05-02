// apps/backend/src/routes/userRoutes.ts
import express from 'express';
import {
  submitProfile,
  registerNewUser,
  activateWallet,
} from '../controllers/userController';

const router = express.Router();

// These routes are hit by frontend API calls through lib/api.ts
router.post('/profile/submit', submitProfile);         // Matches POST /users/profile/submit
router.post('/register', registerNewUser);             // Matches POST /users/register
router.post('/wallet/activate', activateWallet);       // Matches POST /users/wallet/activate

export default router;

