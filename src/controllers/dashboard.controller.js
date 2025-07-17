import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';
import {Consultation} from '../models/consultation.model.js';
import Quote from '../models/quote.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';

export const getAdminDashboard = asyncHandler(async (req, res) => {
  // Total counts
  const [userCount, vendorCount, bookingCount, consultationCount, quoteCount] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'vendor' }),
    Booking.countDocuments(),
    Consultation.countDocuments(),
    Quote.countDocuments(),
  ]);

  // Recent activity
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
  const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5).populate('customer');
  const recentConsultations = await Consultation.find().sort({ createdAt: -1 }).limit(5).populate('createdBy');

  // Optional status summary
  const bookingStatusSummary = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const quoteStatusSummary = await Quote.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.json(new ApiResponse(200, {
    stats: {
      users: userCount,
      vendors: vendorCount,
      bookings: bookingCount,
      consultations: consultationCount,
      quotes: quoteCount,
    },
    recent: {
      users: recentUsers,
      bookings: recentBookings,
      consultations: recentConsultations,
    },
    summaries: {
      bookingsByStatus: bookingStatusSummary,
      quotesByStatus: quoteStatusSummary
    }
  }));
});
