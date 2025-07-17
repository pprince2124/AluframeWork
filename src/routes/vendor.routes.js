import express from 'express';
import {
  registerVendor,
  loginVendor,
  getVendorProfile,
  updateVendor,
  getVendorBookings,
} from '../controllers/vendor.controller.js';

import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/roleGuard.js';

const router = express.Router();

/* ---------- Public ---------- */
router.post('/register', registerVendor);
router.post('/login', loginVendor);

/* ---------- Vendor‑only ---------- */
router.use(protect, restrictTo('vendor', 'admin'));

router.get('/me', getVendorProfile);
router.patch('/me', updateVendor);
router.get('/me/bookings', getVendorBookings);

export default router;
