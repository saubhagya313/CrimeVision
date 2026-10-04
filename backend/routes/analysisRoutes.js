import express from 'express';
import {
  runTextAnalysis,
  submitAnalysisFeedback,
  getMyAnalyses,
  getAnalysisById,
  deleteAnalysis,
  getAdminAnalyses,
} from '../controllers/analysisController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/scan', protect, runTextAnalysis);
router.post('/:id/feedback', protect, submitAnalysisFeedback);
router.get('/my-analyses', protect, getMyAnalyses);
router.get('/admin/all', protect, authorize('Admin'), getAdminAnalyses);
router.get('/:id', protect, getAnalysisById);
router.delete('/:id', protect, deleteAnalysis);

export default router;
