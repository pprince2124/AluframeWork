// src/routes/service.routes.js
import express from 'express';
import {
  createService,
  getServices,
  getService,
  updateService,
  deleteService
} from '../controllers/service.controller.js';

import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/roleGuard.js';

const router = express.Router();

/* ──────────────────────────────────────────────────────────
   /api/v1/services
─────────────────────────────────────────────────────────── */
router
  .route('/')
  // Public list & search
  .get(getServices)
  // Only vendors or admins can create services
  .post(protect, restrictTo('vendor', 'admin'), createService);

/* ──────────────────────────────────────────────────────────
   /api/v1/services/:id
─────────────────────────────────────────────────────────── */
router
  .route('/:id')
  // Public detail view
  .get(getService)
  // Vendor owner or admin can update
  .patch(protect, restrictTo('vendor', 'admin'), updateService)
  // Admin only can delete
  .delete(protect, restrictTo('admin'), deleteService);

export default router;
