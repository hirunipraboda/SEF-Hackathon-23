import mongoose from 'mongoose';
import { TRAIN_TYPES, TRAIN_STATUS } from '../utils/constants.js';

const trainSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: [true, 'Train number is required'],
      unique: true,
      trim: true,
    },
    trainName: {
      type: String,
      required: [true, 'Train name is required'],
      trim: true,
    },
    trainType: {
      type: String,
      required: [true, 'Train type is required'],
      enum: {
        values: TRAIN_TYPES,
        message: '{VALUE} is not a valid train type',
      },
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TRAIN_STATUS),
        message: '{VALUE} is not a valid train status',
      },
      default: TRAIN_STATUS.ON_TIME,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Train = mongoose.model('Train', trainSchema);
