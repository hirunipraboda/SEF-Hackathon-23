import { Station } from '../models/Station.js';
import { sampleStations } from '../seed/seedData.js';
import mongoose from 'mongoose';

export const stationService = {
  async getAllStations() {
    if (mongoose.connection.readyState === 1) {
      const stations = await Station.find({ active: true }).sort({ name: 1 });
      if (stations.length > 0) return stations;
    }
    // Fallback if DB is not populated yet
    return sampleStations.map((s, idx) => ({ ...s, _id: `mock-station-${idx + 1}` }));
  },

  async getStationById(id) {
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      return await Station.findById(id);
    }
    const all = await this.getAllStations();
    return all.find((s) => s._id?.toString() === id || s.name.toLowerCase() === id.toLowerCase() || s.code.toLowerCase() === id.toLowerCase());
  },
};
