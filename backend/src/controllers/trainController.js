import { trainService } from '../services/trainService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getTrains = async (req, res, next) => {
  try {
    const trains = await trainService.getAllTrains();
    return sendSuccess(res, trains);
  } catch (error) {
    next(error);
  }
};

export const getTrainById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const train = await trainService.getTrainById(id);
    if (!train) {
      return sendError(res, `Train not found with identifier '${id}'`, 404);
    }
    return sendSuccess(res, train);
  } catch (error) {
    next(error);
  }
};
