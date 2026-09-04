import { feedbackService } from '../services/feedbackService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getFeedback = async (req, res, next) => {
  try {
    const { trainId, routeId } = req.query;
    const list = await feedbackService.getAllFeedback({ trainId, routeId });
    return sendSuccess(res, list);
  } catch (error) {
    next(error);
  }
};

export const getFeedbackByTrain = async (req, res, next) => {
  try {
    const { trainId } = req.params;
    const list = await feedbackService.getFeedbackByTrain(trainId);
    return sendSuccess(res, list);
  } catch (error) {
    next(error);
  }
};

export const getFeedbackSummary = async (req, res, next) => {
  try {
    const { trainId } = req.params;
    const summary = await feedbackService.getFeedbackSummary(trainId);
    return sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};

export const createFeedback = async (req, res, next) => {
  try {
    const { trainId, routeId, rating, punctualityRating, cleanlinessRating, comfortRating, staffServiceRating, comment } = req.body;
    const created = await feedbackService.createFeedback({
      trainId,
      routeId,
      rating,
      punctualityRating,
      cleanlinessRating,
      comfortRating,
      staffServiceRating,
      comment,
    });
    return sendSuccess(res, created, 201);
  } catch (error) {
    next(error);
  }
};
