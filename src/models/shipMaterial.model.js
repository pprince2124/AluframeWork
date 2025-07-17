// src/models/shipMaterial.model.js

import mongoose from 'mongoose';

const shipMaterialSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  materialDetails: {
    type: String,
    required: true
  },
  trackingId: String,
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered'],
    default: 'pending'
  },
  shippedAt: Date,
  deliveredAt: Date,
  notifyVendor: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('ShipMaterial', shipMaterialSchema);
