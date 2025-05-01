import express from 'express';
import { getWallet } from '../controllers/walletController';

const router = express.Router();
router.get('/:id', getWallet);
export default router;
