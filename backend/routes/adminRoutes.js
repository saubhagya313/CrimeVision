import express from 'express';
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  updateUserRole,
  getAdminStats,
  getModelMetrics,
  getAdminAuditLogs,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require Admin role
router.use(protect);
router.use(authorize('Admin'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/status', toggleUserStatus);
router.put('/users/:id/role', updateUserRole);
router.get('/stats', getAdminStats);
router.get('/model-metrics', getModelMetrics);
router.get('/audit-logs', getAdminAuditLogs);

export default router;
