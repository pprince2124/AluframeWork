// src/routes/subCategory.routes.js
import express from 'express';
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
} from '../controllers/subCategory.controller.js';

import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.route('/')
  .get(getAllSubCategories)
  .post(singleUpload, createSubCategory);

router.route('/:id')
  .get(getSubCategoryById)
  .put(singleUpload, updateSubCategory)
  .delete(deleteSubCategory);

export default router;

