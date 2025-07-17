// src/middlewares/upload.js
import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

// Define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categoryImages'); // or uploads/subCategoryImages
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, uuid() + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only JPG, JPEG, PNG allowed'), false);
};

export const upload = multer({ storage, fileFilter });
