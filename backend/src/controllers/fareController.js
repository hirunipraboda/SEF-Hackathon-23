import { fareService } from '../services/fareService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getFares = async (req, res, next) => {
  try {
    const fares = await fareService.getAllFares();
    return sendSuccess(res, fares);
  } catch (error) {
    next(error);
  }
};

export const calculateFare = async (req, res, next) => {
  try {
    const { origin, destination, passengerType, trainClass, passengers } = req.body;
    const result = await fareService.calculateFare({
      origin,
      destination,
      passengerType,
      trainClass,
      passengers,
    });
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
