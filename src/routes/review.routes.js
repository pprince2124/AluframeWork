// src/routes/review.routes.js

import express from 'express';
import {
  createReview,
  getVendorReviews,
  deleteReview,
} from '../controllers/review.controller.js';

import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/roleGuard.js';

const router = express.Router();

router.use(protect);

// Customer - Submit Review
router.post('/', restrictTo('customer'), createReview);

// Public - View Reviews of Vendor
router.get('/vendor/:vendorId', getVendorReviews);

// Admin - Delete Review
router.delete('/:id', restrictTo('admin'), deleteReview);

export default router;
