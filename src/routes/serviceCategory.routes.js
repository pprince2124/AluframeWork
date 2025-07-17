// src/routes/serviceCategory.routes.js
import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/serviceCategory.controller.js';

import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

router.route('/')
  .get(getAllCategories)
  .post(singleUpload, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(singleUpload, updateCategory)
  .delete(deleteCategory);

export default router;
