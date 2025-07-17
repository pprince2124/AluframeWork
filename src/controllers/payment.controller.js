// controllers/payment.controller.js
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { Payment } from '../models/payment.model.js';
import  Booking  from '../models/booking.model.js';

export const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, amount, paymentMethod, note } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  const payment = await Payment.create({
    booking: bookingId,
    paidBy: req.user._id, // assuming `protect` middleware adds user
    amount,
    paymentMethod,
    note,
  });

  res.status(201).json(new ApiResponse(201, payment, 'Payment recorded'));
});

export const getPaymentsByUser = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ paidBy: req.user._id }).populate('booking');
  res.status(200).json(new ApiResponse(200, payments));
});

export const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate('booking paidBy');
  res.status(200).json(new ApiResponse(200, payments));
});
