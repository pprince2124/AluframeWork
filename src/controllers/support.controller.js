// src/controllers/support.controller.js
import { Support } from '../models/support.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

/* 📩 Create Support Ticket */
export const createSupportTicket = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, 'All fields are required');
  }

  const ticket = await Support.create({ name, email, subject, message });

  res.status(201).json(new ApiResponse(201, ticket, 'Support ticket submitted'));
});

/* 🔍 Get All Tickets (Admin only) */
export const getAllSupportTickets = asyncHandler(async (req, res) => {
  const tickets = await Support.find().sort({ createdAt: -1 });
  res.json(new ApiResponse(200, tickets));
});

/* ✅ Mark Ticket as Resolved */
export const updateSupportStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatus = ['open', 'resolved', 'pending'];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const updatedTicket = await Support.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!updatedTicket) throw new ApiError(404, 'Ticket not found');

  res.json(new ApiResponse(200, updatedTicket, 'Ticket status updated'));
});

