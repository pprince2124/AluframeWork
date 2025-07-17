import { Consultation } from '../models/consultation.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';

/* 📥 Create Consultation */
export const createConsultation = asyncHandler(async (req, res) => {
  const { name, phoneNumber, address, preferredTime, notes } = req.body;

  const consultation = await Consultation.create({
    name,
    phoneNumber,
    address,
    preferredTime,
    notes,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, consultation, 'Consultation created'));
});

/* 🔍 Get All Consultations */
export const getAllConsultations = asyncHandler(async (req, res) => {
  let consultations;

  if (req.user.role === 'vendor') {
    consultations = await Consultation.find({ assignedTo: req.user._id });
  } else if (req.user.role === 'admin') {
    consultations = await Consultation.find().populate('assignedTo createdBy');
  } else {
    throw new ApiError(403, 'Unauthorized access');
  }

  res.json(new ApiResponse(200, consultations));
});

/* 🧭 Assign Consultation */
export const assignConsultation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { assignedTo, assignedRole } = req.body;

  const updated = await Consultation.findByIdAndUpdate(
    id,
    { assignedTo, assignedRole, status: 'assigned' },
    { new: true }
  );

  if (!updated) throw new ApiError(404, 'Consultation not found');

  res.json(new ApiResponse(200, updated, 'Consultation assigned'));
});

/* 🔁 Update Status (Vendor/Admin) */
export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const consultation = await Consultation.findById(id);
  if (!consultation) throw new ApiError(404, 'Consultation not found');

  if (
    req.user.role === 'vendor' &&
    consultation.assignedTo?.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to update this consultation');
  }

  consultation.status = status || consultation.status;
  consultation.notes = notes || consultation.notes;

  await consultation.save();

  res.json(new ApiResponse(200, consultation, 'Consultation updated'));
});

/* ❌ Delete Consultation */
export const deleteConsultation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const consultation = await Consultation.findByIdAndDelete(id);
  if (!consultation) {
    throw new ApiError(404, 'Consultation not found');
  }
  res.status(200).json(new ApiResponse(200, consultation, 'Consultation deleted'));
});
