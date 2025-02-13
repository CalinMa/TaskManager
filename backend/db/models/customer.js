import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const customerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  twoFactorCode: { type: Number, default: null },
});

customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

export const Customer = mongoose.model("Customer", customerSchema);
