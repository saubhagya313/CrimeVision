import express from 'express';
import { getEvidence, getEvidenceById, uploadEvidence, deleteEvidence } from '../controllers/evidenceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadEvidenceFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getEvidence);

router.post('/upload', protect, uploadEvidenceFile.single('file'), uploadEvidence);

router.route('/:id')
  .get(protect, getEvidenceById)
  .delete(protect, deleteEvidence);

export default router;
