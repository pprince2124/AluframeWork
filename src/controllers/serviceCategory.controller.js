// src/controllers/serviceCategory.controller.js

import { ServiceCategory } from '../models/serviceCategory.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import { uploadImage } from '../utils/uploadImage.js';

/* 📤 Create New Category */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, 'Name and description are required');
  }

  const localFilePath = req.file?.path;
  const imageUrl = await uploadImage(localFilePath);

  if (!imageUrl) {
    throw new ApiError(500, 'Image upload failed');
  }

  const category = await ServiceCategory.create({
    name,
    description,
    image: imageUrl,
  });

  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

/* 📖 Get All Categories */
export const getAllCategories = asyncHandler(async (req, res) => {
  const { activeOnly } = req.query;
  const filter = activeOnly === 'true' ? { isActive: true } : {};
  const categories = await ServiceCategory.find(filter);
  res.json(new ApiResponse(200, categories));
});

/* 🔍 Get Single Category By ID */
export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await ServiceCategory.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res.json(new ApiResponse(200, category));
});

/* ✏️ Update Category */
export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (description) updates.description = description;
  if (typeof isActive !== 'undefined') updates.isActive = isActive;

  // If new image uploaded
  if (req.file) {
    const localFilePath = req.file.path;
    const imageUrl = await uploadImage(localFilePath);
    if (imageUrl) updates.image = imageUrl;
  }

  const updated = await ServiceCategory.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, 'Category not found');
  }

  res.json(new ApiResponse(200, updated, 'Category updated successfully'));
});

/* ❌ Delete Category */
export const deleteCategory = asyncHandler(async (req, res) => {
  const deleted = await ServiceCategory.findByIdAndDelete(req.params.id);

  if (!deleted) {
    throw new ApiError(404, 'Category not found');
  }

  res.status(204).json(new ApiResponse(204, null, 'Category deleted'));
});
