import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema({
  serviceId:       { type: Schema.Types.ObjectId, ref: 'services_mst', required: true },
  vendorId:        { type: Schema.Types.ObjectId, ref: 'serviceAgent_mst' },
  qty:             { type: Number, default: 1, min: 1 },
  jobType:         { type: String, enum: ['window','door','partition','cabinates','custom'], required: true },
  finish:          { type: String },
  materialGrade:   { type: String, enum: ['6061','6063','7005','custom'], default: '6063' },
  provisionalDate: { type: Date },
  provisionalSlot: { type: String },
  notes:           { type: String },
}, { _id: false });

const cartSchema = new Schema({
  user:  { type: Schema.Types.ObjectId, ref: 'user_mst', required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
}, { timestamps: true, collection: 'cart' });

cartSchema.methods.addItem = async function (item) {
  const existing = this.items.find(i =>
    i.serviceId.equals(item.serviceId) &&
    String(i.vendorId || '') === String(item.vendorId || '') &&
    i.jobType === item.jobType &&
    i.finish === item.finish &&
    i.materialGrade === item.materialGrade &&
    i.provisionalDate?.toISOString() === item.provisionalDate?.toISOString() &&
    i.provisionalSlot === item.provisionalSlot
  );

  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    this.items.push({ ...item, qty: item.qty || 1 });
  }

  return this.save();
};

cartSchema.methods.clearCart = async function () {
  this.items = [];
  return this.save();
};

cartSchema.methods.removeItem = async function (serviceId) {
  this.items = this.items.filter(i => !i.serviceId.equals(serviceId));
  return this.save();
};

export const Cart = mongoose.model('Cart', cartSchema);
