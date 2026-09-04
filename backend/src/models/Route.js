import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema(
  {
    station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
    stopOrder: {
      type: Number,
      required: true,
    },
    arrivalTime: {
      type: String, // format "HH:mm"
      default: '',
    },
    departureTime: {
      type: String, // format "HH:mm"
      default: '',
    },
    distanceFromOrigin: {
      type: Number, // in kilometers
      default: 0,
    },
  },
  { _id: false }
);

const routeSchema = new mongoose.Schema(
  {
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: [true, 'Train reference is required'],
    },
    originStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Origin station is required'],
    },
    destinationStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Destination station is required'],
    },
    stops: [stopSchema],
    duration: {
      type: String, // e.g. "3h 15m" or in minutes
      required: [true, 'Duration is required'],
    },
    distance: {
      type: Number, // in kilometers
      required: [true, 'Distance is required'],
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

export const Route = mongoose.model('Route', routeSchema);
