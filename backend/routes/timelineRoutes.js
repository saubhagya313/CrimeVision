import express from 'express';
import { getTimeline, addTimelineEvent, deleteTimelineEvent } from '../controllers/timelineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addTimelineEvent);

router.route('/:caseId?')
  .get(protect, getTimeline);

router.route('/:id')
  .delete(protect, deleteTimelineEvent);

export default router;
