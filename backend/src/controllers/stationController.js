import { stationService } from '../services/stationService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getStations = async (req, res, next) => {
  try {
    const stations = await stationService.getAllStations();
    return sendSuccess(res, stations);
  } catch (error) {
    next(error);
  }
};

export const getStationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const station = await stationService.getStationById(id);
    if (!station) {
      return sendError(res, `Station not found with identifier '${id}'`, 404);
    }
    return sendSuccess(res, station);
  } catch (error) {
    next(error);
  }
};
