import mongoose from 'mongoose';
import { PAYMENT_STATUS, PAYMENT_METHODS } from '../utils/constants.js';

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Associated booking reference is required'],
      index: true,
    },
    paymentReference: {
      type: String,
      required: [true, 'Payment reference is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'LKR',
      uppercase: true,
    },
    method: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.DEMO_CARD,
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
      index: true,
    },
    transactionReference: {
      type: String,
      required: [true, 'Transaction reference is required'],
    },
    cardLastFour: {
      type: String,
      trim: true,
      default: '4242',
    },
    cardholderName: {
      type: String,
      trim: true,
      default: 'Authorized Commuter',
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model('Payment', paymentSchema);
