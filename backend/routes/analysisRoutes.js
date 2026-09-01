import express from 'express';
import { runTextAnalysis } from '../controllers/analysisController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scan', protect, runTextAnalysis);

export default router;
