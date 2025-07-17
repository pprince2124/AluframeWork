import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.js';
import {
  createVendorQuote,
  submitFinalQuote,
  getUserQuotes,
  getAllQuotes,
  acceptQuote,
  rejectQuote
} from '../controllers/quote.controller.js';

const router = express.Router();

router.use(protect);

// Vendor routes
router.post('/vendor/:bookingId', restrictTo('vendor'), createVendorQuote);
router.post('/final/:bookingId', restrictTo('vendor'), submitFinalQuote);

// User routes
router.get('/user/:userId', restrictTo('user', 'admin'), getUserQuotes);
router.patch('/:quoteId/accept', restrictTo('user'), acceptQuote);
router.patch('/:quoteId/reject', restrictTo('user'), rejectQuote);

// Admin route
router.get('/all', restrictTo('admin'), getAllQuotes);

export default router;
