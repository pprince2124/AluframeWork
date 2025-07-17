// src/routes/shipMaterial.routes.js

import express from 'express';
import {
  createShipping,
  markAsDelivered,
  vendorInstallations
} from '../controllers/shipMaterial.controller.js';

import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/roleGuard.js';

const router = express.Router();

router.use(protect);

// Admin ships material
router.post('/', restrictTo('admin'), createShipping);

// Admin marks delivery complete
router.patch('/:id/delivered', restrictTo('admin'), markAsDelivered);

// Vendor views assigned installations
router.get('/installations', restrictTo('vendor'), vendorInstallations);

export default router;
