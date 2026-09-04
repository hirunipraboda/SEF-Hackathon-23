import { trackingSimulationService } from '../services/trackingSimulationService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getTrackedTrains = async (req, res, next) => {
  try {
    const trains = trackingSimulationService.getTrackedTrains();
    return sendSuccess(res, trains, 200, {
      total: trains.length,
      mode: 'SIMULATED_LIVE',
    });
  } catch (error) {
    next(error);
  }
};

export const getTrainTracking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trackingData = trackingSimulationService.getTrainTracking(id);
    if (!trackingData) {
      return sendError(res, `Live tracking data not available for train identifier '${id}'`, 404);
    }
    return sendSuccess(res, trackingData);
  } catch (error) {
    next(error);
  }
};

export const getTrackingRoutes = async (req, res, next) => {
  try {
    const routes = trackingSimulationService.getTrackingRoutes();
    return sendSuccess(res, routes);
  } catch (error) {
    next(error);
  }
};

export const getTrackingStations = async (req, res, next) => {
  try {
    const stations = trackingSimulationService.getTrackingStations();
    return sendSuccess(res, stations);
  } catch (error) {
    next(error);
  }
};

export const getTrackingStatus = async (req, res, next) => {
  try {
    const status = trackingSimulationService.getTrackingStatus();
    return sendSuccess(res, status);
  } catch (error) {
    next(error);
  }
};
