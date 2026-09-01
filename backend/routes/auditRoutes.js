import express from 'express';
import { getAuditLogs } from '../controllers/auditController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('Admin', 'Forensic Lead', 'Senior Analyst', 'Investigator'), getAuditLogs);

export default router;
