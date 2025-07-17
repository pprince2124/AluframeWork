// routes/payment.routes.js
import express from 'express';
import { createPayment, getPaymentsByUser, getAllPayments } from '../controllers/payment.controller.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createPayment); // for all logged-in users

router.get('/my', getPaymentsByUser); // user-specific payment history

router.get('/all', restrictTo('admin'), getAllPayments); // admin view

export default router;
