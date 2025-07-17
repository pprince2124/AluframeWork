import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  preferredTime: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedRole: {
    type: String,
    enum: ['vendor', 'admin', 'support'],
    default: null,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  }
}, {
  timestamps: true,
});

export const Consultation = mongoose.model('Consultation', consultationSchema);
