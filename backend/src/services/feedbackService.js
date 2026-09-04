import { Feedback } from '../models/Feedback.js';
import { Train } from '../models/Train.js';
import mongoose from 'mongoose';

const validateRating = (val, name) => {
  const num = Number(val);
  if (!Number.isInteger(num) || num < 1 || num > 5) {
    const err = new Error(`${name} must be an integer between 1 and 5.`);
    err.statusCode = 400;
    throw err;
  }
  return num;
};

export const feedbackService = {
  async getAllFeedback(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (filter.trainId && mongoose.isValidObjectId(filter.trainId)) {
        query.trainId = filter.trainId;
      }
      if (filter.routeId && mongoose.isValidObjectId(filter.routeId)) {
        query.routeId = filter.routeId;
      }
      return await Feedback.find(query)
        .populate('trainId')
        .populate('routeId')
        .sort({ createdAt: -1 });
    }
    return [];
  },

  async getFeedbackByTrain(trainId) {
    if (mongoose.connection.readyState !== 1) {
      return [];
    }
    let train = null;
    if (mongoose.isValidObjectId(trainId)) {
      train = await Train.findById(trainId);
    }
    if (!train) {
      train = await Train.findOne({ trainNumber: trainId });
    }
    const queryId = train ? train._id : trainId;

    return await Feedback.find({ trainId: queryId })
      .populate('trainId')
      .populate('routeId')
      .sort({ createdAt: -1 });
  },

  async getFeedbackSummary(trainId) {
    if (mongoose.connection.readyState !== 1) {
      return {
        trainId,
        totalReviews: 0,
        averageRating: 0,
        punctualityRating: 0,
        cleanlinessRating: 0,
        comfortRating: 0,
        staffServiceRating: 0,
      };
    }

    let resolvedTrainId = trainId;
    if (!mongoose.isValidObjectId(trainId)) {
      const train = await Train.findOne({ trainNumber: trainId });
      if (train) resolvedTrainId = train._id;
    }

    const objectId = new mongoose.Types.ObjectId(resolvedTrainId);

    const stats = await Feedback.aggregate([
      { $match: { trainId: objectId } },
      {
        $group: {
          _id: '$trainId',
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          punctualityRating: { $avg: '$punctualityRating' },
          cleanlinessRating: { $avg: '$cleanlinessRating' },
          comfortRating: { $avg: '$comfortRating' },
          staffServiceRating: { $avg: '$staffServiceRating' },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        trainId: resolvedTrainId,
        totalReviews: 0,
        averageRating: 0,
        punctualityRating: 0,
        cleanlinessRating: 0,
        comfortRating: 0,
        staffServiceRating: 0,
      };
    }

    const s = stats[0];
    return {
      trainId: s._id,
      totalReviews: s.totalReviews,
      averageRating: Number(s.averageRating.toFixed(1)),
      punctualityRating: Number(s.punctualityRating.toFixed(1)),
      cleanlinessRating: Number(s.cleanlinessRating.toFixed(1)),
      comfortRating: Number(s.comfortRating.toFixed(1)),
      staffServiceRating: Number(s.staffServiceRating.toFixed(1)),
    };
  },

  async createFeedback({ trainId, routeId, rating, punctualityRating, cleanlinessRating, comfortRating, staffServiceRating, comment }) {
    if (!trainId) {
      const err = new Error('Train ID is required to submit feedback.');
      err.statusCode = 400;
      throw err;
    }

    const validRating = validateRating(rating, 'Overall rating');
    const validPunctuality = validateRating(punctualityRating, 'Punctuality rating');
    const validCleanliness = validateRating(cleanlinessRating, 'Cleanliness rating');
    const validComfort = validateRating(comfortRating, 'Comfort rating');
    const validStaffService = validateRating(staffServiceRating, 'Staff service rating');

    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected. Cannot submit feedback.');
      err.statusCode = 503;
      throw err;
    }

    let resolvedTrainId = trainId;
    if (!mongoose.isValidObjectId(trainId)) {
      const train = await Train.findOne({ trainNumber: trainId });
      if (train) {
        resolvedTrainId = train._id;
      } else {
        const firstTrain = await Train.findOne();
        if (firstTrain) resolvedTrainId = firstTrain._id;
      }
    }

    const feedback = new Feedback({
      trainId: resolvedTrainId,
      routeId: (routeId && mongoose.isValidObjectId(routeId)) ? routeId : null,
      rating: validRating,
      punctualityRating: validPunctuality,
      cleanlinessRating: validCleanliness,
      comfortRating: validComfort,
      staffServiceRating: validStaffService,
      comment: (comment || '').trim(),
    });

    const saved = await feedback.save();
    return await Feedback.findById(saved._id).populate('trainId');
  },
};
