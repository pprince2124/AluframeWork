import Quote from '../models/quote.model.js';
import Booking from '../models/booking.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// Create vendor quote
export const createVendorQuote = asyncHandler(async (req, res) => {
  const { quoteAmount, description } = req.body;
  const { bookingId } = req.params;
  const vendorId = req.user._id;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');

  const newQuote = await Quote.create({
    booking: bookingId,
    vendor: vendorId,
    customer: booking.customer,
    quoteAmount,
    description
  });

  res.status(201).json({ success: true, data: newQuote });
});

// Submit final quote
export const submitFinalQuote = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { quoteAmount, description } = req.body;
  const vendorId = req.user._id;

  const quote = await Quote.findOne({ booking: bookingId, vendor: vendorId });
  if (!quote) throw new Error('Quote not found');

  quote.quoteAmount = quoteAmount;
  quote.description = description;
  quote.status = 'final';

  await quote.save();

  res.status(200).json({ success: true, data: quote });
});

// Get all quotes for a user
export const getUserQuotes = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const quotes = await Quote.find({ customer: userId }).populate('booking');

  res.status(200).json({ success: true, data: quotes });
});

// Admin: get all quotes
export const getAllQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find().populate('vendor customer booking');

  res.status(200).json({ success: true, data: quotes });
});

// Accept Quote
export const acceptQuote = asyncHandler(async (req, res) => {
  const { quoteId } = req.params;

  const quote = await Quote.findById(quoteId);
  if (!quote) throw new Error('Quote not found');

  quote.status = 'accepted';
  await quote.save();

  res.status(200).json({ success: true, message: 'Quote accepted', data: quote });
});

// Reject Quote
export const rejectQuote = asyncHandler(async (req, res) => {
  const { quoteId } = req.params;

  const quote = await Quote.findById(quoteId);
  if (!quote) throw new Error('Quote not found');

  quote.status = 'rejected';
  await quote.save();

  res.status(200).json({ success: true, message: 'Quote rejected', data: quote });
});
