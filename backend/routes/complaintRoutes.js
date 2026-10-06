import express from 'express';
import {
  createComplaintDraft,
  getMyComplaintDrafts,
  getComplaintDraftById,
  updateComplaintDraft,
  deleteComplaintDraft,
  getAdminComplaints,
  emailComplaintDraft,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/draft', protect, createComplaintDraft);
router.get('/my-drafts', protect, getMyComplaintDrafts);
router.get('/admin/all', protect, authorize('Admin'), getAdminComplaints);
router.post('/:id/send-email', protect, emailComplaintDraft);
router.get('/:id', protect, getComplaintDraftById);
router.put('/:id', protect, updateComplaintDraft);
router.delete('/:id', protect, deleteComplaintDraft);

export default router;
