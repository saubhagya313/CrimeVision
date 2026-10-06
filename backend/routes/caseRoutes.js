import express from 'express';
import {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  emailCaseResolutionPdf,
} from '../controllers/caseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCases)
  .post(protect, createCase);

router.post('/:id/send-resolution-email', protect, emailCaseResolutionPdf);

router.route('/:id')
  .get(protect, getCaseById)
  .put(protect, updateCase)
  .delete(protect, deleteCase);

export default router;
