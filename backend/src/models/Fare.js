import mongoose from 'mongoose';
import { TRAIN_CLASSES, PASSENGER_TYPES } from '../utils/constants.js';

const fareSchema = new mongoose.Schema(
  {
    originStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Origin station reference is required'],
    },
    destinationStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Destination station reference is required'],
    },
    trainClass: {
      type: String,
      enum: Object.values(TRAIN_CLASSES),
      required: [true, 'Train class is required'],
    },
    passengerType: {
      type: String,
      enum: Object.values(PASSENGER_TYPES),
      default: PASSENGER_TYPES.ADULT,
      required: [true, 'Passenger type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Fare amount is required'],
      min: [0, 'Amount must be a positive number'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness for a given pair, class and passenger type
fareSchema.index(
  { originStation: 1, destinationStation: 1, trainClass: 1, passengerType: 1 },
  { unique: true }
);

export const Fare = mongoose.model('Fare', fareSchema);
