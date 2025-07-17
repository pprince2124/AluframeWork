import mongoose from 'mongoose';
const { Schema, model } = mongoose; 

const serviceAgentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  serviceCategory: {
    type: Schema.Types.ObjectId,
    ref: 'serviceCategory_mst',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
  },
}, { collection: 'serviceAgent_mst' });

export const ServiceAgent = mongoose.model('ServiceAgent', serviceAgentSchema);