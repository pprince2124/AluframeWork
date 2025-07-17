import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    /* ───────────────────────────  RELATIONSHIPS  ─────────────────────────── */
    customerId:        { type: Schema.Types.ObjectId, ref: 'user_mst',           required: true },
    serviceProviderId: { type: Schema.Types.ObjectId, ref: 'serviceAgent_mst',   required: true },
    serviceId:         { type: Schema.Types.ObjectId, ref: 'services_mst',       required: true },
    serviceCategoryId: { type: Schema.Types.ObjectId, ref: 'serviceCategory_mst',required: true },

    /* ───────────────────────────  BASIC JOB INFO  ─────────────────────────── */
    jobType: {
      type: String,
      enum: ['window','door','partition','cabinates','custom','repair_consult'],
      required: true
    },
    experience: { type: Number, min: 0 },
    rating:     { type: Number, min: 0, max: 5, default: 0 },
    finishing:  String,
    materialGrade: {
      type: String,
      enum: ['6061','6063','7005','custom'],
      default: '6063'
    },

    /* ───────────────────────────  SCHEDULING  ─────────────────────────────── */
    date:     { type: Date,   required: true },
    timeSlot: { type: String, required: true },

    /* ───────────────────  QUOTATION & SHIPPING PIPELINE  ──────────────────── */
    vendorQuote: {
      price:   Number,
      details: String,
      date:    Date
    },
    finalQuote: {
      price:   Number,
      details: String,
      date:    Date
    },
    shippingInfo: {
      carrier:        String,
      trackingNumber: String,
      eta:            Date
    },
    ack: {
      materialReceivedAt:   Date,
      installationDoneAt:   Date
    },

    /* ─────────────────────────  PAYMENT SNAPSHOT  ─────────────────────────── */
    payment: {
      remainingPaid: { type: Boolean, default: false },
      paidAt:        Date,
      method:        String
    },

    /* ────────────────────  STATUS & CANCELLATION FLOW  ────────────────────── */
    status: {
      type: String,
      enum: [
        'pending_consult',
        'vendor_quoted',
        'quoted',
        'confirmed',
        'material_shipped',
        'material_delivered',
        'material_received',
        'installation_done',
        'closed',
        'cancelled',
        'rejected'
      ],
      default: 'pending_consult',
      required: true
    },
    isCanceledBy: { type: String, enum: ['customer','vendor'] },

    /* ────────────────────  CUSTOMER SNAPSHOT & ADDRESS  ───────────────────── */
    customerName:  { type: String, required: true },
    customerEmail: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
    customerPhone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
    siteAddress: {
      line1:   { type: String, required: true },
      line2:   String,
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true }
    },

    /* ────────────────────────  ADMIN / AUDIT  ─────────────────────────────── */
    approvedBy:   { type: Schema.Types.ObjectId, ref: 'admin_users' },
    lastEditedBy: { type: Schema.Types.ObjectId, ref: 'admin_users' },
    internalNotes: String,
    isArchived:   { type: Boolean, default: false, select: false }
  },
  { timestamps: true }
);

/* ----- Guard: require vendor or admin to set price before shipping -------- */
bookingSchema.pre('save', function (next) {
  const priceNeeded = ['quoted','confirmed','material_shipped','material_delivered',
                       'material_received','installation_done','closed'].includes(this.status);
  if (priceNeeded && (!this.finalQuote?.price || this.finalQuote.price <= 0)) {
    return next(new Error('finalQuote.price must be set before proceeding past quoted.'));
  }
  next();
});

/* -----------------------------  INDEXES  ----------------------------------- */
bookingSchema.index({ serviceProviderId: 1, date: 1 });
bookingSchema.index({ serviceProviderId: 1, date: 1, timeSlot: 1 }, { unique: true });
bookingSchema.index({ 'shippingInfo.trackingNumber': 1 });

export default model('booking', bookingSchema);
