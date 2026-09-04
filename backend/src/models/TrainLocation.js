import mongoose from 'mongoose';

const trainLocationSchema = new mongoose.Schema(
  {
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number, // km/h
      default: 0,
    },
    status: {
      type: String,
      enum: ['ON_TIME', 'DELAYED', 'STOPPED', 'CANCELLED'],
      default: 'ON_TIME',
    },
    currentStation: {
      type: String,
      default: '',
    },
    nextStation: {
      type: String,
      default: '',
    },
    estimatedArrival: {
      type: String,
      default: '',
    },
    routeProgressPct: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const TrainLocation = mongoose.model('TrainLocation', trainLocationSchema);
