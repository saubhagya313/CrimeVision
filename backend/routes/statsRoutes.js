import express from 'express';
import { getDashboardStats, getNotifications } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/notifications', protect, getNotifications);

export default router;
