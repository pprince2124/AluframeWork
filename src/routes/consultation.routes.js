import express from 'express';
import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/roleGuard.js';
import {
  createConsultation,
  getAllConsultations,
  assignConsultation,
  updateStatus,
  deleteConsultation
} from '../controllers/consultation.controller.js';

const router = express.Router();

// 🔓 Public: Anyone can request a consultation
router.post('/', createConsultation);

// 🔒 Admin: View all consultations
router.get('/admin', protect, restrictTo('admin'), getAllConsultations);

// 🔒 Vendor: View only their assigned consultations
router.get('/vendor', protect, restrictTo('vendor'), getAllConsultations);

// 🔒 Admin: Assign to vendor
router.patch('/assign/:id', protect, restrictTo('admin'), assignConsultation);

// 🔒 Admin/Vendor: Update consultation status
router.patch('/status/:id', protect, restrictTo('admin', 'vendor'), updateStatus);

// 🔒 Admin: Delete consultation
router.delete('/:id', protect, restrictTo('admin'), deleteConsultation);

export default router;
