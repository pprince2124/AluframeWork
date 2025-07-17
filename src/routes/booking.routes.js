// booking.routes.js
import express from 'express';
import bookingCtrl from '../controllers/booking.controller.js';
import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/roleGuard.js';
import {
  vendorQuoteValidator,
  finalQuoteValidator,
  shipMaterialValidator
} from '../middlewares/validators/bookingValidator.js';

const router = express.Router();

router.use(protect);

// Core routes
router
  .route('/')
  .post(restrictTo('user'), bookingCtrl.createBooking)
  .get(restrictTo('user', 'vendor', 'admin'), bookingCtrl.getBookings);

router
  .route('/:id')
  .get(restrictTo('user', 'vendor', 'admin'), bookingCtrl.getBooking)
  .patch(restrictTo('user', 'vendor', 'admin'), bookingCtrl.updateStatus);

// New flow-specific routes

router.post('/:id/delivered', restrictTo('admin'), bookingCtrl.markDelivered);
router.post('/:id/ack-delivery', restrictTo('vendor'), bookingCtrl.ackMaterialReceived);
router.post('/:id/install-done', restrictTo('vendor'), bookingCtrl.markInstallationComplete);
router.post('/:id/close', restrictTo('admin'), bookingCtrl.closeBooking);
router.post('/:id/vendor-quote', restrictTo('vendor'), vendorQuoteValidator, bookingCtrl.submitVendorQuote);
router.post('/:id/final-quote', restrictTo('admin'), finalQuoteValidator, bookingCtrl.submitFinalQuote);
router.post('/:id/ship', restrictTo('admin'), shipMaterialValidator, bookingCtrl.shipMaterial);


export default router;
