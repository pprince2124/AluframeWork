// src/controllers/booking.controller.js
import Booking     from '../models/booking.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError     from '../utils/apiError.js';

/* ───────────────────────  STATE‑MACHINE GUARD  ───────────────────────── */
const allowedTransition = (current, next, actorRole) => {
  const map = {
    pending_consult:     { provider: ['vendor_quoted'], user: ['cancelled'] },
    vendor_quoted:       { admin:   ['quoted', 'rejected'] },
    quoted:              { user:    ['confirmed', 'rejected'] },
    confirmed:           { admin:   ['material_shipped'], user: ['cancelled'] },
    material_shipped:    { admin:   ['material_delivered'] },
    material_delivered:  { provider:['material_received'] },
    material_received:   { provider:['installation_done'] },
    installation_done:   { admin:   ['closed'] },
    closed:              {},
    cancelled:           {},
    rejected:            {}
  };
  if (actorRole === 'admin') return true;
  return map[current]?.[actorRole]?.includes(next) ?? false;
};

/* ──────────────────────────  CORE CRUD  ──────────────────────────────── */
export const createBooking = asyncHandler(async (req, res) => {
  const {
    serviceId, serviceProviderId, serviceCategoryId,
    jobType, finishing, materialGrade, date, timeSlot, siteAddress
  } = req.body;

  if (!serviceId || !serviceProviderId || !serviceCategoryId ||
      !jobType || !date || !timeSlot || !siteAddress) {
    throw new ApiError(400, 'Missing required fields');
  }

  const bookingDoc = await Booking.create({
    customerId: req.user._id,
    serviceProviderId,
    serviceId,
    serviceCategoryId,
    jobType,
    finishing,
    materialGrade,
    date,
    timeSlot,
    siteAddress,
    customerName:  req.user.name,
    customerEmail: req.user.email,
    customerPhone: req.user.phone,
    status: 'pending_consult'
  });

  res.status(201).json({ success: true, data: bookingDoc });
});

export const createRepairConsult = asyncHandler(async (req, res) => {
  const {
    serviceId, serviceProviderId, serviceCategoryId,
    date, timeSlot, siteAddress, issueDescription
  } = req.body;

  if (!serviceId || !serviceProviderId || !serviceCategoryId ||
      !date || !timeSlot || !siteAddress) {
    throw new ApiError(400, 'Missing required fields for repair consult');
  }

  const bookingDoc = await Booking.create({
    customerId: req.user._id,
    serviceProviderId,
    serviceId,
    serviceCategoryId,
    jobType: 'repair_consult',
    date,
    timeSlot,
    siteAddress,
    internalNotes: issueDescription,
    customerName:  req.user.name,
    customerEmail: req.user.email,
    customerPhone: req.user.phone,
    status: 'pending_consult'
  });

  res.status(201).json({ success: true, data: bookingDoc });
});

export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('serviceId')
    .populate('serviceProviderId', 'name email phone')
    .populate('serviceCategoryId', 'name')
    .populate('customerId', 'name email');

  if (!booking) throw new ApiError(404, 'Booking not found');

  const isOwner =
    [booking.customerId.toString(), booking.serviceProviderId.toString()]
      .includes(req.user.id);

  if (!isOwner && req.user.role !== 'admin')
    throw new ApiError(403, 'Forbidden');

  res.json({ success: true, data: booking });
});

export const getBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.user.role === 'user')   filter.customerId       = req.user._id;
  if (req.user.role === 'vendor') filter.serviceProviderId = req.user._id;

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate('serviceId');

  res.json({ success: true, results: bookings.length, data: bookings });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  let actorRole = 'user';
  if (req.user.role === 'admin') actorRole = 'admin';
  else if (booking.serviceProviderId.toString() === req.user.id) actorRole = 'provider';
  else if (booking.customerId.toString() !== req.user.id) throw new ApiError(403, 'Forbidden');

  if (!allowedTransition(booking.status, status, actorRole))
    throw new ApiError(422, 'Invalid status transition');

  if (status === 'cancelled')
    booking.isCanceledBy = actorRole === 'provider' ? 'vendor' : 'customer';

  booking.status = status;
  await booking.save();
  res.json({ success: true, data: booking });
});

/* ──────────────────  WORKFLOW‑SPECIFIC ACTIONS  ───────────────────────── */
export const submitVendorQuote = asyncHandler(async (req, res) => {
  const { price, details } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.serviceProviderId.toString() !== req.user.id)
    throw new ApiError(403, 'Forbidden');

  if (!allowedTransition(booking.status, 'vendor_quoted', 'provider'))
    throw new ApiError(422, 'Cannot submit quote now');

  booking.vendorQuote = { price, details, date: new Date() };
  booking.status = 'vendor_quoted';
  await booking.save();
  res.json({ success: true, data: booking });
});

export const submitFinalQuote = asyncHandler(async (req, res) => {
  const { price, details } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (!allowedTransition(booking.status, 'quoted', 'admin'))
    throw new ApiError(422, 'Cannot finalise quote now');

  booking.finalQuote = { price, details, date: new Date() };
  booking.status = 'quoted';
  await booking.save();
  res.json({ success: true, data: booking });
});

export const shipMaterial = asyncHandler(async (req, res) => {
  const { carrier, trackingNumber, eta } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (!allowedTransition(booking.status, 'material_shipped', 'admin'))
    throw new ApiError(422, 'Cannot ship materials now');

  booking.shippingInfo = { carrier, trackingNumber, eta };
  booking.status = 'material_shipped';
  await booking.save();
  res.json({ success: true, data: booking });
});

export const markDelivered = asyncHandler(async (_req, res) => {
  const booking = await Booking.findById(res.req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (!allowedTransition(booking.status, 'material_delivered', 'admin'))
    throw new ApiError(422, 'Cannot mark delivered');

  booking.status = 'material_delivered';
  await booking.save();
  res.json({ success: true, data: booking });
});

export const ackMaterialReceived = asyncHandler(async (_req, res) => {
  const booking = await Booking.findById(res.req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.serviceProviderId.toString() !== res.req.user.id)
    throw new ApiError(403, 'Forbidden');

  if (!allowedTransition(booking.status, 'material_received', 'provider'))
    throw new ApiError(422, 'Cannot acknowledge now');

  booking.ack.materialReceivedAt = new Date();
  booking.status = 'material_received';
  await booking.save();
  res.json({ success: true, data: booking });
});

export const markInstallationComplete = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  if (booking.serviceProviderId.toString() !== req.user.id)
    throw new ApiError(403, 'Forbidden');

  if (!allowedTransition(booking.status, 'installation_done', 'provider'))
    throw new ApiError(422, 'Cannot mark installation done now');

  booking.ack.installationDoneAt = new Date();
  booking.payment.remainingPaid = true;
  booking.payment.method = paymentMethod || 'cash';
  booking.status = 'installation_done';
  await booking.save();
  res.json({ success: true, data: booking });
});

export const closeBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (!allowedTransition(booking.status, 'closed', 'admin'))
    throw new ApiError(422, 'Cannot close booking now');

  booking.payment.paidAt = new Date();
  booking.status = 'closed';
  await booking.save();
  res.json({ success: true, data: booking });
});

/* ─────────────────────────  EXPORT‑BUNDLE  ────────────────────────────── */
export default {
  createBooking,
  createRepairConsult,
  getBooking,
  getBookings,
  updateStatus,
  submitVendorQuote,
  submitFinalQuote,
  shipMaterial,
  markDelivered,
  ackMaterialReceived,
  markInstallationComplete,
  closeBooking
};
