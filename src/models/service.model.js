// src/models/service.model.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    images: [String], // Cloudinary or local URLs

    // Category & vendor references
    serviceCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'serviceCategory_mst',
      required: true,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'serviceAgent_mst',
      required: true,
    },

    // Whether this service is currently shown to customers
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model('services_mst', serviceSchema);
