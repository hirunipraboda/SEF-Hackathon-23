import { Route } from '../models/Route.js';
import mongoose from 'mongoose';

export const routeService = {
  async getAllRoutes() {
    if (mongoose.connection.readyState === 1) {
      return await Route.find({ active: true })
        .populate('trainId')
        .populate('originStation')
        .populate('destinationStation')
        .populate('stops.station');
    }
    return [];
  },

  async getRouteById(id) {
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      return await Route.findById(id)
        .populate('trainId')
        .populate('originStation')
        .populate('destinationStation')
        .populate('stops.station');
    }
    return null;
  },
};
