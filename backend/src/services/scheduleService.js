import { Schedule } from '../models/Schedule.js';
import { Station } from '../models/Station.js';
import mongoose from 'mongoose';

export const scheduleService = {
  async getAllSchedules(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      return await Schedule.find(filter)
        .populate('trainId')
        .populate({
          path: 'routeId',
          populate: [
            { path: 'originStation' },
            { path: 'destinationStation' },
            { path: 'stops.station' },
          ],
        })
        .sort({ departureTime: 1 });
    }
    return [];
  },

  async searchSchedules({ from, to, date, trainType, sortBy = 'departureTime' }) {
    if (!from || !to) {
      const err = new Error('Both departure station (from) and destination station (to) are required.');
      err.statusCode = 400;
      throw err;
    }

    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      const err = new Error('Departure and destination stations cannot be the same.');
      err.statusCode = 400;
      throw err;
    }

    if (mongoose.connection.readyState !== 1) {
      return [];
    }

    // Find station IDs matching names or codes
    const originRegex = new RegExp(`^${from.trim()}$`, 'i');
    const destRegex = new RegExp(`^${to.trim()}$`, 'i');

    const [originStation, destStation] = await Promise.all([
      Station.findOne({ $or: [{ name: originRegex }, { code: originRegex }] }),
      Station.findOne({ $or: [{ name: destRegex }, { code: destRegex }] }),
    ]);

    if (!originStation || !destStation) {
      return [];
    }

    // Fetch all schedules with populated routes
    const schedules = await Schedule.find()
      .populate('trainId')
      .populate({
        path: 'routeId',
        populate: [
          { path: 'originStation' },
          { path: 'destinationStation' },
          { path: 'stops.station' },
        ],
      });

    // Filter schedules that connect origin to destination in sequence
    const matchingSchedules = schedules.filter((sch) => {
      const route = sch.routeId;
      if (!route || !sch.trainId) return false;

      // Filter by trainType if provided
      if (trainType && sch.trainId.trainType?.toLowerCase() !== trainType.toLowerCase()) {
        return false;
      }

      // Check direct origin/destination
      const isDirectOrigin = route.originStation?._id?.equals(originStation._id);
      const isDirectDest = route.destinationStation?._id?.equals(destStation._id);
      if (isDirectOrigin && isDirectDest) return true;

      // Check intermediate stops
      const stops = route.stops || [];
      const originIndex = stops.findIndex((s) => s.station?._id?.equals(originStation._id));
      const destIndex = stops.findIndex((s) => s.station?._id?.equals(destStation._id));

      if (originIndex !== -1 && destIndex !== -1 && originIndex < destIndex) {
        return true;
      }

      // Also support origin -> stop or stop -> destination
      if (isDirectOrigin && destIndex !== -1) return true;
      if (originIndex !== -1 && isDirectDest) return true;

      return false;
    });

    // Sort matching schedules
    matchingSchedules.sort((a, b) => {
      if (sortBy === 'departureTime') {
        return (a.departureTime || '').localeCompare(b.departureTime || '');
      }
      return 0;
    });

    return matchingSchedules;
  },
};
