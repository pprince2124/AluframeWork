// src/controllers/subCategory.controller.js
import { SubCategory } from '../models/subCategory.model.js';
import { uploadImage } from '../utils/uploadImage.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';

/* 📤 Create */
export const createSubCategory = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;

  if (!name || !description || !category) {
    throw new ApiError(400, 'All fields are required');
  }

  const localFilePath = req.file?.path;
  const imageUrl = await uploadImage(localFilePath);
  if (!imageUrl) throw new ApiError(500, 'Image upload failed');

  const subCategory = await SubCategory.create({
    name,
    description,
    image: imageUrl,
    category
  });

  res.status(201).json(new ApiResponse(201, subCategory, 'SubCategory created'));
});

/* 📖 Get All */
export const getAllSubCategories = asyncHandler(async (req, res) => {
  const { activeOnly } = req.query;
  const filter = activeOnly === 'true' ? { isActive: true } : {};

  const subCategories = await SubCategory.find(filter).populate('category');
  res.json(new ApiResponse(200, subCategories));
});

/* 🔍 Get One */
export const getSubCategoryById = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id).populate('category');
  if (!subCategory) throw new ApiError(404, 'SubCategory not found');
  res.json(new ApiResponse(200, subCategory));
});

/* ✏️ Update */
export const updateSubCategory = asyncHandler(async (req, res) => {
  const { name, description, isActive, category } = req.body;
  const updates = { name, description, isActive, category };

  if (req.file) {
    const localFilePath = req.file.path;
    const imageUrl = await uploadImage(localFilePath);
    if (imageUrl) updates.image = imageUrl;
  }

  const updated = await SubCategory.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  if (!updated) throw new ApiError(404, 'SubCategory not found');
  res.json(new ApiResponse(200, updated, 'SubCategory updated'));
});

/* ❌ Delete */
export const deleteSubCategory = asyncHandler(async (req, res) => {
  const deleted = await SubCategory.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, 'SubCategory not found');
  res.status(204).json(new ApiResponse(204, null, 'SubCategory deleted'));
});
