// src/models/support.model.js
import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['open', 'resolved', 'pending'],
      default: 'open',
    },
  },
  { timestamps: true }
);

export const Support = mongoose.model('Support', supportSchema);
