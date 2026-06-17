import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAnalytics,
} from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { mongoIdParamRules, validate } from '../middleware/validators';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', ...mongoIdParamRules('id'), validate, toggleUserStatus);
router.get('/analytics', getAnalytics);

export default router;
