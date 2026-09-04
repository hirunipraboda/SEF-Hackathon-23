import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: [true, 'Train reference is required'],
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    punctualityRating: {
      type: Number,
      required: [true, 'Punctuality rating is required'],
      min: [1, 'Punctuality rating must be at least 1'],
      max: [5, 'Punctuality rating cannot be more than 5'],
    },
    cleanlinessRating: {
      type: Number,
      required: [true, 'Cleanliness rating is required'],
      min: [1, 'Cleanliness rating must be at least 1'],
      max: [5, 'Cleanliness rating cannot be more than 5'],
    },
    comfortRating: {
      type: Number,
      required: [true, 'Comfort rating is required'],
      min: [1, 'Comfort rating must be at least 1'],
      max: [5, 'Comfort rating cannot be more than 5'],
    },
    staffServiceRating: {
      type: Number,
      required: [true, 'Staff service rating is required'],
      min: [1, 'Staff service rating must be at least 1'],
      max: [5, 'Staff service rating cannot be more than 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model('Feedback', feedbackSchema);
