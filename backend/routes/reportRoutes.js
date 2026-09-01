import express from 'express';
import { getReports, getReportById, generateReport, deleteReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getReports);

router.post('/generate', protect, generateReport);

router.route('/:id')
  .get(protect, getReportById)
  .delete(protect, deleteReport);

export default router;
