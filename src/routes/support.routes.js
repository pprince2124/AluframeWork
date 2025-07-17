// src/routes/support.routes.js
import express from 'express';
import {
  createSupportTicket,
  getAllSupportTickets,
  updateSupportStatus,
} from '../controllers/support.controller.js';
import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/roleGuard.js';

const router = express.Router();

router.post('/', createSupportTicket);

// Admin Routes
router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getAllSupportTickets);
router.patch('/:id/status', updateSupportStatus);

export default router;
