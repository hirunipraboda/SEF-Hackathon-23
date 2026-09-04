import mongoose from 'mongoose';
import { TRAIN_STATUS } from '../utils/constants.js';

const scheduleSchema = new mongoose.Schema(
  {
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: [true, 'Train reference is required'],
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Route reference is required'],
    },
    departureTime: {
      type: String, // e.g. "05:55"
      required: [true, 'Departure time is required'],
    },
    arrivalTime: {
      type: String, // e.g. "09:10"
      required: [true, 'Arrival time is required'],
    },
    operatingDays: {
      type: [String],
      default: ['DAILY'],
    },
    status: {
      type: String,
      enum: Object.values(TRAIN_STATUS),
      default: TRAIN_STATUS.ON_TIME,
    },
  },
  {
    timestamps: true,
  }
);

export const Schedule = mongoose.model('Schedule', scheduleSchema);
