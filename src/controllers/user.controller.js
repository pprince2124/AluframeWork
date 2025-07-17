// src/controllers/user.controller.js
import User from '../models/user.model.js';
import Booking from '../models/booking.model.js';

import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/* ---------- Register ---------- */
export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, { token: user.generateJWT(), user }, 'User registered'));
});

/* ---------- Login (phone) ---------- */
export const login = asyncHandler(async (req, res, next) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    return next(new ApiError(401, 'Invalid phone or password'));

  res.json(new ApiResponse(200, { token: user.generateJWT(), user }, 'Login successful'));
});

/* ---------- Get / Update / Delete ---------- */
export const getMe      = asyncHandler((req, res) => res.json(new ApiResponse(200, req.user)));
export const updateUser = asyncHandler(async (req, res, next) => {
  if (req.body.password) delete req.body.password;
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true,
  });
  if (!updated) return next(new ApiError(404, 'User not found'));
  res.json(new ApiResponse(200, updated, 'Profile updated'));
});
// Delete user (admin only)
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new ApiError(404, 'User not found'));
  res.status(204).json();
});


/* ---------- Lists ---------- */
export const listUsers  = asyncHandler(async (_req, res) =>
  res.json(new ApiResponse(200, await User.find())));
export const myBookings = asyncHandler(async (req, res) =>
  res.json(new ApiResponse(200, await Booking.find({ customerId: req.user._id }))));
