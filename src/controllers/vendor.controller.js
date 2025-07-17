import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ServiceAgent } from '../models/serviceAgentModel.js';
import Booking from '../models/booking.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/* ---------------- REGISTER VENDOR ---------------- */
export const registerVendor = asyncHandler(async (req, res) => {
  const { name, userName, password, serviceCategory } = req.body;

  // prevent duplicate username
  const exists = await ServiceAgent.findOne({ userName });
  if (exists) throw new ApiError(409, 'Username already taken');

  const hashed = await bcrypt.hash(password, 12);

  const vendor = await ServiceAgent.create({
    name,
    userName,
    password: hashed,
    serviceCategory,
  });

  res.status(201).json({ success: true, data: vendor });
});

/* ---------------- LOGIN VENDOR ---------------- */
export const loginVendor = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  const vendor = await ServiceAgent.findOne({ userName }).select('+password');
  if (!vendor) throw new ApiError(401, 'Invalid credentials');

  const match = await bcrypt.compare(password, vendor.password);
  if (!match) throw new ApiError(401, 'Invalid credentials');

  const token = jwt.sign({ id: vendor._id, role: 'vendor' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d' ,
  });

  res.json({ success: true, token });
});

/* ---------------- GET OWN PROFILE ---------------- */
export const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await ServiceAgent.findById(req.user._id).populate('serviceCategory', 'name');
  res.json({ success: true, data: vendor });
});

/* ---------------- UPDATE PROFILE ---------------- */
export const updateVendor = asyncHandler(async (req, res) => {
  const allowed = ['name', 'isAvailable', 'image']; // restrict fields
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );

  const vendor = await ServiceAgent.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json({ success: true, data: vendor });
});

/* ---------------- VENDOR BOOKINGS ---------------- */
export const getVendorBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ serviceProviderId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('serviceId', 'name');

  res.json({ success: true, results: bookings.length, data: bookings });
});
