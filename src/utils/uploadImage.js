// src/utils/uploadImage.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImage = async (localPath) => {
  try {
    if (!localPath) return null;

    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: 'auto'
    });

    fs.unlinkSync(localPath); // Delete local file after upload

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error.message);
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    return null;
  }
};
