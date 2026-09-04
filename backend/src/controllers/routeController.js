import { routeService } from '../services/routeService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getRoutes = async (req, res, next) => {
  try {
    const routes = await routeService.getAllRoutes();
    return sendSuccess(res, routes);
  } catch (error) {
    next(error);
  }
};

export const getRouteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const route = await routeService.getRouteById(id);
    if (!route) {
      return sendError(res, `Route not found with ID '${id}'`, 404);
    }
    return sendSuccess(res, route);
  } catch (error) {
    next(error);
  }
};
