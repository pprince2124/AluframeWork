// src/controllers/shipMaterial.controller.js

import ShipMaterial from '../models/shipMaterial.model.js';
import Booking from '../models/booking.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// ✅ Admin creates the shipment
export const createShipping = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.body.bookingId).populate('vendorId customerId');
  if (!booking) throw new ApiError(404, 'Booking not found');

  const shipping = await ShipMaterial.create({
    bookingId: booking._id,
    customerId: booking.customerId,
    vendorId: booking.vendorId,
    materialDetails: req.body.materialDetails,
    trackingId: req.body.trackingId,
    status: 'shipped',
    shippedAt: new Date(),
    notifyVendor: true // ✅ notify vendor flag
  });

  // Future: trigger notification (email/SMS/FCM/etc.)

  res.status(201).json(new ApiResponse(201, shipping, 'Material shipped to customer'));
});

// ✅ Admin updates status to delivered
export const markAsDelivered = asyncHandler(async (req, res) => {
  const shipping = await ShipMaterial.findById(req.params.id);
  if (!shipping) throw new ApiError(404, 'Shipping record not found');

  shipping.status = 'delivered';
  shipping.deliveredAt = new Date();
  await shipping.save();

  res.json(new ApiResponse(200, shipping, 'Shipping marked as delivered'));
});

// ✅ Vendor gets list of shipped jobs for install
export const vendorInstallations = asyncHandler(async (req, res) => {
  const installations = await ShipMaterial.find({
    vendorId: req.user._id,
    notifyVendor: true,
    status: 'shipped'
  }).populate('bookingId customerId');

  res.json(new ApiResponse(200, installations, 'Pending installations'));
});
