// src/controllers/service.controller.js

import Service from '../models/service.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createService = asyncHandler(async (req, res) => {
  const doc = await Service.create({ ...req.body, vendorId: req.user._id });
  res.status(201).json({ success: true, data: doc });
});

export const getServices = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.serviceCategoryId = req.query.category;
  if (req.query.search)
    filter.name = { $regex: req.query.search, $options: 'i' };

  const services = await Service.find(filter).populate('serviceCategoryId', 'name');
  res.json({ success: true, results: services.length, data: services });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id).populate('serviceCategoryId vendorId');
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, data: service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) throw new ApiError(404, 'Service not found');
  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
