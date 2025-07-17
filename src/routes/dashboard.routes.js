import express from 'express';
import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/roleGuard.js';
import { getAdminDashboard } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/', protect, restrictTo('admin'), getAdminDashboard);

export default router;

