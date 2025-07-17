// src/controllers/review.controller.js

import Review from '../models/review.model.js';
import Booking from '../models/booking.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/* ---------- Create Review ---------- */
export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (booking.customerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You can only review your own bookings');
  }

  const existing = await Review.findOne({ bookingId });
  if (existing) throw new ApiError(400, 'Review already submitted for this booking');

  const review = await Review.create({
    bookingId,
    rating,
    comment,
    vendorId: booking.vendorId,
    customerId: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, review, 'Review submitted'));
});

/* ---------- Get All Reviews for Vendor ---------- */
export const getVendorReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ vendorId: req.params.vendorId })
    .populate('customerId', 'name')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, reviews));
});

/* ---------- Admin Delete Review ---------- */
export const deleteReview = asyncHandler(async (req, res) => {
  const deleted = await Review.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, 'Review not found');
  res.status(204).json();
});
