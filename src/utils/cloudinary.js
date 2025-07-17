// src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (filePath) => {
  try {
    if (!filePath) return null;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });

    // Remove local file after upload
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // cleanup
    return null;
  }
};
