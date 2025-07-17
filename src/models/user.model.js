// src/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';      
import jwt from 'jsonwebtoken';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^(?:[^@\s]+)@(?:[^@\s]+\.)+[^@\s]+$/,
    },

   phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}$/
    },

    password: {
      type: String,
      required: true,
      select: false,           // don’t expose hash by default
    },

    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      default: 'customer',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    address: {
      line1:   String,
      line2:   String,
      city:    String,
      state:   String,
      pincode: String,
    },

    image: String,             // avatar URL
    passwordChangedAt: Date,
  },
  { collection: 'user_mst', timestamps: true }
);

/* ------------------------------------------------------------------
   Middle‑wares
-------------------------------------------------------------------*/

// Hash password on create & when updated
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const rounds = parseInt(process.env.BCRYPT_SALT, 10) || 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

/* ------------------------------------------------------------------
   Instance helpers
-------------------------------------------------------------------*/

// Compare raw password to hashed
userSchema.methods.comparePassword = async function (candidatePw) {
  return await bcrypt.compare(candidatePw, this.password);
};

// Issue signed JWT
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};
userSchema.methods.generaterefreshjwt = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    process.env.refreshjwt_SECRET,
    { expiresIn: process.env.refreshjwt_EXPIRES_IN || '7d' }
  );
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (tokenIat) {
  if (this.passwordChangedAt) {
    const changed = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return tokenIat < changed;
  }
  return false;
};

export default model('user_mst', userSchema);
